(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const f="/api",ue=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],Se=[{nombre:"Negro",hex:"#000000"},{nombre:"Blanco",hex:"#FFFFFF"},{nombre:"Hueso",hex:"#F5F0E8"},{nombre:"Nude claro",hex:"#F5DCC8"},{nombre:"Nude",hex:"#E8C4A0"},{nombre:"Nude oscuro",hex:"#C49A7A"},{nombre:"Nude rosa",hex:"#F2C4B0"},{nombre:"Palo de rosa",hex:"#D4A096"},{nombre:"Beige",hex:"#E8D5B0"},{nombre:"Camel",hex:"#C19A6B"},{nombre:"Miel",hex:"#B8860B"},{nombre:"Cafe claro",hex:"#A0785A"},{nombre:"Cafe medio",hex:"#7B4F2E"},{nombre:"Cafe oscuro",hex:"#4A2C1A"},{nombre:"Chocolate",hex:"#3B1F0E"},{nombre:"Cognac",hex:"#8B4513"},{nombre:"Taupe",hex:"#8B7D6B"},{nombre:"Gris claro",hex:"#C0C0C0"},{nombre:"Gris",hex:"#808080"},{nombre:"Gris oscuro",hex:"#404040"},{nombre:"Rojo",hex:"#CC0000"},{nombre:"Vino",hex:"#722F37"},{nombre:"Bordo",hex:"#800020"},{nombre:"Rosa claro",hex:"#FFB6C1"},{nombre:"Rosa",hex:"#FF69B4"},{nombre:"Fusha",hex:"#E91E8C"},{nombre:"Coral",hex:"#FF6B6B"},{nombre:"Salmon",hex:"#FA8072"},{nombre:"Naranja",hex:"#FF6600"},{nombre:"Amarillo",hex:"#FFD700"},{nombre:"Dorado",hex:"#C8A951"},{nombre:"Plateado",hex:"#A8A8A8"},{nombre:"Azul claro",hex:"#6CA0DC"},{nombre:"Azul",hex:"#0000CC"},{nombre:"Azul marino",hex:"#001F5B"},{nombre:"Turquesa",hex:"#40E0D0"},{nombre:"Verde",hex:"#006400"},{nombre:"Verde menta",hex:"#98FF98"},{nombre:"Morado",hex:"#800080"},{nombre:"Lila",hex:"#C8A2C8"},{nombre:"Multicolor",hex:"#FF69B4"}],Ie=[{value:"tacones",label:"Tacones",prefix:"TAC"},{value:"sandalias",label:"Sandalias",prefix:"SAN"},{value:"botas",label:"Botas",prefix:"BOT"},{value:"botines",label:"Botines",prefix:"BTN"},{value:"flats",label:"Flats",prefix:"FLT"},{value:"plataformas",label:"Plataformas",prefix:"PLT"},{value:"tenis",label:"Tenis",prefix:"TEN"},{value:"nina",label:"Calzado de nina",prefix:"NIN"},{value:"accesorios",label:"Accesorios",prefix:"ACC"}],Z=[{id:"dashboard",icon:"📊",label:"Dashboard",section:"Principal",soloAdmin:!0},{id:"pos",icon:"🛒",label:"Punto de venta",section:"Principal"},{id:"productos",icon:"👠",label:"Productos",section:"Catalogo"},{id:"inventario",icon:"📦",label:"Inventario",section:"Catalogo"},{id:"pedidos",icon:"🛍️",label:"Pedidos",section:"Ventas"},{id:"clientes",icon:"👥",label:"Clientes",section:"Ventas"},{id:"historial",icon:"📋",label:"Historial",section:"Ventas"},{id:"analisis",icon:"📈",label:"Analisis",section:"Ventas"},{id:"crm",icon:"🎯",label:"CRM",section:"Ventas"},{id:"finanzas",icon:"💰",label:"Finanzas",section:"Finanzas",soloAdmin:!0},{id:"proveedores",icon:"🏭",label:"Proveedores",section:"Finanzas",soloAdmin:!0},{id:"sucursales",icon:"🏪",label:"Sucursales",section:"Configuracion",soloAdmin:!0},{id:"empleados",icon:"👤",label:"Empleados",section:"Configuracion",soloAdmin:!0},{id:"seo",icon:"🔍",label:"SEO y Sitio",section:"Configuracion",soloAdmin:!0},{id:"ordenes",icon:"🛒",label:"Órdenes de compra",section:"Finanzas",soloAdmin:!0},{id:"conversaciones",icon:"💬",label:"Conversaciones",section:"Ventas"},{id:"envios",icon:"📣",label:"Envíos masivos",section:"Ventas"},{id:"catalogos",icon:"📖",label:"Catálogos",section:"Catalogo",soloAdmin:!0},{id:"mercadolibre",icon:"🛒",label:"MercadoLibre",section:"Integraciones",soloAdmin:!0}];var me;let W=((me=window._empleadoActual)==null?void 0:me.rol)==="admin"?"dashboard":"pos",se=1;function ge(){var a,o;const e=(()=>{try{return localStorage.getItem("zm_panel_modulo")}catch{return null}})(),t=((a=window._empleadoActual)==null?void 0:a.rol)==="admin"?"dashboard":"pos";W=e||t,document.querySelector("#app").innerHTML=`
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2>Zapatillas <span>May</span></h2>
        <p>Panel de administracion</p>
      </div>
      <nav class="sidebar-nav">
        ${Te()}
      </nav>
    </div>
    <div class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="hamburger" onclick="toggleSidebar()">☰</button>
          <h1 id="topbar-title">${((o=Z.find(n=>n.id===W))==null?void 0:o.label)||"Dashboard"}</h1>
        </div>
        <div class="topbar-actions">
          <span style="font-size:0.8rem;color:#888">${window._empleadoActual?window._empleadoActual.nombre:"Leon, Gto."}</span>
          <button onclick="cerrarSesionPanel()" style="background:none;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#8892a4;cursor:pointer;font-family:DM Sans,sans-serif">Salir</button>
        </div>
      </div>
      <div class="content" id="content">
        ${je()}
      </div>
    </div>
  `,window.toggleSidebar=()=>{const n=document.getElementById("sidebar"),r=document.getElementById("sidebar-overlay"),i=n.classList.toggle("open");r.classList.toggle("active",i),document.body.style.overflow=i?"hidden":""},window._conversacionesInterval&&clearInterval(window._conversacionesInterval),window._conversacionesInterval=setInterval(async()=>{try{const r=await(await fetch(f+"/chatbot/chats")).json();window._chatsData||(window._chatsData={});const i=window._totalNoLeidos||0,s=r.reduce((d,l)=>d+(l.no_leidos||0),0);if(window._totalNoLeidos=s,r.forEach(d=>{window._chatsData&&(window._chatsData[d.telefono]=d)}),fetch(f+"/health").catch(()=>{}),s>i){document.title=`(${s}) Zapatillas May`;const d=document.querySelector('[data-modulo="conversaciones"]');if(d){let l=d.querySelector(".nav-badge");l||(l=document.createElement("span"),l.className="nav-badge",l.style.cssText="background:#e91e8c;color:white;border-radius:100px;padding:1px 6px;font-size:0.65rem;font-weight:700;margin-left:auto",d.appendChild(l)),l.textContent=s}try{const l=new(window.AudioContext||window.webkitAudioContext),p=l.createOscillator(),c=l.createGain();p.connect(c),c.connect(l.destination),p.frequency.value=523,c.gain.setValueAtTime(.5,l.currentTime),c.gain.exponentialRampToValueAtTime(.001,l.currentTime+.2),p.start(l.currentTime),p.stop(l.currentTime+.2);const m=l.createOscillator(),u=l.createGain();m.connect(u),u.connect(l.destination),m.frequency.value=783,u.gain.setValueAtTime(.5,l.currentTime+.2),u.gain.exponentialRampToValueAtTime(.001,l.currentTime+.5),m.start(l.currentTime+.2),m.stop(l.currentTime+.5)}catch{}}if(window._chatActivo&&window._chatsData[window._chatActivo]){const d=window._chatsData[window._chatActivo],l=document.getElementById("mensajes-area");if(l){const p=l.scrollHeight-l.scrollTop<=l.clientHeight+50;l.innerHTML=[...d.mensajes].reverse().map(c=>{const m=c.tipo==="manual"||c.tipo==="imagen_saliente";return`
              <div style="display:flex;flex-direction:column;gap:4px">
                ${c.mensaje?'<div style="display:flex;flex-direction:column;align-items:'+(m?"flex-end":"flex-start")+'"><div style="max-width:70%;background:'+(m?"#cfe9ff":"#f5f5f5")+";border-radius:"+(m?"12px 12px 0 12px":"12px 12px 12px 0")+';padding:8px 12px;box-shadow:0 1px 2px rgba(0,0,0,0.08)">'+window.renderMensaje(c)+'<p style="font-size:0.62rem;color:#aaa;text-align:right;margin-top:2px">'+new Date(c.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})+"</p></div></div>":""} 
                ${c.respuesta?`<div style="display:flex;flex-direction:column;align-items:flex-end"><div style="max-width:70%;background:#dcf8c6;border-radius:12px 12px 0 12px;padding:8px 12px;box-shadow:0 1px 2px rgba(0,0,0,0.08)"><p style="font-size:0.62rem;color:#2e7d32;margin-bottom:2px">🤖 Bot</p><p style="font-size:0.85rem;color:#333;white-space:pre-wrap">${c.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi,"")}</p>${c.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)?c.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi).map(u=>`<img src="${u}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${u}')">`).join(""):""}<p style="font-size:0.62rem;color:#aaa;text-align:right;margin-top:2px">${new Date(c.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</p></div></div>`:""}
              </div>`}).join(""),p&&(l.scrollTop=l.scrollHeight)}}}catch{}},5e3),window.navegarA=n=>{var l;const r=((l=window._empleadoActual)==null?void 0:l.rol)==="admin",i=Z.find(p=>p.id===n);if(i!=null&&i.soloAdmin&&!r){alert("No tienes permisos para acceder a este módulo");return}W=n;try{localStorage.setItem("zm_panel_modulo",n)}catch{}const s=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay");s.classList.contains("open")&&(s.classList.remove("open"),d.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(p=>p.classList.remove("active")),document.querySelector('[data-modulo="'+n+'"]').classList.add("active"),document.getElementById("topbar-title").textContent=Z.find(p=>p.id===n).label,fe(n)}}function Te(){var a;const e=((a=window._empleadoActual)==null?void 0:a.rol)==="admin";return[...new Set(Z.filter(o=>e||!o.soloAdmin).map(o=>o.section))].map(o=>`
    <div class="nav-section">${o}</div>
    ${Z.filter(n=>n.section===o&&(e||!n.soloAdmin)).map(n=>`
      <div class="nav-item ${n.id===W?"active":""}"
           data-modulo="${n.id}"
           onclick="navegarA('${n.id}')">
        <span class="nav-icon">${n.icon}</span>
        ${n.label}
      </div>
    `).join("")}
  `).join("")}async function fe(e){const t=document.getElementById("content");switch(t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>',e){case"catalogos":await de();break;case"dashboard":t.innerHTML=Pe(),setTimeout(()=>Fe(),100);break;case"productos":await ne();break;case"clientes":await Ae();break;case"pedidos":await xe();break;case"sucursales":await Me();break;case"inventario":await Le();break;case"pos":await we();break;case"historial":await $e();break;case"empleados":await Ee();break;case"seo":await He();break;case"analisis":await Be();break;case"crm":await ye();break;case"finanzas":await Q();break;case"proveedores":await be();break;case"ordenes":await Y();break;case"conversaciones":await cargarConversaciones();break;case"envios":await cargarEnviosMasivos();break;case"mercadolibre":await Re();break}}function je(){return setTimeout(()=>{document.querySelectorAll(".nav-item").forEach(o=>o.classList.remove("active"));const e=document.querySelector('[data-modulo="'+W+'"]');e&&e.classList.add("active");const t=document.getElementById("topbar-title"),a=Z.find(o=>o.id===W);t&&a&&(t.textContent=a.label),fe(W)},100),'<div style="padding:2rem;color:#888;text-align:center">Cargando...</div>'}async function Y(){var t;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando sugerencias...</p>';try{const o=await(await fetch(f+"/sucursales/")).json(),n=(t=o[0])==null?void 0:t.id,[r,i]=await Promise.all([fetch(f+"/finanzas/sugerencias-recompra/"+n),fetch(f+"/finanzas/proveedores")]),s=await r.json(),d=await i.json(),l=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),p=new Date().toISOString().split("T")[0],c=s.filter(b=>{const h=l[b.producto_id];return h?h.hasta===null||h.hasta===void 0?!1:h.hasta<=p:!0}),m=s.length-c.length;window._ordenesData={sugerencias:c,proveedores:d,sucursalId:n},window._ordenSeleccion={};const u=c.filter(b=>b.urgente),g=c.filter(b=>!b.urgente),y=c.reduce((b,h)=>b+h.cantidad_sugerida*h.costo_unitario,0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🛒 Órdenes de compra</h2>
          <p style="color:#888;font-size:0.85rem">Sugerencias de recompra basadas en rotación e inventario</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="ord-sucursal" style="max-width:200px" onchange="recargarOrdenes(this.value)">
            ${o.map(b=>`<option value="${b.id}">${b.nombre}</option>`).join("")}
          </select>
          <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${u.length}</p>
          <p style="font-size:0.68rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🚨 Urgentes</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${g.length}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⚠️ Por resurtir</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#333">${c.reduce((b,h)=>b+h.cantidad_sugerida,0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Pares sugeridos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${y.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Costo estimado</p>
        </div>
        ${m>0?`
        <div style="background:#f3e5f5;border-radius:12px;padding:1.25rem;border:1px solid #ce93d8;text-align:center;cursor:pointer" onclick="verPospuestos()">
          <p style="font-size:1.6rem;font-weight:700;color:#6a1b9a">${m}</p>
          <p style="font-size:0.68rem;color:#6a1b9a;text-transform:uppercase;letter-spacing:0.5px">⏸️ Pospuestos</p>
        </div>`:""}
      </div>

      ${c.length===0?`<div style="background:white;border-radius:12px;padding:3rem;text-align:center;border:1px solid #eee">
            <p style="font-size:2rem;margin-bottom:1rem">✅</p>
            <p style="font-weight:700;font-size:1rem;margin-bottom:4px">Todo el inventario está bien</p>
            <p style="color:#888;font-size:0.85rem">No hay productos que necesiten resurtido</p>
          </div>`:`
          <!-- SELECCIONAR TODOS -->
          <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:center;gap:12px">
                <input type="checkbox" id="sel-todos" onchange="seleccionarTodos(this.checked)" style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C">
                <p style="font-weight:700;font-size:0.9rem">Productos a resurtir (${c.length})</p>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary" style="font-size:0.78rem" onclick="filtrarOrdenes('todos')">Todos</button>
                <button class="btn btn-secondary" style="font-size:0.78rem;background:#ffebee;border-color:#c62828;color:#c62828" onclick="filtrarOrdenes('urgente')">🚨 Urgentes</button>
              </div>
            </div>

            ${c.map(b=>`
              <div class="orden-item" data-urgente="${b.urgente}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                <input type="checkbox" class="orden-check" data-id="${b.producto_id}" onchange="actualizarSeleccion('${b.producto_id}', this.checked)"
                       style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C;flex-shrink:0">
                ${b.imagen?`<img src="${b.imagen}" style="width:52px;height:52px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
                <div style="flex:1;min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                    <p style="font-weight:700;font-size:0.9rem">${b.nombre}</p>
                    ${b.urgente?'<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">🚨 URGENTE</span>':'<span style="background:#fff8e1;color:#f57f17;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">⚠️ BAJO</span>'}
                  </div>
                  <p style="font-size:0.75rem;color:#888">${b.sku||""} · Stock: ${b.stock_total} pares · Mín: ${b.stock_minimo}</p>
                  <p style="font-size:0.72rem;color:#888">${b.velocidad_semanal} pares/sem · ${b.dias_inventario?b.dias_inventario+" días de stock":"Sin ventas recientes"}</p>
                  ${b.proveedor?`<p style="font-size:0.72rem;color:#6a1b9a;margin-top:2px">🏭 ${b.proveedor.nombre}</p>`:'<p style="font-size:0.72rem;color:#aaa;margin-top:2px">Sin proveedor asignado</p>'}
                  ${b.variantes&&b.variantes.length>0?`
                  <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
                    ${b.variantes.map(h=>{const v=[h.talla,h.color].filter(Boolean).join(" / "),w=h.sin_stock;return`<span style="
                        padding:2px 7px;border-radius:100px;font-size:0.68rem;font-weight:600;
                        ${w?"background:#ffebee;color:#c62828;border:1px solid #ef9a9a":"background:#f5f5f5;color:#666;border:1px solid #e0e0e0"}
                      " title="${w?"Sin stock":"Stock: "+h.stock}">${v}${w?" ✗":""}</span>`}).join("")}
                  </div>`:""}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Sugerido</p>
                    <input type="number" min="1" value="${b.cantidad_sugerida}"
                           id="qty-orden-${b.producto_id}"
                           style="width:60px;text-align:center;border:1px solid #ddd;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700"
                           oninput="actualizarCostoOrden()">
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Costo/par</p>
                    <p style="font-weight:700;color:#333;font-size:0.9rem">$${b.costo_unitario.toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Subtotal</p>
                    <p id="sub-${b.producto_id}" style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${(b.cantidad_sugerida*b.costo_unitario).toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">⏸️</p>
                    <button onclick="posponerProducto('${b.producto_id}', '${b.nombre.replace(/'/g,"")}')"
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
    `}catch(a){e.innerHTML='<p style="padding:2rem;color:red">Error: '+a.message+"</p>"}}window.seleccionarTodos=e=>{document.querySelectorAll(".orden-check").forEach(t=>{t.checked=e;const a=t.dataset.id;window._ordenSeleccion[a]=e}),actualizarCostoOrden()};window.actualizarSeleccion=(e,t)=>{window._ordenSeleccion[e]=t,actualizarCostoOrden()};window.actualizarCostoOrden=()=>{const{sugerencias:e}=window._ordenesData;let t=0,a=0;e.forEach(r=>{var i;if(window._ordenSeleccion[r.producto_id]){const d=parseInt(((i=document.getElementById("qty-orden-"+r.producto_id))==null?void 0:i.value)||r.cantidad_sugerida)*r.costo_unitario;t+=d,a++;const l=document.getElementById("sub-"+r.producto_id);l&&(l.textContent="$"+d.toFixed(0))}});const o=document.getElementById("ord-total"),n=document.getElementById("ord-seleccionados");o&&(o.textContent="$"+t.toFixed(0)),n&&(n.textContent=a+" productos seleccionados")};window.filtrarOrdenes=e=>{document.querySelectorAll(".orden-item").forEach(t=>{t.style.display=e==="todos"||e==="urgente"&&t.dataset.urgente==="true"?"":"none"})};window.recargarOrdenes=async e=>{const t=await fetch(f+"/finanzas/sugerencias-recompra/"+e);window._ordenesData.sugerencias=await t.json(),window._ordenesData.sucursalId=e,Y()};window.generarOrden=()=>{const{sugerencias:e,proveedores:t,sucursalId:a}=window._ordenesData,o=e.filter(r=>window._ordenSeleccion[r.producto_id]);if(o.length===0){alert("Selecciona al menos un producto para generar la orden");return}window._ordenModal={seleccionados:o,sucursalId:a};const n=document.createElement("div");n.id="modal-orden",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto",n.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:780px;width:100%;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <h3 style="font-size:1.1rem;font-weight:700">📋 Orden de compra</h3>
        <button onclick="document.getElementById('modal-orden').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal destino</label>
          <select class="form-input" id="orden-sucursal">
            <option value="${a}">Sucursal actual</option>
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

      ${o.map(r=>{const i=(r.variantes||[]).filter(l=>l.sin_stock),s=(r.variantes||[]).filter(l=>!l.sin_stock),d=[...i,...s];return`
        <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span style="font-weight:700;font-size:0.95rem">${r.nombre}</span>
              <span style="color:#888;font-size:0.75rem;margin-left:8px">${r.sku||""}</span>
              ${r.proveedor?`<span style="color:#6a1b9a;font-size:0.75rem;margin-left:8px">· 🏭 ${r.proveedor.nombre}</span>`:""}
            </div>
            <span style="font-size:0.8rem;color:#888;font-weight:600">$${r.costo_unitario.toFixed(0)}/par</span>
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
          </table>`:`<p style="font-size:0.8rem;color:#aaa;margin-top:4px">Sin variantes registradas — pedir ${r.cantidad_sugerida} pares en total</p>`}
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
  `,document.body.appendChild(n),n.addEventListener("click",r=>{r.target===n&&n.remove()}),setTimeout(ordenRecalcTotal,50)};window.guardarOrdenCompra=async e=>{var n,r,i;const t=(n=document.getElementById("orden-fecha"))==null?void 0:n.value,a=((r=document.getElementById("orden-notas"))==null?void 0:r.value)||"",o=window._ordenesData.sucursalId;try{const s=typeof e=="string"?JSON.parse(e):e;for(const[d,l]of s){const p=l.productos.reduce((g,y)=>g+y.cantidad_final*y.costo_unitario,0),u=(i=(await(await fetch(f+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:d==="sin-proveedor"?null:d,sucursal_id:o,status:"borrador",total:p,notas:a,fecha_entrega_estimada:t||null})})).json())[0])==null?void 0:i.id;if(u)for(const g of l.productos)await fetch(f+"/finanzas/ordenes/"+u+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:null,cantidad:g.cantidad_final,costo_unitario:g.costo_unitario,subtotal:g.cantidad_final*g.costo_unitario})})}document.querySelector('div[style*="position:fixed"]').remove(),alert("Orden de compra guardada exitosamente"),Y()}catch(s){alert("Error guardando orden: "+s.message)}};window.ordenToggleVar=(e,t)=>{const a=document.getElementById("qty-var-"+e);a&&(a.disabled=!t,a.style.opacity=t?"1":"0.35",a.style.borderColor=t?"#E91E8C":"#ddd",t&&(!a.value||a.value==="0")?a.value=1:t||(a.value=0),ordenRecalcTotal())};window.ordenRecalcTotal=()=>{const{seleccionados:e}=window._ordenModal||{};if(!e)return;let t=0;e.forEach(o=>{var n;if((o.variantes||[]).forEach(r=>{var d;const i=document.getElementById("chk-var-"+r.id),s=parseInt(((d=document.getElementById("qty-var-"+r.id))==null?void 0:d.value)||0);i!=null&&i.checked&&s>0&&(t+=s*o.costo_unitario)}),!o.variantes||o.variantes.length===0){const r=parseInt(((n=document.getElementById("qty-orden-"+o.producto_id))==null?void 0:n.value)||o.cantidad_sugerida);t+=r*o.costo_unitario}});const a=document.getElementById("orden-total-general");a&&(a.textContent="$"+t.toFixed(0))};window.imprimirOrden=()=>{var s,d;const{seleccionados:e}=window._ordenModal||{};if(!e)return;const t=((s=document.getElementById("orden-fecha"))==null?void 0:s.value)||"",a=((d=document.getElementById("orden-notas"))==null?void 0:d.value)||"",o=new Date().toLocaleDateString("es-MX");let n="",r=0;e.forEach(l=>{var c;const p=l.variantes||[];if(p.length===0){const m=parseInt(((c=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:c.value)||l.cantidad_sugerida),u=m*l.costo_unitario;r+=u,n+=`<tr><td>${l.nombre}</td><td>${l.sku||""}</td><td>—</td><td>—</td><td style="text-align:center">${m}</td><td style="text-align:right">$${u.toFixed(0)}</td></tr>`}else p.forEach(m=>{var b;const u=document.getElementById("chk-var-"+m.id);if(!(u!=null&&u.checked))return;const g=parseInt(((b=document.getElementById("qty-var-"+m.id))==null?void 0:b.value)||0);if(g<=0)return;const y=g*l.costo_unitario;r+=y,n+=`<tr style="${m.sin_stock?"background:#fff5f5":""}">
          <td style="font-weight:${m.sin_stock?"bold":"normal"}">${l.nombre}</td>
          <td style="color:#777">${l.sku||""}</td>
          <td>${m.talla||"—"}</td>
          <td>${m.color||"—"}</td>
          <td style="text-align:center;font-weight:bold">${g}</td>
          <td style="text-align:right">$${y.toFixed(0)}</td>
        </tr>`})});const i=window.open("","_blank");i.document.write(`<!DOCTYPE html>
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
    Fecha de emisión: ${o}
    ${t?" &nbsp;|&nbsp; Entrega estimada: "+t:""}
    ${a?" &nbsp;|&nbsp; Notas: "+a:""}
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
        <td style="text-align:right">$${r.toFixed(0)}</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => window.print()<\/script>
</body></html>`),i.document.close()};window.posponerProducto=(e,t)=>{const a=document.getElementById("modal-posponer");a&&a.remove();const o=document.createElement("div");o.id="modal-posponer",o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:1100;display:flex;align-items:center;justify-content:center",o.innerHTML=`
    <div style="background:white;border-radius:14px;padding:1.5rem;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
      <p style="font-weight:700;font-size:1rem;margin-bottom:4px">⏸️ Posponer producto</p>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${t}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 7)" style="text-align:left">📅 7 días — revisaré la próxima semana</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 30)" style="text-align:left">📅 30 días — esperar el mes que entra</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', null)" style="text-align:left;color:#c62828;border-color:#ef9a9a">🚫 No pedir por ahora (indefinido)</button>
      </div>
      <button onclick="document.getElementById('modal-posponer').remove()" style="margin-top:1rem;width:100%;background:none;border:none;color:#aaa;cursor:pointer;font-size:0.82rem">Cancelar</button>
    </div>`,o.addEventListener("click",n=>{n.target===o&&o.remove()}),document.body.appendChild(o)};window.aplicarPosponer=(e,t)=>{var n;const a=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}");let o=null;if(t!==null){const r=new Date;r.setDate(r.getDate()+t),o=r.toISOString().split("T")[0]}a[e]={hasta:o},localStorage.setItem("ordenes_pospuestos",JSON.stringify(a)),(n=document.getElementById("modal-posponer"))==null||n.remove(),Y()};window.verPospuestos=()=>{const e=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),{sugerencias:t}=window._ordenesData;new Date().toISOString().split("T")[0];const a=Object.entries(e).map(([n,r])=>{const i=r.nombre||n,s=r.hasta?"hasta "+r.hasta:"indefinido";return`• ${i} — ${s}`}).join(`
`);if(!a){alert("No hay productos pospuestos.");return}confirm(`Productos pospuestos:

`+a+`

¿Quieres reactivar todos?`)&&(localStorage.removeItem("ordenes_pospuestos"),Y())};window.guardarOrdenCompra2=async()=>{var r,i,s,d;const{seleccionados:e,sucursalId:t}=window._ordenModal||{};if(!e)return;const a=(r=document.getElementById("orden-fecha"))==null?void 0:r.value,o=((i=document.getElementById("orden-notas"))==null?void 0:i.value)||"",n={};e.forEach(l=>{var u,g;const p=l.proveedor_id||"sin-proveedor",c=((u=l.proveedor)==null?void 0:u.nombre)||"Sin proveedor";n[p]||(n[p]={nombre:c,items:[]});const m=l.variantes||[];if(m.length===0){const y=parseInt(((g=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:g.value)||l.cantidad_sugerida);n[p].items.push({variante_id:null,cantidad:y,costo_unitario:l.costo_unitario})}else m.forEach(y=>{var v;const b=document.getElementById("chk-var-"+y.id);if(!(b!=null&&b.checked))return;const h=parseInt(((v=document.getElementById("qty-var-"+y.id))==null?void 0:v.value)||0);h<=0||n[p].items.push({variante_id:y.id,cantidad:h,costo_unitario:l.costo_unitario})})});try{for(const[l,p]of Object.entries(n)){if(p.items.length===0)continue;const c=p.items.reduce((y,b)=>y+b.cantidad*b.costo_unitario,0),g=(s=(await(await fetch(f+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:l==="sin-proveedor"?null:l,sucursal_id:t,status:"borrador",total:c,notas:o,fecha_entrega_estimada:a||null})})).json())[0])==null?void 0:s.id;if(g)for(const y of p.items)await fetch(f+"/finanzas/ordenes/"+g+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...y,subtotal:y.cantidad*y.costo_unitario})})}(d=document.getElementById("modal-orden"))==null||d.remove(),alert("Orden de compra guardada"),Y()}catch(l){alert("Error guardando orden: "+l.message)}};function Pe(){return`
    <div id="dashboard-contenido">
      <div class="stats-grid" style="margin-bottom:1.5rem">
        ${["Ventas hoy","Pedidos hoy","Ventas 7 dias","Clientes nuevos","Stock bajo","Mejor dia","Top vendedor","Total clientes"].map(e=>`
          <div class="stat-card">
            <div class="stat-label">${e}</div>
            <div class="stat-value" style="font-size:1.2rem;color:var(--text-muted)">...</div>
            <div class="stat-sub"></div>
          </div>
        `).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="chart-container"><p class="chart-title">Ventas por dia de la semana</p><canvas id="chart-dias" height="200"></canvas></div>
        <div class="chart-container"><p class="chart-title">Canal de ventas</p><canvas id="chart-canales" height="200"></canvas></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="chart-container"><p class="chart-title">Ventas por mes</p><canvas id="chart-meses" height="200"></canvas></div>
        <div class="chart-container"><p class="chart-title">Metodos de pago</p><canvas id="chart-pagos" height="200"></canvas></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="table-card" style="padding:1.5rem">
          <p style="font-weight:700;margin-bottom:1rem;font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px">Top clientes (30 dias)</p>
          <div id="dash-top-clientes"><div style="color:var(--text-muted);font-size:0.85rem">Cargando...</div></div>
        </div>
        <div class="table-card" style="padding:1.5rem">
          <p style="font-weight:700;margin-bottom:1rem;font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px">Ultimos pedidos</p>
          <div id="dash-ultimos-pedidos"><div style="color:var(--text-muted);font-size:0.85rem">Cargando...</div></div>
        </div>
      </div>
    </div>
  `}async function Q(){var t,a,o,n,r,i;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando finanzas...</p>';try{const d=await(await fetch(f+"/sucursales/")).json(),l=(t=d[0])==null?void 0:t.id,[p,c,m,u,g,y,b]=await Promise.all([fetch(f+"/finanzas/caja/hoy/"+l),fetch(f+"/finanzas/reporte/"+l),fetch(f+"/finanzas/gastos/"+l),fetch(f+"/finanzas/estado-resultados/"+l),fetch(f+"/finanzas/flujo/"+l),fetch(f+"/finanzas/cuentas-por-cobrar"),fetch(f+"/finanzas/gastos-categorias/"+l)]),h=await p.json(),v=await c.json(),w=await m.json(),C=await u.json(),x=await g.json(),z=await y.json(),_=await b.json(),$=h.find(k=>k.status==="abierta"),T=new Date().toISOString().split("T")[0],M=w.filter(k=>{var j;return(j=k.created_at)==null?void 0:j.startsWith(T)}),S=M.reduce((k,j)=>k+parseFloat(j.monto||0),0),I=z.reduce((k,j)=>k+parseFloat(j.total||0),0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">💰 Finanzas</h2>
          <p style="color:#888;font-size:0.85rem">Control de caja, gastos y reportes financieros</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="fin-sucursal" style="max-width:200px" onchange="recargarFinanzas(this.value)">
            ${d.map(k=>`<option value="${k.id}">${k.nombre}</option>`).join("")}
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
              <p style="font-size:1.2rem;font-weight:700;color:#2e7d32">$${(((a=x.hoy)==null?void 0:a.efectivo)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Efectivo</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#1565c0">$${(((o=x.hoy)==null?void 0:o.tarjeta)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Tarjeta</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#6a1b9a">$${(((n=x.hoy)==null?void 0:n.spei)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">SPEI</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#E91E8C">$${(((r=x.hoy)==null?void 0:r.total)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Total hoy</p>
            </div>
          </div>
        `:""}
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#E91E8C">$${(v.total_ventas||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#c62828">$${(v.total_gastos||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Gastos 30 días</p>
        </div>
        <div style="background:${(v.utilidad||0)>=0?"#e8f5e9":"#ffebee"};border-radius:12px;padding:1.25rem;border:1px solid ${(v.utilidad||0)>=0?"#a5d6a7":"#ffcdd2"};text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:${(v.utilidad||0)>=0?"#2e7d32":"#c62828"}">$${(v.utilidad||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Utilidad 30 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(((i=x.semana)==null?void 0:i.ingresos)||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ingresos 7 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(v.ticket_promedio||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarCxC()">
          <p style="font-size:1.5rem;font-weight:700;color:#f57f17">$${I.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">Cuentas x cobrar</p>
        </div>
      </div>

      <!-- TABS -->
      <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('gastos')">💸 Gastos</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('estado')">📊 Estado de resultados</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('flujo')">💧 Flujo de efectivo</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('caja')">📋 Historial caja</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('cxc')">📑 Cuentas x cobrar</button>
      </div>

      <div id="fin-tab-contenido"></div>
    `,window._finanzasData={sucursalId:l,gastosHoy:M,totalGastosHoy:S,estadoResultados:C,flujo:x,cxc:z,categorias:_,historial:[]},window._finanzasSucursalId=l;const E=await(await fetch(f+"/finanzas/caja/historial/"+l)).json();window._finanzasData.historial=E,mostrarTabFinanzas("gastos")}catch(s){e.innerHTML='<p style="padding:2rem;color:red">Error cargando finanzas: '+s.message+"</p>"}}window.mostrarTabFinanzas=e=>{var p,c,m,u,g,y,b,h,v,w,C,x,z;const{gastosHoy:t,totalGastosHoy:a,estadoResultados:o,flujo:n,cxc:r,categorias:i,historial:s,sucursalId:d}=window._finanzasData,l=document.getElementById("fin-tab-contenido");if(l)if(e==="gastos"){const _=i.reduce(($,T)=>$+T.total,0);l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">💸 Gastos del día</p>
            <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.78rem" onclick="agregarGasto('${d}')">+ Agregar</button>
          </div>
          ${t.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin gastos hoy</div>':t.map($=>`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${$.concepto}</p>
                  <p style="font-size:0.72rem;color:#888">${$.categoria} · ${new Date($.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <p style="font-weight:700;color:#c62828">-$${parseFloat($.monto).toFixed(2)}</p>
                <button onclick="eliminarGasto('${$.id}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem">✕</button>
              </div>
            `).join("")}
          <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;justify-content:space-between">
            <span style="font-size:0.85rem;font-weight:600">Total gastos hoy</span>
            <span style="font-weight:700;color:#c62828">-$${a.toFixed(2)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
            <p style="font-weight:700;font-size:0.9rem">📊 Gastos por categoría (30 días)</p>
          </div>
          <div style="padding:1rem">
            ${i.length===0?'<p style="color:#888;text-align:center;padding:1rem">Sin gastos registrados</p>':i.map($=>`
                <div style="margin-bottom:12px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize">${$.categoria}</span>
                    <span style="font-size:0.82rem;color:#c62828;font-weight:700">$${$.total.toFixed(0)}</span>
                  </div>
                  <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden">
                    <div style="background:#E91E8C;height:100%;width:${_>0?($.total/_*100).toFixed(0):0}%;border-radius:100px;transition:width 0.5s"></div>
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
              ${o.map(_=>`
                <tr>
                  <td><strong>${_.mes}</strong></td>
                  <td style="color:#E91E8C;font-weight:600">$${_.ventas.toFixed(0)}</td>
                  <td style="color:#c62828">$${_.gastos.toFixed(0)}</td>
                  <td style="color:${_.utilidad>=0?"#2e7d32":"#c62828"};font-weight:700">$${_.utilidad.toFixed(0)}</td>
                  <td>${_.num_pedidos}</td>
                  <td>
                    <span style="padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600;background:${_.ventas>0&&_.utilidad/_.ventas>=.2?"#e8f5e9":_.utilidad>=0?"#fff8e1":"#ffebee"};color:${_.ventas>0&&_.utilidad/_.ventas>=.2?"#2e7d32":_.utilidad>=0?"#f57f17":"#c62828"}">
                      ${_.ventas>0?(_.utilidad/_.ventas*100).toFixed(1):0}%
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
            <p style="font-weight:700;color:#E91E8C">$${o.reduce((_,$)=>_+$.ventas,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Total gastos 6 meses</p>
            <p style="font-weight:700;color:#c62828">$${o.reduce((_,$)=>_+$.gastos,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Utilidad total</p>
            <p style="font-weight:700;color:#2e7d32">$${o.reduce((_,$)=>_+$.utilidad,0).toFixed(0)}</p>
          </div>
        </div>
      </div>
    `:e==="flujo"?l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">🌅 Hoy</p>
          ${[{label:"Efectivo",val:((p=n.hoy)==null?void 0:p.efectivo)||0,color:"#2e7d32"},{label:"Tarjeta",val:((c=n.hoy)==null?void 0:c.tarjeta)||0,color:"#1565c0"},{label:"SPEI",val:((m=n.hoy)==null?void 0:m.spei)||0,color:"#6a1b9a"},{label:"Crédito",val:((u=n.hoy)==null?void 0:u.credito)||0,color:"#f57f17"}].map(_=>`
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
              <span style="font-size:0.82rem;color:#888">${_.label}</span>
              <span style="font-weight:700;color:${_.color}">$${_.val.toFixed(0)}</span>
            </div>
          `).join("")}
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Total</span>
            <span style="font-weight:700;color:#E91E8C;font-size:1.1rem">$${(((g=n.hoy)==null?void 0:g.total)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📅 Últimos 7 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((y=n.semana)==null?void 0:y.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((b=n.semana)==null?void 0:b.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((h=n.semana)==null?void 0:h.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((v=n.semana)==null?void 0:v.neto)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📆 Últimos 30 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((w=n.mes)==null?void 0:w.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((C=n.mes)==null?void 0:C.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((x=n.mes)==null?void 0:x.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((z=n.mes)==null?void 0:z.neto)||0).toFixed(0)}</span>
          </div>
        </div>
      </div>
    `:e==="caja"?l.innerHTML=`
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📋 Historial de cajas</p>
        </div>
        ${s.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin historial</div>':s.map(_=>`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${new Date(_.fecha).toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"})}</p>
                <p style="font-size:0.72rem;color:#888">Apertura: $${parseFloat(_.monto_apertura||0).toFixed(0)} · Cierre: $${parseFloat(_.monto_cierre||0).toFixed(0)}</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:#E91E8C">$${parseFloat(_.total_ventas||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Ventas</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:${parseFloat(_.diferencia||0)>=0?"#2e7d32":"#c62828"}">${parseFloat(_.diferencia||0)>=0?"+":""}$${parseFloat(_.diferencia||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Diferencia</p>
              </div>
              <span style="padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${_.status==="cerrada"?"#e8f5e9":"#fff8e1"};color:${_.status==="cerrada"?"#2e7d32":"#f57f17"}">${_.status}</span>
            </div>
          `).join("")}
      </div>
    `:e==="cxc"&&mostrarCxC()};window.mostrarCxC=()=>{const{cxc:e}=window._finanzasData,t=document.getElementById("fin-tab-contenido");if(!t)return;const a=new Date;t.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">📑 Cuentas por cobrar</p>
        <span style="font-size:0.78rem;color:#888">${e.length} pendientes · $${e.reduce((o,n)=>o+parseFloat(n.total||0),0).toFixed(0)} total</span>
      </div>
      ${e.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin cuentas por cobrar</div>':e.map(o=>{var r,i;const n=Math.floor((a-new Date(o.created_at))/864e5);return`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${((r=o.clientes)==null?void 0:r.nombre)||"Sin cliente"}</p>
                <p style="font-size:0.72rem;color:#888">${new Date(o.created_at).toLocaleDateString("es-MX")} · Pedido #${o.id.substring(0,8).toUpperCase()}</p>
              </div>
              <div style="text-align:right">
                <p style="font-weight:700;color:#f57f17;font-size:1rem">$${parseFloat(o.total||0).toFixed(0)}</p>
                <span style="font-size:0.68rem;padding:2px 8px;border-radius:100px;background:${n>30?"#ffebee":"#fff8e1"};color:${n>30?"#c62828":"#f57f17"}">
                  ${n} días
                </span>
              </div>
              ${(i=o.clientes)!=null&&i.telefono?`
                <a href="https://wa.me/52${o.clientes.telefono.replace(/\D/g,"")}" target="_blank"
                   style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;text-decoration:none">
                  💬 Cobrar
                </a>
              `:""}
            </div>
          `}).join("")}
    </div>
  `};window.abrirCaja=async e=>{var a;const t=prompt("¿Cuánto efectivo hay en caja para empezar? (fondo de caja)");if(t!==null)try{const n=await(await fetch(f+"/finanzas/caja/abrir",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,monto_apertura:parseFloat(t)||0,empleado:((a=window._empleadoActual)==null?void 0:a.nombre)||"Admin"})})).json();if(n.error){alert("Error: "+n.error);return}Q()}catch{alert("Error abriendo caja")}};window.cerrarCaja=async e=>{var o,n;const t=prompt("¿Cuánto efectivo hay físicamente en caja al cerrar?");if(t===null)return;const a=prompt("Notas del cierre (opcional):")||"";try{const i=await(await fetch(f+"/finanzas/caja/"+e+"/cerrar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_cierre:parseFloat(t)||0,notas:a})})).json();i.ok?(alert(`Caja cerrada.
Total ventas: $${(o=i.total_ventas)==null?void 0:o.toFixed(2)}
Diferencia: $${(n=i.diferencia)==null?void 0:n.toFixed(2)}`),Q()):alert("Error: "+JSON.stringify(i))}catch{alert("Error cerrando caja")}};window.agregarGasto=e=>{const t=document.createElement("div");t.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",t.innerHTML=`
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
  `,document.body.appendChild(t),t.addEventListener("click",a=>{a.target===t&&t.remove()})};window.guardarGasto=async(e,t)=>{var r;const a=document.getElementById("gasto-concepto").value,o=document.getElementById("gasto-monto").value,n=document.getElementById("gasto-categoria").value;if(!a||!o){alert("Completa concepto y monto");return}try{await fetch(f+"/finanzas/gastos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,concepto:a,monto:parseFloat(o),categoria:n,empleado:((r=window._empleadoActual)==null?void 0:r.nombre)||"Admin"})}),t.closest('div[style*="position:fixed"]').remove(),Q()}catch{alert("Error guardando gasto")}};window.eliminarGasto=async e=>{if(confirm("¿Eliminar este gasto?"))try{await fetch(f+"/finanzas/gastos/"+e,{method:"DELETE"}),Q()}catch{alert("Error eliminando gasto")}};async function be(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/finanzas/proveedores")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Proveedores (${a.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormProveedor()">+ Nuevo proveedor</button>
        </div>
        ${a.length===0?'<div style="padding:3rem;text-align:center;color:#888">No hay proveedores registrados</div>':`<table>
            <thead>
              <tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Ciudad</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${a.map(o=>`
                <tr>
                  <td><strong>${o.nombre}</strong></td>
                  <td>${o.contacto||"—"}</td>
                  <td>${o.telefono||"—"}</td>
                  <td>${o.ciudad||"—"}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProveedor('${o.id}')">Editar</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>`}
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando proveedores</p>'}}window.mostrarFormProveedor=e=>{const t=e||{},a=document.createElement("div");a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",a.innerHTML=`
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
  `,document.body.appendChild(a),a.addEventListener("click",o=>{o.target===a&&a.remove()})};window.guardarProveedor=async e=>{const t={nombre:document.getElementById("prov-nombre").value,contacto:document.getElementById("prov-contacto").value,telefono:document.getElementById("prov-telefono").value,email:document.getElementById("prov-email").value,ciudad:document.getElementById("prov-ciudad").value,direccion:document.getElementById("prov-direccion").value,notas:document.getElementById("prov-notas").value};if(!t.nombre){alert("El nombre es requerido");return}try{e?await fetch(f+"/finanzas/proveedores/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}):await fetch(f+"/finanzas/proveedores",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),document.querySelector('div[style*="position:fixed"]').remove(),be()}catch{alert("Error guardando proveedor")}};window.editarProveedor=async e=>{const o=(await(await fetch(f+"/finanzas/proveedores")).json()).find(n=>n.id===e);o&&mostrarFormProveedor(o)};async function Be(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando análisis...</p>';try{const[t,a,o,n]=await Promise.all([fetch(f+"/productos/"),fetch(f+"/variantes/"),fetch(f+"/movimientos/"),fetch(f+"/inventario/")]),r=await t.json(),i=await a.json(),s=await o.json(),d=await n.json(),l=new Date,p=new Date(l-30*24*60*60*1e3),c=new Date(l-60*24*60*60*1e3),m=new Date(l-90*24*60*60*1e3),u={};s.filter(b=>b.tipo==="venta").forEach(b=>{const h=i.find(x=>x.id===b.variante_id);if(!h)return;const v=h.producto_id;u[v]||(u[v]={d30:0,d60:0,d90:0});const w=new Date(b.created_at),C=Math.abs(b.cantidad);w>=p&&(u[v].d30+=C),w>=c&&(u[v].d60+=C),w>=m&&(u[v].d90+=C)});const g=r.map(b=>{const h=u[b.id]||{d30:0,d60:0,d90:0},v=d.filter(_=>i.find($=>$.id===_.variante_id&&$.producto_id===b.id)).reduce((_,$)=>_+$.cantidad,0),w=h.d30/4,C=w>0?Math.round(v/w*7):null;let x="gris",z="Sin ventas recientes";return h.d30>=6?(x="verde",z="Rota bien — considerar resurtido"):h.d30>=2?(x="amarillo",z="Rotacion moderada"):h.d90===0&&v>0?(x="rojo",z="Sin movimiento en 90 dias — revisar"):h.d30>0&&(x="amarillo",z="Rotacion lenta"),{...b,ventas:h,stockTotal:v,ventasSemana:w,diasInventario:C,semaforo:x,recomendacion:z}}).sort((b,h)=>h.ventas.d30-b.ventas.d30),y={verde:{bg:"#e8f5e9",color:"#2e7d32",texto:"🟢 Rota bien"},amarillo:{bg:"#fff8e1",color:"#f57f17",texto:"🟡 Rotacion lenta"},rojo:{bg:"#ffebee",color:"#c62828",texto:"🔴 Sin movimiento"},gris:{bg:"#f5f5f5",color:"#888",texto:"⚪ Sin datos"}};e.innerHTML=`
      <div style="margin-bottom:1.5rem">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">📊 Analisis de rotacion</h2>
        <p style="color:#888;font-size:0.85rem">Velocidad de venta y recomendaciones de resurtido por modelo</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:2rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Vendidos 30 días</p>
          <p style="font-size:1.8rem;font-weight:700;color:#E91E8C">${g.reduce((b,h)=>b+h.ventas.d30,0)}</p>
          <p style="font-size:0.75rem;color:#aaa">pares</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Vendidos 90 días</p>
          <p style="font-size:1.8rem;font-weight:700;color:#E91E8C">${g.reduce((b,h)=>b+h.ventas.d90,0)}</p>
          <p style="font-size:0.75rem;color:#aaa">pares</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Rotan bien</p>
          <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${g.filter(b=>b.semaforo==="verde").length}</p>
          <p style="font-size:0.75rem;color:#aaa">modelos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Sin movimiento</p>
          <p style="font-size:1.8rem;font-weight:700;color:#c62828">${g.filter(b=>b.semaforo==="rojo").length}</p>
          <p style="font-size:0.75rem;color:#aaa">modelos</p>
        </div>
      </div>

      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <h3 style="font-size:0.95rem;font-weight:700">Rotacion por modelo</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
  <button class="btn btn-primary" style="padding:4px 10px;font-size:0.75rem" onclick="filtrarRotacion('todos')">Todos</button>
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;background:#e8f5e9;border-color:#2e7d32;color:#2e7d32" onclick="filtrarRotacion('verde')">🟢 Rotan bien</button>
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem;background:#ffebee;border-color:#c62828;color:#c62828" onclick="filtrarRotacion('rojo')">🔴 Sin movimiento</button>
</div>
        </div>
        <div id="rotacion-lista">
          ${g.map(b=>{const h=y[b.semaforo];return`
              <div class="rotacion-item" data-semaforo="${b.semaforo}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                ${b.imagen_principal?`<img src="${b.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:8px;background:#f5f5f5;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>'}
                <div style="flex:1;min-width:140px">
                  <p style="font-weight:600;font-size:0.9rem;margin-bottom:2px">${b.nombre}</p>
                  <p style="font-size:0.75rem;color:#888">${b.sku_interno||""} · Stock: ${b.stockTotal} pares</p>
                  <span style="display:inline-block;margin-top:4px;padding:2px 8px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${h.bg};color:${h.color}">${h.texto}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;min-width:200px">
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${b.ventas.d30}</p>
                    <p style="font-size:0.65rem;color:#aaa">30 días</p>
                  </div>
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${b.ventas.d60}</p>
                    <p style="font-size:0.65rem;color:#aaa">60 días</p>
                  </div>
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${b.ventas.d90}</p>
                    <p style="font-size:0.65rem;color:#aaa">90 días</p>
                  </div>
                </div>
                <div style="text-align:right;min-width:120px">
                  <p style="font-size:0.82rem;font-weight:600;color:#333">${b.ventasSemana.toFixed(1)} pares/sem</p>
                  <p style="font-size:0.75rem;color:${b.diasInventario?b.diasInventario<14?"#c62828":b.diasInventario<30?"#f57f17":"#2e7d32":"#aaa"}">${b.diasInventario?`~${b.diasInventario} días stock`:"Sin ventas"}</p>
                  <p style="font-size:0.72rem;color:#888;margin-top:2px">${b.recomendacion}</p>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,window._rotacionData=g}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando análisis</p>'}}window.filtrarRotacion=e=>{document.querySelectorAll(".rotacion-item").forEach(t=>{t.style.display=e==="todos"||t.dataset.semaforo===e?"":"none"})};async function ye(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando CRM...</p>';try{const[t,a,o]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/"),fetch(f+"/crm/seguimientos/pendientes/todos")]),n=await t.json(),r=await a.json(),i=await o.json(),s=new Date,d=new Date(s-30*24*60*60*1e3),l=new Date(s-60*24*60*60*1e3),p=new Date(s-90*24*60*60*1e3),c=n.map(v=>{const w=r.filter(T=>T.cliente_id===v.id&&(T.status==="confirmado"||T.status==="pagado")),C=w.reduce((T,M)=>T+parseFloat(M.total||0),0),x=w.length>0?new Date(w[0].created_at):null,z=x?Math.floor((s-x)/(1e3*60*60*24)):null,_=w.filter(T=>new Date(T.created_at)>=d).length;let $="nuevo";return w.length===0?$="nuevo":C>=5e3&&_>=1?$="vip":z>90?$="inactivo":z>30?$="riesgo":_>=2?$="frecuente":$="activo",{...v,totalGastado:C,ultimoPedido:x,diasSinComprar:z,pedidos30:_,segmento:$,totalPedidos:w.length}}),m=c.filter(v=>v.segmento==="vip"),u=c.filter(v=>v.segmento==="riesgo").sort((v,w)=>w.totalGastado-v.totalGastado),g=c.filter(v=>v.segmento==="inactivo").sort((v,w)=>w.totalGastado-v.totalGastado),y=[...c].sort((v,w)=>w.totalGastado-v.totalGastado).slice(0,10),b=r.filter(v=>new Date(v.created_at).toDateString()===s.toDateString()&&(v.status==="confirmado"||v.status==="pagado")).reduce((v,w)=>v+parseFloat(w.total||0),0),h=r.filter(v=>new Date(v.created_at)>=d&&(v.status==="confirmado"||v.status==="pagado")).reduce((v,w)=>v+parseFloat(w.total||0),0);e.innerHTML=`
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
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${b.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas hoy</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${h.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('vip')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${m.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⭐ Clientes VIP</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('riesgo')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${u.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="mostrarSegmento('inactivo')">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${g.length}</p>
          <p style="font-size:0.7rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
        <div style="background:#e3f2fd;border-radius:12px;padding:1.25rem;border:1px solid #90caf9;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#1565c0">${i.length}</p>
          <p style="font-size:0.7rem;color:#1565c0;text-transform:uppercase;letter-spacing:0.5px">📅 Recordatorios</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">

        <!-- ALERTAS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">🟡 Clientes en riesgo</p>
            <span style="font-size:0.75rem;color:#888">${u.length} clientes</span>
          </div>
          ${u.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin clientes en riesgo</div>':u.slice(0,5).map(v=>`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
                   onclick="verCliente('${v.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                <div style="width:36px;height:36px;border-radius:50%;background:#fff8e1;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#f57f17;flex-shrink:0">
                  ${v.nombre.charAt(0).toUpperCase()}
                </div>
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${v.nombre}</p>
                  <p style="font-size:0.72rem;color:#888">Hace ${v.diasSinComprar} días sin comprar · $${v.totalGastado.toFixed(0)} total</p>
                </div>
                ${v.telefono?`<a href="https://wa.me/${v.lada||"52"}${v.telefono.replace(/\D/g,"")}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WA</a>`:""}
              </div>
            `).join("")}
        </div>

        <!-- RECORDATORIOS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">📅 Recordatorios pendientes</p>
            <span style="font-size:0.75rem;color:#888">${i.length} pendientes</span>
          </div>
          ${i.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin recordatorios pendientes 🎉</div>':i.slice(0,5).map(v=>{var w;return`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${((w=v.clientes)==null?void 0:w.nombre)||"Cliente"}</p>
                  <p style="font-size:0.72rem;color:#888">${v.contenido.substring(0,50)}</p>
                  <p style="font-size:0.68rem;color:#f57f17">${new Date(v.fecha_recordatorio).toLocaleDateString("es-MX")}</p>
                </div>
                <button onclick="completarRecordatorio('${v.id}')" style="background:#e8f5e9;border:1px solid #a5d6a7;color:#2e7d32;border-radius:6px;padding:4px 10px;font-size:0.72rem;cursor:pointer">✓ Listo</button>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- TOP CLIENTES -->
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:1rem">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">⭐ Top 10 clientes por volumen</p>
        </div>
        ${y.map((v,w)=>`
          <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
               onclick="verCliente('${v.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
            <span style="font-size:0.85rem;font-weight:700;color:${w<3?"#f57f17":"#aaa"};min-width:20px">${w+1}</span>
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
              ${v.nombre.charAt(0).toUpperCase()}
            </div>
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600">${v.nombre}</p>
              <p style="font-size:0.72rem;color:#888">${v.totalPedidos} pedidos · ${v.diasSinComprar!==null?"Hace "+v.diasSinComprar+" días":"Sin pedidos"}</p>
            </div>
            <div style="text-align:right">
              <p style="font-weight:700;color:#E91E8C">$${v.totalGastado.toFixed(0)}</p>
              <span style="font-size:0.65rem;padding:2px 6px;border-radius:100px;background:${v.segmento==="vip"?"#fff8e1":v.segmento==="inactivo"?"#ffebee":"#e8f5e9"};color:${v.segmento==="vip"?"#f57f17":v.segmento==="inactivo"?"#c62828":"#2e7d32"}">${v.segmento}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- SEGMENTO DETALLE (oculto por default) -->
      <div id="crm-segmento-detalle" style="display:none"></div>
    `,window._crmData={clientes:c,pedidos:r,recordatorios:i}}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error cargando CRM: '+t.message+"</p>"}}window.mostrarSegmento=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const a=t.filter(r=>r.segmento===e).sort((r,i)=>i.totalGastado-r.totalGastado),o={vip:"⭐ Clientes VIP",riesgo:"🟡 En riesgo",inactivo:"🔴 Inactivos",frecuente:"🟢 Frecuentes"},n=document.getElementById("crm-segmento-detalle");n.style.display="block",n.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">${o[e]||e} (${a.length})</p>
        <button onclick="document.getElementById('crm-segmento-detalle').style.display='none'" style="background:none;border:none;cursor:pointer;color:#888;font-size:1.2rem">✕</button>
      </div>
      ${a.map(r=>`
        <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
             onclick="verCliente('${r.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
            ${r.nombre.charAt(0).toUpperCase()}
          </div>
          <div style="flex:1">
            <p style="font-size:0.85rem;font-weight:600">${r.nombre}</p>
            <p style="font-size:0.72rem;color:#888">$${r.totalGastado.toFixed(0)} · ${r.totalPedidos} pedidos · ${r.diasSinComprar!==null?"Hace "+r.diasSinComprar+" días":"Sin pedidos"}</p>
          </div>
          ${r.telefono?`<a href="https://wa.me/${r.lada||"52"}${r.telefono.replace(/\D/g,"")}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WhatsApp</a>`:""}
        </div>
      `).join("")}
    </div>
  `,n.scrollIntoView({behavior:"smooth"})};window.completarRecordatorio=async e=>{try{await fetch(f+"/crm/seguimientos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completado:!0})}),ye()}catch{alert("Error al completar recordatorio")}};window.mostrarPipeline=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando pipeline...</p>';try{const a=await(await fetch(f+"/crm/oportunidades")).json(),o=[{id:"contacto",label:"📞 Contacto",color:"#e3f2fd",colorText:"#1565c0"},{id:"interes",label:"👀 Interés",color:"#f3e5f5",colorText:"#6a1b9a"},{id:"cotizacion",label:"📋 Cotización",color:"#fff8e1",colorText:"#f57f17"},{id:"negociacion",label:"🤝 Negociación",color:"#fce4f3",colorText:"#E91E8C"},{id:"ganado",label:"✅ Ganado",color:"#e8f5e9",colorText:"#2e7d32"},{id:"perdido",label:"❌ Perdido",color:"#ffebee",colorText:"#c62828"}];e.innerHTML=`
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCRM()">← Volver al CRM</button>
        <h2 style="flex:1;font-size:1.1rem;font-weight:700">📊 Pipeline de oportunidades</h2>
        <button class="btn btn-primary" onclick="nuevaOportunidad()">+ Nueva oportunidad</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${o.map(n=>{const r=a.filter(s=>s.etapa===n.id),i=r.reduce((s,d)=>s+parseFloat(d.monto_estimado||0),0);return`
            <div style="background:${n.color};border-radius:12px;padding:1rem;border:1px solid ${n.colorText}30">
              <p style="font-weight:700;font-size:0.85rem;color:${n.colorText};margin-bottom:4px">${n.label}</p>
              <p style="font-size:0.72rem;color:${n.colorText};margin-bottom:12px">${r.length} ops · $${i.toFixed(0)}</p>
              ${r.map(s=>{var d;return`
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
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()})};window.buscarClienteOportunidad=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const a=document.getElementById("op-cliente-resultados");if(!e||e.length<2){a.style.display="none";return}const o=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!o.length){a.style.display="none";return}a.style.display="block",a.innerHTML=o.map(n=>`
    <div onclick="seleccionarClienteOportunidad('${n.id}', '${n.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      ${n.nombre}
    </div>
  `).join("")};window.seleccionarClienteOportunidad=(e,t)=>{document.getElementById("op-cliente-id").value=e,document.getElementById("op-cliente-buscar").value=t,document.getElementById("op-cliente-resultados").style.display="none"};window.guardarOportunidad=async()=>{const e=document.getElementById("op-titulo").value,t=document.getElementById("op-cliente-id").value,a=document.getElementById("op-monto").value,o=document.getElementById("op-etapa").value,n=document.getElementById("op-fecha").value,r=document.getElementById("op-notas").value;if(!e){alert("El título es requerido");return}try{await fetch(f+"/crm/oportunidades",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,cliente_id:t||null,monto_estimado:parseFloat(a)||0,etapa:o,fecha_cierre_estimada:n||null,notas:r})}),document.getElementById("modal-oportunidad").remove(),mostrarPipeline()}catch{alert("Error guardando oportunidad")}};async function ne(e,t=!1){const a=document.getElementById("content");try{const n=await(await fetch(f+"/productos/")).json(),r=n.filter(p=>p.activo),i=n.filter(p=>!p.activo),s=t?i:r;console.log("mostrarInactivos:",t,"base:",s.length,"inactivos:",i.length);const d=[...new Set(r.map(p=>p.categoria).filter(Boolean))],l=e?s.filter(p=>p.categoria===e):s;a.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn ${!t&&!e?"btn-primary":"btn-secondary"}" onclick="window.cargarProductos(null, false)">
          ✅ Activos (${r.length})
        </button>
        ${d.map(p=>`
          <button class="btn ${!t&&e===p?"btn-primary":"btn-secondary"}" onclick="window.cargarProductos('${p}', false)">
            ${p.charAt(0).toUpperCase()+p.slice(1)} (${r.filter(c=>c.categoria===p).length})
          </button>
        `).join("")}
        <button class="btn ${t?"btn-primary":"btn-secondary"}" style="${t?"":"color:#c62828;border-color:#c62828"}" onclick="window.cargarProductos(null, true)">
          ❌ Desactivados (${i.length})
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
            ${l.length===0?'<tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No hay productos</td></tr>':l.map(p=>`
                <tr>
                  <td style="display:flex;align-items:center;gap:10px">
                    ${p.imagen_principal?`<img src="${p.imagen_principal}" style="width:44px;height:44px;object-fit:contain;background:#f5f5f5;border-radius:6px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:44px;height:44px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:1.2rem">?</div>'}
                    <strong>${p.nombre}</strong>
                  </td>
                  <td><small style="color:#888">${p.sku_interno||"—"}</small></td>
                  <td>${p.categoria||"—"}</td>
                  <td>$${p.precio_menudeo}</td>
                  <td><span class="badge ${p.activo?"badge-success":"badge-danger"}">${p.activo?"Activo":"Inactivo"}</span></td>
                  <td style="display:flex;gap:4px;flex-wrap:wrap">
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProducto('${p.id}')">Editar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="duplicarProducto('${p.id}')">Duplicar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:${p.activo?"#c62828":"#2e7d32"};border-color:${p.activo?"#c62828":"#2e7d32"}" onclick="toggleProducto('${p.id}', ${p.activo})">${p.activo?"Desactivar":"Activar"}</button>
                  </td>
                </tr>
              `).join("")}
          </tbody>
        </table>
      </div>
    `}catch{a.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.cargarProductos=ne;window.mostrarCampanas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando campañas...</p>';try{const[t,a]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/")]),o=await t.json(),n=await a.json(),r=new Date,i=new Date(r-30*24*60*60*1e3),s=new Date(r-90*24*60*60*1e3),d=o.map(c=>{const m=n.filter(v=>v.cliente_id===c.id&&(v.status==="confirmado"||v.status==="pagado")),u=m.reduce((v,w)=>v+parseFloat(w.total||0),0),g=m.length>0?new Date(m[0].created_at):null,y=g?Math.floor((r-g)/(1e3*60*60*24)):null,b=m.filter(v=>new Date(v.created_at)>=i).length;let h="nuevo";return m.length===0?h="nuevo":u>=5e3&&b>=1?h="vip":y>90?h="inactivo":y>30?h="riesgo":b>=2?h="frecuente":h="activo",{...c,totalGastado:u,diasSinComprar:y,segmento:h}}).filter(c=>c.telefono);window._campanaClientes=d;const l=[{id:"catalogo",nombre:"👠 Catálogo completo",descripcion:"Envía el catálogo completo de productos",mensaje:c=>`Hola ${c}! 👋

Te compartimos nuestro catálogo completo de calzado para dama.

✨ Encuentra tacones, sandalias, botas, botines y más.

🛍️ Ver catálogo completo:
https://zapatillasmay.mx/#catalogo

Cualquier pregunta con gusto te atendemos 😊`},{id:"nuevos",nombre:"🆕 Nuevos modelos",descripcion:"Envía los últimos modelos agregados",mensaje:c=>`¡Hola ${c}! 👋

¡Llegaron nuevos modelos a Zapatillas May! 👠✨

¿Te interesa? Con gusto te damos más información y tallas disponibles.

¡Escríbenos para hacer tu pedido! 🛍️`},{id:"mayoreo",nombre:"📦 Precios mayoreo",descripcion:"Envía información de precios mayoreo",mensaje:c=>`Hola ${c}! 👋

Te recordamos nuestros precios de mayoreo:

📦 3-5 pares variados: -$80 por par
📦 6+ pares variados: -$150 por par
📦 Corrida completa: -$180 por par

🛍️ Ver catálogo:
https://zapatillasmay.mx/#catalogo

¿Te interesa hacer un pedido? Con gusto te atendemos 😊`},{id:"tacones",nombre:"👡 Catálogo tacones",descripcion:"Envía solo la categoría de tacones",mensaje:c=>`Hola ${c}! 👋

Mira nuestra colección de tacones para dama.

👡 Ver tacones:
https://zapatillasmay.mx/#categoria/tacones

¿Te gusta alguno? Con gusto te damos más información 😊`},{id:"sandalias",nombre:"🩴 Catálogo sandalias",descripcion:"Envía solo la categoría de sandalias",mensaje:c=>`Hola ${c}! 👋

Mira nuestra colección de sandalias para dama.

🩴 Ver sandalias:
https://zapatillasmay.mx/#categoria/sandalias

¿Te gusta alguna? Con gusto te damos más información 😊`},{id:"seguimiento",nombre:"💬 Seguimiento cliente",descripcion:"Mensaje de seguimiento para clientes inactivos",mensaje:c=>`Hola ${c}! 👋

¿Cómo estás? Hace tiempo que no sabemos de ti.

Tenemos modelos nuevos que te pueden interesar 👠

🛍️ Ver novedades:
https://zapatillasmay.mx/#nuevos

¿Te puedo mostrar algo en especial? 😊`},{id:"personalizado",nombre:"✏️ Mensaje personalizado",descripcion:"Escribe tu propio mensaje",mensaje:c=>`Hola ${c}! 👋

`}],p=[{id:"todos",label:"Todos los clientes",count:d.length},{id:"vip",label:"⭐ VIP",count:d.filter(c=>c.segmento==="vip").length},{id:"frecuente",label:"🟢 Frecuentes",count:d.filter(c=>c.segmento==="frecuente").length},{id:"riesgo",label:"🟡 En riesgo",count:d.filter(c=>c.segmento==="riesgo").length},{id:"inactivo",label:"🔴 Inactivos",count:d.filter(c=>c.segmento==="inactivo").length},{id:"mayoreo",label:"📦 Mayoreo",count:d.filter(c=>c.tipo==="mayoreo").length},{id:"zapateria",label:"🏪 Corridas",count:d.filter(c=>c.tipo==="zapateria").length},{id:"menudeo",label:"🛍️ Menudeo",count:d.filter(c=>c.tipo==="menudeo").length}];e.innerHTML=`
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
              ${p.map(c=>`
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:8px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('seg-${c.id}').checked)this.style.borderColor='#eee'">
                  <input type="radio" name="campana-segmento" id="seg-${c.id}" value="${c.id}" ${c.id==="todos"?"checked":""} 
                         onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                  <span style="flex:1;font-size:0.85rem;font-weight:500">${c.label}</span>
                  <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${c.count}</span>
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
              ${l.map(c=>`
                <label style="cursor:pointer;padding:10px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('plt-${c.id}').checked)this.style.borderColor='#eee'">
                  <div style="display:flex;align-items:center;gap:8px">
                    <input type="radio" name="campana-plantilla" id="plt-${c.id}" value="${c.id}" ${c.id==="catalogo"?"checked":""}
                           onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                    <div>
                      <p style="font-size:0.85rem;font-weight:600">${c.nombre}</p>
                      <p style="font-size:0.72rem;color:#888">${c.descripcion}</p>
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
    `,window._plantillasCampana=l,window._campanaImagenUrl="",actualizarVistaCampana(),cargarProductosCampana(),verificarEstadoWA()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando campañas</p>'}};window._waEstadoInterval=null;window.verificarEstadoWA=async()=>{try{const t=await(await fetch(f+"/campanas/wa-estado")).json(),a=document.getElementById("wa-estado-badge"),o=document.getElementById("wa-estado-texto"),n=document.getElementById("wa-btn-conectar"),r=document.getElementById("wa-btn-desconectar");if(!a)return t.conectado;if(t.conectado)a.style.background="#e8f5e9",a.style.color="#2e7d32",a.textContent="✅ Conectado",o.textContent="WhatsApp Business conectado y listo para enviar",n.style.display="none",r.style.display="inline-flex",document.getElementById("wa-qr-panel").style.display="none",window._waEstadoInterval&&(clearInterval(window._waEstadoInterval),window._waEstadoInterval=null);else{a.style.background="#ffebee",a.style.color="#c62828";const i=t.detalle&&t.detalle.includes("caída");if(a.textContent=i?"⚠️ Sesión caída":"🔴 Desconectado",o.textContent=t.detalle||"Conecta tu WhatsApp Business para enviar campañas automáticas",n.style.display="inline-flex",r.style.display="none",i){a.style.background="#fff3e0",a.style.color="#e65100";const s=document.getElementById("wa-qr-panel");s&&s.style.display==="none"&&(s.style.display="block",document.getElementById("wa-qr-img").innerHTML=`
            <div style="padding:1.5rem;text-align:center">
              <p style="font-size:0.9rem;font-weight:700;color:#e65100;margin-bottom:0.5rem">⚠️ WhatsApp desconectado</p>
              <p style="font-size:0.8rem;color:#666;margin-bottom:1rem">La sesión se cerró. Necesitas reconectar.</p>
              <p style="font-size:0.8rem;color:#555;margin-bottom:1rem">1️⃣ Abre <strong>INICIAR ERP.bat</strong> en tu escritorio<br>2️⃣ Espera que Railway actualice (~2 min)<br>3️⃣ Haz clic en <strong>"Conectar con QR"</strong></p>
            </div>`)}}return t.conectado}catch{const t=document.getElementById("wa-estado-badge");return t&&(t.style.background="#fff8e1",t.style.color="#f57f17",t.textContent="⚠️ Sin conexión al servidor"),!1}};window.forzarReconexionWA=async()=>{const e=document.getElementById("wa-qr-panel"),t=document.getElementById("wa-qr-img");if(!(!e||!t)){e.style.display="block",t.innerHTML='<p style="color:#888;font-size:0.85rem;padding:2rem">⏳ Desconectando sesión anterior y generando QR...<br><small>Esto puede tardar hasta 20 segundos</small></p>';try{const o=await(await fetch(f+"/campanas/wa-reiniciar",{method:"POST"})).json();if(o.qr){const n=o.qr.startsWith("data:")?o.qr:"data:image/png;base64,"+o.qr;t.innerHTML=`
        <p style="color:#2e7d32;font-size:0.82rem;margin-bottom:8px">✅ Escanea este QR con WhatsApp en tu celular</p>
        <img src="${n}" style="width:220px;height:220px;display:block;margin:0 auto">
        <p style="color:#888;font-size:0.75rem;margin-top:8px">El QR expira en ~20 segundos. Si expira, vuelve a hacer clic.</p>`,window._waEstadoInterval&&clearInterval(window._waEstadoInterval),window._waEstadoInterval=setInterval(async()=>{await verificarEstadoWA()&&(clearInterval(window._waEstadoInterval),e.style.display="none")},4e3)}else if(o.nota)t.innerHTML=`<p style="color:#1565c0;font-size:0.82rem;padding:1rem">ℹ️ ${o.nota}<br>Intenta enviar un mensaje de prueba.</p>`,verificarEstadoWA();else{const n=o.qr_err||o.logout_err||"No se pudo obtener QR";t.innerHTML=`
        <p style="color:#c62828;font-size:0.82rem;padding:1rem">
          ❌ ${n.replace(/\n/g,"<br>")}
        </p>
        <button onclick="mostrarQRWhatsApp()" style="margin:0.5rem;padding:0.4rem 1rem;background:#E91E8C;color:white;border:none;border-radius:6px;cursor:pointer">
          🔄 Intentar obtener QR de nuevo
        </button>`}}catch(a){t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error de conexión: ${a.message}<br><small>Verifica que el servidor local esté corriendo.</small></p>`}}};window.mostrarQRWhatsApp=async()=>{const e=document.getElementById("wa-qr-panel"),t=document.getElementById("wa-qr-img");if(!(!e||!t)){e.style.display="block",t.innerHTML='<p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>';try{const o=await(await fetch(f+"/campanas/wa-qr")).json();if(o.qr){const n=o.qr.startsWith("data:")?o.qr:"data:image/png;base64,"+o.qr;t.innerHTML=`<img src="${n}" style="width:220px;height:220px;display:block">`,window._waEstadoInterval&&clearInterval(window._waEstadoInterval),window._waEstadoInterval=setInterval(async()=>{await window.verificarEstadoWA()&&clearInterval(window._waEstadoInterval)},4e3)}else t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${o.error||"No se obtuvo QR"}</p>`}catch(a){t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${a.message}</p>`}}};window.desconectarWhatsApp=async()=>{confirm("¿Desconectar WhatsApp Business?")&&(await fetch(f+"/campanas/wa-desconectar",{method:"POST"}),verificarEstadoWA())};window.actualizarVistaCampana=()=>{var c,m,u,g;const e=((c=document.querySelector('input[name="campana-segmento"]:checked'))==null?void 0:c.value)||"todos",t=((m=document.querySelector('input[name="campana-plantilla"]:checked'))==null?void 0:m.value)||"catalogo",a=(u=window._plantillasCampana)==null?void 0:u.find(y=>y.id===t),o=window._campanaClientes||[],n=document.getElementById("mensaje-personalizado");n&&(n.style.display=t==="personalizado"?"block":"none");let r=o;e!=="todos"&&(["menudeo","mayoreo","zapateria"].includes(e)?r=o.filter(y=>y.tipo===e):r=o.filter(y=>y.segmento===e)),t==="nuevos"&&cargarFotosNuevosModelos();const i=document.getElementById("campana-foto-manual");i&&(i.style.display=t==="nuevos"?"none":"block");const s=document.getElementById("campana-fotos-nuevos");s&&(s.style.display=t==="nuevos"?"block":"none");const d=document.getElementById("mensaje-preview");if(d){if(t==="catalogo_interactivo")d.style.background="#e3f2fd",d.style.borderColor="#90caf9",d.style.color="#1565c0",d.textContent=`🛍️ Los productos seleccionados se enviarán como tarjetas interactivas en WhatsApp.

El cliente puede ver cada modelo, elegir talla/color y hacer su pedido directamente desde el chat.

⚠️ Requiere que los productos estén en el catálogo de Meta Commerce.`;else if(d.style.background="#e8f5e9",d.style.borderColor="#a5d6a7",d.style.color="#333",a){let y;t==="personalizado"?y=(((g=document.getElementById("texto-personalizado"))==null?void 0:g.value)||"").replace("{nombre}","María"):y=a.mensaje("María"),d.textContent=y}}const l=document.getElementById("campana-count");l&&(l.textContent=r.length+" clientes");const p=document.getElementById("campana-lista");if(p){if(!r.length){p.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No hay clientes en este segmento con teléfono registrado</div>';return}window._campanaFiltrados=r,window._campanaPlantillaId=t,p.innerHTML=r.map((y,b)=>{var C;let h;t==="personalizado"?h=(((C=document.getElementById("texto-personalizado"))==null?void 0:C.value)||"").replace("{nombre}",y.nombre.split(" ")[0]):h=a.mensaje(y.nombre.split(" ")[0]);const v=encodeURIComponent(h),w=(y.lada||"52")+y.telefono.replace(/\D/g,"");return`
      <div class="campana-cli-row" data-idx="${b}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${b}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${y.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${y.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${y.tipo==="mayoreo"?"Mayoreo":y.tipo==="zapateria"?"Corridas":"Menudeo"} · ${y.telefono}</p>
        </div>
        <a href="https://wa.me/${w}?text=${v}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `}).join(""),actualizarContadorCampana()}};window.actualizarContadorCampana=()=>{const t=document.querySelectorAll(".campana-cli-check:checked").length;document.querySelectorAll("#campana-sel-count, #campana-sel-count-auto").forEach(r=>{r&&(r.textContent=t)});const a=document.getElementById("btn-campana-seleccionados"),o=document.getElementById("btn-campana-auto");a&&(a.style.display=t>0?"inline-flex":"none"),o&&(o.style.display=t>0?"inline-flex":"none"),document.querySelectorAll(".campana-cli-check").forEach(r=>r.disabled=!1);const n=document.getElementById("campana-sel-todos");if(n){const r=document.querySelectorAll(".campana-cli-check").length;n.checked=t>0&&t===r,n.indeterminate=t>0&&t<r}};window.filtrarClientesCampana=e=>{var s;const t=(e||"").toLowerCase().trim(),a=window._campanaFiltrados||[],o=window._campanaPlantillaId||"catalogo",n=(s=window._plantillasCampana)==null?void 0:s.find(d=>d.id===o),r=document.getElementById("campana-lista");if(!r)return;const i=t?a.filter(d=>d.nombre.toLowerCase().includes(t)||(d.telefono||"").includes(t)):a;if(!i.length){r.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No se encontraron clientes</div>';return}r.innerHTML=i.map(d=>{var u;const l=a.indexOf(d);let p;o==="personalizado"?p=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}",d.nombre.split(" ")[0]):p=n?n.mensaje(d.nombre.split(" ")[0]):"";const c=encodeURIComponent(p),m=(d.lada||"52")+d.telefono.replace(/\D/g,"");return`
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
        <a href="https://wa.me/${m}?text=${c}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `}).join("")};window.cargarFotosNuevosModelos=async()=>{const e=document.getElementById("campana-modelos-lista");if(window._campanaModelosData||(window._campanaModelosData=new Map),window._campanaModelosSeleccionados||(window._campanaModelosSeleccionados=new Set),window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set),!e||window._campanaModelosList){window._campanaModelosList&&_renderModelosCampana(window._campanaModelosList);return}try{const t=await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=500");window._campanaModelosList=await t.json(),_renderModelosCampana(window._campanaModelosList)}catch{e&&(e.innerHTML='<p style="padding:10px 12px;color:red;font-size:0.8rem">Error cargando modelos</p>')}};window._renderModelosCampana=e=>{const t=document.getElementById("campana-modelos-lista");if(!t)return;if(!e.length){t.innerHTML='<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>';return}const a=window._campanaModelosSeleccionados||new Set;t.innerHTML=e.map(o=>{const n=a.has(String(o.id));return`
    <div onclick="seleccionarModeloCampana('${o.id}', this)" id="modelo-item-${o.id}"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s;background:${n?"#fce4ec":""}">
      ${o.imagen_principal?`<img src="${o.imagen_principal}" style="width:34px;height:34px;object-fit:cover;border-radius:5px;flex-shrink:0">`:'<div style="width:34px;height:34px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px">👟</div>'}
      <span style="font-size:0.83rem;font-weight:${n?"700":"500"}">${o.nombre||o.sku_interno}</span>
      ${n?'<span style="margin-left:auto;font-size:0.7rem;background:#E91E8C;color:white;border-radius:20px;padding:1px 8px">✓</span>':""}
    </div>`}).join("")};window.filtrarModelosCampana=e=>{const t=window._campanaModelosList||[],a=e.trim()?t.filter(o=>(o.nombre||"").toLowerCase().includes(e.toLowerCase())||(o.sku_interno||"").toLowerCase().includes(e.toLowerCase())):t;_renderModelosCampana(a)};window.seleccionarModeloCampana=async(e,t)=>{var r,i,s;const a=String(e);window._campanaModelosSeleccionados||(window._campanaModelosSeleccionados=new Set),window._campanaModelosData||(window._campanaModelosData=new Map),window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set);const o=document.getElementById("campana-fotos-nuevos-grid");if(window._campanaModelosSeleccionados.has(a)){window._campanaModelosSeleccionados.delete(a);for(const d of[...window._campanaColoresSeleccionados])d.startsWith(a+"::")&&window._campanaColoresSeleccionados.delete(d);if(t){t.style.background="";const d=t.querySelector("span");d&&(d.style.fontWeight="500"),t.querySelector("span:last-child")}_renderColoresNuevos(),actualizarCountFotos(),window._campanaModelosList&&_renderModelosCampana((r=document.getElementById("campana-nuevo-buscar"))!=null&&r.value?(window._campanaModelosList||[]).filter(d=>(d.nombre||"").toLowerCase().includes(document.getElementById("campana-nuevo-buscar").value.toLowerCase())):window._campanaModelosList||[]);return}if(window._campanaModelosSeleccionados.add(a),t){t.style.background="#fce4ec";const d=t.querySelector("span");d&&(d.style.fontWeight="700")}if(o){const d=document.createElement("p");d.id="campana-load-"+a,d.style.cssText="font-size:0.8rem;color:#aaa;padding:4px 0",d.textContent="Cargando colores...",o.appendChild(d)}if(!window._campanaModelosData.has(a))try{const d=((i=t==null?void 0:t.querySelector("span"))==null?void 0:i.textContent)||a,p=await(await fetch(f+"/variantes/producto/"+a)).json(),c={};for(const m of p)m.color&&(c[m.color]||(c[m.color]={color:m.color,color_hex:m.color_hex||null,foto_url:null}),!c[m.color].foto_url&&m.foto_url&&(c[m.color].foto_url=m.foto_url));window._campanaModelosData.set(a,{nombre:d,colores:Object.values(c)})}catch{window._campanaModelosSeleccionados.delete(a);const l=document.getElementById("campana-load-"+a);if(l&&l.remove(),o){const p=document.createElement("p");p.style.cssText="color:red;font-size:0.8rem",p.textContent="Error cargando variantes",o.appendChild(p)}return}const n=document.getElementById("campana-load-"+a);n&&n.remove(),_renderColoresNuevos(),actualizarCountFotos(),window._campanaModelosList&&_renderModelosCampana((s=document.getElementById("campana-nuevo-buscar"))!=null&&s.value?(window._campanaModelosList||[]).filter(d=>(d.nombre||"").toLowerCase().includes(document.getElementById("campana-nuevo-buscar").value.toLowerCase())):window._campanaModelosList||[])};window._renderColoresNuevos=()=>{var r;const e=document.getElementById("campana-fotos-nuevos-grid");if(!e)return;const t=window._campanaModelosSeleccionados||new Set;if(!t.size){e.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px 0">Selecciona uno o más modelos arriba</p>';return}const a=window._campanaColoresSeleccionados||new Set,o=t.size>1;let n="";for(const i of t){const s=(r=window._campanaModelosData)==null?void 0:r.get(i);if(s){if(o&&(n+=`<p style="font-size:0.72rem;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 4px;padding:0 2px">${s.nombre}</p>`),!s.colores.length){n+='<p style="font-size:0.78rem;color:#aaa;margin:0 0 6px">Sin colores registrados</p>';continue}n+=s.colores.map(d=>{const l=`${i}::${d.color}`,p=a.has(l),c=!d.foto_url;return`
      <div onclick="${c?"":`toggleColorNuevo('${l}', this)`}"
           id="color-nuevo-row-${l.replace(/[^a-zA-Z0-9]/g,"-")}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:2px solid ${p?"#E91E8C":"#eee"};cursor:${c?"default":"pointer"};background:${p?"#fce4ec":"white"};opacity:${c?".45":"1"};transition:all 0.15s;margin-bottom:4px">
        <input type="checkbox" ${p?"checked":""} ${c?"disabled":""}
               onclick="event.stopPropagation();toggleColorNuevo('${l}', this.closest('div'))"
               style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0">
        <div style="width:24px;height:24px;border-radius:50%;background:${d.color_hex||"#ccc"};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.84rem;font-weight:600">${d.color}</span>
        ${d.foto_url?`<img src="${d.foto_url}" style="width:48px;height:48px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`:'<span style="font-size:0.7rem;color:#bbb;flex-shrink:0">sin foto</span>'}
      </div>`}).join("")}}e.innerHTML=n};window.toggleColorNuevo=(e,t)=>{window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set);const a="color-nuevo-row-"+e.replace(/[^a-zA-Z0-9]/g,"-"),o=document.getElementById(a)||(t!=null&&t.closest?t.closest('[id^="color-nuevo-row"]'):null),n=o==null?void 0:o.querySelector("input[type=checkbox]");window._campanaColoresSeleccionados.has(e)?(window._campanaColoresSeleccionados.delete(e),o&&(o.style.borderColor="#eee",o.style.background="white"),n&&(n.checked=!1)):(window._campanaColoresSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fce4ec"),n&&(n.checked=!0)),actualizarCountFotos()};window.actualizarCountFotos=()=>{var a;const e=document.getElementById("campana-fotos-count");if(!e)return;const t=((a=window._campanaColoresSeleccionados)==null?void 0:a.size)||0;e.textContent=t>0?`${t} color${t>1?"es":""} seleccionado${t>1?"s":""} — cada cliente recibirá ${t} foto${t>1?"s":""}`:"Palomea los colores que quieres enviar"};window.cargarProductosCampana=async()=>{const e=document.getElementById("campana-producto-sel");if(e)try{const a=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=created_at.desc&limit=60")).json();e.innerHTML='<option value="">— Sin foto —</option>'+a.filter(o=>o.imagen_principal).map(o=>`<option value="${o.imagen_principal}" data-nombre="${o.nombre}">${o.nombre||o.sku_interno}</option>`).join("")}catch(t){console.error("Error cargando productos campana:",t)}};window.seleccionarProductoCampana=e=>{window._campanaImagenUrl=e||"";const t=document.getElementById("campana-foto-preview"),a=document.getElementById("campana-foto-img");t&&a&&(e?(a.src=e,t.style.display="block"):(t.style.display="none",a.src=""))};window.quitarFotoCampana=()=>{window._campanaImagenUrl="";const e=document.getElementById("campana-producto-sel");e&&(e.value="");const t=document.getElementById("campana-foto-preview");t&&(t.style.display="none")};window.cargarProductosInteractivo=async()=>{const e=document.getElementById("campana-prod-grid");if(e){if(window._campanaProdInteractivoCargado){renderizarProductosInteractivo(window._campanaProdInteractivo||[]);return}e.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">Cargando...</p>';try{const a=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._campanaProdInteractivo=a,window._campanaProdSeleccionados=new Set,window._campanaProdInteractivoCargado=!0,renderizarProductosInteractivo(a)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:8px">Error cargando productos</p>')}}};window.renderizarProductosInteractivo=e=>{const t=document.getElementById("campana-prod-grid");if(!t)return;const a=window._campanaProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">No hay productos</p>';return}t.innerHTML=e.map(o=>{const n=o.sku_interno||o.id,r=a.has(n);return`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;border:1px solid ${r?"#E91E8C":"#f0f0f0"};background:${r?"#fff0f8":"white"};transition:all 0.1s" id="prod-lbl-${n}">
      <input type="checkbox" ${r?"checked":""} onchange="toggleProdInteractivo('${n}', this)"
        style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${o.imagen_principal?`<img src="${o.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:32px;height:32px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.nombre||n}</p>
        <p style="font-size:0.68rem;color:#aaa">${n}${o.categoria?" · "+o.categoria:""}</p>
      </div>
    </label>`}).join(""),actualizarCountProdInteractivo()};window.toggleProdInteractivo=(e,t)=>{window._campanaProdSeleccionados||(window._campanaProdSeleccionados=new Set);const a=document.getElementById("prod-lbl-"+e);if(t.checked){if(window._campanaProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos por mensaje interactivo");return}window._campanaProdSeleccionados.add(e),a&&(a.style.borderColor="#E91E8C",a.style.background="#fff0f8")}else window._campanaProdSeleccionados.delete(e),a&&(a.style.borderColor="#f0f0f0",a.style.background="white");actualizarCountProdInteractivo()};window.actualizarCountProdInteractivo=()=>{var a;const e=document.getElementById("campana-prod-count");if(!e)return;const t=((a=window._campanaProdSeleccionados)==null?void 0:a.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:"Ningún producto seleccionado"};window.filtrarProductosInteractivo=e=>{const t=(e||"").toLowerCase().trim(),a=window._campanaProdInteractivo||[],o=t?a.filter(n=>(n.nombre||"").toLowerCase().includes(t)||(n.sku_interno||"").toLowerCase().includes(t)||(n.categoria||"").toLowerCase().includes(t)):a;renderizarProductosInteractivo(o)};window.enviarCatalogoInteractivo=async e=>{var r;const t=window._campanaFiltrados||[],a=Array.from(window._campanaProdSeleccionados||new Set);if(!a.length){alert("Selecciona al menos un producto");return}const o=e.map(i=>t[i]).filter(Boolean).map(i=>({telefono:i.telefono,nombre:i.nombre}));if(!o.length)return;const n=document.createElement("div");n.id="campana-auto-overlay",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",n.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${o.length} contacto${o.length>1?"s":""} · ${a.length} producto${a.length>1?"s":""}</p>
  </div>`,document.body.appendChild(n);try{const s=await(await fetch(f+"/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:o,skus:a,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();n.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${s.fallidos===0?"🎉":"✅"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${s.enviados||0} enviados</p>
      ${s.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${s.fallidos} fallidos</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${(r=s.errores)!=null&&r.length?`<p style="font-size:0.7rem;color:#aaa;margin-bottom:1rem">${s.errores[0]}</p>`:""}
      <button onclick="document.getElementById('campana-auto-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(i){n.remove(),alert("Error: "+i.message)}};window.enviarCampanaAutomatica=async()=>{var p,c;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(m=>parseInt(m.dataset.idx)),a=window._campanaFiltrados||[],o=window._campanaPlantillaId||"catalogo",n=(p=window._plantillasCampana)==null?void 0:p.find(m=>m.id===o),r=window._campanaImagenUrl||"";let i=[],s=[];if(o==="nuevos"){const m=window._campanaColoresSeleccionados||new Set;if(!m.size){alert("Selecciona al menos un color");return}for(const u of window._campanaModelosSeleccionados||new Set){const g=(c=window._campanaModelosData)==null?void 0:c.get(u);if(g)for(const y of g.colores){const b=`${u}::${y.color}`;m.has(b)&&y.foto_url&&(s.push({url:y.foto_url,caption:y.color}),i.push(y.foto_url))}}if(!s.length){alert("Los colores seleccionados no tienen foto. Selecciona colores con imagen.");return}}else r&&(i=[r]);const d=t.map(m=>a[m]).filter(Boolean).map(m=>{var g;let u;return o==="personalizado"?u=(((g=document.getElementById("texto-personalizado"))==null?void 0:g.value)||"").replace("{nombre}",m.nombre.split(" ")[0]):u=n.mensaje(m.nombre.split(" ")[0]),{nombre:m.nombre,telefono:m.telefono,lada:m.lada||"52",mensaje:u}});if(!d.length)return;const l=document.createElement("div");l.id="campana-auto-overlay",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📤</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Iniciando campaña…</h3>
      <p style="font-size:0.82rem;color:#888">Conectando con WhatsApp Business</p>
    </div>`,document.body.appendChild(l);try{const u=await(await fetch(f+"/campanas/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destinatarios:d.map(v=>({nombre:v.nombre,telefono:v.telefono,mensaje:v.mensaje})),fotos_urls:i,fotos_con_caption:s.length?s:null,imagen_url:i.length===1?i[0]:"",delay_segundos:4})})).json();if(u.error){l.remove(),alert("Error: "+u.error);return}const g=u.job_id,y=u.total,b=v=>{var _;const w=v.progreso||0,C=Math.round(w/y*100),x=v.enviados||0,z=v.fallidos||0;l.innerHTML=`
        <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
            <h3 style="font-size:1rem;font-weight:700">🤖 Enviando campaña…</h3>
            <button onclick="cancelarCampanaAuto('${g}')"
              style="background:none;border:1px solid #eee;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#888;cursor:pointer">
              ⏸ Pausar
            </button>
          </div>
          <div style="background:#f5f5f5;border-radius:100px;height:10px;margin-bottom:0.5rem;overflow:hidden">
            <div style="background:linear-gradient(90deg,#E91E8C,#c4116a);height:10px;border-radius:100px;width:${C}%;transition:width 0.5s"></div>
          </div>
          <p style="font-size:0.78rem;color:#888;text-align:center;margin-bottom:1.5rem">${w} de ${y} mensajes enviados</p>
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
              <p style="font-size:1.5rem;font-weight:700;color:#888">${y-w}</p>
              <p style="font-size:0.72rem;color:#888">Pendientes</p>
            </div>
          </div>
          ${w>0&&((_=v.resultados)!=null&&_.length)?`
            <div style="margin-top:1rem;max-height:120px;overflow-y:auto;border-top:1px solid #f5f5f5;padding-top:0.75rem">
              ${v.resultados.slice(-5).map($=>`
                <div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:0.75rem">
                  <span style="color:${$.ok?"#25D366":"#e53e3e"}">${$.ok?"✅":"❌"}</span>
                  <span style="flex:1;color:#555">${$.nombre}</span>
                  ${$.ok?"":`<span style="color:#e53e3e;font-size:0.68rem" title="${($.error||"").replace(/"/g,"'")}">Error</span>`}
                </div>`).join("")}
            </div>`:""}
        </div>`};window._campanaJobId=g;const h=setInterval(async()=>{try{const w=await(await fetch(f+"/campanas/estado/"+g)).json();b(w),w.terminado&&(clearInterval(h),window._campanaUltimosResultados=w.resultados||[],setTimeout(()=>{const C=w.enviados||0,x=w.fallidos||0;l.innerHTML=`
              <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
                <div style="font-size:3.5rem;margin-bottom:1rem">${x===0?"🎉":"✅"}</div>
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
                <p style="color:#888;font-size:0.85rem;margin-bottom:0.5rem"><strong style="color:#25D366">${C} enviados</strong> correctamente</p>
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
              </div>`},600))}catch{clearInterval(h)}},1500)}catch(m){l.remove(),alert("Error conectando con el servidor: "+m.message)}};window.cancelarCampanaAuto=async e=>{try{await fetch(f+"/campanas/cancelar/"+e,{method:"POST"})}catch{}const t=document.getElementById("campana-auto-overlay");t&&t.remove()};window.reintentarFallidos=async e=>{var l,p;const t=(e||[]).filter(c=>!c.ok);if(!t.length)return;(l=document.getElementById("campana-auto-overlay"))==null||l.remove();const a=window._campanaFiltrados||[],o=window._campanaPlantillaId||"catalogo",n=(p=window._plantillasCampana)==null?void 0:p.find(c=>c.id===o),r=window._campanaFotosUrls||[],i=window._campanaFotosConCaption||null,s=window._campanaImagenUrl||"",d=t.map(c=>{const m=a.find(b=>{const h=String(b.telefono||"").replace(/\D/g,""),v=String(c.telefono||"").replace(/\D/g,"");return v.endsWith(h)||h.endsWith(v)}),u=c.nombre||(m?m.nombre:"Cliente"),g=u.split(" ")[0];let y=n?n.texto.replace("{nombre}",g):`Hola ${g}`;return{nombre:u,telefono:c.telefono,mensaje:y}});if(!d.length){alert("No se pudo reconstruir los destinatarios");return}try{const m=await(await fetch(f+"/campanas/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destinatarios:d,fotos_urls:r,fotos_con_caption:i,imagen_url:s,delay_segundos:5})})).json();if(m.error){alert("Error: "+m.error);return}alert(`Reintentando ${d.length} mensaje(s) fallido(s)...`)}catch(c){alert("Error al reintentar: "+c.message)}};window.toggleSeleccionarTodosCampana=e=>{document.querySelectorAll(".campana-cli-check").forEach(a=>{e?a.checked=!0:a.checked=!1}),actualizarContadorCampana()};window.iniciarCampanaSeleccionados=()=>{var l;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(p=>parseInt(p.dataset.idx)),a=window._campanaFiltrados||[],o=window._campanaPlantillaId||"catalogo",n=(l=window._plantillasCampana)==null?void 0:l.find(p=>p.id===o),r=t.map(p=>a[p]).filter(Boolean).map(p=>{var u;let c;o==="personalizado"?c=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}",p.nombre.split(" ")[0]):c=n.mensaje(p.nombre.split(" ")[0]);const m=(p.lada||"52")+p.telefono.replace(/\D/g,"");return{...p,mensaje:c,tel:m}});if(!r.length)return;let i=0;const s=document.createElement("div");s.id="campana-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem";const d=()=>{const p=r[i],c=Math.round(i/r.length*100);s.innerHTML=`
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
          <h3 style="font-size:1rem;font-weight:700">📣 Campaña en curso</h3>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#888">✕</button>
        </div>

        <!-- Barra de progreso -->
        <div style="background:#f5f5f5;border-radius:100px;height:6px;margin-bottom:1.5rem">
          <div style="background:#E91E8C;height:6px;border-radius:100px;width:${c}%;transition:width 0.3s"></div>
        </div>
        <p style="font-size:0.75rem;color:#888;text-align:center;margin-top:-1rem;margin-bottom:1.5rem">${i} de ${r.length} enviados</p>

        <!-- Cliente actual -->
        <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:1rem;display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.1rem;flex-shrink:0">
            ${p.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style="font-weight:700;font-size:0.95rem">${p.nombre}</p>
            <p style="font-size:0.78rem;color:#888">${p.telefono}</p>
          </div>
        </div>

        <!-- Preview mensaje -->
        <div style="background:#e8f5e9;border-radius:10px;padding:0.875rem;font-size:0.8rem;color:#333;white-space:pre-wrap;line-height:1.55;border:1px solid #a5d6a7;max-height:140px;overflow-y:auto;margin-bottom:1.25rem">${p.mensaje}</div>

        <!-- Botones -->
        <a href="https://wa.me/${p.tel}?text=${encodeURIComponent(p.mensaje)}" target="_blank"
           onclick="setTimeout(() => document.getElementById('btn-campana-siguiente')?.focus(), 800)"
           style="display:block;background:#25D366;color:white;padding:12px;border-radius:10px;font-size:0.9rem;font-weight:700;text-decoration:none;text-align:center;margin-bottom:10px">
          💬 Abrir WhatsApp con ${p.nombre.split(" ")[0]}
        </a>
        <div style="display:flex;gap:8px">
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="flex:1;padding:10px;border-radius:10px;border:1px solid #eee;background:white;font-size:0.82rem;color:#888;cursor:pointer">
            Pausar campaña
          </button>
          <button id="btn-campana-siguiente"
            onclick="window._campanaAvanzar()"
            style="flex:2;padding:10px;border-radius:10px;border:none;background:#E91E8C;color:white;font-size:0.85rem;font-weight:700;cursor:pointer">
            ${i<r.length-1?"✅ Enviado → Siguiente":"✅ Finalizar campaña"}
          </button>
        </div>
      </div>
    `};window._campanaAvanzar=()=>{if(i++,i>=r.length){s.innerHTML=`
        <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="font-size:3.5rem;margin-bottom:1rem">🎉</div>
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
          <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">Se enviaron mensajes a <strong>${r.length} clientes</strong> exitosamente.</p>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">
            Cerrar
          </button>
        </div>
      `;return}d()},d(),document.body.appendChild(s)};async function Ae(){const e=document.getElementById("content");try{const[t,a]=await Promise.all([fetch(f+"/clientes/"),fetch(f+"/pedidos/")]),o=await t.json(),n=await a.json(),r=new Date,i=new Date(r-30*24*60*60*1e3),s=new Date(r-90*24*60*60*1e3),d=o.map(u=>{const g=n.filter(_=>_.cliente_id===u.id&&(_.status==="confirmado"||_.status==="pagado")),y=g.reduce((_,$)=>_+parseFloat($.total||0),0),b=g.length>0?new Date(g[0].created_at):null,h=g.filter(_=>new Date(_.created_at)>=i).length,v=b?Math.floor((r-b)/(1e3*60*60*24)):null;let w="nuevo",C="⚪ Nuevo",x="#f5f5f5",z="#888";return g.length===0?(w="nuevo",C="⚪ Sin compras",x="#f5f5f5",z="#888"):y>=5e3&&h>=1?(w="vip",C="⭐ VIP",x="#fff8e1",z="#f57f17"):v>90?(w="inactivo",C="🔴 Inactivo",x="#ffebee",z="#c62828"):v>30?(w="riesgo",C="🟡 En riesgo",x="#fff8e1",z="#f57f17"):h>=2?(w="frecuente",C="🟢 Frecuente",x="#e8f5e9",z="#2e7d32"):(w="activo",C="🔵 Activo",x="#e3f2fd",z="#1565c0"),{...u,totalGastado:y,ultimoPedido:b,pedidos30:h,diasSinComprar:v,segmento:w,segmentoLabel:C,segmentoBg:x,segmentoColor:z,totalPedidos:g.length}}).sort((u,g)=>g.totalGastado-u.totalGastado),l=d.filter(u=>u.segmento==="vip").length,p=d.filter(u=>u.segmento==="inactivo").length,c=d.filter(u=>u.segmento==="riesgo").length,m=d.filter(u=>u.segmento==="frecuente"||u.segmento==="activo").length;window._clientesData=d,e.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('todos')">
          <p style="font-size:1.8rem;font-weight:700;color:#333">${o.length}</p>
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Total</p>
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
          <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${c}</p>
          <p style="font-size:0.72rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('inactivo')">
          <p style="font-size:1.8rem;font-weight:700;color:#c62828">${p}</p>
          <p style="font-size:0.72rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Clientes (${o.length})</h3>
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
        </div>
        <div id="cli-lista">
          ${d.map(u=>`
            <div class="cli-item" data-segmento="${u.segmento}" data-tipo="${u.tipo||""}" data-nombre="${u.nombre.toLowerCase()}" data-tel="${u.telefono||""}"
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
                </div>
                <p style="font-size:0.78rem;color:#888">${u.telefono||"Sin teléfono"}${u.ciudad?" · "+u.ciudad:""}</p>
                ${u.comentarios_internos?`<p style="font-size:0.72rem;color:#E91E8C;margin-top:2px">📝 ${u.comentarios_internos.substring(0,50)}${u.comentarios_internos.length>50?"...":""}</p>`:""}
              </div>
              <div style="text-align:right;min-width:100px">
                <p style="font-weight:700;color:#E91E8C;font-size:0.95rem">$${u.totalGastado.toFixed(0)}</p>
                <p style="font-size:0.72rem;color:#888">${u.totalPedidos} pedidos</p>
                ${u.diasSinComprar!==null?`<p style="font-size:0.68rem;color:${u.diasSinComprar>60?"#c62828":"#aaa"}">${u.diasSinComprar===0?"Hoy":"Hace "+u.diasSinComprar+" días"}</p>`:""}
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0" onclick="event.stopPropagation()">
                ${u.telefono?`<a href="https://wa.me/${u.lada||"52"}${u.telefono.replace(/\D/g,"")}" target="_blank" class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem;background:#25D366;color:white;border-color:#25D366">WhatsApp</a>`:""}
                <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="mostrarFormCliente('${u.id}')">Editar</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarClientes=()=>{var a,o;const e=(((a=document.getElementById("cli-buscar"))==null?void 0:a.value)||"").toLowerCase(),t=((o=document.getElementById("cli-tipo"))==null?void 0:o.value)||"";document.querySelectorAll(".cli-item").forEach(n=>{const r=n.dataset.nombre||"",i=n.dataset.tel||"",s=n.dataset.tipo||"",d=!e||r.includes(e)||i.includes(e),l=!t||s===t;n.style.display=d&&l?"":"none"})};window.filtrarClientesSeg=e=>{document.querySelectorAll(".cli-item").forEach(t=>{if(e==="todos"){t.style.display="";return}if(e==="activos"){t.style.display=t.dataset.segmento==="activo"||t.dataset.segmento==="frecuente"?"":"none";return}t.style.display=t.dataset.segmento===e?"":"none"})};async function Me(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/sucursales/")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Sucursales (${a.length})</h3>
          <button class="btn btn-primary">+ Nueva sucursal</button>
        </div>
        <table>
          <thead>
           <tr><th>Nombre</th><th>Tipo</th><th>Direccion</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr>          </thead>
          <tbody>
            ${a.map(o=>`
              <tr>
                <td><strong>${o.nombre}</strong></td>
                <td>${o.tipo}</td>
                <td>${o.direccion||"—"}</td>
                <td>${o.telefono||"—"}</td>
                <td><span class="badge badge-success">Activa</span></td>
             <td>
              <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormSucursal('${o.id}')">Editar</button>
              </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}async function Le(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/sucursales/")).json(),n=await(await fetch(f+"/productos/")).json();let i=await(await fetch(f+"/variantes/")).json();const d=await(await fetch(f+"/inventario/")).json();d.forEach(p=>{p.variantes&&p.variantes.id&&!i.find(c=>c.id===p.variantes.id)&&i.push(p.variantes)}),window._invData={sucursales:a,productos:n,variantes:i,inventario:d};const l=n.find(p=>p.sku_interno==="AR1011");if(l){const p=i.filter(m=>m.producto_id===l.id),c=d.filter(m=>p.some(u=>u.id===m.variante_id));console.log(`[Diag AR1011] Variantes en listado: ${p.length}`,p.map(m=>m.color+" T"+m.talla)),console.log(`[Diag AR1011] Con inventario: ${c.length}`)}e.innerHTML=`
  <div style="margin-bottom:1.5rem">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <input class="form-input" id="inv-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="flex:1;min-width:200px" oninput="renderInventario()">
      <select class="form-input" id="inv-categoria" style="min-width:140px" onchange="renderInventario()">
        <option value="">Todas las categorias</option>
        ${[...new Set(n.map(p=>p.categoria).filter(Boolean))].map(p=>`<option value="${p}">${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join("")}
      </select>
      <select class="form-input" id="inv-talla" style="min-width:100px" onchange="renderInventario()">
        <option value="">Todas las tallas</option>
        ${ue.map(p=>`<option value="${p}">${p}</option>`).join("")}
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
`,renderInventario()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.renderInventario=()=>{const{sucursales:e,productos:t,variantes:a,inventario:o}=window._invData,n=(document.getElementById("inv-buscar")?document.getElementById("inv-buscar").value:"").toLowerCase(),r=document.getElementById("inv-categoria")?document.getElementById("inv-categoria").value:"",i=document.getElementById("inv-talla")?document.getElementById("inv-talla").value:"",s=document.getElementById("inv-estado")?document.getElementById("inv-estado").value:"",d=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],l=t.filter(m=>!(!m.activo||n&&!m.nombre.toLowerCase().includes(n)&&!(m.sku_interno||"").toLowerCase().includes(n)||r&&m.categoria!==r)),p=e.map(m=>{const u=o.filter(y=>y.sucursal_id===m.id),g=l.map(y=>{const b=a.filter(C=>C.producto_id===y.id);if(b.length===0)return"";const v=[...new Set(b.map(C=>C.color).filter(Boolean))].map(C=>{const x=b.filter(T=>T.color===C).sort((T,M)=>d.indexOf(T.talla)-d.indexOf(M.talla));if(i&&!x.find(T=>T.talla===i))return"";const z=x[0]?x[0].color_hex:"#888",_=x[0]?x[0].foto_url:null,$=x.map(T=>{const M=u.find(k=>k.variante_id===T.id),S=M?M.cantidad:null,I=M?M.stock_minimo:3;if(i&&T.talla!==i||s&&(s==="agotado"&&S!==0||s==="bajo"&&(S===null||S===0||S>I)||s==="disponible"&&(S===null||S===0||S<=I)))return"";let A,E;return S===null?(A="#f0f0f0",E="#aaa"):S===0?(A="#ffebee",E="#c62828"):S<=I?(A="#fff8e1",E="#f57f17"):(A="#e8f5e9",E="#2e7d32"),`
            <div style="display:flex;align-items:center;justify-content:space-between;background:${A};border-radius:10px;padding:8px 12px;border:1px solid ${E}30">
              <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:44px">T${T.talla}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="cambiarStockInventario('${T.id}', '${m.id}', ${S!==null?S:0}, ${I}, -1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
                <span id="stock-${T.id}-${m.id}" style="font-size:1.1rem;font-weight:700;color:${E};min-width:32px;text-align:center">${S!==null?S:"—"}</span>
                <button onclick="cambiarStockInventario('${T.id}', '${m.id}', ${S!==null?S:0}, ${I}, 1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
            </div>
          `}).join("");return $.trim()?`
          <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              ${_?`<img src="${_}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:`<div style="width:52px;height:52px;background:${z};border-radius:8px;border:1px solid #eee;flex-shrink:0;opacity:0.7"></div>`}
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:14px;height:14px;border-radius:50%;background:${z};border:2px solid #ddd;flex-shrink:0"></div>
                <span style="font-size:0.9rem;font-weight:600;color:#333">${C}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
              ${$}
            </div>
          </div>
        `:""}).join("");if(!v.trim())return"";const w=y.imagen_principal;return`
        <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
            ${w?`<img src="${w}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:56px;height:56px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>'}
            <div>
              <p style="font-weight:700;font-size:1rem;color:#1a1a1a;margin-bottom:2px">${y.nombre}</p>
              <div>
                <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px;margin-right:4px">${y.sku_interno||"—"}</span>
                <span style="font-size:0.72rem;color:#E91E8C;background:#fce4f3;padding:2px 8px;border-radius:100px">${y.categoria||""}</span>
              </div>
            </div>
          </div>
          ${v}
        </div>
      `}).join("");return g.trim()?`
      <div style="margin-bottom:2rem">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
          <div style="flex:1;height:2px;background:linear-gradient(90deg,#E91E8C,transparent)"></div>
          <h3 style="font-size:1rem;font-weight:700;color:#E91E8C;white-space:nowrap;padding:0 12px">${m.nombre.toUpperCase()}</h3>
          <div style="flex:1;height:2px;background:linear-gradient(270deg,#E91E8C,transparent)"></div>
        </div>
        ${g}
      </div>
    `:""}).join(""),c=document.getElementById("inv-contenido");c&&(c.innerHTML=p||'<div style="text-align:center;padding:3rem;color:#888"><p>No hay inventario registrado</p></div>')};window.cambiarStockInventario=async(e,t,a,o,n)=>{const r=Math.max(0,a+n);try{if((await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:r,stock_minimo:o,motivo:"Ajuste desde inventario"})})).ok){const s=document.getElementById("stock-"+e+"-"+t);if(s){s.textContent=r;let p;r===0?p="#c62828":r<=o?p="#f57f17":p="#2e7d32",s.style.color=p}const d=window._invData.inventario.find(p=>p.variante_id===e&&p.sucursal_id===t);d&&(d.cantidad=r),document.querySelectorAll(`button[onclick*="${e}"][onclick*="${t}"]`).forEach(p=>{p.setAttribute("onclick",p.getAttribute("onclick").replace(/cambiarStockInventario\('[^']+', '[^']+', \d+,/,`cambiarStockInventario('${e}', '${t}', ${r},`))})}}catch{alert("Error actualizando stock")}};window.editarStock=async(e,t,a,o)=>{const n=prompt("Nueva cantidad:",a);if(n===null)return;const r=prompt("Stock minimo de alerta:",o);if(r!==null)try{const i=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(n),stock_minimo:parseInt(r),motivo:"Ajuste manual desde inventario"})});if(i.ok){const s=await fetch(f+"/inventario/");window._invData.inventario=await s.json(),renderInventario()}else{const s=await i.json().catch(()=>({}));alert("Error al guardar: "+(s.error||i.status))}}catch{alert("Error conectando con el servidor")}};window.mostrarFormInventario=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
            ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarInventario=async()=>{const e=document.getElementById("inv-sucursal").value,t=document.getElementById("inv-v").value,a=document.getElementById("inv-cantidad").value,o=document.getElementById("inv-minimo").value||3;if(!e||!t||a===""){alert("Por favor completa todos los campos");return}try{const n=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,variante_id:t,cantidad:parseInt(a),stock_minimo:parseInt(o),motivo:"Stock cargado manualmente"})});if(n.ok)alert("Stock guardado correctamente"),navegarA("inventario");else{const r=await n.json().catch(()=>({}));alert("Error al guardar stock: "+(r.error||n.status))}}catch{alert("Error conectando con el servidor")}};window.mostrarAlertas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando alertas...</p>';try{const a=await(await fetch(f+"/inventario/alertas")).json();e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#f57f17">Productos con stock bajo o agotado (${a.length})</h3>
      </div>
      ${a.length===0?'<div class="table-card" style="padding:3rem;text-align:center;color:#888"><p>Todo el inventario esta en buen nivel</p></div>':`<div class="table-card"><table>
          <thead><tr><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Minimo</th><th>Estado</th><th>Accion</th></tr></thead>
          <tbody>
            ${a.map(o=>{const n=o.cantidad||0,r=o.stock_minimo||3,i=n===0;return`
                <tr style="background:${i?"#fff5f5":"#fffdf0"}">
                  <td><strong>${o.variantes&&o.variantes.productos?o.variantes.productos.nombre:"—"}</strong></td>
                  <td>${o.variantes&&o.variantes.color||"—"}</td>
                  <td>${o.variantes&&o.variantes.talla||"—"}</td>
                  <td>${o.sucursales&&o.sucursales.nombre||"—"}</td>
                  <td><strong style="color:${i?"#c62828":"#f57f17"}">${n}</strong></td>
                  <td>${r}</td>
                  <td><span class="badge ${i?"badge-danger":"badge-warning"}">${i?"Agotado":"Stock bajo"}</span></td>
                  <td><button class="btn btn-primary" style="padding:4px 10px;font-size:0.75rem" onclick="editarStock('${o.variante_id}', '${o.sucursal_id}', ${n}, ${r})">Reabastecer</button></td>
                </tr>
              `}).join("")}
          </tbody></table></div>`}
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando alertas</p>'}};window.mostrarAjuste=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
            ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarAjuste=async()=>{const e=document.getElementById("aj").value,t=document.getElementById("aj-sucursal").value,a=document.getElementById("aj-cantidad").value,o=document.getElementById("aj-motivo").value;if(!e||!t||a===""){alert("Por favor completa todos los campos");return}try{const r=await(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(a),motivo:o})})).json();r.ok?(alert("Ajuste guardado. Anterior: "+r.cantidad_anterior+" pares ÔåÆ Nuevo: "+r.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(r))}catch{alert("Error conectando con el servidor")}};window.mostrarCambio=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
            ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarCambio=async()=>{const e=document.getElementById("cam-origen").value,t=document.getElementById("cam-destino").value,a=document.getElementById("cam-sucursal").value,o=document.getElementById("cam-motivo").value;if(!e||!t||!a){alert("Por favor selecciona ambos productos y la sucursal");return}if(e===t){alert("El producto que regresa y el que se lleva deben ser diferentes");return}try{const r=await(await fetch(f+"/movimientos/cambio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_origen_id:e,variante_destino_id:t,sucursal_id:a,motivo:o})})).json();r.ok?(alert("Cambio registrado. El inventario se actualizo automaticamente."),navegarA("inventario")):alert("Error: "+JSON.stringify(r))}catch{alert("Error conectando con el servidor")}};window.buscarVariante=(e,t)=>{const a=window._variantesCache||[],o=document.getElementById(t+"-resultados");if(!o)return;if(!e||e.length<2){o.style.display="none";return}const n=e.toLowerCase().split(" ").filter(s=>s),r=a.filter(s=>{const d=(s.productos&&s.productos.nombre||"").toLowerCase(),l=(s.color||"").toLowerCase(),p=(s.talla||"").toLowerCase(),c=(s.sku||"").toLowerCase(),m=d+" "+l+" "+p+" "+c;return n.every(u=>m.includes(u))}).slice(0,15);if(r.length===0){o.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron resultados</div>',o.style.display="block";return}const i=t==="ped-prod";o.innerHTML=r.map(s=>{const d=(s.productos&&s.productos.nombre||"")+" - "+s.color+" - T"+s.talla;return`
      <div onclick="${i?`agregarItemPedido('${s.id}', '${d.replace(/'/g,"")}')`:`seleccionarVariante('${s.id}', '${d.replace(/'/g,"")}', '${t}')`}; document.getElementById('${t}-resultados').style.display='none'; document.getElementById('${i?"ped-buscar-prod":t+"-buscar"}') && (document.getElementById('${i?"ped-buscar-prod":t+"-buscar"}').value='')"
           style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem;display:flex;align-items:center;gap:8px"
           onmouseover="this.style.background='#f5f5f5'"
           onmouseout="this.style.background='white'">
        ${s.color_hex?'<div style="width:12px;height:12px;border-radius:50%;background:'+s.color_hex+';border:1px solid #ddd;flex-shrink:0"></div>':""}
        <div>
          <strong>${s.productos&&s.productos.nombre||"—"}</strong>
          <span style="color:#888"> · ${s.color} · Talla ${s.talla}</span>
          <span style="color:#ccc;font-size:0.75rem"> · ${s.sku||""}</span>
        </div>
      </div>
    `}).join(""),o.style.display="block"};window.seleccionarVariante=(e,t,a)=>{const o=document.getElementById(a);o&&(o.value=e);const n=document.getElementById(a+"-seleccionado");n&&(n.textContent="Ô£ô "+t,n.style.display="block");const r=document.getElementById(a+"-resultados");r&&(r.style.display="none")};function ae(e,t){const a=t||{},o=!t;let n="";a.imagenes&&a.imagenes.length>0?n=a.imagenes.map((s,d)=>{const l=d===0;return`<div style="position:relative;cursor:pointer" data-url="${s}" data-es-portada="${l}" data-file-idx="${d}">
  <img src="${s}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid ${l?"#E91E8C":"#eee"}" onclick="seleccionarPortadaExistente(${e}, ${d})">
        ${l?'<span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>':""}
        <button onclick="eliminarFotoExistente(${e}, this)" style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`}).join(""):a.foto_url&&(n=`<div style="position:relative" data-url="${a.foto_url}" data-es-portada="true" data-file-idx="0">
      <img src="${a.foto_url}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid #E91E8C">
      <span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>
    </div>`);const r=a.imagenes&&a.imagenes[0]||a.foto_url||"",i=r?`<img src="${r}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:36px;height:36px;background:#f0f0f0;border-radius:6px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#ccc;flex-shrink:0">📷</div>';return`
    <div class="variante-item" id="variante-${e}" style="margin-bottom:0.625rem;border-radius:12px;border:1px solid #eee;box-shadow:0 1px 4px rgba(0,0,0,0.05);overflow:hidden">

      <!-- ── Compact header: always visible ── -->
      <div onclick="toggleVariante(${e})"
           style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;background:white;cursor:pointer;user-select:none">
        <div id="v${e}-swatch-header"
             style="width:26px;height:26px;border-radius:50%;background:${a.color_hex||"#cccccc"};border:2px solid #ddd;flex-shrink:0"></div>
        <span id="v${e}-header-label"
              style="font-weight:600;color:#333;font-size:0.9rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${a.color||"Color "+(e+1)}
        </span>
        <div id="v${e}-header-thumb" style="flex-shrink:0">${i}</div>
        ${e===0?'<span style="font-size:0.65rem;background:#E91E8C;color:white;padding:2px 8px;border-radius:100px;font-weight:700;flex-shrink:0">PORTADA</span>':""}
        <span id="v${e}-chevron"
              style="color:#bbb;font-size:0.8rem;flex-shrink:0;transition:transform 0.2s;transform:${o?"rotate(180deg)":"rotate(0deg)"}">▼</span>
        ${e>0?`<button type="button" onclick="event.stopPropagation();eliminarColorVariante(${e},this)"
                style="background:#ffebee;border:1px solid #ffcdd2;color:#c62828;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:0.75rem;font-weight:600;flex-shrink:0;line-height:1">✕</button>`:""}
      </div>

      <!-- ── Expandable body ── -->
      <div id="v${e}-body" style="display:${o?"block":"none"};padding:1rem;background:#fafafa;border-top:1px solid #f0f0f0">

        <!-- Palette -->
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.76rem;font-weight:600;color:#888;display:block;margin-bottom:5px">Paleta rápida</label>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${Se.map(s=>`
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
          <input type="color" id="v${e}-hex" value="${a.color_hex||"#000000"}"
                 style="width:40px;height:40px;border:2px solid #eee;border-radius:8px;cursor:pointer;padding:2px;flex-shrink:0"
                 oninput="var s=document.getElementById('v${e}-swatch-header');if(s)s.style.background=this.value">
          <input class="form-input" id="v${e}-nombre"
                 placeholder="Nombre del color (ej: Negro, Nude, Carey...)"
                 value="${a.color||""}" style="flex:1;min-width:130px"
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
  `}window.eliminarColorVariante=async(e,t)=>{const a=document.getElementById("v"+e+"-nombre"),o=a?a.value:null;if(o&&window._productoEditandoId&&window._coloresExistentes){if(!confirm("Eliminar el color "+o+" y todas sus variantes?"))return;try{const i=(await(await fetch(f+"/variantes/producto/"+window._productoEditandoId)).json()).filter(s=>s.color===o);for(const s of i)await fetch(f+"/variantes/"+s.id+"/eliminar",{method:"POST",headers:{"Content-Type":"application/json"}});window._coloresExistentes=window._coloresExistentes.filter(s=>s.color!==o),window._coloresEliminados||(window._coloresEliminados=[]),window._coloresEliminados.push(o),alert("Color eliminado correctamente")}catch{alert("Error eliminando el color");return}}t.closest(".variante-item").remove(),actualizarTablaStock()};window.eliminarFotoExistente=(e,t)=>{const a=t.parentElement,o=a.dataset.url,n=document.getElementById("v"+e+"-preview");a.remove();const r=document.getElementById("v"+e+"-nombre");if(r&&window._coloresExistentes){const i=r.value,s=window._coloresExistentes.find(d=>d.color===i);s&&(s.imagenes&&(s.imagenes=s.imagenes.filter(d=>d!==o)),s.foto_url===o&&(s.foto_url=s.imagenes&&s.imagenes.length>0?s.imagenes[0]:null))}if(a.dataset.esPortada==="true"&&n){const i=n.querySelector("div[data-url]");if(i){i.dataset.esPortada="true",i.querySelector("img").style.border="2px solid #E91E8C";const s=document.createElement("span");s.className="portada-badge",s.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",s.textContent="PORTADA",i.appendChild(s)}}};window.seleccionarPortadaExistente=(e,t)=>{const a=document.getElementById("v"+e+"-preview");if(!a)return;a.querySelectorAll(".portada-badge").forEach(n=>n.remove()),a.querySelectorAll("img").forEach(n=>n.style.border="3px solid #eee"),a.querySelectorAll("[data-es-portada]").forEach(n=>n.dataset.esPortada="false");const o=a.querySelectorAll("div[data-file-idx]");if(o[t]){o[t].dataset.esPortada="true",o[t].querySelector("img").style.border="3px solid #E91E8C";const n=document.createElement("span");n.className="portada-badge",n.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",n.textContent="PORTADA",o[t].appendChild(n)}};window.mostrarFormProducto=e=>{e||(window._coloresExistentes=null),se=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1;const t=e||{},a=document.getElementById("content");se=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1,e||(window._coloresExistentes=null),a.innerHTML=`
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
            ${Ie.map(o=>`<option value="${o.value}" ${t.categoria===o.value?"selected":""}>${o.label}</option>`).join("")}
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
      ${window._coloresExistentes.map((o,n)=>`
        <div onclick="seleccionarColorPortada(${n})" id="portada-color-${n}"
             style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:2px solid ${n===0?"#2e7d32":"#ddd"};cursor:pointer;background:${n===0?"#e8f5e9":"white"}">
          <div style="width:16px;height:16px;border-radius:50%;background:${o.color_hex};border:1px solid #ddd;flex-shrink:0"></div>
          <span style="font-size:0.82rem;font-weight:500">${o.color}</span>
          ${n===0?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
        </div>
      `).join("")}
    </div>
  </div>
`:""}
<div id="variantes-container">
  ${window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.map((o,n)=>ae(n,o)).join(""):ae(0,null)}
</div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px">
  ${ue.map(o=>`
    <label class="talla-label" style="display:flex;align-items:center;justify-content:center;gap:4px;padding:10px 8px;border-radius:6px;cursor:pointer;border:2px solid ${t.tallas_disponibles&&t.tallas_disponibles.includes(o)?"#E91E8C":"transparent"};background:${t.tallas_disponibles&&t.tallas_disponibles.includes(o)?"#fce4f3":"#f5f5f5"}">
      <input type="checkbox" value="${o}" style="display:none" onchange="toggleTalla(this)" ${t.tallas_disponibles&&t.tallas_disponibles.includes(o)?"checked":""}>
      <span>${o}</span>
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
  `,fetch(f+"/sucursales/").then(o=>o.json()).then(o=>{const n=document.getElementById("f-sucursal-stock");n&&(n.innerHTML=o.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")),setTimeout(()=>actualizarTablaStock(),100)})};window.seleccionarColorPortada=e=>{if(!window._coloresExistentes)return;const t=window._coloresExistentes.splice(e,1)[0];window._coloresExistentes.unshift(t),document.querySelectorAll('[id^="portada-color-"]').forEach((o,n)=>{const r=n===0;o.style.borderColor=r?"#2e7d32":"#ddd",o.style.background=r?"#e8f5e9":"white",o.innerHTML=`
      <div style="width:16px;height:16px;border-radius:50%;background:${window._coloresExistentes[n].color_hex};border:1px solid #ddd;flex-shrink:0"></div>
      <span style="font-size:0.82rem;font-weight:500">${window._coloresExistentes[n].color}</span>
      ${r?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
    `,o.setAttribute("onclick","seleccionarColorPortada("+n+")")});const a=document.getElementById("variantes-container");a&&(a.innerHTML=window._coloresExistentes.map((o,n)=>ae(n,o)).join(""))};const ve=e=>e.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");window.actualizarSKU=async()=>{const e=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",t=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",a=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"",o=document.getElementById("f-sku");if(o&&!o.value&&e&&t&&a)try{const r=await(await fetch(f+"/productos/siguiente-sku/"+t+"/"+encodeURIComponent(a))).json();o.value=r.sku_base}catch{}if(e){const n=document.getElementById("f-slug");n&&!n.value&&(n.value=ve(e));const r=document.getElementById("f-metatitulo");r&&!r.value&&(r.value=e.trim()+" | Zapatillas May")}};window.regenerarSKU=async()=>{const e=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",t=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"";if(e&&t)try{const o=await(await fetch(f+"/productos/siguiente-sku/"+e+"/"+encodeURIComponent(t))).json(),n=document.getElementById("f-sku");n&&(n.value=o.sku_base)}catch{}else alert("Selecciona categoria y escribe el proveedor primero")};function Oe(e,t,a,o,n,r,i){const s=document.getElementById("f-slug"),d=document.getElementById("f-metatitulo"),l=document.getElementById("f-metadesc");s&&!s.value&&(s.value=ve(e)),d&&!d.value&&(d.value=e+" | Zapatillas May");const p=["Compra "+e+" en Zapatillas May."];if(t){const m=t.split(/[.!?\n]/)[0].trim();m.length>10&&p.push(m.slice(0,65)+(m.length>65?"...":""))}else if(a){const m={sandalia:"Sandalia elegante para dama",bota:"Bota de moda para dama",tenis:"Tenis casual para dama",mocasin:"Mocasín cómodo para dama",zapatilla:"Zapatilla de moda para dama",plataforma:"Plataforma cómoda para dama"};p.push((m[a]||a)+".")}o&&p.push("Material "+o+"."),n&&r?p.push("Tacón "+r+" "+n+" cm."):n&&p.push("Tacón "+n+" cm."),i&&p.push("Desde $"+parseInt(i).toLocaleString("es-MX")+" MXN."),p.push("Envío a todo México.");let c=p.join(" ");c.length>160&&(c=c.slice(0,157)+"..."),l&&he(c)}function he(e){const t=document.getElementById("f-metadesc");if(t){t.value=e;const a=document.getElementById("metadesc-counter");a&&(a.textContent=e.length+"/160",a.style.color=e.length>160?"#c62828":e.length>140?"#e65100":"#4caf50")}}window.generarSEO=async()=>{var l,p,c,m,u,g,y,b;const e=(((l=document.getElementById("f-nombre"))==null?void 0:l.value)||"").trim(),t=(((p=document.getElementById("f-descripcion"))==null?void 0:p.value)||"").trim(),a=(((c=document.getElementById("f-categoria"))==null?void 0:c.value)||"").trim(),o=(((m=document.getElementById("f-material"))==null?void 0:m.value)||"").trim(),n=(((u=document.getElementById("f-tacon"))==null?void 0:u.value)||"").trim(),r=(((g=document.getElementById("f-tipotacon"))==null?void 0:g.value)||"").trim(),i=(((y=document.getElementById("f-menudeo"))==null?void 0:y.value)||"").trim(),s=(((b=document.getElementById("f-horma"))==null?void 0:b.value)||"").trim();if(!e&&!t){alert("Escribe el nombre o la descripción del producto primero");return}const d=document.getElementById("btn-generar-seo");d&&(d.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite">⏳</span> Analizando...',d.disabled=!0,d.style.opacity="0.7");try{const v=await(await fetch(f+"/productos/generar-seo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:e,descripcion:t,categoria:a,material:o,tacon:n,tipo_tacon:r,precio:i,horma:s})})).json();if(v.error)throw new Error(v.error);const w=document.getElementById("f-slug"),C=document.getElementById("f-metatitulo");if(w&&v.slug&&(w.value=v.slug),C&&v.meta_titulo&&(C.value=v.meta_titulo),v.meta_descripcion&&he(v.meta_descripcion),v.nombre_producto&&e!==v.nombre_producto){const x=document.getElementById("f-nombre");if(x){let z=document.getElementById("seo-nombre-sugerido");z||(z=document.createElement("div"),z.id="seo-nombre-sugerido",z.style.cssText="margin-top:6px;padding:8px 12px;background:#f3e5f5;border-radius:8px;border:1px solid #ce93d8;font-size:0.78rem;color:#6a1b9a;display:flex;align-items:center;justify-content:space-between;gap:8px",x.parentElement.appendChild(z)),z.dataset.sugerido=v.nombre_producto,z.innerHTML="<span>✨ Nombre sugerido para la tienda: <strong>"+v.nombre_producto+`</strong></span><button onclick="var p=this.closest('#seo-nombre-sugerido');document.getElementById('f-nombre').value=p.dataset.sugerido;p.remove()" style="background:#6a1b9a;color:white;border:none;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:0.75rem;white-space:nowrap">Usar este</button>`}}d&&(d.innerHTML="✅ SEO generado con IA",d.style.background="#e8f5e9",d.style.color="#2e7d32",d.style.borderColor="#a5d6a7",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}catch{Oe(e,t,a,o,n,r,i),d&&(d.innerHTML="✅ SEO generado",d.style.background="#fff8e1",d.style.color="#f57f17",d.style.borderColor="#ffe082",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}};window.seleccionarColor=(e,t,a)=>{const o=document.getElementById("v"+e+"-hex"),n=document.getElementById("v"+e+"-nombre");if(o){o.value=t;const r=document.getElementById("v"+e+"-swatch-header");r&&(r.style.background=t)}if(n){n.value=a;const r=document.getElementById("v"+e+"-header-label");r&&(r.textContent=a)}actualizarTablaStock()};window.toggleVariante=e=>{const t=document.getElementById("v"+e+"-body"),a=document.getElementById("v"+e+"-chevron");if(!t)return;const o=t.style.display!=="none";t.style.display=o?"none":"block",a&&(a.style.transform=o?"rotate(0deg)":"rotate(180deg)")};window.agregarVariante=()=>{document.querySelectorAll(".variante-item").forEach(n=>{const r=n.id&&n.id.match(/^variante-(\d+)$/);if(r){const i=r[1],s=document.getElementById("v"+i+"-body"),d=document.getElementById("v"+i+"-chevron");s&&(s.style.display="none"),d&&(d.style.transform="rotate(0deg)")}});const e=se++,t=document.getElementById("variantes-container"),a=document.createElement("div");a.innerHTML=ae(e,null),t.appendChild(a.firstElementChild);const o=document.getElementById("variante-"+e);o&&setTimeout(()=>o.scrollIntoView({behavior:"smooth",block:"nearest"}),60)};window.previsualizarImagenes=(e,t)=>{const a=document.getElementById("v"+t+"-preview");a&&(a.querySelectorAll("[data-existente]"),Array.from(e.files).forEach((o,n)=>{const r=new FileReader;r.onload=i=>{const s=document.createElement("div");s.style.cssText="position:relative;cursor:pointer",s.dataset.fileIdx=n,s.innerHTML=`
        <img src="${i.target.result}" 
             style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #ddd"
             onclick="seleccionarPortada(${t}, this)">
        <button onclick="this.parentElement.remove()" 
                style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      `,a.appendChild(s),a.querySelectorAll(".portada-badge").length===0&&seleccionarPortada(t,s.querySelector("img"))},r.readAsDataURL(o)}))};window.seleccionarPortada=(e,t)=>{const a=document.getElementById("v"+e+"-preview");if(!a)return;a.querySelectorAll(".portada-badge").forEach(n=>n.remove()),a.querySelectorAll("img").forEach(n=>n.style.border="2px solid #ddd"),t.style.border="2px solid #E91E8C";const o=document.createElement("span");o.className="portada-badge",o.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",o.textContent="PORTADA",t.parentElement.appendChild(o),t.parentElement.dataset.esPortada="true",a.querySelectorAll("[data-es-portada]").forEach(n=>{n!==t.parentElement&&delete n.dataset.esPortada})};window.toggleDescuento=()=>{const e=document.getElementById("f-descuento"),t=document.getElementById("descuento-pct");e&&t&&(t.style.display=e.checked?"flex":"none")};window.toggleTalla=e=>{const t=e.closest(".talla-label");e.checked?(t.style.borderColor="#E91E8C",t.style.background="#fce4f3"):(t.style.borderColor="transparent",t.style.background="#f5f5f5"),actualizarTablaStock()};window.actualizarTablaStock=()=>{const e=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],t=[...document.querySelectorAll(".talla-label input:checked")].map(r=>r.value).sort((r,i)=>e.indexOf(r)-e.indexOf(i)),a=document.querySelectorAll(".variante-item"),o=[];a.forEach(r=>{const i=r.id.replace("variante-",""),s=document.getElementById("v"+i+"-nombre"),d=document.getElementById("v"+i+"-hex");s&&s.value&&o.push({nombre:s.value,hex:d?d.value:"#000",id:i})});const n=document.getElementById("stock-inicial-container");if(n){if(t.length===0||o.length===0){n.innerHTML='<p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>';return}n.innerHTML=o.map(r=>`
    <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
        <div style="width:14px;height:14px;border-radius:50%;background:${r.hex};border:1px solid #ddd;flex-shrink:0"></div>
        <span style="font-size:0.9rem;font-weight:600">${r.nombre}</span>
        <span style="margin-left:auto;font-size:0.82rem;color:#E91E8C;font-weight:700">Total: <span id="total-color-${r.id}">0</span> pares</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
        ${t.map(i=>`
          <div style="display:flex;align-items:center;gap:6px;background:white;padding:6px 8px;border-radius:8px;border:1px solid #eee">
            <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:32px">T${i}</span>
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${r.id}-${i.replace(".","_")}');el.value=Math.max(0,(parseInt(el.value)||0)-1);actualizarTotalColor('${r.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">−</button>
            <input type="number" min="0" placeholder="0"
                   id="stock-ini-${r.id}-${i.replace(".","_")}"
                   oninput="actualizarTotalColor('${r.id}')"
                   style="flex:1;text-align:center;padding:5px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:700;min-width:0">
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${r.id}-${i.replace(".","_")}');el.value=(parseInt(el.value)||0)+1;actualizarTotalColor('${r.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">+</button>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}};window.actualizarTotalColor=e=>{const t=document.querySelectorAll('[id^="stock-ini-'+e+'-"]');let a=0;t.forEach(n=>a+=parseInt(n.value)||0);const o=document.getElementById("total-color-"+e);o&&(o.textContent=a)};async function De(){const e=document.querySelectorAll(".variante-item"),t=[];for(const a of e){const o=a.id.replace("variante-",""),n=document.getElementById("v"+o+"-hex"),r=document.getElementById("v"+o+"-nombre"),i=document.getElementById("v"+o+"-imgs"),s=document.getElementById("v"+o+"-preview");if(!r||!r.value)continue;const d=[];if(s){const l=s.querySelector('[data-es-portada="true"]'),p=l?l.dataset.url:null;p&&d.push(p),s.querySelectorAll("div[data-url]").forEach(c=>{const m=c.dataset.url;m&&!d.includes(m)&&d.push(m)})}if(i&&i.files.length>0){const l=s?s.querySelector('[data-es-portada="true"]'):null,p=l?parseInt(l.dataset.fileIdx??"0"):0,c=Array.from(i.files);console.log(`[Fotos] Color "${r.value}": subiendo ${c.length} foto(s) en paralelo`);const m=async(b,h)=>{for(let v=1;v<=3;v++){const w=new FormData;w.append("archivo",b);try{const C=await fetch(f+"/imagenes/subir",{method:"POST",body:w});if(!C.ok){v<3&&await new Promise(z=>setTimeout(z,1200));continue}const x=await C.json();if(x.url)return{fi:h,url:x.url}}catch{v<3&&await new Promise(x=>setTimeout(x,1200))}}return console.error(`[Fotos] FALLÓ foto ${h+1} de "${r.value}" tras 3 intentos`),{fi:h,url:null}},u=await Promise.all(c.map((b,h)=>m(b,h))),g=u.find(b=>b.fi===p);g!=null&&g.url&&d.push(g.url);for(const b of u)b.fi!==p&&b.url&&d.push(b.url);const y=u.filter(b=>!b.url).length;y>0&&alert(`⚠️ ${y} foto(s) de "${r.value}" no se pudieron subir. Intenta de nuevo.`),console.log(`[Fotos] Color "${r.value}": ${d.length} URL(s) listas`)}t.push({color:r.value,color_hex:n?n.value:"#000000",imagenes:d})}return t}window.previsualizarVideoPanel=e=>{const t=document.getElementById("video-preview-panel");if(t){if(!e||!e.trim()){t.innerHTML="";return}t.innerHTML=`<div style="font-size:0.8rem;color:#555;background:#f5f5f5;border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px"><span>🎬</span><a href="${e}" target="_blank" rel="noopener" style="color:#E91E8C;word-break:break-all;flex:1">${e}</a></div>`}};window.subirVideoProducto=async e=>{const t=e.files[0];if(!t)return;const a=document.getElementById("f-video-url"),o=document.getElementById("video-preview-panel");o&&(o.innerHTML='<div style="color:#888;font-size:0.82rem;padding:8px 0">Subiendo video... ⏳ (puede tardar unos segundos)</div>');try{const n=new FormData;n.append("archivo",t);const i=await(await fetch(f+"/imagenes/videos/subir",{method:"POST",body:n})).json();i.url?(a&&(a.value=i.url),window.previsualizarVideoPanel(i.url)):o&&(o.innerHTML='<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error al subir. Intenta pegar el URL manualmente.</div>')}catch{o&&(o.innerHTML='<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error de red. Intenta pegar el URL manualmente.</div>')}e.value=""};window.guardarProducto=async()=>{if(window._guardandoProducto)return;window._guardandoProducto=!0;const e=document.getElementById("f-producto-id")?document.getElementById("f-producto-id").value:"";e&&(window._productoEditandoId=e);const t=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",a=document.getElementById("f-costo")?document.getElementById("f-costo").value:"",o=document.getElementById("f-menudeo")?document.getElementById("f-menudeo").value:"",n=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"";if(!t||!a||!o||!n){alert("Por favor completa los campos obligatorios: Nombre, Categoria, Costo y Precio menudeo");return}const r=document.getElementById("btn-guardar");r&&(r.textContent="Guardando...",r.disabled=!0);const i=[...document.querySelectorAll(".talla-label input:checked")].map(m=>m.value);console.log(`[Guardar] Tallas seleccionadas (${i.length}):`,i);const s=await De();console.log(`[Guardar] Colores a guardar (${s.length}):`,s.map(m=>m.color));const d=[];document.querySelectorAll(".variante-item").forEach(m=>{const u=m.id.replace("variante-",""),g=document.getElementById("v"+u+"-nombre"),y=document.getElementById("v"+u+"-hex");g&&g.value&&d.push({id:u,nombre:g.value,hex:y?y.value:"#000"})});const l=document.getElementById("f-peso")?document.getElementById("f-peso").value:"",p=l?Math.round(parseFloat(l)*1e3):null,c={nombre:t,sku_interno:document.getElementById("f-sku")&&document.getElementById("f-sku").value||null,marca:document.getElementById("f-marca")&&document.getElementById("f-marca").value||null,proveedor:document.getElementById("f-proveedor")&&document.getElementById("f-proveedor").value||null,categoria:n,subcategoria:document.getElementById("f-subcategoria")&&document.getElementById("f-subcategoria").value||null,descripcion:document.getElementById("f-descripcion")&&document.getElementById("f-descripcion").value||null,material:document.getElementById("f-material")&&document.getElementById("f-material").value||null,material_suela:document.getElementById("f-suela")&&document.getElementById("f-suela").value||null,forro:document.getElementById("f-forro")&&document.getElementById("f-forro").value||null,horma:document.getElementById("f-horma")&&document.getElementById("f-horma").value||null,altura_tacon:document.getElementById("f-tacon")&&document.getElementById("f-tacon").value?parseFloat(document.getElementById("f-tacon").value):null,tipo_tacon:document.getElementById("f-tipotacon")&&document.getElementById("f-tipotacon").value||null,costo:parseFloat(a),precio_menudeo:parseFloat(o),precio_mayoreo3:document.getElementById("f-mayoreo3")&&document.getElementById("f-mayoreo3").value?parseFloat(document.getElementById("f-mayoreo3").value):null,precio_mayoreo6:document.getElementById("f-mayoreo6")&&document.getElementById("f-mayoreo6").value?parseFloat(document.getElementById("f-mayoreo6").value):null,precio_corrida:document.getElementById("f-corrida")&&document.getElementById("f-corrida").value?parseFloat(document.getElementById("f-corrida").value):null,precio_antes:document.getElementById("f-antes")&&document.getElementById("f-antes").value?parseFloat(document.getElementById("f-antes").value):null,tiene_descuento:document.getElementById("f-descuento")?document.getElementById("f-descuento").checked:!1,porcentaje_descuento:document.getElementById("f-pct")&&document.getElementById("f-pct").value?parseInt(document.getElementById("f-pct").value):0,corrida_activa:document.getElementById("f-corrida-activa")?document.getElementById("f-corrida-activa").checked:!1,es_oferta:document.getElementById("f-oferta")?document.getElementById("f-oferta").checked:!1,tallas_disponibles:i,peso_gramos:p,slug:document.getElementById("f-slug")&&document.getElementById("f-slug").value?document.getElementById("f-slug").value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):null,meta_titulo:document.getElementById("f-metatitulo")&&document.getElementById("f-metatitulo").value||null,meta_descripcion:document.getElementById("f-metadesc")&&document.getElementById("f-metadesc").value||null,imagen_principal:(()=>{const m=document.getElementById("v0-preview"),u=m?m.querySelector('[data-es-portada="true"]'):null;return u&&u.dataset.url?u.dataset.url:s.length>0&&s[0].imagenes.length>0?s[0].imagenes[0]:null})(),video_url:document.getElementById("f-video-url")&&document.getElementById("f-video-url").value.trim()||null,activo:!0,nuevo:!window._productoEditandoId};try{console.log("Editando ID:",window._productoEditandoId);const m=window._productoEditandoId?"PATCH":"POST",u=window._productoEditandoId?f+"/productos/"+window._productoEditandoId:f+"/productos/",g=await fetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(g.ok){const y=await g.json(),b=window._productoEditandoId||(y&&y.length>0?y[0].id:null);if(b||console.error("[Variantes] ERROR: pid es null, no se crearán variantes"),s.length===0&&console.error("[Variantes] ERROR: variantesData vacío, no se crearán variantes (¿colores sin nombre?)"),b&&s.length>0){const _=i.length>0?i:["Unica"];console.log(`[Variantes] pid=${b} | colores=${s.length} | tallas=${_.length}:`,_);let $=[];window._productoEditandoId&&($=await(await fetch(f+"/variantes/producto/"+b)).json(),console.log(`[Variantes] Existentes en DB: ${$.length}`),window._coloresEliminados&&window._coloresEliminados.length>0&&($=$.filter(I=>!window._coloresEliminados.includes(I.color))));const T=[],M=[];for(const S of s)for(const I of _){const A=$.find(E=>E.color.trim().toLowerCase()===S.color.trim().toLowerCase()&&E.talla===I);if(A){const E=S.imagenes.length>0?S.imagenes[0]:null,k=JSON.stringify(S.imagenes),j=A.foto_url===E,P=JSON.stringify(A.imagenes||[])===k,D=A.color_hex===S.color_hex;if(j&&P&&D)console.log(`[Variantes] SIN CAMBIOS: ${S.color} T${I} — omitiendo PATCH`);else{console.log(`[Variantes] ACTUALIZAR: ${S.color} T${I} → ${A.id}`);const F={color_hex:S.color_hex,foto_url:E,imagenes:S.imagenes};T.push(fetch(f+"/variantes/"+A.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(F)}))}}else console.log(`[Variantes] CREAR NUEVO: ${S.color} T${I}`),T.push(fetch(f+"/variantes/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({producto_id:b,color:S.color,color_hex:S.color_hex,talla:I,foto_url:S.imagenes[0]||null,imagenes:S.imagenes||[],activa:!0})}).then(async E=>{if(!E.ok){const k=await E.text().catch(()=>"");M.push(`${S.color} T${I}: ${E.status}`),console.error("Error variante:",S.color,I,E.status,k)}}).catch(E=>{M.push(`${S.color} T${I}: error de red`),console.error("Error red variante:",S.color,I,E)}))}await Promise.all(T),M.length>0&&(console.warn("Variantes con error:",M),alert(`⚠️ Algunas variantes no se guardaron:
`+M.join(`
`)+`

Revisa la consola para más detalles.`))}console.log("Colores:",d),console.log("Tallas:",i);const h=document.getElementById("f-sucursal-stock")?document.getElementById("f-sucursal-stock").value:"",v=d.some(_=>(i.length>0?i:["Unica"]).some($=>{const T=document.getElementById("stock-ini-"+_.id+"-"+$.replace(".","_"));return T&&parseInt(T.value)>0}));let w=0,C=[],x=[];if(v&&!h)alert(`⚠️ Capturaste cantidades de stock pero no hay sucursal seleccionada.
El producto se guardó, pero el inventario NO se guardó.

Ve a Inventario → Reabastecer para agregar las cantidades.`);else if(h&&b){const _=i.length>0?i:["Unica"];await new Promise(I=>setTimeout(I,800));let $=[];const T=s.length*_.length;for(let I=0;I<3&&($=await fetch(f+"/variantes/producto/"+b).then(A=>A.json()),!($.length>=T));I++)await new Promise(A=>setTimeout(A,600));const M=await fetch(f+"/inventario/").then(I=>I.json()),S=new Set(M.filter(I=>I.sucursal_id===h).map(I=>I.variante_id));for(const I of $){const A=d.find(P=>P.nombre.trim().toLowerCase()===(I.color||"").trim().toLowerCase());if(!A)continue;const E=String(I.talla||"").replace(".","_"),k=document.getElementById("stock-ini-"+A.id+"-"+E),j=k&&parseInt(k.value)||0;if(j>0){const P=await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:I.id,sucursal_id:h,cantidad:j,motivo:window._productoEditandoId?"Resurtido desde edicion de producto":"Stock inicial"})});if(P.ok)w++,console.log(`[Stock] ✓ ${I.color} T${I.talla} +${j}`);else{const D=await P.text();console.error(`[Stock] Error ${I.color} T${I.talla}:`,D),C.push(`${I.color} T${I.talla}`)}}else S.has(I.id)||(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:I.id,sucursal_id:h,cantidad:0,motivo:"Registro inicial (sin stock)"})}),console.log(`[Stock] Registro 0 creado: ${I.color} T${I.talla}`))}}if(y&&y.error){alert("Error: "+y.error),r&&(r.textContent="Guardar producto",r.disabled=!1),window._guardandoProducto=!1;return}let z="Producto guardado correctamente";w>0&&(z+=`
✅ Stock guardado: ${w} variante(s)`),x.length>0&&(z+=`
⚠️ No se encontraron variantes para: ${x.join(", ")}`),C.length>0&&(z+=`
❌ Errores al guardar: ${C.join(", ")}`),alert(z),window._productoEditandoId=null,window._guardandoProducto=!1,navegarA("productos")}else{const y=await g.text();alert("Error al guardar: "+y),r&&(r.textContent="Guardar producto",r.disabled=!1),window._guardandoProducto=!1}window._coloresEliminados=[]}catch{alert("Error conectando con el servidor"),r&&(r.textContent="Guardar producto",r.disabled=!1),window._guardandoProducto=!1}};window.editarProducto=async e=>{window._coloresEliminados=[],window._coloresExistentes=null,window._productoEditandoId=null;try{const[t,a]=await Promise.all([fetch(f+"/productos/"+e),fetch(f+"/variantes/producto/"+e)]),o=await t.json(),n=await a.json();if(!o||o.length===0){alert("Producto no encontrado");return}const r=[],i=new Set;n.filter(l=>l.producto_id===e).forEach(l=>{i.has(l.color)||(i.add(l.color),r.push({color:l.color,color_hex:l.color_hex,foto_url:l.foto_url,imagenes:l.imagenes||[]}))}),window._productoEditandoId=e,window._coloresExistentes=r.length>0?r:null;const s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=[...new Set(n.filter(l=>l.producto_id===e).map(l=>l.talla))].filter(Boolean);d.sort((l,p)=>s.indexOf(l)-s.indexOf(p)),d.length>0?(o[0].tallas_disponibles=d,console.log("[Editar] Tallas cargadas desde variantes:",d)):o[0].tallas_disponibles&&Array.isArray(o[0].tallas_disponibles)&&(o[0].tallas_disponibles=o[0].tallas_disponibles.map(String),console.log("[Editar] Tallas cargadas desde producto:",o[0].tallas_disponibles)),mostrarFormProducto(o[0])}catch{alert("Error cargando el producto")}};window.duplicarProducto=async e=>{try{const a=await(await fetch(f+"/productos/"+e)).json();if(a&&a.length>0){const o=Object.assign({},a[0]);delete o.id,delete o.created_at,delete o.updated_at,o.nombre=o.nombre+" (copia)",o.slug=o.slug?o.slug+"-copia":null,o.sku_interno=null,window._productoEditandoId=null,mostrarFormProducto(o)}}catch{alert("Error duplicando el producto")}};window.cargarProductosFiltro=e=>ne(e,!1);window.filtrarProductos=()=>{const e=document.getElementById("prod-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(a=>{const o=a.textContent.toLowerCase();a.style.display=o.includes(e)?"":"none"})};window.toggleProducto=async(e,t)=>{const a=t?"desactivar":"activar";if(confirm(t?"Desactivar este producto?":"Activar este producto?"))try{(await fetch(f+"/productos/"+e+"/"+a,{method:"PATCH",headers:{"Content-Type":"application/json"}})).ok?ne():alert("Error al cambiar el estado")}catch{alert("Error conectando con el servidor")}};window.filtrarClientes=()=>{var r,i;const e=(((r=document.getElementById("cli-buscar"))==null?void 0:r.value)||"").toLowerCase().trim(),t=((i=document.getElementById("cli-tipo"))==null?void 0:i.value)||"",a=document.querySelectorAll(".cli-item");let o=0;a.forEach(s=>{const d=(s.dataset.nombre||"").toLowerCase(),l=s.dataset.tel||"",p=s.dataset.tipo||"",u=(!e||d.includes(e)||l.includes(e))&&(!t||p===t);s.style.display=u?"":"none",u&&o++});const n=document.getElementById("cli-count");n&&(n.textContent=o)};window.mostrarFormCliente=async e=>{const t=document.getElementById("content");let a={};if(e)try{const n=await(await fetch(f+"/clientes/"+e)).json();n&&n.length>0&&(a=n[0])}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
        <h3>${e?"Editar cliente":"Nuevo cliente"}</h3>
${a.telefono?'<a href="https://wa.me/'+(a.lada||"52")+a.telefono.replace(/\D/g,"")+'" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366;margin-left:auto">WhatsApp</a>':""}      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Nombre completo *</label>
          <input class="form-input" id="cli-nombre" placeholder="Nombre del cliente" value="${a.nombre||""}">
        </div>
        <div>
          <label class="form-label">Telefono (WhatsApp)</label>
        <div style="display:flex;gap:8px">
        <select class="form-input" id="cli-lada" style="max-width:120px">
            <option value="52" ${(a.lada||"52")==="52"?"selected":""}>­🇲🇽 +52</option>
            <option value="1" ${a.lada==="1"?"selected":""}>­🇺🇸 +1</option>
            <option value="1" ${a.lada==="1CA"?"selected":""}>­🇨🇦 +1</option>
            <option value="34" ${a.lada==="34"?"selected":""}>🇪🇸 +34</option>
            <option value="57" ${a.lada==="57"?"selected":""}>­🇨🇴 +57</option>
            <option value="54" ${a.lada==="54"?"selected":""}>­🇦🇷 +54</option>
            </select>
            <input class="form-input" id="cli-telefono" placeholder="Ej: 4771234567" value="${a.telefono||""}">
        </div>
          <label class="form-label">Email</label>
          <input class="form-input" id="cli-email" type="email" placeholder="correo@ejemplo.com" value="${a.email||""}">
        </div>
        <div>
          <label class="form-label">Tipo de cliente *</label>
          <select class="form-input" id="cli-tipo">
            <option value="menudeo" ${a.tipo==="menudeo"?"selected":""}>Menudeo</option>
            <option value="mayoreo" ${a.tipo==="mayoreo"?"selected":""}>Mayoreo variado</option>
            <option value="zapateria" ${a.tipo==="zapateria"?"selected":""}>Corridas</option>
          </select>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Direccion de entrega</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="grid-column:1/-1">
            <label class="form-label">Calle y numero</label>
            <input class="form-input" id="cli-direccion" placeholder="Ej: Calle Juarez 123 Col. Centro" value="${a.direccion||""}">
          </div>
          <div>
            <label class="form-label">Ciudad</label>
            <input class="form-input" id="cli-ciudad" placeholder="Ej: Leon" value="${a.ciudad||""}">
          </div>
          <div>
            <label class="form-label">Estado</label>
            <input class="form-input" id="cli-estado" placeholder="Ej: Guanajuato" value="${a.estado||""}">
          </div>
          <div>
            <label class="form-label">Codigo postal</label>
            <input class="form-input" id="cli-cp" placeholder="Ej: 37000" value="${a.codigo_postal||""}">
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Credito</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Limite de credito ($)</label>
            <input class="form-input" id="cli-credito" type="number" step="0.01" placeholder="0.00" value="${a.limite_credito||"0"}">
          </div>
          <div>
            <label class="form-label">Dias de credito</label>
            <select class="form-input" id="cli-dias">
              <option value="0" ${a.dias_credito===0?"selected":""}>Sin credito</option>
              <option value="15" ${a.dias_credito===15?"selected":""}>15 dias</option>
              <option value="30" ${a.dias_credito===30?"selected":""}>30 dias</option>
              <option value="60" ${a.dias_credito===60?"selected":""}>60 dias</option>
            </select>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Comentarios internos</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:0.75rem">Solo visibles para el equipo, el cliente no los ve.</p>
        <textarea class="form-input" id="cli-comentarios" rows="3" placeholder="Ej: Cliente puntual, prefiere envio por Fedex, no le gusta el color cafe...">${a.comentarios_internos||""}</textarea>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">Cancelar</button>
        <button class="btn btn-primary" id="btn-cli-guardar" onclick="guardarCliente('${e||""}')">Guardar cliente</button>
      </div>
    </div>
  `};window.guardarCliente=async e=>{const t=document.getElementById("cli-nombre").value;if(!t){alert("El nombre del cliente es obligatorio");return}const a=document.getElementById("btn-cli-guardar");a&&(a.textContent="Guardando...",a.disabled=!0);const o={nombre:t,telefono:document.getElementById("cli-telefono").value||null,email:document.getElementById("cli-email").value||null,tipo:document.getElementById("cli-tipo").value,direccion:document.getElementById("cli-direccion").value||null,lada:document.getElementById("cli-lada").value||"52",ciudad:document.getElementById("cli-ciudad").value||null,estado:document.getElementById("cli-estado").value||null,codigo_postal:document.getElementById("cli-cp").value||null,limite_credito:parseFloat(document.getElementById("cli-credito").value)||0,dias_credito:parseInt(document.getElementById("cli-dias").value)||0,comentarios_internos:document.getElementById("cli-comentarios").value||null,activo:!0};try{const n=e?"PATCH":"POST",r=e?f+"/clientes/"+e:f+"/clientes/",i=await fetch(r,{method:n,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(i.ok)alert("Cliente guardado correctamente"),navegarA("clientes");else{const s=await i.text();alert("Error al guardar: "+s),a&&(a.textContent="Guardar cliente",a.disabled=!1)}}catch{alert("Error conectando con el servidor"),a&&(a.textContent="Guardar cliente",a.disabled=!1)}};window.verCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[a,o]=await Promise.all([fetch(f+"/clientes/"+e),fetch(f+"/pedidos/")]),n=await a.json(),r=await o.json();if(!n||n.length===0){alert("Cliente no encontrado");return}const i=n[0],s=r.filter(g=>g.cliente_id===e),d=s.filter(g=>g.status==="confirmado"||g.status==="pagado"),l=d.reduce((g,y)=>g+parseFloat(y.total||0),0),p=d.length>0?l/d.length:0,c=s.length>0?new Date(s[0].created_at):null,m=c?Math.floor((new Date-c)/(1e3*60*60*24)):null,u={};d.forEach(g=>{const y=new Date(g.created_at).toLocaleDateString("es-MX",{month:"short",year:"2-digit"});u[y]=(u[y]||0)+parseFloat(g.total||0)}),t.innerHTML=`
      <div style="max-width:900px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <div style="flex:1">
            <h2 style="font-size:1.3rem;font-weight:700">${i.nombre}</h2>
            <p style="font-size:0.82rem;color:#888">${i.tipo==="mayoreo"?"Mayoreo variado":i.tipo==="zapateria"?"Corridas":"Menudeo"} · Cliente desde ${i.created_at?new Date(i.created_at).toLocaleDateString("es-MX"):"—"}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${i.telefono?`<a href="https://wa.me/${i.lada||"52"}${i.telefono.replace(/\D/g,"")}" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">💬 WhatsApp</a>`:""}
            <button class="btn btn-secondary" onclick="mostrarFormCliente('${i.id}')">✏️ Editar</button>
            <button class="btn btn-primary" onclick="nuevoPedidoCliente('${i.id}', '${i.nombre}')">+ Nuevo pedido</button>
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
            <p style="font-size:1.6rem;font-weight:700;color:#333">$${p.toFixed(0)}</p>
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
                <span style="font-size:0.85rem;font-weight:600">${i.telefono||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Email</span>
                <span style="font-size:0.85rem;font-weight:600">${i.email||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Ciudad</span>
                <span style="font-size:0.85rem;font-weight:600">${i.ciudad||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Dirección</span>
                <span style="font-size:0.85rem;font-weight:600;text-align:right;max-width:180px">${i.direccion||"—"}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Crédito</span>
                <span style="font-size:0.85rem;font-weight:600">${i.limite_credito>0?"$"+i.limite_credito+" / "+i.dias_credito+" días":"Sin crédito"}</span>
              </div>
            </div>
          </div>

          <!-- NOTAS -->
          <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee">
            <p style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;color:#333">Notas internas</p>
            <textarea id="cli-notas-${i.id}" rows="5" placeholder="Escribe notas sobre este cliente..."
                      style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none;outline:none"
                      onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#eee'">${i.comentarios_internos||""}</textarea>
            <button onclick="guardarNotasCliente('${i.id}')" class="btn btn-secondary" style="width:100%;margin-top:8px;font-size:0.82rem">
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
          ${s.length===0?'<div style="text-align:center;padding:2rem;color:#888">Sin pedidos registrados</div>':s.map(g=>{const y={confirmado:"#2e7d32",pagado:"#2e7d32",pendiente_pago:"#f57f17",cancelado:"#c62828",borrador:"#f57f17"}[g.status]||"#888",b={confirmado:"#e8f5e9",pagado:"#e8f5e9",pendiente_pago:"#fff8e1",cancelado:"#ffebee",borrador:"#fff8e1"}[g.status]||"#f5f5f5";return`
                <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer" onclick="verPedido('${g.id}')"
                     onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <span style="font-family:monospace;font-size:0.78rem;color:#888">#${g.id.substring(0,8).toUpperCase()}</span>
                      <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${b};color:${y}">${g.status}</span>
                    </div>
                    <p style="font-size:0.78rem;color:#888">${new Date(g.created_at).toLocaleDateString("es-MX")} · ${g.canal||"—"} · ${g.forma_pago||"—"}</p>
                  </div>
                  <p style="font-weight:700;color:#E91E8C;font-size:1rem">$${g.total||"0"}</p>
                </div>
              `}).join("")}
        </div>
      </div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando cliente</p>'}};window.guardarNotasCliente=async e=>{var a;const t=((a=document.getElementById("cli-notas-"+e))==null?void 0:a.value)||"";try{await fetch(f+"/clientes/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({comentarios_internos:t})});const o=document.querySelector(`button[onclick="guardarNotasCliente('${e}')"]`);o&&(o.textContent="✅ Guardado",setTimeout(()=>o.textContent="💾 Guardar notas",2e3))}catch{alert("Error guardando notas")}};window.editarCliente=e=>{mostrarFormCliente(e)};window.nuevoPedidoCliente=async(e,t)=>{await we(),setTimeout(()=>{const a=document.getElementById("pos-cliente-buscar"),o=document.getElementById("pos-cliente"),n=document.getElementById("pos-cliente-seleccionado");a&&(a.value=""),o&&(o.value=e),n&&(n.textContent="✔ "+t+" — toca para cambiar",n.style.display="block");const r=document.getElementById("topbar-title");r&&(r.textContent="Punto de venta")},300)};window.verHistorialCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando historial...</p>';try{const n=(await(await fetch(f+"/pedidos/")).json()).filter(s=>s.cliente_id===e),r=n.length>0&&n[0].clientes?n[0].clientes:{},i=n.filter(s=>s.status==="confirmado"||s.status==="pagado").reduce((s,d)=>s+parseFloat(d.total||0),0);t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <h3 style="flex:1">Historial — ${r.nombre||"Cliente"}</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total pedidos</p>
            <p style="font-weight:700;font-size:1.2rem">${n.length}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total gastado</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${i.toFixed(2)}</p>
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
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando historial</p>'}};window.mostrarEntrada=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
            ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
         ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarEntrada=async()=>{const e=document.getElementById("ent").value,t=document.getElementById("ent-sucursal").value,a=document.getElementById("ent-cantidad").value,o=document.getElementById("ent-motivo").value;if(!e||!t||!a){alert("Por favor completa todos los campos");return}try{const r=await(await fetch(f+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(a),motivo:o})})).json();r.ok?(alert("Entrada guardada. Anterior: "+r.cantidad_anterior+" pares ÔåÆ Nuevo: "+r.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(r))}catch{alert("Error conectando con el servidor")}};window.mostrarSalida=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
            ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
       ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarSalida=async()=>{const e=document.getElementById("sal").value,t=document.getElementById("sal-sucursal").value,a=document.getElementById("sal-cantidad").value,o=document.getElementById("sal-motivo").value;if(!e||!t||!a){alert("Por favor completa todos los campos");return}try{const r=await(await fetch(f+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:-parseInt(a),motivo:o})})).json();r.ok?(alert("Salida registrada. Anterior: "+r.cantidad_anterior+" pares ÔåÆ Nuevo: "+r.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(r))}catch{alert("Error conectando con el servidor")}};window.mostrarInventarioMasivo=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const a=await(await fetch(f+"/sucursales/")).json(),n=await(await fetch(f+"/productos/")).json(),i=await(await fetch(f+"/variantes/")).json(),d=await(await fetch(f+"/inventario/")).json(),l=[...new Set(n.map(c=>c.categoria).filter(Boolean))],p=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._invMasivo={sucursales:a,productos:n,variantes:i,inventario:d},e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Inventario masivo</h3>
      </div>
      <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee;margin-bottom:1rem">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:1rem;align-items:end">
          <div>
            <label class="form-label">Sucursal *</label>
            <select class="form-input" id="im-sucursal" onchange="renderTablasMasivo()">
              ${a.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="form-label">Categoria</label>
            <select class="form-input" id="im-categoria" onchange="renderTablasMasivo()">
              <option value="">Todas las categorias</option>
              ${l.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join("")}
            </select>
          </div>
          <button class="btn btn-primary" onclick="guardarInventarioMasivo()" style="white-space:nowrap">Guardar todo</button>
        </div>
        <p style="font-size:0.8rem;color:#888;margin-top:0.75rem">Los campos muestran el inventario actual. Modifica solo lo que cambio y guarda al final.</p>
      </div>
      <div id="im-tablas"></div>
    `,renderTablasMasivo()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando inventario</p>'}};window.renderTablasMasivo=()=>{const{productos:e,variantes:t,inventario:a}=window._invMasivo,o=document.getElementById("im-sucursal").value,n=document.getElementById("im-categoria").value,r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],i=e.filter(p=>!(n&&p.categoria!==n)),s=a.filter(p=>p.sucursal_id===o),d=i.map(p=>{const c=t.filter(g=>g.producto_id===p.id);if(c.length===0)return"";const u=[...new Set(c.map(g=>g.color).filter(Boolean))].map(g=>{const y=c.filter(h=>h.color===g).sort((h,v)=>r.indexOf(h.talla)-r.indexOf(v.talla));return`
        <div style="margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:14px;height:14px;border-radius:50%;background:${y[0]?y[0].color_hex:"#888"};border:1px solid #ddd;flex-shrink:0"></div>
            <span style="font-size:0.85rem;font-weight:500;color:#444">${g}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${y.map(h=>{const v=s.find(z=>z.variante_id===h.id),w=v?v.cantidad:0,C=v?v.stock_minimo:3;let x="#ddd";return w===0?x="#ffcdd2":w<=C?x="#ffe082":x="#a5d6a7",`
                <div style="text-align:center">
                  <div style="font-size:0.72rem;color:#888;margin-bottom:4px;font-weight:500">${h.talla}</div>
                  <input type="number" min="0"
                         id="im-${h.id}"
                         value="${w}"
                         data-variante="${h.id}"
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
            <span style="font-weight:600;font-size:1rem">${p.nombre}</span>
            <span style="margin-left:8px;font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${p.sku_interno||"—"}</span>
          </div>
        </div>
        ${u}
      </div>
    `}).join(""),l=document.getElementById("im-tablas");l&&(l.innerHTML=d||'<div style="padding:2rem;text-align:center;color:#888">No hay productos en esta categoria</div>')};window.guardarInventarioMasivo=async()=>{const e=document.getElementById("im-sucursal").value,t=document.querySelectorAll("[data-variante]");let a=0,o=0,n=0;const r=document.querySelector('[onclick="guardarInventarioMasivo()"]');r&&(r.textContent="Guardando...",r.disabled=!0);for(const i of t){const s=i.dataset.variante,d=parseInt(i.dataset.anterior)||0,l=parseInt(i.value)||0;if(l===d){n++;continue}try{(await(await fetch(f+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:s,sucursal_id:e,cantidad:l,motivo:"Inventario masivo"})})).json()).ok?(a++,i.dataset.anterior=l,i.style.borderColor="#a5d6a7"):(o++,i.style.borderColor="#ffcdd2")}catch{o++}}r&&(r.textContent="Guardar todo",r.disabled=!1),o>0?alert(`Guardados: ${a}, Errores: ${o}, Sin cambios: ${n}`):alert(`Inventario actualizado. ${a} cambios guardados, ${n} sin cambios.`)};window.mostrarFormSucursal=async e=>{const t=document.getElementById("content");let a={};if(e)try{a=(await(await fetch(f+"/sucursales/")).json()).find(r=>r.id===e)||{}}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">← Volver</button>
        <h3>${e?"Editar sucursal":"Nueva sucursal"}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Nombre *</label>
          <input class="form-input" id="suc-nombre" placeholder="Ej: Leon Matriz" value="${a.nombre||""}">
        </div>
        <div>
          <label class="form-label">Tipo</label>
          <select class="form-input" id="suc-tipo">
            <option value="fisica" ${a.tipo==="fisica"?"selected":""}>Fisica</option>
            <option value="online" ${a.tipo==="online"?"selected":""}>Online</option>
            <option value="bodega" ${a.tipo==="bodega"?"selected":""}>Bodega</option>
          </select>
        </div>
        <div>
          <label class="form-label">Direccion</label>
          <input class="form-input" id="suc-direccion" placeholder="Calle y numero" value="${a.direccion||""}">
        </div>
        <div>
          <label class="form-label">Telefono</label>
          <input class="form-input" id="suc-telefono" placeholder="Ej: 4771234567" value="${a.telefono||""}">
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarSucursal('${e||""}')">Guardar</button>
      </div>
    </div>
  `};window.guardarSucursal=async e=>{const t=document.getElementById("suc-nombre").value;if(!t){alert("El nombre es obligatorio");return}const a={nombre:t,tipo:document.getElementById("suc-tipo").value,direccion:document.getElementById("suc-direccion").value||null,telefono:document.getElementById("suc-telefono").value||null};try{const o=e?"PATCH":"POST",n=e?f+"/sucursales/"+e:f+"/sucursales/";(await fetch(n,{method:o,headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).ok?(alert("Sucursal guardada"),navegarA("sucursales")):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};window.toggleSucursalDestino=(e,t)=>{const a=document.getElementById(e+"-sucursal-destino-container");a&&(a.style.display=t==="Traspaso entre sucursales"?"block":"none")};window.mostrarTraspaso=async()=>{const t=await(await fetch(f+"/sucursales/")).json(),o=await(await fetch(f+"/variantes/")).json();window._variantesCache=o;const n=document.getElementById("content");n.innerHTML=`
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
              ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
            </select>
          </div>
          <div style="background:#e8f5e9;border-radius:8px;padding:1rem;border:1px solid #a5d6a7">
            <label class="form-label" style="color:#2e7d32">Sucursal destino (llega aqui)</label>
            <select class="form-input" id="tra-destino">
              ${t.map(r=>`<option value="${r.id}">${r.nombre}</option>`).join("")}
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
  `};window.guardarTraspaso=async()=>{const e=document.getElementById("tra").value,t=document.getElementById("tra-origen").value,a=document.getElementById("tra-destino").value,o=document.getElementById("tra-cantidad").value;if(!e||!t||!a||!o){alert("Por favor completa todos los campos");return}if(t===a){alert("La sucursal origen y destino no pueden ser la misma");return}try{const r=await(await fetch(f+"/movimientos/traspaso",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_origen_id:t,sucursal_destino_id:a,cantidad:parseInt(o)})})).json();r.ok?(alert("Traspaso realizado correctamente. Se movieron "+r.cantidad_movida+" pares."),navegarA("inventario")):alert("Error: "+(r.error||JSON.stringify(r)))}catch{alert("Error conectando con el servidor")}};async function xe(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/pedidos/")).json();e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input class="form-input" id="ped-buscar" placeholder="🔍 Buscar por # pedido o cliente..." 
               style="max-width:280px" oninput="filtrarPedidos()">
        <button class="btn btn-primary" onclick="cargarPedidosFiltro('')">Todos (${a.length})</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('sucursal')">Sucursal</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('whatsapp')">WhatsApp</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('online')">Online</button>
        <button class="btn btn-secondary" style="background:#fff8e1;border-color:#f57f17;color:#f57f17" onclick="cargarPedidosFiltro('pendiente_pago')">Pendientes SPEI</button>
        <button class="btn btn-secondary" style="background:#e8f5e9;border-color:#2e7d32;color:#2e7d32" onclick="cargarPedidosFiltro('credito')">Creditos</button>
        <button class="btn btn-primary" style="margin-left:auto" onclick="mostrarFormPedido()">+ Nuevo pedido</button>
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
            ${a.length===0?'<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>':a.map(o=>{const n={borrador:"badge-warning",pendiente_pago:"badge-warning",confirmado:"badge-success",cancelado:"badge-danger",pagado:"badge-success"}[o.status]||"badge-warning";return`
                  <tr>
                    <td style="font-family:monospace;font-size:0.78rem;color:#888">#${o.id.substring(0,8).toUpperCase()}</td>
                    <td><strong>${o.clientes?o.clientes.nombre:o.nombre_cliente||"Sin cliente"}</strong><br>
                    ${o.email_cliente?`<span style="font-size:0.72rem;color:#aaa">${o.email_cliente}</span>`:""}
                    ${o.telefono_cliente?`<br><span style="font-size:0.72rem;color:#aaa">${o.telefono_cliente}</span>`:""}
                    </td>
                    <td>${o.canal||"—"}</td>
                    <td><strong>$${o.total||"0"}</strong></td>
                    <td>${o.mp_preference_id?"MercadoPago":o.forma_pago||"—"}</td>
                    <td><span class="badge ${n}">${o.status||"borrador"}</span></td>
                    <td>${o.created_at?new Date(new Date(o.created_at).getTime()-6*60*60*1e3).toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"}):"—"}</td>
                    <td>
                      <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${o.id}')">Ver</button>
                    </td>
                  </tr>
                `}).join("")}
          </tbody>
        </table>
      </div>
    `,window._pedidosData=a}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarPedidos=()=>{const e=document.getElementById("ped-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(a=>{const o=a.textContent.toLowerCase();a.style.display=o.includes(e)?"":"none"})};window.cargarPedidosFiltro=async e=>{document.getElementById("content");try{const a=await(await fetch(f+"/pedidos/")).json();let o=a;e==="pendiente_pago"?o=a.filter(n=>n.status==="pendiente_pago"):e==="credito"?o=a.filter(n=>n.forma_pago==="credito"):e&&(o=a.filter(n=>n.canal===e)),await xe()}catch{}};window.mostrarFormPedido=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const a=await(await fetch(f+"/clientes/")).json(),n=await(await fetch(f+"/sucursales/")).json(),i=await(await fetch(f+"/productos/")).json(),d=await(await fetch(f+"/variantes/")).json();window._variantesCache=d,window._productosCache=i,window._pedidoItems=[],e.innerHTML=`
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
              ${a.map(l=>`<option value="${l.id}" data-tipo="${l.tipo}" data-telefono="${l.telefono||""}">${l.nombre} (${l.tipo})</option>`).join("")}
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
    `,document.getElementById("ped-prod-resultados").addEventListener("click",l=>{const p=l.target.closest("[data-variante-id]");if(p){const c=p.dataset.varianteId,m=p.dataset.nombre;agregarItemPedido(c,m),document.getElementById("ped-prod-resultados").style.display="none",document.getElementById("ped-buscar-prod").value=""}})}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando formulario de pedido</p>'}};window.toggleComprobante=()=>{const e=document.getElementById("ped-pago").value,t=document.getElementById("spei-info");t&&(t.style.display=e==="spei"?"block":"none")};window.actualizarTipoCliente=()=>{const e=document.getElementById("ped-cliente");e.options[e.selectedIndex],window.recalcularTotal()};window.agregarItemPedido=async(e,t)=>{const a=window._variantesCache||[],o=window._productosCache||[],n=a.find(l=>l.id===e);if(!n)return;const r=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(r)try{const p=await(await fetch(f+"/inventario/sucursal/"+r)).json(),c=p.find(y=>y.variante_id===e),m=window._pedidoItems.find(y=>y.variante_id===e);console.log("Inventario:",p),console.log("Buscando variante:",e),console.log("Encontrado:",c);const u=m?m.cantidad:0,g=c?c.cantidad:0;if(g<=u){alert("No hay suficiente existencia de este producto. Disponible: "+g+" pares");return}}catch(l){console.error("Error verificando inventario",l)}const i=window._pedidoItems.find(l=>l.variante_id===e);if(i){i.cantidad++,window.recalcularTotal(),renderItemsPedido();return}const s=o.find(l=>l.id===n.producto_id)||{},d=parseFloat(s.precio_menudeo)||0;window._pedidoItems.push({variante_id:e,nombre:(s.nombre||"")+" - "+(n.color||"")+" - T"+(n.talla||""),cantidad:1,precio_unitario:d,precio_menudeo:d,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||d-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||d-70,precio_corrida:parseFloat(s.precio_corrida)||d-100,es_oferta:s.es_oferta||!1,foto_url:n.foto_url||s.imagen_principal||null}),window.recalcularTotal(),renderItemsPedido()};window.renderItemsPedido=()=>{const e=document.getElementById("ped-items-lista");if(e){if(window._pedidoItems.length===0){e.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>',window.recalcularTotal();return}e.innerHTML=window._pedidoItems.map((t,a)=>`
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
      ${t.foto_url?'<img src="'+t.foto_url+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">':'<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
      <div style="flex:1">
        <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">${t.nombre}</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:4px">
            <button onclick="cambiarCantidadItem(${a}, -1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">−</button>
            <span style="font-weight:600;min-width:24px;text-align:center">${t.cantidad}</span>
            <button onclick="cambiarCantidadItem(${a}, 1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">+</button>
          </div>
          <span style="color:#888;font-size:0.8rem">×$${t.precio_unitario}</span>
          <strong style="color:#E91E8C">= $${(t.cantidad*t.precio_unitario).toFixed(2)}</strong>
        </div>
      </div>
      <button onclick="eliminarItemPedido(${a})" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:1.2rem">✕</button>
    </div>
  `).join(""),window.recalcularTotal()}};window.cambiarCantidadItem=async(e,t)=>{if(t>0){const a=window._pedidoItems[e],o=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(o)try{const i=(await(await fetch(f+"/inventario/sucursal/"+o)).json()).find(d=>d.variante_id===a.variante_id),s=i?i.cantidad:0;if(a.cantidad>=s){alert("No hay mas existencia disponible. Maximo: "+s+" pares");return}}catch{}}window._pedidoItems[e].cantidad=Math.max(1,window._pedidoItems[e].cantidad+t),window.recalcularTotal(),renderItemsPedido()};window.guardarPedido=async()=>{const e=document.getElementById("ped-cliente").value,t=document.getElementById("ped-canal").value,a=document.getElementById("ped-sucursal").value,o=document.getElementById("ped-pago").value,n=document.getElementById("ped-comentarios").value;if(!e){alert("Selecciona un cliente");return}if(window._pedidoItems.length===0){alert("Agrega al menos un producto");return}const r=document.getElementById("btn-ped-guardar");r&&(r.textContent="Guardando...",r.disabled=!0);const i=window._pedidoItems.reduce((d,l)=>d+l.cantidad*l.precio_unitario,0),s=o==="spei"?"pendiente_pago":"confirmado";try{const d=await fetch(f+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:e,canal:t,sucursal_id:a,forma_pago:o,comentarios:n||null,total:i,subtotal:i,status:s})});if(!d.ok){alert("Error creando pedido"),r&&(r.textContent="Crear pedido",r.disabled=!1);return}const p=(await d.json())[0].id;for(const c of window._pedidoItems)await fetch(f+"/pedidos/"+p+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:c.variante_id,cantidad:c.cantidad,precio_unitario:c.precio_unitario,subtotal:c.cantidad*c.precio_unitario})});o!=="spei"&&o!=="mercadopago"&&await fetch(f+"/pedidos/"+p+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:o})}),alert("Pedido creado correctamente"),window._pedidoItems=[],verPedido(p)}catch{alert("Error conectando con el servidor"),r&&(r.textContent="Crear pedido",r.disabled=!1)}};window.verPedido=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando pedido...</p>';try{const o=await(await fetch(f+"/pedidos/"+e)).json();if(!o||o.length===0){alert("Pedido no encontrado");return}const n=o[0],r=n.pedido_items||[],i=n.clientes||{},s={borrador:"#f57f17",pendiente_pago:"#f57f17",confirmado:"#2e7d32",pagado:"#2e7d32",cancelado:"#c62828"}[n.status]||"#888";t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3 style="flex:1">Pedido #${n.id.substring(0,8).toUpperCase()}</h3>
          <span class="badge" style="background:${s}20;color:${s};border:1px solid ${s}40;padding:6px 12px">${n.status}</span>
          ${i.telefono?'<a href="https://wa.me/52'+i.telefono.replace(/\D/g,"")+"?text="+encodeURIComponent("Hola "+(i.nombre||"")+", tu pedido está listo")+'" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>':""}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente</p>
            <p style="font-weight:600">${i.nombre||"Mostrador"}</p>
            <p style="font-size:0.8rem;color:#888">${i.telefono||""}</p>
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

        <div style="margin-bottom:1.5rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Productos</p>
          ${r.map(d=>{const l=d.variantes||{},p=l.productos||{};return`
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
                ${p.imagen_principal?'<img src="'+p.imagen_principal+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">':'<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.85rem">${p.nombre||"—"} - ${l.color||""} - T${l.talla||""}</p>
                  <p style="font-size:0.8rem;color:#888">${d.cantidad} pares ×$${d.precio_unitario||0}</p>
                </div>
                <strong style="color:#E91E8C">$${d.subtotal!=null?d.subtotal:((d.cantidad||0)*(d.precio_unitario||0)).toFixed(2)}</strong>
              </div>
            `}).join("")}
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
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando pedido</p>'}};window.cancelarPedido=async e=>{if(confirm("¿Cancelar este pedido? Si ya estaba confirmado se devolverá el stock automáticamente."))try{const a=await(await fetch(f+"/pedidos/"+e+"/cancelar",{method:"POST"})).json();a.ok?(alert(a.stock_devuelto?"Pedido cancelado. Stock devuelto al inventario.":"Pedido cancelado."),verPedido(e)):alert("Error: "+JSON.stringify(a))}catch{alert("Error conectando con el servidor")}};window.reconfirmarPedido=async e=>{if(confirm("¿Reconfirmar este pedido? Se descontará el stock del inventario nuevamente."))try{const a=await(await fetch(f+"/pedidos/"+e+"/reconfirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})).json();a.ok?(alert("Pedido reconfirmado correctamente."),verPedido(e)):alert("Error: "+JSON.stringify(a))}catch{alert("Error conectando con el servidor")}};window.confirmarPagoSPEI=async e=>{if(confirm("Confirmar que recibiste el pago por SPEI?"))try{const a=await(await fetch(f+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"spei"})})).json();a.ok?(alert("Pago confirmado. Inventario actualizado."),verPedido(e)):alert("Error: "+JSON.stringify(a))}catch{alert("Error conectando con el servidor")}};window.confirmarPedidoAdmin=async e=>{if(confirm("Confirmar este pedido? El inventario se descontara."))try{const a=await(await fetch(f+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"efectivo"})})).json();a.ok?(alert("Pedido confirmado correctamente."),verPedido(e)):alert("Error: "+JSON.stringify(a))}catch{alert("Error conectando con el servidor")}};window.recalcularTotal=()=>{const e=window._pedidoItems||[],t=e.reduce((n,r)=>n+r.cantidad,0);e.forEach(n=>{n.es_oferta?n.precio_unitario=n.precio_menudeo:t>=6?n.precio_unitario=n.precio_mayoreo6||n.precio_menudeo-70:t>=3?n.precio_unitario=n.precio_mayoreo3||n.precio_menudeo-30:n.precio_unitario=n.precio_menudeo});const a=e.reduce((n,r)=>n+r.cantidad*r.precio_unitario,0),o=document.getElementById("ped-total");o&&(o.textContent="$"+a.toFixed(2))};async function we(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando punto de venta...</p>';try{const a=await(await fetch(f+"/productos/")).json(),n=await(await fetch(f+"/variantes/")).json(),i=await(await fetch(f+"/sucursales/")).json(),d=await(await fetch(f+"/clientes/")).json(),p=await(await fetch(f+"/inventario/")).json();window._posData={productos:a,variantes:n,sucursales:i,clientes:d,inventario:p},window._posCarrito=[],window._posClienteId=null,e.innerHTML=`
      <div id="pos-layout" style="display:grid;grid-template-columns:1fr 380px;gap:1rem;height:calc(100vh - 80px)">

        <div style="overflow-y:auto;padding-right:0.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;margin-bottom:1rem;border:1px solid #eee;position:sticky;top:0;z-index:10">
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:0.75rem">
  <input class="form-input" id="pos-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="width:100%;font-size:1rem;min-height:44px;padding:10px 14px" oninput="buscarPOS(this.value)">
  <select class="form-input" id="pos-sucursal" style="width:100%" onchange="actualizarInventarioPOS()">
    ${i.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join("")}
  </select>
</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="pos-categorias">
              <button class="btn btn-primary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('')">Todos</button>
              ${[...new Set(a.map(c=>c.categoria).filter(Boolean))].map(c=>`
                <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('${c}')">${c.charAt(0).toUpperCase()+c.slice(1)}</button>
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
    `,renderProductosPOS(a.filter(c=>c.activo))}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando punto de venta</p>'}}window.abrirDrawerPOS=()=>{renderDrawerPOS();const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.add("open"),t&&t.classList.add("active"),document.body.style.overflow="hidden"};window.cerrarDrawerPOS=()=>{const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.remove("open"),t&&t.classList.remove("active"),document.body.style.overflow=""};window.renderDrawerPOS=()=>{const e=window._posCarrito,t=document.getElementById("pos-drawer-items");if(!t)return;const a=e.reduce((c,m)=>c+m.cantidad,0),o=e.reduce((c,m)=>c+m.cantidad*m.precio_unitario,0),n=e.some(c=>c.es_corrida)?"Corrida":a>=6?"Mayoreo 6+":a>=3?"Mayoreo 3+":"Menudeo",r=document.getElementById("pos-drawer-pares"),i=document.getElementById("pos-drawer-total"),s=document.getElementById("pos-drawer-tipo");if(r&&(r.textContent=a),i&&(i.textContent="$"+o.toFixed(2)),s&&(s.textContent=n),!e.length){t.innerHTML='<p style="color:#888;text-align:center;padding:2rem">El carrito esta vacio</p>';return}const d=e.filter(c=>!c.es_corrida),l=e.filter(c=>c.es_corrida),p={};l.forEach(c=>{const m=c.producto_id+"|"+c.color;p[m]||(p[m]={nombre:c.nombre,color:c.color,producto_id:c.producto_id,tallas:[],subtotal:0,imagen:c.imagen||null}),p[m].tallas.push({talla:c.talla,cantidad:c.cantidad}),p[m].subtotal+=c.cantidad*c.precio_unitario}),t.innerHTML=`
    ${d.map(c=>{const m=e.indexOf(c);return`
        <div style="padding:12px 0;border-bottom:1px solid #f5f5f5">
  <div style="display:flex;gap:10px;margin-bottom:8px;align-items:start">
    ${c.imagen?`<img src="${c.imagen}" object-fit:contain;border-radius:8px;flex-shrink:0;background:#f5f5f5>`:'<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>'}
    <div style="flex:1">
      <p style="font-size:0.9rem;font-weight:600">${c.nombre}</p>
      <p style="font-size:0.78rem;color:#888">${c.color} · T${c.talla}</p>
    </div>
    <button onclick="eliminarItemPOS(${m});renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
  </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:10px">
              <button onclick="cambiarCantidadPOS(${m},-1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
              <span style="font-weight:700;min-width:24px;text-align:center">${c.cantidad}</span>
              <button onclick="cambiarCantidadPOS(${m},1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:0.72rem;color:#888">$</span>
              <input type="number" value="${c.precio_unitario}"
                     onchange="editarPrecioPOS(${m}, this.value);renderDrawerPOS()"
                     style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
              <span style="font-size:0.72rem;color:#888">/par</span>
            </div>
          </div>
          <p style="text-align:right;font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:4px">$${(c.cantidad*c.precio_unitario).toFixed(2)}</p>
        </div>
      `}).join("")}

    ${Object.entries(p).map(([c,m])=>`
      <div style="background:#fdf4ff;border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
          ${m.imagen?`<img src="${m.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
          <div style="flex:1">
            <p style="font-size:0.9rem;font-weight:700">${m.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${m.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${m.tallas.map(u=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${u.talla} ×${u.cantidad}</span>`).join("")}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${c}');renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px">
          <span style="font-size:0.85rem;color:#888">${m.tallas.reduce((u,g)=>u+g.cantidad,0)} pares</span>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="font-size:0.72rem;color:#888">$</span>
            <input type="number" value="${(m.subtotal/m.tallas.reduce((u,g)=>u+g.cantidad,0)).toFixed(2)}"
                   onchange="editarPrecioCorridaPOS('${c}', this.value);renderDrawerPOS()"
                   style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
            <span style="font-size:0.72rem;color:#888">/par</span>
          </div>
          <span style="font-weight:700;color:#6a1b9a">$${m.subtotal.toFixed(2)}</span>
        </div>
      </div>
    `).join("")}
  `};window.cobrarPOSM=async()=>{const e=document.getElementById("pos-pago-m"),t=document.getElementById("pos-pago");e&&t&&(t.value=e.value),cerrarDrawerPOS(),await cobrarPOS()};window.buscarClientePOSM=e=>{const{clientes:t}=window._posData,a=document.getElementById("pos-cliente-resultados-m");if(!e||e.length<2){a.style.display="none";return}const o=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!o.length){a.style.display="none";return}a.style.display="block",a.innerHTML=o.map(n=>`
    <div onclick="seleccionarClientePOSM('${n.id}','${n.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      <strong>${n.nombre}</strong>${n.telefono?" · "+n.telefono:""}
    </div>
  `).join("")};window.seleccionarClientePOSM=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar-m").value="",document.getElementById("pos-cliente-resultados-m").style.display="none";const a=document.getElementById("pos-cliente-sel-m");a.textContent="✔ "+t+" — toca para cambiar",a.style.display="block"};window.limpiarClientePOSM=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-sel-m").style.display="none",document.getElementById("pos-cliente-buscar-m").value=""};window.aplicarDescuentoPOS=e=>{const t=parseFloat(e)||0;window._posCarrito.forEach(r=>{const i=window._posCarrito.reduce((d,l)=>d+l.cantidad,0);let s;r.precio_base_original||(r.es_corrida?s=r.precio_corrida:i>=6?s=r.precio_mayoreo6:i>=3?s=r.precio_mayoreo3:s=r.precio_menudeo,r.precio_base_original=s),r.precio_unitario=Math.max(0,parseFloat((r.precio_base_original-t).toFixed(2))),r.precio_manual=t>0});const a=window._posCarrito.reduce((r,i)=>r+i.cantidad*i.precio_unitario,0),o=document.getElementById("pos-total");o&&(o.textContent="$"+a.toFixed(2));const n=document.getElementById("pos-descuento-info");if(n){const r=window._posCarrito.reduce((i,s)=>i+s.cantidad,0);n.textContent=t>0?`Ahorro total: $${(t*r).toFixed(2)} en ${r} pares`:""}renderCarritoPOS(),setTimeout(()=>{var l;const r=document.getElementById("pos-descuento");r&&(r.value=t);const i=document.getElementById("pos-descuento-m");i&&(i.value=t);const s=window._posCarrito.reduce((p,c)=>p+c.cantidad*c.precio_unitario,0),d=document.getElementById("pos-drawer-total");d&&(d.textContent="$"+s.toFixed(2)),(l=document.getElementById("pos-drawer"))!=null&&l.classList.contains("open")&&renderDrawerPOS()},50)};window.buscarClientePOS=e=>{const t=window._posData?window._posData.clientes:[],a=document.getElementById("pos-cliente-resultados");if(!a)return;if(!e||e.length<2){a.style.display="none";return}const o=t.filter(n=>n.nombre.toLowerCase().includes(e.toLowerCase())||(n.telefono||"").includes(e)).slice(0,8);if(o.length===0){a.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron clientes</div>',a.style.display="block";return}a.innerHTML=o.map(n=>`
    <div onclick="seleccionarClientePOS('${n.id}', '${n.nombre.replace(/'/g,"")}')"
         style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'"
         onmouseout="this.style.background='white'">
      <strong>${n.nombre}</strong>
      <span style="color:#888;font-size:0.75rem"> · ${n.tipo||"menudeo"}</span>
      ${n.telefono?'<br><span style="color:#888;font-size:0.72rem">'+n.telefono+"</span>":""}
    </div>
  `).join(""),a.style.display="block"};window.seleccionarClientePOS=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-resultados").style.display="none";const a=document.getElementById("pos-cliente-seleccionado");a.textContent="✔ "+t+" — toca para cambiar",a.style.display="block"};window.limpiarClientePOS=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-seleccionado").style.display="none",document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-buscar").focus()};window.renderProductosPOS=e=>{const{variantes:t,inventario:a}=window._posData,o=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",n=a.filter(i=>i.sucursal_id===o),r=document.getElementById("pos-productos-grid");r&&(r.innerHTML=e.filter(i=>i.activo).map(i=>{const s=t.filter(p=>p.producto_id===i.id),d=[...new Set(s.map(p=>p.color).filter(Boolean))],l=s.reduce((p,c)=>{const m=n.find(u=>u.variante_id===c.id);return p+(m?m.cantidad:0)},0);return`
      <div onclick="abrirProductoPOS('${i.id}')"
           style="background:white;border-radius:12px;border:1px solid #eee;cursor:pointer;overflow:hidden;transition:all 0.2s;${l===0?"opacity:0.5":""}"
           onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="position:relative">
          ${i.imagen_principal?`<img src="${i.imagen_principal}" style="width:100%;height:160px;object-fit:contain;background:#f5f5f5">`:'<div style="width:100%;height:160px;background:linear-gradient(135deg,#f5f5f5,#eee);display:flex;align-items:center;justify-content:center;font-size:2rem">­👠</div>'}
          ${l===0?'<div style="position:absolute;top:8px;right:8px;background:#c62828;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Agotado</div>':""}
          ${i.es_oferta?'<div style="position:absolute;top:8px;left:8px;background:#E91E8C;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Oferta</div>':""}
          ${i.nuevo?'<div style="position:absolute;top:8px;left:8px;background:#2e7d32;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Nuevo</div>':""}
        </div>
        <div style="padding:0.75rem">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.nombre}</p>
          <p style="font-size:0.72rem;color:#888;margin-bottom:6px">${i.sku_interno||""}</p>
          <div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap">
            ${d.slice(0,5).map(p=>{const c=s.find(m=>m.color===p);return`<div style="width:14px;height:14px;border-radius:50%;background:${c?c.color_hex:"#888"};border:1px solid #ddd" title="${p}"></div>`}).join("")}
            ${d.length>5?`<span style="font-size:0.7rem;color:#888">+${d.length-5}</span>`:""}
          </div>
          <p style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${i.precio_menudeo}</p>
        </div>
      </div>
    `}).join(""))};window.buscarPOS=e=>{const{productos:t}=window._posData;if(!e){renderProductosPOS(t);return}const a=e.toLowerCase().split(" ").filter(n=>n),o=t.filter(n=>{const r=n.nombre.toLowerCase(),i=(n.sku_interno||"").toLowerCase(),s=(n.categoria||"").toLowerCase(),d=r+" "+i+" "+s;return a.every(l=>d.includes(l))});renderProductosPOS(o)};window.filtrarPOS=e=>{const{productos:t}=window._posData,a=e?t.filter(o=>o.categoria===e):t;renderProductosPOS(a),document.querySelectorAll("#pos-categorias button").forEach(o=>{o.className="btn btn-secondary",o.style.cssText="padding:4px 12px;font-size:0.8rem"}),event.target.className="btn btn-primary",event.target.style.cssText="padding:4px 12px;font-size:0.8rem"};window.actualizarInventarioPOS=async()=>{const e=document.getElementById("pos-sucursal").value;try{const t=await fetch(f+"/inventario/sucursal/"+e);window._posData.inventario=await t.json();const{productos:a}=window._posData;renderProductosPOS(a)}catch{}};window.abrirProductoPOS=e=>{const t=document.getElementById("pos-modal");t&&t.remove();const{productos:a,variantes:o,inventario:n}=window._posData,r=a.find(c=>c.id===e);if(!r)return;const i=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",s=n.filter(c=>c.sucursal_id===i),d=o.filter(c=>c.producto_id===e),l=[...new Set(d.map(c=>c.color).filter(Boolean))];window._posBuffer={};const p=document.createElement("div");p.id="pos-modal",p.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",p.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:640px;width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden">
      
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid #eee;display:flex;align-items:center;gap:12px">
        ${r.imagen_principal?`<img id="pos-modal-img" src="${r.imagen_principal}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">`:""}
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem">${r.nombre}</p>
          <p style="font-size:0.8rem;color:#888">${r.sku_interno||""}</p>
          <p style="font-weight:700;color:#E91E8C">$${r.precio_menudeo} menudeo</p>
        </div>
        <button onclick="document.getElementById('pos-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;flex-shrink:0">✕</button>
      </div>

      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
        <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:8px">SELECCIONA COLOR</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${l.map(c=>{const m=d.find(g=>g.color===c),u=d.filter(g=>g.color===c).reduce((g,y)=>{const b=s.find(h=>h.variante_id===y.id);return g+(b?b.cantidad:0)},0);return`
              <div onclick="seleccionarColorModalPOS('${e}', '${c}')"
                   id="pos-color-btn-${c.replace(/\s/g,"_")}"
                   style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid ${u===0?"#f5f5f5":"#ddd"};opacity:${u===0?"0.4":"1"}">
                <div style="width:24px;height:24px;border-radius:50%;background:${m?m.color_hex:"#888"};border:2px solid #ddd"></div>
                <span style="font-size:0.65rem;color:#666;white-space:nowrap">${c}</span>
                <span id="pos-color-badge-${c.replace(/\s/g,"_")}" style="font-size:0.6rem;color:#2e7d32;font-weight:700;display:none">0 pares</span>
              </div>
            `}).join("")}
        </div>
      </div>

      <div id="pos-tallas-panel" style="padding:1rem;border-bottom:1px solid #eee;overflow-y:auto;flex:1;min-height:0;-webkit-overflow-scrolling:touch">
        <p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>
      </div>

      <div id="pos-modal-resumen" style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:none">
      </div>

      <div style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid #eee">
  ${r.corrida_activa?`
    <button onclick="mostrarCorridaModalPOS('${e}')"
            class="btn btn-secondary"
            style="width:100%;padding:10px;font-size:0.9rem;background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">
      📦 Agregar corrida completa
    </button>
  `:""}
  <button onclick="confirmarModalPOS('${e}')"
          id="pos-btn-confirmar"
          class="btn btn-primary"
          style="width:100%;padding:12px;font-size:1rem"
          disabled>
    Selecciona al menos una talla
  </button>
</div>
  `,document.body.appendChild(p),p.addEventListener("click",c=>{c.target===p&&p.remove()}),window._posSeleccion={productoId:e,color:null},window._posBuffer={}};window.mostrarCorridaModalPOS=e=>{const{variantes:t,inventario:a}=window._posData,o=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",n=a.filter(c=>c.sucursal_id===o),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],i=[...new Set(t.filter(c=>c.producto_id===e).map(c=>c.color).filter(Boolean))],s=document.querySelector(`button[onclick="mostrarCorridaModalPOS('${e}')"]`);s&&(s.style.display="none"),document.querySelectorAll("#pos-modal").forEach(c=>{c!==document.getElementById("pos-modal")&&c.remove()}),window._posSeleccion.color=null,window._corridaCantidades={};const d=document.getElementById("pos-tallas-panel");if(!d)return;const l=c=>{const m=t.filter(u=>u.producto_id===e&&u.color===c).sort((u,g)=>r.indexOf(u.talla)-r.indexOf(g.talla));m.filter(u=>{const g=n.find(y=>y.variante_id===u.id);return g&&g.cantidad>0}),d.innerHTML=`
      <p style="font-size:0.75rem;color:#6a1b9a;font-weight:700;margin-bottom:12px">📦 CORRIDA — selecciona color y ajusta cantidades</p>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        ${i.map(u=>{const g=t.find(v=>v.producto_id===e&&v.color===u),y=g?g.color_hex:"#888",b=g?g.foto_url:null,h=Object.entries(window._corridaCantidades).filter(([v])=>t.find(w=>w.id===v&&w.color===u)).reduce((v,[,w])=>v+w,0);return`
            <div onclick="window._corridaColorActivo='${u}';renderCorridaColor('${u}')"
                 style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px;border-radius:10px;border:2px solid ${u===c?"#6a1b9a":"#eee"};background:${u===c?"#f3e5f5":"white"};min-width:64px;position:relative">
              ${b?`<img src="${b}" style="width:44px;height:44px;object-fit:cover;border-radius:6px">`:`<div style="width:44px;height:44px;border-radius:6px;background:${y}"></div>`}
              <span style="font-size:0.65rem;font-weight:600;color:#333;text-align:center">${u}</span>
              ${h>0?`<span style="position:absolute;top:-6px;right:-6px;background:#6a1b9a;color:white;font-size:0.6rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center">${h}</span>`:""}
            </div>
          `}).join("")}
      </div>

           <div style="display:flex;flex-direction:column;gap:8px">
        ${m.map(u=>{const g=n.find(h=>h.variante_id===u.id),y=g?g.cantidad:0,b=window._corridaCantidades[u.id]||0;return`
            <div style="display:flex;align-items:center;gap:10px;opacity:${y===0?"0.4":"1"}">
              <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#333">${u.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:50px">Stock: ${y}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button ${y===0?"disabled":""}
                        onclick="const i=document.getElementById('qty-corrida-${u.id}');const val=Math.max(0,(parseInt(i.value)||0)-1);i.value=val;window._corridaCantidades['${u.id}']=val;renderCorridaColor('${c}')"
                        style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
                <input type="number" min="0" max="${y}"
                       value="${b}"
                       id="qty-corrida-${u.id}"
                       ${y===0?"disabled":""}
                       style="width:56px;height:40px;text-align:center;padding:4px;border:2px solid ${b>0?"#6a1b9a":"#ddd"};border-radius:8px;font-size:1rem;font-weight:700"
                       oninput="window._corridaCantidades['${u.id}']=Math.min(${y},Math.max(0,parseInt(this.value)||0));this.value=window._corridaCantidades['${u.id}']">
                <button ${y===0?"disabled":""}
                        onclick="const i=document.getElementById('qty-corrida-${u.id}');const val=Math.min(${y},(parseInt(i.value)||0)+1);i.value=val;window._corridaCantidades['${u.id}']=val;renderCorridaColor('${c}')"
                        style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
              ${y===0?'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>':""}
            </div>
          `}).join("")}
      </div>
    `};window.renderCorridaColor=l,window._corridaColorActivo=i[0],l(i[0]);const p=document.querySelector("#pos-modal > div > div:last-child");p&&(p.innerHTML=`
      <button id="pos-btn-sugerir"
              onclick="sugerirCorrida('${e}', window._corridaColorActivo)"
              style="width:100%;padding:12px;font-size:0.9rem;font-weight:600;cursor:pointer;background:#f3e5f5;color:#6a1b9a;border:2px solid #6a1b9a;border-radius:8px;margin-bottom:8px;min-height:48px">
        ✨ Sugerir corrida
      </button>
      <button onclick="confirmarCorridaNueva('${e}')"
              class="btn btn-primary"
              style="width:100%;padding:16px;font-size:1.1rem;background:#6a1b9a;border-color:#6a1b9a;min-height:54px">
        ✅ Agregar corrida al carrito
      </button>
    `)};window.sugerirCorrida=(e,t)=>{const{variantes:a,inventario:o}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=o.filter(p=>p.sucursal_id===n),i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],s=a.filter(p=>p.producto_id===e&&p.color===t).sort((p,c)=>i.indexOf(p.talla)-i.indexOf(c.talla)),d=s.filter(p=>{const c=r.find(m=>m.variante_id===p.id);return c&&c.cantidad>0}),l=d.some(p=>p.talla.includes("."));if(s.forEach(p=>{window._corridaCantidades[p.id]=0}),l)d.slice(0,6).forEach(p=>{window._corridaCantidades[p.id]=1});else{const p=d.slice(0,5);p.length>=4?p.forEach((c,m)=>{window._corridaCantidades[c.id]=m===1||m===2?2:1}):d.slice(0,6).forEach(c=>{window._corridaCantidades[c.id]=Math.ceil(6/d.length)})}window.renderCorridaColor(t)};window.confirmarCorridaNueva=e=>{const{variantes:t}=window._posData,a=window._posData.productos.find(r=>r.id===e);if(!a)return;let o=0;if(Object.entries(window._corridaCantidades).forEach(([r,i])=>{var l;if(i<=0)return;const s=t.find(p=>p.id===r);if(!s)return;const d=window._posCarrito.find(p=>p.variante_id===r&&p.es_corrida);d?(d.cantidad+=i,d.es_corrida=!0):window._posCarrito.push({variante_id:r,producto_id:e,nombre:a.nombre,color:s.color,talla:s.talla,cantidad:i,precio_menudeo:parseFloat(a.precio_menudeo)||0,precio_mayoreo3:parseFloat(a.precio_mayoreo3)||parseFloat(a.precio_menudeo)-30,precio_mayoreo6:parseFloat(a.precio_mayoreo6)||parseFloat(a.precio_menudeo)-70,precio_corrida:parseFloat(a.precio_corrida)||parseFloat(a.precio_menudeo)-100,es_corrida:!0,imagen:((l=window._posData.variantes.find(p=>p.id===r))==null?void 0:l.foto_url)||a.imagen_principal||null,precio_unitario:parseFloat(a.precio_corrida)||parseFloat(a.precio_menudeo)-100}),o++}),o===0){alert("Agrega al menos una talla");return}const n=document.getElementById("pos-modal");n&&n.remove(),window._corridaCantidades={},renderCarritoPOS()};window.seleccionarColorModalPOS=(e,t)=>{const{variantes:a,inventario:o}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=o.filter(u=>u.sucursal_id===n),i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._posSeleccion&&window._posSeleccion.color&&guardarBufferColor(e,window._posSeleccion.color),document.querySelectorAll('[id^="pos-color-btn-"]').forEach(u=>{u.style.borderColor="#ddd",u.style.background="transparent"});const s=document.getElementById("pos-color-btn-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t;const d=a.filter(u=>u.producto_id===e&&u.color===t).sort((u,g)=>i.indexOf(u.talla)-i.indexOf(g.talla)),l=d[0]?d[0].foto_url:null,p=document.getElementById("pos-modal-img");p&&l&&(p.src=l);const c=window._posBuffer[t]||{},m=document.getElementById("pos-tallas-panel");m&&(m.innerHTML=`
      <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:10px">TALLAS — ${t}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${d.map(u=>{const g=r.find(h=>h.variante_id===u.id),y=g?g.cantidad:0,b=c[u.id]||0;return`
            <div style="display:flex;align-items:center;gap:10px;opacity:${y===0?"0.4":"1"}">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700;color:#333">${u.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:60px">Stock: ${y}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="cambiarCantidadTallaPOS('modal-${u.id}', -1, ${y})"
                        ${y===0?"disabled":""}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">−</button>
                <input type="number" min="0" max="${y}"
                       value="${b}"
                       id="qty-modal-${u.id}"
                       ${y===0?"disabled":""}
                       style="width:50px;text-align:center;padding:5px;border:2px solid ${b>0?"#E91E8C":"#ddd"};border-radius:8px;font-size:1rem;font-weight:700"
                       oninput="validarCantidadTalla('modal-${u.id}', ${y}); actualizarBadgeColor('${e}', '${t}')">
                <button onclick="cambiarCantidadTallaPOS('modal-${u.id}', 1, ${y})"
                        ${y===0?"disabled":""}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">+</button>
              </div>
              ${y===0?'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>':""}
            </div>
          `}).join("")}
      </div>
    `)};window.guardarBufferColor=(e,t)=>{const{variantes:a}=window._posData,o=a.filter(n=>n.producto_id===e&&n.color===t);window._posBuffer[t]||(window._posBuffer[t]={}),o.forEach(n=>{const r=document.getElementById("qty-modal-"+n.id);window._posBuffer[t][n.id]=r&&parseInt(r.value)||0}),actualizarBadgeColor(e,t)};window.actualizarBadgeColor=(e,t)=>{const{variantes:a}=window._posData,o=a.filter(i=>i.producto_id===e&&i.color===t);let n=0;o.forEach(i=>{const s=document.getElementById("qty-modal-"+i.id);n+=s&&parseInt(s.value)||0});const r=document.getElementById("pos-color-badge-"+t.replace(/\s/g,"_"));r&&(n>0?(r.textContent=n+" par"+(n>1?"es":""),r.style.display="block"):r.style.display="none"),actualizarResumenModalPOS(e)};window.actualizarResumenModalPOS=e=>{const{variantes:t}=window._posData;let a=0;const o=[];Object.entries(window._posBuffer).forEach(([s,d])=>{Object.entries(d).forEach(([l,p])=>{if(p>0){const c=t.find(m=>m.id===l);c&&(o.push({color:s,talla:c.talla,cantidad:p}),a+=p)}})});const n=window._posSeleccion?window._posSeleccion.color:null;n&&!window._posBuffer[n]&&t.filter(d=>d.producto_id===e&&d.color===n).forEach(d=>{const l=document.getElementById("qty-modal-"+d.id),p=l&&parseInt(l.value)||0;p>0&&(o.push({color:n,talla:d.talla,cantidad:p}),a+=p)});const r=document.getElementById("pos-modal-resumen"),i=document.getElementById("pos-btn-confirmar");a>0?(r&&(r.style.display="block",r.innerHTML=`
        <p style="font-size:0.75rem;font-weight:700;color:#2e7d32;margin-bottom:8px">🛒 RESUMEN — ${a} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${o.map(s=>`
            <span style="background:#f5f5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem">
              <strong>${s.color}</strong> T${s.talla} × ${s.cantidad}
            </span>
          `).join("")}
        </div>
      `),i&&(i.textContent=`✅ Agregar ${a} pares al carrito`,i.disabled=!1)):(r&&(r.style.display="none"),i&&(i.textContent="Selecciona al menos una talla",i.disabled=!0))};window.confirmarModalPOS=e=>{window._posSeleccion&&window._posSeleccion.color;const{productos:t,variantes:a}=window._posData,o=t.find(r=>r.id===e);if(!o)return;window._posSeleccion&&window._posSeleccion.color?guardarBufferColor(e,window._posSeleccion.color):document.querySelectorAll('[id^="qty-modal-"]').forEach(i=>{const s=i.id.replace("qty-modal-",""),d=a.find(p=>p.id===s);if(!d)return;const l=parseInt(i.value)||0;window._posBuffer[d.color]||(window._posBuffer[d.color]={}),window._posBuffer[d.color][s]=l});let n=0;if(Object.entries(window._posBuffer).forEach(([r,i])=>{Object.entries(i).forEach(([s,d])=>{var c;if(d<=0)return;const l=a.find(m=>m.id===s),p=window._posCarrito.find(m=>m.variante_id===s&&!m.es_corrida);p?p.cantidad+=d:window._posCarrito.push({variante_id:s,producto_id:e,nombre:o.nombre,color:l?l.color:r,talla:l?l.talla:"",cantidad:d,precio_menudeo:parseFloat(o.precio_menudeo)||0,precio_mayoreo3:parseFloat(o.precio_mayoreo3)||parseFloat(o.precio_menudeo)-30,precio_mayoreo6:parseFloat(o.precio_mayoreo6)||parseFloat(o.precio_menudeo)-70,precio_corrida:parseFloat(o.precio_corrida)||parseFloat(o.precio_menudeo)-100,es_oferta:o.es_oferta||!1,es_corrida:!1,imagen:window._posBuffer[l?l.color:r]&&((c=window._posData.variantes.find(m=>m.id===s))==null?void 0:c.foto_url)||o.imagen_principal||null,precio_unitario:parseFloat(o.precio_menudeo)||0}),n++})}),n===0){alert("Pon al menos 1 par en alguna talla");return}document.getElementById("pos-modal").remove(),window._posBuffer={},renderCarritoPOS()};window.seleccionarColorPOS=(e,t)=>{const{variantes:a,inventario:o}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=o.filter(m=>m.sucursal_id===n),i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];document.querySelectorAll('[id^="pos-color-"]').forEach(m=>{m.style.borderColor="transparent",m.style.background="transparent"});const s=document.getElementById("pos-color-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t,window._posSeleccion.talla=null;const d=a.filter(m=>m.producto_id===e&&m.color===t).sort((m,u)=>i.indexOf(m.talla)-i.indexOf(u.talla)),l=d[0]?d[0].foto_url:null,p=document.getElementById("pos-modal-img");p&&l&&(p.src=l);const c=document.getElementById("pos-tallas-container");c&&(c.innerHTML=`
    <p style="font-size:0.75rem;color:#888;margin-bottom:6px;font-weight:600">TALLAS Y CANTIDADES</p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${d.map(m=>{const u=r.find(b=>b.variante_id===m.id),g=u?u.cantidad:0,y=g>0;return`
          <div style="display:flex;align-items:center;gap:8px;opacity:${y?"1":"0.4"}">
            <span style="min-width:40px;font-size:0.85rem;font-weight:600;color:#333">${m.talla}</span>
            <span style="font-size:0.72rem;color:#888;min-width:60px">Stock: ${g}</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button onclick="cambiarCantidadTallaPOS('${m.id}', -1, ${g})" 
                      ${y?"":"disabled"}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${y?"":"cursor:not-allowed"}">−</button>
              <input type="number" min="0" max="${g}" value="0"
                     id="qty-${m.id}"
                     ${y?"":"disabled"}
                     style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                     oninput="validarCantidadTalla('${m.id}', ${g})">
              <button onclick="cambiarCantidadTallaPOS('${m.id}', 1, ${g})"
                      ${y?"":"disabled"}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${y?"":"cursor:not-allowed"}">+</button>
            </div>
            ${y?"":'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 6px;border-radius:100px">Agotado</span>'}
          </div>
        `}).join("")}
    </div>
    <button onclick="agregarTallasPOS('${e}', '${t}')" 
            class="btn btn-primary" 
            style="width:100%;margin-top:12px;padding:10px">
      + Agregar al carrito
    </button>
  `)};window.cambiarCantidadTallaPOS=(e,t,a)=>{const o=document.getElementById("qty-"+e);if(!o)return;const n=Math.min(a,Math.max(0,(parseInt(o.value)||0)+t));o.value=n,window._posSeleccion&&actualizarBadgeColor(window._posSeleccion.productoId,window._posSeleccion.color)};window.agregarTallasPOS=(e,t)=>{const{productos:a,variantes:o}=window._posData,n=a.find(d=>d.id===e);if(!n)return;const r=o.filter(d=>d.producto_id===e&&d.color===t);let i=0;if(r.forEach(d=>{const l=document.getElementById("qty-"+d.id),p=l&&parseInt(l.value)||0;if(p<=0)return;const c=window._posCarrito.find(m=>m.variante_id===d.id);c?c.cantidad+=p:window._posCarrito.push({variante_id:d.id,producto_id:e,nombre:n.nombre,color:t,talla:d.talla,cantidad:p,precio_menudeo:parseFloat(n.precio_menudeo)||0,precio_mayoreo3:parseFloat(n.precio_mayoreo3)||parseFloat(n.precio_menudeo)-30,precio_mayoreo6:parseFloat(n.precio_mayoreo6)||parseFloat(n.precio_menudeo)-70,precio_corrida:parseFloat(n.precio_corrida)||parseFloat(n.precio_menudeo)-100,imagen:n.imagen_principal||null,es_oferta:n.es_oferta||!1,precio_unitario:parseFloat(n.precio_menudeo)||0}),i++}),i===0){alert("Pon al menos 1 par en alguna talla");return}const s=document.querySelector(`button[onclick="agregarTallasPOS('${e}', '${t}')"]`);s&&(s.textContent="✅ Agregado — selecciona otro color o cierra",s.style.background="#2e7d32",s.style.borderColor="#2e7d32",s.disabled=!0),r.forEach(d=>{const l=document.getElementById("qty-"+d.id);l&&(l.value=0)}),actualizarResumenModal(e)};window.actualizarResumenModal=e=>{const t=window._posCarrito.filter(n=>n.producto_id===e),a=t.reduce((n,r)=>n+r.cantidad,0);let o=document.getElementById("pos-modal-resumen");if(!o){o=document.createElement("div"),o.id="pos-modal-resumen",o.style.cssText="background:#e8f5e9;border-radius:8px;padding:0.75rem;margin-top:10px;border:1px solid #a5d6a7";const n=document.querySelector("#pos-modal > div > div:last-child");n&&n.insertBefore(o,n.firstChild)}o.innerHTML=`
    <p style="font-size:0.78rem;font-weight:700;color:#2e7d32;margin-bottom:6px">🛒 En carrito — ${a} pares</p>
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
  `};window.seleccionarTallaPOS=(e,t)=>{window._posSeleccion.talla=t,window._posSeleccion.varianteId=e,document.querySelectorAll('[id^="pos-talla-"]').forEach(n=>{n.style.borderColor="#ddd",n.style.background="white",n.style.color="#333"});const a=document.getElementById("pos-talla-"+t.replace(".","_"));a&&(a.style.borderColor="#E91E8C",a.style.background="#fce4f3",a.style.color="#E91E8C");const o=document.getElementById("pos-btn-agregar");o&&(o.textContent="+ Agregar al carrito",o.disabled=!1)};window.agregarAlCarritoPOS=e=>{const{productos:t,variantes:a}=window._posData,{varianteId:o,color:n,talla:r}=window._posSeleccion;if(!o||!n||!r)return;const i=t.find(d=>d.id===e);if(!i)return;const s=window._posCarrito.find(d=>d.variante_id===o);s?s.cantidad++:window._posCarrito.push({variante_id:o,producto_id:e,nombre:i.nombre,color:n,talla:r,cantidad:1,precio_menudeo:parseFloat(i.precio_menudeo)||0,precio_mayoreo3:parseFloat(i.precio_mayoreo3)||parseFloat(i.precio_menudeo)-30,precio_mayoreo6:parseFloat(i.precio_mayoreo6)||parseFloat(i.precio_menudeo)-70,precio_corrida:parseFloat(i.precio_corrida)||parseFloat(i.precio_menudeo)-100,imagen:i.imagen_principal||null,es_oferta:i.es_oferta||!1,precio_unitario:parseFloat(i.precio_menudeo)||0}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.agregarCorridaPOS=e=>{const{productos:t,variantes:a,inventario:o}=window._posData,{color:n}=window._posSeleccion;if(!n){alert("Selecciona un color primero");return}t.find(m=>m.id===e);const r=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=o.filter(m=>m.sucursal_id===r),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=a.filter(m=>m.producto_id===e&&m.color===n).sort((m,u)=>s.indexOf(m.talla)-s.indexOf(u.talla)),p=document.getElementById("pos-modal").querySelector("div > div:last-child"),c=`
    <div style="background:#f3e5f5;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ce93d8">
      <p style="font-weight:700;color:#6a1b9a;margin-bottom:0.75rem">✏️ Editar corrida — ${n}</p>
      <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">Ajusta las cantidades por talla</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${d.map(m=>{const u=i.find(y=>y.variante_id===m.id),g=u?u.cantidad:0;return`
            <div style="display:flex;align-items:center;gap:8px">
              <span style="min-width:40px;font-size:0.85rem;font-weight:600">${m.talla}</span>
              <span style="font-size:0.72rem;color:#888;min-width:55px">Stock: ${g}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <button onclick="cambiarCantidadTallaPOS('corrida-${m.id}', -1, ${g})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">−</button>
                <input type="number" min="0" max="${g}" value="${g>0?1:0}"
                       id="qty-corrida-${m.id}"
                       style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                       oninput="validarCantidadTalla('corrida-${m.id}', ${g})">
                <button onclick="cambiarCantidadTallaPOS('corrida-${m.id}', 1, ${g})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">+</button>
              </div>
              ${g===0?'<span style="font-size:0.7rem;color:#c62828">Sin stock</span>':""}
            </div>
          `}).join("")}
      </div>
      <button onclick="confirmarCorridaPOS('${e}', '${n}')"
              class="btn btn-primary"
              style="width:100%;margin-top:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Confirmar corrida
      </button>
    </div>
  `;p&&p.insertAdjacentHTML("beforeend",c)};window.confirmarCorridaPOS=(e,t)=>{const{productos:a,variantes:o}=window._posData,n=a.find(i=>i.id===e);o.filter(i=>i.producto_id===e&&i.color===t).forEach(i=>{const s=document.getElementById("qty-corrida-"+i.id),d=s&&parseInt(s.value)||0;if(d<=0)return;const l=window._posCarrito.find(p=>p.variante_id===i.id);l?(l.cantidad+=d,l.es_corrida=!0):window._posCarrito.push({variante_id:i.id,producto_id:e,nombre:n.nombre,color:t,talla:i.talla,cantidad:d,precio_menudeo:parseFloat(n.precio_menudeo)||0,precio_mayoreo3:parseFloat(n.precio_mayoreo3)||parseFloat(n.precio_menudeo)-30,precio_mayoreo6:parseFloat(n.precio_mayoreo6)||parseFloat(n.precio_menudeo)-70,precio_corrida:parseFloat(n.precio_corrida)||parseFloat(n.precio_menudeo)-100,imagen:n.imagen_principal||null,es_oferta:n.es_oferta||!1,es_corrida:!0,precio_unitario:parseFloat(n.precio_menudeo)||0})}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.renderCarritoPOS=()=>{var u;const e=window._posCarrito,t=document.getElementById("pos-carrito-items");if(!t)return;const a=e.reduce((g,y)=>g+y.cantidad,0);e.forEach(g=>{g.precio_manual||(g.es_oferta?g.precio_unitario=g.precio_menudeo:g.es_corrida?g.precio_unitario=g.precio_corrida:a>=6?g.precio_unitario=g.precio_mayoreo6:a>=3?g.precio_unitario=g.precio_mayoreo3:g.precio_unitario=g.precio_menudeo)});const o=e.reduce((g,y)=>g+y.cantidad*y.precio_unitario,0),n=e.some(g=>g.es_corrida)?"Corrida":a>=6?"Mayoreo 6+":a>=3?"Mayoreo 3+":"Menudeo",r=e.filter(g=>!g.es_corrida),i=e.filter(g=>g.es_corrida),s={};i.forEach(g=>{const y=g.producto_id+"|"+g.color;s[y]||(s[y]={nombre:g.nombre,color:g.color,producto_id:g.producto_id,tallas:[],subtotal:0,imagen:g.imagen||null}),s[y].tallas.push({talla:g.talla,cantidad:g.cantidad,variante_id:g.variante_id}),s[y].subtotal+=g.cantidad*g.precio_unitario}),e.length===0?t.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>':t.innerHTML=`
      ${r.map(g=>`
  <div style="padding:10px;border-bottom:1px solid #f5f5f5">
    <div style="display:flex;gap:10px;margin-bottom:8px">
      ${g.imagen?`<img src="${g.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
      <div style="flex:1">
        <p style="font-size:0.9rem;font-weight:600">${g.nombre}</p>
        <p style="font-size:0.78rem;color:#888">${g.color} · T${g.talla}</p>
      </div>
      <button onclick="eliminarItemPOS(${e.indexOf(g)})" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="cambiarCantidadPOS(${e.indexOf(g)}, -1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">−</button>
        <span style="font-size:1rem;font-weight:700;min-width:24px;text-align:center">${g.cantidad}</span>
        <button onclick="cambiarCantidadPOS(${e.indexOf(g)}, 1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">+</button>
      </div>
      <div style="text-align:right">
        <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end">
          <span style="font-size:0.72rem;color:#888">$</span>
          <input type="number" value="${g.precio_unitario}"
                 onchange="editarPrecioPOS(${e.indexOf(g)}, this.value)"
                 style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
          <span style="font-size:0.72rem;color:#888">/par</span>
        </div>
        <p id="subtotal-item-${e.indexOf(g)}" style="font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:2px">$${(g.cantidad*g.precio_unitario).toFixed(2)}</p>
      </div>
    </div>
  </div>
`).join("")}

      
  ${Object.entries(s).map(([g,y])=>`
  <div style="padding:10px;border-bottom:1px solid #f5f5f5;background:#fdf4ff" data-corrida-key="${g}">
    <div style="display:flex;gap:10px;align-items:start;margin-bottom:6px">
      ${y.imagen?`<img src="${y.imagen}" style="width:48px;height:48px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">`:'<div style="width:48px;height:48px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>'}
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <p style="font-size:0.9rem;font-weight:700">${y.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${y.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${y.tallas.map(b=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${b.talla} ×${b.cantidad}</span>`).join("")}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${g}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;flex-wrap:wrap;gap:8px">
      <button onclick="editarCorridaEnCarrito('${g}')"
              style="background:#f3e5f5;border:1px solid #ce93d8;border-radius:6px;padding:6px 12px;font-size:0.78rem;color:#6a1b9a;cursor:pointer">
        ✏️ Editar corrida
      </button>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:0.78rem;color:#888">$</span>
        <input type="number" value="${(y.subtotal/y.tallas.reduce((b,h)=>b+h.cantidad,0)).toFixed(2)}"
               onchange="editarPrecioCorridaPOS('${g}', this.value)"
               style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
        <span style="font-size:0.72rem;color:#888">/par</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <span style="font-size:0.78rem;color:#888">${y.tallas.reduce((b,h)=>b+h.cantidad,0)} pares</span>
      <p id="subtotal-corrida-${g.replace("|","-")}" style="font-size:0.95rem;font-weight:700;color:#6a1b9a">$${y.subtotal.toFixed(2)}</p>
    </div>
  </div>
`).join("")}
    `;const d=document.getElementById("pos-total"),l=document.getElementById("pos-total-pares"),p=document.getElementById("pos-tipo-precio");d&&(d.textContent="$"+o.toFixed(2)),l&&(l.textContent=a),p&&(p.textContent=n);const c=document.getElementById("pos-flotante-pares"),m=document.getElementById("pos-flotante-total");c&&(c.textContent=a+" pares"),m&&(m.textContent="$"+o.toFixed(2)),(u=document.getElementById("pos-drawer"))!=null&&u.classList.contains("open")&&renderDrawerPOS()};window.editarPrecioPOS=(e,t)=>{if(!window._posCarrito[e])return;const a=parseFloat(t)||0;window._posCarrito[e].precio_unitario=a,window._posCarrito[e].precio_manual=!0;const o=window._posCarrito[e].cantidad,n=document.getElementById("subtotal-item-"+e);n&&(n.textContent="$"+(o*a).toFixed(2));const r=window._posCarrito.reduce((s,d)=>s+d.cantidad*d.precio_unitario,0),i=document.getElementById("pos-total");i&&(i.textContent="$"+r.toFixed(2))};window.editarPrecioCorridaPOS=(e,t)=>{const[a,o]=e.split("|"),n=parseFloat(t)||0;window._posCarrito.forEach(p=>{p.producto_id===a&&p.color===o&&p.es_corrida&&(p.precio_unitario=n,p.precio_manual=!0)});const i=window._posCarrito.filter(p=>p.producto_id===a&&p.color===o&&p.es_corrida).reduce((p,c)=>p+c.cantidad*c.precio_unitario,0),s=document.getElementById("subtotal-corrida-"+e.replace("|","-"));s&&(s.textContent="$"+i.toFixed(2));const d=window._posCarrito.reduce((p,c)=>p+c.cantidad*c.precio_unitario,0),l=document.getElementById("pos-total");l&&(l.textContent="$"+d.toFixed(2))};window.editarCorridaEnCarrito=e=>{const[t,a]=e.split("|"),{inventario:o,variantes:n}=window._posData,r=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=o.filter(p=>p.sucursal_id===r),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=n.filter(p=>p.producto_id===t&&p.color===a).sort((p,c)=>s.indexOf(p.talla)-s.indexOf(c.talla)),l=document.createElement("div");l.id="pos-modal-editar-corrida",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:400px;width:100%;padding:1.5rem;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700;color:#6a1b9a">✏️ Editar corrida · ${a}</p>
        <button onclick="document.getElementById('pos-modal-editar-corrida').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${d.map(p=>{const c=i.find(y=>y.variante_id===p.id),m=c?c.cantidad:0,u=window._posCarrito.find(y=>y.variante_id===p.id&&y.es_corrida),g=u?u.cantidad:0;return`
            <div style="display:flex;align-items:center;gap:10px">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700">T${p.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:55px">Stock: ${m}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="this.nextElementSibling.value=Math.max(0,parseInt(this.nextElementSibling.value)-1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">−</button>
                <input type="number" min="0" max="${m}" value="${g}"
                       id="edit-corrida-${p.id}"
                       style="width:50px;text-align:center;padding:4px;border:2px solid #6a1b9a;border-radius:8px;font-size:1rem;font-weight:700">
                <button onclick="this.previousElementSibling.value=Math.min(${m},parseInt(this.previousElementSibling.value)+1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">+</button>
              </div>
            </div>
          `}).join("")}
      </div>
      <button onclick="guardarEdicionCorridaPOS('${t}', '${a}')"
              class="btn btn-primary"
              style="width:100%;margin-top:1.5rem;padding:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Guardar cambios
      </button>
    </div>
  `,document.body.appendChild(l),l.addEventListener("click",p=>{p.target===l&&l.remove()})};window.guardarEdicionCorridaPOS=(e,t)=>{const{variantes:a,productos:o}=window._posData,n=window._posCarrito.filter(l=>l.producto_id===e&&l.color===t&&l.es_corrida),r=n.length>0&&n[0].precio_manual?n[0].precio_unitario:null;window._posCarrito=window._posCarrito.filter(l=>!(l.producto_id===e&&l.color===t&&l.es_corrida));const i=a.filter(l=>l.producto_id===e&&l.color===t),s=o.find(l=>l.id===e);if(!s)return;const d=r!==null?r:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-100;i.forEach(l=>{const p=document.getElementById("edit-corrida-"+l.id),c=p&&parseInt(p.value)||0;c<=0||window._posCarrito.push({variante_id:l.id,producto_id:e,nombre:s.nombre,color:t,talla:l.talla,cantidad:c,precio_menudeo:parseFloat(s.precio_menudeo)||0,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||parseFloat(s.precio_menudeo)-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||parseFloat(s.precio_menudeo)-70,precio_corrida:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-100,es_oferta:s.es_oferta||!1,imagen:s.imagen_principal||null,es_corrida:!0,precio_manual:r!==null,precio_unitario:d})}),document.getElementById("pos-modal-editar-corrida").remove(),renderCarritoPOS()};window.eliminarCorridaPOS=e=>{const[t,a]=e.split("|");window._posCarrito=window._posCarrito.filter(o=>!(o.producto_id===t&&o.color===a&&o.es_corrida)),renderCarritoPOS()};window.cambiarCantidadPOS=async(e,t)=>{const a=window._posCarrito[e];if(a){if(t>0){const o=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"";try{const i=(await(await fetch(f+"/inventario/sucursal/"+o)).json()).find(l=>l.variante_id===a.variante_id),s=i?i.cantidad:0;if(window._posCarrito.filter(l=>l.variante_id===a.variante_id).reduce((l,p)=>l+p.cantidad,0)>=s){alert("No hay más existencia disponible. Stock: "+s+" pares");return}}catch(n){console.error("Error verificando stock",n)}}a.cantidad=Math.max(1,a.cantidad+t),renderCarritoPOS()}};window.eliminarItemPOS=e=>{window._posCarrito.splice(e,1),renderCarritoPOS()};window.limpiarCarritoPOS=()=>{window._posCarrito.length>0&&!confirm("Limpiar el carrito?")||(window._posCarrito=[],renderCarritoPOS())};window.cobrarPOS=async()=>{if(window._posCarrito.length===0){alert("El carrito esta vacio");return}const e=document.querySelector('button[onclick="cobrarPOS()"]');if(e){if(e.disabled)return;e.disabled=!0,e.textContent="Procesando..."}const t=document.getElementById("pos-cliente").value||null,a=document.getElementById("pos-sucursal").value,o=document.getElementById("pos-pago").value,n=window._posCarrito.reduce((r,i)=>r+i.cantidad*i.precio_unitario,0);try{const s=(await(await fetch(f+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:t,canal:"sucursal",sucursal_id:a,forma_pago:o,total:n,subtotal:n,status:o==="spei"?"pendiente_pago":"confirmado"})})).json())[0].id;for(const p of window._posCarrito)await fetch(f+"/pedidos/"+s+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:p.variante_id,cantidad:p.cantidad,precio_unitario:p.precio_unitario,subtotal:p.cantidad*p.precio_unitario})});o!=="spei"&&await fetch(f+"/pedidos/"+s+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:o})});const d=window._posCarrito.reduce((p,c)=>p+c.cantidad,0);window._posCarrito=[],renderCarritoPOS(),imprimirTicketPOS(s,n,d,o);const l=await fetch(f+"/inventario/sucursal/"+a);window._posData.inventario=await l.json(),renderProductosPOS(window._posData.productos)}catch{alert("Error procesando la venta");const i=document.querySelector('button[onclick="cobrarPOS()"]');i&&(i.disabled=!1,i.textContent="Cobrar")}};window.imprimirTicketPOS=async(e,t,a,o)=>{const r=await(await fetch(f+"/pedidos/"+e)).json();if(!r||r.length===0)return;const i=r[0],s=i.pedido_items||[],d=i.clientes||{},l=new Date().toLocaleString("es-MX"),p=window.open("","_blank","width=400,height=600");p.document.write(`
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
        <span>${o.toUpperCase()}</span>
      </div>
      <div class="divider"></div>
      ${(()=>{const c={};return s.forEach(m=>{const u=m.variantes||{},g=u.productos||{},y=(g.nombre||"—")+"|"+(u.color||"");c[y]||(c[y]={nombre:g.nombre||"—",color:u.color||"",cantidad:0,subtotal:0}),c[y].cantidad+=m.cantidad,c[y].subtotal+=parseFloat(m.subtotal)||m.cantidad*m.precio_unitario}),`
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="border-bottom:1px solid #000">
        <td style="width:30px;text-align:right;padding-right:6px;font-weight:bold">Cant</td>
        <td style="padding-right:4px;font-weight:bold">Modelo</td>
        <td style="padding-right:4px;font-weight:bold">Color</td>
        <td style="text-align:right;font-weight:bold">Total</td>
      </tr>
      ${Object.values(c).map(m=>`
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
        <span>${a}</span>
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
  `),p.document.close()};window.generarPDFPedido=async e=>{const a=await(await fetch(f+"/pedidos/"+e)).json();if(!a||a.length===0)return;const o=a[0],n=o.pedido_items||[],r=o.clientes||{},i=new Date(o.created_at).toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"}),s=o.total||0,d=n.reduce((p,c)=>p+c.cantidad,0),l=window.open("","_blank");l.document.write(`
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
          <div class="pedido-fecha">${i}</div>
          <div style="margin-top:8px">
            <span class="badge ${o.status==="confirmado"||o.status==="pagado"?"badge-success":"badge-warning"}">${o.status}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="cliente-grid">
        <div>
          <div class="section-title">Datos del cliente</div>
          <div class="campo">
            <div class="campo-label">Nombre</div>
            <div class="campo-valor">${r.nombre||"Cliente general"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Telefono</div>
            <div class="campo-valor">${r.telefono||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Email</div>
            <div class="campo-valor">${r.email||"—"}</div>
          </div>
        </div>
        <div>
          <div class="section-title">Informacion del pedido</div>
          <div class="campo">
            <div class="campo-label">Canal</div>
            <div class="campo-valor">${o.canal||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Forma de pago</div>
            <div class="campo-valor">${o.forma_pago||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Sucursal</div>
            <div class="campo-valor">${o.sucursales?o.sucursales.nombre:"—"}</div>
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
          ${n.map(p=>{const c=p.variantes||{};return`
              <tr>
                <td>${(c.productos||{}).nombre||"—"}</td>
                <td>${c.color||"—"}</td>
                <td>${c.talla||"—"}</td>
                <td style="font-size:11px;color:#888">${c.sku||"—"}</td>
                <td class="text-right">${p.cantidad}</td>
                <td class="text-right">$${p.precio_unitario}</td>
                <td class="text-right font-weight:bold">$${p.subtotal}</td>
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

      ${o.comentarios?`
        <div class="divider-light"></div>
        <div class="section-title">Comentarios</div>
        <p style="font-size:12px;color:#555">${o.comentarios}</p>
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
  `),l.document.close()};async function $e(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/movimientos/")).json(),o={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}};e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Historial de movimientos (${a.length})</h3>
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
            ${a.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No hay movimientos registrados</td></tr>':a.map(n=>{const r=o[n.tipo]||{label:n.tipo,badge:"badge-warning"},i=n.cantidad||0;return`<tr>
                    <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(n.created_at).toLocaleString("es-MX")}</td>
                    <td><span class="badge ${r.badge}">${r.label}</span></td>
                    <td><strong>${n.variantes&&n.variantes.productos?n.variantes.productos.nombre:"—"}</strong></td>
                    <td>${n.variantes&&n.variantes.color||"—"}</td>
                    <td>${n.variantes&&n.variantes.talla||"—"}</td>
                    <td>${n.sucursales&&n.sucursales.nombre||"—"}</td>
                    <td style="font-weight:600;color:${i>0?"var(--green)":"var(--red)"}">${i>0?"+":""}${i}</td>
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
      </div>`,window._historialData=a}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.cancelarMovimiento=async(e,t,a,o,n)=>{if(confirm("¿Cancelar este movimiento? Se revertirá el cambio en el inventario."))try{const i=await(await fetch(f+"/inventario/?variante_id=eq."+a+"&sucursal_id=eq."+o)).json(),s=i&&i.length>0?i[0].cantidad:0,d=n==="venta"?s+t:Math.max(0,s-t);(await fetch(f+"/inventario/actualizar",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:a,sucursal_id:o,cantidad:d,stock_minimo:i&&i.length>0?i[0].stock_minimo:3})})).ok?(alert("Movimiento cancelado. Inventario actualizado."),$e()):alert("Error al actualizar inventario")}catch{alert("Error conectando con el servidor")}};window.filtrarHistorial=()=>{const e=document.getElementById("hist-tipo").value,t=document.getElementById("hist-buscar").value.toLowerCase(),a=window._historialData||[],o={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}},n=a.filter(i=>{if(e&&i.tipo!==e)return!1;if(t){const s=(i.variantes&&i.variantes.productos?i.variantes.productos.nombre:"").toLowerCase(),d=(i.motivo||"").toLowerCase();if(!s.includes(t)&&!d.includes(t))return!1}return!0}),r=document.getElementById("hist-tbody");r&&(r.innerHTML=n.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron movimientos</td></tr>':n.map(i=>{const s=o[i.tipo]||{label:i.tipo,badge:"badge-warning"},d=i.cantidad||0;return`<tr>
          <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(i.created_at).toLocaleString("es-MX")}</td>
          <td><span class="badge ${s.badge}">${s.label}</span></td>
          <td><strong>${i.variantes&&i.variantes.productos?i.variantes.productos.nombre:"—"}</strong></td>
          <td>${i.variantes&&i.variantes.color||"—"}</td>
          <td>${i.variantes&&i.variantes.talla||"—"}</td>
          <td>${i.sucursales&&i.sucursales.nombre||"—"}</td>
          <td style="font-weight:600;color:${d>0?"var(--green)":"var(--red)"}">${d>0?"+":""}${d}</td>
          <td style="font-size:0.82rem">${i.motivo||"—"}</td>
        </tr>`}).join(""))};async function Fe(){try{const t=await(await fetch(f+"/pedidos/")).json(),o=await(await fetch(f+"/clientes/")).json(),r=await(await fetch(f+"/inventario/alertas")).json(),i=new Date;i.setHours(0,0,0,0);const s=new Date(i);s.setDate(s.getDate()-7);const d=new Date(i);d.setDate(d.getDate()-30);const l=t.filter(E=>E.status==="confirmado"||E.status==="pagado"),p=l.filter(E=>new Date(E.created_at)>=i),c=l.filter(E=>new Date(E.created_at)>=s),m=p.reduce((E,k)=>E+parseFloat(k.total||0),0),u=c.reduce((E,k)=>E+parseFloat(k.total||0),0),g=o.filter(E=>E.created_at&&new Date(E.created_at)>=d).length,y=["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],b={};y.forEach(E=>b[E]=0),l.filter(E=>new Date(E.created_at)>=d).forEach(E=>{const k=y[new Date(E.created_at).getDay()];b[k]+=parseFloat(E.total||0)});const h={};l.forEach(E=>{h[E.canal||"sucursal"]=(h[E.canal||"sucursal"]||0)+parseFloat(E.total||0)});const v={};l.forEach(E=>{v[E.forma_pago||"efectivo"]=(v[E.forma_pago||"efectivo"]||0)+1});const w={};l.forEach(E=>{w[E.empleado||"Admin"]=(w[E.empleado||"Admin"]||0)+parseFloat(E.total||0)});const C={};l.forEach(E=>{const k=new Date(E.created_at).toLocaleDateString("es-MX",{month:"short",year:"numeric"});C[k]=(C[k]||0)+parseFloat(E.total||0)});const x={};l.forEach(E=>{E.clientes&&(x[E.clientes.nombre]=(x[E.clientes.nombre]||0)+parseFloat(E.total||0))});const z=Object.entries(x).sort((E,k)=>k[1]-E[1]).slice(0,5),_=Object.entries(b).sort((E,k)=>k[1]-E[1])[0],$=Object.entries(w).sort((E,k)=>k[1]-E[1])[0],T=document.getElementById("dashboard-contenido");if(!T)return;const M=T.querySelectorAll(".stat-card"),S=[{val:"$"+m.toFixed(0),sub:p.length+" pedidos hoy",color:"var(--pink)"},{val:p.length,sub:"confirmados hoy"},{val:"$"+u.toFixed(0),sub:c.length+" pedidos"},{val:g,sub:"ultimos 30 dias"},{val:r.length,sub:"por reabastecer",color:r.length>0?"var(--amber)":"var(--green)"},{val:_?_[0]:"—",sub:_?"$"+_[1].toFixed(0)+" prom.":""},{val:$?$[0]:"—",sub:$?"$"+$[1].toFixed(0):"",small:!0},{val:o.length,sub:"registrados"}];M.forEach((E,k)=>{if(!S[k])return;const j=E.querySelector(".stat-value"),P=E.querySelector(".stat-sub");j&&(j.textContent=S[k].val,j.style.color=S[k].color||"var(--text-primary)",S[k].small&&(j.style.fontSize="1rem")),P&&(P.textContent=S[k].sub||"")});const I=document.getElementById("dash-top-clientes");I&&(I.innerHTML=z.length===0?'<p style="color:var(--text-muted);font-size:0.85rem">Sin datos aun</p>':z.map(([E,k],j)=>`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="width:22px;height:22px;background:var(--pink);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">${j+1}</span>
            <span style="flex:1;font-size:0.875rem">${E}</span>
            <strong style="color:var(--pink)">$${k.toFixed(0)}</strong>
          </div>`).join(""));const A=document.getElementById("dash-ultimos-pedidos");A&&(A.innerHTML=t.slice(0,5).map(E=>`
        <div onclick="verPedido('${E.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
          <div>
            <p style="font-size:0.85rem;font-weight:500">${E.clientes?E.clientes.nombre:"General"}</p>
            <p style="font-size:0.72rem;color:var(--text-muted)">${E.canal} · ${new Date(E.created_at).toLocaleDateString("es-MX")}</p>
          </div>
          <div style="text-align:right">
            <p style="font-weight:700;color:var(--pink)">$${E.total||0}</p>
            <span class="badge ${E.status==="confirmado"||E.status==="pagado"?"badge-success":"badge-warning"}">${E.status}</span>
          </div>
        </div>`).join("")),setTimeout(()=>{const E={responsive:!0,plugins:{legend:{labels:{color:"#666",font:{size:11}}}},scales:{x:{ticks:{color:"#666",font:{size:11}},grid:{color:"rgba(0,0,0,0.05)"}},y:{ticks:{color:"#666",font:{size:11}},grid:{color:"rgba(0,0,0,0.05)"}}}},k=document.getElementById("chart-dias");k&&window.Chart&&new Chart(k,{type:"bar",data:{labels:y,datasets:[{data:y.map(F=>b[F]||0),backgroundColor:"rgba(233,30,140,0.2)",borderColor:"#E91E8C",borderWidth:2,borderRadius:6}]},options:{...E,plugins:{legend:{display:!1}}}});const j=document.getElementById("chart-canales");j&&window.Chart&&Object.keys(h).length>0&&new Chart(j,{type:"doughnut",data:{labels:Object.keys(h),datasets:[{data:Object.values(h),backgroundColor:["rgba(233,30,140,0.7)","rgba(0,151,178,0.7)","rgba(124,58,237,0.7)","rgba(46,125,50,0.7)"],borderColor:["#E91E8C","#0097b2","#7c3aed","#2e7d32"],borderWidth:2}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{color:"#666",font:{size:11},padding:12}}}}});const P=document.getElementById("chart-meses");if(P&&window.Chart){const F=Object.entries(C).slice(-6);new Chart(P,{type:"line",data:{labels:F.map(([q])=>q),datasets:[{data:F.map(([,q])=>q),borderColor:"#0097b2",backgroundColor:"rgba(0,151,178,0.08)",borderWidth:2,pointBackgroundColor:"#0097b2",pointRadius:4,fill:!0,tension:.4}]},options:{...E,plugins:{legend:{display:!1}}}})}const D=document.getElementById("chart-pagos");D&&window.Chart&&Object.keys(v).length>0&&new Chart(D,{type:"doughnut",data:{labels:Object.keys(v),datasets:[{data:Object.values(v),backgroundColor:["rgba(46,125,50,0.7)","rgba(245,127,23,0.7)","rgba(233,30,140,0.7)","rgba(124,58,237,0.7)"],borderColor:["#2e7d32","#f57f17","#E91E8C","#7c3aed"],borderWidth:2}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{color:"#666",font:{size:11},padding:12}}}}})},300);try{const k=await(await fetch(f+"/chatbot/tareas-hoy")).json(),j=document.createElement("div");j.style.cssText="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-top:1.5rem",j.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 style="font-size:1rem;font-weight:700;margin:0">✅ Tareas pendientes hoy</h3>
        <span style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${k.filter(P=>!P.completada).length} pendientes</span>
      </div>
      ${k.length===0?'<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:1rem">Sin tareas pendientes</p>':k.map(P=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5">
            <input type="checkbox" ${P.completada?"checked":""}
                   onchange="completarTareaDashboard('${P.id}', this.checked)"
                   style="width:16px;height:16px;cursor:pointer;accent-color:#25D366">
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600;margin:0;${P.completada?"text-decoration:line-through;color:#aaa":""}">${P.titulo}</p>
              <p style="font-size:0.72rem;color:#888;margin:0">${P.nombre_contacto||P.telefono} · ${P.agente||"Sin asignar"}</p>
            </div>
            <button onclick="navegarA('conversaciones');setTimeout(()=>abrirChat('${P.telefono}'),800)"
                    style="background:#e3f2fd;border:none;border-radius:6px;padding:4px 8px;font-size:0.72rem;color:#1565c0;cursor:pointer">Ver chat</button>
          </div>
        `).join("")}
    `,document.getElementById("dashboard-contenido").appendChild(j)}catch(E){console.error("tareas:",E)}}catch(e){console.error("Error dashboard:",e)}}window.eliminarItemPedido=e=>{window._pedidoItems.splice(e,1),window.recalcularTotal(),window.renderItemsPedido()};window.cerrarSesionPanel=()=>{confirm("Cerrar sesion?")&&(sessionStorage.removeItem("erp_empleado"),sessionStorage.removeItem("erp_token"),window._empleadoActual=null,location.reload())};async function Ee(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/empleados/",{headers:window.authHeaders()})).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Empleados (${a.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormEmpleado('')">+ Nuevo empleado</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${a.map(o=>`
              <tr>
                <td><strong>${o.nombre}</strong></td>
                <td>${o.email}</td>
                <td><span class="badge ${o.rol==="admin"?"badge-info":"badge-success"}">${o.rol}</span></td>
                <td><span class="badge ${o.activo?"badge-success":"badge-danger"}">${o.activo?"Activo":"Inactivo"}</span></td>
                <td style="display:flex;gap:4px">
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormEmpleado('${o.id}')">Editar</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="toggleEmpleado('${o.id}',${o.activo})">${o.activo?"Desactivar":"Activar"}</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#E91E8C;border-color:#E91E8C" onclick="resetearPassword('${o.id}','${o.nombre}')">🔑 Reset</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.mostrarFormEmpleado=async e=>{const t=document.getElementById("content");let a={};if(e)try{a=(await(await fetch(f+"/empleados/",{headers:window.authHeaders()})).json()).find(r=>r.id===e)||{}}catch{}t.innerHTML=`
    <div class="table-card" style="padding:2rem;max-width:500px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">← Volver</button>
        <h3>${e?"Editar empleado":"Nuevo empleado"}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div><label class="form-label">Nombre *</label><input class="form-input" id="emp-nombre" placeholder="Nombre completo" value="${a.nombre||""}"></div>
        <div><label class="form-label">Email *</label><input class="form-input" id="emp-email" type="email" placeholder="correo@ejemplo.com" value="${a.email||""}"></div>
        <div><label class="form-label">${e?"Nueva contrasena (dejar vacio para no cambiar)":"Contrasena *"}</label><input class="form-input" id="emp-password" type="password" placeholder="••••••••"></div>
        <div><label class="form-label">Rol</label>
          <select class="form-input" id="emp-rol">
            <option value="vendedor" ${a.rol==="vendedor"?"selected":""}>Vendedor</option>
            <option value="admin" ${a.rol==="admin"?"selected":""}>Administrador</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarEmpleado('${e||""}')">Guardar</button>
      </div>
    </div>`};window.guardarEmpleado=async e=>{const t=document.getElementById("emp-nombre").value,a=document.getElementById("emp-email").value,o=document.getElementById("emp-password").value,n=document.getElementById("emp-rol").value;if(!t||!a){alert("Nombre y email son obligatorios");return}if(!e&&!o){alert("La contrasena es obligatoria para nuevos empleados");return}try{const r=e?"PATCH":"POST",i=e?f+"/empleados/"+e:f+"/empleados/",s={nombre:t,email:a,rol:n};o&&(s.password=o);const d=await fetch(i,{method:r,headers:window.authHeaders(),body:JSON.stringify(s)});if(d.ok)alert("Empleado guardado correctamente"),navegarA("empleados");else{const l=await d.json();alert("Error: "+(l.error||"No se pudo guardar"))}}catch{alert("Error conectando con el servidor")}};window.toggleEmpleado=async(e,t)=>{if(confirm(t?"Desactivar este empleado?":"Activar este empleado?"))try{(await fetch(f+"/empleados/"+e,{method:"PATCH",headers:window.authHeaders(),body:JSON.stringify({activo:!t})})).ok?Ee():alert("Error al cambiar estado")}catch{alert("Error conectando con el servidor")}};window.resetearPassword=async(e,t)=>{const a=prompt("Nueva contrasena para "+t+":");if(a){if(a.length<4){alert("La contrasena debe tener al menos 4 caracteres");return}try{const o=await fetch(f+"/empleados/"+e,{method:"PATCH",headers:window.authHeaders(),body:JSON.stringify({password:a})});if(o.ok)alert("Contrasena actualizada correctamente");else{const n=await o.json();alert("Error: "+(n.error||"No se pudo actualizar"))}}catch{alert("Error conectando con el servidor")}}};window.cargarConversaciones=async function(){var a;document.title="Zapatillas May";const e=document.querySelector('[data-modulo="conversaciones"]');e&&((a=e.querySelector(".nav-badge"))==null||a.remove());const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const n=await(await fetch(f+"/chatbot/chats")).json(),i=await(await fetch(f+"/productos/?select=id,nombre,imagen_principal,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,corrida_activa,activo")).json();window._chatsData={},n.forEach(d=>window._chatsData[d.telefono]=d),window._productosWA=i.filter(d=>d.activo);const s=n.reduce((d,l)=>d+(l.no_leidos||0),0);t.innerHTML=`
  <div style="display:flex;gap:8px;margin-bottom:1rem">
    <button id="tab-chats" onclick="mostrarTabWA('chats')" class="wa-tab-btn activo">💬 Conversaciones</button>
    <button id="tab-config" onclick="mostrarTabWA('config')" class="wa-tab-btn">⚙️ Configuración</button>
  </div>
  <div id="wa-tab-content">
    <div id="wa-container">
      <div id="wa-sidebar">
        <div class="wa-sidebar-header">
          <div class="wa-sidebar-title">
            <span>💬 WhatsApp</span>
            <span class="wa-new-badge">${s} nuevo${s!==1?"s":""}</span>
          </div>
          <input class="wa-search-input" placeholder="🔍 Buscar contacto..." oninput="filtrarChats(this.value)">
          <div class="wa-filters">
            <button onclick="filtrarEtiqueta('')" class="wa-pill activa">Todos</button>
            <button onclick="filtrarEtiqueta('solo_pregunta')" class="wa-pill">🔵 Pregunta</button>
            <button onclick="filtrarEtiqueta('posible_comprador')" class="wa-pill">🟡 Posible</button>
            <button onclick="filtrarEtiqueta('comprador')" class="wa-pill">🟢 Comprador</button>
            <button onclick="filtrarEtiqueta('seguimiento')" class="wa-pill">🔴 Seguim.</button>
            <button onclick="filtrarEtiqueta('frecuente')" class="wa-pill">⭐ Frecuente</button>
          </div>
        </div>
        <div class="wa-chat-list">
          ${n.length===0?'<div style="padding:2rem;text-align:center;color:#999;font-size:0.85rem">Sin conversaciones</div>':n.sort((d,l)=>new Date(l.ultimo_mensaje)-new Date(d.ultimo_mensaje)).map(d=>{var l;return`
              <div class="wa-chat-item" data-tel="${d.telefono}" data-nombre="${(d.nombre||"").toLowerCase()}" data-etiqueta="${d.etiqueta||""}"
                   onclick="abrirChat('${d.telefono}')">
                <div class="wa-avatar">
                  ${(d.nombre||d.telefono).charAt(0).toUpperCase()}
                  ${d.en_control?'<div class="wa-control-dot"></div>':""}
                </div>
                <div class="wa-chat-info">
                  <div class="wa-chat-name">${d.nombre||d.telefono}</div>
                  <div class="wa-chat-preview">${(((l=d.mensajes[0])==null?void 0:l.mensaje)||"").substring(0,40)}…</div>
                </div>
                <div class="wa-chat-meta">
                  <span class="wa-chat-time">${new Date(d.ultimo_mensaje).toLocaleDateString("es-MX",{day:"numeric",month:"short"})}</span>
                  ${d.no_leidos>0?`<span class="wa-unread">${d.no_leidos}</span>`:""}
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <div id="chat-area">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);flex-direction:column;gap:14px">
          <p style="font-size:3rem;line-height:1">💬</p>
          <p style="font-weight:700;color:var(--text-2);font-size:1rem">Selecciona una conversación</p>
          <p style="font-size:0.83rem">para ver los mensajes</p>
        </div>
      </div>
    </div>
  </div>
    `}catch(o){t.innerHTML='<p style="padding:2rem;color:red">Error: '+o.message+"</p>"}};window.mostrarTabWA=async e=>{const t=document.getElementById("tab-chats"),a=document.getElementById("tab-config");t&&t.classList.toggle("activo",e==="chats"),a&&a.classList.toggle("activo",e==="config"),e==="chats"?await window.cargarConversaciones():await mostrarConfigWA()};window.filtrarEtiqueta=e=>{document.querySelectorAll(".wa-pill").forEach(t=>t.classList.remove("activa")),event.target.classList.add("activa"),document.querySelectorAll(".wa-chat-item").forEach(t=>{const a=t.dataset.etiqueta||"";t.style.display=!e||a===e?"":"none"})};window.mostrarConfigWA=async()=>{const e=document.getElementById("content");try{const[t,a]=await Promise.all([fetch(f+"/chatbot/config").then(n=>n.json()),fetch(f+"/chatbot/respuestas-rapidas").then(n=>n.json())]),o=document.getElementById("wa-tab-content")||e;o.innerHTML=`
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
            ${a.map(n=>`
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
    `}catch(t){console.error(t)}};window.guardarConfigWA=async()=>{try{await fetch(f+"/chatbot/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje_bienvenida:document.getElementById("cfg-bienvenida").value,fuera_horario:document.getElementById("cfg-fuera").value,horario_inicio:document.getElementById("cfg-inicio").value,horario_fin:document.getElementById("cfg-fin").value,bot_activo:document.getElementById("cfg-bot").checked?"true":"false"})}),alert("Configuración guardada")}catch{alert("Error guardando")}};window.nuevaRespuestaRapida=()=>{const e=prompt("Título de la respuesta rápida:");if(!e)return;const t=prompt("Mensaje:");t&&fetch(f+"/chatbot/respuestas-rapidas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,mensaje:t,orden:99})}).then(()=>mostrarConfigWA())};window.editarRespuesta=(e,t,a)=>{const o=prompt("Título:",t);if(!o)return;const n=prompt("Mensaje:",a.replace(/\\n/g,`
`));n&&fetch(f+"/chatbot/respuestas-rapidas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:o,mensaje:n})}).then(()=>mostrarConfigWA())};window.eliminarRespuesta=e=>{confirm("¿Eliminar esta respuesta rápida?")&&fetch(f+"/chatbot/respuestas-rapidas/"+e,{method:"DELETE"}).then(()=>mostrarConfigWA())};window.filtrarChats=e=>{document.querySelectorAll(".wa-chat-item").forEach(t=>{const a=t.dataset.nombre||"",o=t.dataset.tel||"";t.style.display=!e||a.includes(e.toLowerCase())||o.includes(e)?"":"none"})};window.renderMensaje=(e,t,a)=>{if(e.tipo==="imagen_saliente"){const o=e.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`),n=o[0].trim(),r=o.slice(1).join(`
`).trim();if(n.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i))return'<img src="'+n+'" style="max-width:200px;border-radius:8px;display:block">'+(r?'<p style="font-size:0.82rem;color:#333;white-space:pre-wrap;margin-top:6px">'+r+"</p>":"")}return'<p style="font-size:0.85rem;color:#333;white-space:pre-wrap">'+e.mensaje.replace(/\[.+?\]:\s*/,"")+"</p>"};window.abrirChat=async e=>{const t=window._chatsData[e];if(!t)return;document.querySelectorAll(".wa-chat-item").forEach(r=>r.classList.remove("activo"));const a=document.querySelector(`[data-tel="${e}"]`);a&&a.classList.add("activo");const o=window.innerWidth<=900;if(o){const r=document.getElementById("wa-sidebar"),i=document.getElementById("wa-container");r&&(r.style.display="none"),i&&(i.style.gridTemplateColumns="1fr")}const n=document.getElementById("chat-area");n.style.display="flex",n.style.flexDirection="column",n.style.flex="1",n.style.minHeight="0",n.innerHTML=`
    <!-- Header compacto -->
    <div class="wa-chat-header">
      ${o?'<button onclick="volverChats()" class="wa-circ-btn">←</button>':""}
      <div class="wa-avatar-sm">${(t.nombre||t.telefono).charAt(0).toUpperCase()}</div>
      <div class="wa-header-info">
        <div class="wa-header-name">${t.nombre||t.telefono}</div>
        <div class="wa-header-sub">${t.telefono} · ${t.mensajes.length} msg</div>
      </div>
      <div class="wa-header-actions">
        ${t.en_control?`<button onclick="toggleControl('${e}', false)" class="wa-circ-btn wa-circ-on" title="Activar bot">🤖</button>`:`<button onclick="toggleControl('${e}', true)" class="wa-circ-btn wa-circ-off" title="Tomar control">👤</button>`}
        <button onclick="mostrarCatalogoWA('${e}')" class="wa-circ-btn wa-circ-prod" title="Catálogo">👠</button>
        <button onclick="mostrarRespuestasRapidas('${e}')" class="wa-circ-btn wa-circ-quick" title="Resp. rápidas">⚡</button>
        <button onclick="window.cargarConversaciones()" class="wa-circ-btn wa-circ-reload" title="Recargar">↺</button>
      </div>
    </div>

    <!-- Sub-header: estado + etiqueta -->
    <div class="wa-subheader">
      <span class="wa-bot-badge ${t.en_control?"manual":"auto"}">
        ${t.en_control?"👤 Manual":"🤖 Bot activo"}
      </span>
      <select onchange="cambiarEtiqueta('${e}', this.value)" class="wa-label-select-sm">
        <option value="sin_etiqueta" ${!t.etiqueta||t.etiqueta==="sin_etiqueta"?"selected":""}>⚪ Sin etiqueta</option>
        <option value="solo_pregunta" ${t.etiqueta==="solo_pregunta"?"selected":""}>🔵 Solo pregunta</option>
        <option value="posible_comprador" ${t.etiqueta==="posible_comprador"?"selected":""}>🟡 Posible comprador</option>
        <option value="comprador" ${t.etiqueta==="comprador"?"selected":""}>🟢 Comprador</option>
        <option value="seguimiento" ${t.etiqueta==="seguimiento"?"selected":""}>🔴 Seguimiento</option>
        <option value="frecuente" ${t.etiqueta==="frecuente"?"selected":""}>⭐ Frecuente</option>
      </select>
    </div>

    <!-- Mensajes -->
    <div id="mensajes-area">
      ${[...t.mensajes].reverse().map(r=>{var c;const i=r.tipo==="manual"||r.tipo==="imagen_saliente",s=i?((c=r.mensaje.match(/\[(.+?)\]:/))==null?void 0:c[1])||"Admin":t.nombre||t.telefono,d=r.tipo==="imagen_saliente"?r.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`)[0].trim():"",l=r.tipo==="imagen_saliente"&&d.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)?'<img src="'+d+'" style="max-width:200px;border-radius:8px;display:block">':"<p>"+r.mensaje.replace(/\[.+?\]:\s*/,"")+"</p>",p=new Date(r.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});return`
    ${r.mensaje?`
      <div class="wa-msg-row ${i?"saliente":"entrante"}">
        <span class="wa-msg-sender">${i?"👤 "+s:s}</span>
        <div class="wa-bubble ${i?"saliente":"entrante"}">${l}<div class="wa-bubble-time">${p}</div></div>
      </div>`:""}
    ${r.respuesta?`
      <div class="wa-msg-row saliente">
        <span class="wa-msg-sender">🤖 Bot</span>
        <div class="wa-bubble bot">
          <p>${r.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi,"")}</p>
          ${r.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)?r.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi).map(m=>`<img src="${m}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${m}')">`).join(""):""}
          <div class="wa-bubble-time">${p}</div>
        </div>
      </div>`:""}
  `}).join("")}
    </div>

    <!-- Input -->
    <div class="wa-input-bar">
      <div class="wa-input-row">
        <textarea id="msg-input-${e}" class="wa-textarea" placeholder="Escribe un mensaje..." rows="2"
                  onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();enviarMensajeWA('${e}')}"></textarea>
        <button onclick="enviarMensajeWA('${e}')" class="wa-send-btn">➤</button>
      </div>
    </div>

    <!-- Toggle notas/tareas -->
    <button class="wa-nt-toggle" onclick="toggleNotasTareas()">
      <span>📋 Notas y tareas</span>
      <span id="wa-nt-arrow" style="font-size:0.7rem">${o?"▲":"▼"}</span>
    </button>
    <div id="notas-tareas-panel" class="${o?"nt-collapsed":""}">
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
  `,setTimeout(()=>{const r=document.getElementById("mensajes-area");r&&(r.scrollTop=r.scrollHeight)},800),fetch(f+"/chatbot/chats/"+e+"/leido",{method:"PATCH"}),window._chatActivo=e,cargarNotasTareas(e)};window.toggleNotasTareas=()=>{const e=document.getElementById("notas-tareas-panel"),t=document.getElementById("wa-nt-arrow");if(!e)return;const a=e.classList.toggle("nt-collapsed");t&&(t.textContent=a?"▲":"▼")};window.volverChats=()=>{const e=document.getElementById("wa-sidebar"),t=document.getElementById("wa-container");e&&(e.style.display=""),t&&(t.style.gridTemplateColumns=""),document.querySelectorAll(".wa-chat-item").forEach(o=>o.classList.remove("activo"));const a=document.getElementById("chat-area");a&&(a.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);flex-direction:column;gap:14px">
      <p style="font-size:3rem;line-height:1">💬</p>
      <p style="font-weight:700;color:var(--text-2);font-size:1rem">Selecciona una conversación</p>
      <p style="font-size:0.83rem">para ver los mensajes</p>
    </div>
  `)};window.mostrarRespuestasRapidas=async e=>{const a=await(await fetch(f+"/chatbot/respuestas-rapidas")).json(),o=document.createElement("div");o.id="modal-rapidas",o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:1rem",o.innerHTML=`
    <div style="background:white;border-radius:16px 16px 0 0;width:100%;max-width:600px;max-height:60vh;overflow-y:auto;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700">⚡ Respuestas rápidas</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer">✕</button>
      </div>
      ${a.map(n=>`
        <div onclick="usarRespuestaRapida('${e}', \`${n.mensaje.replace(/`/g,"\\`")}\`)"
             style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer"
             onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">⚡ ${n.titulo}</p>
          <p style="font-size:0.78rem;color:#888">${n.mensaje}</p>
        </div>
      `).join("")}
    </div>
  `,document.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&o.remove()})};window.cargarNotasTareas=async e=>{var i;(i=window._empleadoActual)!=null&&i.nombre;const t=new Date().toISOString().split("T")[0],[a,o]=await Promise.all([fetch(f+"/chatbot/notas/"+e).then(s=>s.json()),fetch(f+"/chatbot/tareas/"+e).then(s=>s.json())]),n=document.getElementById("notas-lista-"+e);n&&(n.innerHTML=a.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin notas</p>':a.map(s=>`
        <div class="wa-nota">
          <p>${s.nota}</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small>${s.agente} · ${new Date(s.created_at).toLocaleDateString("es-MX")}</small>
            <button onclick="eliminarNota('${s.id}','${e}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
          </div>
        </div>
      `).join(""));const r=document.getElementById("tareas-lista-"+e);r&&(r.innerHTML=o.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin tareas</p>':o.map(s=>{const d=s.fecha_vence===t,l=s.fecha_vence&&s.fecha_vence<t&&!s.completada;return`
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
          `}).join(""))};window.agregarNota=async e=>{var o;const t=prompt("Escribe la nota:");if(!t)return;const a=((o=window._empleadoActual)==null?void 0:o.nombre)||"Admin";await fetch(f+"/chatbot/notas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nota:t,agente:a})}),cargarNotasTareas(e)};window.eliminarNota=async(e,t)=>{confirm("¿Eliminar nota?")&&(await fetch(f+"/chatbot/notas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.agregarTarea=async e=>{var n;const t=prompt("Título de la tarea:");if(!t)return;const a=prompt("Fecha límite (YYYY-MM-DD) o déjala vacía:"),o=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";await fetch(f+"/chatbot/tareas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:t,fecha_vence:a||null,agente:o})}),cargarNotasTareas(e)};window.completarTarea=async(e,t,a)=>{await fetch(f+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})}),cargarNotasTareas(a)};window.eliminarTarea=async(e,t)=>{confirm("¿Eliminar tarea?")&&(await fetch(f+"/chatbot/tareas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.usarRespuestaRapida=(e,t)=>{var o;(o=document.getElementById("modal-rapidas"))==null||o.remove();const a=document.getElementById("msg-input-"+e);a&&(a.value=t,a.focus(),enviarMensajeWA(e))};window.enviarMensajeWA=async e=>{var n,r;const t=document.getElementById("msg-input-"+e),a=(n=t==null?void 0:t.value)==null?void 0:n.trim();if(!a)return;t.value="";const o=((r=window._empleadoActual)==null?void 0:r.nombre)||"Admin";try{await fetch(f+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:a,agente:o})});const s=await(await fetch(f+"/chatbot/chats")).json();window._chatsData={},s.forEach(d=>window._chatsData[d.telefono]=d),abrirChat(e)}catch{alert("Error enviando mensaje")}};window.cambiarEtiqueta=async(e,t)=>{try{await fetch(f+"/chatbot/chats/"+e+"/etiqueta",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({etiqueta:t})}),window._chatsData[e]&&(window._chatsData[e].etiqueta=t)}catch{alert("Error guardando etiqueta")}};window.toggleControl=async(e,t)=>{var o;const a=((o=window._empleadoActual)==null?void 0:o.nombre)||"Admin";try{(await(await fetch(f+"/chatbot/chats/"+e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({en_control:t,agente:a})})).json()).ok&&(window._chatsData[e]&&(window._chatsData[e].en_control=t,window._chatsData[e].agente=a),abrirChat(e))}catch{alert("Error cambiando control")}};window.mostrarCatalogoWA=e=>{const t=window._productosWA||[],a=document.createElement("div");a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",a.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700">👠 Selecciona un producto</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <input class="form-input" placeholder="Buscar producto..." style="margin:1rem;font-size:0.85rem" oninput="filtrarProductosWA(this.value)">
      <div id="productos-wa-lista" style="overflow-y:auto;padding:0 1rem 1rem">
        ${t.filter(o=>o.activo).map(o=>`
  <div onclick="enviarProductoWA('${e}', '${(o.imagen_principal||"").replace(/'/g,"")}', window._buildCaption('${o.id}'))"
       style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background 0.15s"
       onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
    ${o.imagen_principal?`<img src="${o.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:6px;background:#f5f5f5;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
    <div style="flex:1">
      <p style="font-weight:600;font-size:0.88rem">${o.nombre}</p>
      <p style="font-size:0.75rem;color:#888">$${o.precio_menudeo} menudeo · $${o.precio_mayoreo3||o.precio_menudeo-30} mayoreo</p>
    </div>
    <span style="font-size:0.75rem;color:#25D366;font-weight:600">Enviar →</span>
  </div>
`).join("")}
      </div>
    </div>
  `,document.body.appendChild(a),a.addEventListener("click",o=>{o.target===a&&a.remove()})};window.filtrarProductosWA=e=>{document.querySelectorAll("#productos-wa-lista > div").forEach(t=>{t.style.display=!e||t.textContent.toLowerCase().includes(e.toLowerCase())?"":"none"})};window._buildCaption=e=>{const t=(window._productosWA||[]).find(a=>a.id===e);return t?"👠 *"+t.nombre+`*

💰 *Precios:*
• Menudeo (1-2 pares): $`+t.precio_menudeo+`
• Mayoreo 3-5 pares: $`+(t.precio_mayoreo3||t.precio_menudeo-30)+`
• Mayoreo 6+ pares: $`+(t.precio_mayoreo6||t.precio_menudeo-70)+`
• Corrida completa: $`+(t.precio_corrida||t.precio_menudeo-100)+`

🛍️ Ver y comprar: https://zapatillasmay.mx`:""};window.enviarProductoWA=async(e,t,a)=>{var r;console.log("imagenUrl:",t,"caption:",a);const o=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]');o&&o.remove(),console.log("enviando a:",e,t);const n=((r=window._empleadoActual)==null?void 0:r.nombre)||"Admin";try{if(t){const d=a.replace(/\\n/g,`
`);await fetch(f+"/chatbot/chats/"+e+"/imagen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:t,caption:d,agente:n})})}else await fetch(f+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:a,agente:n})});await new Promise(d=>setTimeout(d,1500));const s=await(await fetch(f+"/chatbot/chats")).json();window._chatsData={},s.forEach(d=>window._chatsData[d.telefono]=d),abrirChat(e)}catch{alert("Error enviando producto")}};window.cargarEnviosMasivos=async function(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[t,a,o]=await Promise.all([fetch(f+"/chatbot/plantillas").then(i=>i.json()),fetch(f+"/clientes/").then(i=>i.json()),fetch(f+"/chatbot/chats").then(i=>i.json())]),n={};a.forEach(i=>{i.telefono&&(n[i.telefono]={telefono:i.telefono,nombre:i.nombre,fuente:"cliente"})}),o.forEach(i=>{n[i.telefono]||(n[i.telefono]={telefono:i.telefono,nombre:i.nombre||i.telefono,fuente:"whatsapp",etiqueta:i.etiqueta})});const r=Object.values(n);window._envioContactos=r,window._envioChats=o,window._envioClientes=a,e.innerHTML=`
      <div style="max-width:900px">
        <div style="margin-bottom:1.5rem">
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">📣 Envíos masivos</h2>
          <p style="color:#888;font-size:0.85rem">${r.length} contactos disponibles</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:1.5rem">⚙️ Configurar campaña</h3>
            <div style="margin-bottom:1rem">
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Plantilla</label>
              <select id="envio-plantilla" class="form-input">
                ${t.map(i=>`<option value="${i.name}">${i.name}</option>`).join("")}
              </select>
            </div>
            <div style="margin-bottom:1rem">
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Audiencia</label>
              <select id="envio-filtro" class="form-input" onchange="filtrarAudienciaEnvio()">
                <option value="todos">Todos los contactos</option>
                <option value="clientes">Solo clientes</option>
                <option value="whatsapp">Solo WhatsApp</option>
                <option value="comprador">🟢 Compradores</option>
                <option value="posible_comprador">🟡 Posibles</option>
                <option value="seguimiento">🔴 Seguimiento</option>
              </select>
            </div>
            <div style="margin-bottom:1rem">
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Imagen del producto</label>
              <select id="envio-producto-sel" class="form-input" onchange="seleccionarImagenProductoEnvio()" style="margin-bottom:8px">
                <option value="">Seleccionar producto...</option>
              </select>
              <div id="envio-producto-preview" style="display:none;margin-bottom:8px;padding:8px;background:#f9f9f9;border-radius:8px;align-items:center;gap:8px">
                <img id="envio-producto-img" src="" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid #eee">
                <span id="envio-producto-nombre" style="font-size:0.82rem;font-weight:600;color:#333"></span>
              </div>
              <input type="text" id="envio-imagen" class="form-input" placeholder="O pega URL manualmente..." oninput="limpiarSelProductoEnvio()">
            </div>
            <div id="envio-resultado" style="display:none;background:#e8f5e9;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #a5d6a7"></div>
            <button id="btn-enviar-masivo" onclick="iniciarEnvioMasivo()" class="btn btn-primary" style="width:100%">📣 Enviar campaña</button>

            <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #f0f0f0">
              <p style="font-size:0.78rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:0.75rem">🛍️ Catálogo interactivo (hasta 30 productos)</p>
              <input id="envio-prod-buscador" type="text" placeholder="🔍 Buscar producto..."
                oninput="filtrarProductosEnvioInteractivo(this.value)"
                style="width:100%;padding:6px 10px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
              <div id="envio-prod-grid" style="max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;margin-bottom:6px">
                <p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando productos...</p>
              </div>
              <p id="envio-prod-count" style="font-size:0.75rem;color:#E91E8C;font-weight:600;margin-bottom:8px"></p>
              <button onclick="iniciarEnvioInteractivo()" class="btn btn-secondary" style="width:100%;border-color:#E91E8C;color:#E91E8C">🛍️ Enviar catálogo interactivo</button>
            </div>
          </div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h3 style="font-size:0.95rem;font-weight:700">👥 Contactos</h3>
              <span id="envio-count" style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${r.length}</span>
            </div>
            <div id="envio-lista" style="max-height:500px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">
              ${r.map(i=>`
                <div style="display:flex;align-items:center;gap:10px;padding:8px;background:#f9f9f9;border-radius:8px">
                  <div style="width:32px;height:32px;border-radius:50%;background:${i.fuente==="cliente"?"#e91e8c":"#25D366"};display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700;flex-shrink:0">
                    ${(i.nombre||"?").charAt(0).toUpperCase()}
                  </div>
                  <div style="flex:1;min-width:0">
                    <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.nombre}</p>
                    <p style="font-size:0.72rem;color:#888;margin:0">${i.telefono}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `,cargarProductosEnvio(),cargarProductosEnvioInteractivo()}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error: '+t.message+"</p>"}};window.filtrarAudienciaEnvio=()=>{const e=document.getElementById("envio-filtro").value,t=window._envioClientes||[],a=window._envioChats||[];let o=[];if(e==="todos"){const n={};t.forEach(r=>{r.telefono&&(n[r.telefono]={telefono:r.telefono,nombre:r.nombre,fuente:"cliente"})}),a.forEach(r=>{n[r.telefono]||(n[r.telefono]={telefono:r.telefono,nombre:r.nombre||r.telefono,fuente:"whatsapp"})}),o=Object.values(n)}else e==="clientes"?o=t.filter(n=>n.telefono).map(n=>({telefono:n.telefono,nombre:n.nombre,fuente:"cliente"})):e==="whatsapp"?o=a.map(n=>({telefono:n.telefono,nombre:n.nombre||n.telefono,fuente:"whatsapp"})):o=a.filter(n=>n.etiqueta===e).map(n=>({telefono:n.telefono,nombre:n.nombre||n.telefono,fuente:"whatsapp"}));window._envioContactos=o,document.getElementById("envio-count").textContent=o.length,document.getElementById("envio-lista").innerHTML=o.map(n=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px;background:#f9f9f9;border-radius:8px">
      <div style="width:32px;height:32px;border-radius:50%;background:${n.fuente==="cliente"?"#e91e8c":"#25D366"};display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700;flex-shrink:0">
        ${(n.nombre||"?").charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.nombre}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${n.telefono} · ${n.fuente==="cliente"?"🛍️ Cliente":"💬 WhatsApp"}</p>
      </div>
    </div>
  `).join("")};window.iniciarEnvioMasivo=async()=>{var n;const e=window._envioContactos||[];if(e.length===0){alert("No hay contactos seleccionados");return}const t=document.getElementById("envio-plantilla").value,a=document.getElementById("envio-imagen").value;if(!confirm(`¿Enviar "${t}" a ${e.length} contactos?`))return;const o=document.getElementById("btn-enviar-masivo");o.textContent="Enviando...",o.disabled=!0;try{const i=await(await fetch(f+"/chatbot/envio-masivo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plantilla:t,imagen_url:a,contactos:e})})).json(),s=document.getElementById("envio-resultado");s.style.display="block",s.style.background=i.fallidos>0?"#fff8e1":"#e8f5e9",s.innerHTML=`
      <p style="font-weight:700;margin-bottom:4px">${i.fallidos>0?"⚠️":"✅"} Campaña enviada</p>
      <p style="margin:0">Enviados: <strong>${i.enviados}</strong> · Fallidos: <strong>${i.fallidos}</strong></p>
      ${((n=i.errores)==null?void 0:n.length)>0?`<p style="font-size:0.72rem;color:#888;margin-top:4px">${i.errores.slice(0,3).join(", ")}</p>`:""}
    `}catch(r){alert("Error: "+r.message)}finally{o.textContent="📣 Enviar campaña",o.disabled=!1}};window.cargarProductosEnvioInteractivo=async()=>{const e=document.getElementById("envio-prod-grid");if(!e||window._envioProdInteractivoCargado){window._envioProdInteractivo&&renderizarEnvioProdGrid(window._envioProdInteractivo);return}try{const a=await(await fetch(f+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._envioProdInteractivo=a,window._envioProdSeleccionados=new Set,window._envioProdInteractivoCargado=!0,renderizarEnvioProdGrid(a)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:4px">Error cargando productos</p>')}};window.renderizarEnvioProdGrid=e=>{const t=document.getElementById("envio-prod-grid");if(!t)return;const a=window._envioProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin productos</p>';return}t.innerHTML=e.map(o=>{const n=o.sku_interno||o.id,r=a.has(n);return`<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;cursor:pointer;border:1px solid ${r?"#E91E8C":"#f0f0f0"};background:${r?"#fff0f8":"white"}" id="envio-prod-lbl-${n}">
      <input type="checkbox" ${r?"checked":""} onchange="toggleEnvioProd('${n}',this)" style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${o.imagen_principal?`<img src="${o.imagen_principal}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:28px;height:28px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0">${o.nombre||n}</p>
        <p style="font-size:0.65rem;color:#aaa;margin:0">${n}</p>
      </div>
    </label>`}).join(""),actualizarCountEnvioProd()};window.toggleEnvioProd=(e,t)=>{window._envioProdSeleccionados||(window._envioProdSeleccionados=new Set);const a=document.getElementById("envio-prod-lbl-"+e);if(t.checked){if(window._envioProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos");return}window._envioProdSeleccionados.add(e),a&&(a.style.borderColor="#E91E8C",a.style.background="#fff0f8")}else window._envioProdSeleccionados.delete(e),a&&(a.style.borderColor="#f0f0f0",a.style.background="white");actualizarCountEnvioProd()};window.actualizarCountEnvioProd=()=>{var a;const e=document.getElementById("envio-prod-count");if(!e)return;const t=((a=window._envioProdSeleccionados)==null?void 0:a.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:""};window.filtrarProductosEnvioInteractivo=e=>{const t=(e||"").toLowerCase().trim(),a=window._envioProdInteractivo||[];renderizarEnvioProdGrid(t?a.filter(o=>(o.nombre||"").toLowerCase().includes(t)||(o.sku_interno||"").toLowerCase().includes(t)):a)};window.iniciarEnvioInteractivo=async()=>{var o;const e=window._envioContactos||[],t=Array.from(window._envioProdSeleccionados||new Set);if(!t.length){alert("Selecciona al menos un producto");return}if(!e.length){alert("No hay contactos en la audiencia");return}if(!confirm(`¿Enviar catálogo interactivo con ${t.length} producto${t.length>1?"s":""} a ${e.length} contacto${e.length>1?"s":""}?`))return;const a=document.createElement("div");a.id="envio-interactivo-overlay",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",a.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${e.length} contacto${e.length>1?"s":""} · ${t.length} producto${t.length>1?"s":""}</p>
  </div>`,document.body.appendChild(a);try{const r=await(await fetch(f+"/chatbot/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:e.map(i=>({telefono:i.telefono,nombre:i.nombre})),skus:t,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();if(r.error){a.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
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
      ${(o=r.errores)!=null&&o.length?`<p style="font-size:0.72rem;color:#aaa;margin-bottom:1rem">${r.errores[0]}</p>`:""}
      <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(n){a.remove(),alert("Error: "+n.message)}};window.seleccionarImagenProductoEnvio=()=>{var s,d;const e=document.getElementById("envio-producto-sel"),t=document.getElementById("envio-imagen"),a=document.getElementById("envio-producto-preview"),o=document.getElementById("envio-producto-img"),n=document.getElementById("envio-producto-nombre");if(!e)return;const r=e.value,i=((d=(s=e.options[e.selectedIndex])==null?void 0:s.dataset)==null?void 0:d.nombre)||"";r?(t&&(t.value=r),a&&(a.style.display="flex"),o&&(o.src=r),n&&(n.textContent=i)):(t&&(t.value=""),a&&(a.style.display="none"))};window.limpiarSelProductoEnvio=()=>{const e=document.getElementById("envio-producto-sel"),t=document.getElementById("envio-producto-preview");e&&(e.value=""),t&&(t.style.display="none")};window.cargarProductosEnvio=async()=>{try{const t=await(await fetch(f+"/productos/")).json(),a=document.getElementById("envio-producto-sel");if(!a)return;const o=t.filter(n=>n.activo&&n.imagen_principal);a.innerHTML='<option value="">Seleccionar producto...</option>'+o.map(n=>`<option value="${n.imagen_principal}" data-nombre="${n.nombre}">${n.nombre}</option>`).join("")}catch(e){console.error("Error:",e)}};window.sincronizarColeccionesMeta=async()=>{const e=document.getElementById("btn-sync-colecciones"),t=document.getElementById("seo-colecciones-resultado");e&&(e.textContent="Sincronizando...",e.disabled=!0);try{const o=await(await fetch(f+"/catalogo/sincronizar-colecciones",{method:"POST"})).json();if(o.error)t.style.display="block",t.style.background="#ffebee",t.style.borderColor="#ef9a9a",t.innerHTML=`❌ Error: ${o.error}`;else{const n=o.resultados.filter(s=>s.accion==="creada").length,r=o.resultados.filter(s=>s.accion==="actualizada").length,i=o.resultados.filter(s=>s.accion==="error");t.style.display="block",t.style.background=i.length?"#fff8e1":"#e8f5e9",t.style.border=`1px solid ${i.length?"#ffe082":"#a5d6a7"}`,t.innerHTML=`
        ✅ <strong>${n} colecciones creadas</strong> · ${r} actualizadas
        ${i.length?`<br>⚠️ ${i.length} errores: ${i.map(s=>s.categoria+" ("+s.detalle+")").join(", ")}`:""}
        <br><small style="color:#888;margin-top:4px;display:block">${o.resultados.map(s=>`${s.categoria}: ${s.accion}`).join(" · ")}</small>
      `}}catch(a){t&&(t.style.display="block",t.style.background="#ffebee",t.innerHTML="❌ Error: "+a.message)}finally{e&&(e.textContent="🗂️ Sincronizar colecciones en Meta",e.disabled=!1)}};window.validarCantidadTalla=(e,t)=>{const a=document.getElementById("qty-"+e);if(!a)return;let o=parseInt(a.value)||0;o<0&&(o=0),o>t&&(o=t),a.value=o,a.style.borderColor=o>0?"#E91E8C":"#ddd"};window.recargarFinanzas=async e=>{await Q()};window.verOportunidad=async e=>{var a;if(window._crmData)try{const n=await(await fetch(f+"/crm/oportunidades/"+e)).json(),r=Array.isArray(n)?n[0]:n;if(!r)return;const i={contacto:"📞 Contacto",interes:"👀 Interés",cotizacion:"📋 Cotización",negociacion:"🤝 Negociación",ganado:"✅ Ganado",perdido:"❌ Perdido"},s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",s.innerHTML=`
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem">
          <div>
            <h3 style="font-size:1rem;font-weight:700;margin-bottom:4px">${r.titulo}</h3>
            <p style="font-size:0.82rem;color:#888">${((a=r.clientes)==null?void 0:a.nombre)||"Sin cliente"}</p>
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Monto estimado</p>
            <p style="font-weight:700;font-size:1.1rem;color:#E91E8C">$${parseFloat(r.monto_estimado||0).toFixed(0)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Etapa</p>
            <p style="font-weight:600;font-size:0.88rem">${i[r.etapa]||r.etapa}</p>
          </div>
        </div>
        ${r.fecha_cierre?`<p style="font-size:0.82rem;color:#888;margin-bottom:1rem">📅 Cierre estimado: ${new Date(r.fecha_cierre).toLocaleDateString("es-MX")}</p>`:""}
        ${r.notas?`<div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem"><p style="font-size:0.78rem;color:#888;margin-bottom:4px">Notas</p><p style="font-size:0.85rem">${r.notas}</p></div>`:""}
        <div style="display:flex;gap:1rem;justify-content:flex-end;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="this.closest('div[style*=fixed]').remove()">Cerrar</button>
          <select class="form-input" style="flex:1" onchange="actualizarEtapaOportunidad('${r.id}', this.value)">
            ${Object.entries(i).map(([d,l])=>`<option value="${d}" ${r.etapa===d?"selected":""}>${l}</option>`).join("")}
          </select>
        </div>
      </div>
    `,document.body.appendChild(s),s.addEventListener("click",d=>{d.target===s&&s.remove()})}catch(o){console.error("Error verOportunidad",o)}};window.actualizarEtapaOportunidad=async(e,t)=>{var a;try{await fetch(f+"/crm/oportunidades/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({etapa:t})}),(a=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]'))==null||a.remove(),mostrarPipeline()}catch{alert("Error actualizando etapa")}};window.completarTareaDashboard=async(e,t)=>{try{await fetch(f+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})})}catch(a){console.error(a)}};async function He(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>';try{const a=await(await fetch(f+"/seo/config")).json(),o={};a.forEach(n=>o[n.clave]=n.valor||""),e.innerHTML=`
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
              <input class="form-input" id="seo-titulo" value="${o.meta_titulo_home}" placeholder="Zapatillas May | Calzado de Moda...">
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 50-60 caracteres. Actual: <span id="seo-titulo-count">${o.meta_titulo_home.length}</span></p>
            </div>
            <div>
              <label class="form-label">Meta descripcion (home)</label>
              <textarea class="form-input" id="seo-desc" rows="3" placeholder="Descripcion para Google...">${o.meta_descripcion_home}</textarea>
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 150-160 caracteres. Actual: <span id="seo-desc-count">${o.meta_descripcion_home.length}</span></p>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Analiticas y Pixels</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Google Analytics ID</label>
              <input class="form-input" id="seo-ga" value="${o.google_analytics_id}" placeholder="G-XXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Facebook Pixel ID</label>
              <input class="form-input" id="seo-fb" value="${o.facebook_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Search Console (verification)</label>
              <input class="form-input" id="seo-gsc" value="${o.google_search_console||""}" placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Tag Manager ID</label>
              <input class="form-input" id="seo-gtm" value="${o.google_tag_manager||""}" placeholder="GTM-XXXXXXX">
            </div>
            <div>
              <label class="form-label">TikTok Pixel ID</label>
              <input class="form-input" id="seo-tt" value="${o.tiktok_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">WhatsApp flotante</label>
              <input class="form-input" id="seo-wa" value="${o.whatsapp_flotante}" placeholder="524771234567">
            </div>
          </div>
        </div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
  <h3 style="margin-bottom:1.5rem">Imagen Hero (portada)</h3>
  <div style="display:grid;gap:1rem">
    <div>
      <label class="form-label">URL de imagen de fondo</label>
      <input class="form-input" id="seo-hero-img" value="${(o.hero_imagen||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
      <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Pega la URL de Cloudinary de la imagen que quieres como fondo de la portada</p>
    </div>
    ${(o.hero_imagen||"")!==""?'<img src="'+(o.hero_imagen||"")+'" style="max-height:160px;object-fit:cover;border-radius:8px;border:1px solid #eee">':""}
  </div>
</div>
<div>
  <label class="form-label">URL Favicon</label>
  <input class="form-input" id="seo-favicon" value="${(o.favicon_url||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
  <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Icono que aparece en la pestaña del navegador (recomendado 32x32px)</p>
</div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Redes Sociales</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Instagram URL</label>
              <input class="form-input" id="seo-ig" value="${o.instagram_url}" placeholder="https://instagram.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">Facebook URL</label>
              <input class="form-input" id="seo-fb-url" value="${o.facebook_url}" placeholder="https://facebook.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">TikTok URL</label>
              <input class="form-input" id="seo-tt-url" value="${o.tiktok_url}" placeholder="https://tiktok.com/@zapatillasmay">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Horarios</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Lunes</label>
              <input class="form-input" id="seo-hor-lunes" value="${o.horario_lunes||"10:00 - 15:00"}" placeholder="10:00 - 15:00">
            </div>
            <div>
              <label class="form-label">Martes a Viernes</label>
              <input class="form-input" id="seo-hor1" value="${o.horario_semana}" placeholder="10:00 - 19:00">
            </div>
            <div>
              <label class="form-label">Sabado</label>
              <input class="form-input" id="seo-hor2" value="${o.horario_sabado}" placeholder="10:00 - 15:00">
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
    `,document.getElementById("seo-titulo").addEventListener("input",function(){document.getElementById("seo-titulo-count").textContent=this.value.length}),document.getElementById("seo-desc").addEventListener("input",function(){document.getElementById("seo-desc-count").textContent=this.value.length})}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.guardarSEO=async()=>{const e={favicon_url:document.getElementById("seo-favicon").value,hero_imagen:document.getElementById("seo-hero-img").value,meta_titulo_home:document.getElementById("seo-titulo").value,meta_descripcion_home:document.getElementById("seo-desc").value,google_analytics_id:document.getElementById("seo-ga").value,google_search_console:document.getElementById("seo-gsc").value,google_tag_manager:document.getElementById("seo-gtm").value,facebook_pixel_id:document.getElementById("seo-fb").value,tiktok_pixel_id:document.getElementById("seo-tt").value,whatsapp_flotante:document.getElementById("seo-wa").value,instagram_url:document.getElementById("seo-ig").value,facebook_url:document.getElementById("seo-fb-url").value,tiktok_url:document.getElementById("seo-tt-url").value,horario_lunes:document.getElementById("seo-hor-lunes").value,horario_semana:document.getElementById("seo-hor1").value,horario_sabado:document.getElementById("seo-hor2").value};try{(await fetch(f+"/seo/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?alert("Configuracion SEO guardada correctamente"):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};async function de(){const e=document.getElementById("content");try{const a=await(await fetch(f+"/catalogos/todos")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Catálogos (${a.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCatalogo()">+ Nuevo catálogo</button>
        </div>
        <div id="catalogos-form-area"></div>
        ${a.length===0?`
          <div style="padding:3rem;text-align:center;color:#888">
            <div style="font-size:2.5rem;margin-bottom:12px">📖</div>
            <p>Aún no tienes catálogos. ¡Crea el primero!</p>
          </div>`:`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;padding:8px 0 4px">
          ${a.map(o=>`
            <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
              ${o.portada_url?`<img src="${o.portada_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">`:'<div style="width:100%;aspect-ratio:3/4;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:3rem">📖</div>'}
              <div style="padding:14px">
                ${o.temporada?`<p style="font-size:0.68rem;letter-spacing:2px;color:#C8967A;text-transform:uppercase;margin-bottom:4px">${o.temporada}</p>`:""}
                <p style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${o.nombre}</p>
                <p style="font-size:0.75rem;color:#888;margin-bottom:12px">${o.activo?"✅ Visible":"🔴 Oculto"}</p>
                <div style="display:flex;flex-direction:column;gap:6px">
                  <button class="btn btn-primary" style="padding:6px;font-size:0.8rem" onclick="gestionarPaginas('${o.id}','${(o.nombre||"").replace(/'/g,"\\'")}')">📄 Gestionar páginas</button>
                  <button class="btn btn-secondary" style="padding:6px;font-size:0.8rem" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${o.id}','_blank')">👁 Vista previa</button>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem" onclick="mostrarFormCatalogo('${o.id}')">✏️ Editar</button>
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem;color:${o.activo?"#dc2626":"#16a34a"}" onclick="toggleCatalogo('${o.id}',${o.activo})">${o.activo?"Ocultar":"Publicar"}</button>
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
    </div>`,e&&fetch(f+"/catalogos/"+e).then(a=>a.json()).then(a=>{const o=Array.isArray(a)?a[0]:a;o&&(document.getElementById("cat-nombre").value=o.nombre||"",document.getElementById("cat-temporada").value=o.temporada||"",o.portada_url&&(document.getElementById("cat-portada-url").value=o.portada_url,document.getElementById("cat-portada-nombre").textContent="Portada actual",document.getElementById("cat-portada-preview").innerHTML=`<img src="${o.portada_url}" style="height:80px;border-radius:6px;object-fit:cover">`))}))};window.previewPortadaCat=function(e){const t=e.files[0];if(!t)return;document.getElementById("cat-portada-nombre").textContent=t.name;const a=new FileReader;a.onload=o=>{document.getElementById("cat-portada-preview").innerHTML=`<img src="${o.target.result}" style="height:80px;border-radius:6px;object-fit:cover">`},a.readAsDataURL(t)};window.guardarCatalogo=async function(e){const t=document.getElementById("cat-nombre").value.trim();if(!t){alert("El nombre es obligatorio");return}const a=document.getElementById("cat-temporada").value.trim();let o=document.getElementById("cat-portada-url").value;const n=document.getElementById("cat-portada-file");if(n.files.length>0){const i=new FormData;i.append("archivo",n.files[0]),i.append("carpeta","catalogos");try{o=(await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:i})).json()).url||o}catch(s){alert("Error subiendo portada: "+s.message);return}}const r={nombre:t,temporada:a,portada_url:o||null};try{e?await fetch(f+"/catalogos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}):await fetch(f+"/catalogos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),await de()}catch(i){alert("Error guardando: "+i.message)}};window.toggleCatalogo=async function(e,t){confirm(t?"¿Ocultar este catálogo de la tienda?":"¿Publicar este catálogo en la tienda?")&&(await fetch(f+"/catalogos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({activo:!t})}),await de())};window.gestionarPaginas=async function(e,t){const a=document.getElementById("content");a.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[o,n]=await Promise.all([fetch(f+"/catalogos/"+e),fetch(f+"/catalogos/"+e+"/paginas")]),r=await o.json(),i=Array.isArray(r)?r[0]:r,s=await n.json();window._catalogoPaginasData={catalogoId:e,nombre:t,paginas:s,tabActiva:"subir",portada_url:(i==null?void 0:i.portada_url)||null},Ne()}catch(o){a.innerHTML='<p style="padding:2rem;color:red">Error: '+o.message+"</p>"}};function ie(e,t){return`padding:9px 18px;font-size:0.83rem;font-weight:600;border:none;cursor:pointer;border-bottom:3px solid ${e===t?"#C8967A":"transparent"};background:none;color:${e===t?"#C8967A":"#6b7280"};transition:all 0.2s;font-family:inherit`}function Ne(){const{catalogoId:e,nombre:t,paginas:a,tabActiva:o,portada_url:n}=window._catalogoPaginasData,r=document.getElementById("content");a.length>0&&Math.max(...a.map(i=>i.pagina_numero))+1,r.innerHTML=`
    <div class="table-card">
      <div class="table-header">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem" onclick="navegarA('catalogos')">← Catálogos</button>
          <h3>📖 ${t} <span style="color:#888;font-weight:400">(${a.length} páginas)</span></h3>
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem;margin-left:auto" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${e}','_blank')">👁 Vista previa</button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:2px solid #e5e7eb;margin-bottom:20px;gap:4px">
        <button style="${ie(o,"subir")}" onclick="switchTabCat('subir')">📁 Subir imágenes</button>
        <button style="${ie(o,"seleccionar")}" onclick="switchTabCat('seleccionar')">🖼 De la tienda</button>
        <button style="${ie(o,"generar")}" onclick="switchTabCat('generar')">✨ Generar automático</button>
      </div>

      <!-- Tab: SUBIR -->
      <div id="tab-subir" style="display:${o==="subir"?"block":"none"}">
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
      <div id="tab-seleccionar" style="display:${o==="seleccionar"?"block":"none"}">
        <div id="selector-tienda-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando fotos de tus productos...</p>
        </div>
      </div>

      <!-- Tab: GENERAR AUTOMÁTICO -->
      <div id="tab-generar" style="display:${o==="generar"?"block":"none"}">
        <div id="generador-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando productos...</p>
        </div>
      </div>

      <!-- Páginas actuales -->
      <div style="margin-top:28px">
        ${n||a.length>0?`
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
          ${a.map((i,s)=>`
            <div style="background:white;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              <img src="${i.imagen_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
              <div style="padding:6px 8px">
                <div style="font-size:0.7rem;font-weight:600;color:#374151;margin-bottom:4px">Pág ${i.pagina_numero}</div>
                <div style="display:flex;gap:3px;flex-wrap:wrap">
                  ${s>0?`<button onclick="moverPagina('${i.id}','up')" title="Mover arriba" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↑</button>`:""}
                  ${s<a.length-1?`<button onclick="moverPagina('${i.id}','down')" title="Mover abajo" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↓</button>`:""}
                  <button onclick="usarComoPortada('${i.imagen_url}','${e}')" title="Usar como portada" style="flex:1;background:#fef3c7;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">🖼</button>
                  <button onclick="eliminarPagina('${i.id}','${e}')" title="Eliminar" style="flex:1;background:#fee2e2;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem;color:#dc2626">✕</button>
                </div>
              </div>
            </div>`).join("")}
        </div>`:`
        <div style="text-align:center;padding:24px;color:#9ca3af;border:1px dashed #e5e7eb;border-radius:10px">
          <p>Aún no hay páginas. Usa una de las opciones de arriba para agregarlas.</p>
        </div>`}
      </div>
    </div>`,o==="seleccionar"&&_e(e),o==="generar"&&Ce(e)}window.switchTabCat=function(e){const{catalogoId:t}=window._catalogoPaginasData;window._catalogoPaginasData.tabActiva=e,document.querySelectorAll("#tab-subir,#tab-seleccionar,#tab-generar").forEach(a=>a.style.display="none"),document.getElementById("tab-"+e).style.display="block",document.querySelectorAll('[onclick^="switchTabCat"]').forEach(a=>{var n;const o=(n=a.getAttribute("onclick").match(/'(\w+)'/))==null?void 0:n[1];a.style.borderBottomColor=o===e?"#C8967A":"transparent",a.style.color=o===e?"#C8967A":"#6b7280"}),e==="seleccionar"&&_e(t),e==="generar"&&Ce(t)};window.descargarCatalogoPDF=async function(){const e=window._catalogoPaginasData;if(!e)return;const{portada_url:t,paginas:a,nombre:o}=e,n=[];if(t&&n.push(t),[...a].sort((s,d)=>s.pagina_numero-d.pagina_numero).forEach(s=>{s.imagen_url&&n.push(s.imagen_url)}),n.length===0){alert("No hay páginas para descargar.");return}const i=document.querySelector('[onclick="descargarCatalogoPDF()"]');i&&(i.disabled=!0,i.textContent="⏳ Generando PDF...");try{window.jspdf||await new Promise((b,h)=>{const v=document.createElement("script");v.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",v.onload=b,v.onerror=h,document.head.appendChild(v)});const{jsPDF:s}=window.jspdf,d=b=>new Promise(h=>{const v=new Image;v.crossOrigin="anonymous",v.onload=()=>{const w=document.createElement("canvas");w.width=v.naturalWidth||v.width,w.height=v.naturalHeight||v.height,w.getContext("2d").drawImage(v,0,0),h({dataUrl:w.toDataURL("image/jpeg",.92),w:w.width,h:w.height})},v.onerror=()=>h(null),v.src=b}),p=(await Promise.all(n.map(d))).filter(Boolean);if(p.length===0){alert("No se pudieron cargar las imágenes. Revisa tu conexión.");return}const c=210,m=280,u=new s({unit:"mm",format:[c,m]}),g=(b,h)=>{h||u.addPage([c,m]);const v=b.w/b.h,w=c/m;let C,x,z,_;v>w?(C=c,x=c/v,z=0,_=(m-x)/2):(x=m,C=m*v,_=0,z=(c-C)/2),u.addImage(b.dataUrl,"JPEG",z,_,C,x)};p.forEach((b,h)=>g(b,h===0));const y=(o||"catalogo").replace(/[^a-zA-Z0-9_\-áéíóúñÁÉÍÓÚÑ ]/g,"").trim()||"catalogo";u.save(`${y}.pdf`)}catch(s){console.error("Error generando PDF:",s),alert("Error al generar el PDF: "+s.message)}finally{i&&(i.disabled=!1,i.innerHTML="📥 Descargar PDF")}};async function _e(e){const t=document.getElementById("selector-tienda-content");if(t)try{const[a,o]=await Promise.all([fetch(f+"/variantes/"),fetch(f+"/productos/")]),n=await a.json(),r=await o.json(),i=[];n.forEach(d=>{const l=r.find(c=>c.id===d.producto_id),p=(l==null?void 0:l.nombre)||d.sku||"";d.foto_url&&i.push({url:d.foto_url,nombre:p,color:d.color||""}),d.imagenes&&Array.isArray(d.imagenes)&&d.imagenes.forEach(c=>{c&&c!==d.foto_url&&i.push({url:c,nombre:p,color:d.color||""})})});const s=i.filter((d,l,p)=>p.findIndex(c=>c.url===d.url)===l);window._selectorFotos={fotos:s,seleccionadas:new Set},t.innerHTML=`
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
      </div>`}catch(a){t.innerHTML='<p style="color:red">Error: '+a.message+"</p>"}}window._toggleFoto=function(e){const{seleccionadas:t,fotos:a}=window._selectorFotos,o=document.getElementById("foto-item-"+e),n=document.getElementById("foto-check-"+e);t.has(e)?(t.delete(e),o.style.borderColor="transparent",n.style.display="none"):(t.add(e),o.style.borderColor="#C8967A",n.style.display="flex"),document.getElementById("sel-count").textContent=t.size+" seleccionadas"};window._filtrarSelectorFotos=function(e){const{fotos:t}=window._selectorFotos,a=e.toLowerCase();t.forEach((o,n)=>{const r=document.getElementById("foto-item-"+n);r&&(r.style.display=!a||o.nombre.toLowerCase().includes(a)||o.color.toLowerCase().includes(a)?"":"none")})};window.agregarSeleccionadas=async function(e){const{seleccionadas:t,fotos:a}=window._selectorFotos;if(!t.size){alert("Selecciona al menos una foto");return}const{paginas:o}=window._catalogoPaginasData;let n=o.length>0?Math.max(...o.map(i=>i.pagina_numero))+1:1;const r=event.target;r.disabled=!0,r.textContent="Agregando...";for(const i of t)await fetch(f+"/catalogos/"+e+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:a[i].url,pagina_numero:n++})});await gestionarPaginas(e,window._catalogoPaginasData.nombre)};async function Ce(e){const t=document.getElementById("generador-content");if(t)try{const[a,o]=await Promise.all([fetch(f+"/productos/"),fetch(f+"/variantes/")]),n=(await a.json()).filter(s=>s.activo&&s.imagen_principal),r=await o.json(),i=n.map(s=>{const d=r.filter(c=>c.producto_id===s.id&&c.activa!==!1),l=[],p=new Set;for(const c of d){const m=(c.color||"").trim();m&&!p.has(m)&&(p.add(m),l.push({color:m,hex:c.color_hex||"#999",foto:c.foto_url}))}return l});window._generadorData={productos:n,variantes:r,catalogoId:e,seleccionados:new Set,coloresPorProd:i},t.innerHTML=`
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
        ${n.map((s,d)=>{const l=r.filter(u=>u.producto_id===s.id),p=s.precio_menudeo||0,c=i[d],m=c.length>1?`<div id="gen-colores-${d}" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:5px;opacity:0.35;pointer-events:none">
                ${c.map((u,g)=>`
                  <div id="gen-col-${d}-${g}"
                       title="${u.color}"
                       onclick="event.stopPropagation();_toggleColorGen(${d},${g})"
                       data-sel="1"
                       style="width:13px;height:13px;border-radius:50%;background:${u.hex};border:2px solid #C8967A;cursor:pointer;flex-shrink:0;box-sizing:border-box;transition:opacity 0.15s,border-color 0.15s">
                  </div>`).join("")}
               </div>`:"";return`
          <div id="gen-item-${d}" onclick="_toggleGenProd(${d})"
               style="cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.15s;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
            <img src="${s.imagen_principal}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
            <div style="padding:5px 7px 7px">
              <p style="font-size:0.62rem;font-weight:600;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.nombre}</p>
              <p style="font-size:0.6rem;color:#C8967A;font-weight:600">$${p||"—"}</p>
              ${m}
            </div>
          </div>`}).join("")}
      </div>`}catch(a){t.innerHTML='<p style="color:red">Error: '+a.message+"</p>"}}window._toggleGenProd=function(e){const{seleccionados:t}=window._generadorData,a=document.getElementById("gen-item-"+e),o=document.getElementById("gen-colores-"+e);t.has(e)?(t.delete(e),a.style.borderColor="transparent",o&&(o.style.opacity="0.35",o.style.pointerEvents="none")):(t.add(e),a.style.borderColor="#C8967A",o&&(o.style.opacity="1",o.style.pointerEvents="auto")),document.getElementById("gen-count").textContent=t.size+" seleccionados"};window._toggleColorGen=function(e,t){var n,r;const a=document.getElementById(`gen-col-${e}-${t}`);if(!a)return;const o=a.dataset.sel==="1";a.dataset.sel=o?"0":"1",a.style.borderColor=o?"#ccc":"#C8967A",a.style.opacity=o?"0.3":"1",a.title=(((r=(n=window._generadorData.coloresPorProd[e])==null?void 0:n[t])==null?void 0:r.color)||"")+(o?" (excluido)":"")};window._selTodosGenerador=function(){const{productos:e,seleccionados:t}=window._generadorData,a=t.size===e.length;t.clear(),e.forEach((o,n)=>{const r=document.getElementById("gen-item-"+n);a?r&&(r.style.borderColor="transparent"):(t.add(n),r&&(r.style.borderColor="#C8967A"))}),document.getElementById("gen-count").textContent=t.size+" seleccionados"};function oe(e){return new Promise(t=>{const a=new Image;a.crossOrigin="anonymous",a.onload=()=>t(a),a.onerror=()=>t(null),a.src=e+(e.includes("?")?"&":"?")+"_t="+Date.now()})}function le(e,t,a,o,n,r){const i=t.split(" ");let s="",d=o;for(let l of i){const p=s+(s?" ":"")+l;e.measureText(p).width>n&&s?(e.fillText(s,a,d),s=l,d+=r):s=p}return s&&e.fillText(s,a,d),d+r}window.generarPaginasCanvas=async function(e){const{productos:t,variantes:a,seleccionados:o,coloresPorProd:n}=window._generadorData;if(!o.size){alert("Selecciona al menos un producto");return}const r=document.getElementById("gen-layout").value,i=r==="1e"?1:parseInt(r),s=[];Array.from(o).sort((b,h)=>b-h).forEach(b=>{const h=t[b],v=n?n[b]:[];if(!v||v.length<=1)s.push({prod:h,origIdx:b,colorFiltro:null,todosColSel:v||[]});else{const w=v.filter((x,z)=>{const _=document.getElementById(`gen-col-${b}-${z}`);return!_||_.dataset.sel!=="0"}),C=w.length>0?w:v;for(const x of C)s.push({prod:h,origIdx:b,colorFiltro:x.color,todosColSel:C})}});const d=b=>{const h=a.filter(v=>v.producto_id===b.prod.id&&v.activa!==!1);return b.colorFiltro?h.filter(v=>(v.color||"").trim()===b.colorFiltro):h},l=[];for(let b=0;b<s.length;b+=i)l.push(s.slice(b,b+i));const p=document.getElementById("btn-generar"),c=document.getElementById("gen-progress"),m=document.getElementById("gen-msg"),u=document.getElementById("gen-bar");p.disabled=!0,c.style.display="block";const{paginas:g}=window._catalogoPaginasData;let y=g.length>0?Math.max(...g.map(b=>b.pagina_numero))+1:1;for(let b=0;b<l.length;b++){const h=l[b],v=$=>($==null?void 0:$.prod)??$,w=$=>($==null?void 0:$.origIdx)??t.indexOf(($==null?void 0:$.prod)??$);m.textContent=`Generando página ${b+1} de ${l.length}...`,u.style.width=b/l.length*100+"%";const C=document.createElement("canvas");C.width=1080,C.height=1440;const x=C.getContext("2d");if(x.fillStyle="#FAFAF8",x.fillRect(0,0,1080,1440),x.fillStyle="#C8967A",x.fillRect(60,48,960,1),x.fillStyle="#2A1A0E",x.font="300 22px DM Sans, sans-serif",x.textAlign="center",x.letterSpacing="8px",x.fillText("ZAPATILLAS MAY",540,42),x.letterSpacing="0px",x.fillStyle="#C8967A",x.fillRect(60,58,960,1),r==="1e"){const $=h[0],T=v($),M=d($),S=[],I=new Set,A=B=>{B&&!I.has(B)&&(I.add(B),S.push(B))};M.length>0&&M[0].foto_url?A(M[0].foto_url):A(T.imagen_principal);for(const B of M)if(A(B.foto_url),Array.isArray(B.imagenes)&&B.imagenes.forEach(A),S.length>=3)break;const E=S.length,k=($.todosColSel||[]).map(B=>({color:B.color,hex:B.hex})),j={negro:"#1C1C1C",blanco:"#F8F8F8",hueso:"#F0EBE1",beige:"#D9C9A8",camel:"#C19A6B","cafe claro":"#A0725A","cafe medio":"#7A4A30","cafe oscuro":"#4A2010",cafe:"#6B3A2A",chocolate:"#3D1C02",cognac:"#9B4421",taupe:"#8B7355",nude:"#D4A97A","nude claro":"#E8C9A8","nude oscuro":"#C0886A","nude rosa":"#DDA090","palo de rosa":"#D4A0A0",salmon:"#FA8072",coral:"#FF6B4A",rojo:"#CC2200",vino:"#722F37",bordo:"#800020","rosa claro":"#F9C0CB",rosa:"#F4607A",fusha:"#E91E8C",naranja:"#FF8C00",amarillo:"#F5C518",dorado:"#D4AF37",oro:"#CFB53B","oro rosa":"#E8B4B8",plateado:"#C0C0C0","azul claro":"#5B8DB8",azul:"#1E4080","azul marino":"#001F5B",turquesa:"#40C4AA",verde:"#2D6A4F","verde menta":"#98D8C8","gris claro":"#C8C8C8",gris:"#909090","gris oscuro":"#505050",morado:"#7B2D8B",lila:"#C8A0D8",multicolor:"#CCAA88"},P=({color:B,hex:H})=>{if(H&&H.startsWith("#"))return H;const L=(B||"").toLowerCase();if(j[L])return j[L];for(const[O,N]of Object.entries(j))if(L.includes(O))return N;return"#BBAA99"},D=(B,H,L,O,N)=>{if(x.save(),x.fillStyle="#FFFFFF",x.fillRect(H,L,O,N),B){x.beginPath(),x.rect(H,L,O,N),x.clip();const R=B.naturalWidth/B.naturalHeight,G=O/N;let U,J,K,X;R>G?(K=O,X=O/R,U=H,J=L+(N-X)/2):(X=N,K=N*R,J=L,U=H+(O-K)/2),x.drawImage(B,U,J,K,X)}x.restore()},F=62,q=1080,V=F+q+12;if(E>=3){const[B,H,L]=await Promise.all(S.slice(0,3).map(oe)),O=10,N=10,R=648,G=1080-R-O,U=Math.floor((q-N)/2);D(B,0,F,R,q),D(H,R+O,F,G,U),D(L,R+O,F+U+N,G,U)}else if(E===2){const[B,H]=await Promise.all(S.map(oe)),L=10,O=Math.floor((1080-L)/2);D(B,0,F,O,q),D(H,O+L,F,O,q)}else{const[B]=await Promise.all([oe(S[0])]);D(B,40,F,1e3,q)}if(x.fillStyle="#E8DDD5",x.fillRect(0,V,1080,1),x.fillStyle="#2A1A0E",x.textAlign="center",x.font="300 28px DM Sans, sans-serif",x.letterSpacing="3px",le(x,T.nombre.toUpperCase(),540,V+42,960,38),x.letterSpacing="0px",T.sku&&(x.fillStyle="#A07860",x.font="400 14px DM Mono, monospace",x.fillText(T.sku,540,V+66)),k.length>0){const L=Math.min(k.length,14),O=L*(11*2)+(L-1)*8;let N=Math.round(540-O/2+11);const R=V+100;for(let G=0;G<L;G++){const U=N+G*30;x.beginPath(),x.arc(U,R,11,0,Math.PI*2),x.fillStyle=P(k[G]),x.fill(),x.strokeStyle="rgba(0,0,0,0.18)",x.lineWidth=1.5,x.stroke()}}}else{const $=i<=2?i:2,T=i===4?2:1,M=80,S=100,I=i===1?0:20,A=i===4?20:0,E=i===1?40:28,k=(1080-E*2-I*($-1))/$,j=(1440-M-S-A*(T-1))/T;for(let P=0;P<h.length;P++){const D=v(h[P]);w(h[P]);const F=P%$,q=Math.floor(P/$),V=E+F*(k+I),B=M+q*(j+A),H=i===1?120:i===2?90:70,L=j-H,O=d(h[P]),N=O.length>0&&O[0].foto_url?O[0].foto_url:D.imagen_principal,R=await oe(N);if(x.save(),x.fillStyle="#FFFFFF",x.fillRect(V,B,k,L),R){x.beginPath(),x.rect(V,B,k,L),x.clip();const J=R.naturalWidth/R.naturalHeight,K=k/L;let X,re,ee,te;J>K?(ee=k,te=k/J,X=V,re=B+(L-te)/2):(te=L,ee=L*J,re=B,X=V+(k-ee)/2),x.drawImage(R,X,re,ee,te)}x.restore(),x.fillStyle="#E8DDD5",x.fillRect(V,B+L,k,1);const G=B+L+H/2;x.fillStyle="#2A1A0E",x.textAlign="center";const U=i===1?34:i===2?24:19;x.font=`300 ${U}px DM Sans, sans-serif`,x.letterSpacing="2px",le(x,D.nombre.toUpperCase(),V+k/2,G-8,k-32,U+10),x.letterSpacing="0px",D.sku&&(x.fillStyle="#A07860",x.font=`400 ${i===1?18:13}px DM Mono, monospace`,x.fillText(D.sku,V+k/2,G+(i===1?36:26)))}}x.fillStyle="#C8967A",x.fillRect(60,1340,960,1),x.fillStyle="#A07860",x.font="300 18px DM Sans, sans-serif",x.textAlign="center",x.letterSpacing="3px",x.fillText("@ZAPATILLASMAY",540,1368),x.letterSpacing="0px",x.fillStyle="#C0A898",x.font="300 15px DM Sans, sans-serif",x.fillText("zapatillasmay.mx  ·  León, Guanajuato",540,1394);const z=await new Promise($=>C.toBlob($,"image/jpeg",.92)),_=new FormData;_.append("archivo",z,`catalogo-pag-${y}.jpg`);try{const T=await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:_})).json();T.url&&await fetch(f+"/catalogos/"+e+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:T.url,pagina_numero:y++})})}catch($){console.error("Error subiendo página generada",$)}}u.style.width="100%",m.textContent=`✅ ${l.length} páginas generadas`,setTimeout(()=>{c.style.display="none"},2e3),p.disabled=!1,await gestionarPaginas(e,window._catalogoPaginasData.nombre)};window.subirPaginasCatalogo=async function(e,t){const a=Array.from(e.files||e);if(!a.length)return;const o=document.getElementById("upload-progress"),n=document.getElementById("upload-msg"),r=document.getElementById("upload-bar");o&&(o.style.display="block");const{paginas:i}=window._catalogoPaginasData;let s=i.length>0?Math.max(...i.map(d=>d.pagina_numero))+1:1;for(let d=0;d<a.length;d++){n&&(n.textContent=`Subiendo ${d+1} de ${a.length}...`),r&&(r.style.width=d/a.length*100+"%");try{const l=new FormData;l.append("archivo",a[d]);const c=await(await fetch(f+"/imagenes/subir?carpeta=catalogos",{method:"POST",body:l})).json();c.url&&await fetch(f+"/catalogos/"+t+"/paginas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:c.url,pagina_numero:s++})})}catch(l){console.error("Error subiendo página "+(d+1),l)}}r&&(r.style.width="100%"),n&&(n.textContent="✅ Listo"),setTimeout(()=>{o&&(o.style.display="none")},1500),e.value!==void 0&&(e.value=""),await gestionarPaginas(t,window._catalogoPaginasData.nombre)};window.moverPagina=async function(e,t){const{paginas:a,catalogoId:o,nombre:n}=window._catalogoPaginasData,r=a.findIndex(l=>l.id===e);if(r===-1)return;const i=t==="up"?r-1:r+1;if(i<0||i>=a.length)return;const s=a[r].pagina_numero,d=a[i].pagina_numero;await Promise.all([fetch(f+"/catalogos/paginas/"+a[r].id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina_numero:d})}),fetch(f+"/catalogos/paginas/"+a[i].id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina_numero:s})})]),await gestionarPaginas(o,n)};window.eliminarPagina=async function(e,t){confirm("¿Eliminar esta página?")&&(await fetch(f+"/catalogos/paginas/"+e,{method:"DELETE"}),await gestionarPaginas(t,window._catalogoPaginasData.nombre))};window.usarComoPortada=async function(e,t){await fetch(f+"/catalogos/"+t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({portada_url:e})}),alert("✅ Portada actualizada")};window.mlVerStock=async function(e){const t=e.innerHTML;e.innerHTML="⏳ Consultando...",e.disabled=!0;const a=document.getElementById("ml-resultado");try{const n=await(await fetch(f+"/ml/stock")).json();if(a.style.display="block",n.diferencias&&n.diferencias.length>0){const r=n.diferencias.map(i=>`${i.item_id} | SKU: ${i.seller_sku} | ML: ${i.qty_ml} | ERP: ${i.qty_erp}`).join(`
`);a.textContent=`📊 ${n.total_items} items · ${n.desactualizados} desactualizados · ${n.sin_sku} sin SKU

DIFERENCIAS:
${r}`}else a.textContent=`✅ Todo sincronizado — ${n.total_items} items revisados`}catch(o){a.style.display="block",a.textContent="Error: "+o.message}e.innerHTML=t,e.disabled=!1};window.mlSincronizar=async function(e){if(!confirm("¿Sincronizar el stock de todas las publicaciones de MercadoLibre con el ERP?"))return;const t=e.innerHTML;e.innerHTML="⏳ Sincronizando...",e.disabled=!0;const a=document.getElementById("ml-resultado");try{const n=await(await fetch(f+"/ml/sync",{method:"POST"})).json();a.style.display="block",a.textContent="🔄 "+n.message+`

Espera 30 segundos y haz clic en "Ver resultado".`}catch(o){a.style.display="block",a.textContent="Error: "+o.message}e.innerHTML=t,e.disabled=!1};window.mlVerLog=async function(e){var o,n,r;const t=e.innerHTML;e.innerHTML="⏳ Cargando...",e.disabled=!0;const a=document.getElementById("ml-resultado");try{const s=await(await fetch(f+"/ml/sync/log")).json();if(a.style.display="block",s.error)a.textContent="❌ Error: "+s.error;else if(s.message)a.textContent=s.message;else{const d=s.ts?new Date(s.ts*1e3).toLocaleString("es-MX"):"";a.textContent=`Última sync: ${d}

✅ Actualizados: ${s.actualizados}
⏭️  Sin cambio:   ${s.sin_cambio}
❓ Sin match:    ${s.sin_match}
❌ Errores:      ${s.errores}`+((o=s.detalle_actualizados)!=null&&o.length?`

ACTUALIZADOS:
`+s.detalle_actualizados.map(l=>`  ${l.sku}: ${l.antes} → ${l.despues}`).join(`
`):"")+((n=s.detalle_errores)!=null&&n.length?`

ERRORES:
`+s.detalle_errores.map(l=>`  ${l.sku}: ${l.error}`).join(`
`):"")+((r=s.detalle_sin_match)!=null&&r.length?`

SIN MATCH (primeros 20):
`+s.detalle_sin_match.map(l=>`  ${l.item} ${l.sku}`).join(`
`):"")}}catch(i){a.style.display="block",a.textContent="Error: "+i.message}e.innerHTML=t,e.disabled=!1};async function ke(e,t){var i,s,d,l,p,c;const a=document.getElementById("ml-pub-sku").value.trim(),o=document.getElementById("ml-pub-listing").value,n=document.getElementById("ml-pub-resultado"),r=t.innerHTML;if(!a){alert("Ingresa el SKU del producto (ej: M-SAN-0148)");return}t.innerHTML=e?"⏳ Generando preview...":"⏳ Publicando en ML...",t.disabled=!0,n.style.display="none";try{const m=await fetch(f+"/ml/publicar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sku_interno:a.toUpperCase().trim(),listing_type:o,solo_preview:e})}),u=await m.json();if(n.style.display="block",!m.ok){n.textContent="❌ Error: "+(u.detail||JSON.stringify(u));return}if(e){const g=(i=u.resultados)==null?void 0:i[0];if(!g){n.textContent="Sin resultados";return}const y=g.preview;let b=`=== PREVIEW — ${u.producto} (${u.total} variantes) ===

`;b+=`Producto:    ${u.producto} (${u.categoria})
`,b+=`Category ID: ${u.category_id}
`,b+=`Listing:     ${o}

`,b+=`--- Primera variante: ${g.sku} ---
`,b+=`Título:      ${y.title}
`,b+=`Precio:      $${y.price} MXN
`,b+=`Stock:       ${y.available_quantity}
`,b+=`Imágenes:    ${((s=y.pictures)==null?void 0:s.length)||0}
`,b+=`Descripción: ${(l=(d=y.description)==null?void 0:d.plain_text)==null?void 0:l.substring(0,120)}...

`,b+=`Atributos:
`+(y.attributes||[]).map(h=>`  ${h.id}: ${h.value_name}`).join(`
`),b+=`

... y ${u.total-1} variantes más con la misma estructura.`,n.textContent=b}else{const g=((p=u.resultados)==null?void 0:p.filter(h=>h.status==="publicado"))||[],y=((c=u.resultados)==null?void 0:c.filter(h=>h.status==="error"))||[];let b=`=== RESULTADO — ${u.producto} ===
`;b+=`✅ Publicados: ${g.length}   ❌ Errores: ${y.length}

`,g.length&&(b+=`PUBLICADOS:
`,g.forEach(h=>{b+=`  ${h.sku} → ${h.item_id}
  ${h.permalink||""}
`})),y.length&&(b+=`
ERRORES:
`,y.forEach(h=>{var v;b+=`  ${h.sku}  [${h.codigo}] ${h.error}
`,(v=h.causas)!=null&&v.length&&h.causas.forEach(w=>{b+=`    ↳ ${w.code}: ${w.message}
`})})),n.textContent=b}}catch(m){n.style.display="block",n.textContent="Error inesperado: "+m.message}finally{t.innerHTML=r,t.disabled=!1}}window.mlPublicarPreview=function(e){ke(!0,e)};window.mlPublicarReal=function(e){confirm("¿Publicar TODAS las variantes activas de este producto en MercadoLibre? Esto creará nuevos items en tu cuenta.")&&ke(!1,e)};window.descargarExcelTikTok=async function(e,t,a){const o=e.innerHTML;try{e.innerHTML="⏳ Generando...",e.disabled=!0;const n=await fetch(`${f}/tiktok/${t}`);if(!n.ok){const d=await n.text();throw new Error(`Error ${n.status}: ${d}`)}const r=await n.blob(),i=URL.createObjectURL(r),s=document.createElement("a");s.href=i,s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i)}catch(n){alert("Error al descargar el archivo: "+n.message)}finally{e.innerHTML=o,e.disabled=!1}};async function Re(){const e=document.getElementById("content");e.innerHTML=`
    <div style="padding:2rem;max-width:860px">
      <h2 style="margin-bottom:0.25rem">🛒 MercadoLibre</h2>
      <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">
        Genera el preview, edita el JSON de cada variante (especialmente el título), y publica.
      </p>

      <!-- Paso 1: configurar -->
      <div class="card" style="margin-bottom:1.5rem">
        <h3 style="margin-bottom:1rem">Paso 1 — Producto</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">SKU del producto</label>
            <input id="ml-sku" type="text" placeholder="Ej: O-TAC-0118"
                   style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem">
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
  `,document.getElementById("ml-titulo").addEventListener("input",function(){document.getElementById("ml-titulo-count").textContent=this.value.length}),window.mlGenerarPreview=async()=>{const t=document.getElementById("ml-sku").value.trim().toUpperCase(),a=document.getElementById("ml-listing").value,o=document.getElementById("ml-titulo").value.trim(),n=document.getElementById("ml-precio").value.trim(),r=n?parseFloat(n):null;if(!t){alert("Ingresa el SKU del producto");return}if(!o){alert("Ingresa el título para ML");return}if(o.length>60){alert("El título no puede superar 60 caracteres");return}if(r!==null&&(isNaN(r)||r<=0)){alert("El precio debe ser mayor a 0");return}const i=document.getElementById("ml-btn-preview");i.textContent="⏳ Generando...",i.disabled=!0;try{const s=await fetch(`${f}/ml/publicar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sku_interno:t,listing_type:a,solo_preview:!0})}),d=await s.json();if(!s.ok){alert("Error: "+(d.detail||JSON.stringify(d)));return}const l=d.resultados||[];if(!l.length){alert("No se encontraron variantes activas");return}const p=document.getElementById("ml-variantes-wrap"),c=document.getElementById("ml-variantes-list"),m=document.getElementById("ml-variantes-titulo");m.textContent=`Paso 2 — Revisa y edita (${l.length} variantes, título aplicado a todas)`,c.innerHTML=l.map((u,g)=>{const y={...u.preview,family_name:o};return delete y.title,r!==null&&(y.price=r),`
          <details style="margin-bottom:0.5rem;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
            <summary style="padding:0.5rem 1rem;cursor:pointer;background:#f8f8f8;font-size:0.85rem;font-weight:600;list-style:none;display:flex;justify-content:space-between">
              <span>${u.sku||"Variante "+(g+1)} &nbsp;·&nbsp; ${u.color||""} ${u.talla||""}</span>
              <span style="font-size:0.75rem;color:#aaa">▾ editar JSON</span>
            </summary>
            <div style="padding:0.5rem">
              <textarea id="ml-json-${g}"
                        style="width:100%;height:260px;font-family:monospace;font-size:0.73rem;border:1px solid #ddd;border-radius:4px;padding:0.5rem;resize:vertical;box-sizing:border-box"
                        spellcheck="false">${JSON.stringify(y,null,2)}</textarea>
            </div>
          </details>`}).join(""),p.style.display="block",p.scrollIntoView({behavior:"smooth",block:"start"})}catch(s){alert("Error de conexión: "+s.message)}finally{i.textContent="🔍 Generar preview",i.disabled=!1}},window.mlPublicarTodas=async()=>{if(!confirm("¿Publicar TODAS las variantes en MercadoLibre con los JSONs editados?"))return;const a=document.getElementById("ml-variantes-list").querySelectorAll("textarea"),o=[];for(let d=0;d<a.length;d++)try{o.push(JSON.parse(a[d].value))}catch(l){alert(`JSON inválido en variante ${d+1}: ${l.message}`);return}const n=document.getElementById("ml-btn-publicar");n.textContent="⏳ Publicando...",n.disabled=!0;const r=document.getElementById("ml-resultado"),i=document.getElementById("ml-resultado-titulo"),s=document.getElementById("ml-resultado-body");r.style.display="block",i.textContent="⏳ Publicando...",s.innerHTML='<p style="color:#888">Enviando a MercadoLibre...</p>';try{const l=await(await fetch(`${f}/ml/publicar-payloads`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({payloads:o})})).json(),p=l.publicados||0,c=l.errores||0;i.textContent=`✅ ${p} publicado(s)${c?` · ❌ ${c} con error`:""} de ${l.total||0}`,s.innerHTML=(l.resultados||[]).map(m=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid #eee">
          <span style="font-size:0.85rem">${m.sku||"—"} ${m.title?"— "+m.title:""}</span>
          ${m.ok?`<a href="${m.permalink||"#"}" target="_blank"
                 style="font-size:0.8rem;color:#3483fa;white-space:nowrap">🔗 ${m.item_id}</a>`:`<span style="font-size:0.8rem;color:red"
                     title='${JSON.stringify(m.causa||[])}'>❌ ${m.error||"Error"}</span>`}
        </div>
      `).join("")||'<p style="color:#888">Sin detalles</p>'}catch(d){i.textContent="❌ Error de conexión",s.innerHTML=`<p style="color:red">${d.message}</p>`}finally{n.textContent="🚀 Publicar todas en ML",n.disabled=!1}}}document.querySelector("#app").style.cssText="display:flex;min-height:100vh;width:100%";const ze="erp_empleado";function ce(){document.querySelector("#app").innerHTML=`
    <div style="min-height:100vh;background:#0f0f1a;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;width:100%;max-width:400px">
        <div style="text-align:center;margin-bottom:32px">
          <h1 style="font-family:DM Sans,sans-serif;font-size:1.5rem;font-weight:700;color:white">Zapatillas <span style="color:#E91E8C">May</span></h1>
          <p style="color:#8892a4;font-size:0.85rem;margin-top:6px">Panel de administracion</p>
        </div>
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:0.72rem;font-weight:600;color:#8892a4;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Email</label>
          <input type="email" id="login-email" placeholder="correo@ejemplo.com"
            style="width:100%;padding:10px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.05);color:white;font-family:DM Sans,sans-serif;font-size:0.875rem;outline:none"
            onkeydown="if(event.key==='Enter')hacerLogin()">
        </div>
        <div style="margin-bottom:24px">
          <label style="display:block;font-size:0.72rem;font-weight:600;color:#8892a4;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Contrasena</label>
          <input type="password" id="login-password" placeholder="••••••••"
            style="width:100%;padding:10px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.05);color:white;font-family:DM Sans,sans-serif;font-size:0.875rem;outline:none"
            onkeydown="if(event.key==='Enter')hacerLogin()">
        </div>
        <button onclick="hacerLogin()" id="btn-login"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#c2187a);color:white;border:none;border-radius:8px;font-family:DM Sans,sans-serif;font-size:0.875rem;font-weight:600;cursor:pointer">
          Iniciar sesion
        </button>
        <p id="login-error" style="color:#fc8181;font-size:0.82rem;text-align:center;margin-top:12px;display:none"></p>
      </div>
    </div>
  `,window.hacerLogin=async()=>{const t=document.getElementById("login-email").value,a=document.getElementById("login-password").value,o=document.getElementById("btn-login");if(document.getElementById("login-error"),!t||!a){e("Por favor completa todos los campos");return}o.textContent="Verificando...",o.disabled=!0;try{const n=await fetch("/api/empleados/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:a})}),r=await n.json();n.ok?(sessionStorage.setItem(ze,JSON.stringify(r)),r.token&&sessionStorage.setItem("erp_token",r.token),window._empleadoActual=r,ge()):(e(r.error||"Email o contrasena incorrectos"),o.textContent="Iniciar sesion",o.disabled=!1)}catch{e("Error conectando con el servidor"),o.textContent="Iniciar sesion",o.disabled=!1}};function e(t){const a=document.getElementById("login-error");a&&(a.textContent=t,a.style.display="block")}}window.authHeaders=()=>{const e=sessionStorage.getItem("erp_token");return e?{"Content-Type":"application/json",Authorization:`Bearer ${e}`}:{"Content-Type":"application/json"}};const pe=sessionStorage.getItem(ze);if(pe)try{window._empleadoActual=JSON.parse(pe),ge()}catch{ce()}else ce();
