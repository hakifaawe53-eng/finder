// Finder - menufix.js : le menu ☰ garde son aspect d'origine
(function(){
if(window.__finderMenuFix)return;window.__finderMenuFix=1;
const css=document.createElement("style");
css.textContent=`
#ov{background:rgba(0,0,0,.4)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
#side{background:#fff!important}
body.menu #side{background:#fff!important}
body.menu #vxf,body.menu #gtask{display:none!important}
#acc:not([open]){display:none!important}
button{-webkit-tap-highlight-color:transparent}
`;
document.head.appendChild(css);
/* Quand le menu s'ouvre, on retire tout reste d'écran d'accueil */
new MutationObserver(()=>{
if(!document.body.classList.contains("menu"))return;
const a=document.getElementById("acc");
if(a&&!a.open)a.remove();
}).observe(document.body,{attributes:true,attributeFilter:["class"]});
})();
// FIN DU FICHIER
