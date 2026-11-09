// Finder - cat.js : aide au bon classement des articles (téléphones, ordinateurs, véhicules)
(function(){
if(window.__finderCat)return;window.__finderCat=1;
const q=s=>document.querySelector(s);
Object.assign(ERR,{
"categorie telephone":"Cet article semble être un téléphone. Choisissez la catégorie « Téléphones » et indiquez l’IMEI (tapez *#06# sur le téléphone). Si ce n’est pas un téléphone, modifiez le titre ou contactez le support.",
"categorie tablette":"Cet article semble être une tablette. Choisissez « Informatique » (ou « Téléphones » si elle a une carte SIM) et indiquez le numéro de série.",
"categorie ordinateur":"Cet article semble être un ordinateur. Choisissez la catégorie « Informatique » et indiquez le numéro de série. Si ce n’est pas un ordinateur, modifiez le titre ou contactez le support.",
"categorie vehicule":"Cet article semble être un véhicule ou une moto. Choisissez « Véhicules et motos » et indiquez le numéro de châssis ou la plaque. Si ce n’est pas un véhicule, modifiez le titre ou contactez le support."
});
const N=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const OK={telephone:["Téléphones"],tablette:["Informatique","Téléphones"],ordinateur:["Informatique"],vehicule:["Véhicules et motos"]};
const LBL={telephone:"un téléphone",tablette:"une tablette",ordinateur:"un ordinateur",vehicule:"un véhicule"};
function detect(title,marque,price){
const t=N(title+" "+(marque||"")),ti=N(title);
if(/^(coque|coques|etui|housse|chargeur|cable|ecouteurs?|support|protege|protection|verre|batterie|accessoires?|adaptateur|pochette|film|powerbank|casque|pieces?|pneus?|jantes?|antivol|retroviseur|autoradio|sac|souris|clavier|imprimante|jouet|miniature|maquette)\b/.test(ti)&&price<(/(moto|scooter|voiture|toyota|peugeot|renault|hyundai|nissan|mercedes|bmw|camion|tricycle)/.test(ti)?150000:30000))return null;
if(/\b(iphone|smartphones?|redmi|tecno|infinix|itel|poco|realme|oneplus|imei)\b/.test(t))return "telephone";
if(/\b(samsung|galaxy|huawei|xiaomi|oppo|vivo|nokia|honor|motorola|pixel)\b/.test(t)&&/(\b[0-9]+ ?(go|gb)\b|\b[45]g\b|\bram\b|\bsim\b|\bandroid\b)/.test(t)&&!/\b(tv|television|frigo|refrigerateur|congelateur|climatiseur|clim|split|ventilateur|cuisiniere|lave|machine|mixeur|decodeur|enceinte)\b/.test(t))return "telephone";
if(/\b(telephones?|portables?|mobile)\b/.test(t)&&!/\b(ordinateur|pc|laptop|ventilateur|radio|lampe|climatiseur|enceinte|aspirateur|tv|television|frigo|machine|decodeur)\b/.test(t))return "telephone";
if(/\b(ipad|tablettes?)\b/.test(t))return "tablette";
if(/\b(ordinateurs?|laptop|macbook|imac|chromebook|notebook|thinkpad|unite centrale|pc gamer|pc portable)\b/.test(t))return "ordinateur";
if(/\b(motos?|motocyclette|scooter|tricycle|mobylette|voitures?|automobile|camion|camionnette|minibus|berline|toyota|peugeot|renault|hyundai|nissan|mercedes|bmw)\b/.test(t))return "vehicule";
return null;
}
const sc=q("#sc"),ttl=q("#ttl"),mq=q("#mq"),px=q("#prix");
if(!sc||!ttl)return;
const warn=document.createElement("p");warn.id="catwarn";warn.className="meta";sc.after(warn);
function check(auto){
const t=detect(ttl.value,mq.value,parseInt(px.value,10)||0);
if(!t||OK[t].includes(sc.value)){warn.textContent="";warn.className="meta";return}
const need=OK[t][0];
if(auto){
sc.value=need;sc.dispatchEvent(new Event("change"));
warn.className="soldnote";
warn.textContent="Cet article ressemble à "+LBL[t]+" : il est classé dans « "+need+" » et le numéro de série (IMEI) est obligatoire.";
}else{
warn.className="err";
warn.textContent="Cet article ressemble à "+LBL[t]+" : choisissez « "+need+" » (numéro de série obligatoire).";
}
}
[ttl,mq,px].forEach(e=>e&&e.addEventListener("input",()=>check(true)));
sc.addEventListener("change",()=>check(false));
const f=q("#sf");
if(f)f.addEventListener("reset",()=>setTimeout(()=>{warn.textContent="";warn.className="meta"},0));
})();
