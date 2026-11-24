// Finder - accueil.js : assistante vocale d'accueil des nouveaux visiteurs
(function(){
if(window.__finderAccueil)return;window.__finderAccueil=1;
/* ===== Textes à modifier si besoin ===== */
const NOM="Fina";
const ETAPES=[
{ic:"👋",t:"Bienvenue sur Finder !",x:"Bonjour et bienvenue sur Finder ! Je m’appelle "+NOM+", je suis votre assistante. Je suis très heureuse de vous accueillir. Installez-vous bien, je vais vous présenter Finder en quelques instants."},
{ic:"🛍️",t:"Finder, c’est quoi ?",x:"Finder est la plateforme ivoirienne pour acheter et vendre des articles d’occasion : téléphones, vêtements, chaussures, appareils électroniques et bien d’autres choses, partout en Côte d’Ivoire."},
{ic:"🌍",t:"Notre mission",x:"Notre mission est simple : permettre à chacun d’acheter et de vendre en toute confiance. Nous voulons donner une seconde vie aux objets, aider les familles à faire de bonnes affaires, et offrir à toutes celles et ceux qui vendent un endroit sûr pour gagner de l’argent."},
{ic:"🛡️",t:"Votre sécurité",x:"Votre sécurité compte beaucoup pour nous. Quand vous achetez, votre argent est protégé : il n’est remis au vendeur qu’après que vous avez reçu et vérifié votre article. Les vendeurs et les boutiques peuvent être vérifiés, et nous contrôlons les annonces pour lutter contre les arnaques et les articles volés."},
{ic:"🛒",t:"Acheter, c’est facile",x:"Pour acheter, parcourez les annonces, touchez celle qui vous plaît, puis écrivez au vendeur ou achetez directement. Vous recevez un code de remise. Ne donnez ce code au vendeur qu’après avoir bien vérifié votre article."},
{ic:"📸",t:"Vendre aussi",x:"Pour vendre, passez en compte vendeur, touchez Vendre, prenez de belles photos et indiquez votre prix. Vous pouvez même dicter la description avec votre voix. Chez Finder, vous ne payez aucune commission sur vos ventes."},
{ic:"🎧",t:"Je reste avec vous",x:"Je reste toujours avec vous. Touchez le bouton rond en bas à gauche de l’écran : vous pourrez écouter les annonces, chercher en parlant, ou agrandir les lettres."},
{ic:"🎉",t:"Merci et bonnes affaires !",x:"Merci d’avoir choisi Finder ! Toute l’équipe vous souhaite un excellent séjour, et de très bonnes affaires. Touchez Commencer pour découvrir les annonces."}
];
/* ======================================= */
const KEY="finder_accueil_v1";
const TTS=window.speechSynthesis;
const q=s=>document.querySelector(s);
const css=document.createElement("style");
css.textContent=`
#acc{position:fixed;inset:0;z-index:3000;background:linear-gradient(160deg,#00A39A,#005961);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.accc{background:#fff;border-radius:28px;max-width:460px;width:100%;padding:22px 20px 16px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35);max-height:100%;overflow:auto}
.accav{width:84px;height:84px;margin:0 auto 4px;border-radius:50%;background:linear-gradient(135deg,#00A39A,#007782);display:flex;align-items:center;justify-content:center;font-size:2.6rem;position:relative}
.accav.talk::after{content:"";position:absolute;inset:-8px;border-radius:50%;border:3px solid rgba(0,163,154,.55);animation:accp 1.2s ease-out infinite}
@keyframes accp{0%{transform:scale(.9);opacity:1}100%{transform:scale(1.3);opacity:0}}
.accnm{color:#5B6B73;font-size:.9rem;margin-bottom:10px}
.accic{font-size:3rem;line-height:1.2}
#acc h2{font-size:1.5rem;margin:6px 0;color:#12212B}
#acctx{font-size:1.15rem;line-height:1.5;color:#12212B;margin:8px 0 14px}
.accdots{display:flex;justify-content:center;gap:6px;margin-bottom:14px}
.accdots i{width:10px;height:10px;border-radius:50%;background:#DDE8E8;display:block}
.accdots i.d{background:#7FD1CB}
.accdots i.on{background:#007782;transform:scale(1.25)}
.accp{width:100%;padding:16px;border-radius:16px;border:0;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-size:1.15rem;font-weight:800;cursor:pointer}
.accs{width:100%;padding:12px;margin-top:8px;border-radius:14px;border:1.5px solid #BFE5E1;background:#fff;color:#005961;font-weight:700;font-size:1rem;cursor:pointer}
.accl{margin-top:8px;background:none;border:0;color:#6A7B84;text-decoration:underline;font-size:.9rem;padding:8px;cursor:pointer}
.accv{font-size:.85rem;color:#6A7B84;margin:0 0 8px}
`;
document.head.appendChild(css);
let i=0,tok=0,started=false,auto=true,el=null;
const last=ETAPES.length-1;
function say(text,done){
if(!TTS)return false;
try{TTS.cancel()}catch(e){}
const parts=text.match(/[^.!?]+[.!?]*/g)||[text];
const chunks=[];let cur="";
parts.forEach(p=>{if((cur+p).length>170&&cur){chunks.push(cur);cur=p}else cur+=p});
if(cur)chunks.push(cur);
const vs=TTS.getVoices();
const v=vs.find(x=>/^fr[-_]FR/i.test(x.lang))||vs.find(x=>/^fr/i.test(x.lang));
setTimeout(()=>{
chunks.forEach((c,k)=>{
const u=new SpeechSynthesisUtterance(c.trim());
u.lang="fr-FR";u.rate=.88;u.pitch=1.05;
if(v)u.voice=v;
if(k===chunks.length-1)u.onend=done;
TTS.speak(u);
});
},80);
return true;
}
function stopVoice(){
tok++;
try{TTS&&TTS.cancel()}catch(e){}
const a=q("#accav");if(a)a.classList.remove("talk");
}
function render(){
const e=ETAPES[i];
q("#accic").textContent=e.ic;
q("#acct").textContent=e.t;
q("#acctx").textContent=e.x;
q("#accdots").innerHTML=ETAPES.map((_,k)=>'<i class="'+(k===i?"on":k<i?"d":"")+'"></i>').join("");
const n=q("#accn");
n.textContent=!started?"▶ Écouter mon message de bienvenue":i===last?"Commencer 🚀":"Suivant ➜";
q("#accr").style.display=started?"":"none";
q("#accx").style.display=i===last?"none":"";
q("#accv").style.display=started?"none":"";
}
function play(k){
i=k;
const my=++tok;
render();
const av=q("#accav");
const text=ETAPES[i].x;
const ok=say(text,()=>{
if(my!==tok)return;
av.classList.remove("talk");
if(auto&&i<last)setTimeout(()=>{if(my===tok)play(i+1)},900);
});
if(ok){
av.classList.add("talk");
setTimeout(()=>{
if(my!==tok)return;
av.classList.remove("talk");
if(auto&&i<last)play(i+1);
},text.length*80+4000);
}
}
function finish(){
stopVoice();
try{localStorage.setItem(KEY,"1")}catch(e){}
if(el){el.remove();el=null}
window.scrollTo(0,0);
}
function open(){
if(el)return;
started=false;i=0;
document.body.insertAdjacentHTML("beforeend",'<div id="acc" role="dialog" aria-modal="true" aria-label="Accueil Finder"><div class="accc"><div class="accav" id="accav">🎧</div><div class="accnm">'+NOM+', votre assistante</div><div class="accic" id="accic"></div><h2 id="acct"></h2><p id="acctx"></p><div class="accdots" id="accdots"></div><p class="accv" id="accv">🔊 Montez le volume de votre téléphone pour m’entendre.</p><button type="button" class="accp" id="accn"></button><button type="button" class="accs" id="accr">🔁 Répéter</button><button type="button" class="accl" id="accx">Passer l’accueil</button></div></div>');
el=q("#acc");
render();
q("#accn").onclick=()=>{
if(!started){started=true;auto=!!TTS;play(0);return}
if(i===last){finish();return}
stopVoice();
play(i+1);
};
q("#accr").onclick=()=>{stopVoice();play(i)};
q("#accx").onclick=finish;
}
function dejaVu(){try{return localStorage.getItem(KEY)==="1"}catch(e){return false}}
setTimeout(()=>{
const h=location.hash+location.search;
if(/access_token|type=recovery|error=|paiement/i.test(h))return;
if(dejaVu())return;
if(typeof user!=="undefined"&&user){try{localStorage.setItem(KEY,"1")}catch(e){}return}
if(document.querySelector("dialog[open]"))return;
open();
},1800);
/* Bouton « Revoir l'accueil » dans le menu d'aide vocale */
let n=0;
const iv=setInterval(()=>{
const m=q("#vxm");
if(m){
clearInterval(iv);
m.insertAdjacentHTML("afterbegin",'<button type="button" data-v="accueil">👋 Revoir l’accueil</button>');
m.addEventListener("click",e=>{if(e.target.closest('[data-v="accueil"]')){stopVoice();open()}});
}else if(++n>60)clearInterval(iv);
},500);
/* Aide */
try{
const hs=[...document.querySelectorAll("#dhelp h3")].find(h=>h.textContent.trim().startsWith("Sécurité"));
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Revoir la présentation de Finder</summary><p>Appuyez sur le bouton rond en bas à gauche, puis sur « Revoir l’accueil » : "+NOM+" vous présente Finder à voix haute.</p></details>");
}catch(e){}
})();
// FIN DU FICHIER
