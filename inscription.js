// Finder - inscription.js v2 : création de compte guidée par la voix (champs isolés, clavier normal)
(function(){
if(window.__finderInscription)return;window.__finderInscription=1;
const NOM="Fina",AGE_MIN=18;
const G=s=>document.querySelector(s);
const q=s=>{const d=document.getElementById("dreg");return d?d.querySelector(s):null};
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const TTS=window.speechSynthesis,SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const su=G("#su");
if(!su)return;
const css=document.createElement("style");
css.textContent=`
#dreg{position:fixed;inset:0;width:100%!important;max-width:100%!important;height:100dvh!important;max-height:100dvh!important;margin:0!important;border:0;border-radius:0!important;padding:0!important;background:#fff;animation:none!important;overflow:hidden}
#dreg[open]{display:flex;flex-direction:column}
#dreg::backdrop{background:#fff}
.rgh{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top)) 12px 8px;border-bottom:1px solid #E2EBEB;flex:0 0 auto}
.rgx{width:42px;height:42px;flex:0 0 42px;border-radius:50%;border:0;background:#EEF3F3;font-size:1.1rem;cursor:pointer}
.rgp{flex:1;min-width:0}
.rgp small{color:#5B6B73;font-size:.82rem}
.rgbar{height:8px;border-radius:99px;background:#E6EEEE;overflow:hidden;margin-top:4px}
.rgbar i{display:block;height:100%;background:linear-gradient(90deg,#00A39A,#007782);transition:width .3s}
.rgv{border:0;background:#EEF8F7;color:#005961;border-radius:999px;padding:8px 12px;font-weight:700;font-size:.82rem;cursor:pointer;white-space:nowrap}
.rgm{flex:1 1 auto;min-height:0;overflow:auto;padding:14px 16px}
.rgf{display:flex;gap:10px;align-items:flex-start;background:#F0FAF9;border-radius:18px;padding:12px;margin-bottom:14px}
.rgav{flex:0 0 48px;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#00A39A,#007782);display:flex;align-items:center;justify-content:center;font-size:1.5rem;position:relative}
.rgav.talk::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:3px solid rgba(0,163,154,.55);animation:rgp 1.2s ease-out infinite;pointer-events:none}
@keyframes rgp{0%{transform:scale(.9);opacity:1}100%{transform:scale(1.3);opacity:0}}
.rgsay{font-size:1rem;line-height:1.45;color:#12212B}
#dreg h2{font-size:1.3rem;margin:4px 0 8px;color:#12212B}
#dreg label{display:block;font-weight:700;font-size:.95rem;margin:10px 0 6px;color:#12212B}
#dreg input:not([type=checkbox]),#dreg select{width:100%;font-size:1.15rem;padding:14px;border-radius:14px;border:1.5px solid #CFE0E0;background:#F7FBFB;box-sizing:border-box;color:#12212B}
#ins_nom{text-transform:uppercase}
.rg3{display:grid;grid-template-columns:1fr 1.5fr 1.1fr;gap:8px}
.rgtel{display:flex;gap:8px;align-items:center}
.rgtel span{flex:0 0 auto;background:#EEF8F7;border-radius:12px;padding:14px 10px;font-weight:700;white-space:nowrap}
.rgd,.rgskip{margin-top:10px;border:0;background:#EEF8F7;color:#005961;border-radius:999px;padding:10px 16px;font-weight:700;font-size:.95rem;cursor:pointer}
.rgd.on{background:#E5484D;color:#fff}
.rgtype{display:flex;flex-direction:column;gap:10px;margin-top:6px}
.rgtype button{border:2px solid #CFE0E0;background:#fff;border-radius:18px;padding:16px;text-align:left;font-size:1.05rem;font-weight:700;color:#12212B;cursor:pointer}
.rgtype button small{display:block;font-weight:400;color:#5B6B73;margin-top:4px;font-size:.88rem}
.rgtype button.on{border-color:#007782;background:#EEF8F7}
.rgchk{display:flex!important;align-items:flex-start;gap:10px;font-weight:400!important;font-size:.92rem!important;margin:12px 0!important}
.rgchk input{width:22px;height:22px;flex:0 0 22px;margin:0}
.rgsum{background:#F7FBFB;border-radius:16px;padding:6px 14px;margin:6px 0}
.rgsum p{display:flex;justify-content:space-between;gap:12px;margin:0;padding:9px 0;border-bottom:1px solid #E6EEEE;font-size:.95rem}
.rgsum p:last-child{border-bottom:0}
.rgsum b{text-align:right;word-break:break-word}
.rgsum span{color:#5B6B73}
.rgbig{font-size:3rem;text-align:center;margin:8px 0}
.rgl{padding-left:20px;line-height:1.7;font-size:1rem}
.rgn{font-size:.9rem;color:#5B6B73}
.rgerr{color:#B42318;font-size:.95rem;min-height:1.2em;margin:10px 0 0;font-weight:600}
.rgfoot{display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #E2EBEB;flex:0 0 auto;background:#fff}
.rgs2{border:1.5px solid #BFE5E1;background:#fff;color:#005961;border-radius:14px;padding:14px 14px;font-weight:700;font-size:.95rem;cursor:pointer}
.rgpri{flex:1;border:0;border-radius:14px;padding:14px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-weight:800;font-size:1.05rem;cursor:pointer}
.rgpri:disabled{opacity:.6}
#dreg button{touch-action:manipulation}
`;
document.head.appendChild(css);
const NAMEOK=/^\p{L}[\p{L}\s'’.\-]+$/u,PLACEOK=/^\p{L}[\p{L}\s'’.,()\-]+$/u;
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const LIEUX=["Abidjan","Bouaké","Yamoussoukro","Daloa","San-Pédro","Korhogo","Man","Gagnoa","Abengourou","Divo","Soubré","Agboville","Odienné","Séguéla","Ferkessédougou","Bondoukou","Dimbokro","Bouaflé","Sinfra","Katiola","Adzopé","Dabou","Grand-Bassam","Aboisso","Toumodi","Issia","Oumé","Lakota","Tiassalé","Danané"];
const pad=n=>String(n).padStart(2,"0");
const capN=s=>s.toLocaleUpperCase("fr");
const capP=s=>s.toLocaleLowerCase("fr").replace(/(^|[\s'’\-])(\p{L})/gu,(m,a,b)=>a+b.toLocaleUpperCase("fr"));
function digits(v){let d=String(v||"").replace(/\D/g,"");if(d.startsWith("00225"))d=d.slice(5);else if(d.startsWith("225")&&d.length>10)d=d.slice(3);return d.slice(0,10)}
const fmtTel=d=>d.replace(/(\d{2})(?=\d)/g,"$1 ");
const set=(id,v)=>{const e=q("#"+id);if(e&&v!=null&&v!=="")e.value=v};
const val=id=>{const e=q("#"+id);return e?String(e.value||""):""};
let D={},i=0,AM="tel",V=LS.get("finder_reg_voice")!=="off",tk=0;
/* ===== Voix ===== */
function stopS(){tk++;try{TTS&&TTS.cancel()}catch(e){}const a=q("#rgav");if(a)a.classList.remove("talk")}
function speak(t){
stopS();
if(!V||!TTS||!t)return;
const my=tk;
const parts=t.match(/[^.!?]+[.!?]*/g)||[t];
const ch=[];let cur="";
parts.forEach(p=>{if((cur+p).length>170&&cur){ch.push(cur);cur=p}else cur+=p});
if(cur)ch.push(cur);
const vs=TTS.getVoices();
const v=vs.find(x=>/^fr[-_]FR/i.test(x.lang))||vs.find(x=>/^fr/i.test(x.lang));
setTimeout(()=>{
if(my!==tk)return;
const a=q("#rgav");
ch.forEach((c,k)=>{
const u=new SpeechSynthesisUtterance(c.trim());
u.lang="fr-FR";u.rate=.9;u.pitch=1.05;
if(v)u.voice=v;
if(k===ch.length-1)u.onend=()=>{const x=q("#rgav");if(x)x.classList.remove("talk")};
TTS.speak(u);
});
if(a)a.classList.add("talk");
},80);
}
function listen(btn,inp,mode){
if(!inp)return;
if(!SR){fail("La dictée n’est pas disponible sur ce navigateur. Écrivez avec le clavier.");return}
stopS();
const r=new SR();
r.lang="fr-FR";r.interimResults=false;r.maxAlternatives=1;
const old=btn.textContent;
btn.classList.add("on");btn.textContent="🎙️ Je vous écoute…";
r.onresult=e=>{
let t=(e.results[0]&&e.results[0][0]?e.results[0][0].transcript:"").trim().replace(/[.!?]+$/,"");
if(!t)return;
inp.value=mode==="n"?capN(t):mode==="p"?capP(t):t;
};
r.onerror=e=>{
if(e.error==="not-allowed"||e.error==="service-not-allowed")fail("Autorisez le micro : touchez le cadenas à côté de l’adresse du site, puis Autorisations.");
else if(e.error==="network")fail("Pas de connexion Internet. La dictée a besoin d’Internet.");
};
r.onend=()=>{btn.classList.remove("on");btn.textContent=old};
try{r.start()}catch(e){btn.classList.remove("on");btn.textContent=old}
}
function fail(m){const e=q("#rgerr");if(e)e.textContent=m;speak(m)}
/* ===== Étapes ===== */
function dateOk(){
const j=+D.j,m=+D.m,a=+D.a;
if(!j||!m||!a)return"Choisissez le jour, le mois et l’année.";
const d=new Date(a,m-1,j);
if(d.getFullYear()!==a||d.getMonth()!==m-1||d.getDate()!==j)return"Cette date n’existe pas. Vérifiez le jour et le mois.";
const lim=new Date();lim.setFullYear(lim.getFullYear()-AGE_MIN);
if(d>lim)return"Il faut avoir au moins "+AGE_MIN+" ans pour créer un compte Finder.";
D.iso=a+"-"+pad(m)+"-"+pad(j);
return"";
}
function defAff(){
const p=(D.pre||"").split(/\s+/)[0]||"",n=(D.nom||"").charAt(0);
return(p+(n?" "+n.toUpperCase()+".":"")).trim();
}
function villes(){
const s=G("#pv");
const a=s?[...s.options].filter(o=>o.value).map(o=>o.value):[];
return a.length?a:["Abidjan","Yamoussoukro","Bouaké","Daloa","San-Pédro","Korhogo"];
}
const ST=[
{t:"Créons votre compte",
say:()=>"Bonjour, je suis "+NOM+". Je vais vous guider pas à pas pour créer votre compte Finder. Cela prend environ trois minutes. Gardez votre carte d’identité ou votre extrait de naissance près de vous. Vos informations restent privées : les autres utilisateurs ne les verront jamais. Quand vous êtes prêt, touchez le bouton Commencer.",
html:()=>'<p class="rgbig">📝</p><ul class="rgl"><li>Votre nom et vos prénoms</li><li>Votre date et lieu de naissance</li><li>Votre numéro de téléphone</li><li>Votre adresse e-mail, si vous en avez une</li><li>Votre ville, un nom affiché et un mot de passe</li></ul><p class="rgn">🔒 Vos informations personnelles restent privées.</p>',
chk:()=>""},
{t:"Votre nom de famille",
say:()=>"Écrivez votre nom de famille, exactement comme il est écrit sur votre pièce d’identité. Par exemple : Koné. Touchez la case blanche pour écrire, ou touchez le bouton micro et dites votre nom à voix haute.",
html:()=>'<label for="ins_nom">Nom de famille</label><input id="ins_nom" autocomplete="family-name" autocapitalize="words" maxlength="60" placeholder="Ex : Koné"><button type="button" class="rgd" data-d="ins_nom" data-c="n">🎙️ Dire mon nom</button>',
after:()=>set("ins_nom",D.nom),
chk:()=>{const v=val("ins_nom").trim().replace(/\s+/g," ");if(!NAMEOK.test(v))return"Écrivez votre nom de famille, avec au moins 2 lettres.";D.nom=capN(v);return""}},
{t:"Vos prénoms",
say:()=>"Écrivez maintenant tous vos prénoms, comme sur votre pièce d’identité. Par exemple : Aya Marie. Vous pouvez aussi dicter avec le micro.",
html:()=>'<label for="ins_pre">Prénoms</label><input id="ins_pre" autocomplete="given-name" autocapitalize="words" maxlength="80" placeholder="Ex : Aya Marie"><button type="button" class="rgd" data-d="ins_pre" data-c="p">🎙️ Dire mes prénoms</button>',
after:()=>set("ins_pre",D.pre),
chk:()=>{const v=val("ins_pre").trim().replace(/\s+/g," ");if(!NAMEOK.test(v))return"Écrivez vos prénoms, avec au moins 2 lettres.";D.pre=capP(v);return""}},
{t:"Votre date de naissance",
say:()=>"Choisissez votre date de naissance. D’abord le jour, ensuite le mois, puis l’année. Touchez chaque case pour ouvrir la liste. Il faut avoir au moins "+AGE_MIN+" ans.",
html:()=>{
const now=new Date().getFullYear()-AGE_MIN;
let j='<option value="">Jour</option>',m='<option value="">Mois</option>',a='<option value="">Année</option>';
for(let x=1;x<=31;x++)j+='<option value="'+x+'">'+x+'</option>';
MOIS.forEach((n,k)=>m+='<option value="'+(k+1)+'">'+n+'</option>');
for(let y=now;y>=1925;y--)a+='<option value="'+y+'">'+y+'</option>';
return'<div class="rg3"><div><label for="ins_j">Jour</label><select id="ins_j">'+j+'</select></div><div><label for="ins_m">Mois</label><select id="ins_m">'+m+'</select></div><div><label for="ins_a">Année</label><select id="ins_a">'+a+'</select></div></div>';
},
after:()=>{set("ins_j",D.j);set("ins_m",D.m);set("ins_a",D.a)},
chk:()=>{D.j=val("ins_j");D.m=val("ins_m");D.a=val("ins_a");return dateOk()}},
{t:"Votre lieu de naissance",
say:()=>"Dans quelle ville ou quel village êtes-vous né ? Par exemple : Bouaké. Si vous êtes né dans un autre pays, écrivez la ville, puis le pays.",
html:()=>'<label for="ins_lieu">Ville ou village de naissance</label><input id="ins_lieu" list="ins_lieulist" autocapitalize="words" maxlength="80" placeholder="Ex : Bouaké"><datalist id="ins_lieulist">'+LIEUX.map(x=>'<option value="'+E(x)+'">').join("")+'</datalist><button type="button" class="rgd" data-d="ins_lieu" data-c="p">🎙️ Dire le lieu</button>',
after:()=>set("ins_lieu",D.lieu),
chk:()=>{const v=val("ins_lieu").trim().replace(/\s+/g," ");if(!PLACEOK.test(v))return"Écrivez le lieu de naissance, avec au moins 2 lettres.";D.lieu=capP(v);return""}},
{t:"Votre numéro de téléphone",
say:()=>AM==="tel"?"Écrivez votre numéro de téléphone : les dix chiffres, en commençant par zéro. Par exemple : zéro sept, zéro zéro, zéro zéro, zéro un. C’est avec ce numéro que vous vous connecterez à Finder.":"Écrivez votre numéro de téléphone : les dix chiffres, en commençant par zéro. Par exemple : zéro sept, zéro zéro, zéro zéro, zéro un. Il nous permet de vous joindre en cas de besoin.",
html:()=>'<label for="ins_tel">Numéro de téléphone</label><div class="rgtel"><span>🇨🇮 +225</span><input id="ins_tel" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="14" placeholder="07 00 00 00 00"></div>',
after:()=>{const t=q("#ins_tel");set("ins_tel",D.tel?fmtTel(D.tel):"");t.addEventListener("input",()=>{t.value=fmtTel(digits(t.value))})},
chk:()=>{const d=digits(val("ins_tel"));if(!/^0\d{9}$/.test(d))return"Le numéro doit avoir 10 chiffres et commencer par zéro. Par exemple : 07 00 00 00 01.";D.tel=d;return""}},
{t:"Votre adresse e-mail",
say:()=>AM==="email"?"Écrivez votre adresse e-mail. C’est avec elle que vous vous connecterez. Par exemple : aya arobase gmail point com.":"Avez-vous une adresse e-mail ? Si oui, écrivez-la : elle servira à retrouver votre compte. Par exemple : aya arobase gmail point com. Si vous n’en avez pas, touchez le bouton Je n’ai pas d’e-mail.",
html:()=>'<label for="ins_mail">Adresse e-mail'+(AM==="email"?"":" (facultatif)")+'</label><input id="ins_mail" type="email" inputmode="email" autocomplete="email" autocapitalize="none" maxlength="120" placeholder="Ex : aya@gmail.com">'+(AM==="email"?"":'<button type="button" class="rgskip" data-skip="1">Je n’ai pas d’e-mail</button>'),
after:()=>set("ins_mail",D.email),
chk:()=>{const v=val("ins_mail").trim().toLowerCase();if(!v){if(AM==="email")return"Écrivez votre adresse e-mail.";D.email="";return""}if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))return"Cette adresse e-mail n’est pas valide. Elle doit contenir un @ et un point.";D.email=v;return""}},
{t:"Votre ville",
say:()=>"Dans quelle ville habitez-vous aujourd’hui ? Touchez la case, puis choisissez votre ville dans la liste.",
html:()=>'<label for="ins_ville">Ville où vous habitez</label><select id="ins_ville"><option value="">Choisir ma ville</option>'+villes().map(x=>'<option>'+E(x)+'</option>').join("")+'</select>',
after:()=>set("ins_ville",D.ville),
chk:()=>{const v=val("ins_ville");if(!v)return"Choisissez votre ville dans la liste.";D.ville=v;return""}},
{t:"Votre nom affiché",
say:()=>"Choisissez le nom que les autres personnes verront sur Finder. Ce peut être votre prénom, ou le nom de votre boutique. Je vous conseille de ne pas écrire votre nom complet. Par exemple : Aya K.",
html:()=>'<label for="ins_aff">Nom affiché sur Finder</label><input id="ins_aff" autocapitalize="words" maxlength="40" placeholder="Ex : Aya K."><button type="button" class="rgd" data-d="ins_aff" data-c="r">🎙️ Dire le nom</button><p class="rgn">Les autres verront ce nom, jamais votre nom complet.</p>',
after:()=>set("ins_aff",D.aff||defAff()),
chk:()=>{const v=val("ins_aff").trim().replace(/\s+/g," ");if(v.length<2||v.length>40)return"Le nom affiché doit avoir entre 2 et 40 caractères.";D.aff=v;return""}},
{t:"Votre mot de passe",
say:()=>"Choisissez un mot de passe d’au moins 6 caractères. Mélangez des lettres et des chiffres. Écrivez-le une deuxième fois pour être sûr. Notez-le dans un endroit sûr, et ne le donnez à personne.",
html:()=>'<label for="ins_pw1">Mot de passe (6 caractères minimum)</label><input id="ins_pw1" type="password" autocomplete="new-password" minlength="6"><label for="ins_pw2">Écrivez-le encore une fois</label><input id="ins_pw2" type="password" autocomplete="new-password"><label class="rgchk"><input type="checkbox" id="ins_show"> Afficher le mot de passe</label>',
after:()=>{set("ins_pw1",D.pw);set("ins_pw2",D.pw)},
chk:()=>{const a=val("ins_pw1"),b=val("ins_pw2");if(a.length<6)return"Le mot de passe doit avoir au moins 6 caractères.";if(a!==b)return"Les deux mots de passe ne sont pas identiques. Écrivez-les de nouveau.";D.pw=a;return""}},
{t:"Que voulez-vous faire ?",
say:()=>"Que voulez-vous faire en premier sur Finder ? Touchez Acheter si vous cherchez des articles, ou Vendre si vous voulez vendre les vôtres. Vous pourrez changer plus tard.",
html:()=>'<div class="rgtype"><button type="button" data-t="client">🛒 Acheter<small>Je cherche des articles d’occasion</small></button><button type="button" data-t="vendeur">🏪 Vendre<small>Je veux vendre mes articles</small></button></div>',
after:()=>{const d=G("#dreg");if(d)d.querySelectorAll("[data-t]").forEach(b=>b.classList.toggle("on",b.dataset.t===D.mode))},
chk:()=>D.mode?"":"Touchez Acheter ou Vendre pour continuer."},
{t:"Vérifiez vos informations",
say:()=>"Dernière étape. Vérifiez vos informations. Si tout est correct, cochez la case pour accepter les conditions, puis touchez Créer mon compte. Pour corriger, touchez Retour.",
html:()=>{
const row=(a,b)=>'<p><span>'+a+'</span><b>'+E(b)+'</b></p>';
return'<div class="rgsum">'+row("Nom",D.nom)+row("Prénoms",D.pre)+row("Né(e) le",D.j+" "+MOIS[D.m-1]+" "+D.a)+row("Lieu de naissance",D.lieu)+row("Téléphone","+225 "+fmtTel(D.tel))+row("E-mail",D.email||"Aucun")+row("Ville",D.ville)+row("Nom affiché",D.aff)+row("Compte",D.mode==="vendeur"?"Vendre":"Acheter")+'</div><label class="rgchk"><input type="checkbox" id="ins_cgu"><span>J’accepte les <a href="#" data-l="tos">conditions d’utilisation</a> et la <a href="#" data-l="prv">politique de confidentialité</a>.</span></label>';
},
chk:()=>{const c=q("#ins_cgu");return c&&c.checked?"":"Cochez la case pour accepter les conditions."}}
];
const TOTAL=ST.length-1;
/* ===== Navigation ===== */
const PR=["Très bien.","Parfait.","Merci.","C’est noté."];
function go(n,dir){
i=n;
const s=ST[i];
q("#rgt").textContent=s.t;
q("#rgbody").innerHTML=s.html();
if(s.after)s.after();
q("#rgs").textContent=i===0?"Création du compte":"Étape "+i+" sur "+TOTAL;
q("#rgb").style.width=Math.round(i/TOTAL*100)+"%";
q("#rgp2").style.visibility=i===0?"hidden":"visible";
q("#rgr").style.display="";
const n2=q("#rgn");n2.disabled=false;
n2.textContent=i===0?"Commencer":i===TOTAL?"Créer mon compte ✅":"Suivant ➜";
q("#rgerr").textContent="";
const say=s.say();
q("#rgsay").textContent=say;
const pre=i===0?"":dir===1?PR[i%4]+(i===TOTAL?" Dernière étape. ":" Étape "+i+" sur "+TOTAL+". "):"";
speak(i===TOTAL&&dir===1?PR[i%4]+" "+say:pre+say);
q("#rgm").scrollTop=0;
}
async function next(){
if(D.done){closeAll();return}
const e=ST[i].chk?ST[i].chk():"";
if(e){fail(e);return}
if(i===TOTAL){await create();return}
go(i+1,1);
}
function prev(){if(D.done)return;if(i>0)go(i-1,-1)}
/* ===== Création du compte ===== */
function emsg(er){
const t=String(er.message||"").toLowerCase(),c=String(er.code||"");
if(/banned|suspend|appareil|impossible de cr/.test(t))return"Impossible de créer un compte depuis cet appareil. Contactez le support Finder.";
if(/already|exists/.test(t)||c==="phone_exists"||c==="user_already_exists"||c==="email_exists")return AM==="tel"?"Ce numéro a déjà un compte. Fermez cette fenêtre et touchez Se connecter.":"Cette adresse e-mail a déjà un compte. Fermez cette fenêtre et touchez Se connecter.";
if(/disabled|not enabled/.test(t)||c==="phone_provider_disabled")return"La connexion par téléphone n’est pas encore activée sur Finder.";
if(/otp|sms|provider|twilio|send/.test(t))return"L’envoi du code par SMS a échoué : le service SMS n’est pas configuré.";
if(/rate|too many/.test(t)||er.status===429)return"Trop d’essais. Réessayez dans quelques minutes.";
if(/password/.test(t))return"Mot de passe refusé. Utilisez au moins 6 caractères.";
return"Création impossible. Vérifiez vos informations et réessayez.";
}
async function save(p){
const r=await sb.rpc("enregistrer_inscription",p);
if(r.error)throw r.error;
return r.data;
}
async function refresh(){
try{
if(typeof refreshMe==="function")await refreshMe();
if(typeof needProfile!=="undefined")needProfile=false;
if(typeof acct!=="undefined"&&typeof me!=="undefined"&&me&&me.mode)acct=me.mode;
const dp=G("#dp");if(dp&&dp.open)dp.close();
if(typeof loadWallet==="function")await loadWallet();
if(typeof applyUI==="function")applyUI();
if(typeof labels==="function")labels();
if(typeof load==="function")load();
}catch(e){}
}
async function create(){
const b=q("#rgn");
b.disabled=true;
q("#rgerr").textContent="";
const p={p_nom:D.nom,p_prenoms:D.pre,p_naissance:D.iso,p_lieu:D.lieu,p_tel:"+225"+D.tel,p_email:D.email||null,p_commune:D.ville,p_affiche:D.aff,p_mode:D.mode};
if(!D.created){
window.__regBusy=true;
LS.set("finder_reg_pending",JSON.stringify({email:AM==="email"?D.email:"",phone:AM==="tel"?"+225"+D.tel:"",data:p}));
let r;
try{
r=await sb.auth.signUp(AM==="tel"?{phone:"+225"+D.tel,password:D.pw}:{email:D.email,password:D.pw});
}catch(e){
window.__regBusy=false;LS.del("finder_reg_pending");b.disabled=false;
fail("Connexion impossible. Vérifiez votre connexion Internet et réessayez.");return;
}
if(r.error){window.__regBusy=false;LS.del("finder_reg_pending");b.disabled=false;fail(emsg(r.error));return}
D.created=true;
D.session=!!(r.data&&r.data.session);
}
if(!D.session){window.__regBusy=false;done(false);return}
try{
await save(p);
LS.del("finder_reg_pending");
D.saved=true;
await refresh();
window.__regBusy=false;
done(true);
}catch(e){
window.__regBusy=false;b.disabled=false;
const m=String((e&&e.message)||"");
fail(/age_minimum/.test(m)?"Il faut avoir au moins "+AGE_MIN+" ans pour créer un compte Finder.":"Votre compte est créé, mais l’enregistrement de vos informations a échoué. Touchez de nouveau le bouton pour réessayer.");
}
}
function done(ok){
D.done=true;
const prenom=(D.pre||"").split(/\s+/)[0];
q("#rgt").textContent="Bienvenue "+prenom+" !";
q("#rgbody").innerHTML='<p class="rgbig">🎉</p><p class="rgn" style="text-align:center;font-size:1rem">'+(ok?"Votre compte est créé.":"Votre compte est créé. Ouvrez l’e-mail de confirmation que nous venons de vous envoyer, puis connectez-vous.")+'</p>';
const say=ok?"Bravo "+prenom+" ! Votre compte Finder est créé. Bienvenue ! Vous pouvez maintenant découvrir les annonces, ou publier votre premier article. Pour vendre en toute confiance, vous pourrez aussi faire vérifier votre identité plus tard, depuis votre profil.":"Bravo "+prenom+" ! Votre compte est créé. Ouvrez l’e-mail de confirmation que nous venons de vous envoyer, puis connectez-vous.";
q("#rgsay").textContent=say;
q("#rgs").textContent="Terminé";
q("#rgb").style.width="100%";
q("#rgp2").style.visibility="hidden";
q("#rgr").style.display="none";
const n=q("#rgn");n.disabled=false;n.textContent="Découvrir Finder";
q("#rgerr").textContent="";
speak(say);
}
function closeAll(){
stopS();
const d=G("#dreg");
if(d){try{d.close()}catch(e){}d.remove()}
const da=G("#da");
if(da&&da.open&&D.created)da.close();
window.__regBusy=false;
}
function quit(){
if(!D.done&&i>0&&!confirm("Quitter la création du compte ? Vos réponses seront perdues."))return;
closeAll();
}
/* ===== Ouverture ===== */
function open(){
if(G("#dreg"))return;
D={};i=0;
const tabs=!!G("#atabs");
AM=tabs&&LS.get("finder_auth_mode")!=="email"?"tel":"email";
const t=G("#tel");if(t&&t.value)D.tel=digits(t.value);
const em=G("#em");if(em&&em.value.trim())D.email=em.value.trim().toLowerCase();
const pw=G("#pw");if(pw&&pw.value)D.pw=pw.value;
const d=document.createElement("dialog");
d.id="dreg";d.dataset.vx="1";
d.setAttribute("aria-label","Création de compte");
d.innerHTML='<div class="rgh"><button type="button" class="rgx" id="rgx" aria-label="Fermer">✕</button><div class="rgp"><small id="rgs"></small><div class="rgbar"><i id="rgb"></i></div></div><button type="button" class="rgv" id="rgv"></button></div><div class="rgm" id="rgm"><div class="rgf"><div class="rgav" id="rgav">🎧</div><div class="rgsay" id="rgsay"></div></div><h2 id="rgt"></h2><div id="rgbody"></div><p class="rgerr" id="rgerr" role="alert"></p></div><div class="rgfoot"><button type="button" class="rgs2" id="rgp2">← Retour</button><button type="button" class="rgs2" id="rgr" aria-label="Réécouter">🔊</button><button type="button" class="rgpri" id="rgn"></button></div>';
document.body.appendChild(d);
const vb=q("#rgv");
const vlab=()=>{vb.textContent=V?"🔊 Voix activée":"🔇 Sans voix"};
vlab();
if(!TTS)vb.style.display="none";
vb.onclick=()=>{V=!V;LS.set("finder_reg_voice",V?"on":"off");vlab();if(!V)stopS();else speak(ST[i].say())};
q("#rgx").onclick=quit;
q("#rgp2").onclick=prev;
q("#rgn").onclick=next;
q("#rgr").onclick=()=>speak(q("#rgsay").textContent);
d.addEventListener("cancel",e=>{e.preventDefault();quit()});
d.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.tagName==="INPUT"&&e.target.type!=="checkbox"){e.preventDefault();next()}});
d.addEventListener("change",e=>{if(e.target.id==="ins_show"){const tp=e.target.checked?"text":"password";q("#ins_pw1").type=tp;q("#ins_pw2").type=tp}});
d.addEventListener("click",e=>{
const a=e.target.closest("[data-d]");
if(a){listen(a,q("#"+a.dataset.d),a.dataset.c);return}
const t2=e.target.closest("[data-t]");
if(t2){D.mode=t2.dataset.t;d.querySelectorAll("[data-t]").forEach(b=>b.classList.toggle("on",b===t2));q("#rgerr").textContent="";return}
if(e.target.closest("[data-skip]")){D.email="";go(i+1,1);return}
const l=e.target.closest("[data-l]");
if(l){e.preventDefault();const x=G(l.dataset.l==="tos"?".tosl":".prvl");if(x)x.click();return}
});
try{d.showModal()}catch(e){d.setAttribute("open","")}
go(0,1);
}
su.onclick=e=>{e.preventDefault();open()};
/* ===== Sécurités ===== */
const sm=HTMLDialogElement.prototype.showModal;
HTMLDialogElement.prototype.showModal=function(){
if(window.__regBusy&&this.id==="dp")return;
return sm.apply(this,arguments);
};
function pend(){try{return JSON.parse(LS.get("finder_reg_pending")||"null")}catch(e){return null}}
try{
sb.auth.onAuthStateChange((ev,s)=>{
const p=pend();
if(!p||!s||!s.user||window.__regBusy)return;
const u=s.user;
const okE=p.email&&u.email&&u.email.toLowerCase()===p.email.toLowerCase();
const okP=p.phone&&u.phone&&String(u.phone).replace(/\D/g,"")===p.phone.replace(/\D/g,"");
if(!okE&&!okP)return;
setTimeout(async()=>{
try{await save(p.data);LS.del("finder_reg_pending");await refresh()}catch(e){}
},800);
});
}catch(e){}
})();
// FIN DU FICHIER
