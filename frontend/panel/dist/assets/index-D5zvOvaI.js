(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const f="/api",Se=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],Ke=[{nombre:"Negro",hex:"#000000"},{nombre:"Blanco",hex:"#FFFFFF"},{nombre:"Hueso",hex:"#F5F0E8"},{nombre:"Nude claro",hex:"#F5DCC8"},{nombre:"Nude",hex:"#E8C4A0"},{nombre:"Nude oscuro",hex:"#C49A7A"},{nombre:"Nude rosa",hex:"#F2C4B0"},{nombre:"Palo de rosa",hex:"#D4A096"},{nombre:"Beige",hex:"#E8D5B0"},{nombre:"Camel",hex:"#C19A6B"},{nombre:"Miel",hex:"#B8860B"},{nombre:"Cafe claro",hex:"#A0785A"},{nombre:"Cafe medio",hex:"#7B4F2E"},{nombre:"Cafe oscuro",hex:"#4A2C1A"},{nombre:"Chocolate",hex:"#3B1F0E"},{nombre:"Cognac",hex:"#8B4513"},{nombre:"Taupe",hex:"#8B7D6B"},{nombre:"Gris claro",hex:"#C0C0C0"},{nombre:"Gris",hex:"#808080"},{nombre:"Gris oscuro",hex:"#404040"},{nombre:"Rojo",hex:"#CC0000"},{nombre:"Vino",hex:"#722F37"},{nombre:"Bordo",hex:"#800020"},{nombre:"Rosa claro",hex:"#FFB6C1"},{nombre:"Rosa",hex:"#FF69B4"},{nombre:"Fusha",hex:"#E91E8C"},{nombre:"Coral",hex:"#FF6B6B"},{nombre:"Salmon",hex:"#FA8072"},{nombre:"Naranja",hex:"#FF6600"},{nombre:"Amarillo",hex:"#FFD700"},{nombre:"Dorado",hex:"#C8A951"},{nombre:"Plateado",hex:"#A8A8A8"},{nombre:"Azul claro",hex:"#6CA0DC"},{nombre:"Azul",hex:"#0000CC"},{nombre:"Azul marino",hex:"#001F5B"},{nombre:"Turquesa",hex:"#40E0D0"},{nombre:"Verde",hex:"#006400"},{nombre:"Verde menta",hex:"#98FF98"},{nombre:"Morado",hex:"#800080"},{nombre:"Lila",hex:"#C8A2C8"},{nombre:"Multicolor",hex:"#FF69B4"}],Ze=[{value:"tacones",label:"Tacones",prefix:"TAC"},{value:"sandalias",label:"Sandalias",prefix:"SAN"},{value:"botas",label:"Botas",prefix:"BOT"},{value:"botines",label:"Botines",prefix:"BTN"},{value:"flats",label:"Flats",prefix:"FLT"},{value:"plataformas",label:"Plataformas",prefix:"PLT"},{value:"tenis",label:"Tenis",prefix:"TEN"},{value:"nina",label:"Calzado de nina",prefix:"NIN"},{value:"accesorios",label:"Accesorios",prefix:"ACC"}],ie=[{id:"dashboard",icon:"📊",label:"Dashboard",section:"Principal",soloAdmin:!0},{id:"pos",icon:"🛒",label:"Punto de venta",section:"Principal"},{id:"productos",icon:"👠",label:"Productos",section:"Catalogo"},{id:"inventario",icon:"📦",label:"Inventario",section:"Catalogo"},{id:"carritos",icon:"🛒",label:"Carritos",section:"Ventas"},{id:"pedidos",icon:"🛍️",label:"Pedidos",section:"Ventas"},{id:"clientes",icon:"👥",label:"Clientes",section:"Ventas"},{id:"historial",icon:"📋",label:"Historial",section:"Ventas"},{id:"analisis",icon:"📈",label:"Analisis",section:"Ventas"},{id:"crm",icon:"🎯",label:"CRM",section:"Ventas"},{id:"finanzas",icon:"💰",label:"Finanzas",section:"Finanzas",soloAdmin:!0},{id:"proveedores",icon:"🏭",label:"Proveedores",section:"Finanzas",soloAdmin:!0},{id:"sucursales",icon:"🏪",label:"Sucursales",section:"Configuracion",soloAdmin:!0},{id:"empleados",icon:"👤",label:"Empleados",section:"Configuracion",soloAdmin:!0},{id:"seo",icon:"🔍",label:"SEO y Sitio",section:"Configuracion",soloAdmin:!0},{id:"envio",icon:"🚚",label:"Envíos",section:"Configuracion",soloAdmin:!0},{id:"ordenes",icon:"🛒",label:"Órdenes de compra",section:"Finanzas",soloAdmin:!0},{id:"conversaciones",icon:"💬",label:"Conversaciones",section:"Ventas"},{id:"envios",icon:"📣",label:"Envíos masivos",section:"Ventas"},{id:"catalogos",icon:"📖",label:"Catálogos",section:"Catalogo",soloAdmin:!0},{id:"orden-home",icon:"🏠",label:"Orden en Home",section:"Catalogo",soloAdmin:!0},{id:"generar-nombres",icon:"✏️",label:"Generar nombres",section:"Catalogo",soloAdmin:!0},{id:"mercadolibre",icon:"🛒",label:"MercadoLibre",section:"Integraciones",soloAdmin:!0},{id:"analytics",icon:"📊",label:"Google Analytics",section:"Integraciones",soloAdmin:!0},{id:"referidos",icon:"🎁",label:"Referidos",section:"Ventas",soloAdmin:!0},{id:"carritos-abandonados",icon:"🛒",label:"Carritos abandonados",section:"Ventas",soloAdmin:!0}];var ze;let te=((ze=window._empleadoActual)==null?void 0:ze.rol)==="admin"?"dashboard":"pos",ge=1;function Ie(){var i,r;const e=(()=>{try{return localStorage.getItem("zm_panel_modulo")}catch{return null}})(),t=((i=window._empleadoActual)==null?void 0:i.rol)==="admin"?"dashboard":"pos";te=e||t,document.querySelector("#app").innerHTML=`
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2>Zapatillas <span>May</span></h2>
        <p>Panel de administracion</p>
      </div>
      <nav class="sidebar-nav">
        ${Ye()}
      </nav>
    </div>
    <div class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="hamburger" onclick="toggleSidebar()">☰</button>
          <h1 id="topbar-title">${((r=ie.find(s=>s.id===te))==null?void 0:r.label)||"Dashboard"}</h1>
        </div>
        <div class="topbar-actions">
          <span style="font-size:0.8rem;color:#888">${window._empleadoActual?window._empleadoActual.nombre:"Leon, Gto."}</span>
          <button onclick="cerrarSesionPanel()" style="background:none;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#8892a4;cursor:pointer;font-family:DM Sans,sans-serif">Salir</button>
        </div>
      </div>
      <div class="content" id="content">
        ${Qe()}
      </div>
    </div>
  `,window.toggleSidebar=()=>{const s=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay"),l=s.classList.toggle("open");d.classList.toggle("active",l),document.body.style.overflow=l?"hidden":""},window._conversacionesInterval&&clearInterval(window._conversacionesInterval),window._conversacionesInterval=setInterval(async()=>{try{const s=await window._recargarChats(),d=window._totalNoLeidos||0,l=s.reduce((c,p)=>c+(p.no_leidos||0),0);if(window._totalNoLeidos=l,l>d){document.title=`(${l}) Zapatillas May`;const c=document.querySelector('[data-modulo="conversaciones"]');if(c){let p=c.querySelector(".nav-badge");p||(p=document.createElement("span"),p.className="nav-badge",p.style.cssText="background:#e91e8c;color:white;border-radius:100px;padding:1px 6px;font-size:0.65rem;font-weight:700;margin-left:auto",c.appendChild(p)),p.textContent=l}try{const p=new(window.AudioContext||window.webkitAudioContext),m=p.createOscillator(),g=p.createGain();m.connect(g),g.connect(p.destination),m.frequency.value=523,g.gain.setValueAtTime(.5,p.currentTime),g.gain.exponentialRampToValueAtTime(.001,p.currentTime+.2),m.start(p.currentTime),m.stop(p.currentTime+.2);const u=p.createOscillator(),b=p.createGain();u.connect(b),b.connect(p.destination),u.frequency.value=783,b.gain.setValueAtTime(.5,p.currentTime+.2),b.gain.exponentialRampToValueAtTime(.001,p.currentTime+.5),u.start(p.currentTime+.2),u.stop(p.currentTime+.5)}catch{}}try{window._refrescarListaChats(s)}catch{}if(window._chatActivo&&window._chatsData[window._chatActivo]){const c=window._chatsData[window._chatActivo],p=document.getElementById("mensajes-area");if(p){const m=p.scrollHeight-p.scrollTop<=p.clientHeight+60;p.innerHTML=window._renderBurbujas(c),m&&(p.scrollTop=p.scrollHeight)}}}catch{}},8e3);let o=new Set;async function a(){try{const s=await fetch(f+"/pedidos/?status=pagado");if(!s.ok)return;const l=(await s.json()).filter(u=>u.mp_preference_id),c=l.length,p=document.getElementById("badge-pedidos-enviar");p&&(p.textContent=c,p.style.display=c>0?"inline":"none");const m=new Set(l.map(u=>u.id)),g=l.filter(u=>!o.has(u.id));g.length>0&&o.size>0&&g.forEach(u=>{const b=u.nombre_cliente||"Cliente",v=parseFloat(u.total||0).toLocaleString("es-MX",{maximumFractionDigits:0});n(`🛍️ Nuevo pedido de ${b} — $${v} MXN`)}),o=m}catch{}}function n(s){const d=document.createElement("div");d.style.cssText="position:fixed;bottom:24px;right:24px;background:#1a1a2e;color:white;padding:14px 20px;border-radius:12px;font-size:0.85rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:9999;cursor:pointer;max-width:320px;line-height:1.4;border-left:4px solid #e53935",d.textContent=s,d.onclick=()=>{navegarA("pedidos"),d.remove()},document.body.appendChild(d),setTimeout(()=>d.remove(),8e3),Notification.permission==="granted"?new Notification("Zapatillas May — Panel",{body:s,icon:"/favicon.ico"}):Notification.permission==="default"&&Notification.requestPermission();try{const l=new AudioContext,c=l.createOscillator(),p=l.createGain();c.connect(p),p.connect(l.destination),c.frequency.setValueAtTime(880,l.currentTime),c.frequency.setValueAtTime(1100,l.currentTime+.1),p.gain.setValueAtTime(.15,l.currentTime),p.gain.exponentialRampToValueAtTime(.001,l.currentTime+.4),c.start(),c.stop(l.currentTime+.4)}catch{}}window._limpiarBadgePedidos=function(){const s=document.getElementById("badge-pedidos-enviar");s&&(s.style.display="none"),o=new Set([...o])},a(),setInterval(a,6e4),window.navegarA=s=>{var m;const d=((m=window._empleadoActual)==null?void 0:m.rol)==="admin",l=ie.find(g=>g.id===s);if(l!=null&&l.soloAdmin&&!d){alert("No tienes permisos para acceder a este módulo");return}te=s;try{localStorage.setItem("zm_panel_modulo",s)}catch{}const c=document.getElementById("sidebar"),p=document.getElementById("sidebar-overlay");c.classList.contains("open")&&(c.classList.remove("open"),p.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(g=>g.classList.remove("active")),document.querySelector('[data-modulo="'+s+'"]').classList.add("active"),document.getElementById("topbar-title").textContent=ie.find(g=>g.id===s).label,Te(s)}}function Ye(){var o;const e=((o=window._empleadoActual)==null?void 0:o.rol)==="admin";return[...new Set(ie.filter(a=>e||!a.soloAdmin).map(a=>a.section))].map(a=>`
    <div class="nav-section">${a}</div>
    ${ie.filter(n=>n.section===a&&(e||!n.soloAdmin)).map(n=>`
      <div class="nav-item ${n.id===te?"active":""}"
           data-modulo="${n.id}"
           onclick="navegarA('${n.id}')">
        <span class="nav-icon">${n.icon}</span>
        ${n.label}
        ${n.id==="pedidos"?'<span id="badge-pedidos-enviar" style="display:none;background:#e53935;color:white;border-radius:100px;font-size:0.65rem;font-weight:700;padding:1px 6px;margin-left:auto">0</span>':""}
      </div>
    `).join("")}
  `).join("")}async function Te(e){var o;const t=document.getElementById("content");switch(t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>',e){case"catalogos":await xe();break;case"dashboard":t.innerHTML=et(),setTimeout(()=>rt(),100);break;case"productos":await pe();break;case"clientes":await Be();break;case"carritos":await Ee();break;case"pedidos":await Oe(),(o=window._limpiarBadgePedidos)==null||o.call(window);break;case"sucursales":await ot();break;case"inventario":await at();break;case"pos":await De();break;case"historial":await Fe();break;case"empleados":await He();break;case"seo":await lt();break;case"envio":await dt();break;case"analisis":await tt();break;case"crm":await Pe();break;case"finanzas":await se();break;case"proveedores":await je();break;case"ordenes":await re();break;case"conversaciones":await cargarConversaciones();break;case"envios":await cargarEnviosMasivos();break;case"mercadolibre":await pt();break;case"analytics":await ut();break;case"orden-home":await mt();break;case"generar-nombres":await ht();break;case"referidos":await $e();break;case"carritos-abandonados":await st();break}}function Qe(){return setTimeout(()=>{document.querySelectorAll(".nav-item").forEach(a=>a.classList.remove("active"));const e=document.querySelector('[data-modulo="'+te+'"]');e&&e.classList.add("active");const t=document.getElementById("topbar-title"),o=ie.find(a=>a.id===te);t&&o&&(t.textContent=o.label),Te(te)},100),'<div style="padding:2rem;color:#888;text-align:center">Cargando...</div>'}async function re(){var t;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando sugerencias...</p>';try{const a=await(await fetch(f+"/sucursales/")).json(),n=(t=a[0])==null?void 0:t.id,[i,r]=await Promise.all([fetch(f+"/finanzas/sugerencias-recompra/"+n),fetch(f+"/finanzas/proveedores")]),s=await i.json(),d=await r.json(),l=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),c=new Date().toISOString().split("T")[0],p=s.filter(v=>{const y=l[v.producto_id];return y?y.hasta===null||y.hasta===void 0?!1:y.hasta<=c:!0}),m=s.length-p.length;window._ordenesData={sugerencias:p,proveedores:d,sucursalId:n},window._ordenSeleccion={};const g=p.filter(v=>v.urgente),u=p.filter(v=>!v.urgente),b=p.reduce((v,y)=>v+y.cantidad_sugerida*y.costo_unitario,0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🛒 Órdenes de compra</h2>
          <p style="color:#888;font-size:0.85rem">Sugerencias de recompra basadas en rotación e inventario</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="ord-sucursal" style="max-width:200px" onchange="recargarOrdenes(this.value)">
            ${a.map(v=>`<option value="${v.id}">${v.nombre}</option>`).join("")}
          </select>
          <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${g.length}</p>
          <p style="font-size:0.68rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🚨 Urgentes</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${u.length}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⚠️ Por resurtir</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#333">${p.reduce((v,y)=>v+y.cantidad_sugerida,0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Pares sugeridos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${b.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Costo estimado</p>
        </div>
        ${m>0?`
        <div style="background:#f3e5f5;border-radius:12px;padding:1.25rem;border:1px solid #ce93d8;text-align:center;cursor:pointer" onclick="verPospuestos()">
          <p style="font-size:1.6rem;font-weight:700;color:#6a1b9a">${m}</p>
          <p style="font-size:0.68rem;color:#6a1b9a;text-transform:uppercase;letter-spacing:0.5px">⏸️ Pospuestos</p>
        </div>`:""}
      </div>

      ${p.length===0?`<div style="background:white;border-radius:12px;padding:3rem;text-align:center;border:1px solid #eee">
            <p style="font-size:2rem;margin-bottom:1rem">✅</p>
            <p style="font-weight:700;font-size:1rem;margin-bottom:4px">Todo el inventario está bien</p>
            <p style="color:#888;font-size:0.85rem">No hay productos que necesiten resurtido</p>
          </div>`:`
          <!-- SELECCIONAR TODOS -->
          <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:center;gap:12px">
                <input type="checkbox" id="sel-todos" onchange="seleccionarTodos(this.checked)" style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C">
                <p style="font-weight:700;font-size:0.9rem">Productos a resurtir (${p.length})</p>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary" style="font-size:0.78rem" onclick="filtrarOrdenes('todos')">Todos</button>
                <button class="btn btn-secondary" style="font-size:0.78rem;background:#ffebee;border-color:#c62828;color:#c62828" onclick="filtrarOrdenes('urgente')">🚨 Urgentes</button>
              </div>
            </div>

            ${p.map(v=>`
              <div class="orden-item" data-urgente="${v.urgente}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                <input type="checkbox" class="orden-check" data-id="${v.producto_id}" onchange="actualizarSeleccion('${v.producto_id}', this.checked)"
                       style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C;flex-shrink:0">
                ${v.imagen?`<img src="${v.imagen}" style="width:52px;height:52px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
                <div style="flex:1;min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                    <p style="font-weight:700;font-size:0.9rem">${v.nombre}</p>
                    ${v.urgente?'<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">🚨 URGENTE</span>':'<span style="background:#fff8e1;color:#f57f17;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">⚠️ BAJO</span>'}
                  </div>
                  <p style="font-size:0.75rem;color:#888">${v.sku||""} · Stock: ${v.stock_total} pares · Mín: ${v.stock_minimo}</p>
                  <p style="font-size:0.72rem;color:#888">${v.velocidad_semanal} pares/sem · ${v.dias_inventario?v.dias_inventario+" días de stock":"Sin ventas recientes"}</p>
                  ${v.proveedor?`<p style="font-size:0.72rem;color:#6a1b9a;margin-top:2px">🏭 ${v.proveedor.nombre}</p>`:'<p style="font-size:0.72rem;color:#aaa;margin-top:2px">Sin proveedor asignado</p>'}
                  ${v.variantes&&v.variantes.length>0?`
                  <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
                    ${v.variantes.map(y=>{const h=[y.talla,y.color].filter(Boolean).join(" / "),w=y.sin_stock;return`<span style="
                        padding:2px 7px;border-radius:100px;font-size:0.68rem;font-weight:600;
                        ${w?"background:#ffebee;color:#c62828;border:1px solid #ef9a9a":"background:#f5f5f5;color:#666;border:1px solid #e0e0e0"}
                      " title="${w?"Sin stock":"Stock: "+y.stock}">${h}${w?" ✗":""}</span>`}).join("")}
                  </div>`:""}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Sugerido</p>
                    <input type="number" min="1" value="${v.cantidad_sugerida}"
                           id="qty-orden-${v.producto_id}"
                           style="width:60px;text-align:center;border:1px solid #ddd;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700"
                           oninput="actualizarCostoOrden()">
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Costo/par</p>
                    <p style="font-weight:700;color:#333;font-size:0.9rem">$${v.costo_unitario.toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Subtotal</p>
                    <p id="sub-${v.producto_id}" style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${(v.cantidad_sugerida*v.costo_unitario).toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">⏸️</p>
                    <button onclick="posponerProducto('${v.producto_id}', '${v.nombre.replace(/'/g,"")}')"
                            title="Posponer — no aparecerá por un tiempo"
                            style="background:none;border:1px solid #e0e0e0;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:0.78rem;color:#999">Posponer</button>
                  </div>
                </div>
              </div>
            `).join("")}

            <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <span id="ord-seleccionados" style="font-size:0.85rem;color:#888">0 productos seleccionados</span>
              <div style="display:flex;align-items:center;gap:16px">
                <div>
                  <span style="font-size:0.85rem;color:#888">Total estimado: </span>
                  <span id="ord-total" style="font-weight:700;color:#E91E8C;font-size:1.1rem">$0</span>
                </div>
                <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden de compra</button>
              </div>
            </div>
          </div>
        `}
    `}catch(o){e.innerHTML='<p style="padding:2rem;color:red">Error: '+o.message+"</p>"}}window.seleccionarTodos=e=>{document.querySelectorAll(".orden-check").forEach(t=>{t.checked=e;const o=t.dataset.id;window._ordenSeleccion[o]=e}),actualizarCostoOrden()};window.actualizarSeleccion=(e,t)=>{window._ordenSeleccion[e]=t,actualizarCostoOrden()};window.actualizarCostoOrden=()=>{const{sugerencias:e}=window._ordenesData;let t=0,o=0;e.forEach(i=>{var r;if(window._ordenSeleccion[i.producto_id]){const d=parseInt(((r=document.getElementById("qty-orden-"+i.producto_id))==null?void 0:r.value)||i.cantidad_sugerida)*i.costo_unitario;t+=d,o++;const l=document.getElementById("sub-"+i.producto_id);l&&(l.textContent="$"+d.toFixed(0))}});const a=document.getElementById("ord-total"),n=document.getElementById("ord-seleccionados");a&&(a.textContent="$"+t.toFixed(0)),n&&(n.textContent=o+" productos seleccionados")};window.filtrarOrdenes=e=>{document.querySelectorAll(".orden-item").forEach(t=>{t.style.display=e==="todos"||e==="urgente"&&t.dataset.urgente==="true"?"":"none"})};window.recargarOrdenes=async e=>{const t=await fetch(f+"/finanzas/sugerencias-recompra/"+e);window._ordenesData.sugerencias=await t.json(),window._ordenesData.sucursalId=e,re()};window.generarOrden=()=>{const{sugerencias:e,proveedores:t,sucursalId:o}=window._ordenesData,a=e.filter(i=>window._ordenSeleccion[i.producto_id]);if(a.length===0){alert("Selecciona al menos un producto para generar la orden");return}window._ordenModal={seleccionados:a,sucursalId:o};const n=document.createElement("div");n.id="modal-orden",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto",n.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:780px;width:100%;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <h3 style="font-size:1.1rem;font-weight:700">📋 Orden de compra</h3>
        <button onclick="document.getElementById('modal-orden').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal destino</label>
          <select class="form-input" id="orden-sucursal">
            <option value="${o}">Sucursal actual</option>
          </select>
        </div>
        <div>
          <label class="form-label">Fecha de entrega estimada</label>
          <input class="form-input" type="date" id="orden-fecha" value="${new Date(Date.now()+7*24*60*60*1e3).toISOString().split("T")[0]}">
        </div>
      </div>

      <div style="margin-bottom:1.25rem">
        <label class="form-label">Notas</label>
        <textarea class="form-input" id="orden-notas" rows="2" placeholder="Condiciones de entrega, forma de pago..."></textarea>
      </div>

      ${a.map(i=>{const r=(i.variantes||[]).filter(l=>l.sin_stock),s=(i.variantes||[]).filter(l=>!l.sin_stock),d=[...r,...s];return`
        <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span style="font-weight:700;font-size:0.95rem">${i.nombre}</span>
              <span style="color:#888;font-size:0.75rem;margin-left:8px">${i.sku||""}</span>
              ${i.proveedor?`<span style="color:#6a1b9a;font-size:0.75rem;margin-left:8px">· 🏭 ${i.proveedor.nombre}</span>`:""}
            </div>
            <span style="font-size:0.8rem;color:#888;font-weight:600">$${i.costo_unitario.toFixed(0)}/par</span>
          </div>
          ${d.length>0?`
          <table style="width:100%;font-size:0.8rem;border-collapse:collapse">
            <thead>
              <tr style="background:#eeeeee">
                <th style="padding:5px 8px;text-align:left;font-weight:600;border-radius:4px 0 0 4px">Incluir</th>
                <th style="padding:5px 8px;text-align:left;font-weight:600">Talla</th>
                <th style="padding:5px 8px;text-align:left;font-weight:600">Color</th>
                <th style="padding:5px 8px;text-align:center;font-weight:600">Stock actual</th>
                <th style="padding:5px 8px;text-align:center;font-weight:600;border-radius:0 4px 4px 0">Pedir (pares)</th>
              </tr>
            </thead>
            <tbody>
              ${d.map(l=>`
              <tr style="border-bottom:1px solid #f0f0f0;${l.sin_stock?"background:#fff8f8":""}">
                <td style="padding:5px 8px">
                  <input type="checkbox" id="chk-var-${l.id}" ${l.sin_stock?"checked":""}
                         onchange="ordenToggleVar('${l.id}', this.checked)"
                         style="accent-color:#E91E8C;cursor:pointer;width:15px;height:15px">
                </td>
                <td style="padding:5px 8px;font-weight:${l.sin_stock?"700":"400"}">${l.talla||"-"}</td>
                <td style="padding:5px 8px;color:${l.sin_stock?"#c62828":"#555"}">${l.color||"-"}</td>
                <td style="text-align:center;padding:5px 8px">
                  <span style="background:${l.sin_stock?"#ffebee":"#e8f5e9"};color:${l.sin_stock?"#c62828":"#2e7d32"};padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600">${l.stock}</span>
                </td>
                <td style="text-align:center;padding:5px 8px">
                  <input type="number" id="qty-var-${l.id}" min="0" value="${l.sin_stock?1:0}"
                         ${l.sin_stock?"":"disabled"}
                         onchange="ordenRecalcTotal()"
                         style="width:55px;text-align:center;border:1px solid ${l.sin_stock?"#E91E8C":"#ddd"};border-radius:6px;padding:3px 5px;font-size:0.85rem;${l.sin_stock?"":"opacity:0.35"}">
                </td>
              </tr>`).join("")}
            </tbody>
          </table>`:`<p style="font-size:0.8rem;color:#aaa;margin-top:4px">Sin variantes registradas — pedir ${i.cantidad_sugerida} pares en total</p>`}
        </div>`}).join("")}

      <div style="background:#e8f5e9;border-radius:8px;padding:1rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <span style="font-weight:700">Total general</span>
        <span id="orden-total-general" style="font-weight:700;font-size:1.2rem;color:#2e7d32">$0</span>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="document.getElementById('modal-orden').remove()">Cancelar</button>
        <button class="btn btn-secondary" onclick="imprimirOrden()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">🖨️ Imprimir</button>
        <button class="btn btn-primary" onclick="guardarOrdenCompra2()">💾 Guardar orden</button>
      </div>
    </div>
  `,document.body.appendChild(n),n.addEventListener("click",i=>{i.target===n&&n.remove()}),setTimeout(ordenRecalcTotal,50)};window.guardarOrdenCompra=async e=>{var n,i,r;const t=(n=document.getElementById("orden-fecha"))==null?void 0:n.value,o=((i=document.getElementById("orden-notas"))==null?void 0:i.value)||"",a=window._ordenesData.sucursalId;try{const s=typeof e=="string"?JSON.parse(e):e;for(const[d,l]of s){const c=l.productos.reduce((u,b)=>u+b.cantidad_final*b.costo_unitario,0),g=(r=(await(await fetch(f+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:d==="sin-proveedor"?null:d,sucursal_id:a,status:"borrador",total:c,notas:o,fecha_entrega_estimada:t||null})})).json())[0])==null?void 0:r.id;if(g)for(const u of l.productos)await fetch(f+"/finanzas/ordenes/"+g+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:null,cantidad:u.cantidad_final,costo_unitario:u.costo_unitario,subtotal:u.cantidad_final*u.costo_unitario})})}document.querySelector('div[style*="position:fixed"]').remove(),alert("Orden de compra guardada exitosamente"),re()}catch(s){alert("Error guardando orden: "+s.message)}};window.ordenToggleVar=(e,t)=>{const o=document.getElementById("qty-var-"+e);o&&(o.disabled=!t,o.style.opacity=t?"1":"0.35",o.style.borderColor=t?"#E91E8C":"#ddd",t&&(!o.value||o.value==="0")?o.value=1:t||(o.value=0),ordenRecalcTotal())};window.ordenRecalcTotal=()=>{const{seleccionados:e}=window._ordenModal||{};if(!e)return;let t=0;e.forEach(a=>{var n;if((a.variantes||[]).forEach(i=>{var d;const r=document.getElementById("chk-var-"+i.id),s=parseInt(((d=document.getElementById("qty-var-"+i.id))==null?void 0:d.value)||0);r!=null&&r.checked&&s>0&&(t+=s*a.costo_unitario)}),!a.variantes||a.variantes.length===0){const i=parseInt(((n=document.getElementById("qty-orden-"+a.producto_id))==null?void 0:n.value)||a.cantidad_sugerida);t+=i*a.costo_unitario}});const o=document.getElementById("orden-total-general");o&&(o.textContent="$"+t.toFixed(0))};window.imprimirOrden=()=>{var s,d;const{seleccionados:e}=window._ordenModal||{};if(!e)return;const t=((s=document.getElementById("orden-fecha"))==null?void 0:s.value)||"",o=((d=document.getElementById("orden-notas"))==null?void 0:d.value)||"",a=new Date().toLocaleDateString("es-MX");let n="",i=0;e.forEach(l=>{var p;const c=l.variantes||[];if(c.length===0){const m=parseInt(((p=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:p.value)||l.cantidad_sugerida),g=m*l.costo_unitario;i+=g,n+=`<tr><td>${l.nombre}</td><td>${l.sku||""}</td><td>—</td><td>—</td><td style="text-align:center">${m}</td><td style="text-align:right">$${g.toFixed(0)}</td></tr>`}else c.forEach(m=>{var v;const g=document.getElementById("chk-var-"+m.id);if(!(g!=null&&g.checked))return;const u=parseInt(((v=document.getElementById("qty-var-"+m.id))==null?void 0:v.value)||0);if(u<=0)return;const b=u*l.costo_unitario;i+=b,n+=`<tr style="${m.sin_stock?"background:#fff5f5":""}">
          <td style="font-weight:${m.sin_stock?"bold":"normal"}">${l.nombre}</td>
          <td style="color:#777">${l.sku||""}</td>
          <td>${m.talla||"—"}</td>
          <td>${m.color||"—"}</td>
          <td style="text-align:center;font-weight:bold">${u}</td>
          <td style="text-align:right">$${b.toFixed(0)}</td>
        </tr>`})});const r=window.open("","_blank");r.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Orden de compra</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; padding: 24px; color: #222; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  .meta { color: #666; font-size: 11px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { background: #f0f0f0; padding: 7px 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #ddd; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; vertical-align: middle; }
  .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 13px; padding-top: 10px; }
  @media print {
    body { padding: 10px; }
    button { display: none; }
  }
</style>
</head><body>
  <h1>📋 Orden de compra</h1>
  <div class="meta">
    Fecha de emisión: ${a}
    ${t?" &nbsp;|&nbsp; Entrega estimada: "+t:""}
    ${o?" &nbsp;|&nbsp; Notas: "+o:""}
  </div>
  <table>
    <thead>
      <tr>
        <th>Modelo</th><th>SKU</th><th>Talla</th><th>Color</th>
        <th style="text-align:center">Pares</th><th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${n}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4">TOTAL GENERAL</td>
        <td></td>
        <td style="text-align:right">$${i.toFixed(0)}</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => window.print()<\/script>
</body></html>`),r.document.close()};window.posponerProducto=(e,t)=>{const o=document.getElementById("modal-posponer");o&&o.remove();const a=document.createElement("div");a.id="modal-posponer",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:1100;display:flex;align-items:center;justify-content:center",a.innerHTML=`
    <div style="background:white;border-radius:14px;padding:1.5rem;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
      <p style="font-weight:700;font-size:1rem;margin-bottom:4px">⏸️ Posponer producto</p>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${t}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 7)" style="text-align:left">📅 7 días — revisaré la próxima semana</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 30)" style="text-align:left">📅 30 días — esperar el mes que entra</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', null)" style="text-align:left;color:#c62828;border-color:#ef9a9a">🚫 No pedir por ahora (indefinido)</button>
      </div>
      <button onclick="document.getElementById('modal-posponer').remove()" style="margin-top:1rem;width:100%;background:none;border:none;color:#aaa;cursor:pointer;font-size:0.82rem">Cancelar</button>
    </div>`,a.addEventListener("click",n=>{n.target===a&&a.remove()}),document.body.appendChild(a)};window.aplicarPosponer=(e,t)=>{var n;const o=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}");let a=null;if(t!==null){const i=new Date;i.setDate(i.getDate()+t),a=i.toISOString().split("T")[0]}o[e]={hasta:a},localStorage.setItem("ordenes_pospuestos",JSON.stringify(o)),(n=document.getElementById("modal-posponer"))==null||n.remove(),re()};window.verPospuestos=()=>{const e=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),{sugerencias:t}=window._ordenesData;new Date().toISOString().split("T")[0];const o=Object.entries(e).map(([n,i])=>{const r=i.nombre||n,s=i.hasta?"hasta "+i.hasta:"indefinido";return`• ${r} — ${s}`}).join(`
`);if(!o){alert("No hay productos pospuestos.");return}confirm(`Productos pospuestos:

`+o+`

¿Quieres reactivar todos?`)&&(localStorage.removeItem("ordenes_pospuestos"),re())};window.guardarOrdenCompra2=async()=>{var i,r,s,d;const{seleccionados:e,sucursalId:t}=window._ordenModal||{};if(!e)return;const o=(i=document.getElementById("orden-fecha"))==null?void 0:i.value,a=((r=document.getElementById("orden-notas"))==null?void 0:r.value)||"",n={};e.forEach(l=>{var g,u;const c=l.proveedor_id||"sin-proveedor",p=((g=l.proveedor)==null?void 0:g.nombre)||"Sin proveedor";n[c]||(n[c]={nombre:p,items:[]});const m=l.variantes||[];if(m.length===0){const b=parseInt(((u=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:u.value)||l.cantidad_sugerida);n[c].items.push({variante_id:null,cantidad:b,costo_unitario:l.costo_unitario})}else m.forEach(b=>{var h;const v=document.getElementById("chk-var-"+b.id);if(!(v!=null&&v.checked))return;const y=parseInt(((h=document.getElementById("qty-var-"+b.id))==null?void 0:h.value)||0);y<=0||n[c].items.push({variante_id:b.id,cantidad:y,costo_unitario:l.costo_unitario})})});try{for(const[l,c]of Object.entries(n)){if(c.items.length===0)continue;const p=c.items.reduce((b,v)=>b+v.cantidad*v.costo_unitario,0),u=(s=(await(await fetch(f+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:l==="sin-proveedor"?null:l,sucursal_id:t,status:"borrador",total:p,notas:a,fecha_entrega_estimada:o||null})})).json())[0])==null?void 0:s.id;if(u)for(const b of c.items)await fetch(f+"/finanzas/ordenes/"+u+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...b,subtotal:b.cantidad*b.costo_unitario})})}(d=document.getElementById("modal-orden"))==null||d.remove(),alert("Orden de compra guardada"),re()}catch(l){alert("Error guardando orden: "+l.message)}};function et(){var o;const e=new Date().toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long"});return`
    <div id="dashboard-contenido">

      <!-- ROW 1: Banner + 2 KPI cards -->
      <div class="dash-row-1" style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px;align-items:stretch">

        <div class="dash-banner">
          <div style="position:relative;z-index:1">
            <p style="font-size:0.63rem;font-weight:700;letter-spacing:0.14em;color:var(--pink);text-transform:uppercase;margin:0 0 8px">Panel de control</p>
            <h2 style="font-size:1.55rem;font-weight:800;color:#fff;line-height:1.15;margin:0 0 6px;letter-spacing:-0.01em">¡Bienvenida, ${(((o=window._empleadoActual)==null?void 0:o.nombre)||"May").split(" ")[0]}! 👋</h2>
            <p style="font-size:0.76rem;color:rgba(255,255,255,0.35);margin:0 0 18px;text-transform:capitalize">${e}</p>
            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
              <span style="font-size:1.9rem;font-weight:900;color:#fff;font-family:'DM Mono',monospace;letter-spacing:-0.03em" id="kpi-ventas-hoy">—</span>
              <span style="font-size:0.73rem;color:rgba(255,255,255,0.45)">ventas hoy</span>
            </div>
            <p style="font-size:0.73rem;color:var(--pink);margin:0 0 20px" id="kpi-ventas-hoy-sub"></p>
            <button onclick="navegarA('pedidos')" style="background:var(--pink);border:none;color:white;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:0.78rem;font-weight:700;cursor:pointer">Ver pedidos →</button>
          </div>
          <div style="position:relative;z-index:1;flex-shrink:0">
            <div style="width:96px;height:96px;background:rgba(200,150,122,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.8rem;border:1px solid rgba(200,150,122,0.20)">👠</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="dash-kpi-v" style="flex:1">
            <div class="dash-kpi-icon" style="background:var(--pink-soft)">🛍️</div>
            <p class="dash-kpi-lbl">Pedidos hoy</p>
            <p class="dash-kpi-val" id="kpi-pedidos-hoy">—</p>
            <p class="dash-kpi-sub" id="kpi-pedidos-hoy-sub"></p>
          </div>
          <div class="dash-kpi-v" style="flex:1;cursor:pointer" onclick="navegarA('inventario')">
            <div class="dash-kpi-icon" style="background:var(--amber-soft)">📦</div>
            <p class="dash-kpi-lbl">Stock bajo</p>
            <p class="dash-kpi-val" id="kpi-stock-bajo">—</p>
            <p class="dash-kpi-sub" id="kpi-stock-bajo-sub"></p>
          </div>
        </div>

      </div>

      <!-- ROW 2: Gráfica ingresos + 4 mini KPIs -->
      <div class="dash-row-2" style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px;align-items:start">

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header">
            <div>
              <p class="dash-card-title">Ingresos — últimos 7 días</p>
              <p class="dash-card-sub">Tendencia de ventas recientes</p>
            </div>
            <button onclick="cargarDashboard()" class="dash-refresh-btn" title="Actualizar">↻</button>
          </div>
          <div style="height:190px;position:relative;margin-top:12px"><canvas id="chart-tendencia"></canvas></div>
        </div>

        <div class="dash-kpi-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:11px">
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Ventas 7 días</p>
            <p class="dash-kpi-mini-val" id="kpi-ventas-7d">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-ventas-7d-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Ventas 30 días</p>
            <p class="dash-kpi-mini-val" id="kpi-ventas-30d">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-ventas-30d-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Clientes nuevos</p>
            <p class="dash-kpi-mini-val" id="kpi-clientes-nuevos">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-clientes-nuevos-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Mejor día</p>
            <p class="dash-kpi-mini-val" id="kpi-mejor-dia">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-mejor-dia-sub"></p>
          </div>
        </div>

      </div>

      <!-- ROW 3: Canales + Tabs + Últimos pedidos -->
      <div class="dash-row-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;align-items:start">

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:16px">
            <div>
              <p class="dash-card-title">Canales de venta</p>
              <p class="dash-card-sub">Distribución acumulada</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px">
            <div style="height:110px;width:110px;flex-shrink:0;position:relative"><canvas id="chart-canales"></canvas></div>
            <div id="dash-canales-lista" style="flex:1;min-width:0"></div>
          </div>
        </div>

        <div class="dash-card" style="padding:20px 22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <p class="dash-card-title">Estadísticas</p>
            <div style="display:flex;gap:4px">
              <button class="dash-tab-btn active" onclick="dashSwitchTab('dias',this)">Días</button>
              <button class="dash-tab-btn" onclick="dashSwitchTab('meses',this)">Meses</button>
              <button class="dash-tab-btn" onclick="dashSwitchTab('pagos',this)">Pagos</button>
            </div>
          </div>
          <div id="dash-tab-dias" style="height:160px;position:relative"><canvas id="chart-dias"></canvas></div>
          <div id="dash-tab-meses" style="height:160px;position:relative;display:none"><canvas id="chart-meses"></canvas></div>
          <div id="dash-tab-pagos" style="height:160px;position:relative;display:none"><canvas id="chart-pagos"></canvas></div>
        </div>

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:14px">
            <p class="dash-card-title">Últimos pedidos</p>
            <button onclick="navegarA('pedidos')" style="font-size:0.72rem;color:var(--pink);background:none;border:none;cursor:pointer;font-family:inherit;font-weight:600;padding:0;white-space:nowrap">Ver todos →</button>
          </div>
          <div id="dash-ultimos-pedidos"><div style="color:var(--text-3);font-size:0.85rem">Cargando...</div></div>
        </div>

      </div>

      <!-- ROW 4: Top clientes + Total clientes KPI -->
      <div class="dash-row-4" style="display:grid;grid-template-columns:3fr 1fr;gap:16px;margin-bottom:16px;align-items:start">
        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:14px">
            <p class="dash-card-title">Top clientes — 30 días</p>
          </div>
          <div id="dash-top-clientes"><div style="color:var(--text-3);font-size:0.85rem">Cargando...</div></div>
        </div>
        <div class="dash-kpi-v">
          <div class="dash-kpi-icon" style="background:var(--cyan-soft)">👥</div>
          <p class="dash-kpi-lbl">Total clientes</p>
          <p class="dash-kpi-val" id="kpi-total-clientes">—</p>
          <p class="dash-kpi-sub" id="kpi-total-clientes-sub"></p>
        </div>
      </div>

    </div>
  `}async function se(){var t,o,a,n,i,r;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando finanzas...</p>';try{const d=await(await fetch(f+"/sucursales/")).json(),l=(t=d[0])==null?void 0:t.id,[c,p,m,g,u,b,v]=await Promise.all([fetch(f+"/finanzas/caja/hoy/"+l),fetch(f+"/finanzas/reporte/"+l),fetch(f+"/finanzas/gastos/"+l),fetch(f+"/finanzas/estado-resultados/"+l),fetch(f+"/finanzas/flujo/"+l),fetch(f+"/finanzas/cuentas-por-cobrar"),fetch(f+"/finanzas/gastos-categorias/"+l)]),y=await c.json(),h=await p.json(),w=await m.json(),_=await g.json(),x=await u.json(),z=await b.json(),B=await v.json(),$=y.find(A=>A.status==="abierta"),C=new Date().toISOString().split("T")[0],G=w.filter(A=>{var k;return(k=A.created_at)==null?void 0:k.startsWith(C)}),S=G.reduce((A,k)=>A+parseFloat(k.monto||0),0),M=z.reduce((A,k)=>A+parseFloat(k.total||0),0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">💰 Finanzas</h2>
          <p style="color:#888;font-size:0.85rem">Control de caja, gastos y reportes financieros</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="fin-sucursal" style="max-width:200px" onchange="recargarFinanzas(this.value)">
            ${d.map(A=>`<option value="${A.id}">${A.nombre}</option>`).join("")}
          </select>
          ${$?`<button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="cerrarCaja('${$.id}')">🔒 Cerrar caja</button>`:`<button class="btn btn-primary" onclick="abrirCaja('${l}')">🔓 Abrir caja</button>`}
        </div>
      </div>

      <!-- ESTADO CAJA -->
      <div style="background:${$?"#e8f5e9":"#ffebee"};border-radius:12px;padding:1.25rem;border:1px solid ${$?"#a5d6a7":"#ffcdd2"};margin-bottom:1.5rem;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <span style="font-size:2rem">${$?"🟢":"🔴"}</span>
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem;color:${$?"#2e7d32":"#c62828"}">Caja ${$?"ABIERTA":"CERRADA"}</p>
          <p style="font-size:0.82rem;color:#888">${$?`Abierta a las ${new Date($.hora_apertura).toLocaleTimeString("es-MX")} · Fondo: $${$.monto_apertura}`:"No hay caja abierta hoy"}</p>
        </div>
        ${$?`
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#2e7d32">$${(((o=x.hoy)==null?void 0:o.efectivo)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Efectivo</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#1565c0">$${(((a=x.hoy)==null?void 0:a.tarjeta)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Tarjeta</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#6a1b9a">$${(((n=x.hoy)==null?void 0:n.spei)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">SPEI</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#E91E8C">$${(((i=x.hoy)==null?void 0:i.total)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Total hoy</p>
            </div>
          </div>
        `:""}
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#E91E8C">$${(h.total_ventas||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#b5651d">$${(h.cmv||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Costo mercancía</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#c62828">$${(h.total_gastos||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Gastos operativos</p>
        </div>
        <div style="background:${(h.utilidad_bruta||0)>=0?"#e3f2fd":"#ffebee"};border-radius:12px;padding:1.25rem;border:1px solid ${(h.utilidad_bruta||0)>=0?"#90caf9":"#ffcdd2"};text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#1565c0">$${(h.utilidad_bruta||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Utilidad bruta</p>
          <p style="font-size:0.6rem;color:#aaa;margin-top:2px">ventas − costo</p>
        </div>
        <div style="background:${(h.utilidad||0)>=0?"#e8f5e9":"#ffebee"};border-radius:12px;padding:1.25rem;border:1px solid ${(h.utilidad||0)>=0?"#a5d6a7":"#ffcdd2"};text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:${(h.utilidad||0)>=0?"#2e7d32":"#c62828"}">$${(h.utilidad||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Utilidad neta</p>
          <p style="font-size:0.6rem;color:#aaa;margin-top:2px">ventas − costo − gastos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(((r=x.semana)==null?void 0:r.ingresos)||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ingresos 7 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(h.ticket_promedio||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarCxC()">
          <p style="font-size:1.5rem;font-weight:700;color:#f57f17">$${M.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">Cuentas x cobrar</p>
        </div>
      </div>

      <!-- TABS -->
      <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('gastos')">💸 Gastos</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('cmv')">📦 Costo mercancía</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('estado')">📊 Estado de resultados</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('flujo')">💧 Flujo de efectivo</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('caja')">📋 Historial caja</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('cxc')">📑 Cuentas x cobrar</button>
      </div>

      <div id="fin-tab-contenido"></div>
    `,window._finanzasData={sucursalId:l,gastosHoy:G,totalGastosHoy:S,estadoResultados:_,flujo:x,cxc:z,categorias:B,historial:[],reporte:h},window._finanzasSucursalId=l;const j=await(await fetch(f+"/finanzas/caja/historial/"+l)).json();window._finanzasData.historial=j,mostrarTabFinanzas("gastos")}catch(s){e.innerHTML='<p style="padding:2rem;color:red">Error cargando finanzas: '+s.message+"</p>"}}window.mostrarTabFinanzas=e=>{var c,p,m,g,u,b,v,y,h,w,_,x,z,B;const{gastosHoy:t,totalGastosHoy:o,estadoResultados:a,flujo:n,cxc:i,categorias:r,historial:s,sucursalId:d}=window._finanzasData,l=document.getElementById("fin-tab-contenido");if(l)if(e==="cmv"){const $=((c=window._finanzasData.reporte)==null?void 0:c.desglose_cmv)||[],C=window._finanzasData.reporte||{},G=$.reduce((A,k)=>A+k.subtotal_costo,0),S=$.reduce((A,k)=>A+k.subtotal_venta,0),M=S>0?(S-G)/S*100:0,D=C.num_pedidos_sin_desglose||0,j=C.total_sin_desglose||0;l.innerHTML=`
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <p style="font-weight:700;font-size:0.9rem">📦 Desglose de costo de mercancía — 30 días</p>
          <div style="display:flex;gap:16px;font-size:0.82rem">
            <span>Total vendido: <strong style="color:#E91E8C">$${S.toLocaleString("es-MX",{maximumFractionDigits:0})}</strong></span>
            <span>Costo total: <strong style="color:#b5651d">$${G.toLocaleString("es-MX",{maximumFractionDigits:0})}</strong></span>
            <span>Margen bruto: <strong style="color:${M>=0?"#2e7d32":"#c62828"}">${M.toFixed(1)}%</strong></span>
          </div>
        </div>
        ${D>0?`
        <div style="background:#fff8e1;border-bottom:1px solid #ffe082;padding:12px 20px;font-size:0.83rem;color:#6d4c00;display:flex;align-items:center;gap:10px">
          <span style="font-size:1.1rem">⚠️</span>
          <span><strong>${D} pedido${D>1?"s":""} ($${j.toLocaleString("es-MX",{maximumFractionDigits:0})} MXN)</strong> no tienen productos desglosados — por eso "Ventas 30 días" es mayor que "Venta total" aquí. Son ventas registradas sin items individuales (POS antiguo o pedidos manuales sin productos).</span>
        </div>`:""}
        ${$.length===0?'<p style="padding:2rem;text-align:center;color:#888">Sin ventas con costo registrado en los últimos 30 días</p>':`<div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:0.83rem">
              <thead>
                <tr style="background:#fafafa;border-bottom:2px solid #eee">
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#555">Producto</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#555">Color / Talla</th>
                  <th style="padding:10px 8px;text-align:center;font-weight:600;color:#555">Pares</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Costo/par</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Costo total</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Precio venta</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Venta total</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Margen</th>
                </tr>
              </thead>
              <tbody>
                ${$.map(A=>{const k=A.subtotal_venta>0?(A.subtotal_venta-A.subtotal_costo)/A.subtotal_venta*100:0,P=k>=30?"#2e7d32":k>=15?"#f57f17":"#c62828";return`<tr style="border-bottom:1px solid #f5f5f5">
                    <td style="padding:10px 14px">
                      <p style="font-weight:600">${A.nombre}</p>
                      <p style="font-size:0.72rem;color:#aaa;font-family:monospace">${A.sku}</p>
                    </td>
                    <td style="padding:10px 14px;color:#666">${[A.color,A.talla?"T"+A.talla:""].filter(Boolean).join(" · ")||"—"}</td>
                    <td style="padding:10px 8px;text-align:center;font-weight:700">${A.cantidad}</td>
                    <td style="padding:10px 8px;text-align:right;color:#b5651d">$${A.costo_unitario.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:#b5651d">$${A.subtotal_costo.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;color:#555">$${A.precio_venta.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:#E91E8C">$${A.subtotal_venta.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:${P}">${k.toFixed(1)}%</td>
                  </tr>`}).join("")}
              </tbody>
              <tfoot>
                <tr style="background:#f9f9f9;border-top:2px solid #eee;font-weight:700">
                  <td colspan="4" style="padding:10px 14px">TOTAL</td>
                  <td style="padding:10px 8px;text-align:right;color:#b5651d">$${G.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                  <td></td>
                  <td style="padding:10px 8px;text-align:right;color:#E91E8C">$${S.toLocaleString("es-MX",{maximumFractionDigits:0})}</td>
                  <td style="padding:10px 8px;text-align:right;color:${M>=0?"#2e7d32":"#c62828"}">${M.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>`}
      </div>
    `}else if(e==="gastos"){const $=r.reduce((C,G)=>C+G.total,0);l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">💸 Gastos del día</p>
            <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.78rem" onclick="agregarGasto('${d}')">+ Agregar</button>
          </div>
          ${t.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin gastos hoy</div>':t.map(C=>`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${C.concepto}</p>
                  <p style="font-size:0.72rem;color:#888">${C.categoria} · ${new Date(C.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <p style="font-weight:700;color:#c62828">-$${parseFloat(C.monto).toFixed(2)}</p>
                <button onclick="eliminarGasto('${C.id}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem">✕</button>
              </div>
            `).join("")}
          <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;justify-content:space-between">
            <span style="font-size:0.85rem;font-weight:600">Total gastos hoy</span>
            <span style="font-weight:700;color:#c62828">-$${o.toFixed(2)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
            <p style="font-weight:700;font-size:0.9rem">📊 Gastos por categoría (30 días)</p>
          </div>
          <div style="padding:1rem">
            ${r.length===0?'<p style="color:#888;text-align:center;padding:1rem">Sin gastos registrados</p>':r.map(C=>`
                <div style="margin-bottom:12px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize">${C.categoria}</span>
                    <span style="font-size:0.82rem;color:#c62828;font-weight:700">$${C.total.toFixed(0)}</span>
                  </div>
                  <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden">
                    <div style="background:#E91E8C;height:100%;width:${$>0?(C.total/$*100).toFixed(0):0}%;border-radius:100px;transition:width 0.5s"></div>
                  </div>
                </div>
              `).join("")}
          </div>
        </div>
      </div>
    `}else e==="estado"?l.innerHTML=`
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📊 Estado de resultados — últimos 6 meses</p>
        </div>
        <div style="overflow-x:auto">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ventas</th>
                <th>Gastos</th>
                <th>Utilidad</th>
                <th>Pedidos</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              ${a.map($=>`
                <tr>
                  <td><strong>${$.mes}</strong></td>
                  <td style="color:#E91E8C;font-weight:600">$${$.ventas.toFixed(0)}</td>
                  <td style="color:#c62828">$${$.gastos.toFixed(0)}</td>
                  <td style="color:${$.utilidad>=0?"#2e7d32":"#c62828"};font-weight:700">$${$.utilidad.toFixed(0)}</td>
                  <td>${$.num_pedidos}</td>
                  <td>
                    <span style="padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600;background:${$.ventas>0&&$.utilidad/$.ventas>=.2?"#e8f5e9":$.utilidad>=0?"#fff8e1":"#ffebee"};color:${$.ventas>0&&$.utilidad/$.ventas>=.2?"#2e7d32":$.utilidad>=0?"#f57f17":"#c62828"}">
                      ${$.ventas>0?($.utilidad/$.ventas*100).toFixed(1):0}%
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;gap:2rem;flex-wrap:wrap">
          <div>
            <p style="font-size:0.72rem;color:#888">Total ventas 6 meses</p>
            <p style="font-weight:700;color:#E91E8C">$${a.reduce(($,C)=>$+C.ventas,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Total gastos 6 meses</p>
            <p style="font-weight:700;color:#c62828">$${a.reduce(($,C)=>$+C.gastos,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Utilidad total</p>
            <p style="font-weight:700;color:#2e7d32">$${a.reduce(($,C)=>$+C.utilidad,0).toFixed(0)}</p>
          </div>
        </div>
      </div>
    `:e==="flujo"?l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">🌅 Hoy</p>
          ${[{label:"Efectivo",val:((p=n.hoy)==null?void 0:p.efectivo)||0,color:"#2e7d32"},{label:"Tarjeta",val:((m=n.hoy)==null?void 0:m.tarjeta)||0,color:"#1565c0"},{label:"SPEI",val:((g=n.hoy)==null?void 0:g.spei)||0,color:"#6a1b9a"},{label:"Crédito",val:((u=n.hoy)==null?void 0:u.credito)||0,color:"#f57f17"}].map($=>`
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
              <span style="font-size:0.82rem;color:#888">${$.label}</span>
              <span style="font-weight:700;color:${$.color}">$${$.val.toFixed(0)}</span>
            </div>
          `).join("")}
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Total</span>
            <span style="font-weight:700;color:#E91E8C;font-size:1.1rem">$${(((b=n.hoy)==null?void 0:b.total)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📅 Últimos 7 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((v=n.semana)==null?void 0:v.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((y=n.semana)==null?void 0:y.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((h=n.semana)==null?void 0:h.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((w=n.semana)==null?void 0:w.neto)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📆 Últimos 30 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((_=n.mes)==null?void 0:_.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((x=n.mes)==null?void 0:x.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((z=n.mes)==null?void 0:z.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((B=n.mes)==null?void 0:B.neto)||0).toFixed(0)}</span>
          </div>
        </div>
      </div>
    `:e==="caja"?l.innerHTML=`
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📋 Historial de cajas</p>
        </div>
        ${s.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin historial</div>':s.map($=>`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${new Date($.fecha).toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"})}</p>
                <p style="font-size:0.72rem;color:#888">Apertura: $${parseFloat($.monto_apertura||0).toFixed(0)} · Cierre: $${parseFloat($.monto_cierre||0).toFixed(0)}</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:#E91E8C">$${parseFloat($.total_ventas||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Ventas</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:${parseFloat($.diferencia||0)>=0?"#2e7d32":"#c62828"}">${parseFloat($.diferencia||0)>=0?"+":""}$${parseFloat($.diferencia||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Diferencia</p>
              </div>
              <span style="padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${$.status==="cerrada"?"#e8f5e9":"#fff8e1"};color:${$.status==="cerrada"?"#2e7d32":"#f57f17"}">${$.status}</span>
            </div>
          `).join("")}
      </div>
    `:e==="cxc"&&mostrarCxC()};window.mostrarCxC=()=>{const{cxc:e}=window._finanzasData,t=document.getElementById("fin-tab-contenido");if(!t)return;const o=new Date;t.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">📑 Cuentas por cobrar</p>
        <span style="font-size:0.78rem;color:#888">${e.length} pendientes · $${e.reduce((a,n)=>a+parseFloat(n.total||0),0).toFixed(0)} total</span>
      </div>
      ${e.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin cuentas por cobrar</div>':e.map(a=>{var i,r;const n=Math.floor((o-new Date(a.created_at))/864e5);return`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${((i=a.clientes)==null?void 0:i.nombre)||"Sin cliente"}</p>
                <p style="font-size:0.72rem;color:#888">${new Date(a.created_at).toLocaleDateString("es-MX")} · Pedido #${a.id.substring(0,8).toUpperCase()}</p>
              </div>
              <div style="text-align:right">
                <p style="font-weight:700;color:#f57f17;font-size:1rem">$${parseFloat(a.total||0).toFixed(0)}</p>
                <span style="font-size:0.68rem;padding:2px 8px;border-radius:100px;background:${n>30?"#ffebee":"#fff8e1"};color:${n>30?"#c62828":"#f57f17"}">
                  ${n} días
                </span>
              </div>
              ${(r=a.clientes)!=null&&r.telefono?`
                <a href="https://wa.me/52${a.clientes.telefono.replace(/\D/g,"")}" target="_blank"
                   style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;text-decoration:none">
                  💬 Cobrar
                </a>
              `:""}
            </div>
          `}).join("")}
    </div>
  `};window.abrirCaja=async e=>{var o;const t=prompt("¿Cuánto efectivo hay en caja para empezar? (fondo de caja)");if(t!==null)try{const n=await(await fetch(f+"/finanzas/caja/abrir",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,monto_apertura:parseFloat(t)||0,empleado:((o=window._empleadoActual)==null?void 0:o.nombre)||"Admin"})})).json();if(n.error){alert("Error: "+n.error);return}se()}catch{alert("Error abriendo caja")}};window.cerrarCaja=async e=>{var a,n;const t=prompt("¿Cuánto efectivo hay físicamente en caja al cerrar?");if(t===null)return;const o=prompt("Notas del cierre (opcional):")||"";try{const r=await(await fetch(f+"/finanzas/caja/"+e+"/cerrar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_cierre:parseFloat(t)||0,notas:o})})).json();r.ok?(alert(`Caja cerrada.
Total ventas: $${(a=r.total_ventas)==null?void 0:a.toFixed(2)}
Diferencia: $${(n=r.diferencia)==null?void 0:n.toFixed(2)}`),se()):alert("Error: "+JSON.stringify(r))}catch{alert("Error cerrando caja")}};window.agregarGasto=e=>{const t=document.createElement("div");t.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",t.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%">
      <h3 style="margin-bottom:1.5rem">💸 Agregar gasto</h3>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label class="form-label">Concepto *</label>
          <input class="form-input" id="gasto-concepto" placeholder="Ej: Transporte, Papelería, Limpieza...">
        </div>
        <div>
          <label class="form-label">Monto *</label>
          <input class="form-input" id="gasto-monto" type="number" step="0.01" placeholder="0.00">
        </div>
        <div>
          <label class="form-label">Categoría</label>
          <select class="form-input" id="gasto-categoria">
            <option value="general">General</option>
            <option value="transporte">Transporte</option>
            <option value="papeleria">Papelería</option>
            <option value="limpieza">Limpieza</option>
            <option value="servicios">Servicios</option>
            <option value="comida">Comida</option>
            <option value="renta">Renta</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="this.closest('div[style]').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarGasto('${e}', this)">Guardar</button>
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",o=>{o.target===t&&t.remove()})};window.guardarGasto=async(e,t)=>{var i;const o=document.getElementById("gasto-concepto").value,a=document.getElementById("gasto-monto").value,n=document.getElementById("gasto-categoria").value;if(!o||!a){alert("Completa concepto y monto");return}try{await fetch(f+"/finanzas/gastos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,concepto:o,monto:parseFloat(a),categoria:n,empleado:((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin"})}),t.closest('div[style*="position:fixed"]').remove(),se()}catch{alert("Error guardando gasto")}};window.eliminarGasto=async e=>{if(confirm("¿Eliminar este gasto?"))try{await fetch(f+"/finanzas/gastos/"+e,{method:"DELETE"}),se()}catch{alert("Error eliminando gasto")}};async function je(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/finanzas/proveedores")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Proveedores (${o.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormProveedor()">+ Nuevo proveedor</button>
        </div>
        ${o.length===0?'<div style="padding:3rem;text-align:center;color:#888">No hay proveedores registrados</div>':`<table>
            <thead>
              <tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Ciudad</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${o.map(a=>`
                <tr>
                  <td><strong>${a.nombre}</strong></td>
                  <td>${a.contacto||"—"}</td>
                  <td>${a.telefono||"—"}</td>
                  <td>${a.ciudad||"—"}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProveedor('${a.id}')">Editar</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>`}
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando proveedores</p>'}}window.mostrarFormProveedor=e=>{const t=e||{},o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",o.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:500px;width:100%;max-height:90vh;overflow-y:auto">
      <h3 style="margin-bottom:1.5rem">${t.id?"Editar":"Nuevo"} proveedor</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="grid-column:1/-1">
          <label class="form-label">Nombre *</label>
          <input class="form-input" id="prov-nombre" value="${t.nombre||""}" placeholder="Nombre del proveedor">
        </div>
        <div>
          <label class="form-label">Contacto</label>
          <input class="form-input" id="prov-contacto" value="${t.contacto||""}" placeholder="Nombre del contacto">
        </div>
        <div>
          <label class="form-label">Teléfono</label>
          <input class="form-input" id="prov-telefono" value="${t.telefono||""}" placeholder="477 123 4567">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input class="form-input" id="prov-email" value="${t.email||""}" placeholder="correo@proveedor.com">
        </div>
        <div>
          <label class="form-label">Ciudad</label>
          <input class="form-input" id="prov-ciudad" value="${t.ciudad||""}" placeholder="Leon">
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Dirección</label>
          <input class="form-input" id="prov-direccion" value="${t.direccion||""}" placeholder="Calle y número">
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Notas</label>
          <textarea class="form-input" id="prov-notas" rows="2" placeholder="Condiciones de pago, tiempo de entrega...">${t.notas||""}</textarea>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="this.closest('div[style*=position]').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarProveedor('${t.id||""}')">Guardar</button>
      </div>
    </div>
  `,document.body.appendChild(o),o.addEventListener("click",a=>{a.target===o&&o.remove()})};window.guardarProveedor=async e=>{const t={nombre:document.getElementById("prov-nombre").value,contacto:document.getElementById("prov-contacto").value,telefono:document.getElementById("prov-telefono").value,email:document.getElementById("prov-email").value,ciudad:document.getElementById("prov-ciudad").value,direccion:document.getElementById("prov-direccion").value,notas:document.getElementById("prov-notas").value};if(!t.nombre){alert("El nombre es requerido");return}try{e?await fetch(f+"/finanzas/proveedores/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}):await fetch(f+"/finanzas/proveedores",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),document.querySelector('div[style*="position:fixed"]').remove(),je()}catch{alert("Error guardando proveedor")}};window.editarProveedor=async e=>{const a=(await(await fetch(f+"/finanzas/proveedores")).json()).find(n=>n.id===e);a&&mostrarFormProveedor(a)};async function tt(){const e=document.getElementById("content");e.innerHTML=`
    <div style="margin-bottom:1.5rem">
      <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Inteligencia de negocio</p>
      <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0 0 4px;letter-spacing:-0.3px">Análisis</h2>
      <p style="color:#94a3b8;font-size:0.82rem">Cargando datos...</p>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:1.5rem">
      ${["rotacion","tallas","variantes"].map(i=>'<div style="height:36px;width:110px;background:#f1f5f9;border-radius:8px;animation:pulse 1.5s infinite"></div>').join("")}
    </div>
    <div style="background:#f8fafc;border-radius:14px;height:300px;animation:pulse 1.5s infinite"></div>
    <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}</style>`;try{let A=function(E,L,O){return`<div style="display:flex;align-items:center;gap:6px">
        <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
          <div style="width:${L>0?Math.round(E/L*100):0}%;height:100%;background:${O};border-radius:3px;transition:width 0.4s ease"></div>
        </div>
        <span style="font-size:0.7rem;font-weight:700;color:#334155;min-width:22px;text-align:right">${E}</span>
      </div>`},k=function(){return`
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          <button class="pill-filter pill-active" onclick="filtrarRotacion('todos')">Todos</button>
          <button class="pill-filter pill-success" onclick="filtrarRotacion('verde')">Rotan bien</button>
          <button class="pill-filter pill-warning" onclick="filtrarRotacion('amarillo')">Lentos</button>
          <button class="pill-filter pill-danger" onclick="filtrarRotacion('rojo')">Sin movimiento</button>
        </div>
        <div id="rotacion-lista" style="display:flex;flex-direction:column;gap:8px">
          ${C.map(E=>{const L=j[E.semaforo],O=Math.max(...C.map(I=>I.ventas.d30),1);return`
            <div class="rotacion-item" data-semaforo="${E.semaforo}"
                 style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;transition:box-shadow 0.15s"
                 onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.07)'" onmouseout="this.style.boxShadow=''">
              ${E.imagen_principal?`<img src="${E.imagen_principal}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;background:#f8fafc;flex-shrink:0">`:'<div style="width:48px;height:48px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;color:#cbd5e1">👠</div>'}
              <div style="flex:1;min-width:130px">
                <p style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:2px">${E.nombre}</p>
                <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:6px">${E.sku_interno||""} · ${E.stockTotal} pares en stock</p>
                <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:100px;font-size:0.67rem;font-weight:700;background:${L.bg};color:${L.color}">
                  <span style="width:6px;height:6px;border-radius:50%;background:${L.dot};flex-shrink:0"></span>${L.txt}
                </span>
              </div>
              <div style="min-width:160px;flex:1">
                <p style="font-size:0.67rem;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px">Ventas últimos 30 días</p>
                ${A(E.ventas.d30,O,"#E91E8C")}
                <div style="display:flex;gap:12px;margin-top:6px">
                  <span style="font-size:0.7rem;color:#64748b">60d: <strong>${E.ventas.d60}</strong></span>
                  <span style="font-size:0.7rem;color:#64748b">90d: <strong>${E.ventas.d90}</strong></span>
                  <span style="font-size:0.7rem;color:#64748b">${E.ventasSemana.toFixed(1)} /sem</span>
                </div>
              </div>
              <div style="text-align:right;min-width:100px">
                ${E.diasInventario?`<p style="font-size:1rem;font-weight:800;color:${E.diasInventario<14?"#dc2626":E.diasInventario<30?"#ca8a04":"#16a34a"}">${E.diasInventario}d</p>
                     <p style="font-size:0.67rem;color:#94a3b8">stock restante</p>`:'<p style="font-size:0.72rem;color:#94a3b8">Sin ventas</p>'}
                <p style="font-size:0.67rem;color:#64748b;margin-top:3px">${E.recomendacion}</p>
              </div>
            </div>`}).join("")}
        </div>`},P=function(E){E=(E||"").toLowerCase();const L=C.filter(T=>(T.tallasDesglosadas.length>0||T.tallasData.some(H=>H.total>0))&&(!E||T.nombre.toLowerCase().includes(E)||(T.sku_interno||"").toLowerCase().includes(E))),O=C.filter(T=>T.tallasData.some(H=>H.total>0)).length,I=`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:9px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;flex-wrap:wrap">
          <span style="font-size:0.7rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0">Intensidad:</span>
          ${[{bg:"#f8fafc",txt:"Sin ventas"},{bg:"#fce7f3",txt:"1–2 pares"},{bg:"#fbcfe8",txt:"Moderado"},{bg:"#f472b6",txt:"Buenas"},{bg:"#E91E8C",txt:"Muy buenas"}].map(T=>`
            <div style="display:flex;align-items:center;gap:4px">
              <div style="width:16px;height:16px;border-radius:3px;background:${T.bg};border:1px solid rgba(0,0,0,0.08);flex-shrink:0"></div>
              <span style="font-size:0.68rem;color:#475569">${T.txt}</span>
            </div>`).join("")}
          <span style="font-size:0.68rem;color:#94a3b8;margin-left:2px">— Número = pares totales · (+X) = últimos 30 días</span>
        </div>`;function q(T){const H=Math.max(...T.map(R=>R.total),1);return T.map(R=>{const N=Math.round(R.total/H*100),W=N===0?"#f8fafc":N<20?"#fce7f3":N<50?"#fbcfe8":N<80?"#f472b6":"#E91E8C",X=N>=50?"white":N===0?"#cbd5e1":"#be185d",Q=N>=50?"rgba(255,255,255,0.75)":"#db2777";return`
          <div style="background:${W};border-radius:7px;padding:8px 5px;text-align:center;transition:transform 0.15s;min-width:58px;${N===0?"border:1px solid #e2e8f0":""}"
               title="T${R.talla}: ${R.total} pares totales (${R.d30} en 30d)"
               onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform=''">
            <p style="font-size:0.9rem;font-weight:800;color:${X};line-height:1;margin-bottom:2px">${R.total}</p>
            <p style="font-size:0.65rem;font-weight:700;color:${X}">T${R.talla}</p>
            <p style="font-size:0.58rem;color:${R.d30>0?Q:"transparent"};margin-top:1px">${R.d30>0?"+"+R.d30:"·"}</p>
          </div>`}).join("")}return`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <input id="tallas-buscar" class="form-input" placeholder="Filtrar por modelo o SKU..."
            style="max-width:260px;font-size:0.82rem" value="${E}"
            oninput="document.getElementById('analisis-tab-content').innerHTML=window._renderTabTallas(this.value)">
          <span style="font-size:0.75rem;color:#94a3b8">${L.length} de ${O} modelos</span>
        </div>
        ${I}
        ${L.length===0?'<div style="padding:3rem;text-align:center;color:#94a3b8;font-size:0.9rem">No se encontraron modelos</div>':L.map(T=>{const H=T.tallasData.find(N=>N.total>0),R=T.tallasDesglosadas.length>0;return`
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:10px">
              <!-- cabecera del producto -->
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
                ${T.imagen_principal?`<img src="${T.imagen_principal}" style="width:40px;height:40px;object-fit:contain;border-radius:8px;background:#f8fafc;flex-shrink:0">`:""}
                <div style="flex:1">
                  <p style="font-weight:700;font-size:0.88rem;color:#0f172a">${T.nombre}</p>
                  <p style="font-size:0.7rem;color:#94a3b8">${T.ventas.d90} pares en 90d · ${R?T.tallasDesglosadas.length+" colores con ventas":T.tallasData.filter(N=>N.total>0).length+" tallas con movimiento"}</p>
                </div>
                ${H?`
                  <div style="background:#fdf2f8;border:1px solid #fbcfe8;border-radius:8px;padding:5px 12px;text-align:center;flex-shrink:0">
                    <p style="font-size:0.6rem;color:#9d174d;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Talla global top</p>
                    <p style="font-size:1.05rem;font-weight:800;color:#be185d;line-height:1.2">T${H.talla}</p>
                    <p style="font-size:0.62rem;color:#9d174d">${H.total} pares</p>
                  </div>`:""}
              </div>

              ${R?T.tallasDesglosadas.map(N=>`
                  <div style="margin-bottom:12px">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">
                      <span style="font-size:0.72rem;font-weight:700;color:#334155;min-width:0">${N.color}</span>
                      <span style="font-size:0.65rem;color:#94a3b8;background:#f1f5f9;padding:1px 7px;border-radius:100px">${N.total} pares totales</span>
                      ${N.tallas.find(W=>W.total===Math.max(...N.tallas.map(X=>X.total)))?`<span style="font-size:0.65rem;color:#be185d;background:#fdf2f8;padding:1px 7px;border-radius:100px">
                            top: T${N.tallas.find(W=>W.total===Math.max(...N.tallas.map(X=>X.total))).talla}
                          </span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap">
                      ${q(N.tallas)}
                    </div>
                  </div>`).join('<hr style="border:none;border-top:1px solid #f1f5f9;margin:4px 0 12px">'):`<div style="display:flex;gap:6px;flex-wrap:wrap">${q(T.tallasData)}</div>`}
            </div>`}).join("")}
      `},F=function(){const E=C.filter(L=>L.variantesData.some(O=>O.total>0));return E.length===0?'<div style="padding:3rem;text-align:center;color:#94a3b8;font-size:0.9rem">No hay datos de ventas por variante aún</div>':E.map(L=>{const O=L.variantesData.slice(0,8),I=Math.max(...O.map(T=>T.total),1),q=O[0];return`
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
            ${L.imagen_principal?`<img src="${L.imagen_principal}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;background:#f8fafc">`:""}
            <div style="flex:1">
              <p style="font-weight:700;font-size:0.88rem;color:#0f172a">${L.nombre}</p>
              <p style="font-size:0.7rem;color:#94a3b8">${L.variantesData.filter(T=>T.total>0).length} de ${L.variantesData.length} variantes con ventas</p>
            </div>
            ${q&&q.total>0?`<span style="background:#eff6ff;color:#1d4ed8;padding:4px 10px;border-radius:8px;font-size:0.72rem;font-weight:700">⭐ ${q.label} — ${q.total} vendidos</span>`:""}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${O.map((T,H)=>{const R=["#E91E8C","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444","#6366f1","#14b8a6"],N=R[H%R.length];return`
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:0.72rem;font-weight:600;color:#64748b;min-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${T.label}</span>
                <div style="flex:1;height:20px;background:#f1f5f9;border-radius:4px;overflow:hidden;position:relative">
                  <div style="width:${Math.round(T.total/I*100)}%;height:100%;background:${N};border-radius:4px;transition:width 0.5s ease;display:flex;align-items:center;padding-left:6px;box-sizing:border-box">
                    ${T.total/I>.18?`<span style="font-size:0.65rem;font-weight:700;color:white">${T.total}</span>`:""}
                  </div>
                  ${T.total/I<=.18?`<span style="position:absolute;left:${Math.round(T.total/I*100)+1}%;top:50%;transform:translateY(-50%);font-size:0.65rem;font-weight:700;color:#334155">${T.total}</span>`:""}
                </div>
                <span style="font-size:0.67rem;color:#94a3b8;min-width:52px;text-align:right">Stock: ${T.stock}</span>
              </div>`}).join("")}
          </div>
        </div>`}).join("")};var t=A,o=k,a=P,n=F;const[i,r,s,d]=await Promise.all([fetch(f+"/productos/"),fetch(f+"/variantes/?activa=eq.true"),fetch(f+"/movimientos/"),fetch(f+"/inventario/slim")]),l=await i.json(),c=await r.json(),p=await s.json(),m=await d.json(),g={},u={};c.forEach(E=>{g[E.id]=E,u[E.producto_id]||(u[E.producto_id]=[]),u[E.producto_id].push(E.id)});const b={};m.forEach(E=>{b[E.variante_id]=(b[E.variante_id]||0)+E.cantidad});const v=new Date,y=new Date(v-30*24*60*60*1e3),h=new Date(v-60*24*60*60*1e3),w=new Date(v-90*24*60*60*1e3),_={},x={},z={},B={};p.filter(E=>E.tipo==="venta").forEach(E=>{const L=g[E.variante_id];if(!L)return;const O=L.producto_id,I=Math.abs(E.cantidad),q=new Date(E.created_at);_[O]||(_[O]={d30:0,d60:0,d90:0,total:0}),_[O].total+=I,q>=y&&(_[O].d30+=I),q>=h&&(_[O].d60+=I),q>=w&&(_[O].d90+=I),x[E.variante_id]||(x[E.variante_id]={d30:0,d90:0,total:0}),x[E.variante_id].total+=I,q>=y&&(x[E.variante_id].d30+=I),q>=w&&(x[E.variante_id].d90+=I);const T=L.talla||"S/T",H=`${O}|${T}`;z[H]||(z[H]={talla:T,d30:0,d90:0,total:0}),z[H].total+=I,q>=y&&(z[H].d30+=I),q>=w&&(z[H].d90+=I);const R=L.color||"Sin color",N=`${O}|${R}|${T}`;B[N]||(B[N]={talla:T,color:R,d30:0,d90:0,total:0}),B[N].total+=I,q>=y&&(B[N].d30+=I),q>=w&&(B[N].d90+=I)});const C=l.map(E=>{const L=_[E.id]||{d30:0,d60:0,d90:0,total:0},O=u[E.id]||[],I=O.reduce((V,U)=>V+(b[U]||0),0),q=L.d30/4,T=q>0?Math.round(I/q*7):null;let H="gris",R="Sin ventas recientes";L.d30>=6?(H="verde",R="Rota bien — considerar resurtido"):L.d30>=2?(H="amarillo",R="Rotación moderada"):L.d90===0&&I>0?(H="rojo",R="Sin movimiento en 90 días — revisar"):L.d30>0&&(H="amarillo",R="Rotación lenta");const N=O.map(V=>{var U;return(U=g[V])==null?void 0:U.talla}).filter(Boolean).filter((V,U,Z)=>Z.indexOf(V)===U).map(V=>({talla:V,...z[`${E.id}|${V}`]||{d30:0,d90:0,total:0}})).sort((V,U)=>U.total-V.total),X=[...new Set(O.map(V=>{var U;return(U=g[V])==null?void 0:U.color}).filter(Boolean))].map(V=>{const U=O.filter(J=>{var Y;return((Y=g[J])==null?void 0:Y.color)===V}).map(J=>{var Y;return(Y=g[J])==null?void 0:Y.talla}).filter(Boolean).filter((J,Y,We)=>We.indexOf(J)===Y).map(J=>({talla:J,...B[`${E.id}|${V}|${J}`]||{d30:0,d90:0,total:0}})).sort((J,Y)=>parseFloat(J.talla)-parseFloat(Y.talla)),Z=U.reduce((J,Y)=>J+Y.total,0);return{color:V,tallas:U,total:Z}}).filter(V=>V.total>0).sort((V,U)=>U.total-V.total),Q=O.map(V=>{const U=g[V];if(!U)return null;const Z=x[V]||{d30:0,d90:0,total:0},J=b[V]||0;return{id:V,label:[U.talla,U.color].filter(Boolean).join(" / ")||V,stock:J,...Z}}).filter(Boolean).sort((V,U)=>U.total-V.total);return{...E,ventas:L,stockTotal:I,ventasSemana:q,diasInventario:T,semaforo:H,recomendacion:R,tallasData:N,tallasDesglosadas:X,variantesData:Q}}).sort((E,L)=>L.ventas.d30-E.ventas.d30);window._analisisData={productosConRotacion:C,ventasPorTalla:z};const G=C.reduce((E,L)=>E+L.ventas.d30,0),S=C.reduce((E,L)=>E+L.ventas.d90,0),M=C.filter(E=>E.semaforo==="verde").length,D=C.filter(E=>E.semaforo==="rojo").length,j={verde:{bg:"#dcfce7",color:"#166534",dot:"#16a34a",txt:"Rota bien"},amarillo:{bg:"#fef9c3",color:"#854d0e",dot:"#ca8a04",txt:"Rotación lenta"},rojo:{bg:"#fee2e2",color:"#991b1b",dot:"#dc2626",txt:"Sin movimiento"},gris:{bg:"#f1f5f9",color:"#64748b",dot:"#94a3b8",txt:"Sin datos"}};window._renderTabRotacion=k,window._renderTabTallas=P,window._renderTabVariantes=F,e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px">
        <div>
          <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Inteligencia de negocio</p>
          <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.3px">Análisis</h2>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:1.5rem">
        <div style="background:linear-gradient(135deg,#fff0f8,#ffe4f2);border:1px solid #f9a8d4;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#be185d;line-height:1;margin-bottom:3px">${G}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#be185d;text-transform:uppercase;letter-spacing:0.06em">Pares 30 días</p>
        </div>
        <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#6d28d9;line-height:1;margin-bottom:3px">${S}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#6d28d9;text-transform:uppercase;letter-spacing:0.06em">Pares 90 días</p>
        </div>
        <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#15803d;line-height:1;margin-bottom:3px">${M}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.06em">Rotan bien</p>
        </div>
        <div style="background:linear-gradient(135deg,#fff1f2,#fee2e2);border:1px solid #fca5a5;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#b91c1c;line-height:1;margin-bottom:3px">${D}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.06em">Sin movimiento</p>
        </div>
      </div>

      <div style="display:flex;gap:0;margin-bottom:1.25rem;background:#f1f5f9;border-radius:10px;padding:3px;width:fit-content">
        <button id="tab-rotacion" onclick="switchTabAnalisis('rotacion')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:white;color:#E91E8C;box-shadow:0 1px 4px rgba(0,0,0,0.1)">
          Rotación
        </button>
        <button id="tab-tallas" onclick="switchTabAnalisis('tallas')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:transparent;color:#64748b">
          Tallas
        </button>
        <button id="tab-variantes" onclick="switchTabAnalisis('variantes')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:transparent;color:#64748b">
          Variantes
        </button>
      </div>

      <div id="analisis-tab-content">
        ${k()}
      </div>
    `,window._analisisTabActivo="rotacion"}catch(i){e.innerHTML='<p style="padding:2rem;color:red">Error cargando análisis</p>',console.error(i)}}window.switchTabAnalisis=e=>{["rotacion","tallas","variantes"].forEach(a=>{const n=document.getElementById("tab-"+a);n&&(a===e?(n.style.background="white",n.style.color="#E91E8C",n.style.boxShadow="0 1px 4px rgba(0,0,0,0.1)"):(n.style.background="transparent",n.style.color="#64748b",n.style.boxShadow="none"))});const o=document.getElementById("analisis-tab-content");o&&(window._analisisTabActivo=e,e==="rotacion"?o.innerHTML=window._renderTabRotacion():e==="tallas"?o.innerHTML=window._renderTabTallas():e==="variantes"&&(o.innerHTML=window._renderTabVariantes()))};window.filtrarRotacion=e=>{document.querySelectorAll(".rotacion-item").forEach(o=>{o.style.display=e==="todos"||o.dataset.semaforo===e?"":"none"}),document.querySelectorAll("#analisis-tab-content .pill-filter").forEach(o=>{o.classList.remove("pill-active")});const t=[...document.querySelectorAll("#analisis-tab-content .pill-filter")].find(o=>o.textContent.trim().toLowerCase().includes(e==="todos"?"todos":e==="verde"?"bien":e==="amarillo"?"lento":"movimiento"));t&&t.classList.add("pill-active")};async function Pe(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando CRM...</p>';try{const[t,o,a]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/"),fetch(f+"/crm/seguimientos/pendientes/todos")]),n=await t.json(),i=await o.json(),r=await a.json(),s=new Date,d=new Date(s-30*24*60*60*1e3),l=new Date(s-60*24*60*60*1e3),c=new Date(s-90*24*60*60*1e3),p=n.map(h=>{const w=i.filter(C=>C.cliente_id===h.id&&(C.status==="confirmado"||C.status==="pagado")),_=w.reduce((C,G)=>C+parseFloat(G.total||0),0),x=w.length>0?new Date(w[0].created_at):null,z=x?Math.floor((s-x)/(1e3*60*60*24)):null,B=w.filter(C=>new Date(C.created_at)>=d).length;let $="nuevo";return w.length===0?$="nuevo":_>=5e3&&B>=1?$="vip":z>90?$="inactivo":z>30?$="riesgo":B>=2?$="frecuente":$="activo",{...h,totalGastado:_,ultimoPedido:x,diasSinComprar:z,pedidos30:B,segmento:$,totalPedidos:w.length}}),m=p.filter(h=>h.segmento==="vip"),g=p.filter(h=>h.segmento==="riesgo").sort((h,w)=>w.totalGastado-h.totalGastado),u=p.filter(h=>h.segmento==="inactivo").sort((h,w)=>w.totalGastado-h.totalGastado),b=[...p].sort((h,w)=>w.totalGastado-h.totalGastado).slice(0,10),v=i.filter(h=>new Date(h.created_at).toDateString()===s.toDateString()&&(h.status==="confirmado"||h.status==="pagado")).reduce((h,w)=>h+parseFloat(w.total||0),0),y=i.filter(h=>new Date(h.created_at)>=d&&(h.status==="confirmado"||h.status==="pagado")).reduce((h,w)=>h+parseFloat(w.total||0),0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🎯 CRM — Centro de relaciones</h2>
          <p style="color:#888;font-size:0.85rem">Gestión completa de clientes y oportunidades</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="mostrarPipeline()">📊 Pipeline</button>
          <button class="btn btn-secondary" onclick="mostrarCampanas()">📣 Campañas</button>
          <button class="btn btn-primary" onclick="mostrarFormCliente()">+ Nuevo cliente</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${v.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas hoy</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${y.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('vip')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${m.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⭐ Clientes VIP</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('riesgo')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${g.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="mostrarSegmento('inactivo')">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${u.length}</p>
          <p style="font-size:0.7rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
        <div style="background:#e3f2fd;border-radius:12px;padding:1.25rem;border:1px solid #90caf9;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#1565c0">${r.length}</p>
          <p style="font-size:0.7rem;color:#1565c0;text-transform:uppercase;letter-spacing:0.5px">📅 Recordatorios</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">

        <!-- ALERTAS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">🟡 Clientes en riesgo</p>
            <span style="font-size:0.75rem;color:#888">${g.length} clientes</span>
          </div>
          ${g.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin clientes en riesgo</div>':g.slice(0,5).map(h=>`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
                   onclick="verCliente('${h.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                <div style="width:36px;height:36px;border-radius:50%;background:#fff8e1;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#f57f17;flex-shrink:0">
                  ${h.nombre.charAt(0).toUpperCase()}
                </div>
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${h.nombre}</p>
                  <p style="font-size:0.72rem;color:#888">Hace ${h.diasSinComprar} días sin comprar · $${h.totalGastado.toFixed(0)} total</p>
                </div>
                ${h.telefono?`<a href="https://wa.me/${h.lada||"52"}${h.telefono.replace(/\D/g,"")}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WA</a>`:""}
              </div>
            `).join("")}
        </div>

        <!-- RECORDATORIOS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">📅 Recordatorios pendientes</p>
            <span style="font-size:0.75rem;color:#888">${r.length} pendientes</span>
          </div>
          ${r.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin recordatorios pendientes 🎉</div>':r.slice(0,5).map(h=>{var w;return`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${((w=h.clientes)==null?void 0:w.nombre)||"Cliente"}</p>
                  <p style="font-size:0.72rem;color:#888">${h.contenido.substring(0,50)}</p>
                  <p style="font-size:0.68rem;color:#f57f17">${new Date(h.fecha_recordatorio).toLocaleDateString("es-MX")}</p>
                </div>
                <button onclick="completarRecordatorio('${h.id}')" style="background:#e8f5e9;border:1px solid #a5d6a7;color:#2e7d32;border-radius:6px;padding:4px 10px;font-size:0.72rem;cursor:pointer">✓ Listo</button>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- TOP CLIENTES -->
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:1rem">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">⭐ Top 10 clientes por volumen</p>
        </div>
        ${b.map((h,w)=>`
          <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
               onclick="verCliente('${h.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
            <span style="font-size:0.85rem;font-weight:700;color:${w<3?"#f57f17":"#aaa"};min-width:20px">${w+1}</span>
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
              ${h.nombre.charAt(0).toUpperCase()}
            </div>
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600">${h.nombre}</p>
              <p style="font-size:0.72rem;color:#888">${h.totalPedidos} pedidos · ${h.diasSinComprar!==null?"Hace "+h.diasSinComprar+" días":"Sin pedidos"}</p>
            </div>
            <div style="text-align:right">
              <p style="font-weight:700;color:#E91E8C">$${h.totalGastado.toFixed(0)}</p>
              <span style="font-size:0.65rem;padding:2px 6px;border-radius:100px;background:${h.segmento==="vip"?"#fff8e1":h.segmento==="inactivo"?"#ffebee":"#e8f5e9"};color:${h.segmento==="vip"?"#f57f17":h.segmento==="inactivo"?"#c62828":"#2e7d32"}">${h.segmento}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- SEGMENTO DETALLE (oculto por default) -->
      <div id="crm-segmento-detalle" style="display:none"></div>
    `,window._crmData={clientes:p,pedidos:i,recordatorios:r}}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error cargando CRM: '+t.message+"</p>"}}window.mostrarSegmento=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const o=t.filter(i=>i.segmento===e).sort((i,r)=>r.totalGastado-i.totalGastado),a={vip:"⭐ Clientes VIP",riesgo:"🟡 En riesgo",inactivo:"🔴 Inactivos",frecuente:"🟢 Frecuentes"},n=document.getElementById("crm-segmento-detalle");n.style.display="block",n.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">${a[e]||e} (${o.length})</p>
        <button onclick="document.getElementById('crm-segmento-detalle').style.display='none'" style="background:none;border:none;cursor:pointer;color:#888;font-size:1.2rem">✕</button>
      </div>
      ${o.map(i=>`
        <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
             onclick="verCliente('${i.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
            ${i.nombre.charAt(0).toUpperCase()}
          </div>
          <div style="flex:1">
            <p style="font-size:0.85rem;font-weight:600">${i.nombre}</p>
            <p style="font-size:0.72rem;color:#888">$${i.totalGastado.toFixed(0)} · ${i.totalPedidos} pedidos · ${i.diasSinComprar!==null?"Hace "+i.diasSinComprar+" días":"Sin pedidos"}</p>
          </div>
          ${i.telefono?`<a href="https://wa.me/${i.lada||"52"}${i.telefono.replace(/\D/g,"")}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WhatsApp</a>`:""}
        </div>
      `).join("")}
    </div>
  `,n.scrollIntoView({behavior:"smooth"})};window.completarRecordatorio=async e=>{try{await fetch(f+"/crm/seguimientos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completado:!0})}),Pe()}catch{alert("Error al completar recordatorio")}};window.mostrarPipeline=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando pipeline...</p>';try{const o=await(await fetch(f+"/crm/oportunidades")).json(),a=[{id:"contacto",label:"📞 Contacto",color:"#e3f2fd",colorText:"#1565c0"},{id:"interes",label:"👀 Interés",color:"#f3e5f5",colorText:"#6a1b9a"},{id:"cotizacion",label:"📋 Cotización",color:"#fff8e1",colorText:"#f57f17"},{id:"negociacion",label:"🤝 Negociación",color:"#fce4f3",colorText:"#E91E8C"},{id:"ganado",label:"✅ Ganado",color:"#e8f5e9",colorText:"#2e7d32"},{id:"perdido",label:"❌ Perdido",color:"#ffebee",colorText:"#c62828"}];e.innerHTML=`
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCRM()">← Volver al CRM</button>
        <h2 style="flex:1;font-size:1.1rem;font-weight:700">📊 Pipeline de oportunidades</h2>
        <button class="btn btn-primary" onclick="nuevaOportunidad()">+ Nueva oportunidad</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${a.map(n=>{const i=o.filter(s=>s.etapa===n.id),r=i.reduce((s,d)=>s+parseFloat(d.monto_estimado||0),0);return`
            <div style="background:${n.color};border-radius:12px;padding:1rem;border:1px solid ${n.colorText}30">
              <p style="font-weight:700;font-size:0.85rem;color:${n.colorText};margin-bottom:4px">${n.label}</p>
              <p style="font-size:0.72rem;color:${n.colorText};margin-bottom:12px">${i.length} ops · $${r.toFixed(0)}</p>
              ${i.map(s=>{var d;return`
                <div style="background:white;border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid #eee;cursor:pointer"
                     onclick="verOportunidad('${s.id}')">
                  <p style="font-size:0.82rem;font-weight:600;margin-bottom:2px">${s.titulo}</p>
                  <p style="font-size:0.72rem;color:#888">${((d=s.clientes)==null?void 0:d.nombre)||"—"}</p>
                  <p style="font-size:0.82rem;font-weight:700;color:#E91E8C;margin-top:4px">$${parseFloat(s.monto_estimado||0).toFixed(0)}</p>
                </div>
              `}).join("")}
            </div>
          `}).join("")}
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando pipeline</p>'}};window.nuevaOportunidad=()=>{const e=document.createElement("div");e.id="modal-oportunidad",e.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",e.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:500px;width:100%;max-height:90vh;overflow-y:auto">
      <h3 style="margin-bottom:1.5rem">Nueva oportunidad</h3>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label class="form-label">Título</label>
          <input class="form-input" id="op-titulo" placeholder="Ej: Pedido mayoreo sandalias">
        </div>
        <div>
          <label class="form-label">Cliente</label>
          <input class="form-input" id="op-cliente-buscar" placeholder="Buscar cliente..." oninput="buscarClienteOportunidad(this.value)">
          <div id="op-cliente-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:150px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="op-cliente-id">
        </div>
        <div>
          <label class="form-label">Monto estimado ($)</label>
          <input class="form-input" id="op-monto" type="number" placeholder="0.00">
        </div>
        <div>
          <label class="form-label">Etapa</label>
          <select class="form-input" id="op-etapa">
            <option value="contacto">📞 Contacto</option>
            <option value="interes">👀 Interés</option>
            <option value="cotizacion">📋 Cotización</option>
            <option value="negociacion">🤝 Negociación</option>
            <option value="ganado">✅ Ganado</option>
            <option value="perdido">❌ Perdido</option>
          </select>
        </div>
        <div>
          <label class="form-label">Fecha de cierre estimada</label>
          <input class="form-input" id="op-fecha" type="date">
        </div>
        <div>
          <label class="form-label">Notas</label>
          <textarea class="form-input" id="op-notas" rows="3" placeholder="Detalles de la oportunidad..."></textarea>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="document.getElementById('modal-oportunidad').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarOportunidad()">Guardar</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()})};window.buscarClienteOportunidad=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const o=document.getElementById("op-cliente-resultados");if(!e||e.length<2){o.style.display="none";return}const a=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!a.length){o.style.display="none";return}o.style.display="block",o.innerHTML=a.map(n=>`
    <div onclick="seleccionarClienteOportunidad('${n.id}', '${n.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      ${n.nombre}
    </div>
  `).join("")};window.seleccionarClienteOportunidad=(e,t)=>{document.getElementById("op-cliente-id").value=e,document.getElementById("op-cliente-buscar").value=t,document.getElementById("op-cliente-resultados").style.display="none"};window.guardarOportunidad=async()=>{const e=document.getElementById("op-titulo").value,t=document.getElementById("op-cliente-id").value,o=document.getElementById("op-monto").value,a=document.getElementById("op-etapa").value,n=document.getElementById("op-fecha").value,i=document.getElementById("op-notas").value;if(!e){alert("El título es requerido");return}try{await fetch(f+"/crm/oportunidades",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,cliente_id:t||null,monto_estimado:parseFloat(o)||0,etapa:a,fecha_cierre_estimada:n||null,notas:i})}),document.getElementById("modal-oportunidad").remove(),mostrarPipeline()}catch{alert("Error guardando oportunidad")}};async function pe(e,t=!1){const o=document.getElementById("content");try{const n=await(await fetch(f+"/productos/")).json(),i=n.filter(c=>c.activo),r=n.filter(c=>!c.activo),s=t?r:i;console.log("mostrarInactivos:",t,"base:",s.length,"inactivos:",r.length);const d=[...new Set(i.map(c=>c.categoria).filter(Boolean))],l=e?s.filter(c=>c.categoria===e):s;o.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn ${!t&&!e?"btn-primary":"btn-secondary"}" onclick="window.cargarProductos(null, false)">
          ✅ Activos (${i.length})
        </button>
        ${d.map(c=>`
          <button class="btn ${!t&&e===c?"btn-primary":"btn-secondary"}" onclick="window.cargarProductos('${c}', false)">
            ${c.charAt(0).toUpperCase()+c.slice(1)} (${i.filter(p=>p.categoria===c).length})
          </button>
        `).join("")}
        <button class="btn ${t?"btn-primary":"btn-secondary"}" style="${t?"":"color:#c62828;border-color:#c62828"}" onclick="window.cargarProductos(null, true)">
          ❌ Desactivados (${r.length})
        </button>
      </div>
      <div class="table-card">
        <div class="table-header">
          <h3>${t?"Productos desactivados":e?e.charAt(0).toUpperCase()+e.slice(1):"Productos activos"} (${l.length})</h3>
          <div style="display:flex;gap:8px;align-items:center">
            <input class="form-input" id="prod-buscar" placeholder="Buscar producto..." style="max-width:220px" oninput="filtrarProductos()">
            <button class="btn btn-primary" onclick="mostrarFormProducto()">+ Nuevo producto</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Menudeo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${l.length===0?'<tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No hay productos</td></tr>':l.map(c=>`
                <tr>
                  <td style="display:flex;align-items:center;gap:10px">
                    ${c.imagen_principal?`<img src="${c.imagen_principal}" style="width:44px;height:44px;object-fit:contain;background:#f5f5f5;border-radius:6px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:44px;height:44px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:1.2rem">?</div>'}
                    <strong>${c.nombre}</strong>
                  </td>
                  <td><small style="color:#888">${c.sku_interno||"—"}</small></td>
                  <td>${c.categoria||"—"}</td>
                  <td>$${c.precio_menudeo}</td>
                  <td><span class="badge ${c.activo?"badge-success":"badge-danger"}">${c.activo?"Activo":"Inactivo"}</span></td>
                  <td style="display:flex;gap:4px;flex-wrap:wrap">
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProducto('${c.id}')">Editar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="duplicarProducto('${c.id}')">Duplicar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:${c.activo?"#c62828":"#2e7d32"};border-color:${c.activo?"#c62828":"#2e7d32"}" onclick="toggleProducto('${c.id}', ${c.activo})">${c.activo?"Desactivar":"Activar"}</button>
                  </td>
                </tr>
              `).join("")}
          </tbody>
        </table>
      </div>
    `}catch{o.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.cargarProductos=pe;window.mostrarCampanas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando campañas...</p>';try{const[t,o]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/")]),a=await t.json(),n=await o.json(),i=new Date,r=new Date(i-30*24*60*60*1e3),s=new Date(i-90*24*60*60*1e3),d=a.map(p=>{const m=n.filter(h=>h.cliente_id===p.id&&(h.status==="confirmado"||h.status==="pagado")),g=m.reduce((h,w)=>h+parseFloat(w.total||0),0),u=m.length>0?new Date(m[0].created_at):null,b=u?Math.floor((i-u)/(1e3*60*60*24)):null,v=m.filter(h=>new Date(h.created_at)>=r).length;let y="nuevo";return m.length===0?y="nuevo":g>=5e3&&v>=1?y="vip":b>90?y="inactivo":b>30?y="riesgo":v>=2?y="frecuente":y="activo",{...p,totalGastado:g,diasSinComprar:b,segmento:y}}).filter(p=>p.telefono);window._campanaClientes=d;const l=[{id:"catalogo",nombre:"👠 Catálogo completo",descripcion:"Envía el catálogo completo de productos",mensaje:p=>`Hola ${p}! 👋

Te compartimos nuestro catálogo completo de calzado para dama.

✨ Encuentra tacones, sandalias, botas, botines y más.

🛍️ Ver catálogo completo:
https://zapatillasmay.mx/#catalogo

Cualquier pregunta con gusto te atendemos 😊`},{id:"nuevos",nombre:"🆕 Nuevos modelos",descripcion:"Envía los últimos modelos agregados",mensaje:p=>`¡Hola ${p}! 👋

¡Llegaron nuevos modelos a Zapatillas May! 👠✨

¿Te interesa? Con gusto te damos más información y tallas disponibles.

¡Escríbenos para hacer tu pedido! 🛍️`},{id:"mayoreo",nombre:"📦 Precios mayoreo",descripcion:"Envía información de precios mayoreo",mensaje:p=>`Hola ${p}! 👋

Te recordamos nuestros precios de mayoreo:

📦 3-5 pares variados: -$80 por par
📦 6+ pares variados: -$150 por par
📦 Corrida completa: -$180 por par

🛍️ Ver catálogo:
https://zapatillasmay.mx/#catalogo

¿Te interesa hacer un pedido? Con gusto te atendemos 😊`},{id:"tacones",nombre:"👡 Catálogo tacones",descripcion:"Envía solo la categoría de tacones",mensaje:p=>`Hola ${p}! 👋

Mira nuestra colección de tacones para dama.

👡 Ver tacones:
https://zapatillasmay.mx/#categoria/tacones

¿Te gusta alguno? Con gusto te damos más información 😊`},{id:"sandalias",nombre:"🩴 Catálogo sandalias",descripcion:"Envía solo la categoría de sandalias",mensaje:p=>`Hola ${p}! 👋

Mira nuestra colección de sandalias para dama.

🩴 Ver sandalias:
https://zapatillasmay.mx/#categoria/sandalias

¿Te gusta alguna? Con gusto te damos más información 😊`},{id:"seguimiento",nombre:"💬 Seguimiento cliente",descripcion:"Mensaje de seguimiento para clientes inactivos",mensaje:p=>`Hola ${p}! 👋

¿Cómo estás? Hace tiempo que no sabemos de ti.

Tenemos modelos nuevos que te pueden interesar 👠

🛍️ Ver novedades:
https://zapatillasmay.mx/#nuevos

¿Te puedo mostrar algo en especial? 😊`},{id:"personalizado",nombre:"✏️ Mensaje personalizado",descripcion:"Escribe tu propio mensaje",mensaje:p=>`Hola ${p}! 👋

`}],c=[{id:"todos",label:"Todos los clientes",count:d.length},{id:"vip",label:"⭐ VIP",count:d.filter(p=>p.segmento==="vip").length},{id:"frecuente",label:"🟢 Frecuentes",count:d.filter(p=>p.segmento==="frecuente").length},{id:"riesgo",label:"🟡 En riesgo",count:d.filter(p=>p.segmento==="riesgo").length},{id:"inactivo",label:"🔴 Inactivos",count:d.filter(p=>p.segmento==="inactivo").length},{id:"mayoreo",label:"📦 Mayoreo",count:d.filter(p=>p.tipo==="mayoreo").length},{id:"zapateria",label:"🏪 Corridas",count:d.filter(p=>p.tipo==="zapateria").length},{id:"menudeo",label:"🛍️ Menudeo",count:d.filter(p=>p.tipo==="menudeo").length}];e.innerHTML=`
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="navegarA('crm')">← Volver al CRM</button>
        <div>
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:2px">📣 Campañas de WhatsApp</h2>
          <p style="font-size:0.82rem;color:#888">Envía fotos de nuevos modelos a tus clientes de mayoreo</p>
        </div>
      </div>

      <!-- CONEXIÓN WHATSAPP BUSINESS -->
      <div id="wa-conexion-card" style="background:white;border-radius:12px;border:1px solid #eee;padding:1.25rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:2px">📱 WhatsApp Business</p>
          <p id="wa-estado-texto" style="font-size:0.8rem;color:#888">Verificando conexión...</p>
        </div>
        <div id="wa-estado-badge" style="padding:4px 12px;border-radius:100px;font-size:0.75rem;font-weight:600;background:#f5f5f5;color:#888">
          ⏳ Cargando
        </div>
        <button id="wa-btn-conectar" onclick="mostrarQRWhatsApp()" class="btn btn-primary" style="display:none">
          Conectar con QR
        </button>
        <button id="wa-btn-desconectar" onclick="desconectarWhatsApp()" class="btn btn-secondary" style="display:none;font-size:0.78rem">
          Desconectar
        </button>
        <button onclick="forzarReconexionWA()" class="btn btn-secondary" style="font-size:0.78rem;background:#ff6b35;color:white;border-color:#ff6b35">
          🔄 Forzar reconexión
        </button>
      </div>

      <!-- QR MODAL -->
      <div id="wa-qr-panel" style="display:none;background:#f8f8f8;border:2px dashed #E91E8C;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;text-align:center">
        <p style="font-weight:700;margin-bottom:0.5rem">Escanea este QR con tu WhatsApp Business</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo</p>
        <div id="wa-qr-img" style="display:inline-block;background:white;padding:12px;border-radius:8px;border:1px solid #eee">
          <p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>
        </div>
        <p style="font-size:0.75rem;color:#aaa;margin-top:0.75rem">El QR expira en ~60 segundos. Si expira, haz clic en "Conectar con QR" de nuevo.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">

        <!-- CONFIGURACIÓN -->
        <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">1️⃣ Selecciona el segmento</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${c.map(p=>`
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:8px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('seg-${p.id}').checked)this.style.borderColor='#eee'">
                  <input type="radio" name="campana-segmento" id="seg-${p.id}" value="${p.id}" ${p.id==="todos"?"checked":""} 
                         onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                  <span style="flex:1;font-size:0.85rem;font-weight:500">${p.label}</span>
                  <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${p.count}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:4px">2️⃣ Foto <span style="font-weight:400;color:#aaa;font-size:0.78rem">(opcional)</span></p>

            <div id="campana-foto-manual">
              <p style="font-size:0.75rem;color:#999;margin-bottom:0.875rem">Selecciona un producto para adjuntar su foto</p>
              <div style="display:flex;gap:8px;margin-bottom:0.75rem">
                <select id="campana-producto-sel" class="form-input" style="flex:1;font-size:0.82rem"
                  onchange="seleccionarProductoCampana(this.value)">
                  <option value="">— Sin foto —</option>
                </select>
                <button type="button" onclick="cargarProductosCampana()" title="Recargar productos"
                  style="padding:6px 10px;border:1px solid #eee;border-radius:8px;background:white;cursor:pointer;font-size:0.85rem">↺</button>
              </div>
              <div id="campana-foto-preview" style="display:none;border-radius:10px;overflow:hidden;border:1px solid #eee;max-height:140px;position:relative">
                <img id="campana-foto-img" src="" style="width:100%;height:140px;object-fit:cover">
                <button onclick="quitarFotoCampana()"
                  style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.55);color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center">✕</button>
              </div>
            </div>

            <div id="campana-fotos-nuevos" style="display:none">
              <p style="font-size:0.75rem;color:#999;margin-bottom:6px">Busca y elige el modelo, luego selecciona los colores</p>
              <input type="text" id="campana-nuevo-buscar" placeholder="🔍 Buscar modelo..."
                oninput="filtrarModelosCampana(this.value)"
                style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
              <div id="campana-modelos-lista"
                style="max-height:150px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:10px">
                <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Cargando modelos...</p>
              </div>
              <div id="campana-fotos-nuevos-grid" style="display:flex;flex-direction:column;gap:6px"></div>
              <p id="campana-fotos-count" style="font-size:0.75rem;color:#E91E8C;margin-top:8px;font-weight:600"></p>
            </div>

          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">3️⃣ Selecciona la plantilla</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${l.map(p=>`
                <label style="cursor:pointer;padding:10px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('plt-${p.id}').checked)this.style.borderColor='#eee'">
                  <div style="display:flex;align-items:center;gap:8px">
                    <input type="radio" name="campana-plantilla" id="plt-${p.id}" value="${p.id}" ${p.id==="catalogo"?"checked":""}
                           onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                    <div>
                      <p style="font-size:0.85rem;font-weight:600">${p.nombre}</p>
                      <p style="font-size:0.72rem;color:#888">${p.descripcion}</p>
                    </div>
                  </div>
                </label>
              `).join("")}
            </div>
            <div id="mensaje-personalizado" style="display:none;margin-top:1rem">
              <label class="form-label">Tu mensaje (usa {nombre} para personalizar)</label>
              <textarea class="form-input" id="texto-personalizado" rows="5" placeholder="Hola {nombre}! ..."
                        oninput="actualizarVistaCampana()">Hola {nombre}! 👋

</textarea>
            </div>
          </div>
        </div>

        <!-- VISTA PREVIA Y LISTA -->
        <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">4️⃣ Vista previa del mensaje</p>
            <div id="mensaje-preview" style="background:#e8f5e9;border-radius:10px;padding:1rem;font-size:0.82rem;color:#333;white-space:pre-wrap;line-height:1.6;border:1px solid #a5d6a7;max-height:200px;overflow-y:auto"></div>
          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:center;gap:10px">
                <p style="font-weight:700;font-size:0.9rem">5️⃣ Enviar a clientes</p>
                <span id="campana-count" style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px"></span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <label style="font-size:0.78rem;color:#666;cursor:pointer;display:flex;align-items:center;gap:5px">
                  <input type="checkbox" id="campana-sel-todos" onchange="toggleSeleccionarTodosCampana(this.checked)" style="accent-color:#E91E8C">
                  Todos
                </label>
                <button id="btn-campana-seleccionados" onclick="iniciarCampanaSeleccionados()"
                  style="background:#555;color:white;border:none;border-radius:8px;padding:6px 12px;font-size:0.75rem;font-weight:600;cursor:pointer;display:none;gap:4px;align-items:center">
                  💬 Manual (<span id="campana-sel-count">0</span>)
                </button>
                <button id="btn-campana-auto" onclick="enviarCampanaAutomatica()"
                  style="background:#E91E8C;color:white;border:none;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:600;cursor:pointer;display:none;gap:4px;align-items:center">
                  🤖 Enviar solos (<span id="campana-sel-count-auto">0</span>)
                </button>
              </div>
            </div>
            <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f0f0f0">
              <input type="text" id="campana-buscador" placeholder="🔍 Buscar cliente..." oninput="filtrarClientesCampana(this.value)"
                style="width:100%;padding:7px 12px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box">
            </div>
            <div id="campana-lista" style="max-height:400px;overflow-y:auto"></div>
          </div>
        </div>
      </div>
    `,window._plantillasCampana=l,window._campanaImagenUrl="",actualizarVistaCampana(),cargarProductosCampana(),verificarEstadoWA()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando campañas</p>'}};window._waEstadoInterval=null;window.verificarEstadoWA=async()=>{try{const t=await(await fetch(f+"/campanas/wa-estado")).json(),o=document.getElementById("wa-estado-badge"),a=document.getElementById("wa-estado-texto"),n=document.getElementById("wa-btn-conectar"),i=document.getElementById("wa-btn-desconectar");if(!o)return t.conectado;if(t.conectado)o.style.background="#e8f5e9",o.style.color="#2e7d32",o.textContent="✅ Conectado",a.textContent="WhatsApp Business conectado y listo para enviar",n.style.display="none",i.style.display="inline-flex",document.getElementById("wa-qr-panel").style.display="none",window._waEstadoInterval&&(clearInterval(window._waEstadoInterval),window._waEstadoInterval=null);else{o.style.background="#ffebee",o.style.color="#c62828";const r=t.detalle&&t.detalle.includes("caída");if(o.textContent=r?"⚠️ Sesión caída":"🔴 Desconectado",a.textContent=t.detalle||"Conecta tu WhatsApp Business para enviar campañas automáticas",n.style.display="inline-flex",i.style.display="none",r){o.style.background="#fff3e0",o.style.color="#e65100";const s=document.getElementById("wa-qr-panel");s&&s.style.display==="none"&&(s.style.display="block",document.getElementById("wa-qr-img").innerHTML=`
            <div style="padding:1.5rem;text-align:center">
              <p style="font-size:0.9rem;font-weight:700;color:#e65100;margin-bottom:0.5rem">⚠️ WhatsApp desconectado</p>
              <p style="font-size:0.8rem;color:#666;margin-bottom:1rem">La sesión se cerró. Necesitas reconectar.</p>
              <p style="font-size:0.8rem;color:#555;margin-bottom:1rem">1️⃣ Abre <strong>INICIAR ERP.bat</strong> en tu escritorio<br>2️⃣ Espera que Railway actualice (~2 min)<br>3️⃣ Haz clic en <strong>"Conectar con QR"</strong></p>
            </div>`)}}return t.conectado}catch{const t=document.getElementById("wa-estado-badge");return t&&(t.style.background="#fff8e1",t.style.color="#f57f17",t.textContent="⚠️ Sin conexión al servidor"),!1}};window.forzarReconexionWA=async()=>{const e=document.getElementById("wa-qr-panel"),t=document.getElementById("wa-qr-img");if(!(!e||!t)){e.style.display="block",t.innerHTML='<p style="color:#888;font-size:0.85rem;padding:2rem">⏳ Desconectando sesión anterior y generando QR...<br><small>Esto puede tardar hasta 20 segundos</small></p>';try{const a=await(await fetch(f+"/campanas/wa-reiniciar",{method:"POST"})).json();if(a.qr){const n=a.qr.startsWith("data:")?a.qr:"data:image/png;base64,"+a.qr;t.innerHTML=`
        <p style="color:#2e7d32;font-size:0.82rem;margin-bottom:8px">✅ Escanea este QR con WhatsApp en tu celular</p>
        <img src="${n}" style="width:220px;height:220px;display:block;margin:0 auto">
        <p style="color:#888;font-size:0.75rem;margin-top:8px">El QR expira en ~20 segundos. Si expira, vuelve a hacer clic.</p>`,window._waEstadoInterval&&clearInterval(window._waEstadoInterval),window._waEstadoInterval=setInterval(async()=>{await verificarEstadoWA()&&(clearInterval(window._waEstadoInterval),e.style.display="none")},4e3)}else if(a.nota)t.innerHTML=`<p style="color:#1565c0;font-size:0.82rem;padding:1rem">ℹ️ ${a.nota}<br>Intenta enviar un mensaje de prueba.</p>`,verificarEstadoWA();else{const n=a.qr_err||a.logout_err||"No se pudo obtener QR";t.innerHTML=`
        <p style="color:#c62828;font-size:0.82rem;padding:1rem">
          ❌ ${n.replace(/\n/g,"<br>")}
        </p>
        <button onclick="mostrarQRWhatsApp()" style="margin:0.5rem;padding:0.4rem 1rem;background:#E91E8C;color:white;border:none;border-radius:6px;cursor:pointer">
          🔄 Intentar obtener QR de nuevo
        </button>`}}catch(o){t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error de conexión: ${o.message}<br><small>Verifica que el servidor local esté corriendo.</small></p>`}}};window.mostrarQRWhatsApp=async()=>{const e=document.getElementById("wa-qr-panel"),t=document.getElementById("wa-qr-img");if(!(!e||!t)){e.style.display="block",t.innerHTML='<p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>';try{const a=await(await fetch(f+"/campanas/wa-qr")).json();if(a.qr){const n=a.qr.startsWith("data:")?a.qr:"data:image/png;base64,"+a.qr;t.innerHTML=`<img src="${n}" style="width:220px;height:220px;display:block">`,window._waEstadoInterval&&clearInterval(window._waEstadoInterval),window._waEstadoInterval=setInterval(async()=>{await window.verificarEstadoWA()&&clearInterval(window._waEstadoInterval)},4e3)}else t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${a.error||"No se obtuvo QR"}</p>`}catch(o){t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${o.message}</p>`}}};window.desconectarWhatsApp=async()=>{confirm("¿Desconectar WhatsApp Business?")&&(await fetch(f+"/campanas/wa-desconectar",{method:"POST"}),verificarEstadoWA())};window.actualizarVistaCampana=()=>{var p,m,g,u;const e=((p=document.querySelector('input[name="campana-segmento"]:checked'))==null?void 0:p.value)||"todos",t=((m=document.querySelector('input[name="campana-plantilla"]:checked'))==null?void 0:m.value)||"catalogo",o=(g=window._plantillasCampana)==null?void 0:g.find(b=>b.id===t),a=window._campanaClientes||[],n=document.getElementById("mensaje-personalizado");n&&(n.style.display=t==="personalizado"?"block":"none");let i=a;e!=="todos"&&(["menudeo","mayoreo","zapateria"].includes(e)?i=a.filter(b=>b.tipo===e):i=a.filter(b=>b.segmento===e)),t==="nuevos"&&cargarFotosNuevosModelos();const r=document.getElementById("campana-foto-manual");r&&(r.style.display=t==="nuevos"?"none":"block");const s=document.getElementById("campana-fotos-nuevos");s&&(s.style.display=t==="nuevos"?"block":"none");const d=document.getElementById("mensaje-preview");if(d){if(t==="catalogo_interactivo")d.style.background="#e3f2fd",d.style.borderColor="#90caf9",d.style.color="#1565c0",d.textContent=`🛍️ Los productos seleccionados se enviarán como tarjetas interactivas en WhatsApp.

El cliente puede ver cada modelo, elegir talla/color y hacer su pedido directamente desde el chat.

⚠️ Requiere que los productos estén en el catálogo de Meta Commerce.`;else if(d.style.background="#e8f5e9",d.style.borderColor="#a5d6a7",d.style.color="#333",o){let b;t==="personalizado"?b=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}","María"):b=o.mensaje("María"),d.textContent=b}}const l=document.getElementById("campana-count");l&&(l.textContent=i.length+" clientes");const c=document.getElementById("campana-lista");if(c){if(!i.length){c.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No hay clientes en este segmento con teléfono registrado</div>';return}window._campanaFiltrados=i,window._campanaPlantillaId=t,c.innerHTML=i.map((b,v)=>{var _;let y;t==="personalizado"?y=(((_=document.getElementById("texto-personalizado"))==null?void 0:_.value)||"").replace("{nombre}",b.nombre.split(" ")[0]):y=o.mensaje(b.nombre.split(" ")[0]);const h=encodeURIComponent(y),w=(b.lada||"52")+b.telefono.replace(/\D/g,"");return`
      <div class="campana-cli-row" data-idx="${v}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${v}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${b.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${b.tipo==="mayoreo"?"Mayoreo":b.tipo==="zapateria"?"Corridas":"Menudeo"} · ${b.telefono}</p>
        </div>
        <a href="https://wa.me/${w}?text=${h}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `}).join(""),actualizarContadorCampana()}};window.actualizarContadorCampana=()=>{const t=document.querySelectorAll(".campana-cli-check:checked").length;document.querySelectorAll("#campana-sel-count, #campana-sel-count-auto").forEach(i=>{i&&(i.textContent=t)});const o=document.getElementById("btn-campana-seleccionados"),a=document.getElementById("btn-campana-auto");o&&(o.style.display=t>0?"inline-flex":"none"),a&&(a.style.display=t>0?"inline-flex":"none"),document.querySelectorAll(".campana-cli-check").forEach(i=>i.disabled=!1);const n=document.getElementById("campana-sel-todos");if(n){const i=document.querySelectorAll(".campana-cli-check").length;n.checked=t>0&&t===i,n.indeterminate=t>0&&t<i}};window.filtrarClientesCampana=e=>{var s;const t=(e||"").toLowerCase().trim(),o=window._campanaFiltrados||[],a=window._campanaPlantillaId||"catalogo",n=(s=window._plantillasCampana)==null?void 0:s.find(d=>d.id===a),i=document.getElementById("campana-lista");if(!i)return;const r=t?o.filter(d=>d.nombre.toLowerCase().includes(t)||(d.telefono||"").includes(t)):o;if(!r.length){i.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No se encontraron clientes</div>';return}i.innerHTML=r.map(d=>{var g;const l=o.indexOf(d);let c;a==="personalizado"?c=(((g=document.getElementById("texto-personalizado"))==null?void 0:g.value)||"").replace("{nombre}",d.nombre.split(" ")[0]):c=n?n.mensaje(d.nombre.split(" ")[0]):"";const p=encodeURIComponent(c),m=(d.lada||"52")+d.telefono.replace(/\D/g,"");return`
      <div class="campana-cli-row" data-idx="${l}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${l}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${d.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${d.tipo==="mayoreo"?"Mayoreo":d.tipo==="zapateria"?"Corridas":"Menudeo"} · ${d.telefono}</p>
        </div>
        <a href="https://wa.me/${m}?text=${p}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `}).join("")};window.cargarFotosNuevosModelos=async()=>{const e=document.getElementById("campana-modelos-lista");if(window._campanaModelosData||(window._campanaModelosData=new Map),window._campanaModelosSeleccionados||(window._campanaModelosSeleccionados=new Set),window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set),!e||window._campanaModelosList){window._campanaModelosList&&_renderModelosCampana(window._campanaModelosList);return}try{const t=await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=500");window._campanaModelosList=await t.json(),_renderModelosCampana(window._campanaModelosList)}catch{e&&(e.innerHTML='<p style="padding:10px 12px;color:red;font-size:0.8rem">Error cargando modelos</p>')}};window._renderModelosCampana=e=>{const t=document.getElementById("campana-modelos-lista");if(!t)return;if(!e.length){t.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>';return}const o=window._campanaModelosSeleccionados||new Set;t.innerHTML=e.map(a=>{const n=o.has(String(a.id));return`
    <div onclick="seleccionarModeloCampana('${a.id}', this)" id="modelo-item-${a.id}"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s;background:${n?"#fce4ec":""}">
      ${a.imagen_principal?`<img src="${a.imagen_principal}" style="width:34px;height:34px;object-fit:cover;border-radius:5px;flex-shrink:0">`:'<div style="width:34px;height:34px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px">👟</div>'}
      <span style="font-size:0.83rem;font-weight:${n?"700":"500"}">${a.nombre||a.sku_interno}</span>
      ${n?'<span style="margin-left:auto;font-size:0.7rem;background:#E91E8C;color:white;border-radius:20px;padding:1px 8px">✓</span>':""}
    </div>`}).join("")};window.filtrarModelosCampana=e=>{const t=window._campanaModelosList||[],o=e.trim()?t.filter(a=>(a.nombre||"").toLowerCase().includes(e.toLowerCase())||(a.sku_interno||"").toLowerCase().includes(e.toLowerCase())):t;_renderModelosCampana(o)};window.seleccionarModeloCampana=async(e,t)=>{var i,r,s;const o=String(e);window._campanaModelosSeleccionados||(window._campanaModelosSeleccionados=new Set),window._campanaModelosData||(window._campanaModelosData=new Map),window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set);const a=document.getElementById("campana-fotos-nuevos-grid");if(window._campanaModelosSeleccionados.has(o)){window._campanaModelosSeleccionados.delete(o);for(const d of[...window._campanaColoresSeleccionados])d.startsWith(o+"::")&&window._campanaColoresSeleccionados.delete(d);if(t){t.style.background="";const d=t.querySelector("span");d&&(d.style.fontWeight="500"),t.querySelector("span:last-child")}_renderColoresNuevos(),actualizarCountFotos(),window._campanaModelosList&&_renderModelosCampana((i=document.getElementById("campana-nuevo-buscar"))!=null&&i.value?(window._campanaModelosList||[]).filter(d=>(d.nombre||"").toLowerCase().includes(document.getElementById("campana-nuevo-buscar").value.toLowerCase())):window._campanaModelosList||[]);return}if(window._campanaModelosSeleccionados.add(o),t){t.style.background="#fce4ec";const d=t.querySelector("span");d&&(d.style.fontWeight="700")}if(a){const d=document.createElement("p");d.id="campana-load-"+o,d.style.cssText="font-size:0.8rem;color:#aaa;padding:4px 0",d.textContent="Cargando colores...",a.appendChild(d)}if(!window._campanaModelosData.has(o))try{const d=((r=t==null?void 0:t.querySelector("span"))==null?void 0:r.textContent)||o,c=await(await fetch(f+"/variantes/producto/"+o)).json(),p={};for(const m of c)m.color&&(p[m.color]||(p[m.color]={color:m.color,color_hex:m.color_hex||null,foto_url:null}),!p[m.color].foto_url&&m.foto_url&&(p[m.color].foto_url=m.foto_url));window._campanaModelosData.set(o,{nombre:d,colores:Object.values(p)})}catch{window._campanaModelosSeleccionados.delete(o);const l=document.getElementById("campana-load-"+o);if(l&&l.remove(),a){const c=document.createElement("p");c.style.cssText="color:red;font-size:0.8rem",c.textContent="Error cargando variantes",a.appendChild(c)}return}const n=document.getElementById("campana-load-"+o);n&&n.remove(),_renderColoresNuevos(),actualizarCountFotos(),window._campanaModelosList&&_renderModelosCampana((s=document.getElementById("campana-nuevo-buscar"))!=null&&s.value?(window._campanaModelosList||[]).filter(d=>(d.nombre||"").toLowerCase().includes(document.getElementById("campana-nuevo-buscar").value.toLowerCase())):window._campanaModelosList||[])};window._renderColoresNuevos=()=>{var i;const e=document.getElementById("campana-fotos-nuevos-grid");if(!e)return;const t=window._campanaModelosSeleccionados||new Set;if(!t.size){e.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px 0">Selecciona uno o más modelos arriba</p>';return}const o=window._campanaColoresSeleccionados||new Set,a=t.size>1;let n="";for(const r of t){const s=(i=window._campanaModelosData)==null?void 0:i.get(r);if(s){if(a&&(n+=`<p style="font-size:0.72rem;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 4px;padding:0 2px">${s.nombre}</p>`),!s.colores.length){n+='<p style="font-size:0.78rem;color:#aaa;margin:0 0 6px">Sin colores registrados</p>';continue}n+=s.colores.map(d=>{const l=`${r}::${d.color}`,c=o.has(l),p=!d.foto_url;return`
      <div onclick="${p?"":`toggleColorNuevo('${l}', this)`}"
           id="color-nuevo-row-${l.replace(/[^a-zA-Z0-9]/g,"-")}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:2px solid ${c?"#E91E8C":"#eee"};cursor:${p?"default":"pointer"};background:${c?"#fce4ec":"white"};opacity:${p?".45":"1"};transition:all 0.15s;margin-bottom:4px">
        <input type="checkbox" ${c?"checked":""} ${p?"disabled":""}
               onclick="event.stopPropagation();toggleColorNuevo('${l}', this.closest('div'))"
               style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0">
        <div style="width:24px;height:24px;border-radius:50%;background:${d.color_hex||"#ccc"};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.84rem;font-weight:600">${d.color}</span>
        ${d.foto_url?`<img src="${d.foto_url}" style="width:48px;height:48px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`:'<span style="font-size:0.7rem;color:#bbb;flex-shrink:0">sin foto</span>'}
      </div>`}).join("")}}e.innerHTML=n};window.toggleColorNuevo=(e,t)=>{window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set);const o="color-nuevo-row-"+e.replace(/[^a-zA-Z0-9]/g,"-"),a=document.getElementById(o)||(t!=null&&t.closest?t.closest('[id^="color-nuevo-row"]'):null),n=a==null?void 0:a.querySelector("input[type=checkbox]");window._campanaColoresSeleccionados.has(e)?(window._campanaColoresSeleccionados.delete(e),a&&(a.style.borderColor="#eee",a.style.background="white"),n&&(n.checked=!1)):(window._campanaColoresSeleccionados.add(e),a&&(a.style.borderColor="#E91E8C",a.style.background="#fce4ec"),n&&(n.checked=!0)),actualizarCountFotos()};window.actualizarCountFotos=()=>{var o;const e=document.getElementById("campana-fotos-count");if(!e)return;const t=((o=window._campanaColoresSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t} color${t>1?"es":""} seleccionado${t>1?"s":""} — cada cliente recibirá ${t} foto${t>1?"s":""}`:"Palomea los colores que quieres enviar"};window.cargarProductosCampana=async()=>{const e=document.getElementById("campana-producto-sel");if(e)try{const o=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=created_at.desc&limit=60")).json();e.innerHTML='<option value="">— Sin foto —</option>'+o.filter(a=>a.imagen_principal).map(a=>`<option value="${a.imagen_principal}" data-nombre="${a.nombre}">${a.nombre||a.sku_interno}</option>`).join("")}catch(t){console.error("Error cargando productos campana:",t)}};window.seleccionarProductoCampana=e=>{window._campanaImagenUrl=e||"";const t=document.getElementById("campana-foto-preview"),o=document.getElementById("campana-foto-img");t&&o&&(e?(o.src=e,t.style.display="block"):(t.style.display="none",o.src=""))};window.quitarFotoCampana=()=>{window._campanaImagenUrl="";const e=document.getElementById("campana-producto-sel");e&&(e.value="");const t=document.getElementById("campana-foto-preview");t&&(t.style.display="none")};window.cargarProductosInteractivo=async()=>{const e=document.getElementById("campana-prod-grid");if(e){if(window._campanaProdInteractivoCargado){renderizarProductosInteractivo(window._campanaProdInteractivo||[]);return}e.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">Cargando...</p>';try{const o=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._campanaProdInteractivo=o,window._campanaProdSeleccionados=new Set,window._campanaProdInteractivoCargado=!0,renderizarProductosInteractivo(o)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:8px">Error cargando productos</p>')}}};window.renderizarProductosInteractivo=e=>{const t=document.getElementById("campana-prod-grid");if(!t)return;const o=window._campanaProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">No hay productos</p>';return}t.innerHTML=e.map(a=>{const n=a.sku_interno||a.id,i=o.has(n);return`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;border:1px solid ${i?"#E91E8C":"#f0f0f0"};background:${i?"#fff0f8":"white"};transition:all 0.1s" id="prod-lbl-${n}">
      <input type="checkbox" ${i?"checked":""} onchange="toggleProdInteractivo('${n}', this)"
        style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${a.imagen_principal?`<img src="${a.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:32px;height:32px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.nombre||n}</p>
        <p style="font-size:0.68rem;color:#aaa">${n}${a.categoria?" · "+a.categoria:""}</p>
      </div>
    </label>`}).join(""),actualizarCountProdInteractivo()};window.toggleProdInteractivo=(e,t)=>{window._campanaProdSeleccionados||(window._campanaProdSeleccionados=new Set);const o=document.getElementById("prod-lbl-"+e);if(t.checked){if(window._campanaProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos por mensaje interactivo");return}window._campanaProdSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fff0f8")}else window._campanaProdSeleccionados.delete(e),o&&(o.style.borderColor="#f0f0f0",o.style.background="white");actualizarCountProdInteractivo()};window.actualizarCountProdInteractivo=()=>{var o;const e=document.getElementById("campana-prod-count");if(!e)return;const t=((o=window._campanaProdSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:"Ningún producto seleccionado"};window.filtrarProductosInteractivo=e=>{const t=(e||"").toLowerCase().trim(),o=window._campanaProdInteractivo||[],a=t?o.filter(n=>(n.nombre||"").toLowerCase().includes(t)||(n.sku_interno||"").toLowerCase().includes(t)||(n.categoria||"").toLowerCase().includes(t)):o;renderizarProductosInteractivo(a)};window.enviarCatalogoInteractivo=async e=>{var i;const t=window._campanaFiltrados||[],o=Array.from(window._campanaProdSeleccionados||new Set);if(!o.length){alert("Selecciona al menos un producto");return}const a=e.map(r=>t[r]).filter(Boolean).map(r=>({telefono:r.telefono,nombre:r.nombre}));if(!a.length)return;const n=document.createElement("div");n.id="campana-auto-overlay",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",n.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${a.length} contacto${a.length>1?"s":""} · ${o.length} producto${o.length>1?"s":""}</p>
  </div>`,document.body.appendChild(n);try{const s=await(await fetch(f+"/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:a,skus:o,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();n.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${s.fallidos===0?"🎉":"✅"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${s.enviados||0} enviados</p>
      ${s.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${s.fallidos} fallidos</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${(i=s.errores)!=null&&i.length?`<p style="font-size:0.7rem;color:#aaa;margin-bottom:1rem">${s.errores[0]}</p>`:""}
      <button onclick="document.getElementById('campana-auto-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(r){n.remove(),alert("Error: "+r.message)}};window.enviarCampanaAutomatica=async()=>{var c,p;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(m=>parseInt(m.dataset.idx)),o=window._campanaFiltrados||[],a=window._campanaPlantillaId||"catalogo",n=(c=window._plantillasCampana)==null?void 0:c.find(m=>m.id===a),i=window._campanaImagenUrl||"";let r=[],s=[];if(a==="nuevos"){const m=window._campanaColoresSeleccionados||new Set;if(!m.size){alert("Selecciona al menos un color");return}for(const g of window._campanaModelosSeleccionados||new Set){const u=(p=window._campanaModelosData)==null?void 0:p.get(g);if(u)for(const b of u.colores){const v=`${g}::${b.color}`;m.has(v)&&b.foto_url&&(s.push({url:b.foto_url,caption:b.color}),r.push(b.foto_url))}}if(!s.length){alert("Los colores seleccionados no tienen foto. Selecciona colores con imagen.");return}}else i&&(r=[i]);const d=t.map(m=>o[m]).filter(Boolean).map(m=>{var u;let g;return a==="personalizado"?g=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}",m.nombre.split(" ")[0]):g=n.mensaje(m.nombre.split(" ")[0]),{nombre:m.nombre,telefono:m.telefono,lada:m.lada||"52",mensaje:g}});if(!d.length)return;const l=document.createElement("div");l.id="campana-auto-overlay",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📤</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Iniciando campaña…</h3>
      <p style="font-size:0.82rem;color:#888">Conectando con WhatsApp Business</p>
    </div>`,document.body.appendChild(l);try{const g=await(await fetch(f+"/campanas/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destinatarios:d.map(h=>({nombre:h.nombre,telefono:h.telefono,mensaje:h.mensaje})),fotos_urls:r,fotos_con_caption:s.length?s:null,imagen_url:r.length===1?r[0]:"",delay_segundos:4})})).json();if(g.error){l.remove(),alert("Error: "+g.error);return}const u=g.job_id,b=g.total,v=h=>{var B;const w=h.progreso||0,_=Math.round(w/b*100),x=h.enviados||0,z=h.fallidos||0;l.innerHTML=`
        <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
            <h3 style="font-size:1rem;font-weight:700">🤖 Enviando campaña…</h3>
            <button onclick="cancelarCampanaAuto('${u}')"
              style="background:none;border:1px solid #eee;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#888;cursor:pointer">
              ⏸ Pausar
            </button>
          </div>
          <div style="background:#f5f5f5;border-radius:100px;height:10px;margin-bottom:0.5rem;overflow:hidden">
            <div style="background:linear-gradient(90deg,#E91E8C,#c4116a);height:10px;border-radius:100px;width:${_}%;transition:width 0.5s"></div>
          </div>
          <p style="font-size:0.78rem;color:#888;text-align:center;margin-bottom:1.5rem">${w} de ${b} mensajes enviados</p>
          <div style="display:flex;gap:1rem;justify-content:center">
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#25D366">${x}</p>
              <p style="font-size:0.72rem;color:#888">Enviados</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#e53e3e">${z}</p>
              <p style="font-size:0.72rem;color:#888">Fallidos</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#888">${b-w}</p>
              <p style="font-size:0.72rem;color:#888">Pendientes</p>
            </div>
          </div>
          ${w>0&&((B=h.resultados)!=null&&B.length)?`
            <div style="margin-top:1rem;max-height:120px;overflow-y:auto;border-top:1px solid #f5f5f5;padding-top:0.75rem">
              ${h.resultados.slice(-5).map($=>`
                <div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:0.75rem">
                  <span style="color:${$.ok?"#25D366":"#e53e3e"}">${$.ok?"✅":"❌"}</span>
                  <span style="flex:1;color:#555">${$.nombre}</span>
                  ${$.ok?"":`<span style="color:#e53e3e;font-size:0.68rem" title="${($.error||"").replace(/"/g,"'")}">Error</span>`}
                </div>`).join("")}
            </div>`:""}
        </div>`};window._campanaJobId=u;const y=setInterval(async()=>{try{const w=await(await fetch(f+"/campanas/estado/"+u)).json();v(w),w.terminado&&(clearInterval(y),window._campanaUltimosResultados=w.resultados||[],setTimeout(()=>{const _=w.enviados||0,x=w.fallidos||0;l.innerHTML=`
              <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
                <div style="font-size:3.5rem;margin-bottom:1rem">${x===0?"🎉":"✅"}</div>
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
                <p style="color:#888;font-size:0.85rem;margin-bottom:0.5rem"><strong style="color:#25D366">${_} enviados</strong> correctamente</p>
                ${x>0?`
                  <p style="color:#e53e3e;font-size:0.8rem;margin-bottom:0.5rem">${x} no se pudieron enviar</p>
                  <div style="background:#fff5f5;border-radius:8px;padding:0.75rem;margin-bottom:1rem;text-align:left;max-height:140px;overflow-y:auto">
                    ${w.resultados.filter(z=>!z.ok).map(z=>`
                      <div style="font-size:0.75rem;padding:3px 0;border-bottom:1px solid #ffe0e0">
                        <span style="font-weight:600">📵 ${z.nombre}</span>
                        <span style="color:#aaa;margin-left:4px">${z.telefono}</span><br>
                        <span style="color:#e53e3e;font-size:0.68rem">${z.error?z.error.substring(0,120):"Error desconocido"}</span>
                      </div>`).join("")}
                  </div>
                  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                    <button onclick="reintentarFallidos(window._campanaUltimosResultados)"
                      style="background:#555;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:0.82rem;font-weight:700;cursor:pointer">
                      🔄 Reintentar fallidos
                    </button>
                    <button onclick="document.getElementById('campana-auto-overlay').remove()"
                      style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:0.82rem;font-weight:700;cursor:pointer">
                      Cerrar
                    </button>
                  </div>
                `:`<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">¡Todo perfecto!</p><button onclick="document.getElementById('campana-auto-overlay').remove()" style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>`}
              </div>`},600))}catch{clearInterval(y)}},1500)}catch(m){l.remove(),alert("Error conectando con el servidor: "+m.message)}};window.cancelarCampanaAuto=async e=>{try{await fetch(f+"/campanas/cancelar/"+e,{method:"POST"})}catch{}const t=document.getElementById("campana-auto-overlay");t&&t.remove()};window.reintentarFallidos=async e=>{var l,c;const t=(e||[]).filter(p=>!p.ok);if(!t.length)return;(l=document.getElementById("campana-auto-overlay"))==null||l.remove();const o=window._campanaFiltrados||[],a=window._campanaPlantillaId||"catalogo",n=(c=window._plantillasCampana)==null?void 0:c.find(p=>p.id===a),i=window._campanaFotosUrls||[],r=window._campanaFotosConCaption||null,s=window._campanaImagenUrl||"",d=t.map(p=>{const m=o.find(v=>{const y=String(v.telefono||"").replace(/\D/g,""),h=String(p.telefono||"").replace(/\D/g,"");return h.endsWith(y)||y.endsWith(h)}),g=p.nombre||(m?m.nombre:"Cliente"),u=g.split(" ")[0];let b=n?n.texto.replace("{nombre}",u):`Hola ${u}`;return{nombre:g,telefono:p.telefono,mensaje:b}});if(!d.length){alert("No se pudo reconstruir los destinatarios");return}try{const m=await(await fetch(f+"/campanas/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destinatarios:d,fotos_urls:i,fotos_con_caption:r,imagen_url:s,delay_segundos:5})})).json();if(m.error){alert("Error: "+m.error);return}alert(`Reintentando ${d.length} mensaje(s) fallido(s)...`)}catch(p){alert("Error al reintentar: "+p.message)}};window.toggleSeleccionarTodosCampana=e=>{document.querySelectorAll(".campana-cli-check").forEach(o=>{e?o.checked=!0:o.checked=!1}),actualizarContadorCampana()};window.iniciarCampanaSeleccionados=()=>{var l;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(c=>parseInt(c.dataset.idx)),o=window._campanaFiltrados||[],a=window._campanaPlantillaId||"catalogo",n=(l=window._plantillasCampana)==null?void 0:l.find(c=>c.id===a),i=t.map(c=>o[c]).filter(Boolean).map(c=>{var g;let p;a==="personalizado"?p=(((g=document.getElementById("texto-personalizado"))==null?void 0:g.value)||"").replace("{nombre}",c.nombre.split(" ")[0]):p=n.mensaje(c.nombre.split(" ")[0]);const m=(c.lada||"52")+c.telefono.replace(/\D/g,"");return{...c,mensaje:p,tel:m}});if(!i.length)return;let r=0;const s=document.createElement("div");s.id="campana-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem";const d=()=>{const c=i[r],p=Math.round(r/i.length*100);s.innerHTML=`
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
          <h3 style="font-size:1rem;font-weight:700">📣 Campaña en curso</h3>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#888">✕</button>
        </div>

        <!-- Barra de progreso -->
        <div style="background:#f5f5f5;border-radius:100px;height:6px;margin-bottom:1.5rem">
          <div style="background:#E91E8C;height:6px;border-radius:100px;width:${p}%;transition:width 0.3s"></div>
        </div>
        <p style="font-size:0.75rem;color:#888;text-align:center;margin-top:-1rem;margin-bottom:1.5rem">${r} de ${i.length} enviados</p>

        <!-- Cliente actual -->
        <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:1rem;display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.1rem;flex-shrink:0">
            ${c.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style="font-weight:700;font-size:0.95rem">${c.nombre}</p>
            <p style="font-size:0.78rem;color:#888">${c.telefono}</p>
          </div>
        </div>

        <!-- Preview mensaje -->
        <div style="background:#e8f5e9;border-radius:10px;padding:0.875rem;font-size:0.8rem;color:#333;white-space:pre-wrap;line-height:1.55;border:1px solid #a5d6a7;max-height:140px;overflow-y:auto;margin-bottom:1.25rem">${c.mensaje}</div>

        <!-- Botones -->
        <a href="https://wa.me/${c.tel}?text=${encodeURIComponent(c.mensaje)}" target="_blank"
           onclick="setTimeout(() => document.getElementById('btn-campana-siguiente')?.focus(), 800)"
           style="display:block;background:#25D366;color:white;padding:12px;border-radius:10px;font-size:0.9rem;font-weight:700;text-decoration:none;text-align:center;margin-bottom:10px">
          💬 Abrir WhatsApp con ${c.nombre.split(" ")[0]}
        </a>
        <div style="display:flex;gap:8px">
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="flex:1;padding:10px;border-radius:10px;border:1px solid #eee;background:white;font-size:0.82rem;color:#888;cursor:pointer">
            Pausar campaña
          </button>
          <button id="btn-campana-siguiente"
            onclick="window._campanaAvanzar()"
            style="flex:2;padding:10px;border-radius:10px;border:none;background:#E91E8C;color:white;font-size:0.85rem;font-weight:700;cursor:pointer">
            ${r<i.length-1?"✅ Enviado → Siguiente":"✅ Finalizar campaña"}
          </button>
        </div>
      </div>
    `};window._campanaAvanzar=()=>{if(r++,r>=i.length){s.innerHTML=`
        <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="font-size:3.5rem;margin-bottom:1rem">🎉</div>
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
          <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">Se enviaron mensajes a <strong>${i.length} clientes</strong> exitosamente.</p>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">
            Cerrar
          </button>
        </div>
      `;return}d()},d(),document.body.appendChild(s)};async function Be(){const e=document.getElementById("content");try{const[t,o]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/")]),a=await t.json(),n=await o.json(),i=new Date,r=new Date(i-30*24*60*60*1e3),s=new Date(i-90*24*60*60*1e3),d=a.map(u=>{const b=n.filter($=>$.cliente_id===u.id&&($.status==="confirmado"||$.status==="pagado")),v=b.reduce(($,C)=>$+parseFloat(C.total||0),0),y=b.length>0?new Date(b[0].created_at):null,h=b.filter($=>new Date($.created_at)>=r).length,w=y?Math.floor((i-y)/(1e3*60*60*24)):null;let _="nuevo",x="⚪ Nuevo",z="#f5f5f5",B="#888";return b.length===0?(_="nuevo",x="⚪ Sin compras",z="#f5f5f5",B="#888"):v>=5e3&&h>=1?(_="vip",x="⭐ VIP",z="#fff8e1",B="#f57f17"):w>90?(_="inactivo",x="🔴 Inactivo",z="#ffebee",B="#c62828"):w>30?(_="riesgo",x="🟡 En riesgo",z="#fff8e1",B="#f57f17"):h>=2?(_="frecuente",x="🟢 Frecuente",z="#e8f5e9",B="#2e7d32"):(_="activo",x="🔵 Activo",z="#e3f2fd",B="#1565c0"),{...u,totalGastado:v,ultimoPedido:y,pedidos30:h,diasSinComprar:w,segmento:_,segmentoLabel:x,segmentoBg:z,segmentoColor:B,totalPedidos:b.length}}).sort((u,b)=>b.totalGastado-u.totalGastado),l=d.filter(u=>u.segmento==="vip").length,c=d.filter(u=>u.segmento==="inactivo").length,p=d.filter(u=>u.segmento==="riesgo").length,m=d.filter(u=>u.segmento==="frecuente"||u.segmento==="activo").length,g=d.filter(u=>u.origen==="tienda").length;window._clientesData=d,e.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('todos')">
          <p style="font-size:1.8rem;font-weight:700;color:#333">${a.length}</p>
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Total</p>
        </div>
        <div style="background:#fdf4ff;border-radius:12px;padding:1rem;border:1px solid #e9d5ff;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('tienda')">
          <p style="font-size:1.8rem;font-weight:700;color:#7c3aed">${g}</p>
          <p style="font-size:0.72rem;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px">🛍️ Tienda web</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('vip')">
          <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${l}</p>
          <p style="font-size:0.72rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⭐ VIP</p>
        </div>
        <div style="background:#e8f5e9;border-radius:12px;padding:1rem;border:1px solid #a5d6a7;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('activos')">
          <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${m}</p>
          <p style="font-size:0.72rem;color:#2e7d32;text-transform:uppercase;letter-spacing:0.5px">🟢 Activos</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('riesgo')">
          <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${p}</p>
          <p style="font-size:0.72rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('inactivo')">
          <p style="font-size:1.8rem;font-weight:700;color:#c62828">${c}</p>
          <p style="font-size:0.72rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Clientes (${a.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCliente()">+ Nuevo cliente</button>
        </div>
        <div style="padding:0 1.5rem 1rem;display:flex;gap:8px;flex-wrap:wrap">
          <input class="form-input" id="cli-buscar" placeholder="🔍 Buscar por nombre o telefono..." style="flex:1;min-width:200px" oninput="filtrarClientes()">
          <select class="form-input" id="cli-tipo" style="min-width:140px" onchange="filtrarClientes()">
            <option value="">Todos los tipos</option>
            <option value="menudeo">Menudeo</option>
            <option value="mayoreo">Mayoreo variado</option>
            <option value="zapateria">Corridas</option>
          </select>
          <select class="form-input" id="cli-origen" style="min-width:140px" onchange="filtrarClientes()">
            <option value="">Todos los orígenes</option>
            <option value="tienda">🛍️ Registrados en tienda</option>
            <option value="panel">Panel / manual</option>
          </select>
        </div>
        <div id="cli-lista">
          ${d.map(u=>`
            <div class="cli-item" data-segmento="${u.segmento}" data-tipo="${u.tipo||""}" data-origen="${u.origen||""}" data-nombre="${u.nombre.toLowerCase()}" data-tel="${u.telefono||""}"
                 style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer;transition:background 0.15s"
                 onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'"
                 onclick="verCliente('${u.id}')">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1rem;flex-shrink:0">
                ${u.nombre.charAt(0).toUpperCase()}
              </div>
              <div style="flex:1;min-width:140px">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                  <p style="font-weight:700;font-size:0.95rem">${u.nombre}</p>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${u.segmentoBg};color:${u.segmentoColor}">${u.segmentoLabel}</span>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:#f5f5f5;color:#888">${u.tipo==="mayoreo"?"Mayoreo":u.tipo==="zapateria"?"Corridas":"Menudeo"}</span>
                  ${u.origen==="tienda"?'<span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:#fdf4ff;color:#7c3aed">🛍️ Tienda</span>':""}
                </div>
                <p style="font-size:0.78rem;color:#888">${u.telefono||"Sin teléfono"}${u.ciudad?" · "+u.ciudad:""}</p>
                ${u.comentarios_internos?`<p style="font-size:0.72rem;color:#E91E8C;margin-top:2px">📝 ${u.comentarios_internos.substring(0,50)}${u.comentarios_internos.length>50?"...":""}</p>`:""}
              </div>
              <div style="text-align:right;min-width:100px">
                <p style="font-weight:700;color:#E91E8C;font-size:0.95rem">$${u.totalGastado.toFixed(0)}</p>
                <p style="font-size:0.72rem;color:#888">${u.totalPedidos} pedidos</p>
                ${u.diasSinComprar!==null?`<p style="font-size:0.68rem;color:${u.diasSinComprar>60?"#c62828":"#aaa"}">${u.diasSinComprar===0?"Hoy":"Hace "+u.diasSinComprar+" días"}</p>`:""}
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap" onclick="event.stopPropagation()">
                ${u.tipo==="menudeo"?`<button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem;border-color:#7c3aed;color:#7c3aed" onclick="cambiarTipoCliente('${u.id}','mayoreo',this)">→ Mayoreo</button>`:""}
                ${u.tipo==="mayoreo"?`<button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="cambiarTipoCliente('${u.id}','menudeo',this)">→ Menudeo</button>`:""}
                <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="mostrarFormCliente('${u.id}')">Editar</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarClientes=()=>{var a,n,i;const e=(((a=document.getElementById("cli-buscar"))==null?void 0:a.value)||"").toLowerCase(),t=((n=document.getElementById("cli-tipo"))==null?void 0:n.value)||"",o=((i=document.getElementById("cli-origen"))==null?void 0:i.value)||"";document.querySelectorAll(".cli-item").forEach(r=>{const s=r.dataset.nombre||"",d=r.dataset.tel||"",l=r.dataset.tipo||"",c=r.dataset.origen||"",p=!e||s.includes(e)||d.includes(e),m=!t||l===t,g=!o||c===o;r.style.display=p&&m&&g?"":"none"})};window.filtrarClientesSeg=e=>{const t=document.getElementById("cli-tipo"),o=document.getElementById("cli-origen");t&&(t.value=""),o&&(o.value=""),document.querySelectorAll(".cli-item").forEach(a=>{if(e==="todos"){a.style.display="";return}if(e==="tienda"){a.style.display=a.dataset.origen==="tienda"?"":"none";return}if(e==="activos"){a.style.display=a.dataset.segmento==="activo"||a.dataset.segmento==="frecuente"?"":"none";return}a.style.display=a.dataset.segmento===e?"":"none"})};window.cambiarTipoCliente=async(e,t,o)=>{const a=o.textContent;o.disabled=!0,o.textContent="...";try{const i=await(await fetch(f+`/clientes/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({tipo:t})})).json();if(i&&!i.error){o.textContent="✅ Actualizado",o.style.color="#15803d",o.style.borderColor="#15803d";const r=o.closest(".cli-item");if(r){r.dataset.tipo=t;const s=r.querySelector("[data-badge-tipo]");s&&(s.textContent=t==="mayoreo"?"Mayoreo":"Menudeo")}setTimeout(()=>Be(),1200)}else o.textContent=a,o.disabled=!1,alert("Error: "+((i==null?void 0:i.error)||"desconocido"))}catch{o.textContent=a,o.disabled=!1}};async function ot(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/sucursales/")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Sucursales (${o.length})</h3>
          <button class="btn btn-primary">+ Nueva sucursal</button>
        </div>
        <table>
          <thead>
           <tr><th>Nombre</th><th>Tipo</th><th>Direccion</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr>          </thead>
          <tbody>
            ${o.map(a=>`
              <tr>
                <td><strong>${a.nombre}</strong></td>
                <td>${a.tipo}</td>
                <td>${a.direccion||"—"}</td>
                <td>${a.telefono||"—"}</td>
                <td><span class="badge badge-success">Activa</span></td>
             <td>
              <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormSucursal('${a.id}')">Editar</button>
              </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}async function at(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/sucursales/")).json(),n=await(await fetch(f+"/productos/")).json();let r=await(await fetch(f+"/variantes/")).json();const d=await(await fetch(f+"/inventario/")).json();d.forEach(c=>{c.variantes&&c.variantes.id&&c.variantes.activa!==!1&&!r.find(p=>p.id===c.variantes.id)&&r.push(c.variantes)}),window._invData={sucursales:o,productos:n,variantes:r,inventario:d};const l=n.find(c=>c.sku_interno==="AR1011");if(l){const c=r.filter(m=>m.producto_id===l.id),p=d.filter(m=>c.some(g=>g.id===m.variante_id));console.log(`[Diag AR1011] Variantes en listado: ${c.length}`,c.map(m=>m.color+" T"+m.talla)),console.log(`[Diag AR1011] Con inventario: ${p.length}`)}e.innerHTML=`
  <div style="margin-bottom:1.5rem">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <input class="form-input" id="inv-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="flex:1;min-width:200px" oninput="renderInventario()">
      <select class="form-input" id="inv-categoria" style="min-width:140px" onchange="renderInventario()">
        <option value="">Todas las categorias</option>
        ${[...new Set(n.map(c=>c.categoria).filter(Boolean))].map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join("")}
      </select>
      <select class="form-input" id="inv-talla" style="min-width:100px" onchange="renderInventario()">
        <option value="">Todas las tallas</option>
        ${Se.map(c=>`<option value="${c}">${c}</option>`).join("")}
      </select>
      <select class="form-input" id="inv-estado" style="min-width:130px" onchange="renderInventario()">
        <option value="">Todos los estados</option>
        <option value="disponible">Disponible</option>
        <option value="bajo">Stock bajo</option>
        <option value="agotado">Agotado</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="mostrarFormInventario()">+ Agregar stock</button>
      <button class="btn btn-secondary" onclick="mostrarAlertas()" style="background:#fff8e1;border-color:#f57f17;color:#f57f17">⚠ Alertas</button>
      <button class="btn btn-secondary" onclick="mostrarInventarioMasivo()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">📋 Masivo</button>
      <button class="btn btn-secondary" onclick="mostrarEntrada()" style="background:#e8f5e9;border-color:#2e7d32;color:#2e7d32">+ Entrada</button>
      <button class="btn btn-secondary" onclick="mostrarSalida()" style="background:#ffebee;border-color:#c62828;color:#c62828">− Salida</button>
      <button class="btn btn-secondary" onclick="mostrarAjuste()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">⚙ Ajuste</button>
      <button class="btn btn-secondary" onclick="mostrarCambio()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">↔ Cambio</button>
      <button class="btn btn-secondary" onclick="mostrarTraspaso()" style="background:#e8eaf6;border-color:#283593;color:#283593">⇄ Traspaso</button>
    </div>
  </div>
  <div id="inv-contenido"></div>
`,renderInventario()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.renderInventario=()=>{const{sucursales:e,productos:t,variantes:o,inventario:a}=window._invData,n=(document.getElementById("inv-buscar")?document.getElementById("inv-buscar").value:"").toLowerCase(),i=document.getElementById("inv-categoria")?document.getElementById("inv-categoria").value:"",r=document.getElementById("inv-talla")?document.getElementById("inv-talla").value:"",s=document.getElementById("inv-estado")?document.getElementById("inv-estado").value:"",d=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],l=t.filter(m=>!(!m.activo||n&&!m.nombre.toLowerCase().includes(n)&&!(m.sku_interno||"").toLowerCase().includes(n)||i&&m.categoria!==i)),c=e.map(m=>{const g=a.filter(b=>b.sucursal_id===m.id),u=l.map(b=>{const v=o.filter(_=>_.producto_id===b.id&&_.activa!==!1);if(v.length===0)return"";const h=[...new Set(v.map(_=>_.color).filter(Boolean))].map(_=>{const x=v.filter(C=>C.color===_).sort((C,G)=>d.indexOf(C.talla)-d.indexOf(G.talla));if(r&&!x.find(C=>C.talla===r))return"";const z=x[0]?x[0].color_hex:"#888",B=x[0]?x[0].foto_url:null,$=x.map(C=>{const G=g.find(A=>A.variante_id===C.id),S=G?G.cantidad:null,M=G?G.stock_minimo:3;if(r&&C.talla!==r||s&&(s==="agotado"&&S!==0||s==="bajo"&&(S===null||S===0||S>M)||s==="disponible"&&(S===null||S===0||S<=M)))return"";let D,j;return S===null?(D="#f0f0f0",j="#aaa"):S===0?(D="#ffebee",j="#c62828"):S<=M?(D="#fff8e1",j="#f57f17"):(D="#e8f5e9",j="#2e7d32"),`
            <div style="display:flex;align-items:center;justify-content:space-between;background:${D};border-radius:10px;padding:8px 12px;border:1px solid ${j}30">
              <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:44px">T${C.talla}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="cambiarStockInventario('${C.id}', '${m.id}', ${S!==null?S:0}, ${M}, -1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
                <span id="stock-${C.id}-${m.id}" style="font-size:1.1rem;font-weight:700;color:${j};min-width:32px;text-align:center">${S!==null?S:"—"}</span>
                <button onclick="cambiarStockInventario('${C.id}', '${m.id}', ${S!==null?S:0}, ${M}, 1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
            </div>
          `}).join("");return $.trim()?`
          <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              ${B?`<img src="${B}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:`<div style="width:52px;height:52px;background:${z};border-radius:8px;border:1px solid #eee;flex-shrink:0;opacity:0.7"></div>`}
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:14px;height:14px;border-radius:50%;background:${z};border:2px solid #ddd;flex-shrink:0"></div>
                <span style="font-size:0.9rem;font-weight:600;color:#333">${_}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
              ${$}
            </div>
          </div>
        `:""}).join("");if(!h.trim())return"";const w=b.imagen_principal;return`
        <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
            ${w?`<img src="${w}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:56px;height:56px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>'}
            <div>
              <p style="font-weight:700;font-size:1rem;color:#1a1a1a;margin-bottom:2px">${b.nombre}</p>
              <div>
                <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px;margin-right:4px">${b.sku_interno||"—"}</span>
                <span style="font-size:0.72rem;color:#E91E8C;background:#fce4f3;padding:2px 8px;border-radius:100px">${b.categoria||""}</span>
              </div>
            </div>
          </div>
          ${h}
        </div>
      `}).join("");return u.trim()?`
      <div style="margin-bottom:2rem">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
          <div style="flex:1;height:2px;background:linear-gradient(90deg,#E91E8C,transparent)"></div>
          <h3 style="font-size:1rem;font-weight:700;color:#E91E8C;white-space:nowrap;padding:0 12px">${m.nombre.toUpperCase()}</h3>
          <div style="flex:1;height:2px;background:linear-gradient(270deg,#E91E8C,transparent)"></div>
        </div>
        ${u}
      </div>
    `:""}).join(""),p=document.getElementById("inv-contenido");p&&(p.innerHTML=c||'<div style="text-align:center;padding:3rem;color:#888"><p>No hay inventario registrado</p></div>')};window.cambiarStockInventario=async(e,t,o,a,n)=>{const i=Math.max(0,o+n);try{if((await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:i,stock_minimo:a,motivo:"Ajuste desde inventario"})})).ok){const s=document.getElementById("stock-"+e+"-"+t);if(s){s.textContent=i;let c;i===0?c="#c62828":i<=a?c="#f57f17":c="#2e7d32",s.style.color=c}const d=window._invData.inventario.find(c=>c.variante_id===e&&c.sucursal_id===t);d&&(d.cantidad=i),document.querySelectorAll(`button[onclick*="${e}"][onclick*="${t}"]`).forEach(c=>{c.setAttribute("onclick",c.getAttribute("onclick").replace(/cambiarStockInventario\('[^']+', '[^']+', \d+,/,`cambiarStockInventario('${e}', '${t}', ${i},`))})}}catch{alert("Error actualizando stock")}};window.editarStock=async(e,t,o,a)=>{const n=prompt("Nueva cantidad:",o);if(n===null)return;const i=prompt("Stock minimo de alerta:",a);if(i!==null)try{const r=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(n),stock_minimo:parseInt(i),motivo:"Ajuste manual desde inventario"})});if(r.ok){const s=await fetch(f+"/inventario/");window._invData.inventario=await s.json(),renderInventario()}else{const s=await r.json().catch(()=>({}));alert("Error al guardar: "+(s.error||r.status))}}catch{alert("Error conectando con el servidor")}};window.mostrarFormInventario=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Agregar stock</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="inv-sucursal" required>
            <option value="">Selecciona sucursal...</option>
            ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="inv-buscar-v" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'inv-v')">
          <div id="inv-v-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="inv-v">
          <div id="inv-v-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad *</label>
          <input class="form-input" id="inv-cantidad" type="number" min="0" placeholder="0" required>
        </div>
        <div>
          <label class="form-label">Stock minimo (alerta)</label>
          <input class="form-input" id="inv-minimo" type="number" min="0" placeholder="3" value="3">
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarInventario()">Guardar stock</button>
      </div>
    </div>
  `};window.guardarInventario=async()=>{const e=document.getElementById("inv-sucursal").value,t=document.getElementById("inv-v").value,o=document.getElementById("inv-cantidad").value,a=document.getElementById("inv-minimo").value||3;if(!e||!t||o===""){alert("Por favor completa todos los campos");return}try{const n=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,variante_id:t,cantidad:parseInt(o),stock_minimo:parseInt(a),motivo:"Stock cargado manualmente"})});if(n.ok)alert("Stock guardado correctamente"),navegarA("inventario");else{const i=await n.json().catch(()=>({}));alert("Error al guardar stock: "+(i.error||n.status))}}catch{alert("Error conectando con el servidor")}};window.mostrarAlertas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando alertas...</p>';try{const o=await(await fetch(f+"/inventario/alertas")).json();e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#f57f17">Productos con stock bajo o agotado (${o.length})</h3>
      </div>
      ${o.length===0?'<div class="table-card" style="padding:3rem;text-align:center;color:#888"><p>Todo el inventario esta en buen nivel</p></div>':`<div class="table-card"><table>
          <thead><tr><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Minimo</th><th>Estado</th><th>Accion</th></tr></thead>
          <tbody>
            ${o.map(a=>{const n=a.cantidad||0,i=a.stock_minimo||3,r=n===0;return`
                <tr style="background:${r?"#fff5f5":"#fffdf0"}">
                  <td><strong>${a.variantes&&a.variantes.productos?a.variantes.productos.nombre:"—"}</strong></td>
                  <td>${a.variantes&&a.variantes.color||"—"}</td>
                  <td>${a.variantes&&a.variantes.talla||"—"}</td>
                  <td>${a.sucursales&&a.sucursales.nombre||"—"}</td>
                  <td><strong style="color:${r?"#c62828":"#f57f17"}">${n}</strong></td>
                  <td>${i}</td>
                  <td><span class="badge ${r?"badge-danger":"badge-warning"}">${r?"Agotado":"Stock bajo"}</span></td>
                  <td><button class="btn btn-primary" style="padding:4px 10px;font-size:0.75rem" onclick="editarStock('${a.variante_id}', '${a.sucursal_id}', ${n}, ${i})">Reabastecer</button></td>
                </tr>
              `}).join("")}
          </tbody></table></div>`}
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando alertas</p>'}};window.mostrarAjuste=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Ajuste de inventario</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Para corregir el inventario despues de un conteo fisico o para corregir errores.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="aj-sucursal">
            ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="aj-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'aj')">
          <div id="aj-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="aj">
          <div id="aj-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad correcta *</label>
          <input class="form-input" id="aj-cantidad" type="number" min="0" placeholder="Cuantos pares hay realmente">
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="aj-motivo">
            <option value="Conteo fisico">Conteo fisico</option>
            <option value="Correccion de error">Correccion de error</option>
            <option value="Merma">Merma o perdida</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarAjuste()">Guardar ajuste</button>
      </div>
    </div>
  `};window.guardarAjuste=async()=>{const e=document.getElementById("aj").value,t=document.getElementById("aj-sucursal").value,o=document.getElementById("aj-cantidad").value,a=document.getElementById("aj-motivo").value;if(!e||!t||o===""){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(o),motivo:a})})).json();i.ok?(alert("Ajuste guardado. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarCambio=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:700px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Cambio de producto</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Cuando un cliente devuelve un producto y se lleva otro. El inventario se ajusta automaticamente.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div style="background:#fff8e1;border-radius:8px;padding:1rem;border:1px solid #ffe082">
          <p style="font-weight:600;color:#f57f17;margin-bottom:0.5rem">Producto que REGRESA</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">El cliente devuelve este par</p>
          <input class="form-input" id="cam-buscar-origen" placeholder="Buscar..." oninput="buscarVariante(this.value, 'cam-origen')">
          <div id="cam-origen-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="cam-origen">
          <div id="cam-origen-seleccionado" style="display:none;margin-top:8px;padding:6px 10px;background:#fff8e1;border-radius:6px;font-size:0.8rem;color:#f57f17"></div>
        </div>
        <div style="background:#e8f5e9;border-radius:8px;padding:1rem;border:1px solid #a5d6a7">
          <p style="font-weight:600;color:#2e7d32;margin-bottom:0.5rem">Producto que SE LLEVA</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">El cliente se lleva este par</p>
          <input class="form-input" id="cam-buscar-destino" placeholder="Buscar..." oninput="buscarVariante(this.value, 'cam-destino')">
          <div id="cam-destino-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="cam-destino">
          <div id="cam-destino-seleccionado" style="display:none;margin-top:8px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.8rem;color:#2e7d32"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="cam-sucursal">
            ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="cam-motivo">
            <option value="Talla incorrecta">Talla incorrecta</option>
            <option value="Cambio de modelo">Cambio de modelo</option>
            <option value="Cambio de color">Cambio de color</option>
            <option value="Defecto">Defecto en el producto</option>
            <option value="Preferencia del cliente">Preferencia del cliente</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarCambio()">Registrar cambio</button>
      </div>
    </div>
  `};window.guardarCambio=async()=>{const e=document.getElementById("cam-origen").value,t=document.getElementById("cam-destino").value,o=document.getElementById("cam-sucursal").value,a=document.getElementById("cam-motivo").value;if(!e||!t||!o){alert("Por favor selecciona ambos productos y la sucursal");return}if(e===t){alert("El producto que regresa y el que se lleva deben ser diferentes");return}try{const i=await(await fetch(f+"/movimientos/cambio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_origen_id:e,variante_destino_id:t,sucursal_id:o,motivo:a})})).json();i.ok?(alert("Cambio registrado. El inventario se actualizo automaticamente."),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.buscarVariante=(e,t)=>{const o=window._variantesCache||[],a=document.getElementById(t+"-resultados");if(!a)return;if(!e||e.length<2){a.style.display="none";return}const n=e.toLowerCase().split(" ").filter(d=>d),i=o.filter(d=>{const l=(d.productos&&d.productos.nombre||"").toLowerCase(),c=(d.color||"").toLowerCase(),p=(d.talla||"").toLowerCase(),m=(d.sku||"").toLowerCase(),g=l+" "+c+" "+p+" "+m;return n.every(u=>g.includes(u))}),r=i.slice(0,15);if(r.length===0){a.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron resultados</div>',a.style.display="block";return}const s=t==="ped-prod";if(s){const d=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],l={};i.forEach(p=>{const m=(p.producto_id||"")+"|"+(p.color||"");l[m]||(l[m]={nombre:p.productos&&p.productos.nombre||"—",color:p.color||"",hex:p.color_hex,foto:p.foto_url,vars:[]}),l[m].vars.push(p)});const c=Object.values(l).slice(0,8);a.innerHTML=c.map(p=>{const m=p.vars.sort((g,u)=>d.indexOf(g.talla)-d.indexOf(u.talla)).map(g=>{const u=(p.nombre+" - "+p.color+" - T"+g.talla).replace(/'/g,"");return`<button onclick="agregarItemPedido('${g.id}', '${u}');this.style.background='#E91E8C';this.style.color='#fff';this.style.borderColor='#E91E8C'"
                          style="min-width:46px;min-height:42px;padding:6px 12px;border:1.5px solid #ddd;border-radius:9px;background:#fff;color:#333;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit">T${g.talla}</button>`}).join("");return`
        <div style="padding:11px 12px;border-bottom:1px solid #f0f0f0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
            ${p.foto?`<img src="${p.foto}" style="width:38px;height:38px;object-fit:cover;border-radius:7px;flex-shrink:0">`:'<div style="width:38px;height:38px;background:#f3f3f3;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
            ${p.hex?`<span style="width:13px;height:13px;border-radius:50%;background:${p.hex};border:1px solid #ddd;flex-shrink:0"></span>`:""}
            <span style="font-size:0.86rem;font-weight:600;line-height:1.2">${p.nombre}</span>
            <span style="font-size:0.78rem;color:#888">· ${p.color}</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${m}</div>
        </div>`}).join(""),a.style.display="block";return}a.innerHTML=r.map(d=>{const l=(d.productos&&d.productos.nombre||"")+" - "+d.color+" - T"+d.talla;return`
      <div onclick="${s?`agregarItemPedido('${d.id}', '${l.replace(/'/g,"")}')`:`seleccionarVariante('${d.id}', '${l.replace(/'/g,"")}', '${t}')`}; document.getElementById('${t}-resultados').style.display='none'; document.getElementById('${s?"ped-buscar-prod":t+"-buscar"}') && (document.getElementById('${s?"ped-buscar-prod":t+"-buscar"}').value='')"
           style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem;display:flex;align-items:center;gap:8px"
           onmouseover="this.style.background='#f5f5f5'"
           onmouseout="this.style.background='white'">
        ${d.color_hex?'<div style="width:12px;height:12px;border-radius:50%;background:'+d.color_hex+';border:1px solid #ddd;flex-shrink:0"></div>':""}
        <div>
          <strong>${d.productos&&d.productos.nombre||"—"}</strong>
          <span style="color:#888"> · ${d.color} · Talla ${d.talla}</span>
          <span style="color:#ccc;font-size:0.75rem"> · ${d.sku||""}</span>
        </div>
      </div>
    `}).join(""),a.style.display="block"};window.seleccionarVariante=(e,t,o)=>{const a=document.getElementById(o);a&&(a.value=e);const n=document.getElementById(o+"-seleccionado");n&&(n.textContent="Ô£ô "+t,n.style.display="block");const i=document.getElementById(o+"-resultados");i&&(i.style.display="none")};function ce(e,t){const o=t||{},a=!t;let n="";o.imagenes&&o.imagenes.length>0?n=o.imagenes.map((s,d)=>{const l=d===0;return`<div style="position:relative;cursor:pointer" data-url="${s}" data-es-portada="${l}" data-file-idx="${d}">
  <img src="${s}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid ${l?"#E91E8C":"#eee"}" onclick="seleccionarPortadaExistente(${e}, ${d})">
        ${l?'<span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>':""}
        <button onclick="eliminarFotoExistente(${e}, this)" style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`}).join(""):o.foto_url&&(n=`<div style="position:relative" data-url="${o.foto_url}" data-es-portada="true" data-file-idx="0">
      <img src="${o.foto_url}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid #E91E8C">
      <span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>
    </div>`);const i=o.imagenes&&o.imagenes[0]||o.foto_url||"",r=i?`<img src="${i}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:36px;height:36px;background:#f0f0f0;border-radius:6px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#ccc;flex-shrink:0">📷</div>';return`
    <div class="variante-item" id="variante-${e}" style="margin-bottom:0.625rem;border-radius:12px;border:1px solid #eee;box-shadow:0 1px 4px rgba(0,0,0,0.05);overflow:hidden">

      <!-- ── Compact header: always visible ── -->
      <div onclick="toggleVariante(${e})"
           style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;background:white;cursor:pointer;user-select:none">
        <div id="v${e}-swatch-header"
             style="width:26px;height:26px;border-radius:50%;background:${o.color_hex||"#cccccc"};border:2px solid #ddd;flex-shrink:0"></div>
        <span id="v${e}-header-label"
              style="font-weight:600;color:#333;font-size:0.9rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${o.color||"Color "+(e+1)}
        </span>
        <div id="v${e}-header-thumb" style="flex-shrink:0">${r}</div>
        ${e===0?'<span style="font-size:0.65rem;background:#E91E8C;color:white;padding:2px 8px;border-radius:100px;font-weight:700;flex-shrink:0">PORTADA</span>':""}
        <span id="v${e}-chevron"
              style="color:#bbb;font-size:0.8rem;flex-shrink:0;transition:transform 0.2s;transform:${a?"rotate(180deg)":"rotate(0deg)"}">▼</span>
        ${e>0?`<button type="button" onclick="event.stopPropagation();eliminarColorVariante(${e},this)"
                style="background:#ffebee;border:1px solid #ffcdd2;color:#c62828;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:0.75rem;font-weight:600;flex-shrink:0;line-height:1">✕</button>`:""}
      </div>

      <!-- ── Expandable body ── -->
      <div id="v${e}-body" style="display:${a?"block":"none"};padding:1rem;background:#fafafa;border-top:1px solid #f0f0f0">

        <!-- Palette -->
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.76rem;font-weight:600;color:#888;display:block;margin-bottom:5px">Paleta rápida</label>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${Ke.map(s=>`
              <div onclick="seleccionarColor(${e}, '${s.hex}', '${s.nombre}')"
                   title="${s.nombre}"
                   style="width:24px;height:24px;background:${s.hex};border-radius:50%;cursor:pointer;border:2px solid #ddd;flex-shrink:0;transition:transform 0.15s"
                   onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Color picker + name -->
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap">
          <input type="color" id="v${e}-hex" value="${o.color_hex||"#000000"}"
                 style="width:40px;height:40px;border:2px solid #eee;border-radius:8px;cursor:pointer;padding:2px;flex-shrink:0"
                 oninput="var s=document.getElementById('v${e}-swatch-header');if(s)s.style.background=this.value">
          <input class="form-input" id="v${e}-nombre"
                 placeholder="Nombre del color (ej: Negro, Nude, Carey...)"
                 value="${o.color||""}" style="flex:1;min-width:130px"
                 oninput="actualizarTablaStock();var lbl=document.getElementById('v${e}-header-label');if(lbl)lbl.textContent=this.value||'Color ${e+1}'">
        </div>

        <!-- Photo uploader -->
        <div style="background:white;border-radius:10px;padding:0.875rem;border:1px dashed #ddd">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px">
            <div>
              <p style="font-size:0.8rem;font-weight:600;color:#555;margin-bottom:1px">Fotos de este color</p>
              <p style="font-size:0.7rem;color:#aaa">La 1ª foto será portada · tócala para cambiarla</p>
            </div>
            <button type="button" class="btn btn-secondary"
                    onclick="document.getElementById('v${e}-imgs').click()"
                    style="font-size:0.8rem;padding:5px 12px">📷 Subir fotos</button>
            <input type="file" id="v${e}-imgs" multiple accept="image/*"
                   onchange="previsualizarImagenes(this,${e})" style="display:none">
          </div>
          <div id="v${e}-preview" style="display:flex;gap:8px;flex-wrap:wrap">
            ${n||'<div style="width:64px;height:64px;background:#f5f5f5;border-radius:8px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#ccc">📷</div>'}
          </div>
        </div>
      </div>
    </div>
  `}window.eliminarColorVariante=async(e,t)=>{const o=document.getElementById("v"+e+"-nombre"),a=o?o.value:null;if(a&&window._productoEditandoId&&window._coloresExistentes){if(!confirm("Eliminar el color "+a+" y todas sus variantes?"))return;try{const r=(await(await fetch(f+"/variantes/producto/"+window._productoEditandoId)).json()).filter(s=>s.color===a);for(const s of r)await fetch(f+"/variantes/"+s.id+"/eliminar",{method:"POST",headers:{"Content-Type":"application/json"}});window._coloresExistentes=window._coloresExistentes.filter(s=>s.color!==a),window._coloresEliminados||(window._coloresEliminados=[]),window._coloresEliminados.push(a),alert("Color eliminado correctamente")}catch{alert("Error eliminando el color");return}}t.closest(".variante-item").remove(),actualizarTablaStock()};window.eliminarFotoExistente=(e,t)=>{const o=t.parentElement,a=o.dataset.url,n=document.getElementById("v"+e+"-preview");o.remove();const i=document.getElementById("v"+e+"-nombre");if(i&&window._coloresExistentes){const r=i.value,s=window._coloresExistentes.find(d=>d.color===r);s&&(s.imagenes&&(s.imagenes=s.imagenes.filter(d=>d!==a)),s.foto_url===a&&(s.foto_url=s.imagenes&&s.imagenes.length>0?s.imagenes[0]:null))}if(o.dataset.esPortada==="true"&&n){const r=n.querySelector("div[data-url]");if(r){r.dataset.esPortada="true",r.querySelector("img").style.border="2px solid #E91E8C";const s=document.createElement("span");s.className="portada-badge",s.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",s.textContent="PORTADA",r.appendChild(s)}}};window.seleccionarPortadaExistente=(e,t)=>{const o=document.getElementById("v"+e+"-preview");if(!o)return;o.querySelectorAll(".portada-badge").forEach(n=>n.remove()),o.querySelectorAll("img").forEach(n=>n.style.border="3px solid #eee"),o.querySelectorAll("[data-es-portada]").forEach(n=>n.dataset.esPortada="false");const a=o.querySelectorAll("div[data-file-idx]");if(a[t]){a[t].dataset.esPortada="true",a[t].querySelector("img").style.border="3px solid #E91E8C";const n=document.createElement("span");n.className="portada-badge",n.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",n.textContent="PORTADA",a[t].appendChild(n)}};window.mostrarFormProducto=e=>{e||(window._coloresExistentes=null),ge=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1;const t=e||{},o=document.getElementById("content");ge=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1,e||(window._coloresExistentes=null),o.innerHTML=`
    <div class="table-card" style="padding:2rem;overflow:visible">
      <div style="position:sticky;top:0;z-index:50;background:white;border-bottom:1px solid #eee;padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin:-2rem -2rem 1.5rem -2rem;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <button type="button" class="btn btn-secondary" onclick="navegarA('productos')" style="display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:0.85rem">← Volver</button>
        <button type="button" id="btn-guardar" class="btn btn-primary" onclick="guardarProducto()" style="padding:6px 18px;font-size:0.85rem">💾 Guardar</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Nombre del producto *</label>
          <input class="form-input" id="f-nombre" required placeholder="Ej: Sandalia de tacon Valentina" value="${t.nombre||""}" oninput="actualizarSKU()">
        </div>
        <div>
          <label class="form-label">SKU interno <span style="color:#E91E8C;font-size:0.75rem">(auto-generado)</span></label>
          <div style="display:flex;gap:8px">
            <input class="form-input" id="f-sku" placeholder="Se genera automaticamente" value="${t.sku_interno||""}">
            <button type="button" class="btn btn-secondary" onclick="regenerarSKU()" style="white-space:nowrap;padding:8px 12px">Regenerar</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Marca (visible al cliente)</label>
          <input class="form-input" id="f-marca" placeholder="Ej: Zapatillas May" value="${t.marca||""}">
        </div>
        <div>
          <label class="form-label">Proveedor (interno)</label>
          <input class="form-input" id="f-proveedor" placeholder="Nombre del proveedor" value="${t.proveedor||""}" oninput="actualizarSKU()">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Categoria *</label>
          <select class="form-input" id="f-categoria" required onchange="actualizarSKU()">
            <option value="">Selecciona...</option>
            ${Ze.map(a=>`<option value="${a.value}" ${t.categoria===a.value?"selected":""}>${a.label}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Subcategoria</label>
          <input class="form-input" id="f-subcategoria" placeholder="Ej: Casual, Fiesta, Trabajo" value="${t.subcategoria||""}">
        </div>
      </div>

      <div style="margin-bottom:1rem">
        <label class="form-label">Descripcion</label>
        <textarea class="form-input" id="f-descripcion" rows="3" placeholder="Describe el producto detalladamente para SEO...">${t.descripcion||""}</textarea>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Detalles tecnicos</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
          <div><label class="form-label">Material</label><input class="form-input" id="f-material" placeholder="Ej: Cuero sintetico" value="${t.material||""}"></div>
          <div><label class="form-label">Material suela</label><input class="form-input" id="f-suela" placeholder="Ej: Hule" value="${t.material_suela||""}"></div>
          <div><label class="form-label">Forro</label><input class="form-input" id="f-forro" placeholder="Ej: Textil" value="${t.forro||""}"></div>
          <div>
            <label class="form-label">Horma</label>
            <select class="form-input" id="f-horma">
              <option value="">Selecciona...</option>
              <option value="normal" ${t.horma==="normal"?"selected":""}>Normal</option>
              <option value="reducida" ${t.horma==="reducida"?"selected":""}>Reducida</option>
              <option value="amplia" ${t.horma==="amplia"?"selected":""}>Amplia</option>
            </select>
          </div>
          <div><label class="form-label">Altura tacon (cm)</label><input class="form-input" id="f-tacon" type="number" step="0.5" placeholder="Ej: 8.5" value="${t.altura_tacon||""}"></div>
          <div>
            <label class="form-label">Tipo de tacon</label>
            <select class="form-input" id="f-tipotacon">
              <option value="">Selecciona...</option>
              <option value="aguja" ${t.tipo_tacon==="aguja"?"selected":""}>Aguja</option>
              <option value="bloque" ${t.tipo_tacon==="bloque"?"selected":""}>Bloque</option>
              <option value="cuna" ${t.tipo_tacon==="cuna"?"selected":""}>Cuna</option>
              <option value="plataforma" ${t.tipo_tacon==="plataforma"?"selected":""}>Plataforma</option>
              <option value="sin_tacon" ${t.tipo_tacon==="sin_tacon"?"selected":""}>Sin tacon</option>
            </select>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Precios</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label">Costo (interno, no visible) *</label>
            <input class="form-input" id="f-costo" type="number" step="0.01" required placeholder="0.00" value="${t.costo||""}">
          </div>
          <div>
            <label class="form-label">Precio menudeo (1 par) *</label>
            <input class="form-input" id="f-menudeo" type="number" step="0.01" required placeholder="0.00" value="${t.precio_menudeo||""}">
          </div>
        </div>
        <div style="background:#f9f9f9;border-radius:8px;padding:1rem;border:1px solid #eee">
          <p style="font-size:0.85rem;font-weight:600;margin-bottom:0.75rem;color:#333">Precios mayoreo y corrida</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:1rem">Deja en blanco para calcular automatico. Si pones un valor ese tiene prioridad.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div>
              <label class="form-label">Mayoreo 3-5 pares variados</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $30</p>
              <input class="form-input" id="f-mayoreo3" type="number" step="0.01" placeholder="Automatico" value="${t.precio_mayoreo3||""}">
            </div>
            <div>
              <label class="form-label">Mayoreo 6+ pares variados</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $70</p>
              <input class="form-input" id="f-mayoreo6" type="number" step="0.01" placeholder="Automatico" value="${t.precio_mayoreo6||""}">
            </div>
            <div>
              <label class="form-label">Media corrida (6 mismo estilo)</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $100</p>
              <input class="form-input" id="f-corrida" type="number" step="0.01" placeholder="Automatico" value="${t.precio_corrida||""}">
            </div>
          </div>
          <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-corrida-activa" ${t.corrida_activa?"checked":""}>
              <span class="form-label" style="margin:0">Permite media corrida</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-oferta" ${t.es_oferta?"checked":""}>
              <span class="form-label" style="margin:0;color:#E91E8C">Es oferta (sin descuento adicional)</span>
            </label>
          </div>
          <div style="margin-top:1rem;display:flex;gap:2rem;align-items:center;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-descuento" onchange="toggleDescuento()" ${t.tiene_descuento?"checked":""}>
              <span class="form-label" style="margin:0">Tiene descuento</span>
            </label>
            <div id="descuento-pct" style="display:${t.tiene_descuento?"flex":"none"};align-items:center;gap:6px">
              <input class="form-input" id="f-pct" type="number" min="0" max="100" placeholder="%" style="width:70px" value="${t.porcentaje_descuento||""}">
              <span class="form-label" style="margin:0">%</span>
            </div>
            <div>
              <label class="form-label">Precio antes (tachado)</label>
              <input class="form-input" id="f-antes" type="number" step="0.01" placeholder="0.00" value="${t.precio_antes||""}" style="width:130px">
            </div>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Colores e imagenes</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Selecciona de la paleta o personaliza el color. Sube las fotos de cada color por separado.</p>
        ${t&&t.foto_url?`<img src="${t.foto_url}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #ddd;margin-top:8px">`:""}
        ${window._coloresExistentes&&window._coloresExistentes.length>1?`
  <div style="background:#e8f5e9;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #a5d6a7">
    <p style="font-size:0.8rem;font-weight:600;color:#2e7d32;margin-bottom:8px">🖼️ Color portada (aparece primero en la tienda)</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${window._coloresExistentes.map((a,n)=>`
        <div onclick="seleccionarColorPortada(${n})" id="portada-color-${n}"
             style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:2px solid ${n===0?"#2e7d32":"#ddd"};cursor:pointer;background:${n===0?"#e8f5e9":"white"}">
          <div style="width:16px;height:16px;border-radius:50%;background:${a.color_hex};border:1px solid #ddd;flex-shrink:0"></div>
          <span style="font-size:0.82rem;font-weight:500">${a.color}</span>
          ${n===0?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
        </div>
      `).join("")}
    </div>
  </div>
`:""}
<div id="variantes-container">
  ${window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.map((a,n)=>ce(n,a)).join(""):ce(0,null)}
</div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px">
  ${Se.map(a=>`
    <label class="talla-label" style="display:flex;align-items:center;justify-content:center;gap:4px;padding:10px 8px;border-radius:6px;cursor:pointer;border:2px solid ${t.tallas_disponibles&&t.tallas_disponibles.includes(a)?"#E91E8C":"transparent"};background:${t.tallas_disponibles&&t.tallas_disponibles.includes(a)?"#fce4f3":"#f5f5f5"}">
      <input type="checkbox" value="${a}" style="display:none" onchange="toggleTalla(this)" ${t.tallas_disponibles&&t.tallas_disponibles.includes(a)?"checked":""}>
      <span>${a}</span>
    </label>
  `).join("")}
</div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">${t.id?"Agregar resurtido":"Stock inicial"}</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">${t.id?"Los pares que captures aquí se suman al inventario actual como entrada de mercancía.":"Captura cuantos pares tienes disponibles. Se asignarán a la sucursal seleccionada."}</p>
        <div style="margin-bottom:1rem">
          <label class="form-label">Asignar a sucursal</label>
          <select class="form-input" id="f-sucursal-stock" style="max-width:280px">
            <option value="">Cargando sucursales...</option>
          </select>
        </div>
        <div id="stock-inicial-container">
          <p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
          <div>
            <p style="font-weight:600;color:#333;margin-bottom:2px">Logistica y SEO</p>
            <p style="font-size:0.75rem;color:#aaa">Los campos de SEO se llenan automaticamente, pero puedes editarlos.</p>
          </div>
          <button type="button" id="btn-generar-seo" onclick="generarSEO()"
                  style="display:flex;align-items:center;gap:6px;padding:7px 16px;background:#f3e5f5;border:1px solid #ce93d8;color:#6a1b9a;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;transition:all 0.2s">
            ✨ Generar SEO
          </button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Peso en kilos (para envio)</label>
            <input class="form-input" id="f-peso" type="number" step="0.01" placeholder="Ej: 0.45" value="${t.peso_gramos?(t.peso_gramos/1e3).toFixed(2):""}">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Slug URL <span style="color:#888;font-size:0.72rem">(para SEO)</span></span>
              <span style="font-size:0.68rem;background:#e8f5e9;color:#2e7d32;padding:1px 6px;border-radius:100px;font-weight:600">Auto</span>
            </label>
            <input class="form-input" id="f-slug" placeholder="se genera del nombre del producto" value="${t.slug||""}">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Meta titulo <span style="color:#888;font-size:0.72rem">(SEO)</span></span>
              <span style="font-size:0.68rem;background:#e8f5e9;color:#2e7d32;padding:1px 6px;border-radius:100px;font-weight:600">Auto</span>
            </label>
            <input class="form-input" id="f-metatitulo" placeholder="se genera del nombre del producto" value="${t.meta_titulo||""}">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Meta descripcion <span style="color:#888;font-size:0.72rem">(Google)</span></span>
              <span id="metadesc-counter" style="font-size:0.72rem;color:${t.meta_descripcion&&t.meta_descripcion.length>140?"#e65100":"#888"}">${t.meta_descripcion?t.meta_descripcion.length+"/160":"0/160"}</span>
            </label>
            <textarea class="form-input" id="f-metadesc" rows="3"
                      placeholder="Usa ✨ Generar SEO para crear una descripcion optimizada para Google (max 160 caracteres)"
                      style="resize:vertical"
                      oninput="var c=document.getElementById('metadesc-counter');if(c){c.textContent=this.value.length+'/160';c.style.color=this.value.length>160?'#c62828':this.value.length>140?'#e65100':'#888'}">${t.meta_descripcion||""}</textarea>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <p style="font-weight:600;color:#333;margin:0">🎬 Video del producto</p>
          <span style="font-size:0.72rem;background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:100px;font-weight:600">Opcional</span>
        </div>
        <p style="font-size:0.8rem;color:#888;margin-bottom:12px">Pega un link de YouTube, TikTok, Vimeo o sube un MP4. Se mostrará en el modal del producto en la tienda.</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
          <input class="form-input" id="f-video-url"
                 placeholder="https://youtube.com/watch?v=... · https://tiktok.com/... · archivo.mp4"
                 value="${t.video_url||""}"
                 style="flex:1;min-width:200px"
                 oninput="previsualizarVideoPanel(this.value)">
          <button type="button"
                  onclick="document.getElementById('f-video-file').click()"
                  style="background:#f3f4f6;border:1.5px solid #d1d5db;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:0.82rem;font-weight:600;color:#374151;white-space:nowrap">
            📁 Subir video
          </button>
          <input type="file" id="f-video-file" accept="video/*" style="display:none"
                 onchange="subirVideoProducto(this)">
        </div>
        <div id="video-preview-panel" style="margin-top:8px">
          ${t.video_url?`<div style="font-size:0.8rem;color:#555;background:#f5f5f5;border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px"><span>🎬</span><a href="${t.video_url}" target="_blank" rel="noopener" style="color:#E91E8C;word-break:break-all;flex:1">${t.video_url}</a></div>`:""}
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <input type="hidden" id="f-producto-id" value="${t.id||""}">
        <button type="button" class="btn btn-primary" id="btn-guardar" onclick="guardarProducto()">💾 Guardar producto</button>
      </div>
    </div>
  `,fetch(f+"/sucursales/").then(a=>a.json()).then(a=>{const n=document.getElementById("f-sucursal-stock");n&&(n.innerHTML=a.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")),setTimeout(()=>actualizarTablaStock(),100)})};window.seleccionarColorPortada=e=>{if(!window._coloresExistentes)return;const t=window._coloresExistentes.splice(e,1)[0];window._coloresExistentes.unshift(t),document.querySelectorAll('[id^="portada-color-"]').forEach((a,n)=>{const i=n===0;a.style.borderColor=i?"#2e7d32":"#ddd",a.style.background=i?"#e8f5e9":"white",a.innerHTML=`
      <div style="width:16px;height:16px;border-radius:50%;background:${window._coloresExistentes[n].color_hex};border:1px solid #ddd;flex-shrink:0"></div>
      <span style="font-size:0.82rem;font-weight:500">${window._coloresExistentes[n].color}</span>
      ${i?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
    `,a.setAttribute("onclick","seleccionarColorPortada("+n+")")});const o=document.getElementById("variantes-container");o&&(o.innerHTML=window._coloresExistentes.map((a,n)=>ce(n,a)).join(""))};const Ae=e=>e.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");window.actualizarSKU=async()=>{const e=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",t=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",o=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"",a=document.getElementById("f-sku");if(a&&!a.value&&e&&t&&o)try{const i=await(await fetch(f+"/productos/siguiente-sku/"+t+"/"+encodeURIComponent(o))).json();a.value=i.sku_base}catch{}if(e){const n=document.getElementById("f-slug");n&&!n.value&&(n.value=Ae(e));const i=document.getElementById("f-metatitulo");i&&!i.value&&(i.value=e.trim()+" | Zapatillas May")}};window.regenerarSKU=async()=>{const e=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",t=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"";if(e&&t)try{const a=await(await fetch(f+"/productos/siguiente-sku/"+e+"/"+encodeURIComponent(t))).json(),n=document.getElementById("f-sku");n&&(n.value=a.sku_base)}catch{}else alert("Selecciona categoria y escribe el proveedor primero")};function nt(e,t,o,a,n,i,r){const s=document.getElementById("f-slug"),d=document.getElementById("f-metatitulo"),l=document.getElementById("f-metadesc");s&&!s.value&&(s.value=Ae(e)),d&&!d.value&&(d.value=e+" | Zapatillas May");const c=["Compra "+e+" en Zapatillas May."];if(t){const m=t.split(/[.!?\n]/)[0].trim();m.length>10&&c.push(m.slice(0,65)+(m.length>65?"...":""))}else if(o){const m={sandalia:"Sandalia elegante para dama",bota:"Bota de moda para dama",tenis:"Tenis casual para dama",mocasin:"Mocasín cómodo para dama",zapatilla:"Zapatilla de moda para dama",plataforma:"Plataforma cómoda para dama"};c.push((m[o]||o)+".")}a&&c.push("Material "+a+"."),n&&i?c.push("Tacón "+i+" "+n+" cm."):n&&c.push("Tacón "+n+" cm."),r&&c.push("Desde $"+parseInt(r).toLocaleString("es-MX")+" MXN."),c.push("Envío a todo México.");let p=c.join(" ");p.length>160&&(p=p.slice(0,157)+"..."),l&&Me(p)}function Me(e){const t=document.getElementById("f-metadesc");if(t){t.value=e;const o=document.getElementById("metadesc-counter");o&&(o.textContent=e.length+"/160",o.style.color=e.length>160?"#c62828":e.length>140?"#e65100":"#4caf50")}}window.generarSEO=async()=>{var l,c,p,m,g,u,b,v;const e=(((l=document.getElementById("f-nombre"))==null?void 0:l.value)||"").trim(),t=(((c=document.getElementById("f-descripcion"))==null?void 0:c.value)||"").trim(),o=(((p=document.getElementById("f-categoria"))==null?void 0:p.value)||"").trim(),a=(((m=document.getElementById("f-material"))==null?void 0:m.value)||"").trim(),n=(((g=document.getElementById("f-tacon"))==null?void 0:g.value)||"").trim(),i=(((u=document.getElementById("f-tipotacon"))==null?void 0:u.value)||"").trim(),r=(((b=document.getElementById("f-menudeo"))==null?void 0:b.value)||"").trim(),s=(((v=document.getElementById("f-horma"))==null?void 0:v.value)||"").trim();if(!e&&!t){alert("Escribe el nombre o la descripción del producto primero");return}const d=document.getElementById("btn-generar-seo");d&&(d.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite">⏳</span> Analizando...',d.disabled=!0,d.style.opacity="0.7");try{const h=await(await fetch(f+"/productos/generar-seo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:e,descripcion:t,categoria:o,material:a,tacon:n,tipo_tacon:i,precio:r,horma:s})})).json();if(h.error)throw new Error(h.error);const w=document.getElementById("f-slug"),_=document.getElementById("f-metatitulo");if(w&&h.slug&&(w.value=h.slug),_&&h.meta_titulo&&(_.value=h.meta_titulo),h.meta_descripcion&&Me(h.meta_descripcion),h.nombre_producto&&e!==h.nombre_producto){const x=document.getElementById("f-nombre");if(x){let z=document.getElementById("seo-nombre-sugerido");z||(z=document.createElement("div"),z.id="seo-nombre-sugerido",z.style.cssText="margin-top:6px;padding:8px 12px;background:#f3e5f5;border-radius:8px;border:1px solid #ce93d8;font-size:0.78rem;color:#6a1b9a;display:flex;align-items:center;justify-content:space-between;gap:8px",x.parentElement.appendChild(z)),z.dataset.sugerido=h.nombre_producto,z.innerHTML="<span>✨ Nombre sugerido para la tienda: <strong>"+h.nombre_producto+`</strong></span><button onclick="var p=this.closest('#seo-nombre-sugerido');document.getElementById('f-nombre').value=p.dataset.sugerido;p.remove()" style="background:#6a1b9a;color:white;border:none;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:0.75rem;white-space:nowrap">Usar este</button>`}}d&&(d.innerHTML="✅ SEO generado con IA",d.style.background="#e8f5e9",d.style.color="#2e7d32",d.style.borderColor="#a5d6a7",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}catch{nt(e,t,o,a,n,i,r),d&&(d.innerHTML="✅ SEO generado",d.style.background="#fff8e1",d.style.color="#f57f17",d.style.borderColor="#ffe082",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}};window.seleccionarColor=(e,t,o)=>{const a=document.getElementById("v"+e+"-hex"),n=document.getElementById("v"+e+"-nombre");if(a){a.value=t;const i=document.getElementById("v"+e+"-swatch-header");i&&(i.style.background=t)}if(n){n.value=o;const i=document.getElementById("v"+e+"-header-label");i&&(i.textContent=o)}actualizarTablaStock()};window.toggleVariante=e=>{const t=document.getElementById("v"+e+"-body"),o=document.getElementById("v"+e+"-chevron");if(!t)return;const a=t.style.display!=="none";t.style.display=a?"none":"block",o&&(o.style.transform=a?"rotate(0deg)":"rotate(180deg)")};window.agregarVariante=()=>{document.querySelectorAll(".variante-item").forEach(n=>{const i=n.id&&n.id.match(/^variante-(\d+)$/);if(i){const r=i[1],s=document.getElementById("v"+r+"-body"),d=document.getElementById("v"+r+"-chevron");s&&(s.style.display="none"),d&&(d.style.transform="rotate(0deg)")}});const e=ge++,t=document.getElementById("variantes-container"),o=document.createElement("div");o.innerHTML=ce(e,null),t.appendChild(o.firstElementChild);const a=document.getElementById("variante-"+e);a&&setTimeout(()=>a.scrollIntoView({behavior:"smooth",block:"nearest"}),60)};window.previsualizarImagenes=(e,t)=>{const o=document.getElementById("v"+t+"-preview");o&&(o.querySelectorAll("[data-existente]"),Array.from(e.files).forEach((a,n)=>{const i=new FileReader;i.onload=r=>{const s=document.createElement("div");s.style.cssText="position:relative;cursor:pointer",s.dataset.fileIdx=n,s.innerHTML=`
        <img src="${r.target.result}" 
             style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #ddd"
             onclick="seleccionarPortada(${t}, this)">
        <button onclick="this.parentElement.remove()" 
                style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      `,o.appendChild(s),o.querySelectorAll(".portada-badge").length===0&&seleccionarPortada(t,s.querySelector("img"))},i.readAsDataURL(a)}))};window.seleccionarPortada=(e,t)=>{const o=document.getElementById("v"+e+"-preview");if(!o)return;o.querySelectorAll(".portada-badge").forEach(n=>n.remove()),o.querySelectorAll("img").forEach(n=>n.style.border="2px solid #ddd"),t.style.border="2px solid #E91E8C";const a=document.createElement("span");a.className="portada-badge",a.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",a.textContent="PORTADA",t.parentElement.appendChild(a),t.parentElement.dataset.esPortada="true",o.querySelectorAll("[data-es-portada]").forEach(n=>{n!==t.parentElement&&delete n.dataset.esPortada})};window.toggleDescuento=()=>{const e=document.getElementById("f-descuento"),t=document.getElementById("descuento-pct");e&&t&&(t.style.display=e.checked?"flex":"none")};window.toggleTalla=e=>{const t=e.closest(".talla-label");e.checked?(t.style.borderColor="#E91E8C",t.style.background="#fce4f3"):(t.style.borderColor="transparent",t.style.background="#f5f5f5"),actualizarTablaStock()};window.actualizarTablaStock=()=>{const e=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],t=[...document.querySelectorAll(".talla-label input:checked")].map(i=>i.value).sort((i,r)=>e.indexOf(i)-e.indexOf(r)),o=document.querySelectorAll(".variante-item"),a=[];o.forEach(i=>{const r=i.id.replace("variante-",""),s=document.getElementById("v"+r+"-nombre"),d=document.getElementById("v"+r+"-hex");s&&s.value&&a.push({nombre:s.value,hex:d?d.value:"#000",id:r})});const n=document.getElementById("stock-inicial-container");if(n){if(t.length===0||a.length===0){n.innerHTML='<p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>';return}n.innerHTML=a.map(i=>`
    <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
        <div style="width:14px;height:14px;border-radius:50%;background:${i.hex};border:1px solid #ddd;flex-shrink:0"></div>
        <span style="font-size:0.9rem;font-weight:600">${i.nombre}</span>
        <span style="margin-left:auto;font-size:0.82rem;color:#E91E8C;font-weight:700">Total: <span id="total-color-${i.id}">0</span> pares</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
        ${t.map(r=>`
          <div style="display:flex;align-items:center;gap:6px;background:white;padding:6px 8px;border-radius:8px;border:1px solid #eee">
            <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:32px">T${r}</span>
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${i.id}-${r.replace(".","_")}');el.value=Math.max(0,(parseInt(el.value)||0)-1);actualizarTotalColor('${i.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">−</button>
            <input type="number" min="0" placeholder="0"
                   id="stock-ini-${i.id}-${r.replace(".","_")}"
                   oninput="actualizarTotalColor('${i.id}')"
                   style="flex:1;text-align:center;padding:5px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:700;min-width:0">
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${i.id}-${r.replace(".","_")}');el.value=(parseInt(el.value)||0)+1;actualizarTotalColor('${i.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">+</button>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}};window.actualizarTotalColor=e=>{const t=document.querySelectorAll('[id^="stock-ini-'+e+'-"]');let o=0;t.forEach(n=>o+=parseInt(n.value)||0);const a=document.getElementById("total-color-"+e);a&&(a.textContent=o)};async function it(){const e=document.querySelectorAll(".variante-item"),t=[];for(const o of e){const a=o.id.replace("variante-",""),n=document.getElementById("v"+a+"-hex"),i=document.getElementById("v"+a+"-nombre"),r=document.getElementById("v"+a+"-imgs"),s=document.getElementById("v"+a+"-preview");if(!i||!i.value)continue;const d=[];if(s){const l=s.querySelector('[data-es-portada="true"]'),c=l?l.dataset.url:null;c&&d.push(c),s.querySelectorAll("div[data-url]").forEach(p=>{const m=p.dataset.url;m&&!d.includes(m)&&d.push(m)})}if(r&&r.files.length>0){const l=s?s.querySelector('[data-es-portada="true"]'):null,c=l?parseInt(l.dataset.fileIdx??"0"):0,p=Array.from(r.files);console.log(`[Fotos] Color "${i.value}": subiendo ${p.length} foto(s) en paralelo`);const m=async(v,y)=>{for(let h=1;h<=3;h++){const w=new FormData;w.append("archivo",v);try{const _=await fetch(f+"/imagenes/subir",{method:"POST",body:w});if(!_.ok){h<3&&await new Promise(z=>setTimeout(z,1200));continue}const x=await _.json();if(x.url)return{fi:y,url:x.url}}catch{h<3&&await new Promise(x=>setTimeout(x,1200))}}return console.error(`[Fotos] FALLÓ foto ${y+1} de "${i.value}" tras 3 intentos`),{fi:y,url:null}},g=await Promise.all(p.map((v,y)=>m(v,y))),u=g.find(v=>v.fi===c);u!=null&&u.url&&d.push(u.url);for(const v of g)v.fi!==c&&v.url&&d.push(v.url);const b=g.filter(v=>!v.url).length;b>0&&alert(`⚠️ ${b} foto(s) de "${i.value}" no se pudieron subir. Intenta de nuevo.`),console.log(`[Fotos] Color "${i.value}": ${d.length} URL(s) listas`)}t.push({color:i.value,color_hex:n?n.value:"#000000",imagenes:d})}return t}window.previsualizarVideoPanel=e=>{const t=document.getElementById("video-preview-panel");if(t){if(!e||!e.trim()){t.innerHTML="";return}t.innerHTML=`<div style="font-size:0.8rem;color:#555;background:#f5f5f5;border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px"><span>🎬</span><a href="${e}" target="_blank" rel="noopener" style="color:#E91E8C;word-break:break-all;flex:1">${e}</a></div>`}};window.subirVideoProducto=async e=>{const t=e.files[0];if(!t)return;const o=document.getElementById("f-video-url"),a=document.getElementById("video-preview-panel");a&&(a.innerHTML='<div style="color:#888;font-size:0.82rem;padding:8px 0">Subiendo video... ⏳ (puede tardar unos segundos)</div>');try{const n=new FormData;n.append("archivo",t);const r=await(await fetch(f+"/imagenes/videos/subir",{method:"POST",body:n})).json();r.url?(o&&(o.value=r.url),window.previsualizarVideoPanel(r.url)):a&&(a.innerHTML='<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error al subir. Intenta pegar el URL manualmente.</div>')}catch{a&&(a.innerHTML='<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error de red. Intenta pegar el URL manualmente.</div>')}e.value=""};window.guardarProducto=async()=>{if(window._guardandoProducto)return;window._guardandoProducto=!0;const e=document.getElementById("f-producto-id")?document.getElementById("f-producto-id").value:"";e&&(window._productoEditandoId=e);const t=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",o=document.getElementById("f-costo")?document.getElementById("f-costo").value:"",a=document.getElementById("f-menudeo")?document.getElementById("f-menudeo").value:"",n=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"";if(!t||!o||!a||!n){alert("Por favor completa los campos obligatorios: Nombre, Categoria, Costo y Precio menudeo");return}const i=document.getElementById("btn-guardar");i&&(i.textContent="Guardando...",i.disabled=!0);const r=[...document.querySelectorAll(".talla-label input:checked")].map(m=>m.value);console.log(`[Guardar] Tallas seleccionadas (${r.length}):`,r);const s=await it();console.log(`[Guardar] Colores a guardar (${s.length}):`,s.map(m=>m.color));const d=[];document.querySelectorAll(".variante-item").forEach(m=>{const g=m.id.replace("variante-",""),u=document.getElementById("v"+g+"-nombre"),b=document.getElementById("v"+g+"-hex");u&&u.value&&d.push({id:g,nombre:u.value,hex:b?b.value:"#000"})});const l=document.getElementById("f-peso")?document.getElementById("f-peso").value:"",c=l?Math.round(parseFloat(l)*1e3):null,p={nombre:t,sku_interno:document.getElementById("f-sku")&&document.getElementById("f-sku").value||null,marca:document.getElementById("f-marca")&&document.getElementById("f-marca").value||null,proveedor:document.getElementById("f-proveedor")&&document.getElementById("f-proveedor").value||null,categoria:n,subcategoria:document.getElementById("f-subcategoria")&&document.getElementById("f-subcategoria").value||null,descripcion:document.getElementById("f-descripcion")&&document.getElementById("f-descripcion").value||null,material:document.getElementById("f-material")&&document.getElementById("f-material").value||null,material_suela:document.getElementById("f-suela")&&document.getElementById("f-suela").value||null,forro:document.getElementById("f-forro")&&document.getElementById("f-forro").value||null,horma:document.getElementById("f-horma")&&document.getElementById("f-horma").value||null,altura_tacon:document.getElementById("f-tacon")&&document.getElementById("f-tacon").value?parseFloat(document.getElementById("f-tacon").value):null,tipo_tacon:document.getElementById("f-tipotacon")&&document.getElementById("f-tipotacon").value||null,costo:parseFloat(o),precio_menudeo:parseFloat(a),precio_mayoreo3:document.getElementById("f-mayoreo3")&&document.getElementById("f-mayoreo3").value?parseFloat(document.getElementById("f-mayoreo3").value):null,precio_mayoreo6:document.getElementById("f-mayoreo6")&&document.getElementById("f-mayoreo6").value?parseFloat(document.getElementById("f-mayoreo6").value):null,precio_corrida:document.getElementById("f-corrida")&&document.getElementById("f-corrida").value?parseFloat(document.getElementById("f-corrida").value):null,precio_antes:document.getElementById("f-antes")&&document.getElementById("f-antes").value?parseFloat(document.getElementById("f-antes").value):null,tiene_descuento:document.getElementById("f-descuento")?document.getElementById("f-descuento").checked:!1,porcentaje_descuento:document.getElementById("f-pct")&&document.getElementById("f-pct").value?parseInt(document.getElementById("f-pct").value):0,corrida_activa:document.getElementById("f-corrida-activa")?document.getElementById("f-corrida-activa").checked:!1,es_oferta:document.getElementById("f-oferta")?document.getElementById("f-oferta").checked:!1,tallas_disponibles:r,peso_gramos:c,slug:document.getElementById("f-slug")&&document.getElementById("f-slug").value?document.getElementById("f-slug").value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):null,meta_titulo:document.getElementById("f-metatitulo")&&document.getElementById("f-metatitulo").value||null,meta_descripcion:document.getElementById("f-metadesc")&&document.getElementById("f-metadesc").value||null,imagen_principal:(()=>{const m=document.getElementById("v0-preview"),g=m?m.querySelector('[data-es-portada="true"]'):null;return g&&g.dataset.url?g.dataset.url:s.length>0&&s[0].imagenes.length>0?s[0].imagenes[0]:null})(),video_url:document.getElementById("f-video-url")&&document.getElementById("f-video-url").value.trim()||null,activo:!0,nuevo:!window._productoEditandoId};try{console.log("Editando ID:",window._productoEditandoId);const m=window._productoEditandoId?"PATCH":"POST",g=window._productoEditandoId?f+"/productos/"+window._productoEditandoId:f+"/productos/",u=await fetch(g,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});if(u.ok){const b=await u.json(),v=window._productoEditandoId||(b&&b.length>0?b[0].id:null);if(v||console.error("[Variantes] ERROR: pid es null, no se crearán variantes"),s.length===0&&console.error("[Variantes] ERROR: variantesData vacío, no se crearán variantes (¿colores sin nombre?)"),v&&s.length>0){const B=r.length>0?r:["Unica"];console.log(`[Variantes] pid=${v} | colores=${s.length} | tallas=${B.length}:`,B);let $=[];window._productoEditandoId&&($=await(await fetch(f+"/variantes/producto/"+v)).json(),console.log(`[Variantes] Existentes en DB: ${$.length}`),window._coloresEliminados&&window._coloresEliminados.length>0&&($=$.filter(M=>!window._coloresEliminados.includes(M.color))));const C=[],G=[];for(const S of s)for(const M of B){const D=$.find(j=>j.color.trim().toLowerCase()===S.color.trim().toLowerCase()&&j.talla===M);if(D){const j=S.imagenes.length>0?S.imagenes[0]:null,A=JSON.stringify(S.imagenes),k=D.foto_url===j,P=JSON.stringify(D.imagenes||[])===A,F=D.color_hex===S.color_hex;if(k&&P&&F)console.log(`[Variantes] SIN CAMBIOS: ${S.color} T${M} — omitiendo PATCH`);else{console.log(`[Variantes] ACTUALIZAR: ${S.color} T${M} → ${D.id}`);const E={color_hex:S.color_hex,foto_url:j,imagenes:S.imagenes};C.push(fetch(f+"/variantes/"+D.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(E)}))}}else console.log(`[Variantes] CREAR NUEVO: ${S.color} T${M}`),C.push(fetch(f+"/variantes/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({producto_id:v,color:S.color,color_hex:S.color_hex,talla:M,foto_url:S.imagenes[0]||null,imagenes:S.imagenes||[],activa:!0})}).then(async j=>{if(!j.ok){const A=await j.text().catch(()=>"");G.push(`${S.color} T${M}: ${j.status}`),console.error("Error variante:",S.color,M,j.status,A)}}).catch(j=>{G.push(`${S.color} T${M}: error de red`),console.error("Error red variante:",S.color,M,j)}))}await Promise.all(C),G.length>0&&(console.warn("Variantes con error:",G),alert(`⚠️ Algunas variantes no se guardaron:
`+G.join(`
`)+`

Revisa la consola para más detalles.`))}console.log("Colores:",d),console.log("Tallas:",r);const y=document.getElementById("f-sucursal-stock")?document.getElementById("f-sucursal-stock").value:"",h=d.some(B=>(r.length>0?r:["Unica"]).some($=>{const C=document.getElementById("stock-ini-"+B.id+"-"+$.replace(".","_"));return C&&parseInt(C.value)>0}));let w=0,_=[],x=[];if(h&&!y)alert(`⚠️ Capturaste cantidades de stock pero no hay sucursal seleccionada.
El producto se guardó, pero el inventario NO se guardó.

Ve a Inventario → Reabastecer para agregar las cantidades.`);else if(y&&v){const B=r.length>0?r:["Unica"];await new Promise(M=>setTimeout(M,800));let $=[];const C=s.length*B.length;for(let M=0;M<3&&($=await fetch(f+"/variantes/producto/"+v).then(D=>D.json()),!($.length>=C));M++)await new Promise(D=>setTimeout(D,600));const G=await fetch(f+"/inventario/").then(M=>M.json()),S=new Set(G.filter(M=>M.sucursal_id===y).map(M=>M.variante_id));for(const M of $){const D=d.find(P=>P.nombre.trim().toLowerCase()===(M.color||"").trim().toLowerCase());if(!D)continue;const j=String(M.talla||"").replace(".","_"),A=document.getElementById("stock-ini-"+D.id+"-"+j),k=A&&parseInt(A.value)||0;if(k>0){const P=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:M.id,sucursal_id:y,cantidad:k,motivo:window._productoEditandoId?"Resurtido desde edicion de producto":"Stock inicial"})});if(P.ok)w++,console.log(`[Stock] ✓ ${M.color} T${M.talla} +${k}`);else{const F=await P.text();console.error(`[Stock] Error ${M.color} T${M.talla}:`,F),_.push(`${M.color} T${M.talla}`)}}else S.has(M.id)||(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:M.id,sucursal_id:y,cantidad:0,motivo:"Registro inicial (sin stock)"})}),console.log(`[Stock] Registro 0 creado: ${M.color} T${M.talla}`))}}if(b&&b.error){alert("Error: "+b.error),i&&(i.textContent="Guardar producto",i.disabled=!1),window._guardandoProducto=!1;return}let z="Producto guardado correctamente";w>0&&(z+=`
✅ Stock guardado: ${w} variante(s)`),x.length>0&&(z+=`
⚠️ No se encontraron variantes para: ${x.join(", ")}`),_.length>0&&(z+=`
❌ Errores al guardar: ${_.join(", ")}`),alert(z),window._productoEditandoId=null,window._guardandoProducto=!1,navegarA("productos")}else{const b=await u.text();alert("Error al guardar: "+b),i&&(i.textContent="Guardar producto",i.disabled=!1),window._guardandoProducto=!1}window._coloresEliminados=[]}catch{alert("Error conectando con el servidor"),i&&(i.textContent="Guardar producto",i.disabled=!1),window._guardandoProducto=!1}};window.editarProducto=async e=>{window._coloresEliminados=[],window._coloresExistentes=null,window._productoEditandoId=null;try{const[t,o]=await Promise.all([fetch(f+"/productos/"+e),fetch(f+"/variantes/producto/"+e)]),a=await t.json(),n=await o.json();if(!a||a.length===0){alert("Producto no encontrado");return}const i=[],r=new Set;n.filter(l=>l.producto_id===e).forEach(l=>{r.has(l.color)||(r.add(l.color),i.push({color:l.color,color_hex:l.color_hex,foto_url:l.foto_url,imagenes:l.imagenes||[]}))}),window._productoEditandoId=e,window._coloresExistentes=i.length>0?i:null;const s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=[...new Set(n.filter(l=>l.producto_id===e).map(l=>l.talla))].filter(Boolean);d.sort((l,c)=>s.indexOf(l)-s.indexOf(c)),d.length>0?(a[0].tallas_disponibles=d,console.log("[Editar] Tallas cargadas desde variantes:",d)):a[0].tallas_disponibles&&Array.isArray(a[0].tallas_disponibles)&&(a[0].tallas_disponibles=a[0].tallas_disponibles.map(String),console.log("[Editar] Tallas cargadas desde producto:",a[0].tallas_disponibles)),mostrarFormProducto(a[0])}catch{alert("Error cargando el producto")}};window.duplicarProducto=async e=>{try{const o=await(await fetch(f+"/productos/"+e)).json();if(o&&o.length>0){const a=Object.assign({},o[0]);delete a.id,delete a.created_at,delete a.updated_at,a.nombre=a.nombre+" (copia)",a.slug=a.slug?a.slug+"-copia":null,a.sku_interno=null,window._productoEditandoId=null,mostrarFormProducto(a)}}catch{alert("Error duplicando el producto")}};window.cargarProductosFiltro=e=>pe(e,!1);window.filtrarProductos=()=>{const e=document.getElementById("prod-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(o=>{const a=o.textContent.toLowerCase();o.style.display=a.includes(e)?"":"none"})};window.toggleProducto=async(e,t)=>{const o=t?"desactivar":"activar";if(confirm(t?"Desactivar este producto?":"Activar este producto?"))try{(await fetch(f+"/productos/"+e+"/"+o,{method:"PATCH",headers:{"Content-Type":"application/json"}})).ok?pe():alert("Error al cambiar el estado")}catch{alert("Error conectando con el servidor")}};window.filtrarClientes=()=>{var i,r;const e=(((i=document.getElementById("cli-buscar"))==null?void 0:i.value)||"").toLowerCase().trim(),t=((r=document.getElementById("cli-tipo"))==null?void 0:r.value)||"",o=document.querySelectorAll(".cli-item");let a=0;o.forEach(s=>{const d=(s.dataset.nombre||"").toLowerCase(),l=s.dataset.tel||"",c=s.dataset.tipo||"",g=(!e||d.includes(e)||l.includes(e))&&(!t||c===t);s.style.display=g?"":"none",g&&a++});const n=document.getElementById("cli-count");n&&(n.textContent=a)};window.mostrarFormCliente=async e=>{const t=document.getElementById("content");let o={};if(e)try{const n=await(await fetch(f+"/clientes/"+e)).json();n&&n.length>0&&(o=n[0])}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
        <h3>${e?"Editar cliente":"Nuevo cliente"}</h3>
${o.telefono?'<a href="https://wa.me/'+(o.lada||"52")+o.telefono.replace(/\D/g,"")+'" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366;margin-left:auto">WhatsApp</a>':""}      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Nombre completo *</label>
          <input class="form-input" id="cli-nombre" placeholder="Nombre del cliente" value="${o.nombre||""}">
        </div>
        <div>
          <label class="form-label">Telefono (WhatsApp)</label>
        <div style="display:flex;gap:8px">
        <select class="form-input" id="cli-lada" style="max-width:120px">
            <option value="52" ${(o.lada||"52")==="52"?"selected":""}>­🇲🇽 +52</option>
            <option value="1" ${o.lada==="1"?"selected":""}>­🇺🇸 +1</option>
            <option value="1" ${o.lada==="1CA"?"selected":""}>­🇨🇦 +1</option>
            <option value="34" ${o.lada==="34"?"selected":""}>🇪🇸 +34</option>
            <option value="57" ${o.lada==="57"?"selected":""}>­🇨🇴 +57</option>
            <option value="54" ${o.lada==="54"?"selected":""}>­🇦🇷 +54</option>
            </select>
            <input class="form-input" id="cli-telefono" placeholder="Ej: 4771234567" value="${o.telefono||""}">
        </div>
          <label class="form-label">Email</label>
          <input class="form-input" id="cli-email" type="email" placeholder="correo@ejemplo.com" value="${o.email||""}">
        </div>
        <div>
          <label class="form-label">Tipo de cliente *</label>
          <select class="form-input" id="cli-tipo">
            <option value="menudeo" ${o.tipo==="menudeo"?"selected":""}>Menudeo</option>
            <option value="mayoreo" ${o.tipo==="mayoreo"?"selected":""}>Mayoreo variado</option>
            <option value="zapateria" ${o.tipo==="zapateria"?"selected":""}>Corridas</option>
          </select>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Direccion de entrega</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="grid-column:1/-1">
            <label class="form-label">Calle y numero</label>
            <input class="form-input" id="cli-direccion" placeholder="Ej: Calle Juarez 123 Col. Centro" value="${o.direccion||""}">
          </div>
          <div>
            <label class="form-label">Ciudad</label>
            <input class="form-input" id="cli-ciudad" placeholder="Ej: Leon" value="${o.ciudad||""}">
          </div>
          <div>
            <label class="form-label">Estado</label>
            <input class="form-input" id="cli-estado" placeholder="Ej: Guanajuato" value="${o.estado||""}">
          </div>
          <div>
            <label class="form-label">Codigo postal</label>
            <input class="form-input" id="cli-cp" placeholder="Ej: 37000" value="${o.codigo_postal||""}">
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Credito</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Limite de credito ($)</label>
            <input class="form-input" id="cli-credito" type="number" step="0.01" placeholder="0.00" value="${o.limite_credito||"0"}">
          </div>
          <div>
            <label class="form-label">Dias de credito</label>
            <select class="form-input" id="cli-dias">
              <option value="0" ${o.dias_credito===0?"selected":""}>Sin credito</option>
              <option value="15" ${o.dias_credito===15?"selected":""}>15 dias</option>
              <option value="30" ${o.dias_credito===30?"selected":""}>30 dias</option>
              <option value="60" ${o.dias_credito===60?"selected":""}>60 dias</option>
            </select>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Comentarios internos</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:0.75rem">Solo visibles para el equipo, el cliente no los ve.</p>
        <textarea class="form-input" id="cli-comentarios" rows="3" placeholder="Ej: Cliente puntual, prefiere envio por Fedex, no le gusta el color cafe...">${o.comentarios_internos||""}</textarea>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">Cancelar</button>
        <button class="btn btn-primary" id="btn-cli-guardar" onclick="guardarCliente('${e||""}')">Guardar cliente</button>
      </div>
    </div>
  `};window.guardarCliente=async e=>{const t=document.getElementById("cli-nombre").value;if(!t){alert("El nombre del cliente es obligatorio");return}const o=document.getElementById("btn-cli-guardar");o&&(o.textContent="Guardando...",o.disabled=!0);const a={nombre:t,telefono:document.getElementById("cli-telefono").value||null,email:document.getElementById("cli-email").value||null,tipo:document.getElementById("cli-tipo").value,direccion:document.getElementById("cli-direccion").value||null,lada:document.getElementById("cli-lada").value||"52",ciudad:document.getElementById("cli-ciudad").value||null,estado:document.getElementById("cli-estado").value||null,codigo_postal:document.getElementById("cli-cp").value||null,limite_credito:parseFloat(document.getElementById("cli-credito").value)||0,dias_credito:parseInt(document.getElementById("cli-dias").value)||0,comentarios_internos:document.getElementById("cli-comentarios").value||null,activo:!0};try{const n=e?"PATCH":"POST",i=e?f+"/clientes/"+e:f+"/clientes/",r=await fetch(i,{method:n,headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(r.ok)alert("Cliente guardado correctamente"),navegarA("clientes");else{const s=await r.text();alert("Error al guardar: "+s),o&&(o.textContent="Guardar cliente",o.disabled=!1)}}catch{alert("Error conectando con el servidor"),o&&(o.textContent="Guardar cliente",o.disabled=!1)}};window.verCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[o,a]=await Promise.all([fetch(f+"/clientes/"+e),fetch(f+"/pedidos/")]),n=await o.json(),i=await a.json();if(!n||n.length===0){alert("Cliente no encontrado");return}const r=n[0],s=i.filter(u=>u.cliente_id===e),d=s.filter(u=>u.status==="confirmado"||u.status==="pagado"),l=d.reduce((u,b)=>u+parseFloat(b.total||0),0),c=d.length>0?l/d.length:0,p=s.length>0?new Date(s[0].created_at):null,m=p?Math.floor((new Date-p)/(1e3*60*60*24)):null,g={};d.forEach(u=>{const b=new Date(u.created_at).toLocaleDateString("es-MX",{month:"short",year:"2-digit"});g[b]=(g[b]||0)+parseFloat(u.total||0)}),t.innerHTML=`
      <div style="max-width:900px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <div style="flex:1">
            <h2 style="font-size:1.3rem;font-weight:700">${r.nombre}</h2>
            <p style="font-size:0.82rem;color:#888">${r.tipo==="mayoreo"?"Mayoreo variado":r.tipo==="zapateria"?"Corridas":"Menudeo"} · Cliente desde ${r.created_at?new Date(r.created_at).toLocaleDateString("es-MX"):"—"}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${r.telefono?`<a href="https://wa.me/${r.lada||"52"}${r.telefono.replace(/\D/g,"")}" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">💬 WhatsApp</a>`:""}
            <button class="btn btn-secondary" onclick="mostrarFormCliente('${r.id}')">✏️ Editar</button>
            <button class="btn btn-primary" onclick="nuevoPedidoCliente('${r.id}', '${r.nombre}')">+ Nuevo pedido</button>
          </div>
        </div>

        <!-- ESTADÍSTICAS -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${l.toFixed(0)}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Total gastado</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#333">${d.length}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Pedidos</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#333">$${c.toFixed(0)}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:${m>60?"#c62828":m>30?"#f57f17":"#2e7d32"}">${m!==null?m:"—"}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Días sin comprar</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <!-- INFO -->
          <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee">
            <p style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;color:#333">Información de contacto</p>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Teléfono</span>
                <span style="font-size:0.85rem;font-weight:600">${r.telefono||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Email</span>
                <span style="font-size:0.85rem;font-weight:600">${r.email||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Ciudad</span>
                <span style="font-size:0.85rem;font-weight:600">${r.ciudad||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Dirección</span>
                <span style="font-size:0.85rem;font-weight:600;text-align:right;max-width:180px">${r.direccion||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Crédito</span>
                <span style="font-size:0.85rem;font-weight:600">${r.limite_credito>0?"$"+r.limite_credito+" / "+r.dias_credito+" días":"Sin crédito"}</span>
              </div>
            </div>
          </div>

          <!-- NOTAS -->
          <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee">
            <p style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;color:#333">Notas internas</p>
            <textarea id="cli-notas-${r.id}" rows="5" placeholder="Escribe notas sobre este cliente..."
                      style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none;outline:none"
                      onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#eee'">${r.comentarios_internos||""}</textarea>
            <button onclick="guardarNotasCliente('${r.id}')" class="btn btn-secondary" style="width:100%;margin-top:8px;font-size:0.82rem">
              💾 Guardar notas
            </button>
          </div>
        </div>

        <!-- HISTORIAL DE PEDIDOS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:1rem">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">Historial de pedidos</p>
            <span style="font-size:0.78rem;color:#888">${s.length} pedidos</span>
          </div>
          ${s.length===0?'<div style="text-align:center;padding:2rem;color:#888">Sin pedidos registrados</div>':s.map(u=>{const b={confirmado:"#2e7d32",pagado:"#2e7d32",pendiente_pago:"#f57f17",cancelado:"#c62828",borrador:"#f57f17"}[u.status]||"#888",v={confirmado:"#e8f5e9",pagado:"#e8f5e9",pendiente_pago:"#fff8e1",cancelado:"#ffebee",borrador:"#fff8e1"}[u.status]||"#f5f5f5";return`
                <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer" onclick="verPedido('${u.id}')"
                     onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <span style="font-family:monospace;font-size:0.78rem;color:#888">#${u.id.substring(0,8).toUpperCase()}</span>
                      <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${v};color:${b}">${u.status}</span>
                    </div>
                    <p style="font-size:0.78rem;color:#888">${new Date(u.created_at).toLocaleDateString("es-MX")} · ${u.canal||"—"} · ${u.forma_pago||"—"}</p>
                  </div>
                  <p style="font-weight:700;color:#E91E8C;font-size:1rem">$${u.total||"0"}</p>
                </div>
              `}).join("")}
        </div>
      </div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando cliente</p>'}};window.guardarNotasCliente=async e=>{var o;const t=((o=document.getElementById("cli-notas-"+e))==null?void 0:o.value)||"";try{await fetch(f+"/clientes/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({comentarios_internos:t})});const a=document.querySelector(`button[onclick="guardarNotasCliente('${e}')"]`);a&&(a.textContent="✅ Guardado",setTimeout(()=>a.textContent="💾 Guardar notas",2e3))}catch{alert("Error guardando notas")}};window.editarCliente=e=>{mostrarFormCliente(e)};window.nuevoPedidoCliente=async(e,t)=>{await De(),setTimeout(()=>{const o=document.getElementById("pos-cliente-buscar"),a=document.getElementById("pos-cliente"),n=document.getElementById("pos-cliente-seleccionado");o&&(o.value=""),a&&(a.value=e),n&&(n.textContent="✔ "+t+" — toca para cambiar",n.style.display="block");const i=document.getElementById("topbar-title");i&&(i.textContent="Punto de venta")},300)};window.verHistorialCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando historial...</p>';try{const n=(await(await fetch(f+"/pedidos/")).json()).filter(s=>s.cliente_id===e),i=n.length>0&&n[0].clientes?n[0].clientes:{},r=n.filter(s=>s.status==="confirmado"||s.status==="pagado").reduce((s,d)=>s+parseFloat(d.total||0),0);t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <h3 style="flex:1">Historial — ${i.nombre||"Cliente"}</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total pedidos</p>
            <p style="font-weight:700;font-size:1.2rem">${n.length}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total gastado</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${r.toFixed(2)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Ultimo pedido</p>
            <p style="font-weight:700;font-size:0.9rem">${n.length>0?new Date(n[0].created_at).toLocaleDateString("es-MX"):"—"}</p>
          </div>
        </div>

        ${n.length===0?'<div style="text-align:center;padding:3rem;color:#888">Este cliente no tiene pedidos registrados</div>':`<table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Canal</th>
                <th>Forma de pago</th>
                <th>Total</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${n.map(s=>{const d={confirmado:"badge-success",pagado:"badge-success",pendiente_pago:"badge-warning",cancelado:"badge-danger",borrador:"badge-warning"}[s.status]||"badge-warning";return`
                  <tr>
                    <td>${new Date(s.created_at).toLocaleDateString("es-MX")}</td>
                    <td>${s.canal||"—"}</td>
                    <td>${s.forma_pago||"—"}</td>
                    <td><strong style="color:#E91E8C">$${s.total||"0"}</strong></td>
                    <td><span class="badge ${d}">${s.status}</span></td>
                    <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${s.id}')">Ver pedido</button></td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>`}
      </div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando historial</p>'}};window.mostrarEntrada=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#2e7d32">+ Entrada de mercancia</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Usa esto cuando llega mercancia nueva. Se suma al inventario actual.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="ent-sucursal">
            ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="ent-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'ent')">
          <div id="ent-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="ent">
          <div id="ent-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad que llego *</label>
          <input class="form-input" id="ent-cantidad" type="number" min="1" placeholder="Cuantos pares llegaron">
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="ent-motivo" onchange="toggleSucursalDestino('ent', this.value)">
                <option value="Compra a proveedor">Compra a proveedor</option>
                <option value="Devolucion de cliente">Devolucion de cliente</option>
                <option value="Otro">Otro</option>
       </select>
          <div id="ent-sucursal-destino-container" style="display:none;margin-top:1rem">
         <label class="form-label">Sucursal de origen (de donde viene)</label>
           <select class="form-input" id="ent-sucursal-destino">
         ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
         </select>
        </div>
        </div>
      </div>
      <div style="background:#e8f5e9;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #a5d6a7">
        <p style="font-size:0.85rem;color:#2e7d32">El sistema sumara esta cantidad al inventario actual del producto seleccionado.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="guardarEntrada()">Guardar entrada</button>
      </div>
    </div>
  `};window.guardarEntrada=async()=>{const e=document.getElementById("ent").value,t=document.getElementById("ent-sucursal").value,o=document.getElementById("ent-cantidad").value,a=document.getElementById("ent-motivo").value;if(!e||!t||!o){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(f+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(o),motivo:a})})).json();i.ok?(alert("Entrada guardada. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarSalida=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#c62828">- Salida de inventario</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Usa esto para registrar mermas, perdidas o errores. Se resta del inventario actual.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="sal-sucursal">
            ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="sal-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'sal')">
          <div id="sal-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="sal">
          <div id="sal-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#ffebee;border-radius:6px;font-size:0.85rem;color:#c62828"></div>
        </div>
        <div>
          <label class="form-label">Cantidad a restar *</label>
          <input class="form-input" id="sal-cantidad" type="number" min="1" placeholder="Cuantos pares salen">
        </div>
        <div>
          <label class="form-label">Motivo *</label>
          <select class="form-input" id="sal-motivo" onchange="toggleSucursalDestino('sal', this.value)">
            <option value="Merma">Merma o perdida</option>
             <option value="Producto danado">Producto danado</option>
          <option value="Robo">Robo</option>
          <option value="Correccion de error">Correccion de error</option>
          <option value="Otro">Otro</option>
        </select>
          <div id="sal-sucursal-destino-container" style="display:none;margin-top:1rem">
          <label class="form-label">Sucursal destino (a donde va)</label>
         <select class="form-input" id="sal-sucursal-destino">
       ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
          </select>
        </div>
        </div>
      </div>
      <div style="background:#ffebee;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ffcdd2">
        <p style="font-size:0.85rem;color:#c62828">El sistema restara esta cantidad del inventario actual. Esta accion queda registrada en el historial.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#c62828;border-color:#c62828" onclick="guardarSalida()">Guardar salida</button>
      </div>
    </div>
  `};window.guardarSalida=async()=>{const e=document.getElementById("sal").value,t=document.getElementById("sal-sucursal").value,o=document.getElementById("sal-cantidad").value,a=document.getElementById("sal-motivo").value;if(!e||!t||!o){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(f+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:-parseInt(o),motivo:a})})).json();i.ok?(alert("Salida registrada. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarInventarioMasivo=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const o=await(await fetch(f+"/sucursales/")).json(),n=await(await fetch(f+"/productos/")).json(),r=await(await fetch(f+"/variantes/")).json(),d=await(await fetch(f+"/inventario/")).json(),l=[...new Set(n.map(p=>p.categoria).filter(Boolean))],c=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._invMasivo={sucursales:o,productos:n,variantes:r,inventario:d},e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Inventario masivo</h3>
      </div>
      <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee;margin-bottom:1rem">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:1rem;align-items:end">
          <div>
            <label class="form-label">Sucursal *</label>
            <select class="form-input" id="im-sucursal" onchange="renderTablasMasivo()">
              ${o.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="form-label">Categoria</label>
            <select class="form-input" id="im-categoria" onchange="renderTablasMasivo()">
              <option value="">Todas las categorias</option>
              ${l.map(p=>`<option value="${p}">${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join("")}
            </select>
          </div>
          <button class="btn btn-primary" onclick="guardarInventarioMasivo()" style="white-space:nowrap">Guardar todo</button>
        </div>
        <p style="font-size:0.8rem;color:#888;margin-top:0.75rem">Los campos muestran el inventario actual. Modifica solo lo que cambio y guarda al final.</p>
      </div>
      <div id="im-tablas"></div>
    `,renderTablasMasivo()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando inventario</p>'}};window.renderTablasMasivo=()=>{const{productos:e,variantes:t,inventario:o}=window._invMasivo,a=document.getElementById("im-sucursal").value,n=document.getElementById("im-categoria").value,i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],r=e.filter(c=>!(n&&c.categoria!==n)),s=o.filter(c=>c.sucursal_id===a),d=r.map(c=>{const p=t.filter(u=>u.producto_id===c.id);if(p.length===0)return"";const g=[...new Set(p.map(u=>u.color).filter(Boolean))].map(u=>{const b=p.filter(y=>y.color===u).sort((y,h)=>i.indexOf(y.talla)-i.indexOf(h.talla));return`
        <div style="margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:14px;height:14px;border-radius:50%;background:${b[0]?b[0].color_hex:"#888"};border:1px solid #ddd;flex-shrink:0"></div>
            <span style="font-size:0.85rem;font-weight:500;color:#444">${u}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${b.map(y=>{const h=s.find(z=>z.variante_id===y.id),w=h?h.cantidad:0,_=h?h.stock_minimo:3;let x="#ddd";return w===0?x="#ffcdd2":w<=_?x="#ffe082":x="#a5d6a7",`
                <div style="text-align:center">
                  <div style="font-size:0.72rem;color:#888;margin-bottom:4px;font-weight:500">${y.talla}</div>
                  <input type="number" min="0"
                         id="im-${y.id}"
                         value="${w}"
                         data-variante="${y.id}"
                         data-anterior="${w}"
                         style="width:58px;text-align:center;padding:6px 4px;border:2px solid ${x};border-radius:8px;font-size:0.9rem;font-weight:600"
                         oninput="this.style.borderColor='#E91E8C'">
                </div>
              `}).join("")}
          </div>
        </div>
      `}).join("");return`
      <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <div>
            <span style="font-weight:600;font-size:1rem">${c.nombre}</span>
            <span style="margin-left:8px;font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${c.sku_interno||"—"}</span>
          </div>
        </div>
        ${g}
      </div>
    `}).join(""),l=document.getElementById("im-tablas");l&&(l.innerHTML=d||'<div style="padding:2rem;text-align:center;color:#888">No hay productos en esta categoria</div>')};window.guardarInventarioMasivo=async()=>{const e=document.getElementById("im-sucursal").value,t=document.querySelectorAll("[data-variante]");let o=0,a=0,n=0;const i=document.querySelector('[onclick="guardarInventarioMasivo()"]');i&&(i.textContent="Guardando...",i.disabled=!0);for(const r of t){const s=r.dataset.variante,d=parseInt(r.dataset.anterior)||0,l=parseInt(r.value)||0;if(l===d){n++;continue}try{(await(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:s,sucursal_id:e,cantidad:l,motivo:"Inventario masivo"})})).json()).ok?(o++,r.dataset.anterior=l,r.style.borderColor="#a5d6a7"):(a++,r.style.borderColor="#ffcdd2")}catch{a++}}i&&(i.textContent="Guardar todo",i.disabled=!1),a>0?alert(`Guardados: ${o}, Errores: ${a}, Sin cambios: ${n}`):alert(`Inventario actualizado. ${o} cambios guardados, ${n} sin cambios.`)};window.mostrarFormSucursal=async e=>{const t=document.getElementById("content");let o={};if(e)try{o=(await(await fetch(f+"/sucursales/")).json()).find(i=>i.id===e)||{}}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">← Volver</button>
        <h3>${e?"Editar sucursal":"Nueva sucursal"}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Nombre *</label>
          <input class="form-input" id="suc-nombre" placeholder="Ej: Leon Matriz" value="${o.nombre||""}">
        </div>
        <div>
          <label class="form-label">Tipo</label>
          <select class="form-input" id="suc-tipo">
            <option value="fisica" ${o.tipo==="fisica"?"selected":""}>Fisica</option>
            <option value="online" ${o.tipo==="online"?"selected":""}>Online</option>
            <option value="bodega" ${o.tipo==="bodega"?"selected":""}>Bodega</option>
          </select>
        </div>
        <div>
          <label class="form-label">Direccion</label>
          <input class="form-input" id="suc-direccion" placeholder="Calle y numero" value="${o.direccion||""}">
        </div>
        <div>
          <label class="form-label">Telefono</label>
          <input class="form-input" id="suc-telefono" placeholder="Ej: 4771234567" value="${o.telefono||""}">
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarSucursal('${e||""}')">Guardar</button>
      </div>
    </div>
  `};window.guardarSucursal=async e=>{const t=document.getElementById("suc-nombre").value;if(!t){alert("El nombre es obligatorio");return}const o={nombre:t,tipo:document.getElementById("suc-tipo").value,direccion:document.getElementById("suc-direccion").value||null,telefono:document.getElementById("suc-telefono").value||null};try{const a=e?"PATCH":"POST",n=e?f+"/sucursales/"+e:f+"/sucursales/";(await fetch(n,{method:a,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).ok?(alert("Sucursal guardada"),navegarA("sucursales")):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};window.toggleSucursalDestino=(e,t)=>{const o=document.getElementById(e+"-sucursal-destino-container");o&&(o.style.display=t==="Traspaso entre sucursales"?"block":"none")};window.mostrarTraspaso=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),a=await(await fetch(f+"/variantes/")).json();window._variantesCache=a;const n=document.getElementById("content");n.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#283593">⇄ Traspaso entre sucursales</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Mueve inventario de una sucursal a otra. Se resta de origen y se suma en destino.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Buscar producto *</label>
          <input class="form-input" id="tra-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'tra')">
          <div id="tra-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="tra">
          <div id="tra-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8eaf6;border-radius:6px;font-size:0.85rem;color:#283593"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="background:#ffebee;border-radius:8px;padding:1rem;border:1px solid #ffcdd2">
            <label class="form-label" style="color:#c62828">Sucursal origen (sale de aqui)</label>
            <select class="form-input" id="tra-origen">
              ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
            </select>
          </div>
          <div style="background:#e8f5e9;border-radius:8px;padding:1rem;border:1px solid #a5d6a7">
            <label class="form-label" style="color:#2e7d32">Sucursal destino (llega aqui)</label>
            <select class="form-input" id="tra-destino">
              ${t.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")}
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">Cantidad a traspasar *</label>
          <input class="form-input" id="tra-cantidad" type="number" min="1" placeholder="Cuantos pares">
        </div>
      </div>
      <div style="background:#e8eaf6;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #c5cae9">
        <p style="font-size:0.85rem;color:#283593">El sistema verifica que haya suficiente inventario en origen antes de mover.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#283593;border-color:#283593" onclick="guardarTraspaso()">Confirmar traspaso</button>
      </div>
    </div>
  `};window.guardarTraspaso=async()=>{const e=document.getElementById("tra").value,t=document.getElementById("tra-origen").value,o=document.getElementById("tra-destino").value,a=document.getElementById("tra-cantidad").value;if(!e||!t||!o||!a){alert("Por favor completa todos los campos");return}if(t===o){alert("La sucursal origen y destino no pueden ser la misma");return}try{const i=await(await fetch(f+"/movimientos/traspaso",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_origen_id:t,sucursal_destino_id:o,cantidad:parseInt(a)})})).json();i.ok?(alert("Traspaso realizado correctamente. Se movieron "+i.cantidad_movida+" pares."),navegarA("inventario")):alert("Error: "+(i.error||JSON.stringify(i)))}catch{alert("Error conectando con el servidor")}};function Le(e){const t={borrador:"badge-warning",checkout_iniciado:"badge-danger",pendiente_pago:"badge-warning",confirmado:"badge-success",cancelado:"badge-danger",pagado:"badge-success",por_enviar:"badge-info",enviado:"badge-success"}[e.status]||"badge-warning",o={borrador:"Borrador",checkout_iniciado:"🛒 Abandonó",pendiente_pago:"Pend. pago",confirmado:"Confirmado",cancelado:"Cancelado",pagado:"Pagado",por_enviar:"📦 Por enviar",enviado:"✅ Enviado"}[e.status]||e.status,a=e.status==="pagado"&&e.mp_preference_id,n=e.status==="enviado";let i="";a?i=`<button class="btn btn-primary" style="padding:4px 8px;font-size:0.72rem;background:#1565c0;border-color:#1565c0;margin-top:4px" onclick="abrirModalEnvio('${e.id}')">🚚 Enviar</button>`:n&&e.tracking_url&&(i=`<a href="${e.tracking_url}" target="_blank" class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;margin-top:4px">📍 Rastrear</a>`);const r=n&&e.numero_guia?`<br><span style="font-size:0.68rem;color:#2e7d32;font-family:monospace">${e.paqueteria||""} ${e.numero_guia}</span>`:"";return`
    <tr style="${a?"background:#f0f7ff":""}">
      <td style="font-family:monospace;font-size:0.78rem;color:#888">#${e.id.substring(0,8).toUpperCase()}</td>
      <td>
        <strong>${e.clientes?e.clientes.nombre:e.nombre_cliente||"Sin cliente"}</strong>
        ${e.email_cliente?`<br><span style="font-size:0.72rem;color:#aaa">${e.email_cliente}</span>`:""}
        ${e.telefono_cliente?`<br><span style="font-size:0.72rem;color:#aaa">${e.telefono_cliente}</span>`:""}
      </td>
      <td>${e.canal||(e.mp_preference_id?"online":"—")}</td>
      <td><strong>$${parseFloat(e.total||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</strong></td>
      <td>${e.mp_preference_id?"MercadoPago":e.forma_pago||"—"}</td>
      <td>
        <span class="badge ${t}">${o}</span>
        ${r}
      </td>
      <td>${e.created_at?new Date(new Date(e.created_at).getTime()-6*60*60*1e3).toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"}):"—"}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${e.id}')">Ver</button>
        ${i}
      </td>
    </tr>
  `}window.abrirModalEnvio=function(e){const t=document.getElementById("modal-envio");t&&t.remove();const o=document.createElement("div");o.id="modal-envio",o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px",o.innerHTML=`
    <div style="background:white;border-radius:16px;padding:32px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:1.1rem;margin:0">🚚 Registrar envío</h3>
        <button onclick="document.getElementById('modal-envio').remove()" style="background:#f5f5f5;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:1rem">✕</button>
      </div>

      <label class="form-label">Paquetería *</label>
      <select id="env-paqueteria" class="form-input" style="margin-bottom:14px">
        <option value="">Selecciona...</option>
        <option value="FedEx">FedEx</option>
        <option value="Estafeta">Estafeta</option>
        <option value="DHL">DHL</option>
        <option value="otra">Otra</option>
      </select>

      <label class="form-label">Número de guía *</label>
      <input id="env-guia" class="form-input" placeholder="Ej. 772812345678" style="margin-bottom:6px;font-family:monospace;letter-spacing:1px">
      <p style="font-size:0.72rem;color:#aaa;margin-bottom:20px">El cliente recibirá un email con el link de rastreo automáticamente.</p>

      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('modal-envio').remove()" class="btn btn-secondary" style="flex:1">Cancelar</button>
        <button onclick="confirmarEnvio('${e}')" class="btn btn-primary" style="flex:2" id="btn-confirmar-envio">Confirmar envío ✓</button>
      </div>
      <p id="env-error" style="color:red;font-size:0.8rem;margin-top:10px;display:none"></p>
    </div>
  `,document.body.appendChild(o),o.addEventListener("click",a=>{a.target===o&&o.remove()})};window.confirmarEnvio=async function(e){const t=document.getElementById("env-paqueteria").value,o=document.getElementById("env-guia").value.trim(),a=document.getElementById("env-error"),n=document.getElementById("btn-confirmar-envio");if(!t||!o){a.textContent="Selecciona paquetería e ingresa el número de guía.",a.style.display="block";return}n.disabled=!0,n.textContent="Guardando...",a.style.display="none";try{const i=await fetch(f+`/pedidos/${e}/marcar-enviado`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paqueteria:t,numero_guia:o})}),r=await i.json();if(!i.ok)throw new Error(r.error||"Error al guardar");try{const s=await fetch(f+"/pedidos/"+e).then(c=>c.json()),d=s.telefono_cliente,l=(s.nombre_cliente||"Cliente").split(" ")[0];d&&await fetch(f+"/chatbot/templates/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telefono:d,template:"aviso_envio",params:[l,String(e).slice(-6),o,t]})})}catch{}document.getElementById("modal-envio").remove(),mostrarToast("✅ Pedido enviado — WhatsApp de tracking enviado al cliente"),await Oe()}catch(i){a.textContent=i.message,a.style.display="block",n.disabled=!1,n.textContent="Confirmar envío ✓"}};async function Oe(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/pedidos/")).json(),a=new Date,n=new Date(a.getFullYear(),a.getMonth(),a.getDate()),i=new Date(a-7*24*60*60*1e3),r=["cancelado","borrador","checkout_iniciado"],s=o.filter(y=>!r.includes(y.status)),d=o.filter(y=>y.status!=="checkout_iniciado"),l=s.filter(y=>new Date(y.created_at)>=n),c=l.reduce((y,h)=>y+parseFloat(h.total||0),0),p=s.filter(y=>new Date(y.created_at)>=i).reduce((y,h)=>y+parseFloat(h.total||0),0),m=o.filter(y=>y.status==="pendiente_pago").length,g=o.filter(y=>y.status==="checkout_iniciado").length,u=o.filter(y=>y.status==="pagado"&&y.mp_preference_id).length,b=o.filter(y=>y.forma_pago==="credito"&&y.status!=="cancelado").length,v=(y,h,w,_,x,z,B)=>`
      <div style="background:${x};border-radius:14px;padding:1.1rem 1.25rem;border:1px solid ${z};cursor:${B?"pointer":"default"};transition:transform 0.15s,box-shadow 0.15s"
           ${B?`onclick="${B}" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''"`:""}>
        <p style="font-size:1.55rem;font-weight:800;color:${_};line-height:1;margin-bottom:3px;letter-spacing:-0.5px">${y}</p>
        <p style="font-size:0.7rem;font-weight:600;color:${_};opacity:0.85;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:1px">${h}</p>
        ${w?`<p style="font-size:0.68rem;color:#94a3b8;margin-top:2px">${w}</p>`:""}
      </div>`;e.innerHTML=`
      <div style="margin-bottom:1.25rem">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          <div>
            <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Gestión de ventas</p>
            <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.3px">Pedidos</h2>
          </div>
          <button class="btn btn-primary" onclick="mostrarFormPedido()">+ Nuevo pedido</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:16px">
          ${v(l.length,"Pedidos hoy",`$${c.toLocaleString("es-MX",{maximumFractionDigits:0})} vendidos`,"#E91E8C","linear-gradient(135deg,#fff0f8,#ffe4f2)","#f9a8d4","")}
          ${v("$"+Math.round(p/1e3)+"k","7 días",`${s.filter(y=>new Date(y.created_at)>=i).length} pedidos`,"#7c3aed","#f5f3ff","#ddd6fe","")}
          ${m>0?v(m,"SPEI/OXXO pendiente","Eligió método, falta pagar","#b45309","#fffbeb","#fcd34d","cargarPedidosFiltro('pendiente_pago')"):v("0","SPEI/OXXO pendiente","Todo al corriente","#16a34a","#f0fdf4","#86efac","")}
          ${g>0?v(g,"Abandonados","Fue a pagar y no terminó","#be123c","#fff1f2","#fda4af","cargarPedidosFiltro('abandonado')"):v("0","Abandonados","Ninguno","#16a34a","#f0fdf4","#86efac","")}
          ${u>0?v(u,"Por enviar","Pagados online","#1d4ed8","#eff6ff","#93c5fd","cargarPedidosFiltro('por_enviar')"):v("0","Por enviar","Sin pendientes","#16a34a","#f0fdf4","#86efac","")}
          ${v(b,"En crédito","Pedidos activos","#0f766e","#f0fdfa","#99f6e4","cargarPedidosFiltro('credito')")}
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <input class="form-input" id="ped-buscar" placeholder="Buscar por # pedido o cliente..."
                 style="max-width:240px;font-size:0.82rem" oninput="filtrarPedidos()">
          <div style="display:flex;gap:4px;flex-wrap:wrap" id="ped-filtros">
            <button class="pill-filter pill-active" onclick="cargarPedidosFiltro('')">Todos <span style="opacity:0.75;font-weight:400">${d.length}</span></button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('sucursal')">Sucursal</button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('whatsapp')">WhatsApp</button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('online')">Online</button>
            <button class="pill-filter pill-warning" onclick="cargarPedidosFiltro('pendiente_pago')">SPEI/OXXO pendiente</button>
            <button class="pill-filter pill-danger" onclick="cargarPedidosFiltro('abandonado')">Abandonados ${g>0?`<span style="opacity:0.75;font-weight:400">${g}</span>`:""}</button>
            <button class="pill-filter pill-info" onclick="cargarPedidosFiltro('por_enviar')">Por enviar</button>
            <button class="pill-filter pill-success" onclick="cargarPedidosFiltro('credito')">Crédito</button>
          </div>
        </div>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th># Pedido</th>
              <th>Cliente</th>
              <th>Canal</th>
              <th>Total</th>
              <th>Forma de pago</th>
              <th>Status</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${d.length===0?'<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>':d.map(y=>Le(y)).join("")}
          </tbody>
        </table>
      </div>
    `,window._pedidosData=o}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarPedidos=()=>{const e=document.getElementById("ped-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(o=>{const a=o.textContent.toLowerCase();o.style.display=a.includes(e)?"":"none"})};window.cargarPedidosFiltro=e=>{const t=window._pedidosData||[];let o=t.filter(i=>i.status!=="checkout_iniciado");e==="pendiente_pago"?o=t.filter(i=>i.status==="pendiente_pago"):e==="abandonado"?o=t.filter(i=>i.status==="checkout_iniciado"):e==="credito"?o=t.filter(i=>i.forma_pago==="credito"):e==="por_enviar"?o=t.filter(i=>i.status==="pagado"&&i.mp_preference_id):e&&(o=t.filter(i=>i.canal===e)),document.querySelectorAll('#content .btn[onclick^="cargarPedidosFiltro"]').forEach(i=>{i.classList.remove("btn-primary"),i.classList.add("btn-secondary")});const a=document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('${e}')"]`)||document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('')"]`);if(a&&e===""){const i=document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('')"]`);i&&(i.classList.add("btn-primary"),i.classList.remove("btn-secondary"))}else a&&(a.classList.add("btn-primary"),a.classList.remove("btn-secondary"));const n=document.querySelector("#content tbody");if(n){if(o.length===0){n.innerHTML='<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos con ese filtro</td></tr>';return}n.innerHTML=o.map(i=>Le(i)).join("")}};window.mostrarFormPedido=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const o=await(await fetch(f+"/clientes/")).json(),n=await(await fetch(f+"/sucursales/")).json(),r=await(await fetch(f+"/productos/")).json(),d=await(await fetch(f+"/variantes/")).json();window._variantesCache=d,window._productosCache=r,window._pedidoItems=[],e.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3>Nuevo pedido</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div>
            <label class="form-label">Cliente *</label>
            <select class="form-input" id="ped-cliente" onchange="actualizarTipoCliente()">
              <option value="">Selecciona cliente...</option>
              ${o.map(l=>`<option value="${l.id}" data-tipo="${l.tipo}" data-telefono="${l.telefono||""}">${l.nombre} (${l.tipo})</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="form-label">Canal *</label>
            <select class="form-input" id="ped-canal">
              <option value="sucursal">Sucursal</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label class="form-label">Sucursal *</label>
            <select class="form-input" id="ped-sucursal">
              ${n.map(l=>`<option value="${l.id}">${l.nombre}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="form-label">Forma de pago *</label>
            <select class="form-input" id="ped-pago" onchange="toggleComprobante()">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="spei">SPEI / Transferencia</option>
              <option value="credito">Credito</option>
              <option value="mercadopago">Mercado Pago</option>
            </select>
          </div>
        </div>

        <div id="spei-info" style="display:none;background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #ffe082">
          <p style="font-size:0.85rem;color:#f57f17;font-weight:600;margin-bottom:4px">Pago por SPEI</p>
          <p style="font-size:0.8rem;color:#888">El pedido quedara pendiente hasta que confirmes el comprobante manualmente. El inventario no se descuenta hasta confirmar.</p>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Agregar productos</p>
          <div style="display:flex;gap:8px;margin-bottom:1rem">
            <input class="form-input" id="ped-buscar-prod" placeholder="Buscar producto por nombre, color o talla..." style="flex:1" oninput="buscarVariante(this.value, 'ped-prod')">
          </div>
          <div id="ped-prod-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-bottom:1rem"></div>
          <input type="hidden" id="ped-prod">
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Productos en el pedido</p>
          <div id="ped-items-lista">
            <p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:1rem;padding-top:1rem;border-top:1px solid #eee">
            <div style="text-align:right">
              <p style="font-size:0.85rem;color:#888">Total del pedido</p>
              <p style="font-size:1.5rem;font-weight:700;color:#E91E8C" id="ped-total">$0.00</p>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <label class="form-label">Comentarios internos</label>
          <textarea class="form-input" id="ped-comentarios" rows="2" placeholder="Notas internas del pedido..."></textarea>
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">Cancelar</button>
          <button class="btn btn-primary" id="btn-ped-guardar" onclick="guardarPedido()">Crear pedido</button>
        </div>
      </div>
    `,document.getElementById("ped-prod-resultados").addEventListener("click",l=>{const c=l.target.closest("[data-variante-id]");if(c){const p=c.dataset.varianteId,m=c.dataset.nombre;agregarItemPedido(p,m),document.getElementById("ped-prod-resultados").style.display="none",document.getElementById("ped-buscar-prod").value=""}})}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando formulario de pedido</p>'}};window.toggleComprobante=()=>{const e=document.getElementById("ped-pago").value,t=document.getElementById("spei-info");t&&(t.style.display=e==="spei"?"block":"none")};window.actualizarTipoCliente=()=>{const e=document.getElementById("ped-cliente");e.options[e.selectedIndex],window.recalcularTotal()};window.agregarItemPedido=async(e,t)=>{const o=window._variantesCache||[],a=window._productosCache||[],n=o.find(l=>l.id===e);if(!n)return;const i=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(i)try{const c=await(await fetch(f+"/inventario/sucursal/"+i)).json(),p=c.find(b=>b.variante_id===e),m=window._pedidoItems.find(b=>b.variante_id===e);console.log("Inventario:",c),console.log("Buscando variante:",e),console.log("Encontrado:",p);const g=m?m.cantidad:0,u=p?p.cantidad:0;if(u<=g){alert("No hay suficiente existencia de este producto. Disponible: "+u+" pares");return}}catch(l){console.error("Error verificando inventario",l)}const r=window._pedidoItems.find(l=>l.variante_id===e);if(r){r.cantidad++,window.recalcularTotal(),renderItemsPedido();return}const s=a.find(l=>l.id===n.producto_id)||{},d=parseFloat(s.precio_menudeo)||0;window._pedidoItems.push({variante_id:e,nombre:(s.nombre||"")+" - "+(n.color||"")+" - T"+(n.talla||""),cantidad:1,precio_unitario:d,precio_menudeo:d,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||d-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||d-70,precio_corrida:parseFloat(s.precio_corrida)||d-100,es_oferta:s.es_oferta||!1,foto_url:n.foto_url||s.imagen_principal||null}),window.recalcularTotal(),renderItemsPedido()};window.renderItemsPedido=()=>{const e=document.getElementById("ped-items-lista");if(e){if(window._pedidoItems.length===0){e.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>',window.recalcularTotal();return}e.innerHTML=window._pedidoItems.map((t,o)=>`
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
      ${t.foto_url?'<img src="'+t.foto_url+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">':'<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
      <div style="flex:1">
        <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">${t.nombre}</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:6px">
            <button onclick="cambiarCantidadItem(${o}, -1)" style="background:#eee;border:none;border-radius:7px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
            <span style="font-weight:700;min-width:26px;text-align:center">${t.cantidad}</span>
            <button onclick="cambiarCantidadItem(${o}, 1)" style="background:#eee;border:none;border-radius:7px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
          </div>
          <span style="color:#888;font-size:0.8rem">×$${t.precio_unitario}</span>
          <strong style="color:#E91E8C">= $${(t.cantidad*t.precio_unitario).toFixed(2)}</strong>
        </div>
      </div>
      <button onclick="eliminarItemPedido(${o})" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:1.2rem">✕</button>
    </div>
  `).join(""),window.recalcularTotal()}};window.cambiarCantidadItem=async(e,t)=>{if(t>0){const o=window._pedidoItems[e],a=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(a)try{const r=(await(await fetch(f+"/inventario/sucursal/"+a)).json()).find(d=>d.variante_id===o.variante_id),s=r?r.cantidad:0;if(o.cantidad>=s){alert("No hay mas existencia disponible. Maximo: "+s+" pares");return}}catch{}}window._pedidoItems[e].cantidad=Math.max(1,window._pedidoItems[e].cantidad+t),window.recalcularTotal(),renderItemsPedido()};window.guardarPedido=async()=>{var d;if(window._creandoPedido)return;const e=document.getElementById("ped-cliente").value,t=document.getElementById("ped-canal").value,o=document.getElementById("ped-sucursal").value,a=document.getElementById("ped-pago").value,n=document.getElementById("ped-comentarios").value;if(!e){alert("Selecciona un cliente");return}if(window._pedidoItems.length===0){alert("Agrega al menos un producto");return}window._creandoPedido=!0;const i=document.getElementById("btn-ped-guardar");i&&(i.textContent="Guardando...",i.disabled=!0);const r=window._pedidoItems.reduce((l,c)=>l+c.cantidad*c.precio_unitario,0),s=a==="spei"?"pendiente_pago":"confirmado";try{const l=await fetch(f+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:e,canal:t,sucursal_id:o,forma_pago:a,comentarios:n||null,total:r,subtotal:r,status:s})});if(!l.ok){alert("Error creando pedido"),i&&(i.textContent="Crear pedido",i.disabled=!1),window._creandoPedido=!1;return}const c=await l.json(),p=c.id||((d=c[0])==null?void 0:d.id);if(!p){alert("Error: no se obtuvo ID del pedido"),i&&(i.textContent="Crear pedido",i.disabled=!1),window._creandoPedido=!1;return}for(const m of window._pedidoItems)await fetch(f+"/pedidos/"+p+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:m.variante_id,cantidad:m.cantidad,precio_unitario:m.precio_unitario,subtotal:m.cantidad*m.precio_unitario})});a!=="spei"&&a!=="mercadopago"&&await fetch(f+"/pedidos/"+p+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:a})}),alert("Pedido creado correctamente"),window._pedidoItems=[],window._creandoPedido=!1,verPedido(p)}catch{alert("Error conectando con el servidor"),i&&(i.textContent="Crear pedido",i.disabled=!1),window._creandoPedido=!1}};window.abrirPreviewPedido=async e=>{const t=document.getElementById("pedido-preview-panel");if(!t){verPedido(e);return}if(t.dataset.pedidoId===e&&t.style.display!=="none"){t.style.display="none",t.dataset.pedidoId="";return}t.dataset.pedidoId=e,t.style.display="block",t.innerHTML='<p style="padding:1.5rem;color:#888;text-align:center">Cargando...</p>',t.scrollIntoView({behavior:"smooth",block:"nearest"});try{const[o,a]=await Promise.all([fetch(f+"/pedidos/"+e).then(d=>d.json()),fetch(f+"/pedidos/"+e+"/items").then(d=>d.json())]),n=Array.isArray(o)?o[0]:o,i=Array.isArray(a)?a:[],r=n.clientes||{},s={confirmado:"#2e7d32",pagado:"#2e7d32",cancelado:"#c62828",pendiente_pago:"#f57f17",borrador:"#f57f17"}[n.status]||"#888";t.innerHTML=`
      <div class="table-card" style="padding:1.5rem;border:2px solid #f0f0f0">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:1.2rem">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <h3 style="margin:0">Pedido #${n.id.substring(0,8).toUpperCase()}</h3>
            <span style="background:${s}20;color:${s};border:1px solid ${s}40;padding:4px 10px;border-radius:20px;font-size:0.78rem;font-weight:600">${n.status}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary" style="font-size:0.8rem" onclick="verPedido('${n.id}')">✏️ Editar pedido</button>
            ${n.status!=="cancelado"&&n.status!=="confirmado"&&n.status!=="pagado"?`<button class="btn btn-primary" style="font-size:0.8rem" onclick="confirmarPedidoAdmin('${n.id}')">✅ Confirmar</button>`:""}
            ${n.status!=="cancelado"?`<button class="btn btn-secondary" style="font-size:0.8rem;color:#c62828;border-color:#c62828" onclick="cancelarPedido('${n.id}')">❌ Cancelar</button>`:""}
            <button class="btn btn-secondary" style="font-size:0.8rem" onclick="generarPDFPedido('${n.id}')">PDF</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:1.2rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Cliente</p>
            <p style="font-weight:600;font-size:0.88rem">${r.nombre||"Mostrador"}</p>
            <p style="font-size:0.78rem;color:#888">${r.telefono||""}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Canal / Pago</p>
            <p style="font-weight:600;font-size:0.88rem">${n.canal||"—"}</p>
            <p style="font-size:0.78rem;color:#888">${n.forma_pago||""}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Total</p>
            <p style="font-weight:700;font-size:1.1rem;color:#E91E8C">$${n.total||"0"}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Fecha</p>
            <p style="font-weight:600;font-size:0.82rem">${n.created_at?new Date(new Date(n.created_at).getTime()-6*60*60*1e3).toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"}):"—"}</p>
          </div>
        </div>

        <p style="font-weight:600;font-size:0.85rem;color:#333;margin-bottom:10px">Productos (${i.length})</p>
        ${i.length===0?'<p style="color:#aaa;font-size:0.85rem">Sin productos registrados</p>':""}
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          ${i.map(d=>{const l=d.variantes||{},c=l.productos||{},p=c.nombre||d.nombre||"—",m=l.color||d.color||"",g=l.talla||d.talla||"",u=c.imagen_principal||null;return`
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f9f9f9;border-radius:8px;border:1px solid #eee;min-width:220px;flex:1">
                ${u?`<img src="${u}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:56px;height:56px;background:#eee;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem">👟</div>'}
                <div>
                  <p style="font-weight:600;font-size:0.83rem;margin:0 0 2px">${p}${m?" · "+m:""}${g?" T"+g:""}</p>
                  <p style="font-size:0.78rem;color:#888;margin:0">${d.cantidad} pares × $${d.precio_unitario||0}</p>
                  <p style="font-weight:700;color:#E91E8C;font-size:0.85rem;margin:2px 0 0">$${d.subtotal??(d.cantidad*d.precio_unitario).toFixed(2)}</p>
                </div>
              </div>`}).join("")}
        </div>
      </div>`}catch{t.innerHTML='<p style="padding:1rem;color:red">Error cargando pedido</p>'}};window.verPedido=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando pedido...</p>';try{const a=await(await fetch(f+"/pedidos/"+e)).json();if(!a||a.length===0){alert("Pedido no encontrado");return}const n=a[0];let i=n.pedido_items||[];if(i.length===0)try{const l=await(await fetch(f+"/pedidos/"+e+"/items")).json();Array.isArray(l)&&(i=l)}catch{}n.pedido_items=i;const r=n.clientes||{};window._currentPedido=n;const s={borrador:"#f57f17",pendiente_pago:"#f57f17",confirmado:"#2e7d32",pagado:"#2e7d32",cancelado:"#c62828"}[n.status]||"#888";t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3 style="flex:1">Pedido #${n.id.substring(0,8).toUpperCase()}</h3>
          <span class="badge" style="background:${s}20;color:${s};border:1px solid ${s}40;padding:6px 12px">${n.status}</span>
          ${r.telefono?'<a href="https://wa.me/52'+r.telefono.replace(/\D/g,"")+"?text="+encodeURIComponent("Hola "+(r.nombre||"")+", tu pedido está listo")+'" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>':""}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente</p>
            <p style="font-weight:600">${r.nombre||n.nombre_cliente||"Mostrador"}</p>
            <p style="font-size:0.8rem;color:#888">${r.telefono||n.telefono_cliente||""}</p>
            ${n.email_cliente?`<p style="font-size:0.78rem;color:#888">${n.email_cliente}</p>`:""}
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Canal y pago</p>
            <p style="font-weight:600">${n.canal||"—"}</p>
            <p style="font-size:0.8rem;color:#888">${n.forma_pago||""}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${n.total||"0"}</p>
          </div>
        </div>

        ${(()=>{const d=(n.direccion_envio||n.direccion_entrega||"").trim();let l="";if(!d&&n.notas){const b=n.notas.match(/Env[ií]o a:\s*(.+)$/i);b&&(l=b[1].trim())}const c=d||l,p=r.nombre||n.nombre_cliente||"",m=r.telefono||n.telefono_cliente||"",g=n.email_cliente&&n.email_cliente!=="cliente@zapatillasmay.mx"?n.email_cliente:"";return!c&&!p&&!m?"":`
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:1rem;margin-bottom:1.5rem">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
              <p style="font-size:0.8rem;font-weight:700;color:#1d4ed8;margin:0">📦 Datos de envío</p>
              <button onclick="navigator.clipboard.writeText(this.dataset.copy).then(()=>{this.textContent='✓ Copiado';setTimeout(()=>this.textContent='📋 Copiar',1500)})" data-copy="${[p,m,g,c].filter(Boolean).join(`
`).replace(/"/g,"&quot;")}" style="padding:4px 12px;border-radius:20px;border:1.5px solid #1d4ed8;background:none;color:#1d4ed8;font-size:0.75rem;font-weight:600;cursor:pointer">📋 Copiar</button>
            </div>
            ${p?`<p style="margin:2px 0;font-size:0.88rem;color:#0f172a"><strong>${p}</strong></p>`:""}
            ${m?`<p style="margin:2px 0;font-size:0.85rem;color:#334155">📞 ${m}</p>`:""}
            ${g?`<p style="margin:2px 0;font-size:0.85rem;color:#334155">✉️ ${g}</p>`:""}
            ${c?`<p style="margin:2px 0;font-size:0.85rem;color:#334155">📍 ${c}</p>`:'<p style="margin:2px 0;font-size:0.82rem;color:#c62828">⚠ Sin dirección registrada</p>'}
            ${n.notas?`<p style="margin:8px 0 0;font-size:0.78rem;color:#64748b;border-top:1px solid #dbeafe;padding-top:6px">📝 ${n.notas}</p>`:""}
          </div>`})()}

        <div style="margin-bottom:1.5rem">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
            <p style="font-weight:600;color:#333;margin:0">Productos</p>
            ${n.status!=="cancelado"?`<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px" onclick="activarEdicionPedido('${n.id}')">✏️ Editar pedido</button>`:""}
          </div>
          <div id="items-lista">
          ${i.length===0?'<p style="color:#aaa;font-size:0.85rem;padding:8px 0">Sin productos registrados en este pedido</p>':""}
          ${i.map(d=>{const l=d.variantes||{},c=l.productos||{},p=c.nombre||d.nombre||"—",m=l.color||d.color||"",g=l.talla||d.talla||"";let u=c.imagen_principal||null;if(!u&&d.variante_id&&window._productosCache&&window._variantesCache){const b=window._variantesCache.find(v=>v.id===d.variante_id);if(b){const v=window._productosCache.find(y=>y.id===b.producto_id);v&&(u=v.imagen_principal||null)}}return`
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
                ${u?'<img src="'+u+'" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;border:1px solid #eee">':'<div style="width:56px;height:56px;background:#f0f0f0;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem">👟</div>'}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.85rem;margin:0 0 2px">${p}${m?" · "+m:""}${g?" · T"+g:""}</p>
                  <p style="font-size:0.8rem;color:#888;margin:0">${d.cantidad} pares × $${d.precio_unitario||0}</p>
                </div>
                <strong style="color:#E91E8C;font-size:1rem">$${d.subtotal!=null?d.subtotal:((d.cantidad||0)*(d.precio_unitario||0)).toFixed(2)}</strong>
              </div>
            `}).join("")}
          </div>
          <div id="panel-edicion" style="display:none"></div>
        </div>

        ${n.status==="pendiente_pago"?`
          <div style="background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #ffe082">
            <p style="font-weight:600;color:#f57f17;margin-bottom:0.5rem">Pendiente de pago SPEI</p>
            <p style="font-size:0.85rem;color:#888;margin-bottom:1rem">Cuando recibas el comprobante confirma el pago para descontar el inventario.</p>
            <button class="btn btn-primary" onclick="confirmarPagoSPEI('${n.id}')">Confirmar pago recibido</button>
          </div>
        `:""}

        ${n.comentarios?`
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Comentarios internos</p>
            <p>${n.comentarios}</p>
          </div>
        `:""}

        <div style="display:flex;gap:1rem;flex-wrap:wrap">
  ${n.status!=="cancelado"&&n.status!=="confirmado"&&n.status!=="pagado"?`<button class="btn btn-primary" onclick="confirmarPedidoAdmin('${n.id}')">Confirmar pedido</button>`:""}
  ${n.status==="cancelado"?`<button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="reconfirmarPedido('${n.id}')">✅ Reconfirmar pedido</button>`:""}
  ${n.status!=="cancelado"?`<button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="cancelarPedido('${n.id}')">❌ Cancelar pedido</button>`:""}
  <button class="btn btn-secondary" onclick="generarPDFPedido('${n.id}')">Generar PDF</button>
  <button class="btn btn-secondary" onclick="imprimirTicketPOS('${n.id}',${n.total},${n.pedido_items?n.pedido_items.reduce((d,l)=>d+l.cantidad,0):0},'${n.forma_pago||"efectivo"}')">Reimprimir ticket</button>
</div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando pedido</p>'}};window.activarEdicionPedido=async e=>{var r;const t=document.getElementById("panel-edicion"),o=document.getElementById("items-lista");if(!t)return;const[a,n]=await Promise.all([fetch(f+"/variantes/").then(s=>s.json()),fetch(f+"/productos/").then(s=>s.json())]);window._editPedidoId=e,window._editItems=(((r=window._currentPedido)==null?void 0:r.pedido_items)||[]).map(s=>({...s})),window._editVariantes=a,window._editProductos=n,o.style.display="none",t.style.display="block";const i=()=>{const s=window._editItems;t.innerHTML=`
      <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:1rem;margin-bottom:1rem">
        <p style="font-weight:600;color:#f57f17;margin-bottom:1rem">✏️ Modo edición — los cambios ajustan inventario automáticamente</p>

        ${s.map((d,l)=>{const c=d.variantes||{},p=c.productos||{},m=p.nombre||d.nombre||"—",g=c.color||d.color||"",u=c.talla||d.talla||"";let b=p.imagen_principal||null;if(!b&&d.variante_id&&window._editVariantes&&window._editProductos){const v=window._editVariantes.find(y=>y.id===d.variante_id);if(v){const y=window._editProductos.find(h=>h.id===v.producto_id);y&&(b=y.imagen_principal||null)}}return`
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:white;border-radius:8px;margin-bottom:8px;border:1px solid #eee;flex-wrap:wrap">
              ${b?'<img src="'+b+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid #eee">':'<div style="width:48px;height:48px;background:#f0f0f0;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem">👟</div>'}
              <div style="flex:1;min-width:120px">
                <p style="font-weight:600;font-size:0.85rem;margin:0">${m}${g?" · "+g:""}${u?" T"+u:""}</p>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:#888">Cant.</label>
                <input type="number" min="1" value="${d.cantidad}" style="width:60px;padding:4px 6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem"
                  onchange="window._editItems[${l}].cantidad = parseInt(this.value)||1; window._editItems[${l}].subtotal = window._editItems[${l}].cantidad * window._editItems[${l}].precio_unitario">
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:#888">Precio</label>
                <input type="number" min="0" value="${d.precio_unitario}" style="width:80px;padding:4px 6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem"
                  onchange="window._editItems[${l}].precio_unitario = parseFloat(this.value)||0; window._editItems[${l}].subtotal = window._editItems[${l}].cantidad * window._editItems[${l}].precio_unitario">
              </div>
              <button onclick="eliminarItemEdicion('${d.id}', ${l})" style="background:none;border:none;cursor:pointer;color:#c62828;font-size:1.1rem;padding:4px" title="Eliminar">🗑</button>
            </div>
          `}).join("")}

        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ffe082">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:8px;color:#333">Agregar producto</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <select id="edit-variante-sel" style="flex:1;min-width:200px;padding:6px 10px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
              <option value="">— Selecciona producto / talla —</option>
              ${window._editVariantes.map(d=>{const l=window._editProductos.find(c=>c.id===d.producto_id);return`<option value="${d.id}">${l?l.nombre:"?"} — ${d.color||""} T${d.talla||""}</option>`}).join("")}
            </select>
            <input type="number" id="edit-nueva-cant" min="1" value="1" placeholder="Cant." style="width:60px;padding:6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
            <input type="number" id="edit-nuevo-precio" min="0" placeholder="Precio" style="width:80px;padding:6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
            <button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px" onclick="agregarItemEdicion()">+ Agregar</button>
          </div>
        </div>

        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ffe082;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <label style="font-size:0.85rem;color:#333;font-weight:600">Descuento manual ($):</label>
          <input type="number" id="edit-descuento" min="0" value="0" style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
          <span style="font-size:0.8rem;color:#888">(se resta del total final)</span>
        </div>

        <div style="margin-top:1rem;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="guardarEdicionPedido()">💾 Guardar cambios</button>
          <button class="btn btn-secondary" onclick="cancelarEdicionPedido('${e}')">Cancelar</button>
        </div>
      </div>
    `};i(),window._renderEdicion=i};window.eliminarItemEdicion=async(e,t)=>{if(!confirm("¿Eliminar este producto del pedido?"))return;const o=window._editPedidoId,n=await(await fetch(f+"/pedidos/"+o+"/items/"+e,{method:"DELETE"})).json();n.ok?(window._editItems.splice(t,1),window._renderEdicion()):alert("Error eliminando ítem: "+JSON.stringify(n))};window.agregarItemEdicion=async()=>{const e=document.getElementById("edit-variante-sel").value,t=parseInt(document.getElementById("edit-nueva-cant").value)||1,o=parseFloat(document.getElementById("edit-nuevo-precio").value)||0;if(!e){alert("Selecciona un producto");return}if(!o){alert("Ingresa el precio");return}const a=window._editPedidoId,i=await(await fetch(f+"/pedidos/"+a+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,cantidad:t,precio_unitario:o,subtotal:t*o})})).json();if(i&&i[0]&&i[0].id){const r=await fetch(f+"/pedidos/"+a+"/items").then(s=>s.json());window._editItems=r.map(s=>({...s})),window._renderEdicion()}else alert("Error agregando ítem")};window.guardarEdicionPedido=async()=>{const e=window._editPedidoId,t=window._editItems,o=parseFloat(document.getElementById("edit-descuento").value)||0;for(const n of t)await fetch(f+"/pedidos/"+e+"/items/"+n.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:n.cantidad,precio_unitario:n.precio_unitario})});const a=Math.max(0,t.reduce((n,i)=>n+i.cantidad*i.precio_unitario,0)-o);await fetch(f+"/pedidos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:a})}),alert("Pedido actualizado correctamente"),verPedido(e)};window.cancelarEdicionPedido=e=>{verPedido(e)};window.cancelarPedido=async e=>{if(confirm("¿Cancelar este pedido? Si ya estaba confirmado se devolverá el stock automáticamente."))try{const o=await(await fetch(f+"/pedidos/"+e+"/cancelar",{method:"POST"})).json();o.ok?(alert(o.stock_devuelto?"Pedido cancelado. Stock devuelto al inventario.":"Pedido cancelado."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.reconfirmarPedido=async e=>{if(confirm("¿Reconfirmar este pedido? Se descontará el stock del inventario nuevamente."))try{const o=await(await fetch(f+"/pedidos/"+e+"/reconfirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})).json();o.ok?(alert("Pedido reconfirmado correctamente."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.confirmarPagoSPEI=async e=>{if(confirm("Confirmar que recibiste el pago por SPEI?"))try{const o=await(await fetch(f+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"spei"})})).json();o.ok?(alert("Pago confirmado. Inventario actualizado."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.confirmarPedidoAdmin=async e=>{if(confirm("Confirmar este pedido? El inventario se descontara."))try{const o=await(await fetch(f+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"efectivo"})})).json();if(o.ok){try{const a=await fetch(f+"/pedidos/"+e).then(s=>s.json()),n=a.telefono_cliente,i=(a.nombre_cliente||"Cliente").split(" ")[0],r=a.total?"$"+parseFloat(a.total).toFixed(0):"";n&&await fetch(f+"/chatbot/templates/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telefono:n,template:"confirmacion_pedido",params:[i,String(e).slice(-6),r]})})}catch{}alert("Pedido confirmado correctamente."),verPedido(e)}else alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.recalcularTotal=()=>{const e=window._pedidoItems||[],t=e.reduce((n,i)=>n+i.cantidad,0);e.forEach(n=>{n.es_oferta?n.precio_unitario=n.precio_menudeo:t>=6?n.precio_unitario=n.precio_mayoreo6||n.precio_menudeo-70:t>=3?n.precio_unitario=n.precio_mayoreo3||n.precio_menudeo-30:n.precio_unitario=n.precio_menudeo});const o=e.reduce((n,i)=>n+i.cantidad*i.precio_unitario,0),a=document.getElementById("ped-total");a&&(a.textContent="$"+o.toFixed(2))};async function De(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando punto de venta...</p>';try{const o=await(await fetch(f+"/productos/")).json(),n=await(await fetch(f+"/variantes/")).json(),r=await(await fetch(f+"/sucursales/")).json(),d=await(await fetch(f+"/clientes/")).json(),c=await(await fetch(f+"/inventario/")).json();window._posData={productos:o,variantes:n,sucursales:r,clientes:d,inventario:c},window._posCarrito=[],window._posClienteId=null,e.innerHTML=`
      <div id="pos-layout" style="display:grid;grid-template-columns:1fr 380px;gap:1rem;height:calc(100vh - 80px)">

        <div style="overflow-y:auto;padding-right:0.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;margin-bottom:1rem;border:1px solid #eee;position:sticky;top:0;z-index:10">
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:0.75rem">
  <input class="form-input" id="pos-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="width:100%;font-size:1rem;min-height:44px;padding:10px 14px" oninput="buscarPOS(this.value)">
  <select class="form-input" id="pos-sucursal" style="width:100%" onchange="actualizarInventarioPOS()">
    ${r.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join("")}
  </select>
</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="pos-categorias">
              <button class="btn btn-primary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('')">Todos</button>
              ${[...new Set(o.map(p=>p.categoria).filter(Boolean))].map(p=>`
                <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('${p}')">${p.charAt(0).toUpperCase()+p.slice(1)}</button>
              `).join("")}
            </div>
          </div>
          <div id="pos-productos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;padding-bottom:80px">
          </div>
        </div>

        <div id="pos-carrito-desktop" style="background:white;border-radius:12px;border:1px solid #eee;display:flex;flex-direction:column;overflow:hidden">
          <div style="padding:1rem;border-bottom:1px solid #eee">
            <p style="font-weight:700;font-size:1rem;margin-bottom:0.5rem">Carrito</p>
            <input class="form-input" id="pos-cliente-buscar" placeholder="🔍 Buscar cliente..." style="font-size:0.85rem" oninput="buscarClientePOS(this.value)">
            <div id="pos-cliente-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px;z-index:50;position:relative"></div>
            <input type="hidden" id="pos-cliente">
            <div id="pos-cliente-seleccionado" style="display:none;margin-top:6px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.8rem;color:#2e7d32;cursor:pointer" onclick="limpiarClientePOS()">Sin cliente seleccionado — toca para cambiar</div>
          </div>
          <div id="pos-carrito-items" style="flex:1;overflow-y:auto;padding:0.75rem">
            <p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>
          </div>
          <div style="padding:1rem;border-top:1px solid #eee">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
              <span style="font-size:0.85rem;color:#888">Total pares: <strong id="pos-total-pares">0</strong></span>
              <span style="font-size:0.85rem;color:#888">Tipo: <strong id="pos-tipo-precio">Menudeo</strong></span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <span style="font-weight:600;font-size:1rem">Total:</span>
              <span style="font-weight:700;font-size:1.4rem;color:#E91E8C" id="pos-total">$0.00</span>
            </div>
            <select class="form-input" id="pos-pago" style="width:100%;background:white;color:#333;font-size:0.85rem;margin-bottom:8px">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="spei">SPEI</option>
              <option value="credito">Credito</option>
            </select>
            <div style="background:#fff8e1;border-radius:8px;padding:10px;margin-bottom:10px;border:1px solid #ffe082">
              <p style="font-size:0.78rem;font-weight:700;color:#f57f17;margin-bottom:6px">Descuento general</p>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:0.85rem;color:#f57f17;font-weight:600">$</span>
                <input type="number" min="0" value="0" id="pos-descuento"
                  style="width:80px;text-align:center;padding:6px;border:2px solid #f57f17;border-radius:8px;font-size:1rem;font-weight:700;color:#f57f17"
                  oninput="aplicarDescuentoPOS(this.value)">
                <span style="font-size:0.85rem;color:#f57f17;font-weight:600">de descuento por par</span>
              </div>
              <p id="pos-descuento-info" style="font-size:0.75rem;color:#888;margin-top:4px"></p>
            </div>
            <button class="btn btn-primary" style="width:100%;padding:12px;font-size:1rem;font-weight:600" onclick="cobrarPOS()">Cobrar</button>
            <button class="btn btn-secondary" style="width:100%;margin-top:6px;font-size:0.85rem" onclick="limpiarCarritoPOS()">Limpiar carrito</button>
          </div>
        </div>

      </div>

      <!-- BOTÓN FLOTANTE MÓVIL -->
      <div id="pos-btn-flotante" onclick="abrirDrawerPOS()" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;background:#E91E8C;color:white;padding:14px 20px;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 -4px 20px rgba(0,0,0,0.2)">
        <div>
          <p style="font-size:0.7rem;font-weight:700;opacity:0.8;letter-spacing:1px">CARRITO</p>
          <p id="pos-flotante-pares" style="font-size:0.85rem;font-weight:700">0 pares</p>
        </div>
        <p id="pos-flotante-total" style="font-size:1.3rem;font-weight:800">$0.00</p>
        <div style="background:white;color:#E91E8C;padding:8px 16px;border-radius:8px;font-size:0.85rem;font-weight:700">Ver carrito →</div>
      </div>

      <!-- DRAWER MÓVIL -->
      <div id="pos-drawer-overlay" onclick="cerrarDrawerPOS()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199"></div>
      <div id="pos-drawer" style="position:fixed;bottom:0;left:0;right:0;z-index:200;background:white;border-radius:20px 20px 0 0;max-height:90vh;overflow-y:auto;transform:translateY(100%);transition:transform 0.3s ease">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:10">
          <p style="font-weight:700;font-size:1.1rem">🛒 Carrito</p>
          <button onclick="cerrarDrawerPOS()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
        </div>
        <div style="padding:0.75rem 1rem;border-bottom:1px solid #eee">
          <input class="form-input" id="pos-cliente-buscar-m" placeholder="🔍 Buscar cliente..." style="width:100%;font-size:0.9rem" oninput="buscarClientePOSM(this.value)">
          <div id="pos-cliente-resultados-m" style="border:1px solid #ddd;border-radius:6px;max-height:150px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <div id="pos-cliente-sel-m" style="display:none;margin-top:6px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.82rem;color:#2e7d32;cursor:pointer" onclick="limpiarClientePOSM()"></div>
        </div>
        <div id="pos-drawer-items" style="padding:0.75rem 1rem"></div>
        <div style="padding:1rem 1.5rem;border-top:1px solid #eee">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#888;font-size:0.85rem">Pares: <strong id="pos-drawer-pares">0</strong></span>
            <span style="color:#888;font-size:0.85rem">Tipo: <strong id="pos-drawer-tipo">Menudeo</strong></span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <span style="font-weight:600;font-size:1rem">Total:</span>
            <span style="font-weight:800;font-size:1.5rem;color:#E91E8C" id="pos-drawer-total">$0.00</span>
          </div>
          <div style="background:#fff8e1;border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid #ffe082">
            <p style="font-size:0.78rem;font-weight:700;color:#f57f17;margin-bottom:8px">Descuento por par</p>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="color:#f57f17;font-weight:700">$</span>
              <input type="number" min="0" value="0" id="pos-descuento-m"
                style="width:80px;text-align:center;padding:8px;border:2px solid #f57f17;border-radius:8px;font-size:1rem;font-weight:700;color:#f57f17"
                oninput="aplicarDescuentoPOS(this.value)">
              <span style="color:#f57f17;font-size:0.85rem">de descuento por par</span>
            </div>
          </div>
          <select class="form-input" id="pos-pago-m" style="width:100%;margin-bottom:12px;font-size:0.95rem">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="spei">SPEI</option>
            <option value="credito">Credito</option>
          </select>
          <button onclick="cobrarPOSM()" class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem;font-weight:700;margin-bottom:8px">💳 Cobrar</button>
          <button onclick="limpiarCarritoPOS();cerrarDrawerPOS()" class="btn btn-secondary" style="width:100%;font-size:0.9rem">🗑 Limpiar carrito</button>
        </div>
      </div>
    `,renderProductosPOS(o.filter(p=>p.activo))}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando punto de venta</p>'}}window.abrirDrawerPOS=()=>{renderDrawerPOS();const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.add("open"),t&&t.classList.add("active"),document.body.style.overflow="hidden"};window.cerrarDrawerPOS=()=>{const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.remove("open"),t&&t.classList.remove("active"),document.body.style.overflow=""};window.renderDrawerPOS=()=>{const e=window._posCarrito,t=document.getElementById("pos-drawer-items");if(!t)return;const o=e.reduce((p,m)=>p+m.cantidad,0),a=e.reduce((p,m)=>p+m.cantidad*m.precio_unitario,0),n=e.some(p=>p.es_corrida)?"Corrida":o>=6?"Mayoreo 6+":o>=3?"Mayoreo 3+":"Menudeo",i=document.getElementById("pos-drawer-pares"),r=document.getElementById("pos-drawer-total"),s=document.getElementById("pos-drawer-tipo");if(i&&(i.textContent=o),r&&(r.textContent="$"+a.toFixed(2)),s&&(s.textContent=n),!e.length){t.innerHTML='<p style="color:#888;text-align:center;padding:2rem">El carrito esta vacio</p>';return}const d=e.filter(p=>!p.es_corrida),l=e.filter(p=>p.es_corrida),c={};l.forEach(p=>{const m=p.producto_id+"|"+p.color;c[m]||(c[m]={nombre:p.nombre,color:p.color,producto_id:p.producto_id,tallas:[],subtotal:0,imagen:p.imagen||null}),c[m].tallas.push({talla:p.talla,cantidad:p.cantidad}),c[m].subtotal+=p.cantidad*p.precio_unitario}),t.innerHTML=`
    ${d.map(p=>{const m=e.indexOf(p);return`
        <div style="padding:12px 0;border-bottom:1px solid #f5f5f5">
  <div style="display:flex;gap:10px;margin-bottom:8px;align-items:start">
    ${p.imagen?`<img src="${p.imagen}" object-fit:contain;border-radius:8px;flex-shrink:0;background:#f5f5f5>`:'<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>'}
    <div style="flex:1">
      <p style="font-size:0.9rem;font-weight:600">${p.nombre}</p>
      <p style="font-size:0.78rem;color:#888">${p.color} · T${p.talla}</p>
    </div>
    <button onclick="eliminarItemPOS(${m});renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
  </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:10px">
              <button onclick="cambiarCantidadPOS(${m},-1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
              <span style="font-weight:700;min-width:24px;text-align:center">${p.cantidad}</span>
              <button onclick="cambiarCantidadPOS(${m},1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:0.72rem;color:#888">$</span>
              <input type="number" value="${p.precio_unitario}"
                     onchange="editarPrecioPOS(${m}, this.value);renderDrawerPOS()"
                     style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
              <span style="font-size:0.72rem;color:#888">/par</span>
            </div>
          </div>
          <p style="text-align:right;font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:4px">$${(p.cantidad*p.precio_unitario).toFixed(2)}</p>
        </div>
      `}).join("")}

    ${Object.entries(c).map(([p,m])=>`
      <div style="background:#fdf4ff;border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
          ${m.imagen?`<img src="${m.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
          <div style="flex:1">
            <p style="font-size:0.9rem;font-weight:700">${m.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${m.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${m.tallas.map(g=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${g.talla} ×${g.cantidad}</span>`).join("")}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${p}');renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px">
          <span style="font-size:0.85rem;color:#888">${m.tallas.reduce((g,u)=>g+u.cantidad,0)} pares</span>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="font-size:0.72rem;color:#888">$</span>
            <input type="number" value="${(m.subtotal/m.tallas.reduce((g,u)=>g+u.cantidad,0)).toFixed(2)}"
                   onchange="editarPrecioCorridaPOS('${p}', this.value);renderDrawerPOS()"
                   style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
            <span style="font-size:0.72rem;color:#888">/par</span>
          </div>
          <span style="font-weight:700;color:#6a1b9a">$${m.subtotal.toFixed(2)}</span>
        </div>
      </div>
    `).join("")}
  `};window.cobrarPOSM=async()=>{const e=document.getElementById("pos-pago-m"),t=document.getElementById("pos-pago");e&&t&&(t.value=e.value),cerrarDrawerPOS(),await cobrarPOS()};window.buscarClientePOSM=e=>{const{clientes:t}=window._posData,o=document.getElementById("pos-cliente-resultados-m");if(!e||e.length<2){o.style.display="none";return}const a=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!a.length){o.style.display="none";return}o.style.display="block",o.innerHTML=a.map(n=>`
    <div onclick="seleccionarClientePOSM('${n.id}','${n.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      <strong>${n.nombre}</strong>${n.telefono?" · "+n.telefono:""}
    </div>
  `).join("")};window.seleccionarClientePOSM=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar-m").value="",document.getElementById("pos-cliente-resultados-m").style.display="none";const o=document.getElementById("pos-cliente-sel-m");o.textContent="✔ "+t+" — toca para cambiar",o.style.display="block"};window.limpiarClientePOSM=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-sel-m").style.display="none",document.getElementById("pos-cliente-buscar-m").value=""};window.aplicarDescuentoPOS=e=>{const t=parseFloat(e)||0;window._posCarrito.forEach(i=>{const r=window._posCarrito.reduce((d,l)=>d+l.cantidad,0);let s;i.precio_base_original||(i.es_corrida?s=i.precio_corrida:r>=6?s=i.precio_mayoreo6:r>=3?s=i.precio_mayoreo3:s=i.precio_menudeo,i.precio_base_original=s),i.precio_unitario=Math.max(0,parseFloat((i.precio_base_original-t).toFixed(2))),i.precio_manual=t>0});const o=window._posCarrito.reduce((i,r)=>i+r.cantidad*r.precio_unitario,0),a=document.getElementById("pos-total");a&&(a.textContent="$"+o.toFixed(2));const n=document.getElementById("pos-descuento-info");if(n){const i=window._posCarrito.reduce((r,s)=>r+s.cantidad,0);n.textContent=t>0?`Ahorro total: $${(t*i).toFixed(2)} en ${i} pares`:""}renderCarritoPOS(),setTimeout(()=>{var l;const i=document.getElementById("pos-descuento");i&&(i.value=t);const r=document.getElementById("pos-descuento-m");r&&(r.value=t);const s=window._posCarrito.reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),d=document.getElementById("pos-drawer-total");d&&(d.textContent="$"+s.toFixed(2)),(l=document.getElementById("pos-drawer"))!=null&&l.classList.contains("open")&&renderDrawerPOS()},50)};window.buscarClientePOS=e=>{const t=window._posData?window._posData.clientes:[],o=document.getElementById("pos-cliente-resultados");if(!o)return;if(!e||e.length<2){o.style.display="none";return}const a=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())||(n.telefono||"").includes(e)).slice(0,8);if(a.length===0){o.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron clientes</div>',o.style.display="block";return}o.innerHTML=a.map(n=>`
    <div onclick="seleccionarClientePOS('${n.id}', '${n.nombre.replace(/'/g,"")}')"
         style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'"
         onmouseout="this.style.background='white'">
      <strong>${n.nombre}</strong>
      <span style="color:#888;font-size:0.75rem"> · ${n.tipo||"menudeo"}</span>
      ${n.telefono?'<br><span style="color:#888;font-size:0.72rem">'+n.telefono+"</span>":""}
    </div>
  `).join(""),o.style.display="block"};window.seleccionarClientePOS=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-resultados").style.display="none";const o=document.getElementById("pos-cliente-seleccionado");o.textContent="✔ "+t+" — toca para cambiar",o.style.display="block"};window.limpiarClientePOS=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-seleccionado").style.display="none",document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-buscar").focus()};window.renderProductosPOS=e=>{const{variantes:t,inventario:o}=window._posData,a=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",n=o.filter(r=>r.sucursal_id===a),i=document.getElementById("pos-productos-grid");i&&(i.innerHTML=e.filter(r=>r.activo).map(r=>{const s=t.filter(c=>c.producto_id===r.id),d=[...new Set(s.map(c=>c.color).filter(Boolean))],l=s.reduce((c,p)=>{const m=n.find(g=>g.variante_id===p.id);return c+(m?m.cantidad:0)},0);return`
      <div onclick="abrirProductoPOS('${r.id}')"
           style="background:white;border-radius:12px;border:1px solid #eee;cursor:pointer;overflow:hidden;transition:all 0.2s;${l===0?"opacity:0.5":""}"
           onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="position:relative">
          ${r.imagen_principal?`<img src="${r.imagen_principal}" style="width:100%;height:160px;object-fit:contain;background:#f5f5f5">`:'<div style="width:100%;height:160px;background:linear-gradient(135deg,#f5f5f5,#eee);display:flex;align-items:center;justify-content:center;font-size:2rem">­👠</div>'}
          ${l===0?'<div style="position:absolute;top:8px;right:8px;background:#c62828;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Agotado</div>':""}
          ${r.es_oferta?'<div style="position:absolute;top:8px;left:8px;background:#E91E8C;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Oferta</div>':""}
          ${r.nuevo?'<div style="position:absolute;top:8px;left:8px;background:#2e7d32;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Nuevo</div>':""}
        </div>
        <div style="padding:0.75rem">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.nombre}</p>
          <p style="font-size:0.72rem;color:#888;margin-bottom:6px">${r.sku_interno||""}</p>
          <div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap">
            ${d.slice(0,5).map(c=>{const p=s.find(m=>m.color===c);return`<div style="width:14px;height:14px;border-radius:50%;background:${p?p.color_hex:"#888"};border:1px solid #ddd" title="${c}"></div>`}).join("")}
            ${d.length>5?`<span style="font-size:0.7rem;color:#888">+${d.length-5}</span>`:""}
          </div>
          <p style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${r.precio_menudeo}</p>
        </div>
      </div>
    `}).join(""))};window.buscarPOS=e=>{const{productos:t}=window._posData;if(!e){renderProductosPOS(t);return}const o=e.toLowerCase().split(" ").filter(n=>n),a=t.filter(n=>{const i=n.nombre.toLowerCase(),r=(n.sku_interno||"").toLowerCase(),s=(n.categoria||"").toLowerCase(),d=i+" "+r+" "+s;return o.every(l=>d.includes(l))});renderProductosPOS(a)};window.filtrarPOS=e=>{const{productos:t}=window._posData,o=e?t.filter(a=>a.categoria===e):t;renderProductosPOS(o),document.querySelectorAll("#pos-categorias button").forEach(a=>{a.className="btn btn-secondary",a.style.cssText="padding:4px 12px;font-size:0.8rem"}),event.target.className="btn btn-primary",event.target.style.cssText="padding:4px 12px;font-size:0.8rem"};window.actualizarInventarioPOS=async()=>{const e=document.getElementById("pos-sucursal").value;try{const t=await fetch(f+"/inventario/sucursal/"+e);window._posData.inventario=await t.json();const{productos:o}=window._posData;renderProductosPOS(o)}catch{}};window.abrirProductoPOS=e=>{const t=document.getElementById("pos-modal");t&&t.remove();const{productos:o,variantes:a,inventario:n}=window._posData,i=o.find(p=>p.id===e);if(!i)return;const r=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",s=n.filter(p=>p.sucursal_id===r),d=a.filter(p=>p.producto_id===e),l=[...new Set(d.map(p=>p.color).filter(Boolean))];window._posBuffer={};const c=document.createElement("div");c.id="pos-modal",c.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",c.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:640px;width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden">
      
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid #eee;display:flex;align-items:center;gap:12px">
        ${i.imagen_principal?`<img id="pos-modal-img" src="${i.imagen_principal}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">`:""}
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem">${i.nombre}</p>
          <p style="font-size:0.8rem;color:#888">${i.sku_interno||""}</p>
          <p style="font-weight:700;color:#E91E8C">$${i.precio_menudeo} menudeo</p>
        </div>
        <button onclick="document.getElementById('pos-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;flex-shrink:0">✕</button>
      </div>

      ${i.corrida_activa?`
      <div style="padding:12px 1.5rem 0">
        <div style="display:flex;gap:4px;background:var(--surface-2,#f5f3f7);border-radius:12px;padding:4px">
          <button id="pos-modo-variado" class="pos-modo-tab active" onclick="posCambiarModo('${e}','variado')">🧺 Surtido variado</button>
          <button id="pos-modo-corrida" class="pos-modo-tab corrida" onclick="posCambiarModo('${e}','corrida')">📦 Corrida completa</button>
        </div>
        <p id="pos-modo-hint" style="font-size:0.72rem;color:#888;margin-top:7px;line-height:1.4">Elige tallas sueltas; el precio se ajusta solo según el total de pares (menudeo · mayoreo 3+ · 6+).</p>
      </div>
      `:""}

      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
        <p id="pos-color-label" style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:8px">SELECCIONA COLOR</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${l.map(p=>{const m=d.find(u=>u.color===p),g=d.filter(u=>u.color===p).reduce((u,b)=>{const v=s.find(y=>y.variante_id===b.id);return u+(v?v.cantidad:0)},0);return`
              <div onclick="posSeleccionarColor('${e}', '${p}')"
                   id="pos-color-btn-${p.replace(/\s/g,"_")}"
                   style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid ${g===0?"#f5f5f5":"#ddd"};opacity:${g===0?"0.4":"1"}">
                <div style="width:24px;height:24px;border-radius:50%;background:${m?m.color_hex:"#888"};border:2px solid #ddd"></div>
                <span style="font-size:0.65rem;color:#666;white-space:nowrap">${p}</span>
                <span id="pos-color-badge-${p.replace(/\s/g,"_")}" style="font-size:0.6rem;color:#2e7d32;font-weight:700;display:none">0 pares</span>
              </div>
            `}).join("")}
        </div>
      </div>

      <div id="pos-tallas-panel" style="padding:1rem;border-bottom:1px solid #eee;overflow-y:auto;flex:1;min-height:0;-webkit-overflow-scrolling:touch">
        <p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>
      </div>

      <div id="pos-modal-resumen" style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:none">
      </div>

      <div id="pos-modal-footer" style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid #eee">
        <button onclick="confirmarModalPOS('${e}')"
                id="pos-btn-confirmar"
                class="btn btn-primary"
                style="width:100%;padding:14px;font-size:1rem"
                disabled>
          Selecciona al menos una talla
        </button>
      </div>
  `,document.body.appendChild(c),c.addEventListener("click",p=>{p.target===c&&c.remove()}),window._posSeleccion={productoId:e,color:null},window._posBuffer={},window._posModo="variado",window._posColores=l,window._corridaCantidades={},l.length&&posSeleccionarColor(e,l[0])};window._posHighlightColor=(e,t,o)=>{document.querySelectorAll('[id^="pos-color-btn-"]').forEach(n=>{n.style.borderColor="#ddd",n.style.background="transparent"});const a=document.getElementById("pos-color-btn-"+e.replace(/\s/g,"_"));a&&(a.style.borderColor=t,a.style.background=o)};window.posSeleccionarColor=(e,t)=>{window._posModo==="corrida"?(window._corridaColorActivo=t,window._posSeleccion.color=t,window._posHighlightColor(t,"#6a1b9a","#f3e5f5"),renderCorridaTallas(e,t)):seleccionarColorModalPOS(e,t)};window.posCambiarModo=(e,t)=>{var s;window._posModo=t;const o=document.getElementById("pos-modo-variado"),a=document.getElementById("pos-modo-corrida");o&&o.classList.toggle("active",t==="variado"),a&&a.classList.toggle("active",t==="corrida");const n=document.getElementById("pos-modo-hint");n&&(n.textContent=t==="corrida"?'Una corrida completa: varias tallas de un mismo color a precio de corrida. Usa "Sugerir" para llenarla rápido.':"Elige tallas sueltas; el precio se ajusta solo según el total de pares (menudeo · mayoreo 3+ · 6+)."),document.querySelectorAll('[id^="pos-color-badge-"]').forEach(d=>{d.style.display="none"});const i=document.getElementById("pos-modal-footer"),r=((s=window._posSeleccion)==null?void 0:s.color)||window._corridaColorActivo||window._posColores&&window._posColores[0];if(t==="corrida")if(window._corridaCantidades||(window._corridaCantidades={}),i&&(i.innerHTML=`
      <button onclick="sugerirCorrida('${e}', window._corridaColorActivo)"
              style="width:100%;padding:12px;font-size:0.9rem;font-weight:700;cursor:pointer;background:#f3e5f5;color:#6a1b9a;border:1.5px solid #ce93d8;border-radius:10px;min-height:46px">
        ✨ Sugerir corrida (6 pares)
      </button>
      <button onclick="confirmarCorridaNueva('${e}')"
              id="pos-btn-confirmar-corrida" class="btn btn-primary"
              style="width:100%;padding:14px;font-size:1rem;background:#6a1b9a;border-color:#6a1b9a" disabled>
        Agrega tallas a la corrida
      </button>`),window._corridaColorActivo=r,r)window._posHighlightColor(r,"#6a1b9a","#f3e5f5"),renderCorridaTallas(e,r);else{const d=document.getElementById("pos-tallas-panel");d&&(d.innerHTML='<p style="color:#aaa;font-size:0.85rem">Selecciona un color para armar la corrida</p>')}else{if(i&&(i.innerHTML=`
      <button onclick="confirmarModalPOS('${e}')" id="pos-btn-confirmar"
              class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem" disabled>
        Selecciona al menos una talla
      </button>`),r)seleccionarColorModalPOS(e,r);else{const d=document.getElementById("pos-tallas-panel");d&&(d.innerHTML='<p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>')}actualizarResumenModalPOS(e)}};window.renderCorridaTallas=(e,t)=>{const{variantes:o,inventario:a}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=a.filter(l=>l.sucursal_id===n),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],s=o.filter(l=>l.producto_id===e&&l.color===t).sort((l,c)=>r.indexOf(l.talla)-r.indexOf(c.talla)),d=document.getElementById("pos-tallas-panel");d&&(window._corridaCantidades||(window._corridaCantidades={}),d.innerHTML=`
    <p style="font-size:0.75rem;color:#6a1b9a;font-weight:700;margin-bottom:12px">📦 CORRIDA · ${t} — ajusta cantidades por talla</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${s.map(l=>{const c=i.find(g=>g.variante_id===l.id),p=c?c.cantidad:0,m=window._corridaCantidades[l.id]||0;return`
          <div style="display:flex;align-items:center;gap:10px;opacity:${p===0?"0.4":"1"}">
            <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#333">${l.talla}</span>
            <span style="font-size:0.72rem;color:#aaa;min-width:54px">Stock: ${p}</span>
            <div style="display:flex;align-items:center;gap:6px">
              <button ${p===0?"disabled":""} onclick="posCorridaQty('${l.id}',-1,${p},'${e}')"
                      style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
              <input type="number" min="0" max="${p}" value="${m}" id="qty-corrida-${l.id}" ${p===0?"disabled":""}
                     style="width:56px;height:40px;text-align:center;padding:4px;border:2px solid ${m>0?"#6a1b9a":"#ddd"};border-radius:8px;font-size:1rem;font-weight:700"
                     oninput="window._corridaCantidades['${l.id}']=Math.min(${p},Math.max(0,parseInt(this.value)||0));this.value=window._corridaCantidades['${l.id}'];this.style.borderColor=window._corridaCantidades['${l.id}']>0?'#6a1b9a':'#ddd';actualizarBadgesCorrida('${e}')">
              <button ${p===0?"disabled":""} onclick="posCorridaQty('${l.id}',1,${p},'${e}')"
                      style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            ${p===0?'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>':""}
          </div>`}).join("")}
    </div>`,actualizarBadgesCorrida(e))};window.posCorridaQty=(e,t,o,a)=>{const n=window._corridaCantidades[e]||0,i=Math.min(o,Math.max(0,n+t));window._corridaCantidades[e]=i;const r=document.getElementById("qty-corrida-"+e);r&&(r.value=i,r.style.borderColor=i>0?"#6a1b9a":"#ddd"),actualizarBadgesCorrida(a)};window.actualizarBadgesCorrida=e=>{const{variantes:t}=window._posData;let o=0;(window._posColores||[]).forEach(i=>{const r=t.filter(l=>l.producto_id===e&&l.color===i);let s=0;r.forEach(l=>{s+=window._corridaCantidades[l.id]||0}),o+=s;const d=document.getElementById("pos-color-badge-"+i.replace(/\s/g,"_"));d&&(s>0?(d.textContent=s+" par"+(s>1?"es":""),d.style.color="#6a1b9a",d.style.display="block"):d.style.display="none")});const a=document.getElementById("pos-modal-resumen"),n=document.getElementById("pos-btn-confirmar-corrida");if(o>0){if(a){const i=[];Object.entries(window._corridaCantidades).forEach(([r,s])=>{if(s>0){const d=t.find(l=>l.id===r);d&&i.push({color:d.color,talla:d.talla,cantidad:s})}}),a.style.display="block",a.innerHTML=`
        <p style="font-size:0.75rem;font-weight:700;color:#6a1b9a;margin-bottom:8px">📦 CORRIDA — ${o} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${i.map(r=>`<span style="background:#f3e5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem;color:#6a1b9a"><strong>${r.color}</strong> T${r.talla} × ${r.cantidad}</span>`).join("")}
        </div>`}n&&(n.textContent=`✅ Agregar corrida (${o} pares)`,n.disabled=!1)}else a&&(a.style.display="none"),n&&(n.textContent="Agrega tallas a la corrida",n.disabled=!0)};window.mostrarCorridaModalPOS=e=>posCambiarModo(e,"corrida");window.sugerirCorrida=(e,t)=>{const{variantes:o,inventario:a}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=a.filter(c=>c.sucursal_id===n),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],s=o.filter(c=>c.producto_id===e&&c.color===t).sort((c,p)=>r.indexOf(c.talla)-r.indexOf(p.talla)),d=s.filter(c=>{const p=i.find(m=>m.variante_id===c.id);return p&&p.cantidad>0}),l=d.some(c=>c.talla.includes("."));if(s.forEach(c=>{window._corridaCantidades[c.id]=0}),l)d.slice(0,6).forEach(c=>{window._corridaCantidades[c.id]=1});else{const c=d.slice(0,5);c.length>=4?c.forEach((p,m)=>{window._corridaCantidades[p.id]=m===1||m===2?2:1}):d.slice(0,6).forEach(p=>{window._corridaCantidades[p.id]=Math.ceil(6/d.length)})}window._posHighlightColor(t,"#6a1b9a","#f3e5f5"),renderCorridaTallas(e,t)};window.confirmarCorridaNueva=e=>{const{variantes:t}=window._posData,o=window._posData.productos.find(i=>i.id===e);if(!o)return;let a=0;if(Object.entries(window._corridaCantidades).forEach(([i,r])=>{var l;if(r<=0)return;const s=t.find(c=>c.id===i);if(!s)return;const d=window._posCarrito.find(c=>c.variante_id===i&&c.es_corrida);d?(d.cantidad+=r,d.es_corrida=!0):window._posCarrito.push({variante_id:i,producto_id:e,nombre:o.nombre,color:s.color,talla:s.talla,cantidad:r,precio_menudeo:parseFloat(o.precio_menudeo)||0,precio_mayoreo3:parseFloat(o.precio_mayoreo3)||parseFloat(o.precio_menudeo)-30,precio_mayoreo6:parseFloat(o.precio_mayoreo6)||parseFloat(o.precio_menudeo)-70,precio_corrida:parseFloat(o.precio_corrida)||parseFloat(o.precio_menudeo)-100,es_corrida:!0,imagen:((l=window._posData.variantes.find(c=>c.id===i))==null?void 0:l.foto_url)||o.imagen_principal||null,precio_unitario:parseFloat(o.precio_corrida)||parseFloat(o.precio_menudeo)-100}),a++}),a===0){alert("Agrega al menos una talla");return}const n=document.getElementById("pos-modal");n&&n.remove(),window._corridaCantidades={},renderCarritoPOS()};window.seleccionarColorModalPOS=(e,t)=>{const{variantes:o,inventario:a}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=a.filter(g=>g.sucursal_id===n),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._posSeleccion&&window._posSeleccion.color&&guardarBufferColor(e,window._posSeleccion.color),document.querySelectorAll('[id^="pos-color-btn-"]').forEach(g=>{g.style.borderColor="#ddd",g.style.background="transparent"});const s=document.getElementById("pos-color-btn-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t;const d=o.filter(g=>g.producto_id===e&&g.color===t).sort((g,u)=>r.indexOf(g.talla)-r.indexOf(u.talla)),l=d[0]?d[0].foto_url:null,c=document.getElementById("pos-modal-img");c&&l&&(c.src=l);const p=window._posBuffer[t]||{},m=document.getElementById("pos-tallas-panel");m&&(m.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <p style="font-size:0.75rem;color:#888;font-weight:600;margin:0">TALLAS — ${t}</p>
        <p style="font-size:0.7rem;color:#aaa;margin:0">Toca una talla para agregar</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:12px">
        ${d.map(g=>{const u=i.find(y=>y.variante_id===g.id),b=u?u.cantidad:0,v=p[g.id]||0;return`
            <div style="position:relative">
              <button id="chip-talla-${g.id}"
                      onclick="posTallaTap('${g.id}','${e}','${t}',${b})"
                      ${b===0?"disabled":""}
                      style="width:100%;min-height:62px;border:2px solid ${v>0?"#E91E8C":"#ddd"};background:${v>0?"#fce4f3":"#fff"};border-radius:12px;cursor:${b===0?"not-allowed":"pointer"};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:inherit;padding:8px 4px;${b===0?"opacity:0.45":""};touch-action:manipulation">
                <span style="font-size:1.05rem;font-weight:800;color:#333">${g.talla}</span>
                <span style="font-size:0.63rem;color:${b===0?"#c62828":"#aaa"}">${b===0?"Agotado":"Stock "+b}</span>
              </button>
              <span id="chipbadge-${g.id}" style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:22px;height:22px;display:${v>0?"flex":"none"};align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;padding:0 5px;pointer-events:none">${v}</span>
              <button id="chipmenos-${g.id}"
                      onclick="posTallaMenos('${g.id}','${e}','${t}',${b})"
                      style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid #E91E8C;color:#E91E8C;border-radius:100px;width:26px;height:26px;display:${v>0?"flex":"none"};align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;cursor:pointer;line-height:1;touch-action:manipulation;box-shadow:0 1px 3px rgba(0,0,0,0.15)">−</button>
              <input type="hidden" id="qty-modal-${g.id}" value="${v}">
            </div>
          `}).join("")}
      </div>
    `)};window.posTallaTap=(e,t,o,a)=>{const n=document.getElementById("qty-modal-"+e);if(!n||n.disabled)return;const i=Math.min(a,(parseInt(n.value)||0)+1);n.value=i,posPintarChipTalla(e,i),actualizarBadgeColor(t,o)};window.posTallaMenos=(e,t,o)=>{const a=document.getElementById("qty-modal-"+e);if(!a)return;const n=Math.max(0,(parseInt(a.value)||0)-1);a.value=n,posPintarChipTalla(e,n),actualizarBadgeColor(t,o)};window.posPintarChipTalla=(e,t)=>{const o=document.getElementById("chip-talla-"+e);o&&(o.style.borderColor=t>0?"#E91E8C":"#ddd",o.style.background=t>0?"#fce4f3":"#fff");const a=document.getElementById("chipbadge-"+e);a&&(a.textContent=t,a.style.display=t>0?"flex":"none");const n=document.getElementById("chipmenos-"+e);n&&(n.style.display=t>0?"flex":"none")};window.guardarBufferColor=(e,t)=>{const{variantes:o}=window._posData,a=o.filter(n=>n.producto_id===e&&n.color===t);window._posBuffer[t]||(window._posBuffer[t]={}),a.forEach(n=>{const i=document.getElementById("qty-modal-"+n.id);window._posBuffer[t][n.id]=i&&parseInt(i.value)||0}),actualizarBadgeColor(e,t)};window.actualizarBadgeColor=(e,t)=>{const{variantes:o}=window._posData,a=o.filter(r=>r.producto_id===e&&r.color===t);let n=0;a.forEach(r=>{const s=document.getElementById("qty-modal-"+r.id);n+=s&&parseInt(s.value)||0});const i=document.getElementById("pos-color-badge-"+t.replace(/\s/g,"_"));i&&(n>0?(i.textContent=n+" par"+(n>1?"es":""),i.style.display="block"):i.style.display="none"),actualizarResumenModalPOS(e)};window.actualizarResumenModalPOS=e=>{const{variantes:t}=window._posData;let o=0;const a=[];Object.entries(window._posBuffer).forEach(([s,d])=>{Object.entries(d).forEach(([l,c])=>{if(c>0){const p=t.find(m=>m.id===l);p&&(a.push({color:s,talla:p.talla,cantidad:c}),o+=c)}})});const n=window._posSeleccion?window._posSeleccion.color:null;n&&!window._posBuffer[n]&&t.filter(d=>d.producto_id===e&&d.color===n).forEach(d=>{const l=document.getElementById("qty-modal-"+d.id),c=l&&parseInt(l.value)||0;c>0&&(a.push({color:n,talla:d.talla,cantidad:c}),o+=c)});const i=document.getElementById("pos-modal-resumen"),r=document.getElementById("pos-btn-confirmar");o>0?(i&&(i.style.display="block",i.innerHTML=`
        <p style="font-size:0.75rem;font-weight:700;color:#2e7d32;margin-bottom:8px">🛒 RESUMEN — ${o} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${a.map(s=>`
            <span style="background:#f5f5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem">
              <strong>${s.color}</strong> T${s.talla} × ${s.cantidad}
            </span>
          `).join("")}
        </div>
      `),r&&(r.textContent=`✅ Agregar ${o} pares al carrito`,r.disabled=!1)):(i&&(i.style.display="none"),r&&(r.textContent="Selecciona al menos una talla",r.disabled=!0))};window.confirmarModalPOS=e=>{window._posSeleccion&&window._posSeleccion.color;const{productos:t,variantes:o}=window._posData,a=t.find(i=>i.id===e);if(!a)return;window._posSeleccion&&window._posSeleccion.color?guardarBufferColor(e,window._posSeleccion.color):document.querySelectorAll('[id^="qty-modal-"]').forEach(r=>{const s=r.id.replace("qty-modal-",""),d=o.find(c=>c.id===s);if(!d)return;const l=parseInt(r.value)||0;window._posBuffer[d.color]||(window._posBuffer[d.color]={}),window._posBuffer[d.color][s]=l});let n=0;if(Object.entries(window._posBuffer).forEach(([i,r])=>{Object.entries(r).forEach(([s,d])=>{var p;if(d<=0)return;const l=o.find(m=>m.id===s),c=window._posCarrito.find(m=>m.variante_id===s&&!m.es_corrida);c?c.cantidad+=d:window._posCarrito.push({variante_id:s,producto_id:e,nombre:a.nombre,color:l?l.color:i,talla:l?l.talla:"",cantidad:d,precio_menudeo:parseFloat(a.precio_menudeo)||0,precio_mayoreo3:parseFloat(a.precio_mayoreo3)||parseFloat(a.precio_menudeo)-30,precio_mayoreo6:parseFloat(a.precio_mayoreo6)||parseFloat(a.precio_menudeo)-70,precio_corrida:parseFloat(a.precio_corrida)||parseFloat(a.precio_menudeo)-100,es_oferta:a.es_oferta||!1,es_corrida:!1,imagen:window._posBuffer[l?l.color:i]&&((p=window._posData.variantes.find(m=>m.id===s))==null?void 0:p.foto_url)||a.imagen_principal||null,precio_unitario:parseFloat(a.precio_menudeo)||0}),n++})}),n===0){alert("Pon al menos 1 par en alguna talla");return}document.getElementById("pos-modal").remove(),window._posBuffer={},renderCarritoPOS()};window.seleccionarColorPOS=(e,t)=>{const{variantes:o,inventario:a}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=a.filter(m=>m.sucursal_id===n),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];document.querySelectorAll('[id^="pos-color-"]').forEach(m=>{m.style.borderColor="transparent",m.style.background="transparent"});const s=document.getElementById("pos-color-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t,window._posSeleccion.talla=null;const d=o.filter(m=>m.producto_id===e&&m.color===t).sort((m,g)=>r.indexOf(m.talla)-r.indexOf(g.talla)),l=d[0]?d[0].foto_url:null,c=document.getElementById("pos-modal-img");c&&l&&(c.src=l);const p=document.getElementById("pos-tallas-container");p&&(p.innerHTML=`
    <p style="font-size:0.75rem;color:#888;margin-bottom:6px;font-weight:600">TALLAS Y CANTIDADES</p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${d.map(m=>{const g=i.find(v=>v.variante_id===m.id),u=g?g.cantidad:0,b=u>0;return`
          <div style="display:flex;align-items:center;gap:8px;opacity:${b?"1":"0.4"}">
            <span style="min-width:40px;font-size:0.85rem;font-weight:600;color:#333">${m.talla}</span>
            <span style="font-size:0.72rem;color:#888;min-width:60px">Stock: ${u}</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button onclick="cambiarCantidadTallaPOS('${m.id}', -1, ${u})" 
                      ${b?"":"disabled"}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${b?"":"cursor:not-allowed"}">−</button>
              <input type="number" min="0" max="${u}" value="0"
                     id="qty-${m.id}"
                     ${b?"":"disabled"}
                     style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                     oninput="validarCantidadTalla('${m.id}', ${u})">
              <button onclick="cambiarCantidadTallaPOS('${m.id}', 1, ${u})"
                      ${b?"":"disabled"}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${b?"":"cursor:not-allowed"}">+</button>
            </div>
            ${b?"":'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 6px;border-radius:100px">Agotado</span>'}
          </div>
        `}).join("")}
    </div>
    <button onclick="agregarTallasPOS('${e}', '${t}')" 
            class="btn btn-primary" 
            style="width:100%;margin-top:12px;padding:10px">
      + Agregar al carrito
    </button>
  `)};window.cambiarCantidadTallaPOS=(e,t,o)=>{const a=document.getElementById("qty-"+e);if(!a)return;const n=Math.min(o,Math.max(0,(parseInt(a.value)||0)+t));a.value=n,window._posSeleccion&&actualizarBadgeColor(window._posSeleccion.productoId,window._posSeleccion.color)};window.agregarTallasPOS=(e,t)=>{const{productos:o,variantes:a}=window._posData,n=o.find(d=>d.id===e);if(!n)return;const i=a.filter(d=>d.producto_id===e&&d.color===t);let r=0;if(i.forEach(d=>{const l=document.getElementById("qty-"+d.id),c=l&&parseInt(l.value)||0;if(c<=0)return;const p=window._posCarrito.find(m=>m.variante_id===d.id);p?p.cantidad+=c:window._posCarrito.push({variante_id:d.id,producto_id:e,nombre:n.nombre,color:t,talla:d.talla,cantidad:c,precio_menudeo:parseFloat(n.precio_menudeo)||0,precio_mayoreo3:parseFloat(n.precio_mayoreo3)||parseFloat(n.precio_menudeo)-30,precio_mayoreo6:parseFloat(n.precio_mayoreo6)||parseFloat(n.precio_menudeo)-70,precio_corrida:parseFloat(n.precio_corrida)||parseFloat(n.precio_menudeo)-100,imagen:n.imagen_principal||null,es_oferta:n.es_oferta||!1,precio_unitario:parseFloat(n.precio_menudeo)||0}),r++}),r===0){alert("Pon al menos 1 par en alguna talla");return}const s=document.querySelector(`button[onclick="agregarTallasPOS('${e}', '${t}')"]`);s&&(s.textContent="✅ Agregado — selecciona otro color o cierra",s.style.background="#2e7d32",s.style.borderColor="#2e7d32",s.disabled=!0),i.forEach(d=>{const l=document.getElementById("qty-"+d.id);l&&(l.value=0)}),actualizarResumenModal(e)};window.actualizarResumenModal=e=>{const t=window._posCarrito.filter(n=>n.producto_id===e),o=t.reduce((n,i)=>n+i.cantidad,0);let a=document.getElementById("pos-modal-resumen");if(!a){a=document.createElement("div"),a.id="pos-modal-resumen",a.style.cssText="background:#e8f5e9;border-radius:8px;padding:0.75rem;margin-top:10px;border:1px solid #a5d6a7";const n=document.querySelector("#pos-modal > div > div:last-child");n&&n.insertBefore(a,n.firstChild)}a.innerHTML=`
    <p style="font-size:0.78rem;font-weight:700;color:#2e7d32;margin-bottom:6px">🛒 En carrito — ${o} pares</p>
    ${t.map(n=>`
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#333;margin-bottom:2px">
        <span>${n.color} · T${n.talla}</span>
        <strong>${n.cantidad} par${n.cantidad>1?"es":""}</strong>
      </div>
    `).join("")}
    <button onclick="document.getElementById('pos-modal').remove(); renderCarritoPOS()"
            class="btn btn-primary"
            style="width:100%;margin-top:10px;padding:10px;font-size:0.95rem">
      ✅ Listo — agregar al carrito
    </button>
  `};window.seleccionarTallaPOS=(e,t)=>{window._posSeleccion.talla=t,window._posSeleccion.varianteId=e,document.querySelectorAll('[id^="pos-talla-"]').forEach(n=>{n.style.borderColor="#ddd",n.style.background="white",n.style.color="#333"});const o=document.getElementById("pos-talla-"+t.replace(".","_"));o&&(o.style.borderColor="#E91E8C",o.style.background="#fce4f3",o.style.color="#E91E8C");const a=document.getElementById("pos-btn-agregar");a&&(a.textContent="+ Agregar al carrito",a.disabled=!1)};window.agregarAlCarritoPOS=e=>{const{productos:t,variantes:o}=window._posData,{varianteId:a,color:n,talla:i}=window._posSeleccion;if(!a||!n||!i)return;const r=t.find(d=>d.id===e);if(!r)return;const s=window._posCarrito.find(d=>d.variante_id===a);s?s.cantidad++:window._posCarrito.push({variante_id:a,producto_id:e,nombre:r.nombre,color:n,talla:i,cantidad:1,precio_menudeo:parseFloat(r.precio_menudeo)||0,precio_mayoreo3:parseFloat(r.precio_mayoreo3)||parseFloat(r.precio_menudeo)-30,precio_mayoreo6:parseFloat(r.precio_mayoreo6)||parseFloat(r.precio_menudeo)-70,precio_corrida:parseFloat(r.precio_corrida)||parseFloat(r.precio_menudeo)-100,imagen:r.imagen_principal||null,es_oferta:r.es_oferta||!1,precio_unitario:parseFloat(r.precio_menudeo)||0}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.agregarCorridaPOS=e=>{const{productos:t,variantes:o,inventario:a}=window._posData,{color:n}=window._posSeleccion;if(!n){alert("Selecciona un color primero");return}t.find(m=>m.id===e);const i=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=a.filter(m=>m.sucursal_id===i),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=o.filter(m=>m.producto_id===e&&m.color===n).sort((m,g)=>s.indexOf(m.talla)-s.indexOf(g.talla)),c=document.getElementById("pos-modal").querySelector("div > div:last-child"),p=`
    <div style="background:#f3e5f5;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ce93d8">
      <p style="font-weight:700;color:#6a1b9a;margin-bottom:0.75rem">✏️ Editar corrida — ${n}</p>
      <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">Ajusta las cantidades por talla</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${d.map(m=>{const g=r.find(b=>b.variante_id===m.id),u=g?g.cantidad:0;return`
            <div style="display:flex;align-items:center;gap:8px">
              <span style="min-width:40px;font-size:0.85rem;font-weight:600">${m.talla}</span>
              <span style="font-size:0.72rem;color:#888;min-width:55px">Stock: ${u}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <button onclick="cambiarCantidadTallaPOS('corrida-${m.id}', -1, ${u})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">−</button>
                <input type="number" min="0" max="${u}" value="${u>0?1:0}"
                       id="qty-corrida-${m.id}"
                       style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                       oninput="validarCantidadTalla('corrida-${m.id}', ${u})">
                <button onclick="cambiarCantidadTallaPOS('corrida-${m.id}', 1, ${u})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">+</button>
              </div>
              ${u===0?'<span style="font-size:0.7rem;color:#c62828">Sin stock</span>':""}
            </div>
          `}).join("")}
      </div>
      <button onclick="confirmarCorridaPOS('${e}', '${n}')"
              class="btn btn-primary"
              style="width:100%;margin-top:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Confirmar corrida
      </button>
    </div>
  `;c&&c.insertAdjacentHTML("beforeend",p)};window.confirmarCorridaPOS=(e,t)=>{const{productos:o,variantes:a}=window._posData,n=o.find(r=>r.id===e);a.filter(r=>r.producto_id===e&&r.color===t).forEach(r=>{const s=document.getElementById("qty-corrida-"+r.id),d=s&&parseInt(s.value)||0;if(d<=0)return;const l=window._posCarrito.find(c=>c.variante_id===r.id);l?(l.cantidad+=d,l.es_corrida=!0):window._posCarrito.push({variante_id:r.id,producto_id:e,nombre:n.nombre,color:t,talla:r.talla,cantidad:d,precio_menudeo:parseFloat(n.precio_menudeo)||0,precio_mayoreo3:parseFloat(n.precio_mayoreo3)||parseFloat(n.precio_menudeo)-30,precio_mayoreo6:parseFloat(n.precio_mayoreo6)||parseFloat(n.precio_menudeo)-70,precio_corrida:parseFloat(n.precio_corrida)||parseFloat(n.precio_menudeo)-100,imagen:n.imagen_principal||null,es_oferta:n.es_oferta||!1,es_corrida:!0,precio_unitario:parseFloat(n.precio_menudeo)||0})}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.renderCarritoPOS=()=>{var g;const e=window._posCarrito,t=document.getElementById("pos-carrito-items");if(!t)return;const o=e.reduce((u,b)=>u+b.cantidad,0);e.forEach(u=>{u.precio_manual||(u.es_oferta?u.precio_unitario=u.precio_menudeo:u.es_corrida?u.precio_unitario=u.precio_corrida:o>=6?u.precio_unitario=u.precio_mayoreo6:o>=3?u.precio_unitario=u.precio_mayoreo3:u.precio_unitario=u.precio_menudeo)});const a=e.reduce((u,b)=>u+b.cantidad*b.precio_unitario,0),n=e.some(u=>u.es_corrida)?"Corrida":o>=6?"Mayoreo 6+":o>=3?"Mayoreo 3+":"Menudeo",i=e.filter(u=>!u.es_corrida),r=e.filter(u=>u.es_corrida),s={};r.forEach(u=>{const b=u.producto_id+"|"+u.color;s[b]||(s[b]={nombre:u.nombre,color:u.color,producto_id:u.producto_id,tallas:[],subtotal:0,imagen:u.imagen||null}),s[b].tallas.push({talla:u.talla,cantidad:u.cantidad,variante_id:u.variante_id}),s[b].subtotal+=u.cantidad*u.precio_unitario}),e.length===0?t.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>':t.innerHTML=`
      ${i.map(u=>`
  <div style="padding:10px;border-bottom:1px solid #f5f5f5">
    <div style="display:flex;gap:10px;margin-bottom:8px">
      ${u.imagen?`<img src="${u.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
      <div style="flex:1">
        <p style="font-size:0.9rem;font-weight:600">${u.nombre}</p>
        <p style="font-size:0.78rem;color:#888">${u.color} · T${u.talla}</p>
      </div>
      <button onclick="eliminarItemPOS(${e.indexOf(u)})" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="cambiarCantidadPOS(${e.indexOf(u)}, -1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">−</button>
        <span style="font-size:1rem;font-weight:700;min-width:24px;text-align:center">${u.cantidad}</span>
        <button onclick="cambiarCantidadPOS(${e.indexOf(u)}, 1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">+</button>
      </div>
      <div style="text-align:right">
        <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end">
          <span style="font-size:0.72rem;color:#888">$</span>
          <input type="number" value="${u.precio_unitario}"
                 onchange="editarPrecioPOS(${e.indexOf(u)}, this.value)"
                 style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
          <span style="font-size:0.72rem;color:#888">/par</span>
        </div>
        <p id="subtotal-item-${e.indexOf(u)}" style="font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:2px">$${(u.cantidad*u.precio_unitario).toFixed(2)}</p>
      </div>
    </div>
  </div>
`).join("")}

      
  ${Object.entries(s).map(([u,b])=>`
  <div style="padding:10px;border-bottom:1px solid #f5f5f5;background:#fdf4ff" data-corrida-key="${u}">
    <div style="display:flex;gap:10px;align-items:start;margin-bottom:6px">
      ${b.imagen?`<img src="${b.imagen}" style="width:48px;height:48px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">`:'<div style="width:48px;height:48px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>'}
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <p style="font-size:0.9rem;font-weight:700">${b.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${b.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${b.tallas.map(v=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${v.talla} ×${v.cantidad}</span>`).join("")}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${u}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;flex-wrap:wrap;gap:8px">
      <button onclick="editarCorridaEnCarrito('${u}')"
              style="background:#f3e5f5;border:1px solid #ce93d8;border-radius:6px;padding:6px 12px;font-size:0.78rem;color:#6a1b9a;cursor:pointer">
        ✏️ Editar corrida
      </button>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:0.78rem;color:#888">$</span>
        <input type="number" value="${(b.subtotal/b.tallas.reduce((v,y)=>v+y.cantidad,0)).toFixed(2)}"
               onchange="editarPrecioCorridaPOS('${u}', this.value)"
               style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
        <span style="font-size:0.72rem;color:#888">/par</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <span style="font-size:0.78rem;color:#888">${b.tallas.reduce((v,y)=>v+y.cantidad,0)} pares</span>
      <p id="subtotal-corrida-${u.replace("|","-")}" style="font-size:0.95rem;font-weight:700;color:#6a1b9a">$${b.subtotal.toFixed(2)}</p>
    </div>
  </div>
`).join("")}
    `;const d=document.getElementById("pos-total"),l=document.getElementById("pos-total-pares"),c=document.getElementById("pos-tipo-precio");d&&(d.textContent="$"+a.toFixed(2)),l&&(l.textContent=o),c&&(c.textContent=n);const p=document.getElementById("pos-flotante-pares"),m=document.getElementById("pos-flotante-total");p&&(p.textContent=o+" pares"),m&&(m.textContent="$"+a.toFixed(2)),(g=document.getElementById("pos-drawer"))!=null&&g.classList.contains("open")&&renderDrawerPOS()};window.editarPrecioPOS=(e,t)=>{if(!window._posCarrito[e])return;const o=parseFloat(t);if(!o||o<=0){alert("El precio debe ser mayor a $0");return}window._posCarrito[e].precio_unitario=o,window._posCarrito[e].precio_manual=!0;const a=window._posCarrito[e].cantidad,n=document.getElementById("subtotal-item-"+e);n&&(n.textContent="$"+(a*o).toFixed(2));const i=window._posCarrito.reduce((s,d)=>s+d.cantidad*d.precio_unitario,0),r=document.getElementById("pos-total");r&&(r.textContent="$"+i.toFixed(2))};window.editarPrecioCorridaPOS=(e,t)=>{const[o,a]=e.split("|"),n=parseFloat(t);if(!n||n<=0){alert("El precio debe ser mayor a $0");return}window._posCarrito.forEach(c=>{c.producto_id===o&&c.color===a&&c.es_corrida&&(c.precio_unitario=n,c.precio_manual=!0)});const r=window._posCarrito.filter(c=>c.producto_id===o&&c.color===a&&c.es_corrida).reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),s=document.getElementById("subtotal-corrida-"+e.replace("|","-"));s&&(s.textContent="$"+r.toFixed(2));const d=window._posCarrito.reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),l=document.getElementById("pos-total");l&&(l.textContent="$"+d.toFixed(2))};window.editarCorridaEnCarrito=e=>{const[t,o]=e.split("|"),{inventario:a,variantes:n}=window._posData,i=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=a.filter(c=>c.sucursal_id===i),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=n.filter(c=>c.producto_id===t&&c.color===o).sort((c,p)=>s.indexOf(c.talla)-s.indexOf(p.talla)),l=document.createElement("div");l.id="pos-modal-editar-corrida",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:400px;width:100%;padding:1.5rem;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700;color:#6a1b9a">✏️ Editar corrida · ${o}</p>
        <button onclick="document.getElementById('pos-modal-editar-corrida').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${d.map(c=>{const p=r.find(b=>b.variante_id===c.id),m=p?p.cantidad:0,g=window._posCarrito.find(b=>b.variante_id===c.id&&b.es_corrida),u=g?g.cantidad:0;return`
            <div style="display:flex;align-items:center;gap:10px">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700">T${c.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:55px">Stock: ${m}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="this.nextElementSibling.value=Math.max(0,parseInt(this.nextElementSibling.value)-1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">−</button>
                <input type="number" min="0" max="${m}" value="${u}"
                       id="edit-corrida-${c.id}"
                       style="width:50px;text-align:center;padding:4px;border:2px solid #6a1b9a;border-radius:8px;font-size:1rem;font-weight:700">
                <button onclick="this.previousElementSibling.value=Math.min(${m},parseInt(this.previousElementSibling.value)+1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">+</button>
              </div>
            </div>
          `}).join("")}
      </div>
      <button onclick="guardarEdicionCorridaPOS('${t}', '${o}')"
              class="btn btn-primary"
              style="width:100%;margin-top:1.5rem;padding:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Guardar cambios
      </button>
    </div>
  `,document.body.appendChild(l),l.addEventListener("click",c=>{c.target===l&&l.remove()})};window.guardarEdicionCorridaPOS=(e,t)=>{const{variantes:o,productos:a}=window._posData,n=window._posCarrito.filter(l=>l.producto_id===e&&l.color===t&&l.es_corrida),i=n.length>0&&n[0].precio_manual?n[0].precio_unitario:null;window._posCarrito=window._posCarrito.filter(l=>!(l.producto_id===e&&l.color===t&&l.es_corrida));const r=o.filter(l=>l.producto_id===e&&l.color===t),s=a.find(l=>l.id===e);if(!s)return;const d=i!==null?i:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-100;r.forEach(l=>{const c=document.getElementById("edit-corrida-"+l.id),p=c&&parseInt(c.value)||0;p<=0||window._posCarrito.push({variante_id:l.id,producto_id:e,nombre:s.nombre,color:t,talla:l.talla,cantidad:p,precio_menudeo:parseFloat(s.precio_menudeo)||0,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||parseFloat(s.precio_menudeo)-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||parseFloat(s.precio_menudeo)-70,precio_corrida:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-100,es_oferta:s.es_oferta||!1,imagen:s.imagen_principal||null,es_corrida:!0,precio_manual:i!==null,precio_unitario:d})}),document.getElementById("pos-modal-editar-corrida").remove(),renderCarritoPOS()};window.eliminarCorridaPOS=e=>{const[t,o]=e.split("|");window._posCarrito=window._posCarrito.filter(a=>!(a.producto_id===t&&a.color===o&&a.es_corrida)),renderCarritoPOS()};window.cambiarCantidadPOS=async(e,t)=>{const o=window._posCarrito[e];if(o){if(t>0){const a=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"";try{const r=(await(await fetch(f+"/inventario/sucursal/"+a)).json()).find(l=>l.variante_id===o.variante_id),s=r?r.cantidad:0;if(window._posCarrito.filter(l=>l.variante_id===o.variante_id).reduce((l,c)=>l+c.cantidad,0)>=s){alert("No hay más existencia disponible. Stock: "+s+" pares");return}}catch(n){console.error("Error verificando stock",n)}}o.cantidad=Math.max(1,o.cantidad+t),renderCarritoPOS()}};window.eliminarItemPOS=e=>{window._posCarrito.splice(e,1),renderCarritoPOS()};window.limpiarCarritoPOS=()=>{window._posCarrito.length>0&&!confirm("Limpiar el carrito?")||(window._posCarrito=[],renderCarritoPOS())};window.cobrarPOS=async()=>{var s,d;if(window._posCarrito.length===0){alert("El carrito esta vacio");return}if(window._cobrando)return;window._cobrando=!0;const e=document.querySelector('button[onclick="cobrarPOS()"]'),t=document.querySelector('button[onclick="cobrarPOSM()"]');[e,t].forEach(l=>{l&&(l.disabled=!0,l.textContent="Procesando...")});const o=document.getElementById("pos-cliente").value||null,a=document.getElementById("pos-sucursal").value,n=document.getElementById("pos-pago").value,i=window._posCarrito.reduce((l,c)=>l+c.cantidad*c.precio_unitario,0);if((s=window._posData)!=null&&s.inventario){const l=[];for(const c of window._posCarrito){const p=window._posData.inventario.find(g=>g.variante_id===c.variante_id),m=p?p.cantidad:0;m<c.cantidad&&l.push(`${c.nombre} ${c.color} T:${c.talla} (disponible: ${m}, pedido: ${c.cantidad})`)}if(l.length>0){alert(`Sin stock suficiente:
`+l.join(`
`)),e&&(e.disabled=!1,e.textContent="Cobrar");return}}let r=null;try{const l=await fetch(f+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:o,canal:"sucursal",sucursal_id:a,forma_pago:n,total:i,subtotal:i,status:"borrador"})}),c=await l.json();if(!l.ok)throw new Error("No se pudo crear el pedido: "+JSON.stringify(c));if(r=Array.isArray(c)?(d=c[0])==null?void 0:d.id:c==null?void 0:c.id,!r)throw new Error("No se obtuvo ID del pedido");for(const g of window._posCarrito){const u=await fetch(f+"/pedidos/"+r+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:g.variante_id,cantidad:g.cantidad,precio_unitario:g.precio_unitario,subtotal:g.cantidad*g.precio_unitario})});if(!u.ok){const b=await u.json().catch(()=>({}));throw new Error("Error en item "+g.nombre+": "+JSON.stringify(b))}}if(n!=="spei"){const g=await fetch(f+"/pedidos/"+r+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:n})});if(!g.ok){const u=await g.json().catch(()=>({}));throw new Error("Error confirmando: "+JSON.stringify(u))}}else await fetch(f+"/pedidos/"+r,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"pendiente_pago"})});const p=window._posCarrito.reduce((g,u)=>g+u.cantidad,0);window._posCarrito=[],window._cobrando=!1,renderCarritoPOS(),imprimirTicketPOS(r,i,p,n);const m=await fetch(f+"/inventario/sucursal/"+a);window._posData.inventario=await m.json(),renderProductosPOS(window._posData.productos)}catch(l){if(console.error("Error procesando la venta:",l),window._cobrando=!1,r)try{await fetch(f+"/pedidos/"+r+"/cancelar",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),console.warn("Pedido "+r+" cancelado por error")}catch{}alert(`Error al procesar la venta:
`+((l==null?void 0:l.message)||l)),[e,t].forEach(c=>{c&&(c.disabled=!1,c.textContent="Cobrar")})}};window.imprimirTicketPOS=async(e,t,o,a)=>{const i=await(await fetch(f+"/pedidos/"+e)).json();if(!i||i.length===0)return;const r=i[0],s=r.pedido_items||[],d=r.clientes||{},l=new Date().toLocaleString("es-MX"),c=window.open("","_blank","width=400,height=600");c.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 280px;
          padding: 10px;
          color: #000;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .logo { font-size: 18px; font-weight: bold; margin-bottom: 2px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .item-nombre { font-weight: bold; margin-bottom: 1px; }
        .item-detalle { color: #444; font-size: 11px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; }
        .footer { margin-top: 10px; font-size: 11px; }
        @media print {
          body { width: 280px; }
          @page { margin: 0; size: 80mm auto; }
        }
      </style>
    </head>
    <body>
      <div class="center">
        <p class="logo">Zapatillas May</p>
        <p style="font-size:10px">Leon, Guanajuato</p>
        <p style="font-size:10px">Tel: 477 247 2285</p>
      </div>
      <div class="divider"></div>
      <div class="row">
      <span>Pedido:</span>
        <span>#${e.substring(0,8).toUpperCase()}</span>
      </div>
      <div class="row">
        <span>Fecha:</span>
        <span>${l}</span>
      </div>
      <div class="row">
        <span>Cliente:</span>
        <span>${d.nombre||"General"}</span>
      </div>
      <div class="row">
        <span>Pago:</span>
        <span>${a.toUpperCase()}</span>
      </div>
      <div class="divider"></div>
      ${(()=>{const p={};return s.forEach(m=>{const g=m.variantes||{},u=g.productos||{},b=(u.nombre||"—")+"|"+(g.color||"");p[b]||(p[b]={nombre:u.nombre||"—",color:g.color||"",cantidad:0,subtotal:0}),p[b].cantidad+=m.cantidad,p[b].subtotal+=parseFloat(m.subtotal)||m.cantidad*m.precio_unitario}),`
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="border-bottom:1px solid #000">
        <td style="width:30px;text-align:right;padding-right:6px;font-weight:bold">Cant</td>
        <td style="padding-right:4px;font-weight:bold">Modelo</td>
        <td style="padding-right:4px;font-weight:bold">Color</td>
        <td style="text-align:right;font-weight:bold">Total</td>
      </tr>
      ${Object.values(p).map(m=>`
        <tr>
          <td style="width:30px;text-align:right;padding-right:6px">${m.cantidad}</td>
          <td style="padding-right:4px">${m.nombre}</td>
          <td style="padding-right:4px;color:#444">${m.color}</td>
          <td style="text-align:right;font-weight:bold">$${m.subtotal.toFixed(2)}</td>
        </tr>
      `).join("")}
    </table>
  `})()}
      <div class="divider"></div>
      <div class="row">
        <span>Total pares:</span>
        <span>${o}</span>
      </div>
      <div class="total-row">
        <span>TOTAL:</span>
        <span>$${t.toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="center footer">
        <p class="bold">┬íGracias por su compra!</p>
        <p>En herrajes y pedreria no hay devoluciones</p>
        <p>por su proceso artesanal.</p>
      </div>
      <div class="divider"></div>
      <div style="font-size:10px;margin-top:4px">
        <p>RFC: SAPL620614JD7</p>
        <p>Cuautla 211 Col. Killian</p>
        <p>Leon, Gto. CP 37260</p>
        <p>Tel: 477 530 8983</p>
        <p class="center" style="margin-top:4px">zapatillasmay.mx</p>
      </div>
      <script>window.onload=()=>{window.print()}<\/script>
    </body>
    </html>
  `),c.document.close()};window.generarPDFPedido=async e=>{const o=await(await fetch(f+"/pedidos/"+e)).json();if(!o||o.length===0)return;const a=o[0],n=a.pedido_items||[],i=a.clientes||{},r=new Date(a.created_at).toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"}),s=a.total||0,d=n.reduce((c,p)=>c+p.cantidad,0),l=window.open("","_blank");l.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Pedido ${e.substring(0,8).toUpperCase()}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; font-size:13px; color:#333; padding:40px; }
        .header { display:flex; justify-content:space-between; align-items:start; margin-bottom:30px; }
        .logo { font-size:24px; font-weight:bold; color:#E91E8C; }
        .logo span { color:#333; }
        .empresa-datos { font-size:11px; color:#666; margin-top:4px; line-height:1.6; }
        .pedido-info { text-align:right; }
        .pedido-num { font-size:18px; font-weight:bold; color:#333; }
        .pedido-fecha { font-size:12px; color:#888; margin-top:4px; }
        .divider { border-top:2px solid #E91E8C; margin:20px 0; }
        .divider-light { border-top:1px solid #eee; margin:15px 0; }
        .section-title { font-weight:bold; font-size:12px; color:#888; text-transform:uppercase; margin-bottom:8px; }
        .cliente-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
        .campo { margin-bottom:6px; }
        .campo-label { font-size:11px; color:#888; }
        .campo-valor { font-weight:600; }
        table { width:100%; border-collapse:collapse; margin-bottom:20px; }
        thead tr { background:#f5f5f5; }
        th { padding:10px 12px; text-align:left; font-size:12px; font-weight:600; color:#555; border-bottom:2px solid #eee; }
        td { padding:10px 12px; border-bottom:1px solid #f5f5f5; font-size:13px; }
        .text-right { text-align:right; }
        .total-section { display:flex; justify-content:flex-end; }
        .total-box { width:250px; }
        .total-row { display:flex; justify-content:space-between; padding:6px 0; }
        .total-final { display:flex; justify-content:space-between; padding:10px 0; border-top:2px solid #E91E8C; font-size:16px; font-weight:bold; color:#E91E8C; }
        .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; }
        .badge-success { background:#e8f5e9; color:#2e7d32; }
        .badge-warning { background:#fff8e1; color:#f57f17; }
        .footer { margin-top:40px; padding-top:20px; border-top:1px solid #eee; display:flex; justify-content:space-between; font-size:11px; color:#888; }
        .leyenda { margin-top:20px; font-size:11px; color:#888; font-style:italic; }
        @media print {
          body { padding:20px; }
          @page { margin:15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Zapatillas <span>May</span></div>
          <div class="empresa-datos">
            RFC: SAPL620614JD7<br>
            Cuautla 211 Col. Killian, Leon, Gto. CP 37260<br>
            Tel: 477 530 8983 | zapatillasmay.mx
          </div>
        </div>
        <div class="pedido-info">
          <div class="pedido-num">Pedido #${e.substring(0,8).toUpperCase()}</div>
          <div class="pedido-fecha">${r}</div>
          <div style="margin-top:8px">
            <span class="badge ${a.status==="confirmado"||a.status==="pagado"?"badge-success":"badge-warning"}">${a.status}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="cliente-grid">
        <div>
          <div class="section-title">Datos del cliente</div>
          <div class="campo">
            <div class="campo-label">Nombre</div>
            <div class="campo-valor">${i.nombre||"Cliente general"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Telefono</div>
            <div class="campo-valor">${i.telefono||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Email</div>
            <div class="campo-valor">${i.email||"—"}</div>
          </div>
        </div>
        <div>
          <div class="section-title">Informacion del pedido</div>
          <div class="campo">
            <div class="campo-label">Canal</div>
            <div class="campo-valor">${a.canal||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Forma de pago</div>
            <div class="campo-valor">${a.forma_pago||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Sucursal</div>
            <div class="campo-valor">${a.sucursales?a.sucursales.nombre:"—"}</div>
          </div>
        </div>
      </div>

      <div class="divider-light"></div>

      <div class="section-title">Productos</div>
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Color</th>
            <th>Talla</th>
            <th>SKU</th>
            <th class="text-right">Cant</th>
            <th class="text-right">Precio unit</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${n.map(c=>{const p=c.variantes||{};return`
              <tr>
                <td>${(p.productos||{}).nombre||"—"}</td>
                <td>${p.color||"—"}</td>
                <td>${p.talla||"—"}</td>
                <td style="font-size:11px;color:#888">${p.sku||"—"}</td>
                <td class="text-right">${c.cantidad}</td>
                <td class="text-right">$${c.precio_unitario}</td>
                <td class="text-right font-weight:bold">$${c.subtotal}</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-box">
          <div class="total-row">
            <span>Total pares:</span>
            <span>${d}</span>
          </div>
          <div class="total-final">
            <span>TOTAL:</span>
            <span>$${parseFloat(s).toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${a.comentarios?`
        <div class="divider-light"></div>
        <div class="section-title">Comentarios</div>
        <p style="font-size:12px;color:#555">${a.comentarios}</p>
      `:""}

      <div class="leyenda">
        * En herrajes y pedreria no hay devoluciones por su proceso artesanal.
      </div>

      <div class="footer">
        <span>Zapatillas May — zapatillasmay.mx</span>
        <span>RFC: SAPL620614JD7</span>
        <span>Generado el ${new Date().toLocaleDateString("es-MX")}</span>
      </div>

     <script>window.onload = () => { window.print() }<\/script>
    </body>
    </html>
  `),l.document.close()};async function Fe(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/movimientos/")).json(),a={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}};e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Historial de movimientos (${o.length})</h3>
          <div style="display:flex;gap:8px">
            <select class="form-input" id="hist-tipo" style="max-width:160px" onchange="filtrarHistorial()">
              <option value="">Todos los tipos</option>
              <option value="venta">Ventas</option>
              <option value="entrada">Entradas</option>
              <option value="ajuste">Ajustes</option>
              <option value="traspaso_salida">Traspasos</option>
              <option value="cambio_salida">Cambios</option>
            </select>
            <input class="form-input" id="hist-buscar" placeholder="Buscar..." style="max-width:200px" oninput="filtrarHistorial()">
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Usuario</th><th>Motivo</th><th>Acción</th></tr>
          </thead>
          <tbody id="hist-tbody">
            ${o.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No hay movimientos registrados</td></tr>':o.map(n=>{const i=a[n.tipo]||{label:n.tipo,badge:"badge-warning"},r=n.cantidad||0;return`<tr>
                    <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(n.created_at).toLocaleString("es-MX")}</td>
                    <td><span class="badge ${i.badge}">${i.label}</span></td>
                    <td><strong>${n.variantes&&n.variantes.productos?n.variantes.productos.nombre:"—"}</strong></td>
                    <td>${n.variantes&&n.variantes.color||"—"}</td>
                    <td>${n.variantes&&n.variantes.talla||"—"}</td>
                    <td>${n.sucursales&&n.sucursales.nombre||"—"}</td>
                    <td style="font-weight:600;color:${r>0?"var(--green)":"var(--red)"}">${r>0?"+":""}${r}</td>
                    <td style="font-size:0.82rem">${n.usuario||"Admin"}</td>
<td style="font-size:0.82rem;color:var(--text-muted)">${n.motivo||"—"}</td>
<td>
  ${n.tipo!=="venta"&&n.tipo!=="ajuste"?`
  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#c62828;border-color:#c62828" 
          onclick="cancelarMovimiento('${n.id}', ${Math.abs(n.cantidad)}, '${n.variante_id}', '${n.sucursal_id}', '${n.tipo}')">
    Cancelar
  </button>`:""}
</td>
                  </tr>`}).join("")}
          </tbody>
        </table>
      </div>`,window._historialData=o}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.cancelarMovimiento=async(e,t,o,a,n)=>{if(confirm("¿Cancelar este movimiento? Se revertirá el cambio en el inventario."))try{const r=await(await fetch(f+"/inventario/?variante_id=eq."+o+"&sucursal_id=eq."+a)).json(),s=r&&r.length>0?r[0].cantidad:0,d=n==="venta"?s+t:Math.max(0,s-t);(await fetch(f+"/inventario/actualizar",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:o,sucursal_id:a,cantidad:d,stock_minimo:r&&r.length>0?r[0].stock_minimo:3})})).ok?(alert("Movimiento cancelado. Inventario actualizado."),Fe()):alert("Error al actualizar inventario")}catch{alert("Error conectando con el servidor")}};window.filtrarHistorial=()=>{const e=document.getElementById("hist-tipo").value,t=document.getElementById("hist-buscar").value.toLowerCase(),o=window._historialData||[],a={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}},n=o.filter(r=>{if(e&&r.tipo!==e)return!1;if(t){const s=(r.variantes&&r.variantes.productos?r.variantes.productos.nombre:"").toLowerCase(),d=(r.motivo||"").toLowerCase();if(!s.includes(t)&&!d.includes(t))return!1}return!0}),i=document.getElementById("hist-tbody");i&&(i.innerHTML=n.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron movimientos</td></tr>':n.map(r=>{const s=a[r.tipo]||{label:r.tipo,badge:"badge-warning"},d=r.cantidad||0;return`<tr>
          <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(r.created_at).toLocaleString("es-MX")}</td>
          <td><span class="badge ${s.badge}">${s.label}</span></td>
          <td><strong>${r.variantes&&r.variantes.productos?r.variantes.productos.nombre:"—"}</strong></td>
          <td>${r.variantes&&r.variantes.color||"—"}</td>
          <td>${r.variantes&&r.variantes.talla||"—"}</td>
          <td>${r.sucursales&&r.sucursales.nombre||"—"}</td>
          <td style="font-weight:600;color:${d>0?"var(--green)":"var(--red)"}">${d>0?"+":""}${d}</td>
          <td style="font-size:0.82rem">${r.motivo||"—"}</td>
        </tr>`}).join(""))};async function rt(){try{const t=await(await fetch(f+"/pedidos/")).json(),a=await(await fetch(f+"/clientes/")).json(),i=await(await fetch(f+"/inventario/alertas")).json(),r=new Date;r.setHours(0,0,0,0);const s=new Date(r);s.setDate(s.getDate()-7);const d=new Date(r);d.setDate(d.getDate()-30);const l=t.filter(k=>["confirmado","pagado","enviado"].includes(k.status)),c=l.filter(k=>new Date(k.created_at)>=r),p=l.filter(k=>new Date(k.created_at)>=s),m=c.reduce((k,P)=>k+parseFloat(P.total||0),0),g=p.reduce((k,P)=>k+parseFloat(P.total||0),0),u=a.filter(k=>k.created_at&&new Date(k.created_at)>=d).length,b=["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],v={};b.forEach(k=>v[k]=0),l.filter(k=>new Date(k.created_at)>=d).forEach(k=>{const P=b[new Date(k.created_at).getDay()];v[P]+=parseFloat(k.total||0)});const y={};l.forEach(k=>{y[k.canal||"sucursal"]=(y[k.canal||"sucursal"]||0)+parseFloat(k.total||0)});const h={};l.forEach(k=>{h[k.forma_pago||"efectivo"]=(h[k.forma_pago||"efectivo"]||0)+1});const w={};l.forEach(k=>{w[k.empleado||"Admin"]=(w[k.empleado||"Admin"]||0)+parseFloat(k.total||0)});const _={};l.forEach(k=>{const P=new Date(k.created_at).toLocaleDateString("es-MX",{month:"short",year:"numeric"});_[P]=(_[P]||0)+parseFloat(k.total||0)});const x={};l.forEach(k=>{k.clientes&&(x[k.clientes.nombre]=(x[k.clientes.nombre]||0)+parseFloat(k.total||0))});const z=Object.entries(x).sort((k,P)=>P[1]-k[1]).slice(0,5),B=Object.entries(v).sort((k,P)=>P[1]-k[1])[0],$=Object.entries(w).sort((k,P)=>P[1]-k[1])[0];if(!document.getElementById("dashboard-contenido"))return;const G=l.filter(k=>new Date(k.created_at)>=d),S=G.reduce((k,P)=>k+parseFloat(P.total||0),0),M=[];for(let k=6;k>=0;k--){const P=new Date(r);P.setDate(P.getDate()-k);const F=P.toISOString().split("T")[0],E=P.toLocaleDateString("es-MX",{weekday:"short",day:"numeric"}),L=l.filter(O=>{var I;return(I=O.created_at)==null?void 0:I.startsWith(F)}).reduce((O,I)=>O+parseFloat(I.total||0),0);M.push({label:E,total:L,ds:F})}const D=(k,P,F,E)=>{const L=document.getElementById(k),O=document.getElementById(k+"-sub");L&&(L.textContent=P,E&&(L.style.color=E)),O&&F&&(O.textContent=F)};D("kpi-ventas-hoy","$"+m.toLocaleString("es-MX",{maximumFractionDigits:0}),c.length+" pedidos","#C8967A"),D("kpi-pedidos-hoy",c.length,"confirmados"),D("kpi-ventas-7d","$"+g.toLocaleString("es-MX",{maximumFractionDigits:0}),p.length+" pedidos"),D("kpi-ventas-30d","$"+S.toLocaleString("es-MX",{maximumFractionDigits:0}),G.length+" pedidos"),D("kpi-clientes-nuevos",u,"últimos 30 días"),D("kpi-stock-bajo",i.length,i.length>0?"⚠ reabastecer":"✓ ok",i.length>0?"#f59e0b":"#10b981"),D("kpi-mejor-dia",B?B[0]:"—",B?"$"+B[1].toLocaleString("es-MX",{maximumFractionDigits:0}):""),D("kpi-total-clientes",a.length,"registrados");const j=document.getElementById("dash-top-clientes");j&&(j.innerHTML=z.length===0?'<p style="color:var(--text-muted);font-size:0.85rem">Sin datos aun</p>':z.map(([k,P],F)=>`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="width:22px;height:22px;background:linear-gradient(135deg,#C8967A,#b5687a);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:700;flex-shrink:0">${F+1}</span>
            <span style="flex:1;font-size:0.86rem;color:var(--text-1)">${k}</span>
            <strong style="color:#C8967A;font-family:'DM Mono',monospace;font-size:0.88rem">$${P.toLocaleString("es-MX",{maximumFractionDigits:0})}</strong>
          </div>`).join(""));const A=document.getElementById("dash-ultimos-pedidos");if(A){const k=F=>F==="online"||F==="mp"?"🌐":F==="whatsapp"?"💬":"🏪",P=F=>F==="confirmado"||F==="pagado"?"#10b981":F==="enviado"?"#0891b2":"#f59e0b";A.innerHTML=t.slice(0,7).map(F=>{var E;return`
        <div onclick="verPedido('${F.id}')" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
          <div style="width:36px;height:36px;background:var(--pink-soft);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${k(F.mp_preference_id?"online":F.canal||"")}</div>
          <div style="flex:1;min-width:0">
            <p style="font-size:0.83rem;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${((E=F.clientes)==null?void 0:E.nombre)||F.nombre_cliente||"General"}</p>
            <p style="font-size:0.68rem;color:var(--text-3);margin-top:1px">${F.mp_preference_id?"Online":F.canal||"Sucursal"} · ${new Date(F.created_at).toLocaleDateString("es-MX",{day:"numeric",month:"short"})}</p>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <p style="font-weight:700;color:var(--pink);font-family:'DM Mono',monospace;font-size:0.84rem">$${parseFloat(F.total||0).toLocaleString("es-MX",{maximumFractionDigits:0})}</p>
            <span style="font-size:0.6rem;font-weight:700;color:${P(F.status)}">${F.status}</span>
          </div>
        </div>`}).join("")}setTimeout(()=>{const k="#E91E8C",P="#7c3aed",F="#0891b2",E="#059669",L=["rgba(233,30,140,0.8)","rgba(124,58,237,0.8)","rgba(8,145,178,0.8)","rgba(5,150,105,0.8)","rgba(217,119,6,0.8)","rgba(220,38,38,0.8)"],O=["#E91E8C","#7c3aed","#0891b2","#059669","#d97706","#dc2626"],I={ticks:{color:"#94a3b8",font:{size:9}},grid:{color:"rgba(148,163,184,0.08)"}},q={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:I,y:I}},T=document.getElementById("chart-tendencia");T&&window.Chart&&new Chart(T,{type:"line",data:{labels:M.map(V=>V.label),datasets:[{data:M.map(V=>V.total),borderColor:k,backgroundColor:"rgba(233,30,140,0.08)",borderWidth:2.5,pointBackgroundColor:k,pointBorderColor:"white",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7,fill:!0,tension:.4}]},options:{...q,plugins:{legend:{display:!1},tooltip:{callbacks:{label:V=>" $"+V.parsed.y.toLocaleString("es-MX",{maximumFractionDigits:0})}}}}});const H=document.getElementById("chart-dias");H&&window.Chart&&new Chart(H,{type:"bar",data:{labels:b,datasets:[{data:b.map(V=>v[V]||0),backgroundColor:L,borderColor:O,borderWidth:1.5,borderRadius:6}]},options:{...q,plugins:{legend:{display:!1}}}});const R=document.getElementById("chart-canales"),N=Object.keys(y),W=Object.values(y);if(R&&window.Chart&&N.length>0){new Chart(R,{type:"doughnut",data:{labels:N,datasets:[{data:W,backgroundColor:L,borderColor:O,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"72%",plugins:{legend:{display:!1},tooltip:{callbacks:{label:Z=>` ${Z.label}: $${Z.parsed.toLocaleString("es-MX",{maximumFractionDigits:0})}`}}}}});const V=W.reduce((Z,J)=>Z+J,0),U=document.getElementById("dash-canales-lista");U&&(U.innerHTML=N.map((Z,J)=>`
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
            <span style="width:9px;height:9px;border-radius:50%;background:${O[J%O.length]};flex-shrink:0"></span>
            <span style="flex:1;font-size:0.76rem;color:var(--text-2);text-transform:capitalize">${Z}</span>
            <span style="font-size:0.76rem;font-weight:700;color:var(--text-1);font-family:'DM Mono',monospace">${V>0?Math.round(W[J]/V*100):0}%</span>
          </div>`).join(""))}const X=document.getElementById("chart-meses");if(X&&window.Chart){const V=Object.entries(_).slice(-6);new Chart(X,{type:"line",data:{labels:V.map(([U])=>U),datasets:[{data:V.map(([,U])=>U),borderColor:P,backgroundColor:"rgba(124,58,237,0.07)",borderWidth:2,pointBackgroundColor:P,pointBorderColor:"white",pointBorderWidth:2,pointRadius:4,fill:!0,tension:.4}]},options:{...q,plugins:{legend:{display:!1}}}})}const Q=document.getElementById("chart-pagos");Q&&window.Chart&&Object.keys(h).length>0&&new Chart(Q,{type:"doughnut",data:{labels:Object.keys(h),datasets:[{data:Object.values(h),backgroundColor:L,borderColor:O,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"70%",plugins:{legend:{display:!1},tooltip:{callbacks:{label:V=>` ${V.label}: ${V.parsed}`}}}}})},300),window.dashSwitchTab=(k,P)=>{["dias","meses","pagos"].forEach(F=>{const E=document.getElementById("dash-tab-"+F);E&&(E.style.display=F===k?"block":"none")}),document.querySelectorAll(".dash-tab-btn").forEach(F=>F.classList.remove("active")),P&&P.classList.add("active")};try{const P=await(await fetch(f+"/chatbot/tareas-hoy")).json(),F=document.createElement("div");F.style.cssText="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-top:1.5rem",F.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 style="font-size:1rem;font-weight:700;margin:0">✅ Tareas pendientes hoy</h3>
        <span style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${P.filter(E=>!E.completada).length} pendientes</span>
      </div>
      ${P.length===0?'<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:1rem">Sin tareas pendientes</p>':P.map(E=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5">
            <input type="checkbox" ${E.completada?"checked":""}
                   onchange="completarTareaDashboard('${E.id}', this.checked)"
                   style="width:16px;height:16px;cursor:pointer;accent-color:#25D366">
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600;margin:0;${E.completada?"text-decoration:line-through;color:#aaa":""}">${E.titulo}</p>
              <p style="font-size:0.72rem;color:#888;margin:0">${E.nombre_contacto||E.telefono} · ${E.agente||"Sin asignar"}</p>
            </div>
            <button onclick="navegarA('conversaciones');setTimeout(()=>abrirChat('${E.telefono}'),800)"
                    style="background:#e3f2fd;border:none;border-radius:6px;padding:4px 8px;font-size:0.72rem;color:#1565c0;cursor:pointer">Ver chat</button>
          </div>
        `).join("")}
    `,document.getElementById("dashboard-contenido").appendChild(F)}catch(k){console.error("tareas:",k)}}catch(e){console.error("Error dashboard:",e)}}window.eliminarItemPedido=e=>{window._pedidoItems.splice(e,1),window.recalcularTotal(),window.renderItemsPedido()};window.cerrarSesionPanel=()=>{confirm("Cerrar sesion?")&&(sessionStorage.removeItem("erp_empleado"),sessionStorage.removeItem("erp_token"),window._empleadoActual=null,location.reload())};async function He(){const e=document.getElementById("content");try{const t=await fetch(f+"/empleados/",{headers:window.authHeaders()}),o=await t.json();if(!t.ok||!Array.isArray(o)){e.innerHTML=`<div style="padding:2rem;background:#fff3cd;border-radius:12px;color:#856404">
        <strong>⚠️ ${o.detail||o.error||"Error al cargar empleados"}</strong><br>
        <span style="font-size:0.82rem">HTTP ${t.status} — intenta recargar la página o vuelve a iniciar sesión.</span>
      </div>`;return}e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Empleados (${o.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormEmpleado('')">+ Nuevo empleado</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${o.map(a=>`
              <tr>
                <td><strong>${a.nombre}</strong></td>
                <td>${a.email}</td>
                <td><span class="badge ${a.rol==="admin"?"badge-info":"badge-success"}">${a.rol}</span></td>
                <td><span class="badge ${a.activo?"badge-success":"badge-danger"}">${a.activo?"Activo":"Inactivo"}</span></td>
                <td style="display:flex;gap:4px">
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormEmpleado('${a.id}')">Editar</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="toggleEmpleado('${a.id}',${a.activo})">${a.activo?"Desactivar":"Activar"}</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#E91E8C;border-color:#E91E8C" onclick="resetearPassword('${a.id}','${a.nombre}')">🔑 Reset</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.mostrarFormEmpleado=async e=>{const t=document.getElementById("content");let o={};if(e)try{o=(await(await fetch(f+"/empleados/",{headers:window.authHeaders()})).json()).find(i=>i.id===e)||{}}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:500px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">← Volver</button>
        <h3>${e?"Editar empleado":"Nuevo empleado"}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div><label class="form-label">Nombre *</label><input class="form-input" id="emp-nombre" placeholder="Nombre completo" value="${o.nombre||""}"></div>
        <div><label class="form-label">Email *</label><input class="form-input" id="emp-email" type="email" placeholder="correo@ejemplo.com" value="${o.email||""}"></div>
        <div><label class="form-label">${e?"Nueva contrasena (dejar vacio para no cambiar)":"Contrasena *"}</label><input class="form-input" id="emp-password" type="password" placeholder="••••••••"></div>
        <div><label class="form-label">Rol</label>
          <select class="form-input" id="emp-rol">
            <option value="vendedor" ${o.rol==="vendedor"?"selected":""}>Vendedor</option>
            <option value="admin" ${o.rol==="admin"?"selected":""}>Administrador</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarEmpleado('${e||""}')">Guardar</button>
      </div>
    </div>`};window.guardarEmpleado=async e=>{const t=document.getElementById("emp-nombre").value,o=document.getElementById("emp-email").value,a=document.getElementById("emp-password").value,n=document.getElementById("emp-rol").value;if(!t||!o){alert("Nombre y email son obligatorios");return}if(!e&&!a){alert("La contrasena es obligatoria para nuevos empleados");return}try{const i=e?"PATCH":"POST",r=e?f+"/empleados/"+e:f+"/empleados/",s={nombre:t,email:o,rol:n};a&&(s.password=a);const d=await fetch(r,{method:i,headers:window.authHeaders(),body:JSON.stringify(s)});if(d.ok)alert("Empleado guardado correctamente"),navegarA("empleados");else{const l=await d.json();alert("Error: "+(l.error||"No se pudo guardar"))}}catch{alert("Error conectando con el servidor")}};window.toggleEmpleado=async(e,t)=>{if(confirm(t?"Desactivar este empleado?":"Activar este empleado?"))try{(await fetch(f+"/empleados/"+e,{method:"PATCH",headers:window.authHeaders(),body:JSON.stringify({activo:!t})})).ok?He():alert("Error al cambiar estado")}catch{alert("Error conectando con el servidor")}};window.resetearPassword=async(e,t)=>{const o=prompt("Nueva contrasena para "+t+":");if(o){if(o.length<4){alert("La contrasena debe tener al menos 4 caracteres");return}try{const a=await fetch(f+"/empleados/"+e,{method:"PATCH",headers:window.authHeaders(),body:JSON.stringify({password:o})});if(a.ok)alert("Contrasena actualizada correctamente");else{const n=await a.json();alert("Error: "+(n.error||"No se pudo actualizar"))}}catch{alert("Error conectando con el servidor")}}};window.cargarConversaciones=async function(){var o;document.title="Zapatillas May";const e=document.querySelector('[data-modulo="conversaciones"]');e&&((o=e.querySelector(".nav-badge"))==null||o.remove());const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const a=await fetch(f+"/chatbot/chats").then(d=>d.json()).catch(()=>[]),n=Array.isArray(a)?a:[],i=await fetch(f+"/productos/?select=id,nombre,imagen_principal,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,corrida_activa,activo").then(d=>d.json()).catch(()=>[]),r=Array.isArray(i)?i:[];window._chatsData={},n.forEach(d=>window._chatsData[d.telefono]=d),window._productosWA=r.filter(d=>d.activo);const s=n.reduce((d,l)=>d+(l.no_leidos||0),0);if(t.innerHTML=`
  <div id="wa-tab-content">
    <div id="wa-container">
      <div id="wa-sidebar">
        <div class="wa-sidebar-header">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div>
              <p style="font-size:0.6rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 2px">WhatsApp Cloud API</p>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-weight:800;color:white;font-size:1rem;letter-spacing:-0.01em">Conversaciones</span>
                ${s>0?`<span class="wa-new-badge">${s}</span>`:""}
              </div>
            </div>
            <div style="display:flex;gap:4px">
              <button id="tab-chats" onclick="mostrarTabWA('chats')" style="padding:5px 10px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid #E91E8C;background:#E91E8C;color:white;font-family:inherit">Chat</button>
              <button id="tab-config" onclick="mostrarTabWA('config')" style="padding:5px 10px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.55);font-family:inherit">Config</button>
            </div>
          </div>
          <input class="wa-search-input" placeholder="Buscar contacto..." oninput="filtrarChats(this.value)">
          <div class="wa-estado-tabs">
            <button class="wa-estado-tab activa" onclick="filtrarEstado('',this)">Todos</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('abierto',this)"><span class="wa-estado-dot abierto"></span>Abierto</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('espera',this)"><span class="wa-estado-dot espera"></span>Espera</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('cerrado',this)"><span class="wa-estado-dot cerrado"></span>Cerrado</button>
          </div>
          <div class="wa-filters">
            <button onclick="filtrarEtiqueta('')" class="wa-pill activa">Todos</button>
            <button onclick="filtrarEtiqueta('solo_pregunta')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block;flex-shrink:0"></span> Pregunta</button>
            <button onclick="filtrarEtiqueta('posible_comprador')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;flex-shrink:0"></span> Posible</button>
            <button onclick="filtrarEtiqueta('comprador')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;flex-shrink:0"></span> Comprador</button>
            <button onclick="filtrarEtiqueta('seguimiento')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#ef4444;display:inline-block;flex-shrink:0"></span> Seguim.</button>
            <button onclick="filtrarEtiqueta('frecuente')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#E91E8C;display:inline-block;flex-shrink:0"></span> Frecuente</button>
          </div>
        </div>
        <div class="wa-chat-list">
          ${window._htmlChatItems(n)}
        </div>
      </div>

      <div id="chat-area">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:10px">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(233,30,140,0.08);border:1.5px solid rgba(233,30,140,0.15);display:flex;align-items:center;justify-content:center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p style="font-weight:700;color:#0f172a;font-size:0.95rem;margin:0">Selecciona una conversación</p>
          <p style="font-size:0.78rem;color:#94a3b8;margin:0">para ver los mensajes</p>
        </div>
      </div>
    </div>
  </div>
    `,window.innerWidth<=900){const d=document.getElementById("chat-area");d&&(d.style.display="none")}}catch(a){t.innerHTML='<p style="padding:2rem;color:red">Error: '+a.message+"</p>"}};window.mostrarTabWA=async e=>{const t=document.getElementById("tab-chats"),o=document.getElementById("tab-config");if(t){const a=e==="chats";t.style.background=a?"#E91E8C":"transparent",t.style.color=a?"white":"rgba(255,255,255,0.55)",t.style.borderColor=a?"#E91E8C":"rgba(255,255,255,0.15)"}if(o){const a=e==="config";o.style.background=a?"#E91E8C":"transparent",o.style.color=a?"white":"rgba(255,255,255,0.55)",o.style.borderColor=a?"#E91E8C":"rgba(255,255,255,0.15)"}e==="chats"?await window.cargarConversaciones():await mostrarConfigWA()};window.filtrarEtiqueta=e=>{document.querySelectorAll(".wa-pill").forEach(t=>t.classList.remove("activa")),event.target.classList.add("activa"),document.querySelectorAll(".wa-chat-item").forEach(t=>{const o=t.dataset.etiqueta||"";t.style.display=!e||o===e?"":"none"})};window.filtrarEstado=(e,t)=>{document.querySelectorAll(".wa-estado-tab").forEach(o=>o.classList.remove("activa")),t&&t.classList.add("activa"),document.querySelectorAll(".wa-chat-item").forEach(o=>{const a=o.dataset.estado||"abierto";o.style.display=!e||a===e?"":"none"})};window.cambiarEstadoChat=async(e,t)=>{try{await fetch(f+"/chatbot/chats/"+e+"/estado",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({estado:t})}),await window._recargarChats(),abrirChat(e)}catch(o){alert("Error: "+o.message)}};window.mostrarConfigWA=async()=>{const e=document.getElementById("content");try{const[t,o]=await Promise.all([fetch(f+"/chatbot/config").then(n=>n.json()),fetch(f+"/chatbot/respuestas-rapidas").then(n=>n.json())]),a=document.getElementById("wa-tab-content")||e;a.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:1000px">

        <!-- CONFIG GENERAL -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <h3 style="font-weight:700;margin-bottom:1.5rem;font-size:1rem">⚙️ Configuración general</h3>

          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Mensaje de bienvenida</label>
            <textarea id="cfg-bienvenida" rows="3" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none">${t.mensaje_bienvenida||""}</textarea>
          </div>

          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Mensaje fuera de horario</label>
            <textarea id="cfg-fuera" rows="3" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none">${t.fuera_horario||""}</textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            <div>
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Horario inicio</label>
              <input type="time" id="cfg-inicio" value="${t.horario_inicio||"09:00"}" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-size:0.85rem">
            </div>
            <div>
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Horario fin</label>
              <input type="time" id="cfg-fin" value="${t.horario_fin||"18:00"}" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-size:0.85rem">
            </div>
          </div>

          <div style="margin-bottom:1.5rem;display:flex;align-items:center;gap:10px">
            <label style="font-size:0.85rem;font-weight:600">Bot activo</label>
            <input type="checkbox" id="cfg-bot" ${t.bot_activo==="true"?"checked":""} style="width:18px;height:18px;cursor:pointer">
          </div>

          <button onclick="guardarConfigWA()" style="width:100%;background:#e91e8c;color:white;border:none;border-radius:8px;padding:10px;font-weight:600;cursor:pointer">
            Guardar configuración
          </button>
        </div>

        <!-- RESPUESTAS RÁPIDAS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <h3 style="font-weight:700;font-size:1rem">⚡ Respuestas rápidas</h3>
            <button onclick="nuevaRespuestaRapida()" style="background:#e91e8c;color:white;border:none;border-radius:8px;padding:6px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">+ Nueva</button>
          </div>
          <div id="respuestas-lista">
            ${o.map(n=>`
              <div style="border:1px solid #eee;border-radius:8px;padding:12px;margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <p style="font-weight:600;font-size:0.85rem">⚡ ${n.titulo}</p>
                  <div style="display:flex;gap:6px">
                    <button onclick="editarRespuesta('${n.id}','${n.titulo.replace(/'/g,"\\'")}','${n.mensaje.replace(/'/g,"\\'").replace(/\n/g,"\\n")}')" 
                            style="background:#f5f5f5;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer">✏️</button>
                    <button onclick="eliminarRespuesta('${n.id}')" 
                            style="background:#fce4ec;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer;color:#c62828">🗑️</button>
                  </div>
                </div>
                <p style="font-size:0.78rem;color:#888;line-height:1.5">${n.mensaje.substring(0,80)}${n.mensaje.length>80?"...":""}</p>
              </div>
            `).join("")}
          </div>
        </div>

      </div>

      <!-- PLANTILLAS DE UTILIDAD -->
      <div style="margin-top:1.5rem;max-width:1000px">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <div>
              <p style="font-size:0.6rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 2px">WhatsApp Cloud API</p>
              <h3 style="font-weight:700;font-size:1rem;margin:0">Plantillas de mensaje</h3>
            </div>
            <div style="display:flex;gap:8px">
              <button onclick="cargarPlantillas()" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;border-radius:8px;padding:7px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">↺ Actualizar</button>
              <button onclick="crearPlantillasPredefinidas()" style="background:#E91E8C;color:white;border:none;border-radius:8px;padding:7px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">+ Crear plantillas</button>
            </div>
          </div>
          <p style="font-size:0.78rem;color:#94a3b8;margin:0 0 1.5rem">Las plantillas UTILITY se envían automaticamente al confirmar pedidos y envíos. La de MARKETING para carritos abandonados. Meta las aprueba en 1–24 h.</p>
          <div id="plantillas-lista">
            <p style="font-size:0.8rem;color:#94a3b8;text-align:center;padding:20px">Cargando plantillas...</p>
          </div>
        </div>

        <!-- ── Broadcast / Campaña masiva ── -->
        <div style="background:#fff;border-radius:12px;border:1px solid #f1f5f9;padding:20px;margin-top:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div>
              <p style="margin:0;font-weight:700;color:#0f172a;font-size:0.95rem">📢 Campaña masiva</p>
              <p style="margin:2px 0 0;font-size:0.75rem;color:#94a3b8">Envía una plantilla aprobada a todos tus contactos de WhatsApp</p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Plantilla</label>
              <select id="broadcast-template" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;font-family:inherit">
                <option value="">Cargando plantillas...</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Parámetro 1 (si la plantilla lo requiere)</label>
              <input id="broadcast-param1" placeholder="ej: nombre del cliente (se usará igual para todos)" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;box-sizing:border-box;font-family:inherit">
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Destinatarios</label>
              <select id="broadcast-dest" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;font-family:inherit">
                <option value="todos">Todos los contactos de WhatsApp</option>
                <option value="compradores">Solo compradores</option>
                <option value="posibles">Posibles compradores</option>
              </select>
            </div>
            <button onclick="ejecutarBroadcast()" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit">
              Enviar campaña →
            </button>
            <div id="broadcast-resultado" style="font-size:0.8rem;color:#64748b;text-align:center"></div>
          </div>
        </div>
      </div>
    `,cargarPlantillas(),fetch(f+"/chatbot/templates").then(n=>n.json()).then(n=>{const i=document.getElementById("broadcast-template");if(!i)return;const r=(n.data||[]).filter(s=>s.status==="APPROVED");i.innerHTML=r.length?r.map(s=>`<option value="${s.name}">${s.name}</option>`).join(""):'<option value="">Sin plantillas aprobadas</option>'}).catch(()=>{})}catch(t){console.error(t)}};window.ejecutarBroadcast=async()=>{var s,d,l;const e=(s=document.getElementById("broadcast-template"))==null?void 0:s.value,t=((d=document.getElementById("broadcast-param1"))==null?void 0:d.value.trim())||"",o=((l=document.getElementById("broadcast-dest"))==null?void 0:l.value)||"todos",a=document.getElementById("broadcast-resultado");if(!e){alert("Selecciona una plantilla");return}const n=Object.values(window._chatsData||{});let i=[];if(o==="todos"?i=n.map(c=>c.telefono):o==="compradores"?i=n.filter(c=>c.etiqueta==="comprador"||c.etiqueta==="frecuente").map(c=>c.telefono):o==="posibles"&&(i=n.filter(c=>c.etiqueta==="posible_comprador").map(c=>c.telefono)),!i.length){alert("No hay contactos en ese grupo");return}const r=`¿Enviar "${e}" a ${i.length} contacto${i.length!==1?"s":""}?`;if(confirm(r)){a&&(a.textContent="Enviando...");try{const c=t?[t]:[],m=await(await fetch(f+"/chatbot/broadcast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({template:e,params:c,telefonos:i})})).json();a&&(a.textContent=`✓ Enviados: ${m.enviados}/${m.total} — Errores: ${m.errores}`)}catch(c){a&&(a.textContent="Error: "+c.message)}}};window.cargarPlantillas=async()=>{const e=document.getElementById("plantillas-lista");if(e)try{const a=(await(await fetch(f+"/chatbot/templates")).json()).templates||[];if(!a.length){e.innerHTML='<p style="font-size:0.82rem;color:#94a3b8;text-align:center;padding:16px">Sin plantillas aún. Crea las predefinidas o agrega una desde Meta Business Manager.</p>';return}const n={APPROVED:"#059669",PENDING:"#f59e0b",REJECTED:"#ef4444",PAUSED:"#94a3b8"},i={APPROVED:"Aprobada",PENDING:"Pendiente",REJECTED:"Rechazada",PAUSED:"Pausada"};e.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${a.map(r=>{const s=(r.components||[]).find(c=>c.type==="BODY"),d=n[r.status]||"#94a3b8",l=i[r.status]||r.status;return`
            <div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px;position:relative">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <code style="font-size:0.74rem;background:#f1f5f9;padding:3px 8px;border-radius:4px;color:#1e293b">${r.name}</code>
                <span style="font-size:0.67rem;font-weight:700;color:${d};background:${d}18;padding:2px 8px;border-radius:100px">${l}</span>
              </div>
              <div style="display:flex;gap:6px;margin-bottom:8px">
                <span style="font-size:0.65rem;background:#f1f5f9;padding:2px 7px;border-radius:4px;color:#64748b">${r.category}</span>
                <span style="font-size:0.65rem;background:#f1f5f9;padding:2px 7px;border-radius:4px;color:#64748b">${r.language}</span>
              </div>
              ${s?`<p style="font-size:0.78rem;color:#475569;line-height:1.5;margin:0">${(s.text||"").substring(0,100)}${(s.text||"").length>100?"...":""}</p>`:""}
            </div>`}).join("")}
      </div>`}catch(t){e.innerHTML=`<p style="color:#ef4444;font-size:0.82rem;padding:12px">Error cargando plantillas: ${t.message}</p>`}};window.crearPlantillasPredefinidas=async()=>{const e=event.target;e.textContent="Creando...",e.disabled=!0;try{const a=((await(await fetch(f+"/chatbot/templates/crear-predefinidas",{method:"POST"})).json()).resultados||[]).map(n=>{var i,r;return`${n.ok?"✓":"✗"} ${n.nombre}${n.error?": "+((r=(i=JSON.parse(n.error||"{}"))==null?void 0:i.error)==null?void 0:r.message)||n.error:""}`}).join(`
`);alert(`Resultado:
`+a),cargarPlantillas()}catch(t){alert("Error: "+t.message)}finally{e.textContent="+ Crear plantillas",e.disabled=!1}};window.guardarConfigWA=async()=>{try{await fetch(f+"/chatbot/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje_bienvenida:document.getElementById("cfg-bienvenida").value,fuera_horario:document.getElementById("cfg-fuera").value,horario_inicio:document.getElementById("cfg-inicio").value,horario_fin:document.getElementById("cfg-fin").value,bot_activo:document.getElementById("cfg-bot").checked?"true":"false"})}),alert("Configuración guardada")}catch{alert("Error guardando")}};window.nuevaRespuestaRapida=()=>{const e=prompt("Título de la respuesta rápida:");if(!e)return;const t=prompt("Mensaje:");t&&fetch(f+"/chatbot/respuestas-rapidas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,mensaje:t,orden:99})}).then(()=>mostrarConfigWA())};window.editarRespuesta=(e,t,o)=>{const a=prompt("Título:",t);if(!a)return;const n=prompt("Mensaje:",o.replace(/\\n/g,`
`));n&&fetch(f+"/chatbot/respuestas-rapidas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:a,mensaje:n})}).then(()=>mostrarConfigWA())};window.eliminarRespuesta=e=>{confirm("¿Eliminar esta respuesta rápida?")&&fetch(f+"/chatbot/respuestas-rapidas/"+e,{method:"DELETE"}).then(()=>mostrarConfigWA())};window.filtrarChats=e=>{document.querySelectorAll(".wa-chat-item").forEach(t=>{const o=t.dataset.nombre||"",a=t.dataset.tel||"";t.style.display=!e||o.includes(e.toLowerCase())||a.includes(e)?"":"none"})};window.renderMensaje=(e,t,o)=>{if(e.tipo==="imagen_saliente"){const a=e.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`),n=a[0].trim(),i=a.slice(1).join(`
`).trim();if(n.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i))return'<img src="'+n+'" style="max-width:200px;border-radius:8px;display:block">'+(i?'<p style="font-size:0.82rem;color:#333;white-space:pre-wrap;margin-top:6px">'+i+"</p>":"")}return'<p style="font-size:0.85rem;color:#333;white-space:pre-wrap">'+e.mensaje.replace(/\[.+?\]:\s*/,"")+"</p>"};window._recargarChats=async()=>{try{const e=await fetch(f+"/chatbot/chats").then(o=>o.json()),t=Array.isArray(e)?e:[];return window._chatsData={},t.forEach(o=>window._chatsData[o.telefono]=o),t}catch{return[]}};window._htmlChatItems=e=>!e||e.length===0?'<div style="padding:2rem;text-align:center;color:#999;font-size:0.85rem">Sin conversaciones</div>':[...e].sort((t,o)=>new Date(o.ultimo_mensaje)-new Date(t.ultimo_mensaje)).map(t=>`
              <div class="wa-chat-item" data-tel="${t.telefono}" data-nombre="${(t.nombre||"").toLowerCase()}" data-etiqueta="${t.etiqueta||""}" data-estado="${t.estado||"abierto"}"
                   onclick="abrirChat('${t.telefono}')">
                <div class="wa-avatar">
                  ${(t.nombre||t.telefono).charAt(0).toUpperCase()}
                  ${t.en_control?'<div class="wa-control-dot"></div>':""}
                </div>
                <div class="wa-chat-info">
                  <div class="wa-chat-name">${t.nombre||t.telefono}
                    ${t.estado&&t.estado!=="abierto"?`<span class="wa-estado-badge ${t.estado}">${t.estado==="espera"?"En espera":"Cerrado"}</span>`:""}
                  </div>
                  <div class="wa-chat-preview">${(()=>{const o=t.mensajes&&t.mensajes[0]&&t.mensajes[0].mensaje||"";return o.startsWith("[Imagen]")?"📷 Imagen":o.substring(0,40)+"…"})()}</div>
                </div>
                <div class="wa-chat-meta">
                  <span class="wa-chat-time">${new Date(t.ultimo_mensaje).toLocaleDateString("es-MX",{day:"numeric",month:"short"})}</span>
                  ${t.no_leidos>0?`<span class="wa-unread">${t.no_leidos}</span>`:""}
                </div>
              </div>
            `).join("");window._refrescarListaChats=e=>{const t=document.querySelector(".wa-chat-list");if(!t)return;const o=e.map(r=>r.telefono+":"+r.ultimo_mensaje+":"+(r.no_leidos||0)).join("|");if(o===window._firmaListaChats)return;window._firmaListaChats=o,t.innerHTML=window._htmlChatItems(e);const a=document.querySelector(".wa-search-input");a&&a.value&&filtrarChats(a.value);const n=document.querySelector(".wa-pill.activa"),i=document.querySelector(".wa-estado-tab.activa");if(document.querySelectorAll(".wa-chat-item").forEach(r=>{let s=!0;if(n){const d=(n.getAttribute("onclick")||"").match(/filtrarEtiqueta\('([^']*)'\)/);d&&d[1]&&(r.dataset.etiqueta||"")!==d[1]&&(s=!1)}if(s&&i){const d=(i.getAttribute("onclick")||"").match(/filtrarEstado\('([^']*)'/);d&&d[1]&&(r.dataset.estado||"abierto")!==d[1]&&(s=!1)}s||(r.style.display="none")}),window._chatActivo){const r=t.querySelector(`.wa-chat-item[data-tel="${window._chatActivo}"]`);r&&r.classList.add("activa")}};window._renderBurbujas=e=>{const t=n=>{if(!n)return null;const i=/[zZ]$|[+-]\d{2}:?\d{2}$/.test(n);return new Date(i?n:n.replace(" ","T")+"Z")},o=[...e.mensajes].reverse(),a=o.reduce((n,i,r)=>i.tipo==="manual"||i.tipo==="imagen_saliente"||i.tipo==="documento_saliente"||i.tipo==="video_saliente"||i.tipo==="ubicacion_saliente"||i.tipo==="contacto_saliente"||i.tipo==="botones_saliente"||i.tipo==="lista_saliente"||i.tipo==="carrusel_saliente"||i.tipo==="template_saliente"?r:n,-1);return o.map((n,i)=>{var b,v;const r=n.tipo==="manual"||n.tipo==="imagen_saliente"||n.tipo==="documento_saliente"||n.tipo==="video_saliente"||n.tipo==="ubicacion_saliente"||n.tipo==="contacto_saliente"||n.tipo==="botones_saliente"||n.tipo==="lista_saliente"||n.tipo==="carrusel_saliente"||n.tipo==="template_saliente",s=r?((b=n.mensaje.match(/\[(.+?)\]:/))==null?void 0:b[1])||"Admin":e.nombre||e.telefono,d=new Date(n.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}),l=n.mensaje?n.mensaje.replace(/\[.+?\]:\s*/,""):"";let c="";if(n.tipo==="imagen_saliente"){const y=n.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`)[0].trim();c=y.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)?`<img src="${y}" style="max-width:200px;border-radius:8px;display:block;cursor:pointer" onclick="window.open('${y}')">`:`<p>${l}</p>`}else if(n.tipo==="documento_saliente"){const y=l.replace("[Documento] ","").split(" "),h=y[0]||"documento";c=`<a href="${y[1]||""}" target="_blank" class="wa-doc-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${h}</a>`}else if(n.tipo==="video_saliente")c=`<video src="${l.replace("[Video] ","")}" controls style="max-width:220px;border-radius:8px;display:block"></video>`;else if(n.tipo==="botones_saliente"){const y=l.replace("[Botones] ","").split(" -> "),h=y[0]||l,w=(y[1]||"").split(" | ");c=`<p style="margin:0 0 8px">${h}</p>
        <div style="display:flex;flex-direction:column;gap:4px">${w.map(_=>`<span style="border:1px solid rgba(8,145,178,0.3);border-radius:6px;padding:4px 10px;font-size:0.78rem;color:#0891b2;text-align:center">${_}</span>`).join("")}</div>`}else if(n.tipo==="lista_saliente"){const y=l.replace("[Lista] ","").split(" -> "),h=y[0]||l,w=(y[1]||"").split(", ").slice(0,5);c=`<p style="margin:0 0 6px">${h}</p>
        <div style="border:1px solid rgba(8,145,178,0.25);border-radius:6px;padding:6px 8px;font-size:0.75rem;color:#0891b2">
          ${w.map(_=>`<div>• ${_}</div>`).join("")}
          ${w.length<(y[1]||"").split(", ").length?'<div style="color:#94a3b8">…</div>':""}
        </div>`}else if(n.tipo==="carrusel_saliente")c=`<p style="margin:0;font-size:0.85rem">${l.replace("[Carrusel] ","")}</p>
        <p style="margin:4px 0 0;font-size:0.72rem;color:#94a3b8">🎠 Carrusel de productos</p>`;else if(n.tipo==="template_saliente")c=`<p style="margin:0;font-size:0.85rem">${l.replace("[Template] ","")}</p>
        <p style="margin:4px 0 0;font-size:0.72rem;color:#94a3b8">📋 Plantilla enviada</p>`;else if(n.tipo==="button_reply")c=`<p style="margin:0;color:#0891b2;font-size:0.85rem">👆 ${l.replace("[Botón] ","")}</p>`;else if(n.tipo==="list_reply")c=`<p style="margin:0;color:#0891b2;font-size:0.85rem">☰ ${l.replace("[Lista] ","")}</p>`;else if(n.tipo==="ubicacion_saliente"){const y=((v=l.match(/https:\/\/maps\.google\.com\/\?q=[\d.,]+/))==null?void 0:v[0])||"",h=l.replace("[Ubicación] ","").replace(/ https:.*/,"");c=`<a href="${y}" target="_blank" class="wa-doc-link" style="color:#0891b2;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${h||"Ubicación"}</a>`}else if(n.tipo==="contacto_saliente")c=`<span class="wa-doc-link" style="color:#0f172a">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${l.replace("[Contacto] ","")}</span>`;else if(n.tipo==="imagen"){const y=(n.mensaje||"").match(/https?:\/\/\S+/),h=n.media_url||(y?y[0]:null),w=(n.mensaje||"").replace("[Imagen]","").replace(/https?:\/\/\S+/,"").replace(/^[:\s]+/,"").trim();h?c=`<div>
          <a href="${h}" target="_blank" rel="noopener">
            <img src="${h}" alt="Imagen del cliente" style="max-width:220px;max-height:220px;border-radius:8px;display:block;cursor:pointer">
          </a>
          ${w?`<p style="margin:4px 0 0;font-size:0.82rem;color:#475569">${w}</p>`:""}
        </div>`:c='<p style="color:#64748b;font-size:0.8rem">📷 Imagen recibida</p>'}else c=`<p>${l}</p>`;let p="";if(r){const y=t(e.cliente_leyo_at),h=t(e.cliente_entrego_at),w=t(n.created_at);y&&w<=y?p='<span class="wa-read-receipt read" title="Visto">✓✓</span>':h&&w<=h?p='<span class="wa-read-receipt delivered" title="Entregado">✓✓</span>':i===a&&(p='<span class="wa-read-receipt sent" title="Enviado">✓</span>')}const m=`<button class="wa-reply-btn" onclick="iniciarReply('${e.telefono}','${(n.wa_message_id||"").replace(/'/g,"")}')" title="Responder">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
    </button>`,g=n.mensaje?`
      <div class="wa-msg-row ${r?"saliente":"entrante"}" data-idx="${i}">
        ${r?"":m}
        <div class="wa-msg-row-inner">
          <span class="wa-msg-sender">${s}</span>
          <div class="wa-bubble ${r?"saliente":"entrante"}">${c}<div class="wa-bubble-time">${d}${p}</div></div>
        </div>
        ${r?m:""}
      </div>`:"",u=n.respuesta?`
      <div class="wa-msg-row saliente">
        ${m}
        <div class="wa-msg-row-inner">
          <span class="wa-msg-sender" style="color:#7c3aed">Bot · Maya</span>
          <div class="wa-bubble bot">
            <p>${n.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi,"")}</p>
            ${(n.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)||[]).map(y=>`<img src="${y}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${y}')">`).join("")}
            <div class="wa-bubble-time">${d}</div>
          </div>
        </div>
      </div>`:"";return g+u}).join("")};window.abrirChat=async e=>{const t=window._chatsData[e];if(!t)return;document.querySelectorAll(".wa-chat-item").forEach(i=>i.classList.remove("activo"));const o=document.querySelector(`[data-tel="${e}"]`);o&&o.classList.add("activo");const a=window.innerWidth<=900;if(a){const i=document.getElementById("wa-sidebar"),r=document.getElementById("wa-container");i&&(i.style.display="none"),r&&(r.style.gridTemplateColumns="1fr")}const n=document.getElementById("chat-area");n.style.display="flex",n.style.flexDirection="column",n.style.flex="1",n.style.minHeight="0",n.innerHTML=`
    <!-- Header compacto -->
    <div class="wa-chat-header">
      ${a?'<button onclick="volverChats()" class="wa-circ-btn">←</button>':""}
      <div class="wa-avatar-sm">${(t.nombre||t.telefono).charAt(0).toUpperCase()}</div>
      <div class="wa-header-info">
        <div class="wa-header-name">${t.nombre||t.telefono}</div>
        <div class="wa-header-sub">${t.telefono} · ${t.mensajes.length} msg</div>
      </div>
      <div class="wa-header-actions">
        ${t.en_control?`<button onclick="toggleControl('${e}', false)" class="wa-btn wa-btn-on" title="Activar bot automático">Bot</button>`:`<button onclick="toggleControl('${e}', true)" class="wa-btn wa-btn-off" title="Tomar control manual">Manual</button>`}
        <button onclick="mostrarCatalogoWA('${e}')" class="wa-btn wa-btn-prod" title="Enviar producto">Catálogo</button>
        <button onclick="mostrarRespuestasRapidas('${e}')" class="wa-btn wa-btn-quick" title="Respuestas rápidas">Rápidas</button>
        <button onclick="marcarNoLeido('${e}')" class="wa-btn" style="background:rgba(245,127,23,0.08);color:#f57f17;border-color:rgba(245,127,23,0.25)" title="Marcar pendiente de revisión">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>
        <button onclick="window.cargarConversaciones()" class="wa-btn wa-btn-reload" title="Recargar">↺</button>
      </div>
    </div>

    <!-- Sub-header: estado + etiqueta -->
    <div class="wa-subheader">
      <span class="wa-bot-badge ${t.en_control?"manual":"auto"}">
        ${t.en_control?"Control manual":"Bot activo"}
      </span>
      <select onchange="cambiarEtiqueta('${e}', this.value)" class="wa-label-select-sm">
        <option value="sin_etiqueta" ${!t.etiqueta||t.etiqueta==="sin_etiqueta"?"selected":""}>Sin etiqueta</option>
        <option value="solo_pregunta" ${t.etiqueta==="solo_pregunta"?"selected":""}>Pregunta</option>
        <option value="posible_comprador" ${t.etiqueta==="posible_comprador"?"selected":""}>Posible comprador</option>
        <option value="comprador" ${t.etiqueta==="comprador"?"selected":""}>Comprador</option>
        <option value="seguimiento" ${t.etiqueta==="seguimiento"?"selected":""}>Seguimiento</option>
        <option value="frecuente" ${t.etiqueta==="frecuente"?"selected":""}>Frecuente</option>
      </select>
      <select onchange="cambiarEstadoChat('${e}', this.value)" class="wa-label-select-sm" style="border-color:${(t.estado||"abierto")==="espera"?"#f59e0b":t.estado==="cerrado"?"#64748b":"#10b981"}">
        <option value="abierto" ${!t.estado||t.estado==="abierto"?"selected":""}>🟢 Abierto</option>
        <option value="espera" ${t.estado==="espera"?"selected":""}>🟡 En espera</option>
        <option value="cerrado" ${t.estado==="cerrado"?"selected":""}>⚫ Cerrado</option>
      </select>
    </div>

    <!-- Mensajes -->
    <div id="mensajes-area">
      ${window._renderBurbujas(t)}
    </div>

    <!-- Input -->
    <div class="wa-input-bar">
      <div class="wa-input-toolbar">
        <button class="wa-tool-btn" title="Adjuntar imagen" onclick="document.getElementById('img-file-${e}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <input type="file" id="img-file-${e}" accept="image/*" style="display:none" onchange="subirImagenWA('${e}',this)">
        <button class="wa-tool-btn" title="Adjuntar documento o PDF" onclick="document.getElementById('doc-file-${e}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
        </button>
        <input type="file" id="doc-file-${e}" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" style="display:none" onchange="subirDocumentoWA('${e}',this)">
        <button class="wa-tool-btn" title="Adjuntar video" onclick="document.getElementById('vid-file-${e}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </button>
        <input type="file" id="vid-file-${e}" accept="video/*" style="display:none" onchange="subirVideoWA('${e}',this)">
        <button class="wa-tool-btn" title="Enviar botones interactivos" onclick="mostrarModalBotones('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="4" rx="2"/><rect x="2" y="13" width="20" height="4" rx="2"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar lista interactiva" onclick="mostrarModalLista('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar carrusel de productos" onclick="mostrarModalCarrusel('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="7" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="7" height="16" rx="1"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar ubicación de la tienda" onclick="enviarUbicacionWA('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar tarjeta de contacto" onclick="mostrarEnviarContactoWA('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="wa-tool-btn" title="Respuestas rápidas" onclick="mostrarRespuestasRapidas('${e}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </button>
        <div style="flex:1"></div>
        <span id="reply-context-${e}" class="wa-reply-context" style="display:none"></span>
        <span id="char-count-${e}" class="wa-char-count"></span>
      </div>
      <div class="wa-input-row">
        <textarea id="msg-input-${e}" class="wa-textarea" placeholder="Escribe un mensaje..." rows="2"
                  oninput="const c=document.getElementById('char-count-${e}');if(c){c.textContent=this.value.length>0?this.value.length+'/1024':''}"
                  onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();enviarMensajeWA('${e}')}"></textarea>
        <button onclick="enviarMensajeWA('${e}')" class="wa-send-btn" title="Enviar (Enter)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>

    <!-- Toggle notas/tareas -->
    <button class="wa-nt-toggle" onclick="toggleNotasTareas()">
      <span style="display:flex;align-items:center;gap:6px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Notas y tareas
      </span>
      <span id="wa-nt-arrow" style="font-size:0.7rem">${a?"▲":"▼"}</span>
    </button>
    <div id="notas-tareas-panel" class="${a?"nt-collapsed":""}">
      <div class="wa-nt-grid">
        <div>
          <div class="wa-nt-header">
            <p class="wa-nt-title">📝 Notas</p>
            <button onclick="agregarNota('${e}')" class="wa-nt-add">+ Agregar</button>
          </div>
          <div id="notas-lista-${e}" class="wa-nt-list">
            <p style="font-size:0.75rem;color:var(--text-3);text-align:center;padding:8px">Cargando...</p>
          </div>
        </div>
        <div>
          <div class="wa-nt-header">
            <p class="wa-nt-title">✅ Tareas</p>
            <button onclick="agregarTarea('${e}')" class="wa-nt-add">+ Agregar</button>
          </div>
          <div id="tareas-lista-${e}" class="wa-nt-list">
            <p style="font-size:0.75rem;color:var(--text-3);text-align:center;padding:8px">Cargando...</p>
          </div>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{const i=document.getElementById("mensajes-area");i&&(i.scrollTop=i.scrollHeight)},800),fetch(f+"/chatbot/chats/"+e+"/leido",{method:"PATCH"}),window._chatActivo=e,cargarNotasTareas(e)};window.toggleNotasTareas=()=>{const e=document.getElementById("notas-tareas-panel"),t=document.getElementById("wa-nt-arrow");if(!e)return;const o=e.classList.toggle("nt-collapsed");t&&(t.textContent=o?"▲":"▼")};window.volverChats=()=>{const e=document.getElementById("wa-sidebar"),t=document.getElementById("wa-container");e&&(e.style.display=""),t&&(t.style.gridTemplateColumns=""),document.querySelectorAll(".wa-chat-item").forEach(a=>a.classList.remove("activo"));const o=document.getElementById("chat-area");o&&window.innerWidth<=900&&(o.style.display="none"),o&&(o.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:10px">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(233,30,140,0.08);border:1.5px solid rgba(233,30,140,0.15);display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <p style="font-weight:700;color:#0f172a;font-size:0.95rem;margin:0">Selecciona una conversación</p>
      <p style="font-size:0.78rem;color:#94a3b8;margin:0">para ver los mensajes</p>
    </div>
  `)};window.mostrarRespuestasRapidas=async e=>{const o=await(await fetch(f+"/chatbot/respuestas-rapidas")).json(),a=document.createElement("div");a.id="modal-rapidas",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:1rem",a.innerHTML=`
    <div style="background:white;border-radius:16px 16px 0 0;width:100%;max-width:600px;max-height:60vh;overflow-y:auto;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700">⚡ Respuestas rápidas</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer">✕</button>
      </div>
      ${o.map(n=>`
        <div onclick="usarRespuestaRapida('${e}', \`${n.mensaje.replace(/`/g,"\\`")}\`)"
             style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer"
             onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">⚡ ${n.titulo}</p>
          <p style="font-size:0.78rem;color:#888">${n.mensaje}</p>
        </div>
      `).join("")}
    </div>
  `,document.body.appendChild(a),a.addEventListener("click",n=>{n.target===a&&a.remove()})};window.cargarNotasTareas=async e=>{var r;(r=window._empleadoActual)!=null&&r.nombre;const t=new Date().toISOString().split("T")[0],[o,a]=await Promise.all([fetch(f+"/chatbot/notas/"+e).then(s=>s.json()),fetch(f+"/chatbot/tareas/"+e).then(s=>s.json())]),n=document.getElementById("notas-lista-"+e);n&&(n.innerHTML=o.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin notas</p>':o.map(s=>`
        <div class="wa-nota">
          <p>${s.nota}</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small>${s.agente} · ${new Date(s.created_at).toLocaleDateString("es-MX")}</small>
            <button onclick="eliminarNota('${s.id}','${e}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
          </div>
        </div>
      `).join(""));const i=document.getElementById("tareas-lista-"+e);i&&(i.innerHTML=a.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin tareas</p>':a.map(s=>{const d=s.fecha_vence===t,l=s.fecha_vence&&s.fecha_vence<t&&!s.completada;return`
            <div class="wa-tarea" style="${s.completada?"opacity:0.55":""}">
              <input type="checkbox" ${s.completada?"checked":""}
                     onchange="completarTarea('${s.id}', this.checked, '${e}')"
                     style="width:14px;height:14px;cursor:pointer;accent-color:#25D366;flex-shrink:0">
              <div style="flex:1;min-width:0">
                <p class="wa-tarea-title ${s.completada?"done":""}">${s.titulo}</p>
                ${s.fecha_vence?`<p class="wa-tarea-due" style="color:${l?"#c62828":d?"#f57f17":"var(--text-3)"}">${l?"⚠️ Vencida":d?"🔔 Vence hoy":s.fecha_vence}</p>`:""}
              </div>
              <button onclick="eliminarTarea('${s.id}','${e}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
            </div>
          `}).join(""))};window.agregarNota=async e=>{var a;const t=prompt("Escribe la nota:");if(!t)return;const o=((a=window._empleadoActual)==null?void 0:a.nombre)||"Admin";await fetch(f+"/chatbot/notas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nota:t,agente:o})}),cargarNotasTareas(e)};window.eliminarNota=async(e,t)=>{confirm("¿Eliminar nota?")&&(await fetch(f+"/chatbot/notas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.agregarTarea=async e=>{var n;const t=prompt("Título de la tarea:");if(!t)return;const o=prompt("Fecha límite (YYYY-MM-DD) o déjala vacía:"),a=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";await fetch(f+"/chatbot/tareas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:t,fecha_vence:o||null,agente:a})}),cargarNotasTareas(e)};window.completarTarea=async(e,t,o)=>{await fetch(f+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})}),cargarNotasTareas(o)};window.eliminarTarea=async(e,t)=>{confirm("¿Eliminar tarea?")&&(await fetch(f+"/chatbot/tareas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.usarRespuestaRapida=(e,t)=>{var a;(a=document.getElementById("modal-rapidas"))==null||a.remove();const o=document.getElementById("msg-input-"+e);o&&(o.value=t,o.focus(),enviarMensajeWA(e))};window.enviarMensajeWA=async e=>{var r,s,d;const t=document.getElementById("msg-input-"+e),o=(r=t==null?void 0:t.value)==null?void 0:r.trim();if(!o)return;t.value="";const a=((s=window._empleadoActual)==null?void 0:s.nombre)||"Admin",n=((d=window._replyContext)==null?void 0:d[e])||null;cancelarReply(e);const i=document.getElementById("char-count-"+e);i&&(i.textContent="");try{await fetch(f+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:o,agente:a,reply_to_wa_id:n})}),await window._recargarChats(),abrirChat(e)}catch{alert("Error enviando mensaje")}};window._replyContext={};window.iniciarReply=(e,t)=>{var a;window._replyContext[e]=t;const o=document.getElementById("reply-context-"+e);o&&(o.style.display="inline-flex",o.innerHTML=`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg> Respondiendo &nbsp;<button onclick="cancelarReply('${e}')" style="border:none;background:none;cursor:pointer;color:#94a3b8;padding:0;font-size:0.75rem">✕</button>`),(a=document.getElementById("msg-input-"+e))==null||a.focus()};window.cancelarReply=e=>{delete window._replyContext[e];const t=document.getElementById("reply-context-"+e);t&&(t.style.display="none")};window.marcarNoLeido=async e=>{try{await fetch(f+"/chatbot/chats/"+e+"/no-leido",{method:"PATCH"});const t=document.querySelector(`[data-tel="${e}"]`);if(t&&!t.querySelector(".wa-unread")){const o=document.createElement("span");o.className="wa-unread",o.textContent="!",t.appendChild(o)}}catch{}};window.subirImagenWA=async(e,t)=>{var i;const o=t.files[0];if(!o)return;t.value="";const a=((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin",n=document.querySelector(".wa-send-btn");n&&(n.disabled=!0,n.style.opacity="0.5");try{const r=new FormData;r.append("file",o);const d=await(await fetch(f+"/imagenes/upload-temp",{method:"POST",body:r})).json(),l=d.url||d.public_url;if(!l)throw new Error("No se obtuvo URL");await fetch(f+"/chatbot/chats/"+e+"/imagen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:l,caption:"",agente:a})}),await window._recargarChats(),abrirChat(e)}catch(r){alert("Error subiendo imagen: "+r.message)}finally{n&&(n.disabled=!1,n.style.opacity="1")}};window.subirDocumentoWA=async(e,t)=>{var n;const o=t.files[0];if(!o)return;t.value="";const a=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";try{const i=new FormData;i.append("file",o);const s=await(await fetch(f+"/imagenes/upload-temp",{method:"POST",body:i})).json(),d=s.url||s.public_url;if(!d)throw new Error("No se obtuvo URL");await fetch(f+"/chatbot/chats/"+e+"/documento",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({doc_url:d,filename:o.name,caption:"",agente:a})}),await window._recargarChats(),abrirChat(e)}catch(i){alert("Error enviando documento: "+i.message)}};window.subirVideoWA=async(e,t)=>{var n;const o=t.files[0];if(!o)return;t.value="";const a=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";try{const i=new FormData;i.append("file",o);const s=await(await fetch(f+"/imagenes/upload-temp",{method:"POST",body:i})).json(),d=s.url||s.public_url;if(!d)throw new Error("No se obtuvo URL");await fetch(f+"/chatbot/chats/"+e+"/video",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({video_url:d,caption:"",agente:a})}),await window._recargarChats(),abrirChat(e)}catch(i){alert("Error enviando video: "+i.message)}};window.enviarUbicacionWA=async e=>{var r;const t=((r=window._empleadoActual)==null?void 0:r.nombre)||"Admin",o="21.1250",a="-101.6860",n="Zapatillas May",i="León, Guanajuato, México";try{const s=await fetch(f+"/chatbot/chats/"+e+"/ubicacion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lat:o,lng:a,nombre:n,direccion:i,agente:t})});if(!s.ok)throw new Error("Error "+s.status);await window._recargarChats(),abrirChat(e)}catch(s){alert("Error enviando ubicación: "+s.message)}};window.mostrarEnviarContactoWA=e=>{const t=document.getElementById("modal-contacto-wa");t&&t.remove();const o=document.createElement("div");o.id="modal-contacto-wa",o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center",o.innerHTML=`
    <div style="background:#fff;border-radius:16px;padding:28px 24px;width:340px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
      <h3 style="margin:0 0 16px;font-size:1rem;color:#0f172a">Enviar contacto por WhatsApp</h3>
      <div style="display:flex;flex-direction:column;gap:10px">
        <input id="cwa-nombre" placeholder="Nombre" value="Zapatillas May"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
        <input id="cwa-tel" placeholder="Teléfono (ej: 4771234567)"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
        <input id="cwa-empresa" placeholder="Empresa (opcional)" value="Zapatillas May"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
      </div>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button onclick="document.getElementById('modal-contacto-wa').remove()"
                style="flex:1;padding:10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:0.9rem;color:#64748b">
          Cancelar
        </button>
        <button onclick="enviarContactoWA('${e}')"
                style="flex:1;padding:10px;border:none;border-radius:8px;background:#E91E8C;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:600">
          Enviar
        </button>
      </div>
    </div>`,document.body.appendChild(o),o.addEventListener("click",a=>{a.target===o&&o.remove()}),setTimeout(()=>{var a;return(a=document.getElementById("cwa-tel"))==null?void 0:a.focus()},50)};window.enviarContactoWA=async e=>{var i,r,s,d,l;const t=((i=document.getElementById("cwa-nombre"))==null?void 0:i.value.trim())||"Zapatillas May",o=((r=document.getElementById("cwa-tel"))==null?void 0:r.value.trim())||"",a=((s=document.getElementById("cwa-empresa"))==null?void 0:s.value.trim())||"",n=((d=window._empleadoActual)==null?void 0:d.nombre)||"Admin";if(!o){alert("Ingresa el número de teléfono del contacto");return}(l=document.getElementById("modal-contacto-wa"))==null||l.remove();try{const c=await fetch(f+"/chatbot/chats/"+e+"/contacto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:t,telefono_contacto:o,empresa:a,agente:n})});if(!c.ok)throw new Error("Error "+c.status);await window._recargarChats(),abrirChat(e)}catch(c){alert("Error enviando contacto: "+c.message)}};window.mostrarModalBotones=e=>{const t=fe("modal-botones-wa",`
    <h3 style="margin:0 0 14px;font-size:1rem;color:#0f172a">Enviar botones interactivos</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      <input id="mbt-encabezado" placeholder="Encabezado (opcional)" style="${ee()}">
      <textarea id="mbt-cuerpo" placeholder="Mensaje principal *" rows="2" style="${ee()};resize:none"></textarea>
      <input id="mbt-btn1" placeholder="Botón 1 (opcional, máx 20 chars)" style="${ee()}">
      <input id="mbt-btn2" placeholder="Botón 2 (opcional, máx 20 chars)" style="${ee()}">
      <p style="font-size:0.75rem;color:#94a3b8;margin:0">Se agrega automáticamente: <strong>Hablar con asesor</strong></p>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button onclick="document.getElementById('modal-botones-wa').remove()" style="${be()}">Cancelar</button>
      <button onclick="_enviarBotonesWA('${e}')" style="${ye()}">Enviar</button>
    </div>`);document.body.appendChild(t),setTimeout(()=>{var o;return(o=document.getElementById("mbt-cuerpo"))==null?void 0:o.focus()},50)};window._enviarBotonesWA=async e=>{var s,d,l,c,p,m;const t=(s=document.getElementById("mbt-cuerpo"))==null?void 0:s.value.trim();if(!t){alert("Escribe el mensaje principal");return}const o=((d=document.getElementById("mbt-encabezado"))==null?void 0:d.value.trim())||"",a=((l=document.getElementById("mbt-btn1"))==null?void 0:l.value.trim())||"",n=((c=document.getElementById("mbt-btn2"))==null?void 0:c.value.trim())||"",i=[a,n].filter(Boolean),r=((p=window._empleadoActual)==null?void 0:p.nombre)||"Admin";(m=document.getElementById("modal-botones-wa"))==null||m.remove();try{await fetch(f+"/chatbot/chats/"+e+"/botones",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cuerpo:t,encabezado:o,botones:i,agente:r})}),await window._recargarChats(),abrirChat(e)}catch(g){alert("Error: "+g.message)}};window.mostrarModalLista=e=>{const t=fe("modal-lista-wa",`
    <h3 style="margin:0 0 14px;font-size:1rem;color:#0f172a">Enviar lista interactiva</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      <textarea id="mlt-cuerpo" placeholder="Mensaje principal *" rows="2" style="${ee()};resize:none"></textarea>
      <input id="mlt-boton" placeholder="Texto del botón (ej: Ver opciones)" style="${ee()}">
      <textarea id="mlt-opciones" placeholder="Opciones (una por línea, máx 10)&#10;ej:&#10;Tenis&#10;Sandalias&#10;Tacones" rows="5" style="${ee()};resize:none"></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button onclick="document.getElementById('modal-lista-wa').remove()" style="${be()}">Cancelar</button>
      <button onclick="_enviarListaWA('${e}')" style="${ye()}">Enviar</button>
    </div>`);document.body.appendChild(t),setTimeout(()=>{var o;return(o=document.getElementById("mlt-cuerpo"))==null?void 0:o.focus()},50)};window._enviarListaWA=async e=>{var r,s,d,l,c;const t=(r=document.getElementById("mlt-cuerpo"))==null?void 0:r.value.trim();if(!t){alert("Escribe el mensaje");return}const o=((s=document.getElementById("mlt-boton"))==null?void 0:s.value.trim())||"Ver opciones",a=(((d=document.getElementById("mlt-opciones"))==null?void 0:d.value)||"").split(`
`).map(p=>p.trim()).filter(Boolean).slice(0,10);if(!a.length){alert("Agrega al menos una opción");return}const n=((l=window._empleadoActual)==null?void 0:l.nombre)||"Admin";(c=document.getElementById("modal-lista-wa"))==null||c.remove();const i=[{titulo:"Opciones",opciones:a.map((p,m)=>({id:`op_${m}`,titulo:p}))}];try{await fetch(f+"/chatbot/chats/"+e+"/lista",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cuerpo:t,titulo_boton:o,secciones:i,agente:n})}),await window._recargarChats(),abrirChat(e)}catch(p){alert("Error: "+p.message)}};window.mostrarModalCarrusel=async e=>{const t=fe("modal-carrusel-wa",`
    <h3 style="margin:0 0 4px;font-size:1rem;color:#0f172a">Enviar fotos de productos</h3>
    <p style="margin:0 0 8px;font-size:0.75rem;color:#94a3b8">Busca un modelo y tócalo para ver sus colores</p>
    <input id="mcr-cuerpo" placeholder="Mensaje intro" value="Mira estos modelos 👠" style="${ee()};margin-bottom:6px">
    <input id="mcr-search" placeholder="🔍 Buscar modelo..." oninput="window._mcrFiltrar()" style="${ee()};margin-bottom:6px">
    <div id="mcr-loading" style="text-align:center;padding:16px;color:#94a3b8;font-size:0.82rem">Cargando...</div>
    <div id="mcr-modelos" style="max-height:270px;overflow-y:auto;display:none;border:1px solid #e2e8f0;border-radius:8px"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <label style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#475569;cursor:pointer">
        <input type="checkbox" id="mcr-incluir-precios" style="width:12px;height:12px">
        Incluir precios en las fotos
      </label>
      <span id="mcr-contador" style="font-size:0.72rem;color:#94a3b8">0/10 fotos</span>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button onclick="document.getElementById('modal-carrusel-wa').remove()" style="${be()}">Cancelar</button>
      <button onclick="_enviarCarruselWA('${e}')" style="${ye()}">Enviar fotos</button>
    </div>`);document.body.appendChild(t);try{const o=window._productosWA||[],n=await(await fetch(f+"/variantes/?activa=eq.true&select=id,producto_id,color,foto_url,imagenes,color_hex")).json();window._mcrDatos=o.map(i=>{const r=n.filter(c=>c.producto_id===i.id),s=new Set,d=[];r.forEach(c=>{if(s.has(c.color))return;s.add(c.color);const p=c.foto_url||c.imagenes&&c.imagenes[0]||i.imagen_principal||"";p&&d.push({img:p,color:c.color||"Sin color",color_hex:c.color_hex||""})}),!d.length&&i.imagen_principal&&d.push({img:i.imagen_principal,color:"Color único",color_hex:""});const l=[];return i.precio_menudeo&&l.push("Par: $"+i.precio_menudeo),i.precio_mayoreo3&&l.push("3+: $"+i.precio_mayoreo3),i.precio_mayoreo6&&l.push("6+: $"+i.precio_mayoreo6),i.corrida_activa&&i.precio_corrida&&l.push("Corrida: $"+i.precio_corrida),{id:i.id,nombre:i.nombre,preciosStr:l.join(" · "),variantes:d}}).filter(i=>i.variantes.length),document.getElementById("mcr-loading").style.display="none",document.getElementById("mcr-modelos").style.display="block",window._mcrFiltrar(),setTimeout(()=>{var i;return(i=document.getElementById("mcr-search"))==null?void 0:i.focus()},50)}catch(o){const a=document.getElementById("mcr-loading");a&&(a.textContent="Error: "+o.message)}};window._mcrSel=new Map;window._mcrFiltrar=()=>{var a;const e=(((a=document.getElementById("mcr-search"))==null?void 0:a.value)||"").toLowerCase().trim(),t=(window._mcrDatos||[]).filter(n=>!e||n.nombre.toLowerCase().includes(e)),o=document.getElementById("mcr-modelos");if(o){if(!t.length){o.innerHTML='<p style="padding:12px;color:#94a3b8;font-size:0.82rem;text-align:center">Sin resultados</p>';return}o.innerHTML=t.map(n=>{const i=n.variantes.filter(r=>window._mcrSel.has(r.img)).length;return`
    <div style="border-bottom:1px solid #f1f5f9">
      <div onclick="window._mcrToggle('${n.id}')" style="display:flex;align-items:center;gap:8px;padding:9px 10px;cursor:pointer;user-select:none">
        <span id="mcr-arrow-${n.id}" style="font-size:0.65rem;color:#94a3b8;transition:transform 0.15s;display:inline-block">▶</span>
        <span style="flex:1;font-size:0.85rem;font-weight:600;color:#0f172a">${n.nombre}</span>
        <span style="font-size:0.7rem;color:${i?"#E91E8C":"#94a3b8"}">${i?i+" sel · ":""}${n.variantes.length} color${n.variantes.length!==1?"es":""}</span>
      </div>
      <div id="mcr-vars-${n.id}" style="display:none;padding:0 10px 10px 28px">
        ${n.variantes.map(r=>`
          <label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;font-size:0.82rem">
            <input type="checkbox" class="mcr-check"
              data-img="${r.img}"
              data-texto="${n.nombre} · ${r.color}"
              data-precios="${n.preciosStr}"
              ${window._mcrSel.has(r.img)?"checked":""}
              onchange="window._mcrCambio(this)"
              style="width:14px;height:14px;flex-shrink:0">
            <img src="${r.img}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#f1f5f9">
            <span>${r.color}</span>
          </label>`).join("")}
      </div>
    </div>`}).join("")}};window._mcrCambio=e=>{var o;e.checked?window._mcrSel.set(e.dataset.img,{img:e.dataset.img,texto:e.dataset.texto,precios:e.dataset.precios}):window._mcrSel.delete(e.dataset.img),window._mcrContador();const t=e.closest('[id^="mcr-vars-"]');if(t){const a=t.id.replace("mcr-vars-",""),n=(window._mcrDatos||[]).find(i=>String(i.id)===a);if(n){const i=n.variantes.filter(s=>window._mcrSel.has(s.img)).length,r=(o=t.previousElementSibling)==null?void 0:o.querySelector("span:last-child");r&&(r.textContent=(i?i+" sel · ":"")+n.variantes.length+" color"+(n.variantes.length!==1?"es":""),r.style.color=i?"#E91E8C":"#94a3b8")}}};window._mcrToggle=e=>{const t=document.getElementById("mcr-vars-"+e),o=document.getElementById("mcr-arrow-"+e);if(!t)return;const a=t.style.display==="block";t.style.display=a?"none":"block",o&&(o.style.transform=a?"":"rotate(90deg)")};window._mcrContador=()=>{const e=window._mcrSel.size,t=document.getElementById("mcr-contador");t&&(t.textContent=e+"/10 fotos",t.style.color=e>=10?"#ef4444":"#94a3b8")};window._enviarCarruselWA=async e=>{var r,s,d,l;const t=((r=document.getElementById("mcr-cuerpo"))==null?void 0:r.value.trim())||"Mira estos modelos",o=[...window._mcrSel.values()];if(!o.length){alert("Selecciona al menos una foto");return}if(o.length>10){alert("Máximo 10 fotos");return}const a=((s=window._empleadoActual)==null?void 0:s.nombre)||"Admin",n=((d=document.getElementById("mcr-incluir-precios"))==null?void 0:d.checked)||!1,i=o.map(c=>({imagen_url:c.img,texto:c.texto+(n&&c.precios?`
`+c.precios:"")}));(l=document.getElementById("modal-carrusel-wa"))==null||l.remove();try{await fetch(f+"/chatbot/chats/"+e+"/carrusel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cuerpo:t,tarjetas:i,agente:a})}),await window._recargarChats(),abrirChat(e)}catch(c){alert("Error: "+c.message)}};function fe(e,t){const o=document.getElementById(e);o&&o.remove();const a=document.createElement("div");return a.id=e,a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center",a.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;width:360px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.2)">${t}</div>`,a.addEventListener("click",n=>{n.target===a&&a.remove()}),a}function ee(){return"border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.85rem;outline:none;width:100%;box-sizing:border-box;font-family:inherit"}function be(){return"flex:1;padding:10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:0.9rem;color:#64748b;font-family:inherit"}function ye(){return"flex:1;padding:10px;border:none;border-radius:8px;background:#E91E8C;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:600;font-family:inherit"}window.cambiarEtiqueta=async(e,t)=>{try{await fetch(f+"/chatbot/chats/"+e+"/etiqueta",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({etiqueta:t})}),window._chatsData[e]&&(window._chatsData[e].etiqueta=t)}catch{alert("Error guardando etiqueta")}};window.toggleControl=async(e,t)=>{var a;const o=((a=window._empleadoActual)==null?void 0:a.nombre)||"Admin";try{(await(await fetch(f+"/chatbot/chats/"+e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({en_control:t,agente:o})})).json()).ok&&(window._chatsData[e]&&(window._chatsData[e].en_control=t,window._chatsData[e].agente=o),abrirChat(e))}catch{alert("Error cambiando control")}};window.mostrarCatalogoWA=e=>{const t=window._productosWA||[],o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",o.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700">👠 Selecciona un producto</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <input class="form-input" placeholder="Buscar producto..." style="margin:1rem;font-size:0.85rem" oninput="filtrarProductosWA(this.value)">
      <div id="productos-wa-lista" style="overflow-y:auto;padding:0 1rem 1rem">
        ${t.filter(a=>a.activo).map(a=>`
  <div onclick="enviarProductoWA('${e}', '${(a.imagen_principal||"").replace(/'/g,"")}', window._buildCaption('${a.id}'))"
       style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background 0.15s"
       onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
    ${a.imagen_principal?`<img src="${a.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:6px;background:#f5f5f5;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
    <div style="flex:1">
      <p style="font-weight:600;font-size:0.88rem">${a.nombre}</p>
      <p style="font-size:0.75rem;color:#888">$${a.precio_menudeo} menudeo · $${a.precio_mayoreo3||a.precio_menudeo-30} mayoreo</p>
    </div>
    <span style="font-size:0.75rem;color:#25D366;font-weight:600">Enviar →</span>
  </div>
`).join("")}
      </div>
    </div>
  `,document.body.appendChild(o),o.addEventListener("click",a=>{a.target===o&&o.remove()})};window.filtrarProductosWA=e=>{document.querySelectorAll("#productos-wa-lista > div").forEach(t=>{t.style.display=!e||t.textContent.toLowerCase().includes(e.toLowerCase())?"":"none"})};window._buildCaption=e=>{const t=(window._productosWA||[]).find(o=>o.id===e);return t?"👠 *"+t.nombre+`*

💰 *Precios:*
• Menudeo (1-2 pares): $`+t.precio_menudeo+`
• Mayoreo 3-5 pares: $`+(t.precio_mayoreo3||t.precio_menudeo-30)+`
• Mayoreo 6+ pares: $`+(t.precio_mayoreo6||t.precio_menudeo-70)+`
• Corrida completa: $`+(t.precio_corrida||t.precio_menudeo-100)+`

🛍️ Ver y comprar: https://zapatillasmay.mx`:""};window.enviarProductoWA=async(e,t,o)=>{var i;console.log("imagenUrl:",t,"caption:",o);const a=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]');a&&a.remove(),console.log("enviando a:",e,t);const n=((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin";try{if(t){const r=o.replace(/\\n/g,`
`);await fetch(f+"/chatbot/chats/"+e+"/imagen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:t,caption:r,agente:n})})}else await fetch(f+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:o,agente:n})});await new Promise(r=>setTimeout(r,1500)),await window._recargarChats(),abrirChat(e)}catch{alert("Error enviando producto")}};window.switchTipoEnvio=function(e,t){["campana","catalogo","fotos"].forEach(a=>{const n=document.getElementById(`tab-envio-${a}`),i=document.getElementById(`panel-envio-${a}`);!n||!i||(a===e?(n.style.background="#E91E8C",n.style.color="#fff",n.style.borderColor="#E91E8C",i.style.display="block"):(n.style.background="#fff",n.style.color="#374151",n.style.borderColor="#e5e7eb",i.style.display="none"))})};window.cargarEnviosMasivos=async function(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[t,o]=await Promise.all([fetch(f+"/chatbot/plantillas").then(s=>s.json()),fetch(f+"/clientes/").then(s=>s.json())]);if(t.error){e.innerHTML=`<div style="padding:2rem;color:#c62828;background:#ffebee;border-radius:12px;margin:1rem">
        ❌ <strong>Error al cargar plantillas:</strong> ${t.error}
        <p style="font-size:0.82rem;margin-top:8px;color:#666">Verifica que <code>WHATSAPP_WABA_ID</code> esté configurado en Railway.</p>
      </div>`;return}const a=Array.isArray(t)?t:[];window._envioPlantillas=a;const n=Array.isArray(o)?o.filter(s=>s.telefono):[];window._envioClientes=n,window._envioContactos=n.map(s=>({telefono:s.telefono,nombre:s.nombre,tipo:s.tipo,fuente:"cliente"})),window._envioSeleccionados=new Set(window._envioContactos.map(s=>s.telefono)),window._envioContactosVisibles=[...window._envioContactos];const i=s=>s.map(d=>{var c;const l=(c=window._envioSeleccionados)==null?void 0:c.has(d.telefono);return`<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;border:1.5px solid ${l?"#E91E8C":"#f0f0f0"};background:${l?"#fff0f8":"white"}" id="envio-row-${d.telefono.replace(/\D/g,"")}">
        <input type="checkbox" ${l?"checked":""} onchange="toggleEnvioContacto('${d.telefono}',this)"
          style="accent-color:#E91E8C;width:15px;height:15px;flex-shrink:0">
        <div style="width:28px;height:28px;border-radius:50%;background:#E91E8C;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0">
          ${(d.nombre||"?").charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.nombre||d.telefono}</p>
          <p style="font-size:0.72rem;color:#888;margin:0">${d.telefono}${d.tipo?" · "+d.tipo:""}</p>
        </div>
      </label>`}).join("");e.innerHTML=`
      <div style="max-width:960px">
        <div style="margin-bottom:1.5rem">
          <p style="font-size:0.72rem;font-weight:600;letter-spacing:0.08em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">WhatsApp Cloud API</p>
          <h2 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0 0 4px">Envíos masivos</h2>
          <p style="color:#94a3b8;font-size:0.78rem;margin:0">${n.length} clientes con teléfono registrado</p>
        </div>

        <!-- Selector de tipo de envío -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.5rem">
          <button onclick="switchTipoEnvio('campana',this)" id="tab-envio-campana"
            style="padding:14px 10px;border-radius:12px;border:2px solid #E91E8C;background:#E91E8C;color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;text-align:center;line-height:1.4">
            📣 Campaña<br>
            <span style="font-size:0.68rem;font-weight:400;opacity:0.9">Cualquier cliente · sin restricción</span>
          </button>
          <button onclick="switchTipoEnvio('catalogo',this)" id="tab-envio-catalogo"
            style="padding:14px 10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;text-align:center;line-height:1.4">
            🛍️ Catálogo<br>
            <span style="font-size:0.68rem;font-weight:400;color:#888">Muestra productos del catálogo</span>
          </button>
          <button onclick="switchTipoEnvio('fotos',this)" id="tab-envio-fotos"
            style="padding:14px 10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;text-align:center;line-height:1.4">
            📸 Fotos variantes<br>
            <span style="font-size:0.68rem;font-weight:400;color:#c2410c">Solo si cliente escribió hoy</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">

          <!-- COLUMNA IZQUIERDA: configuración -->
          <div>
            <!-- Panel campaña -->
            <div id="panel-envio-campana">
            <!-- Plantilla -->
            <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px">1 · Plantilla</p>
              ${a.length===0?'<p style="color:#888;font-size:0.85rem">No hay plantillas aprobadas en tu cuenta de Meta.</p>':a.map(s=>{var g;const d=(s.components||[]).find(u=>u.type==="BODY"),l=((g=d==null?void 0:d.text)==null?void 0:g.substring(0,55))||"",c=(s.category||"").toUpperCase(),m=c==="UTILITY"||c==="AUTHENTICATION"?'<span style="background:#dcfce7;color:#15803d;border-radius:4px;padding:1px 6px;font-size:0.65rem;font-weight:700">UTILITY · sin restricción</span>':'<span style="background:#fff3cd;color:#92400e;border-radius:4px;padding:1px 6px;font-size:0.65rem;font-weight:700">MARKETING · solo 24h</span>';return`<label style="display:block;cursor:pointer;padding:10px 12px;border-radius:8px;border:2px solid #eee;margin-bottom:6px;transition:all 0.15s"
                      onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('plt-${s.name}').checked)this.style.borderColor='#eee'">
                      <div style="display:flex;align-items:flex-start;gap:8px">
                        <input type="radio" name="envio-plantilla-radio" id="plt-${s.name}" value="${s.name}" data-idioma="${s.language}"
                          onchange="onCambiarPlantillaEnvio('${s.name}','${s.language}')" style="accent-color:#E91E8C;margin-top:2px;flex-shrink:0">
                        <div style="min-width:0">
                          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px">
                            <p style="font-size:0.85rem;font-weight:600;margin:0">${s.name}</p>
                            ${m}
                          </div>
                          <p style="font-size:0.7rem;color:#888;margin:0">${s.language}${l?" · "+l+"…":""}</p>
                        </div>
                      </div>
                    </label>`}).join("")}

              <!-- Vista previa de la plantilla seleccionada -->
              <div id="plantilla-preview-box" style="display:none;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">
                <p style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:8px">Vista previa del mensaje</p>
                <div style="background:#e5ddd5;border-radius:10px;padding:10px;min-height:60px">
                  <div id="plantilla-preview-burbuja" style="background:white;border-radius:8px 8px 8px 2px;padding:10px 12px;max-width:85%;font-size:0.82rem;line-height:1.55;color:#333;box-shadow:0 1px 2px rgba(0,0,0,0.1);white-space:pre-wrap"></div>
                </div>
                <p style="font-size:0.7rem;color:#aaa;margin-top:6px">Las variables como <code>{{1}}</code> se reemplazan con el nombre del cliente al enviar.</p>
              </div>
            </div>

            <!-- Imagen: selector de modelo + variante -->
            <div id="envio-seccion-foto" style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">2 · Foto del modelo <span style="font-weight:400;color:#cbd5e1;text-transform:none;letter-spacing:0">(solo plantillas con imagen)</span></p>

              <!-- Búsqueda de modelo -->
              <input type="text" id="envio-modelo-buscar" placeholder="🔍 Buscar modelo por nombre..."
                oninput="filtrarModelosEnvio(this.value)"
                style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
              <div id="envio-modelos-lista" style="max-height:140px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:10px">
                <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>
              </div>

              <!-- Variantes del modelo seleccionado -->
              <div id="envio-variantes-panel" style="display:none">
                <p id="envio-variantes-titulo" style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px"></p>
                <div id="envio-variantes-grid" style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto"></div>
              </div>

              <!-- Foto seleccionada -->
              <div id="envio-foto-seleccionada" style="display:none;margin-top:10px;border-radius:10px;overflow:hidden;border:2px solid #E91E8C;position:relative">
                <img id="envio-foto-img" src="" style="width:100%;height:120px;object-fit:cover">
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);padding:4px 8px;display:flex;justify-content:space-between;align-items:center">
                  <span id="envio-foto-label" style="font-size:0.75rem;color:white;font-weight:600"></span>
                  <button onclick="quitarFotoEnvio()" style="background:none;border:none;color:white;cursor:pointer;font-size:0.9rem;padding:0">✕</button>
                </div>
              </div>

              <input type="hidden" id="envio-imagen">
            </div>

            <!-- Audiencia -->
            <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px">3 · Audiencia</p>
              <select id="envio-filtro" class="form-input" onchange="filtrarAudienciaEnvio()">
                <option value="todos">Todos los clientes</option>
                <option value="mayoreo">Solo Mayoreo</option>
                <option value="zapateria">Solo Zapaterías</option>
                <option value="menudeo">Solo Menudeo</option>
              </select>
            </div>

            <!-- Botón enviar -->
            <div id="envio-resultado" style="display:none;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #a5d6a7;background:#e8f5e9"></div>
            <button id="btn-enviar-masivo" onclick="iniciarEnvioMasivo()" class="btn btn-primary" style="width:100%;padding:12px">
              📣 Enviar campaña
            </button>
            <p style="font-size:0.72rem;color:#aaa;text-align:center;margin-top:8px">Solo plantillas aprobadas por Meta. No arriesga el número de teléfono.</p>

            <div style="margin-top:1rem;padding-top:1rem;border-top:1px dashed #eee">
              <p style="font-size:0.75rem;font-weight:700;color:#888;margin-bottom:6px">🔧 Diagnóstico</p>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <input type="text" id="diag-tel" class="form-input" placeholder="Tu teléfono (52...)" style="flex:1;min-width:140px;font-size:0.8rem">
                <button onclick="ejecutarDiagnostico()" class="btn btn-secondary" style="font-size:0.78rem;white-space:nowrap">Probar envío</button>
                <button onclick="ejecutarDebugPlantillas()" class="btn btn-secondary" style="font-size:0.78rem;white-space:nowrap">Ver estructura</button>
              </div>
              <div id="diag-resultado" style="display:none;margin-top:8px;padding:10px;background:#f9f9f9;border-radius:8px;font-size:0.75rem;font-family:monospace;white-space:pre-wrap;color:#333;max-height:260px;overflow-y:auto"></div>
            </div>
          </div>
          </div><!-- fin panel-envio-campana -->

          <!-- COLUMNA DERECHA: destinatarios -->
          <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h3 style="font-size:0.95rem;font-weight:700">👥 Destinatarios</h3>
              <span id="envio-count" style="background:#E91E8C;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${n.length} seleccionados</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <input type="text" id="envio-buscador" placeholder="🔍 Buscar..." oninput="buscarContactosEnvio(this.value)"
                style="flex:1;padding:7px 10px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box">
              <label style="display:flex;align-items:center;gap:5px;font-size:0.78rem;color:#555;cursor:pointer;white-space:nowrap;flex-shrink:0">
                <input type="checkbox" id="envio-sel-todos" checked onchange="toggleSelTodosEnvio(this.checked)" style="accent-color:#E91E8C;width:14px;height:14px">
                Todos
              </label>
            </div>
            <div id="envio-lista" style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:4px">
              ${i(window._envioContactos)}
            </div>
          </div>

          <!-- Catálogo interactivo -->
          <div id="panel-envio-catalogo" style="display:none">
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <p style="font-weight:700;font-size:0.95rem;margin:0">🛍️ Catálogo de productos</p>
              <span style="background:#e8f5e9;color:#2e7d32;border-radius:100px;padding:2px 8px;font-size:0.7rem;font-weight:600">hasta 30 modelos</span>
            </div>
            <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:0.76rem;color:#856404;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <span>⚠️ <strong>Tu plantilla de catálogo actual es MARKETING</strong> → solo llega a contactos activos (24h). Para enviar a cualquier cliente crea la versión UTILITY.</span>
              <button onclick="crearPlantillaCatalogo(this)" style="padding:5px 12px;border-radius:16px;border:1.5px solid #d97706;background:none;color:#92400e;font-size:0.73rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0">
                ⚙️ Crear plantilla UTILITY
              </button>
            </div>
            <p style="font-size:0.78rem;color:#888;margin-bottom:1rem">Selecciona los modelos a mostrar y elige los destinatarios en la columna derecha.</p>
            <input id="envio-prod-buscador" type="text" placeholder="🔍 Buscar modelo..."
              oninput="filtrarProductosEnvioInteractivo(this.value)"
              style="width:100%;padding:7px 10px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
            <div id="envio-prod-grid" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;margin-bottom:6px">
              <p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando modelos...</p>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <p id="envio-prod-count" style="font-size:0.75rem;color:#E91E8C;font-weight:600;margin:0"></p>
              <button onclick="iniciarEnvioInteractivo()" class="btn btn-secondary" style="border-color:#E91E8C;color:#E91E8C;font-size:0.82rem;white-space:nowrap">
                🛍️ Enviar catálogo
              </button>
            </div>
          </div>
          </div><!-- fin panel-envio-catalogo -->

          <!-- Envío de fotos de variantes (24 h) -->
          <div id="panel-envio-fotos" style="display:none">
          <div style="background:white;border-radius:12px;border:1.5px solid #fed7aa;padding:1.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <p style="font-weight:700;font-size:0.95rem;margin:0">📸 Fotos de variantes</p>
              <span style="background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:100px;padding:2px 9px;font-size:0.7rem;font-weight:700;white-space:nowrap">⚠️ Solo 24 h</span>
            </div>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:0.76rem;color:#92400e">
              ⚠️ <strong>Requiere que el cliente te haya escrito en las últimas 24 horas.</strong> Si no, el mensaje no llega (error 131047).
            </div>
            <p style="font-size:0.75rem;color:#888;margin-bottom:10px;line-height:1.4">
              Envía fotos de los colores/variantes que elijas directamente al chat, igual que en la sección CRM.
            </p>

            <!-- Mensaje de saludo -->
            <textarea id="fotos-texto" rows="2" placeholder="Mensaje de saludo (opcional) — usa {{nombre}} para personalizar. Ej: Hola {{nombre}}, llegaron nuevos modelos 🎉"
              style="width:100%;padding:8px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;margin-bottom:10px"></textarea>

            <!-- Buscador de modelo -->
            <input type="text" id="fotos-modelo-buscar" placeholder="🔍 Buscar modelo por nombre o SKU..."
              oninput="filtrarModelosFotos(this.value)"
              style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
            <div id="fotos-modelos-lista" style="max-height:130px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:8px">
              <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>
            </div>

            <!-- Variantes del modelo -->
            <div id="fotos-variantes-panel" style="display:none;margin-bottom:10px">
              <p id="fotos-variantes-titulo" style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px"></p>
              <div id="fotos-variantes-grid" style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto"></div>
            </div>

            <!-- Fotos seleccionadas -->
            <div id="fotos-seleccionadas-wrap" style="display:none;margin-bottom:12px">
              <p style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px">Fotos seleccionadas</p>
              <div id="fotos-seleccionadas-grid" style="display:flex;flex-wrap:wrap;gap:8px"></div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <p id="fotos-count" style="font-size:0.75rem;color:#e65100;font-weight:600;margin:0"></p>
              <button onclick="iniciarEnvioFotos()" class="btn btn-secondary"
                style="border-color:#e65100;color:#e65100;font-size:0.82rem;white-space:nowrap">
                Enviar fotos · solo 24 h
              </button>
            </div>
          </div>
          </div><!-- fin panel-envio-fotos -->

          </div><!-- fin columna derecha -->
        </div>
      </div>
    `,window._fotosSeleccionadas=[],cargarProductosEnvio(),cargarProductosEnvioInteractivo(),window.switchTipoEnvio("campana",null);const r=document.querySelector('input[name="envio-plantilla-radio"]');r&&(r.checked=!0,onCambiarPlantillaEnvio(r.value,r.dataset.idioma))}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error: '+t.message+"</p>"}};window.ejecutarDebugPlantillas=async()=>{const e=document.getElementById("diag-resultado");if(e){e.style.display="block",e.textContent="Consultando estructura...";try{const o=await(await fetch(f+"/chatbot/plantillas-debug")).json();e.textContent=JSON.stringify(o,null,2)}catch(t){e.textContent="Error: "+t.message}}};window.ejecutarDiagnostico=async()=>{var i,r;const e=(((i=document.getElementById("diag-tel"))==null?void 0:i.value)||"").trim(),t=document.querySelector('input[name="envio-plantilla-radio"]:checked'),o=(t==null?void 0:t.value)||"",a=((r=t==null?void 0:t.dataset)==null?void 0:r.idioma)||"es_MX",n=document.getElementById("diag-resultado");if(n){n.style.display="block",n.textContent="Consultando...";try{const d=await(await fetch(f+"/chatbot/wa-diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telefono:e,plantilla:o,idioma:a})})).json();n.textContent=JSON.stringify(d,null,2)}catch(s){n.textContent="Error: "+s.message}}};window.onCambiarPlantillaEnvio=(e,t)=>{window._envioPlantillaActual={nombre:e,idioma:t};const a=(window._envioPlantillas||[]).find(y=>y.name===e),n=document.getElementById("plantilla-preview-box"),i=document.getElementById("plantilla-preview-burbuja");if(!n||!i||!a)return;const r=[],s=(a.components||[]).find(y=>y.type==="HEADER"),d=(a.components||[]).find(y=>y.type==="BODY"),l=(a.components||[]).find(y=>y.type==="FOOTER"),c=(a.components||[]).find(y=>y.type==="BUTTONS"),p=((c==null?void 0:c.buttons)||[]).some(y=>y.sub_type==="MPM"||y.type==="MPM"||a.sub_category==="MULTI_PRODUCT_MESSAGE");(s==null?void 0:s.format)==="IMAGE"&&r.push("🖼️ [Imagen del producto]"),s!=null&&s.text&&r.push(`*${s.text}*`),d!=null&&d.text&&r.push(d.text),l!=null&&l.text&&r.push(`_${l.text}_`),p&&r.push("🛍️ [Catálogo de productos — selecciona abajo]"),i.textContent=r.join(`

`)||"(sin contenido)",n.style.display="block";const m=document.getElementById("envio-seccion-foto");if(m){m.style.display="block";const y=m.querySelector("p");y&&(y.innerHTML=p?'<span style="font-weight:700;font-size:0.9rem">2️⃣ Foto de portada del catálogo</span> <span style="font-weight:400;color:#aaa;font-size:0.78rem">(imagen principal que verá el cliente)</span>':'<span style="font-weight:700;font-size:0.9rem">2️⃣ Foto del modelo</span> <span style="font-weight:400;color:#aaa;font-size:0.78rem">(opcional — para plantillas con imagen)</span>')}const g=document.getElementById("envio-mpm-aviso");g&&(g.style.display=p?"block":"none"),window._envioEsMPM=p,window._envioHeaderTipo=(s==null?void 0:s.format)||(s!=null&&s.text?"TEXT":"NONE");const u=(d==null?void 0:d.text)||"",b=u.match(/\{\{[\d]*\}\}/g)||[];window._envioBodyVarsCount=b.length||(u.includes("{{")?1:0);const v=document.getElementById("envio-seccion-foto");v&&(v.style.display=window._envioHeaderTipo==="IMAGE"?"block":"none"),document.querySelectorAll('input[name="envio-plantilla-radio"]').forEach(y=>{const h=y.closest("label");h&&(h.style.borderColor=y.value===e?"#E91E8C":"#eee",h.style.background=y.value===e?"#fff0f8":"")})};const Ne=e=>{const t=document.getElementById("envio-lista");t&&(t.innerHTML=e.map(o=>{var i;const a=(i=window._envioSeleccionados)==null?void 0:i.has(o.telefono),n=o.telefono.replace(/\D/g,"");return`<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;border:1.5px solid ${a?"#E91E8C":"#f0f0f0"};background:${a?"#fff0f8":"white"}" id="envio-row-${n}">
      <input type="checkbox" ${a?"checked":""} onchange="toggleEnvioContacto('${o.telefono}',this)"
        style="accent-color:#E91E8C;width:15px;height:15px;flex-shrink:0">
      <div style="width:28px;height:28px;border-radius:50%;background:#E91E8C;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0">
        ${(o.nombre||"?").charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.nombre||o.telefono}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${o.telefono}${o.tipo?" · "+o.tipo:""}</p>
      </div>
    </label>`}).join(""))},ve=()=>{var a;const e=((a=window._envioSeleccionados)==null?void 0:a.size)||0,t=document.getElementById("envio-count");t&&(t.textContent=`${e} seleccionado${e!==1?"s":""}`);const o=document.getElementById("envio-sel-todos");if(o){const n=window._envioContactosVisibles||[],i=n.length>0&&n.every(r=>{var s;return(s=window._envioSeleccionados)==null?void 0:s.has(r.telefono)});o.checked=i,o.indeterminate=!i&&n.some(r=>{var s;return(s=window._envioSeleccionados)==null?void 0:s.has(r.telefono)})}};window.toggleEnvioContacto=(e,t)=>{window._envioSeleccionados||(window._envioSeleccionados=new Set);const o=e.replace(/\D/g,""),a=document.getElementById("envio-row-"+o);t.checked?(window._envioSeleccionados.add(e),a&&(a.style.borderColor="#E91E8C",a.style.background="#fff0f8")):(window._envioSeleccionados.delete(e),a&&(a.style.borderColor="#f0f0f0",a.style.background="white")),ve()};window.toggleSelTodosEnvio=e=>{const t=window._envioContactosVisibles||[];window._envioSeleccionados||(window._envioSeleccionados=new Set),t.forEach(o=>{e?window._envioSeleccionados.add(o.telefono):window._envioSeleccionados.delete(o.telefono)}),Ne(t),ve()};window.filtrarAudienciaEnvio=()=>{var n,i;const e=((n=document.getElementById("envio-filtro"))==null?void 0:n.value)||"todos",t=(((i=document.getElementById("envio-buscador"))==null?void 0:i.value)||"").toLowerCase(),o=window._envioClientes||[];let a=e==="todos"?o:o.filter(r=>r.tipo===e);t&&(a=a.filter(r=>(r.nombre||"").toLowerCase().includes(t)||(r.telefono||"").includes(t))),window._envioContactosVisibles=a.map(r=>({telefono:r.telefono,nombre:r.nombre,tipo:r.tipo})),Ne(window._envioContactosVisibles),ve()};window.buscarContactosEnvio=e=>{filtrarAudienciaEnvio()};window.iniciarEnvioMasivo=async()=>{var p,m;const e=window._envioSeleccionados||new Set,o=(window._envioClientes||[]).filter(g=>e.has(g.telefono)).map(g=>({telefono:g.telefono,nombre:g.nombre}));if(o.length===0){alert("Selecciona al menos un destinatario");return}const a=document.querySelector('input[name="envio-plantilla-radio"]:checked');if(!a){alert("Selecciona una plantilla");return}const n=a.value,i=a.dataset.idioma||"es_MX",r=(((p=document.getElementById("envio-imagen"))==null?void 0:p.value)||"").trim(),s=window._envioEsMPM||!1,d=s?Array.from(window._envioProdSeleccionados||new Set):[];if(s&&d.length===0){alert("Esta plantilla es de catálogo — selecciona al menos un producto en la sección de abajo");return}if(!confirm(`¿Enviar la plantilla "${n}" a ${o.length} contacto${o.length!==1?"s":""} seleccionado${o.length!==1?"s":""}${s?` con ${d.length} producto${d.length!==1?"s":""}`:""}?`))return;const l=document.createElement("div");l.id="envio-masivo-overlay",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📣</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando campaña…</h3>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${o.length} contactos · plantilla: <strong>${n}</strong></p>
      <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden;margin-bottom:0.5rem">
        <div id="envio-progress-bar" style="height:100%;width:5%;background:linear-gradient(90deg,#E91E8C,#25D366);border-radius:100px;transition:width 0.3s"></div>
      </div>
      <p id="envio-progress-txt" style="font-size:0.75rem;color:#888">Procesando...</p>
    </div>`,document.body.appendChild(l);const c=l.querySelector("#envio-progress-bar");l.querySelector("#envio-progress-txt"),c&&(c.style.width="15%");try{const u=await(await fetch(f+"/chatbot/envio-masivo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plantilla:n,idioma:i,imagen_url:r,contactos:o,skus_mpm:d,body_vars_count:window._envioBodyVarsCount||0,header_tipo:window._envioHeaderTipo||"NONE"})})).json();if(u.error){l.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1.5rem">${u.error}</p>
        <button onclick="document.getElementById('envio-masivo-overlay').remove()"
          style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`;return}l.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${u.fallidos===0?"🎉":"✅"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem">¡Campaña enviada!</h3>
      <div style="display:flex;justify-content:center;gap:1.5rem;margin-bottom:1rem">
        <div><p style="font-size:1.5rem;font-weight:800;color:#25D366;margin:0">${u.enviados}</p><p style="font-size:0.75rem;color:#888;margin:0">enviados</p></div>
        ${u.fallidos>0?`<div><p style="font-size:1.5rem;font-weight:800;color:#e53e3e;margin:0">${u.fallidos}</p><p style="font-size:0.75rem;color:#888;margin:0">fallidos</p></div>`:""}
      </div>
      ${((m=u.errores)==null?void 0:m.length)>0?`<details style="text-align:left;margin-bottom:1rem"><summary style="font-size:0.78rem;color:#888;cursor:pointer">Ver errores</summary><p style="font-size:0.72rem;color:#c62828;margin-top:6px">${u.errores.slice(0,5).join("<br>")}</p></details>`:""}
      <button onclick="document.getElementById('envio-masivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(g){l.remove(),alert("Error de conexión: "+g.message)}};window.cargarProductosEnvioInteractivo=async()=>{const e=document.getElementById("envio-prod-grid");if(!e||window._envioProdInteractivoCargado){window._envioProdInteractivo&&renderizarEnvioProdGrid(window._envioProdInteractivo);return}try{const o=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._envioProdInteractivo=o,window._envioProdSeleccionados=new Set,window._envioProdInteractivoCargado=!0,renderizarEnvioProdGrid(o)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:4px">Error cargando productos</p>')}};window.renderizarEnvioProdGrid=e=>{const t=document.getElementById("envio-prod-grid");if(!t)return;const o=window._envioProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin productos</p>';return}t.innerHTML=e.map(a=>{const n=a.sku_interno||a.id,i=o.has(n);return`<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;cursor:pointer;border:1px solid ${i?"#E91E8C":"#f0f0f0"};background:${i?"#fff0f8":"white"}" id="envio-prod-lbl-${n}">
      <input type="checkbox" ${i?"checked":""} onchange="toggleEnvioProd('${n}',this)" style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${a.imagen_principal?`<img src="${a.imagen_principal}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:28px;height:28px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0">${a.nombre||n}</p>
        <p style="font-size:0.65rem;color:#aaa;margin:0">${n}</p>
      </div>
    </label>`}).join(""),actualizarCountEnvioProd()};window.toggleEnvioProd=(e,t)=>{window._envioProdSeleccionados||(window._envioProdSeleccionados=new Set);const o=document.getElementById("envio-prod-lbl-"+e);if(t.checked){if(window._envioProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos");return}window._envioProdSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fff0f8")}else window._envioProdSeleccionados.delete(e),o&&(o.style.borderColor="#f0f0f0",o.style.background="white");actualizarCountEnvioProd()};window.actualizarCountEnvioProd=()=>{var o;const e=document.getElementById("envio-prod-count");if(!e)return;const t=((o=window._envioProdSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:""};window.filtrarProductosEnvioInteractivo=e=>{const t=(e||"").toLowerCase().trim(),o=window._envioProdInteractivo||[];renderizarEnvioProdGrid(t?o.filter(a=>(a.nombre||"").toLowerCase().includes(t)||(a.sku_interno||"").toLowerCase().includes(t)):o)};window.iniciarEnvioInteractivo=async()=>{var n;const e=window._envioSeleccionados||new Set,t=(window._envioClientes||[]).filter(i=>e.has(i.telefono)).map(i=>({telefono:i.telefono,nombre:i.nombre})),o=Array.from(window._envioProdSeleccionados||new Set);if(!o.length){alert("Selecciona al menos un modelo del catálogo");return}if(!t.length){alert("No hay destinatarios seleccionados");return}if(!confirm(`¿Enviar catálogo con ${o.length} modelo${o.length>1?"s":""} a ${t.length} destinatario${t.length>1?"s":""} seleccionado${t.length>1?"s":""}?`))return;const a=document.createElement("div");a.id="envio-interactivo-overlay",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",a.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${t.length} contacto${t.length>1?"s":""} · ${o.length} producto${o.length>1?"s":""}</p>
  </div>`,document.body.appendChild(a);try{const r=await(await fetch(f+"/chatbot/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:t.map(s=>({telefono:s.telefono,nombre:s.nombre})),skus:o,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();if(r.error){a.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error al enviar</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${r.error}</p>
        <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
          style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`;return}a.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${r.fallidos?"✅":"🎉"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${r.enviados||0} enviados</p>
      ${r.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${r.fallidos} fallidos</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${(n=r.errores)!=null&&n.length?`<p style="font-size:0.72rem;color:#aaa;margin-bottom:1rem">${r.errores[0]}</p>`:""}
      <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(i){a.remove(),alert("Error: "+i.message)}};window._fotosSeleccionadas=[];window.filtrarModelosFotos=e=>{const t=window._envioModelosList||[],o=document.getElementById("fotos-modelos-lista");if(!o)return;if(!e.trim()){o.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>';return}const a=t.filter(n=>(n.nombre||"").toLowerCase().includes(e.toLowerCase())||(n.sku_interno||"").toLowerCase().includes(e.toLowerCase()));if(!a.length){o.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>';return}o.innerHTML=a.map(n=>`
    <div onclick="seleccionarModeloFotos('${n.id}','${(n.nombre||n.sku_interno).replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s"
         onmouseover="this.style.background='#fff3e0'" onmouseout="this.style.background=''">
      ${n.imagen_principal?`<img src="${n.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:5px;flex-shrink:0">`:'<div style="width:32px;height:32px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>'}
      <span style="font-size:0.83rem;font-weight:500">${n.nombre||n.sku_interno}</span>
    </div>`).join("")};window.seleccionarModeloFotos=async(e,t)=>{const o=document.getElementById("fotos-variantes-panel"),a=document.getElementById("fotos-variantes-titulo"),n=document.getElementById("fotos-variantes-grid"),i=document.getElementById("fotos-modelo-buscar");if(!(!o||!n)){i&&(i.value=t),document.getElementById("fotos-modelos-lista").innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar otro modelo...</p>',o.style.display="block",a&&(a.textContent=t+" — elige colores a enviar"),n.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando colores...</p>';try{const s=await(await fetch(f+"/variantes/producto/"+e)).json(),d={};for(const c of s)c.color&&(d[c.color]||(d[c.color]={color:c.color,color_hex:c.color_hex||null,foto_url:c.foto_url||null}),!d[c.color].foto_url&&c.foto_url&&(d[c.color].foto_url=c.foto_url));const l=Object.values(d);if(!l.length){n.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin colores registrados</p>';return}n.innerHTML=l.map(c=>{const p=he(c.foto_url),m=window._fotosSeleccionadas.some(g=>g.url===p);return`
      <div id="fotovar-${encodeURIComponent(c.color)}"
           onclick="${c.foto_url?`toggleFotoVariante('${c.foto_url}','${c.color.replace(/'/g,"\\'")}','${t.replace(/'/g,"\\'")}',this)`:""}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:1.5px solid ${m?"#25D366":"#eee"};background:${m?"#f0faf4":""};cursor:${c.foto_url?"pointer":"default"};opacity:${c.foto_url?"1":"0.4"};transition:all 0.15s">
        <div style="width:22px;height:22px;border-radius:50%;background:${c.color_hex||"#ccc"};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.83rem;font-weight:600">${c.color}</span>
        ${c.foto_url?`<img src="${c.foto_url}" style="width:52px;height:52px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`:'<span style="font-size:0.7rem;color:#bbb">sin foto</span>'}
        <span style="font-size:1.1rem">${m?"✅":"⬜"}</span>
      </div>`}).join("")}catch{n.innerHTML='<p style="font-size:0.8rem;color:red;padding:4px">Error cargando variantes</p>'}}};window.toggleFotoVariante=(e,t,o,a)=>{const n=he(e),i=window._fotosSeleccionadas.findIndex(r=>r.url===n);i>=0?(window._fotosSeleccionadas.splice(i,1),a.style.borderColor="#eee",a.style.background="",a.querySelector("span:last-child").textContent="⬜"):(window._fotosSeleccionadas.push({url:n,caption:`${o} · ${t}`,modelo:o,color:t}),a.style.borderColor="#25D366",a.style.background="#f0faf4",a.querySelector("span:last-child").textContent="✅"),Re()};function Re(){const e=document.getElementById("fotos-seleccionadas-wrap"),t=document.getElementById("fotos-seleccionadas-grid"),o=document.getElementById("fotos-count"),a=window._fotosSeleccionadas.length;if(o&&(o.textContent=a>0?`${a} foto${a>1?"s":""} seleccionada${a>1?"s":""}`:""),!(!e||!t)){if(a===0){e.style.display="none";return}e.style.display="block",t.innerHTML=window._fotosSeleccionadas.map((n,i)=>`
    <div style="position:relative;width:64px">
      <img src="${n.url}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:2px solid #25D366">
      <button onclick="quitarFotoSeleccionada(${i})"
        style="position:absolute;top:-6px;right:-6px;background:#e53e3e;color:white;border:none;border-radius:50%;width:18px;height:18px;font-size:0.65rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>
      <p style="font-size:0.6rem;color:#666;margin:2px 0 0;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:64px">${n.color}</p>
    </div>`).join("")}}window.quitarFotoSeleccionada=e=>{window._fotosSeleccionadas.splice(e,1),Re()};window.iniciarEnvioFotos=async()=>{var r,s;const e=window._envioSeleccionados||new Set,t=(window._envioClientes||[]).filter(d=>e.has(d.telefono)).map(d=>({telefono:d.telefono,nombre:d.nombre}));if(!t.length){alert("Selecciona al menos un destinatario");return}if(!window._fotosSeleccionadas.length){alert("Selecciona al menos una variante en la sección de fotos");return}const o=(((r=document.getElementById("fotos-texto"))==null?void 0:r.value)||"").trim(),a=t.length,n=window._fotosSeleccionadas.length;if(!confirm(`¿Enviar ${n} foto${n>1?"s":""} a ${a} contacto${a>1?"s":""} seleccionado${a>1?"s":""}?

⚠️ Solo llegará a quienes te hayan escrito en las últimas 24 horas.`))return;const i=document.createElement("div");i.id="fotos-overlay",i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",i.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">📸</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando fotos…</h3>
    <p style="font-size:0.82rem;color:#888">${a} contacto${a>1?"s":""} · ${n} foto${n>1?"s":""} por contacto</p>
    <p style="font-size:0.72rem;color:#e65100;margin-top:6px">⏱ Solo clientes activos (24 h)</p>
  </div>`,document.body.appendChild(i);try{const l=await(await fetch(f+"/chatbot/envio-fotos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:t,texto:o,fotos:window._fotosSeleccionadas.map(c=>({url:c.url,caption:c.caption})),delay_segundos:3})})).json();if(l.error){i.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1.5rem">${l.error}</p>
        <button onclick="document.getElementById('fotos-overlay').remove()"
          style="background:#e65100;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`;return}i.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${l.fallidos?"✅":"🎉"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${l.enviados||0} enviados</p>
      ${l.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:4px">${l.fallidos} contactos sin entregas</p>`:""}
      ${(s=l.errores)!=null&&s.length?`<p style="font-size:0.7rem;color:#aaa;margin-bottom:6px;text-align:left;max-height:80px;overflow-y:auto">${l.errores.slice(0,5).join("<br>")}</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:6px">Sin errores</p>'}
      <button onclick="document.getElementById('fotos-overlay').remove()"
        style="background:#e65100;color:white;border:none;border-radius:10px;padding:10px 28px;margin-top:8px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(d){i.remove(),alert("Error: "+d.message)}};window.cargarProductosEnvio=async()=>{if(!window._envioModelosList)try{const e=await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=500");window._envioModelosList=await e.json()}catch(e){console.error("Error cargando modelos:",e)}};window.filtrarModelosEnvio=e=>{const t=window._envioModelosList||[],o=document.getElementById("envio-modelos-lista");if(!o)return;if(!e.trim()){o.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>';return}const a=t.filter(n=>(n.nombre||"").toLowerCase().includes(e.toLowerCase())||(n.sku_interno||"").toLowerCase().includes(e.toLowerCase()));if(!a.length){o.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>';return}o.innerHTML=a.map(n=>`
    <div onclick="seleccionarModeloEnvio('${n.id}', '${(n.nombre||n.sku_interno).replace(/'/g,"'")}')"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s"
         onmouseover="this.style.background='#fff0f8'" onmouseout="this.style.background=''">
      ${n.imagen_principal?`<img src="${n.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:5px;flex-shrink:0">`:'<div style="width:32px;height:32px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>'}
      <span style="font-size:0.83rem;font-weight:500">${n.nombre||n.sku_interno}</span>
    </div>`).join("")};window.seleccionarModeloEnvio=async(e,t)=>{const o=document.getElementById("envio-variantes-panel"),a=document.getElementById("envio-variantes-titulo"),n=document.getElementById("envio-variantes-grid"),i=document.getElementById("envio-modelo-buscar");if(!o||!n)return;i&&(i.value=t);const r=document.getElementById("envio-modelos-lista");r&&(r.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar otro modelo...</p>'),o.style.display="block",a&&(a.textContent=t+" — elige el color"),n.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando colores...</p>';try{const d=await(await fetch(f+"/variantes/producto/"+e)).json(),l={};for(const p of d)p.color&&(l[p.color]||(l[p.color]={color:p.color,color_hex:p.color_hex||null,foto_url:p.foto_url||null}),!l[p.color].foto_url&&p.foto_url&&(l[p.color].foto_url=p.foto_url));const c=Object.values(l);if(!c.length){n.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin colores registrados</p>';return}n.innerHTML=c.map(p=>`
      <div onclick="${p.foto_url?`elegirVarianteEnvio('${p.foto_url}', '${t} · ${p.color}')`:""}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:1.5px solid #eee;cursor:${p.foto_url?"pointer":"default"};opacity:${p.foto_url?"1":"0.4"};transition:all 0.15s"
           onmouseover="${p.foto_url?"this.style.borderColor='#E91E8C';this.style.background='#fff0f8'":""}"
           onmouseout="${p.foto_url?"this.style.borderColor='#eee';this.style.background=''":""}">
        <div style="width:22px;height:22px;border-radius:50%;background:${p.color_hex||"#ccc"};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.83rem;font-weight:600">${p.color}</span>
        ${p.foto_url?`<img src="${p.foto_url}" style="width:52px;height:52px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`:'<span style="font-size:0.7rem;color:#bbb">sin foto</span>'}
      </div>`).join("")}catch{n.innerHTML='<p style="font-size:0.8rem;color:red;padding:4px">Error cargando variantes</p>'}};function he(e){return e!=null&&e.includes("res.cloudinary.com")?e.replace(/\/upload\/(?:[a-z]+_[^/,]+(?:,[a-z]+_[^/,]+)*\/)*/,"/upload/f_jpg,q_95,w_1200/"):e}window.elegirVarianteEnvio=(e,t)=>{var d;const o=he(e),a=document.getElementById("envio-imagen"),n=document.getElementById("envio-foto-seleccionada"),i=document.getElementById("envio-foto-img"),r=document.getElementById("envio-foto-label");a&&(a.value=o),i&&(i.src=o),r&&(r.textContent=t),n&&(n.style.display="block");const s=document.getElementById("plantilla-preview-burbuja");s&&s.textContent.startsWith("🖼️ [Imagen del producto]"),document.querySelectorAll("#envio-variantes-grid > div").forEach(l=>{l.style.borderColor="#eee",l.style.background=""}),(d=event==null?void 0:event.currentTarget)!=null&&d.closest&&(event.currentTarget.style.borderColor="#25D366")};window.quitarFotoEnvio=()=>{const e=document.getElementById("envio-imagen"),t=document.getElementById("envio-foto-seleccionada"),o=document.getElementById("envio-foto-img");e&&(e.value=""),o&&(o.src=""),t&&(t.style.display="none")};window.sincronizarColeccionesMeta=async()=>{const e=document.getElementById("btn-sync-colecciones"),t=document.getElementById("seo-colecciones-resultado");e&&(e.textContent="Sincronizando...",e.disabled=!0);try{const a=await(await fetch(f+"/catalogo/sincronizar-colecciones",{method:"POST"})).json();if(a.error)t.style.display="block",t.style.background="#ffebee",t.style.borderColor="#ef9a9a",t.innerHTML=`❌ Error: ${a.error}`;else{const n=a.resultados.filter(s=>s.accion==="creada").length,i=a.resultados.filter(s=>s.accion==="actualizada").length,r=a.resultados.filter(s=>s.accion==="error");t.style.display="block",t.style.background=r.length?"#fff8e1":"#e8f5e9",t.style.border=`1px solid ${r.length?"#ffe082":"#a5d6a7"}`,t.innerHTML=`
        ✅ <strong>${n} colecciones creadas</strong> · ${i} actualizadas
        ${r.length?`<br>⚠️ ${r.length} errores: ${r.map(s=>s.categoria+" ("+s.detalle+")").join(", ")}`:""}
        <br><small style="color:#888;margin-top:4px;display:block">${a.resultados.map(s=>`${s.categoria}: ${s.accion}`).join(" · ")}</small>
      `}}catch(o){t&&(t.style.display="block",t.style.background="#ffebee",t.innerHTML="❌ Error: "+o.message)}finally{e&&(e.textContent="🗂️ Sincronizar colecciones en Meta",e.disabled=!1)}};window.validarCantidadTalla=(e,t)=>{const o=document.getElementById("qty-"+e);if(!o)return;let a=parseInt(o.value)||0;a<0&&(a=0),a>t&&(a=t),o.value=a,o.style.borderColor=a>0?"#E91E8C":"#ddd"};window.recargarFinanzas=async e=>{await se()};window.verOportunidad=async e=>{var o;if(window._crmData)try{const n=await(await fetch(f+"/crm/oportunidades/"+e)).json(),i=Array.isArray(n)?n[0]:n;if(!i)return;const r={contacto:"📞 Contacto",interes:"👀 Interés",cotizacion:"📋 Cotización",negociacion:"🤝 Negociación",ganado:"✅ Ganado",perdido:"❌ Perdido"},s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",s.innerHTML=`
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem">
          <div>
            <h3 style="font-size:1rem;font-weight:700;margin-bottom:4px">${i.titulo}</h3>
            <p style="font-size:0.82rem;color:#888">${((o=i.clientes)==null?void 0:o.nombre)||"Sin cliente"}</p>
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Monto estimado</p>
            <p style="font-weight:700;font-size:1.1rem;color:#E91E8C">$${parseFloat(i.monto_estimado||0).toFixed(0)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Etapa</p>
            <p style="font-weight:600;font-size:0.88rem">${r[i.etapa]||i.etapa}</p>
          </div>
        </div>
        ${i.fecha_cierre?`<p style="font-size:0.82rem;color:#888;margin-bottom:1rem">📅 Cierre estimado: ${new Date(i.fecha_cierre).toLocaleDateString("es-MX")}</p>`:""}
        ${i.notas?`<div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem"><p style="font-size:0.78rem;color:#888;margin-bottom:4px">Notas</p><p style="font-size:0.85rem">${i.notas}</p></div>`:""}
        <div style="display:flex;gap:1rem;justify-content:flex-end;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="this.closest('div[style*=fixed]').remove()">Cerrar</button>
          <select class="form-input" style="flex:1" onchange="actualizarEtapaOportunidad('${i.id}', this.value)">
            ${Object.entries(r).map(([d,l])=>`<option value="${d}" ${i.etapa===d?"selected":""}>${l}</option>`).join("")}
          </select>
        </div>
      </div>
    `,document.body.appendChild(s),s.addEventListener("click",d=>{d.target===s&&s.remove()})}catch(a){console.error("Error verOportunidad",a)}};window.actualizarEtapaOportunidad=async(e,t)=>{var o;try{await fetch(f+"/crm/oportunidades/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({etapa:t})}),(o=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]'))==null||o.remove(),mostrarPipeline()}catch{alert("Error actualizando etapa")}};window.completarTareaDashboard=async(e,t)=>{try{await fetch(f+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})})}catch(o){console.error(o)}};async function st(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>';try{const[t,o]=await Promise.all([fetch(f+"/carrito-abandonado/listar").then(l=>l.json()).catch(()=>({carritos:[],stats:{}})),fetch(f+"/pedidos/pendientes").then(l=>l.json()).catch(()=>({pedidos:[]}))]),a=t.stats||{},n=t.carritos||[],i=Array.isArray(o)?o:Array.isArray(o.pedidos)?o.pedidos:[],r=l=>{try{return new Date(l).toLocaleString("es-MX",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}catch{return l}},s=l=>l.convertido?'<span style="background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">✓ Compró</span>':l.recordatorio_enviado?'<span style="background:#e3f2fd;color:#1565c0;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">📧 Avisado</span>':'<span style="background:#fff3cd;color:#856404;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">⏳ Sin avisar</span>',d=l=>{const c={oxxo:"#e63946",spei:"#0a7c3e",tarjeta:"#1a56db",mercadopago:"#009ee3"}[l==null?void 0:l.toLowerCase()]||"#888";return`<span style="background:${c}18;color:${c};padding:2px 9px;border-radius:12px;font-size:0.7rem;font-weight:700;text-transform:uppercase">${l||"—"}</span>`};e.innerHTML=`
      <div style="max-width:960px">
        <h3 style="margin-bottom:0.25rem">🛒 Seguimiento de pagos pendientes</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem">
          Clientes que no completaron su pago — ya sea por carrito abandonado o pedido OXXO/SPEI sin acreditar.
        </p>

        <!-- Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:1.25rem;border-bottom:2px solid var(--border);padding-bottom:0">
          <button id="tab-pp" onclick="switchTabPagos('pp')"
            style="padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px">
            💳 OXXO / SPEI sin pagar (${i.length})
          </button>
          <button id="tab-ca" onclick="switchTabPagos('ca')"
            style="padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px">
            🛒 Carritos abandonados (${n.filter(l=>!l.convertido).length})
          </button>
        </div>

        <!-- Tab: Pedidos OXXO/SPEI pendientes -->
        <div id="panel-pp">
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div style="font-size:0.8rem;color:#856404">
              <strong>💬 WhatsApp requiere plantilla aprobada.</strong> Si el botón "WhatsApp" no envía, crea la plantilla primero (solo se hace una vez).
            </div>
            <button onclick="crearPlantillaPago(this)" style="padding:6px 14px;border-radius:20px;border:1.5px solid #d97706;background:none;color:#92400e;font-size:0.75rem;font-weight:700;cursor:pointer;white-space:nowrap">
              ⚙️ Crear plantilla en Meta
            </button>
          </div>
          ${i.length===0?'<div class="table-card" style="padding:2rem;text-align:center;color:var(--text-muted)">No hay pedidos pendientes de pago 🎉</div>':`<div class="table-card" style="padding:0;overflow:hidden">
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                <thead>
                  <tr style="text-align:left;border-bottom:2px solid var(--border);background:var(--bg)">
                    <th style="padding:10px 14px">Cliente</th>
                    <th style="padding:10px 14px">Total</th>
                    <th style="padding:10px 14px">Método</th>
                    <th style="padding:10px 14px">Hace</th>
                    <th style="padding:10px 14px">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${i.map(l=>{const c=l.nombre_cliente||"—",p=l.email_cliente||"",m=l.telefono_cliente||"",g=l.horas_pendiente!=null?l.horas_pendiente<1?"hace &lt;1h":`hace ${l.horas_pendiente}h`:"—",u=!!l.recordatorio_pago_enviado_at;return`<tr data-pedido-id="${l.id}" style="border-bottom:1px solid var(--border)">
                      <td style="padding:10px 14px">
                        <div style="font-weight:600">${c}</div>
                        ${p?`<div style="font-size:0.75rem;color:var(--text-muted)">${p}</div>`:""}
                        ${m?`<div style="font-size:0.75rem;color:var(--text-muted)">${m}</div>`:""}
                      </td>
                      <td style="padding:10px 14px;font-weight:700">$${parseFloat(l.total||0).toFixed(0)}</td>
                      <td style="padding:10px 14px">${d(l.forma_pago)}</td>
                      <td style="padding:10px 14px;color:var(--text-muted);font-size:0.8rem">${g}<br><span style="font-size:0.7rem">${r(l.created_at)}</span></td>
                      <td style="padding:10px 14px">
                        <div style="display:flex;gap:6px;flex-wrap:wrap">
                          ${p?`<button onclick="enviarRecordatorioEmail('${l.id}', this, '${(l.nombre_cliente||"").split(" ")[0]}', '${parseFloat(l.total||0).toFixed(0)}', '${(l.forma_pago||"OXXO/SPEI").toUpperCase()}')" style="padding:5px 12px;border-radius:20px;border:1.5px solid #1a56db;background:none;color:#1a56db;font-size:0.75rem;font-weight:600;cursor:pointer">📧 Email</button>`:""}
                          ${m?`<button onclick="enviarRecordatorioWA('${l.id}', this, '${(l.nombre_cliente||"").split(" ")[0]}', '${parseFloat(l.total||0).toFixed(0)}', '${(l.forma_pago||"OXXO/SPEI").toUpperCase()}')" style="padding:5px 12px;border-radius:20px;border:1.5px solid #25D366;background:none;color:#15803d;font-size:0.75rem;font-weight:600;cursor:pointer">💬 WhatsApp</button>`:""}
                        </div>
                        ${u?`<div style="font-size:0.68rem;color:#aaa;margin-top:4px">Avisado ${r(l.recordatorio_pago_enviado_at)}</div>`:""}
                      </td>
                    </tr>`}).join("")}
                </tbody>
              </table>
            </div>
          </div>`}
        </div>

        <!-- Tab: Carritos abandonados -->
        <div id="panel-ca" style="display:none">
          <div class="table-card" style="padding:1.25rem;margin-bottom:1rem">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:1.25rem">
              <div style="background:var(--bg);border-radius:10px;padding:14px;text-align:center;border:1px solid var(--border)">
                <div style="font-size:1.6rem;font-weight:700">${a.total||0}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">Total</div>
              </div>
              <div style="background:#fffbeb;border-radius:10px;padding:14px;text-align:center;border:1px solid #fde68a">
                <div style="font-size:1.6rem;font-weight:700;color:#856404">${a.pendientes||0}</div>
                <div style="font-size:0.72rem;color:#856404">Sin avisar</div>
              </div>
              <div style="background:#eff6ff;border-radius:10px;padding:14px;text-align:center;border:1px solid #bfdbfe">
                <div style="font-size:1.6rem;font-weight:700;color:#1565c0">${a.enviados||0}</div>
                <div style="font-size:0.72rem;color:#1565c0">Avisados</div>
              </div>
              <div style="background:#f0fdf4;border-radius:10px;padding:14px;text-align:center;border:1px solid #bbf7d0">
                <div style="font-size:1.6rem;font-weight:700;color:#15803d">${a.convertidos||0}</div>
                <div style="font-size:0.72rem;color:#15803d">Compraron</div>
              </div>
            </div>
            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px;margin-bottom:1.25rem;font-size:0.82rem;color:#0369a1">
              <strong>Recordatorio automático:</strong> se envía 1 hora después de inactividad.<br>
              Copia BCC a <strong>olivr47@gmail.com</strong> · Verifica en <a href="https://resend.com/emails" target="_blank" style="color:#0369a1;font-weight:600">resend.com/emails</a>
              <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                <input id="ca-test-email" type="email" placeholder="correo de prueba"
                  style="border:1.5px solid #bae6fd;border-radius:8px;padding:8px 12px;font-size:0.82rem;flex:1;min-width:180px;outline:none">
                <button class="btn btn-primary" onclick="probarRecordatorio()" style="font-size:0.82rem">📧 Prueba</button>
              </div>
              <div id="ca-test-msg" style="margin-top:8px;font-size:0.8rem"></div>
            </div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                <thead>
                  <tr style="text-align:left;border-bottom:2px solid var(--border)">
                    <th style="padding:8px">Email / Nombre</th>
                    <th style="padding:8px">Total</th>
                    <th style="padding:8px">Última actividad</th>
                    <th style="padding:8px">Estado</th>
                    <th style="padding:8px">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${n.length?n.map(l=>`
                      <tr style="border-bottom:1px solid var(--border)">
                        <td style="padding:8px">${l.email}${l.nombre?`<br><span style="color:var(--text-muted);font-size:0.75rem">${l.nombre}</span>`:""}</td>
                        <td style="padding:8px;font-weight:600">$${parseFloat(l.total||0).toFixed(0)}</td>
                        <td style="padding:8px;color:var(--text-muted)">${r(l.updated_at)}</td>
                        <td style="padding:8px">${s(l)}</td>
                        <td style="padding:8px">
                          ${l.convertido?"":`<button onclick="enviarWACarrito('${l.id}', this)" style="padding:5px 12px;border-radius:20px;border:1.5px solid #25D366;background:none;color:#15803d;font-size:0.75rem;font-weight:600;cursor:pointer">💬 WhatsApp</button>`}
                        </td>
                      </tr>`).join(""):'<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-muted)">Aún no hay carritos abandonados registrados</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`}catch(t){document.getElementById("content").innerHTML=`<p style="padding:2rem;color:red">Error: ${t.message}</p>`}}window.switchTabPagos=function(e){document.getElementById("panel-pp").style.display=e==="pp"?"block":"none",document.getElementById("panel-ca").style.display=e==="ca"?"block":"none",document.getElementById("tab-pp").style.cssText=e==="pp"?"padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px":"padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px",document.getElementById("tab-ca").style.cssText=e==="ca"?"padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px":"padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px"};window.enviarWACarrito=async function(e,t){const o=t.textContent;t.disabled=!0,t.textContent="Enviando...";try{const n=await(await fetch(f+`/carrito-abandonado/${e}/whatsapp`,{method:"POST"})).json();n.ok?(t.textContent="✅ Enviado",t.style.borderColor="#15803d",t.style.color="#15803d"):(t.textContent=o,t.disabled=!1,alert("Error: "+(n.error||"No se pudo enviar")))}catch{t.textContent=o,t.disabled=!1}};window.abrirModalRecordatorio=async function(e,t,o,a,n){var c;const i=t==="wa",r=i?"":`Hola ${o}, te recordamos que tienes un pedido de $${a} MXN pendiente de pago vía ${n}.

Cuando realices el pago lo procesamos de inmediato. Si tienes alguna duda estamos para ayudarte 😊`;(c=document.getElementById("modal-recordatorio"))==null||c.remove();let s="",d=[];if(i){try{d=await(await fetch(f+"/chatbot/plantillas")).json(),Array.isArray(d)||(d=[])}catch{d=[]}d.length?s=`
        <div style="margin-bottom:10px">
          <label style="font-size:0.78rem;color:#555;font-weight:600;display:block;margin-bottom:4px">Plantilla a usar:</label>
          <select id="modal-wa-plantilla" style="width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:7px 10px;font-size:0.83rem">
            ${d.map(m=>`<option value="${m.name}" data-idioma="${m.language||"es_MX"}">${m.name} (${m.language||"es_MX"})</option>`).join("")}
          </select>
        </div>`:s=`<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:0.78rem;color:#856404">
        ⚠️ No se encontraron plantillas aprobadas. Usa el botón <strong>"⚙️ Crear plantilla en Meta"</strong> y espera la aprobación.
      </div>`}const l=document.createElement("div");l.id="modal-recordatorio",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:#fff;border-radius:16px;padding:1.5rem;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <h3 style="margin:0;font-size:1rem;font-weight:700">${i?"💬 Recordatorio por WhatsApp":"📧 Recordatorio por Email"}</h3>
        <button onclick="document.getElementById('modal-recordatorio').remove()" style="border:none;background:none;font-size:1.3rem;cursor:pointer;color:#888;line-height:1">×</button>
      </div>

      ${i?`
        ${s}
        <div style="background:#e8f5e9;border:1px solid #a5d6a7;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:0.76rem;color:#2e7d32;line-height:1.5">
          <strong>WhatsApp solo entrega mensajes fuera de 24h si usas una plantilla UTILITY aprobada.</strong><br>
          Si el cliente te escribió hace menos de 24h puedes usar texto libre — si no, se requiere plantilla.
        </div>
      `:`
        <p style="font-size:0.78rem;color:#888;margin-bottom:8px">Edita el mensaje antes de enviarlo:</p>
        <textarea id="modal-recordatorio-msg" rows="6"
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:0.85rem;line-height:1.6;resize:vertical;font-family:inherit;box-sizing:border-box"
        >${r}</textarea>
      `}

      <div id="modal-recordatorio-error" style="display:none;margin-top:8px;background:#ffebee;border:1px solid #ef9a9a;border-radius:8px;padding:8px 12px;font-size:0.78rem;color:#c62828"></div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1rem">
        <button onclick="document.getElementById('modal-recordatorio').remove()"
          style="padding:8px 18px;border-radius:20px;border:1.5px solid #e5e7eb;background:none;color:#666;font-size:0.82rem;cursor:pointer">
          Cancelar
        </button>
        <button id="modal-recordatorio-btn" onclick="enviarRecordatorioConfirmado('${e}','${t}')"
          style="padding:8px 18px;border-radius:20px;border:none;background:${i?"#25D366":"#1a56db"};color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer">
          ${i?"💬 Enviar por WhatsApp":"📧 Enviar Email"}
        </button>
      </div>
    </div>`,document.body.appendChild(l),l.addEventListener("click",p=>{p.target===l&&l.remove()})};window.enviarRecordatorioConfirmado=async function(e,t){var r,s,d,l,c;const o=document.getElementById("modal-recordatorio-btn"),a=document.getElementById("modal-recordatorio-error");if(!o)return;o.disabled=!0,o.textContent="Enviando...",a&&(a.style.display="none");const n=t==="wa"?f+`/pedidos/${e}/recordatorio-whatsapp`:f+`/pedidos/${e}/recordatorio-email`;let i={};if(t==="wa"){const p=document.getElementById("modal-wa-plantilla");p&&(i.plantilla=p.value,i.idioma=((s=(r=p.selectedOptions[0])==null?void 0:r.dataset)==null?void 0:s.idioma)||"es_MX")}else i.mensaje=((l=(d=document.getElementById("modal-recordatorio-msg"))==null?void 0:d.value)==null?void 0:l.trim())||"";try{const m=await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();m.ok?((c=document.getElementById("modal-recordatorio"))==null||c.remove(),document.querySelectorAll(`[data-pedido-id="${e}"]`).forEach(u=>u.style.opacity="0.5")):(o.disabled=!1,o.textContent=t==="wa"?"💬 Enviar por WhatsApp":"📧 Enviar Email",a&&(a.textContent=m.error||"No se pudo enviar",a.style.display="block"))}catch(p){o.disabled=!1,o.textContent=t==="wa"?"💬 Enviar por WhatsApp":"📧 Enviar Email",a&&(a.textContent="Error de red: "+p.message,a.style.display="block")}};window.enviarRecordatorioEmail=(e,t,o,a,n)=>window.abrirModalRecordatorio(e,"email",o,a,n);window.enviarRecordatorioWA=(e,t,o,a,n)=>window.abrirModalRecordatorio(e,"wa",o,a,n);window.crearPlantillaCatalogo=async function(e){const t=e.textContent;e.disabled=!0,e.textContent="Creando...";try{const a=await(await fetch(f+"/chatbot/crear-plantilla-catalogo",{method:"POST"})).json();a.ok?(e.textContent="✅ Enviada a Meta",e.style.borderColor="#16a34a",e.style.color="#15803d",alert('Plantilla "catalogo_disponible" enviada a Meta para revisión como UTILITY. Una vez aprobada (minutos/horas), selecciónala en la pestaña Campaña para enviar sin restricción de 24h.')):(e.disabled=!1,e.textContent=t,alert("Error: "+(a.error||JSON.stringify(a))))}catch(o){e.disabled=!1,e.textContent=t,alert("Error de red: "+o.message)}};window.crearPlantillaPago=async function(e){const t=e.textContent;e.disabled=!0,e.textContent="Creando...";try{const a=await(await fetch(f+"/chatbot/crear-plantilla-pago",{method:"POST"})).json();a.ok?(e.textContent="✅ Plantilla enviada a Meta",e.style.borderColor="#16a34a",e.style.color="#15803d",alert("Plantilla enviada a Meta para revisión. Puede tardar unos minutos en aprobarse. Una vez APROBADA, el botón WhatsApp funcionará.")):(e.textContent="❌ Error",e.disabled=!1,alert("Error: "+(a.error||JSON.stringify(a))))}catch(o){e.textContent=t,e.disabled=!1,alert("Error de red: "+o.message)}};window.probarRecordatorio=async function(){const e=(document.getElementById("ca-test-email").value||"").trim(),t=document.getElementById("ca-test-msg");t.textContent="Enviando...";try{const a=await(await fetch(f+"/carrito-abandonado/test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})})).json();a.ok?(t.style.color="#15803d",t.innerHTML=`✅ Correo de prueba enviado a <strong>${a.enviado_a}</strong>. Revisa tu bandeja (y spam).`):(t.style.color="#c62828",t.textContent=a.resend_configurado===!1?"❌ Falta configurar RESEND_API_KEY en Railway":"❌ No se pudo enviar")}catch(o){t.style.color="#c62828",t.textContent="❌ Error: "+o.message}};async function dt(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>';try{const o=await(await fetch(f+"/config/envio")).json();e.innerHTML=`
      <div style="max-width:560px">
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.25rem">🚚 Configuración de Envíos</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Define el costo de envío y a partir de cuánto es gratis. Se aplica automáticamente en el carrito de la tienda.
          </p>

          <div style="display:grid;gap:1.2rem">

            <div style="background:var(--bg);border-radius:10px;padding:1rem;border:1px solid var(--border)">
              <p style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:0.75rem">Tarifas por número de pares</p>
              <div style="display:grid;gap:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">1 par</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier1" value="${o.tier1??99}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">2 pares</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier2" value="${o.tier2??150}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">3+ pares</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier3" value="${o.tier3??199}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
              </div>
            </div>

            <div>
              <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:0.4rem">
                Envío gratis a partir de
              </label>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:var(--text-muted)">$</span>
                <input type="number" id="envio-gratis-desde" value="${o.gratis_desde??1299}"
                  min="0" step="1"
                  style="border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;font-size:0.95rem;width:160px;outline:none">
                <span style="font-size:0.82rem;color:var(--text-muted)">MXN de compra</span>
              </div>
            </div>

            <div style="background:#f0fdf4;border-radius:10px;padding:1rem;font-size:0.82rem;color:#166534;border:1px solid #bbf7d0">
              <strong style="display:block;margin-bottom:6px">📋 Resumen actual:</strong>
              <div>1 par → <strong id="prev-t1">$${o.tier1??99}</strong> MXN</div>
              <div>2 pares → <strong id="prev-t2">$${o.tier2??150}</strong> MXN</div>
              <div>3+ pares → <strong id="prev-t3">$${o.tier3??199}</strong> MXN</div>
              <div style="margin-top:6px;padding-top:6px;border-top:1px solid #bbf7d0">
                Pedidos ≥ <strong id="prev-gratis">$${o.gratis_desde??1299}</strong> MXN → <strong style="color:#15803d">Envío gratis 🎉</strong>
              </div>
            </div>

            <div id="envio-msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.85rem"></div>

            <div>
              <button class="btn btn-primary" onclick="guardarEnvio()">💾 Guardar configuración</button>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:1.5rem">
          <h4 style="margin-bottom:0.5rem">📦 Paqueterías que usas</h4>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">
            Referencia para tu equipo al hacer los envíos. Actualmente no integradas con tarifas automáticas.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="background:#e8f4fd;color:#0066cc;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">FedEx</span>
            <span style="background:#fff3cd;color:#856404;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">DHL</span>
            <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">Estafeta</span>
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:10px">
            ¿Quieres calcular tarifas automáticas por código postal? Podemos integrar la API de Estafeta o FedEx en el futuro.
          </p>
        </div>
      </div>`,Object.entries({"envio-tier1":"prev-t1","envio-tier2":"prev-t2","envio-tier3":"prev-t3","envio-gratis-desde":"prev-gratis"}).forEach(([n,i])=>{const r=document.getElementById(n);r&&r.addEventListener("input",s=>{const d=document.getElementById(i);d&&(d.textContent="$"+(s.target.value||0))})})}catch(t){document.getElementById("content").innerHTML=`<p style="padding:2rem;color:red">Error: ${t.message}</p>`}}window.guardarEnvio=async function(){const e=parseFloat(document.getElementById("envio-tier1").value),t=parseFloat(document.getElementById("envio-tier2").value),o=parseFloat(document.getElementById("envio-tier3").value),a=parseFloat(document.getElementById("envio-gratis-desde").value);if([e,t,o,a].some(isNaN))return;const n=document.getElementById("envio-msg");try{const r=await(await fetch(f+"/config/envio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tier1:e,tier2:t,tier3:o,gratis_desde:a})})).json();n.style.display="",r.ok?(n.style.background="#e8f5e9",n.style.color="#2e7d32",n.textContent="✅ Configuración guardada correctamente"):(n.style.background="#fdecea",n.style.color="#c62828",n.textContent="❌ Error: "+(r.error||"desconocido")),setTimeout(()=>{n.style.display="none"},3e3)}catch{n.style.display="",n.style.background="#fdecea",n.style.color="#c62828",n.textContent="❌ Error al guardar"}};async function lt(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>';try{const o=await(await fetch(f+"/seo/config")).json(),a={};o.forEach(n=>a[n.clave]=n.valor||""),e.innerHTML=`
      <div style="max-width:800px">
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1rem">🗂️ Colecciones WhatsApp</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Crea automáticamente las colecciones por categoría en el catálogo de Meta (Tacones, Sandalias, Botas, etc.) para que los clientes puedan navegar desde WhatsApp.</p>
          <div id="seo-colecciones-resultado" style="display:none;margin-bottom:1rem;padding:1rem;border-radius:8px;font-size:0.82rem"></div>
          <button onclick="sincronizarColeccionesMeta()" class="btn btn-primary" id="btn-sync-colecciones">🗂️ Sincronizar colecciones en Meta</button>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🟡 MercadoLibre — Inventario</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Sincroniza el stock de tus <b>96 publicaciones</b> de MercadoLibre con el ERP.<br>
            Primero verifica las diferencias y luego sincroniza.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
            <button onclick="mlVerStock(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#f59e0b;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🔍 Ver diferencias ERP vs ML
            </button>
            <button onclick="mlSincronizar(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#10B981;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🔄 Sincronizar stock ahora
            </button>
            <button onclick="mlVerLog(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#6366f1;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📋 Ver resultado
            </button>
          </div>
          <div id="ml-resultado" style="display:none;margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;font-size:0.82rem;max-height:320px;overflow-y:auto;white-space:pre-wrap;font-family:monospace"></div>
        </div>

        <!-- ── MercadoLibre: Publicar nuevo estilo ── -->
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🟡 MercadoLibre — Publicar nuevo estilo</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Crea publicaciones individuales por variante (color+talla) directo desde el ERP.
            Usa <b>Solo preview</b> para revisar el payload antes de publicar.
          </p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div>
              <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">SKU del producto</label>
              <input id="ml-pub-sku" type="text" placeholder="Ej: M-TAC-0022"
                style="width:100%;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;background:var(--bg-primary);color:var(--text-primary)">
            </div>
            <div>
              <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">Tipo de listing</label>
              <select id="ml-pub-listing"
                style="width:100%;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;background:var(--bg-primary);color:var(--text-primary)">
                <option value="free">Gratis (free)</option>
                <option value="bronze">Bronce</option>
                <option value="silver">Plata</option>
                <option value="gold_pro" selected>Oro Pro (como los actuales)</option>
              </select>
            </div>
          </div>

          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
            <button onclick="mlPublicarPreview(this)"
              style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#0284c7;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              👁️ Solo preview (sin publicar)
            </button>
            <button onclick="mlPublicarReal(this)"
              style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#16a34a;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🚀 Publicar en ML
            </button>
          </div>
          <div id="ml-pub-resultado" style="display:none;margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;font-size:0.82rem;max-height:500px;overflow-y:auto;white-space:pre-wrap;font-family:monospace"></div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🎵 TikTok Shop — Sincronización</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Descarga los archivos Excel listos para subir al <b>TikTok Shop Seller Center</b>.<br>
            <b>Paso 1:</b> Importa todos los productos (primera vez).<br>
            <b>Paso 2:</b> Actualiza el stock cuando cambie tu inventario.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <button onclick="descargarExcelTikTok(this,'import-excel','tiktok_importacion.csv')"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#6366f1;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📥 Descargar Excel de Importación
            </button>
            <button onclick="descargarExcelTikTok(this,'stock-excel','tiktok_stock.csv')"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#10B981;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📊 Descargar Excel de Stock
            </button>
          </div>
          <div style="margin-top:1rem;padding:0.8rem;background:var(--bg-secondary);border-radius:8px;font-size:0.78rem;color:var(--text-muted)">
            <b>Cómo usar:</b>
            1. Elimina los productos actuales en TikTok Shop.
            2. Descarga "Excel de Importación" → súbelo en <i>Gestionar productos → Agregar producto</i>.
            3. Cuando cambie tu stock, descarga "Excel de Stock" y súbelo en <i>Administrar existencias → Reabastecer en lote</i>.
          </div>
        </div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">SEO General</h3>
          <div style="display:grid;gap:1rem">
            <div>
              <label class="form-label">Meta titulo (home)</label>
              <input class="form-input" id="seo-titulo" value="${a.meta_titulo_home}" placeholder="Zapatillas May | Calzado de Moda...">
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 50-60 caracteres. Actual: <span id="seo-titulo-count">${a.meta_titulo_home.length}</span></p>
            </div>
            <div>
              <label class="form-label">Meta descripcion (home)</label>
              <textarea class="form-input" id="seo-desc" rows="3" placeholder="Descripcion para Google...">${a.meta_descripcion_home}</textarea>
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 150-160 caracteres. Actual: <span id="seo-desc-count">${a.meta_descripcion_home.length}</span></p>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Analiticas y Pixels</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Google Analytics ID</label>
              <input class="form-input" id="seo-ga" value="${a.google_analytics_id}" placeholder="G-XXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Facebook Pixel ID</label>
              <input class="form-input" id="seo-fb" value="${a.facebook_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Search Console (verification)</label>
              <input class="form-input" id="seo-gsc" value="${a.google_search_console||""}" placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Tag Manager ID</label>
              <input class="form-input" id="seo-gtm" value="${a.google_tag_manager||""}" placeholder="GTM-XXXXXXX">
            </div>
            <div>
              <label class="form-label">TikTok Pixel ID</label>
              <input class="form-input" id="seo-tt" value="${a.tiktok_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">WhatsApp flotante</label>
              <input class="form-input" id="seo-wa" value="${a.whatsapp_flotante}" placeholder="524771234567">
            </div>
          </div>
        </div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
  <h3 style="margin-bottom:1.5rem">Imagen Hero (portada)</h3>
  <div style="display:grid;gap:1rem">
    <div>
      <label class="form-label">URL de imagen de fondo</label>
      <input class="form-input" id="seo-hero-img" value="${(a.hero_imagen||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
      <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Pega la URL de Cloudinary de la imagen que quieres como fondo de la portada</p>
    </div>
    ${(a.hero_imagen||"")!==""?'<img src="'+(a.hero_imagen||"")+'" style="max-height:160px;object-fit:cover;border-radius:8px;border:1px solid #eee">':""}
  </div>
</div>
<div>
  <label class="form-label">URL Favicon</label>
  <input class="form-input" id="seo-favicon" value="${(a.favicon_url||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
  <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Icono que aparece en la pestaña del navegador (recomendado 32x32px)</p>
</div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Redes Sociales</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Instagram URL</label>
              <input class="form-input" id="seo-ig" value="${a.instagram_url}" placeholder="https://instagram.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">Facebook URL</label>
              <input class="form-input" id="seo-fb-url" value="${a.facebook_url}" placeholder="https://facebook.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">TikTok URL</label>
              <input class="form-input" id="seo-tt-url" value="${a.tiktok_url}" placeholder="https://tiktok.com/@zapatillasmay">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Horarios</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Lunes</label>
              <input class="form-input" id="seo-hor-lunes" value="${a.horario_lunes||"10:00 - 15:00"}" placeholder="10:00 - 15:00">
            </div>
            <div>
              <label class="form-label">Martes a Viernes</label>
              <input class="form-input" id="seo-hor1" value="${a.horario_semana}" placeholder="10:00 - 19:00">
            </div>
            <div>
              <label class="form-label">Sabado</label>
              <input class="form-input" id="seo-hor2" value="${a.horario_sabado}" placeholder="10:00 - 15:00">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
  <h3 style="margin-bottom:1rem">Herramientas y Feeds</h3>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <a href="https://zapatillasmay-production.up.railway.app/sitemap.xml" target="_blank" class="btn btn-secondary">🗺️ Sitemap.xml</a>
    <a href="https://zapatillasmay-production.up.railway.app/robots.txt" target="_blank" class="btn btn-secondary">🤖 Robots.txt</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/meta.xml" target="_blank" class="btn btn-secondary">📘 Feed Meta</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/google.xml" target="_blank" class="btn btn-secondary">🛍️ Feed Google</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/tiktok.json" target="_blank" class="btn btn-secondary">🎵 Feed TikTok</a>
    <a href="https://search.google.com/search-console" target="_blank" class="btn btn-secondary">Google Search Console</a>
    <a href="https://search.google.com/test/rich-results" target="_blank" class="btn btn-secondary">Probar Schema</a>
  </div>
</div>

        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="guardarSEO()">Guardar configuracion</button>
        </div>
      </div>
    `,document.getElementById("seo-titulo").addEventListener("input",function(){document.getElementById("seo-titulo-count").textContent=this.value.length}),document.getElementById("seo-desc").addEventListener("input",function(){document.getElementById("seo-desc-count").textContent=this.value.length})}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.guardarSEO=async()=>{const e={favicon_url:document.getElementById("seo-favicon").value,hero_imagen:document.getElementById("seo-hero-img").value,meta_titulo_home:document.getElementById("seo-titulo").value,meta_descripcion_home:document.getElementById("seo-desc").value,google_analytics_id:document.getElementById("seo-ga").value,google_search_console:document.getElementById("seo-gsc").value,google_tag_manager:document.getElementById("seo-gtm").value,facebook_pixel_id:document.getElementById("seo-fb").value,tiktok_pixel_id:document.getElementById("seo-tt").value,whatsapp_flotante:document.getElementById("seo-wa").value,instagram_url:document.getElementById("seo-ig").value,facebook_url:document.getElementById("seo-fb-url").value,tiktok_url:document.getElementById("seo-tt-url").value,horario_lunes:document.getElementById("seo-hor-lunes").value,horario_semana:document.getElementById("seo-hor1").value,horario_sabado:document.getElementById("seo-hor2").value};try{(await fetch(f+"/seo/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?alert("Configuracion SEO guardada correctamente"):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};async function xe(){const e=document.getElementById("content");try{const o=await(await fetch(f+"/catalogos/todos")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Catálogos (${o.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCatalogo()">+ Nuevo catálogo</button>
        </div>
        <div id="catalogos-form-area"></div>

        <!-- Catálogos por categoría -->
        <div style="background:#fef9f5;border:1px solid #fde8d8;border-radius:12px;padding:16px;margin-bottom:20px">
          <p style="font-size:0.85rem;font-weight:700;color:#7c3a1a;margin-bottom:4px">📥 Descargar catálogo por categoría</p>
          <p style="font-size:0.78rem;color:#A07860;margin-bottom:12px">Genera un PDF con todos los productos activos de esa categoría. Se actualiza automáticamente.</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px" id="cat-pdf-btns">
            ${[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["botas","🥾 Botas"],["botines","👢 Botines"],["flats","🥿 Flats"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]].map(([a,n])=>`<button onclick="descargarCatalogoPorCategoria('${a}','${n}')" style="background:white;border:1.5px solid #C8967A;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:600;color:#7c3a1a;cursor:pointer">${n}</button>`).join("")}
          </div>
          <p id="cat-pdf-msg" style="font-size:0.78rem;color:#C8967A;margin-top:10px;display:none"></p>
        </div>
        ${o.length===0?`
          <div style="padding:3rem;text-align:center;color:#888">
            <div style="font-size:2.5rem;margin-bottom:12px">📖</div>
            <p>Aún no tienes catálogos. ¡Crea el primero!</p>
          </div>`:`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;padding:8px 0 4px">
          ${o.map(a=>`
            <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
              ${a.portada_url?`<img src="${a.portada_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">`:'<div style="width:100%;aspect-ratio:3/4;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:3rem">📖</div>'}
              <div style="padding:14px">
                ${a.temporada?`<p style="font-size:0.68rem;letter-spacing:2px;color:#C8967A;text-transform:uppercase;margin-bottom:4px">${a.temporada}</p>`:""}
                <p style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${a.nombre}</p>
                <p style="font-size:0.75rem;color:#888;margin-bottom:12px">${a.activo?"✅ Visible":"🔴 Oculto"}</p>
                <div style="display:flex;flex-direction:column;gap:6px">
                  <button class="btn btn-primary" style="padding:6px;font-size:0.8rem" onclick="gestionarPaginas('${a.id}','${(a.nombre||"").replace(/'/g,"\\'")}')">📄 Gestionar páginas</button>
                  <button class="btn btn-secondary" style="padding:6px;font-size:0.8rem" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${a.id}','_blank')">👁 Vista previa</button>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem" onclick="mostrarFormCatalogo('${a.id}')">✏️ Editar</button>
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem;color:${a.activo?"#dc2626":"#16a34a"}" onclick="toggleCatalogo('${a.id}',${a.activo})">${a.activo?"Ocultar":"Publicar"}</button>
                  </div>
                </div>
              </div>
            </div>`).join("")}
        </div>`}
      </div>`}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error cargando catálogos: '+t.message+"</p>"}}window.mostrarFormCatalogo=function(e=null){const t=document.getElementById("catalogos-form-area");t&&(t.innerHTML=`
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:20px">
      <h4 style="margin-bottom:16px;font-size:0.95rem">${e?"✏️ Editar catálogo":"➕ Nuevo catálogo"}</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Nombre *</label>
          <input class="form-input" id="cat-nombre" placeholder="Ej: Colección Primavera 2026" style="width:100%">
        </div>
        <div>
          <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Temporada</label>
          <input class="form-input" id="cat-temporada" placeholder="Ej: PV26" style="width:100%">
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Imagen de portada</label>
        <div style="display:flex;align-items:center;gap:10px">
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:0.8rem" onclick="document.getElementById('cat-portada-file').click()">📁 Subir imagen</button>
          <input type="file" id="cat-portada-file" accept="image/*" style="display:none" onchange="previewPortadaCat(this)">
          <span id="cat-portada-nombre" style="font-size:0.8rem;color:#888">Ningún archivo seleccionado</span>
        </div>
        <div id="cat-portada-preview" style="margin-top:8px"></div>
        <input type="hidden" id="cat-portada-url" value="">
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" onclick="guardarCatalogo('${e||""}')">💾 Guardar</button>
        <button class="btn btn-secondary" onclick="document.getElementById('catalogos-form-area').innerHTML=''">Cancelar</button>
      </div>
    </div>`,e&&fetch(f+"/catalogos/"+e).then(o=>o.json()).then(o=>{const a=Array.isArray(o)?o[0]:o;a&&(document.getElementById("cat-nombre").value=a.nombre||"",document.getElementById("cat-temporada").value=a.temporada||"",a.portada_url&&(document.getElementById("cat-portada-url").value=a.portada_url,document.getElementById("cat-portada-nombre").textContent="Portada actual",document.getElementById("cat-portada-preview").innerHTML=`<img src="${a.portada_url}" style="height:80px;border-radius:6px;object-fit:cover">`))}))};window.previewPortadaCat=function(e){const t=e.files[0];if(!t)return;document.getElementById("cat-portada-nombre").textContent=t.name;const o=new FileReader;o.onload=a=>{document.getElementById("cat-portada-preview").innerHTML=`<img src="${a.target.result}" style="height:80px;border-radius:6px;object-fit:cover">`},o.readAsDataURL(t)};window.guardarCatalogo=async function(e){const t=document.getElementById("cat-nombre").value.trim();if(!t){alert("El nombre es obligatorio");return}const o=document.getElementById("cat-temporada").value.trim();let a=document.getElementById("cat-portada-url").value;const n=document.getElementById("cat-portada-file");if(n.files.length>0){const r=new FormData;r.append("archivo",n.files[0]),r.append("carpeta","catalogos");try{a=(await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:r})).json()).url||a}catch(s){alert("Error subiendo portada: "+s.message);return}}const i={nombre:t,temporada:o,portada_url:a||null};try{e?await fetch(f+"/catalogos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}):await fetch(f+"/catalogos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),await xe()}catch(r){alert("Error guardando: "+r.message)}};window.toggleCatalogo=async function(e,t){confirm(t?"¿Ocultar este catálogo de la tienda?":"¿Publicar este catálogo en la tienda?")&&(await fetch(f+"/catalogos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({activo:!t})}),await xe())};window.gestionarPaginas=async function(e,t){const o=document.getElementById("content");o.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[a,n]=await Promise.all([fetch(f+"/catalogos/"+e),fetch(f+"/catalogos/"+e+"/paginas")]),i=await a.json(),r=Array.isArray(i)?i[0]:i,s=await n.json();window._catalogoPaginasData={catalogoId:e,nombre:t,paginas:s,tabActiva:"subir",portada_url:(r==null?void 0:r.portada_url)||null},ct()}catch(a){o.innerHTML='<p style="padding:2rem;color:red">Error: '+a.message+"</p>"}};function me(e,t){return`padding:9px 18px;font-size:0.83rem;font-weight:600;border:none;cursor:pointer;border-bottom:3px solid ${e===t?"#C8967A":"transparent"};background:none;color:${e===t?"#C8967A":"#6b7280"};transition:all 0.2s;font-family:inherit`}function ct(){const{catalogoId:e,nombre:t,paginas:o,tabActiva:a,portada_url:n}=window._catalogoPaginasData,i=document.getElementById("content");o.length>0&&Math.max(...o.map(r=>r.pagina_numero))+1,i.innerHTML=`
    <div class="table-card">
      <div class="table-header">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem" onclick="navegarA('catalogos')">← Catálogos</button>
          <h3>📖 ${t} <span style="color:#888;font-weight:400">(${o.length} páginas)</span></h3>
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem;margin-left:auto" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${e}','_blank')">👁 Vista previa</button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:2px solid #e5e7eb;margin-bottom:20px;gap:4px">
        <button style="${me(a,"subir")}" onclick="switchTabCat('subir')">📁 Subir imágenes</button>
        <button style="${me(a,"seleccionar")}" onclick="switchTabCat('seleccionar')">🖼 De la tienda</button>
        <button style="${me(a,"generar")}" onclick="switchTabCat('generar')">✨ Generar automático</button>
      </div>

      <!-- Tab: SUBIR -->
      <div id="tab-subir" style="display:${a==="subir"?"block":"none"}">
        <div style="border:2px dashed #e5e7eb;border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:border-color 0.2s"
             onclick="document.getElementById('cat-pag-files').click()"
             ondragover="event.preventDefault();this.style.borderColor='#C8967A'"
             ondragleave="this.style.borderColor='#e5e7eb'"
             ondrop="event.preventDefault();this.style.borderColor='#e5e7eb';subirPaginasCatalogo({files:event.dataTransfer.files},'${e}')">
          <div style="font-size:2.5rem;margin-bottom:10px">🖼️</div>
          <p style="font-weight:600;margin-bottom:4px">Arrastra imágenes aquí o haz click</p>
          <p style="font-size:0.8rem;color:#888">Selecciona varias a la vez — se agregan en orden alfabético</p>
          <button class="btn btn-primary" style="margin-top:14px" onclick="event.stopPropagation();document.getElementById('cat-pag-files').click()">+ Seleccionar imágenes</button>
        </div>
        <input type="file" id="cat-pag-files" accept="image/*" multiple style="display:none" onchange="subirPaginasCatalogo(this,'${e}')">
        <div id="upload-progress" style="display:none;margin-top:14px;padding:12px;background:#eff6ff;border-radius:8px">
          <p id="upload-msg" style="font-size:0.85rem;color:#1d4ed8;margin-bottom:6px">Subiendo...</p>
          <div style="height:6px;background:#dbeafe;border-radius:3px">
            <div id="upload-bar" style="height:100%;background:#3b82f6;border-radius:3px;transition:width 0.3s;width:0%"></div>
          </div>
        </div>
      </div>

      <!-- Tab: SELECCIONAR DE LA TIENDA -->
      <div id="tab-seleccionar" style="display:${a==="seleccionar"?"block":"none"}">
        <div id="selector-tienda-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando fotos de tus productos...</p>
        </div>
      </div>

      <!-- Tab: GENERAR AUTOMÁTICO -->
      <div id="tab-generar" style="display:${a==="generar"?"block":"none"}">
        <div id="generador-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando productos...</p>
        </div>
      </div>

      <!-- Páginas actuales -->
      <div style="margin-top:28px">
        ${n||o.length>0?`
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <h4 style="font-size:0.85rem;font-weight:700;color:#374151;margin:0;text-transform:uppercase;letter-spacing:1px">Páginas del catálogo</h4>
          <button onclick="descargarCatalogoPDF()" style="background:#C8967A;color:white;border:none;border-radius:8px;padding:7px 14px;font-size:0.78rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
            📥 Descargar PDF
          </button>
        </div>
        <div id="paginas-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          ${n?`
            <div style="background:white;border:2px solid #C8967A;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              <img src="${n}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
              <div style="padding:6px 8px;background:#fff8f5">
                <div style="font-size:0.7rem;font-weight:700;color:#C8967A;margin-bottom:2px">🖼 Portada</div>
                <div style="font-size:0.65rem;color:#888">Primera página</div>
              </div>
            </div>`:""}
          ${o.map((r,s)=>`
            <div style="background:white;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              <img src="${r.imagen_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
              <div style="padding:6px 8px">
                <div style="font-size:0.7rem;font-weight:600;color:#374151;margin-bottom:4px">Pág ${r.pagina_numero}</div>
                <div style="display:flex;gap:3px;flex-wrap:wrap">
                  ${s>0?`<button onclick="moverPagina('${r.id}','up')" title="Mover arriba" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↑</button>`:""}
                  ${s<o.length-1?`<button onclick="moverPagina('${r.id}','down')" title="Mover abajo" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↓</button>`:""}
                  <button onclick="usarComoPortada('${r.imagen_url}','${e}')" title="Usar como portada" style="flex:1;background:#fef3c7;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">🖼</button>
                  <button onclick="eliminarPagina('${r.id}','${e}')" title="Eliminar" style="flex:1;background:#fee2e2;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem;color:#dc2626">✕</button>
                </div>
              </div>
            </div>`).join("")}
        </div>`:`
        <div style="text-align:center;padding:24px;color:#9ca3af;border:1px dashed #e5e7eb;border-radius:10px">
          <p>Aún no hay páginas. Usa una de las opciones de arriba para agregarlas.</p>
        </div>`}
      </div>
    </div>`,a==="seleccionar"&&qe(e),a==="generar"&&Ve(e)}window.switchTabCat=function(e){const{catalogoId:t}=window._catalogoPaginasData;window._catalogoPaginasData.tabActiva=e,document.querySelectorAll("#tab-subir,#tab-seleccionar,#tab-generar").forEach(o=>o.style.display="none"),document.getElementById("tab-"+e).style.display="block",document.querySelectorAll('[onclick^="switchTabCat"]').forEach(o=>{var n;const a=(n=o.getAttribute("onclick").match(/'(\w+)'/))==null?void 0:n[1];o.style.borderBottomColor=a===e?"#C8967A":"transparent",o.style.color=a===e?"#C8967A":"#6b7280"}),e==="seleccionar"&&qe(t),e==="generar"&&Ve(t)};window.descargarCatalogoPDF=async function(){const e=window._catalogoPaginasData;if(!e)return;const{portada_url:t,paginas:o,nombre:a}=e,n=[];if(t&&n.push(t),[...o].sort((s,d)=>s.pagina_numero-d.pagina_numero).forEach(s=>{s.imagen_url&&n.push(s.imagen_url)}),n.length===0){alert("No hay páginas para descargar.");return}const r=document.querySelector('[onclick="descargarCatalogoPDF()"]');r&&(r.disabled=!0,r.textContent="⏳ Generando PDF...");try{window.jspdf||await new Promise((v,y)=>{const h=document.createElement("script");h.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",h.onload=v,h.onerror=y,document.head.appendChild(h)});const{jsPDF:s}=window.jspdf,d=v=>new Promise(y=>{const h=new Image;h.crossOrigin="anonymous",h.onload=()=>{const w=document.createElement("canvas");w.width=h.naturalWidth||h.width,w.height=h.naturalHeight||h.height,w.getContext("2d").drawImage(h,0,0),y({dataUrl:w.toDataURL("image/jpeg",.92),w:w.width,h:w.height})},h.onerror=()=>y(null),h.src=v}),c=(await Promise.all(n.map(d))).filter(Boolean);if(c.length===0){alert("No se pudieron cargar las imágenes. Revisa tu conexión.");return}const p=210,m=280,g=new s({unit:"mm",format:[p,m]}),u=(v,y)=>{y||g.addPage([p,m]);const h=v.w/v.h,w=p/m;let _,x,z,B;h>w?(_=p,x=p/h,z=0,B=(m-x)/2):(x=m,_=m*h,B=0,z=(p-_)/2),g.addImage(v.dataUrl,"JPEG",z,B,_,x)};c.forEach((v,y)=>u(v,y===0));const b=(a||"catalogo").replace(/[^a-zA-Z0-9_\-áéíóúñÁÉÍÓÚÑ ]/g,"").trim()||"catalogo";g.save(`${b}.pdf`)}catch(s){console.error("Error generando PDF:",s),alert("Error al generar el PDF: "+s.message)}finally{r&&(r.disabled=!1,r.innerHTML="📥 Descargar PDF")}};async function qe(e){const t=document.getElementById("selector-tienda-content");if(t)try{const[o,a]=await Promise.all([fetch(f+"/variantes/"),fetch(f+"/productos/")]),n=await o.json(),i=await a.json(),r=[];n.forEach(d=>{const l=i.find(p=>p.id===d.producto_id),c=(l==null?void 0:l.nombre)||d.sku||"";d.foto_url&&r.push({url:d.foto_url,nombre:c,color:d.color||""}),d.imagenes&&Array.isArray(d.imagenes)&&d.imagenes.forEach(p=>{p&&p!==d.foto_url&&r.push({url:p,nombre:c,color:d.color||""})})});const s=r.filter((d,l,c)=>c.findIndex(p=>p.url===d.url)===l);window._selectorFotos={fotos:s,seleccionadas:new Set},t.innerHTML=`
      <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <p style="font-size:0.83rem;color:#374151">${s.length} fotos disponibles — haz click para seleccionar</p>
        <div style="display:flex;gap:8px">
          <span id="sel-count" style="font-size:0.83rem;color:#C8967A;font-weight:600">0 seleccionadas</span>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem" onclick="agregarSeleccionadas('${e}')">✅ Agregar seleccionadas</button>
        </div>
      </div>
      <input class="form-input" placeholder="🔍 Buscar por nombre o color..." style="width:100%;margin-bottom:10px" oninput="_filtrarSelectorFotos(this.value)">
      <div id="fotos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;max-height:420px;overflow-y:auto;padding:4px">
        ${s.map((d,l)=>`
          <div id="foto-item-${l}" onclick="_toggleFoto(${l})"
               style="cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.15s;position:relative">
            <img src="${d.url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
            <div style="padding:4px 6px;background:white">
              <p style="font-size:0.62rem;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.nombre}</p>
              ${d.color?`<p style="font-size:0.6rem;color:#888">${d.color}</p>`:""}
            </div>
            <div id="foto-check-${l}" style="display:none;position:absolute;top:4px;right:4px;background:#C8967A;color:white;border-radius:50%;width:20px;height:20px;font-size:0.7rem;display:none;align-items:center;justify-content:center;font-weight:700">✓</div>
          </div>`).join("")}
      </div>`}catch(o){t.innerHTML='<p style="color:red">Error: '+o.message+"</p>"}}window._toggleFoto=function(e){const{seleccionadas:t,fotos:o}=window._selectorFotos,a=document.getElementById("foto-item-"+e),n=document.getElementById("foto-check-"+e);t.has(e)?(t.delete(e),a.style.borderColor="transparent",n.style.display="none"):(t.add(e),a.style.borderColor="#C8967A",n.style.display="flex"),document.getElementById("sel-count").textContent=t.size+" seleccionadas"};window._filtrarSelectorFotos=function(e){const{fotos:t}=window._selectorFotos,o=e.toLowerCase();t.forEach((a,n)=>{const i=document.getElementById("foto-item-"+n);i&&(i.style.display=!o||a.nombre.toLowerCase().includes(o)||a.color.toLowerCase().includes(o)?"":"none")})};window.agregarSeleccionadas=async function(e){const{seleccionadas:t,fotos:o}=window._selectorFotos;if(!t.size){alert("Selecciona al menos una foto");return}const{paginas:a}=window._catalogoPaginasData;let n=a.length>0?Math.max(...a.map(r=>r.pagina_numero))+1:1;const i=event.target;i.disabled=!0,i.textContent="Agregando...";for(const r of t)await fetch(f+"/catalogos/"+e+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:o[r].url,pagina_numero:n++})});await gestionarPaginas(e,window._catalogoPaginasData.nombre)};async function Ve(e){const t=document.getElementById("generador-content");if(t)try{const[o,a]=await Promise.all([fetch(f+"/productos/"),fetch(f+"/variantes/")]),n=(await o.json()).filter(s=>s.activo&&s.imagen_principal),i=await a.json(),r=n.map(s=>{const d=i.filter(p=>p.producto_id===s.id&&p.activa!==!1),l=[],c=new Set;for(const p of d){const m=(p.color||"").trim();m&&!c.has(m)&&(c.add(m),l.push({color:m,hex:p.color_hex||"#999",foto:p.foto_url}))}return l});window._generadorData={productos:n,variantes:i,catalogoId:e,seleccionados:new Set,coloresPorProd:r},t.innerHTML=`
      <div style="background:#fef9f5;border:1px solid #fde8d8;border-radius:10px;padding:14px;margin-bottom:16px;font-size:0.83rem;color:#7c3a1a">
        <strong>✨ Cómo funciona:</strong> selecciona los productos que quieres incluir. Luego activa o desactiva los colores (bolitas) que aparecerán en cada página.
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;gap:8px;align-items:center">
          <label style="font-size:0.8rem;font-weight:600">Productos por página:</label>
          <select id="gen-layout" class="form-input" style="width:auto;padding:5px 10px;font-size:0.8rem">
            <option value="1">1 por página</option>
            <option value="1e">1 prod. — editorial 📸</option>
            <option value="2" selected>2 por página</option>
            <option value="4">4 por página</option>
          </select>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span id="gen-count" style="font-size:0.83rem;color:#C8967A;font-weight:600">0 seleccionados</span>
          <button class="btn btn-secondary" style="padding:5px 10px;font-size:0.78rem" onclick="_selTodosGenerador()">Todos</button>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem" id="btn-generar" onclick="generarPaginasCanvas('${e}')">✨ Generar páginas</button>
        </div>
      </div>
      <div id="gen-progress" style="display:none;padding:10px;background:#eff6ff;border-radius:8px;margin-bottom:12px">
        <p id="gen-msg" style="font-size:0.83rem;color:#1d4ed8;margin-bottom:6px">Generando...</p>
        <div style="height:6px;background:#dbeafe;border-radius:3px"><div id="gen-bar" style="height:100%;background:#3b82f6;border-radius:3px;transition:width 0.3s;width:0%"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:460px;overflow-y:auto;padding:4px">
        ${n.map((s,d)=>{const l=i.filter(g=>g.producto_id===s.id),c=s.precio_menudeo||0,p=r[d],m=p.length>1?`<div id="gen-colores-${d}" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:5px;opacity:0.35;pointer-events:none">
                ${p.map((g,u)=>`
                  <div id="gen-col-${d}-${u}"
                       title="${g.color}"
                       onclick="event.stopPropagation();_toggleColorGen(${d},${u})"
                       data-sel="1"
                       style="width:13px;height:13px;border-radius:50%;background:${g.hex};border:2px solid #C8967A;cursor:pointer;flex-shrink:0;box-sizing:border-box;transition:opacity 0.15s,border-color 0.15s">
                  </div>`).join("")}
               </div>`:"";return`
          <div id="gen-item-${d}" onclick="_toggleGenProd(${d})"
               style="cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.15s;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
            <img src="${s.imagen_principal}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
            <div style="padding:5px 7px 7px">
              <p style="font-size:0.62rem;font-weight:600;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.nombre}</p>
              <p style="font-size:0.6rem;color:#C8967A;font-weight:600">$${c||"—"}</p>
              ${m}
            </div>
          </div>`}).join("")}
      </div>`}catch(o){t.innerHTML='<p style="color:red">Error: '+o.message+"</p>"}}window._toggleGenProd=function(e){const{seleccionados:t}=window._generadorData,o=document.getElementById("gen-item-"+e),a=document.getElementById("gen-colores-"+e);t.has(e)?(t.delete(e),o.style.borderColor="transparent",a&&(a.style.opacity="0.35",a.style.pointerEvents="none")):(t.add(e),o.style.borderColor="#C8967A",a&&(a.style.opacity="1",a.style.pointerEvents="auto")),document.getElementById("gen-count").textContent=t.size+" seleccionados"};window._toggleColorGen=function(e,t){var n,i;const o=document.getElementById(`gen-col-${e}-${t}`);if(!o)return;const a=o.dataset.sel==="1";o.dataset.sel=a?"0":"1",o.style.borderColor=a?"#ccc":"#C8967A",o.style.opacity=a?"0.3":"1",o.title=(((i=(n=window._generadorData.coloresPorProd[e])==null?void 0:n[t])==null?void 0:i.color)||"")+(a?" (excluido)":"")};window._selTodosGenerador=function(){const{productos:e,seleccionados:t}=window._generadorData,o=t.size===e.length;t.clear(),e.forEach((a,n)=>{const i=document.getElementById("gen-item-"+n);o?i&&(i.style.borderColor="transparent"):(t.add(n),i&&(i.style.borderColor="#C8967A"))}),document.getElementById("gen-count").textContent=t.size+" seleccionados"};function le(e){return new Promise(t=>{const o=new Image;o.crossOrigin="anonymous",o.onload=()=>t(o),o.onerror=()=>t(null),o.src=e+(e.includes("?")?"&":"?")+"_t="+Date.now()})}function _e(e,t,o,a,n,i){const r=t.split(" ");let s="",d=a;for(let l of r){const c=s+(s?" ":"")+l;e.measureText(c).width>n&&s?(e.fillText(s,o,d),s=l,d+=i):s=c}return s&&e.fillText(s,o,d),d+i}window.generarPaginasCanvas=async function(e){const{productos:t,variantes:o,seleccionados:a,coloresPorProd:n}=window._generadorData;if(!a.size){alert("Selecciona al menos un producto");return}const i=document.getElementById("gen-layout").value,r=i==="1e"?1:parseInt(i),s=[];Array.from(a).sort((v,y)=>v-y).forEach(v=>{const y=t[v],h=n?n[v]:[];if(!h||h.length<=1)s.push({prod:y,origIdx:v,colorFiltro:null,todosColSel:h||[]});else{const w=h.filter((x,z)=>{const B=document.getElementById(`gen-col-${v}-${z}`);return!B||B.dataset.sel!=="0"}),_=w.length>0?w:h;for(const x of _)s.push({prod:y,origIdx:v,colorFiltro:x.color,todosColSel:_})}});const d=v=>{const y=o.filter(h=>h.producto_id===v.prod.id&&h.activa!==!1);return v.colorFiltro?y.filter(h=>(h.color||"").trim()===v.colorFiltro):y},l=[];for(let v=0;v<s.length;v+=r)l.push(s.slice(v,v+r));const c=document.getElementById("btn-generar"),p=document.getElementById("gen-progress"),m=document.getElementById("gen-msg"),g=document.getElementById("gen-bar");c.disabled=!0,p.style.display="block";const{paginas:u}=window._catalogoPaginasData;let b=u.length>0?Math.max(...u.map(v=>v.pagina_numero))+1:1;for(let v=0;v<l.length;v++){const y=l[v],h=$=>($==null?void 0:$.prod)??$,w=$=>($==null?void 0:$.origIdx)??t.indexOf(($==null?void 0:$.prod)??$);m.textContent=`Generando página ${v+1} de ${l.length}...`,g.style.width=v/l.length*100+"%";const _=document.createElement("canvas");_.width=1080,_.height=1440;const x=_.getContext("2d");if(x.fillStyle="#FAFAF8",x.fillRect(0,0,1080,1440),x.fillStyle="#C8967A",x.fillRect(60,48,960,1),x.fillStyle="#2A1A0E",x.font="300 22px DM Sans, sans-serif",x.textAlign="center",x.letterSpacing="8px",x.fillText("ZAPATILLAS MAY",540,42),x.letterSpacing="0px",x.fillStyle="#C8967A",x.fillRect(60,58,960,1),i==="1e"){const $=y[0],C=h($),G=d($),S=[],M=new Set,D=I=>{I&&!M.has(I)&&(M.add(I),S.push(I))};G.length>0&&G[0].foto_url?D(G[0].foto_url):D(C.imagen_principal);for(const I of G)if(D(I.foto_url),Array.isArray(I.imagenes)&&I.imagenes.forEach(D),S.length>=3)break;const j=S.length,A=($.todosColSel||[]).map(I=>({color:I.color,hex:I.hex})),k={negro:"#1C1C1C",blanco:"#F8F8F8",hueso:"#F0EBE1",beige:"#D9C9A8",camel:"#C19A6B","cafe claro":"#A0725A","cafe medio":"#7A4A30","cafe oscuro":"#4A2010",cafe:"#6B3A2A",chocolate:"#3D1C02",cognac:"#9B4421",taupe:"#8B7355",nude:"#D4A97A","nude claro":"#E8C9A8","nude oscuro":"#C0886A","nude rosa":"#DDA090","palo de rosa":"#D4A0A0",salmon:"#FA8072",coral:"#FF6B4A",rojo:"#CC2200",vino:"#722F37",bordo:"#800020","rosa claro":"#F9C0CB",rosa:"#F4607A",fusha:"#E91E8C",naranja:"#FF8C00",amarillo:"#F5C518",dorado:"#D4AF37",oro:"#CFB53B","oro rosa":"#E8B4B8",plateado:"#C0C0C0","azul claro":"#5B8DB8",azul:"#1E4080","azul marino":"#001F5B",turquesa:"#40C4AA",verde:"#2D6A4F","verde menta":"#98D8C8","gris claro":"#C8C8C8",gris:"#909090","gris oscuro":"#505050",morado:"#7B2D8B",lila:"#C8A0D8",multicolor:"#CCAA88"},P=({color:I,hex:q})=>{if(q&&q.startsWith("#"))return q;const T=(I||"").toLowerCase();if(k[T])return k[T];for(const[H,R]of Object.entries(k))if(T.includes(H))return R;return"#BBAA99"},F=(I,q,T,H,R)=>{if(x.save(),x.fillStyle="#FFFFFF",x.fillRect(q,T,H,R),I){x.beginPath(),x.rect(q,T,H,R),x.clip();const N=I.naturalWidth/I.naturalHeight,W=H/R;let X,Q,V,U;N>W?(V=H,U=H/N,X=q,Q=T+(R-U)/2):(U=R,V=R*N,Q=T,X=q+(H-V)/2),x.drawImage(I,X,Q,V,U)}x.restore()},E=62,L=1080,O=E+L+12;if(j>=3){const[I,q,T]=await Promise.all(S.slice(0,3).map(le)),H=10,R=10,N=648,W=1080-N-H,X=Math.floor((L-R)/2);F(I,0,E,N,L),F(q,N+H,E,W,X),F(T,N+H,E+X+R,W,X)}else if(j===2){const[I,q]=await Promise.all(S.map(le)),T=10,H=Math.floor((1080-T)/2);F(I,0,E,H,L),F(q,H+T,E,H,L)}else{const[I]=await Promise.all([le(S[0])]);F(I,40,E,1e3,L)}if(x.fillStyle="#E8DDD5",x.fillRect(0,O,1080,1),x.fillStyle="#2A1A0E",x.textAlign="center",x.font="300 28px DM Sans, sans-serif",x.letterSpacing="3px",_e(x,C.nombre.toUpperCase(),540,O+42,960,38),x.letterSpacing="0px",C.sku&&(x.fillStyle="#A07860",x.font="400 14px DM Mono, monospace",x.fillText(C.sku,540,O+66)),A.length>0){const T=Math.min(A.length,14),H=T*(11*2)+(T-1)*8;let R=Math.round(540-H/2+11);const N=O+100;for(let W=0;W<T;W++){const X=R+W*30;x.beginPath(),x.arc(X,N,11,0,Math.PI*2),x.fillStyle=P(A[W]),x.fill(),x.strokeStyle="rgba(0,0,0,0.18)",x.lineWidth=1.5,x.stroke()}}}else{const $=r<=2?r:2,C=r===4?2:1,G=80,S=100,M=r===1?0:20,D=r===4?20:0,j=r===1?40:28,A=(1080-j*2-M*($-1))/$,k=(1440-G-S-D*(C-1))/C;for(let P=0;P<y.length;P++){const F=h(y[P]);w(y[P]);const E=P%$,L=Math.floor(P/$),O=j+E*(A+M),I=G+L*(k+D),q=r===1?120:r===2?90:70,T=k-q,H=d(y[P]),R=H.length>0&&H[0].foto_url?H[0].foto_url:F.imagen_principal,N=await le(R);if(x.save(),x.fillStyle="#FFFFFF",x.fillRect(O,I,A,T),N){x.beginPath(),x.rect(O,I,A,T),x.clip();const Q=N.naturalWidth/N.naturalHeight,V=A/T;let U,Z,J,Y;Q>V?(J=A,Y=A/Q,U=O,Z=I+(T-Y)/2):(Y=T,J=T*Q,Z=I,U=O+(A-J)/2),x.drawImage(N,U,Z,J,Y)}x.restore(),x.fillStyle="#E8DDD5",x.fillRect(O,I+T,A,1);const W=I+T+q/2;x.fillStyle="#2A1A0E",x.textAlign="center";const X=r===1?34:r===2?24:19;x.font=`300 ${X}px DM Sans, sans-serif`,x.letterSpacing="2px",_e(x,F.nombre.toUpperCase(),O+A/2,W-8,A-32,X+10),x.letterSpacing="0px",F.sku&&(x.fillStyle="#A07860",x.font=`400 ${r===1?18:13}px DM Mono, monospace`,x.fillText(F.sku,O+A/2,W+(r===1?36:26)))}}x.fillStyle="#C8967A",x.fillRect(60,1340,960,1),x.fillStyle="#A07860",x.font="300 18px DM Sans, sans-serif",x.textAlign="center",x.letterSpacing="3px",x.fillText("@ZAPATILLASMAY",540,1368),x.letterSpacing="0px",x.fillStyle="#C0A898",x.font="300 15px DM Sans, sans-serif",x.fillText("zapatillasmay.mx  ·  León, Guanajuato",540,1394);const z=await new Promise($=>_.toBlob($,"image/jpeg",.92)),B=new FormData;B.append("archivo",z,`catalogo-pag-${b}.jpg`);try{const C=await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:B})).json();C.url&&await fetch(f+"/catalogos/"+e+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:C.url,pagina_numero:b++})})}catch($){console.error("Error subiendo página generada",$)}}g.style.width="100%",m.textContent=`✅ ${l.length} páginas generadas`,setTimeout(()=>{p.style.display="none"},2e3),c.disabled=!1,await gestionarPaginas(e,window._catalogoPaginasData.nombre)};window.descargarCatalogoPorCategoria=async function(e,t){const o=document.getElementById("cat-pdf-msg"),a=document.querySelectorAll("#cat-pdf-btns button");a.forEach(n=>n.disabled=!0),o&&(o.style.display="block",o.textContent=`⏳ Cargando productos de ${t}...`);try{const[n,i]=await Promise.all([fetch(f+`/productos/?categoria=eq.${e}&activo=eq.true&order=nombre.asc`),fetch(f+"/variantes/")]),r=await n.json(),s=await i.json();if(!r.length){o&&(o.textContent=`Sin productos activos en ${t}`),a.forEach(S=>S.disabled=!1);return}o&&(o.textContent=`✏️ Generando PDF (${r.length} productos)...`),window.jspdf||await new Promise((S,M)=>{const D=document.createElement("script");D.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",D.onload=S,D.onerror=M,document.head.appendChild(D)});const{jsPDF:d}=window.jspdf,l=2,c=2,p=l*c,m=1080,g=1440,u=40,b=16,v=70,y=80,h=(m-u*2-b*(l-1))/l,w=(g-v-y-b*(c-1))/c,_=60,x=S=>new Promise(M=>{if(!S)return M(null);const D=new Image;D.crossOrigin="anonymous",D.onload=()=>M(D),D.onerror=()=>M(null),D.src=S}),z=(S,M,D,j,A,k)=>{if(S.save(),S.fillStyle="#FFFFFF",S.fillRect(D,j,A,k),M){S.beginPath(),S.rect(D,j,A,k),S.clip();const P=M.naturalWidth/M.naturalHeight,F=A/k;let E,L,O,I;P>F?(O=A,I=A/P,E=D,L=j+(k-I)/2):(I=k,O=k*P,L=j,E=D+(A-O)/2),S.drawImage(M,E,L,O,I)}S.restore()},B=[];for(let S=0;S<r.length;S+=p)B.push(r.slice(S,S+p));const $=new d({orientation:"portrait",unit:"px",format:[m,g]});let C=!0;for(let S=0;S<B.length;S++){o&&(o.textContent=`✏️ Página ${S+1} de ${B.length}...`);const M=B[S],D=document.createElement("canvas");D.width=m,D.height=g;const j=D.getContext("2d");j.fillStyle="#FAFAF8",j.fillRect(0,0,m,g),j.fillStyle="#C8967A",j.fillRect(u,36,m-u*2,1),j.fillStyle="#2A1A0E",j.font="300 20px sans-serif",j.textAlign="center",j.letterSpacing="8px",j.fillText("ZAPATILLAS MAY",m/2,32),j.letterSpacing="3px",j.font="400 13px sans-serif",j.fillStyle="#A07860",j.fillText(t.replace(/^[^\s]+\s/,"").toUpperCase(),m/2,54),j.letterSpacing="0px",j.fillStyle="#C8967A",j.fillRect(u,62,m-u*2,1);for(let k=0;k<M.length;k++){const P=M[k],F=k%l,E=Math.floor(k/l),L=u+F*(h+b),O=v+E*(w+b),I=w-_,q=s.filter(N=>N.producto_id===P.id&&N.activa!==!1),T=q.length>0&&q[0].foto_url?q[0].foto_url:P.imagen_principal,H=await x(T);z(j,H,L,O,h,I),j.fillStyle="#E8DDD5",j.fillRect(L,O+I,h,1),j.fillStyle="#2A1A0E",j.textAlign="center",j.font="600 18px sans-serif";const R=P.nombre.length>28?P.nombre.substring(0,26)+"…":P.nombre;j.fillText(R.toUpperCase(),L+h/2,O+I+26),P.precio_menudeo&&(j.fillStyle="#C8967A",j.font="400 15px sans-serif",j.fillText(`$${Number(P.precio_menudeo).toFixed(0)} MXN`,L+h/2,O+I+48))}j.fillStyle="#C8967A",j.fillRect(u,g-y,m-u*2,1),j.fillStyle="#A07860",j.textAlign="center",j.font="300 16px sans-serif",j.letterSpacing="3px",j.fillText("@ZAPATILLASMAY",m/2,g-50),j.letterSpacing="0px",j.fillStyle="#C0A898",j.font="300 13px sans-serif",j.fillText("zapatillasmay.mx  ·  León, Guanajuato",m/2,g-28);const A=D.toDataURL("image/jpeg",.88);C||$.addPage(),$.addImage(A,"JPEG",0,0,m,g),C=!1}const G=`catalogo-${e}-zapatillasmay.pdf`;$.save(G),o&&(o.textContent=`✅ Descargado: ${G}`,setTimeout(()=>{o.style.display="none"},4e3))}catch(n){console.error(n),o&&(o.textContent="Error generando el PDF: "+n.message)}finally{a.forEach(n=>n.disabled=!1)}};window.subirPaginasCatalogo=async function(e,t){const o=Array.from(e.files||e);if(!o.length)return;const a=document.getElementById("upload-progress"),n=document.getElementById("upload-msg"),i=document.getElementById("upload-bar");a&&(a.style.display="block");const{paginas:r}=window._catalogoPaginasData;let s=r.length>0?Math.max(...r.map(d=>d.pagina_numero))+1:1;for(let d=0;d<o.length;d++){n&&(n.textContent=`Subiendo ${d+1} de ${o.length}...`),i&&(i.style.width=d/o.length*100+"%");try{const l=new FormData;l.append("archivo",o[d]);const p=await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:l})).json();p.url&&await fetch(f+"/catalogos/"+t+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:p.url,pagina_numero:s++})})}catch(l){console.error("Error subiendo página "+(d+1),l)}}i&&(i.style.width="100%"),n&&(n.textContent="✅ Listo"),setTimeout(()=>{a&&(a.style.display="none")},1500),e.value!==void 0&&(e.value=""),await gestionarPaginas(t,window._catalogoPaginasData.nombre)};window.moverPagina=async function(e,t){const{paginas:o,catalogoId:a,nombre:n}=window._catalogoPaginasData,i=o.findIndex(l=>l.id===e);if(i===-1)return;const r=t==="up"?i-1:i+1;if(r<0||r>=o.length)return;const s=o[i].pagina_numero,d=o[r].pagina_numero;await Promise.all([fetch(f+"/catalogos/paginas/"+o[i].id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina_numero:d})}),fetch(f+"/catalogos/paginas/"+o[r].id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina_numero:s})})]),await gestionarPaginas(a,n)};window.eliminarPagina=async function(e,t){confirm("¿Eliminar esta página?")&&(await fetch(f+"/catalogos/paginas/"+e,{method:"DELETE"}),await gestionarPaginas(t,window._catalogoPaginasData.nombre))};window.usarComoPortada=async function(e,t){await fetch(f+"/catalogos/"+t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({portada_url:e})}),alert("✅ Portada actualizada")};window.mlVerStock=async function(e){const t=e.innerHTML;e.innerHTML="⏳ Consultando...",e.disabled=!0;const o=document.getElementById("ml-resultado");try{const n=await(await fetch(f+"/ml/stock")).json();if(o.style.display="block",n.diferencias&&n.diferencias.length>0){const i=n.diferencias.map(r=>`${r.item_id} | SKU: ${r.seller_sku} | ML: ${r.qty_ml} | ERP: ${r.qty_erp}`).join(`
`);o.textContent=`📊 ${n.total_items} items · ${n.desactualizados} desactualizados · ${n.sin_sku} sin SKU

DIFERENCIAS:
${i}`}else o.textContent=`✅ Todo sincronizado — ${n.total_items} items revisados`}catch(a){o.style.display="block",o.textContent="Error: "+a.message}e.innerHTML=t,e.disabled=!1};window.mlSincronizar=async function(e){if(!confirm("¿Sincronizar el stock de todas las publicaciones de MercadoLibre con el ERP?"))return;const t=e.innerHTML;e.innerHTML="⏳ Sincronizando...",e.disabled=!0;const o=document.getElementById("ml-resultado");try{const n=await(await fetch(f+"/ml/sync",{method:"POST"})).json();o.style.display="block",o.textContent="🔄 "+n.message+`

Espera 30 segundos y haz clic en "Ver resultado".`}catch(a){o.style.display="block",o.textContent="Error: "+a.message}e.innerHTML=t,e.disabled=!1};window.mlVerLog=async function(e){var a,n,i;const t=e.innerHTML;e.innerHTML="⏳ Cargando...",e.disabled=!0;const o=document.getElementById("ml-resultado");try{const s=await(await fetch(f+"/ml/sync/log")).json();if(o.style.display="block",s.error)o.textContent="❌ Error: "+s.error;else if(s.message)o.textContent=s.message;else{const d=s.ts?new Date(s.ts*1e3).toLocaleString("es-MX"):"";o.textContent=`Última sync: ${d}

✅ Actualizados: ${s.actualizados}
⏭️  Sin cambio:   ${s.sin_cambio}
❓ Sin match:    ${s.sin_match}
❌ Errores:      ${s.errores}`+((a=s.detalle_actualizados)!=null&&a.length?`

ACTUALIZADOS:
`+s.detalle_actualizados.map(l=>`  ${l.sku}: ${l.antes} → ${l.despues}`).join(`
`):"")+((n=s.detalle_errores)!=null&&n.length?`

ERRORES:
`+s.detalle_errores.map(l=>`  ${l.sku}: ${l.error}`).join(`
`):"")+((i=s.detalle_sin_match)!=null&&i.length?`

SIN MATCH (primeros 20):
`+s.detalle_sin_match.map(l=>`  ${l.item} ${l.sku}`).join(`
`):"")}}catch(r){o.style.display="block",o.textContent="Error: "+r.message}e.innerHTML=t,e.disabled=!1};async function Ge(e,t){var r,s,d,l,c,p;const o=document.getElementById("ml-pub-sku").value.trim(),a=document.getElementById("ml-pub-listing").value,n=document.getElementById("ml-pub-resultado"),i=t.innerHTML;if(!o){alert("Ingresa el SKU del producto (ej: M-SAN-0148)");return}t.innerHTML=e?"⏳ Generando preview...":"⏳ Publicando en ML...",t.disabled=!0,n.style.display="none";try{const m=await fetch(f+"/ml/publicar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sku_interno:o.toUpperCase().trim(),listing_type:a,solo_preview:e})}),g=await m.json();if(n.style.display="block",!m.ok){n.textContent="❌ Error: "+(g.detail||JSON.stringify(g));return}if(e){const u=(r=g.resultados)==null?void 0:r[0];if(!u){n.textContent="Sin resultados";return}const b=u.preview;let v=`=== PREVIEW — ${g.producto} (${g.total} variantes) ===

`;v+=`Producto:    ${g.producto} (${g.categoria})
`,v+=`Category ID: ${g.category_id}
`,v+=`Listing:     ${a}

`,v+=`--- Primera variante: ${u.sku} ---
`,v+=`Título:      ${b.title}
`,v+=`Precio:      $${b.price} MXN
`,v+=`Stock:       ${b.available_quantity}
`,v+=`Imágenes:    ${((s=b.pictures)==null?void 0:s.length)||0}
`,v+=`Descripción: ${(l=(d=b.description)==null?void 0:d.plain_text)==null?void 0:l.substring(0,120)}...

`,v+=`Atributos:
`+(b.attributes||[]).map(y=>`  ${y.id}: ${y.value_name}`).join(`
`),v+=`

... y ${g.total-1} variantes más con la misma estructura.`,n.textContent=v}else{const u=((c=g.resultados)==null?void 0:c.filter(y=>y.status==="publicado"))||[],b=((p=g.resultados)==null?void 0:p.filter(y=>y.status==="error"))||[];let v=`=== RESULTADO — ${g.producto} ===
`;v+=`✅ Publicados: ${u.length}   ❌ Errores: ${b.length}

`,u.length&&(v+=`PUBLICADOS:
`,u.forEach(y=>{v+=`  ${y.sku} → ${y.item_id}
  ${y.permalink||""}
`})),b.length&&(v+=`
ERRORES:
`,b.forEach(y=>{var h;v+=`  ${y.sku}  [${y.codigo}] ${y.error}
`,(h=y.causas)!=null&&h.length&&y.causas.forEach(w=>{v+=`    ↳ ${w.code}: ${w.message}
`})})),n.textContent=v}}catch(m){n.style.display="block",n.textContent="Error inesperado: "+m.message}finally{t.innerHTML=i,t.disabled=!1}}window.mlPublicarPreview=function(e){Ge(!0,e)};window.mlPublicarReal=function(e){confirm("¿Publicar TODAS las variantes activas de este producto en MercadoLibre? Esto creará nuevos items en tu cuenta.")&&Ge(!1,e)};window.descargarExcelTikTok=async function(e,t,o){const a=e.innerHTML;try{e.innerHTML="⏳ Generando...",e.disabled=!0;const n=await fetch(`${f}/tiktok/${t}`);if(!n.ok){const d=await n.text();throw new Error(`Error ${n.status}: ${d}`)}const i=await n.blob(),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=o,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r)}catch(n){alert("Error al descargar el archivo: "+n.message)}finally{e.innerHTML=a,e.disabled=!1}};async function pt(){const e=document.getElementById("content");e.innerHTML=`
    <div style="padding:2rem;max-width:860px">
      <h2 style="margin-bottom:0.25rem">🛒 MercadoLibre</h2>
      <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">
        Genera el preview, edita el JSON de cada variante (especialmente el título), y publica.
      </p>

      <!-- Mis publicaciones -->
      <div class="card" style="margin-bottom:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
          <h3 style="margin:0">📋 Mis publicaciones</h3>
          <button onclick="mlCargarPublicaciones(this)"
                  style="padding:0.4rem 1rem;background:#3483fa;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:600">
            🔄 Cargar / Actualizar
          </button>
        </div>
        <div id="ml-pubs-wrap">
          <p style="color:#aaa;font-size:0.85rem;margin:0">Haz clic en "Cargar" para ver tus publicaciones activas en MercadoLibre.</p>
        </div>
      </div>

      <!-- Paso 1: configurar -->
      <div class="card" style="margin-bottom:1.5rem">
        <h3 style="margin-bottom:1rem">Paso 1 — Publicar producto nuevo</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
          <div style="position:relative">
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">SKU o modelo del producto</label>
            <input id="ml-sku" type="text" placeholder="Ej: CR3385 o C-TAC-0118" autocomplete="off"
                   style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem;box-sizing:border-box">
            <div id="ml-sku-sug" style="display:none;position:absolute;z-index:30;left:0;right:0;top:100%;background:#fff;border:1px solid #ddd;border-top:none;border-radius:0 0 6px 6px;max-height:240px;overflow-y:auto;box-shadow:0 6px 16px rgba(0,0,0,0.12)"></div>
          </div>
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">Tipo de publicación</label>
            <select id="ml-listing"
                    style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem">
              <option value="gold_pro">Oro Premium — gold_pro (16%)</option>
              <option value="gold_special">Oro Especial — gold_special (12%)</option>
              <option value="silver">Plata (9%)</option>
              <option value="bronze">Bronce (5%)</option>
            </select>
            <div style="font-size:0.75rem;color:#e67e22;margin-top:3px">⚠️ La categoría de calzado no admite publicaciones gratis</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:0.75rem;margin-bottom:0.75rem;align-items:start">
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
              Título para ML <span style="color:#3483fa">★</span>
              <span style="font-weight:400;color:#888">(igual para todas las variantes)</span>
            </label>
            <input id="ml-titulo" type="text" placeholder="Ej: Sandalia Tacón Alto Para Fiesta Marca May"
                   maxlength="60"
                   style="width:100%;padding:0.5rem 0.75rem;border:2px solid #3483fa;border-radius:6px;font-size:0.95rem">
            <div style="font-size:0.75rem;color:#888;margin-top:3px">Máximo 60 caracteres — <span id="ml-titulo-count">0</span>/60</div>
          </div>
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
              Precio ML (MXN) <span style="color:#888;font-weight:400">— opcional</span>
            </label>
            <input id="ml-precio" type="number" min="1" step="1" placeholder="Ej: 520"
                   style="width:130px;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem">
            <div style="font-size:0.75rem;color:#888;margin-top:3px">Vacío = precio del ERP</div>
          </div>
        </div>

        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
            Descripción ML
            <span style="font-weight:400;color:#888">— vacío = usa la del ERP</span>
          </label>
          <textarea id="ml-descripcion" rows="4"
                    placeholder="Descripción del producto para MercadoLibre..."
                    style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.88rem;resize:vertical;box-sizing:border-box"></textarea>
        </div>

        <!-- Selector de foto de portada — se llena al generar preview -->
        <div id="ml-fotos-wrap" style="display:none;margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:6px">
            📷 Foto de portada
            <span style="color:#e67e22">★</span>
            <span style="font-weight:400;color:#888"> — ML exige fondo blanco/sin fondo. Click para seleccionar cuál va primero.</span>
          </label>
          <div id="ml-fotos-grid" style="display:flex;gap:8px;flex-wrap:wrap"></div>
        </div>

        <button onclick="mlGenerarPreview()" id="ml-btn-preview"
                style="padding:0.6rem 1.5rem;background:#3483fa;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:600">
          🔍 Generar preview
        </button>
      </div>

      <!-- Paso 2: editar variantes -->
      <div id="ml-variantes-wrap" style="display:none">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <h3 id="ml-variantes-titulo" style="margin:0">Paso 2 — Edita los JSONs</h3>
          <button onclick="mlPublicarTodas()" id="ml-btn-publicar"
                  style="padding:0.6rem 1.5rem;background:#ffe600;color:#333;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:700">
            🚀 Publicar todas en ML
          </button>
        </div>
        <p style="font-size:0.82rem;color:#888;margin-bottom:1rem">
          Cada textarea es el JSON que se enviará a ML. Puedes cambiar el título, precio, imágenes, etc.
        </p>
        <div id="ml-variantes-list"></div>
      </div>

      <!-- Resultado publicación -->
      <div id="ml-resultado" style="display:none;margin-top:1.5rem" class="card">
        <h3 id="ml-resultado-titulo" style="margin-bottom:0.75rem">Resultado</h3>
        <div id="ml-resultado-body"></div>
      </div>
    </div>
  `,document.getElementById("ml-titulo").addEventListener("input",function(){document.getElementById("ml-titulo-count").textContent=this.value.length});let t=[];fetch(`${f}/productos/?select=id,sku_interno,nombre,activo`).then(r=>r.json()).then(r=>{t=(Array.isArray(r)?r:[]).filter(s=>s.activo!==!1)}).catch(()=>{});const o=document.getElementById("ml-sku"),a=document.getElementById("ml-sku-sug"),n=r=>{if(r=(r||"").toLowerCase().trim(),!r||!t.length){a.style.display="none";return}const s=t.filter(d=>(d.nombre||"").toLowerCase().includes(r)||(d.sku_interno||"").toLowerCase().includes(r)).slice(0,12);if(!s.length){a.style.display="none";return}a.innerHTML=s.map(d=>`
      <div onclick="window._mlElegirSku('${(d.sku_interno||"").replace(/'/g,"\\'")}')"
           style="padding:0.5rem 0.75rem;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:0.85rem"
           onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='#fff'">
        <span style="font-weight:600">${d.nombre||""}</span>
        <span style="color:#888;font-size:0.75rem;margin-left:6px">${d.sku_interno||""}</span>
      </div>`).join(""),a.style.display="block"};window._mlElegirSku=r=>{o.value=r,a.style.display="none"},o.addEventListener("input",()=>n(o.value)),o.addEventListener("focus",()=>n(o.value)),document.addEventListener("click",r=>{a&&!a.contains(r.target)&&r.target!==o&&(a.style.display="none")}),window._mlResolverSku=r=>{const s=(r||"").trim();if(!s||!t.length)return s.toUpperCase();const d=t.find(c=>(c.sku_interno||"").toUpperCase()===s.toUpperCase());if(d)return d.sku_interno.toUpperCase();const l=t.filter(c=>(c.nombre||"").toLowerCase().includes(s.toLowerCase()));return l.length===1?l[0].sku_interno.toUpperCase():l.length>1?"__AMBIGUO__":s.toUpperCase()},window.mlGenerarPreview=async()=>{var g,u,b,v;const r=document.getElementById("ml-sku").value.trim(),s=document.getElementById("ml-listing").value,d=document.getElementById("ml-titulo").value.trim(),l=document.getElementById("ml-precio").value.trim(),c=l?parseFloat(l):null;if(!r){alert("Ingresa el SKU o modelo del producto");return}const p=window._mlResolverSku(r);if(p==="__AMBIGUO__"){alert('Hay varios productos que coinciden con "'+r+'". Elige uno de la lista que aparece al escribir.');return}if(!d){alert("Ingresa el título para ML");return}if(d.length>60){alert("El título no puede superar 60 caracteres");return}if(c!==null&&(isNaN(c)||c<=0)){alert("El precio debe ser mayor a 0");return}const m=document.getElementById("ml-btn-preview");m.textContent="⏳ Generando...",m.disabled=!0;try{const y=await fetch(`${f}/ml/publicar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sku_interno:p,listing_type:s,solo_preview:!0})}),h=await y.json();if(!y.ok){alert("Error: "+(h.detail||JSON.stringify(h)));return}const w=h.resultados||[];if(!w.length){alert("No se encontraron variantes activas");return}const _=document.getElementById("ml-descripcion"),x=((b=(u=(g=w[0])==null?void 0:g.preview)==null?void 0:u.description)==null?void 0:b.plain_text)||"";_.value.trim()||(_.value=x);const z={},B=[],$=new Set;for(const A of w){const k=A.color||"Sin color";z[k]||(z[k]=[]);for(const P of((v=A.preview)==null?void 0:v.pictures)||[])P.source&&(z[k].find(F=>F.source===P.source)||z[k].push(P),$.has(P.source)||($.add(P.source),B.push(P)))}const C={},G=new Set,S=new Set;for(const A of Object.keys(z))C[A]=0,G.add(A);const M=Object.keys(z);if(M.length>0){const A=document.getElementById("ml-fotos-wrap"),k=document.getElementById("ml-fotos-grid"),P=()=>{F();const E=w.filter(L=>G.has(L.color||"Sin color"));i(E,d,c,C,_.value.trim(),z,S)},F=()=>{k.innerHTML=M.map(E=>{const L=z[E];if(!L.length)return"";const O=G.has(E),I=E.replace(/'/g,"\\'"),q=E.replace(/[^a-zA-Z0-9]/g,"_");return`
              <div style="margin-bottom:1rem;width:100%;opacity:${O?1:.4}">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:6px">
                  <input type="checkbox" id="ml-chk-${q}" ${O?"checked":""}
                    onchange="mlToggleColor('${I}')"
                    style="width:16px;height:16px;cursor:pointer;accent-color:#3483fa">
                  <span style="font-size:0.82rem;font-weight:700;color:#333">${E}</span>
                  <span style="font-size:0.72rem;color:#888">(${w.filter(T=>(T.color||"Sin color")===E).length} tallas)</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;padding-left:24px">
                  ${L.map((T,H)=>{const R=S.has(T.source),N=H===C[E]&&O&&!R;return`
                    <div onclick="${O&&!R?`mlSeleccionarPortadaColor('${I}',${H})`:""}"
                         id="ml-foto-${q}-${H}"
                         style="cursor:${O&&!R?"pointer":"default"};border:3px solid ${N?"#3483fa":"#ddd"};border-radius:8px;overflow:hidden;width:80px;height:80px;position:relative;flex-shrink:0;opacity:${R?.35:1}">
                      <img src="${T.source}" style="width:100%;height:100%;object-fit:cover">
                      ${O?`<div onclick="event.stopPropagation();mlToggleFoto('${I}',${H},'${T.source.replace(/'/g,"\\'")}')" title="${R?"Incluir foto":"Quitar foto"}" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:${R?"#16a34a":"#e74c3c"};color:#fff;font-size:0.75rem;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${R?"+":"✕"}</div>`:""}
                      ${N?'<div style="position:absolute;bottom:0;left:0;right:0;background:#3483fa;color:#fff;font-size:0.55rem;text-align:center;padding:2px;font-weight:700">PORTADA</div>':""}
                    </div>`}).join("")}
                </div>
              </div>`}).join("")};F(),A.style.display="block",window.mlToggleColor=E=>{G.has(E)?G.delete(E):G.add(E),P()},window.mlSeleccionarPortadaColor=(E,L)=>{C[E]=L,P()},window.mlToggleFoto=(E,L,O)=>{if(S.has(O))S.delete(O);else{S.add(O);const I=z[E]||[];if(I[C[E]]&&I[C[E]].source===O){const q=I.findIndex(T=>!S.has(T.source));C[E]=q>=0?q:0}}P()}}const D=w.filter(A=>G.has(A.color||"Sin color"));i(D,d,c,C,_.value.trim(),z);const j=document.getElementById("ml-variantes-wrap");j.style.display="block",j.scrollIntoView({behavior:"smooth",block:"start"})}catch(y){alert("Error de conexión: "+y.message)}finally{m.textContent="🔍 Generar preview",m.disabled=!1}};function i(r,s,d,l,c,p,m){m=m||new Set;const g=document.getElementById("ml-variantes-titulo"),u=document.getElementById("ml-variantes-list");g.textContent=`Paso 2 — Revisa y edita (${r.length} variantes, título aplicado a todas)`,u.innerHTML=r.map((b,v)=>{const y={...b.preview};if(delete y.title,y.family_name=s,d!==null&&(y.price=d),c&&(y.description={plain_text:c}),p){const h=b.color||"Sin color",w=p[h]||[],_=l&&l[h]||0,x=w[_]?w[_].source:null;let z=w.filter(B=>!m.has(B.source));if(x){const B=z.findIndex($=>$.source===x);if(B>0){const[$]=z.splice(B,1);z.unshift($)}}if(z.length<3){for(const[B,$]of Object.entries(p))if(B!==h){for(const C of $)if(!m.has(C.source)&&(z.find(G=>G.source===C.source)||z.push(C),z.length>=12))break;if(z.length>=12)break}}y.pictures=z.slice(0,12)}return`
        <details style="margin-bottom:0.5rem;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <summary style="padding:0.5rem 1rem;cursor:pointer;background:#f8f8f8;font-size:0.85rem;font-weight:600;list-style:none;display:flex;justify-content:space-between">
            <span>${b.sku||"Variante "+(v+1)} &nbsp;·&nbsp; ${b.color||""} ${b.talla||""}</span>
            <span style="font-size:0.75rem;color:#aaa">▾ editar JSON</span>
          </summary>
          <div style="padding:0.5rem">
            <textarea id="ml-json-${v}"
                      style="width:100%;height:260px;font-family:monospace;font-size:0.73rem;border:1px solid #ddd;border-radius:4px;padding:0.5rem;resize:vertical;box-sizing:border-box"
                      spellcheck="false">${JSON.stringify(y,null,2)}</textarea>
          </div>
        </details>`}).join("")}window.mlCargarPublicaciones=async r=>{const s=document.getElementById("ml-pubs-wrap"),d=r.innerHTML;r.innerHTML="⏳ Cargando...",r.disabled=!0,s.innerHTML='<p style="color:#aaa;font-size:0.85rem">Consultando MercadoLibre (puede tardar ~10 s)...</p>';try{const l=await fetch(`${f}/ml/items`),c=await l.json();if(!l.ok){s.innerHTML=`<p style="color:red">Error: ${c.detail||JSON.stringify(c)}</p>`;return}const p=c.items||[];if(!p.length){s.innerHTML='<p style="color:#aaa;font-size:0.85rem">No se encontraron publicaciones.</p>';return}const m=y=>{const h={active:["#27ae60","Activa"],paused:["#e67e22","Pausada"],closed:["#e74c3c","Cerrada"],under_review:["#8e44ad","En revisión"]},[w,_]=h[y]||["#999",y];return`<span style="background:${w};color:#fff;border-radius:4px;padding:2px 7px;font-size:0.72rem;font-weight:700">${_}</span>`},g=p.map(y=>`
        <tr data-search="${(y.item_id+" "+(y.title||"")+" "+(y.seller_sku||"")).toLowerCase().replace(/"/g,"")}" style="border-bottom:1px solid var(--border)">
          <td style="padding:0.4rem 0.5rem;font-size:0.78rem;color:#3483fa;white-space:nowrap">
            <a href="https://articulo.mercadolibre.com.mx/${y.item_id.replace(/^(ML[A-Z]+)(\d+)$/,"$1-$2")}" target="_blank" style="color:#3483fa;text-decoration:none">
              ${y.item_id}
            </a>
          </td>
          <td style="padding:0.4rem 0.5rem;font-size:0.82rem;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${y.title}">${y.title}</td>
          <td style="padding:0.4rem 0.5rem;white-space:nowrap">${m(y.status)}</td>
          <td style="padding:0.4rem 0.5rem;font-size:0.78rem;color:#555;white-space:nowrap">${y.seller_sku||"—"}</td>
          <td style="padding:0.4rem 0.5rem;font-size:0.82rem;text-align:right;font-weight:600">${y.qty}</td>
        </tr>`).join(""),u=p.filter(y=>y.status==="active").length,b=p.filter(y=>y.status==="paused").length,v=c.sin_sku||0;s.innerHTML=`
        <div style="display:flex;gap:1.5rem;margin-bottom:0.75rem;flex-wrap:wrap">
          <span style="font-size:0.82rem;color:#555">Total: <b>${c.total}</b></span>
          <span style="font-size:0.82rem;color:#27ae60">Activas: <b>${u}</b></span>
          <span style="font-size:0.82rem;color:#e67e22">Pausadas: <b>${b}</b></span>
          ${v?`<span style="font-size:0.82rem;color:#e74c3c">Sin SKU ERP: <b>${v}</b></span>`:""}
        </div>
        <input id="ml-pubs-buscar" oninput="mlFiltrarPubs(this.value)" placeholder="🔍 Buscar por título, SKU o item ID..."
               style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;margin-bottom:0.6rem;box-sizing:border-box">
        <div style="overflow-x:auto;max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:6px">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg-secondary);position:sticky;top:0">
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Item ID</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Título</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Estado</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">SKU ERP</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:right;color:#888;font-weight:600">Stock</th>
              </tr>
            </thead>
            <tbody>${g}</tbody>
          </table>
        </div>`}catch(l){s.innerHTML=`<p style="color:red">Error de conexión: ${l.message}</p>`}finally{r.innerHTML=d,r.disabled=!1}},window.mlFiltrarPubs=r=>{r=(r||"").toLowerCase().trim(),document.querySelectorAll("#ml-pubs-wrap tbody tr").forEach(s=>{s.style.display=!r||(s.dataset.search||"").includes(r)?"":"none"})},window.mlPublicarTodas=async()=>{if(!confirm("¿Publicar TODAS las variantes en MercadoLibre con los JSONs editados?"))return;const s=document.getElementById("ml-variantes-list").querySelectorAll("textarea"),d=[];for(let g=0;g<s.length;g++)try{d.push(JSON.parse(s[g].value))}catch(u){alert(`JSON inválido en variante ${g+1}: ${u.message}`);return}const l=document.getElementById("ml-btn-publicar");l.textContent="⏳ Publicando...",l.disabled=!0;const c=document.getElementById("ml-resultado"),p=document.getElementById("ml-resultado-titulo"),m=document.getElementById("ml-resultado-body");c.style.display="block",p.textContent="⏳ Publicando...",m.innerHTML='<p style="color:#888">Enviando a MercadoLibre...</p>';try{const u=await(await fetch(`${f}/ml/publicar-payloads`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({payloads:d})})).json(),b=u.publicados||0,v=u.errores||0;p.textContent=`✅ ${b} publicado(s)${v?` · ❌ ${v} con error`:""} de ${u.total||0}`,m.innerHTML=(u.resultados||[]).map(y=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid #eee">
          <span style="font-size:0.85rem">${y.sku||"—"} ${y.title?"— "+y.title:""}</span>
          ${y.ok?`<a href="${y.permalink||"#"}" target="_blank"
                 style="font-size:0.8rem;color:#3483fa;white-space:nowrap">🔗 ${y.item_id}</a>`:`<span style="font-size:0.8rem;color:red"
                     title='${JSON.stringify(y.causa||[])}'>❌ ${y.error||"Error"}</span>`}
        </div>
      `).join("")||'<p style="color:#888">Sin detalles</p>'}catch(g){p.textContent="❌ Error de conexión",m.innerHTML=`<p style="color:red">${g.message}</p>`}finally{l.textContent="🚀 Publicar todas en ML",l.disabled=!1}}}let K=[],ae="";async function mt(){const e=document.getElementById("content");e.innerHTML=`
    <style>
      .oh-wrap { padding:1rem; max-width:700px; }
      .oh-row {
        display:flex; align-items:center; gap:0.6rem;
        background:#fff; border:1px solid #eee; border-radius:8px;
        padding:0.5rem 0.65rem; margin-bottom:0.4rem;
        transition: box-shadow .15s, opacity .15s;
      }
      .oh-row.dragging { opacity:.4; }
      .oh-row.drag-over { box-shadow:0 0 0 2px #3483fa; background:#f0f6ff; }
      .oh-handle { cursor:grab; color:#ccc; font-size:1.1rem; user-select:none; flex-shrink:0; }
      .oh-pos-input {
        width:42px; height:32px; border:1px solid #ddd; border-radius:6px;
        text-align:center; font-size:0.85rem; font-weight:700; color:#3483fa;
        background:#f8f9ff; flex-shrink:0;
      }
      .oh-pos-input:focus { outline:none; border-color:#3483fa; background:#fff; }
      .oh-img { width:40px; height:40px; object-fit:cover; border-radius:6px; background:#f5f5f5; flex-shrink:0; }
      .oh-info { flex:1; min-width:0; }
      .oh-nombre { font-size:0.83rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .oh-sku { font-size:0.7rem; color:#aaa; }
      .oh-btns { display:flex; flex-direction:column; gap:2px; flex-shrink:0; }
      .oh-btn {
        width:26px; height:26px; border:1px solid #e0e0e0; border-radius:5px;
        background:#fafafa; cursor:pointer; font-size:0.85rem;
        display:flex; align-items:center; justify-content:center; padding:0;
      }
      .oh-btn:active { background:#e8f0ff; }
      .oh-btn:disabled { opacity:.25; cursor:default; }
      .oh-stock-badge {
        background:#e8f5e9; color:#2e7d32; font-size:0.66rem; font-weight:700;
        padding:1px 6px; border-radius:100px; margin-left:4px; white-space:nowrap;
      }
      @media(max-width:480px){
        .oh-nombre { font-size:0.78rem; }
        .oh-img { width:34px; height:34px; }
        .oh-handle { display:none; }
      }
    </style>
    <div class="oh-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
        <div>
          <h2 style="margin:0;font-size:1.05rem">🏠 Orden en Home</h2>
          <p style="margin:0.2rem 0 0;font-size:0.75rem;color:#888">Escribe un número para mover el modelo a esa posición</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <button id="oh-sort-stock-btn" onclick="_ohOrdenarPorStock()" style="background:#fff;color:#2e7d32;border:1px solid #a5d6a7;border-radius:8px;padding:0.5rem 0.9rem;font-size:0.83rem;font-weight:600;cursor:pointer">
            📦 Por stock
          </button>
          <button id="oh-save-btn" onclick="guardarOrdenHome()" style="background:#3483fa;color:#fff;border:none;border-radius:8px;padding:0.5rem 1.1rem;font-size:0.83rem;font-weight:600;cursor:pointer">
            💾 Guardar orden
          </button>
        </div>
      </div>
      <input id="oh-search" type="text" placeholder="🔍 Buscar modelo o SKU..."
        oninput="_ohFiltrar(this.value)"
        style="width:100%;box-sizing:border-box;padding:0.55rem 0.8rem;border:1px solid #ddd;border-radius:8px;font-size:0.85rem;margin-bottom:0.75rem">
      <div id="oh-count" style="font-size:0.75rem;color:#aaa;margin-bottom:0.5rem"></div>
      <div id="oh-lista"><p style="color:#888;text-align:center;padding:2rem">Cargando...</p></div>
    </div>
  `;try{K=(await(await fetch(`${f}/productos/`)).json()).filter(a=>a.activo).sort((a,n)=>{const i=a.orden_home??99999,r=n.orden_home??99999;return i!==r?i-r:new Date(n.created_at)-new Date(a.created_at)}),ae="",de()}catch(t){document.getElementById("oh-lista").innerHTML=`<p style="color:red">Error: ${t.message}</p>`}}window._ohFiltrar=function(e){ae=e.toLowerCase().trim(),de()};function de(){const e=document.getElementById("oh-lista"),t=document.getElementById("oh-count");if(!e)return;const o=K.length,a=ae?K.filter(n=>(n.nombre||"").toLowerCase().includes(ae)||(n.sku_interno||"").toLowerCase().includes(ae)):K;if(t&&(t.textContent=ae?`${a.length} de ${o} modelos`:`${o} modelos activos`),!o){e.innerHTML='<p style="color:#888;text-align:center;padding:2rem">No hay productos activos</p>';return}if(!a.length){e.innerHTML='<p style="color:#aaa;text-align:center;padding:1.5rem">Sin resultados para esa búsqueda</p>';return}e.innerHTML=a.map(n=>{const i=K.indexOf(n),r=i+1,s=n.foto_principal||n.imagenes&&n.imagenes[0]||"",d=s?`<img class="oh-img" src="${s}" alt="" loading="lazy" onerror="this.style.display='none'">`:'<div class="oh-img" style="display:flex;align-items:center;justify-content:center;font-size:1.1rem">👠</div>';return`
      <div class="oh-row" id="oh-row-${i}" draggable="true"
           ondragstart="_ohDragStart(event,${i})"
           ondragover="_ohDragOver(event,${i})"
           ondrop="_ohDrop(event,${i})"
           ondragend="_ohDragEnd()">
        <span class="oh-handle">⠿</span>
        <input class="oh-pos-input" type="number" min="1" max="${o}" value="${r}"
          title="Posición — presiona Enter para mover"
          onkeydown="if(event.key==='Enter')_ohSetPos('${n.id}',+this.value)"
          onblur="_ohSetPos('${n.id}',+this.value)">
        ${d}
        <div class="oh-info">
          <div class="oh-nombre">${n.nombre||"Sin nombre"}</div>
          <div class="oh-sku">${n.sku_interno||""}${n._stockTotal!=null?`<span class="oh-stock-badge">📦 ${n._stockTotal}</span>`:""}</div>
        </div>
        <div class="oh-btns">
          <button class="oh-btn" onclick="_ohMover(${i},-1)" ${i===0?"disabled":""}>↑</button>
          <button class="oh-btn" onclick="_ohMover(${i},1)" ${i===o-1?"disabled":""}>↓</button>
        </div>
      </div>`}).join("")}window._ohSetPos=function(e,t){const o=K.findIndex(n=>n.id===e);if(o===-1||(t=Math.max(1,Math.min(Math.round(t),K.length))-1,o===t))return;const[a]=K.splice(o,1);K.splice(t,0,a),de()};window._ohMover=function(e,t){const o=e+t;if(o<0||o>=K.length)return;const a=K[e];K[e]=K[o],K[o]=a,de()};let ne=null;window._ohDragStart=function(e,t){ne=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=document.getElementById(`oh-row-${t}`);o&&o.classList.add("dragging")},0)};window._ohDragOver=function(e,t){e.preventDefault(),document.querySelectorAll(".oh-row").forEach(a=>a.classList.remove("drag-over"));const o=document.getElementById(`oh-row-${t}`);o&&o.classList.add("drag-over")};window._ohDrop=function(e,t){if(e.preventDefault(),ne===null||ne===t)return;const[o]=K.splice(ne,1);K.splice(t,0,o),ne=null,de()};window._ohDragEnd=function(){ne=null,document.querySelectorAll(".oh-row").forEach(e=>{e.classList.remove("dragging"),e.classList.remove("drag-over")})};window._ohOrdenarPorStock=async function(){const e=document.getElementById("oh-sort-stock-btn");e&&(e.disabled=!0,e.textContent="Cargando...");try{const[t,o]=await Promise.all([fetch(`${f}/variantes/`),fetch(`${f}/inventario/slim`)]),a=await t.json(),n=await o.json(),i={};a.forEach(s=>{i[s.id]=s.producto_id});const r={};n.forEach(s=>{const d=i[s.variante_id];d&&(r[d]=(r[d]||0)+(s.cantidad||0))}),K.forEach(s=>{s._stockTotal=r[s.id]||0}),K.sort((s,d)=>(d._stockTotal||0)-(s._stockTotal||0)),de(),e&&(e.style.background="#e8f5e9",e.textContent="📦 Por stock ✓"),setTimeout(()=>{e&&(e.style.background="#fff",e.textContent="📦 Por stock")},2e3)}catch(t){alert("Error al obtener stock: "+t.message)}finally{e&&(e.disabled=!1)}};window.guardarOrdenHome=async function(){const e=document.getElementById("oh-save-btn");e&&(e.disabled=!0,e.textContent="Guardando...");try{const t=K.map((n,i)=>({id:n.id,orden_home:i+1})),a=await(await fetch(`${f}/productos/orden-home`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json();a.ok?(e&&(e.textContent="✅ Guardado",e.style.background="#22c55e"),setTimeout(()=>{e&&(e.disabled=!1,e.textContent="💾 Guardar orden",e.style.background="#3483fa")},2e3)):(alert("Error al guardar: "+JSON.stringify(a)),e&&(e.disabled=!1,e.textContent="💾 Guardar orden"))}catch(t){alert("Error: "+t.message),e&&(e.disabled=!1,e.textContent="💾 Guardar orden")}};let oe=null;async function ut(){oe&&(clearInterval(oe),oe=null);const e=document.getElementById("content");e.innerHTML=`
    <style>
      .ga-wrap { padding:1rem; max-width:900px; box-sizing:border-box; }
      .ga-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem; }
      .ga-top { display:grid; grid-template-columns:160px 1fr; gap:1rem; margin-bottom:1rem; }
      .ga-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; }
      .ga-stat { text-align:center; }
      .ga-stat-num { font-size:1.6rem; font-weight:700; line-height:1.2; }
      .ga-stat-lbl { font-size:0.7rem; color:#888; margin-top:2px; }
      @media(max-width:600px){
        .ga-wrap { padding:0.75rem; }
        .ga-top { grid-template-columns:1fr; }
        .ga-stats { grid-template-columns:repeat(3,1fr); gap:0.4rem; }
        .ga-stat-num { font-size:1.25rem; }
        .ga-stat-lbl { font-size:0.65rem; }
      }
    </style>
    <div class="ga-wrap">
      <div class="ga-header">
        <h2 style="margin:0;font-size:1.1rem">📊 Google Analytics</h2>
        <span id="ga-ultima-act" style="font-size:0.75rem;color:#aaa"></span>
      </div>

      <!-- Tiempo real + Hoy -->
      <div class="ga-top">
        <div class="card" style="text-align:center;padding:1.25rem">
          <div style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:0.25rem">Ahora en el sitio</div>
          <div id="ga-activos" style="font-size:3rem;font-weight:700;color:#22c55e;line-height:1">—</div>
          <div style="font-size:0.7rem;color:#888;margin-top:0.2rem">usuarios activos</div>
          <div id="ga-dispositivos" style="font-size:0.68rem;color:#bbb;margin-top:0.4rem;line-height:1.5"></div>
          <div id="ga-paginas-rt" style="margin-top:0.6rem;text-align:left"></div>
        </div>
        <div class="card" style="padding:1rem">
          <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em" id="ga-hoy-label">Hoy</div>
          <div class="ga-stats">
            <div class="ga-stat"><div class="ga-stat-num" id="ga-sesiones">—</div><div class="ga-stat-lbl">Sesiones</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-usuarios">—</div><div class="ga-stat-lbl">Usuarios</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-pageviews">—</div><div class="ga-stat-lbl">Páginas</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-nuevos">—</div><div class="ga-stat-lbl">Nuevos</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-duracion">—</div><div class="ga-stat-lbl">Duración</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-rebote">—</div><div class="ga-stat-lbl">Rebote</div></div>
          </div>
        </div>
      </div>

      <!-- Gráfica 7 días -->
      <div class="card" style="margin-bottom:1rem;padding:1rem">
        <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em">Últimos 7 días</div>
        <canvas id="ga-chart" height="90"></canvas>
      </div>

      <!-- Top páginas -->
      <div class="card" style="padding:1rem">
        <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em">Top páginas hoy</div>
        <div id="ga-top-paginas"><p style="color:#888;font-size:0.85rem">Cargando...</p></div>
      </div>

      <!-- Setup guide si no está configurado -->
      <div id="ga-setup" style="display:none;margin-top:1rem" class="card">
        <h4 style="margin-top:0">⚙️ Configuración pendiente</h4>
        <div id="ga-setup-body"></div>
      </div>
    </div>
  `,await gt(),oe=setInterval(async()=>{document.getElementById("ga-activos")?await Ue():(clearInterval(oe),oe=null)},3e4)}async function we(e,t=8e3){const o=new AbortController,a=setTimeout(()=>o.abort(),t);try{const n=await fetch(e,{signal:o.signal});return clearTimeout(a),n}catch(n){throw clearTimeout(a),n.name==="AbortError"?new Error("timeout"):n}}async function gt(){const e=[Ue().catch(()=>ue("ga-activos","—")),ft().catch(()=>ue("ga-sesiones","—")),bt().catch(()=>ue("ga-chart",null))];await Promise.allSettled(e);const t=document.getElementById("ga-ultima-act");t&&(t.textContent="Actualizado: "+new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))}function ue(e,t){const o=document.getElementById(e);o&&t!==null&&(o.textContent=t)}async function Ue(){var e;try{const o=await(await we(`${f}/analytics/tiempo-real`)).json();if(!o.configurado){yt(o);return}const a=document.getElementById("ga-activos");if(!a)return;a.textContent=o.activos_ahora??0;const n=document.getElementById("ga-dispositivos");n&&o.por_dispositivo&&(n.textContent=Object.entries(o.por_dispositivo).map(([r,s])=>`${r}: ${s}`).join(" · "));const i=document.getElementById("ga-paginas-rt");i&&((e=o.por_pais)!=null&&e.length)?i.innerHTML='<div style="font-size:0.65rem;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Por país</div>'+o.por_pais.map(r=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid #f5f5f5;gap:4px">
            <span style="font-size:0.68rem;color:#555;flex:1">${r.pais||"Desconocido"}</span>
            <span style="font-size:0.68rem;font-weight:700;color:#22c55e;flex-shrink:0">${r.activos}</span>
          </div>`).join(""):i&&(i.innerHTML="")}catch(t){console.warn("GA realtime:",t.message)}}async function ft(){var e;try{const o=await(await we(`${f}/analytics/hoy`)).json();if(!o.configurado)return;if(o.error){console.warn("GA hoy error:",o.error);return}const a=document.getElementById("ga-hoy-label");a&&(a.textContent=o.periodo==="ayer"?"Ayer (GA4 procesando hoy)":"Hoy");const n=(s,d)=>{const l=document.getElementById(s);l&&(l.textContent=d)};n("ga-sesiones",o.sesiones??"—"),n("ga-usuarios",o.usuarios_activos??"—"),n("ga-pageviews",o.paginas_vistas??"—"),n("ga-nuevos",o.usuarios_nuevos??"—");const i=o.duracion_promedio_s;n("ga-duracion",i?`${Math.floor(i/60)}m ${i%60}s`:"—"),n("ga-rebote",o.tasa_rebote!=null?`${o.tasa_rebote}%`:"—");const r=document.getElementById("ga-top-paginas");r&&((e=o.top_paginas)!=null&&e.length?r.innerHTML=o.top_paginas.map(s=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;border-bottom:1px solid #f0f0f0;gap:0.5rem">
            <span style="font-size:0.8rem;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1"
                  title="${s.pagina}">${s.pagina}</span>
            <span style="font-size:0.8rem;font-weight:600;color:#3483fa;flex-shrink:0">${s.vistas} vistas</span>
          </div>`).join(""):r.innerHTML='<p style="color:#bbb;font-size:0.82rem;margin:0">Sin datos de páginas aún</p>')}catch(t){console.warn("GA hoy:",t.message)}}async function bt(){var e;try{const o=await(await we(`${f}/analytics/semana`)).json();if(!o.configurado||!((e=o.dias)!=null&&e.length))return;const a=document.getElementById("ga-chart");if(!a||!window.Chart)return;a._chartInstance&&a._chartInstance.destroy(),a._chartInstance=new Chart(a,{type:"bar",data:{labels:o.dias.map(n=>n.fecha),datasets:[{label:"Sesiones",data:o.dias.map(n=>n.sesiones),backgroundColor:"rgba(52,131,250,0.7)",borderRadius:4},{label:"Usuarios",data:o.dias.map(n=>n.usuarios),backgroundColor:"rgba(34,197,94,0.5)",borderRadius:4}]},options:{responsive:!0,plugins:{legend:{position:"top"}},scales:{y:{beginAtZero:!0,ticks:{precision:0}}}}})}catch(t){console.warn("GA semana:",t.message)}}function yt(e){const t=document.getElementById("ga-setup"),o=document.getElementById("ga-setup-body");!t||!o||(t.style.display="block",o.innerHTML=`
    <p style="color:#666;margin-bottom:0.75rem">${e.mensaje||""}</p>
    <ol style="color:#555;font-size:0.85rem;line-height:1.8">
      ${(e.pasos||[]).map(a=>`<li>${a}</li>`).join("")}
    </ol>
    <p style="font-size:0.82rem;color:#888;margin-top:0.75rem">
      Variables a agregar en Railway → Variables:
      <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">GA4_PROPERTY_ID</code> y
      <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">GA4_CREDENTIALS_JSON</code>
    </p>`,["ga-activos","ga-sesiones","ga-usuarios","ga-pageviews","ga-nuevos","ga-duracion","ga-rebote"].forEach(a=>{const n=document.getElementById(a);n&&(n.textContent="—")}))}async function $e(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando referidos...</p>';try{const o=await(await fetch(f+"/clientes/referidos")).json(),a=o.filter(d=>d.codigo_referido).length,n=o.filter(d=>parseFloat(d.credito_disponible||0)>0).length,i=o.reduce((d,l)=>d+parseFloat(l.credito_disponible||0),0),r=o.filter(d=>d.codigo_referido&&o.some(l=>l.referido_por===d.codigo_referido)),s={};o.forEach(d=>{d.codigo_referido&&(s[d.codigo_referido]=d.nombre)}),window._referidosData=o,e.innerHTML=`
      <div style="padding:1rem;max-width:960px">
        <h2 style="margin:0 0 1rem;font-size:1.1rem">🎁 Programa de Referidos</h2>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:1.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#333">${o.length}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Clientes menudeo</p>
          </div>
          <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${r.length}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Han referido alguien</p>
          </div>
          <div style="background:#e8f5e9;border-radius:12px;padding:1rem;border:1px solid #a5d6a7;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${n}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Con crédito activo</p>
          </div>
          <div style="background:#fce4ec;border-radius:12px;padding:1rem;border:1px solid #f48fb1;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#c62828">$${i.toFixed(0)}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Crédito total emitido</p>
          </div>
        </div>

        <!-- Buscador -->
        <input id="ref-buscar" type="text" placeholder="Buscar cliente..." oninput="filtrarReferidos(this.value)"
          style="width:100%;box-sizing:border-box;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:0.88rem;margin-bottom:1rem;outline:none">

        <!-- Tabla -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:0.83rem">
            <thead>
              <tr style="background:#fafafa;border-bottom:1px solid #eee">
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Cliente</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Código</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Referido por</th>
                <th style="padding:10px 12px;text-align:right;font-weight:600;color:#555">Crédito</th>
                <th style="padding:10px 12px;text-align:center;font-weight:600;color:#555">Acción</th>
              </tr>
            </thead>
            <tbody id="ref-tbody">
              ${o.map(d=>vt(d,s)).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `}catch(t){e.innerHTML=`<p style="padding:2rem;color:red">Error cargando referidos: ${t.message}</p>`}}function vt(e,t){const o=parseFloat(e.credito_disponible||0),a=e.referido_por?t[e.referido_por]||e.referido_por:"—",n=o>0?"#2e7d32":"#aaa";return`<tr id="ref-row-${e.id}" style="border-bottom:1px solid #f5f5f5">
    <td style="padding:10px 12px">
      <p style="font-weight:600;margin:0">${e.nombre||"—"}</p>
      <p style="font-size:0.75rem;color:#888;margin:2px 0 0">${e.email||e.telefono||""}</p>
    </td>
    <td style="padding:10px 12px">
      ${e.codigo_referido?`<span style="font-family:monospace;background:#f0f0f0;padding:3px 8px;border-radius:6px;font-size:0.8rem;letter-spacing:1px">${e.codigo_referido}</span>`:`<button onclick="generarCodigoReferido('${e.id}')" style="font-size:0.75rem;padding:3px 8px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;color:#555">Generar</button>`}
    </td>
    <td style="padding:10px 12px;color:#555">${a}</td>
    <td style="padding:10px 12px;text-align:right;font-weight:700;color:${n}">$${o.toFixed(0)} MXN</td>
    <td style="padding:10px 12px;text-align:center">
      <button onclick="ajustarCredito('${e.id}','${(e.nombre||"").replace(/'/g,"\\'")}',${o})"
        style="font-size:0.75rem;padding:4px 10px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;color:#333">
        Ajustar
      </button>
    </td>
  </tr>`}window.filtrarReferidos=function(e){const t=document.querySelectorAll("#ref-tbody tr"),o=e.toLowerCase();t.forEach(a=>{a.style.display=a.textContent.toLowerCase().includes(o)?"":"none"})};window.generarCodigoReferido=async function(e){try{(await(await fetch(f+"/referidos/mi-codigo/"+e)).json()).codigo_referido?await $e():alert("Error generando código")}catch(t){alert("Error: "+t.message)}};window.ajustarCredito=async function(e,t,o){const a=prompt(`Ajustar crédito de ${t}
Crédito actual: $${o} MXN

Nuevo monto:`,o);if(a===null)return;const n=parseFloat(a);if(isNaN(n)||n<0)return alert("Monto inválido");try{(await fetch(f+"/clientes/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({credito_disponible:n})})).ok?await $e():alert("Error actualizando crédito")}catch(i){alert("Error: "+i.message)}};async function Ee(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando carritos...</p>';try{const[t,o,a]=await Promise.all([fetch(f+"/pedidos/?status=borrador").then(i=>i.json()).catch(()=>[]),fetch(f+"/clientes/").then(i=>i.json()),fetch(f+"/sucursales/").then(i=>i.json())]),n=Array.isArray(t)?t.filter(i=>i.status==="borrador"&&(!i.canal||i.canal==="sucursal"||i.canal==="mayoreo")):[];e.innerHTML=`
      <div style="padding:0 0 1rem">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:8px">
          <div>
            <p style="font-size:0.72rem;font-weight:600;letter-spacing:0.08em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Punto de venta</p>
            <h2 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0">Carritos activos</h2>
            <p style="color:#94a3b8;font-size:0.78rem;margin:4px 0 0">El stock se reserva al confirmar la venta</p>
          </div>
          <button class="btn btn-primary" onclick="nuevoCarrito()">+ Nuevo carrito</button>
        </div>

        ${n.length===0?`
          <div class="table-card" style="padding:3rem;text-align:center">
            <p style="font-weight:700;color:#0f172a;font-size:1rem">Sin carritos abiertos</p>
            <p style="font-size:0.82rem;color:#94a3b8;margin-top:4px">Crea uno para agregar productos a un cliente</p>
            <button class="btn btn-primary" style="margin-top:1.25rem" onclick="nuevoCarrito()">+ Nuevo carrito</button>
          </div>
        `:`
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
            ${n.map(i=>{const r=i.clientes||{},s=i.created_at?Math.floor((Date.now()-new Date(i.created_at).getTime())/864e5):0;return`
                <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:1.2rem;cursor:pointer;transition:box-shadow 0.18s,border-color 0.18s" onclick="abrirCarrito('${i.id}')"
                     onmouseenter="this.style.boxShadow='0 4px 24px rgba(0,0,0,0.08)';this.style.borderColor='#E91E8C'" onmouseleave="this.style.boxShadow='';this.style.borderColor='#e2e8f0'">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
                    <div>
                      <p style="font-weight:700;font-size:0.95rem;color:#0f172a;margin:0">${r.nombre||"Sin cliente"}</p>
                      <p style="font-size:0.75rem;color:#94a3b8;margin:3px 0 0">${r.telefono||"Sin teléfono"}</p>
                    </div>
                    <span style="background:${s===0?"#f0fdf4":s<=2?"#fffbeb":"#fef2f2"};color:${s===0?"#065f46":s<=2?"#b45309":"#991b1b"};border:1px solid ${s===0?"#bbf7d0":s<=2?"#fde68a":"#fecaca"};border-radius:100px;padding:3px 10px;font-size:0.7rem;font-weight:700;white-space:nowrap">
                      ${s===0?"Hoy":s===1?"1 día":s+" días"}
                    </span>
                  </div>
                  <div style="border-top:1px solid #f1f5f9;padding-top:12px;margin-bottom:14px">
                    <p style="font-size:0.65rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;margin:0 0 2px">Total</p>
                    <p style="font-weight:700;font-size:1.35rem;color:#E91E8C;margin:0">$${parseFloat(i.total||0).toLocaleString("es-MX",{minimumFractionDigits:2})}</p>
                  </div>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-primary" style="flex:1;font-size:0.8rem" onclick="event.stopPropagation();abrirCarrito('${i.id}')">Abrir</button>
                    <button class="btn btn-secondary" style="font-size:0.8rem;color:#dc2626;border-color:#fca5a5" onclick="event.stopPropagation();liberarCarrito('${i.id}')">Liberar</button>
                  </div>
                </div>
              `}).join("")}
          </div>
        `}
      </div>
    `,window._carritoClientes=o,window._carritoSucursales=a}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando carritos</p>'}}window.nuevoCarrito=async()=>{const e=window._carritoClientes||[],t=window._carritoSucursales||[],o=document.getElementById("content");o.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:500px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="cargarCarritos()">← Volver</button>
        <h3 style="margin:0">Nuevo carrito</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Cliente</label>
          <select id="nc-cliente" class="form-input">
            <option value="">— Selecciona cliente —</option>
            ${e.map(a=>`<option value="${a.id}">${a.nombre}${a.telefono?" · "+a.telefono:""}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Sucursal</label>
          <select id="nc-sucursal" class="form-input">
            ${t.map(a=>`<option value="${a.id}">${a.nombre}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="form-label">Comentario (opcional)</label>
          <input class="form-input" id="nc-comentario" placeholder="Ej: Anticipo $500, entrega el viernes...">
        </div>
        <button class="btn btn-primary" onclick="crearNuevoCarrito()">Crear carrito</button>
      </div>
    </div>
  `};window.crearNuevoCarrito=async()=>{var a;const e=document.getElementById("nc-cliente").value,t=document.getElementById("nc-sucursal").value,o=document.getElementById("nc-comentario").value;if(!e){alert("Selecciona un cliente");return}try{const i=await(await fetch(f+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:e,sucursal_id:t,canal:"sucursal",forma_pago:"efectivo",status:"borrador",total:0,subtotal:0,comentarios:o||null,items:[]})})).json(),r=i.id||((a=i[0])==null?void 0:a.id);if(!r){alert("Error creando carrito");return}abrirCarrito(r)}catch(n){alert("Error: "+n.message)}};window.abrirCarrito=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando carrito...</p>';try{const[o,a,n,i,r]=await Promise.all([fetch(f+"/pedidos/"+e).then(l=>l.json()),fetch(f+"/pedidos/"+e+"/items").then(l=>l.json()),fetch(f+"/variantes/?activa=eq.true").then(l=>l.json()),fetch(f+"/productos/").then(l=>l.json()),fetch(f+"/inventario/").then(l=>l.json()).catch(()=>[])]),s=Array.isArray(o)?o[0]:o,d=s.clientes||{};window._carritoActivo={pedidoId:e,items:Array.isArray(a)?a:[],variantes:n,productos:i,inventario:r,sucursalId:s.sucursal_id},Xe(s)}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando carrito</p>'}};function Xe(e){const t=document.getElementById("content"),{pedidoId:o,items:a,variantes:n,productos:i,inventario:r,sucursalId:s}=window._carritoActivo,d=e.clientes||{},l=a.reduce((m,g)=>m+g.cantidad*g.precio_unitario,0),c=a.reduce((m,g)=>m+g.cantidad,0),p=e.created_at?Math.floor((Date.now()-new Date(e.created_at).getTime())/864e5):0;t.innerHTML=`
    <div style="max-width:860px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCarritos()">← Carritos</button>
        <div style="flex:1">
          <h3 style="margin:0">${d.nombre||"Sin cliente"}</h3>
          <p style="font-size:0.8rem;color:#888;margin:2px 0 0">${d.telefono||""} · Abierto hace ${p===0?"hoy":p+" día(s)"}</p>
        </div>
        <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="confirmarVentaCarrito('${o}','${e.forma_pago||"efectivo"}')">
          ✅ Confirmar venta
        </button>
        <button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="liberarCarrito('${o}')">
          🗑 Liberar
        </button>
      </div>

      <!-- Buscador para agregar productos -->
      <div class="table-card" style="padding:1.2rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <p style="font-weight:600;color:#333;margin:0">Agregar producto</p>
          <div style="display:flex;gap:0;border:1px solid #ddd;border-radius:8px;overflow:hidden">
            <button id="c-modo-par" onclick="carritoModo('par')"
              style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:#E91E8C;color:white;font-weight:600">Par suelto</button>
            <button id="c-modo-corrida" onclick="carritoModo('corrida')"
              style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:white;color:#888">Corrida completa</button>
          </div>
        </div>

        <!-- Modo par suelto -->
        <div id="c-panel-par">
          <div style="position:relative">
            <input class="form-input" id="c-buscar-prod" placeholder="🔍 Busca el modelo (nombre o SKU)…" oninput="buscarProductoCarrito(this.value)" autocomplete="off"
              onfocus="posicionarDropdownCarrito('c-prod-resultados','c-buscar-prod')" onblur="setTimeout(()=>{const el=document.getElementById('c-prod-resultados');if(el)el.style.display='none'},250)">
            <div id="c-prod-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:340px;overflow-y:auto;min-width:300px"></div>
          </div>
          <p style="font-size:0.76rem;color:#888;margin:7px 0 0;line-height:1.4">Busca el modelo y <strong>toca una talla</strong> para agregar 1 par. El precio se ajusta solo (menudeo · mayoreo). Ajusta cantidades en la lista de abajo.</p>
          <p id="c-prod-seleccionado" style="display:none"></p>
        </div>

        <!-- Modo corrida -->
        <div id="c-panel-corrida" style="display:none">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px">
            <div style="flex:2;min-width:200px;position:relative">
              <label style="font-size:0.75rem;color:#888;display:block;margin-bottom:4px">Modelo (busca sin talla)</label>
              <input class="form-input" id="c-buscar-corrida" placeholder="Ej: M-TAC-0033 o nombre..." oninput="buscarModeloCarrito(this.value)" autocomplete="off" style="font-size:0.9rem"
                onfocus="posicionarDropdownCarrito('c-corrida-resultados','c-buscar-corrida')" onblur="setTimeout(()=>{const el=document.getElementById('c-corrida-resultados');if(el)el.style.display='none'},200)">
              <div id="c-corrida-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:260px;overflow-y:auto;min-width:320px"></div>
            </div>
            <div style="width:90px">
              <label style="font-size:0.75rem;color:#888;display:block;margin-bottom:4px">Precio/par</label>
              <input type="number" class="form-input" id="c-precio-corrida" placeholder="$" style="font-size:0.9rem">
            </div>
          </div>
          <div id="c-corrida-tallas" style="display:none;background:#f9f9f9;border-radius:8px;padding:12px;margin-top:8px">
            <p style="font-size:0.8rem;font-weight:600;color:#333;margin-bottom:8px">Selecciona tallas a agregar:</p>
            <div id="c-corrida-tallas-grid" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px"></div>
            <button class="btn btn-primary" style="background:#6a1b9a;border-color:#6a1b9a" onclick="agregarCorridaAlCarritoActivo()">📦 Agregar corrida</button>
          </div>
        </div>
      </div>

      <!-- Lista de productos en el carrito -->
      <div class="table-card" style="padding:1.2rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <p style="font-weight:600;color:#333;margin:0">Productos en carrito (<span id="carrito-total-pares">${c}</span> pares)</p>
          <p style="font-weight:700;font-size:1.2rem;color:#E91E8C;margin:0">Total: $<span id="carrito-total-monto">${l.toFixed(2)}</span></p>
        </div>

        <div id="carrito-items-lista">
          ${a.length===0?'<p style="color:#aaa;text-align:center;padding:2rem">Carrito vacío — agrega productos arriba</p>':""}
          ${(()=>{const m={};return a.forEach((g,u)=>{const b=g.variantes||{},v=b.productos||{},y=v.nombre||g.nombre||"—",h=b.color||g.color||"",w=!!g.es_corrida,_=w?"c|"+y+"|"+h:"s|"+g.id;m[_]||(m[_]={nombre:y,color:h,esCorrida:w,items:[],imagen:b.foto_url||v.imagen_principal||null}),m[_].items.push({...g,_idx:u})}),Object.values(m).map(g=>{const u=g.esCorrida,b=g.imagen;if(u){const v=g.items.reduce((_,x)=>_+x.cantidad,0),y=g.items.reduce((_,x)=>_+x.cantidad*x.precio_unitario,0),h=(y/v).toFixed(2),w=g.items.map(_=>_.id).join(",");return`
                  <div style="background:#fdf4ff;border-radius:8px;padding:12px;margin-bottom:8px;border:1px solid #e8d5f5">
                    <div style="display:flex;align-items:start;gap:10px;margin-bottom:8px">
                      ${b?`<img src="${b}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>'}
                      <div style="flex:1">
                        <p style="font-weight:700;font-size:0.88rem;margin:0">${g.nombre}</p>
                        <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600;margin:2px 0 4px">📦 Corrida · ${g.color}</p>
                        <div style="display:flex;flex-wrap:wrap;gap:4px">
                          ${g.items.map(_=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${(_.variantes||{}).talla||_.talla||"?"}</span>`).join("")}
                        </div>
                      </div>
                      <button onclick="eliminarCorridaCarrito('${w}')" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1.1rem;padding:4px">🗑</button>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                      <span id="corrida-header-${w.replace(/,/g,"_").substring(0,20)}" style="font-size:0.85rem;color:#888">${v} pares · <strong style="color:#6a1b9a">$${y.toFixed(2)}</strong></span>
                      <div style="display:flex;align-items:center;gap:4px">
                        <span style="font-size:0.72rem;color:#888">$</span>
                        <input type="number" value="${h}"
                          onchange="actualizarPrecioCorridaCarrito('${w}', this.value)"
                          style="width:70px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
                        <span style="font-size:0.72rem;color:#888">/par</span>
                      </div>
                      <strong style="color:#6a1b9a">$${y.toFixed(2)}</strong>
                    </div>
                    <!-- Detalle editable por talla (toggle) -->
                    <div id="corrida-detalle-${w.replace(/,/g,"_").substring(0,20)}" style="display:none;margin-top:10px;border-top:1px solid #e8d5f5;padding-top:10px">
                      ${g.items.map(_=>{const z=(_.variantes||{}).talla||_.talla||"?",B=r.find(C=>C.variante_id===_.variante_id&&(s?C.sucursal_id===s:!0)),$=B?B.cantidad:999;return`
                          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"
                               data-item-id="${_.id}" data-item-idx="${_._idx}" data-stock="${$}" data-precio="${_.precio_unitario}">
                            <span style="background:#f3e5f5;border-radius:100px;padding:3px 10px;font-size:0.8rem;font-weight:700;color:#6a1b9a;min-width:44px;text-align:center">T${z}</span>
                            <button onclick="cambiarCantCorridaDOM(this.parentElement,-1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem">−</button>
                            <span class="ccd-cant" style="font-weight:700;min-width:20px;text-align:center;font-size:0.9rem">${_.cantidad}</span>
                            <button onclick="cambiarCantCorridaDOM(this.parentElement,1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem">+</button>
                            <span style="font-size:0.8rem;color:#888;flex:1">× $${_.precio_unitario}</span>
                            <strong class="ccd-sub" style="color:#6a1b9a;font-size:0.82rem">$${(_.cantidad*_.precio_unitario).toFixed(2)}</strong>
                            <button onclick="eliminarDeCarrito('${_.id}',${_._idx})" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1rem;padding:2px">🗑</button>
                          </div>`}).join("")}
                    </div>
                    <button onclick="toggleCorridaDetalle('${w.replace(/,/g,"_").substring(0,20)}')"
                      style="margin-top:8px;background:none;border:1px solid #d8b4fe;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#6a1b9a;cursor:pointer;width:100%">
                      ✏️ Editar tallas individualmente
                    </button>
                  </div>`}else{const v=g.items[0],y=v.variantes||{};y.productos;const h=y.talla||v.talla||"",w=r.find(x=>x.variante_id===v.variante_id&&(s?x.sucursal_id===s:!0)),_=w?w.cantidad:null;return`
                  <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee;flex-wrap:wrap">
                    ${b?`<img src="${b}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#eee;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>'}
                    <div style="flex:1;min-width:120px">
                      <p style="font-weight:600;font-size:0.85rem;margin:0">${g.nombre}${g.color?" · "+g.color:""}${h?" T"+h:""}</p>
                      ${_!==null?`<p style="font-size:0.72rem;color:${_>0?"#2e7d32":"#c62828"};margin:2px 0 0">Stock: ${_} pares</p>`:""}
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <button onclick="cambiarCantidadCarrito(${v._idx},-1)" style="background:#eee;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem">−</button>
                      <span style="font-weight:700;min-width:24px;text-align:center">${v.cantidad}</span>
                      <button onclick="cambiarCantidadCarrito(${v._idx},1)" style="background:#eee;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem">+</button>
                    </div>
                    <input type="number" value="${v.precio_unitario}" style="width:80px;padding:5px;border:1px solid #ddd;border-radius:6px;text-align:center;font-size:0.85rem"
                      onchange="actualizarPrecioCarrito(${v._idx}, this.value)">
                    <strong style="color:#E91E8C;min-width:70px;text-align:right">$${(v.cantidad*v.precio_unitario).toFixed(2)}</strong>
                    <button onclick="eliminarDeCarrito('${v.id}',${v._idx})" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1.1rem;padding:4px">🗑</button>
                  </div>`}}).join("")})()}
        </div>

        ${a.length>0?`
          <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee;display:flex;justify-content:flex-end;align-items:center;gap:1rem">
            <div style="display:flex;align-items:center;gap:8px">
              <label style="font-size:0.85rem;color:#333">Forma de pago:</label>
              <select id="c-forma-pago" class="form-input" style="width:140px">
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="spei">SPEI</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
            <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32;font-size:1rem;padding:10px 24px" onclick="confirmarVentaCarrito('${o}')">
              ✅ Confirmar venta — $<span id="carrito-total-btn">${l.toFixed(2)}</span>
            </button>
          </div>
        `:""}
      </div>
    </div>
  `,window._carritoActivo.pedidoData=e,window._carritoActivo.varianteSeleccionada=null}window.mostrarToastPanel=e=>{let t=document.getElementById("panel-toast");t||(t=document.createElement("div"),t.id="panel-toast",t.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:10px 20px;border-radius:8px;font-size:0.9rem;z-index:99999;transition:opacity 0.3s",document.body.appendChild(t)),t.textContent=e,t.style.opacity="1",clearTimeout(t._timer),t._timer=setTimeout(()=>{t.style.opacity="0"},3e3)};window.posicionarDropdownCarrito=(e,t)=>{const o=document.getElementById(t),a=document.getElementById(e);if(!o||!a)return;const n=o.getBoundingClientRect();a.style.top=n.bottom+4+"px",a.style.left=n.left+"px",a.style.width=Math.max(n.width,320)+"px"};window.buscarProductoCarrito=e=>{const{variantes:t,productos:o}=window._carritoActivo,a=document.getElementById("c-prod-resultados");if(!a)return;if(posicionarDropdownCarrito("c-prod-resultados","c-buscar-prod"),!e||e.length<2){a.style.display="none";return}const n=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],i=e.toLowerCase().split(" ").filter(Boolean),r=t.filter(l=>{const c=o.find(m=>m.id===l.producto_id),p=(((c==null?void 0:c.nombre)||"")+" "+(l.color||"")+" "+(l.talla||"")+" "+((c==null?void 0:c.sku_interno)||"")).toLowerCase();return i.every(m=>p.includes(m))});if(!r.length){a.innerHTML='<div style="padding:12px 14px;color:#888;font-size:0.85rem">Sin resultados</div>',a.style.display="block";return}const s={};r.forEach(l=>{const c=o.find(m=>m.id===l.producto_id),p=l.producto_id+"|"+(l.color||"");s[p]||(s[p]={nombre:(c==null?void 0:c.nombre)||"—",color:l.color||"",foto:c==null?void 0:c.imagen_principal,hex:l.color_hex,vars:[]}),s[p].vars.push(l)});const d=Object.values(s).slice(0,6);a.style.display="block",a.innerHTML=d.map(l=>{const c=l.vars.sort((p,m)=>n.indexOf(p.talla)-n.indexOf(m.talla)).map(p=>{const m=window._carritoActivo.inventario.find(b=>b.variante_id===p.id&&b.sucursal_id===window._carritoActivo.sucursalId),g=m?m.cantidad:0,u=window._carritoActivo.items.filter(b=>b.variante_id===p.id&&!b.es_corrida).reduce((b,v)=>b+v.cantidad,0);return`
          <button onmousedown="event.preventDefault()" onclick="quickAddCarrito('${p.id}')" ${g<=0?"disabled":""}
                  style="position:relative;min-width:50px;min-height:48px;padding:5px 9px;border:1.5px solid ${u>0?"#E91E8C":"#ddd"};border-radius:10px;background:${u>0?"#fce4f3":"#fff"};font-family:inherit;cursor:${g<=0?"not-allowed":"pointer"};${g<=0?"opacity:0.45":""};display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;touch-action:manipulation">
            <span style="font-size:0.92rem;font-weight:800;color:#333">T${p.talla}</span>
            <span style="font-size:0.6rem;font-weight:600;color:${g>0?"#2e7d32":"#c62828"}">${g>0?"stock "+g:"agotado"}</span>
            ${u>0?`<span style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:19px;height:19px;font-size:0.65rem;display:flex;align-items:center;justify-content:center;font-weight:800;padding:0 4px">${u}</span>`:""}
          </button>`}).join("");return`
      <div style="padding:11px 12px;border-bottom:1px solid #f0f0f0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
          ${l.foto?`<img src="${l.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:7px;flex-shrink:0">`:'<div style="width:36px;height:36px;background:#f3f3f3;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
          ${l.hex?`<span style="width:13px;height:13px;border-radius:50%;background:${l.hex};border:1px solid #ddd;flex-shrink:0"></span>`:""}
          <span style="font-size:0.86rem;font-weight:600;line-height:1.2">${l.nombre}</span>
          <span style="font-size:0.78rem;color:#888">· ${l.color}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px">${c}</div>
      </div>`}).join("")};window.quickAddCarrito=async e=>{const t=window._carritoActivo;if(!t)return;const o=t.variantes.find(s=>s.id===e),a=o?t.productos.find(s=>s.id===o.producto_id):null,n=parseFloat((a==null?void 0:a.precio_mayoreo6)||(a==null?void 0:a.precio_mayoreo3)||(a==null?void 0:a.precio_menudeo))||0,i=t.items.find(s=>s.variante_id===e&&!s.es_corrida),r=document.getElementById("c-buscar-prod")?document.getElementById("c-buscar-prod").value:"";try{i?await fetch(f+"/pedidos/"+t.pedidoId+"/items/"+i.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:i.cantidad+1,precio_unitario:i.precio_unitario})}):await fetch(f+"/pedidos/"+t.pedidoId+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,cantidad:1,precio_unitario:n,subtotal:n,nombre:(a==null?void 0:a.nombre)||"",color:(o==null?void 0:o.color)||"",talla:(o==null?void 0:o.talla)||""})});const s=await fetch(f+"/pedidos/"+t.pedidoId+"/items").then(l=>l.json());t.items=Array.isArray(s)?s:[],t._tier=null,await recalcularPreciosCarrito(),Xe(t.pedidoData);const d=t.items.reduce((l,c)=>l+c.cantidad,0);mostrarToastPanel("✓ "+((a==null?void 0:a.nombre)||"")+" T"+((o==null?void 0:o.talla)||"")+" · "+d+" pares"),r&&setTimeout(()=>{const l=document.getElementById("c-buscar-prod");l&&(l.value=r,buscarProductoCarrito(r))},300)}catch(s){alert("Error: "+s.message)}};window.seleccionarVarianteCarrito=e=>{const{variantes:t,productos:o}=window._carritoActivo,a=t.find(s=>s.id===e),n=o.find(s=>s.id===(a==null?void 0:a.producto_id));window._carritoActivo.varianteSeleccionada=e,document.getElementById("c-buscar-prod").value=`${(n==null?void 0:n.nombre)||""} · ${(a==null?void 0:a.color)||""} T${(a==null?void 0:a.talla)||""}`,document.getElementById("c-prod-resultados").style.display="none";const i=(n==null?void 0:n.precio_mayoreo6)||(n==null?void 0:n.precio_mayoreo3)||(n==null?void 0:n.precio_menudeo)||"";document.getElementById("c-precio").value=i;const r=document.getElementById("c-prod-seleccionado");r.style.display="block",r.textContent=`✓ Seleccionado: ${n==null?void 0:n.nombre} — ${a==null?void 0:a.color} T${a==null?void 0:a.talla}`};window.agregarAlCarritoActivo=async()=>{var s;const e=(s=window._carritoActivo)==null?void 0:s.varianteSeleccionada,t=parseInt(document.getElementById("c-cantidad").value)||1,o=parseFloat(document.getElementById("c-precio").value)||0;if(!e){alert("Selecciona un producto primero");return}if(!o){alert("Ingresa el precio por par");return}const{variantes:a,productos:n}=window._carritoActivo,i=a.find(d=>d.id===e),r=n.find(d=>d.id===(i==null?void 0:i.producto_id));try{if(!(await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,cantidad:t,precio_unitario:o,subtotal:t*o,nombre:(r==null?void 0:r.nombre)||"",color:(i==null?void 0:i.color)||"",talla:(i==null?void 0:i.talla)||""})})).ok){alert("Error agregando producto");return}const l=await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items").then(c=>c.json());window._carritoActivo.items=Array.isArray(l)?l:[],window._carritoActivo._tier=null,await recalcularPreciosCarrito(),document.getElementById("c-buscar-prod").value="",document.getElementById("c-cantidad").value="1",document.getElementById("c-precio").value="",document.getElementById("c-prod-seleccionado").style.display="none",window._carritoActivo.varianteSeleccionada=null,await abrirCarrito(window._carritoActivo.pedidoId)}catch(d){alert("Error: "+d.message)}};window.cambiarCantidadCarrito=async(e,t)=>{const o=window._carritoActivo.items[e];if(!o)return;const a=Math.max(1,o.cantidad+t);window._carritoActivo.items[e].cantidad=a;try{await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+o.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:a,precio_unitario:o.precio_unitario})}),await recalcularPreciosCarrito(),await abrirCarrito(window._carritoActivo.pedidoId)}catch(n){alert("Error: "+n.message)}};window.recalcularPreciosCarrito=async()=>{const{pedidoId:e,items:t,variantes:o,productos:a}=window._carritoActivo,n=t.reduce((c,p)=>c+p.cantidad,0),i=n>=6?"mayoreo6":n>=3?"mayoreo3":"menudeo",r=window._carritoActivo._tier||"menudeo";if(i===r)return;window._carritoActivo._tier=i;const s=i==="mayoreo6"?"Mayoreo 6+ pares":i==="mayoreo3"?"Mayoreo 3-5 pares":"Menudeo";let d=!1;for(const c of t){if(c._precio_manual)continue;const p=o.find(b=>b.id===c.variante_id),m=p?a.find(b=>b.id===p.producto_id):null;if(!m)continue;const g=parseFloat(m.precio_menudeo)||0;let u;i==="mayoreo6"?u=parseFloat(m.precio_mayoreo6)||(g>0?Math.round(g-70):g):i==="mayoreo3"?u=parseFloat(m.precio_mayoreo3)||(g>0?Math.round(g-30):g):u=g,u&&u!==c.precio_unitario&&(c.precio_unitario=u,await fetch(f+"/pedidos/"+e+"/items/"+c.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:c.cantidad,precio_unitario:u})}),d=!0)}const l=t.reduce((c,p)=>c+p.cantidad*p.precio_unitario,0);await fetch(f+"/pedidos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:l})}),d&&mostrarToastPanel(`📦 Precios actualizados a ${s}`)};window.actualizarPrecioCarrito=async(e,t)=>{const o=window._carritoActivo.items[e],a=parseFloat(t)||0;if(!(!a||!o)){o._precio_manual=!0;try{await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+o.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:o.cantidad,precio_unitario:a})});const n=window._carritoActivo.items.map((i,r)=>(r===e?a:i.precio_unitario)*i.cantidad).reduce((i,r)=>i+r,0);await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:n})}),await abrirCarrito(window._carritoActivo.pedidoId)}catch(n){alert("Error: "+n.message)}}};window.eliminarDeCarrito=async(e,t)=>{if(!e||e==="undefined"){alert("Error: el ítem no tiene ID válido");return}try{const o=await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+e,{method:"DELETE"});if(!o.ok){const n=await o.json().catch(()=>({}));alert("Error eliminando: "+(n.error||o.status));return}const a=window._carritoActivo.items.filter((n,i)=>i!==t).reduce((n,i)=>n+i.cantidad*i.precio_unitario,0);await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:a})}),await abrirCarrito(window._carritoActivo.pedidoId)}catch(o){alert("Error: "+o.message)}};window.cambiarCantCorridaDOM=async(e,t)=>{const o=e.dataset.itemId,a=parseInt(e.dataset.itemIdx),n=parseInt(e.dataset.stock)||999,i=parseFloat(e.dataset.precio)||0,r=e.querySelector(".ccd-cant"),s=e.querySelector(".ccd-sub");if(!o||!r)return;const d=parseInt(r.textContent)||1,l=Math.max(1,d+t);if(t>0&&l>n){mostrarToastPanel(`⚠️ Solo hay ${n} pares en stock`);return}try{await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+o,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:l,precio_unitario:i})}),r.textContent=l,s&&(s.textContent="$"+(l*i).toFixed(2)),window._carritoActivo.items[a]&&(window._carritoActivo.items[a].cantidad=l);const c=e.closest('[id^="corrida-detalle-"]');if(c){const v=c.querySelectorAll("[data-item-id]");let y=0,h=0;v.forEach(z=>{var C;const B=parseInt(((C=z.querySelector(".ccd-cant"))==null?void 0:C.textContent)||0),$=parseFloat(z.dataset.precio||0);y+=B,h+=B*$});const w=c.id.replace("corrida-detalle-","corrida-header-"),_=document.getElementById(w);_&&(_.innerHTML=`${y} pares · <strong style="color:#6a1b9a">$${h.toFixed(2)}</strong>`);const x=c.parentElement;x&&x.querySelectorAll('strong[style*="6a1b9a"]').forEach(B=>{B.closest('[id^="corrida-header"]')||(B.textContent="$"+h.toFixed(2))})}const p=window._carritoActivo.items.reduce((v,y)=>v+y.cantidad*y.precio_unitario,0),m=window._carritoActivo.items.reduce((v,y)=>v+y.cantidad,0),g=document.getElementById("carrito-total-monto"),u=document.getElementById("carrito-total-pares"),b=document.getElementById("carrito-total-btn");g&&(g.textContent=p.toFixed(2)),u&&(u.textContent=m),b&&(b.textContent=p.toFixed(2)),fetch(f+"/pedidos/"+window._carritoActivo.pedidoId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:p})})}catch(c){alert("Error: "+c.message)}};window.toggleCorridaDetalle=e=>{const t=document.getElementById("corrida-detalle-"+e);if(!t)return;const o=t.style.display!=="none";t.style.display=o?"none":"block";const a=t.nextElementSibling;a&&(a.textContent=o?"✏️ Editar tallas individualmente":"▲ Cerrar edición")};window.eliminarCorridaCarrito=async e=>{const t=e.split(",").filter(Boolean);try{for(const a of t)await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+a,{method:"DELETE"});const o=window._carritoActivo.items.filter(a=>!t.includes(a.id)).reduce((a,n)=>a+n.cantidad*n.precio_unitario,0);await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:o})}),await abrirCarrito(window._carritoActivo.pedidoId)}catch(o){alert("Error: "+o.message)}};window.actualizarPrecioCorridaCarrito=async(e,t)=>{const o=e.split(",").filter(Boolean),a=parseFloat(t)||0;if(a)try{for(const i of o){const r=window._carritoActivo.items.find(s=>s.id===i);r&&(r._precio_manual=!0,r.precio_unitario=a,await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId+"/items/"+i,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cantidad:r.cantidad,precio_unitario:a})}))}const n=window._carritoActivo.items.reduce((i,r)=>i+r.cantidad*r.precio_unitario,0);await fetch(f+"/pedidos/"+window._carritoActivo.pedidoId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:n})}),await abrirCarrito(window._carritoActivo.pedidoId)}catch(n){alert("Error: "+n.message)}};window.confirmarVentaCarrito=async e=>{const t=document.getElementById("c-forma-pago"),o=t?t.value:"efectivo";if(confirm("¿Confirmar la venta? Se descontará el stock del inventario."))try{const n=await(await fetch(f+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:o})})).json();n.ok?(alert("✅ Venta confirmada. Stock descontado."),Ee()):alert("Error: "+JSON.stringify(n))}catch(a){alert("Error: "+a.message)}};window.carritoModo=e=>{document.getElementById("c-panel-par").style.display=e==="par"?"block":"none",document.getElementById("c-panel-corrida").style.display=e==="corrida"?"block":"none",document.getElementById("c-modo-par").style.background=e==="par"?"#E91E8C":"white",document.getElementById("c-modo-par").style.color=e==="par"?"white":"#888",document.getElementById("c-modo-corrida").style.background=e==="corrida"?"#6a1b9a":"white",document.getElementById("c-modo-corrida").style.color=e==="corrida"?"white":"#888"};window.buscarModeloCarrito=e=>{const{variantes:t,productos:o}=window._carritoActivo,a=document.getElementById("c-corrida-resultados"),n=document.getElementById("c-corrida-tallas");if(posicionarDropdownCarrito("c-corrida-resultados","c-buscar-corrida"),!e||e.length<2){a.style.display="none",n.style.display="none";return}const i={};t.forEach(s=>{const d=o.find(p=>p.id===s.producto_id);if(!d)return;const l=((d.nombre||"")+" "+(s.color||"")+" "+(d.sku_interno||"")).toLowerCase();if(!e.toLowerCase().split(" ").every(p=>l.includes(p)))return;const c=d.id+"|"+(s.color||"");i[c]||(i[c]={prod:d,color:s.color||"",variantes:[]}),i[c].variantes.push(s)});const r=Object.values(i).slice(0,6);if(!r.length){a.style.display="none";return}a.style.display="block",a.innerHTML=r.map(s=>`
    <div onclick="seleccionarModeloCorrida('${s.prod.id}','${s.color.replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0"
         onmouseenter="this.style.background='#f9f9f9'" onmouseleave="this.style.background=''">
      ${s.prod.imagen_principal?`<img src="${s.prod.imagen_principal}" style="width:36px;height:36px;object-fit:cover;border-radius:6px">`:'<div style="width:36px;height:36px;background:#eee;border-radius:6px"></div>'}
      <div>
        <p style="font-size:0.85rem;font-weight:600;margin:0">${s.prod.nombre} · ${s.color}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${s.variantes.length} tallas disponibles</p>
      </div>
    </div>
  `).join("")};window.seleccionarModeloCorrida=(e,t)=>{const{variantes:o,productos:a,inventario:n,sucursalId:i}=window._carritoActivo,r=a.find(m=>m.id===e);document.getElementById("c-buscar-corrida").value=`${(r==null?void 0:r.nombre)||""} · ${t}`,document.getElementById("c-corrida-resultados").style.display="none";const s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=o.filter(m=>m.producto_id===e&&m.color===t).sort((m,g)=>s.indexOf(m.talla)-s.indexOf(g.talla)),l=parseFloat(r==null?void 0:r.precio_menudeo)||0,c=parseFloat(r==null?void 0:r.precio_corrida)||(l>0?Math.round(l-100):0);document.getElementById("c-precio-corrida").value=c||"",window._corridaSeleccionada={productoId:e,color:t,variantes:d,prod:r,precioCorrida:c};const p=document.getElementById("c-corrida-tallas-grid");p.innerHTML=d.map(m=>{const g=n.find(v=>v.variante_id===m.id&&(i?v.sucursal_id===i:!0)),u=g?g.cantidad:null,b=u!==null&&u===0;return`
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 10px;border:2px solid ${b?"#fde":"#ddd"};border-radius:8px;background:${b?"#fff5f5":"white"};min-width:64px;opacity:${b?.5:1}">
        <span style="font-weight:700;font-size:0.88rem;color:#333">T${m.talla}</span>
        <div style="display:flex;align-items:center;gap:3px">
          <button type="button" onclick="this.nextElementSibling.value=Math.max(0,parseInt(this.nextElementSibling.value||0)-1);this.nextElementSibling.dispatchEvent(new Event('input'))"
            style="background:#eee;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:0.85rem;line-height:1" ${b?"disabled":""}>−</button>
          <input type="number" value="${b?0:1}" min="0" max="${u!==null?u:999}" data-variante="${m.id}"
            style="width:32px;text-align:center;border:1px solid ${b?"#fdd":"#ddd"};border-radius:4px;padding:2px;font-size:0.85rem;font-weight:700" ${b?"disabled":""}>
          <button type="button" onclick="const inp=this.previousElementSibling;const max=parseInt(inp.max||999);const cur=parseInt(inp.value||0);if(cur<max)inp.value=cur+1;else{inp.style.borderColor='#c62828';setTimeout(()=>inp.style.borderColor='',800)}"
            style="background:#eee;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:0.85rem;line-height:1" ${b?"disabled":""}>+</button>
        </div>
        <span style="font-size:0.62rem;color:${u===null?"#aaa":u>0?"#2e7d32":"#c62828"}">
          ${u===null?"stock ?":"stock: "+u}
        </span>
      </div>
    `}).join(""),document.getElementById("c-corrida-tallas").style.display="block"};window.agregarCorridaAlCarritoActivo=async()=>{var c;const{productoId:e,color:t,variantes:o,prod:a}=window._corridaSeleccionada||{};if(!a){alert("Selecciona un modelo primero");return}const n=parseFloat(document.getElementById("c-precio-corrida").value)||((c=window._corridaSeleccionada)==null?void 0:c.precioCorrida)||0;if(!n){alert("No se encontró precio para este producto. Ingrésalo manualmente.");return}const i=document.querySelectorAll("#c-corrida-tallas-grid input[type=number][data-variante]"),r=Array.from(i).filter(p=>parseInt(p.value)>0);if(r.length===0){alert("Ingresa al menos 1 par en alguna talla");return}const s=window._carritoActivo.pedidoId;let d=0;for(const p of r){const m=p.dataset.variante,g=parseInt(p.value)||1,u=o.find(b=>b.id===m);await fetch(f+"/pedidos/"+s+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:m,cantidad:g,precio_unitario:n,subtotal:g*n,nombre:a.nombre,color:t,talla:(u==null?void 0:u.talla)||"",es_corrida:!0})}),d+=g*n}const l=window._carritoActivo.items.reduce((p,m)=>p+m.cantidad*m.precio_unitario,0);await fetch(f+"/pedidos/"+s,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({total:l+d})}),await abrirCarrito(s)};window.liberarCarrito=async e=>{if(confirm("¿Liberar este carrito? Los productos quedan disponibles para otros clientes."))try{(await(await fetch(f+"/pedidos/"+e+"/cancelar",{method:"POST"})).json()).ok&&(alert("Carrito liberado."),Ee())}catch(t){alert("Error: "+t.message)}};async function ht(){const e=document.getElementById("content");e.innerHTML=`
    <div style="padding:1.5rem;max-width:860px">
      <h2 style="margin:0 0 4px;font-size:1.05rem">✏️ Generar nombres de productos</h2>
      <p style="margin:0 0 1.2rem;font-size:0.82rem;color:#64748b">
        Construye nombres descriptivos automáticamente usando SKU + categoría + palabras clave de la descripción + altura del tacón.
        Primero revisa el preview y luego aplica los cambios.
      </p>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:1rem;align-items:center">
        <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:#475569;cursor:pointer">
          <input type="checkbox" id="gn-solo-cortos"> Solo productos sin nombre descriptivo
        </label>
        <button onclick="gnPreview()" style="padding:8px 18px;background:#3483fa;color:#fff;border:none;border-radius:8px;font-size:0.83rem;font-weight:600;cursor:pointer">
          👁 Ver preview
        </button>
        <button id="gn-btn-aplicar" onclick="gnAplicar()" style="padding:8px 18px;background:#10b981;color:#fff;border:none;border-radius:8px;font-size:0.83rem;font-weight:600;cursor:pointer;display:none">
          ✅ Aplicar todos los cambios
        </button>
        <span id="gn-status" style="font-size:0.8rem;color:#64748b"></span>
      </div>

      <div id="gn-tabla" style="display:none">
        <div style="display:grid;grid-template-columns:200px 1fr 80px;gap:4px;font-size:0.72rem;font-weight:700;color:#94a3b8;padding:4px 8px;text-transform:uppercase">
          <span>Nombre actual</span><span>Nombre nuevo (editable)</span><span></span>
        </div>
        <div id="gn-rows"></div>
      </div>
    </div>`,window.gnPreview=async()=>{var o;const t=((o=document.getElementById("gn-solo-cortos"))==null?void 0:o.checked)||!1;document.getElementById("gn-status").textContent="Cargando...";try{const n=await(await fetch(f+"/productos/generar-nombres",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({modo:"preview",solo_sin_descripcion:t})})).json();if(!n.ok){alert("Error: "+n.error);return}window._gnProductos=n.productos,document.getElementById("gn-tabla").style.display="block",document.getElementById("gn-btn-aplicar").style.display="inline-block",document.getElementById("gn-status").textContent=`${n.total} productos`,document.getElementById("gn-rows").innerHTML=n.productos.map((i,r)=>`
        <div style="display:grid;grid-template-columns:200px 1fr 80px;gap:6px;padding:5px 8px;border-bottom:1px solid #f1f5f9;align-items:center">
          <span style="color:#64748b;font-size:0.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${i.nombre_orig}">${i.nombre_orig}</span>
          <input
            class="gn-input"
            data-idx="${r}"
            value="${i.nombre_nuevo.replace(/"/g,"&quot;")}"
            style="border:1px solid #e2e8f0;border-radius:6px;padding:5px 8px;font-size:0.81rem;width:100%;outline:none;color:#0f172a"
            oninput="window._gnProductos[${r}].nombre_nuevo=this.value"
            onfocus="this.style.borderColor='#E91E8C'"
            onblur="this.style.borderColor='#e2e8f0'">
          <button onclick="window.gnGuardarUno(${r})" style="padding:4px 10px;border:none;background:#10b981;color:#fff;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer;white-space:nowrap">
            Guardar
          </button>
        </div>`).join("")}catch(a){alert("Error: "+a.message)}},window.gnGuardarUno=async t=>{var n,i;const o=(n=window._gnProductos)==null?void 0:n[t];if(!o)return;const a=(i=document.querySelectorAll(".gn-input")[t])==null?void 0:i.nextElementSibling;a&&(a.textContent="...",a.disabled=!0);try{await fetch(`${f}/productos/${o.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:o.nombre_nuevo})}),a&&(a.textContent="✓",a.style.background="#94a3b8",a.disabled=!0)}catch(r){a&&(a.textContent="Guardar",a.disabled=!1),alert("Error: "+r.message)}},window.gnAplicar=async()=>{var a;if(!confirm(`¿Aplicar los ${((a=window._gnProductos)==null?void 0:a.length)||0} nombres del preview? Los que ya guardaste individualmente no se sobreescriben.`))return;document.getElementById("gn-status").textContent="Aplicando...",document.getElementById("gn-btn-aplicar").disabled=!0;let t=0,o=0;for(const n of window._gnProductos||[])try{await fetch(`${f}/productos/${n.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:n.nombre_nuevo})}),t++}catch{o++}document.getElementById("gn-status").textContent=`✅ ${t} actualizados${o?" · ⚠ "+o+" errores":""}`,document.getElementById("gn-btn-aplicar").disabled=!1,document.querySelectorAll(".gn-input + button").forEach(n=>{n.textContent="✓",n.style.background="#94a3b8",n.disabled=!0})}}document.querySelector("#app").style.cssText="display:flex;min-height:100vh;width:100%;flex:1";const Je="erp_empleado";function ke(){document.querySelector("#app").innerHTML=`
    <div style="min-height:100vh;width:100vw;display:flex;font-family:DM Sans,sans-serif">

      <!-- Panel izquierdo: marca -->
      <div style="display:none;flex:0 0 42%;background:#0c0c17;flex-direction:column;justify-content:space-between;padding:48px 52px;position:relative;overflow:hidden"
           id="login-brand-panel">
        <!-- Glow decorativo -->
        <div style="position:absolute;top:-120px;left:-80px;width:420px;height:420px;background:radial-gradient(circle,rgba(233,30,140,0.18) 0%,transparent 70%);pointer-events:none"></div>
        <div style="position:absolute;bottom:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(233,30,140,0.1) 0%,transparent 70%);pointer-events:none"></div>

        <!-- Logo -->
        <div>
          <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:0">
            <span style="width:8px;height:8px;border-radius:50%;background:#E91E8C;display:inline-block;flex-shrink:0"></span>
            <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
          </div>
        </div>

        <!-- Texto central -->
        <div>
          <p style="font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#E91E8C;margin:0 0 16px">ERP · Panel interno</p>
          <h2 style="font-size:3rem;font-weight:800;color:white;line-height:1.08;margin:0 0 20px;letter-spacing:-0.02em">
            Gestiona<br>tu negocio<br>desde aquí.
          </h2>
          <p style="font-size:0.85rem;color:#4a4a6a;line-height:1.6;max-width:280px;margin:0">
            Pedidos, clientes, inventario, WhatsApp y campañas, todo en un solo lugar.
          </p>
        </div>

        <!-- Footer -->
        <div>
          <p style="font-size:0.7rem;color:#2a2a3f;margin:0">León, Guanajuato · México</p>
        </div>
      </div>

      <!-- Panel derecho: formulario -->
      <div style="flex:1;background:#0f0f1c;display:flex;align-items:center;justify-content:center;padding:24px;position:relative">
        <!-- Glow sutil -->
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);width:500px;height:400px;background:radial-gradient(ellipse,rgba(233,30,140,0.07) 0%,transparent 65%);pointer-events:none"></div>

        <div style="width:100%;max-width:360px;position:relative">
          <!-- Logo en móvil (oculto en desktop cuando el panel izq está visible) -->
          <div style="text-align:center;margin-bottom:40px">
            <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:10px">
              <span style="width:7px;height:7px;border-radius:50%;background:#E91E8C;flex-shrink:0"></span>
              <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
            </div>
            <h1 style="font-size:1.6rem;font-weight:800;color:white;margin:0;letter-spacing:-0.01em">Bienvenida</h1>
            <p style="color:#3a3a5c;font-size:0.82rem;margin:6px 0 0">Ingresa tus credenciales para continuar</p>
          </div>

          <div style="margin-bottom:18px">
            <label style="display:block;font-size:0.68rem;font-weight:700;color:#4a4a6a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Correo electrónico</label>
            <input type="email" id="login-email" placeholder="tu@correo.com"
              style="width:100%;padding:12px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'"
              onkeydown="if(event.key==='Enter')hacerLogin()">
          </div>

          <div style="margin-bottom:28px">
            <label style="display:block;font-size:0.68rem;font-weight:700;color:#4a4a6a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Contraseña</label>
            <input type="password" id="login-password" placeholder="••••••••"
              style="width:100%;padding:12px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'"
              onkeydown="if(event.key==='Enter')hacerLogin()">
          </div>

          <button onclick="hacerLogin()" id="btn-login"
            style="width:100%;padding:13px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:DM Sans,sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;letter-spacing:0.01em;transition:background 0.15s"
            onmouseover="this.style.background='#d01a7e'" onmouseout="this.style.background='#E91E8C'">
            Iniciar sesión
          </button>

          <p id="login-error" style="color:#f87171;font-size:0.8rem;text-align:center;margin-top:14px;display:none;background:rgba(248,113,113,0.08);padding:8px 12px;border-radius:8px;border:1px solid rgba(248,113,113,0.2)"></p>
        </div>
      </div>
    </div>

    <style>
      @media(min-width:720px){
        #login-brand-panel{display:flex!important}
      }
    </style>
  `,window.hacerLogin=async()=>{const t=document.getElementById("login-email").value,o=document.getElementById("login-password").value,a=document.getElementById("btn-login");if(document.getElementById("login-error"),!t||!o){e("Por favor completa todos los campos");return}a.textContent="Verificando...",a.disabled=!0;try{const n=await fetch("/api/empleados/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})}),i=await n.json();n.ok?(sessionStorage.setItem(Je,JSON.stringify(i)),i.token&&sessionStorage.setItem("erp_token",i.token),window._empleadoActual=i,Ie()):(e(i.error||"Email o contrasena incorrectos"),a.textContent="Iniciar sesion",a.disabled=!1)}catch{e("Error conectando con el servidor"),a.textContent="Iniciar sesion",a.disabled=!1}};function e(t){const o=document.getElementById("login-error");o&&(o.textContent=t,o.style.display="block")}}window.authHeaders=()=>{const e=sessionStorage.getItem("erp_token");return e?{"Content-Type":"application/json",Authorization:`Bearer ${e}`}:{"Content-Type":"application/json"}};const Ce=sessionStorage.getItem(Je);if(Ce)try{window._empleadoActual=JSON.parse(Ce),Ie()}catch{ke()}else ke();
