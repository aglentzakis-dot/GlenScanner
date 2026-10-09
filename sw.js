const CACHE='glenscanner-1.1';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-512-maskable.png','apple-touch-icon.png','privacy.html','G-glenapps.png','antigrafa.js','efarmoges-mas.js','grammata.ttf'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('glenscanner-')&&k!==CACHE&&k!=='glenscanner-lib'&&k!=='glenscanner-share').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  // φωτογραφίες που ήρθαν με «Κοινοποίηση → GlenScanner»
  if(e.request.method==='POST'&&new URL(e.request.url).pathname.endsWith('/share-target')){
    e.respondWith((async()=>{
      try{
        const fd=await e.request.formData();const files=fd.getAll('file').filter(f=>f&&f.size);
        const c=await caches.open('glenscanner-share');for(const k of await c.keys())await c.delete(k);
        for(let i=0;i<files.length;i++){const f=files[i];await c.put('shared/'+i,new Response(f,{headers:{'content-type':f.type||'image/jpeg'}}))}
        return Response.redirect('./?shared='+files.length,303);
      }catch(err){return Response.redirect('./?shared=0',303)}
    })());
    return;
  }
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // δική μας σελίδα: πρώτα δίκτυο (για αναβαθμίσεις), αλλιώς αποθηκευμένη
  if(u.origin===location.origin){
    e.respondWith(Promise.race([fetch(e.request),new Promise((_,j)=>u.pathname==='/efarmoges-mas.js'&&setTimeout(j,4000))]).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  // βιβλιοθήκες και λεξικά γλώσσας: αποθήκευση για χρήση χωρίς ίντερνετ
  e.respondWith(caches.open('glenscanner-lib').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}))));
});
