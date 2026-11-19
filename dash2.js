// Finder - dash2.js : onglets À traiter, Paiements, Sécurité et Activité
(function(){
if(window.__finderDash2)return;window.__finderDash2=1;
const q=s=>document.querySelector(s);
let w=0;
const iv=setInterval(()=>{
if(q("#ddash")&&q("#dtabs")&&q("#dbody")){clearInterval(iv);init()}
else if(++w>80)clearInterval(iv);
},250);
function init(){
const dd=q("#ddash"),tabs=q("#dtabs");
const n0=v=>Number(v||0).toLocaleString("fr-FR");
const f0=v=>fcfa(Math.round(Number(v||0)));
const pc=(a,b)=>b?Math.round(a/b*100)+" %":"0 %";
const flag=c=>(c&&c.length===2&&c!=="??")?String.fromCodePoint(...[...c.toUpperCase()].map(x=>127397+x.charCodeAt(0))):"🏳️";
const cname=c=>{try{return(c&&c!=="??")?new Intl.DisplayNames(["fr"],{type:"region"}).of(c):"Inconnu"}catch(e){return c||"Inconnu"}};
const ago=d=>{const s=Math.max(0,Math.round((Date.now()-new Date(d))/1000));return s<60?"à l’instant":s<3600?"il y a "+Math.floor(s/60)+" min":s<86400?"il y a "+Math.floor(s/3600)+" h":"il y a "+Math.floor(s/86400)+" j"};
let ROWS=[],SEC="",TAB2=null,RG=[0,0],tick=0;
const S=t=>{SEC=t;return"<h3>"+t+"</h3>"};
const kpi=(ic,l,v,sub)=>{ROWS.push([SEC,l,String(v).replace(/<[^>]+>/g,"")]);return'<div class="kp"><span>'+ic+" "+l+"</span><b>"+v+"</b>"+(sub||"")+"</div>"};
const kps=h=>'<div class="kps">'+h+"</div>";
const card=(t,h)=>'<div class="dc2"><h4>'+t+"</h4>"+h+"</div>";
const NONE='<p class="meta">Pas encore de données.</p>';
const bars=(L,lab,val,fmt)=>{
if(!L||!L.length)return NONE;
const m=Math.max(1,...L.map(x=>+x[val]||0));
return L.map(x=>'<div class="br"><span>'+lab(x)+'</span><i><u style="width:'+Math.round((+x[val]||0)/m*100)+'%"></u></i><b>'+fmt(x[val])+"</b></div>").join("");
};
function fill(Sr,u,a,b,keys){
const step=u==="hour"?36e5:u==="day"?864e5:6048e5;
const trunc=t=>{const d=new Date(t);if(u==="hour")d.setUTCMinutes(0,0,0);else{d.setUTCHours(0,0,0,0);if(u==="week"){const w2=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-w2)}}return d.getTime()};
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
const V2={};
V2.todo=d=>{
const todo=(ic,l,v,go)=>'<button type="button" '+(go?'data-go="'+go+'" ':"")+'class="'+(+v>0?"warn":"")+'"><b>'+n0(v)+"</b>"+ic+" "+l+"</button>";
const R=d.retraits||[];
return S("À traiter")+'<div class="todo">'+todo("💸","Retraits à payer",R.length)+todo("⚖️","Litiges",d.litiges,"bmod")+todo("🔎","Annonces à vérifier",d.en_revue,"bmod")+todo("🪪","Identités à vérifier",d.identites,"bmod")+todo("🚨","Vols à vérifier",d.vols,"bmod")+todo("🎧","Support",d.tickets,"bmod")+todo("📍","Alertes rendez-vous",d.alertes_rdv,"bmod")+todo("🛡️","Comptes à examiner",d.comptes,"bmod")+todo("💳","Paiements en attente",d.paiements_att)+"</div>"+S("Retraits à payer")+(R.length?R.map(r=>'<div class="dc2"><b>'+esc(r.nom)+'</b> <span class="meta">'+esc(r.email||"")+" · "+(r.kyc?"🪪 identité vérifiée":"⚠️ identité NON vérifiée")+" · "+n0(r.payes)+" retrait(s) déjà payé(s)</span><br>Demandé : <b>"+f0(r.montant)+"</b> · frais "+f0(r.frais)+" · <b>à envoyer : "+f0(r.montant-r.frais)+"</b><br>📞 <b>"+esc(r.telephone)+"</b> ("+esc(r.operateur)+') <span class="meta">'+ago(r.cree_le)+'</span><br><button type="button" class="sbtn pri" data-pay="'+r.id+'">✅ Marquer payé</button><button type="button" class="sbtn" style="color:#D92D20" data-rej="'+r.id+'">❌ Rejeter</button></div>').join(""):"<p class='meta'>Aucun retrait en attente.</p>");
};
V2.pay=d=>{
const r=d.recharges,wd=d.retraits,t=d.tresorerie,sc=fill(d.serie,d.unite,RG[0],RG[1],["recharges","retraits"]);
return S("Recharges")+kps(kpi("➕","Recharges réussies",n0(r.nb_ok),"<small>"+f0(r.montant_ok)+"</small>")+kpi("⏳","En attente",n0(r.nb_att),"<small>"+f0(r.montant_att)+"</small>")+kpi("✖️","Échouées ou expirées",n0(r.nb_ko))+kpi("🧺","Recharge moyenne",f0(r.moyen)))+S("Retraits")+kps(kpi("💸","Retraits payés",n0(wd.nb_payes),"<small>"+f0(wd.net_paye)+" envoyés</small>")+kpi("🏷️","Frais de retrait perçus",f0(wd.frais))+kpi("⏳","En attente",n0(wd.nb_att),"<small>"+f0(wd.montant_att)+"</small>")+kpi("↩️","Rejetés ou annulés",n0(wd.nb_rejetes))+kpi("⏱️","Délai moyen de paiement",Math.round(wd.delai_h||0)+" h"))+S("Trésorerie (théorique)")+kps(kpi("📥","Fonds reçus (recharges)",f0(t.recu))+kpi("📤","Retraits envoyés",f0(t.paye))+kpi("🏦","Solde théorique chez le fournisseur",f0(t.theorique))+kpi("👛","Porte-monnaie des utilisateurs",f0(t.portefeuilles))+kpi("🔒","Argent sous séquestre",f0(t.sequestre))+kpi("⏳","Retraits en attente",f0(t.retraits_att))+kpi("🧾","Total dû aux utilisateurs",f0(t.du))+kpi("📈","Marge disponible (théorique)",f0(t.marge)))+'<p class="meta">⚠️ Les frais prélevés par le fournisseur de paiement ne sont pas déduits : comparez avec le solde réel de votre compte marchand.</p>'+card("Recharges et retraits",chart(sc,["recharges","retraits"],["#007782","#E5484D"],d.unite)+'<p class="leg"><span style="color:#007782">●</span> Recharges &nbsp; <span style="color:#E5484D">●</span> Retraits payés</p>');
};
V2.sec=d=>{
const nv=d.niveaux,p=d.periode,sc=fill(d.serie,d.unite,RG[0],RG[1],["connexions","vpn"]);
return S("Comptes sous surveillance")+kps(kpi("👁️","Surveillés",n0(nv.surveille))+kpi("🪪","Vérification requise",n0(nv.verification))+kpi("🔒","Suspendus (à examiner)",n0(nv.suspendu))+kpi("🚫","Bannis",n0(nv.banni)))+S("Sur la période")+kps(kpi("🚩","Nouveaux comptes signalés",n0(p.signales))+kpi("🚫","Bannissements",n0(p.bannis))+kpi("✅","Bannissements levés",n0(p.leves))+kpi("🔁","Tentatives de contournement détectées",n0(p.contournements))+kpi("🔌","Connexions contrôlées",n0(p.connexions))+kpi("🕵️","Connexions via VPN",n0(p.vpn),"<small>"+pc(p.vpn,p.connexions)+" des connexions</small>")+kpi("👤","Comptes utilisant un VPN",n0(p.vpn_users)))+card("Connexions et VPN",chart(sc,["connexions","vpn"],["#007782","#F59E0B"],d.unite)+'<p class="leg"><span style="color:#007782">●</span> Connexions &nbsp; <span style="color:#F59E0B">●</span> Via VPN</p>')+card("🌍 Pays de connexion",bars(d.pays,x=>flag(x.pays)+" "+esc(cname(x.pays))+' <small class="leg">('+n0(x.vpn)+" VPN)</small>","n",n0))+card("🚩 Motifs de signalement",bars(d.raisons,x=>esc(x.motif),"n",n0));
};
V2.act=d=>{
const r=d.reservations,rd=d.rdv,m=d.messages,md=d.medias,pr=d.promos,au=d.auto,sv=d.suivi,re=d.reactivite;
return S("Mise de côté")+kps(kpi("🔖","Réservations créées",n0(r.total))+kpi("🟣","Actives maintenant",n0(r.actives))+kpi("🛒","Converties en achat",n0(r.utilisees),"<small>"+pc(r.utilisees,r.total)+"</small>")+kpi("⌛","Expirées",n0(r.expirees))+kpi("↩️","Annulées ou libérées",n0(r.annulees))+kpi("✋","Manuelles",n0(r.manuel))+kpi("🤝","Après une offre",n0(r.offre))+kpi("📅","Après un rendez-vous",n0(r.rdv)))+S("Rendez-vous")+kps(kpi("📅","Proposés",n0(rd.proposes))+kpi("✅","Confirmés",n0(rd.confirmes),"<small>"+pc(rd.confirmes,rd.proposes)+"</small>")+kpi("❌","Refusés ou annulés",n0(rd.annules))+kpi("📍","Arrivées déclarées",n0(rd.arrives))+kpi("🚨","Alertes déclenchées",n0(rd.alertes),"<small>"+n0(rd.alertes_att)+" à traiter</small>"))+S("Messagerie")+kps(kpi("💬","Messages",n0(m.total))+kpi("🗣️","Conversations actives",n0(m.conversations))+kpi("🎤","Messages vocaux",n0(m.vocaux))+kpi("📷","Photos envoyées",n0(m.photos))+kpi("🎥","Vidéos envoyées",n0(m.videos))+kpi("🔎","Demandes de photo ou vidéo",n0(m.demandes))+kpi("⚡","Temps de réponse médian moyen",Math.round(re.mediane||0)+" min","<small>"+n0(re.vendeurs)+" vendeurs mesurés</small>")+kpi("🏅","Vendeurs qui répondent vite",n0(re.rapides)))+S("Médias des annonces")+kps(kpi("🎥","Annonces avec vidéo",n0(md.avec_video),"<small>"+pc(md.avec_video,md.actives)+" des annonces en ligne</small>")+kpi("📷","Photos prises en direct",n0(md.photos_live),"<small>"+pc(md.photos_live,md.actives)+"</small>")+kpi("📝","Nouvelles annonces",n0(md.nouvelles))+kpi("🎬","Nouvelles annonces avec vidéo",n0(md.nouvelles_video),"<small>"+pc(md.nouvelles_video,md.nouvelles)+"</small>"))+S("Promotions")+kps(kpi("🏷️","Annonces en promotion",n0(pr.en_cours))+kpi("📉","Remise moyenne",n0(pr.remise_moy)+" %")+kpi("💸","Valeur remisée",f0(pr.valeur)))+S("Règles automatiques")+kps(kpi("🔔","Rappels de réception envoyés",n0(au.rappels))+kpi("⚖️","Litiges ouverts d’office",n0(au.litiges))+kpi("↩️","Remboursements automatiques",n0(au.rembourses)))+S("Abonnements aux boutiques")+kps(kpi("👥","Nouveaux abonnements",n0(sv.abonnements))+kpi("📈","Abonnements au total",n0(sv.total)))+card("🏆 Boutiques les plus suivies",bars(sv.top,x=>esc(x.nom),"n",n0));
};
tabs.insertAdjacentHTML("beforeend",'<button type="button" data-t2="todo">⚠️ À traiter</button><button type="button" data-t2="pay">💳 Paiements</button><button type="button" data-t2="sec">🛡️ Sécurité</button><button type="button" data-t2="act">🤝 Activité</button>');
const b2=document.createElement("div");
b2.id="dbody2";b2.hidden=true;
q("#dbody").after(b2);
function range(){
const b=q("#dper button.on"),P=b?b.dataset.p:"today",now=Date.now();
if(P==="today"){const a=new Date(now);a.setUTCHours(0,0,0,0);return[a.getTime(),now+1000]}
if(P==="custom"){
const a=q("#dfrom").value,c=q("#dto").value;
if(!a||!c)return null;
const A=Date.parse(a+"T00:00:00Z"),B=Date.parse(c+"T00:00:00Z")+864e5;
return B>A?[A,B]:null;
}
return[now-(+P)*864e5,now+1000];
}
async function go2(silent){
if(!TAB2)return;
const tab=TAB2;
let fn,args={};
if(tab!=="todo"){
const g=range();
if(!g){b2.innerHTML='<p class="err">Choisissez deux dates valides.</p>';return}
RG=g;
args={p_from:new Date(g[0]).toISOString(),p_to:new Date(g[1]).toISOString()};
}
fn={todo:"dash_traiter",pay:"dash_paiements",sec:"dash_securite",act:"dash_activite"}[tab];
if(!silent)b2.innerHTML="<p class='meta'>Chargement…</p>";
const r=await sb.rpc(fn,args);
if(tab!==TAB2)return;
if(r.error){b2.innerHTML='<p class="err">'+(String(r.error.message).includes("acces refuse")?"Réservé aux modérateurs.":"Données indisponibles pour cet écran : "+esc(r.error.message))+"</p>";return}
ROWS=[];
try{b2.innerHTML=V2[tab](r.data)}catch(e){b2.innerHTML='<p class="err">Affichage impossible : '+esc(e.message)+"</p>"}
q("#dupd").textContent="Mis à jour à "+new Date().toLocaleTimeString("fr-FR");
}
function show2(on){
b2.hidden=!on;
q("#dbody").hidden=on;
}
tabs.addEventListener("click",e=>{
const b=e.target.closest("[data-t2]");
if(b){
TAB2=b.dataset.t2;
tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
show2(true);
go2();
return;
}
if(e.target.closest("[data-t]")){TAB2=null;show2(false)}
});
q("#dper").addEventListener("click",()=>{if(TAB2)setTimeout(()=>go2(),30)});
q("#dgo").addEventListener("click",()=>{if(TAB2)setTimeout(()=>go2(),30)});
q("#drefresh").addEventListener("click",()=>{if(TAB2)go2()});
dd.addEventListener("close",()=>{TAB2=null;show2(false)});
setInterval(()=>{
if(!dd.open||!TAB2)return;
tick++;
if(TAB2==="todo"||tick%6===0)go2(true);
},10000);
dd.addEventListener("click",e=>{
if(TAB2&&e.target.closest("#dcsv")){
e.stopImmediatePropagation();e.preventDefault();
if(!ROWS.length)return;
const csv="\ufeff"+["Section;Libellé;Valeur"].concat(ROWS.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(";"))).join("\n");
const a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
a.download="finder-tableau-de-bord-"+new Date().toISOString().slice(0,10)+".csv";
document.body.appendChild(a);a.click();a.remove();
}
},true);
b2.addEventListener("click",async e=>{
const g=e.target.closest("[data-go]");
if(g){dd.close();const t=q("#"+g.dataset.go);if(t)setTimeout(()=>t.click(),80);return}
const p=e.target.closest("[data-pay]"),rj=e.target.closest("[data-rej]");
if(p){
const ref=prompt("Référence de la transaction Mobile Money (facultatif)");
if(ref===null)return;
const{error}=await sb.rpc("traiter_retrait",{p_id:p.dataset.pay,p_action:"paye",p_ref:ref.trim()||null,p_motif:null});
if(error){alert("Action impossible : "+error.message);return}
showToast("Retrait marqué comme payé ✓","msg");
go2(true);
return;
}
if(rj){
const mo=prompt("Motif du rejet (le montant sera remis dans le porte-monnaie du vendeur)");
if(mo===null||mo.trim().length<3)return;
const{error}=await sb.rpc("traiter_retrait",{p_id:rj.dataset.rej,p_action:"rejeter",p_ref:null,p_motif:mo.trim()});
if(error){alert("Action impossible : "+error.message);return}
showToast("Retrait rejeté, montant remis au vendeur ✓","msg");
go2(true);
}
});
}
})();
