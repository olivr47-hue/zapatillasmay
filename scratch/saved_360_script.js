  const totalFrames = 17;
  const startNum = 846;
  const images = [];
  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;
  
  // Sensibilidad: píxeles de arrastre por cambio de frame
  const pixelsPerFrame = 12;

  // Construir las URLs de los 17 frames (con cero a la izquierda)
  for (let i = 0; i < totalFrames; i++) {
    images.push(`images/360/_DSC${String(startNum + i).padStart(4, '0')}-Editar.webp`);
  }

  // Precarga diferida: el frame 1 ya está en el HTML (LCP). El resto se carga
  // cuando el navegador está libre, para no competir con el primer pintado.
  function preloadFrames() { images.forEach(u => { const im = new Image(); im.src = u; }); }
  if ('requestIdleCallback' in window) requestIdleCallback(preloadFrames, { timeout: 2500 });
  else window.addEventListener('load', preloadFrames);

  const badge = container.querySelector('.viewer-360-badge');

  // Desactivar comportamientos de arrastre y selección del navegador (Evita el color azul)
  container.addEventListener('dragstart', (e) => e.preventDefault());
  container.addEventListener('selectstart', (e) => e.preventDefault());
  imgElement.addEventListener('dragstart', (e) => e.preventDefault());

  // Controladores de eventos para arrastrar y rotar
  function startDragging(e) {
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    if (badge && badge.style.opacity !== '0') {
      badge.style.transition = 'opacity 0.4s ease';
      badge.style.opacity = '0';
    }
  }

  function drag(e) {
    if (!isDragging) return;
    
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : startX);
    const deltaX = clientX - startX;
    
    const frameOffset = Math.floor(deltaX / pixelsPerFrame);
    
    let nextFrame = (currentFrame - frameOffset) % totalFrames;
    if (nextFrame < 0) nextFrame += totalFrames;
    
    imgElement.src = images[nextFrame];
  }

  function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;

    const clientX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : startX);
    const deltaX = clientX - startX;
    const frameOffset = Math.floor(deltaX / pixelsPerFrame);
    
    currentFrame = (currentFrame - frameOffset) % totalFrames;
    if (currentFrame < 0) currentFrame += totalFrames;
  }

  // Eventos de Mouse (Desktop)
  container.addEventListener('mousedown', startDragging);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', stopDragging);

  // Eventos de Toque (Móvil)
  container.addEventListener('touchstart', startDragging, { passive: true });
  window.addEventListener('touchmove', drag, { passive: true });
  window.addEventListener('touchend', stopDragging);

  // Lógica de Zoom (Lupa y Doble Clic)
  function toggleZoom(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    imgElement.classList.toggle('zoomed');
    if (imgElement.classList.contains('zoomed')) {
      if (btnZoom) {
        btnZoom.innerHTML = '➖';
        btnZoom.style.background = '#C8967A';
        btnZoom.style.color = '#ffffff';
      }
    } else {
      if (btnZoom) {
        btnZoom.innerHTML = '🔍';
        btnZoom.style.background = '#FBF7F3';
        btnZoom.style.color = '#2A1A0E';
      }
    }
  }

  if (btnZoom) btnZoom.addEventListener('click', toggleZoom);
  imgElement.addEventListener('dblclick', toggleZoom);

  // Giro de bienvenida (respeta prefers-reduced-motion)
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let welcomeSpins = 0;
    const welcomeInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % totalFrames;
      imgElement.src = images[currentFrame];
      welcomeSpins++;
      if (welcomeSpins >= 8) clearInterval(welcomeInterval); // Medio giro
    }, 95);
  }
})();
</script>

<!-- ═══ BOTTOM NAV (solo móvil) ═══ -->