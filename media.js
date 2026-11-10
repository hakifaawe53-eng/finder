// Finder - media.js : appareil photo en direct et offres près de chez vous
(function(){
if(window.__finderMedia)return;window.__finderMedia=1;
const q=s=>document.querySelector(s);
const st=document.createElement("style");
st.textContent=".phbtns{display:flex;gap:8px;margin:6px 0}.phbtns button{flex:1}.phth{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.pth{position:relative;width:84px;height:84px}.pth img{width:100%;height:100%;object-fit:cover;border-radius:12px}.pth button{position:absolute;top:-6px;right:-6px;width:24px;height:24px;padding:0;border-radius:50%;border:0;background:#E5484D;color:#fff;line-height:24px}#cvid{width:100%;max-height:58vh;aspect-ratio:3/4;object-fit:cover;background:#000;border-radius:16px;display:block}.camctl{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}#cshot{width:68px;height:68px;border-radius:50%;border:5px solid #fff;background:#E5484D;box-shadow:0 0 0 3px #E5484D;padding:0}#cflip{width:48px;height:48px;padding:0;border-radius:50%}#geochip{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;background:#fff;border:1px solid var(--line,#E2EBEB);border-radius:14px;padding:10px 12px;margin:10px 0;font-size:.9rem}#geochip button{padding:7px 12px;font-size:.85rem}.gbtns{display:flex;gap:6px}.gl{margin:6px 0 0;padding-left:20px;color:var(--mut,#6A7B84)}.mrow{display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}.mini{flex:0 0 150px;background:#fff;border-radius:16px;box-shadow:var(--sh,0 4px 16px rgba(0,87,95,.08));overflow:hidden;position:relative;cursor:pointer;scroll-snap-align:start}.mini img,.mph{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#F0F5F5}.mini b{display:block;color:var(--t,#007782);padding:8px 10px 0}.mini p{margin:0;padding:0 10px;font-size:.88rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.mini small{display:block;padding:0 10px 10px;color:var(--mut,#6A7B84)}.mtag{position:absolute;top:8px;left:8px;background:#E5484D;color:#fff;border-radius:999px;padding:2px 9px;font-size:.75rem;font-weight:700}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<input type="file" accept="image/*" capture="environment" id="cnat" hidden><dialog id="dcam"><div class="whd"><button type="button" class="bk" data-cx aria-label="Fermer">←</button><h2>Appareil photo</h2></div><video id="cvid" playsinline muted autoplay></video><canvas id="ccv" hidden></canvas><p class="meta" id="cmsg"></p><div class="camctl"><button type="button" id="cflip" aria-label="Changer de caméra">🔄</button><button type="button" id="cshot" aria-label="Prendre la photo"></button><button type="button" class="pri" id="cdone">Terminer</button></div><p class="meta" id="ccount"></p><button type="button" class="sbtn" id="cnative" hidden>Utiliser l’appareil photo du téléphone</button></dialog><dialog id="dgeo"><h2>Voir les offres près de chez vous</h2><p>Finder peut utiliser votre position pour vous montrer les annonces de la ville la plus proche et les meilleures affaires.</p><ul class="gl"><li>Votre position est calculée sur votre appareil.</li><li>Seule la ville la plus proche est utilisée pour chercher les annonces.</li><li>Votre position précise n’est pas enregistrée sur nos serveurs.</li><li>Vous pouvez désactiver la localisation à tout moment.</li></ul><div class="row"><button class="pri" id="geook" type="button">Autoriser la localisation</button><button type="button" id="geono">Pas maintenant</button></div></dialog>');
const ph=q("#ph");
if(ph){
const dcam=q("#dcam"),vid=q("#cvid"),cv=q("#ccv"),cmsg=q("#cmsg"),ccount=q("#ccount"),cnat=q("#cnat"),cnb=q("#cnative");
const MSG0="La caméra n’est utilisée que pour prendre vos photos d’annonce.";
let FILES=[],URLS=[],stream=null,facing="environment";
ph.hidden=true;
const ui=document.createElement("div");ui.id="phui";
ui.innerHTML='<div class="phbtns"><button type="button" id="phcam" class="pri">📷 Prendre une photo</button><button type="button" id="phgal">🖼️ Galerie</button></div><div id="phth" class="phth"></div><p class="meta" id="phm">3 photos maximum. Prenez des photos nettes, en pleine lumière.</p>';
ph.after(ui);
const say=t=>{q("#phm").textContent=t};
function draw(){q("#phth").innerHTML=FILES.map((f,i)=>'<div class="pth"><img src="'+URLS[i]+'" alt=""><button type="button" data-r="'+i+'" aria-label="Retirer la photo">✕</button></div>').join("")}
function push(){try{const dt=new DataTransfer();FILES.forEach(f=>dt.items.add(f));ph.files=dt.files}catch(e){say("Votre navigateur ne permet pas d’ajouter cette photo. Utilisez la galerie.")}draw()}
function addFiles(arr){for(const f of arr){if(FILES.length>=3){say("3 photos maximum.");break}if(!/^image\//.test(f.type))continue;FILES.push(f);URLS.push(URL.createObjectURL(f))}push()}
function clearAll(){URLS.forEach(u=>URL.revokeObjectURL(u));FILES=[];URLS=[];draw()}
function updCount(){ccount.textContent=FILES.length?"Photos prises : "+FILES.length+"/3":"Cadrez l’article, puis appuyez sur le bouton rouge."}
function stopCam(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}vid.srcObject=null}
async function startCam(){
stopCam();cnb.hidden=true;cmsg.textContent=MSG0;
try{
stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1920},height:{ideal:1080}},audio:false});
vid.srcObject=stream;
await vid.play().catch(()=>{});
}catch(e){
stopCam();
cmsg.textContent=(e&&e.name==="NotAllowedError")?"L’accès à la caméra est refusé. Autorisez-la dans les réglages du navigateur, ou utilisez l’appareil photo du téléphone ci-dessous.":"Impossible d’ouvrir la caméra. Utilisez l’appareil photo du téléphone ci-dessous.";
cnb.hidden=false;
}
updCount();
}
dcam.addEventListener("close",stopCam);
dcam.querySelector("[data-cx]").onclick=()=>dcam.close();
q("#cdone").onclick=()=>dcam.close();
q("#cflip").onclick=()=>{facing=facing==="environment"?"user":"environment";startCam()};
cnb.onclick=()=>cnat.click();
cnat.onchange=()=>{addFiles([...cnat.files]);cnat.value="";updCount()};
q("#cshot").onclick=()=>{
if(!stream)return;
const w=vid.videoWidth,h=vid.videoHeight;
if(!w)return;
const k=Math.min(1,1600/Math.max(w,h));
cv.width=Math.round(w*k);cv.height=Math.round(h*k);
cv.getContext("2d").drawImage(vid,0,0,cv.width,cv.height);
cv.toBlob(b=>{
if(!b)return;
addFiles([new File([b],"photo-"+Date.now()+".jpg",{type:"image/jpeg"})]);
updCount();
if(FILES.length>=3)dcam.close();
},"image/jpeg",0.85);
};
q("#phcam").onclick=()=>{
if(FILES.length>=3){say("3 photos maximum. Retirez-en une pour en reprendre.");return}
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){cnat.click();return}
dcam.showModal();startCam();
};
q("#phgal").onclick=()=>ph.click();
ph.addEventListener("change",()=>addFiles([...ph.files]));
q("#phth").onclick=e=>{const b=e.target.closest("[data-r]");if(!b)return;const i=+b.dataset.r;URL.revokeObjectURL(URLS[i]);FILES.splice(i,1);URLS.splice(i,1);push();say("")};
const sf=q("#sf");
if(sf)sf.addEventListener("reset",()=>setTimeout(clearAll,0));
}
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const GEO={"Abidjan":[5.36,-4.0083],"Yamoussoukro":[6.8276,-5.2893],"Bouaké":[7.6906,-5.0303],"Daloa":[6.8774,-6.4502],"San-Pédro":[4.7485,-6.6363],"Korhogo":[9.458,-5.6295],"Man":[7.4125,-7.5538]};
function hav(a,b,c,d){const r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,k=Math.sin(x/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)**2;return 12742*Math.asin(Math.sqrt(k))}
function nearest(lat,lng){let b=null,bd=1e9;for(const c in GEO){const d=hav(lat,lng,GEO[c][0],GEO[c][1]);if(d<bd){bd=d;b=c}}return bd<=120?b:null}
let nearCity=null,gs="unknown",OFF=[];
const chip=document.createElement("div");chip.id="geochip";
const offers=document.createElement("section");offers.id="offers";
offers.innerHTML='<div id="onear" hidden><div class="chead"><h3>📍 Près de chez vous</h3></div><div class="mrow"></div></div><div id="odeal" hidden><div class="chead"><h3>🔥 Bonnes affaires</h3></div><p class="meta">Des prix au moins 15 % sous la moyenne de leur catégorie.</p><div class="mrow"></div></div>';
function place(){const h=q("#hero"),c=q("#hcats");if(h&&c){h.before(chip);c.after(offers);return true}return false}
let tries=0;
const iv=setInterval(()=>{
if(place()){clearInterval(iv);vis();return}
if(++tries>40){clearInterval(iv);q("#f").after(chip);chip.after(offers);vis()}
},100);
const isHome=()=>mode==="all"&&!cat&&!q("#q").value.trim()&&!q("#fv").value&&!q("#fe").value;
function vis(){const h=isHome();chip.hidden=!h;offers.hidden=!h||(q("#onear").hidden&&q("#odeal").hidden)}
const L0=window.labels;window.labels=function(){const r=L0.apply(this,arguments);vis();return r};
const D0=window.load;window.load=async function(){vis();const r=await D0.apply(this,arguments);vis();return r};
function renderChip(){
const ask='<span>📍 Voir les offres près de chez vous</span><button type="button" data-a="on" class="pri">Activer</button>';
const bt='<span class="gbtns"><button type="button" data-a="refresh">Actualiser</button><button type="button" data-a="off">Désactiver</button></span>';
const m={unknown:ask,off:ask,loading:"<span>📍 Recherche de votre position…</span>",city:"<span>📍 Près de <b>"+esc(nearCity||"")+"</b></span>"+bt,none:"<span>📍 Position activée : aucune ville Finder proche</span>"+bt,denied:'<span>📍 Localisation refusée. Autorisez-la dans les réglages du navigateur.</span><button type="button" data-a="on">Réessayer</button>',fail:'<span>📍 Position introuvable pour le moment.</span><button type="button" data-a="on">Réessayer</button>'};
chip.innerHTML=m[gs]||ask;
}
function locate(){
return new Promise(res=>{
if(!navigator.geolocation){res({err:"fail"});return}
navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lng:p.coords.longitude}),e=>res({err:e&&e.code===1?"denied":"fail"}),{enableHighAccuracy:false,timeout:12000,maximumAge:600000});
});
}
async function activate(){
gs="loading";renderChip();
const r=await locate();
if(r.err){gs=r.err;if(r.err==="denied")LS.set("finder_geo","off");renderChip();return}
nearCity=nearest(r.lat,r.lng);
LS.set("finder_geo","on");LS.set("finder_city",JSON.stringify({c:nearCity,t:Date.now()}));
gs=nearCity?"city":"none";renderChip();renderOffers();
}
function deactivate(){LS.set("finder_geo","off");LS.del("finder_city");nearCity=null;gs="off";renderChip();renderOffers()}
chip.onclick=e=>{
const b=e.target.closest("[data-a]");if(!b)return;
const a=b.dataset.a;
if(a==="on"){if(LS.get("finder_geo")==="on")activate();else q("#dgeo").showModal()}
else if(a==="refresh")activate();
else if(a==="off")deactivate();
};
q("#geono").onclick=()=>q("#dgeo").close();
q("#geook").onclick=()=>{q("#dgeo").close();LS.set("finder_geo","on");activate()};
(function init(){
const g=LS.get("finder_geo");
if(g==="on"){
let c=null;
try{const o=JSON.parse(LS.get("finder_city")||"null");if(o&&Date.now()-o.t<43200000)c={v:o.c}}catch(e){}
if(c){nearCity=c.v||null;gs=nearCity?"city":"none"}
else if(navigator.permissions&&navigator.permissions.query){
navigator.permissions.query({name:"geolocation"}).then(p=>{if(p.state==="granted")activate();else{gs="unknown";renderChip()}}).catch(()=>{gs="unknown";renderChip()});
}
}else gs=g==="off"?"off":"unknown";
renderChip();
})();
const mini=(i,off)=>'<article class="mini" data-id="'+i.id+'">'+(i.photos&&i.photos[0]?'<img loading="lazy" src="'+esc(i.photos[0])+'" alt="">':'<div class="mph"></div>')+(off?'<span class="mtag">-'+off+'%</span>':"")+"<b>"+fcfa(i.price)+"</b><p>"+esc(i.title)+"</p><small>"+esc(i.city)+"</small></article>";
function renderOffers(){
const near=nearCity?OFF.filter(i=>i.city===nearCity).slice(0,10):[];
const by={};OFF.forEach(i=>{(by[i.category]=by[i.category]||[]).push(i.price)});
const med=c=>{const a=(by[c]||[]).filter(x=>x>0).sort((x,y)=>x-y);return a.length>=4?a[Math.floor(a.length/2)]:null};
const deals=OFF.map(i=>{const m=med(i.category);return m&&i.price>0&&i.price<=m*0.85?{i,off:Math.round((1-i.price/m)*100)}:null}).filter(Boolean).sort((a,b)=>((b.i.city===nearCity)-(a.i.city===nearCity))||(b.off-a.off)).slice(0,10);
q("#onear .mrow").innerHTML=near.map(i=>mini(i)).join("");q("#onear").hidden=!near.length;
q("#odeal .mrow").innerHTML=deals.map(d=>mini(d.i,d.off)).join("");q("#odeal").hidden=!deals.length;
vis();
}
async function loadOffers(){
const{data}=await sb.from("listings").select("*").eq("statut","actif").eq("vendu",false).order("created_at",{ascending:false}).limit(150);
OFF=(data||[]).filter(i=>!(user&&i.user_id===user.id));
renderOffers();
}
offers.onclick=async e=>{
const m=e.target.closest(".mini");if(!m)return;
const i=OFF.find(x=>x.id===m.dataset.id);if(!i)return;
if(!items.find(x=>x.id===i.id))items.push(i);
if(!pro[i.user_id]){
const[{data:p},{data:b}]=await Promise.all([sb.from("profils").select("*").eq("user_id",i.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",i.user_id).maybeSingle()]);
if(p)pro[i.user_id]=p;
if(b)shops[i.user_id]=b;
}
show(i);
};
q("#sell").addEventListener("click",()=>{if(nearCity&&q("#sv"))setTimeout(()=>{q("#sv").value=nearCity},0)});
sb.auth.onAuthStateChange(()=>setTimeout(loadOffers,1500));
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Votre position approximative</b>, si vous autorisez la localisation : elle est calculée sur votre appareil pour trouver la ville la plus proche et vous proposer des offres près de chez vous. Votre position précise n’est pas enregistrée sur nos serveurs.</li><li><b>Les photos prises avec l’appareil photo</b> dans Finder : elles sont traitées comme les autres photos d’annonce. La caméra n’est utilisée que pendant que vous prenez la photo.</li>");
const h8=hBy("#dpriv","8.");
if(h8&&h8.nextElementSibling)h8.nextElementSibling.insertAdjacentHTML("beforeend"," Si vous activez la localisation, la ville la plus proche est aussi mémorisée sur votre appareil pendant quelques heures pour éviter de redemander votre position.");
const hw=hBy("#dhelp","Porte-monnaie");
if(hw)hw.insertAdjacentHTML("beforebegin","<h3>Photos et localisation</h3><details><summary>Comment prendre une photo de mon article ?</summary><p>Dans « Vendre », appuyez sur « Prendre une photo », autorisez la caméra quand le navigateur le demande, cadrez l’article et appuyez sur le bouton rouge. Vous pouvez prendre jusqu’à 3 photos ou en choisir dans la galerie.</p></details><details><summary>Pourquoi Finder demande ma position ?</summary><p>Pour vous montrer les annonces de la ville la plus proche et les meilleures affaires. Votre position est calculée sur votre appareil et n’est pas enregistrée sur nos serveurs.</p></details><details><summary>Comment désactiver la localisation ?</summary><p>Sur l’accueil, appuyez sur « Désactiver » dans la bande « Près de ». Vous pouvez aussi retirer l’autorisation dans les réglages de votre navigateur.</p></details>");
}catch(e){}
vis();loadOffers();
})();
