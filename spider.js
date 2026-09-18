/* Паук, который ходит за курсором.
 *
 * Тело тянется к указателю с задержкой, восемь ног работают
 * попарно-накрест: нога не скользит, а стоит на месте, пока её не
 * растянет, — тогда она переставляется вперёд с упреждением. Отсюда
 * походка: ноги не анимированы по таймеру, они реагируют на движение
 * тела, и паук сам собой семенит быстрее, когда курсор убегает.
 *
 * Цвет — наш зелёный; на тач-экранах и при «уменьшить движение»
 * эффект не включается вовсе.
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
  const LEGS = 8;
  let W = 0, H = 0, dpr = 1;

  const fit = () => {
    const r = host.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  new ResizeObserver(fit).observe(host);

  // Тело и его «вчерашнее» положение — из разницы получается курс.
  const body = { x: W / 2, y: H / 2, px: W / 2, py: H / 2, a: 0 };
  const target = { x: W / 2, y: H / 2, has: false };
  let idle = 0;

  // Ноги: своя точка опоры, своя цель, свой подъём в прыжке.
  const legs = Array.from({ length: LEGS }, (_, i) => {
    const side = i < LEGS / 2 ? -1 : 1;
    const k = i % (LEGS / 2);
    return {
      side,
      // Куда нога тянется относительно тела: угол и вынос.
      ang: side * (0.42 + k * 0.6),
      reach: 86 - Math.abs(k - 1.5) * 8,
      fx: body.x, fy: body.y,     // где стопа стоит
      tx: body.x, ty: body.y,     // куда шагает
      t: 1,                       // 0..1 — фаза шага
      // Соседние ноги ходят в противофазе, как у настоящего паука.
      group: (i + (side > 0 ? 1 : 0)) % 2
    };
  });

  const onMove = (e) => {
    const r = host.getBoundingClientRect();
    target.x = e.clientX - r.left;
    target.y = e.clientY - r.top;
    target.has = true;
    idle = 0;
  };
  addEventListener('pointermove', onMove, { passive: true });

  const lerp = (a, b, k) => a + (b - a) * k;

  let t = 0, raf = 0, last = performance.now();

  function step(now) {
    raf = requestAnimationFrame(step);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    t += dt; idle += dt;
    if (!W) { fit(); return; }

    // Без курсора паук не замирает столбом — гуляет сам по себе.
    if (!target.has || idle > 2.4) {
      target.x = W * (.5 + .34 * Math.sin(t * .31) * Math.cos(t * .17));
      target.y = H * (.5 + .3 * Math.sin(t * .23 + 1.1));
    }

    body.px = body.x; body.py = body.y;
    // Паук держится чуть позади курсора и не лезет ему под остриё.
    const dx = target.x - body.x, dy = target.y - body.y;
    const dist = Math.hypot(dx, dy) || 1;
    const stop = 52;
    const pull = dist > stop ? Math.min(1, (dist - stop) / 180) : 0;
    body.x += (dx / dist) * pull * 420 * dt;
    body.y += (dy / dist) * pull * 420 * dt;

    const vx = body.x - body.px, vy = body.y - body.py;
    const moving = Math.hypot(vx, vy) / Math.max(dt, .001);
    if (moving > 6) body.a = Math.atan2(dy, dx);

    const cos = Math.cos(body.a), sin = Math.sin(body.a);
    const lead = Math.min(moving * .09, 34);

    ctx.clearRect(0, 0, W, H);

    // ── ноги ─────────────────────────────────────────────────
    ctx.lineCap = 'round';
    for (let i = 0; i < LEGS; i++) {
      const leg = legs[i];
      const a = body.a + leg.ang;
      const hx = body.x + cos * 3, hy = body.y + sin * 3;         // плечо
      const rx = hx + Math.cos(a) * leg.reach + (vx / Math.max(dt, .001)) * 0;
      const ry = hy + Math.sin(a) * leg.reach;
      // Куда нога хотела бы стоять с учётом хода вперёд.
      const wx = rx + cos * lead, wy = ry + sin * lead;

      const stretched = Math.hypot(leg.fx - rx, leg.fy - ry) > leg.reach * .62;
      const turn = (Math.floor(t * 2.4) + leg.group) % 2 === 0;
      if (leg.t >= 1 && stretched && (turn || moving < 4)) {
        leg.tx = wx; leg.ty = wy; leg.t = 0;
      }
      if (leg.t < 1) {
        leg.t = Math.min(1, leg.t + dt * (6 + moving * .03));
        const k = leg.t;
        leg.fx = lerp(leg.fx, leg.tx, k * .35 + .08);
        leg.fy = lerp(leg.fy, leg.ty, k * .35 + .08);
      }
      const lift = leg.t < 1 ? Math.sin(leg.t * Math.PI) * 16 : 0;

      // Колено: середина между плечом и стопой, отжатая наружу и вверх.
      const mx = (hx + leg.fx) / 2, my = (hy + leg.fy) / 2;
      const nx = Math.cos(a) * 20, ny = Math.sin(a) * 20;
      const kx = mx + nx, ky = my + ny - 26 - lift;

      ctx.strokeStyle = `rgba(${ACCENT},.55)`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.quadraticCurveTo(kx, ky, leg.fx, leg.fy - lift);
      ctx.stroke();

      ctx.fillStyle = `rgba(${ACCENT},.45)`;
      ctx.beginPath();
      ctx.arc(leg.fx, leg.fy - lift, 2.4, 0, 7);
      ctx.fill();
    }

    // ── тело ─────────────────────────────────────────────────
    const glow = ctx.createRadialGradient(body.x, body.y, 0, body.x, body.y, 46);
    glow.addColorStop(0, `rgba(${ACCENT},.15)`);
    glow.addColorStop(1, `rgba(${ACCENT},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(body.x, body.y, 46, 0, 7); ctx.fill();

    ctx.save();
    ctx.translate(body.x, body.y);
    ctx.rotate(body.a);
    ctx.fillStyle = `rgba(${ACCENT},.92)`;
    ctx.beginPath(); ctx.ellipse(-11, 0, 16, 12, 0, 0, 7); ctx.fill();  // брюшко
    ctx.fillStyle = `rgba(${ACCENT},1)`;
    ctx.beginPath(); ctx.ellipse(7, 0, 9.5, 7.5, 0, 0, 7); ctx.fill();  // головогрудь
    ctx.fillStyle = 'rgba(8,16,10,.9)';
    ctx.beginPath(); ctx.arc(11, -3, 1.7, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(11, 3, 1.7, 0, 7); ctx.fill();
    ctx.restore();

    // Нить к курсору — паук как будто спускается за ним.
    if (target.has && idle < 2.4) {
      ctx.strokeStyle = `rgba(${ACCENT},.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(body.x, body.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    }
  }
  raf = requestAnimationFrame(step);

  // Ушли со страницы или блок уехал из вида — кадры не считаем.
  const io = new IntersectionObserver((es) => {
    const on = es[0].isIntersecting && !document.hidden;
    if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, W, H); }
  });
  io.observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    else if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(step); }
  });
}
