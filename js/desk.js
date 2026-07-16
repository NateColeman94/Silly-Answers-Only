(function(){
  "use strict";
  let context=null;
  let shuffleOffset=0;
  let noticeOffset=0;

  const deskObjects=[
    {id:"tea",icon:"☕",name:"Tea Cup",detail:"Every librarian needs tea.",unlock:()=>true},
    {id:"books",icon:"📚",name:"Returned Books",detail:"Appears after five searches.",unlock:s=>s.searches>=5},
    {id:"glasses",icon:"👓",name:"Spare Glasses",detail:"Appears after ten searches.",unlock:s=>s.searches>=10},
    {id:"feather",icon:"🪶",name:"Feather Bookmark",detail:"Appears after ten honks.",unlock:s=>s.honks>=10},
    {id:"stamp",icon:"🗃️",name:"Brass Library Stamp",detail:"Appears after three saved explanations.",unlock:s=>s.saved>=3},
    {id:"patron",icon:"🪪",name:"Regular Patron Card",detail:"Appears after five visits.",unlock:s=>s.visits>=5},
    {id:"dragon",icon:"🐉",name:"Tiny Dragon",detail:"Appears after ten Fantasy searches.",unlock:s=>(s.categories.fantasy||0)>=10},
    {id:"magnifier",icon:"🔍",name:"Magnifying Glass",detail:"Appears after ten Mystery & Horror searches.",unlock:s=>(s.categories["mystery-horror"]||0)>=10},
    {id:"flower",icon:"🌸",name:"Pressed Flower",detail:"Appears after ten Romance searches.",unlock:s=>(s.categories.romance||0)>=10},
    {id:"crown",icon:"👑",name:"Crown Bookmark",detail:"Appears after repeated Disney and fairy-tale browsing.",unlock:s=>(s.categories["penelope-favorites"]||0)>=10},
    {id:"ramen",icon:"🍜",name:"Mini Ramen Bowl",detail:"Appears after ten Manga searches.",unlock:s=>(s.categories.manga||0)>=10},
    {id:"letter",icon:"✉️",name:"Patron Letter",detail:"Appears after five Easter eggs.",unlock:s=>s.easterEggs>=5}
  ];

  const $=id=>document.getElementById(id);
  function dailySeed(offset=0){
    const d=new Date();
    return Number(`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`)+offset;
  }
  function choose(items,offset=0){
    if(!Array.isArray(items)||!items.length)return null;
    return items[((dailySeed(offset)+shuffleOffset)%items.length+items.length)%items.length];
  }
  function selection(){
    const data=window.PENELOPE_DESK_DATA||{};
    return {
      reading:choose(data.currentlyReading,0),
      recommendation:choose(data.recommendations,7),
      misunderstanding:choose(data.misunderstandings,13),
      notice:choose(data.notices,19+noticeOffset),
      mail:choose(data.mail,29)
    };
  }
  function noteFor(key){
    const data=window.PENELOPE_DESK_DATA||{};
    const entry=context?.library?.[key];
    return data.notes?.[key] || entry?.silly?.[0] || "Penelope has misplaced the note.";
  }
  function setCard(prefix,key){
    const entry=context?.library?.[key];
    if(!entry)return;
    $(`desk${prefix}Title`).textContent=entry.name;
    $(`desk${prefix}Note`).textContent=`“${noteFor(key)}”`;
    $(`desk${prefix}Btn`).dataset.key=key;
  }
  function seasonObject(){
    const month=new Date().getMonth();
    if(month>=2&&month<=4)return {icon:"🌷",name:"Spring Flowers"};
    if(month>=5&&month<=7)return {icon:"🧋",name:"Summer Iced Tea"};
    if(month>=8&&month<=10)return {icon:"🎃",name:"Autumn Bookmark"};
    return {icon:"❄️",name:"Winter Snow Globe"};
  }

  function renderObjects(){
    const tray=$("deskObjectTray");
    if(!tray)return;
    const stats=window.PenelopeMemoryV2?.snapshot?.()||{
      searches:0,honks:0,visits:0,saved:0,categories:{},easterEggs:0
    };
    tray.innerHTML="";
    const unlocked=deskObjects.filter(object=>object.unlock(stats));
    const seasonal=seasonObject();
    [...unlocked,{id:"season",...seasonal,detail:"Changes with the season.",unlock:()=>true}].forEach(object=>{
      const item=document.createElement("div");
      item.className="desk-object";
      item.title=`${object.name}: ${object.detail}`;
      const icon=document.createElement("span");
      icon.textContent=object.icon;
      const label=document.createElement("small");
      label.textContent=object.name;
      item.append(icon,label);
      tray.appendChild(item);
    });
    const locked=deskObjects.length-unlocked.length;
    const note=$("deskProgressNote");
    if(note){
      if(locked===0)note.textContent="Penelope's desk is wonderfully crowded.";
      else if(unlocked.length<=2)note.textContent="The desk will quietly fill as you explore.";
      else note.textContent=`${unlocked.length} desk keepsakes collected · ${locked} still hidden`;
    }
  }

  function render(){
    const picked=selection();
    setCard("Reading",picked.reading);
    setCard("Recommendation",picked.recommendation);
    setCard("Misunderstanding",picked.misunderstanding);
    $("deskNotice").textContent=picked.notice||"The notice board is taking a personal day.";
    $("deskMailFrom").textContent=picked.mail?`From: ${picked.mail.from}`:"No mail today";
    $("openDeskMailBtn").disabled=!picked.mail;
    $("openDeskMailBtn").dataset.from=picked.mail?.from||"";
    $("openDeskMailBtn").dataset.text=picked.mail?.text||"";
    renderObjects();
    window.dispatchEvent(new CustomEvent("penelope:desk-rendered",{detail:picked}));
  }
  function openTitle(event){
    const key=event.currentTarget.dataset.key;
    const entry=context?.library?.[key];
    if(entry)context.runSearch(entry.name);
  }
  function openMail(){
    $("deskMailText").textContent=$("openDeskMailBtn").dataset.text||"The letter is blank. This feels intentional.";
    $("deskMailSignature").textContent=`— ${$("openDeskMailBtn").dataset.from||"An anonymous patron"}`;
    $("deskMailPanel").classList.remove("hidden");
    $("deskMailPanel").scrollIntoView({behavior:"smooth",block:"center"});
  }
  function init(options={}){
    context=options;
    ["deskReadingBtn","deskRecommendationBtn","deskMisunderstandingBtn"].forEach(id=>$(id)?.addEventListener("click",openTitle));
    $("refreshDeskBtn")?.addEventListener("click",()=>{shuffleOffset+=11;render();context?.bubble?.("I have rearranged my desk. Nothing is where I left it.")});
    $("newDeskNoticeBtn")?.addEventListener("click",()=>{noticeOffset+=1;render()});
    $("openDeskMailBtn")?.addEventListener("click",openMail);
    $("closeDeskMailBtn")?.addEventListener("click",()=>$("deskMailPanel").classList.add("hidden"));
    window.addEventListener("penelope:memory-updated",renderObjects);
    window.addEventListener("penelope:activity-changed",()=>setTimeout(renderObjects,30));
    render();
  }
  window.PenelopeDesk={init,selection,render,renderObjects};
})();
