// Finder - reset.js : parcours « Mot de passe oublié » fiable
(function(){
if(window.__finderReset)return;window.__finderReset=1;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const st=document.createElement("style");
st.textContent="#dfp,#dfx{width:min(96vw,440px)}.fpok{font-size:2.4rem;text-align:center;margin:6px 0}.fpl{margin:8px 0;padding-left:20px;color:#6A7B84;font-size:.9rem;text-align:left}#fg{display:inline-block;margin:6px 0;font-weight:600;cursor:pointer}#fp2,#dfx{text-align:center}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dfp"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Mot de passe oublié</h2></div><div id="fp1"><p>Entrez l’adresse e-mail de votre compte. Nous vous envoyons un lien pour choisir un nouveau mot de passe.</p><form id="fpf"><label for="fpe">Adresse e-mail</label><input id="fpe" type="email" required autocomplete="email" inputmode="email"><p class="err" id="fpm" role="alert"></p><button class="pri" id="fpb">Envoyer le lien</button></form></div><div id="fp2" hidden><div class="fpok">📧</div><h3>Vérifiez votre messagerie</h3><p id="fpt"></p><ul class="fpl"><li>Le message peut mettre quelques minutes à arriver.</li><li>Regardez aussi dans les courriers indésirables (spam).</li><li>Ouvrez le lien directement dans votre navigateur (Chrome ou Safari), pas dans un aperçu intégré.</li></ul><div class="row"><button type="button" class="pri" id="fpmail">Ouvrir ma messagerie</button><button type="button" id="fpre" disabled>Renvoyer le lien</button></div></div></dialog><dialog id="dfx"><div class="fpok">⏳</div><h2>Ce lien n’est plus valide</h2><p id="fxt"></p><ul class="fpl"><li>Demandez un nouveau lien, puis ouvrez-le sans attendre.</li><li>Ouvrez-le directement dans Chrome ou Safari (copiez-collez l’adresse si besoin).</li></ul><div class="row"><button type="button" class="pri" id="fxnew">Demander un nouveau lien</button><button type="button" data-x>Fermer</button></div></dialog>');
const fp=q("#dfp"),fx=q("#dfx");
fp.querySelector("[data-x]").onclick=()=>fp.close();
fx.querySelector("[data-x]").onclick=()=>fx.close();
let timer=null,mail="";
const step=n=>{q("#fp1").hidden=n!==1;q("#fp2").hidden=n!==2};
function openFp(){
step(1);
q("#fpm").textContent="";
const e=q("#fpe");
e.value=(q("#em")?q("#em").value:"").trim();
q("#fpb").disabled=false;
if(!fp.open)fp.showModal();
setTimeout(()=>e.focus(),150);
}
function countdown(s){
clearInterval(timer);
const b=q("#fpre");
b.disabled=true;
let n=s;
const tick=()=>{
b.textContent=n>0?"Renvoyer le lien ("+n+" s)":"Renvoyer le lien";
if(n<=0){clearInterval(timer);b.disabled=false}
n--;
};
tick();
timer=setInterval(tick,1000);
}
async function send(email){
const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
if(!error)return"";
const t=String(error.message||"");
const s=/after (\d+) seconds?/i.exec(t);
if(s)return"Patientez "+s[1]+" secondes avant de redemander un lien.";
if(error.status===429||/rate limit|too many/i.test(t))return"Trop de demandes d’e-mails pour le moment. Réessayez dans une heure, ou contactez le support.";
if(/invalid|valid email/i.test(t))return"Adresse e-mail invalide.";
return"L’envoi a échoué. Vérifiez votre connexion et réessayez dans quelques minutes.";
}
function show2(email,sec){
mail=email;
q("#fpt").innerHTML="Si un compte existe avec <b>"+esc(email)+"</b>, un lien pour choisir un nouveau mot de passe vient d’être envoyé.";
step(2);
countdown(sec);
}
q("#fpf").onsubmit=async e=>{
e.preventDefault();
const email=q("#fpe").value.trim().toLowerCase(),m=q("#fpm"),b=q("#fpb");
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){m.textContent="Entrez une adresse e-mail valide.";return}
const last=+LS.get("finder_fp_"+email)||0,left=60-Math.floor((Date.now()-last)/1000);
if(left>0){show2(email,left);return}
b.disabled=true;
m.textContent="Envoi en cours…";
const msg=await send(email);
b.disabled=false;
if(msg){m.textContent=msg;return}
LS.set("finder_fp_"+email,String(Date.now()));
show2(email,60);
};
q("#fpre").onclick=async()=>{
const b=q("#fpre");
b.disabled=true;
const msg=await send(mail);
if(msg){q("#fpt").textContent=msg;b.disabled=false;return}
LS.set("finder_fp_"+mail,String(Date.now()));
showToast("Un nouveau lien a été envoyé ✓","msg");
countdown(60);
};
q("#fpmail").onclick=()=>{
const d=(mail.split("@")[1]||"").toLowerCase();
const u=/gmail|googlemail/.test(d)?"https://mail.google.com/":/outlook|hotmail|live|msn/.test(d)?"https://outlook.live.com/mail/":/yahoo|ymail/.test(d)?"https://mail.yahoo.com/":"";
if(u)window.open(u,"_blank","noopener");else location.href="mailto:";
};
q("#fxnew").onclick=()=>{fx.close();openFp()};
const fg=q("#fg");
if(fg){
fg.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();openFp()};
fg.setAttribute("role","button");
}
function linkError(){
const h=new URLSearchParams((location.hash||"").replace(/^#/,"")),s=new URLSearchParams(location.search);
const code=h.get("error_code")||s.get("error_code")||"",desc=h.get("error_description")||s.get("error_description")||"";
if(!code&&!desc)return;
history.replaceState(null,"",location.pathname);
q("#fxt").textContent=(code==="otp_expired"||/expired/i.test(desc))?"Ce lien a expiré ou a déjà été utilisé. C’est fréquent : certaines messageries ouvrent le lien automatiquement avant vous.":"Ce lien n’a pas pu être utilisé.";
fx.showModal();
}
setTimeout(linkError,600);
const dn=q("#dn");
if(dn){
const sm=HTMLDialogElement.prototype.showModal;
const OKID=["dn","dmfa","dok","dfp","dfx"];
HTMLDialogElement.prototype.showModal=function(){
if(window.__recov&&!OKID.includes(this.id))return;
return sm.apply(this,arguments);
};
function enhance(){
const np=q("#np");
if(!np||q("#nph"))return;
np.insertAdjacentHTML("afterend",'<p class="meta" id="nph">8 caractères minimum. Mélangez lettres, chiffres et symboles.</p>');
np.addEventListener("input",()=>{
const v=np.value;
let s=0;
if(v.length>=8)s++;
if(v.length>=12)s++;
if(/[a-z]/.test(v)&&/[A-Z]/.test(v))s++;
if(/\d/.test(v))s++;
if(/[^A-Za-z0-9]/.test(v))s++;
q("#nph").textContent=v?"Robustesse : "+(s<=2?"faible":s<=3?"moyenne":"forte")+(v.length<8?" · 8 caractères minimum":""):"8 caractères minimum. Mélangez lettres, chiffres et symboles.";
});
}
new MutationObserver(()=>{window.__recov=dn.open;if(dn.open)enhance()}).observe(dn,{attributes:true,attributeFilter:["open"]});
if(dn.open){window.__recov=true;enhance()}
}
})();
