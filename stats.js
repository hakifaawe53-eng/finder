// Finder - stats.js : mesure d'audience anonyme
(function(){
if(window.__finderStats)return;window.__finderStats=1;
try{if(navigator.doNotTrack==="1"||/bot|crawl|spider|facebookexternalhit|whatsapp|preview|lighthouse|headless|pingdom|slurp/i.test(navigator.userAgent))return}catch(e){}
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const rid=()=>{try{return crypto.randomUUID()}catch(e){return Date.now().toString(36)+Math.random().toString(36).slice(2,12)}};
let vid=LS.get("finder_vid"),nouveau=false;
if(!vid||vid.length<8){vid=rid();LS.set("finder_vid",vid);nouveau=true}
let sid=LS.get("finder_sid");
const last=+LS.get("finder_last")||0;
if(!sid||Date.now()-last>30*60*1000){sid=rid();LS.set("finder_sid",sid)}
let pays="";
try{const c=JSON.parse(LS.get("finder_pays")||"null");if(c&&Date.now()-c.t<864e5)pays=c.c||""}catch(e){}
const device=()=>innerWidth<700?"mobile":innerWidth<1100?"tablette":"ordinateur";
const source=()=>{
try{
const s=new URL(location.href).searchParams.get("utm_source");
if(s)return s.toLowerCase();
const r=document.referrer;
if(r){const h=new URL(r).hostname.replace(/^www\./,"");if(h&&h!==location.hostname)return h}
}catch(e){}
return"";
};
async function country(){
if(pays)return;
for(const u of["/cdn-cgi/trace","https://www.cloudflare.com/cdn-cgi/trace"]){
try{
const t=await(await fetch(u,{cache:"no-store"})).text();
const m=/^loc=([A-Z]{2})$/m.exec(t);
if(m){pays=m[1];LS.set("finder_pays",JSON.stringify({c:pays,t:Date.now()}));return}
}catch(e){}
}
}
let first=true;
function ping(page){
LS.set("finder_last",String(Date.now()));
sb.rpc("suivre_visite",{p_sid:sid,p_vid:vid,p_pays:pays,p_appareil:device(),p_source:first?source():"",p_nouveau:first&&nouveau,p_page:!!page}).then(()=>{},()=>{});
first=false;
}
let evN=0;const seen={};
function trace(type,ref,meta){
if(evN>80)return;
const k=type+(ref||meta||""),now=Date.now();
if(seen[k]&&now-seen[k]<15000)return;
seen[k]=now;evN++;
LS.set("finder_last",String(now));
sb.rpc("tracer_evenement",{p_sid:sid,p_vid:vid,p_type:type,p_ref:ref||null,p_meta:meta||null,p_pays:pays}).then(()=>{},()=>{});
}
(async()=>{
await country();
ping(true);
setInterval(()=>{if(document.visibilityState==="visible")ping(false)},45000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")ping(false)});
})();
const S0=window.show;
window.show=function(i){const r=S0.apply(this,arguments);try{trace("vue_annonce",i.id)}catch(e){}return r};
const sh=q("#shophd");
if(sh)new MutationObserver(()=>{if(!sh.hidden&&typeof sellerId!=="undefined"&&sellerId)trace("vue_boutique",sellerId)}).observe(sh,{childList:true});
document.addEventListener("submit",e=>{
const f=e.target;
let v="";
if(f.id==="f")v=q("#q").value;
else if(f.id==="srf"&&f.q)v=f.q.value;
v=String(v).trim().toLowerCase().slice(0,60);
if(v&&!/\d{8,}/.test(v))trace("recherche",null,v);
},true);
document.addEventListener("click",e=>{
const b=e.target.closest(".shwa,.shcp,.shwb,.shcb");
if(b)trace("partage",b.dataset.id||b.dataset.u);
});
try{
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Mesures d’audience anonymes</b> : un identifiant aléatoire stocké sur votre appareil, votre pays (déduit sans enregistrer votre adresse IP), le type d’appareil et les pages consultées, pour améliorer Finder. Ces mesures sont désactivées si votre navigateur envoie « Ne pas me suivre ».</li>");
}catch(e){}
})();
