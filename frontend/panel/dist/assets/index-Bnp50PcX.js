(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();const g="https://zapatillasmay-production.up.railway.app",J=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],re=[{nombre:"Negro",hex:"#000000"},{nombre:"Blanco",hex:"#FFFFFF"},{nombre:"Hueso",hex:"#F5F0E8"},{nombre:"Nude claro",hex:"#F5DCC8"},{nombre:"Nude",hex:"#E8C4A0"},{nombre:"Nude oscuro",hex:"#C49A7A"},{nombre:"Nude rosa",hex:"#F2C4B0"},{nombre:"Palo de rosa",hex:"#D4A096"},{nombre:"Beige",hex:"#E8D5B0"},{nombre:"Camel",hex:"#C19A6B"},{nombre:"Miel",hex:"#B8860B"},{nombre:"Cafe claro",hex:"#A0785A"},{nombre:"Cafe medio",hex:"#7B4F2E"},{nombre:"Cafe oscuro",hex:"#4A2C1A"},{nombre:"Chocolate",hex:"#3B1F0E"},{nombre:"Cognac",hex:"#8B4513"},{nombre:"Taupe",hex:"#8B7D6B"},{nombre:"Gris claro",hex:"#C0C0C0"},{nombre:"Gris",hex:"#808080"},{nombre:"Gris oscuro",hex:"#404040"},{nombre:"Rojo",hex:"#CC0000"},{nombre:"Vino",hex:"#722F37"},{nombre:"Bordo",hex:"#800020"},{nombre:"Rosa claro",hex:"#FFB6C1"},{nombre:"Rosa",hex:"#FF69B4"},{nombre:"Fusha",hex:"#E91E8C"},{nombre:"Coral",hex:"#FF6B6B"},{nombre:"Salmon",hex:"#FA8072"},{nombre:"Naranja",hex:"#FF6600"},{nombre:"Amarillo",hex:"#FFD700"},{nombre:"Dorado",hex:"#C8A951"},{nombre:"Plateado",hex:"#A8A8A8"},{nombre:"Azul claro",hex:"#6CA0DC"},{nombre:"Azul",hex:"#0000CC"},{nombre:"Azul marino",hex:"#001F5B"},{nombre:"Turquesa",hex:"#40E0D0"},{nombre:"Verde",hex:"#006400"},{nombre:"Verde menta",hex:"#98FF98"},{nombre:"Morado",hex:"#800080"},{nombre:"Lila",hex:"#C8A2C8"},{nombre:"Multicolor",hex:"#FF69B4"}],se=[{value:"tacones",label:"Tacones",prefix:"TAC"},{value:"sandalias",label:"Sandalias",prefix:"SAN"},{value:"botas",label:"Botas",prefix:"BOT"},{value:"botines",label:"Botines",prefix:"BTN"},{value:"flats",label:"Flats",prefix:"FLT"},{value:"plataformas",label:"Plataformas",prefix:"PLT"},{value:"tenis",label:"Tenis",prefix:"TEN"},{value:"nina",label:"Calzado de nina",prefix:"NIN"},{value:"accesorios",label:"Accesorios",prefix:"ACC"}],O=[{id:"dashboard",icon:"📊",label:"Dashboard",section:"Principal",soloAdmin:!0},{id:"pos",icon:"🛒",label:"Punto de venta",section:"Principal"},{id:"productos",icon:"👠",label:"Productos",section:"Catalogo"},{id:"inventario",icon:"📦",label:"Inventario",section:"Catalogo"},{id:"pedidos",icon:"🛍️",label:"Pedidos",section:"Ventas"},{id:"clientes",icon:"👥",label:"Clientes",section:"Ventas"},{id:"historial",icon:"📋",label:"Historial",section:"Ventas"},{id:"analisis",icon:"📈",label:"Analisis",section:"Ventas"},{id:"crm",icon:"🎯",label:"CRM",section:"Ventas"},{id:"finanzas",icon:"💰",label:"Finanzas",section:"Finanzas",soloAdmin:!0},{id:"proveedores",icon:"🏭",label:"Proveedores",section:"Finanzas",soloAdmin:!0},{id:"sucursales",icon:"🏪",label:"Sucursales",section:"Configuracion",soloAdmin:!0},{id:"empleados",icon:"👤",label:"Empleados",section:"Configuracion",soloAdmin:!0},{id:"seo",icon:"🔍",label:"SEO y Sitio",section:"Configuracion",soloAdmin:!0},{id:"ordenes",icon:"🛒",label:"Órdenes de compra",section:"Finanzas",soloAdmin:!0},{id:"conversaciones",icon:"💬",label:"Conversaciones",section:"Ventas"},{id:"envios",icon:"📣",label:"Envíos masivos",section:"Ventas"}];var U;let M=((U=window._empleadoActual)==null?void 0:U.rol)==="admin"?"dashboard":"pos",R=1;function W(){var o,n;const e=(()=>{try{return localStorage.getItem("zm_panel_modulo")}catch{return null}})(),t=((o=window._empleadoActual)==null?void 0:o.rol)==="admin"?"dashboard":"pos";M=e||t,document.querySelector("#app").innerHTML=`
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2>Zapatillas <span>May</span></h2>
        <p>Panel de administracion</p>
      </div>
      <nav class="sidebar-nav">
        ${de()}
      </nav>
    </div>
    <div class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="hamburger" onclick="toggleSidebar()">☰</button>
          <h1 id="topbar-title">${((n=O.find(a=>a.id===M))==null?void 0:n.label)||"Dashboard"}</h1>
        </div>
        <div class="topbar-actions">
          <span style="font-size:0.8rem;color:#888">${window._empleadoActual?window._empleadoActual.nombre:"Leon, Gto."}</span>
          <button onclick="cerrarSesionPanel()" style="background:none;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#8892a4;cursor:pointer;font-family:DM Sans,sans-serif">Salir</button>
        </div>
      </div>
      <div class="content" id="content">
        ${le()}
      </div>
    </div>
  `,window.toggleSidebar=()=>{const a=document.getElementById("sidebar"),i=document.getElementById("sidebar-overlay"),r=a.classList.toggle("open");i.classList.toggle("active",r),document.body.style.overflow=r?"hidden":""},window._conversacionesInterval&&clearInterval(window._conversacionesInterval),window._conversacionesInterval=setInterval(async()=>{try{const i=await(await fetch(g+"/chatbot/chats")).json();window._chatsData||(window._chatsData={});const r=window._totalNoLeidos||0,s=i.reduce((d,l)=>d+(l.no_leidos||0),0);if(window._totalNoLeidos=s,i.forEach(d=>{window._chatsData&&(window._chatsData[d.telefono]=d)}),fetch(g+"/health").catch(()=>{}),s>r){document.title=`(${s}) Zapatillas May`;const d=document.querySelector('[data-modulo="conversaciones"]');if(d){let l=d.querySelector(".nav-badge");l||(l=document.createElement("span"),l.className="nav-badge",l.style.cssText="background:#e91e8c;color:white;border-radius:100px;padding:1px 6px;font-size:0.65rem;font-weight:700;margin-left:auto",d.appendChild(l)),l.textContent=s}try{const l=new(window.AudioContext||window.webkitAudioContext),c=l.createOscillator(),p=l.createGain();c.connect(p),p.connect(l.destination),c.frequency.value=523,p.gain.setValueAtTime(.5,l.currentTime),p.gain.exponentialRampToValueAtTime(.001,l.currentTime+.2),c.start(l.currentTime),c.stop(l.currentTime+.2);const m=l.createOscillator(),f=l.createGain();m.connect(f),f.connect(l.destination),m.frequency.value=783,f.gain.setValueAtTime(.5,l.currentTime+.2),f.gain.exponentialRampToValueAtTime(.001,l.currentTime+.5),m.start(l.currentTime+.2),m.stop(l.currentTime+.5)}catch{}}if(window._chatActivo&&window._chatsData[window._chatActivo]){const d=window._chatsData[window._chatActivo],l=document.getElementById("mensajes-area");if(l){const c=l.scrollHeight-l.scrollTop<=l.clientHeight+50;l.innerHTML=[...d.mensajes].reverse().map(p=>{const m=p.tipo==="manual"||p.tipo==="imagen_saliente";return`
              <div style="display:flex;flex-direction:column;gap:4px">
                ${p.mensaje?'<div style="display:flex;flex-direction:column;align-items:'+(m?"flex-end":"flex-start")+'"><div style="max-width:70%;background:'+(m?"#cfe9ff":"#f5f5f5")+";border-radius:"+(m?"12px 12px 0 12px":"12px 12px 12px 0")+';padding:8px 12px;box-shadow:0 1px 2px rgba(0,0,0,0.08)">'+window.renderMensaje(p)+'<p style="font-size:0.62rem;color:#aaa;text-align:right;margin-top:2px">'+new Date(p.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})+"</p></div></div>":""} 
                ${p.respuesta?`<div style="display:flex;flex-direction:column;align-items:flex-end"><div style="max-width:70%;background:#dcf8c6;border-radius:12px 12px 0 12px;padding:8px 12px;box-shadow:0 1px 2px rgba(0,0,0,0.08)"><p style="font-size:0.62rem;color:#2e7d32;margin-bottom:2px">🤖 Bot</p><p style="font-size:0.85rem;color:#333;white-space:pre-wrap">${p.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi,"")}</p>${p.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)?p.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi).map(f=>`<img src="${f}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${f}')">`).join(""):""}<p style="font-size:0.62rem;color:#aaa;text-align:right;margin-top:2px">${new Date(p.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</p></div></div>`:""}
              </div>`}).join(""),c&&(l.scrollTop=l.scrollHeight)}}}catch{}},5e3),window.navegarA=a=>{var l;const i=((l=window._empleadoActual)==null?void 0:l.rol)==="admin",r=O.find(c=>c.id===a);if(r!=null&&r.soloAdmin&&!i){alert("No tienes permisos para acceder a este módulo");return}M=a;try{localStorage.setItem("zm_panel_modulo",a)}catch{}const s=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay");s.classList.contains("open")&&(s.classList.remove("open"),d.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(c=>c.classList.remove("active")),document.querySelector('[data-modulo="'+a+'"]').classList.add("active"),document.getElementById("topbar-title").textContent=O.find(c=>c.id===a).label,K(a)}}function de(){var o;const e=((o=window._empleadoActual)==null?void 0:o.rol)==="admin";return[...new Set(O.filter(n=>e||!n.soloAdmin).map(n=>n.section))].map(n=>`
    <div class="nav-section">${n}</div>
    ${O.filter(a=>a.section===n&&(e||!a.soloAdmin)).map(a=>`
      <div class="nav-item ${a.id===M?"active":""}"
           data-modulo="${a.id}"
           onclick="navegarA('${a.id}')">
        <span class="nav-icon">${a.icon}</span>
        ${a.label}
      </div>
    `).join("")}
  `).join("")}async function K(e){const t=document.getElementById("content");switch(t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>',e){case"dashboard":t.innerHTML=ce(),setTimeout(()=>ye(),100);break;case"productos":await H();break;case"clientes":await me();break;case"pedidos":await te();break;case"sucursales":await ue();break;case"inventario":await fe();break;case"pos":await oe();break;case"historial":await ae();break;case"empleados":await ne();break;case"seo":await ve();break;case"analisis":await pe();break;case"crm":await Y();break;case"finanzas":await D();break;case"proveedores":await Z();break;case"ordenes":await L();break;case"conversaciones":await cargarConversaciones();break;case"envios":await cargarEnviosMasivos();break}}function le(){return setTimeout(()=>{document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));const e=document.querySelector('[data-modulo="'+M+'"]');e&&e.classList.add("active");const t=document.getElementById("topbar-title"),o=O.find(n=>n.id===M);t&&o&&(t.textContent=o.label),K(M)},100),'<div style="padding:2rem;color:#888;text-align:center">Cargando...</div>'}async function L(){var t;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando sugerencias...</p>';try{const n=await(await fetch(g+"/sucursales/")).json(),a=(t=n[0])==null?void 0:t.id,[i,r]=await Promise.all([fetch(g+"/finanzas/sugerencias-recompra/"+a),fetch(g+"/finanzas/proveedores")]),s=await i.json(),d=await r.json(),l=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),c=new Date().toISOString().split("T")[0],p=s.filter(y=>{const h=l[y.producto_id];return h?h.hasta===null||h.hasta===void 0?!1:h.hasta<=c:!0}),m=s.length-p.length;window._ordenesData={sugerencias:p,proveedores:d,sucursalId:a},window._ordenSeleccion={};const f=p.filter(y=>y.urgente),u=p.filter(y=>!y.urgente),b=p.reduce((y,h)=>y+h.cantidad_sugerida*h.costo_unitario,0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🛒 Órdenes de compra</h2>
          <p style="color:#888;font-size:0.85rem">Sugerencias de recompra basadas en rotación e inventario</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="ord-sucursal" style="max-width:200px" onchange="recargarOrdenes(this.value)">
            ${n.map(y=>`<option value="${y.id}">${y.nombre}</option>`).join("")}
          </select>
          <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${f.length}</p>
          <p style="font-size:0.68rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🚨 Urgentes</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${u.length}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⚠️ Por resurtir</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#333">${p.reduce((y,h)=>y+h.cantidad_sugerida,0)}</p>
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

            ${p.map(y=>`
              <div class="orden-item" data-urgente="${y.urgente}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                <input type="checkbox" class="orden-check" data-id="${y.producto_id}" onchange="actualizarSeleccion('${y.producto_id}', this.checked)"
                       style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C;flex-shrink:0">
                ${y.imagen?`<img src="${y.imagen}" style="width:52px;height:52px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
                <div style="flex:1;min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                    <p style="font-weight:700;font-size:0.9rem">${y.nombre}</p>
                    ${y.urgente?'<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">🚨 URGENTE</span>':'<span style="background:#fff8e1;color:#f57f17;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">⚠️ BAJO</span>'}
                  </div>
                  <p style="font-size:0.75rem;color:#888">${y.sku||""} · Stock: ${y.stock_total} pares · Mín: ${y.stock_minimo}</p>
                  <p style="font-size:0.72rem;color:#888">${y.velocidad_semanal} pares/sem · ${y.dias_inventario?y.dias_inventario+" días de stock":"Sin ventas recientes"}</p>
                  ${y.proveedor?`<p style="font-size:0.72rem;color:#6a1b9a;margin-top:2px">🏭 ${y.proveedor.nombre}</p>`:'<p style="font-size:0.72rem;color:#aaa;margin-top:2px">Sin proveedor asignado</p>'}
                  ${y.variantes&&y.variantes.length>0?`
                  <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
                    ${y.variantes.map(h=>{const v=[h.talla,h.color].filter(Boolean).join(" / "),x=h.sin_stock;return`<span style="
                        padding:2px 7px;border-radius:100px;font-size:0.68rem;font-weight:600;
                        ${x?"background:#ffebee;color:#c62828;border:1px solid #ef9a9a":"background:#f5f5f5;color:#666;border:1px solid #e0e0e0"}
                      " title="${x?"Sin stock":"Stock: "+h.stock}">${v}${x?" ✗":""}</span>`}).join("")}
                  </div>`:""}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Sugerido</p>
                    <input type="number" min="1" value="${y.cantidad_sugerida}"
                           id="qty-orden-${y.producto_id}"
                           style="width:60px;text-align:center;border:1px solid #ddd;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700"
                           oninput="actualizarCostoOrden()">
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Costo/par</p>
                    <p style="font-weight:700;color:#333;font-size:0.9rem">$${y.costo_unitario.toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Subtotal</p>
                    <p id="sub-${y.producto_id}" style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${(y.cantidad_sugerida*y.costo_unitario).toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">⏸️</p>
                    <button onclick="posponerProducto('${y.producto_id}', '${y.nombre.replace(/'/g,"")}')"
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
    `}catch(o){e.innerHTML='<p style="padding:2rem;color:red">Error: '+o.message+"</p>"}}window.seleccionarTodos=e=>{document.querySelectorAll(".orden-check").forEach(t=>{t.checked=e;const o=t.dataset.id;window._ordenSeleccion[o]=e}),actualizarCostoOrden()};window.actualizarSeleccion=(e,t)=>{window._ordenSeleccion[e]=t,actualizarCostoOrden()};window.actualizarCostoOrden=()=>{const{sugerencias:e}=window._ordenesData;let t=0,o=0;e.forEach(i=>{var r;if(window._ordenSeleccion[i.producto_id]){const d=parseInt(((r=document.getElementById("qty-orden-"+i.producto_id))==null?void 0:r.value)||i.cantidad_sugerida)*i.costo_unitario;t+=d,o++;const l=document.getElementById("sub-"+i.producto_id);l&&(l.textContent="$"+d.toFixed(0))}});const n=document.getElementById("ord-total"),a=document.getElementById("ord-seleccionados");n&&(n.textContent="$"+t.toFixed(0)),a&&(a.textContent=o+" productos seleccionados")};window.filtrarOrdenes=e=>{document.querySelectorAll(".orden-item").forEach(t=>{t.style.display=e==="todos"||e==="urgente"&&t.dataset.urgente==="true"?"":"none"})};window.recargarOrdenes=async e=>{const t=await fetch(g+"/finanzas/sugerencias-recompra/"+e);window._ordenesData.sugerencias=await t.json(),window._ordenesData.sucursalId=e,L()};window.generarOrden=()=>{const{sugerencias:e,proveedores:t,sucursalId:o}=window._ordenesData,n=e.filter(i=>window._ordenSeleccion[i.producto_id]);if(n.length===0){alert("Selecciona al menos un producto para generar la orden");return}window._ordenModal={seleccionados:n,sucursalId:o};const a=document.createElement("div");a.id="modal-orden",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto",a.innerHTML=`
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

      ${n.map(i=>{const r=(i.variantes||[]).filter(l=>l.sin_stock),s=(i.variantes||[]).filter(l=>!l.sin_stock),d=[...r,...s];return`
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
  `,document.body.appendChild(a),a.addEventListener("click",i=>{i.target===a&&a.remove()}),setTimeout(ordenRecalcTotal,50)};window.guardarOrdenCompra=async e=>{var a,i,r;const t=(a=document.getElementById("orden-fecha"))==null?void 0:a.value,o=((i=document.getElementById("orden-notas"))==null?void 0:i.value)||"",n=window._ordenesData.sucursalId;try{const s=typeof e=="string"?JSON.parse(e):e;for(const[d,l]of s){const c=l.productos.reduce((u,b)=>u+b.cantidad_final*b.costo_unitario,0),f=(r=(await(await fetch(g+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:d==="sin-proveedor"?null:d,sucursal_id:n,status:"borrador",total:c,notas:o,fecha_entrega_estimada:t||null})})).json())[0])==null?void 0:r.id;if(f)for(const u of l.productos)await fetch(g+"/finanzas/ordenes/"+f+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:null,cantidad:u.cantidad_final,costo_unitario:u.costo_unitario,subtotal:u.cantidad_final*u.costo_unitario})})}document.querySelector('div[style*="position:fixed"]').remove(),alert("Orden de compra guardada exitosamente"),L()}catch(s){alert("Error guardando orden: "+s.message)}};window.ordenToggleVar=(e,t)=>{const o=document.getElementById("qty-var-"+e);o&&(o.disabled=!t,o.style.opacity=t?"1":"0.35",o.style.borderColor=t?"#E91E8C":"#ddd",t&&(!o.value||o.value==="0")?o.value=1:t||(o.value=0),ordenRecalcTotal())};window.ordenRecalcTotal=()=>{const{seleccionados:e}=window._ordenModal||{};if(!e)return;let t=0;e.forEach(n=>{var a;if((n.variantes||[]).forEach(i=>{var d;const r=document.getElementById("chk-var-"+i.id),s=parseInt(((d=document.getElementById("qty-var-"+i.id))==null?void 0:d.value)||0);r!=null&&r.checked&&s>0&&(t+=s*n.costo_unitario)}),!n.variantes||n.variantes.length===0){const i=parseInt(((a=document.getElementById("qty-orden-"+n.producto_id))==null?void 0:a.value)||n.cantidad_sugerida);t+=i*n.costo_unitario}});const o=document.getElementById("orden-total-general");o&&(o.textContent="$"+t.toFixed(0))};window.imprimirOrden=()=>{var s,d;const{seleccionados:e}=window._ordenModal||{};if(!e)return;const t=((s=document.getElementById("orden-fecha"))==null?void 0:s.value)||"",o=((d=document.getElementById("orden-notas"))==null?void 0:d.value)||"",n=new Date().toLocaleDateString("es-MX");let a="",i=0;e.forEach(l=>{var p;const c=l.variantes||[];if(c.length===0){const m=parseInt(((p=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:p.value)||l.cantidad_sugerida),f=m*l.costo_unitario;i+=f,a+=`<tr><td>${l.nombre}</td><td>${l.sku||""}</td><td>—</td><td>—</td><td style="text-align:center">${m}</td><td style="text-align:right">$${f.toFixed(0)}</td></tr>`}else c.forEach(m=>{var y;const f=document.getElementById("chk-var-"+m.id);if(!(f!=null&&f.checked))return;const u=parseInt(((y=document.getElementById("qty-var-"+m.id))==null?void 0:y.value)||0);if(u<=0)return;const b=u*l.costo_unitario;i+=b,a+=`<tr style="${m.sin_stock?"background:#fff5f5":""}">
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
    Fecha de emisión: ${n}
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
    <tbody>${a}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4">TOTAL GENERAL</td>
        <td></td>
        <td style="text-align:right">$${i.toFixed(0)}</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => window.print()<\/script>
</body></html>`),r.document.close()};window.posponerProducto=(e,t)=>{const o=document.getElementById("modal-posponer");o&&o.remove();const n=document.createElement("div");n.id="modal-posponer",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:1100;display:flex;align-items:center;justify-content:center",n.innerHTML=`
    <div style="background:white;border-radius:14px;padding:1.5rem;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
      <p style="font-weight:700;font-size:1rem;margin-bottom:4px">⏸️ Posponer producto</p>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${t}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 7)" style="text-align:left">📅 7 días — revisaré la próxima semana</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', 30)" style="text-align:left">📅 30 días — esperar el mes que entra</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${e}', null)" style="text-align:left;color:#c62828;border-color:#ef9a9a">🚫 No pedir por ahora (indefinido)</button>
      </div>
      <button onclick="document.getElementById('modal-posponer').remove()" style="margin-top:1rem;width:100%;background:none;border:none;color:#aaa;cursor:pointer;font-size:0.82rem">Cancelar</button>
    </div>`,n.addEventListener("click",a=>{a.target===n&&n.remove()}),document.body.appendChild(n)};window.aplicarPosponer=(e,t)=>{var a;const o=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}");let n=null;if(t!==null){const i=new Date;i.setDate(i.getDate()+t),n=i.toISOString().split("T")[0]}o[e]={hasta:n},localStorage.setItem("ordenes_pospuestos",JSON.stringify(o)),(a=document.getElementById("modal-posponer"))==null||a.remove(),L()};window.verPospuestos=()=>{const e=JSON.parse(localStorage.getItem("ordenes_pospuestos")||"{}"),{sugerencias:t}=window._ordenesData;new Date().toISOString().split("T")[0];const o=Object.entries(e).map(([a,i])=>{const r=i.nombre||a,s=i.hasta?"hasta "+i.hasta:"indefinido";return`• ${r} — ${s}`}).join(`
`);if(!o){alert("No hay productos pospuestos.");return}confirm(`Productos pospuestos:

`+o+`

¿Quieres reactivar todos?`)&&(localStorage.removeItem("ordenes_pospuestos"),L())};window.guardarOrdenCompra2=async()=>{var i,r,s,d;const{seleccionados:e,sucursalId:t}=window._ordenModal||{};if(!e)return;const o=(i=document.getElementById("orden-fecha"))==null?void 0:i.value,n=((r=document.getElementById("orden-notas"))==null?void 0:r.value)||"",a={};e.forEach(l=>{var f,u;const c=l.proveedor_id||"sin-proveedor",p=((f=l.proveedor)==null?void 0:f.nombre)||"Sin proveedor";a[c]||(a[c]={nombre:p,items:[]});const m=l.variantes||[];if(m.length===0){const b=parseInt(((u=document.getElementById("qty-orden-"+l.producto_id))==null?void 0:u.value)||l.cantidad_sugerida);a[c].items.push({variante_id:null,cantidad:b,costo_unitario:l.costo_unitario})}else m.forEach(b=>{var v;const y=document.getElementById("chk-var-"+b.id);if(!(y!=null&&y.checked))return;const h=parseInt(((v=document.getElementById("qty-var-"+b.id))==null?void 0:v.value)||0);h<=0||a[c].items.push({variante_id:b.id,cantidad:h,costo_unitario:l.costo_unitario})})});try{for(const[l,c]of Object.entries(a)){if(c.items.length===0)continue;const p=c.items.reduce((b,y)=>b+y.cantidad*y.costo_unitario,0),u=(s=(await(await fetch(g+"/finanzas/ordenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proveedor_id:l==="sin-proveedor"?null:l,sucursal_id:t,status:"borrador",total:p,notas:n,fecha_entrega_estimada:o||null})})).json())[0])==null?void 0:s.id;if(u)for(const b of c.items)await fetch(g+"/finanzas/ordenes/"+u+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...b,subtotal:b.cantidad*b.costo_unitario})})}(d=document.getElementById("modal-orden"))==null||d.remove(),alert("Orden de compra guardada"),L()}catch(l){alert("Error guardando orden: "+l.message)}};function ce(){return`
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
  `}async function D(){var t,o,n,a,i,r;const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando finanzas...</p>';try{const d=await(await fetch(g+"/sucursales/")).json(),l=(t=d[0])==null?void 0:t.id,[c,p,m,f,u,b,y]=await Promise.all([fetch(g+"/finanzas/caja/hoy/"+l),fetch(g+"/finanzas/reporte/"+l),fetch(g+"/finanzas/gastos/"+l),fetch(g+"/finanzas/estado-resultados/"+l),fetch(g+"/finanzas/flujo/"+l),fetch(g+"/finanzas/cuentas-por-cobrar"),fetch(g+"/finanzas/gastos-categorias/"+l)]),h=await c.json(),v=await p.json(),x=await m.json(),C=await f.json(),E=await u.json(),k=await b.json(),w=await y.json(),_=h.find(z=>z.status==="abierta"),I=new Date().toISOString().split("T")[0],T=x.filter(z=>{var j;return(j=z.created_at)==null?void 0:j.startsWith(I)}),S=T.reduce((z,j)=>z+parseFloat(j.monto||0),0),P=k.reduce((z,j)=>z+parseFloat(j.total||0),0);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">💰 Finanzas</h2>
          <p style="color:#888;font-size:0.85rem">Control de caja, gastos y reportes financieros</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="fin-sucursal" style="max-width:200px" onchange="recargarFinanzas(this.value)">
            ${d.map(z=>`<option value="${z.id}">${z.nombre}</option>`).join("")}
          </select>
          ${_?`<button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="cerrarCaja('${_.id}')">🔒 Cerrar caja</button>`:`<button class="btn btn-primary" onclick="abrirCaja('${l}')">🔓 Abrir caja</button>`}
        </div>
      </div>

      <!-- ESTADO CAJA -->
      <div style="background:${_?"#e8f5e9":"#ffebee"};border-radius:12px;padding:1.25rem;border:1px solid ${_?"#a5d6a7":"#ffcdd2"};margin-bottom:1.5rem;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <span style="font-size:2rem">${_?"🟢":"🔴"}</span>
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem;color:${_?"#2e7d32":"#c62828"}">Caja ${_?"ABIERTA":"CERRADA"}</p>
          <p style="font-size:0.82rem;color:#888">${_?`Abierta a las ${new Date(_.hora_apertura).toLocaleTimeString("es-MX")} · Fondo: $${_.monto_apertura}`:"No hay caja abierta hoy"}</p>
        </div>
        ${_?`
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#2e7d32">$${(((o=E.hoy)==null?void 0:o.efectivo)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Efectivo</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#1565c0">$${(((n=E.hoy)==null?void 0:n.tarjeta)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Tarjeta</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#6a1b9a">$${(((a=E.hoy)==null?void 0:a.spei)||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">SPEI</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#E91E8C">$${(((i=E.hoy)==null?void 0:i.total)||0).toFixed(0)}</p>
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
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(((r=E.semana)==null?void 0:r.ingresos)||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ingresos 7 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(v.ticket_promedio||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarCxC()">
          <p style="font-size:1.5rem;font-weight:700;color:#f57f17">$${P.toFixed(0)}</p>
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
    `,window._finanzasData={sucursalId:l,gastosHoy:T,totalGastosHoy:S,estadoResultados:C,flujo:E,cxc:k,categorias:w,historial:[]},window._finanzasSucursalId=l;const $=await(await fetch(g+"/finanzas/caja/historial/"+l)).json();window._finanzasData.historial=$,mostrarTabFinanzas("gastos")}catch(s){e.innerHTML='<p style="padding:2rem;color:red">Error cargando finanzas: '+s.message+"</p>"}}window.mostrarTabFinanzas=e=>{var c,p,m,f,u,b,y,h,v,x,C,E,k;const{gastosHoy:t,totalGastosHoy:o,estadoResultados:n,flujo:a,cxc:i,categorias:r,historial:s,sucursalId:d}=window._finanzasData,l=document.getElementById("fin-tab-contenido");if(l)if(e==="gastos"){const w=r.reduce((_,I)=>_+I.total,0);l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">💸 Gastos del día</p>
            <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.78rem" onclick="agregarGasto('${d}')">+ Agregar</button>
          </div>
          ${t.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin gastos hoy</div>':t.map(_=>`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${_.concepto}</p>
                  <p style="font-size:0.72rem;color:#888">${_.categoria} · ${new Date(_.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <p style="font-weight:700;color:#c62828">-$${parseFloat(_.monto).toFixed(2)}</p>
                <button onclick="eliminarGasto('${_.id}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem">✕</button>
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
            ${r.length===0?'<p style="color:#888;text-align:center;padding:1rem">Sin gastos registrados</p>':r.map(_=>`
                <div style="margin-bottom:12px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize">${_.categoria}</span>
                    <span style="font-size:0.82rem;color:#c62828;font-weight:700">$${_.total.toFixed(0)}</span>
                  </div>
                  <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden">
                    <div style="background:#E91E8C;height:100%;width:${w>0?(_.total/w*100).toFixed(0):0}%;border-radius:100px;transition:width 0.5s"></div>
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
              ${n.map(w=>`
                <tr>
                  <td><strong>${w.mes}</strong></td>
                  <td style="color:#E91E8C;font-weight:600">$${w.ventas.toFixed(0)}</td>
                  <td style="color:#c62828">$${w.gastos.toFixed(0)}</td>
                  <td style="color:${w.utilidad>=0?"#2e7d32":"#c62828"};font-weight:700">$${w.utilidad.toFixed(0)}</td>
                  <td>${w.num_pedidos}</td>
                  <td>
                    <span style="padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600;background:${w.ventas>0&&w.utilidad/w.ventas>=.2?"#e8f5e9":w.utilidad>=0?"#fff8e1":"#ffebee"};color:${w.ventas>0&&w.utilidad/w.ventas>=.2?"#2e7d32":w.utilidad>=0?"#f57f17":"#c62828"}">
                      ${w.ventas>0?(w.utilidad/w.ventas*100).toFixed(1):0}%
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
            <p style="font-weight:700;color:#E91E8C">$${n.reduce((w,_)=>w+_.ventas,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Total gastos 6 meses</p>
            <p style="font-weight:700;color:#c62828">$${n.reduce((w,_)=>w+_.gastos,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Utilidad total</p>
            <p style="font-weight:700;color:#2e7d32">$${n.reduce((w,_)=>w+_.utilidad,0).toFixed(0)}</p>
          </div>
        </div>
      </div>
    `:e==="flujo"?l.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">🌅 Hoy</p>
          ${[{label:"Efectivo",val:((c=a.hoy)==null?void 0:c.efectivo)||0,color:"#2e7d32"},{label:"Tarjeta",val:((p=a.hoy)==null?void 0:p.tarjeta)||0,color:"#1565c0"},{label:"SPEI",val:((m=a.hoy)==null?void 0:m.spei)||0,color:"#6a1b9a"},{label:"Crédito",val:((f=a.hoy)==null?void 0:f.credito)||0,color:"#f57f17"}].map(w=>`
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
              <span style="font-size:0.82rem;color:#888">${w.label}</span>
              <span style="font-weight:700;color:${w.color}">$${w.val.toFixed(0)}</span>
            </div>
          `).join("")}
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Total</span>
            <span style="font-weight:700;color:#E91E8C;font-size:1.1rem">$${(((u=a.hoy)==null?void 0:u.total)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📅 Últimos 7 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((b=a.semana)==null?void 0:b.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((y=a.semana)==null?void 0:y.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((h=a.semana)==null?void 0:h.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((v=a.semana)==null?void 0:v.neto)||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📆 Últimos 30 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(((x=a.mes)==null?void 0:x.ingresos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(((C=a.mes)==null?void 0:C.gastos)||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(((E=a.mes)==null?void 0:E.neto)||0)>=0?"#2e7d32":"#c62828"};font-size:1.1rem">$${(((k=a.mes)==null?void 0:k.neto)||0).toFixed(0)}</span>
          </div>
        </div>
      </div>
    `:e==="caja"?l.innerHTML=`
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📋 Historial de cajas</p>
        </div>
        ${s.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin historial</div>':s.map(w=>`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${new Date(w.fecha).toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"})}</p>
                <p style="font-size:0.72rem;color:#888">Apertura: $${parseFloat(w.monto_apertura||0).toFixed(0)} · Cierre: $${parseFloat(w.monto_cierre||0).toFixed(0)}</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:#E91E8C">$${parseFloat(w.total_ventas||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Ventas</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:${parseFloat(w.diferencia||0)>=0?"#2e7d32":"#c62828"}">${parseFloat(w.diferencia||0)>=0?"+":""}$${parseFloat(w.diferencia||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Diferencia</p>
              </div>
              <span style="padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${w.status==="cerrada"?"#e8f5e9":"#fff8e1"};color:${w.status==="cerrada"?"#2e7d32":"#f57f17"}">${w.status}</span>
            </div>
          `).join("")}
      </div>
    `:e==="cxc"&&mostrarCxC()};window.mostrarCxC=()=>{const{cxc:e}=window._finanzasData,t=document.getElementById("fin-tab-contenido");if(!t)return;const o=new Date;t.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">📑 Cuentas por cobrar</p>
        <span style="font-size:0.78rem;color:#888">${e.length} pendientes · $${e.reduce((n,a)=>n+parseFloat(a.total||0),0).toFixed(0)} total</span>
      </div>
      ${e.length===0?'<div style="padding:2rem;text-align:center;color:#888">Sin cuentas por cobrar</div>':e.map(n=>{var i,r;const a=Math.floor((o-new Date(n.created_at))/864e5);return`
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${((i=n.clientes)==null?void 0:i.nombre)||"Sin cliente"}</p>
                <p style="font-size:0.72rem;color:#888">${new Date(n.created_at).toLocaleDateString("es-MX")} · Pedido #${n.id.substring(0,8).toUpperCase()}</p>
              </div>
              <div style="text-align:right">
                <p style="font-weight:700;color:#f57f17;font-size:1rem">$${parseFloat(n.total||0).toFixed(0)}</p>
                <span style="font-size:0.68rem;padding:2px 8px;border-radius:100px;background:${a>30?"#ffebee":"#fff8e1"};color:${a>30?"#c62828":"#f57f17"}">
                  ${a} días
                </span>
              </div>
              ${(r=n.clientes)!=null&&r.telefono?`
                <a href="https://wa.me/52${n.clientes.telefono.replace(/\D/g,"")}" target="_blank"
                   style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;text-decoration:none">
                  💬 Cobrar
                </a>
              `:""}
            </div>
          `}).join("")}
    </div>
  `};window.abrirCaja=async e=>{var o;const t=prompt("¿Cuánto efectivo hay en caja para empezar? (fondo de caja)");if(t!==null)try{const a=await(await fetch(g+"/finanzas/caja/abrir",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,monto_apertura:parseFloat(t)||0,empleado:((o=window._empleadoActual)==null?void 0:o.nombre)||"Admin"})})).json();if(a.error){alert("Error: "+a.error);return}D()}catch{alert("Error abriendo caja")}};window.cerrarCaja=async e=>{var n,a;const t=prompt("¿Cuánto efectivo hay físicamente en caja al cerrar?");if(t===null)return;const o=prompt("Notas del cierre (opcional):")||"";try{const r=await(await fetch(g+"/finanzas/caja/"+e+"/cerrar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({monto_cierre:parseFloat(t)||0,notas:o})})).json();r.ok?(alert(`Caja cerrada.
Total ventas: $${(n=r.total_ventas)==null?void 0:n.toFixed(2)}
Diferencia: $${(a=r.diferencia)==null?void 0:a.toFixed(2)}`),D()):alert("Error: "+JSON.stringify(r))}catch{alert("Error cerrando caja")}};window.agregarGasto=e=>{const t=document.createElement("div");t.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",t.innerHTML=`
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
  `,document.body.appendChild(t),t.addEventListener("click",o=>{o.target===t&&t.remove()})};window.guardarGasto=async(e,t)=>{var i;const o=document.getElementById("gasto-concepto").value,n=document.getElementById("gasto-monto").value,a=document.getElementById("gasto-categoria").value;if(!o||!n){alert("Completa concepto y monto");return}try{await fetch(g+"/finanzas/gastos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,concepto:o,monto:parseFloat(n),categoria:a,empleado:((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin"})}),t.closest('div[style*="position:fixed"]').remove(),D()}catch{alert("Error guardando gasto")}};window.eliminarGasto=async e=>{if(confirm("¿Eliminar este gasto?"))try{await fetch(g+"/finanzas/gastos/"+e,{method:"DELETE"}),D()}catch{alert("Error eliminando gasto")}};async function Z(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/finanzas/proveedores")).json();e.innerHTML=`
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
              ${o.map(n=>`
                <tr>
                  <td><strong>${n.nombre}</strong></td>
                  <td>${n.contacto||"—"}</td>
                  <td>${n.telefono||"—"}</td>
                  <td>${n.ciudad||"—"}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProveedor('${n.id}')">Editar</button>
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
  `,document.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&o.remove()})};window.guardarProveedor=async e=>{const t={nombre:document.getElementById("prov-nombre").value,contacto:document.getElementById("prov-contacto").value,telefono:document.getElementById("prov-telefono").value,email:document.getElementById("prov-email").value,ciudad:document.getElementById("prov-ciudad").value,direccion:document.getElementById("prov-direccion").value,notas:document.getElementById("prov-notas").value};if(!t.nombre){alert("El nombre es requerido");return}try{e?await fetch(g+"/finanzas/proveedores/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}):await fetch(g+"/finanzas/proveedores",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),document.querySelector('div[style*="position:fixed"]').remove(),Z()}catch{alert("Error guardando proveedor")}};window.editarProveedor=async e=>{const n=(await(await fetch(g+"/finanzas/proveedores")).json()).find(a=>a.id===e);n&&mostrarFormProveedor(n)};async function pe(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando análisis...</p>';try{const[t,o,n,a]=await Promise.all([fetch(g+"/productos/"),fetch(g+"/variantes/"),fetch(g+"/movimientos/"),fetch(g+"/inventario/")]),i=await t.json(),r=await o.json(),s=await n.json(),d=await a.json(),l=new Date,c=new Date(l-30*24*60*60*1e3),p=new Date(l-60*24*60*60*1e3),m=new Date(l-90*24*60*60*1e3),f={};s.filter(y=>y.tipo==="venta").forEach(y=>{const h=r.find(E=>E.id===y.variante_id);if(!h)return;const v=h.producto_id;f[v]||(f[v]={d30:0,d60:0,d90:0});const x=new Date(y.created_at),C=Math.abs(y.cantidad);x>=c&&(f[v].d30+=C),x>=p&&(f[v].d60+=C),x>=m&&(f[v].d90+=C)});const u=i.map(y=>{const h=f[y.id]||{d30:0,d60:0,d90:0},v=d.filter(w=>r.find(_=>_.id===w.variante_id&&_.producto_id===y.id)).reduce((w,_)=>w+_.cantidad,0),x=h.d30/4,C=x>0?Math.round(v/x*7):null;let E="gris",k="Sin ventas recientes";return h.d30>=6?(E="verde",k="Rota bien — considerar resurtido"):h.d30>=2?(E="amarillo",k="Rotacion moderada"):h.d90===0&&v>0?(E="rojo",k="Sin movimiento en 90 dias — revisar"):h.d30>0&&(E="amarillo",k="Rotacion lenta"),{...y,ventas:h,stockTotal:v,ventasSemana:x,diasInventario:C,semaforo:E,recomendacion:k}}).sort((y,h)=>h.ventas.d30-y.ventas.d30),b={verde:{bg:"#e8f5e9",color:"#2e7d32",texto:"🟢 Rota bien"},amarillo:{bg:"#fff8e1",color:"#f57f17",texto:"🟡 Rotacion lenta"},rojo:{bg:"#ffebee",color:"#c62828",texto:"🔴 Sin movimiento"},gris:{bg:"#f5f5f5",color:"#888",texto:"⚪ Sin datos"}};e.innerHTML=`
      <div style="margin-bottom:1.5rem">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">📊 Analisis de rotacion</h2>
        <p style="color:#888;font-size:0.85rem">Velocidad de venta y recomendaciones de resurtido por modelo</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:2rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Vendidos 30 días</p>
          <p style="font-size:1.8rem;font-weight:700;color:#E91E8C">${u.reduce((y,h)=>y+h.ventas.d30,0)}</p>
          <p style="font-size:0.75rem;color:#aaa">pares</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Vendidos 90 días</p>
          <p style="font-size:1.8rem;font-weight:700;color:#E91E8C">${u.reduce((y,h)=>y+h.ventas.d90,0)}</p>
          <p style="font-size:0.75rem;color:#aaa">pares</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Rotan bien</p>
          <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${u.filter(y=>y.semaforo==="verde").length}</p>
          <p style="font-size:0.75rem;color:#aaa">modelos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Sin movimiento</p>
          <p style="font-size:1.8rem;font-weight:700;color:#c62828">${u.filter(y=>y.semaforo==="rojo").length}</p>
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
          ${u.map(y=>{const h=b[y.semaforo];return`
              <div class="rotacion-item" data-semaforo="${y.semaforo}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                ${y.imagen_principal?`<img src="${y.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:8px;background:#f5f5f5;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>'}
                <div style="flex:1;min-width:140px">
                  <p style="font-weight:600;font-size:0.9rem;margin-bottom:2px">${y.nombre}</p>
                  <p style="font-size:0.75rem;color:#888">${y.sku_interno||""} · Stock: ${y.stockTotal} pares</p>
                  <span style="display:inline-block;margin-top:4px;padding:2px 8px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${h.bg};color:${h.color}">${h.texto}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;min-width:200px">
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${y.ventas.d30}</p>
                    <p style="font-size:0.65rem;color:#aaa">30 días</p>
                  </div>
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${y.ventas.d60}</p>
                    <p style="font-size:0.65rem;color:#aaa">60 días</p>
                  </div>
                  <div>
                    <p style="font-size:1.1rem;font-weight:700;color:#333">${y.ventas.d90}</p>
                    <p style="font-size:0.65rem;color:#aaa">90 días</p>
                  </div>
                </div>
                <div style="text-align:right;min-width:120px">
                  <p style="font-size:0.82rem;font-weight:600;color:#333">${y.ventasSemana.toFixed(1)} pares/sem</p>
                  <p style="font-size:0.75rem;color:${y.diasInventario?y.diasInventario<14?"#c62828":y.diasInventario<30?"#f57f17":"#2e7d32":"#aaa"}">${y.diasInventario?`~${y.diasInventario} días stock`:"Sin ventas"}</p>
                  <p style="font-size:0.72rem;color:#888;margin-top:2px">${y.recomendacion}</p>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,window._rotacionData=u}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando análisis</p>'}}window.filtrarRotacion=e=>{document.querySelectorAll(".rotacion-item").forEach(t=>{t.style.display=e==="todos"||t.dataset.semaforo===e?"":"none"})};async function Y(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando CRM...</p>';try{const[t,o,n]=await Promise.all([fetch(g+"/clientes/"),fetch(g+"/pedidos/"),fetch(g+"/crm/seguimientos/pendientes/todos")]),a=await t.json(),i=await o.json(),r=await n.json(),s=new Date,d=new Date(s-30*24*60*60*1e3),l=new Date(s-60*24*60*60*1e3),c=new Date(s-90*24*60*60*1e3),p=a.map(v=>{const x=i.filter(I=>I.cliente_id===v.id&&(I.status==="confirmado"||I.status==="pagado")),C=x.reduce((I,T)=>I+parseFloat(T.total||0),0),E=x.length>0?new Date(x[0].created_at):null,k=E?Math.floor((s-E)/(1e3*60*60*24)):null,w=x.filter(I=>new Date(I.created_at)>=d).length;let _="nuevo";return x.length===0?_="nuevo":C>=5e3&&w>=1?_="vip":k>90?_="inactivo":k>30?_="riesgo":w>=2?_="frecuente":_="activo",{...v,totalGastado:C,ultimoPedido:E,diasSinComprar:k,pedidos30:w,segmento:_,totalPedidos:x.length}}),m=p.filter(v=>v.segmento==="vip"),f=p.filter(v=>v.segmento==="riesgo").sort((v,x)=>x.totalGastado-v.totalGastado),u=p.filter(v=>v.segmento==="inactivo").sort((v,x)=>x.totalGastado-v.totalGastado),b=[...p].sort((v,x)=>x.totalGastado-v.totalGastado).slice(0,10),y=i.filter(v=>new Date(v.created_at).toDateString()===s.toDateString()&&(v.status==="confirmado"||v.status==="pagado")).reduce((v,x)=>v+parseFloat(x.total||0),0),h=i.filter(v=>new Date(v.created_at)>=d&&(v.status==="confirmado"||v.status==="pagado")).reduce((v,x)=>v+parseFloat(x.total||0),0);e.innerHTML=`
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
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${y.toFixed(0)}</p>
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
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${f.length}</p>
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
            <span style="font-size:0.75rem;color:#888">${f.length} clientes</span>
          </div>
          ${f.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin clientes en riesgo</div>':f.slice(0,5).map(v=>`
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
            <span style="font-size:0.75rem;color:#888">${r.length} pendientes</span>
          </div>
          ${r.length===0?'<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin recordatorios pendientes 🎉</div>':r.slice(0,5).map(v=>{var x;return`
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${((x=v.clientes)==null?void 0:x.nombre)||"Cliente"}</p>
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
        ${b.map((v,x)=>`
          <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
               onclick="verCliente('${v.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
            <span style="font-size:0.85rem;font-weight:700;color:${x<3?"#f57f17":"#aaa"};min-width:20px">${x+1}</span>
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
    `,window._crmData={clientes:p,pedidos:i,recordatorios:r}}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error cargando CRM: '+t.message+"</p>"}}window.mostrarSegmento=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const o=t.filter(i=>i.segmento===e).sort((i,r)=>r.totalGastado-i.totalGastado),n={vip:"⭐ Clientes VIP",riesgo:"🟡 En riesgo",inactivo:"🔴 Inactivos",frecuente:"🟢 Frecuentes"},a=document.getElementById("crm-segmento-detalle");a.style.display="block",a.innerHTML=`
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">${n[e]||e} (${o.length})</p>
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
  `,a.scrollIntoView({behavior:"smooth"})};window.completarRecordatorio=async e=>{try{await fetch(g+"/crm/seguimientos/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completado:!0})}),Y()}catch{alert("Error al completar recordatorio")}};window.mostrarPipeline=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando pipeline...</p>';try{const o=await(await fetch(g+"/crm/oportunidades")).json(),n=[{id:"contacto",label:"📞 Contacto",color:"#e3f2fd",colorText:"#1565c0"},{id:"interes",label:"👀 Interés",color:"#f3e5f5",colorText:"#6a1b9a"},{id:"cotizacion",label:"📋 Cotización",color:"#fff8e1",colorText:"#f57f17"},{id:"negociacion",label:"🤝 Negociación",color:"#fce4f3",colorText:"#E91E8C"},{id:"ganado",label:"✅ Ganado",color:"#e8f5e9",colorText:"#2e7d32"},{id:"perdido",label:"❌ Perdido",color:"#ffebee",colorText:"#c62828"}];e.innerHTML=`
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCRM()">← Volver al CRM</button>
        <h2 style="flex:1;font-size:1.1rem;font-weight:700">📊 Pipeline de oportunidades</h2>
        <button class="btn btn-primary" onclick="nuevaOportunidad()">+ Nueva oportunidad</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${n.map(a=>{const i=o.filter(s=>s.etapa===a.id),r=i.reduce((s,d)=>s+parseFloat(d.monto_estimado||0),0);return`
            <div style="background:${a.color};border-radius:12px;padding:1rem;border:1px solid ${a.colorText}30">
              <p style="font-weight:700;font-size:0.85rem;color:${a.colorText};margin-bottom:4px">${a.label}</p>
              <p style="font-size:0.72rem;color:${a.colorText};margin-bottom:12px">${i.length} ops · $${r.toFixed(0)}</p>
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
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()})};window.buscarClienteOportunidad=e=>{const{clientes:t}=window._crmData||{};if(!t)return;const o=document.getElementById("op-cliente-resultados");if(!e||e.length<2){o.style.display="none";return}const n=t.filter(a=>a.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!n.length){o.style.display="none";return}o.style.display="block",o.innerHTML=n.map(a=>`
    <div onclick="seleccionarClienteOportunidad('${a.id}', '${a.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      ${a.nombre}
    </div>
  `).join("")};window.seleccionarClienteOportunidad=(e,t)=>{document.getElementById("op-cliente-id").value=e,document.getElementById("op-cliente-buscar").value=t,document.getElementById("op-cliente-resultados").style.display="none"};window.guardarOportunidad=async()=>{const e=document.getElementById("op-titulo").value,t=document.getElementById("op-cliente-id").value,o=document.getElementById("op-monto").value,n=document.getElementById("op-etapa").value,a=document.getElementById("op-fecha").value,i=document.getElementById("op-notas").value;if(!e){alert("El título es requerido");return}try{await fetch(g+"/crm/oportunidades",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,cliente_id:t||null,monto_estimado:parseFloat(o)||0,etapa:n,fecha_cierre_estimada:a||null,notas:i})}),document.getElementById("modal-oportunidad").remove(),mostrarPipeline()}catch{alert("Error guardando oportunidad")}};async function H(e,t=!1){const o=document.getElementById("content");try{const a=await(await fetch(g+"/productos/")).json(),i=a.filter(c=>c.activo),r=a.filter(c=>!c.activo),s=t?r:i;console.log("mostrarInactivos:",t,"base:",s.length,"inactivos:",r.length);const d=[...new Set(i.map(c=>c.categoria).filter(Boolean))],l=e?s.filter(c=>c.categoria===e):s;o.innerHTML=`
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
    `}catch{o.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.cargarProductos=H;window.mostrarCampanas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando campañas...</p>';try{const[t,o]=await Promise.all([fetch(g+"/clientes/"),fetch(g+"/pedidos/")]),n=await t.json(),a=await o.json(),i=new Date,r=new Date(i-30*24*60*60*1e3),s=new Date(i-90*24*60*60*1e3),d=n.map(p=>{const m=a.filter(v=>v.cliente_id===p.id&&(v.status==="confirmado"||v.status==="pagado")),f=m.reduce((v,x)=>v+parseFloat(x.total||0),0),u=m.length>0?new Date(m[0].created_at):null,b=u?Math.floor((i-u)/(1e3*60*60*24)):null,y=m.filter(v=>new Date(v.created_at)>=r).length;let h="nuevo";return m.length===0?h="nuevo":f>=5e3&&y>=1?h="vip":b>90?h="inactivo":b>30?h="riesgo":y>=2?h="frecuente":h="activo",{...p,totalGastado:f,diasSinComprar:b,segmento:h}}).filter(p=>p.telefono);window._campanaClientes=d;const l=[{id:"catalogo",nombre:"👠 Catálogo completo",descripcion:"Envía el catálogo completo de productos",mensaje:p=>`Hola ${p}! 👋

Te compartimos nuestro catálogo completo de calzado para dama.

✨ Encuentra tacones, sandalias, botas, botines y más.

🛍️ Ver catálogo completo:
https://zapatillasmay.mx/#catalogo

Cualquier pregunta con gusto te atendemos 😊`},{id:"nuevos",nombre:"🆕 Nuevos modelos",descripcion:"Envía los últimos modelos agregados",mensaje:p=>`¡Hola ${p}! 👋

¡Llegaron nuevos modelos a Zapatillas May! 👠✨

¿Te interesa? Con gusto te damos más información y tallas disponibles.

¡Escríbenos para hacer tu pedido! 🛍️`},{id:"mayoreo",nombre:"📦 Precios mayoreo",descripcion:"Envía información de precios mayoreo",mensaje:p=>`Hola ${p}! 👋

Te recordamos nuestros precios de mayoreo:

📦 3-5 pares variados: -$30 por par
📦 6+ pares variados: -$70 por par
📦 Corrida completa: -$110 por par

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
              <p style="font-size:0.75rem;color:#999;margin-bottom:0.5rem">Elige el modelo y selecciona los colores a enviar</p>
              <select id="campana-nuevo-modelo-sel" class="form-input" style="font-size:0.82rem;margin-bottom:0.75rem;width:100%" onchange="cargarColoresNuevoModelo(this.value)">
                <option value="">— Elige un modelo —</option>
              </select>
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
    `,window._plantillasCampana=l,window._campanaImagenUrl="",actualizarVistaCampana(),cargarProductosCampana(),verificarEstadoWA()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando campañas</p>'}};window._waEstadoInterval=null;window.verificarEstadoWA=async()=>{try{const t=await(await fetch(g+"/campanas/wa-estado")).json(),o=document.getElementById("wa-estado-badge"),n=document.getElementById("wa-estado-texto"),a=document.getElementById("wa-btn-conectar"),i=document.getElementById("wa-btn-desconectar");return o&&(t.conectado?(o.style.background="#e8f5e9",o.style.color="#2e7d32",o.textContent="✅ Conectado",n.textContent="WhatsApp Business conectado y listo para enviar",a.style.display="none",i.style.display="inline-flex",document.getElementById("wa-qr-panel").style.display="none",window._waEstadoInterval&&(clearInterval(window._waEstadoInterval),window._waEstadoInterval=null)):(o.style.background="#ffebee",o.style.color="#c62828",o.textContent="🔴 Desconectado",n.textContent="Conecta tu WhatsApp Business para enviar campañas automáticas",a.style.display="inline-flex",i.style.display="none")),t.conectado}catch{const t=document.getElementById("wa-estado-badge");return t&&(t.style.background="#fff8e1",t.style.color="#f57f17",t.textContent="⚠️ Sin conexión al servidor"),!1}};window.mostrarQRWhatsApp=async()=>{const e=document.getElementById("wa-qr-panel"),t=document.getElementById("wa-qr-img");if(!(!e||!t)){e.style.display="block",t.innerHTML='<p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>';try{const n=await(await fetch(g+"/campanas/wa-qr")).json();if(n.qr){const a=n.qr.startsWith("data:")?n.qr:"data:image/png;base64,"+n.qr;t.innerHTML=`<img src="${a}" style="width:220px;height:220px;display:block">`,window._waEstadoInterval&&clearInterval(window._waEstadoInterval),window._waEstadoInterval=setInterval(async()=>{await window.verificarEstadoWA()&&clearInterval(window._waEstadoInterval)},4e3)}else t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${n.error||"No se obtuvo QR"}</p>`}catch(o){t.innerHTML=`<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${o.message}</p>`}}};window.desconectarWhatsApp=async()=>{confirm("¿Desconectar WhatsApp Business?")&&(await fetch(g+"/campanas/wa-desconectar",{method:"POST"}),verificarEstadoWA())};window.actualizarVistaCampana=()=>{var p,m,f,u;const e=((p=document.querySelector('input[name="campana-segmento"]:checked'))==null?void 0:p.value)||"todos",t=((m=document.querySelector('input[name="campana-plantilla"]:checked'))==null?void 0:m.value)||"catalogo",o=(f=window._plantillasCampana)==null?void 0:f.find(b=>b.id===t),n=window._campanaClientes||[],a=document.getElementById("mensaje-personalizado");a&&(a.style.display=t==="personalizado"?"block":"none");let i=n;e!=="todos"&&(["menudeo","mayoreo","zapateria"].includes(e)?i=n.filter(b=>b.tipo===e):i=n.filter(b=>b.segmento===e)),t==="nuevos"&&cargarFotosNuevosModelos();const r=document.getElementById("campana-foto-manual");r&&(r.style.display=t==="nuevos"?"none":"block");const s=document.getElementById("campana-fotos-nuevos");s&&(s.style.display=t==="nuevos"?"block":"none");const d=document.getElementById("mensaje-preview");if(d){if(t==="catalogo_interactivo")d.style.background="#e3f2fd",d.style.borderColor="#90caf9",d.style.color="#1565c0",d.textContent=`🛍️ Los productos seleccionados se enviarán como tarjetas interactivas en WhatsApp.

El cliente puede ver cada modelo, elegir talla/color y hacer su pedido directamente desde el chat.

⚠️ Requiere que los productos estén en el catálogo de Meta Commerce.`;else if(d.style.background="#e8f5e9",d.style.borderColor="#a5d6a7",d.style.color="#333",o){let b;t==="personalizado"?b=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}","María"):b=o.mensaje("María"),d.textContent=b}}const l=document.getElementById("campana-count");l&&(l.textContent=i.length+" clientes");const c=document.getElementById("campana-lista");if(c){if(!i.length){c.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No hay clientes en este segmento con teléfono registrado</div>';return}window._campanaFiltrados=i,window._campanaPlantillaId=t,c.innerHTML=i.map((b,y)=>{var C;let h;t==="personalizado"?h=(((C=document.getElementById("texto-personalizado"))==null?void 0:C.value)||"").replace("{nombre}",b.nombre.split(" ")[0]):h=o.mensaje(b.nombre.split(" ")[0]);const v=encodeURIComponent(h),x=(b.lada||"52")+b.telefono.replace(/\D/g,"");return`
      <div class="campana-cli-row" data-idx="${y}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${y}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${b.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${b.tipo==="mayoreo"?"Mayoreo":b.tipo==="zapateria"?"Corridas":"Menudeo"} · ${b.telefono}</p>
        </div>
        <a href="https://wa.me/${x}?text=${v}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `}).join(""),actualizarContadorCampana()}};window.actualizarContadorCampana=()=>{const t=document.querySelectorAll(".campana-cli-check:checked").length;document.querySelectorAll("#campana-sel-count, #campana-sel-count-auto").forEach(i=>{i&&(i.textContent=t)});const o=document.getElementById("btn-campana-seleccionados"),n=document.getElementById("btn-campana-auto");o&&(o.style.display=t>0?"inline-flex":"none"),n&&(n.style.display=t>0?"inline-flex":"none"),document.querySelectorAll(".campana-cli-check").forEach(i=>i.disabled=!1);const a=document.getElementById("campana-sel-todos");if(a){const i=document.querySelectorAll(".campana-cli-check").length;a.checked=t>0&&t===i,a.indeterminate=t>0&&t<i}};window.filtrarClientesCampana=e=>{var s;const t=(e||"").toLowerCase().trim(),o=window._campanaFiltrados||[],n=window._campanaPlantillaId||"catalogo",a=(s=window._plantillasCampana)==null?void 0:s.find(d=>d.id===n),i=document.getElementById("campana-lista");if(!i)return;const r=t?o.filter(d=>d.nombre.toLowerCase().includes(t)||(d.telefono||"").includes(t)):o;if(!r.length){i.innerHTML='<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No se encontraron clientes</div>';return}i.innerHTML=r.map(d=>{var f;const l=o.indexOf(d);let c;n==="personalizado"?c=(((f=document.getElementById("texto-personalizado"))==null?void 0:f.value)||"").replace("{nombre}",d.nombre.split(" ")[0]):c=a?a.mensaje(d.nombre.split(" ")[0]):"";const p=encodeURIComponent(c),m=(d.lada||"52")+d.telefono.replace(/\D/g,"");return`
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
    `}).join("")};window.cargarFotosNuevosModelos=async()=>{const e=document.getElementById("campana-nuevo-modelo-sel"),t=document.getElementById("campana-fotos-nuevos-grid");if(e&&!(e.options.length>1))try{const n=await(await fetch(g+"/productos/?activo=eq.true&select=id,nombre,sku_interno&order=created_at.desc&limit=100")).json();if(!n.length){t&&(t.innerHTML='<p style="font-size:0.8rem;color:#aaa">No hay productos activos</p>');return}e.innerHTML='<option value="">— Elige un modelo —</option>'+n.map(a=>`<option value="${a.id}">${a.nombre||a.sku_interno}</option>`).join("")}catch{t&&(t.innerHTML='<p style="color:red;font-size:0.8rem">Error cargando modelos</p>')}};window.cargarColoresNuevoModelo=async e=>{const t=document.getElementById("campana-fotos-nuevos-grid"),o=document.getElementById("campana-fotos-count");if(window._campanaColoresNuevos=[],window._campanaColoresSeleccionados=new Set,!e){t.innerHTML="",o&&(o.textContent="");return}t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px 0">Cargando colores...</p>';try{const a=await(await fetch(g+"/variantes/producto/"+e)).json(),i={};for(const s of a)s.color&&(i[s.color]||(i[s.color]={color:s.color,color_hex:s.color_hex||null,foto_url:null}),!i[s.color].foto_url&&s.foto_url&&(i[s.color].foto_url=s.foto_url));const r=Object.values(i).filter(s=>s.foto_url);if(!r.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa">Este modelo no tiene fotos en sus variantes. Sube fotos a las variantes primero.</p>',o&&(o.textContent="");return}window._campanaColoresNuevos=r,r.forEach((s,d)=>window._campanaColoresSeleccionados.add(d)),_renderColoresNuevos(r),actualizarCountFotos()}catch{t.innerHTML='<p style="color:red;font-size:0.8rem">Error cargando variantes</p>'}};window._renderColoresNuevos=e=>{const t=document.getElementById("campana-fotos-nuevos-grid");t&&(t.innerHTML=e.map((o,n)=>{var i;const a=(i=window._campanaColoresSeleccionados)==null?void 0:i.has(n);return`
    <div onclick="toggleColorNuevo(${n}, this)"
         style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:2px solid ${a?"#E91E8C":"#eee"};cursor:pointer;background:${a?"#fce4ec":"white"};transition:all 0.15s" id="color-nuevo-row-${n}">
      <input type="checkbox" ${a?"checked":""} onclick="event.stopPropagation();toggleColorNuevo(${n},this.closest('[id]'))"
             style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0">
      <div style="width:24px;height:24px;border-radius:50%;background:${o.color_hex||"#ccc"};border:2px solid rgba(0,0,0,0.1);flex-shrink:0"></div>
      <span style="flex:1;font-size:0.85rem;font-weight:600">${o.color}</span>
      <img src="${o.foto_url}" style="width:46px;height:46px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">
    </div>`}).join(""))};window.toggleColorNuevo=(e,t)=>{window._campanaColoresSeleccionados||(window._campanaColoresSeleccionados=new Set);const o=document.getElementById("color-nuevo-row-"+e),n=o==null?void 0:o.querySelector("input[type=checkbox]");window._campanaColoresSeleccionados.has(e)?(window._campanaColoresSeleccionados.delete(e),o&&(o.style.borderColor="#eee",o.style.background="white"),n&&(n.checked=!1)):(window._campanaColoresSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fce4ec"),n&&(n.checked=!0)),actualizarCountFotos()};window.actualizarCountFotos=()=>{var o;const e=document.getElementById("campana-fotos-count");if(!e)return;const t=((o=window._campanaColoresSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t} color${t>1?"es":""} seleccionado${t>1?"s":""} — cada cliente recibirá ${t} foto${t>1?"s":""}`:"Ningún color seleccionado"};window.cargarProductosCampana=async()=>{const e=document.getElementById("campana-producto-sel");if(e)try{const o=await(await fetch(g+"/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=created_at.desc&limit=60")).json();e.innerHTML='<option value="">— Sin foto —</option>'+o.filter(n=>n.imagen_principal).map(n=>`<option value="${n.imagen_principal}" data-nombre="${n.nombre}">${n.nombre||n.sku_interno}</option>`).join("")}catch(t){console.error("Error cargando productos campana:",t)}};window.seleccionarProductoCampana=e=>{window._campanaImagenUrl=e||"";const t=document.getElementById("campana-foto-preview"),o=document.getElementById("campana-foto-img");t&&o&&(e?(o.src=e,t.style.display="block"):(t.style.display="none",o.src=""))};window.quitarFotoCampana=()=>{window._campanaImagenUrl="";const e=document.getElementById("campana-producto-sel");e&&(e.value="");const t=document.getElementById("campana-foto-preview");t&&(t.style.display="none")};window.cargarProductosInteractivo=async()=>{const e=document.getElementById("campana-prod-grid");if(e){if(window._campanaProdInteractivoCargado){renderizarProductosInteractivo(window._campanaProdInteractivo||[]);return}e.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">Cargando...</p>';try{const o=await(await fetch(g+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._campanaProdInteractivo=o,window._campanaProdSeleccionados=new Set,window._campanaProdInteractivoCargado=!0,renderizarProductosInteractivo(o)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:8px">Error cargando productos</p>')}}};window.renderizarProductosInteractivo=e=>{const t=document.getElementById("campana-prod-grid");if(!t)return;const o=window._campanaProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:8px">No hay productos</p>';return}t.innerHTML=e.map(n=>{const a=n.sku_interno||n.id,i=o.has(a);return`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;border:1px solid ${i?"#E91E8C":"#f0f0f0"};background:${i?"#fff0f8":"white"};transition:all 0.1s" id="prod-lbl-${a}">
      <input type="checkbox" ${i?"checked":""} onchange="toggleProdInteractivo('${a}', this)"
        style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${n.imagen_principal?`<img src="${n.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:32px;height:32px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.nombre||a}</p>
        <p style="font-size:0.68rem;color:#aaa">${a}${n.categoria?" · "+n.categoria:""}</p>
      </div>
    </label>`}).join(""),actualizarCountProdInteractivo()};window.toggleProdInteractivo=(e,t)=>{window._campanaProdSeleccionados||(window._campanaProdSeleccionados=new Set);const o=document.getElementById("prod-lbl-"+e);if(t.checked){if(window._campanaProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos por mensaje interactivo");return}window._campanaProdSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fff0f8")}else window._campanaProdSeleccionados.delete(e),o&&(o.style.borderColor="#f0f0f0",o.style.background="white");actualizarCountProdInteractivo()};window.actualizarCountProdInteractivo=()=>{var o;const e=document.getElementById("campana-prod-count");if(!e)return;const t=((o=window._campanaProdSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:"Ningún producto seleccionado"};window.filtrarProductosInteractivo=e=>{const t=(e||"").toLowerCase().trim(),o=window._campanaProdInteractivo||[],n=t?o.filter(a=>(a.nombre||"").toLowerCase().includes(t)||(a.sku_interno||"").toLowerCase().includes(t)||(a.categoria||"").toLowerCase().includes(t)):o;renderizarProductosInteractivo(n)};window.enviarCatalogoInteractivo=async e=>{var i;const t=window._campanaFiltrados||[],o=Array.from(window._campanaProdSeleccionados||new Set);if(!o.length){alert("Selecciona al menos un producto");return}const n=e.map(r=>t[r]).filter(Boolean).map(r=>({telefono:r.telefono,nombre:r.nombre}));if(!n.length)return;const a=document.createElement("div");a.id="campana-auto-overlay",a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",a.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${n.length} contacto${n.length>1?"s":""} · ${o.length} producto${o.length>1?"s":""}</p>
  </div>`,document.body.appendChild(a);try{const s=await(await fetch(g+"/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:n,skus:o,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();a.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${s.fallidos===0?"🎉":"✅"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${s.enviados||0} enviados</p>
      ${s.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${s.fallidos} fallidos</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${(i=s.errores)!=null&&i.length?`<p style="font-size:0.7rem;color:#aaa;margin-bottom:1rem">${s.errores[0]}</p>`:""}
      <button onclick="document.getElementById('campana-auto-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(r){a.remove(),alert("Error: "+r.message)}};window.enviarCampanaAutomatica=async()=>{var c,p;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(m=>parseInt(m.dataset.idx)),o=window._campanaFiltrados||[],n=window._campanaPlantillaId||"catalogo",a=(c=window._plantillasCampana)==null?void 0:c.find(m=>m.id===n),i=window._campanaImagenUrl||"";let r=[],s=[];if(n==="nuevos"&&((p=window._campanaColoresNuevos)!=null&&p.length)){const m=window._campanaColoresSeleccionados||new Set,f=window._campanaColoresNuevos.filter((u,b)=>m.has(b));if(!f.length){alert("Selecciona al menos un color"),l==null||l.remove();return}s=f.map(u=>({url:u.foto_url,caption:u.color})),r=f.map(u=>u.foto_url)}else i&&(r=[i]);const d=t.map(m=>o[m]).filter(Boolean).map(m=>{var u;let f;return n==="personalizado"?f=(((u=document.getElementById("texto-personalizado"))==null?void 0:u.value)||"").replace("{nombre}",m.nombre.split(" ")[0]):f=a.mensaje(m.nombre.split(" ")[0]),{nombre:m.nombre,telefono:m.telefono,lada:m.lada||"52",mensaje:f}});if(!d.length)return;const l=document.createElement("div");l.id="campana-auto-overlay",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📤</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Iniciando campaña…</h3>
      <p style="font-size:0.82rem;color:#888">Conectando con WhatsApp Business</p>
    </div>`,document.body.appendChild(l);try{const f=await(await fetch(g+"/campanas/enviar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destinatarios:d.map(v=>({nombre:v.nombre,telefono:v.telefono,mensaje:v.mensaje})),fotos_urls:r,fotos_con_caption:s.length?s:null,imagen_url:r.length===1?r[0]:"",delay_segundos:4})})).json();if(f.error){l.remove(),alert("Error: "+f.error);return}const u=f.job_id,b=f.total,y=v=>{var w;const x=v.progreso||0,C=Math.round(x/b*100),E=v.enviados||0,k=v.fallidos||0;l.innerHTML=`
        <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
            <h3 style="font-size:1rem;font-weight:700">🤖 Enviando campaña…</h3>
            <button onclick="cancelarCampanaAuto('${u}')"
              style="background:none;border:1px solid #eee;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#888;cursor:pointer">
              ⏸ Pausar
            </button>
          </div>
          <div style="background:#f5f5f5;border-radius:100px;height:10px;margin-bottom:0.5rem;overflow:hidden">
            <div style="background:linear-gradient(90deg,#E91E8C,#c4116a);height:10px;border-radius:100px;width:${C}%;transition:width 0.5s"></div>
          </div>
          <p style="font-size:0.78rem;color:#888;text-align:center;margin-bottom:1.5rem">${x} de ${b} mensajes enviados</p>
          <div style="display:flex;gap:1rem;justify-content:center">
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#25D366">${E}</p>
              <p style="font-size:0.72rem;color:#888">Enviados</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#e53e3e">${k}</p>
              <p style="font-size:0.72rem;color:#888">Fallidos</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#888">${b-x}</p>
              <p style="font-size:0.72rem;color:#888">Pendientes</p>
            </div>
          </div>
          ${x>0&&((w=v.resultados)!=null&&w.length)?`
            <div style="margin-top:1rem;max-height:120px;overflow-y:auto;border-top:1px solid #f5f5f5;padding-top:0.75rem">
              ${v.resultados.slice(-5).map(_=>`
                <div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:0.75rem">
                  <span style="color:${_.ok?"#25D366":"#e53e3e"}">${_.ok?"✅":"❌"}</span>
                  <span style="flex:1;color:#555">${_.nombre}</span>
                  ${_.ok?"":'<span style="color:#e53e3e;font-size:0.68rem">ventana 24h</span>'}
                </div>`).join("")}
            </div>`:""}
        </div>`};window._campanaJobId=u;const h=setInterval(async()=>{try{const x=await(await fetch(g+"/campanas/estado/"+u)).json();y(x),x.terminado&&(clearInterval(h),setTimeout(()=>{const C=x.enviados||0,E=x.fallidos||0;l.innerHTML=`
              <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
                <div style="font-size:3.5rem;margin-bottom:1rem">${E===0?"🎉":"✅"}</div>
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
                <p style="color:#888;font-size:0.85rem;margin-bottom:0.5rem"><strong style="color:#25D366">${C} enviados</strong> correctamente</p>
                ${E>0?`<p style="color:#e53e3e;font-size:0.8rem;margin-bottom:1rem">${E} fallaron (ventana de 24h cerrada — esos clientes no han escrito recientemente)</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">¡Todo perfecto!</p>'}
                <button onclick="document.getElementById('campana-auto-overlay').remove()"
                  style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">
                  Cerrar
                </button>
              </div>`},600))}catch{clearInterval(h)}},1500)}catch(m){l.remove(),alert("Error conectando con el servidor: "+m.message)}};window.cancelarCampanaAuto=async e=>{try{await fetch(g+"/campanas/cancelar/"+e,{method:"POST"})}catch{}const t=document.getElementById("campana-auto-overlay");t&&t.remove()};window.toggleSeleccionarTodosCampana=e=>{document.querySelectorAll(".campana-cli-check").forEach(o=>{e?o.checked=!0:o.checked=!1}),actualizarContadorCampana()};window.iniciarCampanaSeleccionados=()=>{var l;const e=document.querySelectorAll(".campana-cli-check:checked"),t=Array.from(e).map(c=>parseInt(c.dataset.idx)),o=window._campanaFiltrados||[],n=window._campanaPlantillaId||"catalogo",a=(l=window._plantillasCampana)==null?void 0:l.find(c=>c.id===n),i=t.map(c=>o[c]).filter(Boolean).map(c=>{var f;let p;n==="personalizado"?p=(((f=document.getElementById("texto-personalizado"))==null?void 0:f.value)||"").replace("{nombre}",c.nombre.split(" ")[0]):p=a.mensaje(c.nombre.split(" ")[0]);const m=(c.lada||"52")+c.telefono.replace(/\D/g,"");return{...c,mensaje:p,tel:m}});if(!i.length)return;let r=0;const s=document.createElement("div");s.id="campana-modal-overlay",s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem";const d=()=>{const c=i[r],p=Math.round(r/i.length*100);s.innerHTML=`
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
      `;return}d()},d(),document.body.appendChild(s)};async function me(){const e=document.getElementById("content");try{const[t,o]=await Promise.all([fetch(g+"/clientes/"),fetch(g+"/pedidos/")]),n=await t.json(),a=await o.json(),i=new Date,r=new Date(i-30*24*60*60*1e3),s=new Date(i-90*24*60*60*1e3),d=n.map(f=>{const u=a.filter(w=>w.cliente_id===f.id&&(w.status==="confirmado"||w.status==="pagado")),b=u.reduce((w,_)=>w+parseFloat(_.total||0),0),y=u.length>0?new Date(u[0].created_at):null,h=u.filter(w=>new Date(w.created_at)>=r).length,v=y?Math.floor((i-y)/(1e3*60*60*24)):null;let x="nuevo",C="⚪ Nuevo",E="#f5f5f5",k="#888";return u.length===0?(x="nuevo",C="⚪ Sin compras",E="#f5f5f5",k="#888"):b>=5e3&&h>=1?(x="vip",C="⭐ VIP",E="#fff8e1",k="#f57f17"):v>90?(x="inactivo",C="🔴 Inactivo",E="#ffebee",k="#c62828"):v>30?(x="riesgo",C="🟡 En riesgo",E="#fff8e1",k="#f57f17"):h>=2?(x="frecuente",C="🟢 Frecuente",E="#e8f5e9",k="#2e7d32"):(x="activo",C="🔵 Activo",E="#e3f2fd",k="#1565c0"),{...f,totalGastado:b,ultimoPedido:y,pedidos30:h,diasSinComprar:v,segmento:x,segmentoLabel:C,segmentoBg:E,segmentoColor:k,totalPedidos:u.length}}).sort((f,u)=>u.totalGastado-f.totalGastado),l=d.filter(f=>f.segmento==="vip").length,c=d.filter(f=>f.segmento==="inactivo").length,p=d.filter(f=>f.segmento==="riesgo").length,m=d.filter(f=>f.segmento==="frecuente"||f.segmento==="activo").length;window._clientesData=d,e.innerHTML=`
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('todos')">
          <p style="font-size:1.8rem;font-weight:700;color:#333">${n.length}</p>
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
          <h3>Clientes (${n.length})</h3>
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
          ${d.map(f=>`
            <div class="cli-item" data-segmento="${f.segmento}" data-tipo="${f.tipo||""}" data-nombre="${f.nombre.toLowerCase()}" data-tel="${f.telefono||""}"
                 style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer;transition:background 0.15s"
                 onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'"
                 onclick="verCliente('${f.id}')">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1rem;flex-shrink:0">
                ${f.nombre.charAt(0).toUpperCase()}
              </div>
              <div style="flex:1;min-width:140px">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                  <p style="font-weight:700;font-size:0.95rem">${f.nombre}</p>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${f.segmentoBg};color:${f.segmentoColor}">${f.segmentoLabel}</span>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:#f5f5f5;color:#888">${f.tipo==="mayoreo"?"Mayoreo":f.tipo==="zapateria"?"Corridas":"Menudeo"}</span>
                </div>
                <p style="font-size:0.78rem;color:#888">${f.telefono||"Sin teléfono"}${f.ciudad?" · "+f.ciudad:""}</p>
                ${f.comentarios_internos?`<p style="font-size:0.72rem;color:#E91E8C;margin-top:2px">📝 ${f.comentarios_internos.substring(0,50)}${f.comentarios_internos.length>50?"...":""}</p>`:""}
              </div>
              <div style="text-align:right;min-width:100px">
                <p style="font-weight:700;color:#E91E8C;font-size:0.95rem">$${f.totalGastado.toFixed(0)}</p>
                <p style="font-size:0.72rem;color:#888">${f.totalPedidos} pedidos</p>
                ${f.diasSinComprar!==null?`<p style="font-size:0.68rem;color:${f.diasSinComprar>60?"#c62828":"#aaa"}">${f.diasSinComprar===0?"Hoy":"Hace "+f.diasSinComprar+" días"}</p>`:""}
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0" onclick="event.stopPropagation()">
                ${f.telefono?`<a href="https://wa.me/${f.lada||"52"}${f.telefono.replace(/\D/g,"")}" target="_blank" class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem;background:#25D366;color:white;border-color:#25D366">WhatsApp</a>`:""}
                <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="mostrarFormCliente('${f.id}')">Editar</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarClientes=()=>{var o,n;const e=(((o=document.getElementById("cli-buscar"))==null?void 0:o.value)||"").toLowerCase(),t=((n=document.getElementById("cli-tipo"))==null?void 0:n.value)||"";document.querySelectorAll(".cli-item").forEach(a=>{const i=a.dataset.nombre||"",r=a.dataset.tel||"",s=a.dataset.tipo||"",d=!e||i.includes(e)||r.includes(e),l=!t||s===t;a.style.display=d&&l?"":"none"})};window.filtrarClientesSeg=e=>{document.querySelectorAll(".cli-item").forEach(t=>{if(e==="todos"){t.style.display="";return}if(e==="activos"){t.style.display=t.dataset.segmento==="activo"||t.dataset.segmento==="frecuente"?"":"none";return}t.style.display=t.dataset.segmento===e?"":"none"})};async function ue(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/sucursales/")).json();e.innerHTML=`
      <div class="table-card">
        <div class="table-header">
          <h3>Sucursales (${o.length})</h3>
          <button class="btn btn-primary">+ Nueva sucursal</button>
        </div>
        <table>
          <thead>
           <tr><th>Nombre</th><th>Tipo</th><th>Direccion</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr>          </thead>
          <tbody>
            ${o.map(n=>`
              <tr>
                <td><strong>${n.nombre}</strong></td>
                <td>${n.tipo}</td>
                <td>${n.direccion||"—"}</td>
                <td>${n.telefono||"—"}</td>
                <td><span class="badge badge-success">Activa</span></td>
             <td>
              <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormSucursal('${n.id}')">Editar</button>
              </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}async function fe(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/sucursales/")).json(),a=await(await fetch(g+"/productos/")).json(),r=await(await fetch(g+"/variantes/")).json(),d=await(await fetch(g+"/inventario/")).json();window._invData={sucursales:o,productos:a,variantes:r,inventario:d},e.innerHTML=`
  <div style="margin-bottom:1.5rem">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <input class="form-input" id="inv-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="flex:1;min-width:200px" oninput="renderInventario()">
      <select class="form-input" id="inv-categoria" style="min-width:140px" onchange="renderInventario()">
        <option value="">Todas las categorias</option>
        ${[...new Set(a.map(l=>l.categoria).filter(Boolean))].map(l=>`<option value="${l}">${l.charAt(0).toUpperCase()+l.slice(1)}</option>`).join("")}
      </select>
      <select class="form-input" id="inv-talla" style="min-width:100px" onchange="renderInventario()">
        <option value="">Todas las tallas</option>
        ${J.map(l=>`<option value="${l}">${l}</option>`).join("")}
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
`,renderInventario()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.renderInventario=()=>{const{sucursales:e,productos:t,variantes:o,inventario:n}=window._invData,a=(document.getElementById("inv-buscar")?document.getElementById("inv-buscar").value:"").toLowerCase(),i=document.getElementById("inv-categoria")?document.getElementById("inv-categoria").value:"",r=document.getElementById("inv-talla")?document.getElementById("inv-talla").value:"",s=document.getElementById("inv-estado")?document.getElementById("inv-estado").value:"",d=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],l=t.filter(m=>!(!m.activo||a&&!m.nombre.toLowerCase().includes(a)&&!(m.sku_interno||"").toLowerCase().includes(a)||i&&m.categoria!==i)),c=e.map(m=>{const f=n.filter(b=>b.sucursal_id===m.id),u=l.map(b=>{const y=o.filter(C=>C.producto_id===b.id);if(y.length===0)return"";const v=[...new Set(y.map(C=>C.color).filter(Boolean))].map(C=>{const E=y.filter(I=>I.color===C).sort((I,T)=>d.indexOf(I.talla)-d.indexOf(T.talla));if(r&&!E.find(I=>I.talla===r))return"";const k=E[0]?E[0].color_hex:"#888",w=E[0]?E[0].foto_url:null,_=E.map(I=>{const T=f.find(z=>z.variante_id===I.id),S=T?T.cantidad:null,P=T?T.stock_minimo:3;if(r&&I.talla!==r||s&&(s==="agotado"&&S!==0||s==="bajo"&&(S===null||S===0||S>P)||s==="disponible"&&(S===null||S===0||S<=P)))return"";let A,$;return S===null?(A="#f0f0f0",$="#aaa"):S===0?(A="#ffebee",$="#c62828"):S<=P?(A="#fff8e1",$="#f57f17"):(A="#e8f5e9",$="#2e7d32"),`
            <div style="display:flex;align-items:center;justify-content:space-between;background:${A};border-radius:10px;padding:8px 12px;border:1px solid ${$}30">
              <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:44px">T${I.talla}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="cambiarStockInventario('${I.id}', '${m.id}', ${S!==null?S:0}, ${P}, -1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
                <span id="stock-${I.id}-${m.id}" style="font-size:1.1rem;font-weight:700;color:${$};min-width:32px;text-align:center">${S!==null?S:"—"}</span>
                <button onclick="cambiarStockInventario('${I.id}', '${m.id}', ${S!==null?S:0}, ${P}, 1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
            </div>
          `}).join("");return _.trim()?`
          <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              ${w?`<img src="${w}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:`<div style="width:52px;height:52px;background:${k};border-radius:8px;border:1px solid #eee;flex-shrink:0;opacity:0.7"></div>`}
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:14px;height:14px;border-radius:50%;background:${k};border:2px solid #ddd;flex-shrink:0"></div>
                <span style="font-size:0.9rem;font-weight:600;color:#333">${C}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
              ${_}
            </div>
          </div>
        `:""}).join("");if(!v.trim())return"";const x=b.imagen_principal;return`
        <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
            ${x?`<img src="${x}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`:'<div style="width:56px;height:56px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>'}
            <div>
              <p style="font-weight:700;font-size:1rem;color:#1a1a1a;margin-bottom:2px">${b.nombre}</p>
              <div>
                <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px;margin-right:4px">${b.sku_interno||"—"}</span>
                <span style="font-size:0.72rem;color:#E91E8C;background:#fce4f3;padding:2px 8px;border-radius:100px">${b.categoria||""}</span>
              </div>
            </div>
          </div>
          ${v}
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
    `:""}).join(""),p=document.getElementById("inv-contenido");p&&(p.innerHTML=c||'<div style="text-align:center;padding:3rem;color:#888"><p>No hay inventario registrado</p></div>')};window.cambiarStockInventario=async(e,t,o,n,a)=>{const i=Math.max(0,o+a);try{if((await fetch(g+"/inventario/actualizar",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:i,stock_minimo:n})})).ok){const s=document.getElementById("stock-"+e+"-"+t);if(s){s.textContent=i;let c;i===0?c="#c62828":i<=n?c="#f57f17":c="#2e7d32",s.style.color=c}const d=window._invData.inventario.find(c=>c.variante_id===e&&c.sucursal_id===t);d&&(d.cantidad=i),document.querySelectorAll(`button[onclick*="${e}"][onclick*="${t}"]`).forEach(c=>{c.setAttribute("onclick",c.getAttribute("onclick").replace(/cambiarStockInventario\('[^']+', '[^']+', \d+,/,`cambiarStockInventario('${e}', '${t}', ${i},`))})}}catch{alert("Error actualizando stock")}};window.editarStock=async(e,t,o,n)=>{const a=prompt("Nueva cantidad:",o);if(a===null)return;const i=prompt("Stock minimo de alerta:",n);if(i!==null)try{if((await fetch(g+"/inventario/actualizar",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(a),stock_minimo:parseInt(i)})})).ok){const s=await fetch(g+"/inventario/");window._invData.inventario=await s.json(),renderInventario()}}catch{alert("Error conectando con el servidor")}};window.mostrarFormInventario=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarInventario=async()=>{const e=document.getElementById("inv-sucursal").value,t=document.getElementById("inv-v").value,o=document.getElementById("inv-cantidad").value,n=document.getElementById("inv-minimo").value||3;if(!e||!t||o===""){alert("Por favor completa todos los campos");return}try{(await fetch(g+"/inventario/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sucursal_id:e,variante_id:t,cantidad:parseInt(o),stock_minimo:parseInt(n)})})).ok?(alert("Stock guardado correctamente"),navegarA("inventario")):alert("Error al guardar stock")}catch{alert("Error conectando con el servidor")}};window.mostrarAlertas=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando alertas...</p>';try{const o=await(await fetch(g+"/inventario/alertas")).json();e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#f57f17">Productos con stock bajo o agotado (${o.length})</h3>
      </div>
      ${o.length===0?'<div class="table-card" style="padding:3rem;text-align:center;color:#888"><p>Todo el inventario esta en buen nivel</p></div>':`<div class="table-card"><table>
          <thead><tr><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Minimo</th><th>Estado</th><th>Accion</th></tr></thead>
          <tbody>
            ${o.map(n=>{const a=n.cantidad||0,i=n.stock_minimo||3,r=a===0;return`
                <tr style="background:${r?"#fff5f5":"#fffdf0"}">
                  <td><strong>${n.variantes&&n.variantes.productos?n.variantes.productos.nombre:"—"}</strong></td>
                  <td>${n.variantes&&n.variantes.color||"—"}</td>
                  <td>${n.variantes&&n.variantes.talla||"—"}</td>
                  <td>${n.sucursales&&n.sucursales.nombre||"—"}</td>
                  <td><strong style="color:${r?"#c62828":"#f57f17"}">${a}</strong></td>
                  <td>${i}</td>
                  <td><span class="badge ${r?"badge-danger":"badge-warning"}">${r?"Agotado":"Stock bajo"}</span></td>
                  <td><button class="btn btn-primary" style="padding:4px 10px;font-size:0.75rem" onclick="editarStock('${n.variante_id}', '${n.sucursal_id}', ${a}, ${i})">Reabastecer</button></td>
                </tr>
              `}).join("")}
          </tbody></table></div>`}
    `}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando alertas</p>'}};window.mostrarAjuste=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarAjuste=async()=>{const e=document.getElementById("aj").value,t=document.getElementById("aj-sucursal").value,o=document.getElementById("aj-cantidad").value,n=document.getElementById("aj-motivo").value;if(!e||!t||o===""){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(g+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(o),motivo:n})})).json();i.ok?(alert("Ajuste guardado. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarCambio=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarCambio=async()=>{const e=document.getElementById("cam-origen").value,t=document.getElementById("cam-destino").value,o=document.getElementById("cam-sucursal").value,n=document.getElementById("cam-motivo").value;if(!e||!t||!o){alert("Por favor selecciona ambos productos y la sucursal");return}if(e===t){alert("El producto que regresa y el que se lleva deben ser diferentes");return}try{const i=await(await fetch(g+"/movimientos/cambio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_origen_id:e,variante_destino_id:t,sucursal_id:o,motivo:n})})).json();i.ok?(alert("Cambio registrado. El inventario se actualizo automaticamente."),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.buscarVariante=(e,t)=>{const o=window._variantesCache||[],n=document.getElementById(t+"-resultados");if(!n)return;if(!e||e.length<2){n.style.display="none";return}const a=e.toLowerCase().split(" ").filter(s=>s),i=o.filter(s=>{const d=(s.productos&&s.productos.nombre||"").toLowerCase(),l=(s.color||"").toLowerCase(),c=(s.talla||"").toLowerCase(),p=(s.sku||"").toLowerCase(),m=d+" "+l+" "+c+" "+p;return a.every(f=>m.includes(f))}).slice(0,15);if(i.length===0){n.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron resultados</div>',n.style.display="block";return}const r=t==="ped-prod";n.innerHTML=i.map(s=>{const d=(s.productos&&s.productos.nombre||"")+" - "+s.color+" - T"+s.talla;return`
      <div onclick="${r?`agregarItemPedido('${s.id}', '${d.replace(/'/g,"")}')`:`seleccionarVariante('${s.id}', '${d.replace(/'/g,"")}', '${t}')`}; document.getElementById('${t}-resultados').style.display='none'; document.getElementById('${r?"ped-buscar-prod":t+"-buscar"}') && (document.getElementById('${r?"ped-buscar-prod":t+"-buscar"}').value='')"
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
    `}).join(""),n.style.display="block"};window.seleccionarVariante=(e,t,o)=>{const n=document.getElementById(o);n&&(n.value=e);const a=document.getElementById(o+"-seleccionado");a&&(a.textContent="Ô£ô "+t,a.style.display="block");const i=document.getElementById(o+"-resultados");i&&(i.style.display="none")};function N(e,t){const o=t||{},n=!t;let a="";o.imagenes&&o.imagenes.length>0?a=o.imagenes.map((s,d)=>{const l=d===0;return`<div style="position:relative;cursor:pointer" data-url="${s}" data-es-portada="${l}" data-file-idx="${d}">
  <img src="${s}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid ${l?"#E91E8C":"#eee"}" onclick="seleccionarPortadaExistente(${e}, ${d})">
        ${l?'<span style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700">PORTADA</span>':""}
        <button onclick="eliminarFotoExistente(${e}, this)" style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`}).join(""):o.foto_url&&(a=`<div style="position:relative" data-url="${o.foto_url}" data-es-portada="true" data-file-idx="0">
      <img src="${o.foto_url}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid #E91E8C">
      <span style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700">PORTADA</span>
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
              style="color:#bbb;font-size:0.8rem;flex-shrink:0;transition:transform 0.2s;transform:${n?"rotate(180deg)":"rotate(0deg)"}">▼</span>
        ${e>0?`<button type="button" onclick="event.stopPropagation();eliminarColorVariante(${e},this)"
                style="background:#ffebee;border:1px solid #ffcdd2;color:#c62828;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:0.75rem;font-weight:600;flex-shrink:0;line-height:1">✕</button>`:""}
      </div>

      <!-- ── Expandable body ── -->
      <div id="v${e}-body" style="display:${n?"block":"none"};padding:1rem;background:#fafafa;border-top:1px solid #f0f0f0">

        <!-- Palette -->
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.76rem;font-weight:600;color:#888;display:block;margin-bottom:5px">Paleta rápida</label>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${re.map(s=>`
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
            ${a||'<div style="width:64px;height:64px;background:#f5f5f5;border-radius:8px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#ccc">📷</div>'}
          </div>
        </div>
      </div>
    </div>
  `}window.eliminarColorVariante=async(e,t)=>{const o=document.getElementById("v"+e+"-nombre"),n=o?o.value:null;if(n&&window._productoEditandoId&&window._coloresExistentes){if(!confirm("Eliminar el color "+n+" y todas sus variantes?"))return;try{const r=(await(await fetch(g+"/variantes/producto/"+window._productoEditandoId)).json()).filter(s=>s.color===n);for(const s of r)await fetch(g+"/variantes/"+s.id+"/eliminar",{method:"POST",headers:{"Content-Type":"application/json"}});window._coloresExistentes=window._coloresExistentes.filter(s=>s.color!==n),window._coloresEliminados||(window._coloresEliminados=[]),window._coloresEliminados.push(n),alert("Color eliminado correctamente")}catch{alert("Error eliminando el color");return}}t.closest(".variante-item").remove(),actualizarTablaStock()};window.eliminarFotoExistente=(e,t)=>{const o=t.parentElement,n=o.dataset.url,a=document.getElementById("v"+e+"-preview");o.remove();const i=document.getElementById("v"+e+"-nombre");if(i&&window._coloresExistentes){const r=i.value,s=window._coloresExistentes.find(d=>d.color===r);s&&(s.imagenes&&(s.imagenes=s.imagenes.filter(d=>d!==n)),s.foto_url===n&&(s.foto_url=s.imagenes&&s.imagenes.length>0?s.imagenes[0]:null))}if(o.dataset.esPortada==="true"&&a){const r=a.querySelector("div[data-url]");if(r){r.dataset.esPortada="true",r.querySelector("img").style.border="2px solid #E91E8C";const s=document.createElement("span");s.className="portada-badge",s.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",s.textContent="PORTADA",r.appendChild(s)}}};window.seleccionarPortadaExistente=(e,t)=>{const o=document.getElementById("v"+e+"-preview");if(!o)return;o.querySelectorAll(".portada-badge").forEach(a=>a.remove()),o.querySelectorAll("img").forEach(a=>a.style.border="2px solid #ddd"),o.querySelectorAll("[data-es-portada]").forEach(a=>a.dataset.esPortada="false");const n=o.querySelectorAll("div[data-file-idx]");if(n[t]){n[t].dataset.esPortada="true",n[t].querySelector("img").style.border="2px solid #E91E8C";const a=document.createElement("span");a.className="portada-badge",a.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",a.textContent="PORTADA",n[t].appendChild(a)}};window.mostrarFormProducto=e=>{e||(window._coloresExistentes=null),R=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1;const t=e||{},o=document.getElementById("content");R=window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.length:1,e||(window._coloresExistentes=null),o.innerHTML=`
    <div class="table-card" style="padding:2rem;overflow:visible">
      <div style="position:sticky;top:0;z-index:50;background:white;border-bottom:1px solid #eee;padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin:-2rem -2rem 1.5rem -2rem;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <button type="button" class="btn btn-secondary" onclick="navegarA('productos')" style="display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:0.85rem">← Volver</button>
        <button type="button" class="btn btn-primary" onclick="guardarProducto()" style="padding:6px 18px;font-size:0.85rem">💾 Guardar</button>
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
            ${se.map(n=>`<option value="${n.value}" ${t.categoria===n.value?"selected":""}>${n.label}</option>`).join("")}
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
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $110</p>
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
      ${window._coloresExistentes.map((n,a)=>`
        <div onclick="seleccionarColorPortada(${a})" id="portada-color-${a}"
             style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:2px solid ${a===0?"#2e7d32":"#ddd"};cursor:pointer;background:${a===0?"#e8f5e9":"white"}">
          <div style="width:16px;height:16px;border-radius:50%;background:${n.color_hex};border:1px solid #ddd;flex-shrink:0"></div>
          <span style="font-size:0.82rem;font-weight:500">${n.color}</span>
          ${a===0?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
        </div>
      `).join("")}
    </div>
  </div>
`:""}
<div id="variantes-container">
  ${window._coloresExistentes&&window._coloresExistentes.length>0?window._coloresExistentes.map((n,a)=>N(a,n)).join(""):N(0,null)}
</div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px">
  ${J.map(n=>`
    <label class="talla-label" style="display:flex;align-items:center;justify-content:center;gap:4px;padding:10px 8px;border-radius:6px;cursor:pointer;border:2px solid ${t.tallas_disponibles&&t.tallas_disponibles.includes(n)?"#E91E8C":"transparent"};background:${t.tallas_disponibles&&t.tallas_disponibles.includes(n)?"#fce4f3":"#f5f5f5"}">
      <input type="checkbox" value="${n}" style="display:none" onchange="toggleTalla(this)" ${t.tallas_disponibles&&t.tallas_disponibles.includes(n)?"checked":""}>
      <span>${n}</span>
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

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <input type="hidden" id="f-producto-id" value="${t.id||""}">
        <button type="button" class="btn btn-primary" id="btn-guardar" onclick="guardarProducto()">💾 Guardar producto</button>
      </div>
    </div>
  `,fetch(g+"/sucursales/").then(n=>n.json()).then(n=>{const a=document.getElementById("f-sucursal-stock");a&&(a.innerHTML=n.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join("")),setTimeout(()=>actualizarTablaStock(),100)})};window.seleccionarColorPortada=e=>{if(!window._coloresExistentes)return;const t=window._coloresExistentes.splice(e,1)[0];window._coloresExistentes.unshift(t),document.querySelectorAll('[id^="portada-color-"]').forEach((n,a)=>{const i=a===0;n.style.borderColor=i?"#2e7d32":"#ddd",n.style.background=i?"#e8f5e9":"white",n.innerHTML=`
      <div style="width:16px;height:16px;border-radius:50%;background:${window._coloresExistentes[a].color_hex};border:1px solid #ddd;flex-shrink:0"></div>
      <span style="font-size:0.82rem;font-weight:500">${window._coloresExistentes[a].color}</span>
      ${i?'<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>':""}
    `,n.setAttribute("onclick","seleccionarColorPortada("+a+")")});const o=document.getElementById("variantes-container");o&&(o.innerHTML=window._coloresExistentes.map((n,a)=>N(a,n)).join(""))};const Q=e=>e.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");window.actualizarSKU=async()=>{const e=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",t=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",o=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"",n=document.getElementById("f-sku");if(n&&!n.value&&e&&t&&o)try{const i=await(await fetch(g+"/productos/siguiente-sku/"+t+"/"+encodeURIComponent(o))).json();n.value=i.sku_base}catch{}if(e){const a=document.getElementById("f-slug");a&&!a.value&&(a.value=Q(e));const i=document.getElementById("f-metatitulo");i&&!i.value&&(i.value=e.trim()+" | Zapatillas May")}};window.regenerarSKU=async()=>{const e=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"",t=document.getElementById("f-proveedor")?document.getElementById("f-proveedor").value:"";if(e&&t)try{const n=await(await fetch(g+"/productos/siguiente-sku/"+e+"/"+encodeURIComponent(t))).json(),a=document.getElementById("f-sku");a&&(a.value=n.sku_base)}catch{}else alert("Selecciona categoria y escribe el proveedor primero")};function ge(e,t,o,n,a,i,r){const s=document.getElementById("f-slug"),d=document.getElementById("f-metatitulo"),l=document.getElementById("f-metadesc");s&&!s.value&&(s.value=Q(e)),d&&!d.value&&(d.value=e+" | Zapatillas May");const c=["Compra "+e+" en Zapatillas May."];if(t){const m=t.split(/[.!?\n]/)[0].trim();m.length>10&&c.push(m.slice(0,65)+(m.length>65?"...":""))}else if(o){const m={sandalia:"Sandalia elegante para dama",bota:"Bota de moda para dama",tenis:"Tenis casual para dama",mocasin:"Mocasín cómodo para dama",zapatilla:"Zapatilla de moda para dama",plataforma:"Plataforma cómoda para dama"};c.push((m[o]||o)+".")}n&&c.push("Material "+n+"."),a&&i?c.push("Tacón "+i+" "+a+" cm."):a&&c.push("Tacón "+a+" cm."),r&&c.push("Desde $"+parseInt(r).toLocaleString("es-MX")+" MXN."),c.push("Envío a todo México.");let p=c.join(" ");p.length>160&&(p=p.slice(0,157)+"..."),l&&ee(p)}function ee(e){const t=document.getElementById("f-metadesc");if(t){t.value=e;const o=document.getElementById("metadesc-counter");o&&(o.textContent=e.length+"/160",o.style.color=e.length>160?"#c62828":e.length>140?"#e65100":"#4caf50")}}window.generarSEO=async()=>{var l,c,p,m,f,u,b,y;const e=(((l=document.getElementById("f-nombre"))==null?void 0:l.value)||"").trim(),t=(((c=document.getElementById("f-descripcion"))==null?void 0:c.value)||"").trim(),o=(((p=document.getElementById("f-categoria"))==null?void 0:p.value)||"").trim(),n=(((m=document.getElementById("f-material"))==null?void 0:m.value)||"").trim(),a=(((f=document.getElementById("f-tacon"))==null?void 0:f.value)||"").trim(),i=(((u=document.getElementById("f-tipotacon"))==null?void 0:u.value)||"").trim(),r=(((b=document.getElementById("f-menudeo"))==null?void 0:b.value)||"").trim(),s=(((y=document.getElementById("f-horma"))==null?void 0:y.value)||"").trim();if(!e&&!t){alert("Escribe el nombre o la descripción del producto primero");return}const d=document.getElementById("btn-generar-seo");d&&(d.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite">⏳</span> Analizando...',d.disabled=!0,d.style.opacity="0.7");try{const v=await(await fetch(g+"/productos/generar-seo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:e,descripcion:t,categoria:o,material:n,tacon:a,tipo_tacon:i,precio:r,horma:s})})).json();if(v.error)throw new Error(v.error);const x=document.getElementById("f-slug"),C=document.getElementById("f-metatitulo");if(x&&v.slug&&(x.value=v.slug),C&&v.meta_titulo&&(C.value=v.meta_titulo),v.meta_descripcion&&ee(v.meta_descripcion),v.nombre_producto&&e!==v.nombre_producto){const E=document.getElementById("f-nombre");if(E){let k=document.getElementById("seo-nombre-sugerido");k||(k=document.createElement("div"),k.id="seo-nombre-sugerido",k.style.cssText="margin-top:6px;padding:8px 12px;background:#f3e5f5;border-radius:8px;border:1px solid #ce93d8;font-size:0.78rem;color:#6a1b9a;display:flex;align-items:center;justify-content:space-between;gap:8px",E.parentElement.appendChild(k)),k.dataset.sugerido=v.nombre_producto,k.innerHTML="<span>✨ Nombre sugerido para la tienda: <strong>"+v.nombre_producto+`</strong></span><button onclick="var p=this.closest('#seo-nombre-sugerido');document.getElementById('f-nombre').value=p.dataset.sugerido;p.remove()" style="background:#6a1b9a;color:white;border:none;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:0.75rem;white-space:nowrap">Usar este</button>`}}d&&(d.innerHTML="✅ SEO generado con IA",d.style.background="#e8f5e9",d.style.color="#2e7d32",d.style.borderColor="#a5d6a7",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}catch{ge(e,t,o,n,a,i,r),d&&(d.innerHTML="✅ SEO generado",d.style.background="#fff8e1",d.style.color="#f57f17",d.style.borderColor="#ffe082",d.style.opacity="1",d.disabled=!1,setTimeout(()=>{d.innerHTML="✨ Generar SEO",d.style.background="",d.style.color="",d.style.borderColor=""},3e3))}};window.seleccionarColor=(e,t,o)=>{const n=document.getElementById("v"+e+"-hex"),a=document.getElementById("v"+e+"-nombre");if(n){n.value=t;const i=document.getElementById("v"+e+"-swatch-header");i&&(i.style.background=t)}if(a){a.value=o;const i=document.getElementById("v"+e+"-header-label");i&&(i.textContent=o)}actualizarTablaStock()};window.toggleVariante=e=>{const t=document.getElementById("v"+e+"-body"),o=document.getElementById("v"+e+"-chevron");if(!t)return;const n=t.style.display!=="none";t.style.display=n?"none":"block",o&&(o.style.transform=n?"rotate(0deg)":"rotate(180deg)")};window.agregarVariante=()=>{document.querySelectorAll(".variante-item").forEach(a=>{const i=a.id&&a.id.match(/^variante-(\d+)$/);if(i){const r=i[1],s=document.getElementById("v"+r+"-body"),d=document.getElementById("v"+r+"-chevron");s&&(s.style.display="none"),d&&(d.style.transform="rotate(0deg)")}});const e=R++,t=document.getElementById("variantes-container"),o=document.createElement("div");o.innerHTML=N(e,null),t.appendChild(o.firstElementChild);const n=document.getElementById("variante-"+e);n&&setTimeout(()=>n.scrollIntoView({behavior:"smooth",block:"nearest"}),60)};window.previsualizarImagenes=(e,t)=>{const o=document.getElementById("v"+t+"-preview");o&&(o.querySelectorAll("[data-existente]"),Array.from(e.files).forEach((n,a)=>{const i=new FileReader;i.onload=r=>{const s=document.createElement("div");s.style.cssText="position:relative;cursor:pointer",s.dataset.fileIdx=a,s.innerHTML=`
        <img src="${r.target.result}" 
             style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #ddd"
             onclick="seleccionarPortada(${t}, this)">
        <button onclick="this.parentElement.remove()" 
                style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      `,o.appendChild(s),o.querySelectorAll(".portada-badge").length===0&&seleccionarPortada(t,s.querySelector("img"))},i.readAsDataURL(n)}))};window.seleccionarPortada=(e,t)=>{const o=document.getElementById("v"+e+"-preview");if(!o)return;o.querySelectorAll(".portada-badge").forEach(a=>a.remove()),o.querySelectorAll("img").forEach(a=>a.style.border="2px solid #ddd"),t.style.border="2px solid #E91E8C";const n=document.createElement("span");n.className="portada-badge",n.style.cssText="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none",n.textContent="PORTADA",t.parentElement.appendChild(n),t.parentElement.dataset.esPortada="true",o.querySelectorAll("[data-es-portada]").forEach(a=>{a!==t.parentElement&&delete a.dataset.esPortada})};window.toggleDescuento=()=>{const e=document.getElementById("f-descuento"),t=document.getElementById("descuento-pct");e&&t&&(t.style.display=e.checked?"flex":"none")};window.toggleTalla=e=>{const t=e.closest(".talla-label");e.checked?(t.style.borderColor="#E91E8C",t.style.background="#fce4f3"):(t.style.borderColor="transparent",t.style.background="#f5f5f5"),actualizarTablaStock()};window.actualizarTablaStock=()=>{const e=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],t=[...document.querySelectorAll(".talla-label input:checked")].map(i=>i.value).sort((i,r)=>e.indexOf(i)-e.indexOf(r)),o=document.querySelectorAll(".variante-item"),n=[];o.forEach(i=>{const r=i.id.replace("variante-",""),s=document.getElementById("v"+r+"-nombre"),d=document.getElementById("v"+r+"-hex");s&&s.value&&n.push({nombre:s.value,hex:d?d.value:"#000",id:r})});const a=document.getElementById("stock-inicial-container");if(a){if(t.length===0||n.length===0){a.innerHTML='<p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>';return}a.innerHTML=n.map(i=>`
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
  `).join("")}};window.actualizarTotalColor=e=>{const t=document.querySelectorAll('[id^="stock-ini-'+e+'-"]');let o=0;t.forEach(a=>o+=parseInt(a.value)||0);const n=document.getElementById("total-color-"+e);n&&(n.textContent=o)};async function be(){const e=document.querySelectorAll(".variante-item"),t=[];for(const o of e){const n=o.id.replace("variante-",""),a=document.getElementById("v"+n+"-hex"),i=document.getElementById("v"+n+"-nombre"),r=document.getElementById("v"+n+"-imgs"),s=document.getElementById("v"+n+"-preview");if(!i||!i.value)continue;const d=[];if(s&&s.querySelectorAll("div[data-url]").forEach(l=>{const c=l.dataset.url;c&&!d.includes(c)&&d.push(c)}),r&&r.files.length>0){const l=s?s.querySelector('[data-es-portada="true"]'):null,c=l?parseInt(l.dataset.fileIdx):0,p=Array.from(r.files),m=[...p.filter((f,u)=>u===c),...p.filter((f,u)=>u!==c)];for(const f of m){const u=new FormData;u.append("archivo",f);try{const y=await(await fetch(g+"/imagenes/subir",{method:"POST",body:u})).json();y.url&&d.push(y.url)}catch{}}}t.push({color:i.value,color_hex:a?a.value:"#000000",imagenes:d})}return t}window.guardarProducto=async()=>{const e=document.getElementById("f-producto-id")?document.getElementById("f-producto-id").value:"";e&&(window._productoEditandoId=e);const t=document.getElementById("f-nombre")?document.getElementById("f-nombre").value:"",o=document.getElementById("f-costo")?document.getElementById("f-costo").value:"",n=document.getElementById("f-menudeo")?document.getElementById("f-menudeo").value:"",a=document.getElementById("f-categoria")?document.getElementById("f-categoria").value:"";if(!t||!o||!n||!a){alert("Por favor completa los campos obligatorios: Nombre, Categoria, Costo y Precio menudeo");return}const i=document.getElementById("btn-guardar");i&&(i.textContent="Guardando...",i.disabled=!0);const r=[...document.querySelectorAll(".talla-label input:checked")].map(m=>m.value),s=await be(),d=[];document.querySelectorAll(".variante-item").forEach(m=>{const f=m.id.replace("variante-",""),u=document.getElementById("v"+f+"-nombre"),b=document.getElementById("v"+f+"-hex");u&&u.value&&d.push({id:f,nombre:u.value,hex:b?b.value:"#000"})});const l=document.getElementById("f-peso")?document.getElementById("f-peso").value:"",c=l?Math.round(parseFloat(l)*1e3):null,p={nombre:t,sku_interno:document.getElementById("f-sku")&&document.getElementById("f-sku").value||null,marca:document.getElementById("f-marca")&&document.getElementById("f-marca").value||null,proveedor:document.getElementById("f-proveedor")&&document.getElementById("f-proveedor").value||null,categoria:a,subcategoria:document.getElementById("f-subcategoria")&&document.getElementById("f-subcategoria").value||null,descripcion:document.getElementById("f-descripcion")&&document.getElementById("f-descripcion").value||null,material:document.getElementById("f-material")&&document.getElementById("f-material").value||null,material_suela:document.getElementById("f-suela")&&document.getElementById("f-suela").value||null,forro:document.getElementById("f-forro")&&document.getElementById("f-forro").value||null,horma:document.getElementById("f-horma")&&document.getElementById("f-horma").value||null,altura_tacon:document.getElementById("f-tacon")&&document.getElementById("f-tacon").value?parseFloat(document.getElementById("f-tacon").value):null,tipo_tacon:document.getElementById("f-tipotacon")&&document.getElementById("f-tipotacon").value||null,costo:parseFloat(o),precio_menudeo:parseFloat(n),precio_mayoreo3:document.getElementById("f-mayoreo3")&&document.getElementById("f-mayoreo3").value?parseFloat(document.getElementById("f-mayoreo3").value):null,precio_mayoreo6:document.getElementById("f-mayoreo6")&&document.getElementById("f-mayoreo6").value?parseFloat(document.getElementById("f-mayoreo6").value):null,precio_corrida:document.getElementById("f-corrida")&&document.getElementById("f-corrida").value?parseFloat(document.getElementById("f-corrida").value):null,precio_antes:document.getElementById("f-antes")&&document.getElementById("f-antes").value?parseFloat(document.getElementById("f-antes").value):null,tiene_descuento:document.getElementById("f-descuento")?document.getElementById("f-descuento").checked:!1,porcentaje_descuento:document.getElementById("f-pct")&&document.getElementById("f-pct").value?parseInt(document.getElementById("f-pct").value):0,corrida_activa:document.getElementById("f-corrida-activa")?document.getElementById("f-corrida-activa").checked:!1,es_oferta:document.getElementById("f-oferta")?document.getElementById("f-oferta").checked:!1,tallas_disponibles:r,peso_gramos:c,slug:document.getElementById("f-slug")&&document.getElementById("f-slug").value?document.getElementById("f-slug").value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):null,meta_titulo:document.getElementById("f-metatitulo")&&document.getElementById("f-metatitulo").value||null,meta_descripcion:document.getElementById("f-metadesc")&&document.getElementById("f-metadesc").value||null,imagen_principal:s.length>0&&s[0].imagenes.length>0?s[0].imagenes[0]:null,activo:!0,nuevo:!window._productoEditandoId};try{console.log("Editando ID:",window._productoEditandoId);const m=window._productoEditandoId?"PATCH":"POST",f=window._productoEditandoId?g+"/productos/"+window._productoEditandoId:g+"/productos/",u=await fetch(f,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});if(u.ok){const b=await u.json(),y=window._productoEditandoId||(b&&b.length>0?b[0].id:null);if(y&&s.length>0){const v=r.length>0?r:["Unica"];let x=[];window._productoEditandoId&&(x=await(await fetch(g+"/variantes/producto/"+y)).json(),window._coloresEliminados&&window._coloresEliminados.length>0&&(x=x.filter(k=>!window._coloresEliminados.includes(k.color))));const C=[];for(const E of s)for(const k of v){const w=x.find(_=>_.color.trim().toLowerCase()===E.color.trim().toLowerCase()&&_.talla===k);if(w){const _={color_hex:E.color_hex};_.foto_url=E.imagenes.length>0?E.imagenes[0]:null,_.imagenes=E.imagenes,C.push(fetch(g+"/variantes/"+w.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(_)}))}else C.push(fetch(g+"/variantes/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({producto_id:y,color:E.color,color_hex:E.color_hex,talla:k,foto_url:E.imagenes[0]||null,imagenes:E.imagenes||[]})}).catch(_=>console.log("Variante ya existe:",E.color,k)))}await Promise.all(C)}console.log("Colores:",d),console.log("Tallas:",r),console.log("Sucursal stock:",document.getElementById("f-sucursal-stock")?document.getElementById("f-sucursal-stock").value:"no encontrado"),console.log("PID editando:",window._productoEditandoId);const h=document.getElementById("f-sucursal-stock")?document.getElementById("f-sucursal-stock").value:"";if(h&&y){const x=await(await fetch(g+"/variantes/producto/"+y)).json(),C=r.length>0?r:["Unica"];for(const E of d)for(const k of C){const w=k.replace(".","_"),_=document.getElementById("stock-ini-"+E.id+"-"+w),I=_&&parseInt(_.value)||0;if(I<=0)continue;const T=x.find(S=>S.color===E.nombre&&S.talla===k);T&&(window._productoEditandoId?await fetch(g+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:T.id,sucursal_id:h,cantidad:I,motivo:"Resurtido desde edicion de producto"})}):await fetch(g+"/inventario/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:T.id,sucursal_id:h,cantidad:I,stock_minimo:1})}))}}if(b&&b.error){alert("Error: "+b.error),i&&(i.textContent="Guardar producto",i.disabled=!1);return}alert("Producto guardado correctamente"),window._productoEditandoId=null,navegarA("productos")}else{const b=await u.text();alert("Error al guardar: "+b),i&&(i.textContent="Guardar producto",i.disabled=!1)}window._coloresEliminados=[]}catch{alert("Error conectando con el servidor"),i&&(i.textContent="Guardar producto",i.disabled=!1)}};window.editarProducto=async e=>{window._coloresEliminados=[],window._coloresExistentes=null,window._productoEditandoId=null;try{const[t,o]=await Promise.all([fetch(g+"/productos/"+e),fetch(g+"/variantes/producto/"+e)]),n=await t.json(),a=await o.json();if(!n||n.length===0){alert("Producto no encontrado");return}const i=[],r=new Set;a.filter(s=>s.producto_id===e).forEach(s=>{r.has(s.color)||(r.add(s.color),i.push({color:s.color,color_hex:s.color_hex,foto_url:s.foto_url,imagenes:s.imagenes||[]}))}),window._productoEditandoId=e,window._coloresExistentes=i.length>0?i:null,mostrarFormProducto(n[0])}catch{alert("Error cargando el producto")}};window.duplicarProducto=async e=>{try{const o=await(await fetch(g+"/productos/"+e)).json();if(o&&o.length>0){const n=Object.assign({},o[0]);delete n.id,delete n.created_at,delete n.updated_at,n.nombre=n.nombre+" (copia)",n.slug=n.slug?n.slug+"-copia":null,n.sku_interno=null,window._productoEditandoId=null,mostrarFormProducto(n)}}catch{alert("Error duplicando el producto")}};window.cargarProductosFiltro=e=>H(e,!1);window.filtrarProductos=()=>{const e=document.getElementById("prod-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(o=>{const n=o.textContent.toLowerCase();o.style.display=n.includes(e)?"":"none"})};window.toggleProducto=async(e,t)=>{const o=t?"desactivar":"activar";if(confirm(t?"Desactivar este producto?":"Activar este producto?"))try{(await fetch(g+"/productos/"+e+"/"+o,{method:"PATCH",headers:{"Content-Type":"application/json"}})).ok?H():alert("Error al cambiar el estado")}catch{alert("Error conectando con el servidor")}};window.filtrarClientes=()=>{var i,r;const e=(((i=document.getElementById("cli-buscar"))==null?void 0:i.value)||"").toLowerCase().trim(),t=((r=document.getElementById("cli-tipo"))==null?void 0:r.value)||"",o=document.querySelectorAll(".cli-item");let n=0;o.forEach(s=>{const d=(s.dataset.nombre||"").toLowerCase(),l=s.dataset.tel||"",c=s.dataset.tipo||"",f=(!e||d.includes(e)||l.includes(e))&&(!t||c===t);s.style.display=f?"":"none",f&&n++});const a=document.getElementById("cli-count");a&&(a.textContent=n)};window.mostrarFormCliente=async e=>{const t=document.getElementById("content");let o={};if(e)try{const a=await(await fetch(g+"/clientes/"+e)).json();a&&a.length>0&&(o=a[0])}catch{}t.innerHTML=`
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
  `};window.guardarCliente=async e=>{const t=document.getElementById("cli-nombre").value;if(!t){alert("El nombre del cliente es obligatorio");return}const o=document.getElementById("btn-cli-guardar");o&&(o.textContent="Guardando...",o.disabled=!0);const n={nombre:t,telefono:document.getElementById("cli-telefono").value||null,email:document.getElementById("cli-email").value||null,tipo:document.getElementById("cli-tipo").value,direccion:document.getElementById("cli-direccion").value||null,lada:document.getElementById("cli-lada").value||"52",ciudad:document.getElementById("cli-ciudad").value||null,estado:document.getElementById("cli-estado").value||null,codigo_postal:document.getElementById("cli-cp").value||null,limite_credito:parseFloat(document.getElementById("cli-credito").value)||0,dias_credito:parseInt(document.getElementById("cli-dias").value)||0,comentarios_internos:document.getElementById("cli-comentarios").value||null,activo:!0};try{const a=e?"PATCH":"POST",i=e?g+"/clientes/"+e:g+"/clientes/",r=await fetch(i,{method:a,headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(r.ok)alert("Cliente guardado correctamente"),navegarA("clientes");else{const s=await r.text();alert("Error al guardar: "+s),o&&(o.textContent="Guardar cliente",o.disabled=!1)}}catch{alert("Error conectando con el servidor"),o&&(o.textContent="Guardar cliente",o.disabled=!1)}};window.verCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[o,n]=await Promise.all([fetch(g+"/clientes/"+e),fetch(g+"/pedidos/")]),a=await o.json(),i=await n.json();if(!a||a.length===0){alert("Cliente no encontrado");return}const r=a[0],s=i.filter(u=>u.cliente_id===e),d=s.filter(u=>u.status==="confirmado"||u.status==="pagado"),l=d.reduce((u,b)=>u+parseFloat(b.total||0),0),c=d.length>0?l/d.length:0,p=s.length>0?new Date(s[0].created_at):null,m=p?Math.floor((new Date-p)/(1e3*60*60*24)):null,f={};d.forEach(u=>{const b=new Date(u.created_at).toLocaleDateString("es-MX",{month:"short",year:"2-digit"});f[b]=(f[b]||0)+parseFloat(u.total||0)}),t.innerHTML=`
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
          ${s.length===0?'<div style="text-align:center;padding:2rem;color:#888">Sin pedidos registrados</div>':s.map(u=>{const b={confirmado:"#2e7d32",pagado:"#2e7d32",pendiente_pago:"#f57f17",cancelado:"#c62828",borrador:"#f57f17"}[u.status]||"#888",y={confirmado:"#e8f5e9",pagado:"#e8f5e9",pendiente_pago:"#fff8e1",cancelado:"#ffebee",borrador:"#fff8e1"}[u.status]||"#f5f5f5";return`
                <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer" onclick="verPedido('${u.id}')"
                     onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <span style="font-family:monospace;font-size:0.78rem;color:#888">#${u.id.substring(0,8).toUpperCase()}</span>
                      <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${y};color:${b}">${u.status}</span>
                    </div>
                    <p style="font-size:0.78rem;color:#888">${new Date(u.created_at).toLocaleDateString("es-MX")} · ${u.canal||"—"} · ${u.forma_pago||"—"}</p>
                  </div>
                  <p style="font-weight:700;color:#E91E8C;font-size:1rem">$${u.total||"0"}</p>
                </div>
              `}).join("")}
        </div>
      </div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando cliente</p>'}};window.guardarNotasCliente=async e=>{var o;const t=((o=document.getElementById("cli-notas-"+e))==null?void 0:o.value)||"";try{await fetch(g+"/clientes/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({comentarios_internos:t})});const n=document.querySelector(`button[onclick="guardarNotasCliente('${e}')"]`);n&&(n.textContent="✅ Guardado",setTimeout(()=>n.textContent="💾 Guardar notas",2e3))}catch{alert("Error guardando notas")}};window.editarCliente=e=>{mostrarFormCliente(e)};window.nuevoPedidoCliente=async(e,t)=>{await oe(),setTimeout(()=>{const o=document.getElementById("pos-cliente-buscar"),n=document.getElementById("pos-cliente"),a=document.getElementById("pos-cliente-seleccionado");o&&(o.value=""),n&&(n.value=e),a&&(a.textContent="✔ "+t+" — toca para cambiar",a.style.display="block");const i=document.getElementById("topbar-title");i&&(i.textContent="Punto de venta")},300)};window.verHistorialCliente=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando historial...</p>';try{const a=(await(await fetch(g+"/pedidos/")).json()).filter(s=>s.cliente_id===e),i=a.length>0&&a[0].clientes?a[0].clientes:{},r=a.filter(s=>s.status==="confirmado"||s.status==="pagado").reduce((s,d)=>s+parseFloat(d.total||0),0);t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <h3 style="flex:1">Historial — ${i.nombre||"Cliente"}</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total pedidos</p>
            <p style="font-weight:700;font-size:1.2rem">${a.length}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total gastado</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${r.toFixed(2)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Ultimo pedido</p>
            <p style="font-weight:700;font-size:0.9rem">${a.length>0?new Date(a[0].created_at).toLocaleDateString("es-MX"):"—"}</p>
          </div>
        </div>

        ${a.length===0?'<div style="text-align:center;padding:3rem;color:#888">Este cliente no tiene pedidos registrados</div>':`<table>
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
              ${a.map(s=>{const d={confirmado:"badge-success",pagado:"badge-success",pendiente_pago:"badge-warning",cancelado:"badge-danger",borrador:"badge-warning"}[s.status]||"badge-warning";return`
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
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando historial</p>'}};window.mostrarEntrada=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarEntrada=async()=>{const e=document.getElementById("ent").value,t=document.getElementById("ent-sucursal").value,o=document.getElementById("ent-cantidad").value,n=document.getElementById("ent-motivo").value;if(!e||!t||!o){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(g+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:parseInt(o),motivo:n})})).json();i.ok?(alert("Entrada guardada. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarSalida=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarSalida=async()=>{const e=document.getElementById("sal").value,t=document.getElementById("sal-sucursal").value,o=document.getElementById("sal-cantidad").value,n=document.getElementById("sal-motivo").value;if(!e||!t||!o){alert("Por favor completa todos los campos");return}try{const i=await(await fetch(g+"/movimientos/entrada",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_id:t,cantidad:-parseInt(o),motivo:n})})).json();i.ok?(alert("Salida registrada. Anterior: "+i.cantidad_anterior+" pares ÔåÆ Nuevo: "+i.cantidad_nueva+" pares"),navegarA("inventario")):alert("Error: "+JSON.stringify(i))}catch{alert("Error conectando con el servidor")}};window.mostrarInventarioMasivo=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const o=await(await fetch(g+"/sucursales/")).json(),a=await(await fetch(g+"/productos/")).json(),r=await(await fetch(g+"/variantes/")).json(),d=await(await fetch(g+"/inventario/")).json(),l=[...new Set(a.map(p=>p.categoria).filter(Boolean))],c=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._invMasivo={sucursales:o,productos:a,variantes:r,inventario:d},e.innerHTML=`
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
    `,renderTablasMasivo()}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando inventario</p>'}};window.renderTablasMasivo=()=>{const{productos:e,variantes:t,inventario:o}=window._invMasivo,n=document.getElementById("im-sucursal").value,a=document.getElementById("im-categoria").value,i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],r=e.filter(c=>!(a&&c.categoria!==a)),s=o.filter(c=>c.sucursal_id===n),d=r.map(c=>{const p=t.filter(u=>u.producto_id===c.id);if(p.length===0)return"";const f=[...new Set(p.map(u=>u.color).filter(Boolean))].map(u=>{const b=p.filter(h=>h.color===u).sort((h,v)=>i.indexOf(h.talla)-i.indexOf(v.talla));return`
        <div style="margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:14px;height:14px;border-radius:50%;background:${b[0]?b[0].color_hex:"#888"};border:1px solid #ddd;flex-shrink:0"></div>
            <span style="font-size:0.85rem;font-weight:500;color:#444">${u}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${b.map(h=>{const v=s.find(k=>k.variante_id===h.id),x=v?v.cantidad:0,C=v?v.stock_minimo:3;let E="#ddd";return x===0?E="#ffcdd2":x<=C?E="#ffe082":E="#a5d6a7",`
                <div style="text-align:center">
                  <div style="font-size:0.72rem;color:#888;margin-bottom:4px;font-weight:500">${h.talla}</div>
                  <input type="number" min="0"
                         id="im-${h.id}"
                         value="${x}"
                         data-variante="${h.id}"
                         data-anterior="${x}"
                         style="width:58px;text-align:center;padding:6px 4px;border:2px solid ${E};border-radius:8px;font-size:0.9rem;font-weight:600"
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
        ${f}
      </div>
    `}).join(""),l=document.getElementById("im-tablas");l&&(l.innerHTML=d||'<div style="padding:2rem;text-align:center;color:#888">No hay productos en esta categoria</div>')};window.guardarInventarioMasivo=async()=>{const e=document.getElementById("im-sucursal").value,t=document.querySelectorAll("[data-variante]");let o=0,n=0,a=0;const i=document.querySelector('[onclick="guardarInventarioMasivo()"]');i&&(i.textContent="Guardando...",i.disabled=!0);for(const r of t){const s=r.dataset.variante,d=parseInt(r.dataset.anterior)||0,l=parseInt(r.value)||0;if(l===d){a++;continue}try{(await(await fetch(g+"/movimientos/ajuste",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:s,sucursal_id:e,cantidad:l,motivo:"Inventario masivo"})})).json()).ok?(o++,r.dataset.anterior=l,r.style.borderColor="#a5d6a7"):(n++,r.style.borderColor="#ffcdd2")}catch{n++}}i&&(i.textContent="Guardar todo",i.disabled=!1),n>0?alert(`Guardados: ${o}, Errores: ${n}, Sin cambios: ${a}`):alert(`Inventario actualizado. ${o} cambios guardados, ${a} sin cambios.`)};window.mostrarFormSucursal=async e=>{const t=document.getElementById("content");let o={};if(e)try{o=(await(await fetch(g+"/sucursales/")).json()).find(i=>i.id===e)||{}}catch{}t.innerHTML=`
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
  `};window.guardarSucursal=async e=>{const t=document.getElementById("suc-nombre").value;if(!t){alert("El nombre es obligatorio");return}const o={nombre:t,tipo:document.getElementById("suc-tipo").value,direccion:document.getElementById("suc-direccion").value||null,telefono:document.getElementById("suc-telefono").value||null};try{const n=e?"PATCH":"POST",a=e?g+"/sucursales/"+e:g+"/sucursales/";(await fetch(a,{method:n,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).ok?(alert("Sucursal guardada"),navegarA("sucursales")):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};window.toggleSucursalDestino=(e,t)=>{const o=document.getElementById(e+"-sucursal-destino-container");o&&(o.style.display=t==="Traspaso entre sucursales"?"block":"none")};window.mostrarTraspaso=async()=>{const t=await(await fetch(g+"/sucursales/")).json(),n=await(await fetch(g+"/variantes/")).json();window._variantesCache=n;const a=document.getElementById("content");a.innerHTML=`
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
  `};window.guardarTraspaso=async()=>{const e=document.getElementById("tra").value,t=document.getElementById("tra-origen").value,o=document.getElementById("tra-destino").value,n=document.getElementById("tra-cantidad").value;if(!e||!t||!o||!n){alert("Por favor completa todos los campos");return}if(t===o){alert("La sucursal origen y destino no pueden ser la misma");return}try{const i=await(await fetch(g+"/movimientos/traspaso",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:e,sucursal_origen_id:t,sucursal_destino_id:o,cantidad:parseInt(n)})})).json();i.ok?(alert("Traspaso realizado correctamente. Se movieron "+i.cantidad_movida+" pares."),navegarA("inventario")):alert("Error: "+(i.error||JSON.stringify(i)))}catch{alert("Error conectando con el servidor")}};async function te(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/pedidos/")).json();e.innerHTML=`
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input class="form-input" id="ped-buscar" placeholder="🔍 Buscar por # pedido o cliente..." 
               style="max-width:280px" oninput="filtrarPedidos()">
        <button class="btn btn-primary" onclick="cargarPedidosFiltro('')">Todos (${o.length})</button>
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
            ${o.length===0?'<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>':o.map(n=>{const a={borrador:"badge-warning",pendiente_pago:"badge-warning",confirmado:"badge-success",cancelado:"badge-danger",pagado:"badge-success"}[n.status]||"badge-warning";return`
                  <tr>
                    <td style="font-family:monospace;font-size:0.78rem;color:#888">#${n.id.substring(0,8).toUpperCase()}</td>
                    <td><strong>${n.clientes?n.clientes.nombre:n.nombre_cliente||"Sin cliente"}</strong><br>
                    ${n.email_cliente?`<span style="font-size:0.72rem;color:#aaa">${n.email_cliente}</span>`:""}
                    ${n.telefono_cliente?`<br><span style="font-size:0.72rem;color:#aaa">${n.telefono_cliente}</span>`:""}
                    </td>
                    <td>${n.canal||"—"}</td>
                    <td><strong>$${n.total||"0"}</strong></td>
                    <td>${n.mp_preference_id?"MercadoPago":n.forma_pago||"—"}</td>
                    <td><span class="badge ${a}">${n.status||"borrador"}</span></td>
                    <td>${n.created_at?new Date(new Date(n.created_at).getTime()-6*60*60*1e3).toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"}):"—"}</td>
                    <td>
                      <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${n.id}')">Ver</button>
                    </td>
                  </tr>
                `}).join("")}
          </tbody>
        </table>
      </div>
    `,window._pedidosData=o}catch{e.innerHTML='<p style="padding:2rem;color:red">Error conectando con el servidor</p>'}}window.filtrarPedidos=()=>{const e=document.getElementById("ped-buscar").value.toLowerCase();document.querySelectorAll("#content tbody tr").forEach(o=>{const n=o.textContent.toLowerCase();o.style.display=n.includes(e)?"":"none"})};window.cargarPedidosFiltro=async e=>{document.getElementById("content");try{const o=await(await fetch(g+"/pedidos/")).json();let n=o;e==="pendiente_pago"?n=o.filter(a=>a.status==="pendiente_pago"):e==="credito"?n=o.filter(a=>a.forma_pago==="credito"):e&&(n=o.filter(a=>a.canal===e)),await te()}catch{}};window.mostrarFormPedido=async()=>{const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const o=await(await fetch(g+"/clientes/")).json(),a=await(await fetch(g+"/sucursales/")).json(),r=await(await fetch(g+"/productos/")).json(),d=await(await fetch(g+"/variantes/")).json();window._variantesCache=d,window._productosCache=r,window._pedidoItems=[],e.innerHTML=`
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
              ${a.map(l=>`<option value="${l.id}">${l.nombre}</option>`).join("")}
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
    `,document.getElementById("ped-prod-resultados").addEventListener("click",l=>{const c=l.target.closest("[data-variante-id]");if(c){const p=c.dataset.varianteId,m=c.dataset.nombre;agregarItemPedido(p,m),document.getElementById("ped-prod-resultados").style.display="none",document.getElementById("ped-buscar-prod").value=""}})}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando formulario de pedido</p>'}};window.toggleComprobante=()=>{const e=document.getElementById("ped-pago").value,t=document.getElementById("spei-info");t&&(t.style.display=e==="spei"?"block":"none")};window.actualizarTipoCliente=()=>{const e=document.getElementById("ped-cliente");e.options[e.selectedIndex],window.recalcularTotal()};window.agregarItemPedido=async(e,t)=>{const o=window._variantesCache||[],n=window._productosCache||[],a=o.find(l=>l.id===e);if(!a)return;const i=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(i)try{const c=await(await fetch(g+"/inventario/sucursal/"+i)).json(),p=c.find(b=>b.variante_id===e),m=window._pedidoItems.find(b=>b.variante_id===e);console.log("Inventario:",c),console.log("Buscando variante:",e),console.log("Encontrado:",p);const f=m?m.cantidad:0,u=p?p.cantidad:0;if(u<=f){alert("No hay suficiente existencia de este producto. Disponible: "+u+" pares");return}}catch(l){console.error("Error verificando inventario",l)}const r=window._pedidoItems.find(l=>l.variante_id===e);if(r){r.cantidad++,window.recalcularTotal(),renderItemsPedido();return}const s=n.find(l=>l.id===a.producto_id)||{},d=parseFloat(s.precio_menudeo)||0;window._pedidoItems.push({variante_id:e,nombre:(s.nombre||"")+" - "+(a.color||"")+" - T"+(a.talla||""),cantidad:1,precio_unitario:d,precio_menudeo:d,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||d-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||d-70,precio_corrida:parseFloat(s.precio_corrida)||d-110,es_oferta:s.es_oferta||!1,foto_url:a.foto_url||s.imagen_principal||null}),window.recalcularTotal(),renderItemsPedido()};window.renderItemsPedido=()=>{const e=document.getElementById("ped-items-lista");if(e){if(window._pedidoItems.length===0){e.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>',window.recalcularTotal();return}e.innerHTML=window._pedidoItems.map((t,o)=>`
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
      ${t.foto_url?'<img src="'+t.foto_url+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">':'<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
      <div style="flex:1">
        <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">${t.nombre}</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:4px">
            <button onclick="cambiarCantidadItem(${o}, -1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">−</button>
            <span style="font-weight:600;min-width:24px;text-align:center">${t.cantidad}</span>
            <button onclick="cambiarCantidadItem(${o}, 1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">+</button>
          </div>
          <span style="color:#888;font-size:0.8rem">×$${t.precio_unitario}</span>
          <strong style="color:#E91E8C">= $${(t.cantidad*t.precio_unitario).toFixed(2)}</strong>
        </div>
      </div>
      <button onclick="eliminarItemPedido(${o})" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:1.2rem">✕</button>
    </div>
  `).join(""),window.recalcularTotal()}};window.cambiarCantidadItem=async(e,t)=>{if(t>0){const o=window._pedidoItems[e],n=document.getElementById("ped-sucursal")?document.getElementById("ped-sucursal").value:"";if(n)try{const r=(await(await fetch(g+"/inventario/sucursal/"+n)).json()).find(d=>d.variante_id===o.variante_id),s=r?r.cantidad:0;if(o.cantidad>=s){alert("No hay mas existencia disponible. Maximo: "+s+" pares");return}}catch{}}window._pedidoItems[e].cantidad=Math.max(1,window._pedidoItems[e].cantidad+t),window.recalcularTotal(),renderItemsPedido()};window.guardarPedido=async()=>{const e=document.getElementById("ped-cliente").value,t=document.getElementById("ped-canal").value,o=document.getElementById("ped-sucursal").value,n=document.getElementById("ped-pago").value,a=document.getElementById("ped-comentarios").value;if(!e){alert("Selecciona un cliente");return}if(window._pedidoItems.length===0){alert("Agrega al menos un producto");return}const i=document.getElementById("btn-ped-guardar");i&&(i.textContent="Guardando...",i.disabled=!0);const r=window._pedidoItems.reduce((d,l)=>d+l.cantidad*l.precio_unitario,0),s=n==="spei"?"pendiente_pago":"confirmado";try{const d=await fetch(g+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:e,canal:t,sucursal_id:o,forma_pago:n,comentarios:a||null,total:r,subtotal:r,status:s})});if(!d.ok){alert("Error creando pedido"),i&&(i.textContent="Crear pedido",i.disabled=!1);return}const c=(await d.json())[0].id;for(const p of window._pedidoItems)await fetch(g+"/pedidos/"+c+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:p.variante_id,cantidad:p.cantidad,precio_unitario:p.precio_unitario,subtotal:p.cantidad*p.precio_unitario})});n!=="spei"&&n!=="mercadopago"&&await fetch(g+"/pedidos/"+c+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:n})}),alert("Pedido creado correctamente"),window._pedidoItems=[],verPedido(c)}catch{alert("Error conectando con el servidor"),i&&(i.textContent="Crear pedido",i.disabled=!1)}};window.verPedido=async e=>{const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando pedido...</p>';try{const n=await(await fetch(g+"/pedidos/"+e)).json();if(!n||n.length===0){alert("Pedido no encontrado");return}const a=n[0],i=a.pedido_items||[],r=a.clientes||{},s={borrador:"#f57f17",pendiente_pago:"#f57f17",confirmado:"#2e7d32",pagado:"#2e7d32",cancelado:"#c62828"}[a.status]||"#888";t.innerHTML=`
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3 style="flex:1">Pedido #${a.id.substring(0,8).toUpperCase()}</h3>
          <span class="badge" style="background:${s}20;color:${s};border:1px solid ${s}40;padding:6px 12px">${a.status}</span>
          ${r.telefono?'<a href="https://wa.me/52'+r.telefono.replace(/\D/g,"")+"?text="+encodeURIComponent("Hola "+(r.nombre||"")+", tu pedido está listo")+'" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>':""}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente</p>
            <p style="font-weight:600">${r.nombre||"Mostrador"}</p>
            <p style="font-size:0.8rem;color:#888">${r.telefono||""}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Canal y pago</p>
            <p style="font-weight:600">${a.canal||"—"}</p>
            <p style="font-size:0.8rem;color:#888">${a.forma_pago||""}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${a.total||"0"}</p>
          </div>
        </div>

        <div style="margin-bottom:1.5rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Productos</p>
          ${i.map(d=>{const l=d.variantes||{},c=l.productos||{};return`
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
                ${c.imagen_principal?'<img src="'+c.imagen_principal+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">':'<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.85rem">${c.nombre||"—"} - ${l.color||""} - T${l.talla||""}</p>
                  <p style="font-size:0.8rem;color:#888">${d.cantidad} pares ×$${d.precio_unitario||0}</p>
                </div>
                <strong style="color:#E91E8C">$${d.subtotal!=null?d.subtotal:((d.cantidad||0)*(d.precio_unitario||0)).toFixed(2)}</strong>
              </div>
            `}).join("")}
        </div>

        ${a.status==="pendiente_pago"?`
          <div style="background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #ffe082">
            <p style="font-weight:600;color:#f57f17;margin-bottom:0.5rem">Pendiente de pago SPEI</p>
            <p style="font-size:0.85rem;color:#888;margin-bottom:1rem">Cuando recibas el comprobante confirma el pago para descontar el inventario.</p>
            <button class="btn btn-primary" onclick="confirmarPagoSPEI('${a.id}')">Confirmar pago recibido</button>
          </div>
        `:""}

        ${a.comentarios?`
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Comentarios internos</p>
            <p>${a.comentarios}</p>
          </div>
        `:""}

        <div style="display:flex;gap:1rem;flex-wrap:wrap">
  ${a.status!=="cancelado"&&a.status!=="confirmado"&&a.status!=="pagado"?`<button class="btn btn-primary" onclick="confirmarPedidoAdmin('${a.id}')">Confirmar pedido</button>`:""}
  ${a.status==="cancelado"?`<button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="reconfirmarPedido('${a.id}')">✅ Reconfirmar pedido</button>`:""}
  ${a.status!=="cancelado"?`<button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="cancelarPedido('${a.id}')">❌ Cancelar pedido</button>`:""}
  <button class="btn btn-secondary" onclick="generarPDFPedido('${a.id}')">Generar PDF</button>
  <button class="btn btn-secondary" onclick="imprimirTicketPOS('${a.id}',${a.total},${a.pedido_items?a.pedido_items.reduce((d,l)=>d+l.cantidad,0):0},'${a.forma_pago||"efectivo"}')">Reimprimir ticket</button>
</div>
    `}catch{t.innerHTML='<p style="padding:2rem;color:red">Error cargando pedido</p>'}};window.cancelarPedido=async e=>{if(confirm("¿Cancelar este pedido? Si ya estaba confirmado se devolverá el stock automáticamente."))try{const o=await(await fetch(g+"/pedidos/"+e+"/cancelar",{method:"POST"})).json();o.ok?(alert(o.stock_devuelto?"Pedido cancelado. Stock devuelto al inventario.":"Pedido cancelado."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.reconfirmarPedido=async e=>{if(confirm("¿Reconfirmar este pedido? Se descontará el stock del inventario nuevamente."))try{const o=await(await fetch(g+"/pedidos/"+e+"/reconfirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})).json();o.ok?(alert("Pedido reconfirmado correctamente."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.confirmarPagoSPEI=async e=>{if(confirm("Confirmar que recibiste el pago por SPEI?"))try{const o=await(await fetch(g+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"spei"})})).json();o.ok?(alert("Pago confirmado. Inventario actualizado."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.confirmarPedidoAdmin=async e=>{if(confirm("Confirmar este pedido? El inventario se descontara."))try{const o=await(await fetch(g+"/pedidos/"+e+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:"efectivo"})})).json();o.ok?(alert("Pedido confirmado correctamente."),verPedido(e)):alert("Error: "+JSON.stringify(o))}catch{alert("Error conectando con el servidor")}};window.recalcularTotal=()=>{const e=window._pedidoItems||[],t=e.reduce((a,i)=>a+i.cantidad,0);e.forEach(a=>{a.es_oferta?a.precio_unitario=a.precio_menudeo:t>=6?a.precio_unitario=a.precio_mayoreo6||a.precio_menudeo-70:t>=3?a.precio_unitario=a.precio_mayoreo3||a.precio_menudeo-30:a.precio_unitario=a.precio_menudeo});const o=e.reduce((a,i)=>a+i.cantidad*i.precio_unitario,0),n=document.getElementById("ped-total");n&&(n.textContent="$"+o.toFixed(2))};async function oe(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando punto de venta...</p>';try{const o=await(await fetch(g+"/productos/")).json(),a=await(await fetch(g+"/variantes/")).json(),r=await(await fetch(g+"/sucursales/")).json(),d=await(await fetch(g+"/clientes/")).json(),c=await(await fetch(g+"/inventario/")).json();window._posData={productos:o,variantes:a,sucursales:r,clientes:d,inventario:c},window._posCarrito=[],window._posClienteId=null,e.innerHTML=`
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
    `,renderProductosPOS(o.filter(p=>p.activo))}catch{e.innerHTML='<p style="padding:2rem;color:red">Error cargando punto de venta</p>'}}window.abrirDrawerPOS=()=>{renderDrawerPOS();const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.add("open"),t&&t.classList.add("active"),document.body.style.overflow="hidden"};window.cerrarDrawerPOS=()=>{const e=document.getElementById("pos-drawer"),t=document.getElementById("pos-drawer-overlay");e&&e.classList.remove("open"),t&&t.classList.remove("active"),document.body.style.overflow=""};window.renderDrawerPOS=()=>{const e=window._posCarrito,t=document.getElementById("pos-drawer-items");if(!t)return;const o=e.reduce((p,m)=>p+m.cantidad,0),n=e.reduce((p,m)=>p+m.cantidad*m.precio_unitario,0),a=e.some(p=>p.es_corrida)?"Corrida":o>=6?"Mayoreo 6+":o>=3?"Mayoreo 3+":"Menudeo",i=document.getElementById("pos-drawer-pares"),r=document.getElementById("pos-drawer-total"),s=document.getElementById("pos-drawer-tipo");if(i&&(i.textContent=o),r&&(r.textContent="$"+n.toFixed(2)),s&&(s.textContent=a),!e.length){t.innerHTML='<p style="color:#888;text-align:center;padding:2rem">El carrito esta vacio</p>';return}const d=e.filter(p=>!p.es_corrida),l=e.filter(p=>p.es_corrida),c={};l.forEach(p=>{const m=p.producto_id+"|"+p.color;c[m]||(c[m]={nombre:p.nombre,color:p.color,producto_id:p.producto_id,tallas:[],subtotal:0,imagen:p.imagen||null}),c[m].tallas.push({talla:p.talla,cantidad:p.cantidad}),c[m].subtotal+=p.cantidad*p.precio_unitario}),t.innerHTML=`
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
              ${m.tallas.map(f=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${f.talla} ×${f.cantidad}</span>`).join("")}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${p}');renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px">
          <span style="font-size:0.85rem;color:#888">${m.tallas.reduce((f,u)=>f+u.cantidad,0)} pares</span>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="font-size:0.72rem;color:#888">$</span>
            <input type="number" value="${(m.subtotal/m.tallas.reduce((f,u)=>f+u.cantidad,0)).toFixed(2)}"
                   onchange="editarPrecioCorridaPOS('${p}', this.value);renderDrawerPOS()"
                   style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
            <span style="font-size:0.72rem;color:#888">/par</span>
          </div>
          <span style="font-weight:700;color:#6a1b9a">$${m.subtotal.toFixed(2)}</span>
        </div>
      </div>
    `).join("")}
  `};window.cobrarPOSM=async()=>{const e=document.getElementById("pos-pago-m"),t=document.getElementById("pos-pago");e&&t&&(t.value=e.value),cerrarDrawerPOS(),await cobrarPOS()};window.buscarClientePOSM=e=>{const{clientes:t}=window._posData,o=document.getElementById("pos-cliente-resultados-m");if(!e||e.length<2){o.style.display="none";return}const n=t.filter(a=>a.nombre.toLowerCase().includes(e.toLowerCase())).slice(0,5);if(!n.length){o.style.display="none";return}o.style.display="block",o.innerHTML=n.map(a=>`
    <div onclick="seleccionarClientePOSM('${a.id}','${a.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      <strong>${a.nombre}</strong>${a.telefono?" · "+a.telefono:""}
    </div>
  `).join("")};window.seleccionarClientePOSM=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar-m").value="",document.getElementById("pos-cliente-resultados-m").style.display="none";const o=document.getElementById("pos-cliente-sel-m");o.textContent="✔ "+t+" — toca para cambiar",o.style.display="block"};window.limpiarClientePOSM=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-sel-m").style.display="none",document.getElementById("pos-cliente-buscar-m").value=""};window.aplicarDescuentoPOS=e=>{const t=parseFloat(e)||0;window._posCarrito.forEach(i=>{const r=window._posCarrito.reduce((d,l)=>d+l.cantidad,0);let s;i.precio_base_original||(i.es_corrida?s=i.precio_corrida:r>=6?s=i.precio_mayoreo6:r>=3?s=i.precio_mayoreo3:s=i.precio_menudeo,i.precio_base_original=s),i.precio_unitario=Math.max(0,parseFloat((i.precio_base_original-t).toFixed(2))),i.precio_manual=t>0});const o=window._posCarrito.reduce((i,r)=>i+r.cantidad*r.precio_unitario,0),n=document.getElementById("pos-total");n&&(n.textContent="$"+o.toFixed(2));const a=document.getElementById("pos-descuento-info");if(a){const i=window._posCarrito.reduce((r,s)=>r+s.cantidad,0);a.textContent=t>0?`Ahorro total: $${(t*i).toFixed(2)} en ${i} pares`:""}renderCarritoPOS(),setTimeout(()=>{var l;const i=document.getElementById("pos-descuento");i&&(i.value=t);const r=document.getElementById("pos-descuento-m");r&&(r.value=t);const s=window._posCarrito.reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),d=document.getElementById("pos-drawer-total");d&&(d.textContent="$"+s.toFixed(2)),(l=document.getElementById("pos-drawer"))!=null&&l.classList.contains("open")&&renderDrawerPOS()},50)};window.buscarClientePOS=e=>{const t=window._posData?window._posData.clientes:[],o=document.getElementById("pos-cliente-resultados");if(!o)return;if(!e||e.length<2){o.style.display="none";return}const n=t.filter(a=>a.nombre.toLowerCase().includes(e.toLowerCase())||(a.telefono||"").includes(e)).slice(0,8);if(n.length===0){o.innerHTML='<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron clientes</div>',o.style.display="block";return}o.innerHTML=n.map(a=>`
    <div onclick="seleccionarClientePOS('${a.id}', '${a.nombre.replace(/'/g,"")}')"
         style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'"
         onmouseout="this.style.background='white'">
      <strong>${a.nombre}</strong>
      <span style="color:#888;font-size:0.75rem"> · ${a.tipo||"menudeo"}</span>
      ${a.telefono?'<br><span style="color:#888;font-size:0.72rem">'+a.telefono+"</span>":""}
    </div>
  `).join(""),o.style.display="block"};window.seleccionarClientePOS=(e,t)=>{document.getElementById("pos-cliente").value=e,document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-resultados").style.display="none";const o=document.getElementById("pos-cliente-seleccionado");o.textContent="✔ "+t+" — toca para cambiar",o.style.display="block"};window.limpiarClientePOS=()=>{document.getElementById("pos-cliente").value="",document.getElementById("pos-cliente-seleccionado").style.display="none",document.getElementById("pos-cliente-buscar").value="",document.getElementById("pos-cliente-buscar").focus()};window.renderProductosPOS=e=>{const{variantes:t,inventario:o}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",a=o.filter(r=>r.sucursal_id===n),i=document.getElementById("pos-productos-grid");i&&(i.innerHTML=e.filter(r=>r.activo).map(r=>{const s=t.filter(c=>c.producto_id===r.id),d=[...new Set(s.map(c=>c.color).filter(Boolean))],l=s.reduce((c,p)=>{const m=a.find(f=>f.variante_id===p.id);return c+(m?m.cantidad:0)},0);return`
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
    `}).join(""))};window.buscarPOS=e=>{const{productos:t}=window._posData;if(!e){renderProductosPOS(t);return}const o=e.toLowerCase().split(" ").filter(a=>a),n=t.filter(a=>{const i=a.nombre.toLowerCase(),r=(a.sku_interno||"").toLowerCase(),s=(a.categoria||"").toLowerCase(),d=i+" "+r+" "+s;return o.every(l=>d.includes(l))});renderProductosPOS(n)};window.filtrarPOS=e=>{const{productos:t}=window._posData,o=e?t.filter(n=>n.categoria===e):t;renderProductosPOS(o),document.querySelectorAll("#pos-categorias button").forEach(n=>{n.className="btn btn-secondary",n.style.cssText="padding:4px 12px;font-size:0.8rem"}),event.target.className="btn btn-primary",event.target.style.cssText="padding:4px 12px;font-size:0.8rem"};window.actualizarInventarioPOS=async()=>{const e=document.getElementById("pos-sucursal").value;try{const t=await fetch(g+"/inventario/sucursal/"+e);window._posData.inventario=await t.json();const{productos:o}=window._posData;renderProductosPOS(o)}catch{}};window.abrirProductoPOS=e=>{const t=document.getElementById("pos-modal");t&&t.remove();const{productos:o,variantes:n,inventario:a}=window._posData,i=o.find(p=>p.id===e);if(!i)return;const r=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",s=a.filter(p=>p.sucursal_id===r),d=n.filter(p=>p.producto_id===e),l=[...new Set(d.map(p=>p.color).filter(Boolean))];window._posBuffer={};const c=document.createElement("div");c.id="pos-modal",c.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",c.innerHTML=`
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

      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
        <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:8px">SELECCIONA COLOR</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${l.map(p=>{const m=d.find(u=>u.color===p),f=d.filter(u=>u.color===p).reduce((u,b)=>{const y=s.find(h=>h.variante_id===b.id);return u+(y?y.cantidad:0)},0);return`
              <div onclick="seleccionarColorModalPOS('${e}', '${p}')"
                   id="pos-color-btn-${p.replace(/\s/g,"_")}"
                   style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid ${f===0?"#f5f5f5":"#ddd"};opacity:${f===0?"0.4":"1"}">
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

      <div style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid #eee">
  ${i.corrida_activa?`
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
  `,document.body.appendChild(c),c.addEventListener("click",p=>{p.target===c&&c.remove()}),window._posSeleccion={productoId:e,color:null},window._posBuffer={}};window.mostrarCorridaModalPOS=e=>{const{variantes:t,inventario:o}=window._posData,n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",a=o.filter(p=>p.sucursal_id===n),i=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],r=[...new Set(t.filter(p=>p.producto_id===e).map(p=>p.color).filter(Boolean))],s=document.querySelector(`button[onclick="mostrarCorridaModalPOS('${e}')"]`);s&&(s.style.display="none"),document.querySelectorAll("#pos-modal").forEach(p=>{p!==document.getElementById("pos-modal")&&p.remove()}),window._posSeleccion.color=null,window._corridaCantidades={};const d=document.getElementById("pos-tallas-panel");if(!d)return;const l=p=>{const m=t.filter(f=>f.producto_id===e&&f.color===p).sort((f,u)=>i.indexOf(f.talla)-i.indexOf(u.talla));m.filter(f=>{const u=a.find(b=>b.variante_id===f.id);return u&&u.cantidad>0}),d.innerHTML=`
      <p style="font-size:0.75rem;color:#6a1b9a;font-weight:700;margin-bottom:12px">📦 CORRIDA — selecciona color y ajusta cantidades</p>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        ${r.map(f=>{const u=t.find(v=>v.producto_id===e&&v.color===f),b=u?u.color_hex:"#888",y=u?u.foto_url:null,h=Object.entries(window._corridaCantidades).filter(([v])=>t.find(x=>x.id===v&&x.color===f)).reduce((v,[,x])=>v+x,0);return`
            <div onclick="window._corridaColorActivo='${f}';renderCorridaColor('${f}')"
                 style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px;border-radius:10px;border:2px solid ${f===p?"#6a1b9a":"#eee"};background:${f===p?"#f3e5f5":"white"};min-width:64px;position:relative">
              ${y?`<img src="${y}" style="width:44px;height:44px;object-fit:cover;border-radius:6px">`:`<div style="width:44px;height:44px;border-radius:6px;background:${b}"></div>`}
              <span style="font-size:0.65rem;font-weight:600;color:#333;text-align:center">${f}</span>
              ${h>0?`<span style="position:absolute;top:-6px;right:-6px;background:#6a1b9a;color:white;font-size:0.6rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center">${h}</span>`:""}
            </div>
          `}).join("")}
      </div>

           <div style="display:flex;flex-direction:column;gap:8px">
        ${m.map(f=>{const u=a.find(h=>h.variante_id===f.id),b=u?u.cantidad:0,y=window._corridaCantidades[f.id]||0;return`
            <div style="display:flex;align-items:center;gap:10px;opacity:${b===0?"0.4":"1"}">
              <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#333">${f.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:50px">Stock: ${b}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button ${b===0?"disabled":""}
                        onclick="const i=document.getElementById('qty-corrida-${f.id}');const val=Math.max(0,(parseInt(i.value)||0)-1);i.value=val;window._corridaCantidades['${f.id}']=val;renderCorridaColor('${p}')"
                        style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
                <input type="number" min="0" max="${b}"
                       value="${y}"
                       id="qty-corrida-${f.id}"
                       ${b===0?"disabled":""}
                       style="width:56px;height:40px;text-align:center;padding:4px;border:2px solid ${y>0?"#6a1b9a":"#ddd"};border-radius:8px;font-size:1rem;font-weight:700"
                       oninput="window._corridaCantidades['${f.id}']=Math.min(${b},Math.max(0,parseInt(this.value)||0));this.value=window._corridaCantidades['${f.id}']">
                <button ${b===0?"disabled":""}
                        onclick="const i=document.getElementById('qty-corrida-${f.id}');const val=Math.min(${b},(parseInt(i.value)||0)+1);i.value=val;window._corridaCantidades['${f.id}']=val;renderCorridaColor('${p}')"
                        style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
              ${b===0?'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>':""}
            </div>
          `}).join("")}
      </div>
    `};window.renderCorridaColor=l,window._corridaColorActivo=r[0],l(r[0]);const c=document.querySelector("#pos-modal > div > div:last-child");c&&(c.innerHTML=`
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
    `)};window.sugerirCorrida=(e,t)=>{const{variantes:o,inventario:n}=window._posData,a=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=n.filter(c=>c.sucursal_id===a),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],s=o.filter(c=>c.producto_id===e&&c.color===t).sort((c,p)=>r.indexOf(c.talla)-r.indexOf(p.talla)),d=s.filter(c=>{const p=i.find(m=>m.variante_id===c.id);return p&&p.cantidad>0}),l=d.some(c=>c.talla.includes("."));if(s.forEach(c=>{window._corridaCantidades[c.id]=0}),l)d.slice(0,6).forEach(c=>{window._corridaCantidades[c.id]=1});else{const c=d.slice(0,5);c.length>=4?c.forEach((p,m)=>{window._corridaCantidades[p.id]=m===1||m===2?2:1}):d.slice(0,6).forEach(p=>{window._corridaCantidades[p.id]=Math.ceil(6/d.length)})}window.renderCorridaColor(t)};window.confirmarCorridaNueva=e=>{const{variantes:t}=window._posData,o=window._posData.productos.find(i=>i.id===e);if(!o)return;let n=0;if(Object.entries(window._corridaCantidades).forEach(([i,r])=>{var l;if(r<=0)return;const s=t.find(c=>c.id===i);if(!s)return;const d=window._posCarrito.find(c=>c.variante_id===i&&c.es_corrida);d?(d.cantidad+=r,d.es_corrida=!0):window._posCarrito.push({variante_id:i,producto_id:e,nombre:o.nombre,color:s.color,talla:s.talla,cantidad:r,precio_menudeo:parseFloat(o.precio_menudeo)||0,precio_mayoreo3:parseFloat(o.precio_mayoreo3)||parseFloat(o.precio_menudeo)-30,precio_mayoreo6:parseFloat(o.precio_mayoreo6)||parseFloat(o.precio_menudeo)-70,precio_corrida:parseFloat(o.precio_corrida)||parseFloat(o.precio_menudeo)-110,es_corrida:!0,imagen:((l=window._posData.variantes.find(c=>c.id===i))==null?void 0:l.foto_url)||o.imagen_principal||null,precio_unitario:parseFloat(o.precio_corrida)||parseFloat(o.precio_menudeo)-110}),n++}),n===0){alert("Agrega al menos una talla");return}const a=document.getElementById("pos-modal");a&&a.remove(),window._corridaCantidades={},renderCarritoPOS()};window.seleccionarColorModalPOS=(e,t)=>{const{variantes:o,inventario:n}=window._posData,a=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=n.filter(f=>f.sucursal_id===a),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];window._posSeleccion&&window._posSeleccion.color&&guardarBufferColor(e,window._posSeleccion.color),document.querySelectorAll('[id^="pos-color-btn-"]').forEach(f=>{f.style.borderColor="#ddd",f.style.background="transparent"});const s=document.getElementById("pos-color-btn-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t;const d=o.filter(f=>f.producto_id===e&&f.color===t).sort((f,u)=>r.indexOf(f.talla)-r.indexOf(u.talla)),l=d[0]?d[0].foto_url:null,c=document.getElementById("pos-modal-img");c&&l&&(c.src=l);const p=window._posBuffer[t]||{},m=document.getElementById("pos-tallas-panel");m&&(m.innerHTML=`
      <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:10px">TALLAS — ${t}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${d.map(f=>{const u=i.find(h=>h.variante_id===f.id),b=u?u.cantidad:0,y=p[f.id]||0;return`
            <div style="display:flex;align-items:center;gap:10px;opacity:${b===0?"0.4":"1"}">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700;color:#333">${f.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:60px">Stock: ${b}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="cambiarCantidadTallaPOS('modal-${f.id}', -1, ${b})"
                        ${b===0?"disabled":""}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">−</button>
                <input type="number" min="0" max="${b}"
                       value="${y}"
                       id="qty-modal-${f.id}"
                       ${b===0?"disabled":""}
                       style="width:50px;text-align:center;padding:5px;border:2px solid ${y>0?"#E91E8C":"#ddd"};border-radius:8px;font-size:1rem;font-weight:700"
                       oninput="validarCantidadTalla('modal-${f.id}', ${b}); actualizarBadgeColor('${e}', '${t}')">
                <button onclick="cambiarCantidadTallaPOS('modal-${f.id}', 1, ${b})"
                        ${b===0?"disabled":""}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">+</button>
              </div>
              ${b===0?'<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>':""}
            </div>
          `}).join("")}
      </div>
    `)};window.guardarBufferColor=(e,t)=>{const{variantes:o}=window._posData,n=o.filter(a=>a.producto_id===e&&a.color===t);window._posBuffer[t]||(window._posBuffer[t]={}),n.forEach(a=>{const i=document.getElementById("qty-modal-"+a.id);window._posBuffer[t][a.id]=i&&parseInt(i.value)||0}),actualizarBadgeColor(e,t)};window.actualizarBadgeColor=(e,t)=>{const{variantes:o}=window._posData,n=o.filter(r=>r.producto_id===e&&r.color===t);let a=0;n.forEach(r=>{const s=document.getElementById("qty-modal-"+r.id);a+=s&&parseInt(s.value)||0});const i=document.getElementById("pos-color-badge-"+t.replace(/\s/g,"_"));i&&(a>0?(i.textContent=a+" par"+(a>1?"es":""),i.style.display="block"):i.style.display="none"),actualizarResumenModalPOS(e)};window.actualizarResumenModalPOS=e=>{const{variantes:t}=window._posData;let o=0;const n=[];Object.entries(window._posBuffer).forEach(([s,d])=>{Object.entries(d).forEach(([l,c])=>{if(c>0){const p=t.find(m=>m.id===l);p&&(n.push({color:s,talla:p.talla,cantidad:c}),o+=c)}})});const a=window._posSeleccion?window._posSeleccion.color:null;a&&!window._posBuffer[a]&&t.filter(d=>d.producto_id===e&&d.color===a).forEach(d=>{const l=document.getElementById("qty-modal-"+d.id),c=l&&parseInt(l.value)||0;c>0&&(n.push({color:a,talla:d.talla,cantidad:c}),o+=c)});const i=document.getElementById("pos-modal-resumen"),r=document.getElementById("pos-btn-confirmar");o>0?(i&&(i.style.display="block",i.innerHTML=`
        <p style="font-size:0.75rem;font-weight:700;color:#2e7d32;margin-bottom:8px">🛒 RESUMEN — ${o} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${n.map(s=>`
            <span style="background:#f5f5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem">
              <strong>${s.color}</strong> T${s.talla} × ${s.cantidad}
            </span>
          `).join("")}
        </div>
      `),r&&(r.textContent=`✅ Agregar ${o} pares al carrito`,r.disabled=!1)):(i&&(i.style.display="none"),r&&(r.textContent="Selecciona al menos una talla",r.disabled=!0))};window.confirmarModalPOS=e=>{window._posSeleccion&&window._posSeleccion.color;const{productos:t,variantes:o}=window._posData,n=t.find(i=>i.id===e);if(!n)return;window._posSeleccion&&window._posSeleccion.color?guardarBufferColor(e,window._posSeleccion.color):document.querySelectorAll('[id^="qty-modal-"]').forEach(r=>{const s=r.id.replace("qty-modal-",""),d=o.find(c=>c.id===s);if(!d)return;const l=parseInt(r.value)||0;window._posBuffer[d.color]||(window._posBuffer[d.color]={}),window._posBuffer[d.color][s]=l});let a=0;if(Object.entries(window._posBuffer).forEach(([i,r])=>{Object.entries(r).forEach(([s,d])=>{var p;if(d<=0)return;const l=o.find(m=>m.id===s),c=window._posCarrito.find(m=>m.variante_id===s&&!m.es_corrida);c?c.cantidad+=d:window._posCarrito.push({variante_id:s,producto_id:e,nombre:n.nombre,color:l?l.color:i,talla:l?l.talla:"",cantidad:d,precio_menudeo:parseFloat(n.precio_menudeo)||0,precio_mayoreo3:parseFloat(n.precio_mayoreo3)||parseFloat(n.precio_menudeo)-30,precio_mayoreo6:parseFloat(n.precio_mayoreo6)||parseFloat(n.precio_menudeo)-70,precio_corrida:parseFloat(n.precio_corrida)||parseFloat(n.precio_menudeo)-110,es_oferta:n.es_oferta||!1,es_corrida:!1,imagen:window._posBuffer[l?l.color:i]&&((p=window._posData.variantes.find(m=>m.id===s))==null?void 0:p.foto_url)||n.imagen_principal||null,precio_unitario:parseFloat(n.precio_menudeo)||0}),a++})}),a===0){alert("Pon al menos 1 par en alguna talla");return}document.getElementById("pos-modal").remove(),window._posBuffer={},renderCarritoPOS()};window.seleccionarColorPOS=(e,t)=>{const{variantes:o,inventario:n}=window._posData,a=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",i=n.filter(m=>m.sucursal_id===a),r=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"];document.querySelectorAll('[id^="pos-color-"]').forEach(m=>{m.style.borderColor="transparent",m.style.background="transparent"});const s=document.getElementById("pos-color-"+t.replace(/\s/g,"_"));s&&(s.style.borderColor="#E91E8C",s.style.background="#fce4f3"),window._posSeleccion.color=t,window._posSeleccion.talla=null;const d=o.filter(m=>m.producto_id===e&&m.color===t).sort((m,f)=>r.indexOf(m.talla)-r.indexOf(f.talla)),l=d[0]?d[0].foto_url:null,c=document.getElementById("pos-modal-img");c&&l&&(c.src=l);const p=document.getElementById("pos-tallas-container");p&&(p.innerHTML=`
    <p style="font-size:0.75rem;color:#888;margin-bottom:6px;font-weight:600">TALLAS Y CANTIDADES</p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${d.map(m=>{const f=i.find(y=>y.variante_id===m.id),u=f?f.cantidad:0,b=u>0;return`
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
  `)};window.cambiarCantidadTallaPOS=(e,t,o)=>{const n=document.getElementById("qty-"+e);if(!n)return;const a=Math.min(o,Math.max(0,(parseInt(n.value)||0)+t));n.value=a,window._posSeleccion&&actualizarBadgeColor(window._posSeleccion.productoId,window._posSeleccion.color)};window.agregarTallasPOS=(e,t)=>{const{productos:o,variantes:n}=window._posData,a=o.find(d=>d.id===e);if(!a)return;const i=n.filter(d=>d.producto_id===e&&d.color===t);let r=0;if(i.forEach(d=>{const l=document.getElementById("qty-"+d.id),c=l&&parseInt(l.value)||0;if(c<=0)return;const p=window._posCarrito.find(m=>m.variante_id===d.id);p?p.cantidad+=c:window._posCarrito.push({variante_id:d.id,producto_id:e,nombre:a.nombre,color:t,talla:d.talla,cantidad:c,precio_menudeo:parseFloat(a.precio_menudeo)||0,precio_mayoreo3:parseFloat(a.precio_mayoreo3)||parseFloat(a.precio_menudeo)-30,precio_mayoreo6:parseFloat(a.precio_mayoreo6)||parseFloat(a.precio_menudeo)-70,precio_corrida:parseFloat(a.precio_corrida)||parseFloat(a.precio_menudeo)-110,imagen:a.imagen_principal||null,es_oferta:a.es_oferta||!1,precio_unitario:parseFloat(a.precio_menudeo)||0}),r++}),r===0){alert("Pon al menos 1 par en alguna talla");return}const s=document.querySelector(`button[onclick="agregarTallasPOS('${e}', '${t}')"]`);s&&(s.textContent="✅ Agregado — selecciona otro color o cierra",s.style.background="#2e7d32",s.style.borderColor="#2e7d32",s.disabled=!0),i.forEach(d=>{const l=document.getElementById("qty-"+d.id);l&&(l.value=0)}),actualizarResumenModal(e)};window.actualizarResumenModal=e=>{const t=window._posCarrito.filter(a=>a.producto_id===e),o=t.reduce((a,i)=>a+i.cantidad,0);let n=document.getElementById("pos-modal-resumen");if(!n){n=document.createElement("div"),n.id="pos-modal-resumen",n.style.cssText="background:#e8f5e9;border-radius:8px;padding:0.75rem;margin-top:10px;border:1px solid #a5d6a7";const a=document.querySelector("#pos-modal > div > div:last-child");a&&a.insertBefore(n,a.firstChild)}n.innerHTML=`
    <p style="font-size:0.78rem;font-weight:700;color:#2e7d32;margin-bottom:6px">🛒 En carrito — ${o} pares</p>
    ${t.map(a=>`
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#333;margin-bottom:2px">
        <span>${a.color} · T${a.talla}</span>
        <strong>${a.cantidad} par${a.cantidad>1?"es":""}</strong>
      </div>
    `).join("")}
    <button onclick="document.getElementById('pos-modal').remove(); renderCarritoPOS()"
            class="btn btn-primary"
            style="width:100%;margin-top:10px;padding:10px;font-size:0.95rem">
      ✅ Listo — agregar al carrito
    </button>
  `};window.seleccionarTallaPOS=(e,t)=>{window._posSeleccion.talla=t,window._posSeleccion.varianteId=e,document.querySelectorAll('[id^="pos-talla-"]').forEach(a=>{a.style.borderColor="#ddd",a.style.background="white",a.style.color="#333"});const o=document.getElementById("pos-talla-"+t.replace(".","_"));o&&(o.style.borderColor="#E91E8C",o.style.background="#fce4f3",o.style.color="#E91E8C");const n=document.getElementById("pos-btn-agregar");n&&(n.textContent="+ Agregar al carrito",n.disabled=!1)};window.agregarAlCarritoPOS=e=>{const{productos:t,variantes:o}=window._posData,{varianteId:n,color:a,talla:i}=window._posSeleccion;if(!n||!a||!i)return;const r=t.find(d=>d.id===e);if(!r)return;const s=window._posCarrito.find(d=>d.variante_id===n);s?s.cantidad++:window._posCarrito.push({variante_id:n,producto_id:e,nombre:r.nombre,color:a,talla:i,cantidad:1,precio_menudeo:parseFloat(r.precio_menudeo)||0,precio_mayoreo3:parseFloat(r.precio_mayoreo3)||parseFloat(r.precio_menudeo)-30,precio_mayoreo6:parseFloat(r.precio_mayoreo6)||parseFloat(r.precio_menudeo)-70,precio_corrida:parseFloat(r.precio_corrida)||parseFloat(r.precio_menudeo)-110,imagen:r.imagen_principal||null,es_oferta:r.es_oferta||!1,precio_unitario:parseFloat(r.precio_menudeo)||0}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.agregarCorridaPOS=e=>{const{productos:t,variantes:o,inventario:n}=window._posData,{color:a}=window._posSeleccion;if(!a){alert("Selecciona un color primero");return}t.find(m=>m.id===e);const i=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=n.filter(m=>m.sucursal_id===i),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=o.filter(m=>m.producto_id===e&&m.color===a).sort((m,f)=>s.indexOf(m.talla)-s.indexOf(f.talla)),c=document.getElementById("pos-modal").querySelector("div > div:last-child"),p=`
    <div style="background:#f3e5f5;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ce93d8">
      <p style="font-weight:700;color:#6a1b9a;margin-bottom:0.75rem">✏️ Editar corrida — ${a}</p>
      <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">Ajusta las cantidades por talla</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${d.map(m=>{const f=r.find(b=>b.variante_id===m.id),u=f?f.cantidad:0;return`
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
      <button onclick="confirmarCorridaPOS('${e}', '${a}')"
              class="btn btn-primary"
              style="width:100%;margin-top:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Confirmar corrida
      </button>
    </div>
  `;c&&c.insertAdjacentHTML("beforeend",p)};window.confirmarCorridaPOS=(e,t)=>{const{productos:o,variantes:n}=window._posData,a=o.find(r=>r.id===e);n.filter(r=>r.producto_id===e&&r.color===t).forEach(r=>{const s=document.getElementById("qty-corrida-"+r.id),d=s&&parseInt(s.value)||0;if(d<=0)return;const l=window._posCarrito.find(c=>c.variante_id===r.id);l?(l.cantidad+=d,l.es_corrida=!0):window._posCarrito.push({variante_id:r.id,producto_id:e,nombre:a.nombre,color:t,talla:r.talla,cantidad:d,precio_menudeo:parseFloat(a.precio_menudeo)||0,precio_mayoreo3:parseFloat(a.precio_mayoreo3)||parseFloat(a.precio_menudeo)-30,precio_mayoreo6:parseFloat(a.precio_mayoreo6)||parseFloat(a.precio_menudeo)-70,precio_corrida:parseFloat(a.precio_corrida)||parseFloat(a.precio_menudeo)-110,imagen:a.imagen_principal||null,es_oferta:a.es_oferta||!1,es_corrida:!0,precio_unitario:parseFloat(a.precio_menudeo)||0})}),document.getElementById("pos-modal").remove(),renderCarritoPOS()};window.renderCarritoPOS=()=>{var f;const e=window._posCarrito,t=document.getElementById("pos-carrito-items");if(!t)return;const o=e.reduce((u,b)=>u+b.cantidad,0);e.forEach(u=>{u.precio_manual||(u.es_oferta?u.precio_unitario=u.precio_menudeo:u.es_corrida?u.precio_unitario=u.precio_corrida:o>=6?u.precio_unitario=u.precio_mayoreo6:o>=3?u.precio_unitario=u.precio_mayoreo3:u.precio_unitario=u.precio_menudeo)});const n=e.reduce((u,b)=>u+b.cantidad*b.precio_unitario,0),a=e.some(u=>u.es_corrida)?"Corrida":o>=6?"Mayoreo 6+":o>=3?"Mayoreo 3+":"Menudeo",i=e.filter(u=>!u.es_corrida),r=e.filter(u=>u.es_corrida),s={};r.forEach(u=>{const b=u.producto_id+"|"+u.color;s[b]||(s[b]={nombre:u.nombre,color:u.color,producto_id:u.producto_id,tallas:[],subtotal:0,imagen:u.imagen||null}),s[b].tallas.push({talla:u.talla,cantidad:u.cantidad,variante_id:u.variante_id}),s[b].subtotal+=u.cantidad*u.precio_unitario}),e.length===0?t.innerHTML='<p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>':t.innerHTML=`
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
              ${b.tallas.map(y=>`<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${y.talla} ×${y.cantidad}</span>`).join("")}
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
        <input type="number" value="${(b.subtotal/b.tallas.reduce((y,h)=>y+h.cantidad,0)).toFixed(2)}"
               onchange="editarPrecioCorridaPOS('${u}', this.value)"
               style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
        <span style="font-size:0.72rem;color:#888">/par</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <span style="font-size:0.78rem;color:#888">${b.tallas.reduce((y,h)=>y+h.cantidad,0)} pares</span>
      <p id="subtotal-corrida-${u.replace("|","-")}" style="font-size:0.95rem;font-weight:700;color:#6a1b9a">$${b.subtotal.toFixed(2)}</p>
    </div>
  </div>
`).join("")}
    `;const d=document.getElementById("pos-total"),l=document.getElementById("pos-total-pares"),c=document.getElementById("pos-tipo-precio");d&&(d.textContent="$"+n.toFixed(2)),l&&(l.textContent=o),c&&(c.textContent=a);const p=document.getElementById("pos-flotante-pares"),m=document.getElementById("pos-flotante-total");p&&(p.textContent=o+" pares"),m&&(m.textContent="$"+n.toFixed(2)),(f=document.getElementById("pos-drawer"))!=null&&f.classList.contains("open")&&renderDrawerPOS()};window.editarPrecioPOS=(e,t)=>{if(!window._posCarrito[e])return;const o=parseFloat(t)||0;window._posCarrito[e].precio_unitario=o,window._posCarrito[e].precio_manual=!0;const n=window._posCarrito[e].cantidad,a=document.getElementById("subtotal-item-"+e);a&&(a.textContent="$"+(n*o).toFixed(2));const i=window._posCarrito.reduce((s,d)=>s+d.cantidad*d.precio_unitario,0),r=document.getElementById("pos-total");r&&(r.textContent="$"+i.toFixed(2))};window.editarPrecioCorridaPOS=(e,t)=>{const[o,n]=e.split("|"),a=parseFloat(t)||0;window._posCarrito.forEach(c=>{c.producto_id===o&&c.color===n&&c.es_corrida&&(c.precio_unitario=a,c.precio_manual=!0)});const r=window._posCarrito.filter(c=>c.producto_id===o&&c.color===n&&c.es_corrida).reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),s=document.getElementById("subtotal-corrida-"+e.replace("|","-"));s&&(s.textContent="$"+r.toFixed(2));const d=window._posCarrito.reduce((c,p)=>c+p.cantidad*p.precio_unitario,0),l=document.getElementById("pos-total");l&&(l.textContent="$"+d.toFixed(2))};window.editarCorridaEnCarrito=e=>{const[t,o]=e.split("|"),{inventario:n,variantes:a}=window._posData,i=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"",r=n.filter(c=>c.sucursal_id===i),s=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],d=a.filter(c=>c.producto_id===t&&c.color===o).sort((c,p)=>s.indexOf(c.talla)-s.indexOf(p.talla)),l=document.createElement("div");l.id="pos-modal-editar-corrida",l.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",l.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:400px;width:100%;padding:1.5rem;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700;color:#6a1b9a">✏️ Editar corrida · ${o}</p>
        <button onclick="document.getElementById('pos-modal-editar-corrida').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${d.map(c=>{const p=r.find(b=>b.variante_id===c.id),m=p?p.cantidad:0,f=window._posCarrito.find(b=>b.variante_id===c.id&&b.es_corrida),u=f?f.cantidad:0;return`
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
  `,document.body.appendChild(l),l.addEventListener("click",c=>{c.target===l&&l.remove()})};window.guardarEdicionCorridaPOS=(e,t)=>{const{variantes:o,productos:n}=window._posData,a=window._posCarrito.filter(l=>l.producto_id===e&&l.color===t&&l.es_corrida),i=a.length>0&&a[0].precio_manual?a[0].precio_unitario:null;window._posCarrito=window._posCarrito.filter(l=>!(l.producto_id===e&&l.color===t&&l.es_corrida));const r=o.filter(l=>l.producto_id===e&&l.color===t),s=n.find(l=>l.id===e);if(!s)return;const d=i!==null?i:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-110;r.forEach(l=>{const c=document.getElementById("edit-corrida-"+l.id),p=c&&parseInt(c.value)||0;p<=0||window._posCarrito.push({variante_id:l.id,producto_id:e,nombre:s.nombre,color:t,talla:l.talla,cantidad:p,precio_menudeo:parseFloat(s.precio_menudeo)||0,precio_mayoreo3:parseFloat(s.precio_mayoreo3)||parseFloat(s.precio_menudeo)-30,precio_mayoreo6:parseFloat(s.precio_mayoreo6)||parseFloat(s.precio_menudeo)-70,precio_corrida:parseFloat(s.precio_corrida)||parseFloat(s.precio_menudeo)-110,es_oferta:s.es_oferta||!1,imagen:s.imagen_principal||null,es_corrida:!0,precio_manual:i!==null,precio_unitario:d})}),document.getElementById("pos-modal-editar-corrida").remove(),renderCarritoPOS()};window.eliminarCorridaPOS=e=>{const[t,o]=e.split("|");window._posCarrito=window._posCarrito.filter(n=>!(n.producto_id===t&&n.color===o&&n.es_corrida)),renderCarritoPOS()};window.cambiarCantidadPOS=async(e,t)=>{const o=window._posCarrito[e];if(o){if(t>0){const n=document.getElementById("pos-sucursal")?document.getElementById("pos-sucursal").value:"";try{const r=(await(await fetch(g+"/inventario/sucursal/"+n)).json()).find(l=>l.variante_id===o.variante_id),s=r?r.cantidad:0;if(window._posCarrito.filter(l=>l.variante_id===o.variante_id).reduce((l,c)=>l+c.cantidad,0)>=s){alert("No hay más existencia disponible. Stock: "+s+" pares");return}}catch(a){console.error("Error verificando stock",a)}}o.cantidad=Math.max(1,o.cantidad+t),renderCarritoPOS()}};window.eliminarItemPOS=e=>{window._posCarrito.splice(e,1),renderCarritoPOS()};window.limpiarCarritoPOS=()=>{window._posCarrito.length>0&&!confirm("Limpiar el carrito?")||(window._posCarrito=[],renderCarritoPOS())};window.cobrarPOS=async()=>{if(window._posCarrito.length===0){alert("El carrito esta vacio");return}const e=document.querySelector('button[onclick="cobrarPOS()"]');if(e){if(e.disabled)return;e.disabled=!0,e.textContent="Procesando..."}const t=document.getElementById("pos-cliente").value||null,o=document.getElementById("pos-sucursal").value,n=document.getElementById("pos-pago").value,a=window._posCarrito.reduce((i,r)=>i+r.cantidad*r.precio_unitario,0);try{const s=(await(await fetch(g+"/pedidos/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cliente_id:t,canal:"sucursal",sucursal_id:o,forma_pago:n,total:a,subtotal:a,status:n==="spei"?"pendiente_pago":"confirmado"})})).json())[0].id;for(const c of window._posCarrito)await fetch(g+"/pedidos/"+s+"/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:c.variante_id,cantidad:c.cantidad,precio_unitario:c.precio_unitario,subtotal:c.cantidad*c.precio_unitario})});n!=="spei"&&await fetch(g+"/pedidos/"+s+"/confirmar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({forma_pago:n})});const d=window._posCarrito.reduce((c,p)=>c+p.cantidad,0);window._posCarrito=[],renderCarritoPOS(),imprimirTicketPOS(s,a,d,n);const l=await fetch(g+"/inventario/sucursal/"+o);window._posData.inventario=await l.json(),renderProductosPOS(window._posData.productos)}catch{alert("Error procesando la venta");const r=document.querySelector('button[onclick="cobrarPOS()"]');r&&(r.disabled=!1,r.textContent="Cobrar")}};window.imprimirTicketPOS=async(e,t,o,n)=>{const i=await(await fetch(g+"/pedidos/"+e)).json();if(!i||i.length===0)return;const r=i[0],s=r.pedido_items||[],d=r.clientes||{},l=new Date().toLocaleString("es-MX"),c=window.open("","_blank","width=400,height=600");c.document.write(`
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
        <span>${n.toUpperCase()}</span>
      </div>
      <div class="divider"></div>
      ${(()=>{const p={};return s.forEach(m=>{const f=m.variantes||{},u=f.productos||{},b=(u.nombre||"—")+"|"+(f.color||"");p[b]||(p[b]={nombre:u.nombre||"—",color:f.color||"",cantidad:0,subtotal:0}),p[b].cantidad+=m.cantidad,p[b].subtotal+=parseFloat(m.subtotal)||m.cantidad*m.precio_unitario}),`
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
  `),c.document.close()};window.generarPDFPedido=async e=>{const o=await(await fetch(g+"/pedidos/"+e)).json();if(!o||o.length===0)return;const n=o[0],a=n.pedido_items||[],i=n.clientes||{},r=new Date(n.created_at).toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"}),s=n.total||0,d=a.reduce((c,p)=>c+p.cantidad,0),l=window.open("","_blank");l.document.write(`
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
            <span class="badge ${n.status==="confirmado"||n.status==="pagado"?"badge-success":"badge-warning"}">${n.status}</span>
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
            <div class="campo-valor">${n.canal||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Forma de pago</div>
            <div class="campo-valor">${n.forma_pago||"—"}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Sucursal</div>
            <div class="campo-valor">${n.sucursales?n.sucursales.nombre:"—"}</div>
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
          ${a.map(c=>{const p=c.variantes||{};return`
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

      ${n.comentarios?`
        <div class="divider-light"></div>
        <div class="section-title">Comentarios</div>
        <p style="font-size:12px;color:#555">${n.comentarios}</p>
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
  `),l.document.close()};async function ae(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/movimientos/")).json(),n={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}};e.innerHTML=`
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
            ${o.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No hay movimientos registrados</td></tr>':o.map(a=>{const i=n[a.tipo]||{label:a.tipo,badge:"badge-warning"},r=a.cantidad||0;return`<tr>
                    <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(a.created_at).toLocaleString("es-MX")}</td>
                    <td><span class="badge ${i.badge}">${i.label}</span></td>
                    <td><strong>${a.variantes&&a.variantes.productos?a.variantes.productos.nombre:"—"}</strong></td>
                    <td>${a.variantes&&a.variantes.color||"—"}</td>
                    <td>${a.variantes&&a.variantes.talla||"—"}</td>
                    <td>${a.sucursales&&a.sucursales.nombre||"—"}</td>
                    <td style="font-weight:600;color:${r>0?"var(--green)":"var(--red)"}">${r>0?"+":""}${r}</td>
                    <td style="font-size:0.82rem">${a.usuario||"Admin"}</td>
<td style="font-size:0.82rem;color:var(--text-muted)">${a.motivo||"—"}</td>
<td>
  ${a.tipo!=="venta"&&a.tipo!=="ajuste"?`
  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#c62828;border-color:#c62828" 
          onclick="cancelarMovimiento('${a.id}', ${Math.abs(a.cantidad)}, '${a.variante_id}', '${a.sucursal_id}', '${a.tipo}')">
    Cancelar
  </button>`:""}
</td>
                  </tr>`}).join("")}
          </tbody>
        </table>
      </div>`,window._historialData=o}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.cancelarMovimiento=async(e,t,o,n,a)=>{if(confirm("¿Cancelar este movimiento? Se revertirá el cambio en el inventario."))try{const r=await(await fetch(g+"/inventario/?variante_id=eq."+o+"&sucursal_id=eq."+n)).json(),s=r&&r.length>0?r[0].cantidad:0,d=a==="venta"?s+t:Math.max(0,s-t);(await fetch(g+"/inventario/actualizar",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({variante_id:o,sucursal_id:n,cantidad:d,stock_minimo:r&&r.length>0?r[0].stock_minimo:3})})).ok?(alert("Movimiento cancelado. Inventario actualizado."),ae()):alert("Error al actualizar inventario")}catch{alert("Error conectando con el servidor")}};window.filtrarHistorial=()=>{const e=document.getElementById("hist-tipo").value,t=document.getElementById("hist-buscar").value.toLowerCase(),o=window._historialData||[],n={venta:{label:"Venta",badge:"badge-success"},entrada:{label:"Entrada",badge:"badge-info"},ajuste:{label:"Ajuste",badge:"badge-warning"},traspaso_salida:{label:"Traspaso salida",badge:"badge-danger"},traspaso_entrada:{label:"Traspaso entrada",badge:"badge-info"},cambio_salida:{label:"Cambio salida",badge:"badge-info"},cambio_entrada:{label:"Cambio entrada",badge:"badge-info"}},a=o.filter(r=>{if(e&&r.tipo!==e)return!1;if(t){const s=(r.variantes&&r.variantes.productos?r.variantes.productos.nombre:"").toLowerCase(),d=(r.motivo||"").toLowerCase();if(!s.includes(t)&&!d.includes(t))return!1}return!0}),i=document.getElementById("hist-tbody");i&&(i.innerHTML=a.length===0?'<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron movimientos</td></tr>':a.map(r=>{const s=n[r.tipo]||{label:r.tipo,badge:"badge-warning"},d=r.cantidad||0;return`<tr>
          <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(r.created_at).toLocaleString("es-MX")}</td>
          <td><span class="badge ${s.badge}">${s.label}</span></td>
          <td><strong>${r.variantes&&r.variantes.productos?r.variantes.productos.nombre:"—"}</strong></td>
          <td>${r.variantes&&r.variantes.color||"—"}</td>
          <td>${r.variantes&&r.variantes.talla||"—"}</td>
          <td>${r.sucursales&&r.sucursales.nombre||"—"}</td>
          <td style="font-weight:600;color:${d>0?"var(--green)":"var(--red)"}">${d>0?"+":""}${d}</td>
          <td style="font-size:0.82rem">${r.motivo||"—"}</td>
        </tr>`}).join(""))};async function ye(){try{const t=await(await fetch(g+"/pedidos/")).json(),n=await(await fetch(g+"/clientes/")).json(),i=await(await fetch(g+"/inventario/alertas")).json(),r=new Date;r.setHours(0,0,0,0);const s=new Date(r);s.setDate(s.getDate()-7);const d=new Date(r);d.setDate(d.getDate()-30);const l=t.filter($=>$.status==="confirmado"||$.status==="pagado"),c=l.filter($=>new Date($.created_at)>=r),p=l.filter($=>new Date($.created_at)>=s),m=c.reduce(($,z)=>$+parseFloat(z.total||0),0),f=p.reduce(($,z)=>$+parseFloat(z.total||0),0),u=n.filter($=>$.created_at&&new Date($.created_at)>=d).length,b=["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],y={};b.forEach($=>y[$]=0),l.filter($=>new Date($.created_at)>=d).forEach($=>{const z=b[new Date($.created_at).getDay()];y[z]+=parseFloat($.total||0)});const h={};l.forEach($=>{h[$.canal||"sucursal"]=(h[$.canal||"sucursal"]||0)+parseFloat($.total||0)});const v={};l.forEach($=>{v[$.forma_pago||"efectivo"]=(v[$.forma_pago||"efectivo"]||0)+1});const x={};l.forEach($=>{x[$.empleado||"Admin"]=(x[$.empleado||"Admin"]||0)+parseFloat($.total||0)});const C={};l.forEach($=>{const z=new Date($.created_at).toLocaleDateString("es-MX",{month:"short",year:"numeric"});C[z]=(C[z]||0)+parseFloat($.total||0)});const E={};l.forEach($=>{$.clientes&&(E[$.clientes.nombre]=(E[$.clientes.nombre]||0)+parseFloat($.total||0))});const k=Object.entries(E).sort(($,z)=>z[1]-$[1]).slice(0,5),w=Object.entries(y).sort(($,z)=>z[1]-$[1])[0],_=Object.entries(x).sort(($,z)=>z[1]-$[1])[0],I=document.getElementById("dashboard-contenido");if(!I)return;const T=I.querySelectorAll(".stat-card"),S=[{val:"$"+m.toFixed(0),sub:c.length+" pedidos hoy",color:"var(--pink)"},{val:c.length,sub:"confirmados hoy"},{val:"$"+f.toFixed(0),sub:p.length+" pedidos"},{val:u,sub:"ultimos 30 dias"},{val:i.length,sub:"por reabastecer",color:i.length>0?"var(--amber)":"var(--green)"},{val:w?w[0]:"—",sub:w?"$"+w[1].toFixed(0)+" prom.":""},{val:_?_[0]:"—",sub:_?"$"+_[1].toFixed(0):"",small:!0},{val:n.length,sub:"registrados"}];T.forEach(($,z)=>{if(!S[z])return;const j=$.querySelector(".stat-value"),B=$.querySelector(".stat-sub");j&&(j.textContent=S[z].val,j.style.color=S[z].color||"var(--text-primary)",S[z].small&&(j.style.fontSize="1rem")),B&&(B.textContent=S[z].sub||"")});const P=document.getElementById("dash-top-clientes");P&&(P.innerHTML=k.length===0?'<p style="color:var(--text-muted);font-size:0.85rem">Sin datos aun</p>':k.map(([$,z],j)=>`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="width:22px;height:22px;background:var(--pink);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">${j+1}</span>
            <span style="flex:1;font-size:0.875rem">${$}</span>
            <strong style="color:var(--pink)">$${z.toFixed(0)}</strong>
          </div>`).join(""));const A=document.getElementById("dash-ultimos-pedidos");A&&(A.innerHTML=t.slice(0,5).map($=>`
        <div onclick="verPedido('${$.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
          <div>
            <p style="font-size:0.85rem;font-weight:500">${$.clientes?$.clientes.nombre:"General"}</p>
            <p style="font-size:0.72rem;color:var(--text-muted)">${$.canal} · ${new Date($.created_at).toLocaleDateString("es-MX")}</p>
          </div>
          <div style="text-align:right">
            <p style="font-weight:700;color:var(--pink)">$${$.total||0}</p>
            <span class="badge ${$.status==="confirmado"||$.status==="pagado"?"badge-success":"badge-warning"}">${$.status}</span>
          </div>
        </div>`).join("")),setTimeout(()=>{const $={responsive:!0,plugins:{legend:{labels:{color:"#666",font:{size:11}}}},scales:{x:{ticks:{color:"#666",font:{size:11}},grid:{color:"rgba(0,0,0,0.05)"}},y:{ticks:{color:"#666",font:{size:11}},grid:{color:"rgba(0,0,0,0.05)"}}}},z=document.getElementById("chart-dias");z&&window.Chart&&new Chart(z,{type:"bar",data:{labels:b,datasets:[{data:b.map(F=>y[F]||0),backgroundColor:"rgba(233,30,140,0.2)",borderColor:"#E91E8C",borderWidth:2,borderRadius:6}]},options:{...$,plugins:{legend:{display:!1}}}});const j=document.getElementById("chart-canales");j&&window.Chart&&Object.keys(h).length>0&&new Chart(j,{type:"doughnut",data:{labels:Object.keys(h),datasets:[{data:Object.values(h),backgroundColor:["rgba(233,30,140,0.7)","rgba(0,151,178,0.7)","rgba(124,58,237,0.7)","rgba(46,125,50,0.7)"],borderColor:["#E91E8C","#0097b2","#7c3aed","#2e7d32"],borderWidth:2}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{color:"#666",font:{size:11},padding:12}}}}});const B=document.getElementById("chart-meses");if(B&&window.Chart){const F=Object.entries(C).slice(-6);new Chart(B,{type:"line",data:{labels:F.map(([q])=>q),datasets:[{data:F.map(([,q])=>q),borderColor:"#0097b2",backgroundColor:"rgba(0,151,178,0.08)",borderWidth:2,pointBackgroundColor:"#0097b2",pointRadius:4,fill:!0,tension:.4}]},options:{...$,plugins:{legend:{display:!1}}}})}const V=document.getElementById("chart-pagos");V&&window.Chart&&Object.keys(v).length>0&&new Chart(V,{type:"doughnut",data:{labels:Object.keys(v),datasets:[{data:Object.values(v),backgroundColor:["rgba(46,125,50,0.7)","rgba(245,127,23,0.7)","rgba(233,30,140,0.7)","rgba(124,58,237,0.7)"],borderColor:["#2e7d32","#f57f17","#E91E8C","#7c3aed"],borderWidth:2}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{color:"#666",font:{size:11},padding:12}}}}})},300);try{const z=await(await fetch(g+"/chatbot/tareas-hoy")).json(),j=document.createElement("div");j.style.cssText="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-top:1.5rem",j.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 style="font-size:1rem;font-weight:700;margin:0">✅ Tareas pendientes hoy</h3>
        <span style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${z.filter(B=>!B.completada).length} pendientes</span>
      </div>
      ${z.length===0?'<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:1rem">Sin tareas pendientes</p>':z.map(B=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5">
            <input type="checkbox" ${B.completada?"checked":""}
                   onchange="completarTareaDashboard('${B.id}', this.checked)"
                   style="width:16px;height:16px;cursor:pointer;accent-color:#25D366">
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600;margin:0;${B.completada?"text-decoration:line-through;color:#aaa":""}">${B.titulo}</p>
              <p style="font-size:0.72rem;color:#888;margin:0">${B.nombre_contacto||B.telefono} · ${B.agente||"Sin asignar"}</p>
            </div>
            <button onclick="navegarA('conversaciones');setTimeout(()=>abrirChat('${B.telefono}'),800)"
                    style="background:#e3f2fd;border:none;border-radius:6px;padding:4px 8px;font-size:0.72rem;color:#1565c0;cursor:pointer">Ver chat</button>
          </div>
        `).join("")}
    `,document.getElementById("dashboard-contenido").appendChild(j)}catch($){console.error("tareas:",$)}}catch(e){console.error("Error dashboard:",e)}}window.eliminarItemPedido=e=>{window._pedidoItems.splice(e,1),window.recalcularTotal(),window.renderItemsPedido()};window.cerrarSesionPanel=()=>{confirm("Cerrar sesion?")&&(sessionStorage.removeItem("erp_empleado"),window._empleadoActual=null,location.reload())};async function ne(){const e=document.getElementById("content");try{const o=await(await fetch(g+"/empleados/")).json();e.innerHTML=`
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
            ${o.map(n=>`
              <tr>
                <td><strong>${n.nombre}</strong></td>
                <td>${n.email}</td>
                <td><span class="badge ${n.rol==="admin"?"badge-info":"badge-success"}">${n.rol}</span></td>
                <td><span class="badge ${n.activo?"badge-success":"badge-danger"}">${n.activo?"Activo":"Inactivo"}</span></td>
                <td style="display:flex;gap:4px">
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormEmpleado('${n.id}')">Editar</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="toggleEmpleado('${n.id}',${n.activo})">${n.activo?"Desactivar":"Activar"}</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#E91E8C;border-color:#E91E8C" onclick="resetearPassword('${n.id}','${n.nombre}')">🔑 Reset</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.mostrarFormEmpleado=async e=>{const t=document.getElementById("content");let o={};if(e)try{o=(await(await fetch(g+"/empleados/")).json()).find(i=>i.id===e)||{}}catch{}t.innerHTML=`
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
    </div>`};window.guardarEmpleado=async e=>{const t=document.getElementById("emp-nombre").value,o=document.getElementById("emp-email").value,n=document.getElementById("emp-password").value,a=document.getElementById("emp-rol").value;if(!t||!o){alert("Nombre y email son obligatorios");return}if(!e&&!n){alert("La contrasena es obligatoria para nuevos empleados");return}try{const i=e?"PATCH":"POST",r=e?g+"/empleados/"+e:g+"/empleados/",s={nombre:t,email:o,rol:a};n&&(s.password=n);const d=await fetch(r,{method:i,headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(d.ok)alert("Empleado guardado correctamente"),navegarA("empleados");else{const l=await d.json();alert("Error: "+(l.error||"No se pudo guardar"))}}catch{alert("Error conectando con el servidor")}};window.toggleEmpleado=async(e,t)=>{if(confirm(t?"Desactivar este empleado?":"Activar este empleado?"))try{(await fetch(g+"/empleados/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({activo:!t})})).ok?ne():alert("Error al cambiar estado")}catch{alert("Error conectando con el servidor")}};window.resetearPassword=async(e,t)=>{const o=prompt("Nueva contrasena para "+t+":");if(o){if(o.length<4){alert("La contrasena debe tener al menos 4 caracteres");return}try{const n=await fetch(g+"/empleados/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:o})});if(n.ok)alert("Contrasena actualizada correctamente");else{const a=await n.json();alert("Error: "+(a.error||"No se pudo actualizar"))}}catch{alert("Error conectando con el servidor")}}};window.cargarConversaciones=async function(){var o;document.title="Zapatillas May";const e=document.querySelector('[data-modulo="conversaciones"]');e&&((o=e.querySelector(".nav-badge"))==null||o.remove());const t=document.getElementById("content");t.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const a=await(await fetch(g+"/chatbot/chats")).json(),r=await(await fetch(g+"/productos/?select=id,nombre,imagen_principal,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,corrida_activa,activo")).json();window._chatsData={},a.forEach(d=>window._chatsData[d.telefono]=d),window._productosWA=r.filter(d=>d.activo);const s=a.reduce((d,l)=>d+(l.no_leidos||0),0);t.innerHTML=`
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
          ${a.length===0?'<div style="padding:2rem;text-align:center;color:#999;font-size:0.85rem">Sin conversaciones</div>':a.sort((d,l)=>new Date(l.ultimo_mensaje)-new Date(d.ultimo_mensaje)).map(d=>{var l;return`
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
    `}catch(n){t.innerHTML='<p style="padding:2rem;color:red">Error: '+n.message+"</p>"}};window.mostrarTabWA=async e=>{const t=document.getElementById("tab-chats"),o=document.getElementById("tab-config");t&&t.classList.toggle("activo",e==="chats"),o&&o.classList.toggle("activo",e==="config"),e==="chats"?await window.cargarConversaciones():await mostrarConfigWA()};window.filtrarEtiqueta=e=>{document.querySelectorAll(".wa-pill").forEach(t=>t.classList.remove("activa")),event.target.classList.add("activa"),document.querySelectorAll(".wa-chat-item").forEach(t=>{const o=t.dataset.etiqueta||"";t.style.display=!e||o===e?"":"none"})};window.mostrarConfigWA=async()=>{const e=document.getElementById("content");try{const[t,o]=await Promise.all([fetch(g+"/chatbot/config").then(a=>a.json()),fetch(g+"/chatbot/respuestas-rapidas").then(a=>a.json())]),n=document.getElementById("wa-tab-content")||e;n.innerHTML=`
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
            ${o.map(a=>`
              <div style="border:1px solid #eee;border-radius:8px;padding:12px;margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <p style="font-weight:600;font-size:0.85rem">⚡ ${a.titulo}</p>
                  <div style="display:flex;gap:6px">
                    <button onclick="editarRespuesta('${a.id}','${a.titulo.replace(/'/g,"\\'")}','${a.mensaje.replace(/'/g,"\\'").replace(/\n/g,"\\n")}')" 
                            style="background:#f5f5f5;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer">✏️</button>
                    <button onclick="eliminarRespuesta('${a.id}')" 
                            style="background:#fce4ec;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer;color:#c62828">🗑️</button>
                  </div>
                </div>
                <p style="font-size:0.78rem;color:#888;line-height:1.5">${a.mensaje.substring(0,80)}${a.mensaje.length>80?"...":""}</p>
              </div>
            `).join("")}
          </div>
        </div>

      </div>
    `}catch(t){console.error(t)}};window.guardarConfigWA=async()=>{try{await fetch(g+"/chatbot/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje_bienvenida:document.getElementById("cfg-bienvenida").value,fuera_horario:document.getElementById("cfg-fuera").value,horario_inicio:document.getElementById("cfg-inicio").value,horario_fin:document.getElementById("cfg-fin").value,bot_activo:document.getElementById("cfg-bot").checked?"true":"false"})}),alert("Configuración guardada")}catch{alert("Error guardando")}};window.nuevaRespuestaRapida=()=>{const e=prompt("Título de la respuesta rápida:");if(!e)return;const t=prompt("Mensaje:");t&&fetch(g+"/chatbot/respuestas-rapidas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:e,mensaje:t,orden:99})}).then(()=>mostrarConfigWA())};window.editarRespuesta=(e,t,o)=>{const n=prompt("Título:",t);if(!n)return;const a=prompt("Mensaje:",o.replace(/\\n/g,`
`));a&&fetch(g+"/chatbot/respuestas-rapidas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:n,mensaje:a})}).then(()=>mostrarConfigWA())};window.eliminarRespuesta=e=>{confirm("¿Eliminar esta respuesta rápida?")&&fetch(g+"/chatbot/respuestas-rapidas/"+e,{method:"DELETE"}).then(()=>mostrarConfigWA())};window.filtrarChats=e=>{document.querySelectorAll(".wa-chat-item").forEach(t=>{const o=t.dataset.nombre||"",n=t.dataset.tel||"";t.style.display=!e||o.includes(e.toLowerCase())||n.includes(e)?"":"none"})};window.renderMensaje=(e,t,o)=>{if(e.tipo==="imagen_saliente"){const n=e.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`),a=n[0].trim(),i=n.slice(1).join(`
`).trim();if(a.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i))return'<img src="'+a+'" style="max-width:200px;border-radius:8px;display:block">'+(i?'<p style="font-size:0.82rem;color:#333;white-space:pre-wrap;margin-top:6px">'+i+"</p>":"")}return'<p style="font-size:0.85rem;color:#333;white-space:pre-wrap">'+e.mensaje.replace(/\[.+?\]:\s*/,"")+"</p>"};window.abrirChat=async e=>{const t=window._chatsData[e];if(!t)return;document.querySelectorAll(".wa-chat-item").forEach(i=>i.classList.remove("activo"));const o=document.querySelector(`[data-tel="${e}"]`);o&&o.classList.add("activo");const n=window.innerWidth<=900;if(n){const i=document.getElementById("wa-sidebar"),r=document.getElementById("wa-container");i&&(i.style.display="none"),r&&(r.style.gridTemplateColumns="1fr")}const a=document.getElementById("chat-area");a.style.display="flex",a.style.flexDirection="column",a.style.flex="1",a.style.minHeight="0",a.innerHTML=`
    <!-- Header compacto -->
    <div class="wa-chat-header">
      ${n?'<button onclick="volverChats()" class="wa-circ-btn">←</button>':""}
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
      ${[...t.mensajes].reverse().map(i=>{var p;const r=i.tipo==="manual"||i.tipo==="imagen_saliente",s=r?((p=i.mensaje.match(/\[(.+?)\]:/))==null?void 0:p[1])||"Admin":t.nombre||t.telefono,d=i.tipo==="imagen_saliente"?i.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/,"").split(`
`)[0].trim():"",l=i.tipo==="imagen_saliente"&&d.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)?'<img src="'+d+'" style="max-width:200px;border-radius:8px;display:block">':"<p>"+i.mensaje.replace(/\[.+?\]:\s*/,"")+"</p>",c=new Date(i.created_at).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});return`
    ${i.mensaje?`
      <div class="wa-msg-row ${r?"saliente":"entrante"}">
        <span class="wa-msg-sender">${r?"👤 "+s:s}</span>
        <div class="wa-bubble ${r?"saliente":"entrante"}">${l}<div class="wa-bubble-time">${c}</div></div>
      </div>`:""}
    ${i.respuesta?`
      <div class="wa-msg-row saliente">
        <span class="wa-msg-sender">🤖 Bot</span>
        <div class="wa-bubble bot">
          <p>${i.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi,"")}</p>
          ${i.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)?i.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi).map(m=>`<img src="${m}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${m}')">`).join(""):""}
          <div class="wa-bubble-time">${c}</div>
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
      <span id="wa-nt-arrow" style="font-size:0.7rem">${n?"▲":"▼"}</span>
    </button>
    <div id="notas-tareas-panel" class="${n?"nt-collapsed":""}">
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
  `,setTimeout(()=>{const i=document.getElementById("mensajes-area");i&&(i.scrollTop=i.scrollHeight)},800),fetch(g+"/chatbot/chats/"+e+"/leido",{method:"PATCH"}),window._chatActivo=e,cargarNotasTareas(e)};window.toggleNotasTareas=()=>{const e=document.getElementById("notas-tareas-panel"),t=document.getElementById("wa-nt-arrow");if(!e)return;const o=e.classList.toggle("nt-collapsed");t&&(t.textContent=o?"▲":"▼")};window.volverChats=()=>{const e=document.getElementById("wa-sidebar"),t=document.getElementById("wa-container");e&&(e.style.display=""),t&&(t.style.gridTemplateColumns=""),document.querySelectorAll(".wa-chat-item").forEach(n=>n.classList.remove("activo"));const o=document.getElementById("chat-area");o&&(o.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);flex-direction:column;gap:14px">
      <p style="font-size:3rem;line-height:1">💬</p>
      <p style="font-weight:700;color:var(--text-2);font-size:1rem">Selecciona una conversación</p>
      <p style="font-size:0.83rem">para ver los mensajes</p>
    </div>
  `)};window.mostrarRespuestasRapidas=async e=>{const o=await(await fetch(g+"/chatbot/respuestas-rapidas")).json(),n=document.createElement("div");n.id="modal-rapidas",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:1rem",n.innerHTML=`
    <div style="background:white;border-radius:16px 16px 0 0;width:100%;max-width:600px;max-height:60vh;overflow-y:auto;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700">⚡ Respuestas rápidas</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer">✕</button>
      </div>
      ${o.map(a=>`
        <div onclick="usarRespuestaRapida('${e}', \`${a.mensaje.replace(/`/g,"\\`")}\`)"
             style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer"
             onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">⚡ ${a.titulo}</p>
          <p style="font-size:0.78rem;color:#888">${a.mensaje}</p>
        </div>
      `).join("")}
    </div>
  `,document.body.appendChild(n),n.addEventListener("click",a=>{a.target===n&&n.remove()})};window.cargarNotasTareas=async e=>{var r;(r=window._empleadoActual)!=null&&r.nombre;const t=new Date().toISOString().split("T")[0],[o,n]=await Promise.all([fetch(g+"/chatbot/notas/"+e).then(s=>s.json()),fetch(g+"/chatbot/tareas/"+e).then(s=>s.json())]),a=document.getElementById("notas-lista-"+e);a&&(a.innerHTML=o.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin notas</p>':o.map(s=>`
        <div class="wa-nota">
          <p>${s.nota}</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small>${s.agente} · ${new Date(s.created_at).toLocaleDateString("es-MX")}</small>
            <button onclick="eliminarNota('${s.id}','${e}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
          </div>
        </div>
      `).join(""));const i=document.getElementById("tareas-lista-"+e);i&&(i.innerHTML=n.length===0?'<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin tareas</p>':n.map(s=>{const d=s.fecha_vence===t,l=s.fecha_vence&&s.fecha_vence<t&&!s.completada;return`
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
          `}).join(""))};window.agregarNota=async e=>{var n;const t=prompt("Escribe la nota:");if(!t)return;const o=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";await fetch(g+"/chatbot/notas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nota:t,agente:o})}),cargarNotasTareas(e)};window.eliminarNota=async(e,t)=>{confirm("¿Eliminar nota?")&&(await fetch(g+"/chatbot/notas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.agregarTarea=async e=>{var a;const t=prompt("Título de la tarea:");if(!t)return;const o=prompt("Fecha límite (YYYY-MM-DD) o déjala vacía:"),n=((a=window._empleadoActual)==null?void 0:a.nombre)||"Admin";await fetch(g+"/chatbot/tareas/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({titulo:t,fecha_vence:o||null,agente:n})}),cargarNotasTareas(e)};window.completarTarea=async(e,t,o)=>{await fetch(g+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})}),cargarNotasTareas(o)};window.eliminarTarea=async(e,t)=>{confirm("¿Eliminar tarea?")&&(await fetch(g+"/chatbot/tareas/"+e,{method:"DELETE"}),cargarNotasTareas(t))};window.usarRespuestaRapida=(e,t)=>{var n;(n=document.getElementById("modal-rapidas"))==null||n.remove();const o=document.getElementById("msg-input-"+e);o&&(o.value=t,o.focus(),enviarMensajeWA(e))};window.enviarMensajeWA=async e=>{var a,i;const t=document.getElementById("msg-input-"+e),o=(a=t==null?void 0:t.value)==null?void 0:a.trim();if(!o)return;t.value="";const n=((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin";try{await fetch(g+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:o,agente:n})});const s=await(await fetch(g+"/chatbot/chats")).json();window._chatsData={},s.forEach(d=>window._chatsData[d.telefono]=d),abrirChat(e)}catch{alert("Error enviando mensaje")}};window.cambiarEtiqueta=async(e,t)=>{try{await fetch(g+"/chatbot/chats/"+e+"/etiqueta",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({etiqueta:t})}),window._chatsData[e]&&(window._chatsData[e].etiqueta=t)}catch{alert("Error guardando etiqueta")}};window.toggleControl=async(e,t)=>{var n;const o=((n=window._empleadoActual)==null?void 0:n.nombre)||"Admin";try{(await(await fetch(g+"/chatbot/chats/"+e+"/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({en_control:t,agente:o})})).json()).ok&&(window._chatsData[e]&&(window._chatsData[e].en_control=t,window._chatsData[e].agente=o),abrirChat(e))}catch{alert("Error cambiando control")}};window.mostrarCatalogoWA=e=>{const t=window._productosWA||[],o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",o.innerHTML=`
    <div style="background:white;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700">👠 Selecciona un producto</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <input class="form-input" placeholder="Buscar producto..." style="margin:1rem;font-size:0.85rem" oninput="filtrarProductosWA(this.value)">
      <div id="productos-wa-lista" style="overflow-y:auto;padding:0 1rem 1rem">
        ${t.filter(n=>n.activo).map(n=>`
  <div onclick="enviarProductoWA('${e}', '${(n.imagen_principal||"").replace(/'/g,"")}', window._buildCaption('${n.id}'))"
       style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background 0.15s"
       onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
    ${n.imagen_principal?`<img src="${n.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:6px;background:#f5f5f5;flex-shrink:0">`:'<div style="width:52px;height:52px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
    <div style="flex:1">
      <p style="font-weight:600;font-size:0.88rem">${n.nombre}</p>
      <p style="font-size:0.75rem;color:#888">$${n.precio_menudeo} menudeo · $${n.precio_mayoreo3||n.precio_menudeo-30} mayoreo</p>
    </div>
    <span style="font-size:0.75rem;color:#25D366;font-weight:600">Enviar →</span>
  </div>
`).join("")}
      </div>
    </div>
  `,document.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&o.remove()})};window.filtrarProductosWA=e=>{document.querySelectorAll("#productos-wa-lista > div").forEach(t=>{t.style.display=!e||t.textContent.toLowerCase().includes(e.toLowerCase())?"":"none"})};window._buildCaption=e=>{const t=(window._productosWA||[]).find(o=>o.id===e);return t?"👠 *"+t.nombre+`*

💰 *Precios:*
• Menudeo (1-2 pares): $`+t.precio_menudeo+`
• Mayoreo 3-5 pares: $`+(t.precio_mayoreo3||t.precio_menudeo-30)+`
• Mayoreo 6+ pares: $`+(t.precio_mayoreo6||t.precio_menudeo-70)+`
• Corrida completa: $`+(t.precio_corrida||t.precio_menudeo-110)+`

🛍️ Ver y comprar: https://zapatillasmay.mx`:""};window.enviarProductoWA=async(e,t,o)=>{var i;console.log("imagenUrl:",t,"caption:",o);const n=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]');n&&n.remove(),console.log("enviando a:",e,t);const a=((i=window._empleadoActual)==null?void 0:i.nombre)||"Admin";try{if(t){const d=o.replace(/\\n/g,`
`);await fetch(g+"/chatbot/chats/"+e+"/imagen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imagen_url:t,caption:d,agente:a})})}else await fetch(g+"/chatbot/chats/"+e+"/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:o,agente:a})});await new Promise(d=>setTimeout(d,1500));const s=await(await fetch(g+"/chatbot/chats")).json();window._chatsData={},s.forEach(d=>window._chatsData[d.telefono]=d),abrirChat(e)}catch{alert("Error enviando producto")}};window.cargarEnviosMasivos=async function(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:#888">Cargando...</p>';try{const[t,o,n]=await Promise.all([fetch(g+"/chatbot/plantillas").then(r=>r.json()),fetch(g+"/clientes/").then(r=>r.json()),fetch(g+"/chatbot/chats").then(r=>r.json())]),a={};o.forEach(r=>{r.telefono&&(a[r.telefono]={telefono:r.telefono,nombre:r.nombre,fuente:"cliente"})}),n.forEach(r=>{a[r.telefono]||(a[r.telefono]={telefono:r.telefono,nombre:r.nombre||r.telefono,fuente:"whatsapp",etiqueta:r.etiqueta})});const i=Object.values(a);window._envioContactos=i,window._envioChats=n,window._envioClientes=o,e.innerHTML=`
      <div style="max-width:900px">
        <div style="margin-bottom:1.5rem">
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">📣 Envíos masivos</h2>
          <p style="color:#888;font-size:0.85rem">${i.length} contactos disponibles</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:1.5rem">⚙️ Configurar campaña</h3>
            <div style="margin-bottom:1rem">
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Plantilla</label>
              <select id="envio-plantilla" class="form-input">
                ${t.map(r=>`<option value="${r.name}">${r.name}</option>`).join("")}
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
              <span id="envio-count" style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${i.length}</span>
            </div>
            <div id="envio-lista" style="max-height:500px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">
              ${i.map(r=>`
                <div style="display:flex;align-items:center;gap:10px;padding:8px;background:#f9f9f9;border-radius:8px">
                  <div style="width:32px;height:32px;border-radius:50%;background:${r.fuente==="cliente"?"#e91e8c":"#25D366"};display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700;flex-shrink:0">
                    ${(r.nombre||"?").charAt(0).toUpperCase()}
                  </div>
                  <div style="flex:1;min-width:0">
                    <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.nombre}</p>
                    <p style="font-size:0.72rem;color:#888;margin:0">${r.telefono}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `,cargarProductosEnvio(),cargarProductosEnvioInteractivo()}catch(t){e.innerHTML='<p style="padding:2rem;color:red">Error: '+t.message+"</p>"}};window.filtrarAudienciaEnvio=()=>{const e=document.getElementById("envio-filtro").value,t=window._envioClientes||[],o=window._envioChats||[];let n=[];if(e==="todos"){const a={};t.forEach(i=>{i.telefono&&(a[i.telefono]={telefono:i.telefono,nombre:i.nombre,fuente:"cliente"})}),o.forEach(i=>{a[i.telefono]||(a[i.telefono]={telefono:i.telefono,nombre:i.nombre||i.telefono,fuente:"whatsapp"})}),n=Object.values(a)}else e==="clientes"?n=t.filter(a=>a.telefono).map(a=>({telefono:a.telefono,nombre:a.nombre,fuente:"cliente"})):e==="whatsapp"?n=o.map(a=>({telefono:a.telefono,nombre:a.nombre||a.telefono,fuente:"whatsapp"})):n=o.filter(a=>a.etiqueta===e).map(a=>({telefono:a.telefono,nombre:a.nombre||a.telefono,fuente:"whatsapp"}));window._envioContactos=n,document.getElementById("envio-count").textContent=n.length,document.getElementById("envio-lista").innerHTML=n.map(a=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px;background:#f9f9f9;border-radius:8px">
      <div style="width:32px;height:32px;border-radius:50%;background:${a.fuente==="cliente"?"#e91e8c":"#25D366"};display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700;flex-shrink:0">
        ${(a.nombre||"?").charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.nombre}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${a.telefono} · ${a.fuente==="cliente"?"🛍️ Cliente":"💬 WhatsApp"}</p>
      </div>
    </div>
  `).join("")};window.iniciarEnvioMasivo=async()=>{var a;const e=window._envioContactos||[];if(e.length===0){alert("No hay contactos seleccionados");return}const t=document.getElementById("envio-plantilla").value,o=document.getElementById("envio-imagen").value;if(!confirm(`¿Enviar "${t}" a ${e.length} contactos?`))return;const n=document.getElementById("btn-enviar-masivo");n.textContent="Enviando...",n.disabled=!0;try{const r=await(await fetch(g+"/chatbot/envio-masivo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plantilla:t,imagen_url:o,contactos:e})})).json(),s=document.getElementById("envio-resultado");s.style.display="block",s.style.background=r.fallidos>0?"#fff8e1":"#e8f5e9",s.innerHTML=`
      <p style="font-weight:700;margin-bottom:4px">${r.fallidos>0?"⚠️":"✅"} Campaña enviada</p>
      <p style="margin:0">Enviados: <strong>${r.enviados}</strong> · Fallidos: <strong>${r.fallidos}</strong></p>
      ${((a=r.errores)==null?void 0:a.length)>0?`<p style="font-size:0.72rem;color:#888;margin-top:4px">${r.errores.slice(0,3).join(", ")}</p>`:""}
    `}catch(i){alert("Error: "+i.message)}finally{n.textContent="📣 Enviar campaña",n.disabled=!1}};window.cargarProductosEnvioInteractivo=async()=>{const e=document.getElementById("envio-prod-grid");if(!e||window._envioProdInteractivoCargado){window._envioProdInteractivo&&renderizarEnvioProdGrid(window._envioProdInteractivo);return}try{const o=await(await fetch(g+"/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300")).json();window._envioProdInteractivo=o,window._envioProdSeleccionados=new Set,window._envioProdInteractivoCargado=!0,renderizarEnvioProdGrid(o)}catch{e&&(e.innerHTML='<p style="color:red;font-size:0.8rem;padding:4px">Error cargando productos</p>')}};window.renderizarEnvioProdGrid=e=>{const t=document.getElementById("envio-prod-grid");if(!t)return;const o=window._envioProdSeleccionados||new Set;if(!e.length){t.innerHTML='<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin productos</p>';return}t.innerHTML=e.map(n=>{const a=n.sku_interno||n.id,i=o.has(a);return`<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;cursor:pointer;border:1px solid ${i?"#E91E8C":"#f0f0f0"};background:${i?"#fff0f8":"white"}" id="envio-prod-lbl-${a}">
      <input type="checkbox" ${i?"checked":""} onchange="toggleEnvioProd('${a}',this)" style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${n.imagen_principal?`<img src="${n.imagen_principal}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;flex-shrink:0">`:'<div style="width:28px;height:28px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0">${n.nombre||a}</p>
        <p style="font-size:0.65rem;color:#aaa;margin:0">${a}</p>
      </div>
    </label>`}).join(""),actualizarCountEnvioProd()};window.toggleEnvioProd=(e,t)=>{window._envioProdSeleccionados||(window._envioProdSeleccionados=new Set);const o=document.getElementById("envio-prod-lbl-"+e);if(t.checked){if(window._envioProdSeleccionados.size>=30){t.checked=!1,alert("Máximo 30 productos");return}window._envioProdSeleccionados.add(e),o&&(o.style.borderColor="#E91E8C",o.style.background="#fff0f8")}else window._envioProdSeleccionados.delete(e),o&&(o.style.borderColor="#f0f0f0",o.style.background="white");actualizarCountEnvioProd()};window.actualizarCountEnvioProd=()=>{var o;const e=document.getElementById("envio-prod-count");if(!e)return;const t=((o=window._envioProdSeleccionados)==null?void 0:o.size)||0;e.textContent=t>0?`${t}/30 producto${t>1?"s":""} seleccionado${t>1?"s":""}`:""};window.filtrarProductosEnvioInteractivo=e=>{const t=(e||"").toLowerCase().trim(),o=window._envioProdInteractivo||[];renderizarEnvioProdGrid(t?o.filter(n=>(n.nombre||"").toLowerCase().includes(t)||(n.sku_interno||"").toLowerCase().includes(t)):o)};window.iniciarEnvioInteractivo=async()=>{var n;const e=window._envioContactos||[],t=Array.from(window._envioProdSeleccionados||new Set);if(!t.length){alert("Selecciona al menos un producto");return}if(!e.length){alert("No hay contactos en la audiencia");return}if(!confirm(`¿Enviar catálogo interactivo con ${t.length} producto${t.length>1?"s":""} a ${e.length} contacto${e.length>1?"s":""}?`))return;const o=document.createElement("div");o.id="envio-interactivo-overlay",o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem",o.innerHTML=`<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${e.length} contacto${e.length>1?"s":""} · ${t.length} producto${t.length>1?"s":""}</p>
  </div>`,document.body.appendChild(o);try{const i=await(await fetch(g+"/chatbot/envio-productos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contactos:e.map(r=>({telefono:r.telefono,nombre:r.nombre})),skus:t,titulo:"Nuestros modelos 👠",cuerpo:"Mira los modelos disponibles. ¡Elige el tuyo!",pie:"Zapatillas May · León, Gto."})})).json();if(i.error){o.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error al enviar</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${i.error}</p>
        <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
          style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`;return}o.innerHTML=`<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${i.fallidos?"✅":"🎉"}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${i.enviados||0} enviados</p>
      ${i.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${i.fallidos} fallidos</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${(n=i.errores)!=null&&n.length?`<p style="font-size:0.72rem;color:#aaa;margin-bottom:1rem">${i.errores[0]}</p>`:""}
      <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`}catch(a){o.remove(),alert("Error: "+a.message)}};window.seleccionarImagenProductoEnvio=()=>{var s,d;const e=document.getElementById("envio-producto-sel"),t=document.getElementById("envio-imagen"),o=document.getElementById("envio-producto-preview"),n=document.getElementById("envio-producto-img"),a=document.getElementById("envio-producto-nombre");if(!e)return;const i=e.value,r=((d=(s=e.options[e.selectedIndex])==null?void 0:s.dataset)==null?void 0:d.nombre)||"";i?(t&&(t.value=i),o&&(o.style.display="flex"),n&&(n.src=i),a&&(a.textContent=r)):(t&&(t.value=""),o&&(o.style.display="none"))};window.limpiarSelProductoEnvio=()=>{const e=document.getElementById("envio-producto-sel"),t=document.getElementById("envio-producto-preview");e&&(e.value=""),t&&(t.style.display="none")};window.cargarProductosEnvio=async()=>{try{const t=await(await fetch(g+"/productos/")).json(),o=document.getElementById("envio-producto-sel");if(!o)return;const n=t.filter(a=>a.activo&&a.imagen_principal);o.innerHTML='<option value="">Seleccionar producto...</option>'+n.map(a=>`<option value="${a.imagen_principal}" data-nombre="${a.nombre}">${a.nombre}</option>`).join("")}catch(e){console.error("Error:",e)}};window.sincronizarColeccionesMeta=async()=>{const e=document.getElementById("btn-sync-colecciones"),t=document.getElementById("seo-colecciones-resultado");e&&(e.textContent="Sincronizando...",e.disabled=!0);try{const n=await(await fetch(g+"/catalogo/sincronizar-colecciones",{method:"POST"})).json();if(n.error)t.style.display="block",t.style.background="#ffebee",t.style.borderColor="#ef9a9a",t.innerHTML=`❌ Error: ${n.error}`;else{const a=n.resultados.filter(s=>s.accion==="creada").length,i=n.resultados.filter(s=>s.accion==="actualizada").length,r=n.resultados.filter(s=>s.accion==="error");t.style.display="block",t.style.background=r.length?"#fff8e1":"#e8f5e9",t.style.border=`1px solid ${r.length?"#ffe082":"#a5d6a7"}`,t.innerHTML=`
        ✅ <strong>${a} colecciones creadas</strong> · ${i} actualizadas
        ${r.length?`<br>⚠️ ${r.length} errores: ${r.map(s=>s.categoria+" ("+s.detalle+")").join(", ")}`:""}
        <br><small style="color:#888;margin-top:4px;display:block">${n.resultados.map(s=>`${s.categoria}: ${s.accion}`).join(" · ")}</small>
      `}}catch(o){t&&(t.style.display="block",t.style.background="#ffebee",t.innerHTML="❌ Error: "+o.message)}finally{e&&(e.textContent="🗂️ Sincronizar colecciones en Meta",e.disabled=!1)}};window.validarCantidadTalla=(e,t)=>{const o=document.getElementById("qty-"+e);if(!o)return;let n=parseInt(o.value)||0;n<0&&(n=0),n>t&&(n=t),o.value=n,o.style.borderColor=n>0?"#E91E8C":"#ddd"};window.recargarFinanzas=async e=>{await D()};window.verOportunidad=async e=>{var o;if(window._crmData)try{const a=await(await fetch(g+"/crm/oportunidades/"+e)).json(),i=Array.isArray(a)?a[0]:a;if(!i)return;const r={contacto:"📞 Contacto",interes:"👀 Interés",cotizacion:"📋 Cotización",negociacion:"🤝 Negociación",ganado:"✅ Ganado",perdido:"❌ Perdido"},s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem",s.innerHTML=`
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
    `,document.body.appendChild(s),s.addEventListener("click",d=>{d.target===s&&s.remove()})}catch(n){console.error("Error verOportunidad",n)}};window.actualizarEtapaOportunidad=async(e,t)=>{var o;try{await fetch(g+"/crm/oportunidades/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({etapa:t})}),(o=document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]'))==null||o.remove(),mostrarPipeline()}catch{alert("Error actualizando etapa")}};window.completarTareaDashboard=async(e,t)=>{try{await fetch(g+"/chatbot/tareas/"+e,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completada:t})})}catch(o){console.error(o)}};async function ve(){const e=document.getElementById("content");e.innerHTML='<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>';try{const o=await(await fetch(g+"/seo/config")).json(),n={};o.forEach(a=>n[a.clave]=a.valor||""),e.innerHTML=`
      <div style="max-width:800px">
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1rem">🗂️ Colecciones WhatsApp</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Crea automáticamente las colecciones por categoría en el catálogo de Meta (Tacones, Sandalias, Botas, etc.) para que los clientes puedan navegar desde WhatsApp.</p>
          <div id="seo-colecciones-resultado" style="display:none;margin-bottom:1rem;padding:1rem;border-radius:8px;font-size:0.82rem"></div>
          <button onclick="sincronizarColeccionesMeta()" class="btn btn-primary" id="btn-sync-colecciones">🗂️ Sincronizar colecciones en Meta</button>
        </div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">SEO General</h3>
          <div style="display:grid;gap:1rem">
            <div>
              <label class="form-label">Meta titulo (home)</label>
              <input class="form-input" id="seo-titulo" value="${n.meta_titulo_home}" placeholder="Zapatillas May | Calzado de Moda...">
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 50-60 caracteres. Actual: <span id="seo-titulo-count">${n.meta_titulo_home.length}</span></p>
            </div>
            <div>
              <label class="form-label">Meta descripcion (home)</label>
              <textarea class="form-input" id="seo-desc" rows="3" placeholder="Descripcion para Google...">${n.meta_descripcion_home}</textarea>
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 150-160 caracteres. Actual: <span id="seo-desc-count">${n.meta_descripcion_home.length}</span></p>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Analiticas y Pixels</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Google Analytics ID</label>
              <input class="form-input" id="seo-ga" value="${n.google_analytics_id}" placeholder="G-XXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Facebook Pixel ID</label>
              <input class="form-input" id="seo-fb" value="${n.facebook_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Search Console (verification)</label>
              <input class="form-input" id="seo-gsc" value="${n.google_search_console||""}" placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Tag Manager ID</label>
              <input class="form-input" id="seo-gtm" value="${n.google_tag_manager||""}" placeholder="GTM-XXXXXXX">
            </div>
            <div>
              <label class="form-label">TikTok Pixel ID</label>
              <input class="form-input" id="seo-tt" value="${n.tiktok_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">WhatsApp flotante</label>
              <input class="form-input" id="seo-wa" value="${n.whatsapp_flotante}" placeholder="524771234567">
            </div>
          </div>
        </div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
  <h3 style="margin-bottom:1.5rem">Imagen Hero (portada)</h3>
  <div style="display:grid;gap:1rem">
    <div>
      <label class="form-label">URL de imagen de fondo</label>
      <input class="form-input" id="seo-hero-img" value="${(n.hero_imagen||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
      <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Pega la URL de Cloudinary de la imagen que quieres como fondo de la portada</p>
    </div>
    ${(n.hero_imagen||"")!==""?'<img src="'+(n.hero_imagen||"")+'" style="max-height:160px;object-fit:cover;border-radius:8px;border:1px solid #eee">':""}
  </div>
</div>
<div>
  <label class="form-label">URL Favicon</label>
  <input class="form-input" id="seo-favicon" value="${(n.favicon_url||"").replace(/"/g,"")}" placeholder="https://res.cloudinary.com/...">
  <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Icono que aparece en la pestaña del navegador (recomendado 32x32px)</p>
</div>
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Redes Sociales</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Instagram URL</label>
              <input class="form-input" id="seo-ig" value="${n.instagram_url}" placeholder="https://instagram.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">Facebook URL</label>
              <input class="form-input" id="seo-fb-url" value="${n.facebook_url}" placeholder="https://facebook.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">TikTok URL</label>
              <input class="form-input" id="seo-tt-url" value="${n.tiktok_url}" placeholder="https://tiktok.com/@zapatillasmay">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Horarios</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Lunes</label>
              <input class="form-input" id="seo-hor-lunes" value="${n.horario_lunes||"10:00 - 15:00"}" placeholder="10:00 - 15:00">
            </div>
            <div>
              <label class="form-label">Martes a Viernes</label>
              <input class="form-input" id="seo-hor1" value="${n.horario_semana}" placeholder="10:00 - 19:00">
            </div>
            <div>
              <label class="form-label">Sabado</label>
              <input class="form-input" id="seo-hor2" value="${n.horario_sabado}" placeholder="10:00 - 15:00">
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
    `,document.getElementById("seo-titulo").addEventListener("input",function(){document.getElementById("seo-titulo-count").textContent=this.value.length}),document.getElementById("seo-desc").addEventListener("input",function(){document.getElementById("seo-desc-count").textContent=this.value.length})}catch{e.innerHTML='<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'}}window.guardarSEO=async()=>{const e={favicon_url:document.getElementById("seo-favicon").value,hero_imagen:document.getElementById("seo-hero-img").value,meta_titulo_home:document.getElementById("seo-titulo").value,meta_descripcion_home:document.getElementById("seo-desc").value,google_analytics_id:document.getElementById("seo-ga").value,google_search_console:document.getElementById("seo-gsc").value,google_tag_manager:document.getElementById("seo-gtm").value,facebook_pixel_id:document.getElementById("seo-fb").value,tiktok_pixel_id:document.getElementById("seo-tt").value,whatsapp_flotante:document.getElementById("seo-wa").value,instagram_url:document.getElementById("seo-ig").value,facebook_url:document.getElementById("seo-fb-url").value,tiktok_url:document.getElementById("seo-tt-url").value,horario_lunes:document.getElementById("seo-hor-lunes").value,horario_semana:document.getElementById("seo-hor1").value,horario_sabado:document.getElementById("seo-hor2").value};try{(await fetch(g+"/seo/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?alert("Configuracion SEO guardada correctamente"):alert("Error al guardar")}catch{alert("Error conectando con el servidor")}};document.querySelector("#app").style.cssText="display:flex;min-height:100vh;width:100%";const ie="erp_empleado";function G(){document.querySelector("#app").innerHTML=`
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
  `,window.hacerLogin=async()=>{const t=document.getElementById("login-email").value,o=document.getElementById("login-password").value,n=document.getElementById("btn-login");if(document.getElementById("login-error"),!t||!o){e("Por favor completa todos los campos");return}n.textContent="Verificando...",n.disabled=!0;try{const a=await fetch("/api/empleados/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})}),i=await a.json();a.ok?(sessionStorage.setItem(ie,JSON.stringify(i)),window._empleadoActual=i,W()):(e(i.error||"Email o contrasena incorrectos"),n.textContent="Iniciar sesion",n.disabled=!1)}catch{e("Error conectando con el servidor"),n.textContent="Iniciar sesion",n.disabled=!1}};function e(t){const o=document.getElementById("login-error");o&&(o.textContent=t,o.style.display="block")}}const X=sessionStorage.getItem(ie);if(X)try{window._empleadoActual=JSON.parse(X),W()}catch{G()}else G();
