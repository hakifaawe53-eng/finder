// Finder - bonus.js : partage WhatsApp, liens directs, avis vérifiés, photos rondes, bannière animée
(function(){
if(window.__finderBonus)return;window.__finderBonus=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>50)clearInterval(iv)},200)};
Object.assign(ERR,{"nom verrouille":"Le nom de la boutique ne peut être modifié qu’une fois tous les 30 jours."});
const st=document.createElement("style");
st.textContent=`
.logo2,.av,.seta,.avs,.ph2,#bqimg,#bqph{border-radius:50%!important;aspect-ratio:1/1;object-fit:cover;overflow:hidden}
.logo2{box-shadow:0 0 0 3px #fff,0 0 0 5px #00A39A,0 6px 16px rgba(0,87,95,.25)}
.av,.seta{box-shadow:0 0 0 3px #fff,0 0 0 5px #00A39A,0 8px 20px rgba(0,87,95,.25)}
.avs{box-shadow:0 0 0 2px #fff,0 0 0 3px #00A39A}
#shophd .logo2{width:72px;height:72px;flex:0 0 72px}
.verif{background:#E3F8EE;color:#0F8A55;border-radius:999px;padding:1px 8px;font-size:.72rem;font-weight:600}
.shr{margin:8px 0}.shr button{font-size:.88rem;padding:9px 10px}
.shwa,.shwb{background:#25D366;border-color:#25D366;color:#fff}
#binv:before{content:"🎁"}
#hero.hx{display:block;position:relative;padding:0;min-height:250px;background:linear-gradient(120deg,#004E56,#00859A,#0DB5A6,#00859A,#004E56);background-size:300% 300%;animation:hgrad 16s ease infinite;color:#fff;overflow:hidden}
@keyframes hgrad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
#hero.hx>.hs-wrap{position:absolute;inset:0;z-index:1}
#hero.hx .hs{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:22px 20px 34px;opacity:0;transform:translateX(30px);transition:opacity .6s ease,transform .6s ease;pointer-events:none}
#hero.hx .hs.on{opacity:1;transform:none;pointer-events:auto}
#hero.hx .hs-txt{max-width:64%;position:relative;z-index:2}
#hero.hx .hs.on .hs-txt>*{animation:hrise .7s both}
#hero.hx .hs.on .hs-txt>*:nth-child(2){animation-delay:.1s}
#hero.hx .hs.on .hs-txt>*:nth-child(3){animation-delay:.2s}
#hero.hx .hs.on .hs-txt>*:nth-child(4){animation-delay:.3s}
@keyframes hrise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
#hero.hx .hs-pill{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:3px 12px;font-size:.78rem;font-weight:600;margin-bottom:8px}
#hero.hx .hs h2{margin:0 0 6px;font-size:1.35rem;line-height:1.2;max-width:none}
#hero.hx .hs p{margin:0 0 12px;opacity:.95;font-size:.92rem}
#hero.hx .hs-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
#hero.hx .hs-chips span{background:rgba(255,255,255,.16);border-radius:999px;padding:3px 10px;font-size:.78rem}
#hero.hx .hs-cta{background:#fff;color:#005961;border:0;border-radius:999px;padding:10px 18px;font-weight:700;animation:hpulse 2.4s ease-in-out infinite}
@keyframes hpulse{0%,100%{box-shadow:0 8px 20px rgba(0,0,0,.2),0 0 0 0 rgba(255,255,255,.55)}50%{box-shadow:0 8px 20px rgba(0,0,0,.2),0 0 0 10px rgba(255,255,255,0)}}
#hero.hx .hs-art{position:relative;flex:0 0 34%;height:100%;z-index:1}
#hero.hx .hs-art i{position:absolute;font-style:normal;font-size:2.2rem;animation:hfloat 4s ease-in-out infinite;filter:drop-shadow(0 8px 10px rgba(0,0,0,.25))}
@keyframes hfloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-14px) rotate(4deg)}}
#hero.hx>.hs-dots{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;gap:6px;z-index:3}
#hero.hx .hs-dots button{width:8px;height:8px;padding:0;border-radius:99px;border:0;background:rgba(255,255,255,.45);box-shadow:none;transition:.3s}
#hero.hx .hs-dots button.on{width:22px;background:#fff}
#hero.hx>.hs-bar{position:absolute;left:0;bottom:0;height:3px;width:100%;background:rgba(255,255,255,.2);z-index:3}
#hero.hx .hs-bar i{display:block;height:100%;width:0;background:#fff}
#hero.hx .hs-bar i.run{animation:hbar 5.5s linear forwards}
@keyframes hbar{from{width:0}to{width:100%}}
@media(min-width:900px){#hero.hx{min-height:290px}#hero.hx .hs{padding:32px 44px 40px}#hero.hx .hs h2{font-size:2rem}#hero.hx .hs p{font-size:1.05rem}#hero.hx .hs-art i{font-size:3.4rem}}
@media(prefers-reduced-motion:reduce){#hero.hx,#hero.hx .hs-cta,#hero.hx .hs-art i,#hero.hx .hs.on .hs-txt>*{animation:none}#hero.hx .hs{transition:none}}
`;
document.head.appendChild(st);
/* Partage et liens directs */
let fnOK=null;
fetch(location.origin+"/a/0").then(r=>{fnOK=r.headers.get("x-finder")==="1"}).catch(()=>{fnOK=false});
const lk=(t,id)=>fnOK?location.origin+"/"+t+"/"+id:location.origin+"/?"+t+"="+id;
const wa=t=>window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank","noopener");
const copy=async u=>{try{await navigator.clipboard.writeText(u);showToast("Lien copié ✓","msg")}catch(e){prompt("Copiez ce lien :",u)}};
const nmS=u=>{const s=shops[u],p=pro[u];return (user&&u===user.id&&myShop&&myShop.nom)||(s&&s.nom)||(p&&p.nom)||"Vendeur Finder"};
const txtL=i=>"🛍️ "+i.title+"\n💰 "+fcfa(i.price)+" · 📍 "+i.city+"\nSur Finder, la plateforme d’occasion en Côte d’Ivoire :\n"+lk("a",i.id);
const txtS=u=>"🏪 "+nmS(u)+" sur Finder\nDécouvrez tous les articles de la boutique :\n"+lk("b",u);
const invText=()=>"Rejoins-moi sur Finder 👋\nAchète et vends d’occasion en Côte d’Ivoire, avec paiement sécurisé et protection acheteur. Crée ton compte gratuitement :\n"+location.origin;
const binv=document.createElement("button");
binv.id="binv";binv.textContent="Inviter des amis";
q("#bsup").after(binv);
document.addEventListener("click",e=>{
const b=e.target.closest(".shwa,.shcp,.shwb,.shcb,#binv");
if(!b)return;
if(b.id==="binv"){wa(invText());return}
if(b.classList.contains("shwa")||b.classList.contains("shcp")){
const i=items.find(x=>x.id===b.dataset.id);
if(!i)return;
if(b.classList.contains("shwa"))wa(txtL(i));else copy(lk("a",i.id));
}else{
const u=b.dataset.u;
if(b.classList.contains("shwb"))wa(txtS(u));else copy(lk("b",u));
}
});
const S2=window.show;
window.show=function(i){
const r=S2.apply(this,arguments);
try{
const p=q("#dc .pt");
if(p&&!q("#dc .shr"))p.insertAdjacentHTML("afterend",'<div class="shr row"><button type="button" class="shwa" data-id="'+i.id+'">🟢 Partager sur WhatsApp</button><button type="button" class="shcp" data-id="'+i.id+'">🔗 Copier le lien</button></div>');
}catch(e){}
return r;
};
const R2=window.renderShop;
if(R2)window.renderShop=function(){
const r=R2.apply(this,arguments);
try{
const b=q("#shophd");
if(!b.hidden&&sellerId)b.insertAdjacentHTML("beforeend",'<div class="shr row"><button type="button" class="shwb" data-u="'+sellerId+'">🟢 Partager la boutique</button><button type="button" class="shcb" data-u="'+sellerId+'">🔗 Copier le lien</button></div>');
}catch(e){}
return r;
};
function waitReady(cb){let n=0;const iv=setInterval(()=>{const m=q("#msg");if((m&&m.textContent!=="Chargement…")||++n>30){clearInterval(iv);cb()}},200)}
async function deep(){
const p=new URLSearchParams(location.search),a=p.get("a"),b=p.get("b"),ok=/^[0-9a-fA-F-]{36}$/;
if(!(a&&ok.test(a))&&!(b&&ok.test(b)))return;
history.replaceState(null,"",location.pathname);
if(b&&ok.test(b)){sellerId=b;mode="seller";labels();load();return}
const{data}=await sb.from("listings").select("*").eq("id",a).maybeSingle();
if(!data){showToast("Cette annonce n’est plus disponible.","msg");return}
if(!items.find(x=>x.id===data.id))items.push(data);
const[r1,r2]=await Promise.all([sb.from("profils").select("*").eq("user_id",data.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",data.user_id).maybeSingle()]);
if(r1.data)pro[data.user_id]=r1.data;
if(r2.data)shops[data.user_id]=r2.data;
show(data);
}
setTimeout(()=>waitReady(deep),1500);
/* Avis liés aux achats */
const O0=window.openReview;
window.openReview=async function(u){
if(!user){q("#da").showModal();return}
const{count}=await sb.from("commandes").select("id",{count:"exact",head:true}).eq("buyer_id",user.id).eq("seller_id",u).eq("statut","livre");
if(!count){alert("Vous pourrez noter ce vendeur après avoir reçu un article acheté chez lui (commande terminée).");return}
return O0.apply(this,arguments);
};
q("#rf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#rm");
const{error}=await sb.from("avis").upsert({seller_id:revSeller,reviewer_id:user.id,note:+f.note.value,commentaire:f.com.value.trim()||null},{onConflict:"seller_id,reviewer_id"});
if(error){m.textContent="Impossible d’envoyer l’avis. Seuls les acheteurs d’une commande terminée chez ce vendeur peuvent le noter.";return}
m.textContent="";q("#dr").close();load();
};
window.loadReviews=async function(u,sel){
const box=q(sel||"#rv");
if(!box)return;
const{data}=await sb.from("avis").select("*").eq("seller_id",u).order("created_at",{ascending:false}).limit(50);
if(!data||!data.length){box.innerHTML="<p class='meta'>Aucun avis pour l’instant. Seuls les acheteurs d’une commande terminée peuvent noter.</p>";return}
const ids=[...new Set(data.map(a=>a.reviewer_id))];
const{data:ps}=await sb.from("profils").select("user_id,nom,avatar_url").in("user_id",ids);
const N=Object.fromEntries((ps||[]).map(p=>[p.user_id,p]));
const avg=data.reduce((s,a)=>s+a.note,0)/data.length;
box.innerHTML="<p><b>★ "+avg.toFixed(1).replace(".",",")+"</b> · "+data.length+" avis</p>"+data.map(a=>{
const p=N[a.reviewer_id]||{};
return '<p class="rev">'+(p.avatar_url?'<img class="avs" src="'+esc(p.avatar_url)+'" alt="">':"")+'<span class="stars">'+"★".repeat(a.note)+"☆".repeat(5-a.note)+"</span> <b>"+esc(p.nom||"Acheteur")+"</b>"+(a.verifie?' <span class="verif">✓ Achat vérifié</span>':"")+(a.commentaire?"<br>"+esc(a.commentaire):"")+"</p>";
}).join("");
};
/* Boutique : partage et verrou du nom */
const dbq=q("#dbq"),bqx=q("#bqx");
const mine=document.createElement("div");
mine.id="shmine";
bqx.insertBefore(mine,bqx.firstChild);
function renderMine(){
if(!user)return;
mine.innerHTML='<h3>📣 Partager ma boutique</h3><div class="shr row"><button type="button" class="shwb" data-u="'+user.id+'">🟢 WhatsApp</button><button type="button" class="shcb" data-u="'+user.id+'">🔗 Copier le lien</button></div>';
}
function lockName(){
const s=myShop,n=q("#bqn");
if(!n)return;
let h=q("#bqnh");
if(!h){h=document.createElement("p");h.id="bqnh";h.className="meta";n.after(h)}
if(!s){n.disabled=false;h.textContent="Le nom pourra ensuite être modifié une fois tous les 30 jours.";return}
const free=(s.nom_modifie_le?new Date(s.nom_modifie_le).getTime():0)+30*864e5;
if(Date.now()<free){
n.disabled=true;
h.textContent="🔒 Le nom est verrouillé jusqu’au "+new Date(free).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})+" (modification possible tous les 30 jours).";
}else{
n.disabled=false;
h.textContent="Vous pouvez modifier le nom maintenant. Après un changement, il sera verrouillé 30 jours.";
}
}
const onShop=()=>{if(dbq.open){lockName();renderMine()}};
new MutationObserver(onShop).observe(dbq,{attributes:true,attributeFilter:["open"]});
new MutationObserver(onShop).observe(bqx,{attributes:true,attributeFilter:["hidden"]});
/* Bannière d'accueil animée */
let hero=null,idx=0,timer=null,paused=false,sig="";
function slides(){
const nm=(me&&me.nom)?me.nom.trim().split(" ")[0]:"";
const S=[];
S.push({pill:"👋 Bienvenue",h:user?"Bonjour "+nm+", ravi de vous revoir !":"Bienvenue sur Finder",p:"Achetez et vendez d’occasion en toute sécurité, partout en Côte d’Ivoire.",cta:"Découvrir les annonces",act:"go",art:["🛍️","📱","👟","🪑"]});
if(!user)S.push({pill:"🎉 100 % gratuit",h:"Créez votre compte en 1 minute",p:"Achetez, vendez, suivez vos commandes et recevez des alertes sur les articles qui vous plaisent.",cta:"Créer mon compte",act:"signup",art:["🔔","💬","❤️","🎁"]});
if(!myShop)S.push({pill:"🏪 Boutique Finder",h:"Ouvrez votre boutique",chips:["✓ Badge bleu de confiance","✓ Avis visibles par tous","✓ Jusqu’à "+fcfa(plBq),"✓ 0 % de commission"],cta:"Créer ma boutique",act:"shop",art:["🏪","⭐","💎","📦"]});
else S.push({pill:"✅ Votre boutique",h:"Boostez votre boutique",p:"Remplissez les critères pour décrocher le badge bleu et rassurer vos acheteurs.",cta:"Ma boutique",act:"myshop",art:["🏪","⭐","✅","📈"]});
S.push({pill:"🎁 Invitez vos amis",h:"Faites découvrir Finder",p:"Invitez vos proches à créer leur compte : plus d’acheteurs, plus d’affaires pour tout le monde.",cta:"Inviter sur WhatsApp",act:"invite",art:["🤝","📲","💚","🎉"]});
return S;
}
function renderHero(){
const S=slides();
idx=Math.min(idx,S.length-1);
const top=[8,48,22,60],left=[10,55,38,5];
hero.innerHTML='<div class="hs-wrap">'+S.map((s,i)=>'<div class="hs'+(i===idx?" on":"")+'"><div class="hs-txt"><span class="hs-pill">'+s.pill+"</span><h2>"+esc(s.h)+"</h2>"+(s.p?"<p>"+esc(s.p)+"</p>":"")+(s.chips?'<div class="hs-chips">'+s.chips.map(c=>"<span>"+esc(c)+"</span>").join("")+"</div>":"")+'<button type="button" class="hs-cta" data-act="'+s.act+'">'+esc(s.cta)+'</button></div><div class="hs-art">'+s.art.map((e,k)=>'<i style="top:'+top[k]+"%;left:"+left[k]+"%;animation-delay:"+(k*.5)+'s">'+e+"</i>").join("")+"</div></div>").join("")+'</div><div class="hs-dots">'+S.map((s,i)=>'<button type="button" data-d="'+i+'" aria-label="Diapositive '+(i+1)+'"'+(i===idx?' class="on"':"")+"></button>").join("")+'</div><div class="hs-bar"><i></i></div>';
hero.classList.add("hx");
restartBar();
}
function restartBar(){
const b=hero&&hero.querySelector(".hs-bar i");
if(!b)return;
b.classList.remove("run");void b.offsetWidth;
if(!paused)b.classList.add("run");
}
function goTo(n){
const S=hero.querySelectorAll(".hs");
if(!S.length)return;
idx=(n+S.length)%S.length;
S.forEach((s,i)=>s.classList.toggle("on",i===idx));
hero.querySelectorAll(".hs-dots button").forEach((b,i)=>b.classList.toggle("on",i===idx));
restartBar();
}
function play(){
clearInterval(timer);
timer=setInterval(()=>{if(!paused&&!hero.hidden&&!document.hidden)goTo(idx+1)},5500);
}
const acts={
go:()=>q("#sect").scrollIntoView({behavior:"smooth",block:"start"}),
signup:()=>q("#da").showModal(),
shop:()=>{
if(!user){q("#da").showModal();return}
if(acct==="client"){
if(!confirm("Pour ouvrir une boutique, passez en compte vendeur. Continuer ?"))return;
q("#sw").click();
let n=0;
const iv=setInterval(()=>{if(acct==="vendeur"||++n>30){clearInterval(iv);if(acct==="vendeur")q("#bq").click()}},200);
return;
}
q("#bq").click();
},
myshop:()=>q("#bq").click(),
invite:()=>wa(invText())
};
function heroSync(){
if(!hero)return;
const s=[user&&user.id,acct,!!myShop,me&&me.nom,plBq].join("|");
if(s!==sig){sig=s;renderHero()}
}
when("#hero",h=>{
hero=h;
hero.addEventListener("click",e=>{
const d=e.target.closest("[data-d]"),a=e.target.closest("[data-act]");
if(d){goTo(+d.dataset.d);play();return}
if(a&&acts[a.dataset.act])acts[a.dataset.act]();
});
hero.addEventListener("mouseenter",()=>{paused=true;const b=hero.querySelector(".hs-bar i");if(b)b.classList.remove("run")});
hero.addEventListener("mouseleave",()=>{paused=false;restartBar()});
let x0=null;
hero.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});
hero.addEventListener("touchend",e=>{
if(x0===null)return;
const dx=e.changedTouches[0].clientX-x0;
x0=null;
if(Math.abs(dx)>40){goTo(idx+(dx<0?1:-1));play()}
});
heroSync();
play();
});
const A2=window.applyUI;
window.applyUI=function(){const r=A2.apply(this,arguments);heroSync();return r};
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment partager une annonce ou ma boutique ?</summary><p>Ouvrez l’annonce ou la boutique et appuyez sur « Partager sur WhatsApp » ou « Copier le lien ». Le lien ouvre directement l’annonce ou la boutique.</p></details><details><summary>Qui peut laisser un avis ?</summary><p>Seuls les acheteurs d’une commande terminée chez le vendeur peuvent le noter. Leur avis porte la mention « Achat vérifié ».</p></details><details><summary>Puis-je changer le nom de ma boutique ?</summary><p>Oui, mais une fois tous les 30 jours seulement. Le nom est verrouillé pendant 30 jours après la création ou le dernier changement.</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Le nom d’une boutique ne peut être modifié qu’une fois tous les 30 jours. Seuls les acheteurs d’une commande terminée peuvent laisser un avis sur un vendeur.</li>");
}catch(e){}
})();
