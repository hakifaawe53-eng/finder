// Finder - vendu.js : un article acheté disparait des pages publiques
(function(){
if(window.__finderVendu)return;window.__finderVendu=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
function clean(g){
if(typeof mode==="undefined")return;
if(mode!=="all"&&mode!=="seller")return;
let n=0;
g.querySelectorAll(".card.sold").forEach(c=>{c.remove();n++});
if(n&&!g.querySelectorAll(".card").length){
const m=q("#msg");
if(m&&!m.textContent)m.textContent="Aucune annonce pour l’instant.";
}
}
when("#grid",g=>{
clean(g);
new MutationObserver(()=>clean(g)).observe(g,{childList:true});
});
when("#srf",f=>{
const c=f.querySelector('[name="vendus"]');
if(c){c.checked=false;const l=c.closest("label");if(l)l.hidden=true}
});
})();
// FIN DU FICHIER
