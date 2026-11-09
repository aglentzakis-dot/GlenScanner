/* ΚΑΝΟΝΑΣ GlenApps (10/11/2026): η εφαρμογή ανοίγει αμέσως από τη συσκευή· δίκτυο το πολύ 3″ — ΜΗΝ αφαιρεθεί.
   gaNet(δίκτυο, αποθήκη, συμβάν): αν το δίκτυο δεν απαντήσει σε 3″ και υπάρχει αποθηκευμένο αντίγραφο, δίνεται αυτό
   (το δίκτυο συνεχίζει στο παρασκήνιο και ενημερώνει την αποθήκη)· μετά από καθυστέρηση, για 30″ όλα κατευθείαν από τη συσκευή.
   Σφάλμα διακομιστή (5xx) δεν αντικαθιστά το αποθηκευμένο. Οι αναβαθμίσεις έρχονται όπως πριν (νέο όνομα αποθήκης σε κάθε έκδοση). */
var GA_MS=3000,gaSlow=0;
function gaNet(net,fromCache,ev){var p=Promise.resolve(net);try{ev&&ev.waitUntil&&ev.waitUntil(p.catch(function(){}))}catch(x){}
  function fc(){try{return Promise.resolve(fromCache()).catch(function(){})}catch(x){return Promise.resolve()}}
  if(Date.now()<gaSlow)return fc().then(function(c){return c||p});
  return new Promise(function(ok){var done=false,t;function fin(r){if(!done){done=true;clearTimeout(t);ok(r)}}
    t=setTimeout(function(){fc().then(function(c){if(c){gaSlow=Date.now()+30000;fin(c)}})},GA_MS);
    p.then(function(r){if(r&&r.status>=500)fc().then(function(c){fin(c||r)});else fin(r)},function(){fc().then(function(c){fin(c||Response.error())})});});}
const CACHE='glenscanner-1.10';
const CORE=['./','index.html','plaisio.js','manifest.json','icon-192.png','icon-512.png','icon-512-maskable.png','apple-touch-icon.png','privacy.html','G-glenapps.png','antigrafa.js','efarmoges-mas.js','grammata.ttf','metafora-rythmisi.js','metafora-lipsi.js'];
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
    e.respondWith(gaNet(Promise.race([fetch(e.request),new Promise((_,j)=>u.pathname==='/efarmoges-mas.js'&&setTimeout(j,4000))]).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}),()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html')),e));
    return;
  }
  // βιβλιοθήκες και λεξικά γλώσσας: αποθήκευση για χρήση χωρίς ίντερνετ
  // (με έλεγχο ακεραιότητας οι βιβλιοθήκες ζητούνται «cors»· μια παλιά «αδιαφανής» αποθηκευμένη απάντηση δεν κάνει, ξανακατεβαίνει)
  e.respondWith(caches.open('glenscanner-lib').then(c=>c.match(e.request).then(r=>(r&&!(r.type==='opaque'&&e.request.mode==='cors'))?r:fetch(e.request).then(n=>{if(n.ok||(n.type==='opaque'&&e.request.mode!=='cors'))c.put(e.request,n.clone());return n}))));
});
