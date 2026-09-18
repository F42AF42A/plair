/* Робот в форме обратной связи.
 *
 * Референс — robot-hero: three.js + react-three-fiber. Реакт и его
 * обвязку сюда тянуть некуда — сайт статический, — поэтому сцена
 * собрана на голом three.js, но робот тот же: скруглённый корпус,
 * тёмный экран вместо лица, светящиеся глаза, антенна, индикатор на
 * груди. Параметры взяты из демо компонента (color #c4c4c4,
 * pantallaColor, pantallaBrillo, blinkCycle 3.0, metalness 0) и
 * переведены в наши цвета: свечение — зелёный акцент бренда.
 *
 * Модуль грузится лениво, при первом открытии формы: на остальных
 * страницах three.js не скачивается вовсе.
 */
import * as THREE from '/assets/three.module.min.js?v=10';
import { RoundedBoxGeometry } from '/assets/RoundedBoxGeometry.js?v=10';

const ACCENT = 0x34c759;      // наш зелёный вместо #00ffc6
const SHELL  = 0xc4c4c4;      // цвет корпуса из демо
const JOINT  = 0x8e968e;
const GLOW   = 1.2;           // pantallaBrillo
const BLINK  = 3.0;           // blinkCycle, с

export function mount(host) {
  if (!host || host.dataset.on === '1') return;
  host.dataset.on = '1';

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearAlpha(0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const canvas = renderer.domElement;
  canvas.className = 'bot-canvas';
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.72, 44);

  // Свет держим нейтральным: зелёный в сцене — только свой, из глаз,
  // антенны и индикатора. Иначе корпус зеленеет целиком и робот
  // перестаёт читаться как металл.
  scene.add(new THREE.AmbientLight(0xffffff, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3.1); key.position.set(3, 5, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe6df, 1.1); fill.position.set(-5, 1, 2); scene.add(fill);
  const rim = new THREE.DirectionalLight(ACCENT, .5);    rim.position.set(-3, 1.5, -4); scene.add(rim);
  const spill = new THREE.PointLight(ACCENT, 1.4, 3.2, 2); spill.position.set(0, .4, 1.3); scene.add(spill);

  const shell = new THREE.MeshStandardMaterial({ color: SHELL, roughness: .42, metalness: 0 });
  const joint = new THREE.MeshStandardMaterial({ color: JOINT, roughness: .55, metalness: 0 });
  const face  = new THREE.MeshStandardMaterial({ color: 0x0a0c0a, roughness: .25, metalness: 0 });
  const lit   = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: GLOW, roughness: .3 });

  const box = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);

  /* ── сборка ─────────────────────────────────────────────── */
  const robot = new THREE.Group();
  const upper = new THREE.Group();          // всё, что качается при ходьбе
  robot.add(upper);

  const head = new THREE.Group();
  head.position.y = 1.02;
  head.add(box(1.72, 1.34, 1.12, .34, shell));

  const screen = box(1.28, .86, .1, .2, face);
  screen.position.set(0, .04, .58);
  head.add(screen);

  const eyes = new THREE.Group();
  const eye = r => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(.11, .1, 4, 12), lit); m.position.set(r, 0, .06); return m; };
  const eyeL = eye(-.29), eyeR = eye(.29);
  eyes.add(eyeL, eyeR);
  eyes.position.copy(screen.position);
  head.add(eyes);

  const ear = s => { const m = box(.16, .42, .42, .08, joint); m.position.set(s * .93, -.05, 0); return m; };
  head.add(ear(-1), ear(1));

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .5, 8), joint);
  rod.position.y = .89; head.add(rod);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 12), lit);
  tip.position.y = 1.16; head.add(tip);
  upper.add(head);

  const torso = box(1.32, 1.26, .92, .3, shell);
  torso.position.y = -.28;
  upper.add(torso);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.15, 16, 12), lit);
  core.position.set(0, -.22, .49);
  upper.add(core);

  const arm = s => {
    const g = new THREE.Group();
    const a = new THREE.Mesh(new THREE.CapsuleGeometry(.15, .62, 4, 12), joint);
    a.position.y = -.42;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(.19, 16, 12), shell);
    hand.position.y = -.82;
    g.add(a, hand);
    g.position.set(s * .83, .08, 0);
    return g;
  };
  const armL = arm(-1), armR = arm(1);
  upper.add(armL, armR);

  const leg = s => {
    const g = new THREE.Group();
    const l = new THREE.Mesh(new THREE.CapsuleGeometry(.17, .5, 4, 12), joint);
    l.position.y = -.36;
    const foot = box(.44, .2, .58, .09, shell);
    foot.position.set(0, -.72, .1);
    g.add(l, foot);
    g.position.set(s * .33, -.86, 0);
    return g;
  };
  const legL = leg(-1), legR = leg(1);
  robot.add(legL, legR);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(.95, 24),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .34 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.66;
  robot.add(shadow);

  scene.add(robot);

  /* ── реакция на курсор ──────────────────────────────────── */
  // Курсор живёт в координатах страницы; робот переводит его в свою
  // сцену и поворачивает к нему голову, корпус и взгляд. Когда
  // указатель рядом — идёт к нему, когда далеко — гуляет сам.
  const P = { x: 0, y: 0, has: false };
  const onMove = e => { P.x = e.clientX; P.y = e.clientY; P.has = true; };
  const onLeave = () => { P.has = false; };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onMove, { passive: true });
  addEventListener('pointerleave', onLeave, { passive: true });

  let W = 0, H = 0, span = 0, unit = 0;
  const fit = () => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    W = r.width; H = r.height;
    renderer.setSize(W, H, false);
    // Камера смотрит на полосу целиком: по горизонтали видно столько
    // сцены, сколько пикселей в полосе. Запас по высоте нарочно больше
    // роста робота — он стоит в нижней части кадра, и антенна не лезет
    // к нижнему краю поля «О проекте».
    //
    // Камера стоит далеко, а угол узкий. Полоса шире своей высоты раз в
    // пять, и с близкой камерой горизонтальный угол доходил до ста
    // градусов: у краёв робота растягивало, как в широкоугольник. На
    // сорока четырёх единицах угол падает до сорока, перспектива почти
    // параллельная, и в любом месте полосы робот одинаковой ширины.
    const worldH = 5.75;
    camera.fov = 2 * Math.atan(worldH / 2 / camera.position.z) * 180 / Math.PI;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    unit = worldH / H;                      // мир на пиксель
    // Разворот делаем с запасом от края: у робота руки шире корпуса, и,
    // упираясь в самую кромку кадра, он обрезался бы по плечо.
    span = Math.max(0, (W * unit) / 2 - 1.6);
    return true;
  };
  fit();
  const ro = new ResizeObserver(fit); ro.observe(host);

  /* ── жизнь ──────────────────────────────────────────────── */
  let x = 0, dir = 1, facing = 1, walk = 0, t = 0, blink = 0, wake = 0;
  let raf = 0, last = performance.now();

  const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.pow(1 - k, dt));

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!W && !fit()) return;
    t += dt;

    const r = host.getBoundingClientRect();
    const cy = r.top + r.height / 2;
    // Цель в координатах сцены.
    let tx = 0, ty = 0, near = false;
    if (P.has) {
      tx = (P.x - (r.left + r.width / 2)) * unit;
      ty = (cy - P.y) * unit;
      near = P.y > r.top - 220 && P.y < r.bottom + 220 && P.x > r.left - 260 && P.x < r.right + 260;
    }

    // Ходьба: к курсору, если он рядом, иначе из края в край.
    let speed = 0;
    if (!still) {
      const goal = near ? Math.max(-span, Math.min(span, tx)) : null;
      if (goal !== null) {
        const d = goal - x;
        if (Math.abs(d) > .16) { const v = Math.sign(d) * Math.min(Math.max(1.5, span * .28), Math.abs(d) * 1.8); x += v * dt; speed = Math.abs(v); dir = Math.sign(d); }
      } else {
        const cruise = Math.max(.72, span * .12); x += dir * cruise * dt; speed = cruise;
        if (x > span) { x = span; dir = -1; }
        if (x < -span) { x = -span; dir = 1; }
      }
      if (span <= 0) { x = 0; speed = 0; }
    }
    facing = damp(facing, speed > .05 ? dir : facing, .12, dt * 60);

    robot.position.x = x;
    walk += speed * dt * 7.6;
    const swing = speed > .05 ? Math.sin(walk) : 0;
    const amp = Math.min(1, speed / .8);
    legL.rotation.x = swing * .55 * amp;
    legR.rotation.x = -swing * .55 * amp;
    armL.rotation.x = -swing * .42 * amp;
    armR.rotation.x = swing * .42 * amp;
    upper.position.y = Math.abs(Math.sin(walk)) * .06 * amp + Math.sin(t * 1.9) * .025;
    upper.rotation.z = -swing * .04 * amp;

    // Корпус разворачивается по ходу, голова и взгляд — за курсором.
    const lean = facing * .34;
    robot.rotation.y = damp(robot.rotation.y, lean, .1, dt * 60);

    let yaw = 0, pitch = 0, gaze = 0;
    if (P.has) {
      const dx = tx - x, dy = ty - .8;
      yaw = Math.max(-.62, Math.min(.62, Math.atan2(dx, 4.2)));
      pitch = Math.max(-.42, Math.min(.42, -Math.atan2(dy, 3.4)));
      gaze = Math.max(-1, Math.min(1, dx / 2.6));
    }
    head.rotation.y = damp(head.rotation.y, yaw - robot.rotation.y, .14, dt * 60);
    head.rotation.x = damp(head.rotation.x, pitch, .14, dt * 60);
    eyes.position.x = damp(eyes.position.x, gaze * .07, .12, dt * 60);
    eyes.position.y = damp(eyes.position.y, screen.position.y - pitch * .1, .12, dt * 60);

    // Моргание: цикл 3 c, плюс «удивление» — глаза шире, когда курсор
    // только что вошёл в зону.
    wake = damp(wake, near ? 1 : 0, .06, dt * 60);
    blink += dt;
    if (blink > BLINK) blink -= BLINK;
    const shut = blink > BLINK - .13 ? Math.max(.06, Math.abs(blink - (BLINK - .065)) / .065) : 1;
    const open = (1 + wake * .22) * shut;
    eyeL.scale.y = eyeR.scale.y = open;
    lit.emissiveIntensity = GLOW * (.85 + wake * .5 + Math.sin(t * 3.1) * .06);

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  // Сцена не крутится впустую: пока диалог закрыт или вкладка в фоне,
  // кадры не считаются.
  const io = new IntersectionObserver(es => {
    const on = es[0].isIntersecting && !document.hidden;
    if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  });
  io.observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    else if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
}
