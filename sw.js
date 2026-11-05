const C='pdfr-v3';
const OWN=['./','index.html','manifest.json','icon.svg'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all([...OWN,...LIBS].map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const same=new URL(r.url).origin===location.origin;
 if(!same){ // লাইব্রেরি: আগে ক্যাশ, তাই খুব দ্রুত খোলে
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})));return}
 // নিজের ফাইল: ক্যাশ থেকে সাথে সাথে দেখায়, পেছনে নতুন ভার্সন আনে
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>{
  const n=fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>h);
  return h||n}))});
