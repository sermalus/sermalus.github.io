import * as pdfjsLib from "./vendor/pdfjs/pdf.min.mjs";

if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  import("https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js");
}

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.mjs";

const PDF_URL = "./Portfolio.pdf";
const BASE_PAGE_WIDTH = 800; // Matches Google Drive viewer 100% width (800px)
const ZOOM_STEPS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const KEEP_CANVAS_RANGE = 12;

const appShell = document.getElementById("appShell");
const pageInput = document.getElementById("pageInput");
const pageTotal = document.getElementById("pageTotal");
const downloadBtn = document.getElementById("downloadBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomPresetBtn = document.getElementById("zoomPresetBtn");
const zoomValueLabel = document.getElementById("zoomValueLabel");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomMenu = document.getElementById("zoomMenu");
const headerToggleBtn = document.getElementById("headerToggleBtn");
const thumbnailsToggleBtn = document.getElementById("thumbnailsToggleBtn");
const sidebarCollapseBtn = document.getElementById("sidebarCollapseBtn");
const thumbnailsPane = document.getElementById("thumbnailsPane");
const thumbnailsList = document.getElementById("thumbnailsList");
const readerScroll = document.getElementById("readerScroll");
const readerStatus = document.getElementById("readerStatus");
const documentColumn = document.getElementById("documentColumn");
const photoLightbox = document.getElementById("photoLightbox");
const lightboxCanvas = document.getElementById("lightboxCanvas");

const state = {
  pdfDoc: null,
  numPages: 68,
  basePdfWidth: 1920,
  basePdfHeight: 1080,
  zoom: 1,
  zoomMode: "custom", // "custom" | "fit-width" | "fit-page"
  currentPage: 1,
  pageSlots: [], // { pageNum, el, renderScale, rendering, renderTask }
  thumbSlots: [], // { pageNum, row, frame, rendered }
  photoBoxesCache: new Map(), // pageNum -> Array<{ x, y, w, h }> in scale=1 viewport coords
  pageObserver: null,
  thumbObserver: null,
  isJumping: false,
  scrollTicking: false,
};

const linkService = {
  externalLinkTarget: 2, // BLANK
  externalLinkRel: "noopener noreferrer",
  getDestinationHash() {
    return "#";
  },
  getAnchorUrl(hash) {
    return hash;
  },
  addLinkAttributes(link, url, newWindow) {
    link.href = url;
    if (newWindow) {
      link.target = "_blank";
    }
    link.rel = "noopener noreferrer";
  },
  async goToDestination(dest) {
    if (!state.pdfDoc) return;
    try {
      const explicit = typeof dest === "string"
        ? await state.pdfDoc.getDestination(dest)
        : dest;
      if (!Array.isArray(explicit) || !explicit[0]) return;
      const pageIndex = await state.pdfDoc.getPageIndex(explicit[0]);
      scrollToPage(pageIndex + 1, "smooth");
    } catch {
      // Ignore malformed internal destinations
    }
  },
  goToPage(val) {
    const pageNum = Number(val);
    if (Number.isInteger(pageNum)) {
      scrollToPage(pageNum, "smooth");
    }
  },
};

function getPageDimensions(zoom = state.zoom) {
  const width = Math.round(BASE_PAGE_WIDTH * zoom);
  const aspect = state.basePdfHeight / state.basePdfWidth;
  const height = Math.round(width * aspect);
  return { width, height };
}

function formatZoomLabel() {
  return `${Math.round(state.zoom * 100)} %`;
}

function updateZoomUI() {
  zoomValueLabel.textContent = formatZoomLabel();
  for (const opt of zoomMenu.querySelectorAll(".zoom-option")) {
    const val = opt.dataset.zoom;
    const isMatch =
      (state.zoomMode === val) ||
      (state.zoomMode === "custom" && Number(val) === state.zoom);
    opt.classList.toggle("is-selected", isMatch);
  }
}

function setActivePage(pageNum, { syncInput = true, scrollThumb = true } = {}) {
  const clamped = Math.max(1, Math.min(state.numPages, pageNum));
  if (clamped === state.currentPage && document.activeElement !== pageInput) {
    if (syncInput) pageInput.value = String(clamped);
    return;
  }

  state.currentPage = clamped;
  if (syncInput && document.activeElement !== pageInput) {
    pageInput.value = String(clamped);
  }

  for (const thumb of state.thumbSlots) {
    const active = thumb.pageNum === clamped;
    thumb.row.classList.toggle("is-active", active);
    thumb.row.setAttribute("aria-selected", active ? "true" : "false");
    if (active && scrollThumb && !appShell.classList.contains("is-thumbnails-hidden")) {
      thumb.row.scrollIntoView({ block: "nearest" });
    }
  }
}

function scrollToPage(pageNum, behavior = "smooth") {
  const clamped = Math.max(1, Math.min(state.numPages, pageNum));
  const slot = state.pageSlots[clamped - 1];
  if (!slot) return;

  state.isJumping = true;
  setActivePage(clamped, { syncInput: true, scrollThumb: true });
  slot.el.scrollIntoView({ behavior, block: "start" });
  window.setTimeout(() => {
    state.isJumping = false;
  }, behavior === "smooth" ? 450 : 60);
}

function mulMatrix(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

function applyPoint(m, x, y) {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

function boxFromMinMax(m, mm) {
  const pts = [
    [mm[0], mm[1]],
    [mm[2], mm[1]],
    [mm[0], mm[3]],
    [mm[2], mm[3]],
  ].map(([x, y]) => applyPoint(m, x, y));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX,
    h: Math.max(...ys) - minY,
  };
}

function intersectBox(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  return x2 > x1 && y2 > y1 ? { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } : null;
}

async function getPhotoBoxes(page, pageNum) {
  if (state.photoBoxesCache.has(pageNum)) {
    return state.photoBoxesCache.get(pageNum);
  }

  const OPS = pdfjsLib.OPS;
  const vp = page.getViewport({ scale: 1 });
  const slideBox = { x: 0, y: 0, w: vp.width, h: vp.height };
  const opList = await page.getOperatorList();
  const stack = [];
  let st = { ctm: [...vp.transform], clip: slideBox };
  let pendingClip = false;
  const smaskStack = [];
  const photos = [];

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];

    if (fn === OPS.save) {
      stack.push({ ctm: [...st.ctm], clip: st.clip });
    } else if (fn === OPS.restore) {
      st = stack.pop() || { ctm: [...vp.transform], clip: slideBox };
      pendingClip = false;
    } else if (fn === OPS.transform) {
      st.ctm = mulMatrix(st.ctm, args);
    } else if (fn === OPS.beginGroup) {
      smaskStack.push(Boolean(args?.[0]?.smask));
    } else if (fn === OPS.endGroup) {
      smaskStack.pop();
    } else if (fn === OPS.clip || fn === OPS.eoClip) {
      pendingClip = true;
    } else if (fn === OPS.constructPath) {
      if (pendingClip && args?.[2]) {
        const clipRect = boxFromMinMax(st.ctm, args[2]);
        st.clip = intersectBox(st.clip, clipRect) || { x: 0, y: 0, w: 0, h: 0 };
        pendingClip = false;
      }
    } else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
      if (smaskStack.some(Boolean)) continue;
      const raw = boxFromMinMax(st.ctm, [0, 0, 1, 1]);
      const clipped = intersectBox(raw, st.clip);
      if (!clipped) continue;

      const w = Math.round(clipped.w);
      const h = Math.round(clipped.h);
      const isFullBg = w >= vp.width * 0.96 && h >= vp.height * 0.96;
      if (w >= 130 && h >= 130 && !isFullBg) {
        const box = { x: Math.round(clipped.x), y: Math.round(clipped.y), w, h };
        const dup = photos.some((p) => {
          const inter = intersectBox(p, box);
          return inter && (inter.w * inter.h) / Math.min(p.w * p.h, box.w * box.h) > 0.5;
        });
        if (!dup) photos.push(box);
      }
    }
  }

  state.photoBoxesCache.set(pageNum, photos);
  return photos;
}

async function openPhotoLightbox(pageNum, box) {
  if (!state.pdfDoc) return;
  const maxCssW = Math.min(window.innerWidth * 0.92, 1500);
  const maxCssH = window.innerHeight * 0.9;
  const cssScale = Math.min(maxCssW / box.w, maxCssH / box.h);
  const cssW = Math.max(1, Math.round(box.w * cssScale));
  const cssH = Math.max(1, Math.round(box.h * cssScale));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderScale = cssScale * dpr;

  lightboxCanvas.width = Math.ceil(box.w * renderScale);
  lightboxCanvas.height = Math.ceil(box.h * renderScale);
  lightboxCanvas.style.width = `${cssW}px`;
  lightboxCanvas.style.height = `${cssH}px`;

  const ctx = lightboxCanvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, lightboxCanvas.width, lightboxCanvas.height);

  if (!photoLightbox.open) {
    photoLightbox.showModal();
  }

  const page = await state.pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: renderScale });
  await page.render({
    canvasContext: ctx,
    viewport,
    transform: [1, 0, 0, 1, -box.x * renderScale, -box.y * renderScale],
  }).promise;
}

function buildPlaceholders() {
  const { width, height } = getPageDimensions();
  const pageFrag = document.createDocumentFragment();
  const thumbFrag = document.createDocumentFragment();

  documentColumn.innerHTML = "";
  thumbnailsList.innerHTML = "";
  state.pageSlots = [];
  state.thumbSlots = [];

  for (let pageNum = 1; pageNum <= state.numPages; pageNum++) {
    const pageEl = document.createElement("div");
    pageEl.className = "pdf-page";
    pageEl.dataset.page = String(pageNum);
    pageEl.style.width = `${width}px`;
    pageEl.style.height = `${height}px`;
    pageFrag.appendChild(pageEl);

    state.pageSlots.push({
      pageNum,
      el: pageEl,
      renderScale: 0,
      rendering: false,
      renderTask: null,
    });

    const row = document.createElement("button");
    row.type = "button";
    row.className = "thumb-row" + (pageNum === 1 ? " is-active" : "");
    row.role = "option";
    row.setAttribute("aria-selected", pageNum === 1 ? "true" : "false");
    row.setAttribute("aria-label", `Page ${pageNum}`);
    row.dataset.page = String(pageNum);

    const num = document.createElement("span");
    num.className = "thumb-num";
    num.textContent = String(pageNum);

    const frame = document.createElement("div");
    frame.className = "thumb-frame";
    frame.style.aspectRatio = `${state.basePdfWidth} / ${state.basePdfHeight}`;

    row.append(num, frame);
    row.addEventListener("click", () => {
      scrollToPage(pageNum, "smooth");
      if (window.innerWidth < 768) {
        toggleThumbnails(false);
      }
    });
    thumbFrag.appendChild(row);

    state.thumbSlots.push({
      pageNum,
      row,
      frame,
      rendered: false,
      rendering: false,
    });
  }

  documentColumn.appendChild(pageFrag);
  thumbnailsList.appendChild(thumbFrag);
}

async function renderPageSlot(slot) {
  if (!state.pdfDoc) return;
  const { width, height } = getPageDimensions();
  const targetPdfScale = width / state.basePdfWidth;

  if (slot.renderScale === targetPdfScale && slot.el.childElementCount > 0) {
    return;
  }

  if (slot.renderTask) {
    try {
      slot.renderTask.cancel();
    } catch {
      // Ignore cancel errors
    }
    slot.renderTask = null;
  }

  slot.rendering = true;
  const requestedScale = targetPdfScale;

  try {
    const page = await state.pdfDoc.getPage(slot.pageNum);
    if (requestedScale !== getPageDimensions().width / state.basePdfWidth) {
      slot.rendering = false;
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const maxSupersample = Math.max(1, Math.floor(2880 / width));
    const supersample = Math.min(
      maxSupersample,
      Math.max(2, Math.ceil(1600 / width), Math.ceil(dpr * 2))
    );
    const renderW = Math.round(width * supersample);
    const renderH = Math.round(height * supersample);
    const viewport = page.getViewport({ scale: requestedScale });
    const renderViewport = page.getViewport({ scale: renderW / state.basePdfWidth });

    const canvas = document.createElement("canvas");
    canvas.width = renderW;
    canvas.height = renderH;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const drawCtx = canvas.getContext("2d", { alpha: false });
    const renderTask = page.render({
      canvasContext: drawCtx,
      viewport: renderViewport,
    });
    slot.renderTask = renderTask;
    await renderTask.promise;
    slot.renderTask = null;

    if (requestedScale !== getPageDimensions().width / state.basePdfWidth) {
      slot.rendering = false;
      return;
    }

    const textLayerDiv = document.createElement("div");
    textLayerDiv.className = "textLayer";

    const annotationLayerDiv = document.createElement("div");
    annotationLayerDiv.className = "annotationLayer";

    const photoLayerDiv = document.createElement("div");
    photoLayerDiv.className = "photoLayer";

    slot.el.style.setProperty("--scale-factor", String(viewport.scale));
    slot.el.style.setProperty("--total-scale-factor", String(viewport.scale));
    slot.el.replaceChildren(canvas, textLayerDiv, photoLayerDiv, annotationLayerDiv);
    slot.renderScale = requestedScale;

    if (slot.pageNum === 1 && !readerStatus.hidden) {
      readerStatus.hidden = true;
    }

    // Render selectable text layer, interactive photo hotspots, and clickable links layer
    const textContent = await page.getTextContent();
    if (slot.renderScale === requestedScale && slot.el.contains(textLayerDiv)) {
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
      });
      await textLayer.render();
    }

    const photoBoxes = await getPhotoBoxes(page, slot.pageNum);
    if (
      photoBoxes.length > 0 &&
      slot.renderScale === requestedScale &&
      slot.el.contains(photoLayerDiv)
    ) {
      const frag = document.createDocumentFragment();
      photoBoxes.forEach((box, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "photo-hotspot";
        btn.setAttribute("aria-label", `Enlarge image ${idx + 1} on page ${slot.pageNum}`);
        btn.style.left = `${(box.x / state.basePdfWidth) * 100}%`;
        btn.style.top = `${(box.y / state.basePdfHeight) * 100}%`;
        btn.style.width = `${(box.w / state.basePdfWidth) * 100}%`;
        btn.style.height = `${(box.h / state.basePdfHeight) * 100}%`;
        btn.addEventListener("click", () => openPhotoLightbox(slot.pageNum, box));
        frag.appendChild(btn);
      });
      photoLayerDiv.appendChild(frag);
    }

    const annotations = await page.getAnnotations();
    if (
      annotations.length > 0 &&
      slot.renderScale === requestedScale &&
      slot.el.contains(annotationLayerDiv)
    ) {
      const annotationLayer = new pdfjsLib.AnnotationLayer({
        div: annotationLayerDiv,
        page,
        viewport: viewport.clone({ dontFlip: true }),
        linkService,
      });
      await annotationLayer.render({ annotations });
    }

    evictDistantPages();
  } catch (err) {
    if (err?.name !== "RenderingCancelledException") {
      console.error(`Failed to render page ${slot.pageNum}:`, err);
    }
  } finally {
    slot.rendering = false;
  }
}

function evictDistantPages() {
  for (const slot of state.pageSlots) {
    if (
      slot.renderScale !== 0 &&
      Math.abs(slot.pageNum - state.currentPage) > KEEP_CANVAS_RANGE
    ) {
      if (slot.renderTask) {
        try {
          slot.renderTask.cancel();
        } catch {
          // Ignore
        }
        slot.renderTask = null;
      }
      slot.el.replaceChildren();
      slot.renderScale = 0;
    }
  }
}

async function renderThumbSlot(thumb) {
  if (!state.pdfDoc || thumb.rendered || thumb.rendering) return;
  thumb.rendering = true;

  try {
    const page = await state.pdfDoc.getPage(thumb.pageNum);
    const dpr = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    const thumbScale = (71 * dpr) / state.basePdfWidth;
    const viewport = page.getViewport({ scale: thumbScale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    const ctx = canvas.getContext("2d", { alpha: false });
    await page.render({ canvasContext: ctx, viewport }).promise;

    thumb.frame.replaceChildren(canvas);
    thumb.rendered = true;
  } catch (err) {
    console.error(`Failed to render thumbnail ${thumb.pageNum}:`, err);
  } finally {
    thumb.rendering = false;
  }
}

function setupObservers() {
  state.pageObserver?.disconnect();
  state.thumbObserver?.disconnect();

  state.pageObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const pageNum = Number(entry.target.dataset.page);
        const slot = state.pageSlots[pageNum - 1];
        if (slot) renderPageSlot(slot);
      }
    },
    { root: readerScroll, rootMargin: "800px 0px" }
  );

  for (const slot of state.pageSlots) {
    state.pageObserver.observe(slot.el);
  }

  state.thumbObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const pageNum = Number(entry.target.dataset.page);
        const thumb = state.thumbSlots[pageNum - 1];
        if (thumb) renderThumbSlot(thumb);
      }
    },
    { root: thumbnailsPane, rootMargin: "300px 0px" }
  );

  for (const thumb of state.thumbSlots) {
    state.thumbObserver.observe(thumb.row);
  }
}

function computeVisiblePage() {
  if (state.isJumping || state.pageSlots.length === 0) return;
  const containerRect = readerScroll.getBoundingClientRect();
  const focusY = containerRect.top + containerRect.height * 0.35;

  let bestPage = state.currentPage;
  let bestDist = Infinity;

  for (const slot of state.pageSlots) {
    const rect = slot.el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const dist = Math.abs(center - focusY);
    if (dist < bestDist) {
      bestDist = dist;
      bestPage = slot.pageNum;
    }
  }

  setActivePage(bestPage, { syncInput: true, scrollThumb: true });
}

function computeFitZoom(mode) {
  const availWidth = Math.max(240, readerScroll.clientWidth - 36);
  const availHeight = Math.max(200, readerScroll.clientHeight - 32);
  const aspect = state.basePdfHeight / state.basePdfWidth;

  if (mode === "fit-width") {
    return Math.max(0.25, Math.min(2.5, availWidth / BASE_PAGE_WIDTH));
  }
  const pageHeightAt1 = BASE_PAGE_WIDTH * aspect;
  return Math.max(
    0.25,
    Math.min(2.5, Math.min(availWidth / BASE_PAGE_WIDTH, availHeight / pageHeightAt1))
  );
}

function applyZoom(newZoom, mode = "custom") {
  const clampedZoom = Math.max(0.25, Math.min(2.5, Number(newZoom.toFixed(4))));
  const scrollRatio =
    readerScroll.scrollHeight > readerScroll.clientHeight
      ? readerScroll.scrollTop / (readerScroll.scrollHeight - readerScroll.clientHeight)
      : 0;

  state.zoom = clampedZoom;
  state.zoomMode = mode;
  const { width, height } = getPageDimensions(clampedZoom);

  for (const slot of state.pageSlots) {
    slot.el.style.width = `${width}px`;
    slot.el.style.height = `${height}px`;
    slot.renderScale = 0; // Mark stale so visible ones re-render sharply
  }

  updateZoomUI();

  if (readerScroll.scrollHeight > readerScroll.clientHeight) {
    readerScroll.scrollTop =
      scrollRatio * (readerScroll.scrollHeight - readerScroll.clientHeight);
  }

  // Immediately re-render currently visible pages
  const viewRect = readerScroll.getBoundingClientRect();
  for (const slot of state.pageSlots) {
    const r = slot.el.getBoundingClientRect();
    if (r.bottom >= viewRect.top - 800 && r.top <= viewRect.bottom + 800) {
      renderPageSlot(slot);
    }
  }
}

function stepZoom(direction) {
  const current = state.zoom;
  if (direction > 0) {
    const next = ZOOM_STEPS.find((z) => z > current + 0.01) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1];
    applyZoom(next, "custom");
  } else {
    const prev = [...ZOOM_STEPS].reverse().find((z) => z < current - 0.01) ?? ZOOM_STEPS[0];
    applyZoom(prev, "custom");
  }
}

function toggleThumbnails(forceState) {
  const isCurrentlyHidden = appShell.classList.contains("is-thumbnails-hidden");
  const show = typeof forceState === "boolean" ? forceState : isCurrentlyHidden;

  appShell.classList.toggle("is-thumbnails-hidden", !show);
  thumbnailsToggleBtn.classList.toggle("is-active", show);
  thumbnailsToggleBtn.setAttribute("aria-pressed", show ? "true" : "false");
  sidebarCollapseBtn.setAttribute("aria-pressed", show ? "false" : "true");
  sidebarCollapseBtn.title = show ? "Hide side panel" : "Show side panel";

  if (state.zoomMode === "fit-width" || state.zoomMode === "fit-page") {
    window.setTimeout(() => applyZoom(computeFitZoom(state.zoomMode), state.zoomMode), 170);
  }
}

function toggleHeader() {
  const collapsed = appShell.classList.toggle("is-header-collapsed");
  headerToggleBtn.setAttribute("aria-pressed", collapsed ? "true" : "false");
  headerToggleBtn.title = collapsed ? "Show top bar" : "Hide top bar";

  if (state.zoomMode === "fit-page") {
    window.setTimeout(() => applyZoom(computeFitZoom("fit-page"), "fit-page"), 170);
  }
}

function positionZoomPopoverFallback() {
  if (CSS.supports("position-area: block-end")) return;
  const rect = zoomPresetBtn.getBoundingClientRect();
  zoomMenu.style.top = `${Math.round(rect.bottom + 6)}px`;
  zoomMenu.style.left = `${Math.round(rect.left)}px`;
}

function triggerDownload() {
  const a = document.createElement("a");
  a.href = PDF_URL;
  a.download = "Portfolio.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    // Fullscreen blocked or unsupported
  }
}

function bindEvents() {
  readerScroll.addEventListener("scroll", () => {
    if (state.scrollTicking) return;
    state.scrollTicking = true;
    requestAnimationFrame(() => {
      computeVisiblePage();
      state.scrollTicking = false;
    });
  });

  pageInput.addEventListener("focus", () => pageInput.select());
  pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pageInput.blur();
    } else if (e.key === "Escape") {
      pageInput.value = String(state.currentPage);
      pageInput.blur();
    }
  });
  pageInput.addEventListener("blur", () => {
    const parsed = Number.parseInt(pageInput.value.trim(), 10);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= state.numPages) {
      scrollToPage(parsed, "auto");
    } else {
      pageInput.value = String(state.currentPage);
    }
  });

  downloadBtn.addEventListener("click", triggerDownload);
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Fallback for browsers without <dialog closedby="any">
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    photoLightbox.addEventListener("pointerdown", (e) => {
      pressedOutside = isOutside(e, photoLightbox);
    });
    photoLightbox.addEventListener("pointerup", (e) => {
      if (pressedOutside && isOutside(e, photoLightbox)) {
        photoLightbox.close();
      }
    });
  }

  photoLightbox.addEventListener("close", () => {
    photoLightbox.returnValue = "";
  });

  document.addEventListener("fullscreenchange", () => {
    const isFs = Boolean(document.fullscreenElement);
    appShell.classList.toggle("is-fullscreen", isFs);
    fullscreenBtn.setAttribute("aria-pressed", isFs ? "true" : "false");
    fullscreenBtn.title = isFs ? "Exit fullscreen" : "Fullscreen";
  });

  zoomOutBtn.addEventListener("click", () => stepZoom(-1));
  zoomInBtn.addEventListener("click", () => stepZoom(1));

  zoomMenu.addEventListener("beforetoggle", (e) => {
    if (e.newState === "open") {
      positionZoomPopoverFallback();
    }
  });

  zoomMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".zoom-option");
    if (!btn) return;
    const val = btn.dataset.zoom;
    if (val === "fit-width" || val === "fit-page") {
      applyZoom(computeFitZoom(val), val);
    } else {
      applyZoom(Number(val), "custom");
    }
    zoomMenu.hidePopover?.();
  });

  headerToggleBtn.addEventListener("click", toggleHeader);
  thumbnailsToggleBtn.addEventListener("click", () => toggleThumbnails());
  sidebarCollapseBtn.addEventListener("click", () => toggleThumbnails());

  readerScroll.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        stepZoom(e.deltaY < 0 ? 1 : -1);
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (document.activeElement === pageInput) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
      e.preventDefault();
      stepZoom(1);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
      e.preventDefault();
      stepZoom(-1);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
      e.preventDefault();
      applyZoom(1, "custom");
    } else if (e.key === "ArrowRight" || e.key === "PageDown") {
      if (state.currentPage < state.numPages) {
        e.preventDefault();
        scrollToPage(state.currentPage + 1, "smooth");
      }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      if (state.currentPage > 1) {
        e.preventDefault();
        scrollToPage(state.currentPage - 1, "smooth");
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToPage(1, "smooth");
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToPage(state.numPages, "smooth");
    }
  });

  window.addEventListener("resize", () => {
    if (state.zoomMode === "fit-width" || state.zoomMode === "fit-page") {
      applyZoom(computeFitZoom(state.zoomMode), state.zoomMode);
    }
  });
}

async function init() {
  bindEvents();

  if (window.innerWidth < 768) {
    toggleThumbnails(false);
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      url: PDF_URL,
      rangeChunkSize: 65536,
    });
    state.pdfDoc = await loadingTask.promise;
    state.numPages = state.pdfDoc.numPages;
    pageTotal.textContent = `of ${state.numPages}`;

    const firstPage = await state.pdfDoc.getPage(1);
    const vp = firstPage.getViewport({ scale: 1 });
    state.basePdfWidth = vp.width;
    state.basePdfHeight = vp.height;

    const availWidth = readerScroll.clientWidth - 36;
    if (availWidth < BASE_PAGE_WIDTH) {
      state.zoom = computeFitZoom("fit-width");
      state.zoomMode = "fit-width";
    } else {
      state.zoom = 1;
      state.zoomMode = "custom";
    }
    updateZoomUI();

    buildPlaceholders();
    setupObservers();

    const hashMatch = window.location.hash.match(/page=(\d+)/i);
    const initialPage = hashMatch
      ? Math.max(1, Math.min(state.numPages, Number.parseInt(hashMatch[1], 10)))
      : 1;

    setActivePage(initialPage, { syncInput: true, scrollThumb: initialPage > 1 });

    if (initialPage > 1 && state.pageSlots[initialPage - 1]) {
      scrollToPage(initialPage, "auto");
      await renderPageSlot(state.pageSlots[initialPage - 1]);
    } else if (state.pageSlots[0]) {
      // Eagerly render page 1 so first impression is instant
      await renderPageSlot(state.pageSlots[0]);
    }
  } catch (err) {
    console.error("Failed to load Portfolio.pdf:", err);
    readerStatus.hidden = false;
    readerStatus.textContent =
      "Could not load Portfolio.pdf. Serve this folder over HTTP(S) (e.g. GitHub Pages or a local server).";
  }
}

init();
