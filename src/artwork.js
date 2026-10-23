// Procedural hero artwork: a luminous cell and a bedside-monitor ECG trace.
// Plain canvas 2D, no WebGL. Both pause offscreen, when the tab is hidden, and when motion is off.
const TAU = Math.PI * 2;
const BPM = 72;
const BEAT = 60 / BPM;

function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
const gauss = (x, centre, width) => Math.exp(-((x - centre) ** 2) / (2 * width * width));

// One heartbeat as a sum of gaussians: P wave, QRS complex, T wave.
export function ecgWave(phase) {
  return .1 * gauss(phase, .16, .025)
    - .13 * gauss(phase, .335, .008)
    + 1 * gauss(phase, .36, .011)
    - .28 * gauss(phase, .385, .011)
    + .24 * gauss(phase, .6, .045);
}
// A soft "lub-dub" envelope used to make the cell breathe in time with the monitor.
function pulse(time) {
  const phase = (time % BEAT) / BEAT;
  return gauss(phase, .37, .05) + .45 * gauss(phase, .52, .05);
}

function loop(canvas, draw, {paused}) {
  let frame = 0, previous = 0, time = 0, isPaused = paused, inView = true;
  function tick(timestamp) {
    if (isPaused || !inView || document.hidden) {frame = 0;previous = 0;return;}
    const delta = previous ? Math.min(timestamp - previous, 64) / 1000 : 0;
    previous = timestamp;
    time += delta;
    draw(time, delta);
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (!frame && !isPaused && inView && !document.hidden) frame = requestAnimationFrame(tick);
  }
  new IntersectionObserver(entries => {inView = entries[0].isIntersecting;resume();}, {rootMargin: '60px'}).observe(canvas);
  document.addEventListener('visibilitychange', resume);
  return {
    resume,
    redraw() {if (!frame) draw(time, 0);},
    setPaused(value) {
      isPaused = value;
      if (value) {cancelAnimationFrame(frame);frame = 0;previous = 0;draw(time, 0);} else resume();
    },
  };
}

function fitCanvas(canvas, context) {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(bounds.width * ratio));
  canvas.height = Math.max(1, Math.round(bounds.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return bounds;
}

export function createHeroCell(canvas, {paused = false, pointerArea = canvas} = {}) {
  const context = canvas.getContext('2d');
  if (!context) return {setPaused() {}};
  const random = seeded(29);
  const compact = matchMedia('(max-width: 700px)').matches;
  const membrane = [], nucleus = [], cytoplasm = [];
  // Membrane: a Fibonacci sphere, gently deformed so it reads as living tissue rather than a ball.
  const count = compact ? 1100 : 2200;
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = i * 2.399963229728653;
    const x = Math.cos(theta) * ring, z = Math.sin(theta) * ring;
    const wobble = 1 + .06 * Math.sin(theta * 3 + y * 4) + .035 * Math.cos(y * 9 + theta);
    membrane.push({x: x * wobble, y: y * wobble * .96, z: z * wobble, size: .7 + random() * .9});
  }
  for (let i = 0; i < (compact ? 260 : 480); i++) {
    const u = random() * 2 - 1, theta = random() * TAU, radius = Math.cbrt(random()) * .3;
    const side = Math.sqrt(1 - u * u);
    nucleus.push({x: side * Math.cos(theta) * radius + .06, y: u * radius - .04, z: side * Math.sin(theta) * radius, size: .6 + random() * 1.1});
  }
  for (let i = 0; i < (compact ? 90 : 170); i++) {
    const u = random() * 2 - 1, theta = random() * TAU, radius = .45 + random() * .42;
    const side = Math.sqrt(1 - u * u);
    cytoplasm.push({x: side * Math.cos(theta) * radius, y: u * radius, z: side * Math.sin(theta) * radius, size: 1 + random() * 1.8, drift: random() * TAU});
  }

  let width = 0, height = 0, base = 1, centreX = 0, centreY = 0;
  let pointer = {x: -9999, y: -9999, active: false}, tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
  const buckets = Array.from({length: 7}, () => []);

  function project(vertex, angle, tilt, radius, cx, cy) {
    const x = vertex.x * Math.cos(angle) + vertex.z * Math.sin(angle);
    const z1 = -vertex.x * Math.sin(angle) + vertex.z * Math.cos(angle);
    const y = vertex.y * Math.cos(tilt) - z1 * Math.sin(tilt);
    const z = vertex.y * Math.sin(tilt) + z1 * Math.cos(tilt);
    return [cx + x * radius, cy + y * radius, z];
  }
  function repel(px, py, radius) {
    if (!pointer.active) return [px, py];
    const dx = px - pointer.x, dy = py - pointer.y;
    const distance = Math.hypot(dx, dy);
    const reach = radius * .55;
    if (distance > reach || distance < .001) return [px, py];
    const force = (1 - distance / reach) ** 2 * radius * .16;
    return [px + dx / distance * force, py + dy / distance * force];
  }
  function draw(time) {
    context.clearRect(0, 0, width, height);
    tiltX += (targetX - tiltX) * .05;
    tiltY += (targetY - tiltY) * .05;
    const beat = pulse(time);
    const radius = base * (1 + beat * .022);
    const cx = centreX + tiltX * 18;
    const cy = centreY + tiltY * 14;
    const angle = time * .12 + tiltX * .5;
    const tilt = .32 + tiltY * .35 + Math.sin(time * .2) * .05;

    // Aura and orbit rings: a nod to scientific plates and imaging overlays.
    const aura = context.createRadialGradient(cx, cy, radius * .2, cx, cy, radius * 1.5);
    aura.addColorStop(0, 'rgba(126,227,183,' + (.1 + beat * .05) + ')');
    aura.addColorStop(.55, 'rgba(126,227,183,.035)');
    aura.addColorStop(1, 'rgba(126,227,183,0)');
    context.fillStyle = aura;
    context.fillRect(cx - radius * 1.6, cy - radius * 1.6, radius * 3.2, radius * 3.2);
    // A faint rim of light gives the membrane a surface, so the dots read as a sphere.
    const rim = context.createRadialGradient(cx, cy, radius * .7, cx, cy, radius * 1.04);
    rim.addColorStop(0, 'rgba(126,227,183,0)');
    rim.addColorStop(.82, 'rgba(126,227,183,.05)');
    rim.addColorStop(.95, 'rgba(160,240,205,.13)');
    rim.addColorStop(1, 'rgba(126,227,183,0)');
    context.fillStyle = rim;
    context.beginPath();context.arc(cx, cy, radius * 1.04, 0, TAU);context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(214,232,222,.08)';
    context.beginPath();context.ellipse(cx, cy, radius * 1.32, radius * .38, -.38 + Math.sin(time * .1) * .04, 0, TAU);context.stroke();
    context.beginPath();context.arc(cx, cy, radius * 1.18, 0, TAU);context.setLineDash([2, 7]);context.stroke();context.setLineDash([]);
    context.strokeStyle = 'rgba(214,232,222,.14)';
    for (let i = 0; i < 4; i++) {
      const a = i * TAU / 4 + time * .03;
      const inner = radius * 1.14, outer = radius * 1.22;
      context.beginPath();context.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);context.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);context.stroke();
    }

    for (const bucket of buckets) bucket.length = 0;
    for (const vertex of membrane) {
      const [x0, y0, z] = project(vertex, angle, tilt, radius, cx, cy);
      const [x, y] = repel(x0, y0, radius);
      const level = Math.max(0, Math.min(6, Math.round((z + 1) * 3)));
      buckets[level].push(x, y, vertex.size * (z > 0 ? 1.3 : .85));
    }
    context.globalCompositeOperation = 'lighter';
    buckets.forEach((bucket, level) => {
      if (!bucket.length) return;
      context.fillStyle = 'rgba(190,240,215,' + (.07 + level * .1) + ')';
      context.beginPath();
      for (let i = 0; i < bucket.length; i += 3) context.rect(bucket[i], bucket[i + 1], bucket[i + 2], bucket[i + 2]);
      context.fill();
    });
    // Cytoplasm: slow, drifting organelles.
    context.fillStyle = 'rgba(126,227,183,.32)';
    context.beginPath();
    for (const vertex of cytoplasm) {
      const wander = {x: vertex.x + Math.sin(time * .4 + vertex.drift) * .03, y: vertex.y + Math.cos(time * .3 + vertex.drift) * .03, z: vertex.z};
      const [x0, y0, z] = project(wander, angle * .6, tilt, radius, cx, cy);
      const [x, y] = repel(x0, y0, radius);
      const size = vertex.size * (z > 0 ? 1 : .6);
      context.moveTo(x + size, y);context.arc(x, y, size, 0, TAU);
    }
    context.fill();
    // Nucleus: a denser, warmer core that swells slightly on each beat.
    const glow = context.createRadialGradient(cx + radius * .06, cy - radius * .04, 0, cx, cy, radius * .42);
    glow.addColorStop(0, 'rgba(255,214,190,' + (.2 + beat * .12) + ')');
    glow.addColorStop(.6, 'rgba(232,110,80,.07)');
    glow.addColorStop(1, 'rgba(232,110,80,0)');
    context.fillStyle = glow;
    context.beginPath();context.arc(cx, cy, radius * .44, 0, TAU);context.fill();
    context.fillStyle = 'rgba(255,196,170,.5)';
    context.beginPath();
    for (const vertex of nucleus) {
      const [x0, y0, z] = project(vertex, -angle * .8, tilt, radius * (1 + beat * .05), cx, cy);
      const [x, y] = repel(x0, y0, radius);
      const size = vertex.size * (.55 + (z + .3) * .6);
      context.rect(x, y, size, size);
    }
    context.fill();
    context.globalCompositeOperation = 'source-over';
  }

  const runner = loop(canvas, draw, {paused});
  function resize() {
    const bounds = fitCanvas(canvas, context);
    width = bounds.width;height = bounds.height;
    base = compact ? Math.min(width * .4, height * .27) : Math.min(width * .25, height * .31);
    centreX = width * .5;
    centreY = height * (compact ? .57 : .46);
    // Publish the geometry so HTML annotations can point at the cell.
    pointerArea.style.setProperty('--cell-x', centreX + 'px');
    pointerArea.style.setProperty('--cell-y', centreY + 'px');
    pointerArea.style.setProperty('--cell-r', base + 'px');
    runner.redraw();
  }
  new ResizeObserver(resize).observe(canvas);
  pointerArea.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    pointer = {x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true};
    targetX = pointer.x / bounds.width - .5;
    targetY = pointer.y / bounds.height - .5;
  }, {passive: true});
  pointerArea.addEventListener('pointerleave', () => {pointer.active = false;targetX = 0;targetY = 0;});
  resize();runner.resume();
  return {setPaused: runner.setPaused};
}

// A sweeping monitor trace: new signal is written at the cursor, with a small gap erasing the old sweep.
export function createMonitor(canvas, {paused = false, onBeat} = {}) {
  const context = canvas.getContext('2d');
  if (!context) return {setPaused() {}};
  let width = 0, height = 0, values = new Float32Array(1), cursor = 0, lastBeat = -1;
  const speed = 150;
  const sample = time => ecgWave((time % BEAT) / BEAT) + Math.sin(time * 1.7) * .015;
  function fill(time) {
    for (let x = 0; x < values.length; x++) values[x] = sample(time - (values.length - x) / speed);
  }
  function draw(time, delta) {
    const beatIndex = Math.floor((time + BEAT * .64) / BEAT);
    if (beatIndex !== lastBeat) {lastBeat = beatIndex;if (delta) onBeat?.();}
    const steps = Math.max(0, Math.round(delta * speed));
    for (let i = 0; i < steps; i++) {
      cursor = (cursor + 1) % values.length;
      values[cursor] = sample(time - (steps - i - 1) / speed);
    }
    context.clearRect(0, 0, width, height);
    const mid = height * .62, amplitude = height * .5, gap = 26;
    context.lineWidth = 1.4;
    context.lineJoin = 'round';
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(126,227,183,.0)');
    gradient.addColorStop(.12, 'rgba(126,227,183,.7)');
    gradient.addColorStop(1, 'rgba(126,227,183,.7)');
    context.strokeStyle = gradient;
    context.beginPath();
    let drawing = false;
    for (let x = 0; x < values.length; x++) {
      const ahead = (x - cursor + values.length) % values.length;
      if (ahead > 0 && ahead < gap) {drawing = false;continue;}
      const y = mid - values[x] * amplitude;
      if (!drawing) {context.moveTo(x, y);drawing = true;} else context.lineTo(x, y);
    }
    context.stroke();
    const headY = mid - values[cursor] * amplitude;
    context.fillStyle = 'rgba(214,255,236,.95)';
    context.shadowColor = 'rgba(126,227,183,.9)';
    context.shadowBlur = 12;
    context.beginPath();context.arc(cursor, headY, 2.2, 0, TAU);context.fill();
    context.shadowBlur = 0;
  }
  const runner = loop(canvas, draw, {paused});
  function resize() {
    const bounds = fitCanvas(canvas, context);
    width = bounds.width;height = bounds.height;
    values = new Float32Array(Math.max(1, Math.round(width)));
    cursor = values.length - 1;
    fill(0);
    runner.redraw();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();runner.resume();
  return {setPaused: runner.setPaused};
}
