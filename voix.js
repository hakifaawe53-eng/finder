// Finder - voix.js v2 : aide vocale (lecture structurée, prix en mots, recherche et dictée vocales, texte agrandi)
(function(){
if(window.__finderVoix)return;window.__finderVoix=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
const TTS=window.speechSynthesis;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let CUR=null;
const css=document.createElement("style");
css.textContent=`
#vxf{position:fixed;left:12px;bottom:calc(86px + env(safe-area-inset-bottom));z-index:50}
#vxb{width:56px;height:56px;border-radius:50%;border:0;background:#007782;color:#fff;font-size:1.7rem;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer}
#vxm{position:absolute;left:0;bottom:66px;background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.28);padding:10px;display:flex;flex-direction:column;gap:8px;min-width:230px}
#vxm[hidden]{display:none}
#vxm button{border:0;background:#EEF8F7;color:#12212B;border-radius:14px;padding:14px;font-size:1.05rem;font-weight:700;text-align:left;cursor:pointer}
.vxw{position:sticky;top:6px;height:0;z-index:5;display:flex;justify-content:flex-end;padding-right:8px}
.vxl{height:40px;border:0;border-radius:999px;background:#007782;color:#fff;padding:0 14px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer}
.vxc{position:absolute;right:8px;bottom:8px;width:38px;height:38px;border-radius:50%;border:0;background:#007782;color:#fff;font-size:1.1rem;box-shadow:0 3px 10px rgba(0,0,0,.25);cursor:pointer;z-index:2}
.vxs{width:44px;height:44px;border-radius:50%;border:0;background:#EEF8F7;margin-left:6px;font-size:1.2rem;cursor:pointer;flex:0 0 44px}
.vxs.on,.vxd.on{background:#E5484D;color:#fff}
.vxd{border:0;background:#EEF8F7;border-radius:999px;padding:4px 12px;margin:4px 0 0;font-size:.85rem;cursor:pointer}
html.vz1{font-size:118%}
html.vz2{font-size:136%}
`;
document.head.appendChild(css);
/* Nombres en toutes lettres */
const U=["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
const T=["","","vingt","trente","quarante","cinquante","soixante"];
function w99(n,fin){
if(n<20)return U[n];
const d=Math.floor(n/10),u=n%10;
if(d===7||d===9){
const r=n-(d===7?60:80);
return(d===7?"soixante":"quatre-vingt")+((d===7&&r===11)?" et ":"-")+U[r];
}
if(d===8)return u?"quatre-vingt-"+U[u]:(fin?"quatre-vingts":"quatre-vingt");
return T[d]+(u===1?" et un":u?"-"+U[u]:"");
}
function w999(n,fin){
const h=Math.floor(n/100),r=n%100;
let s="";
if(h===1)s="cent";
else if(h>1)s=U[h]+" cent"+((r===0&&fin)?"s":"");
if(r)s+=(s?" ":"")+w99(r,fin);
return s;
}
function words(n){
if(n<=0)return"zéro";
const m=Math.floor(n/1e6),k=Math.floor((n%1e6)/1000),r=n%1000,p=[];
if(m)p.push(m===1?"un million":w999(m,false)+" millions");
if(k)p.push(k===1?"mille":w999(k,false)+" mille");
if(r)p.push(w999(r,true));
return p.join(" ");
}
function money(n){
n=Math.round(Number(n)||0);
return words(n)+(n>1?" francs CFA":" franc CFA");
}
/* Nettoyage du texte avant lecture */
function clean(t){
return String(t||"")
.replace(/(\d{1,3}(?:[\s\u202f\u00a0]\d{3})+|\d+)\s*(?:FCFA|F\s?CFA|XOF)/gi,(m,a)=>money(parseInt(a.replace(/\D/g,""),10)))
.replace(/(\d)[\s\u202f\u00a0](?=\d{3}(\D|$))/g,"$1")
.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u2190-\u21FF\u24B6-\u24E9]/gu,"")
.replace(/%/g," pour cent")
.replace(/[·•|]/g,", ")
.replace(/[–—]/g,", ")
.replace(/[«»"]/g,"")
.replace(/\s*\n+\s*/g,". ")
.replace(/([.!?:;,])\s*\.\s/g,"$1 ")
.replace(/\s+/g," ")
.replace(/\.\s*\./g,".")
.trim();
}
function stopUI(){
document.querySelectorAll(".vxb2").forEach(b=>b.textContent="🔊 Écouter");
}
function stop(){
try{TTS&&TTS.cancel()}catch(e){}
stopUI();
}
function speak(text){
if(!TTS){alert("La lecture vocale n’est pas disponible sur ce téléphone.");return}
const t=clean(text);
if(!t)return;
try{TTS.cancel()}catch(e){}
const parts=t.match(/[^.!?]+[.!?]*/g)||[t];
const chunks=[];let cur="";
parts.forEach(p=>{
if((cur+p).length>170&&cur){chunks.push(cur);cur=p}else cur+=p;
});
if(cur)chunks.push(cur);
const voices=TTS.getVoices();
const v=voices.find(x=>/^fr[-_]FR/i.test(x.lang))||voices.find(x=>/^fr/i.test(x.lang));
setTimeout(()=>{
chunks.forEach((c,k)=>{
const u=new SpeechSynthesisUtterance(c.trim());
u.lang="fr-FR";u.rate=.9;
if(v)u.voice=v;
if(k===chunks.length-1)u.onend=stopUI;
TTS.speak(u);
});
},80);
}
function listen(onText,btn){
if(!SR){alert("La reconnaissance vocale n’est pas disponible sur ce navigateur. Essayez avec Chrome.");return}
const r=new SR();
r.lang="fr-FR";r.interimResults=false;r.maxAlternatives=1;
btn.classList.add("on");
const old=btn.textContent;
btn.textContent="🎙️ Je vous écoute…";
r.onresult=e=>{
const t=e.results[0]&&e.results[0][0]?e.results[0][0].transcript:"";
if(t)onText(t);
};
r.onerror=e=>{
if(e.error==="not-allowed"||e.error==="service-not-allowed")alert("Autorisez le micro pour utiliser la voix : appuyez sur le cadenas à côté de l’adresse du site, puis Autorisations.");
else if(e.error==="network")alert("Pas de connexion Internet. La voix a besoin d’Internet.");
};
r.onend=()=>{btn.classList.remove("on");btn.textContent=old};
try{r.start()}catch(e){btn.classList.remove("on");btn.textContent=old}
}
/* Phrases d'une annonce */
const labTaille=i=>i.category==="Chaussures"?"Pointure":i.category==="Bébé et enfants"?"Âge":"Taille";
function itemSentences(i){
const t=[];
t.push((i.title||"Article")+".");
t.push("Prix : "+money(i.price)+".");
if(i.prix_initial&&i.prix_initial>i.price&&!i.vendu)t.push("En promotion, au lieu de "+money(i.prix_initial)+".");
if(i.etat)t.push(/état/i.test(i.etat)?i.etat+".":"État : "+i.etat+".");
if(i.taille)t.push(labTaille(i)+" : "+i.taille+".");
if(i.public_cible)t.push("Pour : "+i.public_cible+".");
if(i.city)t.push("Ville : "+i.city+".");
if(i.vendu)t.push("Cet article est vendu.");
return t;
}
function cardText(c){
const i=typeof items!=="undefined"?items.find(x=>x.id===c.dataset.id):null;
if(i)return itemSentences(i).join(" ");
const h=c.querySelector("h3"),b=c.querySelector("b"),s=c.querySelector("small");
return[h&&h.textContent,b&&"Prix : "+b.textContent,s&&s.textContent].filter(Boolean).join(". ")+".";
}
function detailText(){
const i=CUR,dc=q("#dc");
if(!i||!dc)return null;
const t=[];
t.push("Article : "+i.title+".");
t.push("Prix : "+money(i.price)+".");
if(i.prix_initial&&i.prix_initial>i.price&&!i.vendu){
const pct=i.promo_pct||Math.round((1-i.price/i.prix_initial)*100);
t.push("Article en promotion, moins "+pct+" pour cent, au lieu de "+money(i.prix_initial)+".");
}
const own=typeof user!=="undefined"&&user&&user.id===i.user_id;
let fr=0;
try{fr=protFee(i.price)}catch(e){}
if(fr>0&&!i.vendu&&!own)t.push("Avec la protection acheteur, le total à payer est de "+money(i.price+fr)+".");
if(i.category)t.push("Catégorie : "+i.category+".");
if(i.marque)t.push("Marque : "+i.marque+".");
if(i.etat)t.push(/état/i.test(i.etat)?i.etat+".":"État : "+i.etat+".");
if(i.taille)t.push(labTaille(i)+" : "+i.taille+".");
if(i.public_cible)t.push("Pour : "+i.public_cible+".");
if(i.city)t.push("Ville : "+i.city+".");
if(i.description)t.push("Description : "+i.description+".");
const sn=dc.querySelector(".seller b");
if(sn){
const sh=typeof shops!=="undefined"?shops[i.user_id]:null,p=typeof pro!=="undefined"?pro[i.user_id]:null;
let v="Vendeur : "+sn.textContent.trim();
if(sh&&sh.certifiee)v+=", boutique certifiée";
if(p&&p.identite_verifiee)v+=", identité vérifiée";
const vl=sh?sh.ville:(p&&p.ville);
if(vl)v+=", "+vl;
t.push(v+".");
}
const lv=[...dc.querySelectorAll(".meta")].map(x=>x.textContent.trim()).find(x=>/^Livraison/.test(x));
if(lv)t.push(lv+".");
dc.querySelectorAll(".soldnote").forEach(x=>t.push(x.textContent.trim()+"."));
const bt=[...dc.querySelectorAll(":scope>button:not(.ibtn)")].map(b=>b.textContent.split("·")[0].trim()).filter(Boolean);
if(bt.length)t.push("Boutons disponibles : "+bt.join(", ")+".");
return t.join(" ");
}
function liveText(d){
const w=[...d.querySelectorAll(".vxw")];
w.forEach(x=>x.style.display="none");
const t=d.innerText;
w.forEach(x=>x.style.display="");
return t;
}
function readDialog(d){
if(d.id==="dd"){const s=detailText();if(s)return s}
return liveText(d);
}
const S0=window.show;
if(typeof S0==="function")window.show=function(i){CUR=i;return S0.apply(this,arguments)};
/* Bouton Aide sur l'accueil */
document.body.insertAdjacentHTML("beforeend",'<div id="vxf"><div id="vxm" hidden><button type="button" data-v="page">🔊 Écouter la page</button><button type="button" data-v="rech">🎤 Chercher en parlant</button><button type="button" data-v="taille">🔠 Texte plus grand</button><button type="button" data-v="stop">⏹ Arrêter la lecture</button></div><button type="button" id="vxb" aria-label="Aide vocale">♿</button></div>');
const menu=q("#vxm");
q("#vxb").onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden};
document.addEventListener("click",e=>{if(!e.target.closest("#vxf"))menu.hidden=true});
function zoomGet(){try{return parseInt(localStorage.getItem("finder_zoom")||"0",10)||0}catch(e){return 0}}
function zoomSet(n){
document.documentElement.classList.remove("vz1","vz2");
if(n>0)document.documentElement.classList.add("vz"+n);
try{localStorage.setItem("finder_zoom",String(n))}catch(e){}
}
zoomSet(zoomGet());
function readScreen(){
const ds=[...document.querySelectorAll("dialog[open]")];
const d=ds[ds.length-1];
if(d){speak(readDialog(d));return}
const cards=[...document.querySelectorAll("#grid .card")];
const sect=q("#sect")?q("#sect").textContent.trim():"";
let t="Bienvenue sur Finder. "+(sect?sect+". ":"");
if(!cards.length)t+="Il n’y a pas d’annonce pour le moment. ";
else{
t+=cards.length===1?"Il y a une annonce. ":"Il y a "+cards.length+" annonces. ";
t+=cards.length>5?"Voici les cinq premières. ":"Les voici. ";
}
cards.slice(0,5).forEach((c,k)=>{t+="Annonce numéro "+(k+1)+". "+cardText(c)+" "});
t+="Touchez le haut-parleur sur une annonce pour l’écouter, ou touchez l’annonce pour l’ouvrir.";
speak(t);
}
menu.addEventListener("click",e=>{
const b=e.target.closest("[data-v]");if(!b)return;
const v=b.dataset.v;
menu.hidden=true;
if(v==="page")readScreen();
else if(v==="stop")stop();
else if(v==="taille"){const n=(zoomGet()+1)%3;zoomSet(n);speak(n===0?"Texte normal.":n===1?"Texte grand.":"Texte très grand.")}
else if(v==="rech"){const m=q("#vxmic");if(m)m.click()}
});
/* Recherche vocale */
when("#q",inp=>{
const b=document.createElement("button");
b.type="button";b.id="vxmic";b.className="vxs";b.textContent="🎤";b.setAttribute("aria-label","Chercher en parlant");
inp.insertAdjacentElement("afterend",b);
b.onclick=()=>listen(t=>{
inp.value=t.replace(/[.!?]+$/,"");
inp.dispatchEvent(new Event("input",{bubbles:true}));
const f=inp.closest("form");
if(f){if(f.requestSubmit)f.requestSubmit();else f.dispatchEvent(new Event("submit",{cancelable:true}))}
speak("Je cherche "+inp.value+".");
},b);
});
/* Bouton Écouter dans chaque fenêtre */
function addDlg(d){
if(d.dataset.vx||d.id==="dm")return;
d.dataset.vx="1";
d.insertAdjacentHTML("afterbegin",'<div class="vxw"><button type="button" class="vxl vxb2">🔊 Écouter</button></div>');
d.querySelector(".vxl").onclick=e=>{
e.preventDefault();
const b=e.currentTarget;
if(b.textContent.indexOf("Arrêter")>=0){stop();return}
speak(readDialog(d));
b.textContent="⏹ Arrêter";
};
}
function scanDlg(){document.querySelectorAll("dialog").forEach(addDlg)}
scanDlg();
new MutationObserver(scanDlg).observe(document.body,{childList:true});
document.addEventListener("close",stop,true);
/* Bouton 🔊 sur chaque annonce */
function addCards(g){
g.querySelectorAll(".card").forEach(c=>{
if(c.dataset.vc)return;
c.dataset.vc="1";
c.insertAdjacentHTML("beforeend",'<button type="button" class="vxc" aria-label="Écouter cette annonce">🔊</button>');
});
}
["#grid","#srgrid"].forEach(sel=>when(sel,g=>{addCards(g);new MutationObserver(()=>addCards(g)).observe(g,{childList:true})}));
document.addEventListener("click",e=>{
const b=e.target.closest(".vxc");
if(!b)return;
e.stopPropagation();e.preventDefault();
speak(cardText(b.closest(".card")));
},true);
/* Messages : toucher une bulle pour l'écouter */
const mb=q("#mb");
if(mb)mb.addEventListener("click",e=>{
if(e.target.closest("button,a,audio,video,img,input"))return;
const b=e.target.closest(".b");
if(!b)return;
const t=b.innerText.split("\n").map(x=>x.trim()).filter(x=>x&&!/^\d{1,2}:\d{2}$/.test(x)).join(". ");
if(t)speak((b.classList.contains("me")?"Vous avez écrit : ":"Le correspondant a écrit : ")+t);
});
/* Dictée dans le formulaire Vendre */
function addDictee(f){
f.querySelectorAll('input[type="text"],input:not([type]),textarea').forEach(el=>{
if(el.dataset.vd)return;
el.dataset.vd="1";
const b=document.createElement("button");
b.type="button";b.className="vxd";b.textContent="🎙️ Dicter";
el.insertAdjacentElement("afterend",b);
b.onclick=()=>listen(t=>{
el.value=(el.value?el.value+" ":"")+t;
el.dispatchEvent(new Event("input",{bubbles:true}));
},b);
});
}
when("#sf",f=>addDictee(f));
/* Aide */
try{
const hs=[...document.querySelectorAll("#dhelp h3")].find(h=>h.textContent.trim().startsWith("Sécurité"));
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment utiliser l’aide vocale ?</summary><p>Appuyez sur le bouton ♿ en bas à gauche de l’accueil : vous pouvez écouter la page, chercher en parlant ou agrandir le texte. Sur chaque annonce, le bouton 🔊 la lit à voix haute. Dans les autres fenêtres, appuyez sur « 🔊 Écouter » en haut à droite. Dans une conversation, touchez un message pour l’écouter. Dans « Vendre », le bouton « 🎙️ Dicter » remplit le champ avec votre voix.</p></details>");
}catch(e){}
})();
// FIN DU FICHIER
