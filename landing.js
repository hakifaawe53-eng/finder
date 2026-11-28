// Finder - landing.js : accueil de conversion pour les visiteurs + connexion plus attirante
(function(){
if(window.__finderLanding)return;window.__finderLanding=1;
const q=s=>document.querySelector(s);
const main=q("main");
if(!main)return;
const css=document.createElement("style");
css.textContent=`
#landing{margin:0 0 18px}
.lhero{background:linear-gradient(150deg,#00A39A,#005961);color:#fff;border-radius:24px;padding:22px 18px;box-shadow:0 12px 30px rgba(0,89,97,.28)}
.lhero h1{font-size:1.55rem;line-height:1.2;margin:0 0 8px;color:#fff}
.lhero p{margin:0 0 14px;font-size:1rem;line-height:1.45;opacity:.95}
.lcta{display:flex;flex-direction:column;gap:10px}
.lcta button{border-radius:16px;padding:15px;font-size:1.05rem;font-weight:800;cursor:pointer;border:0}
.lbuy{background:#fff;color:#005961}
.lsell{background:rgba(255,255,255,.16);color:#fff;border:2px solid rgba(255,255,255,.7)!important}
.lmini{font-size:.85rem;margin:12px 0 0;opacity:.92}
.lstats{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0}
.lstats span{background:rgba(255,255,255,.16);border-radius:999px;padding:6px 12px;font-size:.82rem;font-weight:700}
.lh2{font-size:1.2rem;margin:20px 2px 10px}
.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.lc{background:#fff;border:1px solid #E2EBEB;border-radius:18px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.lc i{font-style:normal;font-size:1.6rem;display:block;margin-bottom:6px}
.lc b{display:block;font-size:.95rem;margin-bottom:4px}
.lc span{font-size:.82rem;color:#5B6B73;line-height:1.35}
.ltabs{display:flex;gap:8px;margin-bottom:10px}
.ltabs button{flex:1;border:0;background:#EEF3F3;border-radius:999px;padding:11px;font-weight:700;cursor:pointer}
.ltabs button.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff}
.lstep{display:flex;gap:12px;align-items:flex-start;background:#F4FAFA;border-radius:16px;padding:12px;margin-bottom:8px}
.lstep em{flex:0 0 32px;height:32px;border-radius:50%;background:#007782;color:#fff;font-style:normal;font-weight:800;display:flex;align-items:center;justify-content:center}
.lstep b{display:block}
.lstep span{font-size:.88rem;color:#5B6B73}
.lfin{background:linear-gradient(135deg,#EEF8F7,#DDF3F1);border-radius:22px;padding:18px;text-align:center;margin-top:16px}
.lfin b{font-size:1.1rem}
.lfin p{margin:6px 0 0;font-size:.9rem;color:#5B6B73}
.lfin button{margin-top:12px;width:100%;border:0;border-radius:16px;padding:15px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-size:1.05rem;font-weight:800;cursor:pointer}
#lbar{position:fixed;left:84px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:55;background:#fff;border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,.25);padding:10px 12px;display:flex;align-items:center;gap:8px}
#lbar[hidden]{display:none}
#lbar b{flex:1;font-size:.85rem;line-height:1.25}
#lbar .go{border:0;border-radius:14px;padding:11px 12px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}
#lbar .x{border:0;background:none;font-size:1.2rem;color:#6A7B84;cursor:pointer}
.dabene{background:linear-gradient(135deg,#EEF8F7,#DDF3F1);border-radius:16px;padding:12px;margin:0 0 12px}
.dabene b{display:block;font-size:1.05rem;margin-bottom:4px}
.dabene span{display:inline-block;background:#fff;border-radius:999px;padding:4px 10px;margin:4px 4px 0 0;font-size:.8rem;font-weight:700;color:#005961}
@media(min-width:700px){.lcta{flex-direction:row}.lcta button{flex:1}.lgrid{grid-template-columns:repeat(4,1fr)}}
`;
document.head.appendChild(css);
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ST={
buy:[["Cherchez","Tapez ce que vous voulez ou parcourez les catégories."],["Discutez et négociez","Écrivez au vendeur, demandez des photos ou proposez votre prix."],["Payez en sécurité","Votre argent n’est remis au vendeur qu’après que vous avez reçu et vérifié l’article."]],
sell:[["Créez votre compte","Gratuit, en 3 minutes, guidé à voix haute."],["Publiez","Prenez des photos, indiquez le prix : c’est en ligne."],["Soyez payé","Vous recevez votre argent quand l’acheteur a vérifié l’article. Aucune commission sur vos ventes."]]
};
const steps=k=>ST[k].map((s,n)=>'<div class="lstep"><em>'+(n+1)+'</em><div><b>'+E(s[0])+'</b><span>'+E(s[1])+'</span></div></div>').join("");
const CARDS=[["🛡️","Argent protégé","Le vendeur n’est payé qu’après votre vérification de l’article."],["✅","Vendeurs vérifiés","Boutiques certifiées et identités contrôlées."],["💸","Zéro commission","Les vendeurs gardent tout ce qu’ils gagnent."],["🤝","Prix négociable","Proposez votre prix, le vendeur peut accepter."],["🔎","Contre le vol","Les téléphones sont contrôlés par leur numéro IMEI."],["📍","Rendez-vous sûrs","Rencontre en lieu public, avec partage de position."],["💬","Messagerie complète","Photos, vidéos et messages vocaux."],["🎧","Voix pour tous","Fina lit les annonces et vous guide à voix haute."]];
main.insertAdjacentHTML("afterbegin",'<section id="landing" hidden><div class="lhero"><h1>Achetez et vendez l’occasion en toute confiance.</h1><p>Téléphones, vêtements, électronique et plus : trouvez la bonne affaire près de chez vous, ou vendez ce que vous n’utilisez plus.</p><div class="lcta"><button type="button" class="lbuy" data-l="buy">🛒 Je veux acheter</button><button type="button" class="lsell" data-l="sell">🏪 Je veux vendre</button></div><div class="lstats"><span>🆓 Gratuit</span><span>🛡️ Argent protégé</span><span>🎧 Aide vocale</span><span id="lcount" hidden></span></div><p class="lmini">Créer un compte prend 3 minutes : Fina vous guide à voix haute.</p></div><h2 class="lh2">Pourquoi choisir Finder ?</h2><div class="lgrid">'+CARDS.map(c=>'<div class="lc"><i>'+c[0]+'</i><b>'+E(c[1])+'</b><span>'+E(c[2])+'</span></div>').join("")+'</div><h2 class="lh2">Comment ça marche ?</h2><div class="ltabs"><button type="button" class="on" data-lt="buy">Acheter</button><button type="button" data-lt="sell">Vendre</button></div><div id="lsteps">'+steps("buy")+'</div><div class="lfin"><b>Prêt à commencer ?</b><p>Rejoignez Finder gratuitement.</p><button type="button" data-l="join">✨ Créer mon compte gratuit</button></div></section>');
document.body.insertAdjacentHTML("beforeend",'<div id="lbar" hidden><b>Créez votre compte gratuit en 3 minutes</b><button type="button" class="go">Commencer</button><button type="button" class="x" aria-label="Fermer">✕</button></div>');
function signup(m){window.__regPreMode=m||"";const s=q("#su");if(s)s.click()}
q("#landing").addEventListener("click",e=>{
const t=e.target.closest("[data-lt]");
if(t){q("#landing").querySelectorAll("[data-lt]").forEach(b=>b.classList.toggle("on",b===t));q("#lsteps").innerHTML=steps(t.dataset.lt);return}
const b=e.target.closest("[data-l]");
if(!b)return;
const a=b.dataset.l;
if(a==="buy"){const s=q("#sect");if(s)s.scrollIntoView({behavior:"smooth",block:"start"})}
else if(a==="sell")signup("vendeur");
else signup("");
});
const bar=q("#lbar");
bar.querySelector(".go").onclick=()=>signup("");
bar.querySelector(".x").onclick=()=>{bar.hidden=true;try{sessionStorage.setItem("finder_lbar_off","1")}catch(e){}};
const isOut=()=>typeof user==="undefined"||!user;
function sync(){
const out=isOut();
const sect=q("#sect"),qq=q("#q");
const home=sect&&/Toutes les annonces/i.test(sect.textContent)&&!(qq&&qq.value.trim());
q("#landing").hidden=!(out&&home);
if(!out)bar.hidden=true;
}
setTimeout(sync,900);
setTimeout(sync,2500);
try{sb.auth.onAuthStateChange(()=>setTimeout(sync,400))}catch(e){}
const sect=q("#sect");
if(sect)new MutationObserver(sync).observe(sect,{childList:true,characterData:true,subtree:true});
const qq=q("#q");
if(qq)qq.addEventListener("input",sync);
setTimeout(()=>{
let off=null;try{off=sessionStorage.getItem("finder_lbar_off")}catch(e){}
if(isOut()&&!off&&!document.querySelector("dialog[open]")&&!q("#nudge"))bar.hidden=false;
},10000);
try{
sb.from("listings").select("id",{count:"exact",head:true}).eq("statut","actif").eq("vendu",false).then(r=>{
const n=r&&r.count;
if(n&&n>=10){const c=q("#lcount");c.textContent="📦 "+n+" annonces en ligne";c.hidden=false}
});
}catch(e){}
new MutationObserver(()=>{
const m=window.__regPreMode;
if(!q("#dreg")){if(m)window.__regPreMode="";return}
if(!m)return;
const b=q('#dreg [data-t="'+m+'"]');
if(b&&!q("#dreg [data-t].on"))b.click();
}).observe(document.body,{childList:true,subtree:true});
const af=q("#af");
if(af&&!q(".dabene"))af.insertAdjacentHTML("afterbegin",'<div class="dabene"><b>👋 Rejoignez Finder, c’est gratuit</b><span>🛡️ Argent protégé</span><span>✅ Vendeurs vérifiés</span><span>💸 Sans commission pour les vendeurs</span><span>🎧 Fina vous guide à voix haute</span></div>');
const su=q("#su");
if(su){
su.textContent="✨ Créer mon compte gratuit";
const row=su.closest(".row");
if(row&&!q(".dabene2"))row.insertAdjacentHTML("afterend",'<p class="meta dabene2">Ça prend 3 minutes : Fina vous guide pas à pas.</p>');
}
})();
// FIN DU FICHIER
