// Finder - chatui.js : messagerie moderne
(function(){
if(window.__finderChatUI)return;window.__finderChatUI=1;
const q=s=>document.querySelector(s);
const dm=q("#dm"),mb=q("#mb"),mf=q("#mf"),mi=q("#mi");
if(!dm||!mb||!mf||!mi)return;
const css=document.createElement("style");
css.textContent=`
#dm{position:relative}
#dm[open]{display:flex;flex-direction:column;width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;margin:0!important;border-radius:0!important;padding:0!important;overflow:hidden}
@media(min-width:700px){#dm[open]{width:min(94vw,520px)!important;max-width:520px!important;height:86vh!important;max-height:86vh!important;margin:auto!important;border-radius:22px!important}}
#dm>.whd,#dm #mt{display:none!important}
.chh{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top)) 12px 10px;background:#fff;border-bottom:1px solid #E2EBEB;flex:0 0 auto}
.chb{border:0;background:none;font-size:2rem;line-height:1;padding:0 6px;color:#12212B;cursor:pointer}
.cav{width:44px;height:44px;flex:0 0 44px;border-radius:50%;background:#E8F6F5;color:#007782;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;overflow:hidden}
.cav img{width:100%;height:100%;object-fit:cover}
.chi{flex:1;min-width:0;display:flex;flex-direction:column}
.chi b{font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chs{font-size:.8rem;color:#5B6B73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chk{border:0;background:none;font-size:1.6rem;line-height:1;padding:4px 8px;color:#12212B;cursor:pointer}
.chc{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#F4FAFA;border-bottom:1px solid #E2EBEB;flex:0 0 auto}
.chc img,.cth0{width:46px;height:46px;border-radius:10px;object-fit:cover;background:#DDE8E8;flex:0 0 46px}
.chcb{flex:1;min-width:0;display:flex;flex-direction:column;font-size:.82rem}
.chcb b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chcb span{color:#007782;font-weight:700}
.chcb .old{color:#8A979D;font-weight:400}
.chg{background:#FFE9D6;color:#B45309;border-radius:999px;padding:1px 8px;font-size:.7rem;margin-left:4px}
.chg.v{background:#E3F0FF;color:#1D4ED8}
.chc .sbtn{padding:7px 11px;border-radius:999px;border:1.5px solid #BFE5E1;background:#fff;font-size:.8rem;cursor:pointer;white-space:nowrap}
.chc .sbtn.pri{background:#007782;color:#fff;border-color:#007782}
#chm{position:absolute;right:10px;top:calc(58px + env(safe-area-inset-top));background:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.22);padding:6px;z-index:6;min-width:230px}
#chm button{display:block;width:100%;text-align:left;border:0;background:none;padding:12px;border-radius:10px;font-size:.92rem;cursor:pointer}
#chm button:active{background:#EEF8F7}
#dm #rdvbox{max-height:30vh;overflow:auto;flex:0 0 auto}
#dm #mb{flex:1 1 auto;min-height:0;height:auto!important;max-height:none!important;overflow-y:auto;padding:12px;background:#FBFCFC;display:flex;flex-direction:column;gap:4px}
#mb .b{max-width:82%;padding:9px 13px 6px;border-radius:18px 18px 18px 6px;background:#EDF1F1;color:#12212B;line-height:1.35;align-self:flex-start;margin:0;word-break:break-word}
#mb .b.me{background:linear-gradient(135deg,#00877D,#007782);color:#fff;border-radius:18px 18px 6px 18px;align-self:flex-end}
#mb .b.bimg{padding:5px 5px 6px;background:#EDF1F1}
#mb .b.me.bimg{background:linear-gradient(135deg,#00877D,#007782)}
#mb .b img,#mb .b video{max-width:100%;max-height:300px;border-radius:14px;display:block}
#mb .b.bimg .bm{padding:0 8px}
.bm{display:flex;justify-content:flex-end;align-items:center;gap:4px;font-size:.68rem;opacity:.75;margin-top:3px}
.tk{color:rgba(255,255,255,.75)}.tk.rd{color:#8EE7FF}
.dsep{align-self:center;margin:8px 0 4px}
.dsep span{background:#E8EEEE;color:#5B6B73;border-radius:999px;padding:3px 12px;font-size:.72rem}
#chq{display:flex;gap:6px;overflow-x:auto;padding:6px 10px;scrollbar-width:none;flex:0 0 auto;background:#fff}
#chq::-webkit-scrollbar{display:none}
#chq button{border:1.5px solid #BFE5E1;background:#EEF8F7;color:#005961;border-radius:999px;padding:7px 12px;white-space:nowrap;font-size:.85rem;cursor:pointer}
#dm .ctools{display:none!important}
#dm #mf{display:flex!important;align-items:center;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));border-top:1px solid #E2EBEB;background:#fff;flex:0 0 auto;margin:0}
#dm #mf #mi{flex:1;min-width:0;border-radius:22px;background:#F1F3F3;border:0;padding:12px 16px;font-size:1rem}
.chp{width:42px;height:42px;flex:0 0 42px;border-radius:50%;border:0;background:#EEF8F7;color:#007782;font-size:1.6rem;line-height:1;cursor:pointer}
#msnd{width:46px;height:46px;flex:0 0 46px;border-radius:50%;border:0;background:#007782;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;font-size:0}
#chs{position:absolute;left:10px;right:10px;bottom:calc(72px + env(safe-area-inset-bottom));background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.22);padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;z-index:6}
#chs button{border:0;background:#F4FAFA;border-radius:14px;padding:12px 4px;font-size:.78rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;color:#12212B}
#chs button i{font-style:normal;font-size:1.5rem}
.chrow{display:flex!important;align-items:center;gap:12px;width:100%;text-align:left;padding:12px;border:0;border-bottom:1px solid #EEF3F3;background:#fff;border-radius:0;cursor:pointer}
.chrow .cbd{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.chrow .cl1{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.chrow .cl1 small{color:#8A979D;font-size:.72rem;white-space:nowrap}
.chrow .cl2{font-size:.78rem;color:#007782;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chrow .cl3{font-size:.85rem;color:#5B6B73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chrow.nl .cl3{color:#12212B;font-weight:700}
.chrow .cth{width:42px;height:42px;border-radius:9px;object-fit:cover;flex:0 0 42px;background:#DDE8E8}
.chrow .dot{margin:0}
`;
document.head.appendChild(css);
const SEND='<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M3 20.5v-6.8l11-1.7-11-1.7V3.5L22 12z"/></svg>';
const MIC='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const T1='<svg class="tk" viewBox="0 0 16 11" width="15" height="11"><path d="M1 5.5l3.5 3.5L11 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const T2='<svg class="tk rd" viewBox="0 0 20 11" width="19" height="11"><path d="M1 5.5l3.5 3.5L11 1M8 8.5l1 .5L16 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
dm.insertAdjacentHTML("afterbegin",'<div class="chh" id="chh"><button type="button" class="chb" id="chb" aria-label="Retour">‹</button><div class="cav" id="chav"></div><div class="chi"><b id="chn">…</b><span class="chs" id="chsub"></span></div><button type="button" class="chk" id="chk" aria-label="Menu">⋮</button></div><div class="chc" id="chc" hidden></div><div id="chm" hidden><button type="button" data-m="ann">📄 Voir l’annonce</button><button type="button" data-m="shop" id="chmshop">🏪 Voir la boutique</button><button type="button" data-m="rdv">📅 Proposer un rendez-vous</button><button type="button" data-m="rep">🚩 Signaler cette conversation</button></div>');
mf.insertAdjacentHTML("beforebegin",'<div id="chq"></div><div id="chs" hidden><button type="button" data-a="photo"><i>📷</i>Photo</button><button type="button" data-a="gal"><i>🖼️</i>Galerie</button><button type="button" data-a="video"><i>🎥</i>Vidéo</button><button type="button" data-a="voc"><i>🎤</i>Vocal</button><button type="button" data-a="rdv"><i>📅</i>Rendez-vous</button><button type="button" data-a="req"><i>🔎</i>Demander une photo</button></div>');
mf.insertAdjacentHTML("afterbegin",'<button type="button" class="chp" id="chp" aria-label="Joindre">＋</button>');
const snd=[...mf.querySelectorAll("button")].find(b=>b.id!=="chp");
if(snd)snd.id="msnd";
let LST=null;const NC={};
const av=w=>w.logo?'<img src="'+esc(w.logo)+'" alt="">':esc((w.nm||"?").slice(0,1).toUpperCase());
function upd(){
if(!snd)return;
const has=mi.value.trim().length>0;
snd.innerHTML=has?SEND:MIC;snd.dataset.mode=has?"send":"mic";
q("#chq").style.display=has?"none":"flex";
}
mi.addEventListener("input",upd);
mf.addEventListener("submit",()=>setTimeout(upd,60));
if(snd)snd.addEventListener("click",e=>{
if(snd.dataset.mode==="mic"){e.preventDefault();e.stopPropagation();const v=q(".ctools [data-vt]");if(v)v.click()}
},true);
async function who(id){
if(NC[id])return NC[id];
let nm=(typeof shops!=="undefined"&&shops[id]&&shops[id].nom)||(typeof pro!=="undefined"&&pro[id]&&pro[id].nom)||"",logo=(typeof shops!=="undefined"&&shops[id]&&shops[id].logo_url)||"";
try{
if(!nm||!logo){
const r=await Promise.all([sb.from("profils").select("nom").eq("user_id",id).maybeSingle(),sb.from("boutiques").select("nom,logo_url").eq("user_id",id).maybeSingle()]);
nm=(r[1].data&&r[1].data.nom)||nm||(r[0].data&&r[0].data.nom)||"Utilisateur";
logo=(r[1].data&&r[1].data.logo_url)||logo;
}
}catch(e){nm=nm||"Utilisateur"}
return NC[id]={nm,logo};
}
function fc(n){return String(fcfa(n)).replace(/[\u202f\u00a0]/g," ")}
function card(){
const c=q("#chc");
if(!LST){c.hidden=true;return}
const l=LST,res=l.reserve_jusqu&&new Date(l.reserve_jusqu)>new Date();
const tag=l.vendu?'<span class="chg">Vendu</span>':res?'<span class="chg v">Réservé</span>':"";
const can=acct==="client"&&!l.vendu&&l.user_id!==user.id;
const ph=l.photos&&l.photos[0];
c.innerHTML=(ph?'<img src="'+esc(ph)+'" alt="">':'<div class="cth0"></div>')+'<div class="chcb"><b>'+esc(l.title)+"</b><span>"+fc(l.price)+(l.prix_initial&&l.prix_initial>l.price?' <s class="old">'+fc(l.prix_initial)+"</s>":"")+" "+tag+"</span></div>"+(can?'<button type="button" class="sbtn" data-offer="'+l.id+'">🤝 Offre</button>':"")+'<button type="button" class="sbtn pri" id="chv">Voir</button>';
c.hidden=false;
q("#chmshop").hidden=!(LST.user_id===chat.other);
}
function chips(){
const p=LST?LST.price:0;let a;
if(acct==="client"){
const o=p>=2000?Math.round(p*0.9/500)*500:0;
a=["Bonjour, est-il toujours disponible ?",o?"Vous pouvez faire "+fc(o)+" ?":"Dernier prix ?","Où et quand peut-on se voir ?","Vous livrez ?","Pouvez-vous m’envoyer plus de photos ?"];
}else{
a=["Oui, il est toujours disponible.","Le prix est ferme, désolé.","Je peux faire un petit geste sur le prix.","On peut se voir dans un lieu public, quand êtes-vous disponible ?","Je peux le livrer, quelle est votre commune ?"];
}
q("#chq").innerHTML=a.map(t=>'<button type="button">'+esc(t)+"</button>").join("");
}
q("#chq").addEventListener("click",e=>{
const b=e.target.closest("button");if(!b)return;
mi.value=b.textContent;
if(mf.requestSubmit)mf.requestSubmit();else mf.dispatchEvent(new Event("submit",{cancelable:true}));
setTimeout(upd,80);
});
q("#chb").onclick=()=>dm.close();
q("#chk").onclick=e=>{e.stopPropagation();q("#chs").hidden=true;q("#chm").hidden=!q("#chm").hidden};
q("#chp").onclick=e=>{
e.stopPropagation();q("#chm").hidden=true;
const s=q("#chs"),map={photo:'[data-ct="photo"]',gal:'[data-ct="gal"]',video:'[data-ct="video"]',voc:"[data-vt]",rdv:"[data-ct2]",req:'[data-ct="req"]'};
s.querySelectorAll("[data-a]").forEach(b=>{const t=q(".ctools "+map[b.dataset.a]);b.style.display=t&&!t.hidden?"":"none"});
s.hidden=!s.hidden;
};
q("#chs").addEventListener("click",e=>{
const b=e.target.closest("[data-a]");if(!b)return;
q("#chs").hidden=true;
const map={photo:'[data-ct="photo"]',gal:'[data-ct="gal"]',video:'[data-ct="video"]',voc:"[data-vt]",rdv:"[data-ct2]",req:'[data-ct="req"]'};
const t=q(".ctools "+map[b.dataset.a]);if(t)t.click();
});
dm.addEventListener("click",e=>{
if(!e.target.closest("#chm,#chk"))q("#chm").hidden=true;
if(!e.target.closest("#chs,#chp"))q("#chs").hidden=true;
});
function ensureItem(){if(LST&&typeof items!=="undefined"&&!items.find(x=>x.id===LST.id))items.push(LST)}
async function openAnn(){
if(!LST)return;ensureItem();dm.close();
try{await show(LST)}catch(e){}
}
document.addEventListener("click",e=>{if(e.target.closest("#chv"))openAnn()});
q("#chm").addEventListener("click",async e=>{
const b=e.target.closest("[data-m]");if(!b)return;
q("#chm").hidden=true;
const m=b.dataset.m;
if(m==="ann")openAnn();
else if(m==="shop"){dm.close();sellerId=chat.other;mode="seller";if(typeof labels==="function")labels();load()}
else if(m==="rdv"){const t=q(".ctools [data-ct2]");if(t)t.click()}
else if(m==="rep"){
const t=LST?LST.title:"";const n=q("#chn").textContent;
dm.close();
try{await openSupport();const f=q("#sf2");if(f&&f.msg)f.msg.value="Je signale la conversation avec "+n+" concernant l’annonce « "+t+" ». Raison : "}catch(x){}
}
});
function dayLabel(d){
const t=new Date(),y=new Date(Date.now()-864e5);
if(d.toDateString()===t.toDateString())return"Aujourd’hui";
if(d.toDateString()===y.toDateString())return"Hier";
return d.toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
}
let busy=false,tm2;
async function decorate(){
if(busy||typeof chat==="undefined"||!chat||!user)return;
const bs=[...mb.querySelectorAll(":scope>.b")];
if(!bs.length||bs.every(b=>b.dataset.t))return;
busy=true;
try{
const r=await sb.from("messages").select("created_at,sender_id").eq("listing_id",chat.lid).or("sender_id.eq."+chat.other+",receiver_id.eq."+chat.other).order("created_at");
const data=r.data,b2=[...mb.querySelectorAll(":scope>.b")];
if(data&&data.length===b2.length){
let day="";
b2.forEach((b,i)=>{
if(b.dataset.t)return;
b.dataset.t="1";
const d=new Date(data[i].created_at),dk=d.toDateString();
const tm=d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
if(dk!==day){day=dk;b.insertAdjacentHTML("beforebegin",'<div class="dsep"><span>'+dayLabel(d)+"</span></div>")}
const mine=b.classList.contains("me");
const s=b.querySelector(".st");
const read=s&&/Lu/.test(s.textContent);
if(s)s.remove();
if(b.querySelector("img,video")){
b.classList.add("bimg");
const f=b.firstChild;
if(f&&f.nodeType===3&&/^\s*(📷 Photo|🎥 Vidéo)\s*$/.test(f.nodeValue))f.remove();
}
b.insertAdjacentHTML("beforeend",'<div class="bm">'+tm+(mine?" "+(read?T2:T1):"")+"</div>");
});
mb.scrollTop=mb.scrollHeight;
}
}catch(e){}
busy=false;
}
new MutationObserver(()=>{clearTimeout(tm2);tm2=setTimeout(decorate,40)}).observe(mb,{childList:true});
async function setup(){
if(typeof chat==="undefined"||!chat)return;
const cid=chat.lid+"|"+chat.other;
q("#chm").hidden=true;q("#chs").hidden=true;
q("#chn").textContent="…";q("#chav").textContent="";
q("#chsub").textContent=(q("#mt").textContent||"").trim();
const ms=q("#mst"),inf=q(".chi");
if(ms&&!inf.contains(ms))inf.appendChild(ms);
const r=await Promise.all([who(chat.other),sb.from("listings").select("*").eq("id",chat.lid).maybeSingle()]);
if(!chat||chat.lid+"|"+chat.other!==cid)return;
const w=r[0];
LST=r[1].data||null;
q("#chn").textContent=w.nm;q("#chav").innerHTML=av(w);
if(!q("#chsub").textContent&&LST)q("#chsub").textContent=LST.title;
ensureItem();card();chips();upd();decorate();
}
const oc=window.openChat;
if(typeof oc==="function"){
window.openChat=async function(){
const r=await oc.apply(this,arguments);
setup();
return r;
};
}
upd();
// ===== Boîte de réception =====
function prev(m){
const b=String(m.body||"");
let t;
if(/⟦photo/i.test(b))t="📷 Photo";
else if(/⟦video/i.test(b))t="🎥 Vidéo";
else if(/⟦(audio|vocal)/i.test(b))t="🎤 Message vocal";
else t=b.replace(/⟦[^⟧]*⟧/g,"").trim()||"Message";
return(m.sender_id===user.id?"Vous : ":"")+t;
}
function tlabel(ts){
const d=new Date(ts),t=new Date(),y=new Date(Date.now()-864e5);
if(d.toDateString()===t.toDateString())return d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
if(d.toDateString()===y.toDateString())return"Hier";
return d.toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"});
}
window.openInbox=async function(){
if(!user){q("#da").showModal();return}
try{if(typeof askNotif==="function")askNotif()}catch(e){}
const il=q("#il");
il.innerHTML='<p class="meta" style="padding:14px">Chargement…</p>';
if(!q("#di").open)q("#di").showModal();
const r=await sb.from("messages").select("*").order("created_at",{ascending:false}).limit(300);
const seen=new Map();
for(const m of r.data||[]){
const o=m.sender_id===user.id?m.receiver_id:m.sender_id,k=m.listing_id+"|"+o;
if(!seen.has(k))seen.set(k,{lid:m.listing_id,o,last:m,u:0});
if(m.receiver_id===user.id&&!m.lu)seen.get(k).u++;
}
const L=[...seen.values()];
if(!L.length){il.innerHTML='<p class="meta" style="padding:18px;text-align:center">Aucune conversation pour le moment. Écris à un vendeur depuis une annonce.</p>';return}
const lids=[...new Set(L.map(x=>x.lid))],uids=[...new Set(L.map(x=>x.o))];
const [a,b,c]=await Promise.all([
sb.from("listings").select("id,title,photos").in("id",lids),
sb.from("profils").select("user_id,nom").in("user_id",uids),
sb.from("boutiques").select("user_id,nom,logo_url").in("user_id",uids)
]);
const LM={},PM={},BM={};
(a.data||[]).forEach(x=>LM[x.id]=x);
(b.data||[]).forEach(x=>PM[x.user_id]=x);
(c.data||[]).forEach(x=>BM[x.user_id]=x);
il.innerHTML=L.map(x=>{
const l=LM[x.lid]||{},bq=BM[x.o],nm=(bq&&bq.nom)||(PM[x.o]&&PM[x.o].nom)||"Utilisateur";
const lg=bq&&bq.logo_url;
const ttl=l.title||"Annonce";
const th=l.photos&&l.photos[0];
return'<button type="button" class="conv chrow'+(x.u?" nl":"")+'" data-l="'+x.lid+'" data-o="'+x.o+'" data-t="'+esc(ttl)+'"><span class="cav">'+(lg?'<img src="'+esc(lg)+'" alt="">':esc(nm.slice(0,1).toUpperCase()))+'</span><span class="cbd"><span class="cl1"><b>'+esc(nm)+"</b><small>"+tlabel(x.last.created_at)+'</small></span><span class="cl2">'+esc(ttl)+'</span><span class="cl3">'+esc(prev(x.last))+"</span></span>"+(th?'<img class="cth" src="'+esc(th)+'" alt="">':"")+(x.u?'<span class="dot">'+x.u+"</span>":"")+"</button>";
}).join("");
};
const ms=q("#msgs");if(ms)ms.onclick=window.openInbox;
})();
// FIN DU FICHIER
