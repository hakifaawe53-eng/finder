// Finder - texte.js : tailles de texte des cases à cocher des écrans de connexion
(function(){
if(window.__finderTexte)return;window.__finderTexte=1;
const s=document.createElement("style");
s.textContent=`
#da .chk,#dn .chk,#dfp .chk{font-size:.92rem!important;display:flex!important;align-items:center;gap:10px;margin:8px 0}
#da .chk input,#dn .chk input,#dfp .chk input{width:22px!important;height:22px!important;flex:0 0 22px;margin:0}
`;
document.head.appendChild(s);
})();
// FIN DU FICHIER
