(function(){
  "use strict";
  function currentSeason(){
    const month=new Date().getMonth();
    if(month>=2&&month<=4)return "spring";
    if(month>=5&&month<=7)return "summer";
    if(month>=8&&month<=10)return "autumn";
    return "winter";
  }
  function init(){
    document.documentElement.dataset.penelopeSeason=currentSeason();
    window.PenelopeMemory?.applySeason?.();
  }
  window.PenelopeSeasonal={init,currentSeason};
})();
