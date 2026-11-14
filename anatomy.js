const muscleRegions = {
  'pectoraux':['pec'], 'haut des pectoraux':['upperPec'], 'bas des pectoraux':['lowerPec'],
  'triceps':['tri'], 'biceps':['bicep'], 'brachial':['brachial'], 'brachio-radial':['forearm'],
  'avant-bras':['forearm','backForearm'], 'extenseurs du poignet':['backForearm'], 'fléchisseurs du poignet':['forearm'],
  'deltoïdes':['frontDelt','sideDelt','rearDelt'], 'deltoïdes antérieurs':['frontDelt'],
  'deltoïdes latéraux':['sideDelt'], 'deltoïde latéral':['sideDelt'], 'deltoïdes postérieurs':['rearDelt'],
  'deltoïdes antérieurs et latéraux':['frontDelt','sideDelt'],
  'grand dorsal':['lat'], 'grand rond':['teres'], 'rhomboïdes':['rhomboid'],
  'trapèzes':['upperTrap','midTrap'], 'trapèzes moyens':['midTrap'], 'trapèzes supérieurs':['upperTrap'],
  'haut du dos':['midTrap','rhomboid'], 'érecteurs du rachis':['erectors'],
  'quadriceps':['quad'], 'ischio-jambiers':['hamstring'], 'adducteurs':['adductor'],
  'fessiers':['glute','sideGlute'], 'grand fessier':['glute'], 'moyen et petit fessiers':['sideGlute'],
  'mollets':['calf','soleus'], 'gastrocnémiens':['calf'], 'soléaire':['soleus'],
  'abdominaux':['abs','obliques'], 'grand droit':['abs'], 'obliques':['obliques'], 'transverse':['transverse'],
  'fléchisseurs de hanche':['hipFlexor']
};

const bodyOutline = `<path d="M60 7c-9 0-13 6-13 15v8l5 9-1 7-17 6c-8 3-11 9-13 17l-5 24-4 17-5 19 1 11 3 1 4-12 2 10 3-2 3-24 7-19 6-20 4 22-5 29 1 20 6 30 2 17-3 27-3 7 14 1 4-5 2-27-1-19 5-31 5-14 5 14 5 31-1 19 2 27 4 5 14-1-3-7-3-27 2-17 6-30 1-20-5-29 4-22 6 20 7 19 3 24 3 2 2-10 4 12 3-1 1-11-5-19-4-17-5-24c-2-8-5-14-13-17l-17-6-1-7 5-9v-8c0-9-4-15-13-15z" transform="translate(7 1) scale(.9 1)"/>`;

const frontRegions = {
  pec:'M38 56Q49 53 59 57L59 73Q50 77 40 69Z', upperPec:'M38 56Q49 53 59 57L59 61Q46 60 39 63Z', lowerPec:'M39 65Q51 68 59 64V73Q50 77 40 69Z',
  frontDelt:'M37 55Q31 55 28 66L30 74Q37 68 39 58Z', sideDelt:'M29 59Q25 64 25 73L29 75 33 62Z',
  bicep:'M29 73Q25 76 22 91L25 96Q30 87 33 72Z', brachial:'M26 84L21 94 23 97 28 90Z',
  forearm:'M20 97Q16 105 14 120L18 119 25 98Z',
  abs:'M53 76H59V111L55 116Q50 106 51 89Z', obliques:'M40 72L49 80 48 102 44 112 42 99Z',
  transverse:'M46 103Q52 106 60 106V116Q51 116 46 111Z', hipFlexor:'M43 115L54 121 59 133 53 132 43 123Z',
  quad:'M39 126Q46 123 53 132L54 150 50 168 44 171Q38 156 39 126Z',
  adductor:'M54 134L59 133 54 155 51 165 53 150Z'
};

const backRegions = {
  upperTrap:'M52 43L59 43V60L54 62 39 55Z', midTrap:'M58 60L54 62 50 68 55 78 59 84Z',
  rhomboid:'M48 61L54 64 56 75 51 76 45 69Z', rearDelt:'M37 54Q28 55 26 66L31 73 39 63Z',
  sideDelt:'M28 60L25 66V73L29 75 32 63Z', teres:'M39 65L47 67 48 73 39 74Z',
  lat:'M39 74Q45 72 49 76L55 91 51 101 45 92 41 88Z',
  erectors:'M55 81L59 83V111L53 106 53 95Z', tri:'M28 74L34 71Q31 91 24 97L21 94Z',
  backForearm:'M20 97L24 98 18 118 14 120Q15 108 20 97Z',
  glute:'M43 109Q52 105 59 112L59 126Q53 137 43 129 39 124 43 109Z',
  sideGlute:'M43 107L50 105 48 113 41 121 40 117Z',
  hamstring:'M40 133Q48 139 55 132L54 150 50 170 45 171Q42 160 40 133Z',
  calf:'M46 174Q53 174 53 185L50 202 45 199Q43 186 46 174Z',
  soleus:'M44 192L48 202 51 194 49 208 46 214 43 207Z'
};

function muscleMap(muscles) {
  const active = new Set(muscles.toLowerCase().split(',').flatMap(label => muscleRegions[label.trim()] ?? []));
  const view = (name, regions) => {
    const paths = Object.entries(regions).map(([region, path]) =>
      '<path class="muscle-region'+(active.has(region)?' is-target':'')+'" d="'+path+'"/>').join('');
    return `<div><svg viewBox="0 0 120 232" aria-hidden="true" focusable="false">
      <g class="body-outline">${bodyOutline}</g><g>${paths}</g><g transform="translate(120 0) scale(-1 1)">${paths}</g>
      </svg><span>${name}</span></div>`;
  };
  return `<figure class="muscle-map" aria-label="Silhouettes des muscles ciblés">
    <div class="muscle-views">${view('Face',frontRegions)}${view('Dos',backRegions)}</div>
    <figcaption><i aria-hidden="true"></i>${escapeHtml(muscles)}</figcaption>
  </figure>`;
}
