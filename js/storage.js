
window.PenelopeStorage={
  get(key,fallback){
    try{const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value)}
    catch(error){console.warn("Storage read failed",error);return fallback}
  },
  set(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true}
    catch(error){console.warn("Storage write failed",error);return false}
  }
};
