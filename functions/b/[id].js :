// Finder - aperçu WhatsApp d'une boutique
export async function onRequest({request,params}){
const SB="https://lgaspyiqaqntmsljooba.supabase.co";
const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYXNweWlxYXFudG1zbGpvb2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NTcwOTcsImV4cCI6MjEwODUzMzA5N30.ArQcp2h2dGHGe3Y8pQOl8eXJmLjpyzQfyrN3B2oiWQg";
const id=String(params.id||"").replace(/[^a-fA-F0-9-]/g,"").slice(0,36);
const origin=new URL(request.url).origin;
let t="Finder · Achetez et vendez d’occasion",d="La plateforme de vente d’articles d’occasion en Côte d’Ivoire.",img="";
if(id.length===36){
try{
const r=await fetch(SB+"/rest/v1/boutiques?user_id=eq."+id+"&select=nom,ville,logo_url,delai&limit=1",{headers:{apikey:KEY,Authorization:"Bearer "+KEY}});
const j=await r.json();
const b=Array.isArray(j)?j[0]:null;
if(b){t=b.nom+" · Boutique Finder";d="Boutique à "+b.ville+". Délai de livraison : "+b.delai+". Découvrez tous les articles.";img=b.logo_url||""}
}catch(e){}
}
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const dest=origin+"/"+(id.length===36?"?b="+id:"");
const html='<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>'+esc(t)+'</title><meta name="viewport" content="width=device-width,initial-scale=1"><meta property="og:type" content="website"><meta property="og:site_name" content="Finder"><meta property="og:title" content="'+esc(t)+'"><meta property="og:description" content="'+esc(d)+'">'+(img?'<meta property="og:image" content="'+esc(img)+'">':"")+'<meta property="og:url" content="'+esc(request.url)+'"><meta name="twitter:card" content="summary"><meta http-equiv="refresh" content="0;url='+esc(dest)+'"></head><body><script>location.replace('+JSON.stringify(dest)+')</script><p><a href="'+esc(dest)+'">Ouvrir sur Finder</a></p></body></html>';
return new Response(html,{headers:{"content-type":"text/html;charset=utf-8","cache-control":"public,max-age=300","x-finder":"1"}});
}
