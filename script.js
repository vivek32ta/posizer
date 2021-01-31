$(document).ready(function () {
  $("input").change(function () {
    if ($(".capital").first().val()!="" && $(".risk").first().val()!="" && $(".entry").first().val()!="" && $(".stoploss").first().val()!="") {
      const capital = $(".capital").first().val();
      const risk = $(".risk").first().val();
      const entry = $(".entry").first().val();
      const stoploss = $(".stoploss").first().val();
      const qty = Math.floor((capital * risk * 0.01) / (entry - stoploss));
      const posValue = parseFloat(qty*entry).toFixed(2);
      const equityRisk = parseFloat(capital * risk * 0.01).toFixed(2);
      document.getElementById("position-size").textContent = qty;
      document.getElementById("position-value").textContent = posValue;
      document.getElementById("equity-risk").textContent = equityRisk;
      
    }
  });

  $(".capital").change(function () {
    if($(".capital").first().val()!=""){
      capital = $(".capital").first().val();
      chrome.storage.sync.set({ capital: capital }, function () {
        console.log("Capital Preferences saved");
      });
    }
  });

  $(".risk").change(function () {
    if($(".risk").first().val()!=""){
      risk = $(".risk").first().val();
      chrome.storage.sync.set({ risk: risk }, function () {
        console.log("Risk Preferences saved");
      });
    }
  });
});

function init() {
  chrome.storage.sync.get(["capital","risk"], function (items) {
      console.log("Preferences Retrieved", items);
      if(items.capital) {
        $(".capital").first().val(items.capital);
      }
      if(items.risk) {
        $(".risk").first().val(items.risk);
      }
  });
}

init();
