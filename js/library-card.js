
(function(){
  "use strict";
  const KEY="penelopeLibraryCardV2",LEGACY="penelopeLibraryCard";
  const shelves=["approved","favorites","shame"];
  function load(){
    let items=window.PenelopeStorage.get(KEY,null);
    if(Array.isArray(items))return items;
    const legacy=window.PenelopeStorage.get(LEGACY,[]);
    items=Array.isArray(legacy)?legacy.map(item=>({...item,shelf:"favorites"})):[];
    window.PenelopeStorage.set(KEY,items);return items;
  }
  function all(shelf=null){const items=load();return shelf?items.filter(item=>item.shelf===shelf):items}
  function save(entry,synopsis,shelf){
    const selected=shelves.includes(shelf)?shelf:"favorites",items=load(),id=[entry.name,synopsis,selected].join("|");
    if(items.some(item=>item.id===id))return false;
    items.unshift({id,title:entry.name,type:entry.type,synopsis,shelf:selected,source:entry.apiSource||"Handcrafted collection",date:new Date().toLocaleDateString()});
    window.PenelopeStorage.set(KEY,items.slice(0,75));return true;
  }
  function remove(id){window.PenelopeStorage.set(KEY,load().filter(item=>item.id!==id))}
  function clearShelf(shelf){window.PenelopeStorage.set(KEY,load().filter(item=>item.shelf!==shelf))}
  window.PenelopeCard={all,save,remove,clearShelf,shelves};
})();
