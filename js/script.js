$(document).ready(function () {
  // All the computation here
  $("input, select").change(function () {
    if (
      $(".capital").first().val() != "" &&
      $(".risk").first().val() != "" &&
      $(".entry").first().val() != "" &&
      $(".stoploss").first().val() != "" &&

      $(".capital").first().val() > 0 &&
      $(".risk").first().val()  > 0  &&
      $(".entry").first().val()  > 0 &&
      $(".stoploss").first().val()  > 0
    ) {
      const capital = $(".capital").first().val();
      const risk = $(".risk").first().val();
      const entry = parseFloat($(".entry").first().val());
      const stoploss = parseFloat($(".stoploss").first().val());
      if (entry == stoploss) {
        document.getElementById("position-size").textContent = 0;
        document.getElementById("position-value").textContent = 0;
        document.getElementById("equity-risk").textContent = 0;
        document.getElementById("tax-charges").textContent = 0;
      }
      else {
        var qty = Math.abs(Math.floor((capital * risk * 0.01) / (entry - stoploss)));
        let checkCharges = document.getElementById("checkCharges");
        let charges = 0;
        if (checkCharges.checked == true) {
          let chargeType = $(".charge-type").first().val();
          if (chargeType == 1) {
            let chargeResult = calculateIntradayEquity(entry, stoploss, qty)
            charges = chargeResult["total-charges"];
          }
          else if (chargeType == 2) {
            let chargeResult = calculateDeliveryEquity(entry, stoploss, qty)
            charges = chargeResult["total-charges"];
          }
          else if (chargeType == 3) {
            let chargeResult = calculateFutures(entry, stoploss, qty)
            charges = chargeResult["total-charges"];
          }
          else if (chargeType == 4) {
            let chargeResult = calculateOptions(entry, stoploss, qty)
            charges = chargeResult["total-charges"];
          }
        }
        const posValue = parseFloat(qty * entry).toFixed(2);
        var equityRisk = 0;
        equityRisk = parseFloat(((entry - stoploss) * qty) + charges).toFixed(2);
        if (entry > stoploss) {
          equityRisk = Math.abs(parseFloat(((entry - stoploss) * qty) + charges).toFixed(2));
          document.getElementById("position-size").textContent = qty;
        }
        else {
          equityRisk = Math.abs(parseFloat(((stoploss - entry) * qty) + charges).toFixed(2));
          document.getElementById("position-size").textContent = "-"+qty;
        }

        if (Math.ceil(capital) <= Math.ceil(entry)) {
          document.getElementById("position-size").textContent = 0;
          document.getElementById("position-value").textContent = 0;
          document.getElementById("equity-risk").textContent = 0;
          document.getElementById("tax-charges").textContent = 0;
        }
        else {
          document.getElementById("position-value").textContent = posValue;
          document.getElementById("equity-risk").textContent = equityRisk;
          document.getElementById("tax-charges").textContent = charges;
        }
      }
    }
  });

  //Update Capital Preference in storage
  $(".capital").change(function () {
    if ($(".capital").first().val() != "") {
      capital = $(".capital").first().val();
      chrome.storage.sync.set({ capital: capital }, function () {
        console.log("Capital Preferences saved");
      });
    }
  });

  //Update Risk Preference in storage
  $(".risk").change(function () {
    if ($(".risk").first().val() != "") {
      risk = $(".risk").first().val();
      chrome.storage.sync.set({ risk: risk }, function () {
        console.log("Risk Preferences saved");
      });
    }
  });

  //Update Trade Type Preference in storage
  $(".charge-type").change(function () {
    let chargeType = $(".charge-type").first().val();
    chrome.storage.sync.set({ chargeType: chargeType }, function () {
      console.log("Charge Type Preferences saved");
    });
  })

  //Update Add Charges Preference in storage
  $(".charges").change(function () {
    const checkCharges = document.getElementById("checkCharges");
    if (checkCharges.checked == true) {
      $('.charge-type').prop("disabled", false);
      chrome.storage.sync.set({ wantCharges: true }, function () {
        console.log("Charge Preferences saved");
      });
    }
    else if (checkCharges.checked == false) {
      $('.charge-type').prop("disabled", true);
      chrome.storage.sync.set({ wantCharges: false }, function () {
        console.log("Charge Preferences saved");
      });
    }
  })

});

// Get Ticker Price from Zerodha Kite Webpage
function getPrice() {
  function inContent() {
    let price = 0;
    try {
      let res2 = document.getElementsByClassName("last-price");
      price = res2[0].innerText;
      return price;
    }
    catch (error) {
      console.log(error);
      return null;
    }
  }
  chrome.tabs.query({ active: true }, async function (tabs) {
    var tab = tabs[0];
    await chrome.tabs.executeScript(tab.id,
      { code: `(${inContent})()` },
      ([result] = []) => {
        if (result == null) {
          $(".ticker").css("display", "none");
        }
        else if (!chrome.runtime.lastError) {
          $(".price").first().val(result);
          $(".entry").first().val(result);
        }

      });
  });
}

// Get Ticker Name from Zerodha Kite Webpage
function getStockName() {
  function inContent() {
    let name = "";
    try {
      let res1 = document.getElementsByClassName("tradingsymbol");
      name = res1[0].innerText;
      return name;
    }
    catch (error) {
      console.log(error)
    }
  }
  chrome.tabs.query({ active: true }, async function (tabs) {
    var tab = tabs[0];
    await chrome.tabs.executeScript(tab.id,
      { code: `(${inContent})()` },
      ([result] = []) => {
        if (!chrome.runtime.lastError) {
          if (result != null) {
            document.getElementById("stock").textContent = result;
          }

        }
      });
  });
}

// Retrieve past user preferences from storage.
function getPreferences() {
  chrome.storage.sync.get(["capital", "risk", "wantCharges", "chargeType"], function (items) {
    console.log("Preferences Retrieved", items);
    if (items.capital) {
      $(".capital").first().val(items.capital);
    }
    if (items.risk) {
      $(".risk").first().val(items.risk);
    }
    if (items.wantCharges == true) {
      $('.charges').prop("checked", true);
      $('.charge-type').prop("disabled", false);
    }
    else if (items.wantCharges == false) {
      $('.charges').prop("checked", false);
      $('.charge-type').prop("disabled", true);
    }
    if (items.chargeType) {
      $('.charge-type').first().val(items.chargeType)
    }
  });
}

function init() {
  getStockName();
  getPrice();
  getPreferences();
}

init();

// ------------------Brokerage and Charge Calculations-----------

function calculateIntradayEquity(buyPrice, sellPrice, quantity) {
  bp = buyPrice;
  sp = sellPrice;
  qty = quantity;
  var brokerage_buy =
    bp * qty * 0.0003 > 20
      ? 20
      : parseFloat(parseFloat(bp * qty * 0.0003).toFixed(2));
  var brokerage_sell =
    sp * qty * 0.0003 > 20
      ? 20
      : parseFloat(parseFloat(sp * qty * 0.0003).toFixed(2));
  var brokerage = parseFloat(
    parseFloat(brokerage_buy + brokerage_sell).toFixed(2)
  );
  var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
  var stt_total = Math.round(
    parseFloat(parseFloat(sp * qty * 0.00025).toFixed(2))
  );
  var exc_trans_charge = parseFloat(
    parseFloat(0.0000345 * turnover).toFixed(2)
  );
  var cc = 0;
  var stax = parseFloat(
    parseFloat(0.18 * (brokerage + exc_trans_charge)).toFixed(2)
  );
  var sebi_charges = parseFloat(parseFloat(turnover * 0.0000005).toFixed(2));
  var stamp_charges = parseFloat(parseFloat(bp * qty * 0.00003).toFixed(2));
  var total_tax = parseFloat(
    parseFloat(
      brokerage +
      stt_total +
      exc_trans_charge +
      cc +
      stax +
      sebi_charges +
      stamp_charges
    ).toFixed(2)
  );
  var breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2));
  breakeven = isNaN(breakeven) ? 0 : breakeven;
  var net_profit = parseFloat(
    parseFloat((sp - bp) * qty - total_tax).toFixed(2)
  );

  var gross_pnl = parseFloat(parseFloat((sp - bp) * qty).toFixed(2));

  const returnResult = {
    "gross-pnl": gross_pnl,
    "total-charges": total_tax,
    "net-pnl": net_profit,
    "points-to-breakeven": breakeven,
    "charges-splitup": {
      "turnover": turnover,
      "brokerage": brokerage,
      "stt-charges": stt_total,
      "exc-trans-charge": exc_trans_charge,
      "gst": stax,
      "sebi-charges": sebi_charges,
      "stamp-charges": stamp_charges,
    },
  };
  return (returnResult)

}

function calculateDeliveryEquity(buyPrice, sellPrice, quantity) {
  bp = buyPrice
  sp = sellPrice
  qty = quantity
  var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
  var brokerage = 0;
  var stt_total = Math.round(parseFloat(parseFloat(turnover * 0.001).toFixed(2)));
  var exc_trans_charge = parseFloat(parseFloat(0.0000345 * turnover).toFixed(2));
  var cc = 0;
  var stax = parseFloat(parseFloat(0.18 * (brokerage + exc_trans_charge)).toFixed(2));
  var sebi_charges = parseFloat(parseFloat(turnover * 0.0000005).toFixed(2));
  var stamp_charges = parseFloat(parseFloat(bp * qty * 0.00015).toFixed(2));
  var total_tax = parseFloat(parseFloat(brokerage + stt_total + exc_trans_charge + cc + stax + sebi_charges + stamp_charges).toFixed(2));
  var breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2));
  breakeven = isNaN(breakeven) ? 0 : breakeven
  var net_profit = parseFloat(parseFloat(((sp - bp) * qty) - total_tax).toFixed(2));

  var gross_pnl = parseFloat(parseFloat((sp - bp) * qty).toFixed(2));

  const returnResult = {
    "gross-pnl": gross_pnl,
    "total-charges": total_tax,
    "net-pnl": net_profit,
    "points-to-breakeven": breakeven,
    "charges-splitup": {
      turnover: turnover,
      brokerage: brokerage,
      "stt-charges": stt_total,
      "exc-trans-charge": exc_trans_charge,
      gst: stax,
      "sebi-charges": sebi_charges,
      "stamp-charges": stamp_charges,
    }
  };
  return returnResult;
}

function calculateFutures(buyPrice, sellPrice, quantity) {
  bp = buyPrice;
  sp = sellPrice;
  qty = quantity;
  var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
  var brokerage_buy =
    bp * qty * 0.0003 > 20
      ? 20
      : parseFloat(parseFloat(bp * qty * 0.0003).toFixed(2));
  var brokerage_sell =
    sp * qty * 0.0003 > 20
      ? 20
      : parseFloat(parseFloat(sp * qty * 0.0003).toFixed(2));
  var brokerage = parseFloat(
    parseFloat(brokerage_buy + brokerage_sell).toFixed(2)
  );
  var stt_total = Math.round(
    parseFloat(parseFloat(sp * qty * 0.0001).toFixed(2))
  );
  var etc = parseFloat(parseFloat(0.00002 * turnover).toFixed(2));
  var stax = parseFloat(parseFloat(0.18 * (brokerage + etc)).toFixed(2));
  var sebi_charges = parseFloat(parseFloat(turnover * 0.0000005).toFixed(2));
  var stamp_charges = parseFloat(parseFloat(bp * qty * 0.00002).toFixed(2));
  var total_tax = parseFloat(
    parseFloat(
      brokerage + stt_total + etc + stax + sebi_charges + stamp_charges
    ).toFixed(2)
  );
  var breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2));
  breakeven = isNaN(breakeven) ? 0 : breakeven;
  var net_profit = parseFloat(
    parseFloat((sp - bp) * qty - total_tax).toFixed(2)
  );

  var gross_pnl = parseFloat(parseFloat((sp - bp) * qty).toFixed(2));

  const returnResult = {
    "gross-pnl": gross_pnl,
    "total-charges": total_tax,
    "net-pnl": net_profit,
    "points-to-breakeven": breakeven,
    "charges-splitup": {
      turnover: turnover,
      brokerage: brokerage,
      "stt-charges": stt_total,
      "exc-trans-charge": etc,
      gst: stax,
      "sebi-charges": sebi_charges,
      "stamp-charges": stamp_charges,
    },
  };
  return returnResult;
}

function calculateOptions(buyPrice, sellPrice, quantity) {
  bp = buyPrice;
  sp = sellPrice;
  qty = quantity;
  var brokerage = 40;
  if (isNaN(bp) || bp == 0) {
    bp = 0;
    bse_tran_charge_buy = 0;
    brokerage = 20;
  }
  if (isNaN(sp) || sp == 0) {
    sp = 0;
    bse_tran_charge_sell = 0;
    brokerage = 20;
  }
  var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
  var stt_total = Math.round(
    parseFloat(parseFloat(sp * qty * 0.0005).toFixed(2))
  );
  var etc = parseFloat(parseFloat(0.00053 * turnover).toFixed(2));
  var stax = parseFloat(parseFloat(0.18 * (brokerage + etc)).toFixed(2));
  var sebi_charges = parseFloat(parseFloat(turnover * 0.0000005).toFixed(2));
  var stamp_charges = parseFloat(parseFloat(bp * qty * 0.00003).toFixed(2));
  var total_tax = parseFloat(
    parseFloat(
      brokerage + stt_total + etc + stax + sebi_charges + stamp_charges
    ).toFixed(2)
  );
  var breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2));
  breakeven = isNaN(breakeven) ? 0 : breakeven;
  var net_profit = parseFloat(
    parseFloat((sp - bp) * qty - total_tax).toFixed(2)
  );

  var gross_pnl = parseFloat(parseFloat((sp - bp) * qty).toFixed(2));

  const returnResult = {
    "gross-pnl": gross_pnl,
    "total-charges": total_tax,
    "net-pnl": net_profit,
    "points-to-breakeven": breakeven,
    "charges-splitup": {
      turnover: turnover,
      brokerage: brokerage,
      "stt-charges": stt_total,
      "exc-trans-charge": etc,
      gst: stax,
      "sebi-charges": sebi_charges,
      "stamp-charges": stamp_charges,
    },
  };

  return returnResult;
}
