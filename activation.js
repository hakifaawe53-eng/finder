// Finder - activation.js : parcours « Bien démarrer » pour les nouveaux comptes
(function(){
if(window.__finderActiv)return;window.__finderActiv=1;
const q=s=>document.querySelector(s);
const KEY="finder_activ_off";
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");
css.textContent=`
#activ{background:linear-gradient(135deg,#EEF8F7,#DDF3F1);border-radius:20px;padding:14px;margin:0 0 14px}
.avh{display:flex;justify-content:space-between;align-items:center;gap:8px}
.avh b{font-size:1.05rem}
.avh button{border:0;background:none;color:#6A7B84;text-decoration:underline;font-size:.8rem;cursor:pointer}
.avbar{height:8px;border-radius:99px;background:#fff;overflow:hidden;margin:10px 0 6px}
.avbar i{display:block;height:100%;background:linear-gradient(90deg,#00A39A,#007782)}
.avt{margin:0 0 8px;font-size:.85rem;color:#5B6B73}
#activ ul{list-style:none;margin:0 0 10px;padding:0}
#activ li{padding:5px 0;font-size:.95rem}
#activ li.ok{color:#5B6B73;text-decoration:line-through}
#activ .avgo{width:100%;border:0;border-radius:14px;padding:13px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-weight:800;font-size:1rem;cursor:pointer}
`;
document.head.appendChild(css);
const click=id=>{const e=document.getElementById(id);if(e)e.click()};
const toGrid=()=>{const s=q("#sect");if(s)s.scrollIntoView({behavior:"smooth"})};
let cache=null,cacheT=0,busy=false;
async function state(){
if(cache&&Date.now()-cacheT<120000)return cache;
const uid=user.id;
const cnt=async(tb,col)=>{try{const r=await sb.from(tb).select("id",{count:"exact",head:true}).eq(col,uid);return r.count||0}catch(e){return 0}};
const [lst,msg,buy,sell]=await Promise.all([cnt("listings","user_id"),cnt("messages","sender_id"),cnt("commandes","buyer_id"),cnt("commandes","seller_id")]);
let photos=false,kyc=false;
try{const r=await sb.from("listings").select("photos").eq("user_id",uid).limit(30);photos=(r.data||[]).some(l=>(l.photos||[]).length>=3)}catch(e){}
try{const r=await sb.from("identites").select("statut").eq("user_id",uid).maybeSingle();kyc=!!r.data}catch(e){}
const favN=typeof favs!=="undefined"&&favs?(favs.size!==undefined?favs.size:(favs.length||0)):0;
cache={lst,msg,buy,sell,photos,kyc,favN};
cacheT=Date.now();
return cache;
}
function steps(s){
const seller=typeof acct!=="undefined"&&acct==="vendeur";
if(seller)return[
["Compte créé",true,null,""],
["Publier ma première annonce",s.lst>0,()=>click("sell"),"Vendre un article"],
["Ajouter 3 photos ou plus à une annonce",s.photos,()=>click("mine"),"Mes annonces"],
["Faire vérifier mon identité",s.kyc,()=>click("bid"),"Vérifier mon identité"],
["Réaliser ma première vente",s.sell>0,()=>click("mine"),"Mes annonces"]
];
return[
["Compte créé",true,null,""],
["Ajouter un article en favori",s.favN>0,toGrid,"Parcourir les annonces"],
["Écrire à un vendeur",s.msg>0,toGrid,"Parcourir les annonces"],
["Faire mon premier achat",s.buy>0,toGrid,"Parcourir les annonces"]
];
}
async function render(){
const old=q("#activ"),sect=q("#sect"),f=q("#f");
const out=typeof user==="undefined"||!user;
const home=sect&&/Toutes les annonces/i.test(sect.textContent)&&!(q("#q")&&q("#q").value.trim());
if(out||!home||!f||ls.get(KEY)==="1"){if(old)old.remove();return}
if(busy)return;
busy=true;
let s;
try{s=await state()}catch(e){busy=false;return}
busy=false;
const st=steps(s),done=st.filter(x=>x[1]).length;
if(done===st.length){if(old)old.remove();return}
const next=st.find(x=>!x[1]);
const html='<section id="activ"><div class="avh"><b>🚀 Bien démarrer sur Finder</b><button type="button" data-hide>Masquer</button></div><div class="avbar"><i style="width:'+Math.round(done/st.length*100)+'%"></i></div><p class="avt">'+done+" étape"+(done>1?"s":"")+" sur "+st.length+'</p><ul>'+st.map(x=>'<li class="'+(x[1]?"ok":"")+'">'+(x[1]?"✅ ":"⬜ ")+E(x[0])+"</li>").join("")+'</ul><button type="button" class="avgo" data-go>'+E(next[3])+"</button></section>";
if(old)old.remove();
f.insertAdjacentHTML("afterend",html);
q("#activ [data-go]").onclick=()=>{if(next[2])next[2]()};
q("#activ [data-hide]").onclick=()=>{ls.set(KEY,"1");const a=q("#activ");if(a)a.remove()};
}
let tm;
const sched=()=>{clearTimeout(tm);tm=setTimeout(()=>{render().catch(()=>{})},400)};
const g=q("#grid"),sect=q("#sect");
if(g)new MutationObserver(sched).observe(g,{childList:true});
if(sect)new MutationObserver(sched).observe(sect,{childList:true,characterData:true,subtree:true});
try{sb.auth.onAuthStateChange(()=>{cache=null;setTimeout(sched,600)})}catch(e){}
setTimeout(sched,2200);
})();
// FIN DU FICHIER
