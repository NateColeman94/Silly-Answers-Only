
(function(){
  "use strict";
  const URL="https://openlibrary.org/search.json";
  const clean=value=>String(value||"").trim();
  const titleCase=value=>String(value||"").replace(/\b\w/g,letter=>letter.toUpperCase());
  function entryFrom(doc,query){
    const title=clean(doc.title)||clean(query)||"Unknown Book";
    const authors=Array.isArray(doc.author_name)?doc.author_name.slice(0,3):[];
    const subjects=(Array.isArray(doc.subject)?doc.subject:[]).filter(v=>typeof v==="string"&&v.length<45).slice(0,8);
    const a=subjects[0]||"unexpected decisions",b=subjects[1]||"literary complications",c=subjects[2]||"questionable planning";
    const authorText=authors.length?authors.join(", "):"an unidentified author";
    return {
      name:title,type:"Book",key:"openLibrary",apiSource:"Open Library",
      apiMetadata:{authors,firstPublishYear:doc.first_publish_year||null,openLibraryKey:doc.key||null,coverId:doc.cover_i||null,subjects},
      related:authors,
      mild:[`${title} by ${authorText} appears to involve ${a.toLowerCase()}, which Penelope has responsibly misunderstood.`],
      silly:[
        `${title} turns ${a.toLowerCase()} into a library incident involving ${b.toLowerCase()} and insufficient supervision.`,
        `${authorText} appears to have written a story where ${a.toLowerCase()} collides with ${c.toLowerCase()} and everyone ignores the simplest solution.`
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
    const response=await fetch(`${URL}?${params}`,{headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error(`Open Library returned ${response.status}`);
    const payload=await response.json();
    return (Array.isArray(payload.docs)?payload.docs:[]).map(doc=>({doc,entry:entryFrom(doc,query)}));
  }
  window.PenelopeOpenLibrary={search};
})();
