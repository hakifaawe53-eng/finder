// Finder - voir.js : photos guidées, vidéo de l'article, badges
(function(){
if(window.__finderVoir)return;window.__finderVoir=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>50)clearInterval(iv)},200)};
const ph=q("#ph"),sc=q("#sc"),sf=q("#sf");
if(!ph||!sc||!sf)return;
const MAXP=6,MAXV=30,MAXMB=30;
const MINP=c=>c==="Véhicules et motos"?4:(c==="Téléphones"||c==="Informatique"||c==="Électronique")?3:2;
Object.assign(ERR,{"photos insuffisantes":"Ajoutez plus de photos : 3 minimum (4 pour les véhicules, 2 pour les autres catégories)."});
const SHOTS={
"Téléphones":["Face avant, écran allumé","Dos de l’appareil","Côtés et coins","Accessoires et boîte (sans numéro visible)"],
"Informatique":["Vue d’ensemble, allumé","Écran allumé","Ports et côtés","Dessous (sans numéro de série visible)","Chargeur et accessoires"],
"Électronique":["Vue d’ensemble","Allumé, en fonctionnement","Ports et accessoires","Défauts éventuels"],
"Véhicules et motos":["Avant","Arrière","Côté gauche","Côté droit","Tableau de bord et compteur","Moteur"],
"Vêtements":["Vue d’ensemble","Étiquette (taille et marque)","Détail du tissu","Défauts éventuels"],
"Chaussures":["Paire vue de côté","Dessus","Semelle","Défauts éventuels"],
"Meubles":["Vue d’ensemble","Détail de la matière","Dimensions (avec un objet repère)","Défauts éventuels"],
"Électroménager":["Vue d’ensemble","Étiquette (puissance, modèle)","En fonctionnement","Défauts éventuels"],
"Bébé et enfants":["Vue d’ensemble","Étiquette et sécurité","Détail","Défauts éventuels"],
"Autres":["Vue d’ensemble","Détail","Défauts éventuels"]
};
const st=document.createElement("style");
st.textContent=`
.phbtns{display:flex;gap:8px;margin:6px 0}
.phbtns button{flex:1}
.phth{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
.pth{position:relative;width:84px;height:84px}
.pth img{width:100%;height:100%;object-fit:cover;border-radius:12px}
.pth button{position:absolute;top:-6px;right:-6px;width:24px;height:24px;padding:0;border-radius:50%;border:0;background:#E5484D;color:#fff;line-height:24px}
.camctl{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}
#c2v{width:100%;max-height:58vh;aspect-ratio:3/4;object-fit:cover;background:#000;border-radius:16px;display:block}
#c2s{width:68px;height:68px;border-radius:50%;border:5px solid #fff;background:#E5484D;box-shadow:0 0 0 3px #E5484D;padding:0}
#c2s.rec{border-radius:14px;width:60px;height:60px}
#c2f{width:48px;height:48px;padding:0;border-radius:50%}
.vstep{background:#EEF8F7;border:1px solid #BFE5E1;border-radius:14px;padding:8px 12px;margin:8px 0;font-size:.9rem}
.vchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.vchips span{background:#fff;border:1px solid #E2EBEB;border-radius:999px;padding:3px 10px;font-size:.78rem}
.vchips span.ok{background:#E3F8EE;border-color:#9ED9B8;color:#0F8A55}
.vvid video,.vplay video{width:100%;max-height:50vh;border-radius:14px;background:#000;margin-top:6px}
.mbs{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.mbs span{background:#E8F6F5;color:#005961;border-radius:999px;padding:1px 8px;font-size:.7rem;font-weight:600}
.vlive{color:#0F8A55;font-size:.85rem;margin:4px 0}
.vown{background:#EEF8F7;border:1px solid #BFE5E1;border-radius:16px;padding:12px 14px;margin:12px 0}
.vown h3{margin:0 0 6px}
`;
document.head.appendChild(st);
let FILES=[],URLS=[],VID=null;
const say=t=>{const m=q("#vmsg");if(m)m.textContent=t};
/* Interface du formulaire Vendre */
ph.hidden=true;
when("#phui",e=>{e.hidden=true});
const ui=document.createElement("div");
ui.id="vui";
ui.innerHTML='<div class="vstep" id="vhint"></div><div class="phbtns"><button type="button" id="vcam" class="pri">📷 Prendre les photos</button><button type="button" id="vgal">🖼️ Galerie</button></div><div id="vth" class="phth"></div><div class="vstep"><b>🎥 Vidéo de l’article</b> <small>(recommandé, 30 secondes maximum)</small><div id="vvid" class="vvid"></div><div class="phbtns"><button type="button" id="vrec">🎥 Filmer</button><button type="button" id="vpick">📁 Choisir une vidéo</button></div></div><p class="meta" id="vmsg"></p><input type="file" id="vgf" accept="image/*" multiple hidden><input type="file" id="vgv" accept="video/*" hidden>';
ph.after(ui);
function hint(){
const c=sc.value,L=SHOTS[c]||SHOTS.Autres,min=MINP(c);
q("#vhint").innerHTML="<b>📌 Photos conseillées</b> <small>(minimum "+min+", maximum "+MAXP+')</small><div class="vchips">'+L.map((t,i)=>'<span class="'+(i<FILES.length?"ok":"")+'">'+(i<FILES.length?"✓ ":(i+1)+". ")+esc(t)+"</span>").join("")+"</div>";
}
function draw(){
q("#vth").innerHTML=FILES.map((f,i)=>'<div class="pth"><img src="'+URLS[i]+'" alt=""><button type="button" data-r="'+i+'" aria-label="Retirer la photo">✕</button></div>').join("");
hint();
}
function push(){
try{const dt=new DataTransfer();FILES.forEach(f=>dt.items.add(f));ph.files=dt.files}catch(e){}
draw();
}
function addPhoto(f){
if(FILES.length>=MAXP){say(MAXP+" photos maximum.");return}
FILES.push(f);URLS.push(URL.createObjectURL(f));
say("");push();
}
function drawVid(){
const b=q("#vvid");
if(!VID){b.innerHTML="";return}
b.innerHTML='<video controls playsinline preload="metadata" src="'+VID.url+'"></video><p class="meta">Vidéo prête'+(VID.dur?" ("+VID.dur+" s)":"")+'</p><button type="button" class="sbtn" data-vd>Supprimer la vidéo</button>';
}
function setVideo(blob,type,dur){
if(VID)URL.revokeObjectURL(VID.url);
VID={blob,type,dur,url:URL.createObjectURL(blob)};
say("");drawVid();
}
ui.addEventListener("click",e=>{
const r=e.target.closest("[data-r]");
if(r){const i=+r.dataset.r;URL.revokeObjectURL(URLS[i]);FILES.splice(i,1);URLS.splice(i,1);say("");push();return}
if(e.target.closest("[data-vd]")){if(VID)URL.revokeObjectURL(VID.url);VID=null;drawVid()}
});
sc.addEventListener("change",hint);
sf.addEventListener("reset",()=>setTimeout(()=>{
URLS.forEach(u=>URL.revokeObjectURL(u));FILES=[];URLS=[];
if(VID)URL.revokeObjectURL(VID.url);
VID=null;draw();drawVid();say("");
},0));
/* Caméra : photos et vidéos */
document.body.insertAdjacentHTML("beforeend",'<dialog id="dcam2"><div class="whd"><button type="button" class="bk" id="c2x" aria-label="Fermer">←</button><h2 id="c2t">Appareil photo</h2></div><p class="vstep" id="c2h"></p><video id="c2v" playsinline muted autoplay></video><div class="camctl"><button type="button" id="c2f" aria-label="Changer de caméra">🔄</button><button type="button" id="c2s" aria-label="Capturer"></button><button type="button" class="pri" id="c2d">Terminer</button></div><p class="meta" id="c2m"></p><button type="button" class="sbtn" id="c2n" hidden>Utiliser l’appareil photo du téléphone</button><input type="file" id="c2nat" hidden></dialog><dialog id="dvid"><div class="whd"><button type="button" class="bk" data-x aria-label="Fermer">←</button><h2>Vidéo de l’article</h2></div><div class="vplay" id="vplay"></div></dialog>');
const dc=q("#dcam2"),cv=q("#c2v"),cm=q("#c2m"),c2n=q("#c2n"),shut=q("#c2s"),nat=q("#c2nat"),dvid=q("#dvid");
dvid.querySelector("[data-x]").onclick=()=>dvid.close();
dvid.addEventListener("close",()=>{q("#vplay").innerHTML=""});
let S=null;
const mimeOk=m=>window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m);
const pickMime=()=>["video/mp4;codecs=avc1.42E01E,mp4a.40.2","video/mp4","video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(mimeOk)||"";
function stopStream(){
if(S&&S.stream){S.stream.getTracks().forEach(t=>t.stop());S.stream=null}
cv.srcObject=null;
}
dc.addEventListener("close",()=>{
if(S){
clearInterval(S.timer);
if(S.rec&&S.rec.state==="recording"){S.cancel=true;try{S.rec.stop()}catch(e){}}
}
stopStream();
shut.classList.remove("rec");
S=null;
});
function upd(){
const h=q("#c2h");
if(S.mode==="video")h.textContent="Montrez l’article sous tous les angles, allumez-le si possible. "+MAXV+" secondes maximum.";
else h.textContent=S.hint?S.hint():"Cadrez l’article puis appuyez sur le bouton rouge.";
}
function fail(e){
stopStream();
cm.textContent=(e&&e.name==="NotAllowedError")?"L’accès à la caméra est refusé. Autorisez-la dans les réglages du navigateur, ou utilisez l’appareil photo du téléphone ci-dessous.":"Impossible d’ouvrir la caméra. Utilisez l’appareil photo du téléphone ci-dessous.";
c2n.hidden=false;
}
async function start(){
stopStream();
c2n.hidden=true;
const v={facingMode:{ideal:S.facing},width:{ideal:S.mode==="video"?1280:1920},height:{ideal:S.mode==="video"?720:1080}};
try{
S.stream=await navigator.mediaDevices.getUserMedia({video:v,audio:S.mode==="video"});
}catch(e){
if(S.mode==="video"){
try{S.stream=await navigator.mediaDevices.getUserMedia({video:v,audio:false});cm.textContent="Micro indisponible : la vidéo sera sans son."}catch(e2){fail(e2);return}
}else{fail(e);return}
}
cv.srcObject=S.stream;
await cv.play().catch(()=>{});
}
async function openCap(o){
S={mode:o.mode,max:o.max||1,count:0,onShot:o.onShot,onVideo:o.onVideo,hint:o.hint,facing:"environment",stream:null,rec:null,timer:null,cancel:false};
q("#c2t").textContent=o.mode==="video"?"Filmer l’article":"Appareil photo";
cm.textContent="";c2n.hidden=true;
nat.accept=o.mode==="video"?"video/*":"image/*";
nat.setAttribute("capture","environment");
upd();
if(!dc.open)dc.showModal();
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||(o.mode==="video"&&!window.MediaRecorder)){fail(null);return}
await start();
}
function shot(){
if(!S||!S.stream)return;
const w=cv.videoWidth,h=cv.videoHeight;
if(!w)return;
const k=Math.min(1,1600/Math.max(w,h)),c=document.createElement("canvas");
c.width=Math.round(w*k);c.height=Math.round(h*k);
c.getContext("2d").drawImage(cv,0,0,c.width,c.height);
c.toBlob(b=>{
if(!b||!S)return;
const f=new File([b],"photo-"+Date.now()+".jpg",{type:"image/jpeg"});
f.live=true;
S.count++;
if(S.onShot)S.onShot(f);
if(S&&S.count>=S.max){dc.close();return}
if(S)upd();
},"image/jpeg",0.85);
}
function startRec(){
if(!S||!S.stream)return;
const mt=pickMime();
let rec;
try{rec=new MediaRecorder(S.stream,mt?{mimeType:mt,videoBitsPerSecond:1500000,audioBitsPerSecond:64000}:{videoBitsPerSecond:1500000})}catch(e){fail(e);return}
const chunks=[],t0=Date.now();
rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
rec.onstop=()=>{
if(!S||S.cancel)return;
clearInterval(S.timer);
shut.classList.remove("rec");
const dur=Math.round((Date.now()-t0)/1000);
const type=(rec.mimeType||mt||"video/webm").split(";")[0];
const blob=new Blob(chunks,{type});
if(dur<3){cm.textContent="Vidéo trop courte (3 secondes minimum). Recommencez.";return}
if(blob.size>MAXMB*1048576){cm.textContent="Vidéo trop lourde. Filmez moins longtemps.";return}
const cb=S.onVideo;
dc.close();
if(cb)cb(blob,type,dur);
};
S.rec=rec;
rec.start(1000);
shut.classList.add("rec");
S.timer=setInterval(()=>{
const s=Math.floor((Date.now()-t0)/1000);
cm.textContent="● Enregistrement 00:"+String(s).padStart(2,"0")+" / 00:"+MAXV;
if(s>=MAXV&&rec.state==="recording")rec.stop();
},250);
}
shut.onclick=()=>{
if(!S)return;
if(S.mode==="photo"){shot();return}
if(S.rec&&S.rec.state==="recording"){S.rec.stop();return}
startRec();
};
q("#c2f").onclick=()=>{if(S&&!(S.rec&&S.rec.state==="recording")){S.facing=S.facing==="environment"?"user":"environment";start()}};
q("#c2d").onclick=()=>dc.close();
q("#c2x").onclick=()=>dc.close();
c2n.onclick=()=>nat.click();
function vidMeta(b){
return new Promise(res=>{
const v=document.createElement("video");
v.preload="metadata";
v.onloadedmetadata=()=>{const d=v.duration;URL.revokeObjectURL(v.src);res(isFinite(d)?d:0)};
v.onerror=()=>res(0);
v.src=URL.createObjectURL(b);
});
}
async function checkVid(f){
if(f.size>MAXMB*1048576)return{msg:"Vidéo trop lourde ("+MAXMB+" Mo maximum). Filmez 20 secondes en qualité standard."};
const d=await vidMeta(f);
if(d>MAXV+5)return{msg:"Vidéo trop longue ("+MAXV+" secondes maximum)."};
return{dur:Math.round(d)||0};
}
nat.onchange=async()=>{
const f=nat.files[0];
nat.value="";
if(!f||!S)return;
if(S.mode==="photo"){
S.count++;
if(S.onShot)S.onShot(f);
if(S.count>=S.max)dc.close();else upd();
return;
}
const r=await checkVid(f);
if(r.msg){cm.textContent=r.msg;return}
const cb=S.onVideo;
dc.close();
if(cb)cb(f,f.type||"video/mp4",r.dur);
};
async function upPhoto(file,prefix){
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const p=user.id+"/"+prefix+"-"+Date.now()+"."+ext;
const r=await sb.storage.from("photos").upload(p,file);
if(r.error)return null;
return sb.storage.from("photos").getPublicUrl(p).data.publicUrl;
}
async function upVideo(blob,type,name){
const ct=type==="video/mp4"?"video/mp4":type==="video/quicktime"?"video/quicktime":"video/webm";
const ext=ct==="video/mp4"?"mp4":ct==="video/quicktime"?"mov":"webm";
const p=user.id+"/"+name+"."+ext;
const r=await sb.storage.from("videos").upload(p,blob,{contentType:ct,upsert:true});
if(r.error)return null;
return sb.storage.from("videos").getPublicUrl(p).data.publicUrl+"?v="+Date.now();
}
window.finderCapture={open:openCap,upPhoto,upVideo,checkVid};
/* Boutons du formulaire Vendre */
q("#vcam").onclick=()=>{
if(FILES.length>=MAXP){say(MAXP+" photos maximum. Retirez-en une pour en reprendre.");return}
openCap({mode:"photo",max:MAXP-FILES.length,hint:()=>{
const L=SHOTS[sc.value]||SHOTS.Autres,n=FILES.length;
return n<L.length?"📌 Photo "+(n+1)+" : "+L[n]:"📌 Photo supplémentaire (détail, défaut, accessoire…)";
},onShot:f=>addPhoto(f)});
};
q("#vgal").onclick=()=>q("#vgf").click();
q("#vgf").onchange=e=>{
for(const f of [...e.target.files]){
if(FILES.length>=MAXP){say(MAXP+" photos maximum.");break}
if(/^image\//.test(f.type))addPhoto(f);
}
e.target.value="";
};
q("#vrec").onclick=()=>openCap({mode:"video",onVideo:(b,t,d)=>setVideo(b,t,d)});
q("#vpick").onclick=()=>q("#vgv").click();
q("#vgv").onchange=async e=>{
const f=e.target.files[0];
e.target.value="";
if(!f)return;
const r=await checkVid(f);
if(r.msg){say(r.msg);return}
setVideo(f,f.type||"video/mp4",r.dur);
};
/* Publication : photos guidées et vidéo */
sf.onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#sm");
const min=MINP(f.cat.value);
if(FILES.length<min){m.textContent="Ajoutez au moins "+min+" photos pour cette catégorie ("+FILES.length+" actuellement).";return}
if(FILES.some(x=>x.size>5e6)){m.textContent="Chaque photo doit faire moins de 5 Mo.";return}
m.textContent="Publication en cours…";
const urls=[];
for(const[n,file]of FILES.entries()){
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const p=user.id+"/"+Date.now()+"-"+n+"."+ext;
const up=await sb.storage.from("photos").upload(p,file);
if(up.error){m.textContent="L’envoi d’une photo a échoué. Réessayez.";return}
urls.push(sb.storage.from("photos").getPublicUrl(p).data.publicUrl);
}
const live=FILES.length>0&&FILES.every(x=>x.live);
const hash=FILES[0]?await dhash(FILES[0]):null;
const vid=VID;
const{data:res,error}=await sb.rpc("publier_annonce",{p_title:f.ttl.value.trim(),p_price:+f.prix.value,p_category:f.cat.value,p_city:f.ville.value,p_etat:f.etat.value,p_marque:f.marque.value.trim()||null,p_description:f.desc.value.trim(),p_photos:urls,p_numero:f.numero.value.trim()||null,p_hash:hash,p_attest:f.att.checked});
if(error){m.textContent=err(error);return}
if(res&&res.id&&(vid||live)){
let vurl=null;
if(vid){m.textContent="Envoi de la vidéo…";vurl=await upVideo(vid.blob,vid.type,res.id)}
const r2=await sb.rpc("definir_media",{p_listing:res.id,p_video:vurl,p_live:live});
if(vid&&(!vurl||r2.error))alert("Votre annonce est publiée, mais la vidéo n’a pas pu être envoyée. Ouvrez l’annonce pour l’ajouter.");
}
f.reset();m.textContent="";q("#ds").close();numUI();
if(res&&res.statut==="en_revue")alert("Votre annonce est enregistrée. Elle est en cours de vérification par Finder et sera visible dès qu’elle sera approuvée.");
else if(res&&res.statut==="bloque")alert("Cette annonce n’a pas pu être publiée. Si vous pensez qu’il y a une erreur, contactez Finder.");
mode="mine";labels();load();refreshNotifs();
};
draw();drawVid();
/* Fiche d'un article */
const S7=window.show;
window.show=function(i){
const r=S7.apply(this,arguments);
try{extras(i)}catch(e){}
return r;
};
function extras(i){
const dc2=q("#dc"),h=dc2.querySelector("h2");
if(!h)return;
if(!dc2.querySelector("[data-vplay],.vlive")){
let html="";
if(i.video_url)html+='<button type="button" class="sbtn pri" data-vplay="'+esc(i.video_url)+'">▶ Voir la vidéo de l’article</button>';
if(i.photos_live)html+='<p class="vlive">📷 Photos prises sur le moment avec Finder</p>';
if(html)h.insertAdjacentHTML("beforebegin",html);
}
if(user&&user.id===i.user_id&&!i.vendu&&i.statut==="actif"&&!dc2.querySelector(".vown")){
const own='<div class="vown"><h3>🎥 Vidéo de l’annonce</h3>'+(i.video_url?'<p>Une vidéo est en ligne.</p><button type="button" class="sbtn" data-vadd="'+i.id+'">Remplacer la vidéo</button><button type="button" class="sbtn" data-vdel="'+i.id+'">Supprimer la vidéo</button>':'<p class="meta">Une courte vidéo rassure les acheteurs et vous fait vendre plus vite.</p><button type="button" class="sbtn pri" data-vadd="'+i.id+'">🎥 Filmer une vidéo</button>')+"</div>";
const del=dc2.querySelector(".del");
if(del)del.insertAdjacentHTML("beforebegin",own);else dc2.insertAdjacentHTML("beforeend",own);
}
}
async function refreshDetail(id){
await load();
const j=items.find(x=>x.id===id);
q("#dd").close();
if(j)show(j);
}
document.addEventListener("click",async e=>{
const p=e.target.closest("[data-vplay]");
if(p){
q("#vplay").innerHTML='<video controls autoplay playsinline src="'+esc(p.dataset.vplay)+'"></video>';
dvid.showModal();
return;
}
const a=e.target.closest("[data-vadd]");
if(a){
const id=a.dataset.vadd;
openCap({mode:"video",onVideo:async(blob,type)=>{
showToast("Envoi de la vidéo…","msg");
const url=await upVideo(blob,type,id);
if(!url){alert("L’envoi de la vidéo a échoué. Réessayez.");return}
const{error}=await sb.rpc("definir_media",{p_listing:id,p_video:url});
if(error){alert("Enregistrement de la vidéo impossible.");return}
showToast("Vidéo ajoutée ✓","msg");
refreshDetail(id);
}});
return;
}
const d=e.target.closest("[data-vdel]");
if(d){
if(!confirm("Supprimer la vidéo de cette annonce ?"))return;
const id=d.dataset.vdel,i=items.find(x=>x.id===id);
const{error}=await sb.rpc("definir_media",{p_listing:id,p_retirer:true});
if(error){alert("Suppression impossible.");return}
try{
const u=i&&i.video_url?i.video_url.split("/videos/")[1]:null;
if(u)await sb.storage.from("videos").remove([decodeURIComponent(u.split("?")[0])]);
}catch(x){}
refreshDetail(id);
}
});
/* Badges sur les cartes */
function badges(root){
root.querySelectorAll(".card").forEach(c=>{
if(c.dataset.mb)return;
const i=items.find(x=>x.id===c.dataset.id);
if(!i)return;
c.dataset.mb="1";
const t=[];
if(i.video_url)t.push("🎥 Vidéo");
if(i.photos_live)t.push("📷 Photos en direct");
if(!t.length)return;
const box=c.querySelector(":scope>div:last-child");
if(box)box.insertAdjacentHTML("beforeend",'<div class="mbs">'+t.map(x=>"<span>"+x+"</span>").join("")+"</div>");
});
}
["#grid","#srgrid"].forEach(sel=>when(sel,g=>{badges(g);new MutationObserver(()=>badges(g)).observe(g,{childList:true})}));
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Quelles photos prendre pour vendre vite ?</summary><p>Dans « Vendre », Finder vous indique les photos conseillées selon la catégorie (face, dos, détails, défauts) : minimum 3 pour les téléphones, l’informatique et l’électronique, 4 pour les véhicules, 2 pour le reste. Ne montrez jamais vos numéros de série ou votre IMEI sur les photos : ils restent privés.</p></details><details><summary>Comment ajouter une vidéo à mon annonce ?</summary><p>Dans « Vendre », appuyez sur « Filmer » (30 secondes maximum), ou ouvrez votre annonce plus tard et appuyez sur « Filmer une vidéo ». Montrez l’article sous tous les angles et allumez-le si possible.</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Les photos et vidéos d’une annonce doivent montrer l’article réellement vendu. Les contenus trompeurs ou interdits peuvent être retirés, et le compte suspendu.</li>");
}catch(e){}
})();
