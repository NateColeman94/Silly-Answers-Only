(function(){
  "use strict";
  let state={library:{},collections:{}};
  function init(options={}){state={...state,...options};}
  function availableSizes(collectionKey){
    const count=state.collections?.[collectionKey]?.keys?.length||0;
    return [8,16,32,64].filter(size=>size<=count);
  }
  window.PenelopeTournament={init,availableSizes,getState:()=>state};
})();
