(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();const _="/api",ge="portal_sesion",Me="portal_carrito",le=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],de=document.getElementById("app"),s={sesion:null,data:null,carrito:[],tab:localStorage.getItem("pc_active_tab")||"tienda",filtroCat:"",busqueda:"",modoCompartir:!1,compartirSeleccion:[]},O=e=>parseFloat(e)||0,k=e=>"$"+Math.round(e).toLocaleString("es-MX"),f=e=>String(e??"").replace(/"/g,"&quot;").replace(/</g,"&lt;"),xe=e=>{try{const t=new URL(String(e??""),window.location.origin);return t.protocol==="http:"||t.protocol==="https:"?t.href:""}catch{return""}};function A(){var t;const e=(t=s.sesion)==null?void 0:t.token;return e?{"Content-Type":"application/json",Authorization:"Bearer "+e}:{"Content-Type":"application/json"}}function ye(e){return e&&e.status===401?(Te(),!0):!1}function Be(){var e;try{s.sesion=JSON.parse(localStorage.getItem(ge)||"null")}catch{s.sesion=null}try{s.carrito=JSON.parse(localStorage.getItem(Me)||"[]")}catch{s.carrito=[]}(e=s.sesion)!=null&&e.cliente_id?Le():ie()}let te="telefono",V="pedir",Q={};function ie(){const e=te==="telefono",t=V==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${f(Q.canal||(e?"WhatsApp":"correo"))}</b> a <b>${f(Q.destino||"")}</b>
      ${Q.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
    </p>
    <div class="field">
      <label>Código</label>
      <input id="l-codigo" type="text" inputmode="numeric" maxlength="6" placeholder="6 dígitos" autocomplete="one-time-code">
    </div>
    <button class="btn-primary" id="l-verify">Entrar</button>
    <p style="text-align:center;margin-top:12px;font-size:.78rem">
      <a href="#" id="l-resend" style="color:#c8a8de">Reenviar código</a>
      &nbsp;·&nbsp;
      <a href="#" id="l-back" style="color:#c8a8de">Cambiar ${e?"teléfono":"correo"}</a>
    </p>`:`
    <div class="field">
      <label>${e?"Teléfono":"Correo"}</label>
      <input id="l-dato" type="${e?"tel":"email"}" inputmode="${e?"numeric":"email"}" placeholder="${e?"10 dígitos":"tu@correo.com"}" autocomplete="${e?"tel":"email"}">
    </div>
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(de.innerHTML=`
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${V==="pedir"?`
        <div class="login-tabs">
          <button class="${e?"on":""}" onclick="window.__loginMetodo('telefono')">📱 Teléfono</button>
          <button class="${e?"":"on"}" onclick="window.__loginMetodo('correo')">✉️ Correo</button>
        </div>`:""}

        ${t}

        <div class="or-sep"><span>o</span></div>
        <div id="g-login-btn" style="display:flex;justify-content:center;min-height:44px"></div>

        <p class="login-error" id="l-err"></p>
        <p style="text-align:center;margin-top:18px">
          <a href="#" id="l-demo" style="color:#c8a8de;font-size:.8rem;text-decoration:underline">Ver demo con datos reales (solo revisión)</a>
        </p>
      </div>
    </div>`,V==="pedir"){const i=document.getElementById("l-send");i&&(i.onclick=me);const o=document.getElementById("l-dato");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&me()})}else{const i=document.getElementById("l-verify");i&&(i.onclick=$e);const o=document.getElementById("l-codigo");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&$e()}),document.getElementById("l-resend").onclick=r=>{r.preventDefault(),me()},document.getElementById("l-back").onclick=r=>{r.preventDefault(),V="pedir",ie()}}document.getElementById("l-demo").onclick=i=>{i.preventDefault(),He()},Oe()}window.__loginMetodo=e=>{te=e,V="pedir",ie()};async function Oe(){var e;try{window._seoConfig||(window._seoConfig=await fetch(_+"/seo/config").then(o=>o.json()).catch(()=>({})));const t=(e=window._seoConfig)==null?void 0:e.google_client_id;if(!t||(await De(),typeof google>"u"))return;google.accounts.id.initialize({client_id:t,callback:Ne,auto_select:!1});const i=document.getElementById("g-login-btn");i&&google.accounts.id.renderButton(i,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function De(){return new Promise(e=>{var i,o;if((o=(i=window.google)==null?void 0:i.accounts)!=null&&o.id)return e();const t=document.createElement("script");t.src="https://accounts.google.com/gsi/client",t.async=!0,t.defer=!0,t.onload=e,t.onerror=e,document.head.appendChild(t)})}async function Ne(e){const t=e==null?void 0:e.credential;if(!t)return T("Error al conectar con Google");try{const i=await fetch(_+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:t})}),o=await i.json();if(!i.ok||!o.token)return T(o.error||"No se pudo entrar con Google");ve(o)}catch{T("Error conectando con Google")}}function T(e){const t=document.getElementById("l-err");t&&(t.textContent=e,t.style.display="block")}function ve(e){s.sesion={nombre:e.cliente.nombre,cliente_id:e.cliente.id,tipo:e.cliente.tipo,token:e.token,demo:!!e.demo},localStorage.setItem(ge,JSON.stringify(s.sesion)),Le()}async function me(){T("");const e=(document.getElementById("l-dato").value||"").trim();if(!e)return T(te==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const t=document.getElementById("l-send");t.disabled=!0,t.textContent="Enviando...";try{const i=await fetch(_+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:te,valor:e})}),o=await i.json();if(!i.ok){T(o.error||"No se pudo enviar el código"),t.disabled=!1,t.textContent="Enviarme un código";return}Q={valor:e,destino:o.destino,canal:o.canal,enviado:o.enviado},V="codigo",ie()}catch{T("Error conectando con el servidor"),t.disabled=!1,t.textContent="Enviarme un código"}}async function $e(){T("");const e=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(e.length<4)return T("Escribe el código que te enviamos");const t=document.getElementById("l-verify");t.disabled=!0,t.textContent="Entrando...";try{const i=await fetch(_+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:te,valor:Q.valor,codigo:e})}),o=await i.json();if(!i.ok||!o.token){T(o.error||"Código incorrecto"),t.disabled=!1,t.textContent="Entrar";return}ve(o)}catch{T("Error conectando con el servidor"),t.disabled=!1,t.textContent="Entrar"}}async function He(){T("");try{const e=await fetch(_+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),t=await e.json();if(!e.ok||!t.token)return T(t.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":t.error||"No se pudo cargar el demo");ve(t)}catch{T("Error cargando demo")}}function Te(){localStorage.removeItem(ge),s.sesion=null,ie()}async function Le(){de.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[e,t,i,o]=await Promise.all([fetch(_+"/productos/").then(n=>n.json()),fetch(_+"/variantes/").then(n=>n.json()),fetch(_+"/inventario/").then(n=>n.json()).catch(()=>[]),fetch(_+"/portal/pedidos",{headers:A()}).then(n=>n.ok?n.json():[]).catch(()=>[])]),r={};(Array.isArray(i)?i:[]).forEach(n=>{r[n.variante_id]=(r[n.variante_id]||0)+(n.cantidad||0)}),s.data={productos:(Array.isArray(e)?e:[]).filter(n=>n.activo&&!/^oferta/i.test(n.nombre||"")&&!/^oferta/i.test(n.sku_interno||"")).map(n=>Re(n)),variantes:Array.isArray(t)?t:[],stockPorVar:r};try{await Ke(o)}catch{}qe();try{const n=localStorage.getItem("pc_active_product_id");n&&je(n)}catch{}}catch{de.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function Re(e){const t=O(e.precio_menudeo);return{...e,precio_menudeo:t,precio_mayoreo3:O(e.precio_mayoreo3)||t-30,precio_mayoreo6:O(e.precio_mayoreo6)||t-70,precio_corrida:O(e.precio_corrida)||t-100}}function qe(){de.innerHTML=`
    <div class="shell">
      <div class="topbar">
        <div onclick="window.__nav('inicio')" style="cursor:pointer">
          <div class="title">Zapatillas <span>May</span></div>
          <div class="sub" id="tb-sub"></div>
        </div>
        <button class="tb-cuenta" onclick="window.__nav('cuenta')" title="Mi cuenta">👤</button>
      </div>
      <div class="page" id="page"></div>
    </div>
    ${q()}
    <div id="toast" class="toast"></div>`,J(s.tab||"tienda")}function q(){const e=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],t=oe();return`<div class="bottomnav">${e.map(i=>`
    <button data-tab="${i.id}" class="${s.tab===i.id?"active":""}" onclick="window.__nav('${i.id}')">
      <span class="ic">${i.ic}${i.id==="carrito"&&t?`<span class="badge">${t}</span>`:""}</span>
      <span>${i.label}</span>
    </button>`).join("")}</div>`}window.__nav=J;function J(e,t){var r;if(!t&&s.tab&&s.tab!==e&&window._zmPushBack){const n=s.tab;window._zmPushBack(()=>J(n,!0))}s.tab=e;try{localStorage.setItem("pc_active_tab",e)}catch{}const i=document.querySelector(".bottomnav");i&&(i.outerHTML=q());const o=document.getElementById("tb-sub");o&&(o.textContent=(r=s.sesion)!=null&&r.nombre?`Hola, ${s.sesion.nombre.split(" ")[0]}`:""),e==="carrito"?Ve():_e(),e==="inicio"?Fe():e==="tienda"?W():e==="catalogos"?it():e==="carrito"?Z():e==="pedidos"?et():e==="maya"?at():e==="cuenta"&&ot()}const B=()=>document.getElementById("page");async function Fe(){var i,o;const e=oe(),t=he();B().innerHTML=`
    ${(i=s.sesion)!=null&&i.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${f(s.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${e?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${k(t)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${e} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`:`<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${f(((o=s.sesion)==null?void 0:o.tipo)||"mayoreo")}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`}function W(){const e=[...new Set(s.data.productos.map(t=>t.categoria).filter(Boolean))];B().innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;width:100%">
      <h2 style="font-size:1.3rem;font-weight:800;margin:0;color:inherit">Productos</h2>
      <button onclick="pcToggleModoCompartir()" style="padding:6px 12px;border-radius:100px;border:1px solid ${s.modoCompartir?"#25D366":"#d1d5db"};background:${s.modoCompartir?"#25D366":"#f3f4f6"};color:${s.modoCompartir?"white":"#374151"};font-weight:700;font-size:0.75rem;cursor:pointer;display:flex;align-items:center;gap:4px">📲 ${s.modoCompartir?"Listo":"Compartir fotos (sin precios)"}</button>
    </div>
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${f(s.busqueda)}">
    <div class="chips" style="margin-bottom:12px;display:flex;align-items:center;flex-wrap:wrap;gap:6px">
      <button class="${s.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${e.map(t=>`<button class="${s.filtroCat===t?"active":""}" onclick="window.__filtro('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>
    
    ${s.modoCompartir?s.compartirSeleccion.length===0?"":`
        <div id="pc-bulk-share-bar" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:900;background:white;border:2px solid #25D366;border-radius:18px;padding:12px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);width:90%;max-width:500px;color:#1f2937">
          <div style="flex:1;line-height:1.2">
            <p style="margin:0;font-size:0.75rem;color:#6b7280;font-weight:600">Compartir fotos</p>
            <p style="margin:0;font-size:1rem;font-weight:800;color:#111827">${s.compartirSeleccion.length} seleccionados</p>
            <p style="margin:2px 0 0;font-size:0.58rem;color:#10b981;font-weight:600">⚠️ Solo fotos de portada (sin precios)</p>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="pcCompartirVariosWhatsApp()" id="pc-bulk-share-btn" style="padding:10px 14px;font-size:0.8rem;background:#25D366;color:white;border:none;border-radius:8px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer">💬 Compartir</button>
            <button onclick="pcCancelarSeleccionCompartir()" style="padding:10px 14px;font-size:0.8rem;background:#f3f4f6;color:#4b5563;border:1px solid #d1d5db;border-radius:8px;font-weight:600;cursor:pointer">Cancelar</button>
          </div>
        </div>`:""}`,document.getElementById("cat-search").addEventListener("input",t=>{s.busqueda=t.target.value,ke()}),ke()}window.__filtro=e=>{s.filtroCat=e,W()};function ke(){const e=s.busqueda.trim().toLowerCase();let t=s.data.productos;s.filtroCat&&(t=t.filter(o=>o.categoria===s.filtroCat)),e&&(t=t.filter(o=>(o.nombre||"").toLowerCase().includes(e)||(o.sku_interno||"").toLowerCase().includes(e)));const i=document.getElementById("cat-grid");if(i){if(!t.length){i.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}i.innerHTML=t.slice(0,120).map(o=>{const r=s.modoCompartir&&s.compartirSeleccion.some(d=>d.startsWith(o.id+"::")),n=s.modoCompartir?`pcToggleSeleccionCompartir('${o.id}')`:`window.__abrir('${o.id}')`,a=s.data.variantes.filter(d=>d.producto_id===o.id),c={};a.forEach(d=>{d.color&&(c[d.color]=d.color_hex||"#888")});const l=Object.entries(c);return`
      <div class="card" onclick="${n}" style="position:relative;${r?"border: 2px solid #25D366; box-shadow: 0 0 0 1px #25D366;":""}">
        ${o.imagen_principal?`<img class="thumb" src="${o.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
        
        ${s.modoCompartir?`
          <div style="position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:50%;background:${r?"#25D366":"rgba(0,0,0,0.5)"};border:2px solid white;display:flex;align-items:center;justify-content:center;z-index:10;color:white;font-weight:bold;font-size:0.8rem;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
            ${r?"✓":""}
          </div>
        `:""}
        
        <div class="body">
          <div class="name">${f(o.nombre)}</div>
          <div class="sku">${f(o.sku_interno||"")}</div>
          
          ${s.modoCompartir&&l.length>0?`
            <div style="display:flex;gap:5px;margin:8px 0;flex-wrap:wrap" onclick="event.stopPropagation()">
              ${l.map(([d,v])=>{const u=s.compartirSeleccion.includes(o.id+"::"+d);return`
                  <div title="${f(d)}" onclick="event.stopPropagation();pcToggleSeleccionColorCompartir('${o.id}','${f(d)}')"
                    style="width:20px;height:20px;border-radius:50%;background:${v};border:2px solid ${u?"#25D366":"#d1d5db"};cursor:pointer;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;transition:border-color 0.15s">
                    ${u?'<span style="color:#25D366;font-size:0.62rem;font-weight:900">✓</span>':""}
                  </div>`}).join("")}
            </div>
          `:`
            <div class="price">${k(o.precio_menudeo)} <small>x par</small></div>
            <div class="tier-row">
              <span class="tier">3+ ${k(o.precio_mayoreo3)}</span>
              <span class="tier">6+ ${k(o.precio_mayoreo6)}</span>
              ${Ue(o.id)?`<span class="tier corr">Corr ${k(o.precio_corrida)}</span>`:""}
            </div>
          `}
        </div>
      </div>`}).join("")}}window.pcToggleModoCompartir=()=>{s.modoCompartir=!s.modoCompartir,s.modoCompartir||(s.compartirSeleccion=[]),W()};window.pcToggleSeleccionCompartir=e=>{if(!s.data.productos.find(r=>r.id===e))return;const i=s.data.variantes.filter(r=>r.producto_id===e),o=[...new Set(i.map(r=>r.color).filter(Boolean))];if(o.length>0)o.some(n=>s.compartirSeleccion.includes(`${e}::${n}`))?o.forEach(n=>{const a=s.compartirSeleccion.indexOf(`${e}::${n}`);a>-1&&s.compartirSeleccion.splice(a,1)}):o.forEach(n=>{const a=`${e}::${n}`;s.compartirSeleccion.includes(a)||s.compartirSeleccion.push(a)});else{const r=`${e}::default`,n=s.compartirSeleccion.indexOf(r);n>-1?s.compartirSeleccion.splice(n,1):s.compartirSeleccion.push(r)}W()};window.pcToggleSeleccionColorCompartir=(e,t)=>{const i=`${e}::${t}`,o=s.compartirSeleccion.indexOf(i);o>-1?s.compartirSeleccion.splice(o,1):s.compartirSeleccion.push(i),W()};window.pcCancelarSeleccionCompartir=()=>{s.modoCompartir=!1,s.compartirSeleccion=[],W()};window.pcCompartirVariosWhatsApp=async()=>{var i;const e=document.getElementById("pc-bulk-share-btn");if(!e)return;const t=e.innerHTML;e.innerHTML="⏳ Procesando...",e.disabled=!0;try{if(!s.compartirSeleccion.length){alert("Selecciona al menos un producto.");return}const o=[],r=[];for(const a of s.compartirSeleccion){const[c,l]=a.split("::"),d=s.data.productos.find(b=>b.id===c);if(!d)continue;const v=s.data.variantes.filter(b=>b.producto_id===c);let u=d.imagen_principal||((i=v[0])==null?void 0:i.foto_url);if(l!=="default"){const b=v.find(x=>x.color===l);b!=null&&b.foto_url&&(u=b.foto_url)}if(u)try{const x=await(await fetch(u)).blob(),D=u.split(".").pop().split("?")[0]||"jpg",p=d.nombre.split(" ")[0],w=`Zapatillas_May_${l!=="default"?`${p}_${l}`:p}_${d.sku_interno||d.id}.${D}`;o.push(new File([x],w,{type:x.type})),r.push({nombre:d.nombre,sku:d.sku_interno||"",color:l!=="default"?l:""})}catch(b){console.error("No se pudo descargar imagen:",u,b)}}let n=`*Modelos de Calzado* 👠✨

`;if(r.forEach((a,c)=>{const l=a.nombre.split(" ")[0],d=a.color?` - Color ${a.color}`:"";n+=`*${c+1}. Modelo ${l}* (${a.sku})${d}

`}),navigator.share&&navigator.canShare&&navigator.canShare({files:o}))await navigator.share({files:o,title:"Modelos de Zapatillas May"});else{const a=`https://wa.me/?text=${encodeURIComponent(n)}`;window.open(a,"_blank"),alert("Tu navegador no permite compartir archivos directamente. Se abrirá WhatsApp con los detalles y se descargarán las imágenes seleccionadas a tu dispositivo para que las subas.");for(let c=0;c<o.length;c++){const l=document.createElement("a");l.href=URL.createObjectURL(o[c]),l.download=o[c].name,document.body.appendChild(l),l.click(),document.body.removeChild(l),await new Promise(d=>setTimeout(d,400))}}}catch(o){alert("Error al compartir: "+o.message)}finally{e.innerHTML=t,e.disabled=!1,window.pcCancelarSeleccionCompartir()}};let S={productoId:null,color:null,modo:"variado"},z=1;window.__abrir=je;function Ue(e){const t=s.data.variantes.filter(o=>o.producto_id===e),i=[...new Set(t.map(o=>o.color).filter(Boolean))];return i.length?i.some(o=>Ge(e,o)):!1}function Ge(e,t){return ae(e,t)>=1}function ae(e,t){if(!t)return 0;const i=s.data.variantes.filter(n=>n.producto_id===e&&n.color===t);if(!i.length)return 0;const o=i.some(n=>n.talla&&(n.talla.includes(".5")||n.talla.includes("½")||n.talla.includes("/")));let r=0;for(let n=1;n<=6;n++)if(o){if(i.filter(l=>(s.data.stockPorVar[l.id]||0)>=n).length>=6){r=n;continue}let c=0;if(i.forEach(l=>{const d=s.data.stockPorVar[l.id]||0;c+=Math.min(d,2*n)}),c>=6*n)r=n;else break}else{let a=0;if(i.forEach(c=>{const l=s.data.stockPorVar[c.id]||0;a+=Math.min(l,2*n)}),a>=6*n)r=n;else break}return r}function ze(e,t,i){const o=s.data.variantes.filter(c=>c.producto_id===e&&c.color===t).sort((c,l)=>le.indexOf(c.talla)-le.indexOf(l.talla)),r=o.some(c=>c.talla&&(c.talla.includes(".5")||c.talla.includes("½")||c.talla.includes("/"))),n={};if(r){const c=o.filter(l=>(s.data.stockPorVar[l.id]||0)>=i);if(c.length>=6)return c.slice(0,6).forEach(l=>{n[l.id]=i}),n}let a=6*i;for(const c of o){const l=s.data.stockPorVar[c.id]||0,d=Math.min(l,2*i,a);if(d>0&&(n[c.id]=d,a-=d),a<=0)break}return n}function je(e){const t=s.data.productos.find(n=>n.id===e);if(!t)return;const i=s.data.variantes.filter(n=>n.producto_id===e),o=[...new Set(i.map(n=>n.color).filter(Boolean))];S={productoId:e,color:o[0]||null,modo:"variado"},z=1;const r=document.createElement("div");r.className="modal-overlay",r.id="pmodal",r.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${t.imagen_principal?`<img id="pm-img" src="${t.imagen_principal}" onclick="window.abrirLightboxPC(this.src, null, '${f(String(t.nombre||"").split(" ")[0])}')" style="cursor:zoom-in">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${f(t.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${f(t.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${k(t.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${k(t.precio_mayoreo3)}</span>
            <span class="tier">6+ ${k(t.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${k(t.precio_corrida)}</span>
          </div>
        </div>
        <button onclick="history.back()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll">
        <div class="mode-tabs" id="pm-mode">
          <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
          <button data-modo="corrida" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
        </div>
        <p class="section-title">Color</p>
        <div class="swatches" id="pm-swatches">
          ${o.map(n=>{var d;const a=i.filter(v=>v.color===n),c=a.map(v=>v.foto_url).find(Boolean),l=((d=a[0])==null?void 0:d.color_hex)||"#999";return`<div class="swatch ${n===S.color?"active":""}" data-color="${f(n)}" onclick="window.__pickColor('${f(n)}')">
              ${c?`<img src="${c}">`:`<div class="hex" style="background:${l}"></div>`}
              <span>${f(n)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="history.back(); setTimeout(() => window.__nav('carrito'), 50)">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(r),r.addEventListener("click",n=>{n.target===r&&history.back()}),window._zmPushBack&&window._zmPushBack(()=>{const n=document.getElementById("pmodal");n&&n.remove();try{localStorage.removeItem("pc_active_product_id")}catch{}});try{localStorage.setItem("pc_active_product_id",e)}catch{}S.color&&(Ie(),ne())}function Ie(){const e=document.getElementById("pm-mode");if(!e)return;const{productoId:t,color:i}=S,r=ae(t,i)>=1,n=document.getElementById("pm-tier-corr");if(n&&(n.style.display=r?"":"none"),!r)S.modo==="corrida"&&(S.modo="variado"),e.innerHTML=`
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `;else{const a=S.modo;e.innerHTML=`
      <button data-modo="variado" class="${a==="variado"?"on":""}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${a==="corrida"?"on":""}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `}}window.__pickColor=e=>{S.color=e,z=1,document.querySelectorAll("#pm-swatches .swatch").forEach(r=>r.classList.toggle("active",r.dataset.color===e));const i=s.data.variantes.filter(r=>r.producto_id===S.productoId&&r.color===e).map(r=>r.foto_url).find(Boolean),o=document.getElementById("pm-img");o&&i&&(o.src=i),Ie(),ne()};window.__modoModal=e=>{S.modo=e,z=1,document.querySelectorAll("#pm-mode button").forEach(t=>t.classList.toggle("on",t.dataset.modo===e)),ne()};function Xe(){const{productoId:e,color:t}=S;return s.data.variantes.filter(i=>i.producto_id===e&&i.color===t).sort((i,o)=>le.indexOf(i.talla)-le.indexOf(o.talla))}function ne(){const e=document.getElementById("pm-tallas");if(!e)return;const{color:t,modo:i,productoId:o}=S,r=s.data.productos.find(c=>c.id===o),n=Xe(),a=document.getElementById("pm-tallas-label");if(i==="corrida"){const c=ae(o,t);z>c&&(z=Math.max(1,c)),a&&(a.textContent=`Corrida completa — ${t} · ${k(r.precio_corrida)} x par`),e.className="corrida-rows",e.innerHTML=`
      <div class="crow" style="border-bottom: none; padding-bottom: 12px; margin-bottom: 12px;">
        <span class="ct" style="min-width: 140px; font-weight: 800; font-size: 1.1rem; color: var(--black);">Corridas</span>
        <span class="cs muted" style="font-size: .8rem;">Máx: ${c}</span>
        <div class="cstep">
          <button onclick="window.__changeCorridaM(-1)">−</button>
          <span>${z}</span>
          <button onclick="window.__changeCorridaM(1)">+</button>
        </div>
      </div>
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pink); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    `}else a&&(a.textContent="Tallas — "+t),e.className="tallas",e.innerHTML=n.map(c=>{var v;const l=s.data.stockPorVar[c.id]||0,d=((v=s.carrito.find(u=>u.variante_id===c.id&&!u.es_corrida))==null?void 0:v.cantidad)||0;return`<button class="talla ${d?"on":""}" ${l<=0?"disabled":""} onclick="window.__addTalla('${c.id}')">
        <span class="t">${c.talla}</span>
        <span class="s">${l<=0?"Agotado":"Stock "+l}</span>
        ${d?`<span class="q">${d}</span>`:""}
      </button>`}).join("");Ye()}function Ye(){const e=document.getElementById("pm-foot");e&&(S.modo==="corrida"?e.innerHTML=`
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${z} ${z===1?"corrida":"corridas"} (${z*6} pares)</button>
    `:e.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`)}window.__changeCorridaM=e=>{const{productoId:t,color:i}=S,o=ae(t,i);z=Math.min(o,Math.max(1,z+e)),ne()};window.__agregarCorrida=()=>{const{productoId:e,color:t}=S,i=s.data.productos.find(a=>a.id===e),o=ze(e,t,z);let r=0;if(Object.entries(o).forEach(([a,c])=>{if(c<=0)return;const l=s.data.variantes.find(v=>v.id===a),d=s.carrito.find(v=>v.variante_id===a&&v.es_corrida);d?d.cantidad+=c:s.carrito.push({variante_id:a,producto_id:i.id,nombre:i.nombre,color:l.color,talla:l.talla,cantidad:c,es_corrida:!0,precio_menudeo:i.precio_menudeo,precio_mayoreo3:i.precio_mayoreo3,precio_mayoreo6:i.precio_mayoreo6,precio_corrida:i.precio_corrida,imagen:l.foto_url||i.imagen_principal||null,sku:i.sku_interno||null}),r+=c}),!r){j("Elige al menos una corrida");return}z=1,G(),document.getElementById("pmodal")?(history.back(),setTimeout(()=>J("carrito"),50)):J("carrito"),j("Corrida agregada · "+r+" pares")};window.__addTalla=e=>{const t=s.data.variantes.find(a=>a.id===e),i=s.data.productos.find(a=>a.id===t.producto_id),o=s.data.stockPorVar[e]||0,r=s.carrito.find(a=>a.variante_id===e&&!a.es_corrida);if(((r==null?void 0:r.cantidad)||0)>=o){j("Sin más stock ("+o+")");return}r?r.cantidad+=1:s.carrito.push({variante_id:e,producto_id:i.id,nombre:i.nombre,color:t.color,talla:t.talla,cantidad:1,es_corrida:!1,precio_menudeo:i.precio_menudeo,precio_mayoreo3:i.precio_mayoreo3,precio_mayoreo6:i.precio_mayoreo6,precio_corrida:i.precio_corrida,imagen:t.foto_url||i.imagen_principal||null,sku:i.sku_interno||null}),G(),ne(),document.querySelector(".bottomnav").outerHTML=q(),j("Agregado · "+oe()+" pares")};function oe(){return s.carrito.reduce((e,t)=>e+t.cantidad,0)}function be(){return s.carrito.filter(e=>!e.es_corrida).reduce((e,t)=>e+t.cantidad,0)}function fe(e,t){return e.es_corrida?e.precio_corrida:t>=6?e.precio_mayoreo6:t>=3?e.precio_mayoreo3:e.precio_menudeo}function he(){const e=be();return s.carrito.reduce((t,i)=>t+i.cantidad*fe(i,e),0)}const pe="[carrito-respaldo]";let R=null,Ce=null,ce=null,ee=null;function _e(){ce&&(clearInterval(ce),ce=null),ee&&(window.removeEventListener("focus",ee),ee=null)}function Ve(){_e();const e=()=>Je();ce=setInterval(e,8e3),ee=e,window.addEventListener("focus",ee)}async function Je(){var t;if(s.tab!=="carrito"||!((t=s.sesion)!=null&&t.cliente_id)){_e();return}const e=document.activeElement;if(!(e&&(e.tagName==="INPUT"||e.tagName==="TEXTAREA")))try{const i=await fetch(_+"/portal/pedidos",{headers:A()}).then(c=>c.ok?c.json():null),o=(Array.isArray(i)?i:[]).find(c=>c.notes===pe),r=(o==null?void 0:o.pedido_items)||[],n=JSON.stringify(s.carrito.map(c=>[c.variante_id,c.cantidad,c.precio_unitario||c.precio_menudeo||0])),a=JSON.stringify(r.map(c=>{var l;return[c.variante_id||((l=c.variantes)==null?void 0:l.id),c.cantidad,c.precio_unitario]}));if(n===a)return;R=(o==null?void 0:o.id)||null,s.carrito=r.map(c=>{var v;const l=c.variantes,d=s.data.productos.find(u=>u.id===((l==null?void 0:l.producto_id)||c.producto_id));return{producto_id:(l==null?void 0:l.producto_id)||c.producto_id,variante_id:(l==null?void 0:l.id)||c.variante_id,nombre:((v=l==null?void 0:l.productos)==null?void 0:v.nombre)||c.nombre||(d==null?void 0:d.nombre)||"Producto",color:(l==null?void 0:l.color)||c.color,talla:(l==null?void 0:l.talla)||c.talla,cantidad:c.cantidad,es_corrida:!!c.es_corrida,precio_menudeo:(d==null?void 0:d.precio_menudeo)||0,precio_mayoreo3:(d==null?void 0:d.precio_mayoreo3)||0,precio_mayoreo6:(d==null?void 0:d.precio_mayoreo6)||0,precio_corrida:(d==null?void 0:d.precio_corrida)||0,imagen:(l==null?void 0:l.foto_url)||(d==null?void 0:d.imagen_principal)||null,sku:(d==null?void 0:d.sku_interno)||c.sku||null}}),we(),s.tab==="carrito"&&Z()}catch{}}function we(){try{localStorage.setItem(Me,JSON.stringify(s.carrito))}catch{}const e=document.querySelector(".bottomnav");e&&(e.outerHTML=q())}function G(){we(),We()}function We(){clearTimeout(Ce),Ce=setTimeout(()=>{Ze().catch(()=>{})},1500)}async function Ze(){var t,i;if(!((t=s.sesion)!=null&&t.cliente_id))return;if(!s.carrito.length){if(R){const o=R;R=null,fetch(`${_}/pedidos/${o}/cancelar`,{method:"POST",headers:A()}).catch(()=>{})}return}let e=R;if(!e)try{const o=await fetch(_+"/portal/pedidos",{headers:A()}).then(n=>n.ok?n.json():[]),r=(Array.isArray(o)?o:[]).find(n=>n.notas===pe);r&&(e=r.id,R=e)}catch{}if(!e){const o=await fetch(`${_}/pedidos`,{method:"POST",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({cliente_id:s.sesion.cliente_id,status:"borrador",canal:"portal_mayoreo",total:0,notas:pe})});if(!o.ok)return;const r=await o.json();if(e=Array.isArray(r)?(i=r[0])==null?void 0:i.id:r==null?void 0:r.id,!e)return;R=e}try{const o=await fetch(`${_}/pedidos/${e}/items`,{headers:A()}).then(n=>n.ok?n.json():[]);for(const n of Array.isArray(o)?o:[])await fetch(`${_}/pedidos/${e}/items/${n.id}`,{method:"DELETE",headers:A()}).catch(()=>{});for(const n of s.carrito){const a=s.carrito.reduce((d,v)=>d+v.cantidad,0),c=s.data.productos.find(d=>d.id===n.producto_id);let l=n.precio_menudeo||0;c&&(n.es_corrida?l=c.precio_corrida:a>=6?l=c.precio_mayoreo6:a>=3&&(l=c.precio_mayoreo3)),await fetch(`${_}/pedidos/${e}/items`,{method:"POST",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({variante_id:n.variante_id,cantidad:n.cantidad,precio_unitario:l,subtotal:n.cantidad*l,nombre:n.nombre,color:n.color,talla:n.talla,es_corrida:!!n.es_corrida})}).catch(()=>{})}const r=he();await fetch(`${_}/pedidos/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({total:r})}).catch(()=>{})}catch{}}async function Ke(e){const t=(Array.isArray(e)?e:[]).find(r=>r.notas===pe);if(!t)return;R=t.id;const i=t.pedido_items||[];if(!i.length)return;const o=[];i.forEach(r=>{var c;const n=r.variantes;if(!n||!n.id)return;const a=s.data.productos.find(l=>l.id===n.producto_id);o.push({producto_id:n.producto_id,variante_id:n.id,nombre:((c=n.productos)==null?void 0:c.nombre)||r.nombre||(a==null?void 0:a.nombre)||"Producto",color:n.color||r.color,talla:n.talla||r.talla,cantidad:r.cantidad,es_corrida:!!r.es_corrida,precio_menudeo:(a==null?void 0:a.precio_menudeo)||0,precio_mayoreo3:(a==null?void 0:a.precio_mayoreo3)||0,precio_mayoreo6:(a==null?void 0:a.precio_mayoreo6)||0,precio_corrida:(a==null?void 0:a.precio_corrida)||0,imagen:n.foto_url||(a==null?void 0:a.imagen_principal)||null,sku:(a==null?void 0:a.sku_interno)||r.sku||null})}),o.length&&(s.carrito=o,we())}function Qe(){const e=be();return s.carrito.every(t=>t.es_corrida)&&s.carrito.length?"Corrida":e>=6?"Mayoreo 6+":e>=3?"Mayoreo 3+":"Menudeo"}function Z(){if(!s.carrito.length){B().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const e=be(),t=he(),i=s.carrito.filter(a=>!a.es_corrida),o=s.carrito.filter(a=>a.es_corrida),r={};o.forEach(a=>{const c=`${a.producto_id}-${a.color}`;r[c]||(r[c]={key:c,es_grupo_corrida:!0,producto_id:a.producto_id,color:a.color,nombre:a.nombre,imagen:a.imagen,precio_corrida:a.precio_corrida,cantidad:0,items:[]}),r[c].cantidad+=a.cantidad,r[c].items.push(a)});const n=[...i.map((a,c)=>({...a,originalIdx:s.carrito.indexOf(a)})),...Object.values(r)];B().innerHTML=`
    <p class="section-title">${oe()} pares · ${Qe()}</p>
    ${n.map(a=>a.es_grupo_corrida?`
          <div class="row">
            <div class="r-top">
              ${a.imagen?`<img src="${a.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${f(String(a.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${f(a.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${k(a.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${a.producto_id}', '${f(a.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${a.producto_id}', '${f(a.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${a.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${a.producto_id}', '${f(a.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${k(a.cantidad*a.precio_corrida)}</span>
            </div>
          </div>
        `:`
          <div class="row">
            <div class="r-top">
              ${a.imagen?`<img src="${a.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${f(String(a.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${f(a.color)} · T${f(a.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${k(fe(a,e))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${a.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${a.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${a.cantidad}</span>
              <button onclick="window.__qty(${a.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${k(a.cantidad*fe(a,e))}</span>
            </div>
          </div>
        `).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${oe()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${k(t)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(e,t)=>{const i=s.carrito[e];if(i){if(t>0){const o=s.data.stockPorVar[i.variante_id]||0;if(s.carrito.filter(n=>n.variante_id===i.variante_id).reduce((n,a)=>n+a.cantidad,0)>=o){j("Sin más stock ("+o+")");return}}i.cantidad=Math.max(1,i.cantidad+t),G(),Z(),document.querySelector(".bottomnav").outerHTML=q()}};window.__delItem=e=>{s.carrito.splice(e,1),G(),Z(),document.querySelector(".bottomnav").outerHTML=q()};window.__qtyGrupoCorrida=(e,t,i)=>{const a=s.carrito.filter(u=>u.producto_id===e&&u.color===t&&u.es_corrida).reduce((u,b)=>u+b.cantidad,0)/6+i;if(a<=0){window.__delGrupoCorrida(e,t);return}const c=ae(e,t);if(a>c){j(`Sin existencias para ${a} corridas (máximo ${c})`);return}const l=ze(e,t,a);s.carrito=s.carrito.filter(u=>!(u.producto_id===e&&u.color===t&&u.es_corrida));const d=s.data.productos.find(u=>u.id===e);Object.entries(l).forEach(([u,b])=>{if(b<=0)return;const x=s.data.variantes.find(D=>D.id===u);s.carrito.push({variante_id:u,producto_id:d.id,nombre:d.nombre,color:x.color,talla:x.talla,cantidad:b,es_corrida:!0,precio_menudeo:d.precio_menudeo,precio_mayoreo3:d.precio_mayoreo3,precio_mayoreo6:d.precio_mayoreo6,precio_corrida:d.precio_corrida,imagen:x.foto_url||d.imagen_principal||null})}),G(),Z();const v=document.querySelector(".bottomnav");v&&(v.outerHTML=q())};window.__delGrupoCorrida=(e,t)=>{s.carrito=s.carrito.filter(o=>!(o.producto_id===e&&o.color===t&&o.es_corrida)),G(),Z();const i=document.querySelector(".bottomnav");i&&(i.outerHTML=q())};window.__enviarPedido=async()=>{var e;if(s.carrito.length){if((e=s.sesion)!=null&&e.demo){j("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const t=await fetch(_+"/portal/carrito",{method:"POST",headers:A(),body:JSON.stringify({items:s.carrito.map(o=>({variante_id:o.variante_id,cantidad:o.cantidad,es_corrida:!!o.es_corrida}))})});if(ye(t))return;const i=await t.json();if(!t.ok||!i.ok)throw new Error(i.error||"");s.carrito=[],G(),j(i.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),J("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function et(){B().innerHTML='<div class="spinner">Cargando pedidos…</div>';let e=[];try{const t=await fetch(_+"/portal/pedidos",{headers:A()});if(ye(t))return;e=await t.json()}catch{}if(e=Array.isArray(e)?e.filter(t=>t.status!=="borrador"):[],!e.length){B().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}B().innerHTML=e.map(t=>{const i=t.pedido_items||[],o=i.reduce((n,a)=>n+(a.cantidad||0),0),r=t.created_at?new Date(t.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(t.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${r} · ${o} pares</div>
        </div>
        ${tt(t.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${k(O(t.total))}</div>
      ${i.slice(0,4).map(n=>{var a,c;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${f(((c=(a=n.variantes)==null?void 0:a.productos)==null?void 0:c.nombre)||n.nombre||"Producto")} ${n.color?"· "+f(n.color):""} T${f(n.talla||"")} ×${n.cantidad}</div>`}).join("")}
      ${i.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${i.length-4} más…</div>`:""}
      ${t.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${f(t.paqueteria||"Envío")} · Guía ${f(t.numero_guia)}</div>
        ${xe(t.tracking_url)?`<a href="${f(xe(t.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function tt(e){const t={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[i,o,r]=t[e]||["#f3f4f6","#374151",e||"—"];return`<span class="badge-status" style="background:${i};color:${o}">${r}</span>`}async function ot(){B().innerHTML='<div class="spinner">Cargando…</div>';let e=null;try{const t=await fetch(_+"/portal/me",{headers:A()});if(ye(t))return;e=await t.json()}catch{}e=e||{nombre:s.sesion.nombre,tipo:s.sesion.tipo},B().innerHTML=`
    <div class="row">
      <p class="section-title">Mis datos</p>
      <p style="font-weight:700;margin:0 0 2px">${f(e.nombre||"")}</p>
      <p class="muted" style="font-size:.84rem;margin:0">${f(e.telefono||"Sin teléfono")}</p>
      <p class="muted" style="font-size:.84rem;margin:2px 0 0">${f(e.email||"Sin correo")}</p>
      <p style="margin:10px 0 0"><span class="badge-status" style="background:#fce4f3;color:var(--pink)">Cliente ${f(e.tipo||"mayoreo")}</span></p>
    </div>
    ${e.direccion||e.ciudad?`<div class="row">
      <p class="section-title">Dirección</p>
      <p class="muted" style="font-size:.84rem;margin:0">${f(e.direccion||"")} ${f(e.ciudad||"")} ${f(e.estado||"")} ${f(e.codigo_postal||"")}</p>
    </div>`:""}
    ${O(e.limite_credito)||O(e.credito_disponible)?`<div class="row">
      <p class="section-title">Crédito</p>
      ${O(e.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${k(O(e.limite_credito))}</b>${e.dias_credito?" · "+e.dias_credito+" días":""}</p>`:""}
      ${O(e.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${k(O(e.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=Te;async function it(){B().innerHTML='<div class="spinner">Cargando catálogos…</div>';let e=[];try{e=await fetch(_+"/catalogos/").then(o=>o.json())}catch{}e=Array.isArray(e)?e:[];const t=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],i=e.length?e.map(o=>`
    <div class="cat-card">
      ${o.portada_url?`<img src="${o.portada_url}" loading="lazy">`:'<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>'}
      <div class="info">
        <h3>${f(o.nombre||"Catálogo")}</h3>
        <div class="muted" style="font-size:.78rem">${f(o.temporada||"")}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${o.id}','${f(o.nombre||"")}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${o.id}','${f(o.nombre||"")}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join(""):'<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>';B().innerHTML=`
    <div class="catalogos-tabs">
      <button class="sub-tab active" id="btn-cat-general" onclick="window.__switchSubTab('general')">Catálogos Generales</button>
      <button class="sub-tab" id="btn-cat-categorias" onclick="window.__switchSubTab('categorias')">Descarga de catálogo de...</button>
    </div>
    
    <div id="catalogos-general-content" style="display:block;">
      <p class="section-title">Catálogos para descargar</p>
      <div class="cat-list">
        ${i}
      </div>
    </div>
    
    <div id="catalogos-categorias-content" style="display:none;">
      <p class="section-title">Generar catálogo PDF por categoría</p>
      <p class="muted" style="font-size:.8rem; line-height:1.4; margin-bottom:16px;">
        Selecciona una categoría para descargar un catálogo PDF de marca blanca (sin logotipos) con las fotos de portada de cada color y su código identificador (ej: EF1203 NEGRO). Ideal para compartir directamente con tus clientes.
      </p>
      <div class="category-grid" id="cat-pdf-btns">
        ${t.map(([o,r])=>`
          <button class="category-btn" data-categoria="${o}" data-label="${r.replace(/^[^\s]+\s/,"")}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${r.split(" ")[0]}</span>
            <span class="label">${r.split(" ")[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`}window.__switchSubTab=e=>{const t=document.getElementById("catalogos-general-content"),i=document.getElementById("catalogos-categorias-content"),o=document.getElementById("btn-cat-general"),r=document.getElementById("btn-cat-categorias");e==="categorias"?(t&&(t.style.display="none"),i&&(i.style.display="block"),o&&o.classList.remove("active"),r&&r.classList.add("active")):(t&&(t.style.display="block"),i&&(i.style.display="none"),o&&o.classList.add("active"),r&&r.classList.remove("active"))};window.__descargarPdfCategorias=async e=>{const t=e.getAttribute("data-categoria"),i=e.getAttribute("data-label"),o=document.getElementById("cat-pdf-msg"),r=document.querySelectorAll("#cat-pdf-btns button");r.forEach(n=>n.disabled=!0),o&&(o.style.display="block",o.textContent=`⏳ Cargando productos de ${i}...`);try{const n=s.data.productos.filter(m=>m.categoria&&String(m.categoria).trim().toLowerCase()===String(t).trim().toLowerCase());if(!n.length){o&&(o.textContent=`Sin productos activos en ${i}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(m=>m.disabled=!1);return}const a=[];if(n.forEach(m=>{const C=s.data.variantes.filter(g=>g.producto_id===m.id&&g.activa!==!1),h=new Set;C.forEach(g=>{if(!g.color||h.has(g.color.trim().toUpperCase()))return;h.add(g.color.trim().toUpperCase());const L=g.foto_url||m.imagen_principal;L&&a.push({sku:m.sku_interno||"S/K",color:g.color.trim().toUpperCase(),imgUrl:L})}),h.size===0&&m.imagen_principal&&a.push({sku:m.sku_interno||"S/K",color:"ÚNICO",imgUrl:m.imagen_principal})}),!a.length){o&&(o.textContent=`Sin fotos disponibles para ${i}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(m=>m.disabled=!1);return}o&&(o.textContent=`✏️ Generando catálogo PDF (${a.length} variantes)...`),window.jspdf||await new Promise((m,C)=>{const h=document.createElement("script");h.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",h.onload=m,h.onerror=C,document.head.appendChild(h)});const{jsPDF:c}=window.jspdf,l=2,d=3,v=l*d,u=1080,b=1440,x=40,D=80,p=24,$=32,w=(u-x*2-p*(l-1))/l,E=(b-D*2-$*(d-1))/d,I=E-50,X=m=>new Promise(C=>{if(!m)return C(null);const h=new Image;h.crossOrigin="anonymous",h.onload=()=>C(h),h.onerror=()=>C(null),h.src=m+(m.includes("?")?"&":"?")+"_t="+Date.now()}),re=(m,C,h,g,L,M)=>{if(m.save(),m.fillStyle="#FFFFFF",m.fillRect(h,g,L,M),C){m.beginPath(),m.rect(h,g,L,M),m.clip();const F=C.naturalWidth/C.naturalHeight,ue=L/M;let Y,H,U,K;F>ue?(H=M,Y=M*F,K=g,U=h+(L-Y)/2):(Y=L,H=L/F,U=h,K=g+(M-H)/2),m.drawImage(C,U,K,Y,H)}else m.fillStyle="#F3F4F6",m.fillRect(h,g,L,M),m.fillStyle="#9CA3AF",m.font="20px sans-serif",m.textAlign="center",m.fillText("Sin imagen",h+L/2,g+M/2);m.restore()},N=[];for(let m=0;m<a.length;m+=v)N.push(a.slice(m,m+v));const y=new c({orientation:"portrait",unit:"px",format:[u,b]});let P=!0;for(let m=0;m<N.length;m++){o&&(o.textContent=`✏️ Generando página ${m+1} de ${N.length}...`);const C=N[m],h=document.createElement("canvas");h.width=u,h.height=b;const g=h.getContext("2d");g.fillStyle="#FAFAF8",g.fillRect(0,0,u,b),g.fillStyle="#2A1A0E",g.font="300 20px sans-serif",g.textAlign="center",g.letterSpacing="4px",g.fillText(`CATÁLOGO DE ${i.toUpperCase()}`,u/2,38),g.letterSpacing="0px",g.fillStyle="#C8967A",g.fillRect(x,48,u-x*2,1.5);for(let M=0;M<C.length;M++){const F=C[M],ue=M%l,Y=Math.floor(M/l),H=x+ue*(w+p),U=D+Y*(E+$),K=await X(F.imgUrl);re(g,K,H,U,w,I),g.fillStyle="#E8DDD5",g.fillRect(H,U+I,w,1),g.fillStyle="#2A1A0E",g.textAlign="center",g.font="600 18px sans-serif",g.fillText(`${F.sku} ${F.color}`,H+w/2,U+I+28)}g.fillStyle="#C8967A",g.fillRect(x,b-48,u-x*2,1),g.fillStyle="#A07860",g.font="300 14px sans-serif",g.textAlign="center",g.fillText(`Página ${m+1} de ${N.length}`,u/2,b-30);const L=h.toDataURL("image/jpeg",.9);P||y.addPage([u,b]),y.addImage(L,"JPEG",0,0,u,b),P=!1}const se=`catalogo_${t}_${new Date().toISOString().slice(0,10)}.pdf`;y.save(se),o&&(o.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{o.style.display="none"},4e3))}catch(n){console.error("Error generating PDF:",n),o&&(o.textContent=`❌ Error al generar el PDF: ${n.message}`)}finally{r.forEach(n=>n.disabled=!1)}};async function Pe(e){const t=await fetch(_+"/catalogos/"+e+"/paginas").then(i=>i.json()).catch(()=>[]);return Array.isArray(t)?t:[]}window.__verCatalogo=async(e,t)=>{const i=await Pe(e),o=document.createElement("div");o.className="modal-overlay",o.id="catv",o.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${f(t)}</div><div class="muted" style="font-size:.76rem">${i.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${i.length?i.map(r=>`<img src="${r.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${e}','${f(t)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(o),o.addEventListener("click",r=>{r.target===o&&o.remove()})};window.__descargarCatalogo=async(e,t,i)=>{const o=i?i.textContent:"";i&&(i.disabled=!0,i.textContent="Descargando…");try{const r=await Pe(e);if(!r.length){j("Este catálogo no tiene páginas"),i&&(i.disabled=!1,i.textContent=o);return}const n=(t||"catalogo").replace(/[^\w]+/g,"_");let a=0;for(const c of r){a++;try{const d=await(await fetch(c.imagen_url)).blob(),v=URL.createObjectURL(d),u=document.createElement("a");u.href=v,u.download=`${n}_${String(c.pagina_numero||a).padStart(2,"0")}.jpg`,document.body.appendChild(u),u.click(),u.remove(),URL.revokeObjectURL(v),await new Promise(b=>setTimeout(b,300))}catch{window.open(c.imagen_url,"_blank")}}j("Descarga lista · "+r.length+" páginas")}catch{j("No se pudo descargar")}i&&(i.disabled=!1,i.textContent=o)};function at(){s.mayaMsgs||(s.mayaMsgs=[]),B().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${s.mayaMsgs.length?s.mayaMsgs.map(Ae).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",e=>{e.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const e=document.getElementById("maya-msgs");e&&(e.scrollTop=e.scrollHeight)},50)}function Ae(e){if(e.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const t=(e.fotos||[]).map(i=>`<img src="${f(i)}" loading="lazy">`).join("");return`<div class="msg ${e.role==="me"?"me":"bot"}">${f(e.content)}${t}</div>`}function Se(){const e=document.getElementById("maya-msgs");e&&(e.innerHTML=s.mayaMsgs.map(Ae).join(""),e.scrollTop=e.scrollHeight)}function nt(e){const t=[];let i=String(e||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(o,r)=>(t.push(r.replace(/[\[\]]/g,"")),""));return i=i.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:i||"👍",fotos:t}}window.__mayaSend=async()=>{const e=document.getElementById("maya-in");if(!e)return;const t=(e.value||"").trim();if(!t)return;e.value="",s.mayaMsgs||(s.mayaMsgs=[]);const i=s.mayaMsgs.filter(o=>!o.typing).map(o=>({role:o.role==="me"?"user":"assistant",content:o.content}));s.mayaMsgs.push({role:"me",content:t}),s.mayaMsgs.push({role:"bot",typing:!0}),Se();try{const r=await(await fetch(_+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:t,historial:i})})).json();s.mayaMsgs.pop();const{texto:n,fotos:a}=nt(r.respuesta);s.mayaMsgs.push({role:"bot",content:n,fotos:a})}catch{s.mayaMsgs.pop(),s.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}Se()};let Ee=null;function j(e){const t=document.getElementById("toast");t&&(t.textContent=e,t.classList.add("show"),clearTimeout(Ee),Ee=setTimeout(()=>t.classList.remove("show"),1600))}window.abrirLightboxPC=function(e,t,i){if(!e)return;const o=document.getElementById("pc-lightbox");if(o&&o.remove(),!t||!t.length){const p=document.getElementById("pm-swatches");p&&(t=Array.from(p.querySelectorAll("img")).map($=>$.src)),(!t||!t.length)&&(t=[e]),t.includes(e)||(t=[e,...t])}let r=t.indexOf(e);r<0&&(r=0);const n=document.createElement("div");n.id="pc-lightbox",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:19999;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none";let a=1,c=0,l=0,d=1,v=0;const u=()=>{a=1,c=0,l=0;const p=document.getElementById("lb-img");p&&(p.style.transform="",p.style.cursor="zoom-in")},b=()=>{const p=t.length;n.innerHTML=`
      <button onclick="history.back()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      <button onclick="pcCompartirImagenLB()" title="Compartir esta foto" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
      </button>
      <button onclick="pcDescargarImagenLB()" title="Descargar esta foto" style="position:absolute;top:16px;left:68px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </button>
      ${p>1?`<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===0?.3:1}">‹</button>`:""}
      <img id="lb-img" src="${t[r]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none;cursor:zoom-in;transition:transform 0.1s ease-out">
      ${p>1?`<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===p-1?.3:1}">›</button>`:""}
      ${p>1?`<div style="display:flex;gap:6px;margin-top:14px;z-index:2">${t.map(($,w)=>`<div onclick="lbGoto(${w})" style="width:${w===r?"22px":"8px"};height:8px;border-radius:4px;background:${w===r?"#E91E8C":"rgba(255,255,255,0.3)"};cursor:pointer;transition:all 0.2s"></div>`).join("")}</div>`:""}
    `};window.pcCompartirImagenLB=async()=>{const p=t[r];if(p)try{const w=await(await fetch(p)).blob(),E=(w.type.split("/")[1]||"jpg").replace("jpeg","jpg"),I=new File([w],`zapatillasmay-${Date.now()}.${E}`,{type:w.type});navigator.canShare&&navigator.canShare({files:[I]})?await navigator.share({files:[I]}):navigator.share?await navigator.share({url:p}):window.pcDescargarImagenLB()}catch($){($==null?void 0:$.name)!=="AbortError"&&j("No se pudo compartir la imagen")}},window.pcDescargarImagenLB=async()=>{const p=t[r];if(p)try{const w=await(await fetch(p)).blob(),E=document.createElement("a");E.href=URL.createObjectURL(w);const I=i?i.replace(/[^A-Za-z0-9_-]/g,""):"";E.download=I?`Zapatillas_May_${I}.jpg`:`Zapatillas_May_${Date.now()}.jpg`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL(E.href),j("Imagen descargada")}catch{window.open(p,"_blank")}},window.lbNav=p=>{p<0&&r===0||p>0&&r===t.length-1||(r=Math.max(0,Math.min(t.length-1,r+p)),u(),b(),x())},window.lbGoto=p=>{r=p,u(),b(),x()};const x=()=>{const p=document.getElementById("lb-img");if(!p)return;let $=!1,w=0,E=0,I=0;p.addEventListener("touchstart",y=>{if(y.touches.length===1){const P=new Date().getTime(),se=P-I;if(se<300&&se>0){a>1?u():(a=2.5,p.style.transform=`scale(${a})`,p.style.cursor="grab"),y.preventDefault();return}I=P,a>1?($=!0,w=y.touches[0].clientX-c,E=y.touches[0].clientY-l):w=y.touches[0].clientX}else y.touches.length===2&&($=!1,d=a,v=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY))},{passive:!1}),p.addEventListener("touchmove",y=>{if(y.touches.length===1&&a>1&&$)y.preventDefault(),c=y.touches[0].clientX-w,l=y.touches[0].clientY-E,p.style.transform=`scale(${a}) translate(${c/a}px, ${l/a}px)`;else if(y.touches.length===2){y.preventDefault();const P=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY);a=Math.max(1,Math.min(4,d*(P/v))),a<=1?u():(p.style.transform=`scale(${a}) translate(${c/a}px, ${l/a}px)`,p.style.cursor="grab")}},{passive:!1}),p.addEventListener("touchend",y=>{if($)$=!1;else if(a===1&&y.changedTouches.length===1){const P=y.changedTouches[0].clientX-w;Math.abs(P)>50&&window.lbNav(P<0?1:-1)}},{passive:!0}),p.addEventListener("wheel",y=>{y.preventDefault();const P=y.deltaY*-.005;a=Math.max(1,Math.min(4,a+P)),a<=1?u():(p.style.transform=`scale(${a}) translate(${c/a}px, ${l/a}px)`,p.style.cursor="grab")},{passive:!1});let X=!1,re=0,N=0;p.addEventListener("mousedown",y=>{a>1&&(X=!0,re=y.clientX-c,N=y.clientY-l,p.style.cursor="grabbing")}),window.addEventListener("mousemove",y=>{X&&a>1&&(c=y.clientX-re,l=y.clientY-N,p.style.transform=`scale(${a}) translate(${c/a}px, ${l/a}px)`)}),window.addEventListener("mouseup",()=>{X&&(X=!1,p&&(p.style.cursor="grab"))})};n.addEventListener("click",p=>{p.target===n&&history.back()});const D=p=>{p.key==="ArrowRight"?window.lbNav(1):p.key==="ArrowLeft"?window.lbNav(-1):p.key==="Escape"&&history.back()};document.addEventListener("keydown",D),n.addEventListener("remove",()=>document.removeEventListener("keydown",D)),b(),document.body.appendChild(n),x(),window._zmPushBack&&window._zmPushBack(()=>{const p=document.getElementById("pc-lightbox");p&&p.remove(),document.removeEventListener("keydown",D)})};window._zmNavStack=[];window._zmPushBack=e=>{history.pushState({zmNav:window._zmNavStack.length+1},""),window._zmNavStack.push(e)};window.addEventListener("popstate",()=>{if(window._zmNavStack.length>0){const e=window._zmNavStack.pop();try{e()}catch{}}});Be();
