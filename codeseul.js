// Finder - codeseul.js : la réception se valide uniquement avec le code de remise
(function(){
if(window.__finderCodeSeul)return;window.__finderCodeSeul=1;
const st=document.createElement("style");
st.textContent="#ol [data-ok]{display:none!important}";
document.head.appendChild(st);
const O=window.ordMsg;
window.ordMsg=function(o,c){
if(o.statut==="paye"){
const net=o.montant-o.commission;
return c?"Votre argent est gardé en sécurité. À la remise de l’article, donnez le code de remise ci-dessous au vendeur : il sera payé dès qu’il l’aura validé.":"<b>Vendu.</b> Demandez le code de remise à l’acheteur au moment de la remise de l’article : dès que vous le validez, vous recevez "+fcfa(net)+" dans votre porte-monnaie Finder.";
}
return O.apply(this,arguments);
};
const A0=window.alert;
window.alert=function(m){
if(typeof m==="string"&&m.includes("confirmez la réception"))m="Achat effectué. Vos coordonnées de livraison ont été transmises au vendeur. Votre code de remise est dans « Mes achats » : donnez-le au vendeur seulement quand vous avez l’article en main.";
return A0.call(this,m);
};
const S0=window.show;
window.show=function(i){
const r=S0.apply(this,arguments);
try{
const p=document.querySelector("#dc .safe");
if(p)p.textContent="La protection acheteur garde votre argent jusqu’à la réception de l’article. Vous donnez votre code de remise au vendeur seulement quand vous l’avez en main, et vous pouvez signaler un problème avant.";
}catch(e){}
return r;
};
let n=0;
const iv=setInterval(()=>{
const x=document.getElementById("gtx");
if(x){
clearInterval(iv);
new MutationObserver(()=>{
const t=x.textContent;
if(t.includes("confirmez la réception ou signalez un problème")||t.includes("avant de confirmer"))x.textContent=t.replace("confirmez la réception ou signalez un problème","donnez votre code de remise à la réception ou signalez un problème").replace("avant de confirmer","avant de donner votre code");
}).observe(x,{childList:true,characterData:true,subtree:true});
}else if(++n>50)clearInterval(iv);
},200);
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment valider la réception de mon article ?</summary><p>La réception se valide uniquement avec votre code de remise. Il est affiché dans « Mes achats ». Donnez-le au vendeur quand vous avez l’article en main : il le saisit et il est payé. Si l’article ne vous convient pas, appuyez sur « Signaler un problème » avant de donner votre code.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>La réception d’un article est validée uniquement par le code de remise, que l’acheteur communique au vendeur à la remise de l’article. L’acheteur peut signaler un problème tant qu’il n’a pas communiqué son code.</li>");
}catch(e){}
})();
