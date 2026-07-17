(function(){
  "use strict";
  const facts=[
    "Geese can recognize familiar faces. Penelope also recognizes anyone who folds page corners.",
    "A group of geese on the ground is called a gaggle. In the reference section, it is called a committee.",
    "Geese communicate with more than a dozen distinct sounds. Penelope uses fourteen before breakfast.",
    "Some geese travel thousands of miles during migration. Penelope considers the return cart far enough.",
    "Goslings can swim shortly after hatching. They still require help locating the mystery shelf.",
    "Geese often fly in a V formation to conserve energy. Penelope flies in a question mark for branding.",
    "Geese are famously watchful. This is why the library has never needed a second security goose.",
    "Many geese mate for life. Penelope remains professionally committed to the card catalog.",
    "A goose's honk can carry over long distances. Particularly when someone requests an accurate summary.",
    "Geese remember useful routes. Penelope remembers every shortcut except the one to the returns desk."
  ];
  const rules=[
    "All dramatic entrances must be completed before the quiet-reading bell.",
    "Books may whisper after closing, but only in complete sentences.",
    "Anyone summoning a dragon must reserve the courtyard first.",
    "Tea is permitted near mysteries only when the cup has an alibi.",
    "Prophecies must be returned to the circulation desk within fourteen days.",
    "Villains may use the reading room, provided they lower their monologues to an indoor voice.",
    "Time travelers must pay late fees in the century where the book was borrowed.",
    "No sword fights between the stacks unless both parties use bookmarks as referees.",
    "Secret passages count as emergency exits only when Penelope has labeled them.",
    "Accurate summaries remain prohibited under the Library's Goose Confidence Ordinance."
  ];
  let fact=-1,rule=-1;
  function next(list,current){let n=current;while(list.length>1&&n===current)n=Math.floor(Math.random()*list.length);return n;}
  function render(){fact=next(facts,fact);rule=next(rules,rule);const f=document.getElementById('gooseFactText');const r=document.getElementById('libraryRuleText');if(f)f.textContent=facts[fact];if(r)r.textContent=rules[rule];}
  document.addEventListener('DOMContentLoaded',()=>{render();document.getElementById('refreshWhimsyBtn')?.addEventListener('click',render);});
})();
