(function(){
  "use strict";
  const legacy=()=>window.PenelopeMemory||null;
  const Storage=()=>window.PenelopeStorage;

  function cardItems(){
    try{return window.PenelopeCard?.all?.()||[]}catch(error){return []}
  }

  function init(){
    window.addEventListener("penelope:card-changed",notify);
    window.addEventListener("penelope:activity-changed",notify);
  }

  function notify(){
    window.dispatchEvent(new CustomEvent("penelope:memory-updated",{detail:snapshot()}));
  }

  function snapshot(){
    const storage=Storage();
    const detailed=legacy()?.getMemory?.()||{};
    const items=cardItems();
    return {
      searches:Number(storage?.get("penelopeSearchCount",0)||0),
      honks:Number(storage?.get("penelopeHonkCount",0)||0),
      visits:Number(storage?.get("penelopeVisitCount",0)||0),
      saved:items.length,
      approved:items.filter(item=>item.shelf==="approved").length,
      favorites:items.filter(item=>item.shelf==="favorites").length,
      shame:items.filter(item=>item.shelf==="shame").length,
      categories:detailed.categories||{},
      easterEggs:Array.isArray(detailed.easterEggs)?detailed.easterEggs.length:0,
      detailed
    };
  }

  window.PenelopeMemoryV2={init,snapshot,notify,legacy};
})();