// Static line diagrams for project cards. Conceptual illustrations, not data.
const label = (text, x, y, anchor = 'start') =>
  '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" class="art-label">' + text + '</text>';

function helix() {
  let rungs = '', railA = '', railB = '';
  for (let y = -40; y <= 360; y += 6) {
    const x = Math.sin(y / 120 * Math.PI * 2) * 44;
    railA += (y === -40 ? 'M' : 'L') + (200 + x).toFixed(1) + ' ' + y;
    railB += (y === -40 ? 'M' : 'L') + (200 - x).toFixed(1) + ' ' + y;
    if (y % 12 === 0) {
      const marked = (y + 40) % 84 === 0;
      rungs += '<path class="' + (marked ? 'art-accent' : 'art-faint') + '" d="M' + (200 + x).toFixed(1) + ' ' + y + 'H' + (200 - x).toFixed(1) + '"/>';
      if (marked) rungs += '<circle class="art-dot" cx="' + (200 + x).toFixed(1) + '" cy="' + y + '" r="3.2"/>';
    }
  }
  return '<g transform="rotate(-22 200 160)">' + rungs + '<path class="art-line" d="' + railA + '"/><path class="art-accent" d="' + railB + '"/></g>'
    + label('5hmC marks', 300, 118) + '<path class="art-faint" d="M296 114h-34"/>'
    + label('cell-free DNA', 58, 236) + '<path class="art-faint" d="M150 232h28"/>';
}

function care() {
  return '<rect class="art-line" x="146" y="22" width="108" height="276" rx="20"/><path class="art-faint" d="M188 36h24"/>'
    + '<circle class="art-faint" cx="200" cy="138" r="54"/><circle class="art-accent" cx="200" cy="138" r="38"/>'
    + '<text x="200" y="136" text-anchor="middle" class="art-title">Breathe in.</text>'
    + '<text x="200" y="152" text-anchor="middle" class="art-small">You’re here.</text>'
    + '<rect class="art-faint" x="162" y="226" width="76" height="20" rx="10"/><text x="200" y="240" text-anchor="middle" class="art-small">How do you feel?</text>'
    + label('Capture', 128, 96, 'end') + label('Clarify', 128, 160, 'end') + label('Comfort', 128, 224, 'end')
    + '<path class="art-faint" d="M134 92h12M134 156h12M134 220h12"/>'
    + label('EN · HI · KN', 272, 60);
}

function plastix() {
  let particles = '';
  for (let i = 0; i < 34; i++) {
    const angle = i * 2.399963, radius = Math.sqrt(i / 34) * 92;
    const x = (200 + Math.cos(angle) * radius).toFixed(1), y = (160 + Math.sin(angle) * radius).toFixed(1);
    particles += i % 3 === 0
      ? '<path class="art-faint" d="M' + x + ' ' + y + 'l' + (6 + i % 5) + ' ' + (i % 2 ? 4 : -4) + '"/>'
      : '<circle class="art-fill" cx="' + x + '" cy="' + y + '" r="' + (1.2 + i % 3 * .7) + '"/>';
  }
  return '<circle class="art-line" cx="200" cy="160" r="116"/><circle class="art-faint" cx="200" cy="160" r="108"/>' + particles
    + '<rect class="art-accent" x="152" y="104" width="26" height="18"/><rect class="art-accent" x="226" y="176" width="22" height="22"/><rect class="art-accent" x="170" y="204" width="16" height="16"/>'
    + '<path class="art-accent" d="M92 132h216" stroke-dasharray="3 5"/>'
    + label('fibre', 324, 96) + label('fragment', 324, 196) + label('bead', 324, 226)
    + '<path class="art-faint" d="M320 92h-138M320 192h-70M320 222h-132"/>';
}

function prion() {
  let coil = 'M52 168';
  for (let i = 0; i < 7; i++) coil += 'c8 -34 26 -34 22 0s-14 34 -2 0';
  return '<path class="art-accent" d="' + coil + '"/><path class="art-faint" d="M192 168h24m-6-6 6 6-6 6"/>'
    + '<path class="art-dot-line" d="M234 128l18 14-18 14 18 14-18 14 18 14M260 128l18 14-18 14 18 14-18 14 18 14M286 128l18 14-18 14 18 14-18 14 18 14M312 128l18 14-18 14 18 14-18 14 18 14"/>'
    + label('PrPᶜ · folded', 52, 104) + label('PrPˢᶜ · misfolded', 234, 104);
}

function triad() {
  return '<circle class="art-line" cx="166" cy="140" r="64"/><circle class="art-accent" cx="234" cy="140" r="64"/><circle class="art-dot-line" cx="200" cy="198" r="64"/>'
    + '<circle class="art-dot" cx="200" cy="160" r="4"/>'
    + label('sickle cell', 104, 64) + label('malaria', 252, 64) + label('neurodegeneration', 200, 290, 'middle');
}

function vision() {
  return '<path class="art-line" d="M60 150c0-22 18-30 58-30h28c26 0 34 10 34 30v20c0 30-20 44-56 44h-8c-38 0-56-22-56-52Z"/>'
    + '<path class="art-line" d="M340 150c0-22-18-30-58-30h-28c-26 0-34 10-34 30v20c0 30 20 44 56 44h8c38 0 56-22 56-52Z"/>'
    + '<path class="art-faint" d="M180 142c12-8 28-8 40 0M60 138 30 126M340 138l30-12"/>'
    + '<rect class="art-accent" x="230" y="138" width="98" height="40" rx="8"/>'
    + '<text x="240" y="154" class="art-small">Reminder · 9:00</text><text x="240" y="169" class="art-title" style="font-size:10px">Morning medicine</text>'
    + '<circle class="art-dot" cx="96" cy="160" r="3.5"/><text x="106" y="163" class="art-small">Home</text>';
}

function dashboard() {
  const bars = [52, 74, 60, 92, 80].map((h, i) => '<rect class="art-faint" x="' + (252 + i * 20) + '" y="' + (250 - h) + '" width="12" height="' + h + '" rx="3"/>').join('');
  return '<rect class="art-line" x="36" y="40" width="328" height="240" rx="14"/><path class="art-faint" d="M36 74h328"/>'
    + '<circle class="art-dot" cx="56" cy="57" r="4"/><circle class="art-fill" cx="72" cy="57" r="4"/><circle class="art-fill" cx="88" cy="57" r="4"/>'
    + '<rect class="art-faint" x="56" y="92" width="86" height="48" rx="8"/><rect class="art-faint" x="156" y="92" width="86" height="48" rx="8"/><rect class="art-accent" x="256" y="92" width="88" height="48" rx="8"/>'
    + label('credits', 66, 112) + label('emissions', 166, 112) + label('forecast', 266, 112)
    + '<path class="art-faint" d="M66 126h40M166 126h52M266 126h44"/>'
    + '<path class="art-faint" d="M56 254h176"/><path class="art-accent" d="M60 240l34-18 30 8 34-30 34 6 36-32"/>' + bars;
}

const diagrams = {helix, care, plastix, prion, triad, vision, dashboard};
// Tighter framing for diagrams that do not fill the full canvas.
const viewBoxes = {prion: '30 70 340 170', triad: '70 40 260 270'};

export function art(name) {
  const draw = diagrams[name];
  if (!draw) throw new Error('Unknown diagram: ' + name);
  return '<svg class="art" viewBox="' + (viewBoxes[name] || '0 0 400 320') + '" role="presentation" aria-hidden="true" focusable="false">' + draw() + '</svg>';
}
