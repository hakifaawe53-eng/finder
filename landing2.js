// Finder - landing2.js : accueil plus captivant (titre animé, envies, nouveautés, catégories, estimateur, questions)
(function(){
if(window.__finderLanding2)return;window.__finderLanding2=1;
const q=s=>document.querySelector(s);
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fc=n=>typeof fcfa==="function"?String(fcfa(n)).replace(/[\u202f\u00a0]/g," "):Number(n).toLocaleString("fr-FR")+" FCFA";
let tries=0;
const iv=setInterval(()=>{
const L=q("#landing");
if(L&&L.querySelector(".lhero")){clearInterval(iv);init(L)}
else if(++tries>40)clearInterval(iv);
},400);
function init(L){
if(L.dataset.l2)return;L.dataset.l2="1";
const css=document.createElement("style");
css.textContent=`
.lrot{font-size:1.05rem;font-weight:800;min-height:1.5em;margin:0 0 12px!important;color:#CFF5F1}
.lrot span{display:inline-block;animation:lrin .5s ease}
@keyframes lrin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.lenv{display:flex;gap:8px;overflow-x:auto;padding:12px 0 2px;scrollbar-width:none}
.lenv::-webkit-scrollbar{display:none}
.lenv button{flex:0 0 auto;border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:999px;padding:9px 14px;font-size:.88rem;font-weight:700;cursor:pointer;white-space:nowrap}
.lrow{display:flex;gap:10px;overflow-x:auto;padding:6px 2px 12px;scrollbar-width:none}
.lrow::-webkit-scrollbar{display:none}
.lrow .card{flex:0 0 150px;max-width:150px}
.lrow .heart{display:none}
.lcats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.lcats button{border:1px solid #E2EBEB;background:#fff;border-radius:16px;padding:12px 6px;font-size:.82rem;font-weight:700;cursor:pointer;color:#12212B;line-height:1.3}
.lest{background:#fff;border:1px solid #E2EBEB;border-radius:20px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.lest label{font-weight:700;font-size:.92rem}
.lest input{width:100%;box-sizing:border-box;font-size:1.3rem;padding:12px;border-radius:14px;border:1.5px solid #CFE0E0;margin:6px 0 10px}
.lres{background:#F0FAF9;border-radius:14px;padding:12px;font-size:.92rem;line-height:1.5}
.lres b{color:#005961}
.lest .lgo{margin-top:10px;width:100%;border:0;border-radius:14px;padding:13px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-weight:800;font-size:1rem;cursor:pointer}
.lfaq details{background:#fff;border:1px solid #E2EBEB;border-radius:14px;padding:12px 14px;margin-bottom:8px}
.lfaq summary{font-weight:700;cursor:pointer}
.lfaq p{margin:8px 0 0;font-size:.9rem;color:#5B6B73;line-height:1.45}
`;
document.head.appendChild(css);
const hero=L.querySelector(".lhero");
const PH=["📱 Vendez votre ancien téléphone","👗 Habillez toute la famille à petit prix","🏠 Faites de la place et gagnez de l’argent","💻 Trouvez l’ordinateur qu’il vous faut"];
const h1=hero.querySelector("h1");
if(h1)h1.insertAdjacentHTML("afterend",'<p class="lrot"><span id="lrot">'+PH[0]+"</span></p>");
let k=0;
const still=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!still)setInterval(()=>{
if(L.hidden)return;
k=(k+1)%PH.length;
const r=q("#lrot");
if(r){r.style.animation="none";void r.offsetWidth;r.style.animation="";r.textContent=PH[k]}
},3200);
const lcta=hero.querySelector(".lcta");
if(lcta)lcta.insertAdjacentHTML("afterend",'<div class="lenv"><button type="button" data-e="tel">📱 Acheter un téléphone</button><button type="button" data-e="mode">👗 Habiller ma famille</button><button type="button" data-e="maison">🏠 Équiper ma maison</button><button type="button" data-e="vendre">💰 Vendre ce que je n’utilise plus</button></div>');
const catBtns=()=>[...document.querySelectorAll("#cats [data-c]")];
const findCat=re=>catBtns().find(b=>re.test(b.textContent));
const RE={tel:/t[ée]l[ée]phone|mobile/i,mode:/v[êe]tement|mode|habit/i,maison:/maison|meuble|[ée]lectrom/i};
function signup(m){window.__regPreMode=m||"";const s=q("#su");if(s)s.click()}
L.addEventListener("click",e=>{
const en=e.target.closest("[data-e]");
if(en){
const a=en.dataset.e;
if(a==="vendre"){signup("vendeur");return}
const b=findCat(RE[a]);
if(b)b.click();else{const s=q("#sect");if(s)s.scrollIntoView({behavior:"smooth"})}
return;
}
const ct=e.target.closest("[data-ci]");
if(ct){const b=catBtns()[+ct.dataset.ci];if(b)b.click();return}
const c=e.target.closest(".lfresh .card");
if(c&&typeof items!=="undefined"&&typeof show==="function"){const it=items.find(x=>x.id===c.dataset.id);if(it){e.preventDefault();show(it)}return}
if(e.target.closest(".lgo"))signup("vendeur");
});
/* Catégories */
function cats(){
if(L.querySelector(".lcatsec"))return;
const b=catBtns().slice(0,9);
if(b.length<3)return;
hero.insertAdjacentHTML("afterend",'<div class="lcatsec"><h2 class="lh2">Explorez par catégorie</h2><div class="lcats">'+b.map((x,i)=>'<button type="button" data-ci="'+i+'">'+E(x.textContent.trim())+"</button>").join("")+"</div></div>");
}
/* Nouveautés réelles */
function fresh(){
const old=L.querySelector(".lfresh");
if(typeof items==="undefined"||typeof card!=="function"){return}
const list=items.filter(i=>!i.vendu&&i.photos&&i.photos[0]).slice(0,8);
if(list.length<4){if(old)old.remove();return}
const html='<div class="lfresh"><h2 class="lh2">🆕 Fraîchement publiées</h2><div class="lrow">'+list.map(i=>card(i)).join("")+"</div></div>";
if(old)old.remove();
hero.insertAdjacentHTML("afterend",html);
}
let tm;
const g=q("#grid");
if(g)new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(fresh,300)}).observe(g,{childList:true});
setTimeout(cats,300);setTimeout(cats,2000);setTimeout(fresh,1500);
/* Estimateur vendeur */
const grid=L.querySelector(".lgrid");
if(grid)grid.insertAdjacentHTML("afterend",'<h2 class="lh2">Combien allez-vous gagner ?</h2><div class="lest"><label for="lprix">Prix de vente de votre article (FCFA)</label><input id="lprix" type="number" inputmode="numeric" min="0" placeholder="Ex : 50000"><div class="lres" id="lres">Entrez un prix pour voir ce que vous recevez.</div><button type="button" class="lgo">🏪 Je commence à vendre</button></div>');
const pr=q("#lprix");
if(pr)pr.addEventListener("input",()=>{
const p=Math.round(+pr.value);
const r=q("#lres");
if(!(p>=100)){r.textContent="Entrez un prix pour voir ce que vous recevez.";return}
let fee=0;
try{fee=typeof protFee==="function"?protFee(p):0}catch(e){}
r.innerHTML="💰 Vous recevez <b>"+fc(p)+"</b>.<br>Commission Finder : <b>0 FCFA</b>."+(fee>0?"<br>L’acheteur paie "+fc(p+fee)+", dont "+fc(fee)+" de protection acheteur.":"")+"<br><small>Vous êtes payé quand l’acheteur a reçu et vérifié l’article.</small>";
});
/* Questions fréquentes */
const fin=L.querySelector(".lfin");
const FAQ=[
["Est-ce vraiment gratuit ?","Créer un compte et publier des annonces est gratuit. Les vendeurs ne paient aucune commission sur leurs ventes. L’acheteur paie une petite protection acheteur, affichée avant chaque achat."],
["Comment mon argent est-il protégé ?","Quand vous achetez, l’argent est gardé par Finder. Le vendeur n’est payé que lorsque vous avez reçu l’article, l’avez vérifié et lui avez donné votre code de remise."],
["Et si l’article ne correspond pas ?","Vous pouvez ouvrir un litige : un modérateur Finder examine la situation et tranche."],
["Je ne sais pas lire, puis-je utiliser Finder ?","Oui. Fina vous guide à voix haute pour créer votre compte, lit les annonces, et vous pouvez chercher et dicter avec votre voix."],
["Comment éviter les arnaques et les objets volés ?","Les téléphones sont contrôlés par leur numéro IMEI, les vendeurs peuvent être vérifiés, et nous vous conseillons de rencontrer le vendeur dans un lieu public."],
["Comment je reçois mon argent en tant que vendeur ?","Quand l’acheteur vous donne son code après avoir vérifié l’article, l’argent arrive dans votre porte-monnaie Finder. Vous pouvez ensuite demander un retrait, disponible dès l’ouverture officielle des paiements."]
];
if(fin)fin.insertAdjacentHTML("beforebegin",'<h2 class="lh2">Vos questions</h2><div class="lfaq">'+FAQ.map(f=>"<details><summary>"+E(f[0])+"</summary><p>"+E(f[1])+"</p></details>").join("")+"</div>");
}
})();
// FIN DU FICHIER
