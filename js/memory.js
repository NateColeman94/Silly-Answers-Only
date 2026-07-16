(function(){
  "use strict";
  const Storage=()=>window.PenelopeStorage;

  function cardItems(){
    try{return window.PenelopeCard?.all?.()||[]}catch(error){return []}
  }

  function detailedMemory(){
    try{return window.PenelopeMemory?.getMemory?.()||{}}catch(error){return {}}
  }

  function snapshot(){
    const storage=Storage();
    const detailed=detailedMemory();
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
      titles:detailed.titles||{},
      easterEggs:Array.isArray(detailed.easterEggs)?detailed.easterEggs.length:0,
      detailed
    };
  }

  function recommendationReadiness(){
    const s=snapshot();
    const requirements={
      searches:{current:s.searches,target:20,label:"searches"},
      visits:{current:s.visits,target:5,label:"visits"},
      honks:{current:s.honks,target:8,label:"Penelope interactions"},
      saved:{current:s.saved,target:2,label:"saved misunderstandings"}
    };
    const unlocked=Object.values(requirements).every(item=>item.current>=item.target);
    const score=Object.values(requirements).reduce((sum,item)=>sum+Math.min(item.current/item.target,1),0)/4;
    return {unlocked,score,requirements,stats:s};
  }

  function topCategories(limit=3){
    const categories=snapshot().categories||{};
    return Object.entries(categories)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,limit)
      .map(([key,count])=>({key,count}));
  }

  function hasSeenTitle(key){
    const titles=snapshot().titles||{};
    return Boolean(titles[key]);
  }

  function init(){
    window.addEventListener("penelope:card-changed",notify);
    window.addEventListener("penelope:activity-changed",notify);
  }

  function notify(){
    window.dispatchEvent(new CustomEvent("penelope:memory-updated",{detail:snapshot()}));
  }

  window.PenelopeMemoryV2={
    init,
    snapshot,
    notify,
    recommendationReadiness,
    topCategories,
    hasSeenTitle,
    legacy:()=>window.PenelopeMemory||null
  };
})();