// Finder - accueilfix.js : l'accueil est reconnu aussi quand le titre est « Dernières annonces »
(function(){
if(window.__finderAccueilFix)return;window.__finderAccueilFix=1;
const sect=document.getElementById("sect");
if(!sect)return;
const own=()=>[...sect.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join("").trim();
function fix(){
const flag=sect.querySelector(".homeflag");
const isHome=/^(Dernières annonces|Toutes les annonces)$/i.test(own());
if(isHome&&!flag){
const s=document.createElement("span");
s.className="homeflag";s.hidden=true;s.textContent=" Toutes les annonces";
sect.appendChild(s);
}else if(!isHome&&flag)flag.remove();
}
new MutationObserver(fix).observe(sect,{childList:true,characterData:true,subtree:true});
fix();
try{
const TTS=window.speechSynthesis;
if(TTS){
const sp=TTS.speak.bind(TTS);
TTS.speak=function(u){
try{u.text=u.text.replace(/(Dernières annonces|Toutes les annonces)\s+Toutes les annonces/gi,"$1")}catch(e){}
return sp(u);
};
}
}catch(e){}
})();
// FIN DU FICHIER
