const CACHE='zad-almoslem-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/quran','/adhkar','/daily','/icon.svg'])))});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return res}).catch(()=>cached)))});
