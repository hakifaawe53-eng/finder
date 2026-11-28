// Finder - profil.js : Connexion et Déconnexion dans l'onglet Profil, confirmation avant déconnexion
(function(){
if(window.__finderProfil)return;window.__finderProfil=1;
const q=s=>document.querySelector(s);
const css=document.createElement("style");
css.textContent=`
@media(max-width:899px){#auth{display:none!important}}
#diagb:not([data-ok]){display:none!important}
#dlogout{width:min(92vw,420px)}
#dlogout h2{font-size:1.25rem;margin:0 0 8px}
#dlogout p{margin:0 0 14px;color:#5B6B73;line-height:1.45}
#dlogout .row{display:flex;flex-direction:column;gap:10px}
#dlogout button{padding:14px;border-radius:14px;font-weight:800;font-size:1rem;cursor:pointer}
#dlogout .stay{border:0;background:linear-gradient(135deg,#00A39A,#007782);color:#fff}
#dlogout .out{border:1.5px solid #E5484D;background:#fff;color:#B42318}
.lmini a{color:#fff;font-weight:800;text-decoration:underline}
`;
document.head.appendChild(css);
const isOut=()=>typeof user==="undefined"||!user;
/* Le bouton « Profil » du bas devient « Connexion » quand personne n'est connecté */
function navLabel(){
const b=q('#bnav [data-n="me"]');
if(!b)return;
const tn=[...b.childNodes].reverse().find(n=>n.nodeType===3&&n.nodeValue.trim());
if(tn)tn.nodeValue=isOut()?"Connexion":"Profil";
}
[600,1500,3500].forEach(t=>setTimeout(navLabel,t));
try{sb.auth.onAuthStateChange(()=>setTimeout(navLabel,500))}catch(e){}
/* Confirmation avant déconnexion */
document.body.insertAdjacentHTML("beforeend",'<dialog id="dlogout" data-vx="1"><h2>Se déconnecter ?</h2><p>Vous devrez saisir de nouveau votre numéro ou votre e-mail et votre mot de passe pour vous reconnecter.</p><div class="row"><button type="button" class="stay">Rester connecté</button><button type="button" class="out">Me déconnecter</button></div></dialog>');
const dl=q("#dlogout");
dl.querySelector(".stay").onclick=()=>dl.close();
dl.querySelector(".out").onclick=async()=>{
dl.close();
const h=q("#dhub");if(h&&h.open)h.close();
try{await sb.auth.signOut()}catch(e){}
};
const au=q("#auth");
if(au)au.addEventListener("click",e=>{
if(isOut())return;
e.preventDefault();e.stopImmediatePropagation();
if(!dl.open)dl.showModal();
},true);
/* Lien « Se connecter » sous le grand bloc vert, pour les visiteurs */
let n=0;
const iv=setInterval(()=>{
const m=q("#landing .lmini");
if(m){
clearInterval(iv);
if(!q("#landing [data-login]"))m.insertAdjacentHTML("afterend",'<p class="lmini">Déjà inscrit ? <a href="#" data-login>Se connecter</a></p>');
}else if(++n>25)clearInterval(iv);
},400);
document.addEventListener("click",e=>{
if(!e.target.closest("[data-login]"))return;
e.preventDefault();
const d=q("#da");
if(d&&!d.open)d.showModal();
});
})();
// FIN DU FICHIER
