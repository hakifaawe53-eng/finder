// Finder - tel.js : connexion par numéro de téléphone + écran « mot de passe oublié » moins grand
(function(){
if(window.__finderTel)return;window.__finderTel=1;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const f=q("#af");
if(!f)return;
const css=document.createElement("style");
css.textContent=`
.atabs{display:flex;gap:8px;margin:4px 0 12px}
.atabs button{flex:1;border:0;background:#EEF3F3;color:#12212B;border-radius:999px;padding:11px 8px;font-weight:700;font-size:.95rem;cursor:pointer}
.atabs button.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff}
.telrow{display:flex;align-items:center;gap:8px}
.telrow span{flex:0 0 auto;background:#EEF8F7;border-radius:12px;padding:12px 10px;font-weight:700;white-space:nowrap}
.telrow input{flex:1;min-width:0;font-size:1.25rem;letter-spacing:.04em}
.tnote{font-size:.82rem;color:#6A7B84;margin:6px 0}
#fg{font-size:.88rem}
#dfp h2,#dfx h2{font-size:1.25rem}
#dfp h3{font-size:1.05rem}
#dfp p,#dfx p{font-size:.92rem}
#dfp label{font-size:.9rem}
#dfp input{font-size:1rem}
#dfp .fpl,#dfx .fpl{font-size:.85rem}
.fpok{font-size:1.8rem!important}
#dfp .row button,#dfx .row button,#fpb{font-size:.95rem}
`;
document.head.appendChild(css);
const em=q("#em"),pw=q("#pw");
const emL=f.querySelector('label[for="em"]');
if(!em||!pw||!emL)return;
emL.insertAdjacentHTML("beforebegin",'<div class="atabs" id="atabs"><button type="button" data-m="tel">📱 Téléphone</button><button type="button" data-m="email">✉️ E-mail</button></div><div id="tbox"><label for="tel">Numéro de téléphone</label><div class="telrow"><span>🇨🇮 +225</span><input id="tel" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="07 00 00 00 00" maxlength="14"></div><p class="tnote">🔒 Votre numéro reste privé : il sert uniquement à vous connecter.</p></div>');
const tel=q("#tel");
let AM=LS.get("finder_auth_mode")==="email"?"email":"tel";
function setMode(m){
AM=m;LS.set("finder_auth_mode",m);
q("#tbox").style.display=m==="tel"?"":"none";
em.style.display=m==="tel"?"none":"";
emL.style.display=m==="tel"?"none":"";
em.required=m!=="tel";
tel.required=m==="tel";
q("#atabs").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.m===m));
const am=q("#am");if(am)am.textContent="";
}
q("#atabs").onclick=e=>{const b=e.target.closest("[data-m]");if(b)setMode(b.dataset.m)};
function digits(v){
let d=String(v||"").replace(/\D/g,"");
if(d.startsWith("00225"))d=d.slice(5);
else if(d.startsWith("225")&&d.length>10)d=d.slice(3);
return d.slice(0,10);
}
tel.addEventListener("input",()=>{tel.value=digits(tel.value).replace(/(\d{2})(?=\d)/g,"$1 ")});
function e164(){const d=digits(tel.value);return/^0\d{9}$/.test(d)?"+225"+d:""}
function msg(er,signup){
const t=String(er.message||"").toLowerCase(),c=String(er.code||"");
if(/banned/.test(t))return"Ce compte a été suspendu par Finder.";
if(/disabled|not enabled/.test(t)||c==="phone_provider_disabled")return"La connexion par téléphone n’est pas encore activée sur Finder. Utilisez l’onglet E-mail.";
if(/already|exists/.test(t)||c==="phone_exists"||c==="user_already_exists")return"Ce numéro a déjà un compte. Touchez « Se connecter ».";
if(/otp|sms|provider|twilio|send/.test(t))return"L’envoi du code par SMS a échoué : le service SMS n’est pas configuré.";
if(/rate|too many/.test(t)||er.status===429)return"Trop d’essais. Réessayez dans quelques minutes.";
if(/invalid login|invalid credentials|incorrect/.test(t))return"Numéro ou mot de passe incorrect.";
return signup?"Création impossible. Vérifiez le numéro et utilisez 6 caractères minimum.":"Numéro ou mot de passe incorrect.";
}
const D0=window.doAuth;
window.doAuth=async function(signup){
if(AM!=="tel"&&typeof D0==="function")return D0.apply(this,arguments);
const m=q("#am"),num=e164(),pass=pw.value;
if(!num){m.textContent="Entrez votre numéro à 10 chiffres, par exemple 07 00 00 00 00.";tel.focus();return}
if(pass.length<6){m.textContent="Le mot de passe doit avoir au moins 6 caractères.";pw.focus();return}
m.textContent="Un instant…";
let r;
try{
r=signup?await sb.auth.signUp({phone:num,password:pass}):await sb.auth.signInWithPassword({phone:num,password:pass});
}catch(e){m.textContent="Connexion impossible. Vérifiez votre connexion Internet.";return}
if(r&&r.error){m.textContent=msg(r.error,signup);return}
if(signup&&!(r&&r.data&&r.data.session)){m.textContent="Compte créé. Si un code vous est envoyé par SMS, entrez-le puis connectez-vous.";return}
m.textContent="";
q("#da").close();
};
const fg=q("#fg");
if(fg)fg.addEventListener("click",e=>{
if(AM!=="tel")return;
e.preventDefault();e.stopImmediatePropagation();
q("#am").textContent="Mot de passe oublié avec un numéro : contactez le support Finder (menu ☰, « Contacter le support ») pour retrouver votre compte.";
},true);
setMode(AM);
})();
// FIN DU FICHIER
