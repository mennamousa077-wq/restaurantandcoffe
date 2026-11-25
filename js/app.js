/**
 * The View Cafe & Restaurant - Global App Controller
 * Handles universal routing, cart synchronization, navigation states, contact modals, WhatsApp float, and QR Menu generator.
 */

(function () {
  'use strict';

  // Determine current page relative root path
  const isSubFolder = window.location.pathname.includes('/stitch_view_restaurant_web_application/');
  const rootPrefix = isSubFolder ? '../' : './';

  // Contact Information Constants
  const CONTACT_INFO = {
    brandName: 'The View Cafe & Restaurant',
    arabicName: 'مطعم وكافيه ذا فيو',
    shortAddress: 'ميدان المحطة، مول سينما الصداقة اعلى محل اَش وان., Aswan, Egypt',
    fullAddress: 'ميدان المحطة، مول سينما الصداقة، أعلى محل آش وان (Ash One)، شرق المحطة، أسوان، مصر',
    addressEn: 'El Mahatta Square, El Sadaqa Cinema Mall (Above Ash One), Aswan, Egypt',
    region: 'West Of Aswan, Aswan Governorate, Egypt',
    phoneLocal: '011 01774545',
    phoneIntl: '+20 11 01774545',
    phoneIntlRaw: '+201101774545',
    phoneLocalRaw: '01101774545',
    whatsappUrl: 'https://wa.me/201101774545?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20The%20View%20Cafe%20%26%20Restaurant%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%88%D8%A7%D9%84%D8%B7%D9%84%D8%A8%D8%A7%D8%AA',
    googleMapsUrl: 'https://maps.app.goo.gl/Uei8k9qyGe2amdXg9?g_st=ipc',
    instagramUrl: 'https://www.instagram.com/thevieww.1',
    facebookUrl: 'https://www.facebook.com/thevieww.1',
    instagramHandle: '@thevieww.1',
    facebookHandle: '@thevieww.1',
    workingHours: 'يومياً من 08:00 صباحاً حتى وقت متأخر بعد منتصف الليل (08:00 AM – Late Midnight)',
    logoPath: rootPrefix + 'the-view-logo.jpg',
    qrPath: rootPrefix + 'menu-qr-code.png',
    tableStandPath: rootPrefix + 'the-view-table-stand.png'
  };

  // Route definitions
  const ROUTES = {
    'home': rootPrefix + 'index.html',
    'menu': rootPrefix + 'menu.html',
    'online-order': rootPrefix + 'online-order.html',
    'book-a-table': rootPrefix + 'book-a-table.html',
    'cart-checkout': rootPrefix + 'online-order.html',
    'admin-portal': rootPrefix + 'admin.html',
    'employee-hub': rootPrefix + 'employee.html',
    'live-orders': rootPrefix + 'employee.html',
    'reservation-management': rootPrefix + 'admin.html#reservations',
    'menu-catalog-manager': rootPrefix + 'admin.html#menu-catalog',
    'terms-and-conditions': '#terms',
    'contact': '#contact',
    'qr-menu': '#qr-menu'
  };

  // Local Storage Cart Helper
  const CART_KEY = 'view_restaurant_cart';

  function getCart() {
    try {
      const items = localStorage.getItem(CART_KEY);
      if (!items) return [];
      const parsed = JSON.parse(items);
      // Clean up legacy placeholder items if present
      if (Array.isArray(parsed) && parsed.some(i => i.id === 'item-geisha' || (i.name === 'Wagyu Truffle Burger' && i.price === 28))) {
        localStorage.removeItem(CART_KEY);
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateAllCartBadges();
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    } catch (e) {}
  }

  function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  function updateDishCardBadges() {
    const cart = getCart();
    // Update any dish card on online-order.html or menu.html
    document.querySelectorAll('[data-dish-id]').forEach(card => {
      const dishId = card.getAttribute('data-dish-id');
      const item = cart.find(i => i.id === dishId);
      const qty = item ? item.qty : 0;
      
      const qtyDisplay = card.querySelector('.dish-qty-counter');
      if (qtyDisplay) qtyDisplay.textContent = qty > 0 ? qty : '1';

      let activeBadge = card.querySelector('.dish-active-cart-badge');
      if (qty > 0) {
        if (!activeBadge) {
          activeBadge = document.createElement('span');
          activeBadge.className = 'dish-active-cart-badge absolute top-3 right-3 px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-md flex items-center gap-1 z-10 animate-pulse';
          activeBadge.innerHTML = '<span class="material-symbols-outlined text-xs">shopping_bag</span><span class="count-text">في السلة: ' + qty + '</span>';
          card.classList.add('relative');
          card.appendChild(activeBadge);
        } else {
          const ct = activeBadge.querySelector('.count-text');
          if (ct) ct.textContent = 'في السلة: ' + qty;
          activeBadge.style.display = 'inline-flex';
        }
      } else if (activeBadge) {
        activeBadge.style.display = 'none';
      }
    });
  }

  function updateAllCartBadges() {
    const totalCount = getCartTotalCount();
    // Target both specific span and any header cart badge
    const badges = document.querySelectorAll('[data-path="cart-checkout"] span.bg-secondary, [data-path="cart-checkout"] span:not(.material-symbols-outlined), .header-cart-badge');
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = 'inline-flex';
      badge.classList.remove('scale-125');
      badge.classList.add('scale-125', 'transition-transform', 'duration-200');
      setTimeout(() => badge.classList.remove('scale-125'), 300);
    });

    // Update dish cards
    updateDishCardBadges();
  }

  // Bind All Path Links
  function bindNavigationLinks() {
    document.querySelectorAll('a[data-path]').forEach(link => {
      const pathKey = link.getAttribute('data-path');

      if (pathKey === 'portal-gateway') {
        link.href = '#';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openPortalModal();
        });
        return;
      }

      if (pathKey === 'user-account') {
        link.href = '#';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openUserAccountModal();
        });
        return;
      }

      if (pathKey === 'contact') {
        link.href = '#contact';
        link.addEventListener('click', (e) => {
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            e.preventDefault();
            contactSec.scrollIntoView({ behavior: 'smooth' });
          } else {
            e.preventDefault();
            openContactModal();
          }
        });
        return;
      }

      if (pathKey === 'terms-and-conditions') {
        link.href = '#';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openTermsModal();
        });
        return;
      }

      if (pathKey === 'qr-menu') {
        link.href = '#';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openQRModal();
        });
        return;
      }

      if (ROUTES[pathKey]) {
        link.href = ROUTES[pathKey];
      }
    });

    // Language Toggle logic
    document.querySelectorAll('header button').forEach(btn => {
      const txt = btn.textContent.trim();
      if (txt === 'EN') {
        btn.addEventListener('click', () => setLanguage('en'));
      } else if (txt.includes('العربية')) {
        btn.addEventListener('click', () => setLanguage('ar'));
      }
    });
  }

  // Floating WhatsApp Quick Action Button
  function injectFloatingWhatsApp() {
    if (document.getElementById('view-floating-whatsapp')) return;

    const waHtml = `
      <div id="view-floating-whatsapp" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <a href="${CONTACT_INFO.whatsappUrl}" target="_blank" rel="noopener noreferrer" 
           class="group flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-300" 
           title="تحدث معنا على واتساب The View">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.971.558 1.996.882 3.125.882 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-6.112-5.772zm3.393 8.169c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.147-.527-1.745-.723-2.884-2.493-2.971-2.608-.088-.116-.708-.941-.708-1.793 0-.852.448-1.271.607-1.444.159-.175.348-.219.463-.219.116 0 .232.001.333.007.106.005.249-.04.39.298.144.347.491 1.2.535 1.288.043.088.072.19.014.305-.058.116-.087.188-.173.289l-.26.305c-.087.086-.18.18-.077.355.101.174.45 1.056 1.411 1.479.289.127.534.144.694.093.193-.061.607-.708.769-.95.162-.242.325-.203.548-.121.223.082 1.416.668 1.662.791.246.123.409.183.468.286.061.103.061.597-.083 1.002z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 22l4.986-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.632 0-3.15-.472-4.436-1.285l-.318-.202-2.955.775.789-2.88-.221-.352A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
          </svg>
          <span class="font-bold text-sm tracking-wide hidden sm:inline font-sans">واتساب The View</span>
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </a>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', waHtml);
  }

  // Contact & Location Modal
  function openContactModal() {
    const old = document.getElementById('view-contact-modal');
    if (old) old.remove();

    const modalHtml = `
      <div id="view-contact-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-outline-variant/30 my-8">
          <button onclick="document.getElementById('view-contact-modal').remove()" class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="flex items-center gap-4 mb-4">
            <img src="${CONTACT_INFO.logoPath}" alt="Logo" class="h-12 w-auto object-cover rounded-lg shadow-sm border border-outline-variant/30" />
            <div>
              <span class="font-label-sm text-secondary uppercase font-bold tracking-wider">Contact & Location • تواصل معنا</span>
              <h3 class="font-title-lg sm:font-headline-sm font-bold text-on-surface">${CONTACT_INFO.brandName}</h3>
              <p class="text-xs text-secondary font-semibold">${CONTACT_INFO.arabicName}</p>
            </div>
          </div>

          <!-- Address Block -->
          <div class="p-4 rounded-xl bg-surface-container-low mb-4 space-y-2 border border-outline-variant/20">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">pin_drop</span>
              <div>
                <h4 class="font-bold text-sm text-on-surface">العنوان بالتفصيل:</h4>
                <p class="text-sm font-medium text-on-surface mt-0.5 leading-relaxed">${CONTACT_INFO.shortAddress}</p>
                <p class="text-xs text-on-surface-variant mt-1">${CONTACT_INFO.region}</p>
                <p class="text-xs text-on-surface-variant">${CONTACT_INFO.addressEn}</p>
              </div>
            </div>
            <div class="pt-2">
              <a href="${CONTACT_INFO.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-bold text-xs transition-colors">
                <span class="material-symbols-outlined text-base">map</span>
                <span>فتح في تطبيق Google Maps</span>
                <span class="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          <!-- Contact Numbers -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <a href="tel:${CONTACT_INFO.phoneLocalRaw}" class="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex items-center gap-3 transition-colors">
              <div class="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                <span class="material-symbols-outlined text-lg">call</span>
              </div>
              <div class="min-w-0">
                <span class="text-xs text-on-surface-variant block font-medium">اتصال محلي</span>
                <span class="font-bold text-sm text-on-surface">${CONTACT_INFO.phoneLocal}</span>
              </div>
            </a>
            <a href="tel:${CONTACT_INFO.phoneIntlRaw}" class="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex items-center gap-3 transition-colors">
              <div class="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                <span class="material-symbols-outlined text-lg">phone_iphone</span>
              </div>
              <div class="min-w-0">
                <span class="text-xs text-on-surface-variant block font-medium">اتصال دولي</span>
                <span class="font-bold text-sm text-on-surface dir-ltr">${CONTACT_INFO.phoneIntl}</span>
              </div>
            </a>
          </div>

          <!-- WhatsApp Direct Link -->
          <a href="${CONTACT_INFO.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full p-3.5 mb-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.971.558 1.996.882 3.125.882 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-6.112-5.772zm3.393 8.169c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.147-.527-1.745-.723-2.884-2.493-2.971-2.608-.088-.116-.708-.941-.708-1.793 0-.852.448-1.271.607-1.444.159-.175.348-.219.463-.219.116 0 .232.001.333.007.106.005.249-.04.39.298.144.347.491 1.2.535 1.288.043.088.072.19.014.305-.058.116-.087.188-.173.289l-.26.305c-.087.086-.18.18-.077.355.101.174.45 1.056 1.411 1.479.289.127.534.144.694.093.193-.061.607-.708.769-.95.162-.242.325-.203.548-.121.223.082 1.416.668 1.662.791.246.123.409.183.468.286.061.103.061.597-.083 1.002z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 22l4.986-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.632 0-3.15-.472-4.436-1.285l-.318-.202-2.955.775.789-2.88-.221-.352A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
            <span>محادثة واتساب سريعة (+20 11 01774545)</span>
          </a>

          <!-- Social Media Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <a href="${CONTACT_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" class="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex items-center gap-2.5 transition-colors group">
              <span class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">photo_camera</span>
              </span>
              <div class="truncate">
                <span class="text-[10px] text-on-surface-variant block uppercase font-bold">Instagram</span>
                <span class="font-bold text-xs text-on-surface group-hover:text-secondary">${CONTACT_INFO.instagramHandle}</span>
              </div>
            </a>

            <a href="${CONTACT_INFO.facebookUrl}" target="_blank" rel="noopener noreferrer" class="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex items-center gap-2.5 transition-colors group">
              <span class="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">public</span>
              </span>
              <div class="truncate">
                <span class="text-[10px] text-on-surface-variant block uppercase font-bold">Facebook</span>
                <span class="font-bold text-xs text-on-surface group-hover:text-secondary">${CONTACT_INFO.facebookHandle}</span>
              </div>
            </a>
          </div>

          <!-- Working Hours & Actions -->
          <div class="p-3 rounded-xl bg-surface-container/60 text-xs text-on-surface-variant flex items-center justify-between mb-4">
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-secondary">schedule</span>${CONTACT_INFO.workingHours}</span>
          </div>

          <div class="flex gap-2">
            <button onclick="document.getElementById('view-contact-modal').remove(); window.ViewApp.openQRModal();" class="flex-1 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
              <span class="material-symbols-outlined text-base">qr_code_2</span>
              <span>عرض QR Code المنيو</span>
            </button>
            <button onclick="document.getElementById('view-contact-modal').remove()" class="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs">إغلاق</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // QR Code Modal for Mobile Menu
  function openQRModal() {
    const old = document.getElementById('view-qr-modal');
    if (old) old.remove();

    // Construct phone-accessible menu URL (using local Wi-Fi IP for mobile scanning)
    const isFileProto = window.location.protocol === 'file:';
    let defaultUrl;
    if (isFileProto || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      defaultUrl = 'http://192.168.1.16:8080/menu.html';
    } else {
      defaultUrl = new URL(ROUTES['menu'], window.location.href).href;
    }

    const modalHtml = `
      <div id="view-qr-modal" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-outline-variant/30 text-center my-8">
          <button onclick="document.getElementById('view-qr-modal').remove()" class="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-2xl">qr_code_scanner</span>
          </div>

          <span class="font-label-sm text-secondary uppercase font-bold tracking-wider">Touchless Table Menu</span>
          <h3 class="font-title-lg font-bold text-on-surface mt-0.5">${CONTACT_INFO.brandName}</h3>
          <p class="text-xs text-on-surface-variant mt-0.5 mb-3">امسح الكود بكاميرا الموبايل لفتح المنيو فوراً على هاتفك</p>

          <!-- Instructions Box for Mobile Phone -->
          <div class="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-right text-xs">
            <div class="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
              <span class="material-symbols-outlined text-sm">phone_iphone</span>
              <span>خطوات فتح المنيو على الموبايل:</span>
            </div>
            <ol class="list-decimal list-inside space-y-0.5 text-emerald-900 text-[11px] leading-relaxed">
              <li>تأكد أن هاتفك متصل بنفس شبكة الواي فاي (Wi-Fi).</li>
              <li>افتح تطبيق الكاميرا بهاتفك ووجّهها نحو الكود.</li>
              <li>اضغط على الرابط المنبثق لفتح المنيو فوراً.</li>
            </ol>
          </div>

          <!-- QR Container -->
          <div class="p-3.5 rounded-2xl bg-white shadow-inner inline-block mx-auto border-2 border-dashed border-secondary/30 mb-3">
            <div id="modal-qr-render" class="flex items-center justify-center min-w-[200px] min-h-[200px]">
              <img id="modal-qr-img" src="${CONTACT_INFO.qrPath}" alt="Menu QR Code" class="w-48 h-48 object-contain" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+encodeURIComponent('${defaultUrl}')" />
            </div>
            <div id="modal-qr-url-text" class="mt-2 text-[11px] font-mono text-gray-700 font-bold break-all max-w-[240px]">
              ${defaultUrl}
            </div>
          </div>

          <!-- Quick Actions: Copy Link & WhatsApp to Phone -->
          <div class="flex gap-2 mb-3">
            <button type="button" onclick="window.ViewApp.copyLink('${defaultUrl}')" class="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-sm">content_copy</span>
              <span>نسخ الرابط</span>
            </button>
            <a href="https://wa.me/?text=${encodeURIComponent('رابط منيو The View Cafe & Restaurant: ' + defaultUrl)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-sm">
              <span class="material-symbols-outlined text-sm">share</span>
              <span>إرسال لواتساب هاتفك</span>
            </a>
          </div>

          <!-- URL Control for Table Stands -->
          <div class="mb-3 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-right">
            <label class="block font-bold text-[11px] text-on-surface-variant mb-1">رابط المنيو (يمكن تعديله وتحديث الكود فوراً):</label>
            <div class="flex gap-1.5">
              <input type="text" id="custom-qr-url-input" value="${defaultUrl}" dir="ltr" class="flex-1 px-2.5 py-1.5 rounded bg-surface text-on-surface text-xs border border-outline-variant/40 font-mono outline-none focus:ring-1 focus:ring-secondary" />
              <button type="button" id="btn-update-qr" class="px-3 py-1.5 rounded bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-colors shrink-0">
                تحديث
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col gap-2">
            <a href="${ROUTES['menu']}" class="w-full py-2.5 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
              <span class="material-symbols-outlined text-base">restaurant_menu</span>
              <span>فتح المنيو الآن على الشاشة</span>
            </a>
            <div class="flex gap-2">
              <a href="${CONTACT_INFO.qrPath}" download="the-view-menu-qr.png" class="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center justify-center gap-1 transition-colors">
                <span class="material-symbols-outlined text-sm">download</span>
                <span>تحميل كود QR</span>
              </a>
              <a href="${CONTACT_INFO.tableStandPath}" download="the-view-table-stand.png" class="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center justify-center gap-1 transition-colors">
                <span class="material-symbols-outlined text-sm">print</span>
                <span>تصميم حامل الطاولات</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    function renderDynamicQR(text) {
      const img = document.getElementById('modal-qr-img');
      const urlText = document.getElementById('modal-qr-url-text');
      if (img) {
        img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(text);
      }
      if (urlText) urlText.textContent = text;
    }

    const updateBtn = document.getElementById('btn-update-qr');
    const inputEl = document.getElementById('custom-qr-url-input');
    if (updateBtn && inputEl) {
      updateBtn.addEventListener('click', () => {
        const val = inputEl.value.trim();
        if (val) {
          renderDynamicQR(val);
          showToast('تم تحديث كود QR للرابط الجديد!');
        }
      });
    }
  }

  // Portal Switcher Modal
  function createPortalModal() {
    if (document.getElementById('view-portal-gateway-modal')) return;

    const modalHtml = `
      <div id="view-portal-gateway-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-outline-variant/30">
          <button id="close-portal-modal" class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span class="material-symbols-outlined text-xl">hub</span>
            </div>
            <div>
              <span class="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">بوابات النظام • System Portals</span>
              <h3 class="font-headline-sm text-headline-sm font-bold">اختر البوابة أو لوحة التحكم</h3>
            </div>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-6">
            ${CONTACT_INFO.brandName} - تصفح موقع الزبائن أو لوحات الإدارة والتشغيل بأسوان.
          </p>

          <div class="grid grid-cols-1 gap-3">
            <a href="${ROUTES['home']}" class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group border border-outline-variant/20">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <h4 class="font-title-lg text-title-lg font-bold">واجهة الزبائن والموقع العام</h4>
                  <p class="font-body-sm text-xs text-on-surface-variant">تصفح قائمة الطعام، حجز الطاولات، والطلب أونلاين</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-secondary group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </a>

            <a href="${ROUTES['admin-portal']}" class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group border border-outline-variant/20">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div>
                  <h4 class="font-title-lg text-title-lg font-bold">لوحة تحكم الإدارة (Admin)</h4>
                  <p class="font-body-sm text-xs text-on-surface-variant">متابعة المبيعات، إدارة الأطباق، ومراجعة الحجوزات اللحظية</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-secondary group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </a>

            <a href="${ROUTES['employee-hub']}" class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group border border-outline-variant/20">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined">soup_kitchen</span>
                </div>
                <div>
                  <h4 class="font-title-lg text-title-lg font-bold">شاشة المطبخ والموظفين (KDS)</h4>
                  <p class="font-body-sm text-xs text-on-surface-variant">شاشة تذاكر تحضير الطلبات، حالة الوردية، وجداول الصالة</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-secondary group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </a>
          </div>

          <div class="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${CONTACT_INFO.brandName} - أسوان
            </span>
            <span class="font-mono">v2.5.0</span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('close-portal-modal').addEventListener('click', closePortalModal);
  }

  function openPortalModal() {
    createPortalModal();
    const modal = document.getElementById('view-portal-gateway-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function closePortalModal() {
    const modal = document.getElementById('view-portal-gateway-modal');
    if (modal) modal.classList.add('hidden');
  }

  // User Account Modal
  function openUserAccountModal() {
    const reservations = JSON.parse(localStorage.getItem('view_restaurant_reservations') || '[]');
    const latest = reservations.length > 0 ? reservations[0] : null;

    let detailsHtml = `
      <p class="text-on-surface-variant text-sm mb-4">ليس لديك حجوزات طاولات نشطة في الوقت الحالي.</p>
      <a href="${ROUTES['book-a-table']}" class="w-full py-2.5 rounded-lg bg-secondary text-on-secondary font-bold text-center block">احجز طاولة الآن</a>
    `;

    if (latest) {
      detailsHtml = `
        <div class="p-4 rounded-xl bg-surface-container-low mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-label-sm uppercase font-bold text-secondary">حجز نشط ومؤكد</span>
            <span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">${latest.referenceId || '#RES-LATEST'}</span>
          </div>
          <div class="font-title-lg font-bold text-on-surface">${latest.name || 'الضيف الكريم'}</div>
          <div class="text-sm text-on-surface-variant mt-1">
            <strong>${latest.guests || '2'} أفراد</strong> • ${latest.date || 'اليوم'} الساعة ${latest.time || '07:30 م'}
          </div>
          <div class="text-xs text-on-surface-variant mt-1">منطقة الجلوس: ${latest.zone || 'التراس البانورامي'}</div>
        </div>
        <div class="flex gap-2">
          <a href="${ROUTES['book-a-table']}" class="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-center font-semibold text-sm">حجز جديد</a>
          <button onclick="document.getElementById('view-user-modal').remove()" class="flex-1 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-sm">إغلاق</button>
        </div>
      `;
    }

    const modalHtml = `
      <div id="view-user-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-outline-variant/30">
          <button onclick="document.getElementById('view-user-modal').remove()" class="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xl">
              <span class="material-symbols-outlined">account_circle</span>
            </div>
            <div>
              <h3 class="font-title-lg font-bold">بوابة الضيف وحسابي</h3>
              <p class="text-xs text-on-surface-variant">${CONTACT_INFO.brandName} - أسوان</p>
            </div>
          </div>
          ${detailsHtml}
        </div>
      </div>
    `;

    const old = document.getElementById('view-user-modal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

    const DEFAULT_POLICIES = [
    { id: 'pol-1', title: '1. فترة انتظار الحجز والإلغاء المجاني', desc: 'يتم الاحتفاظ بالطاولة المحجوزة لمدة 20 دقيقة بعد موعد الحجز المحدد قبل إتاحتها للانتظار. يُسمح بالإلغاء المجاني قبل موعد الوصول بساعتين على الأقل عبر الموقع أو الواتساب.', tag: 'حجوزات' },
    { id: 'pol-2', title: '2. رسوم إلغاء الحجز المتأخر (50 ج.م/للضيف)', desc: 'تطبق رسوم الإلغاء المتأخر في حالة عدم الحضور دون إخطار مسبق بساعتين لضمان عدالة حجز الطاولات لجميع الضيوف.', tag: 'حجوزات' },
    { id: 'pol-3', title: '3. اللباس والمظهر العام الراقي', desc: 'نرحب بضيوفنا الكرام بأزياء أنيقة ومريحة ملائمة للأجواء الراقية في الصالة الداخلية وتراس The View المطل على أفق أسوان.', tag: 'ضوابط عامة' },
    { id: 'pol-4', title: '4. الحساسية والملاحظات الغذائية المعتمدة', desc: 'يتم إعداد جميع أطباقنا ومشروباتنا طازجة يومياً بأعلى معايير سلامة الغذاء. إشعار مسببات الحساسية ثنائي اللغة متاح في جميع القوائم الرقمية.', tag: 'المطبخ والسلامة' },
    { id: 'pol-5', title: '5. سياسة استرجاع وتعديل الطلبات الأونلاين', desc: 'يُسمح بتعديل أو إلغاء أوردر التوصيل مجاناً خلال 5 دقائق من تأكيده قبل بدء تجهيز الوجبة بالمطبخ، ويتم إرجاع المبلغ فوراً.', tag: 'الطلبات والتوصيل' },
    { id: 'pol-6', title: '6. العنوان ومعلومات الاتصال الرسمية المعتمدة', desc: `ميدان المحطة، مول سينما الصداقة أعلى محل آش وان، أسوان. هاتف: ${CONTACT_INFO.phoneLocal} / واتساب: ${CONTACT_INFO.phoneIntl}.`, tag: 'التواصل والفرع' }
  ];

  function getApprovedPolicies() {
    try {
      const stored = localStorage.getItem('view_restaurant_policies');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return DEFAULT_POLICIES;
  }

  // Terms & Conditions Modal
  function openTermsModal() {
    const policies = getApprovedPolicies();
    const modalHtml = `
      <div id="view-terms-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-outline-variant/30 max-h-[85vh] overflow-y-auto my-8">
          <button onclick="document.getElementById('view-terms-modal').remove()" class="absolute top-5 left-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div class="flex items-center gap-2 mb-1">
            <span class="material-symbols-outlined text-secondary text-2xl">verified_user</span>
            <span class="font-label-sm text-secondary uppercase font-bold tracking-wider">الوثيقة القانونية والتشغيلية المعتمدة</span>
          </div>
          <h3 class="font-headline-sm font-bold text-on-surface mt-1 mb-1">الشروط والسياسات المعتمدة</h3>
          <p class="text-xs text-on-surface-variant mb-4 font-mono">The View Cafe & Restaurant • الإصدار 3.4 معتمد ورسمي</p>

          <div class="space-y-3.5 text-sm text-on-surface-variant">
            ${policies.map(p => `
              <div class="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-bold text-on-surface text-sm flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>${p.title}</span>
                  </h4>
                  ${p.tag ? `<span class="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-bold text-on-surface-variant">${p.tag}</span>` : ''}
                </div>
                <p class="text-xs leading-relaxed text-on-surface-variant pr-3">${p.desc}</p>
              </div>
            `).join('')}
          </div>

          <div class="mt-6 pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>معتمد وساري المفعول لجميع فروع وخدمات The View</span>
            </span>
            <button onclick="document.getElementById('view-terms-modal').remove()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-on-secondary-container transition-all shadow-sm">
              إغلاق وموافقة
            </button>
          </div>
        </div>
      </div>
    `;
    const old = document.getElementById('view-terms-modal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // Toast Notification
  function showToast(message, isSuccess = true) {
    let toast = document.getElementById('view-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'view-global-toast';
      toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none';
      document.body.appendChild(toast);
    }
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform ${
      isSuccess ? 'bg-secondary text-on-secondary' : 'bg-red-700 text-white'
    }`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-xl">${isSuccess ? 'check_circle' : 'error'}</span>
      <span class="font-label-md text-label-md font-semibold">${message}</span>
    `;
    setTimeout(() => {
      toast.classList.remove('translate-y-20', 'opacity-0');
    }, 50);
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
  }

  // Language Preference
  function setLanguage(lang) {
    localStorage.setItem('view_language', lang);
    if (lang === 'ar') {
      document.documentElement.lang = 'ar';
      showToast('تم ضبط اللغة على العربية (' + CONTACT_INFO.arabicName + ')');
    } else {
      document.documentElement.lang = 'en';
      showToast('Language switched to English');
    }
  }

  // Copy link helper
  function copyLink(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('تم نسخ رابط المنيو بنجاح!');
      }).catch(() => {
        showToast('رابط المنيو: ' + url);
      });
    } else {
      showToast('رابط المنيو: ' + url);
    }
  }

  // Expose global methods
  window.ViewApp = {
    getCart,
    saveCart,
    showToast,
    copyLink,
    openPortalModal,
    openUserAccountModal,
    openTermsModal,
    openContactModal,
    openQRModal,
    updateAllCartBadges,
    routes: ROUTES,
    contactInfo: CONTACT_INFO
  };

  // Expose directly to window for simple onclick calls anywhere
  window.openQRModal = openQRModal;
  window.openTermsModal = openTermsModal;
  window.openContactModal = openContactModal;
  window.openPortalModal = openPortalModal;
  window.openUserAccountModal = openUserAccountModal;

  // Floating Active Order Tracker Pill (shown when customer has an active order on index.html, menu.html, etc.)
  function injectFloatingOrderTracker() {
    if (window.location.pathname.includes('employee.html') || window.location.pathname.includes('admin.html')) return;

    function updatePill() {
      let activeOrder = null;
      try {
        const saved = localStorage.getItem('view_active_order');
        if (saved) activeOrder = JSON.parse(saved);
      } catch(e) {}

      let pill = document.getElementById('view-floating-order-tracker');

      if (!activeOrder) {
        if (pill) pill.remove();
        return;
      }

      if (window.location.pathname.includes('online-order.html')) {
        if (pill) pill.remove();
        return;
      }

      const step = activeOrder.statusStep || 2;
      const isDelivered = step === 4;
      const isWithDelivery = step === 3;
      const isCancelled = step === 0 || activeOrder.status?.includes('ملغي');

      let pillBg = 'bg-amber-600 text-white';
      let icon = 'soup_kitchen';
      if (isWithDelivery) {
        pillBg = 'bg-blue-600 text-white animate-pulse';
        icon = 'moped';
      } else if (isDelivered) {
        pillBg = 'bg-emerald-600 text-white';
        icon = 'task_alt';
      } else if (isCancelled) {
        pillBg = 'bg-red-600 text-white';
        icon = 'cancel';
      }

      if (!pill) {
        pill = document.createElement('div');
        pill.id = 'view-floating-order-tracker';
        pill.className = 'fixed bottom-6 left-6 z-40 transition-all duration-300';
        document.body.appendChild(pill);
      }

      pill.innerHTML = `
        <a href="${rootPrefix}online-order.html" class="flex items-center gap-2.5 ${pillBg} px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-bold border-2 border-white/30" title="اضغط لفتح تتبع الطلب">
          <span class="material-symbols-outlined text-base ${isWithDelivery ? 'animate-bounce' : ''}">${icon}</span>
          <span>طلبك ${activeOrder.orderNumber}: <strong>${activeOrder.status}</strong></span>
          <span class="material-symbols-outlined text-sm rotate-180">arrow_forward</span>
        </a>
      `;
    }

    updatePill();
    window.addEventListener('storage', updatePill);
    window.addEventListener('ViewOrderStatusChanged', updatePill);
  }

  // Run immediately and on DOMContentLoaded
  try {
    bindNavigationLinks();
    updateAllCartBadges();
  } catch(e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindNavigationLinks();
      updateAllCartBadges();
      injectFloatingWhatsApp();
      injectFloatingOrderTracker();
    });
  } else {
    injectFloatingWhatsApp();
    injectFloatingOrderTracker();
  }
})();
