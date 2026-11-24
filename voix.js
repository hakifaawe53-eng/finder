// Finder - voix.js : aide vocale (lecture, recherche et dictée vocales, texte agrandi)
(function(){
if(window.__finderVoix)return;window.__finderVoix=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
const TTS=window.speechSynthesis;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
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
function clean(t){
return String(t||"")
.replace(/(\d)[\s\u202f\u00a0](?=\d{3}(\D|$))/g,"$1")
.replace(/FCFA/g,"francs CFA")
.replace(/[♥♡🔊🎤🎙️✓⏹]/g,"")
.replace(/\s+/g," ")
.trim();
}
function stop(){
try{TTS&&TTS.cancel()}catch(e){}
document.querySelectorAll(".vxb2").forEach(b=>b.textContent="🔊");
}
function speak(text){
if(!TTS){alert("La lecture vocale n’est pas disponible sur ce téléphone.");return}
const t=clean(text);
if(!t)return;
stop();
const parts=t.match(/[^.!?]+[.!?]*/g)||[t];
const chunks=[];let cur="";
parts.forEach(p=>{
if((cur+p).length>170&&cur){chunks.push(cur);cur=p}else cur+=p;
});
if(cur)chunks.push(cur);
const voices=TTS.getVoices();
const v=voices.find(x=>/^fr[-_]FR/i.test(x.lang))||voices.find(x=>/^fr/i.test(x.lang));
setTimeout(()=>{
chunks.forEach(c=>{
const u=new SpeechSynthesisUtterance(c.trim());
u.lang="fr-FR";u.rate=.9;
if(v)u.voice=v;
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
if(d){speak(d.innerText);return}
const n=document.querySelectorAll("#grid .card").length;
let t="Bienvenue sur Finder, la plateforme d’occasion. ";
t+=n?"Il y a "+n+" annonces. Voici les premières. ":"Il n’y a pas d’annonce pour le moment. ";
document.querySelectorAll("#grid .card").forEach((c,i)=>{if(i<5)t+=(i+1)+". "+c.innerText+". "});
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
speak("Je cherche "+inp.value);
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
if(b.textContent.indexOf("⏹")>=0){stop();return}
stop();
const c=d.cloneNode(true);
c.querySelectorAll(".vxw,script,style").forEach(x=>x.remove());
speak(c.innerText);
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
const c=b.closest(".card");
const cl=c.cloneNode(true);
cl.querySelectorAll(".vxc,.heart").forEach(x=>x.remove());
speak(cl.innerText);
},true);
/* Messages : toucher une bulle pour l'écouter */
const mb=q("#mb");
if(mb)mb.addEventListener("click",e=>{
if(e.target.closest("button,a,audio,video,img,input"))return;
const b=e.target.closest(".b");
if(!b)return;
const c=b.cloneNode(true);
c.querySelectorAll(".bm,.st,audio,video").forEach(x=>x.remove());
const t=c.innerText.trim();
if(t)speak(t);
});
/* Dictée dans le formulaire Vendre */
function addDictee(f){
f.querySelectorAll('input[type="text"],input:not([type]),textarea').forEach(el=>{
if(el.dataset.vd||el.type==="hidden"||el.type==="file")return;
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
