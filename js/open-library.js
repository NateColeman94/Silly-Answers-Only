
(function(){
  "use strict";
  const SEARCH_URL="https://openlibrary.org/search.json";
  const clean=value=>String(value||"").replace(/\s+/g," ").trim();
  const textDescription=value=>{
    if(typeof value==="string")return clean(value);
    if(value&&typeof value.value==="string")return clean(value.value);
    return "";
  };
  const clip=(value,max=420)=>value.length>max?value.slice(0,max).replace(/\s+\S*$/,"")+"…":value;
  const titleCase=value=>String(value||"").replace(/\b\w/g,letter=>letter.toUpperCase());
  async function fetchWork(key){
    if(!key||!String(key).startsWith("/works/"))return null;
    try{
      const response=await fetch(`https://openlibrary.org${key}.json`,{headers:{Accept:"application/json"}});
      if(!response.ok)return null;
      return await response.json();
    }catch(error){console.warn("Open Library work fetch failed",error);return null}
  }
  function entryFrom(doc,work,query){
    const title=clean(doc.title)||clean(query)||"Unknown Book";
    const authors=Array.isArray(doc.author_name)?doc.author_name.slice(0,3):[];
    const searchSubjects=Array.isArray(doc.subject)?doc.subject:[];
    const workSubjects=work&&Array.isArray(work.subjects)?work.subjects:[];
    const subjects=[...new Set([...workSubjects,...searchSubjects])].filter(v=>typeof v==="string"&&v.length<55).slice(0,12);
    const description=clip(textDescription(work&&work.description),520);
    const a=subjects[0]||"unexpected decisions",b=subjects[1]||"literary complications",c=subjects[2]||"questionable planning";
    const authorText=authors.length?authors.join(", "):"an unidentified author";
    const premise=description
      ?`Open Library's work record describes a story involving: ${description}`
      :`${title} by ${authorText} is associated with ${a.toLowerCase()}, ${b.toLowerCase()}, and ${c.toLowerCase()}.`;
    return {
      name:title,type:"Book",key:"openLibrary",apiSource:"Open Library",
      sourcePreview:premise,
      apiMetadata:{authors,firstPublishYear:doc.first_publish_year||null,openLibraryKey:doc.key||null,coverId:doc.cover_i||null,subjects,descriptionAvailable:Boolean(description)},
      related:authors,
      mild:[description?`${title} appears to follow ${description}`:`${title} by ${authorText} appears to involve ${a.toLowerCase()} and ${b.toLowerCase()}.`],
      silly:[
        `${title} turns ${a.toLowerCase()} into a library incident involving ${b.toLowerCase()} and insufficient supervision.`,
        `${authorText} appears to have written a story where ${a.toLowerCase()} collides with ${c.toLowerCase()} and everyone ignores the simplest solution.`,
        `Penelope reviewed the available ${description?"work description and ":""}subject metadata, then shelved the result under Avoidable Complications.`
      ],
      wild:[`${titleCase(a)} acquires narrative authority and immediately destabilizes the entire book.`],
      audiences:[`readers researching ${a.toLowerCase()}`,`librarians suspicious of ${b.toLowerCase()}`,`book clubs debating ${c.toLowerCase()}`],
      genres:[`${titleCase(a)} Management`,`${titleCase(b)} Logistics`,`${titleCase(c)} Studies`,"Metadata-Based Misinformation"],
      quotes:[`Please note that ${a.toLowerCase()} was not included in the circulation policy.`],
      reviews:[`Strong ${a.toLowerCase()}. Concerning ${b.toLowerCase()}.`],
      trailers:[`One title. ${authors.length||"Several"} credited author${authors.length===1?"":"s"}. Unlimited ${c.toLowerCase()}.`],
      morals:[`Public metadata can identify a book, but it cannot make Penelope explain it responsibly.`],
      endings:[`The book receives a handcrafted profile in a future collection update.`],
      questions:[`How might ${a.toLowerCase()} shape the real story?`]
    };
  }
  async function search(query){
    const params=new URLSearchParams({q:clean(query),limit:"5",fields:"key,title,author_name,first_publish_year,subject,cover_i,edition_count"});
    const response=await fetch(`${SEARCH_URL}?${params}`,{headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error(`Open Library returned ${response.status}`);
    const payload=await response.json(),docs=Array.isArray(payload.docs)?payload.docs:[];
    const results=[];
    for(const doc of docs.slice(0,5)){
      const work=await fetchWork(doc.key);
      results.push({doc,work,entry:entryFrom(doc,work,query)});
    }
    return results;
  }
  window.PenelopeOpenLibrary={search};
})();
