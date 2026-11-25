// Finder - inscfix.js : saisie plus tolérante dans la création de compte
(function(){
if(window.__finderInscFix)return;window.__finderInscFix=1;
const INV=/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD]/g;
const clean=v=>String(v||"").replace(INV,"").normalize("NFC");
const box=()=>document.getElementById("dreg");
const noErr=()=>{const e=document.getElementById("rgerr");if(e)e.textContent=""};
function sweep(){
const d=box();
if(!d)return;
d.querySelectorAll("input:not([type=checkbox]):not([type=password]),textarea").forEach(e=>{
const c=clean(e.value);
if(c!==e.value)e.value=c;
});
}
document.addEventListener("input",e=>{
const d=box();
if(!d||!d.contains(e.target))return;
const t=e.target;
if(t.type!=="checkbox"&&t.type!=="password"&&t.value!==undefined){
const c=clean(t.value);
if(c!==t.value)t.value=c;
}
noErr();
},true);
document.addEventListener("change",e=>{
const d=box();
if(d&&d.contains(e.target))noErr();
},true);
document.addEventListener("click",e=>{
if(box()&&e.target.closest("#rgn"))sweep();
},true);
document.addEventListener("keydown",e=>{
const d=box();
if(d&&e.key==="Enter"&&d.contains(e.target))sweep();
},true);
})();
// FIN DU FICHIER
