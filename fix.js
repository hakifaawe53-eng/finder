// Finder - fix.js : retrait des photos utilisateurs, partage avec photo
(function(){
if(window.__finderFix)return;window.__finderFix=1;
const st=document.createElement("style");
st.textContent="#dset .setp .seta,#dset .phbtns,#avm{display:none!important}";
document.head.appendChild(st);
function clean(){
document.querySelectorAll("#dpriv li").forEach(li=>{if(li.textContent.includes("Votre photo de profil"))li.remove()});
document.querySelectorAll("#dhelp details").forEach(d=>{const s=d.querySelector("summary");if(s&&s.textContent.includes("photo de profil"))d.remove()});
}
let n=0;
const iv=setInterval(()=>{clean();if(++n>25)clearInterval(iv)},400);
const FILE={};
async function prefetch(i){
if(FILE[i.id]!==undefined||!i.photos||!i.photos[0])return;
FILE[i.id]=null;
try{
const r=await fetch(i.photos[0]);
const b=await r.blob();
const ext=(b.type.split("/")[1]||"jpg").replace("jpeg","jpg");
FILE[i.id]=new File([b],"finder-"+i.id.slice(0,8)+"."+ext,{type:b.type||"image/jpeg"});
}catch(e){FILE[i.id]=null}
}
const S3=window.show;
window.show=function(i){const r=S3.apply(this,arguments);try{prefetch(i)}catch(e){}return r};
document.addEventListener("click",e=>{
const b=e.target.closest(".shwa");
if(!b)return;
const i=items.find(x=>x.id===b.dataset.id);
const f=i&&FILE[i.id];
if(!i||!f||!navigator.canShare||!navigator.share)return;
let ok=false;
try{ok=navigator.canShare({files:[f]})}catch(x){}
if(!ok)return;
e.stopImmediatePropagation();e.preventDefault();
const txt="🛍️ "+i.title+"\n💰 "+fcfa(i.price)+" · 📍 "+i.city+"\nSur Finder, la plateforme d’occasion en Côte d’Ivoire :\n"+location.origin+"/?a="+i.id;
navigator.share({files:[f],text:txt}).catch(()=>{});
},true);
})();
