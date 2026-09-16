(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const cases = (window.PLAIR_CASES || []).filter(item => Array.isArray(item.media) && item.media.length);
  const config = window.PLAIR_CONFIG || {};
  const stage = $('media-stage');
  const dialog = $('contact-dialog');
  const form = $('contact-form');
  const status = $('form-status');
  const submit = $('contact-submit');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let caseIndex = 0;
  let frameIndex = 0;
  let touchStart = null;
  let sending = false;
  const pad = (number) => String(number).padStart(2, '0');
  const safeMedia = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:', 'file:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  function showMedia(index) {
    const entry = cases[caseIndex];
    if (!entry) return;
    frameIndex = (index + entry.media.length) % entry.media.length;
    const item = entry.media[frameIndex];
    const oldVideo = stage.querySelector('video');
    if (oldVideo) oldVideo.pause();
    const media = document.createElement(item.type === 'video' ? 'video' : 'img');
    if (item.type === 'video') {
      media.controls = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.poster = safeMedia(item.poster);
      media.setAttribute('aria-label', item.alt || entry.title);
      media.append(document.createTextNode('Ваш браузер не поддерживает видео.'));
    } else {
      media.alt = item.alt || entry.title;
      media.decoding = 'async';
      media.draggable = false;
    }
    media.addEventListener('error', () => {
      if (!stage.contains(media)) return;
      const message = document.createElement('p');
      message.className = 'media-error';
      message.textContent = 'Не удалось загрузить кадр. Попробуйте другой.';
      stage.replaceChildren(message);
    }, { once: true });
    media.src = safeMedia(item.src);
    stage.replaceChildren(media);
    stage.closest('.gallery').classList.toggle('video-active', item.type === 'video');
    if (!reduceMotion.matches) media.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' });
    $('media-counter').textContent = `${pad(frameIndex + 1)} / ${pad(entry.media.length)}`;
    Array.from($('thumbnails').children).forEach((button, i) => button.setAttribute('aria-current', String(i === frameIndex)));
    $('previous-frame').hidden = $('next-frame').hidden = entry.media.length < 2;
  }
  function showCase(index) {
    if (!cases.length) return;
    caseIndex = (index + cases.length) % cases.length;
    const entry = cases[caseIndex];
    $('case-title').textContent = entry.title;
    $('case-category').textContent = entry.category;
    $('case-description').textContent = entry.description;
    $('case-note').textContent = entry.note || '';
    $('case-note').hidden = !entry.note;
    $('case-navigation').hidden = cases.length < 2;
    $('case-counter').textContent = `${pad(caseIndex + 1)} / ${pad(cases.length)}`;
    $('thumbnails').replaceChildren();
    entry.media.forEach((item, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'thumbnail';
      button.setAttribute('aria-label', `${item.type === 'video' ? 'Видео' : 'Кадр'} ${i + 1}: ${item.alt || entry.title}`);
      const image = document.createElement('img');
      image.src = safeMedia(item.type === 'video' ? item.poster : item.src);
      image.alt = '';
      image.loading = 'lazy';
      button.append(image);
      if (item.type === 'video') {
        const mark = document.createElement('span');
        mark.className = 'play-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = '▶';
        button.append(mark);
      }
      button.addEventListener('click', () => showMedia(i));
      $('thumbnails').append(button);
    });
    showMedia(0);
  }
  $('previous-frame').addEventListener('click', () => showMedia(frameIndex - 1));
  $('next-frame').addEventListener('click', () => showMedia(frameIndex + 1));
  $('next-case').addEventListener('click', () => showCase(caseIndex + 1));
  stage.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showMedia(frameIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  stage.addEventListener('touchstart', (event) => {
    if (event.target.tagName === 'VIDEO' || event.touches.length !== 1) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showMedia(frameIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  $('contact-open').addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('dialog-open');
    // Focus the close control, so opening the form on mobile does not summon the keyboard.
    $('contact-close').focus({ preventScroll: true });
  });
  $('contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    $('contact-open').focus({ preventScroll: true });
  });
  const endpointReady = (() => {
    try { return !!config.formEndpoint && new URL(config.formEndpoint).protocol === 'https:' && (config.formService !== 'formsubmit' || config.formActivated === true); }
    catch { return false; }
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
    Object.keys(data).forEach(key => { data[key] = String(data[key]).trim(); });
    if (data._gotcha) return;
    if (!data.name || !data.project) {
      status.textContent = 'Заполните имя и описание проекта.';
      status.className = 'form-status error';
      return;
    }
    const isContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact) || /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(data.contact) || /^https:\/\/t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/.test(data.contact);
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
    submit.textContent = 'Отправляем…';
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
        ...( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact) ? { email: data.contact } : {} )
      } : data;
      const response = await fetch(config.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      if (!response.ok) throw new Error('Delivery failed');
      if (config.formService === 'formsubmit') {
        const result = await response.json();
        if (![true, 'true'].includes(result.success) || /activat|confirm your email|check your email/i.test(String(result.message || ''))) {
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
      submit.textContent = 'Отправить';
    }
  });
  showCase(0);
})();
