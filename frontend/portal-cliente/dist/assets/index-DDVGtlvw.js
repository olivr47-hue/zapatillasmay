(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}})();const k="/api",et="portal_sesion",vt="portal_carrito",W=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],X=document.getElementById("app"),r={sesion:null,data:null,carrito:[],tab:"tienda",filtroCat:"",busqueda:""},M=t=>parseFloat(t)||0,y=t=>"$"+Math.round(t).toLocaleString("es-MX"),l=t=>String(t??"").replace(/"/g,"&quot;").replace(/</g,"&lt;"),pt=t=>{try{const o=new URL(String(t??""),window.location.origin);return o.protocol==="http:"||o.protocol==="https:"?o.href:""}catch{return""}};function at(){var o;const t=(o=r.sesion)==null?void 0:o.token;return t?{"Content-Type":"application/json",Authorization:"Bearer "+t}:{"Content-Type":"application/json"}}function nt(t){return t&&t.status===401?(yt(),!0):!1}function St(){var t;try{r.sesion=JSON.parse(localStorage.getItem(et)||"null")}catch{r.sesion=null}try{r.carrito=JSON.parse(localStorage.getItem(vt)||"[]")}catch{r.carrito=[]}(t=r.sesion)!=null&&t.cliente_id?bt():R()}let q="telefono",A="pedir",D={};function R(){const t=q==="telefono",o=A==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${l(D.canal||(t?"WhatsApp":"correo"))}</b> a <b>${l(D.destino||"")}</b>
      ${D.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
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
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(X.innerHTML=`
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${A==="pedir"?`
        <div class="login-tabs">
          <button class="${t?"on":""}" onclick="window.__loginMetodo('telefono')">📱 Teléfono</button>
          <button class="${t?"":"on"}" onclick="window.__loginMetodo('correo')">✉️ Correo</button>
        </div>`:""}

        ${o}

        <div class="or-sep"><span>o</span></div>
        <div id="g-login-btn" style="display:flex;justify-content:center;min-height:44px"></div>

        <p class="login-error" id="l-err"></p>
        <p style="text-align:center;margin-top:18px">
          <a href="#" id="l-demo" style="color:#c8a8de;font-size:.8rem;text-decoration:underline">Ver demo con datos reales (solo revisión)</a>
        </p>
      </div>
    </div>`,A==="pedir"){const a=document.getElementById("l-send");a&&(a.onclick=tt);const e=document.getElementById("l-dato");e&&e.addEventListener("keydown",n=>{n.key==="Enter"&&tt()})}else{const a=document.getElementById("l-verify");a&&(a.onclick=mt);const e=document.getElementById("l-codigo");e&&e.addEventListener("keydown",n=>{n.key==="Enter"&&mt()}),document.getElementById("l-resend").onclick=n=>{n.preventDefault(),tt()},document.getElementById("l-back").onclick=n=>{n.preventDefault(),A="pedir",R()}}document.getElementById("l-demo").onclick=a=>{a.preventDefault(),jt()},Tt()}window.__loginMetodo=t=>{q=t,A="pedir",R()};async function Tt(){var t;try{window._seoConfig||(window._seoConfig=await fetch(k+"/seo/config").then(e=>e.json()).catch(()=>({})));const o=(t=window._seoConfig)==null?void 0:t.google_client_id;if(!o||(await Lt(),typeof google>"u"))return;google.accounts.id.initialize({client_id:o,callback:It,auto_select:!1});const a=document.getElementById("g-login-btn");a&&google.accounts.id.renderButton(a,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function Lt(){return new Promise(t=>{var a,e;if((e=(a=window.google)==null?void 0:a.accounts)!=null&&e.id)return t();const o=document.createElement("script");o.src="https://accounts.google.com/gsi/client",o.async=!0,o.defer=!0,o.onload=t,o.onerror=t,document.head.appendChild(o)})}async function It(t){const o=t==null?void 0:t.credential;if(!o)return $("Error al conectar con Google");try{const a=await fetch(k+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:o})}),e=await a.json();if(!a.ok||!e.token)return $(e.error||"No se pudo entrar con Google");it(e)}catch{$("Error conectando con Google")}}function $(t){const o=document.getElementById("l-err");o&&(o.textContent=t,o.style.display="block")}function it(t){r.sesion={nombre:t.cliente.nombre,cliente_id:t.cliente.id,tipo:t.cliente.tipo,token:t.token,demo:!!t.demo},localStorage.setItem(et,JSON.stringify(r.sesion)),bt()}async function tt(){$("");const t=(document.getElementById("l-dato").value||"").trim();if(!t)return $(q==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const o=document.getElementById("l-send");o.disabled=!0,o.textContent="Enviando...";try{const a=await fetch(k+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:q,valor:t})}),e=await a.json();if(!a.ok){$(e.error||"No se pudo enviar el código"),o.disabled=!1,o.textContent="Enviarme un código";return}D={valor:t,destino:e.destino,canal:e.canal,enviado:e.enviado},A="codigo",R()}catch{$("Error conectando con el servidor"),o.disabled=!1,o.textContent="Enviarme un código"}}async function mt(){$("");const t=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(t.length<4)return $("Escribe el código que te enviamos");const o=document.getElementById("l-verify");o.disabled=!0,o.textContent="Entrando...";try{const a=await fetch(k+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:q,valor:D.valor,codigo:t})}),e=await a.json();if(!a.ok||!e.token){$(e.error||"Código incorrecto"),o.disabled=!1,o.textContent="Entrar";return}it(e)}catch{$("Error conectando con el servidor"),o.disabled=!1,o.textContent="Entrar"}}async function jt(){$("");try{const t=await fetch(k+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),o=await t.json();if(!t.ok||!o.token)return $(o.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":o.error||"No se pudo cargar el demo");it(o)}catch{$("Error cargando demo")}}function yt(){localStorage.removeItem(et),r.sesion=null,R()}async function bt(){X.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[t,o,a]=await Promise.all([fetch(k+"/productos/").then(n=>n.json()),fetch(k+"/variantes/").then(n=>n.json()),fetch(k+"/inventario/").then(n=>n.json()).catch(()=>[])]),e={};(Array.isArray(a)?a:[]).forEach(n=>{e[n.variante_id]=(e[n.variante_id]||0)+(n.cantidad||0)}),r.data={productos:(Array.isArray(t)?t:[]).filter(n=>n.activo&&!/^oferta/i.test(n.nombre||"")&&!/^oferta/i.test(n.sku_interno||"")).map(n=>Pt(n)),variantes:Array.isArray(o)?o:[],stockPorVar:e},zt()}catch{X.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function Pt(t){const o=M(t.precio_menudeo);return{...t,precio_menudeo:o,precio_mayoreo3:M(t.precio_mayoreo3)||o-30,precio_mayoreo6:M(t.precio_mayoreo6)||o-70,precio_corrida:M(t.precio_corrida)||o-100}}function zt(){X.innerHTML=`
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
    ${I()}
    <div id="toast" class="toast"></div>`,K(r.tab||"tienda")}function I(){const t=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],o=N();return`<div class="bottomnav">${t.map(a=>`
    <button data-tab="${a.id}" class="${r.tab===a.id?"active":""}" onclick="window.__nav('${a.id}')">
      <span class="ic">${a.ic}${a.id==="carrito"&&o?`<span class="badge">${o}</span>`:""}</span>
      <span>${a.label}</span>
    </button>`).join("")}</div>`}window.__nav=K;function K(t){var e;r.tab=t;const o=document.querySelector(".bottomnav");o&&(o.outerHTML=I());const a=document.getElementById("tb-sub");a&&(a.textContent=(e=r.sesion)!=null&&e.nombre?`Hola, ${r.sesion.nombre.split(" ")[0]}`:""),t==="inicio"?Bt():t==="tienda"?_t():t==="catalogos"?Ut():t==="carrito"?U():t==="pedidos"?Rt():t==="maya"?Vt():t==="cuenta"&&Gt()}const E=()=>document.getElementById("page");async function Bt(){var a,e;const t=N(),o=$t();E().innerHTML=`
    ${(a=r.sesion)!=null&&a.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${l(r.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${t?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${y(o)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${t} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`:`<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${l(((e=r.sesion)==null?void 0:e.tipo)||"mayoreo")}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`}function _t(){const t=[...new Set(r.data.productos.map(o=>o.categoria).filter(Boolean))];E().innerHTML=`
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${l(r.busqueda)}">
    <div class="chips">
      <button class="${r.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${t.map(o=>`<button class="${r.filtroCat===o?"active":""}" onclick="window.__filtro('${o}')">${o[0].toUpperCase()+o.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>`,document.getElementById("cat-search").addEventListener("input",o=>{r.busqueda=o.target.value,ut()}),ut()}window.__filtro=t=>{r.filtroCat=t,_t()};function ut(){const t=r.busqueda.trim().toLowerCase();let o=r.data.productos;r.filtroCat&&(o=o.filter(e=>e.categoria===r.filtroCat)),t&&(o=o.filter(e=>(e.nombre||"").toLowerCase().includes(t)||(e.sku_interno||"").toLowerCase().includes(t)));const a=document.getElementById("cat-grid");if(a){if(!o.length){a.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}a.innerHTML=o.slice(0,120).map(e=>`
    <div class="card" onclick="window.__abrir('${e.id}')">
      ${e.imagen_principal?`<img class="thumb" src="${e.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
      <div class="body">
        <div class="name">${l(e.nombre)}</div>
        <div class="sku">${l(e.sku_interno||"")}</div>
        <div class="price">${y(e.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${y(e.precio_mayoreo3)}</span>
          <span class="tier">6+ ${y(e.precio_mayoreo6)}</span>
          ${At(e.id)?`<span class="tier corr">Corr ${y(e.precio_corrida)}</span>`:""}
        </div>
      </div>
    </div>`).join("")}}let w={productoId:null,color:null,modo:"variado"},C=1;window.__abrir=Ht;function At(t){const o=r.data.variantes.filter(e=>e.producto_id===t),a=[...new Set(o.map(e=>e.color).filter(Boolean))];return a.length?a.some(e=>Ot(t,e)):!1}function Ot(t,o){return F(t,o)>=1}function F(t,o){if(!o)return 0;const a=r.data.variantes.filter(s=>s.producto_id===t&&s.color===o);if(!a.length)return 0;const e=a.some(s=>s.talla&&(s.talla.includes(".5")||s.talla.includes("½")||s.talla.includes("/")));let n=0;for(let s=1;s<=6;s++)if(e){if(a.filter(u=>(r.data.stockPorVar[u.id]||0)>=s).length>=6){n=s;continue}let c=0;if(a.forEach(u=>{const f=r.data.stockPorVar[u.id]||0;c+=Math.min(f,2*s)}),c>=6*s)n=s;else break}else{let i=0;if(a.forEach(c=>{const u=r.data.stockPorVar[c.id]||0;i+=Math.min(u,2*s)}),i>=6*s)n=s;else break}return n}function wt(t,o,a){const e=r.data.variantes.filter(c=>c.producto_id===t&&c.color===o).sort((c,u)=>W.indexOf(c.talla)-W.indexOf(u.talla)),n=e.some(c=>c.talla&&(c.talla.includes(".5")||c.talla.includes("½")||c.talla.includes("/"))),s={};if(n){const c=e.filter(u=>(r.data.stockPorVar[u.id]||0)>=a);if(c.length>=6)return c.slice(0,6).forEach(u=>{s[u.id]=a}),s}let i=6*a;for(const c of e){const u=r.data.stockPorVar[c.id]||0,f=Math.min(u,2*a,i);if(f>0&&(s[c.id]=f,i-=f),i<=0)break}return s}function Ht(t){const o=r.data.productos.find(s=>s.id===t);if(!o)return;const a=r.data.variantes.filter(s=>s.producto_id===t),e=[...new Set(a.map(s=>s.color).filter(Boolean))];w={productoId:t,color:e[0]||null,modo:"variado"},C=1;const n=document.createElement("div");n.className="modal-overlay",n.id="pmodal",n.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${o.imagen_principal?`<img id="pm-img" src="${o.imagen_principal}">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${l(o.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${l(o.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${y(o.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${y(o.precio_mayoreo3)}</span>
            <span class="tier">6+ ${y(o.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${y(o.precio_corrida)}</span>
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
          ${e.map(s=>{var f;const i=a.filter(v=>v.color===s),c=i.map(v=>v.foto_url).find(Boolean),u=((f=i[0])==null?void 0:f.color_hex)||"#999";return`<div class="swatch ${s===w.color?"active":""}" data-color="${l(s)}" onclick="window.__pickColor('${l(s)}')">
              ${c?`<img src="${c}">`:`<div class="hex" style="background:${u}"></div>`}
              <span>${l(s)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(n),n.addEventListener("click",s=>{s.target===n&&n.remove()}),w.color&&(ht(),G())}function ht(){const t=document.getElementById("pm-mode");if(!t)return;const{productoId:o,color:a}=w,n=F(o,a)>=1,s=document.getElementById("pm-tier-corr");if(s&&(s.style.display=n?"":"none"),!n)w.modo==="corrida"&&(w.modo="variado"),t.innerHTML=`
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `;else{const i=w.modo;t.innerHTML=`
      <button data-modo="variado" class="${i==="variado"?"on":""}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${i==="corrida"?"on":""}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `}}window.__pickColor=t=>{w.color=t,C=1,document.querySelectorAll("#pm-swatches .swatch").forEach(n=>n.classList.toggle("active",n.dataset.color===t));const a=r.data.variantes.filter(n=>n.producto_id===w.productoId&&n.color===t).map(n=>n.foto_url).find(Boolean),e=document.getElementById("pm-img");e&&a&&(e.src=a),ht(),G()};window.__modoModal=t=>{w.modo=t,C=1,document.querySelectorAll("#pm-mode button").forEach(o=>o.classList.toggle("on",o.dataset.modo===t)),G()};function Dt(){const{productoId:t,color:o}=w;return r.data.variantes.filter(a=>a.producto_id===t&&a.color===o).sort((a,e)=>W.indexOf(a.talla)-W.indexOf(e.talla))}function G(){const t=document.getElementById("pm-tallas");if(!t)return;const{color:o,modo:a,productoId:e}=w,n=r.data.productos.find(c=>c.id===e),s=Dt(),i=document.getElementById("pm-tallas-label");if(a==="corrida"){const c=F(e,o);C>c&&(C=Math.max(1,c)),i&&(i.textContent=`Corrida completa — ${o} · ${y(n.precio_corrida)} x par`),t.className="corrida-rows",t.innerHTML=`
      <div class="crow" style="border-bottom: none; padding-bottom: 12px; margin-bottom: 12px;">
        <span class="ct" style="min-width: 140px; font-weight: 800; font-size: 1.1rem; color: var(--black);">Corridas</span>
        <span class="cs muted" style="font-size: .8rem;">Máx: ${c}</span>
        <div class="cstep">
          <button onclick="window.__changeCorridaM(-1)">−</button>
          <span>${C}</span>
          <button onclick="window.__changeCorridaM(1)">+</button>
        </div>
      </div>
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pink); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    `}else i&&(i.textContent="Tallas — "+o),t.className="tallas",t.innerHTML=s.map(c=>{var v;const u=r.data.stockPorVar[c.id]||0,f=((v=r.carrito.find(p=>p.variante_id===c.id&&!p.es_corrida))==null?void 0:v.cantidad)||0;return`<button class="talla ${f?"on":""}" ${u<=0?"disabled":""} onclick="window.__addTalla('${c.id}')">
        <span class="t">${c.talla}</span>
        <span class="s">${u<=0?"Agotado":"Stock "+u}</span>
        ${f?`<span class="q">${f}</span>`:""}
      </button>`}).join("");qt()}function qt(){const t=document.getElementById("pm-foot");t&&(w.modo==="corrida"?t.innerHTML=`
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${C} ${C===1?"corrida":"corridas"} (${C*6} pares)</button>
    `:t.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`)}window.__changeCorridaM=t=>{const{productoId:o,color:a}=w,e=F(o,a);C=Math.min(e,Math.max(1,C+t)),G()};window.__agregarCorrida=()=>{const{productoId:t,color:o}=w,a=r.data.productos.find(c=>c.id===t),e=wt(t,o,C);let n=0;if(Object.entries(e).forEach(([c,u])=>{if(u<=0)return;const f=r.data.variantes.find(p=>p.id===c),v=r.carrito.find(p=>p.variante_id===c&&p.es_corrida);v?v.cantidad+=u:r.carrito.push({variante_id:c,producto_id:a.id,nombre:a.nombre,color:f.color,talla:f.talla,cantidad:u,es_corrida:!0,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:f.foto_url||a.imagen_principal||null}),n+=u}),!n){S("Elige al menos una corrida");return}C=1,z();const s=document.querySelector(".bottomnav");s&&(s.outerHTML=I());const i=document.getElementById("pmodal");i&&i.remove(),K("carrito"),S("Corrida agregada · "+n+" pares")};window.__addTalla=t=>{const o=r.data.variantes.find(i=>i.id===t),a=r.data.productos.find(i=>i.id===o.producto_id),e=r.data.stockPorVar[t]||0,n=r.carrito.find(i=>i.variante_id===t&&!i.es_corrida);if(((n==null?void 0:n.cantidad)||0)>=e){S("Sin más stock ("+e+")");return}n?n.cantidad+=1:r.carrito.push({variante_id:t,producto_id:a.id,nombre:a.nombre,color:o.color,talla:o.talla,cantidad:1,es_corrida:!1,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:o.foto_url||a.imagen_principal||null}),z(),G(),document.querySelector(".bottomnav").outerHTML=I(),S("Agregado · "+N()+" pares")};function N(){return r.carrito.reduce((t,o)=>t+o.cantidad,0)}function rt(){return r.carrito.filter(t=>!t.es_corrida).reduce((t,o)=>t+o.cantidad,0)}function ot(t,o){return t.es_corrida?t.precio_corrida:o>=6?t.precio_mayoreo6:o>=3?t.precio_mayoreo3:t.precio_menudeo}function $t(){const t=rt();return r.carrito.reduce((o,a)=>o+a.cantidad*ot(a,t),0)}function z(){try{localStorage.setItem(vt,JSON.stringify(r.carrito))}catch{}}function Nt(){const t=rt();return r.carrito.every(o=>o.es_corrida)&&r.carrito.length?"Corrida":t>=6?"Mayoreo 6+":t>=3?"Mayoreo 3+":"Menudeo"}function U(){if(!r.carrito.length){E().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const t=rt(),o=$t(),a=r.carrito.filter(i=>!i.es_corrida),e=r.carrito.filter(i=>i.es_corrida),n={};e.forEach(i=>{const c=`${i.producto_id}-${i.color}`;n[c]||(n[c]={key:c,es_grupo_corrida:!0,producto_id:i.producto_id,color:i.color,nombre:i.nombre,imagen:i.imagen,precio_corrida:i.precio_corrida,cantidad:0,items:[]}),n[c].cantidad+=i.cantidad,n[c].items.push(i)});const s=[...a.map((i,c)=>({...i,originalIdx:r.carrito.indexOf(i)})),...Object.values(n)];E().innerHTML=`
    <p class="section-title">${N()} pares · ${Nt()}</p>
    ${s.map(i=>i.es_grupo_corrida?`
          <div class="row">
            <div class="r-top">
              ${i.imagen?`<img src="${i.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.9rem">${l(i.nombre)}</div>
                <div class="muted" style="font-size:.78rem">${l(i.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${y(i.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${i.producto_id}', '${l(i.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${l(i.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${l(i.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${y(i.cantidad*i.precio_corrida)}</span>
            </div>
          </div>
        `:`
          <div class="row">
            <div class="r-top">
              ${i.imagen?`<img src="${i.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.9rem">${l(i.nombre)}</div>
                <div class="muted" style="font-size:.78rem">${l(i.color)} · T${l(i.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${y(ot(i,t))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${i.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${i.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qty(${i.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${y(i.cantidad*ot(i,t))}</span>
            </div>
          </div>
        `).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${N()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${y(o)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(t,o)=>{const a=r.carrito[t];if(a){if(o>0){const e=r.data.stockPorVar[a.variante_id]||0;if(r.carrito.filter(s=>s.variante_id===a.variante_id).reduce((s,i)=>s+i.cantidad,0)>=e){S("Sin más stock ("+e+")");return}}a.cantidad=Math.max(1,a.cantidad+o),z(),U(),document.querySelector(".bottomnav").outerHTML=I()}};window.__delItem=t=>{r.carrito.splice(t,1),z(),U(),document.querySelector(".bottomnav").outerHTML=I()};window.__qtyGrupoCorrida=(t,o,a)=>{const i=r.carrito.filter(p=>p.producto_id===t&&p.color===o&&p.es_corrida).reduce((p,b)=>p+b.cantidad,0)/6+a;if(i<=0){window.__delGrupoCorrida(t,o);return}const c=F(t,o);if(i>c){S(`Sin existencias para ${i} corridas (máximo ${c})`);return}const u=wt(t,o,i);r.carrito=r.carrito.filter(p=>!(p.producto_id===t&&p.color===o&&p.es_corrida));const f=r.data.productos.find(p=>p.id===t);Object.entries(u).forEach(([p,b])=>{if(b<=0)return;const T=r.data.variantes.find(V=>V.id===p);r.carrito.push({variante_id:p,producto_id:f.id,nombre:f.nombre,color:T.color,talla:T.talla,cantidad:b,es_corrida:!0,precio_menudeo:f.precio_menudeo,precio_mayoreo3:f.precio_mayoreo3,precio_mayoreo6:f.precio_mayoreo6,precio_corrida:f.precio_corrida,imagen:T.foto_url||f.imagen_principal||null})}),z(),U();const v=document.querySelector(".bottomnav");v&&(v.outerHTML=I())};window.__delGrupoCorrida=(t,o)=>{r.carrito=r.carrito.filter(e=>!(e.producto_id===t&&e.color===o&&e.es_corrida)),z(),U();const a=document.querySelector(".bottomnav");a&&(a.outerHTML=I())};window.__enviarPedido=async()=>{var t;if(r.carrito.length){if((t=r.sesion)!=null&&t.demo){S("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const o=await fetch(k+"/portal/carrito",{method:"POST",headers:at(),body:JSON.stringify({items:r.carrito.map(e=>({variante_id:e.variante_id,cantidad:e.cantidad,es_corrida:!!e.es_corrida}))})});if(nt(o))return;const a=await o.json();if(!o.ok||!a.ok)throw new Error(a.error||"");r.carrito=[],z(),S(a.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),K("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function Rt(){E().innerHTML='<div class="spinner">Cargando pedidos…</div>';let t=[];try{const o=await fetch(k+"/portal/pedidos",{headers:at()});if(nt(o))return;t=await o.json()}catch{}if(t=Array.isArray(t)?t.filter(o=>o.status!=="borrador"):[],!t.length){E().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}E().innerHTML=t.map(o=>{const a=o.pedido_items||[],e=a.reduce((s,i)=>s+(i.cantidad||0),0),n=o.created_at?new Date(o.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(o.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${n} · ${e} pares</div>
        </div>
        ${Ft(o.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${y(M(o.total))}</div>
      ${a.slice(0,4).map(s=>{var i,c;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${l(((c=(i=s.variantes)==null?void 0:i.productos)==null?void 0:c.nombre)||s.nombre||"Producto")} ${s.color?"· "+l(s.color):""} T${l(s.talla||"")} ×${s.cantidad}</div>`}).join("")}
      ${a.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${a.length-4} más…</div>`:""}
      ${o.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${l(o.paqueteria||"Envío")} · Guía ${l(o.numero_guia)}</div>
        ${pt(o.tracking_url)?`<a href="${l(pt(o.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function Ft(t){const o={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[a,e,n]=o[t]||["#f3f4f6","#374151",t||"—"];return`<span class="badge-status" style="background:${a};color:${e}">${n}</span>`}async function Gt(){E().innerHTML='<div class="spinner">Cargando…</div>';let t=null;try{const o=await fetch(k+"/portal/me",{headers:at()});if(nt(o))return;t=await o.json()}catch{}t=t||{nombre:r.sesion.nombre,tipo:r.sesion.tipo},E().innerHTML=`
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
    ${M(t.limite_credito)||M(t.credito_disponible)?`<div class="row">
      <p class="section-title">Crédito</p>
      ${M(t.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${y(M(t.limite_credito))}</b>${t.dias_credito?" · "+t.dias_credito+" días":""}</p>`:""}
      ${M(t.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${y(M(t.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=yt;async function Ut(){E().innerHTML='<div class="spinner">Cargando catálogos…</div>';let t=[];try{t=await fetch(k+"/catalogos/").then(e=>e.json())}catch{}t=Array.isArray(t)?t:[];const o=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],a=t.length?t.map(e=>`
    <div class="cat-card">
      ${e.portada_url?`<img src="${e.portada_url}" loading="lazy">`:'<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>'}
      <div class="info">
        <h3>${l(e.nombre||"Catálogo")}</h3>
        <div class="muted" style="font-size:.78rem">${l(e.temporada||"")}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${e.id}','${l(e.nombre||"")}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${e.id}','${l(e.nombre||"")}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join(""):'<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>';E().innerHTML=`
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
        ${o.map(([e,n])=>`
          <button class="category-btn" data-categoria="${e}" data-label="${n.replace(/^[^\s]+\s/,"")}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${n.split(" ")[0]}</span>
            <span class="label">${n.split(" ")[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`}window.__switchSubTab=t=>{const o=document.getElementById("catalogos-general-content"),a=document.getElementById("catalogos-categorias-content"),e=document.getElementById("btn-cat-general"),n=document.getElementById("btn-cat-categorias");t==="categorias"?(o&&(o.style.display="none"),a&&(a.style.display="block"),e&&e.classList.remove("active"),n&&n.classList.add("active")):(o&&(o.style.display="block"),a&&(a.style.display="none"),e&&e.classList.add("active"),n&&n.classList.remove("active"))};window.__descargarPdfCategorias=async t=>{const o=t.getAttribute("data-categoria"),a=t.getAttribute("data-label"),e=document.getElementById("cat-pdf-msg"),n=document.querySelectorAll("#cat-pdf-btns button");n.forEach(s=>s.disabled=!0),e&&(e.style.display="block",e.textContent=`⏳ Cargando productos de ${a}...`);try{const s=r.data.productos.filter(d=>d.categoria&&String(d.categoria).trim().toLowerCase()===String(o).trim().toLowerCase());if(!s.length){e&&(e.textContent=`Sin productos activos en ${a}`),setTimeout(()=>{e&&(e.style.display="none")},3e3),n.forEach(d=>d.disabled=!1);return}const i=[];if(s.forEach(d=>{const _=r.data.variantes.filter(m=>m.producto_id===d.id&&m.activa!==!1),g=new Set;_.forEach(m=>{if(!m.color||g.has(m.color.trim().toUpperCase()))return;g.add(m.color.trim().toUpperCase());const x=m.foto_url||d.imagen_principal;x&&i.push({sku:d.sku_interno||"S/K",color:m.color.trim().toUpperCase(),imgUrl:x})}),g.size===0&&d.imagen_principal&&i.push({sku:d.sku_interno||"S/K",color:"ÚNICO",imgUrl:d.imagen_principal})}),!i.length){e&&(e.textContent=`Sin fotos disponibles para ${a}`),setTimeout(()=>{e&&(e.style.display="none")},3e3),n.forEach(d=>d.disabled=!1);return}e&&(e.textContent=`✏️ Generando catálogo PDF (${i.length} variantes)...`),window.jspdf||await new Promise((d,_)=>{const g=document.createElement("script");g.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",g.onload=d,g.onerror=_,document.head.appendChild(g)});const{jsPDF:c}=window.jspdf,u=2,f=3,v=u*f,p=1080,b=1440,T=40,V=80,st=24,ct=32,J=(p-T*2-st*(u-1))/u,dt=(b-V*2-ct*(f-1))/f,Y=dt-50,Ct=d=>new Promise(_=>{if(!d)return _(null);const g=new Image;g.crossOrigin="anonymous",g.onload=()=>_(g),g.onerror=()=>_(null),g.src=d+(d.includes("?")?"&":"?")+"_t="+Date.now()}),Et=(d,_,g,m,x,h)=>{if(d.save(),d.fillStyle="#FFFFFF",d.fillRect(g,m,x,h),_){d.beginPath(),d.rect(g,m,x,h),d.clip();const j=_.naturalWidth/_.naturalHeight,Q=x/h;let B,L,P,H;j>Q?(L=h,B=h*j,H=m,P=g+(x-B)/2):(B=x,L=x/j,P=g,H=m+(h-L)/2),d.drawImage(_,P,H,B,L)}else d.fillStyle="#F3F4F6",d.fillRect(g,m,x,h),d.fillStyle="#9CA3AF",d.font="20px sans-serif",d.textAlign="center",d.fillText("Sin imagen",g+x/2,m+h/2);d.restore()},O=[];for(let d=0;d<i.length;d+=v)O.push(i.slice(d,d+v));const Z=new c({orientation:"portrait",unit:"px",format:[p,b]});let lt=!0;for(let d=0;d<O.length;d++){e&&(e.textContent=`✏️ Generando página ${d+1} de ${O.length}...`);const _=O[d],g=document.createElement("canvas");g.width=p,g.height=b;const m=g.getContext("2d");m.fillStyle="#FAFAF8",m.fillRect(0,0,p,b),m.fillStyle="#2A1A0E",m.font="300 20px sans-serif",m.textAlign="center",m.letterSpacing="4px",m.fillText(`CATÁLOGO DE ${a.toUpperCase()}`,p/2,38),m.letterSpacing="0px",m.fillStyle="#C8967A",m.fillRect(T,48,p-T*2,1.5);for(let h=0;h<_.length;h++){const j=_[h],Q=h%u,B=Math.floor(h/u),L=T+Q*(J+st),P=V+B*(dt+ct),H=await Ct(j.imgUrl);Et(m,H,L,P,J,Y),m.fillStyle="#E8DDD5",m.fillRect(L,P+Y,J,1),m.fillStyle="#2A1A0E",m.textAlign="center",m.font="600 18px sans-serif",m.fillText(`${j.sku} ${j.color}`,L+J/2,P+Y+28)}m.fillStyle="#C8967A",m.fillRect(T,b-48,p-T*2,1),m.fillStyle="#A07860",m.font="300 14px sans-serif",m.textAlign="center",m.fillText(`Página ${d+1} de ${O.length}`,p/2,b-30);const x=g.toDataURL("image/jpeg",.9);lt||Z.addPage([p,b]),Z.addImage(x,"JPEG",0,0,p,b),lt=!1}const Mt=`catalogo_${o}_${new Date().toISOString().slice(0,10)}.pdf`;Z.save(Mt),e&&(e.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{e.style.display="none"},4e3))}catch(s){console.error("Error generating PDF:",s),e&&(e.textContent=`❌ Error al generar el PDF: ${s.message}`)}finally{n.forEach(s=>s.disabled=!1)}};async function kt(t){const o=await fetch(k+"/catalogos/"+t+"/paginas").then(a=>a.json()).catch(()=>[]);return Array.isArray(o)?o:[]}window.__verCatalogo=async(t,o)=>{const a=await kt(t),e=document.createElement("div");e.className="modal-overlay",e.id="catv",e.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${l(o)}</div><div class="muted" style="font-size:.76rem">${a.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${a.length?a.map(n=>`<img src="${n.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${t}','${l(o)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(e),e.addEventListener("click",n=>{n.target===e&&e.remove()})};window.__descargarCatalogo=async(t,o,a)=>{const e=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Descargando…");try{const n=await kt(t);if(!n.length){S("Este catálogo no tiene páginas"),a&&(a.disabled=!1,a.textContent=e);return}const s=(o||"catalogo").replace(/[^\w]+/g,"_");let i=0;for(const c of n){i++;try{const f=await(await fetch(c.imagen_url)).blob(),v=URL.createObjectURL(f),p=document.createElement("a");p.href=v,p.download=`${s}_${String(c.pagina_numero||i).padStart(2,"0")}.jpg`,document.body.appendChild(p),p.click(),p.remove(),URL.revokeObjectURL(v),await new Promise(b=>setTimeout(b,300))}catch{window.open(c.imagen_url,"_blank")}}S("Descarga lista · "+n.length+" páginas")}catch{S("No se pudo descargar")}a&&(a.disabled=!1,a.textContent=e)};function Vt(){r.mayaMsgs||(r.mayaMsgs=[]),E().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${r.mayaMsgs.length?r.mayaMsgs.map(xt).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",t=>{t.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const t=document.getElementById("maya-msgs");t&&(t.scrollTop=t.scrollHeight)},50)}function xt(t){if(t.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const o=(t.fotos||[]).map(a=>`<img src="${l(a)}" loading="lazy">`).join("");return`<div class="msg ${t.role==="me"?"me":"bot"}">${l(t.content)}${o}</div>`}function ft(){const t=document.getElementById("maya-msgs");t&&(t.innerHTML=r.mayaMsgs.map(xt).join(""),t.scrollTop=t.scrollHeight)}function Jt(t){const o=[];let a=String(t||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(e,n)=>(o.push(n.replace(/[\[\]]/g,"")),""));return a=a.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:a||"👍",fotos:o}}window.__mayaSend=async()=>{const t=document.getElementById("maya-in");if(!t)return;const o=(t.value||"").trim();if(!o)return;t.value="",r.mayaMsgs||(r.mayaMsgs=[]);const a=r.mayaMsgs.filter(e=>!e.typing).map(e=>({role:e.role==="me"?"user":"assistant",content:e.content}));r.mayaMsgs.push({role:"me",content:o}),r.mayaMsgs.push({role:"bot",typing:!0}),ft();try{const n=await(await fetch(k+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:o,historial:a})})).json();r.mayaMsgs.pop();const{texto:s,fotos:i}=Jt(n.respuesta);r.mayaMsgs.push({role:"bot",content:s,fotos:i})}catch{r.mayaMsgs.pop(),r.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}ft()};let gt=null;function S(t){const o=document.getElementById("toast");o&&(o.textContent=t,o.classList.add("show"),clearTimeout(gt),gt=setTimeout(()=>o.classList.remove("show"),1600))}St();
