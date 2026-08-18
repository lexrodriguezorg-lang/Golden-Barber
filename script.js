/* ══════════════════════════════════════════════════════
   GOLDEN BARBER — configuración, agenda y tienda

   👉 TODO lo que hay que cambiar está en CONFIG.
   ══════════════════════════════════════════════════════ */

const CONFIG = {
  /* ── Contacto ─────────────────────────────────────── */

  // WhatsApp en formato internacional, solo dígitos.
  whatsapp: "573504737330",

  // Mensaje del botón suelto de WhatsApp (el de la cabecera y el flotante).
  whatsappMsg: "¡Hola Javi! Quiero solicitar una cita en Golden Barber 💈",

  /* ── Servicios ────────────────────────────────────── */
  // OJO: los precios también aparecen escritos en index.html, en la
  // sección "Menú de servicios". Si cambias uno, cambia el otro.

  servicios: [
    { id: "corte",  nombre: "Corte clásico",       min: 30, precio: 25000, icono: "tijera" },
    { id: "barba",  nombre: "Barba",               min: 20, precio: 20000, icono: "barba"  },
    { id: "combo",  nombre: "Combo corte + barba", min: 45, precio: 40000, icono: "combo"  },
  ],

  /* ── Horario ──────────────────────────────────────── */
  // Minutos desde medianoche. La clave es el día: 0 domingo … 6 sábado.

  horario: {
    0: [600, 840],    // domingo    10:00 – 14:00
    1: [540, 1140],   // lunes       9:00 – 19:00
    2: [540, 1140],   // martes      9:00 – 19:00
    3: [540, 1140],   // miércoles   9:00 – 19:00
    4: [540, 1140],   // jueves      9:00 – 19:00
    5: [540, 1140],   // viernes     9:00 – 19:00
    6: [510, 1080],   // sábado      8:30 – 18:00
  },

  // Cada cuántos minutos se ofrece un cupo.
  intervaloMin: 30,

  // Cuántas horas de anticipación mínima para reservar.
  anticipacionHoras: 2,

  // Con cuántos días de anticipación se puede agendar.
  diasVista: 60,

  // Días sueltos cerrados: vacaciones, festivos. Formato "AAAA-MM-DD".
  cerrado: [],

  /* ── Reseñas ──────────────────────────────────────── */
  // Enlace para dejar reseña en Google. Sale del perfil de Google
  // Business Profile → "Compartir formulario de reseñas".
  // Déjalo en "" mientras no exista el perfil.
  googleResenas: "",

  /* ── Cal.com (opcional) ───────────────────────────── */
  // Déjalo en "" para usar la agenda propia de esta página.
  // Si algún día Javi quiere calendario real con disponibilidad
  // automática, crea la cuenta en cal.com y pon aquí "usuario/evento".
  calLink: "",
  calBrand: "#C99A32",
};

/* Añade aquí los productos reales cuando estén disponibles.
   Ejemplo:
   { id: "cera-mate", nombre: "Cera mate", precio: 35000,
     foto: "img/productos/cera-mate.jpg", disponible: true }
*/
const PRODUCTOS = [];

/* ══════════════════════════════════════════════════════
   A partir de aquí no hace falta tocar nada.
   ══════════════════════════════════════════════════════ */

const PESOS = new Intl.NumberFormat("es-CO");
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const ICONOS = {
  tijera: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 20 20M8.1 15.9 20 4"/>',
  barba: '<path d="M4 8c2.5 0 3.5 2 4.5 2S10 8 12 8s2.5 2 3.5 2S17.5 8 20 8c0 5-3.6 9-8 9s-8-4-8-9z"/>',
  combo: '<circle cx="6" cy="6" r="2.4"/><path d="M7.7 7.7 18 18"/><path d="M6 14c1.7 0 2.4 1.4 3.1 1.4S10.4 14 11.8 14s1.7 1.4 2.4 1.4S15.6 14 17.3 14c0 3.4-2.5 6.1-5.6 6.1S6 17.4 6 14z"/>',
};

/* ── Utilidades ──────────────────────────────────────── */

/** Fecha y hora actuales en Bogotá, sin importar dónde esté el visitante. */
function ahoraColombia() {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date())
    .reduce((o, x) => (o[x.type] = x.value, o), {});

  return {
    dia: new Date(+p.year, +p.month - 1, +p.day),
    minutos: +p.hour * 60 + +p.minute,
  };
}

const claveISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const precio = (n) => "$ " + PESOS.format(n);

/** 870 → "2:30 PM" */
function hhmm(min) {
  const h = Math.floor(min / 60), m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Fecha larga: "miércoles, 19 de agosto de 2026" */
const fechaLarga = (d) => new Intl.DateTimeFormat("es-CO", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
}).format(d);

/** Solo la primera letra en mayúscula, para mostrar en pantalla. */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── WhatsApp: arma todos los enlaces sueltos ────────── */
(function enlacesWhatsApp() {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener";
  });
})();

/* ── Tienda ligera: catálogo y pedido por WhatsApp ─── */
(function tienda() {
  const grid = document.getElementById("productos-grid");
  const vacio = document.getElementById("productos-vacio");
  const carrito = document.getElementById("carrito");
  const resumen = document.getElementById("carrito-resumen");
  const pedir = document.getElementById("pedir-productos");
  if (!grid || !vacio || !carrito || !resumen || !pedir) return;

  const disponibles = PRODUCTOS.filter((p) => p.disponible !== false);
  const cantidades = new Map();
  const seguro = (s) => String(s).replace(/[&<>\"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" }[c]));

  document.querySelectorAll("[data-shop-wa]").forEach((el) => {
    el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("¡Hola Javi! ¿Qué productos tienes disponibles hoy en Golden Barber?")}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  if (!disponibles.length) return;
  vacio.hidden = true;
  grid.innerHTML = disponibles.map((p) => `
    <article class="product">
      <div class="product__photo">
        <img src="${seguro(p.foto)}" alt="${seguro(p.nombre)}" width="480" height="480" loading="lazy">
      </div>
      <div class="product__body">
        <h3>${seguro(p.nombre)}</h3>
        <p>${precio(p.precio)}</p>
        <button type="button" class="btn btn--ghost btn--sm" data-producto="${seguro(p.id)}">Agregar</button>
      </div>
    </article>`).join("");

  function actualizar() {
    const lineas = disponibles
      .filter((p) => cantidades.get(p.id))
      .map((p) => ({ ...p, cantidad: cantidades.get(p.id) }));
    if (!lineas.length) {
      carrito.hidden = true;
      return;
    }
    const unidades = lineas.reduce((n, p) => n + p.cantidad, 0);
    const total = lineas.reduce((n, p) => n + p.cantidad * p.precio, 0);
    resumen.textContent = `${unidades} ${unidades === 1 ? "producto" : "productos"} · ${precio(total)}`;
    carrito.hidden = false;
  }

  grid.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-producto]");
    if (!boton) return;
    const id = boton.dataset.producto;
    cantidades.set(id, (cantidades.get(id) || 0) + 1);
    boton.textContent = `Agregar otro · ${cantidades.get(id)}`;
    actualizar();
  });

  pedir.addEventListener("click", () => {
    const lineas = disponibles.filter((p) => cantidades.get(p.id));
    const total = lineas.reduce((n, p) => n + cantidades.get(p.id) * p.precio, 0);
    const texto = [
      "¡Hola Javi! Quiero pedir estos productos de Golden Barber:", "",
      ...lineas.map((p) => `• ${cantidades.get(p.id)} × ${p.nombre} — ${precio(cantidades.get(p.id) * p.precio)}`),
      "", `Total: ${precio(total)}`, "", "¿Me confirmas disponibilidad?",
    ].join("\n");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
})();

/* ── Año del pie de página ───────────────────────────── */
(function anio() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* ══════════════════════════════════════════════════════
   RESEÑAS DE CLIENTES
   El contenido vive en resenas.js. Si todavía no hay ninguna,
   en vez de inventarlas se muestra la invitación a dejar la
   primera — vacío es mejor que falso.
   ══════════════════════════════════════════════════════ */
(function resenas() {
  const grid = document.getElementById("resenas-grid");
  const invita = document.getElementById("resenas-invita");
  if (!grid || !invita) return;

  const lista = (typeof RESENAS !== "undefined" ? RESENAS : [])
    .slice()
    .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

  const escapar = (s) => String(s).replace(/[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  grid.innerHTML = lista.map((r) => {
    const n = Math.max(0, Math.min(5, +r.estrellas || 0));
    return `
    <li class="review">
      ${r.foto ? `<img class="review__foto" src="${escapar(r.foto)}"
           alt="${escapar(r.nombre)}, cliente de Golden Barber"
           width="72" height="72" loading="lazy"
           onerror="this.remove()">` : ""}
      <p class="review__quote">${escapar(r.texto)}</p>
      ${n ? `<p class="review__stars" aria-label="${n} de 5 estrellas">${"★".repeat(n)}${"☆".repeat(5 - n)}</p>` : ""}
      <p class="review__author">— ${escapar(r.nombre)}</p>
    </li>`;
  }).join("");

  const wa = `https://wa.me/${CONFIG.whatsapp}?text=` + encodeURIComponent(
    "¡Hola Javi! Quiero dejar mi reseña de Golden Barber 💈\n\n" +
    "Mi nombre: \nLo que opino: \n\n" +
    "(Puedes responder este mensaje con tu foto si quieres que salga en la página)"
  );

  const google = CONFIG.googleResenas
    ? `<a class="btn btn--ghost btn--sm" href="${CONFIG.googleResenas}" target="_blank" rel="noopener">Reseñar en Google</a>`
    : "";

  invita.innerHTML = `
    <div class="invita${lista.length ? " invita--pie" : ""}">
      <p class="invita__titulo">${lista.length
        ? "¿Ya te atendió Javi?"
        : "Sé el primero en dejar tu reseña"}</p>
      <p class="invita__texto">${lista.length
        ? "Cuéntanos cómo te fue y sal aquí con tu foto."
        : "Todavía no hay reseñas publicadas. Si ya pasaste por la silla, cuéntanos qué tal — con tu permiso publicamos tu foto y tu nombre."}</p>
      <div class="invita__botones">
        <a class="btn btn--wine btn--sm" href="${wa}" target="_blank" rel="noopener">Dejar mi reseña</a>
        ${google}
      </div>
    </div>`;
})();

/* ══════════════════════════════════════════════════════
   AGENDA EN 3 PASOS
   ══════════════════════════════════════════════════════ */
(function agenda() {
  const raiz = document.getElementById("agenda");
  if (!raiz) return;

  // Si hay Cal.com configurado, esa agenda manda.
  if (CONFIG.calLink) return montarCalCom(raiz);

  const ahora = ahoraColombia();
  const limite = new Date(ahora.dia);
  limite.setDate(limite.getDate() + CONFIG.diasVista);

  const sel = { servicio: null, fecha: null, hora: null };
  let estiloRef = "";   // corte que el cliente eligió en la galería
  let mesVisible = new Date(ahora.dia.getFullYear(), ahora.dia.getMonth(), 1);

  const $ = (s) => raiz.querySelector(s);
  const paneles = raiz.querySelectorAll("[data-panel]");
  const barra = raiz.querySelectorAll("[data-bar]");

  /* ── Navegación entre pasos ── */

  /** Un paso se puede visitar solo si ya está elegido lo anterior. */
  function alcanzable(n) {
    if (n <= 1) return true;
    if (n === 2) return !!sel.servicio;
    return !!sel.servicio && !!sel.fecha && sel.hora !== null;
  }

  /** Apaga los pasos a los que todavía no se puede llegar. */
  function refrescarBarra() {
    barra.forEach((b) => { b.disabled = !alcanzable(+b.dataset.bar); });
  }

  function irA(n) {
    paneles.forEach((p) => { p.hidden = p.dataset.panel !== String(n); });
    barra.forEach((b) => {
      b.classList.toggle("is-active", +b.dataset.bar === n);
      b.classList.toggle("is-hecho", +b.dataset.bar < n);
    });
    refrescarBarra();
    // Solo desplaza si el usuario ya no ve el inicio de la agenda.
    const top = raiz.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) {
      raiz.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Tocar un paso de la barra devuelve a ese paso. Es lo primero que
  // uno intenta para corregir algo, así que tiene que funcionar.
  barra.forEach((b) => {
    b.addEventListener("click", () => {
      const n = +b.dataset.bar;
      if (alcanzable(n)) irA(n);
    });
  });

  raiz.querySelectorAll("[data-volver]").forEach((b) => {
    b.addEventListener("click", () => irA(+b.dataset.volver));
  });

  /* ── Paso 1: servicios ── */
  const lista = $("#agenda-servicios");
  lista.innerHTML = CONFIG.servicios.map((s) => `
    <li>
      <button type="button" class="tarjeta" data-servicio="${s.id}">
        <span class="tarjeta__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24">${ICONOS[s.icono] || ICONOS.tijera}</svg>
        </span>
        <span class="tarjeta__texto">
          <span class="tarjeta__nombre">${s.nombre}</span>
          <span class="tarjeta__min">${s.min} min</span>
        </span>
        <span class="tarjeta__precio">${precio(s.precio)}</span>
      </button>
    </li>`).join("");

  lista.addEventListener("click", (e) => {
    const b = e.target.closest("[data-servicio]");
    if (!b) return;
    sel.servicio = CONFIG.servicios.find((s) => s.id === b.dataset.servicio);
    sel.fecha = sel.hora = null;
    lista.querySelectorAll(".tarjeta").forEach((t) => t.classList.remove("is-sel"));
    b.classList.add("is-sel");
    pintarMes();
    pintarSlots();
    irA(2);
  });

  /* ── Paso 2: calendario ── */
  const grid = $("#cal-grid");

  function abierto(d) {
    if (!CONFIG.horario[d.getDay()]) return false;
    if (CONFIG.cerrado.includes(claveISO(d))) return false;
    return true;
  }

  function pintarMes() {
    $("#cal-month").textContent =
      `${MESES[mesVisible.getMonth()]} ${mesVisible.getFullYear()}`;

    const primero = new Date(mesVisible);
    const offset = (primero.getDay() + 6) % 7;          // semana empieza en lunes
    const dias = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();

    let html = "";
    for (let i = 0; i < offset; i++) html += '<span class="cal__hueco"></span>';

    for (let n = 1; n <= dias; n++) {
      const d = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), n);
      const pasado = d < ahora.dia;
      const lejos = d > limite;
      const libre = abierto(d) && !pasado && !lejos;
      const activo = sel.fecha && claveISO(sel.fecha) === claveISO(d);

      html += `<button type="button" class="cal__dia${activo ? " is-sel" : ""}"
        data-dia="${claveISO(d)}"${libre ? "" : " disabled"}
        aria-label="${fechaLarga(d)}${libre ? "" : " — no disponible"}">${n}</button>`;
    }

    grid.innerHTML = html;

    // Desactiva las flechas fuera del rango que se puede reservar.
    const finMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0);
    $("#cal-prev").disabled =
      mesVisible <= new Date(ahora.dia.getFullYear(), ahora.dia.getMonth(), 1);
    $("#cal-next").disabled = finMes >= limite;
  }

  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-dia]");
    if (!b || b.disabled) return;
    const [y, m, d] = b.dataset.dia.split("-").map(Number);
    sel.fecha = new Date(y, m - 1, d);
    sel.hora = null;          // al cambiar de día hay que volver a elegir hora
    pintarMes();
    pintarSlots();
    refrescarBarra();
  });

  $("#cal-prev").addEventListener("click", () => {
    mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
    pintarMes();
  });
  $("#cal-next").addEventListener("click", () => {
    mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
    pintarMes();
  });

  /* ── Paso 2: horas ── */
  const slots = $("#slots");

  function horasDe(fecha, servicio) {
    const rango = CONFIG.horario[fecha.getDay()];
    if (!rango) return [];
    const [abre, cierra] = rango;
    const esHoy = claveISO(fecha) === claveISO(ahora.dia);
    const minimo = ahora.minutos + CONFIG.anticipacionHoras * 60;

    const out = [];
    for (let t = abre; t + servicio.min <= cierra; t += CONFIG.intervaloMin) {
      if (esHoy && t < minimo) continue;
      out.push(t);
    }
    return out;
  }

  function pintarSlots() {
    const titulo = $("#slots-title");

    if (!sel.fecha) {
      titulo.textContent = "Horas disponibles";
      slots.innerHTML = '<p class="slots__vacio">Elige primero un día en el calendario.</p>';
      return;
    }

    const horas = horasDe(sel.fecha, sel.servicio);
    titulo.textContent = `Horas disponibles — ${cap(fechaLarga(sel.fecha))}`;

    if (!horas.length) {
      slots.innerHTML =
        '<p class="slots__vacio">Ya no quedan cupos ese día. Prueba con otra fecha.</p>';
      return;
    }

    slots.innerHTML = horas.map((t, i) =>
      `<button type="button" class="slot${sel.hora === t ? " is-sel" : ""}"
        data-hora="${t}" style="--i:${i}">${hhmm(t)}</button>`
    ).join("");
  }

  slots.addEventListener("click", (e) => {
    const b = e.target.closest("[data-hora]");
    if (!b) return;
    sel.hora = +b.dataset.hora;
    pintarSlots();
    pintarResumen();
    irA(3);
  });

  /* ── Paso 3: resumen y envío ── */
  function pintarResumen() {
    $("#resumen").innerHTML = `
      <div class="resumen__fila">
        <dt>Servicio</dt>
        <dd>
          <span class="resumen__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24">${ICONOS[sel.servicio.icono]}</svg>
          </span>
          <span>${sel.servicio.nombre}<br><small>${sel.servicio.min} min</small></span>
          <strong>${precio(sel.servicio.precio)}</strong>
        </dd>
      </div>
      <div class="resumen__fila">
        <dt>Fecha</dt><dd><span>${cap(fechaLarga(sel.fecha))}</span></dd>
      </div>
      <div class="resumen__fila">
        <dt>Hora</dt><dd><span>${hhmm(sel.hora)}</span></dd>
      </div>
      ${estiloRef ? `
      <div class="resumen__fila">
        <dt>Corte de referencia</dt><dd><span>${estiloRef}</span></dd>
      </div>` : ""}
      <div class="resumen__fila">
        <dt>Barbero</dt><dd><span>Javi</span></dd>
      </div>
      <div class="resumen__fila resumen__total">
        <dt>Total</dt><dd><strong>${precio(sel.servicio.precio)}</strong></dd>
      </div>`;
  }

  $("#confirmar").addEventListener("click", () => {
    const campo = $("#cliente");
    const nombre = campo.value.trim();

    if (!nombre) {
      campo.classList.add("is-error");
      campo.focus();
      return;
    }
    campo.classList.remove("is-error");

    const texto = [
      "¡Hola Javi! Quiero solicitar una cita en Golden Barber 💈",
      "",
      `• Servicio: ${sel.servicio.nombre} (${sel.servicio.min} min)`,
      `• Fecha: ${fechaLarga(sel.fecha)}`,
      `• Hora: ${hhmm(sel.hora)}`,
      `• Valor: ${precio(sel.servicio.precio)}`,
      ...(estiloRef ? [`• Corte de referencia: ${estiloRef}`] : []),
      `• Nombre: ${nombre}`,
      "",
      "¿Me confirmas el cupo?",
    ].join("\n");

    window.open(
      `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`,
      "_blank", "noopener"
    );
  });

  $("#cliente").addEventListener("input", (e) => e.target.classList.remove("is-error"));

  /* ── Puerta de entrada desde la galería ──
     La usa el visor de cortes para caer aquí con el servicio
     ya elegido y el estilo anotado. */
  window.GoldenAgenda = {
    desdeGaleria(servicioId, estilo) {
      estiloRef = estilo || "";
      const boton = lista.querySelector(`[data-servicio="${servicioId}"]`);
      if (boton) boton.click();          // esto ya deja el paso 2 abierto
      else irA(1);
      raiz.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  };

  /* ── Arranque ── */
  pintarMes();
  pintarSlots();
  refrescarBarra();
})();

/* ══════════════════════════════════════════════════════
   Alternativa: calendario de Cal.com
   Solo se usa si CONFIG.calLink tiene algo.
   ══════════════════════════════════════════════════════ */
function montarCalCom(raiz) {
  raiz.innerHTML = '<div id="cal-inline"></div>';

  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal, ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else { p(cal, ar); }
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", { origin: "https://cal.com" });
  Cal("inline", {
    elementOrSelector: "#cal-inline",
    calLink: CONFIG.calLink,
    layout: "month_view",
  });
  Cal("ui", {
    theme: "light",
    layout: "month_view",
    cssVarsPerTheme: {
      light: {
        "cal-brand": CONFIG.calBrand,
        "cal-bg": "#FBF6EC",
        "cal-bg-emphasis": "#EAE0CD",
        "cal-text": "#141210",
        "cal-border": "rgba(196,160,70,.55)",
        "cal-border-emphasis": "#C4A046",
      },
    },
  });
}

/* ══════════════════════════════════════════════════════
   APARICIÓN AL HACER SCROLL

   Va de último a propósito: las tarjetas de reseña y la
   invitación las crea el bloque de arriba, así que antes de
   este punto todavía no existen en la página.

   El estado escondido lo define styles.css, solo bajo `.js` y
   solo si el visitante no pidió menos animación. Acá únicamente
   se marca lo que ya entró en pantalla.
   ══════════════════════════════════════════════════════ */
(function revelar() {
  const SELECTOR = [
    ".heading", ".about__photo", ".about__copy > *", ".service",
    ".gallery__grid li", ".review", ".invita", ".location__place",
    ".location__hours", ".booking__lead", ".agenda",
    ".services__note", ".gallery__note",
  ].join(",");

  const objetivos = document.querySelectorAll(SELECTOR);
  const mostrarTodo = () => objetivos.forEach((el) => el.classList.add("visible"));

  // Sin soporte o con animación reducida: todo visible de una.
  if (!("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return mostrarTodo();
  }

  // Escalona cada grilla: las tarjetas entran una detrás de otra
  // en vez de todas de golpe.
  [".services__grid", ".gallery__grid", ".reviews__grid"].forEach((sel) => {
    const grupo = document.querySelector(sel);
    if (grupo) [...grupo.children].forEach((h, i) => h.style.setProperty("--i", i));
  });

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      obs.unobserve(e.target);        // una sola vez, no en cada scroll
    });
    // threshold 0: basta con que asome un pixel. Con un umbral por
    // porcentaje, un bloque más alto que la pantalla (la agenda en
    // un celular) puede no alcanzarlo nunca y quedarse invisible.
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

  objetivos.forEach((el) => obs.observe(el));

  // Red de seguridad: si algo quedó escondido estando ya en pantalla,
  // se destapa. Solo aplica a lo que el visitante tiene delante, así
  // que lo de más abajo conserva su aparición al hacer scroll.
  // Contenido invisible es un desastre; una animación perdida, no.
  addEventListener("load", () => setTimeout(() => {
    objetivos.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add("visible");
    });
  }, 2500));
})();

/* ══════════════════════════════════════════════════════
   VISOR DE CORTES

   La galería dejó de ser decoración: se toca una foto, se ve
   grande, y de ahí se pasa a la agenda con ese estilo anotado.
   Así Javi recibe "quiero el mid fade" y no "quiero un corte".
   ══════════════════════════════════════════════════════ */
(function visorCortes() {
  const visor = document.getElementById("visor");
  const fotos = [...document.querySelectorAll(".gallery__grid li")];
  if (!visor || !fotos.length || typeof visor.showModal !== "function") return;

  const img = document.getElementById("visor-img");
  const titulo = document.getElementById("visor-titulo");
  let actual = 0;

  const datos = (i) => {
    const li = fotos[i];
    return {
      src: li.querySelector("img")?.src || "",
      estilo: li.dataset.estilo || "",
      servicio: li.dataset.servicio || "corte",
    };
  };

  function pintar(i) {
    actual = (i + fotos.length) % fotos.length;   // da la vuelta en los extremos
    const d = datos(actual);
    img.src = d.src;
    img.alt = d.estilo;
    titulo.textContent = d.estilo;
  }

  function abrir(i) {
    pintar(i);
    visor.showModal();
    document.body.style.overflow = "hidden";
  }

  visor.addEventListener("close", () => { document.body.style.overflow = ""; });

  fotos.forEach((li, i) => {
    li.querySelector(".foto")?.addEventListener("click", () => abrir(i));
  });

  document.getElementById("visor-ant").addEventListener("click", () => pintar(actual - 1));
  document.getElementById("visor-sig").addEventListener("click", () => pintar(actual + 1));
  document.getElementById("visor-cerrar").addEventListener("click", () => visor.close());

  // Flechas del teclado, además de Esc que ya trae <dialog>.
  visor.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") pintar(actual - 1);
    if (e.key === "ArrowRight") pintar(actual + 1);
  });

  // Clic en el fondo oscuro cierra.
  visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });

  document.getElementById("visor-agendar").addEventListener("click", () => {
    const d = datos(actual);
    visor.close();
    if (window.GoldenAgenda) {
      window.GoldenAgenda.desdeGaleria(d.servicio, d.estilo);
    } else {
      // Con Cal.com activo no existe la agenda propia: se va por WhatsApp.
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=` +
        encodeURIComponent(`¡Hola Javi! Quiero una cita. Me gustó este corte: ${d.estilo}`),
        "_blank", "noopener");
    }
  });
})();
