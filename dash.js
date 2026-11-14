// Finder - dash.js : tableau de bord des modérateurs
(function(){
if(window.__finderDash)return;window.__finderDash=1;
const q=s=>document.querySelector(s);
const st=document.createElement("style");
st.textContent=`
#ddash{width:min(100vw,1180px)!important;max-width:100vw!important;height:100dvh;max-height:100dvh!important;margin:0 auto!important;border-radius:0!important;padding:14px!important;overflow:auto;background:#F3F8F8}
@media(min-width:900px){#ddash{height:92vh;max-height:92vh!important;margin:4vh auto!important;border-radius:22px!important}}
.dh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dh h2{margin:0;flex:1}
.dlive{color:#0F8A55;font-weight:700;font-size:.85rem;animation:dlv 1.6s ease-in-out infinite}
@keyframes dlv{0%,100%{opacity:1}50%{opacity:.35}}
.dchips{display:flex;gap:8px;overflow-x:auto;padding:8px 0;scrollbar-width:none}
.dchips::-webkit-scrollbar{display:none}
.dchips button{white-space:nowrap;border:1.5px solid #E2EBEB;background:#fff;color:#12212B;border-radius:999px;padding:8px 14px}
.dchips button.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff;border-color:transparent}
#dcus{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
.kps{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:8px 0}
@media(min-width:640px){.kps{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1000px){.kps{grid-template-columns:repeat(4,1fr)}}
.kp{background:#fff;border:1px solid #E2EBEB;border-radius:16px;padding:12px;box-shadow:0 4px 14px rgba(0,87,95,.06)}
.kp span{color:#6A7B84;font-size:.8rem}
.kp b{display:block;font-size:1.45rem;margin:2px 0}
.kp small{display:block;color:#6A7B84;font-size:.75rem}
.kp small.up,.up{color:#0F8A55}
.kp small.dn,.dn{color:#D92D20}
#ddash h3{margin:18px 0 4px}
.dc2{background:#fff;border:1px solid #E2EBEB;border-radius:18px;padding:14px;margin:10px 0}
.dc2 h4{margin:0 0 8px}
.chart{width:100%;height:auto}
.chart text{font-size:11px;fill:#6A7B84}
.leg{font-size:.8rem;color:#6A7B84}
.br{display:grid;grid-template-columns:minmax(90px,40%) 1fr auto;gap:8px;align-items:center;margin:6px 0;font-size:.88rem}
.br i{background:#E8F6F5;border-radius:99px;height:10px;display:block;overflow:hidden}
.br u{display:block;height:100%;background:linear-gradient(90deg,#00A39A,#007782);border-radius:99px}
.hrs{display:flex;align-items:flex-end;gap:2px;height:110px}
.hrs div{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.hrs u{display:block;width:100%;background:linear-gradient(#00A39A,#007782);border-radius:4px 4px 0 0;min-height:2px}
.hrs i{font-size:.65rem;color:#6A7B84;font-style:normal;height:12px}
.todo{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media(min-width:640px){.todo{grid-template-columns:repeat(5,1fr)}}
.todo button{background:#fff;border:1.5px solid #E2EBEB;border-radius:14px;padding:10px;color:#12212B;text-align:center}
.todo button.warn{border-color:#F5C6C6;background:#FFF4F4}
.todo b{display:block;font-size:1.4rem}
.fx{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid #EEF3F3;font-size:.9rem}
.fx i{font-style:normal;font-size:1.2rem}
.fx span{flex:1}
.fx small{color:#6A7B84;white-space:nowrap}
#bdash:before{content:"📊"}
`;
document.head.appendChild(st);
const n0=v=>Number(v||0).toLocaleString("fr-FR");
const f0=v=>fcfa(Math.round(Number(v||0)));
const pc=v=>Math.round(Number(v||0))+" %";
const flag=c=>(c&&c.length===2&&c!=="??")?String.fromCodePoint(...[...c.toUpperCase()].map(x=>127397+x.charCodeAt(0))):"🏳️";
const cname=c=>{try{return(c&&c!=="??")?new Intl.DisplayNames(["fr"],{type:"region"}).of(c):"Inconnu"}catch(e){return c||"Inconnu"}};
const dur=s=>{s=Math.round(+s||0);return Math.floor(s/60)+" min "+String(s%60).padStart(2,"0")+" s"};
const ago=d=>{const s=Math.max(0,Math.round((Date.now()-new Date(d))/1000));return s<60?"à l’instant":s<3600?"il y a "+Math.floor(s/60)+" min":s<86400?"il y a "+Math.floor(s/3600)+" h":"il y a "+Math.floor(s/86400)+" j"};
function dl(a,b,inv){
a=+a||0;b=+b||0;
if(!b)return a?'<small class="up">▲ nouveau</small>':"<small>—</small>";
const p=Math.round((a-b)/b*100),good=inv?p<=0:p>=0;
return'<small class="'+(good?"up":"dn")+'">'+(p>=0?"▲ +":"▼ ")+p+" % vs période préc.</small>";
}
let ROWS=[],SEC="",TAB="live",P="today",D={},LT=null,RG=[0,0];
const S=t=>{SEC=t;return"<h3>"+t+"</h3>"};
const kpi=(ic,l,v,sub)=>{ROWS.push([SEC,l,String(v).replace(/<[^>]+>/g,"")]);return'<div class="kp"><span>'+ic+" "+l+"</span><b>"+v+"</b>"+(sub||"")+"</div>"};
const card=(t,h)=>'<div class="dc2"><h4>'+t+"</h4>"+h+"</div>";
const NONE='<p class="meta">Pas encore de données.</p>';
const bars=(L,lab,val,fmt)=>{
if(!L||!L.length)return NONE;
const m=Math.max(1,...L.map(x=>+x[val]||0));
return L.map(x=>'<div class="br"><span>'+lab(x)+'</span><i><u style="width:'+Math.round((+x[val]||0)/m*100)+'%"></u></i><b>'+fmt(x[val])+"</b></div>").join("");
};
function fill(Sr,u,a,b,keys){
const step=u==="hour"?36e5:u==="day"?864e5:6048e5;
const trunc=t=>{const d=new Date(t);if(u==="hour")d.setUTCMinutes(0,0,0);else{d.setUTCHours(0,0,0,0);if(u==="week"){const w=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-w)}}return d.getTime()};
const M=new Map((Sr||[]).map(s=>[trunc(s.t),s]));
const out=[];
for(let t=trunc(a);t<b;t+=step){const s=M.get(t)||{};const o={t};keys.forEach(k=>o[k]=+s[k]||0);out.push(o)}
return out;
}
function chart(Sr,keys,colors,u){
if(!Sr||!Sr.length)return NONE;
const W=600,H=170,Pd=26;
const max=Math.max(1,...Sr.flatMap(s=>keys.map(k=>+s[k]||0)));
const x=i=>Pd+(Sr.length>1?i*(W-Pd*2)/(Sr.length-1):(W-Pd*2)/2);
const y=v=>H-Pd-(v/max)*(H-Pd*2);
const lab=t=>{const d=new Date(t);return u==="hour"?d.getUTCHours()+" h":d.toLocaleDateString("fr-FR",{day:"numeric",month:"short",timeZone:"UTC"})};
let g="";
keys.forEach((k,j)=>{
const pts=Sr.map((s,i)=>x(i)+","+y(+s[k]||0)).join(" ");
if(j===0)g+='<polygon fill="'+colors[0]+'" opacity=".12" points="'+x(0)+","+(H-Pd)+" "+pts+" "+x(Sr.length-1)+","+(H-Pd)+'"/>';
g+='<polyline fill="none" stroke="'+colors[j]+'" stroke-width="2.5" stroke-linejoin="round" points="'+pts+'"/>';
});
return'<svg viewBox="0 0 '+W+" "+H+'" class="chart"><line x1="'+Pd+'" y1="'+(H-Pd)+'" x2="'+(W-Pd)+'" y2="'+(H-Pd)+'" stroke="#E2EBEB"/>'+g+'<text x="'+Pd+'" y="'+(H-8)+'">'+lab(Sr[0].t)+'</text><text x="'+(W-Pd)+'" y="'+(H-8)+'" text-anchor="end">'+lab(Sr[Sr.length-1].t)+'</text><text x="'+Pd+'" y="12">max '+n0(max)+"</text></svg>";
}
const hours=Hh=>{
const a=Array(24).fill(0);
(Hh||[]).forEach(x=>{a[x.h]=+x.n});
const m=Math.max(1,...a);
return'<div class="hrs">'+a.map((v,h)=>'<div title="'+h+" h : "+v+'"><u style="height:'+Math.round(v/m*100)+'%"></u><i>'+(h%6===0?h:"")+"</i></div>").join("")+'</div><p class="leg">Heures de Côte d’Ivoire (UTC)</p>';
};
const paysRow=x=>flag(x.pays)+" "+esc(cname(x.pays));
const V={};
V.live=d=>{
const todo=(ic,l,v)=>'<button type="button" data-go="bmod" class="'+(+v>0?"warn":"")+'"><b>'+n0(v)+"</b>"+ic+" "+l+"</button>";
const FX={commande:["🛒",x=>"Commande : "+esc(x.l||"")+" · "+f0(x.v)],remboursement:["↩️",x=>"Remboursement : "+f0(x.v)],annonce:["🏷️",x=>"Annonce : "+esc(x.l||"")+" · "+f0(x.v)],inscription:["👤",x=>"Nouveau compte : "+esc(x.l||"—")],offre:["🤝",x=>"Offre de prix : "+f0(x.v)]};
return S("En direct")+'<div class="kps">'+kpi("🟢","En ligne maintenant",n0(d.en_ligne))+kpi("👤","Comptes connectés",n0(d.connectes))+kpi("👁️","Visiteurs anonymes",n0(Math.max(0,d.en_ligne-d.connectes)))+kpi("🌐","Visites aujourd’hui",n0(d.visites_auj),dl(d.visites_auj,d.visites_hier)+"<small>hier à la même heure</small>")+kpi("🏷️","Annonces en vente",n0(d.annonces))+kpi("📦","Commandes en cours",n0(d.en_cours))+kpi("🛒","Commandes aujourd’hui",n0(d.ventes_auj),"<small>"+f0(d.ca_auj)+"</small>")+kpi("✨","Inscriptions aujourd’hui",n0(d.inscrits_auj))+"</div>"+S("À traiter")+'<div class="todo">'+todo("⚖️","Litiges",d.litiges)+todo("🔎","Annonces à vérifier",d.en_revue)+todo("🪪","Identités à vérifier",d.identites)+todo("🚨","Vols à vérifier",d.vols)+todo("🎧","Demandes au support",d.tickets)+"</div>"+card("🌍 En ligne par pays",bars(d.pays,paysRow,"n",n0))+card("📱 Appareils en ligne",bars(d.appareils,x=>esc(x.appareil),"n",n0))+card("⚡ Activité récente",(d.flux&&d.flux.length)?d.flux.map(x=>{const f=FX[x.t]||["•",()=>esc(x.t)];return'<div class="fx"><i>'+f[0]+"</i><span>"+f[1](x)+"</span><small>"+ago(x.d)+"</small></div>"}).join(""):NONE);
};
V.trafic=d=>{
const c=d.cur,p=d.prev,ser=fill(d.serie,d.unite,RG[0],RG[1],["visites","visiteurs"]),e=d.entonnoir,tv=Math.max(1,e.visiteurs);
const ent=[{l:"Visiteurs",n:e.visiteurs},{l:"Ont vu une annonce",n:e.vu_annonce},{l:"Comptes créés",n:e.comptes},{l:"Ont acheté",n:e.acheteurs}];
return S("Trafic")+'<div class="kps">'+kpi("🌐","Visites",n0(c.visites),dl(c.visites,p.visites))+kpi("👥","Visiteurs uniques",n0(c.visiteurs),dl(c.visiteurs,p.visiteurs))+kpi("✨","Nouveaux visiteurs",n0(c.nouveaux),dl(c.nouveaux,p.nouveaux))+kpi("🔁","Visiteurs récurrents",n0(Math.max(0,c.visiteurs-c.nouveaux)))+kpi("🔐","Comptes connectés",n0(c.connectes),dl(c.connectes,p.connectes))+kpi("📄","Pages vues",n0(c.pages),dl(c.pages,p.pages))+kpi("⏱️","Durée moyenne",dur(c.duree))+kpi("↩️","Taux de rebond",pc(c.rebond))+kpi("🎯","Visiteurs qui achètent",pc(e.acheteurs/tv*100))+"</div>"+card("Visites et visiteurs",chart(ser,["visites","visiteurs"],["#007782","#F59E0B"],d.unite)+'<p class="leg"><span style="color:#007782">●</span> Visites &nbsp; <span style="color:#F59E0B">●</span> Visiteurs uniques</p>')+card("🌍 Pays des visiteurs",bars(d.pays,x=>paysRow(x)+' <small class="leg">('+n0(x.visiteurs)+" visiteurs)</small>","visites",n0))+card("🧭 Entonnoir",bars(ent,x=>x.l+' <small class="leg">('+pc(x.n/tv*100)+")</small>","n",n0))+card("🔗 Sources",bars(d.sources,x=>esc(x.source),"n",n0))+card("📱 Appareils",bars(d.appareils,x=>esc(x.appareil),"n",n0))+card("🕐 Heures de pointe",hours(d.heures));
};
V.ventes=d=>{
const c=d.cur,p=d.prev,o=d.offres||{},f=d.finances||{};
const sc=fill(d.serie,d.unite,RG[0],RG[1],["commandes","ca","remb"]);
const tr=c.commandes?c.remboursees/c.commandes*100:0,ta=o.total?o.acceptees/o.total*100:0;
return S("Ventes")+'<div class="kps">'+kpi("🛒","Commandes",n0(c.commandes),dl(c.commandes,p.commandes))+kpi("✅","Terminées",n0(c.terminees),dl(c.terminees,p.terminees))+kpi("📦","En cours",n0(c.en_cours))+kpi("↩️","Annulées et remboursées",n0(c.remboursees),dl(c.remboursees,p.remboursees,1))+kpi("⚖️","Litiges",n0(c.litiges),dl(c.litiges,p.litiges,1))+kpi("💰","Chiffre d’affaires",f0(c.ca),dl(c.ca,p.ca))+kpi("⏳","CA en cours",f0(c.ca_en_cours))+kpi("🛡️","Frais de protection",f0(c.frais),dl(c.frais,p.frais))+kpi("🧺","Panier moyen",f0(c.panier),dl(c.panier,p.panier))+kpi("💸","Montant remboursé",f0(c.rembourse),dl(c.rembourse,p.rembourse,1))+kpi("📉","Taux de remboursement",pc(tr))+kpi("🚚","Délai moyen de livraison",Math.round(c.delai||0)+" h")+kpi("🧑‍🤝‍🧑","Acheteurs actifs",n0(c.acheteurs))+kpi("🏪","Vendeurs actifs",n0(c.vendeurs))+"</div>"+S("Négociation")+'<div class="kps">'+kpi("🤝","Offres de prix",n0(o.total))+kpi("✅","Offres acceptées",n0(o.acceptees))+kpi("📊","Taux d’acceptation",pc(ta))+kpi("🎁","Économies accordées",f0(o.economie))+"</div>"+S("Finances (mode test)")+'<div class="kps">'+kpi("➕","Recharges",f0(f.recharges))+kpi("➖","Retraits",f0(f.retraits))+kpi("👛","Total des porte-monnaie",f0(f.portefeuilles))+kpi("🔒","Argent bloqué",f0(f.bloque))+"</div>"+card("Commandes",chart(sc,["commandes","remb"],["#007782","#E5484D"],d.unite)+'<p class="leg"><span style="color:#007782">●</span> Commandes &nbsp; <span style="color:#E5484D">●</span> Annulées</p>')+card("Chiffre d’affaires (ventes terminées)",chart(sc,["ca"],["#0F8A55"],d.unite))+card("🗂️ Ventes par catégorie",bars(d.categories,x=>esc(x.cat),"ca",f0));
};
V.comm=d=>{
const c=d.comptes,b=d.boutiques,a=d.annonces,e=d.engagement;
const s1=fill(d.inscriptions,d.unite,RG[0],RG[1],["n"]),s2=fill(d.publications,d.unite,RG[0],RG[1],["n"]);
return S("Comptes et boutiques")+'<div class="kps">'+kpi("👥","Comptes au total",n0(c.total))+kpi("✨","Nouveaux comptes",n0(c.nouveaux),dl(c.nouveaux,c.prev))+kpi("🏷️","Comptes vendeurs",n0(c.vendeurs))+kpi("🪪","Identités vérifiées",n0(c.identites_ok))+kpi("⏳","Identités en attente",n0(c.identites_att))+kpi("🏪","Boutiques",n0(b.total))+kpi("🆕","Nouvelles boutiques",n0(b.nouvelles))+kpi("✅","Boutiques certifiées",n0(b.certifiees))+kpi("🏖️","Boutiques en vacances",n0(b.vacances))+"</div>"+S("Annonces")+'<div class="kps">'+kpi("🟢","Annonces en ligne",n0(a.en_ligne))+kpi("📝","Annonces publiées",n0(a.publiees),dl(a.publiees,a.prev))+kpi("🔎","En vérification",n0(a.en_revue))+kpi("⛔","Bloquées",n0(a.bloquees))+kpi("🔥","En promotion",n0(a.promos))+kpi("💵","Prix moyen",f0(a.prix_moy))+"</div>"+S("Engagement")+'<div class="kps">'+kpi("💬","Messages",n0(e.messages))+kpi("⭐","Avis",n0(e.avis),"<small>note moyenne "+String(e.note).replace(".",",")+" / 5</small>")+kpi("👥","Abonnements",n0(e.abonnements),"<small>"+n0(e.abonnements_total)+" au total</small>")+kpi("🔔","Alertes créées",n0(e.alertes))+kpi("❤️","Favoris (total)",n0(e.favoris))+kpi("🚩","Signalements d’annonces",n0(e.signalements))+kpi("🎧","Demandes au support",n0(e.tickets),"<small>"+n0(e.tickets_ouverts)+" ouvertes</small>")+kpi("🚨","Vols à vérifier",n0(e.vols))+"</div>"+card("Nouveaux comptes",chart(s1,["n"],["#007782"],d.unite))+card("Annonces publiées",chart(s2,["n"],["#F59E0B"],d.unite))+card("📍 Annonces en ligne par ville",bars(d.villes,x=>esc(x.city),"n",n0))+card("🗂️ Annonces en ligne par catégorie",bars(d.cats,x=>esc(x.cat),"n",n0));
};
V.tops=d=>S("Classements")+card("👁️ Articles les plus vus",bars(d.articles,x=>esc(x.titre),"vues",n0))+card("🏪 Boutiques les plus vues",bars(d.boutiques,x=>esc(x.nom),"vues",n0))+card("🔎 Recherches populaires",bars(d.recherches,x=>esc(x.terme),"n",n0))+card("🏆 Meilleurs vendeurs (chiffre d’affaires)",bars(d.vendeurs,x=>esc(x.nom)+' <small class="leg">('+n0(x.ventes)+" ventes)</small>","ca",f0))+card("💎 Articles les plus vendus",bars(d.vendus,x=>esc(x.titre)+' <small class="leg">('+n0(x.ventes)+")</small>","ca",f0));
document.body.insertAdjacentHTML("beforeend",'<dialog id="ddash"><div class="dh"><button type="button" class="bk" data-x aria-label="Fermer">←</button><h2>📊 Tableau de bord</h2><span class="dlive">● En direct</span><button type="button" id="drefresh" aria-label="Actualiser">⟳</button></div><p class="meta" id="dupd"></p><div class="dchips" id="dper"><button type="button" data-p="today" class="on">Aujourd’hui</button><button type="button" data-p="7">7 jours</button><button type="button" data-p="30">30 jours</button><button type="button" data-p="90">90 jours</button><button type="button" data-p="365">12 mois</button><button type="button" data-p="custom">📅 Dates</button></div><div id="dcus" hidden><input type="date" id="dfrom"><input type="date" id="dto"><button type="button" class="pri" id="dgo">Appliquer</button></div><div class="dchips" id="dtabs"><button type="button" data-t="live" class="on">⚡ Direct</button><button type="button" data-t="trafic">🌍 Trafic</button><button type="button" data-t="ventes">💰 Ventes</button><button type="button" data-t="comm">👥 Communauté</button><button type="button" data-t="tops">🏆 Classements</button></div><div id="dbody"></div><button type="button" class="sbtn" id="dcsv">⬇️ Exporter cet écran (CSV)</button></dialog>');
const dd=q("#ddash");
dd.querySelector("[data-x]").onclick=()=>dd.close();
dd.addEventListener("close",()=>clearInterval(LT));
function range(){
const now=Date.now();
if(P==="today"){const a=new Date(now);a.setUTCHours(0,0,0,0);return[a.getTime(),now+1000]}
if(P==="custom"){
const a=q("#dfrom").value,b=q("#dto").value;
if(!a||!b)return null;
const A=Date.parse(a+"T00:00:00Z"),B=Date.parse(b+"T00:00:00Z")+864e5;
return B>A?[A,B]:null;
}
return[now-(+P)*864e5,now+1000];
}
async function go(tab,silent){
TAB=tab;
document.querySelectorAll("#dtabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===tab));
const body=q("#dbody");
let r;
if(tab==="live"){
if(!silent&&!D.live)body.innerHTML="<p class='meta'>Chargement…</p>";
r=await sb.rpc("dash_live");
}else{
const g=range();
if(!g){body.innerHTML='<p class="err">Choisissez deux dates valides.</p>';return}
RG=g;
if(!silent)body.innerHTML="<p class='meta'>Chargement…</p>";
r=await sb.rpc({trafic:"dash_trafic",ventes:"dash_ventes",comm:"dash_communaute",tops:"dash_tops"}[tab],{p_from:new Date(g[0]).toISOString(),p_to:new Date(g[1]).toISOString()});
}
if(tab!==TAB)return;
if(r.error){body.innerHTML='<p class="err">'+(String(r.error.message).includes("acces refuse")?"Réservé aux modérateurs.":"Données indisponibles pour cet écran : "+esc(r.error.message))+"</p>";return}
const y=window.scrollY,sc=dd.scrollTop;
ROWS=[];
try{body.innerHTML=V[tab](r.data)}catch(e){body.innerHTML='<p class="err">Affichage impossible : '+esc(e.message)+"</p>"}
dd.scrollTop=sc;
q("#dupd").textContent="Mis à jour à "+new Date().toLocaleTimeString("fr-FR")+(tab==="live"?" · rafraîchi toutes les 5 secondes":"");
}
function timers(){
clearInterval(LT);
LT=setInterval(()=>{if(dd.open)go(TAB,true)},TAB==="live"?5000:60000);
}
q("#dtabs").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;go(b.dataset.t);timers()};
q("#dper").onclick=e=>{
const b=e.target.closest("[data-p]");
if(!b)return;
P=b.dataset.p;
document.querySelectorAll("#dper button").forEach(x=>x.classList.toggle("on",x===b));
q("#dcus").hidden=P!=="custom";
if(P!=="custom"){go(TAB);timers()}
};
q("#dgo").onclick=()=>{go(TAB);timers()};
q("#drefresh").onclick=()=>go(TAB);
q("#dbody").onclick=e=>{
const g=e.target.closest("[data-go]");
if(g){dd.close();const t=q("#"+g.dataset.go);if(t)setTimeout(()=>t.click(),80)}
};
q("#dcsv").onclick=()=>{
if(!ROWS.length)return;
const csv="\ufeff"+["Section;Libellé;Valeur"].concat(ROWS.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(";"))).join("\n");
const a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
a.download="finder-tableau-de-bord-"+new Date().toISOString().slice(0,10)+".csv";
document.body.appendChild(a);a.click();a.remove();
};
function openDash(){
if(!(me&&me.admin))return;
D={};
if(!dd.open)dd.showModal();
go("live");timers();
}
const bd=document.createElement("button");
bd.id="bdash";bd.textContent="Tableau de bord";bd.hidden=true;
q("#bmod").after(bd);
bd.onclick=openDash;
const A0=window.applyUI;
window.applyUI=function(){const r=A0.apply(this,arguments);bd.hidden=!(me&&me.admin);return r};
bd.hidden=!(me&&me.admin);
})();
