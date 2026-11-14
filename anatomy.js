const muscleRegions = {
  'pectoraux': ['pec'],
  'haut des pectoraux': ['upperPec'],
  'bas des pectoraux': ['lowerPec'],
  'triceps': ['triceps'],
  'biceps': ['bicep'],
  'brachial': ['brachial'],
  'brachio-radial': ['brachioradialis'],
  'avant-bras': ['forearmFront', 'forearmBack'],
  'extenseurs du poignet': ['forearmBack'],
  'fléchisseurs du poignet': ['forearmFront'],
  'deltoïdes': ['frontDelt', 'sideDelt', 'rearDelt'],
  'deltoïdes antérieurs': ['frontDelt'],
  'deltoïdes latéraux': ['sideDelt'],
  'deltoïde latéral': ['sideDelt'],
  'deltoïdes postérieurs': ['rearDelt'],
  'deltoïdes antérieurs et latéraux': ['frontDelt', 'sideDelt'],
  'grand dorsal': ['lat'],
  'grand rond': ['teres'],
  'rhomboïdes': ['rhomboid'],
  'trapèzes': ['upperTrap', 'midTrap'],
  'trapèzes moyens': ['middleTraps'],
  'trapèzes supérieurs': ['upperTrap'],
  'haut du dos': ['midTrap', 'rhomboid'],
  'érecteurs du rachis': ['erectors'],
  'quadriceps': ['quad'],
  'ischio-jambiers': ['hamstring'],
  'adducteurs': ['adductor'],
  'fessiers': ['glute', 'sideGlute'],
  'grand fessier': ['glute'],
  'moyen et petit fessiers': ['sideGlute'],
  'mollets': ['calf', 'soleus'],
  'gastrocnémiens': ['gastroc'],
  'soléaire': ['soleus'],
  'abdominaux': ['abs', 'obliques'],
  'grand droit': ['abs'],
  'obliques': ['obliques'],
  'transverse': ['transverse'],
  'fléchisseurs de hanche': ['hipFlexor']
};

const anatomicalDetails = {
  front: {
    // These paths use the left half of the original view. The other side is mirrored.
    contours: [
      'M449 163C459 167 460 183 466 193',
      'M473 148C483 143 493 145 500 149',
      'M478 185Q490 184 498 188',
      'M505 182Q499 197 506 200',
      'M485 221Q498 230 512 230',
      'M491 241Q505 248 512 248',
      'M470 254C477 285 493 312 509 334',
      'M409 314C443 311 476 313 502 326',
      'M492 506Q496 503 506 506 M486 553Q495 550 507 555 M485 601Q496 598 508 604',
      'M394 609C403 655 427 702 464 738',
      'M411 887C419 930 424 958 432 977',
      'M385 1017Q407 1010 430 1024',
      'M383 1093C375 1179 391 1241 404 1281',
      'M380 1360Q391 1374 408 1377'
    ],
    accents: {
      brachial: 'M288 470C297 481 301 492 298 510Q293 524 287 534Q281 524 284 511Z',
      brachioradialis: 'M305 535C304 568 295 595 283 619L265 641Q277 611 280 582L285 558Q292 545 305 535Z',
      hipFlexor: 'M394 678C414 690 433 708 454 733Q473 752 481 769Q460 758 442 742Q415 719 400 707Z',
      transverse: 'M416 618C439 620 466 631 487 644L484 672Q449 653 426 652Z'
    },
    // Clip subregions to the traced surface so they follow the muscle's curved edge.
    segments: {
      pec: {
        upperPec: 'M310 283H714V365C637 360 570 377 512 387C453 377 388 360 310 365Z',
        lowerPec: 'M310 398C390 404 457 415 512 424C567 415 634 404 714 398V490H310Z'
      }
    }
  },
  back: {
    contours: [
      'M449 160Q460 170 468 189',
      'M466 193Q472 217 489 230',
      'M479 240Q490 258 504 265',
      'M421 390Q457 409 491 416',
      'M408 478Q453 511 482 556',
      'M485 557C483 593 486 626 498 650',
      'M391 763Q420 794 468 811',
      'M404 874C428 940 445 1012 441 1050',
      'M382 1084Q399 1076 422 1095',
      'M394 1121C387 1174 397 1236 403 1281',
      'M385 1360Q397 1374 414 1378'
    ],
    accents: {
      teres: 'M370 421C391 420 413 429 435 443Q452 451 451 458Q429 467 408 461Q384 453 370 434Z',
      sideGlute: 'M390 648C417 635 441 639 460 653Q444 669 418 689Q402 700 390 699Q385 673 390 648Z'
    },
    segments: {
      midTrap: {
        middleTraps: 'M383 343H641V418Q574 432 512 429Q450 432 383 418Z'
      },
      calf: {
        gastroc: 'M318 1026H706V1222Q606 1201 512 1208Q418 1201 318 1222Z',
        soleus: 'M318 1188Q416 1206 512 1202Q608 1206 706 1188V1384H318Z'
      }
    }
  }
};

function muscleView(side, label, active) {
  const {outline, parts} = anatomyShapes[side];
  const {contours, accents, segments} = anatomicalDetails[side];
  const prefix = 'anatomy-' + side;
  const shape = (className, path, fill = '') =>
    `<path class="${className}" d="${path}"${fill ? ' fill="'+fill+'"' : ''}/>`;
  const target = path => shape('muscle-region is-target', path, 'url(#'+prefix+'-target)');
  const mirrored = paths => `<g>${paths}</g><g transform="translate(1024 0) scale(-1 1)">${paths}</g>`;

  const surfaces = parts.map(([region, path]) => {
    return active.has(region) ? target(path) : shape('muscle-region', path);
  }).join('');
  const highlights = Object.entries(segments).map(([region, variants]) => {
    if (active.has(region)) return '';
    const matching = Object.entries(variants).filter(([name]) => active.has(name));
    if (!matching.length) return '';

    const clipId = prefix + '-' + region;
    const clipPaths = parts.filter(([part]) => part === region).map(([, path]) => `<path d="${path}"/>`).join('');
    return `<defs><clipPath id="${clipId}">${clipPaths}</clipPath></defs>
      <g clip-path="url(#${clipId})">${matching.map(([, path]) => target(path)).join('')}</g>`;
  }).join('');
  const additionalHighlights = Object.entries(accents)
    .filter(([region]) => active.has(region))
    .map(([, path]) => target(path))
    .join('');
  const anatomicalLines = contours.map(path => shape('muscle-contour', path)).join('');

  return `<div class="muscle-view">
    <svg viewBox="158 42 708 1420" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${prefix}-body" x1="0" y1="0" x2=".82" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#edf0f0"/>
          <stop offset=".58" stop-color="#b8c1c3"/>
          <stop offset="1" stop-color="#e5ebeb"/>
        </linearGradient>
        <linearGradient id="${prefix}-target" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#ffad75"/>
          <stop offset=".52" stop-color="#f27a42"/>
          <stop offset="1" stop-color="#c64c27"/>
        </linearGradient>
        <clipPath id="${prefix}-outline"><path d="${outline}"/></clipPath>
      </defs>
      ${shape('body-outline', outline, 'url(#'+prefix+'-body)')}
      <g clip-path="url(#${prefix}-outline)">
        ${surfaces}
        ${highlights}
        ${mirrored(additionalHighlights)}
        ${mirrored(anatomicalLines)}
      </g>
    </svg>
    <span class="muscle-view-label">${label}</span>
  </div>`;
}

function muscleMap(muscles) {
  const active = new Set(muscles.toLowerCase().split(',').flatMap(label => muscleRegions[label.trim()] ?? []));
  return `<figure class="muscle-map" aria-label="Silhouettes des muscles ciblés">
    <div class="muscle-views">
      ${muscleView('front', 'Face', active)}
      ${muscleView('back', 'Dos', active)}
    </div>
    <figcaption class="muscle-legend">
      <span class="muscle-swatch" aria-hidden="true"></span>
      <span>${escapeHtml(muscles)}</span>
    </figcaption>
  </figure>`;
}
