const machines = {
  chest:['Presse pectorale assise','seat','chest'],
  decline:['Presse pectorale déclinée','seat','decline'],
  pec:['Pec deck / machine à écartés','seat','fly'],
  reversePec:['Pec deck inversé','seat','reverse'],
  smith:['Smith machine / barre guidée','rack','bar'],
  lat:['Poulie de tirage vertical','lat','lat'],
  row:['Poulie de tirage horizontal','row','row'],
  rowMachine:['Machine de rowing avec appui pectoral','support','row'],
  highRow:['Machine de tirage haut avec appui pectoral','support','high'],
  assist:['Machine à tractions et dips assistés','assist','assist'],
  legPress:['Presse à cuisses inclinée','rails','press'],
  horizontal:['Presse à cuisses horizontale','horizontal','press'],
  hack:['Machine à hack squat','rails','hack'],
  legExt:['Machine à extension de jambes','seat','ext'],
  legCurl:['Machine à flexion de jambes assise','seat','curl'],
  lyingCurl:['Machine à flexion de jambes allongée','flat','curl'],
  adductor:['Machine à adducteurs','hips','inner'],
  abductor:['Machine à abducteurs','hips','outer'],
  seatedCalf:['Machine à mollets assis','flat','calf'],
  thrust:['Machine à hip thrust','flat','thrust'],
  shoulder:['Presse épaules assise','seat','shoulder'],
  latRaise:['Machine à élévations latérales','seat','raise'],
  preacher:['Machine à curl au pupitre','support','curl'],
  seatedDip:['Machine à dips assis','seat','dip'],
  abCrunch:['Machine à crunch abdominal','seat','crunch'],
  rotary:['Machine de rotation du buste','seat','rotate'],
  tower:['Poulie réglable','tower','single'],
  dual:['Double poulie réglable','rack','dual'],
  roman:['Chaise romaine','assist','roman'],
  back:['Banc à lombaires à 45°','back','back']
};

const originalMachines = {
  chest:'chest', fly:'pec', lat:'lat', row:'row', pull:'assist', press:'legPress', squat:'smith',
  ext:'legExt', curl:'legCurl', calf:'legPress', hip:'thrust', abd:'abductor', kick:'tower',
  shoulder:'shoulder', reverse:'reversePec', face:'tower', tri:'tower', over:'tower',
  crunch:'tower', legraise:'roman', pallof:'tower'
};

const machineImages = new Map();

function machineImage(id) {
  if (machineImages.has(id)) return machineImages.get(id);
  const [, frame, setup] = machines[id];
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  const background = ctx.createLinearGradient(0,0,240,130);
  background.addColorStop(0,'#f9f7ef');
  background.addColorStop(1,'#ece9de');
  ctx.fillStyle = background;
  ctx.fillRect(0,0,240,130);
  ctx.fillStyle = '#dedad0';
  ctx.beginPath();
  ctx.ellipse(119,113,91,9,0,0,2*Math.PI);
  ctx.fill();

  const tube = (points, color='#363a35', width=5) => {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.stroke();
  };
  const pad = (x,y,w,h,angle=0) => {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.fillStyle='#d75625';
    ctx.beginPath();
    ctx.roundRect(0,0,w,h,3);
    ctx.fill();
    tube([[3,2],[w-4,2]],'#ff9a69',1.5);
    ctx.restore();
  };
  const stack = (x,y,h=83) => {
    tube([[x,y+h],[x,y],[x+23,y],[x+23,y+h]]);
    for (let i=0;i<9;i++) tube([[x+5,y+h-4-i*3.5],[x+18,y+h-4-i*3.5]],'#666b61',2);
  };
  const bench = (x,y,w) => {
    tube([[x+9,111],[x+9,y],[x+w-8,y],[x+w-8,111]]);
    pad(x,y-4,w,8);
  };
  const arm = (points) => tube(points,'#343832',6);
  const grip = (points) => tube(points,'#73796c',3.5);
  const cable = points => tube(points,'#73796c',1.2);

  if (frame==='tower' || frame==='rack') {
    stack(50,20,91);
    tube([[42,112],[88,112]]);
    tube([[76,22],[76,111]],'#a39179',2);
    if (frame==='rack') {
      stack(164,20,91);
      tube([[73,21],[164,21]]);
      tube([[154,23],[154,112]],'#a39179',2);
      tube([[146,112],[197,112]]);
      if (setup==='bar') {
        tube([[67,65],[171,65]],'#73796c',3);
        tube([[72,57],[72,73]],'#d75625',6);
        tube([[161,57],[161,73]],'#d75625',6);
      } else {
        cable([[76,48],[108,67]]);
        cable([[160,48],[131,67]]);
        grip([[105,66],[111,66],[108,74],[104,68]]);
        grip([[131,66],[137,66],[135,74],[131,68]]);
      }
    } else {
      cable([[76,53],[113,69]]);
      grip([[112,68],[121,68],[116,76],[112,68]]);
    }
  }
  if (frame==='lat' || frame==='row') {
    stack(57,20,90);
    tube([[45,112],[197,112]]);
    if (frame==='lat') {
      tube([[72,21],[140,21]]);
      bench(118,91,37);
      tube([[94,90],[113,76],[130,76]]);
      pad(108,71,25,8);
      cable([[140,21],[140,43]]);
      grip([[112,49],[121,43],[159,43],[168,49]]);
    } else {
      bench(131,91,48);
      pad(88,90,22,8,-.85);
      cable([[79,80],[127,76]]);
      grip([[126,70],[126,81],[132,80],[132,72]]);
    }
  }
  if (frame==='assist') {
    tube([[58,112],[85,112],[85,23],[157,23],[157,111],[186,111]]);
    tube([[76,22],[66,28],[93,28]]);
    tube([[146,27],[171,28],[180,22]]);
    arm([[84,63],[111,63]]);
    arm([[156,63],[131,63]]);
    if (setup==='assist') {
      stack(52,40,71);
      tube([[124,111],[124,83]]);
      pad(103,79,41,9);
    } else {
      pad(90,58,25,9);
      pad(130,58,25,9);
      pad(114,55,14,28);
    }
  }
  if (frame==='rails' || frame==='horizontal') {
    tube([[39,112],[194,112]]);
    if (frame==='rails') {
      tube([[61,108],[169,34],[192,112]]);
      tube([[73,113],[181,39]],'#858b7e',3);
      if (setup==='hack') {
        pad(107,78,45,12,-.6);
        pad(140,49,17,10);
        pad(61,96,34,9,-.2);
      } else {
        pad(69,91,37,10);
        pad(65,96,36,10,-2.1);
        pad(122,54,36,10,1.05);
      }
    } else {
      stack(156,42,68);
      bench(66,87,46);
      pad(68,87,37,11,-1.75);
      tube([[105,94],[177,94]],'#787e70',3);
      pad(133,68,33,10,1.62);
    }
  }
  if (frame==='hips') {
    stack(60,37,74);
    bench(94,87,60);
    pad(106,52,26,25);
    tube([[109,88],[86,101],[86,109]]);
    tube([[140,88],[163,101],[163,109]]);
    if (setup==='inner') {
      pad(98,92,17,11,-.46);
      pad(134,84,17,11,.46);
    } else {
      pad(77,94,18,11,-.62);
      pad(156,84,18,11,.62);
    }
  }
  if (frame==='flat' || frame==='back') {
    tube([[51,112],[187,112]]);
    if (frame==='flat') {
      bench(68,81,77);
      if (setup==='curl') {
        stack(42,48,62);
        arm([[141,80],[163,65]]);
        pad(161,58,20,9);
      }
      if (setup==='calf') {
        arm([[99,68],[148,56],[165,87],[161,109]]);
        pad(130,58,35,9);
        pad(149,100,31,8);
      }
      if (setup==='thrust') {
        arm([[72,106],[109,62],[142,61],[161,92]]);
        pad(99,56,36,12);
        pad(141,95,43,10,-.3);
      }
    } else {
      arm([[72,101],[138,58],[160,111]]);
      pad(122,55,38,13,-.54);
      pad(58,94,23,11);
    }
  }
  if (frame==='seat' || frame==='support') {
    tube([[53,112],[187,112]]);
    stack(65,33,78);
    bench(99,90,47);
    if (frame==='support') pad(130,59,14,27,-.37);
    else pad(102,53,13,33,-.12);
    const arms = {
      chest:[[89,41],[143,41],[149,70],[167,70]],
      decline:[[88,52],[140,56],[151,78],[168,84]],
      fly:[[87,41],[139,42],[166,61],[164,80]],
      reverse:[[88,43],[125,43],[156,48],[170,68]],
      row:[[88,59],[159,59],[161,73],[147,78]],
      high:[[88,36],[164,28],[164,57],[148,63]],
      ext:[[111,92],[147,93],[158,109]],
      curl:[[98,53],[144,74],[162,84]],
      shoulder:[[86,35],[146,28],[153,46],[166,46]],
      raise:[[104,52],[141,52],[163,65],[163,74]],
      dip:[[88,55],[136,60],[165,75]],
      crunch:[[88,39],[143,39],[164,61]],
      rotate:[[88,47],[135,45],[159,59],[158,77]]
    };
    arm(arms[setup]);
    if (['ext','curl','raise','crunch'].includes(setup)) {
      const [x,y] = arms[setup].at(-1);
      pad(x-5,y-4,24,9);
    } else {
      const [x,y] = arms[setup].at(-1);
      grip([[x,y],[x+11,y]]);
    }
  }
  const image = canvas.toDataURL('image/png');
  machineImages.set(id,image);
  return image;
}
