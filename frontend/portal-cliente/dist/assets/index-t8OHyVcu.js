(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();const h="/api",ft="portal_sesion",St="portal_carrito",ct=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],dt=document.getElementById("app"),s={sesion:null,data:null,carrito:[],tab:localStorage.getItem("pc_active_tab")||"tienda",filtroCat:"",busqueda:""},O=t=>parseFloat(t)||0,x=t=>"$"+Math.round(t).toLocaleString("es-MX"),m=t=>String(t??"").replace(/"/g,"&quot;").replace(/</g,"&lt;"),wt=t=>{try{const e=new URL(String(t??""),window.location.origin);return e.protocol==="http:"||e.protocol==="https:"?e.href:""}catch{return""}};function B(){var e;const t=(e=s.sesion)==null?void 0:e.token;return t?{"Content-Type":"application/json",Authorization:"Bearer "+t}:{"Content-Type":"application/json"}}function gt(t){return t&&t.status===401?(Mt(),!0):!1}function At(){var t;try{s.sesion=JSON.parse(localStorage.getItem(ft)||"null")}catch{s.sesion=null}try{s.carrito=JSON.parse(localStorage.getItem(St)||"[]")}catch{s.carrito=[]}(t=s.sesion)!=null&&t.cliente_id?Tt():ot()}let tt="telefono",V="pedir",K={};function ot(){const t=tt==="telefono",e=V==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${m(K.canal||(t?"WhatsApp":"correo"))}</b> a <b>${m(K.destino||"")}</b>
      ${K.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
    </p>
    <div class="field">
      <label>Código</label>
      <input id="l-codigo" type="text" inputmode="numeric" maxlength="6" placeholder="6 dígitos" autocomplete="one-time-code">
    </div>
    <button class="btn-primary" id="l-verify">Entrar</button>
    <p style="text-align:center;margin-top:12px;font-size:.78rem">
      <a href="#" id="l-resend" style="color:#c8a8de">Reenviar código</a>
      &nbsp;·&nbsp;
      <a href="#" id="l-back" style="color:#c8a8de">Cambiar ${t?"teléfono":"correo"}</a>
    </p>`:`
    <div class="field">
      <label>${t?"Teléfono":"Correo"}</label>
      <input id="l-dato" type="${t?"tel":"email"}" inputmode="${t?"numeric":"email"}" placeholder="${t?"10 dígitos":"tu@correo.com"}" autocomplete="${t?"tel":"email"}">
    </div>
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(dt.innerHTML=`
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${V==="pedir"?`
        <div class="login-tabs">
          <button class="${t?"on":""}" onclick="window.__loginMetodo('telefono')">📱 Teléfono</button>
          <button class="${t?"":"on"}" onclick="window.__loginMetodo('correo')">✉️ Correo</button>
        </div>`:""}

        ${e}

        <div class="or-sep"><span>o</span></div>
        <div id="g-login-btn" style="display:flex;justify-content:center;min-height:44px"></div>

        <p class="login-error" id="l-err"></p>
        <p style="text-align:center;margin-top:18px">
          <a href="#" id="l-demo" style="color:#c8a8de;font-size:.8rem;text-decoration:underline">Ver demo con datos reales (solo revisión)</a>
        </p>
      </div>
    </div>`,V==="pedir"){const a=document.getElementById("l-send");a&&(a.onclick=ut);const o=document.getElementById("l-dato");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&ut()})}else{const a=document.getElementById("l-verify");a&&(a.onclick=$t);const o=document.getElementById("l-codigo");o&&o.addEventListener("keydown",r=>{r.key==="Enter"&&$t()}),document.getElementById("l-resend").onclick=r=>{r.preventDefault(),ut()},document.getElementById("l-back").onclick=r=>{r.preventDefault(),V="pedir",ot()}}document.getElementById("l-demo").onclick=a=>{a.preventDefault(),Ht()},Ot()}window.__loginMetodo=t=>{tt=t,V="pedir",ot()};async function Ot(){var t;try{window._seoConfig||(window._seoConfig=await fetch(h+"/seo/config").then(o=>o.json()).catch(()=>({})));const e=(t=window._seoConfig)==null?void 0:t.google_client_id;if(!e||(await Nt(),typeof google>"u"))return;google.accounts.id.initialize({client_id:e,callback:Dt,auto_select:!1});const a=document.getElementById("g-login-btn");a&&google.accounts.id.renderButton(a,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function Nt(){return new Promise(t=>{var a,o;if((o=(a=window.google)==null?void 0:a.accounts)!=null&&o.id)return t();const e=document.createElement("script");e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,e.onload=t,e.onerror=t,document.head.appendChild(e)})}async function Dt(t){const e=t==null?void 0:t.credential;if(!e)return T("Error al conectar con Google");try{const a=await fetch(h+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:e})}),o=await a.json();if(!a.ok||!o.token)return T(o.error||"No se pudo entrar con Google");yt(o)}catch{T("Error conectando con Google")}}function T(t){const e=document.getElementById("l-err");e&&(e.textContent=t,e.style.display="block")}function yt(t){s.sesion={nombre:t.cliente.nombre,cliente_id:t.cliente.id,tipo:t.cliente.tipo,token:t.token,demo:!!t.demo},localStorage.setItem(ft,JSON.stringify(s.sesion)),Tt()}async function ut(){T("");const t=(document.getElementById("l-dato").value||"").trim();if(!t)return T(tt==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const e=document.getElementById("l-send");e.disabled=!0,e.textContent="Enviando...";try{const a=await fetch(h+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:tt,valor:t})}),o=await a.json();if(!a.ok){T(o.error||"No se pudo enviar el código"),e.disabled=!1,e.textContent="Enviarme un código";return}K={valor:t,destino:o.destino,canal:o.canal,enviado:o.enviado},V="codigo",ot()}catch{T("Error conectando con el servidor"),e.disabled=!1,e.textContent="Enviarme un código"}}async function $t(){T("");const t=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(t.length<4)return T("Escribe el código que te enviamos");const e=document.getElementById("l-verify");e.disabled=!0,e.textContent="Entrando...";try{const a=await fetch(h+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:tt,valor:K.valor,codigo:t})}),o=await a.json();if(!a.ok||!o.token){T(o.error||"Código incorrecto"),e.disabled=!1,e.textContent="Entrar";return}yt(o)}catch{T("Error conectando con el servidor"),e.disabled=!1,e.textContent="Entrar"}}async function Ht(){T("");try{const t=await fetch(h+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),e=await t.json();if(!t.ok||!e.token)return T(e.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":e.error||"No se pudo cargar el demo");yt(e)}catch{T("Error cargando demo")}}function Mt(){localStorage.removeItem(ft),s.sesion=null,ot()}async function Tt(){dt.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[t,e,a,o]=await Promise.all([fetch(h+"/productos/").then(n=>n.json()),fetch(h+"/variantes/").then(n=>n.json()),fetch(h+"/inventario/").then(n=>n.json()).catch(()=>[]),fetch(h+"/portal/pedidos",{headers:B()}).then(n=>n.ok?n.json():[]).catch(()=>[])]),r={};(Array.isArray(a)?a:[]).forEach(n=>{r[n.variante_id]=(r[n.variante_id]||0)+(n.cantidad||0)}),s.data={productos:(Array.isArray(t)?t:[]).filter(n=>n.activo&&!/^oferta/i.test(n.nombre||"")&&!/^oferta/i.test(n.sku_interno||"")).map(n=>Rt(n)),variantes:Array.isArray(e)?e:[],stockPorVar:r};try{await Kt(o)}catch{}qt();try{const n=localStorage.getItem("pc_active_product_id");n&&jt(n)}catch{}}catch{dt.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function Rt(t){const e=O(t.precio_menudeo);return{...t,precio_menudeo:e,precio_mayoreo3:O(t.precio_mayoreo3)||e-30,precio_mayoreo6:O(t.precio_mayoreo6)||e-70,precio_corrida:O(t.precio_corrida)||e-100}}function qt(){dt.innerHTML=`
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
    <div id="toast" class="toast"></div>`,J(s.tab||"tienda")}function q(){const t=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],e=et();return`<div class="bottomnav">${t.map(a=>`
    <button data-tab="${a.id}" class="${s.tab===a.id?"active":""}" onclick="window.__nav('${a.id}')">
      <span class="ic">${a.ic}${a.id==="carrito"&&e?`<span class="badge">${e}</span>`:""}</span>
      <span>${a.label}</span>
    </button>`).join("")}</div>`}window.__nav=J;function J(t,e){var r;if(!e&&s.tab&&s.tab!==t&&window._zmPushBack){const n=s.tab;window._zmPushBack(()=>J(n,!0))}s.tab=t;try{localStorage.setItem("pc_active_tab",t)}catch{}const a=document.querySelector(".bottomnav");a&&(a.outerHTML=q());const o=document.getElementById("tb-sub");o&&(o.textContent=(r=s.sesion)!=null&&r.nombre?`Hola, ${s.sesion.nombre.split(" ")[0]}`:""),t==="carrito"?Vt():ht(),t==="inicio"?Ft():t==="tienda"?Lt():t==="catalogos"?ae():t==="carrito"?W():t==="pedidos"?te():t==="maya"?ie():t==="cuenta"&&oe()}const A=()=>document.getElementById("page");async function Ft(){var a,o;const t=et(),e=bt();A().innerHTML=`
    ${(a=s.sesion)!=null&&a.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${m(s.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${t?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${x(e)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${t} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`:`<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${m(((o=s.sesion)==null?void 0:o.tipo)||"mayoreo")}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`}function Lt(){const t=[...new Set(s.data.productos.map(e=>e.categoria).filter(Boolean))];A().innerHTML=`
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${m(s.busqueda)}">
    <div class="chips">
      <button class="${s.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${t.map(e=>`<button class="${s.filtroCat===e?"active":""}" onclick="window.__filtro('${e}')">${e[0].toUpperCase()+e.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>`,document.getElementById("cat-search").addEventListener("input",e=>{s.busqueda=e.target.value,xt()}),xt()}window.__filtro=t=>{s.filtroCat=t,Lt()};function xt(){const t=s.busqueda.trim().toLowerCase();let e=s.data.productos;s.filtroCat&&(e=e.filter(o=>o.categoria===s.filtroCat)),t&&(e=e.filter(o=>(o.nombre||"").toLowerCase().includes(t)||(o.sku_interno||"").toLowerCase().includes(t)));const a=document.getElementById("cat-grid");if(a){if(!e.length){a.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}a.innerHTML=e.slice(0,120).map(o=>`
    <div class="card" onclick="window.__abrir('${o.id}')">
      ${o.imagen_principal?`<img class="thumb" src="${o.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
      <div class="body">
        <div class="name">${m(o.nombre)}</div>
        <div class="sku">${m(o.sku_interno||"")}</div>
        <div class="price">${x(o.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${x(o.precio_mayoreo3)}</span>
          <span class="tier">6+ ${x(o.precio_mayoreo6)}</span>
          ${Gt(o.id)?`<span class="tier corr">Corr ${x(o.precio_corrida)}</span>`:""}
        </div>
      </div>
    </div>`).join("")}}let C={productoId:null,color:null,modo:"variado"},I=1;window.__abrir=jt;function Gt(t){const e=s.data.variantes.filter(o=>o.producto_id===t),a=[...new Set(e.map(o=>o.color).filter(Boolean))];return a.length?a.some(o=>Ut(t,o)):!1}function Ut(t,e){return at(t,e)>=1}function at(t,e){if(!e)return 0;const a=s.data.variantes.filter(n=>n.producto_id===t&&n.color===e);if(!a.length)return 0;const o=a.some(n=>n.talla&&(n.talla.includes(".5")||n.talla.includes("½")||n.talla.includes("/")));let r=0;for(let n=1;n<=6;n++)if(o){if(a.filter(d=>(s.data.stockPorVar[d.id]||0)>=n).length>=6){r=n;continue}let c=0;if(a.forEach(d=>{const l=s.data.stockPorVar[d.id]||0;c+=Math.min(l,2*n)}),c>=6*n)r=n;else break}else{let i=0;if(a.forEach(c=>{const d=s.data.stockPorVar[c.id]||0;i+=Math.min(d,2*n)}),i>=6*n)r=n;else break}return r}function It(t,e,a){const o=s.data.variantes.filter(c=>c.producto_id===t&&c.color===e).sort((c,d)=>ct.indexOf(c.talla)-ct.indexOf(d.talla)),r=o.some(c=>c.talla&&(c.talla.includes(".5")||c.talla.includes("½")||c.talla.includes("/"))),n={};if(r){const c=o.filter(d=>(s.data.stockPorVar[d.id]||0)>=a);if(c.length>=6)return c.slice(0,6).forEach(d=>{n[d.id]=a}),n}let i=6*a;for(const c of o){const d=s.data.stockPorVar[c.id]||0,l=Math.min(d,2*a,i);if(l>0&&(n[c.id]=l,i-=l),i<=0)break}return n}function jt(t){const e=s.data.productos.find(n=>n.id===t);if(!e)return;const a=s.data.variantes.filter(n=>n.producto_id===t),o=[...new Set(a.map(n=>n.color).filter(Boolean))];C={productoId:t,color:o[0]||null,modo:"variado"},I=1;const r=document.createElement("div");r.className="modal-overlay",r.id="pmodal",r.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${e.imagen_principal?`<img id="pm-img" src="${e.imagen_principal}" onclick="window.abrirLightboxPC(this.src, null, '${m(String(e.nombre||"").split(" ")[0])}')" style="cursor:zoom-in">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${m(e.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${m(e.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${x(e.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${x(e.precio_mayoreo3)}</span>
            <span class="tier">6+ ${x(e.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${x(e.precio_corrida)}</span>
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
          ${o.map(n=>{var l;const i=a.filter(v=>v.color===n),c=i.map(v=>v.foto_url).find(Boolean),d=((l=i[0])==null?void 0:l.color_hex)||"#999";return`<div class="swatch ${n===C.color?"active":""}" data-color="${m(n)}" onclick="window.__pickColor('${m(n)}')">
              ${c?`<img src="${c}">`:`<div class="hex" style="background:${d}"></div>`}
              <span>${m(n)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="history.back(); setTimeout(() => window.__nav('carrito'), 50)">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(r),r.addEventListener("click",n=>{n.target===r&&history.back()}),window._zmPushBack&&window._zmPushBack(()=>{const n=document.getElementById("pmodal");n&&n.remove();try{localStorage.removeItem("pc_active_product_id")}catch{}});try{localStorage.setItem("pc_active_product_id",t)}catch{}C.color&&(zt(),it())}function zt(){const t=document.getElementById("pm-mode");if(!t)return;const{productoId:e,color:a}=C,r=at(e,a)>=1,n=document.getElementById("pm-tier-corr");if(n&&(n.style.display=r?"":"none"),!r)C.modo==="corrida"&&(C.modo="variado"),t.innerHTML=`
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `;else{const i=C.modo;t.innerHTML=`
      <button data-modo="variado" class="${i==="variado"?"on":""}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${i==="corrida"?"on":""}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `}}window.__pickColor=t=>{C.color=t,I=1,document.querySelectorAll("#pm-swatches .swatch").forEach(r=>r.classList.toggle("active",r.dataset.color===t));const a=s.data.variantes.filter(r=>r.producto_id===C.productoId&&r.color===t).map(r=>r.foto_url).find(Boolean),o=document.getElementById("pm-img");o&&a&&(o.src=a),zt(),it()};window.__modoModal=t=>{C.modo=t,I=1,document.querySelectorAll("#pm-mode button").forEach(e=>e.classList.toggle("on",e.dataset.modo===t)),it()};function Xt(){const{productoId:t,color:e}=C;return s.data.variantes.filter(a=>a.producto_id===t&&a.color===e).sort((a,o)=>ct.indexOf(a.talla)-ct.indexOf(o.talla))}function it(){const t=document.getElementById("pm-tallas");if(!t)return;const{color:e,modo:a,productoId:o}=C,r=s.data.productos.find(c=>c.id===o),n=Xt(),i=document.getElementById("pm-tallas-label");if(a==="corrida"){const c=at(o,e);I>c&&(I=Math.max(1,c)),i&&(i.textContent=`Corrida completa — ${e} · ${x(r.precio_corrida)} x par`),t.className="corrida-rows",t.innerHTML=`
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
    `}else i&&(i.textContent="Tallas — "+e),t.className="tallas",t.innerHTML=n.map(c=>{var v;const d=s.data.stockPorVar[c.id]||0,l=((v=s.carrito.find(f=>f.variante_id===c.id&&!f.es_corrida))==null?void 0:v.cantidad)||0;return`<button class="talla ${l?"on":""}" ${d<=0?"disabled":""} onclick="window.__addTalla('${c.id}')">
        <span class="t">${c.talla}</span>
        <span class="s">${d<=0?"Agotado":"Stock "+d}</span>
        ${l?`<span class="q">${l}</span>`:""}
      </button>`}).join("");Yt()}function Yt(){const t=document.getElementById("pm-foot");t&&(C.modo==="corrida"?t.innerHTML=`
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${I} ${I===1?"corrida":"corridas"} (${I*6} pares)</button>
    `:t.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`)}window.__changeCorridaM=t=>{const{productoId:e,color:a}=C,o=at(e,a);I=Math.min(o,Math.max(1,I+t)),it()};window.__agregarCorrida=()=>{const{productoId:t,color:e}=C,a=s.data.productos.find(i=>i.id===t),o=It(t,e,I);let r=0;if(Object.entries(o).forEach(([i,c])=>{if(c<=0)return;const d=s.data.variantes.find(v=>v.id===i),l=s.carrito.find(v=>v.variante_id===i&&v.es_corrida);l?l.cantidad+=c:s.carrito.push({variante_id:i,producto_id:a.id,nombre:a.nombre,color:d.color,talla:d.talla,cantidad:c,es_corrida:!0,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:d.foto_url||a.imagen_principal||null,sku:a.sku_interno||null}),r+=c}),!r){j("Elige al menos una corrida");return}I=1,U(),document.getElementById("pmodal")?(history.back(),setTimeout(()=>J("carrito"),50)):J("carrito"),j("Corrida agregada · "+r+" pares")};window.__addTalla=t=>{const e=s.data.variantes.find(i=>i.id===t),a=s.data.productos.find(i=>i.id===e.producto_id),o=s.data.stockPorVar[t]||0,r=s.carrito.find(i=>i.variante_id===t&&!i.es_corrida);if(((r==null?void 0:r.cantidad)||0)>=o){j("Sin más stock ("+o+")");return}r?r.cantidad+=1:s.carrito.push({variante_id:t,producto_id:a.id,nombre:a.nombre,color:e.color,talla:e.talla,cantidad:1,es_corrida:!1,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:e.foto_url||a.imagen_principal||null,sku:a.sku_interno||null}),U(),it(),document.querySelector(".bottomnav").outerHTML=q(),j("Agregado · "+et()+" pares")};function et(){return s.carrito.reduce((t,e)=>t+e.cantidad,0)}function vt(){return s.carrito.filter(t=>!t.es_corrida).reduce((t,e)=>t+e.cantidad,0)}function mt(t,e){return t.es_corrida?t.precio_corrida:e>=6?t.precio_mayoreo6:e>=3?t.precio_mayoreo3:t.precio_menudeo}function bt(){const t=vt();return s.carrito.reduce((e,a)=>e+a.cantidad*mt(a,t),0)}const lt="[carrito-respaldo]";let R=null,kt=null,st=null,Q=null;function ht(){st&&(clearInterval(st),st=null),Q&&(window.removeEventListener("focus",Q),Q=null)}function Vt(){ht();const t=()=>Jt();st=setInterval(t,8e3),Q=t,window.addEventListener("focus",Q)}async function Jt(){var e;if(s.tab!=="carrito"||!((e=s.sesion)!=null&&e.cliente_id)){ht();return}const t=document.activeElement;if(!(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA")))try{const a=await fetch(h+"/portal/pedidos",{headers:B()}).then(c=>c.ok?c.json():null),o=(Array.isArray(a)?a:[]).find(c=>c.notes===lt),r=(o==null?void 0:o.pedido_items)||[],n=JSON.stringify(s.carrito.map(c=>[c.variante_id,c.cantidad,c.precio_unitario||c.precio_menudeo||0])),i=JSON.stringify(r.map(c=>{var d;return[c.variante_id||((d=c.variantes)==null?void 0:d.id),c.cantidad,c.precio_unitario]}));if(n===i)return;R=(o==null?void 0:o.id)||null,s.carrito=r.map(c=>{var v;const d=c.variantes,l=s.data.productos.find(f=>f.id===((d==null?void 0:d.producto_id)||c.producto_id));return{producto_id:(d==null?void 0:d.producto_id)||c.producto_id,variante_id:(d==null?void 0:d.id)||c.variante_id,nombre:((v=d==null?void 0:d.productos)==null?void 0:v.nombre)||c.nombre||(l==null?void 0:l.nombre)||"Producto",color:(d==null?void 0:d.color)||c.color,talla:(d==null?void 0:d.talla)||c.talla,cantidad:c.cantidad,es_corrida:!!c.es_corrida,precio_menudeo:(l==null?void 0:l.precio_menudeo)||0,precio_mayoreo3:(l==null?void 0:l.precio_mayoreo3)||0,precio_mayoreo6:(l==null?void 0:l.precio_mayoreo6)||0,precio_corrida:(l==null?void 0:l.precio_corrida)||0,imagen:(d==null?void 0:d.foto_url)||(l==null?void 0:l.imagen_principal)||null,sku:(l==null?void 0:l.sku_interno)||c.sku||null}}),_t(),s.tab==="carrito"&&W()}catch{}}function _t(){try{localStorage.setItem(St,JSON.stringify(s.carrito))}catch{}const t=document.querySelector(".bottomnav");t&&(t.outerHTML=q())}function U(){_t(),Wt()}function Wt(){clearTimeout(kt),kt=setTimeout(()=>{Zt().catch(()=>{})},1500)}async function Zt(){var e,a;if(!((e=s.sesion)!=null&&e.cliente_id))return;if(!s.carrito.length){if(R){const o=R;R=null,fetch(`${h}/pedidos/${o}/cancelar`,{method:"POST",headers:B()}).catch(()=>{})}return}let t=R;if(!t)try{const o=await fetch(h+"/portal/pedidos",{headers:B()}).then(n=>n.ok?n.json():[]),r=(Array.isArray(o)?o:[]).find(n=>n.notas===lt);r&&(t=r.id,R=t)}catch{}if(!t){const o=await fetch(`${h}/pedidos`,{method:"POST",headers:{"Content-Type":"application/json",...B()},body:JSON.stringify({cliente_id:s.sesion.cliente_id,status:"borrador",canal:"portal_mayoreo",total:0,notas:lt})});if(!o.ok)return;const r=await o.json();if(t=Array.isArray(r)?(a=r[0])==null?void 0:a.id:r==null?void 0:r.id,!t)return;R=t}try{const o=await fetch(`${h}/pedidos/${t}/items`,{headers:B()}).then(n=>n.ok?n.json():[]);for(const n of Array.isArray(o)?o:[])await fetch(`${h}/pedidos/${t}/items/${n.id}`,{method:"DELETE",headers:B()}).catch(()=>{});for(const n of s.carrito){const i=s.carrito.reduce((l,v)=>l+v.cantidad,0),c=s.data.productos.find(l=>l.id===n.producto_id);let d=n.precio_menudeo||0;c&&(n.es_corrida?d=c.precio_corrida:i>=6?d=c.precio_mayoreo6:i>=3&&(d=c.precio_mayoreo3)),await fetch(`${h}/pedidos/${t}/items`,{method:"POST",headers:{"Content-Type":"application/json",...B()},body:JSON.stringify({variante_id:n.variante_id,cantidad:n.cantidad,precio_unitario:d,subtotal:n.cantidad*d,nombre:n.nombre,color:n.color,talla:n.talla,es_corrida:!!n.es_corrida})}).catch(()=>{})}const r=bt();await fetch(`${h}/pedidos/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json",...B()},body:JSON.stringify({total:r})}).catch(()=>{})}catch{}}async function Kt(t){const e=(Array.isArray(t)?t:[]).find(r=>r.notas===lt);if(!e)return;R=e.id;const a=e.pedido_items||[];if(!a.length)return;const o=[];a.forEach(r=>{var c;const n=r.variantes;if(!n||!n.id)return;const i=s.data.productos.find(d=>d.id===n.producto_id);o.push({producto_id:n.producto_id,variante_id:n.id,nombre:((c=n.productos)==null?void 0:c.nombre)||r.nombre||(i==null?void 0:i.nombre)||"Producto",color:n.color||r.color,talla:n.talla||r.talla,cantidad:r.cantidad,es_corrida:!!r.es_corrida,precio_menudeo:(i==null?void 0:i.precio_menudeo)||0,precio_mayoreo3:(i==null?void 0:i.precio_mayoreo3)||0,precio_mayoreo6:(i==null?void 0:i.precio_mayoreo6)||0,precio_corrida:(i==null?void 0:i.precio_corrida)||0,imagen:n.foto_url||(i==null?void 0:i.imagen_principal)||null,sku:(i==null?void 0:i.sku_interno)||r.sku||null})}),o.length&&(s.carrito=o,_t())}function Qt(){const t=vt();return s.carrito.every(e=>e.es_corrida)&&s.carrito.length?"Corrida":t>=6?"Mayoreo 6+":t>=3?"Mayoreo 3+":"Menudeo"}function W(){if(!s.carrito.length){A().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const t=vt(),e=bt(),a=s.carrito.filter(i=>!i.es_corrida),o=s.carrito.filter(i=>i.es_corrida),r={};o.forEach(i=>{const c=`${i.producto_id}-${i.color}`;r[c]||(r[c]={key:c,es_grupo_corrida:!0,producto_id:i.producto_id,color:i.color,nombre:i.nombre,imagen:i.imagen,precio_corrida:i.precio_corrida,cantidad:0,items:[]}),r[c].cantidad+=i.cantidad,r[c].items.push(i)});const n=[...a.map((i,c)=>({...i,originalIdx:s.carrito.indexOf(i)})),...Object.values(r)];A().innerHTML=`
    <p class="section-title">${et()} pares · ${Qt()}</p>
    ${n.map(i=>i.es_grupo_corrida?`
          <div class="row">
            <div class="r-top">
              ${i.imagen?`<img src="${i.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${m(String(i.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${m(i.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${x(i.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${i.producto_id}', '${m(i.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${m(i.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${m(i.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${x(i.cantidad*i.precio_corrida)}</span>
            </div>
          </div>
        `:`
          <div class="row">
            <div class="r-top">
              ${i.imagen?`<img src="${i.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${m(String(i.nombre||"").split(" ")[0])}</div>
                <div class="muted" style="font-size:.78rem">${m(i.color)} · T${m(i.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${x(mt(i,t))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${i.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${i.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qty(${i.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${x(i.cantidad*mt(i,t))}</span>
            </div>
          </div>
        `).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${et()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${x(e)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(t,e)=>{const a=s.carrito[t];if(a){if(e>0){const o=s.data.stockPorVar[a.variante_id]||0;if(s.carrito.filter(n=>n.variante_id===a.variante_id).reduce((n,i)=>n+i.cantidad,0)>=o){j("Sin más stock ("+o+")");return}}a.cantidad=Math.max(1,a.cantidad+e),U(),W(),document.querySelector(".bottomnav").outerHTML=q()}};window.__delItem=t=>{s.carrito.splice(t,1),U(),W(),document.querySelector(".bottomnav").outerHTML=q()};window.__qtyGrupoCorrida=(t,e,a)=>{const i=s.carrito.filter(f=>f.producto_id===t&&f.color===e&&f.es_corrida).reduce((f,_)=>f+_.cantidad,0)/6+a;if(i<=0){window.__delGrupoCorrida(t,e);return}const c=at(t,e);if(i>c){j(`Sin existencias para ${i} corridas (máximo ${c})`);return}const d=It(t,e,i);s.carrito=s.carrito.filter(f=>!(f.producto_id===t&&f.color===e&&f.es_corrida));const l=s.data.productos.find(f=>f.id===t);Object.entries(d).forEach(([f,_])=>{if(_<=0)return;const E=s.data.variantes.find(N=>N.id===f);s.carrito.push({variante_id:f,producto_id:l.id,nombre:l.nombre,color:E.color,talla:E.talla,cantidad:_,es_corrida:!0,precio_menudeo:l.precio_menudeo,precio_mayoreo3:l.precio_mayoreo3,precio_mayoreo6:l.precio_mayoreo6,precio_corrida:l.precio_corrida,imagen:E.foto_url||l.imagen_principal||null})}),U(),W();const v=document.querySelector(".bottomnav");v&&(v.outerHTML=q())};window.__delGrupoCorrida=(t,e)=>{s.carrito=s.carrito.filter(o=>!(o.producto_id===t&&o.color===e&&o.es_corrida)),U(),W();const a=document.querySelector(".bottomnav");a&&(a.outerHTML=q())};window.__enviarPedido=async()=>{var t;if(s.carrito.length){if((t=s.sesion)!=null&&t.demo){j("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const e=await fetch(h+"/portal/carrito",{method:"POST",headers:B(),body:JSON.stringify({items:s.carrito.map(o=>({variante_id:o.variante_id,cantidad:o.cantidad,es_corrida:!!o.es_corrida}))})});if(gt(e))return;const a=await e.json();if(!e.ok||!a.ok)throw new Error(a.error||"");s.carrito=[],U(),j(a.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),J("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function te(){A().innerHTML='<div class="spinner">Cargando pedidos…</div>';let t=[];try{const e=await fetch(h+"/portal/pedidos",{headers:B()});if(gt(e))return;t=await e.json()}catch{}if(t=Array.isArray(t)?t.filter(e=>e.status!=="borrador"):[],!t.length){A().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}A().innerHTML=t.map(e=>{const a=e.pedido_items||[],o=a.reduce((n,i)=>n+(i.cantidad||0),0),r=e.created_at?new Date(e.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(e.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${r} · ${o} pares</div>
        </div>
        ${ee(e.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${x(O(e.total))}</div>
      ${a.slice(0,4).map(n=>{var i,c;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${m(((c=(i=n.variantes)==null?void 0:i.productos)==null?void 0:c.nombre)||n.nombre||"Producto")} ${n.color?"· "+m(n.color):""} T${m(n.talla||"")} ×${n.cantidad}</div>`}).join("")}
      ${a.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${a.length-4} más…</div>`:""}
      ${e.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${m(e.paqueteria||"Envío")} · Guía ${m(e.numero_guia)}</div>
        ${wt(e.tracking_url)?`<a href="${m(wt(e.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function ee(t){const e={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[a,o,r]=e[t]||["#f3f4f6","#374151",t||"—"];return`<span class="badge-status" style="background:${a};color:${o}">${r}</span>`}async function oe(){A().innerHTML='<div class="spinner">Cargando…</div>';let t=null;try{const e=await fetch(h+"/portal/me",{headers:B()});if(gt(e))return;t=await e.json()}catch{}t=t||{nombre:s.sesion.nombre,tipo:s.sesion.tipo},A().innerHTML=`
    <div class="row">
      <p class="section-title">Mis datos</p>
      <p style="font-weight:700;margin:0 0 2px">${m(t.nombre||"")}</p>
      <p class="muted" style="font-size:.84rem;margin:0">${m(t.telefono||"Sin teléfono")}</p>
      <p class="muted" style="font-size:.84rem;margin:2px 0 0">${m(t.email||"Sin correo")}</p>
      <p style="margin:10px 0 0"><span class="badge-status" style="background:#fce4f3;color:var(--pink)">Cliente ${m(t.tipo||"mayoreo")}</span></p>
    </div>
    ${t.direccion||t.ciudad?`<div class="row">
      <p class="section-title">Dirección</p>
      <p class="muted" style="font-size:.84rem;margin:0">${m(t.direccion||"")} ${m(t.ciudad||"")} ${m(t.estado||"")} ${m(t.codigo_postal||"")}</p>
    </div>`:""}
    ${O(t.limite_credito)||O(t.credito_disponible)?`<div class="row">
      <p class="section-title">Crédito</p>
      ${O(t.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${x(O(t.limite_credito))}</b>${t.dias_credito?" · "+t.dias_credito+" días":""}</p>`:""}
      ${O(t.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${x(O(t.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=Mt;async function ae(){A().innerHTML='<div class="spinner">Cargando catálogos…</div>';let t=[];try{t=await fetch(h+"/catalogos/").then(o=>o.json())}catch{}t=Array.isArray(t)?t:[];const e=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],a=t.length?t.map(o=>`
    <div class="cat-card">
      ${o.portada_url?`<img src="${o.portada_url}" loading="lazy">`:'<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>'}
      <div class="info">
        <h3>${m(o.nombre||"Catálogo")}</h3>
        <div class="muted" style="font-size:.78rem">${m(o.temporada||"")}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${o.id}','${m(o.nombre||"")}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${o.id}','${m(o.nombre||"")}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join(""):'<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>';A().innerHTML=`
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
        ${e.map(([o,r])=>`
          <button class="category-btn" data-categoria="${o}" data-label="${r.replace(/^[^\s]+\s/,"")}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${r.split(" ")[0]}</span>
            <span class="label">${r.split(" ")[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`}window.__switchSubTab=t=>{const e=document.getElementById("catalogos-general-content"),a=document.getElementById("catalogos-categorias-content"),o=document.getElementById("btn-cat-general"),r=document.getElementById("btn-cat-categorias");t==="categorias"?(e&&(e.style.display="none"),a&&(a.style.display="block"),o&&o.classList.remove("active"),r&&r.classList.add("active")):(e&&(e.style.display="block"),a&&(a.style.display="none"),o&&o.classList.add("active"),r&&r.classList.remove("active"))};window.__descargarPdfCategorias=async t=>{const e=t.getAttribute("data-categoria"),a=t.getAttribute("data-label"),o=document.getElementById("cat-pdf-msg"),r=document.querySelectorAll("#cat-pdf-btns button");r.forEach(n=>n.disabled=!0),o&&(o.style.display="block",o.textContent=`⏳ Cargando productos de ${a}...`);try{const n=s.data.productos.filter(u=>u.categoria&&String(u.categoria).trim().toLowerCase()===String(e).trim().toLowerCase());if(!n.length){o&&(o.textContent=`Sin productos activos en ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(u=>u.disabled=!1);return}const i=[];if(n.forEach(u=>{const k=s.data.variantes.filter(g=>g.producto_id===u.id&&g.activa!==!1),b=new Set;k.forEach(g=>{if(!g.color||b.has(g.color.trim().toUpperCase()))return;b.add(g.color.trim().toUpperCase());const L=g.foto_url||u.imagen_principal;L&&i.push({sku:u.sku_interno||"S/K",color:g.color.trim().toUpperCase(),imgUrl:L})}),b.size===0&&u.imagen_principal&&i.push({sku:u.sku_interno||"S/K",color:"ÚNICO",imgUrl:u.imagen_principal})}),!i.length){o&&(o.textContent=`Sin fotos disponibles para ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),r.forEach(u=>u.disabled=!1);return}o&&(o.textContent=`✏️ Generando catálogo PDF (${i.length} variantes)...`),window.jspdf||await new Promise((u,k)=>{const b=document.createElement("script");b.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",b.onload=u,b.onerror=k,document.head.appendChild(b)});const{jsPDF:c}=window.jspdf,d=2,l=3,v=d*l,f=1080,_=1440,E=40,N=80,p=24,$=32,w=(f-E*2-p*(d-1))/d,S=(_-N*2-$*(l-1))/l,z=S-50,X=u=>new Promise(k=>{if(!u)return k(null);const b=new Image;b.crossOrigin="anonymous",b.onload=()=>k(b),b.onerror=()=>k(null),b.src=u+(u.includes("?")?"&":"?")+"_t="+Date.now()}),nt=(u,k,b,g,L,M)=>{if(u.save(),u.fillStyle="#FFFFFF",u.fillRect(b,g,L,M),k){u.beginPath(),u.rect(b,g,L,M),u.clip();const F=k.naturalWidth/k.naturalHeight,pt=L/M;let Y,H,G,Z;F>pt?(H=M,Y=M*F,Z=g,G=b+(L-Y)/2):(Y=L,H=L/F,G=b,Z=g+(M-H)/2),u.drawImage(k,G,Z,Y,H)}else u.fillStyle="#F3F4F6",u.fillRect(b,g,L,M),u.fillStyle="#9CA3AF",u.font="20px sans-serif",u.textAlign="center",u.fillText("Sin imagen",b+L/2,g+M/2);u.restore()},D=[];for(let u=0;u<i.length;u+=v)D.push(i.slice(u,u+v));const y=new c({orientation:"portrait",unit:"px",format:[f,_]});let P=!0;for(let u=0;u<D.length;u++){o&&(o.textContent=`✏️ Generando página ${u+1} de ${D.length}...`);const k=D[u],b=document.createElement("canvas");b.width=f,b.height=_;const g=b.getContext("2d");g.fillStyle="#FAFAF8",g.fillRect(0,0,f,_),g.fillStyle="#2A1A0E",g.font="300 20px sans-serif",g.textAlign="center",g.letterSpacing="4px",g.fillText(`CATÁLOGO DE ${a.toUpperCase()}`,f/2,38),g.letterSpacing="0px",g.fillStyle="#C8967A",g.fillRect(E,48,f-E*2,1.5);for(let M=0;M<k.length;M++){const F=k[M],pt=M%d,Y=Math.floor(M/d),H=E+pt*(w+p),G=N+Y*(S+$),Z=await X(F.imgUrl);nt(g,Z,H,G,w,z),g.fillStyle="#E8DDD5",g.fillRect(H,G+z,w,1),g.fillStyle="#2A1A0E",g.textAlign="center",g.font="600 18px sans-serif",g.fillText(`${F.sku} ${F.color}`,H+w/2,G+z+28)}g.fillStyle="#C8967A",g.fillRect(E,_-48,f-E*2,1),g.fillStyle="#A07860",g.font="300 14px sans-serif",g.textAlign="center",g.fillText(`Página ${u+1} de ${D.length}`,f/2,_-30);const L=b.toDataURL("image/jpeg",.9);P||y.addPage([f,_]),y.addImage(L,"JPEG",0,0,f,_),P=!1}const rt=`catalogo_${e}_${new Date().toISOString().slice(0,10)}.pdf`;y.save(rt),o&&(o.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{o.style.display="none"},4e3))}catch(n){console.error("Error generating PDF:",n),o&&(o.textContent=`❌ Error al generar el PDF: ${n.message}`)}finally{r.forEach(n=>n.disabled=!1)}};async function Pt(t){const e=await fetch(h+"/catalogos/"+t+"/paginas").then(a=>a.json()).catch(()=>[]);return Array.isArray(e)?e:[]}window.__verCatalogo=async(t,e)=>{const a=await Pt(t),o=document.createElement("div");o.className="modal-overlay",o.id="catv",o.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${m(e)}</div><div class="muted" style="font-size:.76rem">${a.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${a.length?a.map(r=>`<img src="${r.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${t}','${m(e)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(o),o.addEventListener("click",r=>{r.target===o&&o.remove()})};window.__descargarCatalogo=async(t,e,a)=>{const o=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Descargando…");try{const r=await Pt(t);if(!r.length){j("Este catálogo no tiene páginas"),a&&(a.disabled=!1,a.textContent=o);return}const n=(e||"catalogo").replace(/[^\w]+/g,"_");let i=0;for(const c of r){i++;try{const l=await(await fetch(c.imagen_url)).blob(),v=URL.createObjectURL(l),f=document.createElement("a");f.href=v,f.download=`${n}_${String(c.pagina_numero||i).padStart(2,"0")}.jpg`,document.body.appendChild(f),f.click(),f.remove(),URL.revokeObjectURL(v),await new Promise(_=>setTimeout(_,300))}catch{window.open(c.imagen_url,"_blank")}}j("Descarga lista · "+r.length+" páginas")}catch{j("No se pudo descargar")}a&&(a.disabled=!1,a.textContent=o)};function ie(){s.mayaMsgs||(s.mayaMsgs=[]),A().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${s.mayaMsgs.length?s.mayaMsgs.map(Bt).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",t=>{t.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const t=document.getElementById("maya-msgs");t&&(t.scrollTop=t.scrollHeight)},50)}function Bt(t){if(t.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const e=(t.fotos||[]).map(a=>`<img src="${m(a)}" loading="lazy">`).join("");return`<div class="msg ${t.role==="me"?"me":"bot"}">${m(t.content)}${e}</div>`}function Ct(){const t=document.getElementById("maya-msgs");t&&(t.innerHTML=s.mayaMsgs.map(Bt).join(""),t.scrollTop=t.scrollHeight)}function ne(t){const e=[];let a=String(t||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(o,r)=>(e.push(r.replace(/[\[\]]/g,"")),""));return a=a.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:a||"👍",fotos:e}}window.__mayaSend=async()=>{const t=document.getElementById("maya-in");if(!t)return;const e=(t.value||"").trim();if(!e)return;t.value="",s.mayaMsgs||(s.mayaMsgs=[]);const a=s.mayaMsgs.filter(o=>!o.typing).map(o=>({role:o.role==="me"?"user":"assistant",content:o.content}));s.mayaMsgs.push({role:"me",content:e}),s.mayaMsgs.push({role:"bot",typing:!0}),Ct();try{const r=await(await fetch(h+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:e,historial:a})})).json();s.mayaMsgs.pop();const{texto:n,fotos:i}=ne(r.respuesta);s.mayaMsgs.push({role:"bot",content:n,fotos:i})}catch{s.mayaMsgs.pop(),s.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}Ct()};let Et=null;function j(t){const e=document.getElementById("toast");e&&(e.textContent=t,e.classList.add("show"),clearTimeout(Et),Et=setTimeout(()=>e.classList.remove("show"),1600))}window.abrirLightboxPC=function(t,e,a){if(!t)return;const o=document.getElementById("pc-lightbox");if(o&&o.remove(),!e||!e.length){const p=document.getElementById("pm-swatches");p&&(e=Array.from(p.querySelectorAll("img")).map($=>$.src)),(!e||!e.length)&&(e=[t]),e.includes(t)||(e=[t,...e])}let r=e.indexOf(t);r<0&&(r=0);const n=document.createElement("div");n.id="pc-lightbox",n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:19999;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none";let i=1,c=0,d=0,l=1,v=0;const f=()=>{i=1,c=0,d=0;const p=document.getElementById("lb-img");p&&(p.style.transform="",p.style.cursor="zoom-in")},_=()=>{const p=e.length;n.innerHTML=`
      <button onclick="history.back()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      <button onclick="pcCompartirImagenLB()" title="Compartir esta foto" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
      </button>
      <button onclick="pcDescargarImagenLB()" title="Descargar esta foto" style="position:absolute;top:16px;left:68px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </button>
      ${p>1?`<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===0?.3:1}">‹</button>`:""}
      <img id="lb-img" src="${e[r]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none;cursor:zoom-in;transition:transform 0.1s ease-out">
      ${p>1?`<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${r===p-1?.3:1}">›</button>`:""}
      ${p>1?`<div style="display:flex;gap:6px;margin-top:14px;z-index:2">${e.map(($,w)=>`<div onclick="lbGoto(${w})" style="width:${w===r?"22px":"8px"};height:8px;border-radius:4px;background:${w===r?"#E91E8C":"rgba(255,255,255,0.3)"};cursor:pointer;transition:all 0.2s"></div>`).join("")}</div>`:""}
    `};window.pcCompartirImagenLB=async()=>{const p=e[r];if(p)try{const w=await(await fetch(p)).blob(),S=(w.type.split("/")[1]||"jpg").replace("jpeg","jpg"),z=new File([w],`zapatillasmay-${Date.now()}.${S}`,{type:w.type});navigator.canShare&&navigator.canShare({files:[z]})?await navigator.share({files:[z]}):navigator.share?await navigator.share({url:p}):window.pcDescargarImagenLB()}catch($){($==null?void 0:$.name)!=="AbortError"&&j("No se pudo compartir la imagen")}},window.pcDescargarImagenLB=async()=>{const p=e[r];if(p)try{const w=await(await fetch(p)).blob(),S=document.createElement("a");S.href=URL.createObjectURL(w);const z=a?a.replace(/[^A-Za-z0-9_-]/g,""):"";S.download=z?`Zapatillas_May_${z}.jpg`:`Zapatillas_May_${Date.now()}.jpg`,document.body.appendChild(S),S.click(),document.body.removeChild(S),URL.revokeObjectURL(S.href),j("Imagen descargada")}catch{window.open(p,"_blank")}},window.lbNav=p=>{p<0&&r===0||p>0&&r===e.length-1||(r=Math.max(0,Math.min(e.length-1,r+p)),f(),_(),E())},window.lbGoto=p=>{r=p,f(),_(),E()};const E=()=>{const p=document.getElementById("lb-img");if(!p)return;let $=!1,w=0,S=0,z=0;p.addEventListener("touchstart",y=>{if(y.touches.length===1){const P=new Date().getTime(),rt=P-z;if(rt<300&&rt>0){i>1?f():(i=2.5,p.style.transform=`scale(${i})`,p.style.cursor="grab"),y.preventDefault();return}z=P,i>1?($=!0,w=y.touches[0].clientX-c,S=y.touches[0].clientY-d):w=y.touches[0].clientX}else y.touches.length===2&&($=!1,l=i,v=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY))},{passive:!1}),p.addEventListener("touchmove",y=>{if(y.touches.length===1&&i>1&&$)y.preventDefault(),c=y.touches[0].clientX-w,d=y.touches[0].clientY-S,p.style.transform=`scale(${i}) translate(${c/i}px, ${d/i}px)`;else if(y.touches.length===2){y.preventDefault();const P=Math.hypot(y.touches[0].clientX-y.touches[1].clientX,y.touches[0].clientY-y.touches[1].clientY);i=Math.max(1,Math.min(4,l*(P/v))),i<=1?f():(p.style.transform=`scale(${i}) translate(${c/i}px, ${d/i}px)`,p.style.cursor="grab")}},{passive:!1}),p.addEventListener("touchend",y=>{if($)$=!1;else if(i===1&&y.changedTouches.length===1){const P=y.changedTouches[0].clientX-w;Math.abs(P)>50&&window.lbNav(P<0?1:-1)}},{passive:!0}),p.addEventListener("wheel",y=>{y.preventDefault();const P=y.deltaY*-.005;i=Math.max(1,Math.min(4,i+P)),i<=1?f():(p.style.transform=`scale(${i}) translate(${c/i}px, ${d/i}px)`,p.style.cursor="grab")},{passive:!1});let X=!1,nt=0,D=0;p.addEventListener("mousedown",y=>{i>1&&(X=!0,nt=y.clientX-c,D=y.clientY-d,p.style.cursor="grabbing")}),window.addEventListener("mousemove",y=>{X&&i>1&&(c=y.clientX-nt,d=y.clientY-D,p.style.transform=`scale(${i}) translate(${c/i}px, ${d/i}px)`)}),window.addEventListener("mouseup",()=>{X&&(X=!1,p&&(p.style.cursor="grab"))})};n.addEventListener("click",p=>{p.target===n&&history.back()});const N=p=>{p.key==="ArrowRight"?window.lbNav(1):p.key==="ArrowLeft"?window.lbNav(-1):p.key==="Escape"&&history.back()};document.addEventListener("keydown",N),n.addEventListener("remove",()=>document.removeEventListener("keydown",N)),_(),document.body.appendChild(n),E(),window._zmPushBack&&window._zmPushBack(()=>{const p=document.getElementById("pc-lightbox");p&&p.remove(),document.removeEventListener("keydown",N)})};window._zmNavStack=[];window._zmPushBack=t=>{history.pushState({zmNav:window._zmNavStack.length+1},""),window._zmNavStack.push(t)};window.addEventListener("popstate",()=>{if(window._zmNavStack.length>0){const t=window._zmNavStack.pop();try{t()}catch{}}});At();
