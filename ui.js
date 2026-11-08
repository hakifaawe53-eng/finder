// Finder - ui.js : nouveaux écrans et interface moderne
(function(){
if(window.__finderUI)return;window.__finderUI=1;
const q=s=>document.querySelector(s);
const IC={home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',grid:'<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',chat:'<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'};
const CI={"Vêtements":["👕","#F3E8FF"],"Électroménager":["🔌","#E0F2FE"],"Téléphones":["📱","#E0E7FF"],"Chaussures":["👟","#FEF3C7"],"Informatique":["💻","#DBEAFE"],"Meubles":["🛋️","#FCE7F3"],"Véhicules et motos":["🚗","#DCFCE7"],"Bébé et enfants":["🧸","#FFEDD5"],"Autres":["✨","#F1F5F9"]};
const NTI={vente:"💰",achat:"🛍️",paiement:"✅",reception:"📦",remboursement:"↩️",annulation:"✖️",litige:"⚠️",livraison:"🚚",annonce:"📝",identite:"🪪",boutique:"🏪",portefeuille:"👛",support:"💬",alerte:"🔔"};
const CMD=new Set(["vente","achat","paiement","reception","remboursement","annulation","litige","livraison"]);
const mk=(tag,id,html,cls)=>{const e=document.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;e.innerHTML=html;return e};
const wire=d=>d.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>d.close());
const tiles=all=>(all?'<button class="ctile" data-c=""><span style="background:#E8F6F5">✨</span>Tout voir</button>':"")+CATS.map(c=>{const i=CI[c]||["🏷️","#F1F5F9"];return `<button class="ctile" data-c="${esc(c)}"><span style="background:${i[1]}">${i[0]}</span>${esc(c)}</button>`}).join("");
const lg=q(".logo");
if(lg)lg.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 11h18l-1.4 14a2 2 0 0 1-2 1.8H10.4a2 2 0 0 1-2-1.8z" fill="#00A39A"/><path d="M11.5 11V9.5a4.5 4.5 0 0 1 9 0V11" fill="none" stroke="#007782" stroke-width="2.4" stroke-linecap="round"/><circle cx="15.5" cy="18" r="3.6" fill="none" stroke="#fff" stroke-width="2"/><path d="M18.2 20.8l2.6 2.6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>Finder</span>';
const hero=mk("section","hero",'<div><h2>Les meilleures affaires près de chez vous !</h2><p>Achetez et vendez d’occasion en toute sécurité.</p><button type="button" id="hgo">Découvrir →</button></div><div class="hdeco" aria-hidden="true">🛍️</div>');
const cs=mk("section","hcats",'<div class="chead"><h3>Catégories</h3></div><div class="cgrid">'+tiles(false)+'</div>');
q("#f").after(hero);hero.after(cs);
function goCat(c){cat=c;mode="all";labels();load();q("#sect").scrollIntoView({behavior:"smooth",block:"start"})}
q("#hgo").onclick=()=>q("#sect").scrollIntoView({behavior:"smooth",block:"start"});
cs.onclick=e=>{const b=e.target.closest(".ctile");if(b)goCat(b.dataset.c)};
const dcat=mk("dialog","dcat",'<div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Catégories</h2></div><div class="cgrid">'+tiles(true)+'</div>');
document.body.appendChild(dcat);wire(dcat);
dcat.onclick=e=>{const b=e.target.closest(".ctile");if(b){dcat.close();goCat(b.dataset.c)}};
const nav=mk("nav","bnav",'<button data-n="home"><span class="ic">'+IC.home+'</span>Accueil</button><button data-n="cats"><span class="ic">'+IC.grid+'</span>Catégories</button><button data-n="sell" class="plus" aria-label="Vendre">+</button><button data-n="msg"><span class="ic">'+IC.chat+'</span>Messages<b id="nbm" hidden></b></button><button data-n="me"><span class="ic">'+IC.user+'</span>Profil</button>');
document.body.appendChild(nav);
nav.onclick=e=>{
const b=e.target.closest("button");if(!b)return;
const n=b.dataset.n;
if(n==="home"){cat="";mode="all";q("#q").value="";q("#fv").value="";q("#fe").value="";labels();load();window.scrollTo({top:0,behavior:"smooth"})}
else if(n==="cats")dcat.showModal();
else if(n==="sell")q("#sell").click();
else if(n==="msg"){if(!user){q("#da").showModal();return}q("#msgs").click()}
else if(n==="me"){if(!user){q("#da").showModal();return}openHub()}
};
new MutationObserver(()=>{const m=/\((\d+)\)/.exec(q("#msgs").textContent||""),nb=q("#nbm");nb.hidden=!m;if(m)nb.textContent=m[1]}).observe(q("#msgs"),{childList:true,characterData:true,subtree:true});
const isHome=()=>mode==="all"&&!cat&&!q("#q").value.trim()&&!q("#fv").value&&!q("#fe").value;
function sync(){
const h=isHome();
hero.hidden=!h;cs.hidden=!h;
if(h)q("#sect").textContent="Dernières annonces";
nav.querySelector('[data-n="home"]').classList.toggle("on",h);
}
const L0=window.labels;window.labels=function(){const r=L0.apply(this,arguments);sync();return r};
const D0=window.load;window.load=async function(){sync();const r=await D0.apply(this,arguments);sync();return r};
const bal=mk("button","bal","Mes alertes");
q("#fav").after(bal);
const A0=window.applyUI;
function syncBal(){bal.hidden=!(user&&acct==="client")}
window.applyUI=function(){const r=A0.apply(this,arguments);syncBal();return r};
new MutationObserver(()=>{const dc=q("#dc");if(!dc||dc.querySelector(".galw"))return;const imgs=[...dc.children].filter(n=>n.tagName==="IMG");if(!imgs.length)return;const w=document.createElement("div");w.className="galw";const g=document.createElement("div");g.className="gal";w.appendChild(g);dc.insertBefore(w,imgs[0]);imgs.forEach(i=>g.appendChild(i));if(imgs.length>1){const c=document.createElement("span");c.className="gcount";c.textContent="1/"+imgs.length;w.appendChild(c);g.addEventListener("scroll",()=>{c.textContent=(Math.round(g.scrollLeft/g.clientWidth)+1)+"/"+imgs.length})}}).observe(q("#dc"),{childList:true});
const dhub=mk("dialog","dhub",'<div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Mon espace</h2></div><div class="hub" id="hubc"></div>');
document.body.appendChild(dhub);wire(dhub);
dhub.onclick=e=>{const b=e.target.closest("[data-id]");if(!b)return;const t=q("#"+b.dataset.id);dhub.close();if(t)setTimeout(()=>t.click(),60)};
async function openHub(){
const seller=acct==="vendeur",nm=(me&&me.nom)||"Mon compte",idOk=myId&&myId.statut==="verifie";
const txt=id=>{const e=q("#"+id);return e?esc(e.textContent.trim()):""};
const row=(ic,label,id)=>`<button class="hrow" data-id="${id}"><i>${ic}</i><span>${label}</span><em>›</em></button>`;
const banner=seller?(idOk?'<div class="hbanner"><b>✓</b><div><b style="all:unset;font-weight:700">Vendeur vérifié</b><br><small>Votre identité est vérifiée. Votre boutique inspire confiance !</small></div></div>':'<button class="hbanner" data-id="bid"><b>🪪</b><div><span style="font-weight:700">Faites vérifier votre identité</span><br><small>Badge bleu et limite plus élevée.</small></div><em>›</em></button>'):'<button class="hbanner" data-id="sw"><b>🏷️</b><div><span style="font-weight:700">Envie de vendre ?</span><br><small>Passez en compte vendeur en un geste.</small></div><em>›</em></button>';
const stats=seller?'<div class="hstats"><div><b id="hs1">–</b><small>Annonces</small></div><div><b id="hs2">–</b><small>Ventes</small></div><div><b id="hs3">–</b><small>Note</small></div></div>':"";
const rows=row("🔔","Notifications"+(nUnread?" ("+nUnread+")":""),"bnt")+row(seller?"📦":"🛍️",txt("ord"),"ord")+(seller?row("🏷️","Mes annonces","mine")+row("🏪",txt("bq"),"bq")+row("🏅","Ma carrière","bcar"):row("♥","Mes favoris","fav")+row("🔎","Mes alertes","bal"))+row("💬","Messages","msgs")+row("👛",txt("wal"),"wal")+(me&&me.admin?row("🛡️","Modération","bmod"):"")+row("⚙️","Paramètres du profil","pro")+row("🔁",txt("sw"),"sw")+row("❓","Centre d’aide","bhelp")+row("🎧","Contacter le support","bsup")+row("🚪","Se déconnecter","auth");
q("#hubc").innerHTML='<div class="av">'+esc(nm.trim().slice(0,1).toUpperCase()||"F")+'</div><div class="nm">'+esc(nm)+'</div><div class="sub">'+(seller?"Compte vendeur":"Compte client")+'</div>'+banner+stats+rows;
dhub.showModal();
if(seller){
const[a,o,v]=await Promise.all([sb.from("listings").select("id",{count:"exact",head:true}).eq("user_id",user.id),sb.from("commandes").select("id",{count:"exact",head:true}).eq("seller_id",user.id).neq("statut","annule"),sb.from("avis").select("note").eq("seller_id",user.id)]);
const av=v.data||[];
if(q("#hs1")){q("#hs1").textContent=a.count||0;q("#hs2").textContent=o.count||0;q("#hs3").textContent=av.length?(av.reduce((s,x)=>s+x.note,0)/av.length).toFixed(1).replace(".",",")+" ★":"–"}
}
}
let ntData=[],ntTab="all";
const dnt=q("#dnt");
dnt.insertBefore(mk("div","nttabs",'<button type="button" data-t="all" class="on">Toutes</button><button type="button" data-t="cmd">Commandes</button><button type="button" data-t="alerte">Alertes</button>',"tabs"),q("#ntl"));
function drawN(){
const L=ntData.filter(n=>ntTab==="all"||(ntTab==="alerte"?n.type==="alerte":CMD.has(n.type)));
q("#ntl").innerHTML=L.length?L.map(n=>`<div class="nt${n.lu?"":" new"}"><div class="nti">${NTI[n.type]||"🔔"}</div><div class="ntb"><b>${esc(n.titre)}</b>${esc(n.message)}<br><span class="meta">${new Date(n.created_at).toLocaleString("fr-FR")}${n.role?" · Compte "+(n.role==="vendeur"?"vendeur":"client"):""}</span></div></div>`).join(""):"<p class='meta'>Aucune notification pour l’instant.</p>";
}
q("#nttabs").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;ntTab=b.dataset.t;q("#nttabs").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));drawN()};
async function openNotifs2(){
if(!user)return;
askNotif();
q("#ntl").innerHTML="<p class='meta'>Chargement…</p>";
if(!dnt.open)dnt.showModal();
const{data}=await sb.from("notifications").select("*").order("created_at",{ascending:false}).limit(80);
ntData=data||[];drawN();
const ids=ntData.filter(n=>!n.lu).map(n=>n.id);
if(ids.length){await sb.from("notifications").update({lu:true}).in("id",ids);ntData.forEach(n=>seenN.add(n.id));await refreshNotifs()}
}
window.openNotifs=openNotifs2;
q("#bell").onclick=openNotifs2;q("#bnt").onclick=openNotifs2;
const dal=mk("dialog","dal",'<div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Mes alertes</h2><button type="button" class="pri" id="alnew" style="margin-left:auto">+ Nouvelle alerte</button></div><form id="alf" hidden><label>Mot-clé</label><input name="mot" maxlength="60" placeholder="Ex : iPhone 13, Samsung A14, robe…"><label>Catégorie</label><select name="cat"></select><label>Ville</label><select name="ville"></select><div class="row"><div style="flex:1"><label>Prix min (FCFA)</label><input name="pmin" type="number" min="0" inputmode="numeric"></div><div style="flex:1"><label>Prix max (FCFA)</label><input name="pmax" type="number" min="0" inputmode="numeric"></div></div><p class="err" id="alm" role="alert"></p><div class="row"><button class="pri">Créer l’alerte</button><button type="button" id="alc">Annuler</button></div></form><div id="all"></div><div class="alnote">🔔 Vous serez notifié dès qu’un nouveau produit correspond à vos critères.</div>');
document.body.appendChild(dal);wire(dal);
const alf=q("#alf");
alf.cat.innerHTML='<option value="">Toutes catégories</option>'+CATS.map(c=>`<option>${esc(c)}</option>`).join("");
alf.ville.innerHTML='<option value="">Toutes villes</option>'+CITIES.map(c=>`<option>${esc(c)}</option>`).join("");
async function renderAlerts(){
const box=q("#all");box.innerHTML="<p class='meta'>Chargement…</p>";
const{data}=await sb.from("alertes").select("*").order("cree_le",{ascending:false});
const L=data||[];
box.innerHTML=L.length?L.map(a=>{
const sub=[a.categorie,a.ville,(a.prix_min!=null||a.prix_max!=null)?"Prix : "+(a.prix_min!=null?fcfa(a.prix_min):"0")+" – "+(a.prix_max!=null?fcfa(a.prix_max):"∞"):""].filter(Boolean).join(" · ");
return `<div class="al"><div class="ali">🔎</div><div class="alb"><b>${esc(a.mot_cle||a.categorie||"Alerte")}</b><small>${esc(sub||"Toutes les annonces")}</small><small>Active depuis le ${new Date(a.cree_le).toLocaleDateString("fr-FR")}</small></div><label class="sw"><input type="checkbox" data-t="${a.id}" ${a.actif?"checked":""}><span></span></label><button type="button" class="alx" data-d="${a.id}" aria-label="Supprimer">🗑️</button></div>`}).join(""):"<p class='meta'>Aucune alerte pour l’instant. Créez-en une pour être prévenu dès qu’un produit correspond à vos critères.</p>";
}
q("#all").onchange=async e=>{const t=e.target.closest("[data-t]");if(t)await sb.from("alertes").update({actif:t.checked}).eq("id",t.dataset.t)};
q("#all").onclick=async e=>{const d=e.target.closest("[data-d]");if(!d||!confirm("Supprimer cette alerte ?"))return;await sb.from("alertes").delete().eq("id",d.dataset.d);renderAlerts()};
q("#alnew").onclick=()=>{alf.hidden=!alf.hidden};
q("#alc").onclick=()=>{alf.hidden=true;alf.reset();q("#alm").textContent=""};
alf.onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#alm");m.textContent="";
const n=k=>f[k].value===""?null:parseInt(f[k].value,10);
const{error}=await sb.rpc("creer_alerte",{p_mot:f.mot.value.trim()||null,p_cat:f.cat.value||null,p_ville:f.ville.value||null,p_min:n("pmin"),p_max:n("pmax")});
if(error){const t=error.message||"";m.textContent=t.includes("alerte vide")?"Choisissez au moins un mot-clé ou une catégorie.":t.includes("trop d alertes")?"Vous pouvez créer 10 alertes au maximum.":t.includes("prix invalide")?"Le prix minimum doit être inférieur au prix maximum.":"Création impossible. Réessayez.";return}
f.reset();f.hidden=true;renderAlerts();
};
function openAlerts(){
if(!user){q("#da").showModal();return}
alf.hidden=true;dal.showModal();renderAlerts();
}
bal.onclick=openAlerts;
syncBal();sync();
})();
