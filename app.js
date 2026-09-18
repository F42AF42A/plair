(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const cases = (window.PLAIR_CASES || []).filter(item => Array.isArray(item.media) && item.media.length);
  const config = window.PLAIR_CONFIG || {};
  const dialog = $('contact-dialog');
  const form = $('contact-form');
  const status = $('form-status');
  const submit = $('contact-submit');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const intro = $('intro-splash');
  if (intro) {
    try {
      if (reduceMotion.matches || sessionStorage.getItem('plairIntroSeen')) {
        intro.classList.add('skip');
      } else {
        sessionStorage.setItem('plairIntroSeen', '1');
        intro.addEventListener('click', () => intro.classList.add('skip'));
        intro.addEventListener('animationend', (event) => {
          if (event.animationName === 'intro-logo-dive') intro.remove();
        });
        setTimeout(() => intro.remove(), 1500);
        requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('intro-play')));
      }
    } catch { intro.classList.add('skip'); }
  }

  const safeMedia = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:', 'file:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const esc = (value) => String(value == null ? '' : value)
    .replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');

  // Узкие копии лежат рядом с оригиналом: имя-800.webp, имя-1400.webp.
  // Кадр подписывается на них, объявив свою натуральную ширину в `w`.
  const VARIANT_WIDTHS = [800, 1400];
  const srcsetFor = (item) => {
    const width = Number(item.w) || 0;
    if (!width || !safeMedia(item.src) || !/\.webp$/i.test(item.src)) return '';
    const base = item.src.replace(/\.webp$/i, '');
    const parts = VARIANT_WIDTHS.filter((w) => w < width).map((w) => `${base}-${w}.webp ${w}w`);
    if (!parts.length) return '';
    parts.push(`${item.src} ${width}w`);
    return parts.join(', ');
  };

  const ratio = (item) => {
    const w = Number(item.w) || 0, h = Number(item.h) || 0;
    return w > 0 && h > 0 ? w / h : 16 / 9;   // без размеров считаем кадр широким
  };

  /* Раскладка кадров идёт от пропорций, а не от их числа. flex-grow, равный
     пропорции, даёт всем кадрам ряда одну высоту, а ширину — свою, поэтому
     обрезать нечего в принципе. `cap` ограничивает высоту ряда: вертикальной
     паре запаса нужно больше, иначе два узких кадра съёживаются до марок,
     а широкому кадру сверху приходится уступить им место. */
  function rowsFor(media, narrow) {
    const isTall = (item) => ratio(item) < 1.2;
    const head = media.slice(0, 1), rest = media.slice(1);
    if (!rest.length) return [{ items: head, cap: isTall(media[0]) ? 460 : 420 }];
    if (!narrow && media.every(isTall)) return [{ items: media, cap: 430 }];
    if (narrow && media.every((m) => !isTall(m))) return media.map((m) => ({ items: [m], cap: 320 }));
    const restTall = rest.every(isTall);
    return [
      { items: head, cap: isTall(media[0]) ? 430 : restTall ? (narrow ? 320 : 300) : (narrow ? 340 : 380) },
      { items: rest, cap: restTall ? (narrow ? 340 : 430) : 300 }
    ];
  }

  function frameHTML(item, entry) {
    const src = safeMedia(item.src);
    if (!src) return '';
    const alt = esc(item.alt || entry.title);
    if (item.type === 'video') {
      return `<figure style="--ar:${ratio(item).toFixed(3)}"><video src="${esc(src)}" poster="${esc(safeMedia(item.poster))}"
        controls playsinline preload="metadata" aria-label="${alt}"></video></figure>`;
    }
    const srcset = srcsetFor(item);
    const dims = Number(item.w) > 0 && Number(item.h) > 0 ? ` width="${item.w}" height="${item.h}"` : '';
    return `<figure style="--ar:${ratio(item).toFixed(3)}"><img src="${esc(src)}" alt="${alt}"${dims}
      ${srcset ? `srcset="${esc(srcset)}" sizes="(max-width: 980px) 92vw, 46vw"` : ''}
      loading="lazy" decoding="async"></figure>`;
  }

  function collageHTML(entry, narrow) {
    const wash = safeMedia(entry.media[0].src);
    const rows = rowsFor(entry.media, narrow).map((row) => {
      const sum = row.items.reduce((acc, item) => acc + ratio(item), 0);
      return `<div class="collage-row" style="--sum:${sum.toFixed(3)};--cap:${row.cap}px">
        ${row.items.map((item) => frameHTML(item, entry)).join('')}</div>`;
    }).join('');
    return `<div class="collage">
      ${wash ? `<img class="collage-wash" src="${esc(wash)}" alt="" aria-hidden="true">` : ''}${rows}</div>`;
  }

  const track = $('cases');
  const narrowQuery = window.matchMedia('(max-width: 980px)');
  const dotsBox = $('case-dots');
  const live = $('case-live');
  let at = 0;

  function renderCases() {
    if (!track || !cases.length) return;
    const narrow = narrowQuery.matches;
    track.innerHTML = cases.map((entry, i) => `
      <section class="case" role="group" aria-roledescription="слайд"
               aria-label="${i + 1} из ${cases.length}: ${esc(entry.title)}">
        <article class="case-card">
          <div class="case-text">
            <h3>${esc(entry.title)}</h3>
            <p class="case-cat">${esc(entry.category)}</p>
            <p class="case-desc">${esc(entry.description)}</p>
            ${entry.note ? `<p class="case-desc">${esc(entry.note)}</p>` : ''}
            <div class="case-nav">
              <span class="case-no">${pad(i + 1)} / ${pad(cases.length)}</span>
              <button class="arrow" type="button" data-step="-1" aria-label="Предыдущий проект"
                      aria-controls="cases"${i === 0 ? ' disabled' : ''}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <button class="arrow" type="button" data-step="1" aria-label="Следующий проект"
                      aria-controls="cases"${i === cases.length - 1 ? ' disabled' : ''}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
          </div>
          <div>${collageHTML(entry, narrow)}</div>
        </article>
      </section>`).join('');

    if (dotsBox && !dotsBox.children.length) {
      dotsBox.innerHTML = cases.map((entry, i) =>
        `<button class="dot" type="button" role="tab" data-go="${i}" aria-selected="${i === 0}"
                 aria-label="Проект ${i + 1}: ${esc(entry.title)}"></button>`).join('');
      dotsBox.addEventListener('click', (event) => {
        const button = event.target.closest('[data-go]');
        if (button) goTo(Number(button.dataset.go));
      });
    }
    watch();
    goTo(at, 'auto');
  }

  function goTo(index, behavior) {
    const slides = track.children;
    if (!slides.length) return;
    at = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[at];
    // Прокручиваем саму ленту, а не страницу: scrollIntoView увёл бы экран вниз.
    // Смещение считаем от самой ленты — offsetLeft отсчитывается от другого
    // предка и промахивается мимо слайда на ширину поля страницы.
    const shift = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + shift - (track.clientWidth - slide.clientWidth) / 2,
                     behavior: behavior || (reduceMotion.matches ? 'auto' : 'smooth') });
    setActive(at);
  }

  function setActive(index) {
    at = index;
    if (dotsBox) Array.from(dotsBox.children).forEach((dot, i) =>
      dot.setAttribute('aria-selected', String(i === index)));
    if (live) live.textContent = `Проект ${index + 1} из ${cases.length}: ${cases[index].title}.`;
  }

  // Активным считаем слайд, который занял больше половины ленты: так индикатор
  // не врёт при перелистывании пальцем, а не кнопкой.
  let observer = null;
  function watch() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          setActive(Array.prototype.indexOf.call(track.children, entry.target));
        }
      });
    }, { root: track, threshold: [0.55, 0.9] });
    Array.from(track.children).forEach((slide) => observer.observe(slide));
  }

  if (track) track.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (button) goTo(at + Number(button.dataset.step));
  });
  if (track) track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { goTo(at - 1); event.preventDefault(); }
    if (event.key === 'ArrowRight') { goTo(at + 1); event.preventDefault(); }
    if (event.key === 'Home') { goTo(0); event.preventDefault(); }
    if (event.key === 'End') { goTo(cases.length - 1); event.preventDefault(); }
  });
  narrowQuery.addEventListener('change', renderCases);
  renderCases();

  const tickerRow = $('ticker-row');
  const ticker = $('ticker');
  const tickerStop = $('ticker-stop');
  if (tickerRow && cases.length) {
    // Дублируем список: анимация сдвигает ленту ровно на половину и замыкается.
    const line = cases.map((entry) => `<span>${esc(entry.title)}</span>`).join('');
    tickerRow.innerHTML = line + line;
  }
  if (ticker && tickerStop) {
    tickerStop.addEventListener('click', () => {
      const paused = ticker.toggleAttribute('data-paused');
      tickerStop.setAttribute('aria-pressed', String(paused));
      tickerStop.setAttribute('aria-label', paused ? 'Запустить бегущую строку' : 'Остановить бегущую строку');
    });
  }

  if (!dialog || !form) return;

  const openers = Array.from(document.querySelectorAll('#contact-open,[data-contact-open]'));
  let lastOpener = null;
  openers.forEach((button) => button.addEventListener('click', () => {
    lastOpener = button;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    // Фокус на кнопку закрытия: иначе на телефоне сразу выезжает клавиатура.
    $('contact-close').focus({ preventScroll: true });
  }));
  $('contact-close').addEventListener('click', () => dialog.close());
  // Клик мимо окна закрывает форму. Сравнивать с рамкой самого dialog нельзя:
  // он растянут на весь экран, и такая проверка не срабатывает никогда.
  dialog.addEventListener('click', (event) => {
    if (!event.target.closest('.contact-inner')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    (lastOpener || openers[0])?.focus({ preventScroll: true });
  });

  // Надпись на кнопке лежит в двух слоях: видимом и подъезжающем при наведении.
  const setSubmitLabel = (text) => {
    const face = submit.querySelector('.f1');
    const hover = submit.querySelector('.f2');
    if (face) face.textContent = text;
    if (hover && hover.firstChild) hover.firstChild.nodeValue = text;
    if (!face) submit.textContent = text;
  };

  let sending = false;
  const endpointReady = (() => {
    try {
      return !!config.formEndpoint && new URL(config.formEndpoint).protocol === 'https:'
        && (config.formService !== 'formsubmit' || config.formActivated === true);
    } catch { return false; }
  })();
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail || '');
  if (!endpointReady && !emailReady) {
    status.textContent = 'Форма пока не принимает заявки.';
    submit.disabled = true;
  } else if (!endpointReady) {
    status.textContent = 'Откроется почтовое приложение с текстом заявки.';
  }

  const contactInput = form.elements.contact;
  contactInput.addEventListener('input', () => {
    contactInput.setCustomValidity('');
    contactInput.removeAttribute('aria-invalid');
    $('contact-error').hidden = true;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || (!endpointReady && !emailReady)) return;
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach((key) => { data[key] = String(data[key]).trim(); });
    if (data._gotcha) return;
    if (!data.name || !data.project) {
      status.textContent = 'Заполните имя и описание проекта.';
      status.className = 'form-status error';
      return;
    }
    const isContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
      || /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(data.contact)
      || /^https:\/\/t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/.test(data.contact);
    if (!isContact) {
      contactInput.setCustomValidity('Укажите email или Telegram в формате @username.');
      contactInput.setAttribute('aria-invalid', 'true');
      $('contact-error').hidden = false;
      contactInput.reportValidity();
      return;
    }
    if (!endpointReady) {
      const body = `Имя: ${data.name}\nКонтакт: ${data.contact}\nПримерный бюджет: ${data.budget || 'Не указан'}\n\nО проекте:\n${data.project}`;
      window.location.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent('Новый проект для PLAIR')}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Заявка подготовлена. Отправьте её из почтового приложения.';
      return;
    }
    sending = true;
    submit.disabled = true;
    setSubmitLabel('Отправляем…');
    status.textContent = '';
    status.className = 'form-status';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const payload = config.formService === 'formsubmit' ? {
        name: data.name,
        contact: data.contact,
        budget: data.budget || 'Не указан',
        message: data.project,
        _subject: 'PLAIR — новая заявка с сайта',
        _template: 'table',
        _honey: data._gotcha || '',
        ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact) ? { email: data.contact } : {})
      } : data;
      const response = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Delivery failed');
      if (config.formService === 'formsubmit') {
        const result = await response.json();
        if (![true, 'true'].includes(result.success)
          || /activat|confirm your email|check your email/i.test(String(result.message || ''))) {
          throw new Error('Submission not accepted');
        }
      }
      status.textContent = 'Спасибо! Заявка отправлена. Скоро свяжемся с вами.';
      status.className = 'form-status success';
      form.reset();
    } catch {
      status.textContent = 'Не удалось отправить заявку. Ваш текст сохранён в форме — попробуйте ещё раз.';
      status.className = 'form-status error';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      setSubmitLabel('Отправить');
    }
  });
})();
