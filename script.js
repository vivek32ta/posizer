$(document).ready(function () {
  $("input").change(function () {
    if ($(".capital").first().val()!="" && $(".risk").first().val()!="" && $(".entry").first().val()!="" && $(".stoploss").first().val()!="") {
      capital = $(".capital").first().val();
      risk = $(".risk").first().val();
      entry = $(".entry").first().val();
      stoploss = $(".stoploss").first().val();
      qty = Math.floor((capital * risk * 0.01) / (entry - stoploss));
      //$(".position-size").first().val(qty);
      document.getElementById("position-size").textContent = qty;
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
