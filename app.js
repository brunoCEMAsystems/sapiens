// app.js
(() => {
  'use strict';

  // ---------------------------
  // Utilidades
  // ---------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const normalize = (s) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

  const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const loadLS = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
  };

  // ---------------------------
  // Dados (mock)
  // ---------------------------
  const CATEGORY_LABELS = {
    all: 'Tudo',
    hardware: 'Hardware',
    microcontroladores: 'Microcontroladores',
    sensores: 'Sensores',
    ferramentas: 'Ferramentas',
    software: 'Software',
    licencas: 'Licenças',
    cursos: 'Cursos',
    apis: 'APIs'
  };

  const PRODUCTS = [
    // Microcontroladores
    {
      id: 'esp32-devkit-v1',
      name: 'ESP32 DevKit v1',
      category: 'microcontroladores',
      price: 59.9,
      desc: 'Wi-Fi + Bluetooth, dual-core, excelente para IoT.',
      tags: ['esp', 'wifi', 'bluetooth', 'iot']
    },
    {
      id: 'arduino-uno-r3',
      name: 'Arduino Uno R3',
      category: 'microcontroladores',
      price: 129.9,
      desc: 'Clássico para prototipagem e ensino.',
      tags: ['arduino', 'avr', 'prototipagem']
    },
    {
      id: 'raspberry-pi-pico-w',
      name: 'Raspberry Pi Pico W',
      category: 'microcontroladores',
      price: 49.9,
      desc: 'RP2040 com Wi-Fi para projetos conectados.',
      tags: ['raspberry', 'rp2040', 'wifi']
    },

    // Sensores
    {
      id: 'ds18b20',
      name: 'Sensor de Temperatura DS18B20',
      category: 'sensores',
      price: 19.9,
      desc: 'Precisão e interface 1-Wire.',
      tags: ['temperatura', '1-wire', 'impermeável']
    },
    {
      id: 'mpu-6050',
      name: 'IMU MPU-6050 (Acelerômetro + Giroscópio)',
      category: 'sensores',
      price: 34.9,
      desc: 'Ideal para robótica e estabilização.',
      tags: ['imu', 'inerciais', 'acelerometro', 'giroscopio']
    },
    {
      id: 'tfmini-s',
      name: 'Sensor LIDAR TFmini-S',
      category: 'sensores',
      price: 279.9,
      desc: 'Medição de distância por laser, compacto.',
      tags: ['lidar', 'distancia', 'laser']
    },

    // Hardware
    {
      id: 'fonte-30v5a',
      name: 'Fonte de Bancada 30V/5A',
      category: 'hardware',
      price: 549.9,
      desc: 'Fonte estabilizada com display digital.',
      tags: ['fonte', 'bancada', 'laboratorio']
    },
    {
      id: 'osciloscopio-100mhz',
      name: 'Osciloscópio Digital 100MHz',
      category: 'hardware',
      price: 2499.9,
      desc: 'Ferramenta essencial para depuração de sinais.',
      tags: ['osciloscopio', 'medicao', 'sinais']
    },
    {
      id: 'protoboard-830',
      name: 'Protoboard 830 pontos',
      category: 'hardware',
      price: 24.9,
      desc: 'Perfeito para prototipagem sem solda.',
      tags: ['protoboard', 'prototipagem', 'breadboard']
    },

    // Ferramentas
    {
      id: 'estacao-solda-60w',
      name: 'Estação de Solda 60W',
      category: 'ferramentas',
      price: 299.9,
      desc: 'Controle de temperatura e suporte para ferro.',
      tags: ['solda', 'ferramentas']
    },
    {
      id: 'kit-chaves-25em1',
      name: 'Kit de Chaves de Precisão 25 em 1',
      category: 'ferramentas',
      price: 59.9,
      desc: 'Manutenção de eletrônicos e microparafusos.',
      tags: ['chave', 'ferramentas', 'manutencao']
    },

    // Software
    {
      id: 'ide-mcu-premium',
      name: 'IDE Premium p/ Microcontroladores (anual)',
      category: 'software',
      price: 399.0,
      desc: 'Autocompletar, debug, instrumentação e perfis.',
      tags: ['ide', 'debug', 'ferramenta', 'editor']
    },
    {
      id: 'simulador-circuitos-pro',
      name: 'Simulador de Circuitos Pro (mensal)',
      category: 'software',
      price: 49.0,
      desc: 'Simulações SPICE e mistas com precisão.',
      tags: ['simulador', 'spice', 'circuitos']
    },

    // Licenças
    {
      id: 'lic-dsp-toolkit',
      name: 'Licença DSP Toolkit Pro (anual)',
      category: 'licencas',
      price: 999.0,
      desc: 'Bibliotecas otimizadas e exemplos prontos.',
      tags: ['dsp', 'licenca', 'sinal']
    },
    {
      id: 'lic-arm-gcc-pro',
      name: 'Compilador ARM GCC Pro (suporte)',
      category: 'licencas',
      price: 199.0,
      desc: 'Toolchain com suporte prioritário.',
      tags: ['arm', 'gcc', 'compilador', 'licenca']
    },

    // Cursos
    {
      id: 'curso-esp32-zero-pro',
      name: 'Curso ESP32: Do Zero ao Pro',
      category: 'cursos',
      price: 299.0,
      desc: 'Wi-Fi, BLE, FreeRTOS e integração em nuvem.',
      tags: ['curso', 'esp32', 'iot', 'freertos']
    },
    {
      id: 'curso-eletronica-analogica',
      name: 'Eletrônica Analógica Essencial',
      category: 'cursos',
      price: 199.0,
      desc: 'Amplificadores, filtros e fontes.',
      tags: ['curso', 'analogica', 'filtros']
    },
    {
      id: 'curso-pcb-kicad',
      name: 'PCB Design com KiCad',
      category: 'cursos',
      price: 249.0,
      desc: 'Da esquemática ao layout e fabricação.',
      tags: ['curso', 'pcb', 'kicad', 'layout']
    },

    // APIs
    {
      id: 'api-iot-1m',
      name: 'API IoT Messaging (1M msgs/mês)',
      category: 'apis',
      price: 49.0,
      desc: 'MQTT/HTTP, QoS e métricas.',
      tags: ['api', 'iot', 'mqtt', 'mensagens']
    },
    {
      id: 'api-visao-10k',
      name: 'API de Visão (10k req/mês)',
      category: 'apis',
      price: 99.0,
      desc: 'Detecção de objetos e OCR.',
      tags: ['api', 'visao', 'ocr', 'ml']
    }
  ];

  const PRODUCT_INDEX = new Map(PRODUCTS.map(p => [p.id, p]));

  // Placeholder de imagem SVG (data URL)
  function placeholderSVG(text, color = '#e8f9ef') {
    const label = encodeURIComponent(text.slice(0, 12));
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'>
        <rect width='100%' height='100%' fill='${color}'/>
        <rect x='16' y='16' width='448' height='288' rx='16' ry='16' fill='white' stroke='#36c967' stroke-width='3'/>
        <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
          font-family='Inter, Arial, sans-serif' font-size='28' fill='#111'>${label}</text>
      </svg>`;
    return 'data:image/svg+xml;utf8,' + svg.replace(/\n|\s{2,}/g, ' ');
  }

  // ---------------------------
  // Estado
  // ---------------------------
  const state = {
    query: '',
    category: 'all',
    cart: loadLS('cart@sapiens', []) // [{id, qty}]
  };

  // ---------------------------
  // Elementos
  // ---------------------------
  const els = {
    year: $('#year'),
    section: $('main section[aria-live]'),
    productGrid: $('#productGrid'),
    emptyState: $('#emptyState'),
    chips: $('#categoryChips'),
    searchInput: $('#searchInput'),
    clearSearch: $('#clearSearch'),
    cartBtn: $('#cartBtn'),
    cartCount: $('#cartCount'),
    cartDrawer: $('#cartDrawer'),
    closeCart: $('#closeCart'),
    cartItems: $('#cartItems'),
    cartSubtotal: $('#cartSubtotal'),
    cartTotal: $('#cartTotal'),
    clearCart: $('#clearCart'),
    checkoutBtn: $('#checkoutBtn'),
    overlay: $('#overlay'),
    menuBtn: $('#menuBtn')
  };

  // ---------------------------
  // Renderização de Produtos
  // ---------------------------
  function filterProducts() {
    const q = normalize(state.query);
    const cat = state.category;
    return PRODUCTS.filter(p => {
      const inCat = (cat === 'all') ? true : p.category === cat;
      if (!inCat) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.desc} ${(p.tags || []).join(' ')}`;
      return normalize(hay).includes(q);
    });
  }

  function productCard(p) {
    const img = placeholderSVG(p.name);
    const price = fmtBRL.format(p.price);
    const catLabel = CATEGORY_LABELS[p.category] || p.category;
    return `
      <article class="product-card" data-id="${p.id}" data-cat="${p.category}" tabindex="0" aria-label="${p.name}">
        <div class="product-card__media">
          <img src="${img}" alt="${p.name}" loading="lazy" width="480" height="320">
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${p.name}</h3>
          <p class="product-card__desc">${p.desc || ''}</p>
          <div class="product-card__meta">
            <span class="chip small">${catLabel}</span>
          </div>
          <div class="product-card__buy">
            <span class="price">${price}</span>
            <button class="btn primary add-to-cart" data-id="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">Adicionar</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    els.section.setAttribute('aria-busy', 'true');
    const list = filterProducts();

    if (!list.length) {
      els.productGrid.innerHTML = '';
      els.emptyState.classList.remove('is-hidden');
      els.section.setAttribute('aria-busy', 'false');
      return;
    }

    els.emptyState.classList.add('is-hidden');
    const html = list.map(productCard).join('');
    els.productGrid.innerHTML = html;
    els.section.setAttribute('aria-busy', 'false');
  }

  // ---------------------------
  // Busca e Filtros
  // ---------------------------
  function setQuery(q) {
    state.query = q;
    toggleClearSearch();
    renderProducts();
  }

  function toggleClearSearch() {
    if (els.searchInput.value.trim()) {
      els.clearSearch.classList.add('is-visible');
      els.clearSearch.removeAttribute('disabled');
      els.clearSearch.setAttribute('aria-hidden', 'false');
    } else {
      els.clearSearch.classList.remove('is-visible');
      els.clearSearch.setAttribute('disabled', 'true');
      els.clearSearch.setAttribute('aria-hidden', 'true');
    }
  }

  function setCategory(cat) {
    state.category = cat;
    // Atualiza UI dos chips
    $$('.chip', els.chips).forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.cat === cat);
      btn.setAttribute('aria-pressed', String(btn.dataset.cat === cat));
    });
    renderProducts();
  }

  // ---------------------------
  // Carrinho
  // ---------------------------
  function getCartItems() {
    return state.cart.slice(); // [{id, qty}]
  }

  function setCartItems(items) {
    state.cart = items.filter(it => PRODUCT_INDEX.has(it.id) && it.qty > 0);
    saveLS('cart@sapiens', state.cart);
    updateCartBadge();
    renderCart();
  }

  function addToCart(id, qty = 1) {
    const product = PRODUCT_INDEX.get(id);
    if (!product) return;
    const items = getCartItems();
    const found = items.find(it => it.id === id);
    if (found) found.qty += qty;
    else items.push({ id, qty });
    setCartItems(items);
    openCart(true);
  }

  function removeFromCart(id) {
    const items = getCartItems().filter(it => it.id !== id);
    setCartItems(items);
  }

  function updateQty(id, qty) {
    qty = Math.max(1, Number(qty) || 1);
    const items = getCartItems();
    const found = items.find(it => it.id === id);
    if (!found) return;
    found.qty = qty;
    setCartItems(items);
  }

  function clearCart() {
    setCartItems([]);
  }

  function cartTotals() {
    const items = getCartItems();
    const subtotal = items.reduce((acc, it) => {
      const p = PRODUCT_INDEX.get(it.id);
      return acc + (p ? p.price * it.qty : 0);
    }, 0);
    const frete = 0; // grátis
    const total = subtotal + frete;
    return { subtotal, frete, total, count: items.reduce((a, it) => a + it.qty, 0) };
  }

  function updateCartBadge() {
    const { count } = cartTotals();
    els.cartCount.textContent = String(count);
    els.cartCount.setAttribute('aria-label', `${count} itens no carrinho`);
  }

  function cartItemRow(it) {
    const p = PRODUCT_INDEX.get(it.id);
    if (!p) return '';
    const unit = fmtBRL.format(p.price);
    const line = fmtBRL.format(p.price * it.qty);
    const img = placeholderSVG(p.name, '#f2f7ff');
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item__media">
          <img src="${img}" alt="${p.name}" width="96" height="64" loading="lazy">
        </div>
        <div class="cart-item__body">
          <div class="cart-item__top">
            <h4 class="cart-item__title">${p.name}</h4>
            <button class="icon-btn remove-item" aria-label="Remover ${p.name}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="cart-item__meta">
            <span class="unit">${unit} cada</span>
          </div>
          <div class="cart-item__controls">
            <div class="qty">
              <button class="qty-btn minus" aria-label="Diminuir quantidade">−</button>
              <input class="qty-input" type="number" inputmode="numeric" min="1" value="${it.qty}" aria-label="Quantidade">
              <button class="qty-btn plus" aria-label="Aumentar quantidade">+</button>
            </div>
            <div class="line">${line}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCart() {
    const items = getCartItems();
    if (!items.length) {
      els.cartItems.innerHTML = `
        <div class="cart-empty">
          <p>Seu carrinho está vazio.</p>
          <a class="btn ghost" href="#produtos" id="keepShopping">Continuar comprando</a>
        </div>
      `;
    } else {
      els.cartItems.innerHTML = items.map(cartItemRow).join('');
    }

    const { subtotal, total } = cartTotals();
    els.cartSubtotal.textContent = fmtBRL.format(subtotal);
    els.cartTotal.textContent = fmtBRL.format(total);
  }

  // ---------------------------
  // Drawer do Carrinho
  // ---------------------------
  function openCart(focus = false) {
    els.cartDrawer.setAttribute('aria-hidden', 'false');
    els.cartBtn.setAttribute('aria-expanded', 'true');
    els.overlay.hidden = false;
    document.body.classList.add('cart-open');
    if (focus) {
      setTimeout(() => els.cartDrawer.querySelector('button, [href], input, select, textarea')?.focus(), 50);
    }
  }

  function closeCart() {
    els.cartDrawer.setAttribute('aria-hidden', 'true');
    els.cartBtn.setAttribute('aria-expanded', 'false');
    els.overlay.hidden = true;
    document.body.classList.remove('cart-open');
    els.cartBtn.focus();
  }

  // ---------------------------
  // Eventos
  // ---------------------------
  function bindEvents() {
    // Chips de categoria (delegação)
    els.chips.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      const cat = btn.dataset.cat || 'all';
      setCategory(cat);
    });

    // Busca
    let t;
    els.searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => setQuery(els.searchInput.value), 120);
    });

    els.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        els.searchInput.value = '';
        setQuery('');
        els.searchInput.blur();
      }
    });

    els.clearSearch.addEventListener('click', () => {
      els.searchInput.value = '';
      setQuery('');
      els.searchInput.focus();
    });

    // Adicionar ao carrinho a partir do grid (delegação)
    els.productGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      addToCart(btn.dataset.id, 1);
    });

    // Acessibilidade: Enter em card adiciona ao carrinho
    els.productGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = e.target.closest('.product-card');
        if (card) addToCart(card.dataset.id, 1);
      }
    });

    // Abrir/fechar carrinho
    els.cartBtn.addEventListener('click', () => openCart(true));
    els.closeCart.addEventListener('click', () => closeCart());
    els.overlay.addEventListener('click', () => closeCart());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.cartDrawer.getAttribute('aria-hidden') === 'false') {
        closeCart();
      }
    });

    // Interações dentro do carrinho (delegação)
    els.cartItems.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;
      const id = itemEl.dataset.id;

      if (e.target.closest('.remove-item')) {
        removeFromCart(id);
        return;
      }
      if (e.target.closest('.qty-btn.plus')) {
        const input = itemEl.querySelector('.qty-input');
        updateQty(id, Number(input.value || 1) + 1);
        return;
      }
      if (e.target.closest('.qty-btn.minus')) {
        const input = itemEl.querySelector('.qty-input');
        updateQty(id, Math.max(1, Number(input.value || 1) - 1));
        return;
      }
    });

    els.cartItems.addEventListener('change', (e) => {
      const input = e.target.closest('.qty-input');
      if (!input) return;
      const itemEl = e.target.closest('.cart-item');
      const id = itemEl?.dataset.id;
      if (!id) return;
      updateQty(id, Number(input.value || 1));
    });

    // Ações do carrinho
    els.clearCart.addEventListener('click', () => clearCart());
    els.checkoutBtn.addEventListener('click', () => {
      const { total, count } = cartTotals();
      if (!count) {
        alert('Seu carrinho está vazio.');
        return;
      }
      alert(`Pedido realizado! 🎉\nTotal: ${fmtBRL.format(total)}\nObrigado por comprar na Sapiens & Sapiens.`);
      clearCart();
      closeCart();
    });

    // Menu: rolar até filtros (útil em mobile)
    els.menuBtn.addEventListener('click', () => {
      $('#categoryChips')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // efeito de destaque sutil
      const chips = $('#categoryChips');
      chips?.classList.add('blink');
      setTimeout(() => chips?.classList.remove('blink'), 600);
    });
  }

  // ---------------------------
  // Inicialização
  // ---------------------------
  function initYear() {
    if (els.year) els.year.textContent = String(new Date().getFullYear());
  }

  function initFromURL() {
    const params = new URLSearchParams(location.hash.slice(1) || location.search);
    const cat = params.get('cat');
    const q = params.get('q');

    if (cat && CATEGORY_LABELS[cat]) {
      state.category = cat;
    }
    if (q) {
      state.query = q;
      els.searchInput.value = q;
    }
  }

  function syncURL() {
    // opcional: reflete filtros na hash
    const params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('cat', state.category);
    if (state.query) params.set('q', state.query);
    const hash = params.toString();
    if (hash) {
      history.replaceState(null, '', `#${hash}`);
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function init() {
    initYear();
    initFromURL();
    bindEvents();

    // Estado inicial UI
    setCategory(state.category);
    els.searchInput.value = state.query;
    toggleClearSearch();

    renderProducts();
    renderCart();
    updateCartBadge();

    // Atualiza URL sempre que filtros mudarem
    const sync = () => syncURL();
    // Observa mudanças simples
    ['input', 'click'].forEach(evt => {
      document.addEventListener(evt, (e) => {
        if (
          e.target === els.searchInput ||
          e.target.closest('#categoryChips') ||
          e.target.closest('#productGrid')
        ) sync();
      }, { passive: true });
    });
  }

  // Inicia
  init();

})();