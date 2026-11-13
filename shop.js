// Finder - shop.js : suivre une boutique, profil de boutique, nouveautés, temps réel
(function(){
if(window.__finderShop)return;window.__finderShop=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>50)clearInterval(iv)},200)};
Object.assign(ERR,{"abonnement invalide":"Vous ne pouvez pas suivre cette boutique.","trop d abonnements":"Vous pouvez suivre 200 boutiques au maximum."});
const st=document.createElement("style");
st.textContent=`
#shophd.sp{padding:0;border:0;overflow:hidden;border-radius:22px;background:#fff;box-shadow:0 12px 32px rgba(0,87,95,.16)}
.sp-cover{height:110px;background:linear-gradient(120deg,#004E56,#00859A 55%,#14B8A6);position:relative;overflow:hidden}
.sp-cover:before,.sp-cover:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.12)}
.sp-cover:before{width:180px;height:180px;right:-40px;top:-70px}
.sp-cover:after{width:110px;height:110px;left:30%;bottom:-60px}
.sp-head{display:flex;align-items:flex-end;gap:14px;padding:0 16px;margin-top:-42px;position:relative}
.sp-av{flex:0 0 88px;width:88px;height:88px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #fff,0 8px 20px rgba(0,87,95,.25);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:800;color:#007782}
.sp-av img{width:100%;height:100%;object-fit:cover}
.sp-id{padding-bottom:4px;min-width:0}
.sp-id h2{margin:0;font-size:1.35rem;line-height:1.2;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.sp-badge{background:linear-gradient(135deg,#2BB0FF,#1D7FF0);color:#fff;border-radius:999px;padding:2px 10px;font-size:.72rem;font-weight:700}
.sp-meta{display:flex;flex-wrap:wrap;gap:4px 12px;color:#6A7B84;font-size:.88rem;margin-top:2px}
.sp-body{padding:12px 16px 16px}
.sp-rate{display:inline-block;background:#FFF7E0;border-radius:999px;padding:3px 12px;font-weight:700;font-size:.9rem;color:#8A6100}
.sp-stats{display:grid;grid-template-columns:repeat(4,1fr);text-align:center;background:#F3F8F8;border-radius:16px;padding:12px 0;margin:12px 0}
.sp-stats b{display:block;font-size:1.1rem}
.sp-stats small{color:#6A7B84}
.sp-about{margin:6px 0 10px}
.sp-acts{display:flex;flex-wrap:wrap;gap:8px}
.sp-acts button{flex:1 1 130px}
.spfol.on,.fbtn.on{background:#E8F6F5!important;color:#005961!important;border:1.5px solid #00A39A!important;box-shadow:none!important}
.sp-rv{margin-top:14px}
.sp-rv h3{margin:0 0 6px}
.fbtn{margin-top:6px;padding:7px 14px;font-size:.85rem;border-radius:999px}
@media(min-width:900px){.sp-cover{height:160px}.sp-head{margin-top:-54px;padding:0 28px}.sp-av{flex-basis:112px;width:112px;height:112px}.sp-id h2{font-size:1.7rem}.sp-body{padding:14px 28px 22px}}
`;
document.head.appendChild(st);
const MOT={vacances:["🏖️","En vacances"],voyage:["✈️","En voyage"],pause:["⏸️","En pause"]};
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const onVac=sh=>!!(sh&&sh.vacances&&(!sh.vacances_jusqu_au||sh.vacances_jusqu_au>=today()));
const fdate=d=>new Date(d+"T00:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
function vacBanner(sh){
const m=MOT[sh.vacances_motif]||MOT.vacances;
return '<div class="vacb"><b>'+m[0]+" "+m[1]+(sh.vacances_jusqu_au?" · retour le "+esc(fdate(sh.vacances_jusqu_au)):"")+"</b>Les achats sont suspendus pendant l’absence du vendeur."+(sh.vacances_message?"<br><i>« "+esc(sh.vacances_message)+" »</i>":"")+"</div>";
}
const FOL=new Set();
function paintFollow(){
document.querySelectorAll("[data-follow]").forEach(b=>{
const on=FOL.has(b.dataset.follow);
b.classList.toggle("on",on);
if(b.classList.contains("spfol"))b.textContent=on?"✓ Abonné":"➕ Suivre";
else b.textContent=on?"✓ Abonné à la boutique":"➕ Suivre la boutique";
});
}
async function stats(){
const id=sellerId;
const{data}=await sb.rpc("stats_boutique",{p_seller:id});
if(!data||id!==sellerId)return;
const set=(s,v)=>{const e=q(s);if(e)e.textContent=v};
set("#spa",data.annonces);set("#spv",data.ventes);set("#spf",data.abonnes);
if(data.suivi)FOL.add(id);else FOL.delete(id);
paintFollow();
}
function install(){
window.renderShop=function(){
const box=q("#shophd");
if(mode!=="seller"||!sellerId){box.hidden=true;box.classList.remove("sp");return}
const sh=shops[sellerId],p=pro[sellerId];
const name=sh?sh.nom:(p?p.nom:"Vendeur");
const ville=sh?sh.ville:(p&&p.ville?p.ville:"");
const rate=R[sellerId];
const own=user&&user.id===sellerId;
const buyer=!user||acct==="client";
const logo=sh&&sh.logo_url?'<img src="'+esc(sh.logo_url)+'" alt="">':esc((name||"?").slice(0,1).toUpperCase());
const since=p&&p.vendeur_depuis?depuis(p.vendeur_depuis):"—";
box.hidden=false;box.classList.add("sp");
box.innerHTML='<div class="sp-cover"></div><div class="sp-head"><div class="sp-av">'+logo+'</div><div class="sp-id"><h2>'+esc(name)+(sh&&sh.certifiee?' <span class="sp-badge">✓ Boutique certifiée</span>':"")+'</h2><div class="sp-meta">'+(ville?"<span>📍 "+esc(ville)+"</span>":"")+(sh?"<span>🚚 "+esc(sh.delai)+"</span>":"")+(p&&p.identite_verifiee?'<span class="idv" style="margin:0">Identité vérifiée</span>':"")+'</div></div></div><div class="sp-body">'+(onVac(sh)?vacBanner(sh):"")+'<div><span class="sp-rate">'+(rate?"★ "+(rate.s/rate.n).toFixed(1).replace(".",",")+" · "+rate.n+" avis":"☆ Pas encore d’avis")+'</span></div><div class="sp-stats"><div><b id="spa">–</b><small>Annonces</small></div><div><b id="spv">–</b><small>Ventes</small></div><div><b id="spf">–</b><small>Abonnés</small></div><div><b>'+esc(since)+'</b><small>Sur Finder</small></div></div>'+(p&&p.bio?'<p class="sp-about">'+esc(p.bio)+"</p>":"")+'<div class="sp-acts">'+((own||!sh)?"":'<button type="button" class="pri spfol" data-follow="'+sellerId+'">➕ Suivre</button>')+'<button type="button" class="shwb" data-u="'+sellerId+'">🟢 Partager</button><button type="button" class="shcb" data-u="'+sellerId+'">🔗 Lien</button></div><div class="sp-rv"><h3>⭐ Avis des acheteurs</h3><div id="rv2"></div>'+(buyer&&!own?'<button type="button" class="revbtn" data-r="'+sellerId+'">Laisser un avis</button>':"")+"</div></div>";
loadReviews(sellerId,"#rv2");
stats();
paintFollow();
};
if(mode==="seller")window.renderShop();
}
let w=0;
const wi=setInterval(()=>{if((window.__finderBonus&&window.__finderVac)||++w>40){clearInterval(wi);install()}},150);
const S4=window.show;
window.show=function(i){
const r=S4.apply(this,arguments);
try{
const sh=shops[i.user_id];
if(sh&&!(user&&user.id===i.user_id)){
const s=q("#dc .seller");
if(s&&!q("#dc .fbtn"))s.insertAdjacentHTML("afterend",'<button type="button" class="fbtn" data-follow="'+i.user_id+'">➕ Suivre la boutique</button>');
paintFollow();
}
}catch(e){}
return r;
};
document.addEventListener("click",async e=>{
const b=e.target.closest("[data-follow]");
if(!b)return;
if(!user){q("#da").showModal();return}
const id=b.dataset.follow,on=!FOL.has(id);
if(on)FOL.add(id);else FOL.delete(id);
paintFollow();
const f=q("#spf");
if(f&&id===sellerId&&f.textContent!=="–")f.textContent=Math.max(0,(+f.textContent||0)+(on?1:-1));
const{error}=await sb.rpc("suivre",{p_seller:id,p_actif:on});
if(error){
if(on)FOL.delete(id);else FOL.add(id);
paintFollow();
alert(err(error));
return;
}
showToast(on?"Vous suivez cette boutique. Vous serez prévenu de ses nouvelles annonces.":"Abonnement retiré.","notif");
loadFeed();
});
document.body.insertAdjacentHTML("beforeend",'<dialog id="dabo"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Mes abonnements</h2></div><p class="meta">Vous êtes prévenu dès qu’une boutique que vous suivez publie une annonce.</p><div id="abol"></div></dialog>');
const dabo=q("#dabo");
dabo.querySelector("[data-x]").onclick=()=>dabo.close();
async function openAbo(){
if(!user){q("#da").showModal();return}
if(!dabo.open)dabo.showModal();
const box=q("#abol");
box.innerHTML="<p class='meta'>Chargement…</p>";
const{data}=await sb.from("abonnements").select("seller_id,cree_le").order("cree_le",{ascending:false});
const ids=(data||[]).map(x=>x.seller_id);
if(!ids.length){box.innerHTML="<p class='meta'>Vous ne suivez aucune boutique pour l’instant. Ouvrez une boutique et appuyez sur « Suivre ».</p>";return}
const{data:bs}=await sb.from("boutiques").select("user_id,nom,ville,logo_url").in("user_id",ids);
const B=Object.fromEntries((bs||[]).map(b=>[b.user_id,b]));
box.innerHTML=ids.map(id=>{
const b=B[id]||{nom:"Boutique",ville:""};
return '<div class="al"><div class="sp-av" style="flex:0 0 46px;width:46px;height:46px;font-size:1.1rem;box-shadow:none;background:#E8F6F5">'+(b.logo_url?'<img src="'+esc(b.logo_url)+'" alt="">':esc(b.nom.slice(0,1).toUpperCase()))+'</div><div class="alb"><b>'+esc(b.nom)+"</b><small>"+esc(b.ville||"")+'</small></div><button type="button" class="alx" data-voir="'+id+'">Voir</button><button type="button" class="alx" data-out="'+id+'" aria-label="Ne plus suivre">✕</button></div>';
}).join("");
}
q("#abol").onclick=async e=>{
const v=e.target.closest("[data-voir]"),o=e.target.closest("[data-out]");
if(v){dabo.close();sellerId=v.dataset.voir;mode="seller";labels();load();window.scrollTo(0,0);return}
if(o){const id=o.dataset.out;await sb.rpc("suivre",{p_seller:id,p_actif:false});FOL.delete(id);paintFollow();loadFeed();openAbo()}
};
const babo=document.createElement("button");
babo.id="babo";babo.textContent="Mes abonnements";
(q("#bal")||q("#fav")).after(babo);
babo.onclick=openAbo;
const sty=document.createElement("style");
sty.textContent="#babo:before{content:'👥'}";
document.head.appendChild(sty);
const feed=document.createElement("section");
feed.id="fnews";feed.hidden=true;
feed.innerHTML='<div class="chead"><h3>🔔 Nouveautés de vos boutiques</h3></div><div class="mrow"></div>';
when("#hcats",c=>{const o=q("#offers");(o||c).after(feed)});
let FEED=[];
const isHome=()=>mode==="all"&&!cat&&!q("#q").value.trim()&&!q("#fv").value&&!q("#fe").value;
const visF=()=>{feed.hidden=!(isHome()&&FEED.length)};
function renderFeed(){
feed.querySelector(".mrow").innerHTML=FEED.map(i=>'<article class="mini" data-id="'+i.id+'">'+(i.photos&&i.photos[0]?'<img loading="lazy" src="'+esc(i.photos[0])+'" alt="">':'<div class="mph"></div>')+"<b>"+fcfa(i.price)+"</b><p>"+esc(i.title)+"</p><small>"+esc(i.city)+"</small></article>").join("");
visF();
}
async function loadFeed(){
if(!user||!FOL.size){FEED=[];renderFeed();return}
const{data}=await sb.from("listings").select("*").in("user_id",[...FOL]).eq("statut","actif").eq("vendu",false).order("created_at",{ascending:false}).limit(10);
FEED=data||[];renderFeed();
}
async function openL(i){
if(!items.find(x=>x.id===i.id))items.push(i);
if(!pro[i.user_id]||!(i.user_id in shops)){
const[r1,r2]=await Promise.all([sb.from("profils").select("*").eq("user_id",i.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",i.user_id).maybeSingle()]);
if(r1.data)pro[i.user_id]=r1.data;
if(r2.data)shops[i.user_id]=r2.data;
}
show(i);
}
feed.onclick=e=>{const m=e.target.closest(".mini");if(!m)return;const i=FEED.find(x=>x.id===m.dataset.id);if(i)openL(i)};
const L0=window.labels;
window.labels=function(){const r=L0.apply(this,arguments);visF();return r};
const D0=window.load;
window.load=async function(){const r=await D0.apply(this,arguments);visF();return r};
async function loadFol(){
FOL.clear();
if(user){
const{data}=await sb.from("abonnements").select("seller_id");
(data||[]).forEach(x=>FOL.add(x.seller_id));
}
paintFollow();
loadFeed();
}
let chan=null;
function rt(){
try{
if(chan){sb.removeChannel(chan);chan=null}
if(!user)return;
chan=sb.channel("finder-n-"+user.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:"user_id=eq."+user.id},()=>{refreshNotifs();loadFeed()}).subscribe();
}catch(e){}
}
sb.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_IN"||ev==="SIGNED_OUT"||ev==="INITIAL_SESSION")setTimeout(()=>{loadFol();rt()},1200)});
setTimeout(()=>{loadFol();rt()},1500);
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment suivre une boutique ?</summary><p>Ouvrez la boutique (ou une de ses annonces) et appuyez sur « Suivre ». Vous recevez une notification à chaque nouvelle annonce. Retrouvez vos boutiques dans « Mes abonnements ».</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Vous pouvez suivre une boutique pour être prévenu de ses nouvelles annonces, et arrêter à tout moment.</li>");
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Les boutiques que vous suivez</b>, pour vous prévenir de leurs nouvelles annonces. Le nombre d’abonnés d’une boutique est visible, pas la liste des abonnés.</li>");
}catch(e){}
})();
