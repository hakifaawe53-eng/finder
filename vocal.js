// Finder - vocal.js : messages vocaux, statut en ligne et temps de réponse
(function(){
if(window.__finderVocal)return;window.__finderVocal=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
const SBV=SB_URL+"/storage/v1/object/public/vocaux/";
const MAXS=120;
const st=document.createElement("style");
st.textContent=`
#vrb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#FFF4F4;border:1px solid #F5C6C6;border-radius:14px;padding:8px 12px;margin:6px 0}
#vrb[hidden]{display:none}
#vrt{font-weight:700;color:#D92D20;animation:vrp 1.2s ease-in-out infinite;flex:1}
@keyframes vrp{0%,100%{opacity:1}50%{opacity:.45}}
.caud{display:block;width:100%;max-width:260px;margin-top:6px}
.react{color:#6A7B84;font-size:.88rem;margin:2px 0}
.react[hidden]{display:none}
.rapid{background:#E3F8EE;color:#0F8A55;border-radius:999px;padding:1px 8px;font-size:.72rem;font-weight:600}
`;
document.head.appendChild(st);
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
/* Statut en ligne et temps de réponse */
const RC={};
async function react(u){
const c=RC[u];
if(c&&Date.now()-c.t<60000)return c.r;
const{data,error}=await sb.rpc("profil_reactivite",{p_user:u});
const r=error?null:data;
RC[u]={t:Date.now(),r};
return r;
}
function labVu(r){
if(!r||!r.visible)return"";
if(r.en_ligne)return"🟢 En ligne";
if(!r.vu)return"";
const mn=Math.round((Date.now()-new Date(r.vu))/60000);
if(mn<60)return"🕐 Vu il y a "+Math.max(mn,3)+" min";
if(mn<1440)return"🕐 Vu il y a "+Math.round(mn/60)+" h";
if(mn<10080)return"🕐 Vu il y a "+Math.round(mn/1440)+" j";
return"";
}
function labTemps(r){
if(!r||!(r.n>=3)||r.mediane==null)return"";
const m=+r.mediane;
const t=m<5?"en moins de 5 min":m<=15?"en moins de 15 min":m<=60?"en moins d’1 heure":m<=180?"en quelques heures":m<=1440?"dans la journée":"en 1 à 2 jours";
return"⚡ Répond en général "+t;
}
function labHtml(r){
if(!r)return"";
const tot=(r.n||0)+(r.sans_reponse||0);
const parts=[labVu(r),labTemps(r),tot>=5?"Taux de réponse "+Math.round((r.n||0)/tot*100)+" %":""].filter(Boolean);
let h=parts.join(" · ");
if(r.n>=5&&r.mediane!=null&&+r.mediane<=30)h+=(h?" ":"")+'<span class="rapid">⚡ Répond vite</span>';
return h;
}
async function fillReact(u){
const h=labHtml(await react(u));
document.querySelectorAll('.react[data-ru="'+u+'"]').forEach(e=>{e.innerHTML=h;e.hidden=!h});
}
const S8=window.show;
window.show=function(i){
const r=S8.apply(this,arguments);
try{
if(!(user&&user.id===i.user_id)){
const s=q("#dc .seller");
if(s&&!q("#dc .react")){
s.insertAdjacentHTML("afterend",'<p class="react" data-ru="'+i.user_id+'" hidden></p>');
fillReact(i.user_id);
}
}
}catch(e){}
return r;
};
const sh=q("#shophd");
if(sh)new MutationObserver(()=>{
if(sh.hidden||sh.querySelector(".react"))return;
const m=sh.querySelector(".sp-meta");
if(!m||typeof sellerId==="undefined"||!sellerId)return;
if(user&&user.id===sellerId)return;
m.insertAdjacentHTML("afterend",'<div class="react" data-ru="'+sellerId+'" hidden></div>');
fillReact(sellerId);
}).observe(sh,{childList:true});
/* Messagerie : statut de l'interlocuteur et messages vocaux */
const mt=q("#mt");
if(mt&&!q("#mst"))mt.insertAdjacentHTML("afterend",'<p class="react" id="mst" data-ru="" hidden></p>');
const O1=window.openChat;
window.openChat=async function(){
const r=await O1.apply(this,arguments);
try{
const e=q("#mst");
if(e&&chat){e.dataset.ru=chat.other;e.innerHTML="";e.hidden=true;fillReact(chat.other)}
}catch(x){}
return r;
};
setInterval(()=>{if(q("#dm").open&&chat&&q("#mst"))fillReact(chat.other)},30000);
let REC=null;
const mimeOk=m=>window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m);
const pick=()=>["audio/mp4;codecs=mp4a.40.2","audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"].find(mimeOk)||"";
function decorate(){
document.querySelectorAll("#mb .b").forEach(b=>{
if(b.dataset.av)return;
const m=/⟦audio\|([^|⟧]*)\|?(\d*)⟧/.exec(b.textContent);
if(!m)return;
b.dataset.av="1";
const ok=m[1].startsWith(SBV);
const h=ok?'<audio class="caud" controls preload="none" src="'+esc(m[1])+'"></audio>'+(m[2]?'<span class="meta"> '+fmt(+m[2])+"</span>":""):"";
b.innerHTML=b.innerHTML.replace(/⟦audio\|[^⟧]*⟧/,h);
});
}
async function sendVoc(blob,type,dur){
showToast("Envoi du message vocal…","msg");
const ct=(type==="audio/mp4"||type==="audio/aac"||type==="audio/x-m4a")?"audio/mp4":type==="audio/ogg"?"audio/ogg":type==="audio/mpeg"?"audio/mpeg":"audio/webm";
const ext=ct==="audio/mp4"?"m4a":ct==="audio/ogg"?"ogg":ct==="audio/mpeg"?"mp3":"webm";
const id=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2,14);
const p=user.id+"/"+id+"."+ext;
const r=await sb.storage.from("vocaux").upload(p,blob,{contentType:ct});
if(r.error){alert("L’envoi du message vocal a échoué.");return}
const url=sb.storage.from("vocaux").getPublicUrl(p).data.publicUrl;
const{error}=await sb.from("messages").insert({listing_id:chat.lid,receiver_id:chat.other,body:"🎤 Message vocal ("+fmt(dur)+") ⟦audio|"+url+"|"+dur+"⟧"});
if(error){alert("Envoi impossible. Réessayez.");return}
lastN="";
await loadChat();
}
function finish(){
const R=REC;
if(!R)return;
REC=null;
R.stream.getTracks().forEach(t=>t.stop());
if(R.cancel)return;
const dur=Math.round((Date.now()-R.t0)/1000);
if(dur<1)return;
const type=(R.rec.mimeType||R.mt||"audio/webm").split(";")[0];
const blob=new Blob(R.chunks,{type});
if(blob.size>5*1048576){alert("Message vocal trop long.");return}
sendVoc(blob,type,Math.min(dur,MAXS));
}
function endRec(cancel){
if(!REC)return;
REC.cancel=!!cancel;
clearInterval(REC.timer);
q("#vrb").hidden=true;
try{if(REC.rec.state==="recording")REC.rec.stop();else finish()}catch(e){finish()}
}
async function startVoc(){
if(!chat||REC)return;
if(!navigator.mediaDevices||!window.MediaRecorder){alert("L’enregistrement vocal n’est pas disponible sur cet appareil.");return}
let stream;
try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){alert("Autorisez le micro dans le navigateur pour envoyer un message vocal.");return}
const mt2=pick();
let rec;
try{rec=new MediaRecorder(stream,mt2?{mimeType:mt2,audioBitsPerSecond:48000}:{audioBitsPerSecond:48000})}catch(e){stream.getTracks().forEach(t=>t.stop());alert("Enregistrement impossible sur cet appareil.");return}
const chunks=[],t0=Date.now();
REC={rec,stream,chunks,t0,cancel:false,mt:mt2,timer:null};
rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
rec.onstop=()=>finish();
rec.start(500);
q("#vrb").hidden=false;
REC.timer=setInterval(()=>{
const s=Math.round((Date.now()-t0)/1000);
q("#vrt").textContent="● "+fmt(s)+" / "+fmt(MAXS);
if(s>=MAXS)endRec(false);
},250);
}
when(".ctools",tools=>{
tools.insertAdjacentHTML("beforeend",'<button type="button" class="sbtn" data-vt="1">🎤 Vocal</button>');
tools.insertAdjacentHTML("afterend",'<div id="vrb" hidden><span id="vrt">● 0:00</span><button type="button" class="sbtn" id="vrc">✕ Annuler</button><button type="button" class="sbtn pri" id="vrs">➤ Envoyer</button></div>');
tools.addEventListener("click",e=>{if(e.target.closest("[data-vt]"))startVoc()});
q("#vrs").onclick=()=>endRec(false);
q("#vrc").onclick=()=>endRec(true);
q("#dm").addEventListener("close",()=>endRec(true));
const L1=window.loadChat;
window.loadChat=async function(){const r=await L1.apply(this,arguments);decorate();return r};
decorate();
});
/* Réglage de confidentialité */
when("#dset",d=>{
const g=d.querySelector("#stgeo");
if(!g||d.querySelector("#stvis"))return;
g.insertAdjacentHTML("afterend",'<h3>Statut en ligne</h3><label class="chk"><input type="checkbox" id="stvis"> Afficher « En ligne » et « Vu il y a… » aux autres utilisateurs</label><p class="meta">Si vous le masquez, les autres ne voient ni votre statut ni l’heure de votre dernière visite. Votre temps de réponse reste affiché.</p>');
q("#stvis").onchange=async e=>{
const{error}=await sb.rpc("definir_statut_visible",{p_visible:e.target.checked});
if(error){alert("Réglage impossible.");e.target.checked=!e.target.checked;return}
await refreshMe();
delete RC[user.id];
};
new MutationObserver(()=>{if(d.open)q("#stvis").checked=!(me&&me.statut_visible===false)}).observe(d,{attributes:true,attributeFilter:["open"]});
});
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment envoyer un message vocal ?</summary><p>Dans la conversation, appuyez sur « Vocal », autorisez le micro, parlez, puis appuyez sur « Envoyer » (2 minutes maximum). L’autre personne peut l’écouter directement dans la conversation.</p></details><details><summary>Que signifie « Répond en général en… » ?</summary><p>C’est le temps médian que le vendeur met à répondre aux acheteurs sur les 30 derniers jours. Il s’affiche à partir de 3 échanges. Le statut « En ligne » peut être masqué dans Paramètres, rubrique Localisation et confidentialité.</p></details>");
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Messages vocaux et statut en ligne</b> : les messages vocaux sont stockés sur nos serveurs, visibles par les personnes concernées. Votre statut « en ligne » et l’heure de votre dernière visite peuvent être vus par les autres utilisateurs, sauf si vous les masquez dans les paramètres. Votre temps de réponse moyen est affiché sur vos annonces et votre boutique.</li>");
}catch(e){}
})();
