const CACHE='it-passport-study-v1';
const pages=Array.from({length:46},(_,i)=>`./it-passport-assets/page-${String(i+2).padStart(2,'0')}.jpg`);
const staticFiles=['./','./index.html','./it-passport-study.html','./manifest.webmanifest','./firebase-config.js','./sync.js',...pages];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(staticFiles)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response})));
});
