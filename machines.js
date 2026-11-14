const machines = {
  chest:'Presse pectorale assise',
  decline:'Presse pectorale déclinée',
  pec:'Pec deck / machine à écartés',
  reversePec:'Pec deck inversé',
  smith:'Smith machine / barre guidée',
  lat:'Poulie de tirage vertical',
  row:'Poulie de tirage horizontal',
  rowMachine:'Machine de rowing avec appui pectoral',
  highRow:'Machine de tirage haut avec appui pectoral',
  assist:'Machine à tractions et dips assistés',
  legPress:'Presse à cuisses inclinée',
  horizontal:'Presse à cuisses horizontale',
  hack:'Machine à hack squat',
  legExt:'Machine à extension de jambes',
  legCurl:'Machine à flexion de jambes assise',
  lyingCurl:'Machine à flexion de jambes allongée',
  adductor:'Machine à adducteurs',
  abductor:'Machine à abducteurs',
  seatedCalf:'Machine à mollets assis',
  thrust:'Machine à hip thrust',
  shoulder:'Presse épaules assise',
  latRaise:'Machine à élévations latérales',
  preacher:'Machine à curl au pupitre',
  seatedDip:'Machine à dips assis',
  abCrunch:'Machine à crunch abdominal',
  rotary:'Machine de rotation du buste',
  tower:'Poulie réglable',
  dual:'Double poulie réglable',
  roman:'Chaise romaine',
  back:'Banc à lombaires à 45°'
};

const originalMachines = {
  chest:'chest', fly:'pec', lat:'lat', row:'row', pull:'assist', press:'legPress', squat:'smith',
  ext:'legExt', curl:'legCurl', calf:'legPress', hip:'thrust', abd:'abductor', kick:'tower',
  shoulder:'shoulder', reverse:'reversePec', face:'tower', tri:'tower', over:'tower',
  crunch:'tower', legraise:'roman', pallof:'tower'
};

const machinePhotos = {
  chest: ["https://images.jhtassets.com/323e9e0156e491ca216b7354178d3a4c87d38676/transformed/w_2000","https://world.matrixfitness.com/eng/strength/single-station/g7-s13-converging-chest-press","Modèle Matrix Fitness"],
  decline: ["https://commercial.fitnessexperience.ca/cdn/shop/products/MX21_MAGNUMMG-PL15verticaldeclinebenchpress_BlkMatte_hero_2048x.jpg?v=1620419359","https://commercial.fitnessexperience.ca/products/matrix-magnum-vertical-decline-bench","Modèle Matrix Fitness"],
  smith: ["https://fitnessexperience.ca/cdn/shop/files/MX21_MAGNUMMG-PL62-03smithmachine_MatteBlk_hero.jpg?crop=center&height=2400&v=1699554922&width=2400","https://fitnessexperience.ca/products/magnum-smith-machine","Modèle Matrix Fitness"],
  lat: ["https://images.jhtassets.com/e74ad7913759f0a6141d9629e704fc7af149d391/transformed/w_2000","https://th.matrixfitness.com/eng/strength/single-station/g7-s33-diverging-lat-pulldown","Modèle Matrix Fitness"],
  rowMachine: ["https://images.jhtassets.com/388229737c02e4a675585fd2f38a4550d302ba7e/transformed/w_2000","https://kr.matrixfitness.com/kor/strength/single-station/g7-s34-diverging-seated-row","Modèle Matrix Fitness"],
  highRow: ["https://images.jhtassets.com/01ae8c136bf06689a73116a11c56e0ddf7776f62/transformed/w_2000","https://au.matrixfitness.com/eng/strength/plate-loaded/mg-pl37-high-row","Modèle Matrix Fitness"],
  assist: ["https://www.johnsonfitness.com.au/cdn/shop/files/unnamed_903ec811-90fc-4472-bea6-d7afd6de8377.png?v=1706151265&width=1250","https://www.johnsonfitness.com.au/products/matrix-versa-chin-dip-assist","Modèle Matrix Fitness"],
  horizontal: ["https://www.progym.fr/media/wysiwyg/prensa_de_pierna.jpg","https://www.progym.fr/matrix-fitness-presse-a-jambes-go-s70.html","Modèle Matrix Fitness"],
  hack: ["https://fitnessexperience.ca/cdn/shop/files/MX21_MAGNUMMG-PL71hacksquat_IcedSlvr_hero.jpg?crop=center&height=2400&v=1699475959&width=2400","https://fitnessexperience.ca/products/magnum-hack-squat","Modèle Matrix Fitness"],
  legCurl: ["https://images.jhtassets.com/e54948722d24bc6507b2bbcf34d9e365dd073b3d/transformed/w_2000","https://fr.matrixfitness.com/fra/strength/single-station/g7-s72b-seated-leg-curl","Modèle Matrix Fitness"],
  lyingCurl: ["https://images.jhtassets.com/ea875f78d93843f3ff46f531cd5b863178b622a1/","https://us.matrixfitness.com/eng/strength/single-station/g7-s73-prone-leg-curl","Modèle Matrix Fitness"],
  adductor: ["https://commercial.fitnessexperience.ca/cdn/shop/products/AddAbPLUSBlack_2048x.jpg?v=1618594721","https://commercial.fitnessexperience.ca/products/matrix-versa-hip-abductor-adductor","Modèle Matrix Fitness"],
  seatedCalf: ["https://images.jhtassets.com/4c3ad01082f528c7c7e1db5c8211f27c2eb09cdf/","https://www.matrixfitness.com/us/eng/strength/plate-loaded/mg-pl77-seated-calf","Modèle Matrix Fitness"],
  thrust: ["https://www.johnsonfitness.com.au/cdn/shop/files/MX23_MAGNUMMG-PL78glutetrainer_Grpht_hero.jpg?crop=top&height=1500&v=1744087307&width=1500","https://www.johnsonfitness.com.au/products/magnum-glute-trainer","Modèle Matrix Fitness"],
  shoulder: ["https://images.jhtassets.com/ebd16aba92ab340c8965158d5ea752deec16374a/transformed/w_2000","https://nl.matrixfitness.com/fra/strength/single-station/vs-s23-converging-shoulder-press","Modèle Matrix Fitness"],
  latRaise: ["https://images.jhtassets.com/af593b17db5aa24be8125b06aa702469ad0a0b74/transformed/w_2000","https://uk.matrixfitness.com/eng/strength/single-station/g7-s21b-lateral-raise","Modèle Matrix Fitness"],
  preacher: ["https://images.jhtassets.com/02213cf0942a7fbcfb412d44bf53751fc564e5b2/transformed/w_2000","https://ch.matrixfitness.com/deu/strength/single-station/vs-s40-biceps-curl","Modèle Matrix Fitness"],
  seatedDip: ["https://images.jhtassets.com/uploads/G3-S42-scaled.jpg","https://cpo.matrixfitness.com/products/strength/aura/matrix-aura-g3-s42-seated-dip/","Modèle Matrix Fitness"],
  abCrunch: ["https://images.jhtassets.com/85cce99dff437578b95d3ac4cbce5ffce77eac62/","https://us.matrixfitness.com/eng/strength/single-station/g7-s51-abdominal-crunch","Modèle Matrix Fitness"],
  rotary: ["https://assets.jhtbrand.co/files/product/ca55935f7a1639038184c1593414fb2a51244fa4/","https://us.matrixfitness.com/eng/strength/single-station/g7-s55-rotary-torso","Modèle Matrix Fitness"],
  tower: ["https://images.jhtassets.com/6c4d101a0b481cb253b8b43623fb5aa28b882708/transformed/w_2000","https://kr.matrixfitness.com/kor/strength/single-station/md-ap-adjustable-pulley","Modèle Matrix Fitness"],
  dual: ["https://images.squarespace-cdn.com/content/v1/653a87fc1afe4a55eb3fc8ef/e0a3a883-3f82-445a-b249-c4eeda288dbb/MX23_AURA%2BG3-MSFT%2BNA%2Bfunctional%2Btrainer_Matte%2BBlk_hero_lores.jpg","https://tfcfit.com/matrix","Modèle Matrix Fitness"],
  roman: ["https://gigaplus.makeshop.jp/ifitness/img/matrix-for-gym/strength/magnum/mg-a63c/strength-magnum-mg-a63c-3.jpg","https://www.ifitness.shop/mg-a63c","Modèle Matrix Fitness"],
  back: ["https://images.jhtassets.com/e974690ea8a994d8237901c426a93954840cd45f/","https://it.matrixfitness.com/ita/strength/free-weights/g1-fw162-back-extension","Modèle Matrix Fitness"],
  row: ["https://akfit.com/cdn/shop/files/unnamed_3d8e7a7e-5eed-4b54-8505-1eb336853a26.png?v=1700677485&width=1000","https://akfit.com/products/matrix-aura-low-row","Modèle Matrix Fitness"],
  reversePec: ["https://images.jhtassets.com/528e1fb3f3d361ed043960897ac8bcc9a85965ea/transformed/w_2000","https://ae.matrixfitness.com/eng/strength/single-station/g7-s22b-pectoral-fly","Modèle Matrix Fitness"],
  abductor: ["https://commercial.fitnessexperience.ca/cdn/shop/products/AddAbPLUSBlack_2048x.jpg?v=1618594721","https://commercial.fitnessexperience.ca/products/matrix-versa-hip-abductor-adductor","Modèle Matrix Fitness"],
  legPress: ["https://1.bp.blogspot.com/-0MUibp6B-ts/XVaM2s2QWtI/AAAAAAAAZWc/eGiBNr4ciykaIq0gae1OLFSPy55AEKWQACKgBGAs/s1600/IMG_20190807_004125.jpg","https://www.teamelfit.com/2019/08/basic-fit-merignac-bordeaux.html","Photo en club · Basic-Fit Mérignac"],
  pec: ["https://brand.basic-fit.com/transform/2f822d47-f63b-4acc-b839-57802313329c/Basicfit-Breda-Roel-14-11-250005?io=transform%3Afit%2Cwidth%3A600","https://www.basic-fit.com/fr-fr/zones-dentrainement/musculation-assistee","Photo en club · Basic-Fit"],
  legExt: ["https://brand.basic-fit.com/transform/f92f9b39-2786-4093-8005-441c70a7f7b4/Basicfit-Breda-Roel-14-11-250247?io=transform%3Afit%2Cwidth%3A600","https://www.basic-fit.com/fr-fr/zones-dentrainement/musculation-assistee","Photo en club · Basic-Fit"]
};

function machineFigure(id) {
  const [photo, source, credit] = machinePhotos[id];
  const name = machines[id];
  return `<figure class="machine-figure">
    <img class="machine-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">
    <p class="photo-fallback" hidden>Photo indisponible ici. Utilise le lien source pour voir l’appareil.</p>
    <figcaption>${escapeHtml(name)}<span class="photo-credit">${escapeHtml(credit)}</span>
    <a class="photo-source" href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">Voir la source de la photo ↗</a></figcaption>
  </figure>`;
}
