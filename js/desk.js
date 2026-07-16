(function(){
  "use strict";
  let context=null;
  function dailyIndex(length,offset=0){
    const d=new Date();
    const seed=Number(`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`)+offset;
    return length?seed%length:0;
  }
  function selection(){
    const data=window.PENELOPE_DESK_DATA||{};
    return {
      reading:data.currentlyReading?.[dailyIndex(data.currentlyReading.length)]||null,
      recommendation:data.recommendations?.[dailyIndex(data.recommendations.length,7)]||null,
      misunderstanding:data.misunderstandings?.[dailyIndex(data.misunderstandings.length,13)]||null,
      notice:data.notices?.[dailyIndex(data.notices.length,19)]||null,
      mail:data.mail?.[dailyIndex(data.mail.length,29)]||null
    };
  }
  function init(options={}){context=options;window.dispatchEvent(new CustomEvent("penelope:desk-ready",{detail:selection()}));}
  function openTitle(key){const entry=context?.library?.[key];if(entry)context.runSearch(entry.name);}
  window.PenelopeDesk={init,selection,openTitle};
})();
