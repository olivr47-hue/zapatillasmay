(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const w="/api",Q="portal_sesion",gt="portal_carrito",dt=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],G=document.getElementById("app"),i={sesion:null,data:null,carrito:[],tab:"tienda",filtroCat:"",busqueda:""},C=t=>parseFloat(t)||0,v=t=>"$"+Math.round(t).toLocaleString("es-MX"),l=t=>String(t??"").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Z(){var e;const t=(e=i.sesion)==null?void 0:e.token;return t?{"Content-Type":"application/json",Authorization:"Bearer "+t}:{"Content-Type":"application/json"}}function tt(t){return t&&t.status===401?(ft(),!0):!1}function xt(){var t;try{i.sesion=JSON.parse(localStorage.getItem(Q)||"null")}catch{i.sesion=null}try{i.carrito=JSON.parse(localStorage.getItem(gt)||"[]")}catch{i.carrito=[]}(t=i.sesion)!=null&&t.cliente_id?vt():q()}let N="telefono",B="pedir",H={};function q(){const t=N==="telefono",e=B==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${l(H.canal||(t?"WhatsApp":"correo"))}</b> a <b>${l(H.destino||"")}</b>
      ${H.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
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
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(G.innerHTML=`
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${B==="pedir"?`
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
    </div>`,B==="pedir"){const a=document.getElementById("l-send");a&&(a.onclick=Y);const o=document.getElementById("l-dato");o&&o.addEventListener("keydown",n=>{n.key==="Enter"&&Y()})}else{const a=document.getElementById("l-verify");a&&(a.onclick=lt);const o=document.getElementById("l-codigo");o&&o.addEventListener("keydown",n=>{n.key==="Enter"&&lt()}),document.getElementById("l-resend").onclick=n=>{n.preventDefault(),Y()},document.getElementById("l-back").onclick=n=>{n.preventDefault(),B="pedir",q()}}document.getElementById("l-demo").onclick=a=>{a.preventDefault(),Lt()},St()}window.__loginMetodo=t=>{N=t,B="pedir",q()};async function St(){var t;try{window._seoConfig||(window._seoConfig=await fetch(w+"/seo/config").then(o=>o.json()).catch(()=>({})));const e=(t=window._seoConfig)==null?void 0:t.google_client_id;if(!e||(await Tt(),typeof google>"u"))return;google.accounts.id.initialize({client_id:e,callback:Mt,auto_select:!1});const a=document.getElementById("g-login-btn");a&&google.accounts.id.renderButton(a,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function Tt(){return new Promise(t=>{var a,o;if((o=(a=window.google)==null?void 0:a.accounts)!=null&&o.id)return t();const e=document.createElement("script");e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,e.onload=t,e.onerror=t,document.head.appendChild(e)})}async function Mt(t){const e=t==null?void 0:t.credential;if(!e)return _("Error al conectar con Google");try{const a=await fetch(w+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:e})}),o=await a.json();if(!a.ok||!o.token)return _(o.error||"No se pudo entrar con Google");et(o)}catch{_("Error conectando con Google")}}function _(t){const e=document.getElementById("l-err");e&&(e.textContent=t,e.style.display="block")}function et(t){i.sesion={nombre:t.cliente.nombre,cliente_id:t.cliente.id,tipo:t.cliente.tipo,token:t.token,demo:!!t.demo},localStorage.setItem(Q,JSON.stringify(i.sesion)),vt()}async function Y(){_("");const t=(document.getElementById("l-dato").value||"").trim();if(!t)return _(N==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const e=document.getElementById("l-send");e.disabled=!0,e.textContent="Enviando...";try{const a=await fetch(w+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:N,valor:t})}),o=await a.json();if(!a.ok){_(o.error||"No se pudo enviar el código"),e.disabled=!1,e.textContent="Enviarme un código";return}H={valor:t,destino:o.destino,canal:o.canal,enviado:o.enviado},B="codigo",q()}catch{_("Error conectando con el servidor"),e.disabled=!1,e.textContent="Enviarme un código"}}async function lt(){_("");const t=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(t.length<4)return _("Escribe el código que te enviamos");const e=document.getElementById("l-verify");e.disabled=!0,e.textContent="Entrando...";try{const a=await fetch(w+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:N,valor:H.valor,codigo:t})}),o=await a.json();if(!a.ok||!o.token){_(o.error||"Código incorrecto"),e.disabled=!1,e.textContent="Entrar";return}et(o)}catch{_("Error conectando con el servidor"),e.disabled=!1,e.textContent="Entrar"}}async function Lt(){_("");try{const t=await fetch(w+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),e=await t.json();if(!t.ok||!e.token)return _(e.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":e.error||"No se pudo cargar el demo");et(e)}catch{_("Error cargando demo")}}function ft(){localStorage.removeItem(Q),i.sesion=null,q()}async function vt(){G.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[t,e,a]=await Promise.all([fetch(w+"/productos/").then(n=>n.json()),fetch(w+"/variantes/").then(n=>n.json()),fetch(w+"/inventario/").then(n=>n.json()).catch(()=>[])]),o={};(Array.isArray(a)?a:[]).forEach(n=>{o[n.variante_id]=(o[n.variante_id]||0)+(n.cantidad||0)}),i.data={productos:(Array.isArray(t)?t:[]).filter(n=>n.activo).map(n=>It(n)),variantes:Array.isArray(e)?e:[],stockPorVar:o},jt()}catch{G.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function It(t){const e=C(t.precio_menudeo);return{...t,precio_menudeo:e,precio_mayoreo3:C(t.precio_mayoreo3)||e-30,precio_mayoreo6:C(t.precio_mayoreo6)||e-70,precio_corrida:C(t.precio_corrida)||e-100}}function jt(){G.innerHTML=`
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
    ${A()}
    <div id="toast" class="toast"></div>`,V(i.tab||"tienda")}function A(){const t=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],e=D();return`<div class="bottomnav">${t.map(a=>`
    <button data-tab="${a.id}" class="${i.tab===a.id?"active":""}" onclick="window.__nav('${a.id}')">
      <span class="ic">${a.ic}${a.id==="carrito"&&e?`<span class="badge">${e}</span>`:""}</span>
      <span>${a.label}</span>
    </button>`).join("")}</div>`}window.__nav=V;function V(t){var o;i.tab=t;const e=document.querySelector(".bottomnav");e&&(e.outerHTML=A());const a=document.getElementById("tb-sub");a&&(a.textContent=(o=i.sesion)!=null&&o.nombre?`Hola, ${i.sesion.nombre.split(" ")[0]}`:""),t==="inicio"?Pt():t==="tienda"?yt():t==="catalogos"?Nt():t==="carrito"?at():t==="pedidos"?zt():t==="maya"?Dt():t==="cuenta"&&Ht()}const k=()=>document.getElementById("page");async function Pt(){var a,o;const t=D(),e=wt();k().innerHTML=`
    ${(a=i.sesion)!=null&&a.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${l(i.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${t?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${v(e)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${t} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`:`<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${l(((o=i.sesion)==null?void 0:o.tipo)||"mayoreo")}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`}function yt(){const t=[...new Set(i.data.productos.map(e=>e.categoria).filter(Boolean))];k().innerHTML=`
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${l(i.busqueda)}">
    <div class="chips">
      <button class="${i.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${t.map(e=>`<button class="${i.filtroCat===e?"active":""}" onclick="window.__filtro('${e}')">${e[0].toUpperCase()+e.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>`,document.getElementById("cat-search").addEventListener("input",e=>{i.busqueda=e.target.value,pt()}),pt()}window.__filtro=t=>{i.filtroCat=t,yt()};function pt(){const t=i.busqueda.trim().toLowerCase();let e=i.data.productos;i.filtroCat&&(e=e.filter(o=>o.categoria===i.filtroCat)),t&&(e=e.filter(o=>(o.nombre||"").toLowerCase().includes(t)||(o.sku_interno||"").toLowerCase().includes(t)));const a=document.getElementById("cat-grid");if(a){if(!e.length){a.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}a.innerHTML=e.slice(0,120).map(o=>`
    <div class="card" onclick="window.__abrir('${o.id}')">
      ${o.imagen_principal?`<img class="thumb" src="${o.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
      <div class="body">
        <div class="name">${l(o.nombre)}</div>
        <div class="sku">${l(o.sku_interno||"")}</div>
        <div class="price">${v(o.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${v(o.precio_mayoreo3)}</span>
          <span class="tier">6+ ${v(o.precio_mayoreo6)}</span>
          <span class="tier corr">Corr ${v(o.precio_corrida)}</span>
        </div>
      </div>
    </div>`).join("")}}let S={productoId:null,color:null,modo:"variado"},E={};window.__abrir=Bt;function Bt(t){const e=i.data.productos.find(r=>r.id===t);if(!e)return;const a=i.data.variantes.filter(r=>r.producto_id===t),o=[...new Set(a.map(r=>r.color).filter(Boolean))];S={productoId:t,color:o[0]||null,modo:"variado"},E={};const n=document.createElement("div");n.className="modal-overlay",n.id="pmodal",n.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${e.imagen_principal?`<img id="pm-img" src="${e.imagen_principal}">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${l(e.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${l(e.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${v(e.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${v(e.precio_mayoreo3)}</span>
            <span class="tier">6+ ${v(e.precio_mayoreo6)}</span>
            <span class="tier corr">Corrida ${v(e.precio_corrida)}</span>
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
          ${o.map(r=>{var g;const c=a.filter($=>$.color===r),p=c.map($=>$.foto_url).find(Boolean),u=((g=c[0])==null?void 0:g.color_hex)||"#999";return`<div class="swatch ${r===S.color?"active":""}" data-color="${l(r)}" onclick="window.__pickColor('${l(r)}')">
              ${p?`<img src="${p}">`:`<div class="hex" style="background:${u}"></div>`}
              <span>${l(r)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(n),n.addEventListener("click",r=>{r.target===n&&n.remove()}),S.color&&F()}window.__pickColor=t=>{S.color=t,E={},document.querySelectorAll("#pm-swatches .swatch").forEach(n=>n.classList.toggle("active",n.dataset.color===t));const a=i.data.variantes.filter(n=>n.producto_id===S.productoId&&n.color===t).map(n=>n.foto_url).find(Boolean),o=document.getElementById("pm-img");o&&a&&(o.src=a),F()};window.__modoModal=t=>{S.modo=t,E={},document.querySelectorAll("#pm-mode button").forEach(e=>e.classList.toggle("on",e.dataset.modo===t)),F()};function bt(){const{productoId:t,color:e}=S;return i.data.variantes.filter(a=>a.producto_id===t&&a.color===e).sort((a,o)=>dt.indexOf(a.talla)-dt.indexOf(o.talla))}function F(){const t=document.getElementById("pm-tallas");if(!t)return;const{color:e,modo:a,productoId:o}=S,n=i.data.productos.find(p=>p.id===o),r=bt(),c=document.getElementById("pm-tallas-label");a==="corrida"?(c&&(c.textContent=`Corrida — ${e} · ${v(n.precio_corrida)} x par`),t.className="corrida-rows",t.innerHTML=r.map(p=>{const u=i.data.stockPorVar[p.id]||0,g=E[p.id]||0;return`<div class="crow ${u<=0?"off":""}">
        <span class="ct">${p.talla}</span>
        <span class="cs muted">${u<=0?"Agotado":"Stock "+u}</span>
        <div class="cstep">
          <button ${u<=0?"disabled":""} onclick="window.__corridaQty('${p.id}',-1)">−</button>
          <span id="cq-${p.id}">${g}</span>
          <button ${u<=0?"disabled":""} onclick="window.__corridaQty('${p.id}',1)">+</button>
        </div>
      </div>`}).join("")):(c&&(c.textContent="Tallas — "+e),t.className="tallas",t.innerHTML=r.map(p=>{var $;const u=i.data.stockPorVar[p.id]||0,g=(($=i.carrito.find(f=>f.variante_id===p.id&&!f.es_corrida))==null?void 0:$.cantidad)||0;return`<button class="talla ${g?"on":""}" ${u<=0?"disabled":""} onclick="window.__addTalla('${p.id}')">
        <span class="t">${p.talla}</span>
        <span class="s">${u<=0?"Agotado":"Stock "+u}</span>
        ${g?`<span class="q">${g}</span>`:""}
      </button>`}).join("")),_t()}function _t(){const t=document.getElementById("pm-foot");if(t)if(S.modo==="corrida"){const e=Object.values(E).reduce((a,o)=>a+o,0);t.innerHTML=`
      <button class="btn-mini ghost" style="width:100%;padding:11px;margin-bottom:8px" onclick="window.__sugerirCorrida()">✨ Sugerir corrida (6 pares)</button>
      <button class="btn-primary" ${e?"":"disabled"} onclick="window.__agregarCorrida()">${e?"Agregar corrida ("+e+" pares)":"Elige las tallas de la corrida"}</button>`}else t.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`}window.__corridaQty=(t,e)=>{const a=i.data.stockPorVar[t]||0,o=Math.min(a,Math.max(0,(E[t]||0)+e));E[t]=o;const n=document.getElementById("cq-"+t);n&&(n.textContent=o),_t()};window.__sugerirCorrida=()=>{E={},bt().filter(e=>(i.data.stockPorVar[e.id]||0)>0).slice(0,6).forEach(e=>{E[e.id]=1}),F()};window.__agregarCorrida=()=>{const{productoId:t}=S,e=i.data.productos.find(r=>r.id===t);let a=0;if(Object.entries(E).forEach(([r,c])=>{if(c<=0)return;const p=i.data.variantes.find(g=>g.id===r),u=i.carrito.find(g=>g.variante_id===r&&g.es_corrida);u?u.cantidad+=c:i.carrito.push({variante_id:r,producto_id:e.id,nombre:e.nombre,color:p.color,talla:p.talla,cantidad:c,es_corrida:!0,precio_menudeo:e.precio_menudeo,precio_mayoreo3:e.precio_mayoreo3,precio_mayoreo6:e.precio_mayoreo6,precio_corrida:e.precio_corrida,imagen:p.foto_url||e.imagen_principal||null}),a+=c}),!a){T("Elige al menos una talla");return}E={},R();const o=document.querySelector(".bottomnav");o&&(o.outerHTML=A());const n=document.getElementById("pmodal");n&&n.remove(),V("carrito"),T("Corrida agregada · "+a+" pares")};window.__addTalla=t=>{const e=i.data.variantes.find(c=>c.id===t),a=i.data.productos.find(c=>c.id===e.producto_id),o=i.data.stockPorVar[t]||0,n=i.carrito.find(c=>c.variante_id===t&&!c.es_corrida);if(((n==null?void 0:n.cantidad)||0)>=o){T("Sin más stock ("+o+")");return}n?n.cantidad+=1:i.carrito.push({variante_id:t,producto_id:a.id,nombre:a.nombre,color:e.color,talla:e.talla,cantidad:1,es_corrida:!1,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:e.foto_url||a.imagen_principal||null}),R(),F(),document.querySelector(".bottomnav").outerHTML=A(),T("Agregado · "+D()+" pares")};function D(){return i.carrito.reduce((t,e)=>t+e.cantidad,0)}function ot(){return i.carrito.filter(t=>!t.es_corrida).reduce((t,e)=>t+e.cantidad,0)}function W(t,e){return t.es_corrida?t.precio_corrida:e>=6?t.precio_mayoreo6:e>=3?t.precio_mayoreo3:t.precio_menudeo}function wt(){const t=ot();return i.carrito.reduce((e,a)=>e+a.cantidad*W(a,t),0)}function R(){try{localStorage.setItem(gt,JSON.stringify(i.carrito))}catch{}}function At(){const t=ot();return i.carrito.every(e=>e.es_corrida)&&i.carrito.length?"Corrida":t>=6?"Mayoreo 6+":t>=3?"Mayoreo 3+":"Menudeo"}function at(){if(!i.carrito.length){k().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const t=ot(),e=wt();k().innerHTML=`
    <p class="section-title">${D()} pares · ${At()}</p>
    ${i.carrito.map((a,o)=>`
      <div class="row">
        <div class="r-top">
          ${a.imagen?`<img src="${a.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:.9rem">${l(a.nombre)}</div>
            <div class="muted" style="font-size:.78rem">${l(a.color)} · T${l(a.talla)}${a.es_corrida?" · corrida":""}</div>
            <div style="font-weight:700;color:var(--pink);margin-top:3px">${v(W(a,t))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          </div>
          <button onclick="window.__delItem(${o})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
        </div>
        <div class="qty" style="margin-top:10px">
          <button onclick="window.__qty(${o},-1)">−</button>
          <span style="font-weight:700;min-width:26px;text-align:center">${a.cantidad}</span>
          <button onclick="window.__qty(${o},1)">+</button>
          <span style="margin-left:auto;font-weight:700">${v(a.cantidad*W(a,t))}</span>
        </div>
      </div>`).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${D()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${v(e)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(t,e)=>{const a=i.carrito[t];if(a){if(e>0){const o=i.data.stockPorVar[a.variante_id]||0;if(i.carrito.filter(r=>r.variante_id===a.variante_id).reduce((r,c)=>r+c.cantidad,0)>=o){T("Sin más stock ("+o+")");return}}a.cantidad=Math.max(1,a.cantidad+e),R(),at(),document.querySelector(".bottomnav").outerHTML=A()}};window.__delItem=t=>{i.carrito.splice(t,1),R(),at(),document.querySelector(".bottomnav").outerHTML=A()};window.__enviarPedido=async()=>{var t;if(i.carrito.length){if((t=i.sesion)!=null&&t.demo){T("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const e=await fetch(w+"/portal/carrito",{method:"POST",headers:Z(),body:JSON.stringify({items:i.carrito.map(o=>({variante_id:o.variante_id,cantidad:o.cantidad,es_corrida:!!o.es_corrida}))})});if(tt(e))return;const a=await e.json();if(!e.ok||!a.ok)throw new Error(a.error||"");i.carrito=[],R(),T(a.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),V("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function zt(){k().innerHTML='<div class="spinner">Cargando pedidos…</div>';let t=[];try{const e=await fetch(w+"/portal/pedidos",{headers:Z()});if(tt(e))return;t=await e.json()}catch{}if(t=Array.isArray(t)?t.filter(e=>e.status!=="borrador"):[],!t.length){k().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}k().innerHTML=t.map(e=>{const a=e.pedido_items||[],o=a.reduce((r,c)=>r+(c.cantidad||0),0),n=e.created_at?new Date(e.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(e.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${n} · ${o} pares</div>
        </div>
        ${Ot(e.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${v(C(e.total))}</div>
      ${a.slice(0,4).map(r=>{var c,p;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${l(((p=(c=r.variantes)==null?void 0:c.productos)==null?void 0:p.nombre)||r.nombre||"Producto")} ${r.color?"· "+l(r.color):""} T${l(r.talla||"")} ×${r.cantidad}</div>`}).join("")}
      ${a.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${a.length-4} más…</div>`:""}
      ${e.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${l(e.paqueteria||"Envío")} · Guía ${l(e.numero_guia)}</div>
        ${e.tracking_url?`<a href="${l(e.tracking_url)}" target="_blank" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function Ot(t){const e={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[a,o,n]=e[t]||["#f3f4f6","#374151",t||"—"];return`<span class="badge-status" style="background:${a};color:${o}">${n}</span>`}async function Ht(){k().innerHTML='<div class="spinner">Cargando…</div>';let t=null;try{const e=await fetch(w+"/portal/me",{headers:Z()});if(tt(e))return;t=await e.json()}catch{}t=t||{nombre:i.sesion.nombre,tipo:i.sesion.tipo},k().innerHTML=`
    <div class="row">
      <p class="section-title">Mis datos</p>
      <p style="font-weight:700;margin:0 0 2px">${l(t.nombre||"")}</p>
      <p class="muted" style="font-size:.84rem;margin:0">${l(t.telefono||"Sin teléfono")}</p>
      <p class="muted" style="font-size:.84rem;margin:2px 0 0">${l(t.email||"Sin correo")}</p>
      <p style="margin:10px 0 0"><span class="badge-status" style="background:#fce4f3;color:var(--pink)">Cliente ${l(t.tipo||"mayoreo")}</span></p>
    </div>
    ${t.direccion||t.ciudad?`<div class="row">
      <p class="section-title">Dirección</p>
      <p class="muted" style="font-size:.84rem;margin:0">${l(t.direccion||"")} ${l(t.ciudad||"")} ${l(t.estado||"")} ${l(t.codigo_postal||"")}</p>
    </div>`:""}
    ${C(t.limite_credito)||C(t.credito_disponible)?`<div class="row">
      <p class="section-title">Crédito</p>
      ${C(t.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${v(C(t.limite_credito))}</b>${t.dias_credito?" · "+t.dias_credito+" días":""}</p>`:""}
      ${C(t.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${v(C(t.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=ft;async function Nt(){k().innerHTML='<div class="spinner">Cargando catálogos…</div>';let t=[];try{t=await fetch(w+"/catalogos/").then(o=>o.json())}catch{}t=Array.isArray(t)?t:[];const e=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],a=t.length?t.map(o=>`
    <div class="cat-card">
      ${o.portada_url?`<img src="${o.portada_url}" loading="lazy">`:'<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>'}
      <div class="info">
        <h3>${l(o.nombre||"Catálogo")}</h3>
        <div class="muted" style="font-size:.78rem">${l(o.temporada||"")}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${o.id}','${l(o.nombre||"")}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${o.id}','${l(o.nombre||"")}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join(""):'<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>';k().innerHTML=`
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
        ${e.map(([o,n])=>`
          <button class="category-btn" data-categoria="${o}" data-label="${n.replace(/^[^\s]+\s/,"")}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${n.split(" ")[0]}</span>
            <span class="label">${n.split(" ")[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`}window.__switchSubTab=t=>{const e=document.getElementById("catalogos-general-content"),a=document.getElementById("catalogos-categorias-content"),o=document.getElementById("btn-cat-general"),n=document.getElementById("btn-cat-categorias");t==="categorias"?(e&&(e.style.display="none"),a&&(a.style.display="block"),o&&o.classList.remove("active"),n&&n.classList.add("active")):(e&&(e.style.display="block"),a&&(a.style.display="none"),o&&o.classList.add("active"),n&&n.classList.remove("active"))};window.__descargarPdfCategorias=async t=>{const e=t.getAttribute("data-categoria"),a=t.getAttribute("data-label"),o=document.getElementById("cat-pdf-msg"),n=document.querySelectorAll("#cat-pdf-btns button");n.forEach(r=>r.disabled=!0),o&&(o.style.display="block",o.textContent=`⏳ Cargando productos de ${a}...`);try{const r=i.data.productos.filter(s=>s.categoria&&String(s.categoria).trim().toLowerCase()===String(e).trim().toLowerCase());if(!r.length){o&&(o.textContent=`Sin productos activos en ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),n.forEach(s=>s.disabled=!1);return}const c=[];if(r.forEach(s=>{const y=i.data.variantes.filter(d=>d.producto_id===s.id&&d.activa!==!1),m=new Set;y.forEach(d=>{if(!d.color||m.has(d.color.trim().toUpperCase()))return;m.add(d.color.trim().toUpperCase());const h=d.foto_url||s.imagen_principal;h&&c.push({sku:s.sku_interno||"S/K",color:d.color.trim().toUpperCase(),imgUrl:h})}),m.size===0&&s.imagen_principal&&c.push({sku:s.sku_interno||"S/K",color:"ÚNICO",imgUrl:s.imagen_principal})}),!c.length){o&&(o.textContent=`Sin fotos disponibles para ${a}`),setTimeout(()=>{o&&(o.style.display="none")},3e3),n.forEach(s=>s.disabled=!1);return}o&&(o.textContent=`✏️ Generando catálogo PDF (${c.length} variantes)...`),window.jspdf||await new Promise((s,y)=>{const m=document.createElement("script");m.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",m.onload=s,m.onerror=y,document.head.appendChild(m)});const{jsPDF:p}=window.jspdf,u=2,g=3,$=u*g,f=1080,x=1440,j=40,nt=80,it=24,rt=32,U=(f-j*2-it*(u-1))/u,st=(x-nt*2-rt*(g-1))/g,J=st-50,kt=s=>new Promise(y=>{if(!s)return y(null);const m=new Image;m.crossOrigin="anonymous",m.onload=()=>y(m),m.onerror=()=>y(null),m.src=s+(s.includes("?")?"&":"?")+"_t="+Date.now()}),Ct=(s,y,m,d,h,b)=>{if(s.save(),s.fillStyle="#FFFFFF",s.fillRect(m,d,h,b),y){s.beginPath(),s.rect(m,d,h,b),s.clip();const L=y.naturalWidth/y.naturalHeight,K=h/b;let P,M,I,O;L>K?(M=b,P=b*L,O=d,I=m+(h-P)/2):(P=h,M=h/L,I=m,O=d+(b-M)/2),s.drawImage(y,I,O,P,M)}else s.fillStyle="#F3F4F6",s.fillRect(m,d,h,b),s.fillStyle="#9CA3AF",s.font="20px sans-serif",s.textAlign="center",s.fillText("Sin imagen",m+h/2,d+b/2);s.restore()},z=[];for(let s=0;s<c.length;s+=$)z.push(c.slice(s,s+$));const X=new p({orientation:"portrait",unit:"px",format:[f,x]});let ct=!0;for(let s=0;s<z.length;s++){o&&(o.textContent=`✏️ Generando página ${s+1} de ${z.length}...`);const y=z[s],m=document.createElement("canvas");m.width=f,m.height=x;const d=m.getContext("2d");d.fillStyle="#FAFAF8",d.fillRect(0,0,f,x),d.fillStyle="#2A1A0E",d.font="300 20px sans-serif",d.textAlign="center",d.letterSpacing="4px",d.fillText(`CATÁLOGO DE ${a.toUpperCase()}`,f/2,38),d.letterSpacing="0px",d.fillStyle="#C8967A",d.fillRect(j,48,f-j*2,1.5);for(let b=0;b<y.length;b++){const L=y[b],K=b%u,P=Math.floor(b/u),M=j+K*(U+it),I=nt+P*(st+rt),O=await kt(L.imgUrl);Ct(d,O,M,I,U,J),d.fillStyle="#E8DDD5",d.fillRect(M,I+J,U,1),d.fillStyle="#2A1A0E",d.textAlign="center",d.font="600 18px sans-serif",d.fillText(`${L.sku} ${L.color}`,M+U/2,I+J+28)}d.fillStyle="#C8967A",d.fillRect(j,x-48,f-j*2,1),d.fillStyle="#A07860",d.font="300 14px sans-serif",d.textAlign="center",d.fillText(`Página ${s+1} de ${z.length}`,f/2,x-30);const h=m.toDataURL("image/jpeg",.9);ct||X.addPage([f,x]),X.addImage(h,"JPEG",0,0,f,x),ct=!1}const Et=`catalogo_${e}_${new Date().toISOString().slice(0,10)}.pdf`;X.save(Et),o&&(o.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{o.style.display="none"},4e3))}catch(r){console.error("Error generating PDF:",r),o&&(o.textContent=`❌ Error al generar el PDF: ${r.message}`)}finally{n.forEach(r=>r.disabled=!1)}};async function ht(t){const e=await fetch(w+"/catalogos/"+t+"/paginas").then(a=>a.json()).catch(()=>[]);return Array.isArray(e)?e:[]}window.__verCatalogo=async(t,e)=>{const a=await ht(t),o=document.createElement("div");o.className="modal-overlay",o.id="catv",o.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${l(e)}</div><div class="muted" style="font-size:.76rem">${a.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${a.length?a.map(n=>`<img src="${n.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${t}','${l(e)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&o.remove()})};window.__descargarCatalogo=async(t,e,a)=>{const o=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Descargando…");try{const n=await ht(t);if(!n.length){T("Este catálogo no tiene páginas"),a&&(a.disabled=!1,a.textContent=o);return}const r=(e||"catalogo").replace(/[^\w]+/g,"_");let c=0;for(const p of n){c++;try{const g=await(await fetch(p.imagen_url)).blob(),$=URL.createObjectURL(g),f=document.createElement("a");f.href=$,f.download=`${r}_${String(p.pagina_numero||c).padStart(2,"0")}.jpg`,document.body.appendChild(f),f.click(),f.remove(),URL.revokeObjectURL($),await new Promise(x=>setTimeout(x,300))}catch{window.open(p.imagen_url,"_blank")}}T("Descarga lista · "+n.length+" páginas")}catch{T("No se pudo descargar")}a&&(a.disabled=!1,a.textContent=o)};function Dt(){i.mayaMsgs||(i.mayaMsgs=[]),k().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${i.mayaMsgs.length?i.mayaMsgs.map($t).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",t=>{t.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const t=document.getElementById("maya-msgs");t&&(t.scrollTop=t.scrollHeight)},50)}function $t(t){if(t.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const e=(t.fotos||[]).map(a=>`<img src="${l(a)}" loading="lazy">`).join("");return`<div class="msg ${t.role==="me"?"me":"bot"}">${l(t.content)}${e}</div>`}function mt(){const t=document.getElementById("maya-msgs");t&&(t.innerHTML=i.mayaMsgs.map($t).join(""),t.scrollTop=t.scrollHeight)}function qt(t){const e=[];let a=String(t||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(o,n)=>(e.push(n.replace(/[\[\]]/g,"")),""));return a=a.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:a||"👍",fotos:e}}window.__mayaSend=async()=>{const t=document.getElementById("maya-in");if(!t)return;const e=(t.value||"").trim();if(!e)return;t.value="",i.mayaMsgs||(i.mayaMsgs=[]);const a=i.mayaMsgs.filter(o=>!o.typing).map(o=>({role:o.role==="me"?"user":"assistant",content:o.content}));i.mayaMsgs.push({role:"me",content:e}),i.mayaMsgs.push({role:"bot",typing:!0}),mt();try{const n=await(await fetch(w+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:e,historial:a})})).json();i.mayaMsgs.pop();const{texto:r,fotos:c}=qt(n.respuesta);i.mayaMsgs.push({role:"bot",content:r,fotos:c})}catch{i.mayaMsgs.pop(),i.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}mt()};let ut=null;function T(t){const e=document.getElementById("toast");e&&(e.textContent=t,e.classList.add("show"),clearTimeout(ut),ut=setTimeout(()=>e.classList.remove("show"),1600))}xt();
