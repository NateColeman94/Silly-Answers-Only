
(function(){
  const KEY="penelopeLibraryCard";
  function all(){return window.PenelopeStorage.get(KEY,[])}
  function save(entry,synopsis){
    const items=all(),id=entry.name+"|"+synopsis;
    if(items.some(item=>item.id===id))return false;
    items.unshift({id,title:entry.name,type:entry.type,synopsis,date:new Date().toLocaleDateString()});
    window.PenelopeStorage.set(KEY,items.slice(0,30));return true;
  }
  function remove(id){window.PenelopeStorage.set(KEY,all().filter(item=>item.id!==id))}
  window.PenelopeCard={all,save,remove};
})();
