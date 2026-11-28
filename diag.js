// Finder - diag.js : outil de diagnostic (bouton 🛠 en bas à droite)
(function(){
if(window.__finderDiag)return;window.__finderDiag=1;
const css=document.createElement("style");
css.textContent=`
#diagb{position:fixed;right:10px;bottom:calc(150px + env(safe-area-inset-bottom));z-index:57;width:44px;height:44px;border-radius:50%;border:0;background:#12212B;color:#fff;font-size:1.3rem;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer}
#diagp{position:fixed;inset:0;z-index:3500;background:#fff;overflow:auto;padding:16px}
#diagp pre{white-space:pre-wrap;word-break:break-word;font-size:.85rem;line-height:1.5;margin:10px 0}
#diagp button{border:0;border-radius:12px;padding:12px 16px;background:#007782;color:#fff;font-weight:800;margin-right:8px}
`;
document.head.appendChild(css);
document.body.insertAdjacentHTML("beforeend",'<button type="button" id="diagb" aria-label="Diagnostic">🛠</button>');
const ok=b=>b?"✔":"✘";
async function report(){
const L=[];
L.push("Page : "+location.href);
const u=typeof user!=="undefined"&&user;
L.push("Connecté : "+(u?"oui":"non")+" · mode : "+(typeof acct!=="undefined"?acct:"?"));
const sect=document.getElementById("sect"),qq=document.getElementById("q");
L.push("Titre de la liste : « "+(sect?sect.textContent.trim():"?")+" »");
L.push("Recherche vide : "+ok(!(qq&&qq.value.trim())));
const ld=document.getElementById("landing");
L.push("Bloc d’accueil créé : "+ok(!!ld)+(ld?" · caché : "+(ld.hidden?"oui":"non"):""));
L.push("");
L.push("Scripts démarrés :");
[["tel.js","__finderTel"],["inscription.js","__finderInscription"],["kyc.js","__finderKyc"],["voix.js","__finderVoix"],["voixfina.js","__finderVoixFina"],["accueil.js","__finderAccueil"],["landing.js","__finderLanding"],["reco.js","__finderReco"],["landing2.js","__finderLanding2"],["activation.js","__finderActiv"]].forEach(x=>L.push(ok(window[x[1]])+" "+x[0]));
L.push("");
L.push("Fichiers sur le site :");
for(const f of ["app.js","landing.js","reco.js","landing2.js","activation.js"]){
try{
const r=await fetch("/"+f+"?d="+Date.now(),{cache:"no-store"});
const t=await r.text();
const code=/^\s*(\/\/|\(|\/\*|"use|const|let|var|function|import)/.test(t);
L.push((r.ok&&code?"✔ ":"✘ ")+f+" · statut "+r.status+(r.ok&&!code?" · ce n’est pas du code (page HTML ?)":""));
if(f==="app.js"){
["landing.js","reco.js","landing2.js","activation.js"].forEach(n=>{
const c=t.split(n).length-1;
L.push("   app.js appelle "+n+" : "+(c===1?"✔ 1 fois":c===0?"✘ jamais":"⚠ "+c+" fois"));
});
}
}catch(e){L.push("✘ "+f+" · erreur réseau")}
}
return L.join("\n");
}
document.getElementById("diagb").onclick=async()=>{
let p=document.getElementById("diagp");
if(p)p.remove();
document.body.insertAdjacentHTML("beforeend",'<div id="diagp"><b>Diagnostic Finder</b><pre>Analyse en cours…</pre><button type="button" id="diagx">Fermer</button></div>');
document.getElementById("diagx").onclick=()=>document.getElementById("diagp").remove();
const t=await report();
const pre=document.querySelector("#diagp pre");
if(pre)pre.textContent=t;
};
})();
// FIN DU FICHIER
