// Finder - voixfina.js : voix de Fina plus naturelle + choix de la voix
(function(){
if(window.__finderVoixFina)return;window.__finderVoixFina=1;
const TTS=window.speechSynthesis;
if(!TTS)return;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const GOOD=/neural|natural|online|premium|enhanced|wavenet|studio|network/i;
const BAD=/espeak|compact|robot|novelty/i;
const FEM=/denise|eloise|vivienne|brigitte|julie|hortense|amelie|amélie|audrey|aurelie|aurélie|celine|céline|marie|lea|léa|charlotte|louise|google fran/i;
const MALE=/henri|remy|rémy|claude|paul|thomas|antoine|guillaume|mathieu|jean|daniel|nicolas|male|homme/i;
const frVoices=()=>TTS.getVoices().filter(v=>/^fr/i.test(v.lang));
function score(v){
let s=0;
if(/^fr[-_]FR$/i.test(v.lang))s+=4;else if(/^fr$/i.test(v.lang))s+=2;else s+=1;
if(GOOD.test(v.name))s+=4;
if(!v.localService)s+=1;
if(FEM.test(v.name))s+=2;
if(MALE.test(v.name))s-=3;
if(BAD.test(v.name))s-=6;
return s;
}
const ranked=()=>frVoices().slice().sort((a,b)=>score(b)-score(a));
function chosen(){
const n=LS.get("finder_voice_name");
if(n){const v=frVoices().find(x=>x.name===n);if(v)return v}
return ranked()[0]||null;
}
function rate(){const r=parseFloat(LS.get("finder_voice_rate"));return r>=.6&&r<=1.4?r:.95}
/* Toutes les lectures vocales du site passent par la meilleure voix */
const sp=TTS.speak.bind(TTS);
TTS.speak=function(u){
try{
if(!u._fv){const v=chosen();if(v){u.voice=v;u.lang=v.lang}else u.lang="fr-FR"}
u.rate=rate();u.pitch=1;u.volume=1;
}catch(e){}
return sp(u);
};
/* Fenêtre de choix de la voix */
const css=document.createElement("style");
css.textContent=`
#dvoix{width:min(96vw,520px)}
.vvit{display:flex;gap:6px;align-items:center;margin:8px 0;flex-wrap:wrap}
#dvoix button{border:1.5px solid #BFE5E1;background:#fff;color:#005961;border-radius:999px;padding:8px 12px;font-weight:700;font-size:.85rem;cursor:pointer}
#dvoix button.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff;border-color:#007782}
.vrow{display:flex;align-items:center;gap:8px;padding:10px 6px;border-bottom:1px solid #E6EEEE;border-radius:10px}
.vrow.on{background:#EEF8F7}
.vrow b{flex:1;min-width:0}
.vrow small{display:block;color:#6A7B84;font-size:.72rem;font-weight:400;word-break:break-all}
.vlink{margin-top:8px;border:0;background:none;color:#007782;text-decoration:underline;font-size:.9rem;padding:6px;cursor:pointer}
`;
document.head.appendChild(css);
function sample(v){
try{TTS.cancel()}catch(e){}
const u=new SpeechSynthesisUtterance("Bonjour, je suis Fina, votre assistante Finder. Je vais vous guider pas à pas, avec plaisir.");
u._fv=true;
if(v){u.voice=v;u.lang=v.lang}else u.lang="fr-FR";
setTimeout(()=>TTS.speak(u),60);
}
function render(){
const L=q("#vlist");
if(!L)return;
const cur=chosen(),a=ranked();
if(!a.length){L.innerHTML='<p class="meta">Aucune voix française trouvée sur ce téléphone. Allez dans Réglages, Système, Langues, Synthèse vocale, puis installez les données vocales du français (moteur Google).</p>';return}
L.innerHTML=a.map((v,k)=>{
const on=cur&&v.name===cur.name;
return'<div class="vrow'+(on?" on":"")+'"><b>Voix '+(k+1)+(k===0?" ⭐":"")+'<small>'+E(v.name)+" · "+E(v.lang)+(v.localService?" · sur le téléphone":" · en ligne")+'</small></b><button type="button" data-p="'+k+'">▶ Écouter</button><button type="button" data-c="'+k+'" class="'+(on?"on":"")+'">'+(on?"✔ Choisie":"Choisir")+"</button></div>";
}).join("");
const r=rate();
document.querySelectorAll("#dvoix [data-r]").forEach(b=>b.classList.toggle("on",Math.abs(parseFloat(b.dataset.r)-r)<.04));
}
function openPicker(){
if(!q("#dvoix")){
document.body.insertAdjacentHTML("beforeend",'<dialog id="dvoix" data-vx="1"><h2>Voix de Fina</h2><p class="meta">Touchez ▶ Écouter pour entendre chaque voix, puis « Choisir » celle que vous préférez. La voix ⭐ est celle que je recommande.</p><div class="vvit"><span>Vitesse :</span><button type="button" data-r=".82">🐢 Lente</button><button type="button" data-r=".95">🙂 Normale</button><button type="button" data-r="1.1">🐇 Rapide</button></div><div id="vlist"></div><div class="row"><button type="button" id="vauto">Automatique</button><button type="button" id="vclose">Fermer</button></div></dialog>');
const d=q("#dvoix");
d.addEventListener("click",e=>{
const a=ranked();
const p=e.target.closest("[data-p]");
if(p){sample(a[+p.dataset.p]);return}
const c=e.target.closest("[data-c]");
if(c){const v=a[+c.dataset.c];if(v){LS.set("finder_voice_name",v.name);render();sample(v)}return}
const r=e.target.closest("[data-r]");
if(r){LS.set("finder_voice_rate",r.dataset.r);render();sample(chosen());return}
if(e.target.closest("#vauto")){LS.del("finder_voice_name");LS.del("finder_voice_rate");render();sample(chosen());return}
if(e.target.closest("#vclose")){try{TTS.cancel()}catch(x){}d.close()}
});
d.addEventListener("close",()=>{try{TTS.cancel()}catch(e){}});
}
render();
const d=q("#dvoix");
if(!d.open)d.showModal();
sample(chosen());
}
TTS.addEventListener&&TTS.addEventListener("voiceschanged",()=>{if(q("#dvoix")&&q("#dvoix").open)render()});
document.addEventListener("click",e=>{
if(e.target.closest("[data-vp]")||e.target.closest('[data-v="voix"]')){e.preventDefault();openPicker()}
});
/* Boutons « Changer la voix » */
function inject(){
const rf=q("#dreg .rgf");
if(rf&&!q("#dreg [data-vp]"))rf.insertAdjacentHTML("afterend",'<button type="button" class="vlink" data-vp="1">🎚️ Changer la voix</button>');
const ac=q("#acc .accc");
if(ac&&!q("#acc [data-vp]"))ac.insertAdjacentHTML("beforeend",'<button type="button" class="vlink" data-vp="1">🎚️ Changer la voix</button>');
const m=q("#vxm");
if(m&&!m.querySelector('[data-v="voix"]'))m.insertAdjacentHTML("beforeend",'<button type="button" data-v="voix">🎚️ Choisir la voix de Fina</button>');
}
new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
inject();
})();
// FIN DU FICHIER
