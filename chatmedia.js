// Finder - chatmedia.js : photos et vidéos dans la messagerie
(function(){
if(window.__finderChatMedia)return;window.__finderChatMedia=1;
const q=s=>document.querySelector(s);
let w=0;
const iv=setInterval(()=>{
if(window.finderCapture){clearInterval(iv);init()}
else if(++w>60)clearInterval(iv);
},250);
function init(){
const cap=window.finderCapture;
const st=document.createElement("style");
st.textContent=".cimg{display:block;max-width:100%;max-height:220px;border-radius:12px;margin-top:6px;cursor:zoom-in}.cvid2{display:block;max-width:100%;max-height:260px;border-radius:12px;margin-top:6px;background:#000}.creq{margin-top:6px}.ctools{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.ctools button{font-size:.8rem;padding:6px 10px}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dreq"><h2>Demander au vendeur</h2><p class="meta">Choisissez ce que vous voulez voir avant d’acheter.</p><button type="button" class="sbtn" data-rq="photo|une photo du dos ou de l’arrière de l’article">📷 Le dos ou l’arrière</button><button type="button" class="sbtn" data-rq="photo|une photo de l’article allumé ou en fonctionnement">📷 Allumé ou en marche</button><button type="button" class="sbtn" data-rq="photo|une photo de près des défauts ou des rayures">📷 Les défauts de près</button><button type="button" class="sbtn" data-rq="photo|une photo de l’étiquette, de la taille ou des accessoires">📷 L’étiquette ou les accessoires</button><button type="button" class="sbtn" data-rq="video|une courte vidéo de l’article en fonctionnement">🎥 Une vidéo de l’article</button><button type="button" class="sbtn" data-rq="photo|autre">✍️ Autre demande de photo…</button><div class="row"><button type="button" data-x>Fermer</button></div></dialog><dialog id="dimg"><div class="whd"><button type="button" class="bk" data-x aria-label="Fermer">←</button><h2>Photo</h2></div><img id="dimgc" alt="" style="width:100%;border-radius:12px"></dialog><input type="file" id="cgal" accept="image/*" hidden>');
["#dreq","#dimg"].forEach(s=>{const d=q(s);d.querySelector("[data-x]").onclick=()=>d.close()});
q("#mf").insertAdjacentHTML("beforebegin",'<div class="ctools"><button type="button" class="sbtn" data-ct="req">🔎 Demander une photo ou une vidéo</button><button type="button" class="sbtn" data-ct="photo">📷 Photo</button><button type="button" class="sbtn" data-ct="gal">🖼️</button><button type="button" class="sbtn" data-ct="video">🎥 Vidéo</button></div>');
const SBU=SB_URL+"/storage/v1/object/public/";
async function sendMsg(body){
const{error}=await sb.from("messages").insert({listing_id:chat.lid,receiver_id:chat.other,body});
if(error){alert("Envoi impossible. Réessayez.");return false}
lastN="";
await loadChat();
return true;
}
async function sendPhoto(f){
showToast("Envoi de la photo…","msg");
const url=await cap.upPhoto(f,"chat");
if(!url){alert("L’envoi de la photo a échoué.");return}
await sendMsg("📷 Photo ⟦photo|"+url+"⟧");
}
async function sendVideo(blob,type){
showToast("Envoi de la vidéo…","msg");
const url=await cap.upVideo(blob,type,"chat-"+Date.now());
if(!url){alert("L’envoi de la vidéo a échoué.");return}
await sendMsg("🎥 Vidéo ⟦video|"+url+"⟧");
}
function rend(m,all,i){
let b=String(m.body||""),extra="";
const mine=m.sender_id===user.id;
const mk=/⟦(photo|video|demande)\|([^⟧]*)⟧/.exec(b);
if(mk){
b=b.replace(mk[0],"").trim();
const t=mk[1],a=mk[2];
if(t==="photo"&&a.startsWith(SBU))extra='<img class="cimg" src="'+esc(a)+'" alt="Photo" data-zoom="'+esc(a)+'">';
else if(t==="video"&&a.startsWith(SBU))extra='<video class="cvid2" controls playsinline preload="metadata" src="'+esc(a)+'"></video>';
else if(t==="demande"&&!mine){
const done=all.slice(i+1).some(x=>x.sender_id===user.id&&/⟦(photo|video)\|/.test(x.body||""));
extra=done?'<div class="meta">✓ Envoyé</div>':'<div class="creq"><button type="button" class="sbtn pri" data-resp="'+esc(a)+'">'+(a==="video"?"🎥 Filmer la vidéo":"📷 Prendre la photo")+"</button></div>";
}
}
return'<div class="b '+(mine?"me":"")+'">'+esc(b)+extra+(mine?'<span class="st">'+(m.lu?"✓✓ Lu":"✓ Envoyé")+"</span>":"")+"</div>";
}
window.loadChat=async function(){
if(!chat||!user)return;
const{data}=await sb.from("messages").select("*").eq("listing_id",chat.lid).or("sender_id.eq."+chat.other+",receiver_id.eq."+chat.other).order("created_at");
if(!data)return;
const key=data.length+"-"+data.filter(m=>m.lu).length;
if(key!==lastN){
lastN=key;
const b=q("#mb");
b.innerHTML=data.map((m,i)=>rend(m,data,i)).join("");
b.scrollTop=b.scrollHeight;
}
if(data.some(m=>m.receiver_id===user.id&&!m.lu)){
await sb.from("messages").update({lu:true}).eq("listing_id",chat.lid).eq("receiver_id",user.id).eq("sender_id",chat.other).eq("lu",false);
refreshBadge();
}
};
function respond(kind){
if(kind==="video")cap.open({mode:"video",onVideo:(b,t)=>sendVideo(b,t)});
else cap.open({mode:"photo",max:1,onShot:f=>sendPhoto(f)});
}
q("#mb").addEventListener("click",e=>{
const z=e.target.closest("[data-zoom]");
if(z){q("#dimgc").src=z.dataset.zoom;q("#dimg").showModal();return}
const r=e.target.closest("[data-resp]");
if(r)respond(r.dataset.resp);
});
q(".ctools").addEventListener("click",e=>{
const b=e.target.closest("[data-ct]");
if(!b||!chat)return;
const k=b.dataset.ct;
if(k==="req")q("#dreq").showModal();
else if(k==="photo")respond("photo");
else if(k==="video")respond("video");
else q("#cgal").click();
});
q("#cgal").onchange=e=>{
const f=e.target.files[0];
e.target.value="";
if(f&&/^image\//.test(f.type))sendPhoto(f);
};
q("#dreq").addEventListener("click",async e=>{
const b=e.target.closest("[data-rq]");
if(!b||!chat)return;
const p=b.dataset.rq.split("|"),t=p[0];
let x=p[1];
if(x==="autre"){
x=prompt("Quelle photo voulez-vous voir ?");
if(!x||x.trim().length<3)return;
x="une photo : "+x.trim().slice(0,120);
}
q("#dreq").close();
await sendMsg((t==="video"?"🎥":"📷")+" Demande : pouvez-vous m’envoyer "+x+" ? ⟦demande|"+t+"⟧");
});
new MutationObserver(()=>{
const r=q('.ctools [data-ct="req"]');
if(r)r.hidden=acct!=="client";
}).observe(q("#dm"),{attributes:true,attributeFilter:["open"]});
const I0=window.openInbox;
window.openInbox=async function(){
await I0.apply(this,arguments);
document.querySelectorAll("#il .conv .meta").forEach(s=>{s.textContent=s.textContent.replace(/⟦.*$/,"").trim()||"📎 Média"});
};
q("#msgs").onclick=window.openInbox;
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment demander une photo ou une vidéo au vendeur ?</summary><p>Dans la messagerie, appuyez sur « Demander une photo ou une vidéo » et choisissez ce que vous voulez voir (le dos, allumé, les défauts…). Le vendeur reçoit un bouton pour prendre la photo ou filmer tout de suite. Vous pouvez aussi envoyer vos propres photos et vidéos.</p></details>");
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Photos et vidéos de la messagerie</b> : elles sont stockées sur nos serveurs et visibles uniquement par les personnes qui ont accès à l’annonce (lien de partage compris). Ne partagez jamais d’informations sensibles dans un média.</li>");
}catch(e){}
}
})();
