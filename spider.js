/* Существа, которые плывут за курсором на странице «О студии».
 *
 * Референс — spider-cursor: тонкая штриховая графика, густой узел в
 * середине и длинные гнутые щупальца с шариками на концах. Исходник
 * компонента закрыт, поэтому собрано своей физикой, но рисунок тот же.
 *
 * Каждое щупальце — цепочка точек на верле: кончик тянется к своей
 * блуждающей цели, остальные подтягиваются за соседом на постоянную
 * длину. Отсюда живой изгиб: когда тело трогается с места, щупальца
 * отстают и выгибаются сами, без единого ключевого кадра.
 *
 * Их двое, как в референсе: первое идёт за курсором, второе — за
 * первым, с большим запозданием.
 */
export function mount(host) {
  if (!host || host.dataset.on === '1') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  host.dataset.on = '1';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const ACCENT = '52,199,89';
  const ARMS = 9;         // щупалец у каждого
  const LINK = 13;        // точек в щупальце

  let W = 0, H = 0;
  const fit = () => {
    const r = host.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  new ResizeObserver(fit).observe(host);

  const pointer = { x: 0, y: 0, has: false };
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.has = true;
  }, { passive: true });

  const makeBeing = (scale, lag, seed) => {
    const x = innerWidth * .5, y = innerHeight * .5;
    return {
      x, y, vx: 0, vy: 0, head: 0, scale, lag, seed,
      arms: Array.from({ length: ARMS }, (_, i) => {
        const base = (i / (ARMS - 1) - .5) * 2.55;   // веер, а не звезда
        const len = (118 + (i % 4) * 34) * scale;      // разной длины, как в референсе
        return {
          index: i,
          base,
          len,
          rest: len / (LINK - 1),
          phase: seed * 3 + i * 1.7,
          swing: .3 + (i % 4) * .1,
          curl: (i % 2 ? 1 : -1) * (.7 + (i % 3) * .45),
          pts: Array.from({ length: LINK }, (_, k) => ({
            x: x + Math.cos(base) * (k * len / (LINK - 1)),
            y: y + Math.sin(base) * (k * len / (LINK - 1)),
            px: x, py: y
          }))
        };
      })
    };
  };

  const beings = [makeBeing(1, .055, 0), makeBeing(.82, .022, 2.1)];

  let t = 0, raf = 0, last = performance.now();

  function stepArm(being, arm, dt) {
    const pts = arm.pts;
    // Идеальный хребет щупальца: из тела под своим углом, с плавно
    // нарастающим изгибом. Точки тянутся к нему пружиной, а инерция
    // заставляет их отставать — оттого при движении тела щупальца
    // выгибаются назад сами собой.
    let aa = being.head + arm.base + Math.sin(t * .5 + arm.phase) * arm.swing
                      + Math.cos(t * .21 + arm.phase * .6) * .16;
    const curl = (arm.curl + Math.sin(t * .37 + arm.phase) * .5) / (LINK - 1);
    let ax = being.x, ay = being.y;
    const k = Math.min(1, (3.4 + arm.index * .12) * dt);

    pts[0].x = being.x; pts[0].y = being.y;
    for (let i = 1; i < LINK; i++) {
      aa += curl;
      ax += Math.cos(aa) * arm.rest;
      ay += Math.sin(aa) * arm.rest;
      const p = pts[i];
      const vx = (p.x - p.px) * .7, vy = (p.y - p.py) * .7;
      p.px = p.x; p.py = p.y;
      p.x += vx + (ax - p.x) * k;
      p.y += vy + (ay - p.y) * k;
    }

    // Звенья держат длину, иначе щупальце то растягивает, то комкает.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < LINK; i++) {
        const a = pts[i - 1], p = pts[i];
        const dx = p.x - a.x, dy = p.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - arm.rest) / d;
        p.x -= dx * f; p.y -= dy * f;
      }
    }
  }

  function drawArm(arm, scale) {
    const pts = arm.pts;
    // Ведём по серединам звеньев — линия выходит гладкой, без изломов.
    for (let i = 1; i < LINK - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const k = i / (LINK - 1);
      ctx.lineWidth = (2.6 - k * 1.7) * scale;
      ctx.strokeStyle = `rgba(${ACCENT},${.8 - k * .16})`;
      ctx.beginPath();
      ctx.moveTo((pts[i - 1].x + a.x) / 2, (pts[i - 1].y + a.y) / 2);
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.stroke();
    }
    const tip = pts[LINK - 1], before = pts[LINK - 2];
    ctx.lineWidth = .95 * scale;
    ctx.beginPath();
    ctx.moveTo((before.x + pts[LINK - 3].x) / 2, (before.y + pts[LINK - 3].y) / 2);
    ctx.quadraticCurveTo(before.x, before.y, tip.x, tip.y);
    ctx.stroke();
    // Шарик на конце — то, по чему существо и узнаётся.
    ctx.fillStyle = `rgba(${ACCENT},.92)`;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4 * scale, 0, 7);
    ctx.fill();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    t += dt;
    if (!W) { fit(); return; }

    // Без курсора существа не висят на месте — тихо дрейфуют.
    const drift = {
      x: W * (.5 + .3 * Math.sin(t * .17) * Math.cos(t * .11)),
      y: H * (.45 + .26 * Math.sin(t * .13 + 1.4))
    };
    const lead = pointer.has ? pointer : drift;

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    beings.forEach((being, i) => {
      // Первое идёт за курсором, второе — за первым, чуть в стороне.
      const tx = i === 0 ? lead.x : beings[0].x - 96;
      const ty = i === 0 ? lead.y : beings[0].y + 128;
      being.vx += (tx - being.x) * being.lag;
      being.vy += (ty - being.y) * being.lag;
      being.vx *= .9; being.vy *= .9;
      being.x += being.vx; being.y += being.vy;

      // Щупальца растут веером назад, поэтому существо разворачивается
      // хвостом по ходу: куда плывёт, туда и смотрит узел.
      const sp = Math.hypot(being.vx, being.vy);
      if (sp > .35) {
        const want = Math.atan2(being.vy, being.vx) + Math.PI;
        let d = (want - being.head + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        being.head += d * Math.min(1, 2.2 * dt);
      }

      being.arms.forEach((arm) => stepArm(being, arm, dt));
      being.arms.forEach((arm) => drawArm(arm, being.scale));
    });
  }
  raf = requestAnimationFrame(frame);

  const io = new IntersectionObserver((es) => {
    const on = es[0].isIntersecting && !document.hidden;
    if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, W, H); }
  });
  io.observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    else if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
}
