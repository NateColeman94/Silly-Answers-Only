(function(){
  "use strict";
  const legacy=()=>window.PenelopeMemory||null;
  const Storage=()=>window.PenelopeStorage;
  function init(){
    window.addEventListener("penelope:card-changed",()=>window.dispatchEvent(new CustomEvent("penelope:memory-updated")));
  }
  function snapshot(){
    const storage=Storage();
    return {
      searches:Number(storage?.get("penelopeSearchCount",0)||0),
      honks:Number(storage?.get("penelopeHonkCount",0)||0),
      visits:Number(storage?.get("penelopeVisitCount",0)||0),
      detailed:legacy()?.getMemory?.()||{}
    };
  }
  window.PenelopeMemoryV2={init,snapshot,legacy};
})();
