/**
 * 永和信業株式会社 - メインスクリプト
 * ナビゲーション、モーダル、フォーム、スクロールアニメーション
 */

(function () {
  'use strict';

  // DOM要素の取得
  const contactModal = document.getElementById('contactModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const openContactBtn = document.getElementById('openContactBtn');
  const openContactBtn2 = document.getElementById('openContactBtn2');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  // お問い合わせ先メール（未設定の場合は電話案内のみ）
  const CONTACT_EMAIL = '';

  /* ---- モーダル開閉 ---- */
  function openModal() {
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // フォームをリセット表示
    contactForm.hidden = false;
    formSuccess.hidden = true;
  }

  function closeModal() {
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  [openContactBtn, openContactBtn2].forEach(function (btn) {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Escキーでモーダルを閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ---- フォーム送信 ---- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const service = document.getElementById('service');
      const message = document.getElementById('message');

      // バリデーション
      let valid = true;
      [name, phone, message].forEach(function (field) {
        field.classList.remove('is-error');
        if (!field.value.trim()) {
          field.classList.add('is-error');
          valid = false;
        }
      });

      if (!valid) return;

      // サービス名の日本語変換
      const serviceLabels = {
        metal: '金属買取・回収',
        waste: '不用品回収',
        solar: '太陽光発電',
        other: 'その他',
        '': '未選択'
      };

      const body = [
        '【永和信業 お問い合わせ】',
        '',
        'お名前: ' + name.value.trim(),
        '電話番号: ' + phone.value.trim(),
        'メール: ' + (email.value.trim() || '未入力'),
        'ご相談内容: ' + serviceLabels[service.value],
        '',
        'お問い合わせ内容:',
        message.value.trim()
      ].join('\n');

      const subject = encodeURIComponent('【永和信業】お問い合わせ - ' + name.value.trim());

      if (CONTACT_EMAIL) {
        // メールアドレスが設定されている場合
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + subject +
          '&body=' + encodeURIComponent(body);
        contactForm.hidden = true;
        formSuccess.hidden = false;
      } else {
        // メール未設定時は電話番号を案内
        alert('お問い合わせありがとうございます。\n\n現在フォーム送信のメール設定が未完了のため、\nお手数ですがお電話（080-2890-3353）にてご連絡ください。');
        closeModal();
      }
    });
  }

  /* ---- スクロールアニメーション ---- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // IntersectionObserver非対応ブラウザ
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- ヘッダーのスクロール時シャドウ強化 ---- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        siteHeader.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
      } else {
        siteHeader.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ---- scroll-padding-top をヘッダー実高さに合わせる ---- */
  function syncScrollPadding() {
    var h = siteHeader ? siteHeader.offsetHeight : 0;
    document.documentElement.style.scrollPaddingTop = h + 'px';
  }
  syncScrollPadding();
  window.addEventListener('resize', syncScrollPadding, { passive: true });

})();
