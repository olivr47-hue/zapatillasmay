(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=a(r);fetch(r.href,i)}})();const h="/api",fe="portal_sesion",Se="portal_carrito",se=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],ce=document.getElementById("app"),s={sesion:null,data:null,carrito:[],tab:"tienda",filtroCat:"",busqueda:""},O=e=>parseFloat(e)||0,x=e=>"$"+Math.round(e).toLocaleString("es-MX"),f=e=>String(e??"").replace(/"/g,"&quot;").replace(/</g,"&lt;"),we=e=>{try{const t=new URL(String(e??""),window.location.origin);return t.protocol==="http:"||t.protocol==="https:"?t.href:""}catch{return""}};function A(){var t;const e=(t=s.sesion)==null?void 0:t.token;return e?{"Content-Type":"application/json",Authorization:"Bearer "+e}:{"Content-Type":"application/json"}}function ge(e){return e&&e.status===401?(Me(),!0):!1}function Ae(){var e;try{s.sesion=JSON.parse(localStorage.getItem(fe)||"null")}catch{s.sesion=null}try{s.carrito=JSON.parse(localStorage.getItem(Se)||"[]")}catch{s.carrito=[]}(e=s.sesion)!=null&&e.cliente_id?Te():te()}let Q="telefono",V="pedir",Z={};function te(){const e=Q==="telefono",t=V==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${f(Z.canal||(e?"WhatsApp":"correo"))}</b> a <b>${f(Z.destino||"")}</b>
      ${Z.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
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
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(ce.innerHTML=`
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
    </div>`,V==="pedir"){const a=document.getElementById("l-send");a&&(a.onclick=pe);const o=document.getElementById("l-dato");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&pe()})}else{const a=document.getElementById("l-verify");a&&(a.onclick=$e);const o=document.getElementById("l-codigo");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&$e()}),document.getElementById("l-resend").onclick=r=>{r.preventDefault(),pe()},document.getElementById("l-back").onclick=r=>{r.preventDefault(),V="pedir",te()}}document.getElementById("l-demo").onclick=a=>{a.preventDefault(),He()},Be()}window.__loginMetodo=e=>{Q=e,V="pedir",te()};async function Be(){var e;try{window._seoConfig||(window._seoConfig=await fetch(h+"/seo/config").then(o=>o.json()).catch(()=>({})));const t=(e=window._seoConfig)==null?void 0:e.google_client_id;if(!t||(await Oe(),typeof google>"u"))return;google.accounts.id.initialize({client_id:t,callback:De,auto_select:!1});const a=document.getElementById("g-login-btn");a&&google.accounts.id.renderButton(a,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function Oe(){return new Promise(e=>{var a,o;if((o=(a=window.google)==null?void 0:a.accounts)!=null&&o.id)return e();const t=document.createElement("script");t.src="https://accounts.google.com/gsi/client",t.async=!0,t.defer=!0,t.onload=e,t.onerror=e,document.head.appendChild(t)})}async function De(e){const t=e==null?void 0:e.credential;if(!t)return T("Error al conectar con Google");try{const a=await fetch(h+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:t})}),o=await a.json();if(!a.ok||!o.token)return T(o.error||"No se pudo entrar con Google");ye(o)}catch{T("Error conectando con Google")}}function T(e){const t=document.getElementById("l-err");t&&(t.textContent=e,t.style.display="block")}function ye(e){s.sesion={nombre:e.cliente.nombre,cliente_id:e.cliente.id,tipo:e.cliente.tipo,token:e.token,demo:!!e.demo},localStorage.setItem(fe,JSON.stringify(s.sesion)),Te()}async function pe(){T("");const e=(document.getElementById("l-dato").value||"").trim();if(!e)return T(Q==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const t=document.getElementById("l-send");t.disabled=!0,t.textContent="Enviando...";try{const a=await fetch(h+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:Q,valor:e})}),o=await a.json();if(!a.ok){T(o.error||"No se pudo enviar el código"),t.disabled=!1,t.textContent="Enviarme un código";return}Z={valor:e,destino:o.destino,canal:o.canal,enviado:o.enviado},V="codigo",te()}catch{T("Error conectando con el servidor"),t.disabled=!1,t.textContent="Enviarme un código"}}async function $e(){T("");const e=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(e.length<4)return T("Escribe el código que te enviamos");const t=document.getElementById("l-verify");t.disabled=!0,t.textContent="Entrando...";try{const a=await fetch(h+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:Q,valor:Z.valor,codigo:e})}),o=await a.json();if(!a.ok||!o.token){T(o.error||"Código incorrecto"),t.disabled=!1,t.textContent="Entrar";return}ye(o)}catch{T("Error conectando con el servidor"),t.disabled=!1,t.textContent="Entrar"}}async function He(){T("");try{const e=await fetch(h+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),t=await e.json();if(!e.ok||!t.token)return T(t.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":t.error||"No se pudo cargar el demo");ye(t)}catch{T("Error cargando demo")}}function Me(){localStorage.removeItem(fe),s.sesion=null,te()}async function Te(){ce.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[e,t,a,o]=await Promise.all([fetch(h+"/productos/").then(i=>i.json()),fetch(h+"/variantes/").then(i=>i.json()),fetch(h+"/inventario/").then(i=>i.json()).catch(()=>[]),fetch(h+"/portal/pedidos",{headers:A()}).then(i=>i.ok?i.json():[]).catch(()=>[])]),r={};(Array.isArray(a)?a:[]).forEach(i=>{r[i.variante_id]=(r[i.variante_id]||0)+(i.cantidad||0)}),s.data={productos:(Array.isArray(e)?e:[]).filter(i=>i.activo&&!/^oferta/i.test(i.nombre||"")&&!/^oferta/i.test(i.sku_interno||"")).map(i=>Ne(i)),variantes:Array.isArray(t)?t:[],stockPorVar:r};try{await Ke(o)}catch{}Re()}catch{ce.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function Ne(e){const t=O(e.precio_menudeo);return{...e,precio_menudeo:t,precio_mayoreo3:O(e.precio_mayoreo3)||t-30,precio_mayoreo6:O(e.precio_mayoreo6)||t-70,precio_corrida:O(e.precio_corrida)||t-100}}function Re(){ce.innerHTML=`
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
    ${D()}
    <div id="toast" class="toast"></div>`,le(s.tab||"tienda")}function D(){const e=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],t=ee();return`<div class="bottomnav">${e.map(a=>`
    <button data-tab="${a.id}" class="${s.tab===a.id?"active":""}" onclick="window.__nav('${a.id}')">
      <span class="ic">${a.ic}${a.id==="carrito"&&t?`<span class="badge">${t}</span>`:""}</span>
      <span>${a.label}</span>
    </button>`).join("")}</div>`}window.__nav=le;function le(e){var o;s.tab=e;const t=document.querySelector(".bottomnav");t&&(t.outerHTML=D());const a=document.getElementById("tb-sub");a&&(a.textContent=(o=s.sesion)!=null&&o.nombre?`Hola, ${s.sesion.nombre.split(" ")[0]}`:""),e==="carrito"?Ve():he(),e==="inicio"?qe():e==="tienda"?Le():e==="catalogos"?at():e==="carrito"?J():e==="pedidos"?et():e==="maya"?nt():e==="cuenta"&&ot()}const B=()=>document.getElementById("page");async function qe(){var a,o;const e=ee(),t=be();B().innerHTML=`
    ${(a=s.sesion)!=null&&a.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${f(s.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${e?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${x(t)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${e} pares</small></p>
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
    </div>`}function Le(){const e=[...new Set(s.data.productos.map(t=>t.categoria).filter(Boolean))];B().innerHTML=`
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${f(s.busqueda)}">
    <div class="chips">
      <button class="${s.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${e.map(t=>`<button class="${s.filtroCat===t?"active":""}" onclick="window.__filtro('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>`,document.getElementById("cat-search").addEventListener("input",t=>{s.busqueda=t.target.value,xe()}),xe()}window.__filtro=e=>{s.filtroCat=e,Le()};function xe(){const e=s.busqueda.trim().toLowerCase();let t=s.data.productos;s.filtroCat&&(t=t.filter(o=>o.categoria===s.filtroCat)),e&&(t=t.filter(o=>(o.nombre||"").toLowerCase().includes(e)||(o.sku_interno||"").toLowerCase().includes(e)));const a=document.getElementById("cat-grid");if(a){if(!t.length){a.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}a.innerHTML=t.slice(0,120).map(o=>`
    <div class="card" onclick="window.__abrir('${o.id}')">
      ${o.imagen_principal?`<img class="thumb" src="${o.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
      <div class="body">
        <div class="name">${f(o.nombre)}</div>
        <div class="sku">${f(o.sku_interno||"")}</div>
        <div class="price">${x(o.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${x(o.precio_mayoreo3)}</span>
          <span class="tier">6+ ${x(o.precio_mayoreo6)}</span>
          ${Fe(o.id)?`<span class="tier corr">Corr ${x(o.precio_corrida)}</span>`:""}
        </div>
      </div>
    </div>`).join("")}}let C={productoId:null,color:null,modo:"variado"},I=1;window.__abrir=Ue;function Fe(e){const t=s.data.variantes.filter(o=>o.producto_id===e),a=[...new Set(t.map(o=>o.color).filter(Boolean))];return a.length?a.some(o=>Ge(e,o)):!1}function Ge(e,t){return oe(e,t)>=1}function oe(e,t){if(!t)return 0;const a=s.data.variantes.filter(i=>i.producto_id===e&&i.color===t);if(!a.length)return 0;const o=a.some(i=>i.talla&&(i.talla.includes(".5")||i.talla.includes("½")||i.talla.includes("/")));let r=0;for(let i=1;i<=6;i++)if(o){if(a.filter(d=>(s.data.stockPorVar[d.id]||0)>=i).length>=6){r=i;continue}let c=0;if(a.forEach(d=>{const l=s.data.stockPorVar[d.id]||0;c+=Math.min(l,2*i)}),c>=6*i)r=i;else break}else{let n=0;if(a.forEach(c=>{const d=s.data.stockPorVar[c.id]||0;n+=Math.min(d,2*i)}),n>=6*i)r=i;else break}return r}function Ie(e,t,a){const o=s.data.variantes.filter(c=>c.producto_id===e&&c.color===t).sort((c,d)=>se.indexOf(c.talla)-se.indexOf(d.talla)),r=o.some(c=>c.talla&&(c.talla.includes(".5")||c.talla.includes("½")||c.talla.includes("/"))),i={};if(r){const c=o.filter(d=>(s.data.stockPorVar[d.id]||0)>=a);if(c.length>=6)return c.slice(0,6).forEach(d=>{i[d.id]=a}),i}let n=6*a;for(const c of o){const d=s.data.stockPorVar[c.id]||0,l=Math.min(d,2*a,n);if(l>0&&(i[c.id]=l,n-=l),n<=0)break}return i}function Ue(e){const t=s.data.productos.find(i=>i.id===e);if(!t)return;const a=s.data.variantes.filter(i=>i.producto_id===e),o=[...new Set(a.map(i=>i.color).filter(Boolean))];C={productoId:e,color:o[0]||null,modo:"variado"},I=1;const r=document.createElement("div");r.className="modal-overlay",r.id="pmodal",r.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${t.imagen_principal?`<img id="pm-img" src="${t.imagen_principal}" onclick="window.abrirLightboxPC(this.src, null, '${f(String(t.nombre||"").split(" ")[0])}')" style="cursor:zoom-in">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${f(t.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${f(t.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${x(t.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${x(t.precio_mayoreo3)}</span>
            <span class="tier">6+ ${x(t.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${x(t.precio_corrida)}</span>
          </div>
        </div>
        <button onclick="document.getElementById('pmodal').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll">
        <div class="mode-tabs" id="pm-mode">
          <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
          <button data-modo="corrida" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
        </div>
        <p class="section-title">Color</p>
        <div class="swatches" id="pm-swatches">
          ${o.map(i=>{var l;const n=a.filter(v=>v.color===i),c=n.map(v=>v.foto_url).find(Boolean),d=((l=n[0])==null?void 0:l.color_hex)||"#999";return`<div class="swatch ${i===C.color?"active":""}" data-color="${f(i)}" onclick="window.__pickColor('${f(i)}')">
              ${c?`<img src="${c}">`:`<div class="hex" style="background:${d}"></div>`}
              <span>${f(i)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(r),r.addEventListener("click",i=>{i.target===r&&r.remove()}),C.color&&(je(),ae())}function je(){const e=document.getElementById("pm-mode");if(!e)return;const{productoId:t,color:a}=C,r=oe(t,a)>=1,i=document.getElementById("pm-tier-corr");if(i&&(i.style.display=r?"":"none"),!r)C.modo==="corrida"&&(C.modo="variado"),e.innerHTML=`
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `;else{const n=C.modo;e.innerHTML=`
      <button data-modo="variado" class="${n==="variado"?"on":""}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${n==="corrida"?"on":""}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `}}window.__pickColor=e=>{C.color=e,I=1,document.querySelectorAll("#pm-swatches .swatch").forEach(r=>r.classList.toggle("active",r.dataset.color===e));const a=s.data.variantes.filter(r=>r.producto_id===C.productoId&&r.color===e).map(r=>r.foto_url).find(Boolean),o=document.getElementById("pm-img");o&&a&&(o.src=a),je(),ae()};window.__modoModal=e=>{C.modo=e,I=1,document.querySelectorAll("#pm-mode button").forEach(t=>t.classList.toggle("on",t.dataset.modo===e)),ae()};function Xe(){const{productoId:e,color:t}=C;return s.data.variantes.filter(a=>a.producto_id===e&&a.color===t).sort((a,o)=>se.indexOf(a.talla)-se.indexOf(o.talla))}function ae(){const e=document.getElementById("pm-tallas");if(!e)return;const{color:t,modo:a,productoId:o}=C,r=s.data.productos.find(c=>c.id===o),i=Xe(),n=document.getElementById("pm-tallas-label");if(a==="corrida"){const c=oe(o,t);I>c&&(I=Math.max(1,c)),n&&(n.textContent=`Corrida completa — ${t} · ${x(r.precio_corrida)} x par`),e.className="corrida-rows",e.innerHTML=`
      <div class="crow" style="border-bottom: none; padding-bottom: 12px; margin-bottom: 12px;">
        <span class="ct" style="min-width: 140px; font-weight: 800; font-size: 1.1rem; color: var(--black);">Corridas</span>
        <span class="cs muted" style="font-size: .8rem;">Máx: ${c}</span>
        <div class="cstep">
          <button onclick="window.__changeCorridaM(-1)">−</button>
          <span>${I}</span>
          <button onclick="window.__changeCorridaM(1)">+</button>
        </div>
      </div>
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pink); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    `}else n&&(n.textContent="Tallas — "+t),e.className="tallas",e.innerHTML=i.map(c=>{var v;const d=s.data.stockPorVar[c.id]||0,l=((v=s.carrito.find(p=>p.variante_id===c.id&&!p.es_corrida))==null?void 0:v.cantidad)||0;return`<button class="talla ${l?"on":""}" ${d<=0?"disabled":""} onclick="window.__addTalla('${c.id}')">
        <span class="t">${c.talla}</span>
        <span class="s">${d<=0?"Agotado":"Stock "+d}</span>
        ${l?`<span class="q">${l}</span>`:""}
      </button>`}).join("");Ye()}function Ye(){const e=document.getElementById("pm-foot");e&&(C.modo==="corrida"?e.innerHTML=`
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${I} ${I===1?"corrida":"corridas"} (${I*6} pares)</button>
    `:e.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`)}window.__changeCorridaM=e=>{const{productoId:t,color:a}=C,o=oe(t,a);I=Math.min(o,Math.max(1,I+e)),ae()};window.__agregarCorrida=()=>{const{productoId:e,color:t}=C,a=s.data.productos.find(c=>c.id===e),o=Ie(e,t,I);let r=0;if(Object.entries(o).forEach(([c,d])=>{if(d<=0)return;const l=s.data.variantes.find(p=>p.id===c),v=s.carrito.find(p=>p.variante_id===c&&p.es_corrida);v?v.cantidad+=d:s.carrito.push({variante_id:c,producto_id:a.id,nombre:a.nombre,color:l.color,talla:l.talla,cantidad:d,es_corrida:!0,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:l.foto_url||a.imagen_principal||null,sku:a.sku_interno||null}),r+=d}),!r){j("Elige al menos una corrida");return}I=1,U();const i=document.querySelector(".bottomnav");i&&(i.outerHTML=D());const n=document.getElementById("pmodal");n&&n.remove(),le("carrito"),j("Corrida agregada · "+r+" pares")};window.__addTalla=e=>{const t=s.data.variantes.find(n=>n.id===e),a=s.data.productos.find(n=>n.id===t.producto_id),o=s.data.stockPorVar[e]||0,r=s.carrito.find(n=>n.variante_id===e&&!n.es_corrida);if(((r==null?void 0:r.cantidad)||0)>=o){j("Sin más stock ("+o+")");return}r?r.cantidad+=1:s.carrito.push({variante_id:e,producto_id:a.id,nombre:a.nombre,color:t.color,talla:t.talla,cantidad:1,es_corrida:!1,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:t.foto_url||a.imagen_principal||null,sku:a.sku_interno||null}),U(),ae(),document.querySelector(".bottomnav").outerHTML=D(),j("Agregado · "+ee()+" pares")};function ee(){return s.carrito.reduce((e,t)=>e+t.cantidad,0)}function ve(){return s.carrito.filter(e=>!e.es_corrida).reduce((e,t)=>e+t.cantidad,0)}function me(e,t){return e.es_corrida?e.precio_corrida:t>=6?e.precio_mayoreo6:t>=3?e.precio_mayoreo3:e.precio_menudeo}function be(){const e=ve();return s.carrito.reduce((t,a)=>t+a.cantidad*me(a,e),0)}const de="[carrito-respaldo]";let q=null,ke=null,re=null,K=null;function he(){re&&(clearInterval(re),re=null),K&&(window.removeEventListener("focus",K),K=null)}function Ve(){he();const e=()=>Je();re=setInterval(e,8e3),K=e,window.addEventListener("focus",K)}async function Je(){var t;if(s.tab!=="carrito"||!((t=s.sesion)!=null&&t.cliente_id)){he();return}const e=document.activeElement;if(!(e&&(e.tagName==="INPUT"||e.tagName==="TEXTAREA")))try{const a=await fetch(h+"/portal/pedidos",{headers:A()}).then(c=>c.ok?c.json():null),o=(Array.isArray(a)?a:[]).find(c=>c.notes===de),r=(o==null?void 0:o.pedido_items)||[],i=JSON.stringify(s.carrito.map(c=>[c.variante_id,c.cantidad,c.precio_unitario||c.precio_menudeo||0])),n=JSON.stringify(r.map(c=>{var d;return[c.variante_id||((d=c.variantes)==null?void 0:d.id),c.cantidad,c.precio_unitario]}));if(i===n)return;q=(o==null?void 0:o.id)||null,s.carrito=r.map(c=>{var v;const d=c.variantes,l=s.data.productos.find(p=>p.id===((d==null?void 0:d.producto_id)||c.producto_id));return{producto_id:(d==null?void 0:d.producto_id)||c.producto_id,variante_id:(d==null?void 0:d.id)||c.variante_id,nombre:((v=d==null?void 0:d.productos)==null?void 0:v.nombre)||c.nombre||(l==null?void 0:l.nombre)||"Producto",color:(d==null?void 0:d.color)||c.color,talla:(d==null?void 0:d.talla)||c.talla,cantidad:c.cantidad,es_corrida:!!c.es_corrida,precio_menudeo:(l==null?void 0:l.precio_menudeo)||0,precio_mayoreo3:(l==null?void 0:l.precio_mayoreo3)||0,precio_mayoreo6:(l==null?void 0:l.precio_mayoreo6)||0,precio_corrida:(l==null?void 0:l.precio_corrida)||0,imagen:(d==null?void 0:d.foto_url)||(l==null?void 0:l.imagen_principal)||null,sku:(l==null?void 0:l.sku_interno)||c.sku||null}}),_e(),s.tab==="carrito"&&J()}catch{}}function _e(){try{localStorage.setItem(Se,JSON.stringify(s.carrito))}catch{}const e=document.querySelector(".bottomnav");e&&(e.outerHTML=D())}function U(){_e(),We()}function We(){clearTimeout(ke),ke=setTimeout(()=>{Ze().catch(()=>{})},1500)}async function Ze(){var t,a;if(!((t=s.sesion)!=null&&t.cliente_id))return;if(!s.carrito.length){if(q){const o=q;q=null,fetch(`${h}/pedidos/${o}/cancelar`,{method:"POST",headers:A()}).catch(()=>{})}return}let e=q;if(!e)try{const o=await fetch(h+"/portal/pedidos",{headers:A()}).then(i=>i.ok?i.json():[]),r=(Array.isArray(o)?o:[]).find(i=>i.notas===de);r&&(e=r.id,q=e)}catch{}if(!e){const o=await fetch(`${h}/pedidos`,{method:"POST",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({cliente_id:s.sesion.cliente_id,status:"borrador",canal:"portal_mayoreo",total:0,notas:de})});if(!o.ok)return;const r=await o.json();if(e=Array.isArray(r)?(a=r[0])==null?void 0:a.id:r==null?void 0:r.id,!e)return;q=e}try{const o=await fetch(`${h}/pedidos/${e}/items`,{headers:A()}).then(i=>i.ok?i.json():[]);for(const i of Array.isArray(o)?o:[])await fetch(`${h}/pedidos/${e}/items/${i.id}`,{method:"DELETE",headers:A()}).catch(()=>{});for(const i of s.carrito){const n=s.carrito.reduce((l,v)=>l+v.cantidad,0),c=s.data.productos.find(l=>l.id===i.producto_id);let d=i.precio_menudeo||0;c&&(i.es_corrida?d=c.precio_corrida:n>=6?d=c.precio_mayoreo6:n>=3&&(d=c.precio_mayoreo3)),await fetch(`${h}/pedidos/${e}/items`,{method:"POST",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({variante_id:i.variante_id,cantidad:i.cantidad,precio_unitario:d,subtotal:i.cantidad*d,nombre:i.nombre,color:i.color,talla:i.talla,es_corrida:!!i.es_corrida})}).catch(()=>{})}const r=be();await fetch(`${h}/pedidos/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json",...A()},body:JSON.stringify({total:r})}).catch(()=>{})}catch{}}async function Ke(e){const t=(Array.isArray(e)?e:[]).find(r=>r.notas===de);if(!t)return;q=t.id;const a=t.pedido_items||[];if(!a.length)return;const o=[];a.forEach(r=>{var c;const i=r.variantes;if(!i||!i.id)return;const n=s.data.productos.find(d=>d.id===i.producto_id);o.push({producto_id:i.producto_id,variante_id:i.id,nombre:((c=i.productos)==null?void 0:c.nombre)||r.nombre||(n==null?void 0:n.nombre)||"Producto",color:i.color||r.color,talla:i.talla||r.talla,cantidad:r.cantidad,es_corrida:!!r.es_corrida,precio_menudeo:(n==null?void 0:n.precio_menudeo)||0,precio_mayoreo3:(n==null?void 0:n.precio_mayoreo3)||0,precio_mayoreo6:(n==null?void 0:n.precio_mayoreo6)||0,precio_corrida:(n==null?void 0:n.precio_corrida)||0,imagen:i.foto_url||(n==null?void 0:n.imagen_principal)||null,sku:(n==null?void 0:n.sku_interno)||r.sku||null})}),o.length&&(s.carrito=o,_e())}function Qe(){const e=ve();return s.carrito.every(t=>t.es_corrida)&&s.carrito.length?"Corrida":e>=6?"Mayoreo 6+":e>=3?"Mayoreo 3+":"Menudeo"}function J(){if(!s.carrito.length){B().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const e=ve(),t=be(),a=s.carrito.filter(n=>!n.es_corrida),o=s.carrito.filter(n=>n.es_corrida),r={};o.forEach(n=>{const c=`${n.producto_id}-${n.color}`;r[c]||(r[c]={key:c,es_grupo_corrida:!0,producto_id:n.producto_id,color:n.color,nombre:n.nombre,imagen:n.imagen,precio_corrida:n.precio_corrida,cantidad:0,items:[]}),r[c].cantidad+=n.cantidad,r[c].items.push(n)});const i=[...a.map((n,c)=>({...n,originalIdx:s.carrito.indexOf(n)})),...Object.values(r)];B().innerHTML=`
    <p class="section-title">${ee()} pares · ${Qe()}</p>
    ${i.map(n=>n.es_grupo_corrida?`
          <div class="row">
            <div class="r-top">
              ${n.imagen?`<img src="${n.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${f(String(n.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${f(n.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${x(n.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${n.producto_id}', '${f(n.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${n.producto_id}', '${f(n.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${n.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${n.producto_id}', '${f(n.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${x(n.cantidad*n.precio_corrida)}</span>
            </div>
          </div>
        `:`
          <div class="row">
            <div class="r-top">
              ${n.imagen?`<img src="${n.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${f(String(n.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${f(n.color)} · T${f(n.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${x(me(n,e))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${n.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${n.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${n.cantidad}</span>
              <button onclick="window.__qty(${n.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${x(n.cantidad*me(n,e))}</span>
            </div>
          </div>
        `).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${ee()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${x(t)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(e,t)=>{const a=s.carrito[e];if(a){if(t>0){const o=s.data.stockPorVar[a.variante_id]||0;if(s.carrito.filter(i=>i.variante_id===a.variante_id).reduce((i,n)=>i+n.cantidad,0)>=o){j("Sin más stock ("+o+")");return}}a.cantidad=Math.max(1,a.cantidad+t),U(),J(),document.querySelector(".bottomnav").outerHTML=D()}};window.__delItem=e=>{s.carrito.splice(e,1),U(),J(),document.querySelector(".bottomnav").outerHTML=D()};window.__qtyGrupoCorrida=(e,t,a)=>{const n=s.carrito.filter(p=>p.producto_id===e&&p.color===t&&p.es_corrida).reduce((p,_)=>p+_.cantidad,0)/6+a;if(n<=0){window.__delGrupoCorrida(e,t);return}const c=oe(e,t);if(n>c){j(`Sin existencias para ${n} corridas (máximo ${c})`);return}const d=Ie(e,t,n);s.carrito=s.carrito.filter(p=>!(p.producto_id===e&&p.color===t&&p.es_corrida));const l=s.data.productos.find(p=>p.id===e);Object.entries(d).forEach(([p,_])=>{if(_<=0)return;const E=s.data.variantes.find(H=>H.id===p);s.carrito.push({variante_id:p,producto_id:l.id,nombre:l.nombre,color:E.color,talla:E.talla,cantidad:_,es_corrida:!0,precio_menudeo:l.precio_menudeo,precio_mayoreo3:l.precio_mayoreo3,precio_mayoreo6:l.precio_mayoreo6,precio_corrida:l.precio_corrida,imagen:E.foto_url||l.imagen_principal||null})}),U(),J();const v=document.querySelector(".bottomnav");v&&(v.outerHTML=D())};window.__delGrupoCorrida=(e,t)=>{s.carrito=s.carrito.filter(o=>!(o.producto_id===e&&o.color===t&&o.es_corrida)),U(),J();const a=document.querySelector(".bottomnav");a&&(a.outerHTML=D())};window.__enviarPedido=async()=>{var e;if(s.carrito.length){if((e=s.sesion)!=null&&e.demo){j("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const t=await fetch(h+"/portal/carrito",{method:"POST",headers:A(),body:JSON.stringify({items:s.carrito.map(o=>({variante_id:o.variante_id,cantidad:o.cantidad,es_corrida:!!o.es_corrida}))})});if(ge(t))return;const a=await t.json();if(!t.ok||!a.ok)throw new Error(a.error||"");s.carrito=[],U(),j(a.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),le("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function et(){B().innerHTML='<div class="spinner">Cargando pedidos…</div>';let e=[];try{const t=await fetch(h+"/portal/pedidos",{headers:A()});if(ge(t))return;e=await t.json()}catch{}if(e=Array.isArray(e)?e.filter(t=>t.status!=="borrador"):[],!e.length){B().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}B().innerHTML=e.map(t=>{const a=t.pedido_items||[],o=a.reduce((i,n)=>i+(n.cantidad||0),0),r=t.created_at?new Date(t.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(t.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${r} · ${o} pares</div>
        </div>
        ${tt(t.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${x(O(t.total))}</div>
      ${a.slice(0,4).map(i=>{var n,c;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${f(((c=(n=i.variantes)==null?void 0:n.productos)==null?void 0:c.nombre)||i.nombre||"Producto")} ${i.color?"· "+f(i.color):""} T${f(i.talla||"")} ×${i.cantidad}</div>`}).join("")}
      ${a.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${a.length-4} más…</div>`:""}
      ${t.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${f(t.paqueteria||"Envío")} · Guía ${f(t.numero_guia)}</div>
        ${we(t.tracking_url)?`<a href="${f(we(t.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function tt(e){const t={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[a,o,r]=t[e]||["#f3f4f6","#374151",e||"—"];return`<span class="badge-status" style="background:${a};color:${o}">${r}</span>`}async function ot(){B().innerHTML='<div class="spinner">Cargando…</div>';let e=null;try{const t=await fetch(h+"/portal/me",{headers:A()});if(ge(t))return;e=await t.json()}catch{}e=e||{nombre:s.sesion.nombre,tipo:s.sesion.tipo},B().innerHTML=`
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
      ${O(e.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${x(O(e.limite_credito))}</b>${e.dias_credito?" · "+e.dias_credito+" días":""}</p>`:""}
      ${O(e.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${x(O(e.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=Me;async function at(){B().innerHTML='<div class="spinner">Cargando catálogos…</div>';let e=[];try{e=await fetch(h+"/catalogos/").then(o=>o.json())}catch{}e=Array.isArray(e)?e:[];const t=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],a=e.length?e.map(o=>`
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
        ${a}
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
    </div>`}window.__switchSubTab=e=>{const t=document.getElementById("catalogos-general-content"),a=document.getElementById("catalogos-categorias-content"),o=document.getElementById("btn-cat-general"),r=document.getElementById("btn-cat-categorias");e==="categorias"?(t&&(t.style.display="none"),a&&(a.style.display="block"),o&&o.classList.remove("active"),r&&r.classList.add("active")):(t&&(t.style.display="block"),a&&(a.style.display="none"),o&&o.classList.add("active"),r&&r.classList.remove("active"))};window.__descargarPdfCategorias=async e=>{const t=e.getAttribute("data-categoria"),a=e.getAttribute("data-label"),o=document.getElementById("cat-pdf-msg"),r=document.querySelectorAll("#cat-pdf-btns button");r.forEach(i=>i.disabled=!0),o&&(o.style.display="block",o.textContent=`⏳ Cargando productos de ${a}...`);try{const i=s.data.productos.filter(m=>m.categoria&&String(m.categoria).trim().toLowerCase()===String(t).trim().toLowerCase());if(!i.length){o&&(o.textContent=`Sin productos activos en ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(m=>m.disabled=!1);return}const n=[];if(i.forEach(m=>{const k=s.data.variantes.filter(g=>g.producto_id===m.id&&g.activa!==!1),b=new Set;k.forEach(g=>{if(!g.color||b.has(g.color.trim().toUpperCase()))return;b.add(g.color.trim().toUpperCase());const L=g.foto_url||m.imagen_principal;L&&n.push({sku:m.sku_interno||"S/K",color:g.color.trim().toUpperCase(),imgUrl:L})}),b.size===0&&m.imagen_principal&&n.push({sku:m.sku_interno||"S/K",color:"ÚNICO",imgUrl:m.imagen_principal})}),!n.length){o&&(o.textContent=`Sin fotos disponibles para ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(m=>m.disabled=!1);return}o&&(o.textContent=`✏️ Generando catálogo PDF (${n.length} variantes)...`),window.jspdf||await new Promise((m,k)=>{const b=document.createElement("script");b.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",b.onload=m,b.onerror=k,document.head.appendChild(b)});const{jsPDF:c}=window.jspdf,d=2,l=3,v=d*l,p=1080,_=1440,E=40,H=80,u=24,$=32,w=(p-E*2-u*(d-1))/d,S=(_-H*2-$*(l-1))/l,P=S-50,X=m=>new Promise(k=>{if(!m)return k(null);const b=new Image;b.crossOrigin="anonymous",b.onload=()=>k(b),b.onerror=()=>k(null),b.src=m+(m.includes("?")?"&":"?")+"_t="+Date.now()}),ne=(m,k,b,g,L,M)=>{if(m.save(),m.fillStyle="#FFFFFF",m.fillRect(b,g,L,M),k){m.beginPath(),m.rect(b,g,L,M),m.clip();const F=k.naturalWidth/k.naturalHeight,ue=L/M;let Y,R,G,W;F>ue?(R=M,Y=M*F,W=g,G=b+(L-Y)/2):(Y=L,R=L/F,G=b,W=g+(M-R)/2),m.drawImage(k,G,W,Y,R)}else m.fillStyle="#F3F4F6",m.fillRect(b,g,L,M),m.fillStyle="#9CA3AF",m.font="20px sans-serif",m.textAlign="center",m.fillText("Sin imagen",b+L/2,g+M/2);m.restore()},N=[];for(let m=0;m<n.length;m+=v)N.push(n.slice(m,m+v));const y=new c({orientation:"portrait",unit:"px",format:[p,_]});let z=!0;for(let m=0;m<N.length;m++){o&&(o.textContent=`✏️ Generando página ${m+1} de ${N.length}...`);const k=N[m],b=document.createElement("canvas");b.width=p,b.height=_;const g=b.getContext("2d");g.fillStyle="#FAFAF8",g.fillRect(0,0,p,_),g.fillStyle="#2A1A0E",g.font="300 20px sans-serif",g.textAlign="center",g.letterSpacing="4px",g.fillText(`CATÁLOGO DE ${a.toUpperCase()}`,p/2,38),g.letterSpacing="0px",g.fillStyle="#C8967A",g.fillRect(E,48,p-E*2,1.5);for(let M=0;M<k.length;M++){const F=k[M],ue=M%d,Y=Math.floor(M/d),R=E+ue*(w+u),G=H+Y*(S+$),W=await X(F.imgUrl);ne(g,W,R,G,w,P),g.fillStyle="#E8DDD5",g.fillRect(R,G+P,w,1),g.fillStyle="#2A1A0E",g.textAlign="center",g.font="600 18px sans-serif",g.fillText(`${F.sku} ${F.color}`,R+w/2,G+P+28)}g.fillStyle="#C8967A",g.fillRect(E,_-48,p-E*2,1),g.fillStyle="#A07860",g.font="300 14px sans-serif",g.textAlign="center",g.fillText(`Página ${m+1} de ${N.length}`,p/2,_-30);const L=b.toDataURL("image/jpeg",.9);z||y.addPage([p,_]),y.addImage(L,"JPEG",0,0,p,_),z=!1}const ie=`catalogo_${t}_${new Date().toISOString().slice(0,10)}.pdf`;y.save(ie),o&&(o.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{o.style.display="none"},4e3))}catch(i){console.error("Error generating PDF:",i),o&&(o.textContent=`❌ Error al generar el PDF: ${i.message}`)}finally{r.forEach(i=>i.disabled=!1)}};async function Pe(e){const t=await fetch(h+"/catalogos/"+e+"/paginas").then(a=>a.json()).catch(()=>[]);return Array.isArray(t)?t:[]}window.__verCatalogo=async(e,t)=>{const a=await Pe(e),o=document.createElement("div");o.className="modal-overlay",o.id="catv",o.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${f(t)}</div><div class="muted" style="font-size:.76rem">${a.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${a.length?a.map(r=>`<img src="${r.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${e}','${f(t)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(o),o.addEventListener("click",r=>{r.target===o&&o.remove()})};window.__descargarCatalogo=async(e,t,a)=>{const o=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Descargando…");try{const r=await Pe(e);if(!r.length){j("Este catálogo no tiene páginas"),a&&(a.disabled=!1,a.textContent=o);return}const i=(t||"catalogo").replace(/[^\w]+/g,"_");let n=0;for(const c of r){n++;try{const l=await(await fetch(c.imagen_url)).blob(),v=URL.createObjectURL(l),p=document.createElement("a");p.href=v,p.download=`${i}_${String(c.pagina_numero||n).padStart(2,"0")}.jpg`,document.body.appendChild(p),p.click(),p.remove(),URL.revokeObjectURL(v),await new Promise(_=>setTimeout(_,300))}catch{window.open(c.imagen_url,"_blank")}}j("Descarga lista · "+r.length+" páginas")}catch{j("No se pudo descargar")}a&&(a.disabled=!1,a.textContent=o)};function nt(){s.mayaMsgs||(s.mayaMsgs=[]),B().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${s.mayaMsgs.length?s.mayaMsgs.map(ze).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",e=>{e.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const e=document.getElementById("maya-msgs");e&&(e.scrollTop=e.scrollHeight)},50)}function ze(e){if(e.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const t=(e.fotos||[]).map(a=>`<img src="${f(a)}" loading="lazy">`).join("");return`<div class="msg ${e.role==="me"?"me":"bot"}">${f(e.content)}${t}</div>`}function Ce(){const e=document.getElementById("maya-msgs");e&&(e.innerHTML=s.mayaMsgs.map(ze).join(""),e.scrollTop=e.scrollHeight)}function it(e){const t=[];let a=String(e||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(o,r)=>(t.push(r.replace(/[\[\]]/g,"")),""));return a=a.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:a||"👍",fotos:t}}window.__mayaSend=async()=>{const e=document.getElementById("maya-in");if(!e)return;const t=(e.value||"").trim();if(!t)return;e.value="",s.mayaMsgs||(s.mayaMsgs=[]);const a=s.mayaMsgs.filter(o=>!o.typing).map(o=>({role:o.role==="me"?"user":"assistant",content:o.content}));s.mayaMsgs.push({role:"me",content:t}),s.mayaMsgs.push({role:"bot",typing:!0}),Ce();try{const r=await(await fetch(h+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:t,historial:a})})).json();s.mayaMsgs.pop();const{texto:i,fotos:n}=it(r.respuesta);s.mayaMsgs.push({role:"bot",content:i,fotos:n})}catch{s.mayaMsgs.pop(),s.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}Ce()};let Ee=null;function j(e){const t=document.getElementById("toast");t&&(t.textContent=e,t.classList.add("show"),clearTimeout(Ee),Ee=setTimeout(()=>t.classList.remove("show"),1600))}window.abrirLightboxPC=function(e,t,a){if(!e)return;const o=document.getElementById("pc-lightbox");if(o&&o.remove(),!t||!t.length){const u=document.getElementById("pm-swatches");u&&(t=Array.from(u.querySelectorAll("img")).map($=>$.src)),(!t||!t.length)&&(t=[e]),t.includes(e)||(t=[e,...t])}let r=t.indexOf(e);r<0&&(r=0);const i=document.createElement("div");i.id="pc-lightbox",i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:19999;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none";let n=1,c=0,d=0,l=1,v=0;const p=()=>{n=1,c=0,d=0;const u=document.getElementById("lb-img");u&&(u.style.transform="",u.style.cursor="zoom-in")},_=()=>{const u=t.length;i.innerHTML=`
      <button onclick="document.getElementById('pc-lightbox').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      <button onclick="pcCompartirImagenLB()" title="Compartir esta foto" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.2rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">📤</button>
      <button onclick="pcDescargarImagenLB()" title="Descargar esta foto" style="position:absolute;top:16px;left:68px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.2rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">📥</button>
      ${u>1?`<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===0?.3:1}">‹</button>`:""}
      <img id="lb-img" src="${t[r]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none;cursor:zoom-in;transition:transform 0.1s ease-out">
      ${u>1?`<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===u-1?.3:1}">›</button>`:""}
      ${u>1?`<div style="display:flex;gap:6px;margin-top:14px;z-index:2">${t.map(($,w)=>`<div onclick="lbGoto(${w})" style="width:${w===r?"22px":"8px"};height:8px;border-radius:4px;background:${w===r?"#E91E8C":"rgba(255,255,255,0.3)"};cursor:pointer;transition:all 0.2s"></div>`).join("")}</div>`:""}
    `};window.pcCompartirImagenLB=async()=>{const u=t[r];if(u)try{const w=await(await fetch(u)).blob(),S=(w.type.split("/")[1]||"jpg").replace("jpeg","jpg"),P=new File([w],`zapatillasmay-${Date.now()}.${S}`,{type:w.type});navigator.canShare&&navigator.canShare({files:[P]})?await navigator.share({files:[P]}):navigator.share?await navigator.share({url:u}):window.pcDescargarImagenLB()}catch($){($==null?void 0:$.name)!=="AbortError"&&j("No se pudo compartir la imagen")}},window.pcDescargarImagenLB=async()=>{const u=t[r];if(u)try{const w=await(await fetch(u)).blob(),S=document.createElement("a");S.href=URL.createObjectURL(w);const P=a?a.replace(/[^A-Za-z0-9_-]/g,""):"";S.download=P?`Zapatillas_May_${P}.jpg`:`Zapatillas_May_${Date.now()}.jpg`,document.body.appendChild(S),S.click(),document.body.removeChild(S),URL.revokeObjectURL(S.href),j("Imagen descargada")}catch{window.open(u,"_blank")}},window.lbNav=u=>{u<0&&r===0||u>0&&r===t.length-1||(r=Math.max(0,Math.min(t.length-1,r+u)),p(),_(),E())},window.lbGoto=u=>{r=u,p(),_(),E()};const E=()=>{const u=document.getElementById("lb-img");if(!u)return;let $=!1,w=0,S=0,P=0;u.addEventListener("touchstart",y=>{if(y.touches.length===1){const z=new Date().getTime(),ie=z-P;if(ie<300&&ie>0){n>1?p():(n=2.5,u.style.transform=`scale(${n})`,u.style.cursor="grab"),y.preventDefault();return}P=z,n>1?($=!0,w=y.touches[0].clientX-c,S=y.touches[0].clientY-d):w=y.touches[0].clientX}else y.touches.length===2&&($=!1,l=n,v=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY))},{passive:!1}),u.addEventListener("touchmove",y=>{if(y.touches.length===1&&n>1&&$)y.preventDefault(),c=y.touches[0].clientX-w,d=y.touches[0].clientY-S,u.style.transform=`scale(${n}) translate(${c/n}px, ${d/n}px)`;else if(y.touches.length===2){y.preventDefault();const z=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY);n=Math.max(1,Math.min(4,l*(z/v))),n<=1?p():(u.style.transform=`scale(${n}) translate(${c/n}px, ${d/n}px)`,u.style.cursor="grab")}},{passive:!1}),u.addEventListener("touchend",y=>{if($)$=!1;else if(n===1&&y.changedTouches.length===1){const z=y.changedTouches[0].clientX-w;Math.abs(z)>50&&window.lbNav(z<0?1:-1)}},{passive:!0}),u.addEventListener("wheel",y=>{y.preventDefault();const z=y.deltaY*-.005;n=Math.max(1,Math.min(4,n+z)),n<=1?p():(u.style.transform=`scale(${n}) translate(${c/n}px, ${d/n}px)`,u.style.cursor="grab")},{passive:!1});let X=!1,ne=0,N=0;u.addEventListener("mousedown",y=>{n>1&&(X=!0,ne=y.clientX-c,N=y.clientY-d,u.style.cursor="grabbing")}),window.addEventListener("mousemove",y=>{X&&n>1&&(c=y.clientX-ne,d=y.clientY-N,u.style.transform=`scale(${n}) translate(${c/n}px, ${d/n}px)`)}),window.addEventListener("mouseup",()=>{X&&(X=!1,u&&(u.style.cursor="grab"))})};i.addEventListener("click",u=>{u.target===i&&i.remove()});const H=u=>{u.key==="ArrowRight"?window.lbNav(1):u.key==="ArrowLeft"?window.lbNav(-1):u.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",H))};document.addEventListener("keydown",H),i.addEventListener("remove",()=>document.removeEventListener("keydown",H)),_(),document.body.appendChild(i),E()};Ae();
