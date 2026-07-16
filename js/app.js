
const FALLBACK_DATA={
"percy jackson":{"name":"Percy Jackson Series","type":"Book Series","key":"percy","related":["The Lightning Thief","Rick Riordan","Annabeth Chase","Harry Potter"],"mild":["A teenager learns mythology is a complicated family matter."],"silly":["A boy discovers his family tree includes weather problems and summer-camp emergencies.","Greek mythology becomes a field trip with questionable supervision."],"wild":["Mount Olympus outsources crisis management to teenagers.","A demigod turns every museum visit into an insurance claim."]},
"the lightning thief":{"name":"The Lightning Thief","type":"Book","key":"percy","related":["Percy Jackson","Rick Riordan","Annabeth Chase"],"mild":["A school trip becomes a search for misplaced weather equipment."],"silly":["A teenager is blamed for stealing the sky's most expensive extension cord."],"wild":["Every immortal blames the nearest twelve-year-old for a missing thunderbolt."]},
"rick riordan":{"name":"Rick Riordan","type":"Author","key":"percy","related":["Percy Jackson","The Lightning Thief","Annabeth Chase"],"mild":["An author who proves mythology should not supervise teenagers."],"silly":["A former teacher who turned ancient myths into dangerous summer-camp brochures."],"wild":["A mythology department becomes sentient and publishes incident reports."]},
"gandalf":{"name":"Gandalf","type":"Character","key":"gandalf","related":["The Fellowship of the Ring","The Hobbit","J.R.R. Tolkien"],"mild":["A consultant who provides riddles and incomplete instructions."],"silly":["A fireworks enthusiast who disappears when anyone asks him to move furniture.","A travel agent who books dangerous tours and vanishes during customer support."],"wild":["A sentient beard assigns interns to volcano duty.","A wizard refuses to document the project plan."]}
};
const FALLBACK_PROFILES={
"percy":{"audiences":["camp counselors updating liability forms","Greek gods avoiding customer service"],"genres":["Mythological Summer Camp","Divine Family Drama","Field Trip Liability"],"quotes":["My family tree requires a warning label."],"reviews":["Excellent mythology. Terrible supervision."],"trailers":["One teenager. Twelve gods. Zero calm vacations."],"morals":["Always read the summer-camp waiver."],"endings":["The gods attend mediation."],"questions":["Which adult should have supervised this quest?"]},
"gandalf":{"audiences":["fireworks customers","abandoned hiking groups"],"genres":["Fireworks Consulting","Executive Disappearing","Riddle Management"],"quotes":["I will return precisely when least convenient."],"reviews":["Excellent fireworks. Unclear deliverables."],"trailers":["One beard. Several riddles. No action plan."],"morals":["Document responsibilities before the mentor disappears."],"endings":["Gandalf stays for the whole meeting."],"questions":["Who approved his consulting contract?"]},
"default":{"audiences":["deeply suspicious librarians"],"genres":["Questionable Decisions","Extreme Group Projects"],"quotes":["I have chosen symbolism over common sense."],"reviews":["The bookmark showed better judgment."],"trailers":["One book. No supervision."],"morals":["One clear conversation prevents several chapters."],"endings":["A librarian solves everything."],"questions":["Could this have been one group email?"]}
};
const DATA=(window.LIBRARY_DATA&&Object.keys(window.LIBRARY_DATA).length)?window.LIBRARY_DATA:FALLBACK_DATA;
const PROFILES=(window.HUMOR_PROFILES&&Object.keys(window.HUMOR_PROFILES).length)?window.HUMOR_PROFILES:FALLBACK_PROFILES;
const PENNY=["Honk! I found it, but the accurate summary wandered off.","I checked three shelves. Every explanation was equally incorrect.","The catalog filed this under Questionable Life Choices.","That is absolutely not what happened. Five stars."];
const AWARDS=["🏆 Certified Librarian Nightmare","🏅 Incorrect but Confident","🪿 Goose-Approved Misinformation","🚨 English Teacher Alert"];
let current="",item=null,cycle=0;
const norm=s=>s.toLowerCase().trim().replace(/[’']/g,"").replace(/\s+/g," ");
const pick=(a,i)=>a[((i%a.length)+a.length)%a.length];
function resolve(q){const n=norm(q);if(DATA[n])return DATA[n];for(const[k,v]of Object.entries(DATA))if(n.includes(k)||k.includes(n))return v;return{name:q||"Untitled Book",type:"Mystery Search",key:"default",related:["Percy Jackson","The Fellowship of the Ring","Harry Potter","Gandalf"],mild:["A normal book becomes an avoidable group project."],silly:["A collection of questionable decisions becomes hardcover.","Everyone ignores the obvious solution because the sequel needs material."],wild:["The plot escapes supervision and begins filing paperwork.","A bookmark becomes the most responsible character."]}}
function render(q,advance=false){if(!q.trim())q="Percy Jackson";const same=norm(q)===norm(current);cycle=(advance||same)?cycle+1:0;current=q;item=resolve(q);const lvl=document.getElementById("level").value,p=PROFILES[item.key]||PROFILES.default;
document.getElementById("title").textContent=item.name;document.getElementById("type").textContent=item.type;document.getElementById("penelopeLine").textContent="🪿 Penelope says: “"+pick(PENNY,cycle)+"”";document.getElementById("synopsis").textContent=pick(item[lvl],cycle);
document.getElementById("ratingNumber").textContent=(4.5+((item.name.length*7+cycle*11)%49)/100).toFixed(2);document.getElementById("audience").textContent=`Based on ${(1250+((item.name.length*643+cycle*977)%8750)).toLocaleString()} ${pick(p.audiences,cycle+1)}`;document.getElementById("award").textContent=pick(AWARDS,cycle+2);
const g=document.getElementById("genres");g.innerHTML="";[0,1,2,3].map(i=>pick(p.genres,cycle+i)).filter((v,i,a)=>a.indexOf(v)===i).forEach(x=>{const s=document.createElement("span");s.textContent=x;g.appendChild(s)});
for(const [id,key,off] of [["quote","quotes",1],["review","reviews",2],["trailer","trailers",3],["moral","morals",4],["ending","endings",5],["discussion","questions",6]])document.getElementById(id).textContent=(id==="quote"?"“":"")+pick(p[key],cycle+off)+(id==="quote"?"”":"");
const r=document.getElementById("relatedButtons");r.innerHTML="";item.related.forEach(x=>{const b=document.createElement("button");b.textContent=x;b.onclick=()=>{document.getElementById("query").value=x;render(x)};r.appendChild(b)});renderLibraryCard();document.getElementById("saveMessage").textContent="";document.getElementById("result").classList.add("show")}

function getCard(){
  return JSON.parse(localStorage.getItem("penelopeLibraryCard")||"[]");
}
function saveCard(card){
  localStorage.setItem("penelopeLibraryCard",JSON.stringify(card));
}
function addCurrentToCard(){
  if(!item) return;
  const synopsis=document.getElementById("synopsis").textContent;
  const card=getCard();
  const id=norm(item.name)+"|"+synopsis;
  if(card.some(x=>x.id===id)){
    document.getElementById("saveMessage").textContent="Already checked out!";
    return;
  }
  card.unshift({
    id,
    title:item.name,
    type:item.type,
    synopsis,
    saved:new Date().toLocaleDateString()
  });
  saveCard(card.slice(0,25));
  document.getElementById("saveMessage").textContent="Saved to your card!";
  renderLibraryCard();
}
function removeFromCard(id){
  saveCard(getCard().filter(x=>x.id!==id));
  renderLibraryCard();
}
function renderLibraryCard(){
  const wrap=document.getElementById("libraryCard");
  const card=getCard();
  wrap.innerHTML="";
  if(!card.length){
    wrap.innerHTML='<p class="hall-empty">Your card is empty. Goose-approve an explanation to save it.</p>';
    return;
  }
  card.forEach(x=>{
    const row=document.createElement("div");
    row.className="card-entry";
    const title=document.createElement("div");
    title.className="card-entry-title";
    title.textContent=`${x.title} — ${x.type}`;
    const text=document.createElement("p");
    text.className="card-entry-text";
    text.textContent=x.synopsis;
    const meta=document.createElement("div");
    meta.className="card-entry-meta";
    meta.textContent=`Saved ${x.saved}`;
    const remove=document.createElement("button");
    remove.className="remove-card";
    remove.textContent="Remove";
    remove.onclick=()=>removeFromCard(x.id);
    row.append(title,text,meta,remove);
    wrap.appendChild(row);
  });
}
function honkPenelope(){
  const goose=document.getElementById("goose");
  const bubble=document.getElementById("bubble");
  goose.classList.remove("honking");
  void goose.offsetWidth;
  goose.classList.add("honking");
  bubble.innerHTML="<strong>Penelope says:</strong><br>“HONK! "+pick(PENNY,Math.floor(Math.random()*PENNY.length)+cycle)+"”";

  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    const ctx=new AudioCtx();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type="square";
    osc.frequency.setValueAtTime(310,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(190,ctx.currentTime+0.18);
    gain.gain.setValueAtTime(0.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22,ctx.currentTime+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.24);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start();osc.stop(ctx.currentTime+0.25);
  }catch(e){}
}
document.getElementById("searchBtn").onclick=()=>render(document.getElementById("query").value);
document.getElementById("query").onkeydown=e=>{if(e.key==="Enter")render(e.target.value)};
document.getElementById("tryAnother").onclick=()=>render(current,true);
document.getElementById("makeWorse").onclick=()=>{const l=document.getElementById("level");l.value=l.value==="mild"?"silly":"wild";render(current,true)};
document.getElementById("goose").onclick=honkPenelope;
document.getElementById("honkBtn").onclick=honkPenelope;
document.getElementById("saveCardBtn").onclick=addCurrentToCard;
document.getElementById("clearCardBtn").onclick=()=>{if(confirm("Clear your saved Library Card?")){saveCard([]);renderLibraryCard();}};
renderLibraryCard();
document.querySelectorAll(".example").forEach(b=>b.onclick=()=>{document.getElementById("query").value=b.dataset.query;render(b.dataset.query)});
