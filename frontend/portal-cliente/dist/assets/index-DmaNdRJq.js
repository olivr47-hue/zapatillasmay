(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const y="/api",so="portal_sesion",xo="portal_carrito",Z=["22","22.5","23","23.5","24","24.5","25","25.5","26","26.5","27","Unica"],Q=document.getElementById("app"),s={sesion:null,data:null,carrito:[],tab:"tienda",filtroCat:"",busqueda:""},M=o=>parseFloat(o)||0,_=o=>"$"+Math.round(o).toLocaleString("es-MX"),u=o=>String(o??"").replace(/"/g,"&quot;").replace(/</g,"&lt;"),bo=o=>{try{const t=new URL(String(o??""),window.location.origin);return t.protocol==="http:"||t.protocol==="https:"?t.href:""}catch{return""}};function E(){var t;const o=(t=s.sesion)==null?void 0:t.token;return o?{"Content-Type":"application/json",Authorization:"Bearer "+o}:{"Content-Type":"application/json"}}function co(o){return o&&o.status===401?(Eo(),!0):!1}function zo(){var o;try{s.sesion=JSON.parse(localStorage.getItem(so)||"null")}catch{s.sesion=null}try{s.carrito=JSON.parse(localStorage.getItem(xo)||"[]")}catch{s.carrito=[]}(o=s.sesion)!=null&&o.cliente_id?So():V()}let G="telefono",H="pedir",R={};function V(){const o=G==="telefono",t=H==="codigo"?`
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${u(R.canal||(o?"WhatsApp":"correo"))}</b> a <b>${u(R.destino||"")}</b>
      ${R.enviado===!1?'<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>':""}
    </p>
    <div class="field">
      <label>Código</label>
      <input id="l-codigo" type="text" inputmode="numeric" maxlength="6" placeholder="6 dígitos" autocomplete="one-time-code">
    </div>
    <button class="btn-primary" id="l-verify">Entrar</button>
    <p style="text-align:center;margin-top:12px;font-size:.78rem">
      <a href="#" id="l-resend" style="color:#c8a8de">Reenviar código</a>
      &nbsp;·&nbsp;
      <a href="#" id="l-back" style="color:#c8a8de">Cambiar ${o?"teléfono":"correo"}</a>
    </p>`:`
    <div class="field">
      <label>${o?"Teléfono":"Correo"}</label>
      <input id="l-dato" type="${o?"tel":"email"}" inputmode="${o?"numeric":"email"}" placeholder="${o?"10 dígitos":"tu@correo.com"}" autocomplete="${o?"tel":"email"}">
    </div>
    <button class="btn-primary" id="l-send">Enviarme un código</button>`;if(Q.innerHTML=`
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${H==="pedir"?`
        <div class="login-tabs">
          <button class="${o?"on":""}" onclick="window.__loginMetodo('telefono')">📱 Teléfono</button>
          <button class="${o?"":"on"}" onclick="window.__loginMetodo('correo')">✉️ Correo</button>
        </div>`:""}

        ${t}

        <div class="or-sep"><span>o</span></div>
        <div id="g-login-btn" style="display:flex;justify-content:center;min-height:44px"></div>

        <p class="login-error" id="l-err"></p>
        <p style="text-align:center;margin-top:18px">
          <a href="#" id="l-demo" style="color:#c8a8de;font-size:.8rem;text-decoration:underline">Ver demo con datos reales (solo revisión)</a>
        </p>
      </div>
    </div>`,H==="pedir"){const a=document.getElementById("l-send");a&&(a.onclick=no);const e=document.getElementById("l-dato");e&&e.addEventListener("keydown",n=>{n.key==="Enter"&&no()})}else{const a=document.getElementById("l-verify");a&&(a.onclick=ho);const e=document.getElementById("l-codigo");e&&e.addEventListener("keydown",n=>{n.key==="Enter"&&ho()}),document.getElementById("l-resend").onclick=n=>{n.preventDefault(),no()},document.getElementById("l-back").onclick=n=>{n.preventDefault(),H="pedir",V()}}document.getElementById("l-demo").onclick=a=>{a.preventDefault(),Do()},Bo()}window.__loginMetodo=o=>{G=o,H="pedir",V()};async function Bo(){var o;try{window._seoConfig||(window._seoConfig=await fetch(y+"/seo/config").then(e=>e.json()).catch(()=>({})));const t=(o=window._seoConfig)==null?void 0:o.google_client_id;if(!t||(await Ho(),typeof google>"u"))return;google.accounts.id.initialize({client_id:t,callback:No,auto_select:!1});const a=document.getElementById("g-login-btn");a&&google.accounts.id.renderButton(a,{theme:"outline",size:"large",width:300,locale:"es_MX",text:"continue_with"})}catch{}}function Ho(){return new Promise(o=>{var a,e;if((e=(a=window.google)==null?void 0:a.accounts)!=null&&e.id)return o();const t=document.createElement("script");t.src="https://accounts.google.com/gsi/client",t.async=!0,t.defer=!0,t.onload=o,t.onerror=o,document.head.appendChild(t)})}async function No(o){const t=o==null?void 0:o.credential;if(!t)return C("Error al conectar con Google");try{const a=await fetch(y+"/portal/login/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_token:t})}),e=await a.json();if(!a.ok||!e.token)return C(e.error||"No se pudo entrar con Google");lo(e)}catch{C("Error conectando con Google")}}function C(o){const t=document.getElementById("l-err");t&&(t.textContent=o,t.style.display="block")}function lo(o){s.sesion={nombre:o.cliente.nombre,cliente_id:o.cliente.id,tipo:o.cliente.tipo,token:o.token,demo:!!o.demo},localStorage.setItem(so,JSON.stringify(s.sesion)),So()}async function no(){C("");const o=(document.getElementById("l-dato").value||"").trim();if(!o)return C(G==="telefono"?"Escribe tu teléfono":"Escribe tu correo");const t=document.getElementById("l-send");t.disabled=!0,t.textContent="Enviando...";try{const a=await fetch(y+"/portal/otp/solicitar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:G,valor:o})}),e=await a.json();if(!a.ok){C(e.error||"No se pudo enviar el código"),t.disabled=!1,t.textContent="Enviarme un código";return}R={valor:o,destino:e.destino,canal:e.canal,enviado:e.enviado},H="codigo",V()}catch{C("Error conectando con el servidor"),t.disabled=!1,t.textContent="Enviarme un código"}}async function ho(){C("");const o=(document.getElementById("l-codigo").value||"").replace(/\D/g,"");if(o.length<4)return C("Escribe el código que te enviamos");const t=document.getElementById("l-verify");t.disabled=!0,t.textContent="Entrando...";try{const a=await fetch(y+"/portal/otp/verificar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({metodo:G,valor:R.valor,codigo:o})}),e=await a.json();if(!a.ok||!e.token){C(e.error||"Código incorrecto"),t.disabled=!1,t.textContent="Entrar";return}lo(e)}catch{C("Error conectando con el servidor"),t.disabled=!1,t.textContent="Entrar"}}async function Do(){C("");try{const o=await fetch(y+"/portal/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),t=await o.json();if(!o.ok||!t.token)return C(t.error==="Demo deshabilitado"?"Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).":t.error||"No se pudo cargar el demo");lo(t)}catch{C("Error cargando demo")}}function Eo(){localStorage.removeItem(so),s.sesion=null,V()}async function So(){Q.innerHTML='<div class="spinner">Cargando catálogo…</div>';try{const[o,t,a,e]=await Promise.all([fetch(y+"/productos/").then(i=>i.json()),fetch(y+"/variantes/").then(i=>i.json()),fetch(y+"/inventario/").then(i=>i.json()).catch(()=>[]),fetch(y+"/portal/pedidos",{headers:E()}).then(i=>i.ok?i.json():[]).catch(()=>[])]),n={};(Array.isArray(a)?a:[]).forEach(i=>{n[i.variante_id]=(n[i.variante_id]||0)+(i.cantidad||0)}),s.data={productos:(Array.isArray(o)?o:[]).filter(i=>i.activo&&!/^oferta/i.test(i.nombre||"")&&!/^oferta/i.test(i.sku_interno||"")).map(i=>qo(i)),variantes:Array.isArray(t)?t:[],stockPorVar:n};try{await Qo(e)}catch{}Ro()}catch{Q.innerHTML=`<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`}}function qo(o){const t=M(o.precio_menudeo);return{...o,precio_menudeo:t,precio_mayoreo3:M(o.precio_mayoreo3)||t-30,precio_mayoreo6:M(o.precio_mayoreo6)||t-70,precio_corrida:M(o.precio_corrida)||t-100}}function Ro(){Q.innerHTML=`
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
    <div id="toast" class="toast"></div>`,to(s.tab||"tienda")}function I(){const o=[{id:"inicio",ic:"🏠",label:"Inicio"},{id:"tienda",ic:"👠",label:"Tienda"},{id:"catalogos",ic:"📖",label:"Catálogos"},{id:"carrito",ic:"🛒",label:"Carrito"},{id:"pedidos",ic:"🛍️",label:"Pedidos"},{id:"maya",ic:"💬",label:"Maya"}],t=U();return`<div class="bottomnav">${o.map(a=>`
    <button data-tab="${a.id}" class="${s.tab===a.id?"active":""}" onclick="window.__nav('${a.id}')">
      <span class="ic">${a.ic}${a.id==="carrito"&&t?`<span class="badge">${t}</span>`:""}</span>
      <span>${a.label}</span>
    </button>`).join("")}</div>`}window.__nav=to;function to(o){var e;s.tab=o;const t=document.querySelector(".bottomnav");t&&(t.outerHTML=I());const a=document.getElementById("tb-sub");a&&(a.textContent=(e=s.sesion)!=null&&e.nombre?`Hola, ${s.sesion.nombre.split(" ")[0]}`:""),o==="carrito"?Xo():mo(),o==="inicio"?Fo():o==="tienda"?Mo():o==="catalogos"?it():o==="carrito"?N():o==="pedidos"?tt():o==="maya"?nt():o==="cuenta"&&at()}const S=()=>document.getElementById("page");async function Fo(){var a,e;const o=U(),t=uo();S().innerHTML=`
    ${(a=s.sesion)!=null&&a.demo?`<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${u(s.sesion.nombre)}</b> solo para revisión.</div>`:""}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${o?`<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${_(t)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${o} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`:`<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${u(((e=s.sesion)==null?void 0:e.tipo)||"mayoreo")}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`}function Mo(){const o=[...new Set(s.data.productos.map(t=>t.categoria).filter(Boolean))];S().innerHTML=`
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${u(s.busqueda)}">
    <div class="chips">
      <button class="${s.filtroCat?"":"active"}" onclick="window.__filtro('')">Todos</button>
      ${o.map(t=>`<button class="${s.filtroCat===t?"active":""}" onclick="window.__filtro('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join("")}
    </div>
    <div class="grid" id="cat-grid"></div>`,document.getElementById("cat-search").addEventListener("input",t=>{s.busqueda=t.target.value,wo()}),wo()}window.__filtro=o=>{s.filtroCat=o,Mo()};function wo(){const o=s.busqueda.trim().toLowerCase();let t=s.data.productos;s.filtroCat&&(t=t.filter(e=>e.categoria===s.filtroCat)),o&&(t=t.filter(e=>(e.nombre||"").toLowerCase().includes(o)||(e.sku_interno||"").toLowerCase().includes(o)));const a=document.getElementById("cat-grid");if(a){if(!t.length){a.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>';return}a.innerHTML=t.slice(0,120).map(e=>`
    <div class="card" onclick="window.__abrir('${e.id}')">
      ${e.imagen_principal?`<img class="thumb" src="${e.imagen_principal}" loading="lazy">`:'<div class="thumb"></div>'}
      <div class="body">
        <div class="name">${u(e.nombre)}</div>
        <div class="sku">${u(e.sku_interno||"")}</div>
        <div class="price">${_(e.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${_(e.precio_mayoreo3)}</span>
          <span class="tier">6+ ${_(e.precio_mayoreo6)}</span>
          ${Go(e.id)?`<span class="tier corr">Corr ${_(e.precio_corrida)}</span>`:""}
        </div>
      </div>
    </div>`).join("")}}let w={productoId:null,color:null,modo:"variado"},x=1;window.__abrir=Vo;function Go(o){const t=s.data.variantes.filter(e=>e.producto_id===o),a=[...new Set(t.map(e=>e.color).filter(Boolean))];return a.length?a.some(e=>Uo(o,e)):!1}function Uo(o,t){return J(o,t)>=1}function J(o,t){if(!t)return 0;const a=s.data.variantes.filter(i=>i.producto_id===o&&i.color===t);if(!a.length)return 0;const e=a.some(i=>i.talla&&(i.talla.includes(".5")||i.talla.includes("½")||i.talla.includes("/")));let n=0;for(let i=1;i<=6;i++)if(e){if(a.filter(d=>(s.data.stockPorVar[d.id]||0)>=i).length>=6){n=i;continue}let c=0;if(a.forEach(d=>{const l=s.data.stockPorVar[d.id]||0;c+=Math.min(l,2*i)}),c>=6*i)n=i;else break}else{let r=0;if(a.forEach(c=>{const d=s.data.stockPorVar[c.id]||0;r+=Math.min(d,2*i)}),r>=6*i)n=i;else break}return n}function To(o,t,a){const e=s.data.variantes.filter(c=>c.producto_id===o&&c.color===t).sort((c,d)=>Z.indexOf(c.talla)-Z.indexOf(d.talla)),n=e.some(c=>c.talla&&(c.talla.includes(".5")||c.talla.includes("½")||c.talla.includes("/"))),i={};if(n){const c=e.filter(d=>(s.data.stockPorVar[d.id]||0)>=a);if(c.length>=6)return c.slice(0,6).forEach(d=>{i[d.id]=a}),i}let r=6*a;for(const c of e){const d=s.data.stockPorVar[c.id]||0,l=Math.min(d,2*a,r);if(l>0&&(i[c.id]=l,r-=l),r<=0)break}return i}function Vo(o){const t=s.data.productos.find(i=>i.id===o);if(!t)return;const a=s.data.variantes.filter(i=>i.producto_id===o),e=[...new Set(a.map(i=>i.color).filter(Boolean))];w={productoId:o,color:e[0]||null,modo:"variado"},x=1;const n=document.createElement("div");n.className="modal-overlay",n.id="pmodal",n.innerHTML=`
    <div class="modal">
      <div class="m-head">
        ${t.imagen_principal?`<img id="pm-img" src="${t.imagen_principal}">`:""}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${u(t.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${u(t.sku_interno||"")}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${_(t.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${_(t.precio_mayoreo3)}</span>
            <span class="tier">6+ ${_(t.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${_(t.precio_corrida)}</span>
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
          ${e.map(i=>{var l;const r=a.filter(v=>v.color===i),c=r.map(v=>v.foto_url).find(Boolean),d=((l=r[0])==null?void 0:l.color_hex)||"#999";return`<div class="swatch ${i===w.color?"active":""}" data-color="${u(i)}" onclick="window.__pickColor('${u(i)}')">
              ${c?`<img src="${c}">`:`<div class="hex" style="background:${d}"></div>`}
              <span>${u(i)}</span>
            </div>`}).join("")}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>
      </div>
    </div>`,document.body.appendChild(n),n.addEventListener("click",i=>{i.target===n&&n.remove()}),w.color&&(Lo(),W())}function Lo(){const o=document.getElementById("pm-mode");if(!o)return;const{productoId:t,color:a}=w,n=J(t,a)>=1,i=document.getElementById("pm-tier-corr");if(i&&(i.style.display=n?"":"none"),!n)w.modo==="corrida"&&(w.modo="variado"),o.innerHTML=`
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `;else{const r=w.modo;o.innerHTML=`
      <button data-modo="variado" class="${r==="variado"?"on":""}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${r==="corrida"?"on":""}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `}}window.__pickColor=o=>{w.color=o,x=1,document.querySelectorAll("#pm-swatches .swatch").forEach(n=>n.classList.toggle("active",n.dataset.color===o));const a=s.data.variantes.filter(n=>n.producto_id===w.productoId&&n.color===o).map(n=>n.foto_url).find(Boolean),e=document.getElementById("pm-img");e&&a&&(e.src=a),Lo(),W()};window.__modoModal=o=>{w.modo=o,x=1,document.querySelectorAll("#pm-mode button").forEach(t=>t.classList.toggle("on",t.dataset.modo===o)),W()};function Jo(){const{productoId:o,color:t}=w;return s.data.variantes.filter(a=>a.producto_id===o&&a.color===t).sort((a,e)=>Z.indexOf(a.talla)-Z.indexOf(e.talla))}function W(){const o=document.getElementById("pm-tallas");if(!o)return;const{color:t,modo:a,productoId:e}=w,n=s.data.productos.find(c=>c.id===e),i=Jo(),r=document.getElementById("pm-tallas-label");if(a==="corrida"){const c=J(e,t);x>c&&(x=Math.max(1,c)),r&&(r.textContent=`Corrida completa — ${t} · ${_(n.precio_corrida)} x par`),o.className="corrida-rows",o.innerHTML=`
      <div class="crow" style="border-bottom: none; padding-bottom: 12px; margin-bottom: 12px;">
        <span class="ct" style="min-width: 140px; font-weight: 800; font-size: 1.1rem; color: var(--black);">Corridas</span>
        <span class="cs muted" style="font-size: .8rem;">Máx: ${c}</span>
        <div class="cstep">
          <button onclick="window.__changeCorridaM(-1)">−</button>
          <span>${x}</span>
          <button onclick="window.__changeCorridaM(1)">+</button>
        </div>
      </div>
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pink); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    `}else r&&(r.textContent="Tallas — "+t),o.className="tallas",o.innerHTML=i.map(c=>{var v;const d=s.data.stockPorVar[c.id]||0,l=((v=s.carrito.find(m=>m.variante_id===c.id&&!m.es_corrida))==null?void 0:v.cantidad)||0;return`<button class="talla ${l?"on":""}" ${d<=0?"disabled":""} onclick="window.__addTalla('${c.id}')">
        <span class="t">${c.talla}</span>
        <span class="s">${d<=0?"Agotado":"Stock "+d}</span>
        ${l?`<span class="q">${l}</span>`:""}
      </button>`}).join("");Wo()}function Wo(){const o=document.getElementById("pm-foot");o&&(w.modo==="corrida"?o.innerHTML=`
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${x} ${x===1?"corrida":"corridas"} (${x*6} pares)</button>
    `:o.innerHTML=`<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`)}window.__changeCorridaM=o=>{const{productoId:t,color:a}=w,e=J(t,a);x=Math.min(e,Math.max(1,x+o)),W()};window.__agregarCorrida=()=>{const{productoId:o,color:t}=w,a=s.data.productos.find(c=>c.id===o),e=To(o,t,x);let n=0;if(Object.entries(e).forEach(([c,d])=>{if(d<=0)return;const l=s.data.variantes.find(m=>m.id===c),v=s.carrito.find(m=>m.variante_id===c&&m.es_corrida);v?v.cantidad+=d:s.carrito.push({variante_id:c,producto_id:a.id,nombre:a.nombre,color:l.color,talla:l.talla,cantidad:d,es_corrida:!0,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:l.foto_url||a.imagen_principal||null}),n+=d}),!n){T("Elige al menos una corrida");return}x=1,z();const i=document.querySelector(".bottomnav");i&&(i.outerHTML=I());const r=document.getElementById("pmodal");r&&r.remove(),to("carrito"),T("Corrida agregada · "+n+" pares")};window.__addTalla=o=>{const t=s.data.variantes.find(r=>r.id===o),a=s.data.productos.find(r=>r.id===t.producto_id),e=s.data.stockPorVar[o]||0,n=s.carrito.find(r=>r.variante_id===o&&!r.es_corrida);if(((n==null?void 0:n.cantidad)||0)>=e){T("Sin más stock ("+e+")");return}n?n.cantidad+=1:s.carrito.push({variante_id:o,producto_id:a.id,nombre:a.nombre,color:t.color,talla:t.talla,cantidad:1,es_corrida:!1,precio_menudeo:a.precio_menudeo,precio_mayoreo3:a.precio_mayoreo3,precio_mayoreo6:a.precio_mayoreo6,precio_corrida:a.precio_corrida,imagen:t.foto_url||a.imagen_principal||null}),z(),W(),document.querySelector(".bottomnav").outerHTML=I(),T("Agregado · "+U()+" pares")};function U(){return s.carrito.reduce((o,t)=>o+t.cantidad,0)}function po(){return s.carrito.filter(o=>!o.es_corrida).reduce((o,t)=>o+t.cantidad,0)}function ro(o,t){return o.es_corrida?o.precio_corrida:t>=6?o.precio_mayoreo6:t>=3?o.precio_mayoreo3:o.precio_menudeo}function uo(){const o=po();return s.carrito.reduce((t,a)=>t+a.cantidad*ro(a,o),0)}const oo="Borrador del carrito (portal_mayoreo)";let j=null,$o=null,Y=null,F=null;function mo(){Y&&(clearInterval(Y),Y=null),F&&(window.removeEventListener("focus",F),F=null)}function Xo(){mo();const o=()=>Ko();Y=setInterval(o,8e3),F=o,window.addEventListener("focus",F)}async function Ko(){var t;if(s.tab!=="carrito"||!((t=s.sesion)!=null&&t.cliente_id)){mo();return}const o=document.activeElement;if(!(o&&(o.tagName==="INPUT"||o.tagName==="TEXTAREA")))try{const a=await fetch(y+"/portal/pedidos",{headers:E()}).then(c=>c.ok?c.json():null),e=(Array.isArray(a)?a:[]).find(c=>c.notes===oo),n=(e==null?void 0:e.pedido_items)||[],i=JSON.stringify(s.carrito.map(c=>[c.variante_id,c.cantidad,c.precio_unitario||c.precio_menudeo||0])),r=JSON.stringify(n.map(c=>{var d;return[c.variante_id||((d=c.variantes)==null?void 0:d.id),c.cantidad,c.precio_unitario]}));if(i===r)return;j=(e==null?void 0:e.id)||null,s.carrito=n.map(c=>{var v;const d=c.variantes,l=s.data.productos.find(m=>m.id===((d==null?void 0:d.producto_id)||c.producto_id));return{producto_id:(d==null?void 0:d.producto_id)||c.producto_id,variante_id:(d==null?void 0:d.id)||c.variante_id,nombre:((v=d==null?void 0:d.productos)==null?void 0:v.nombre)||c.nombre||(l==null?void 0:l.nombre)||"Producto",color:(d==null?void 0:d.color)||c.color,talla:(d==null?void 0:d.talla)||c.talla,cantidad:c.cantidad,es_corrida:!!c.es_corrida,precio_menudeo:(l==null?void 0:l.precio_menudeo)||0,precio_mayoreo3:(l==null?void 0:l.precio_mayoreo3)||0,precio_mayoreo6:(l==null?void 0:l.precio_mayoreo6)||0,precio_corrida:(l==null?void 0:l.precio_corrida)||0,imagen:(d==null?void 0:d.foto_url)||(l==null?void 0:l.imagen_principal)||null}}),fo(),s.tab==="carrito"&&N()}catch{}}function fo(){try{localStorage.setItem(xo,JSON.stringify(s.carrito))}catch{}const o=document.querySelector(".bottomnav");o&&(o.outerHTML=I())}function z(){fo(),Yo()}function Yo(){clearTimeout($o),$o=setTimeout(()=>{Zo().catch(()=>{})},1500)}async function Zo(){var t,a;if(!((t=s.sesion)!=null&&t.cliente_id))return;if(!s.carrito.length){if(j){const e=j;j=null,fetch(`${y}/pedidos/${e}/cancelar`,{method:"POST",headers:E()}).catch(()=>{})}return}let o=j;if(!o)try{const e=await fetch(y+"/portal/pedidos",{headers:E()}).then(i=>i.ok?i.json():[]),n=(Array.isArray(e)?e:[]).find(i=>i.notas===oo);n&&(o=n.id,j=o)}catch{}if(!o){const e=await fetch(`${y}/pedidos`,{method:"POST",headers:{"Content-Type":"application/json",...E()},body:JSON.stringify({cliente_id:s.sesion.cliente_id,status:"borrador",canal:"portal_mayoreo",total:0,notas:oo})});if(!e.ok)return;const n=await e.json();if(o=Array.isArray(n)?(a=n[0])==null?void 0:a.id:n==null?void 0:n.id,!o)return;j=o}try{const e=await fetch(`${y}/pedidos/${o}/items`,{headers:E()}).then(i=>i.ok?i.json():[]);for(const i of Array.isArray(e)?e:[])await fetch(`${y}/pedidos/${o}/items/${i.id}`,{method:"DELETE",headers:E()}).catch(()=>{});for(const i of s.carrito){const r=s.carrito.reduce((l,v)=>l+v.cantidad,0),c=s.data.productos.find(l=>l.id===i.producto_id);let d=i.precio_menudeo||0;c&&(i.es_corrida?d=c.precio_corrida:r>=6?d=c.precio_mayoreo6:r>=3&&(d=c.precio_mayoreo3)),await fetch(`${y}/pedidos/${o}/items`,{method:"POST",headers:{"Content-Type":"application/json",...E()},body:JSON.stringify({variante_id:i.variante_id,cantidad:i.cantidad,precio_unitario:d,subtotal:i.cantidad*d,nombre:i.nombre,color:i.color,talla:i.talla,es_corrida:!!i.es_corrida})}).catch(()=>{})}const n=uo();await fetch(`${y}/pedidos/${o}`,{method:"PATCH",headers:{"Content-Type":"application/json",...E()},body:JSON.stringify({total:n})}).catch(()=>{})}catch{}}async function Qo(o){const t=(Array.isArray(o)?o:[]).find(n=>n.notas===oo);if(!t)return;j=t.id;const a=t.pedido_items||[];if(!a.length)return;const e=[];a.forEach(n=>{var c;const i=n.variantes;if(!i||!i.id)return;const r=s.data.productos.find(d=>d.id===i.producto_id);e.push({producto_id:i.producto_id,variante_id:i.id,nombre:((c=i.productos)==null?void 0:c.nombre)||n.nombre||(r==null?void 0:r.nombre)||"Producto",color:i.color||n.color,talla:i.talla||n.talla,cantidad:n.cantidad,es_corrida:!!n.es_corrida,precio_menudeo:(r==null?void 0:r.precio_menudeo)||0,precio_mayoreo3:(r==null?void 0:r.precio_mayoreo3)||0,precio_mayoreo6:(r==null?void 0:r.precio_mayoreo6)||0,precio_corrida:(r==null?void 0:r.precio_corrida)||0,imagen:i.foto_url||(r==null?void 0:r.imagen_principal)||null})}),e.length&&(s.carrito=e,fo())}function ot(){const o=po();return s.carrito.every(t=>t.es_corrida)&&s.carrito.length?"Corrida":o>=6?"Mayoreo 6+":o>=3?"Mayoreo 3+":"Menudeo"}function N(){if(!s.carrito.length){S().innerHTML=`<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`;return}const o=po(),t=uo(),a=s.carrito.filter(r=>!r.es_corrida),e=s.carrito.filter(r=>r.es_corrida),n={};e.forEach(r=>{const c=`${r.producto_id}-${r.color}`;n[c]||(n[c]={key:c,es_grupo_corrida:!0,producto_id:r.producto_id,color:r.color,nombre:r.nombre,imagen:r.imagen,precio_corrida:r.precio_corrida,cantidad:0,items:[]}),n[c].cantidad+=r.cantidad,n[c].items.push(r)});const i=[...a.map((r,c)=>({...r,originalIdx:s.carrito.indexOf(r)})),...Object.values(n)];S().innerHTML=`
    <p class="section-title">${U()} pares · ${ot()}</p>
    ${i.map(r=>r.es_grupo_corrida?`
          <div class="row">
            <div class="r-top">
              ${r.imagen?`<img src="${r.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.9rem">${u(r.nombre)}</div>
                <div class="muted" style="font-size:.78rem">${u(r.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${_(r.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${r.producto_id}', '${u(r.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${r.producto_id}', '${u(r.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${r.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${r.producto_id}', '${u(r.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${_(r.cantidad*r.precio_corrida)}</span>
            </div>
          </div>
        `:`
          <div class="row">
            <div class="r-top">
              ${r.imagen?`<img src="${r.imagen}">`:'<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.9rem">${u(r.nombre)}</div>
                <div class="muted" style="font-size:.78rem">${u(r.color)} · T${u(r.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${_(ro(r,o))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${r.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${r.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${r.cantidad}</span>
              <button onclick="window.__qty(${r.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${_(r.cantidad*ro(r,o))}</span>
            </div>
          </div>
        `).join("")}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${U()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${_(t)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`}window.__qty=(o,t)=>{const a=s.carrito[o];if(a){if(t>0){const e=s.data.stockPorVar[a.variante_id]||0;if(s.carrito.filter(i=>i.variante_id===a.variante_id).reduce((i,r)=>i+r.cantidad,0)>=e){T("Sin más stock ("+e+")");return}}a.cantidad=Math.max(1,a.cantidad+t),z(),N(),document.querySelector(".bottomnav").outerHTML=I()}};window.__delItem=o=>{s.carrito.splice(o,1),z(),N(),document.querySelector(".bottomnav").outerHTML=I()};window.__qtyGrupoCorrida=(o,t,a)=>{const r=s.carrito.filter(m=>m.producto_id===o&&m.color===t&&m.es_corrida).reduce((m,b)=>m+b.cantidad,0)/6+a;if(r<=0){window.__delGrupoCorrida(o,t);return}const c=J(o,t);if(r>c){T(`Sin existencias para ${r} corridas (máximo ${c})`);return}const d=To(o,t,r);s.carrito=s.carrito.filter(m=>!(m.producto_id===o&&m.color===t&&m.es_corrida));const l=s.data.productos.find(m=>m.id===o);Object.entries(d).forEach(([m,b])=>{if(b<=0)return;const L=s.data.variantes.find(X=>X.id===m);s.carrito.push({variante_id:m,producto_id:l.id,nombre:l.nombre,color:L.color,talla:L.talla,cantidad:b,es_corrida:!0,precio_menudeo:l.precio_menudeo,precio_mayoreo3:l.precio_mayoreo3,precio_mayoreo6:l.precio_mayoreo6,precio_corrida:l.precio_corrida,imagen:L.foto_url||l.imagen_principal||null})}),z(),N();const v=document.querySelector(".bottomnav");v&&(v.outerHTML=I())};window.__delGrupoCorrida=(o,t)=>{s.carrito=s.carrito.filter(e=>!(e.producto_id===o&&e.color===t&&e.es_corrida)),z(),N();const a=document.querySelector(".bottomnav");a&&(a.outerHTML=I())};window.__enviarPedido=async()=>{var o;if(s.carrito.length){if((o=s.sesion)!=null&&o.demo){T("Modo demo: no se envía pedido real");return}if(confirm("¿Enviar este pedido al negocio? Te confirmarán existencia y total."))try{const t=await fetch(y+"/portal/carrito",{method:"POST",headers:E(),body:JSON.stringify({items:s.carrito.map(e=>({variante_id:e.variante_id,cantidad:e.cantidad,es_corrida:!!e.es_corrida}))})});if(co(t))return;const a=await t.json();if(!t.ok||!a.ok)throw new Error(a.error||"");s.carrito=[],z(),T(a.fusionado?"Se agregó a tu carrito anterior":"¡Pedido enviado!"),to("pedidos")}catch{alert("No se pudo enviar el pedido. Intenta de nuevo.")}}};async function tt(){S().innerHTML='<div class="spinner">Cargando pedidos…</div>';let o=[];try{const t=await fetch(y+"/portal/pedidos",{headers:E()});if(co(t))return;o=await t.json()}catch{}if(o=Array.isArray(o)?o.filter(t=>t.status!=="borrador"):[],!o.length){S().innerHTML='<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>';return}S().innerHTML=o.map(t=>{const a=t.pedido_items||[],e=a.reduce((i,r)=>i+(r.cantidad||0),0),n=t.created_at?new Date(t.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}):"";return`<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(t.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${n} · ${e} pares</div>
        </div>
        ${et(t.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${_(M(t.total))}</div>
      ${a.slice(0,4).map(i=>{var r,c;return`<div class="muted" style="font-size:.78rem;margin-top:4px">• ${u(((c=(r=i.variantes)==null?void 0:r.productos)==null?void 0:c.nombre)||i.nombre||"Producto")} ${i.color?"· "+u(i.color):""} T${u(i.talla||"")} ×${i.cantidad}</div>`}).join("")}
      ${a.length>4?`<div class="muted" style="font-size:.76rem;margin-top:4px">+${a.length-4} más…</div>`:""}
      ${t.numero_guia?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${u(t.paqueteria||"Envío")} · Guía ${u(t.numero_guia)}</div>
        ${bo(t.tracking_url)?`<a href="${u(bo(t.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>`:""}
      </div>`:""}
    </div>`}).join("")}function et(o){const t={borrador:["#eef2ff","#3730a3","Borrador"],pendiente_pago:["#fffbeb","#b45309","Por pagar"],confirmado:["#ecfdf5","#065f46","Confirmado"],pagado:["#ecfdf5","#065f46","Pagado"],enviado:["#eff6ff","#1d4ed8","Enviado"],entregado:["#f0fdf4","#15803d","Entregado"],cancelado:["#fef2f2","#991b1b","Cancelado"]},[a,e,n]=t[o]||["#f3f4f6","#374151",o||"—"];return`<span class="badge-status" style="background:${a};color:${e}">${n}</span>`}async function at(){S().innerHTML='<div class="spinner">Cargando…</div>';let o=null;try{const t=await fetch(y+"/portal/me",{headers:E()});if(co(t))return;o=await t.json()}catch{}o=o||{nombre:s.sesion.nombre,tipo:s.sesion.tipo},S().innerHTML=`
    <div class="row">
      <p class="section-title">Mis datos</p>
      <p style="font-weight:700;margin:0 0 2px">${u(o.nombre||"")}</p>
      <p class="muted" style="font-size:.84rem;margin:0">${u(o.telefono||"Sin teléfono")}</p>
      <p class="muted" style="font-size:.84rem;margin:2px 0 0">${u(o.email||"Sin correo")}</p>
      <p style="margin:10px 0 0"><span class="badge-status" style="background:#fce4f3;color:var(--pink)">Cliente ${u(o.tipo||"mayoreo")}</span></p>
    </div>
    ${o.direccion||o.ciudad?`<div class="row">
      <p class="section-title">Dirección</p>
      <p class="muted" style="font-size:.84rem;margin:0">${u(o.direccion||"")} ${u(o.ciudad||"")} ${u(o.estado||"")} ${u(o.codigo_postal||"")}</p>
    </div>`:""}
    ${M(o.limite_credito)||M(o.credito_disponible)?`<div class="row">
      <p class="section-title">Crédito</p>
      ${M(o.limite_credito)?`<p style="font-size:.86rem;margin:0">Límite: <b>${_(M(o.limite_credito))}</b>${o.dias_credito?" · "+o.dias_credito+" días":""}</p>`:""}
      ${M(o.credito_disponible)?`<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${_(M(o.credito_disponible))}</b></p>`:""}
    </div>`:""}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`}window.__salir=Eo;async function it(){S().innerHTML='<div class="spinner">Cargando catálogos…</div>';let o=[];try{o=await fetch(y+"/catalogos/").then(e=>e.json())}catch{}o=Array.isArray(o)?o:[];const t=[["tacones","👠 Tacones"],["sandalias","👡 Sandalias"],["flats","🥿 Flats"],["botas","🥾 Botas"],["botines","👢 Botines"],["plataformas","⬆️ Plataformas"],["tenis","👟 Tenis"],["nina","🎀 Niña"],["accesorios","👜 Accesorios"]],a=o.length?o.map(e=>`
    <div class="cat-card">
      ${e.portada_url?`<img src="${e.portada_url}" loading="lazy">`:'<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>'}
      <div class="info">
        <h3>${u(e.nombre||"Catálogo")}</h3>
        <div class="muted" style="font-size:.78rem">${u(e.temporada||"")}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${e.id}','${u(e.nombre||"")}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${e.id}','${u(e.nombre||"")}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join(""):'<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>';S().innerHTML=`
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
        ${t.map(([e,n])=>`
          <button class="category-btn" data-categoria="${e}" data-label="${n.replace(/^[^\s]+\s/,"")}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${n.split(" ")[0]}</span>
            <span class="label">${n.split(" ")[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`}window.__switchSubTab=o=>{const t=document.getElementById("catalogos-general-content"),a=document.getElementById("catalogos-categorias-content"),e=document.getElementById("btn-cat-general"),n=document.getElementById("btn-cat-categorias");o==="categorias"?(t&&(t.style.display="none"),a&&(a.style.display="block"),e&&e.classList.remove("active"),n&&n.classList.add("active")):(t&&(t.style.display="block"),a&&(a.style.display="none"),e&&e.classList.add("active"),n&&n.classList.remove("active"))};window.__descargarPdfCategorias=async o=>{const t=o.getAttribute("data-categoria"),a=o.getAttribute("data-label"),e=document.getElementById("cat-pdf-msg"),n=document.querySelectorAll("#cat-pdf-btns button");n.forEach(i=>i.disabled=!0),e&&(e.style.display="block",e.textContent=`⏳ Cargando productos de ${a}...`);try{const i=s.data.productos.filter(p=>p.categoria&&String(p.categoria).trim().toLowerCase()===String(t).trim().toLowerCase());if(!i.length){e&&(e.textContent=`Sin productos activos en ${a}`),setTimeout(()=>{e&&(e.style.display="none")},3e3),n.forEach(p=>p.disabled=!1);return}const r=[];if(i.forEach(p=>{const h=s.data.variantes.filter(f=>f.producto_id===p.id&&f.activa!==!1),g=new Set;h.forEach(f=>{if(!f.color||g.has(f.color.trim().toUpperCase()))return;g.add(f.color.trim().toUpperCase());const k=f.foto_url||p.imagen_principal;k&&r.push({sku:p.sku_interno||"S/K",color:f.color.trim().toUpperCase(),imgUrl:k})}),g.size===0&&p.imagen_principal&&r.push({sku:p.sku_interno||"S/K",color:"ÚNICO",imgUrl:p.imagen_principal})}),!r.length){e&&(e.textContent=`Sin fotos disponibles para ${a}`),setTimeout(()=>{e&&(e.style.display="none")},3e3),n.forEach(p=>p.disabled=!1);return}e&&(e.textContent=`✏️ Generando catálogo PDF (${r.length} variantes)...`),window.jspdf||await new Promise((p,h)=>{const g=document.createElement("script");g.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",g.onload=p,g.onerror=h,document.head.appendChild(g)});const{jsPDF:c}=window.jspdf,d=2,l=3,v=d*l,m=1080,b=1440,L=40,X=80,go=24,vo=32,K=(m-L*2-go*(d-1))/d,yo=(b-X*2-vo*(l-1))/l,eo=yo-50,jo=p=>new Promise(h=>{if(!p)return h(null);const g=new Image;g.crossOrigin="anonymous",g.onload=()=>h(g),g.onerror=()=>h(null),g.src=p+(p.includes("?")?"&":"?")+"_t="+Date.now()}),Ao=(p,h,g,f,k,$)=>{if(p.save(),p.fillStyle="#FFFFFF",p.fillRect(g,f,k,$),h){p.beginPath(),p.rect(g,f,k,$),p.clip();const A=h.naturalWidth/h.naturalHeight,io=k/$;let B,P,O,q;A>io?(P=$,B=$*A,q=f,O=g+(k-B)/2):(B=k,P=k/A,O=g,q=f+($-P)/2),p.drawImage(h,O,q,B,P)}else p.fillStyle="#F3F4F6",p.fillRect(g,f,k,$),p.fillStyle="#9CA3AF",p.font="20px sans-serif",p.textAlign="center",p.fillText("Sin imagen",g+k/2,f+$/2);p.restore()},D=[];for(let p=0;p<r.length;p+=v)D.push(r.slice(p,p+v));const ao=new c({orientation:"portrait",unit:"px",format:[m,b]});let _o=!0;for(let p=0;p<D.length;p++){e&&(e.textContent=`✏️ Generando página ${p+1} de ${D.length}...`);const h=D[p],g=document.createElement("canvas");g.width=m,g.height=b;const f=g.getContext("2d");f.fillStyle="#FAFAF8",f.fillRect(0,0,m,b),f.fillStyle="#2A1A0E",f.font="300 20px sans-serif",f.textAlign="center",f.letterSpacing="4px",f.fillText(`CATÁLOGO DE ${a.toUpperCase()}`,m/2,38),f.letterSpacing="0px",f.fillStyle="#C8967A",f.fillRect(L,48,m-L*2,1.5);for(let $=0;$<h.length;$++){const A=h[$],io=$%d,B=Math.floor($/d),P=L+io*(K+go),O=X+B*(yo+vo),q=await jo(A.imgUrl);Ao(f,q,P,O,K,eo),f.fillStyle="#E8DDD5",f.fillRect(P,O+eo,K,1),f.fillStyle="#2A1A0E",f.textAlign="center",f.font="600 18px sans-serif",f.fillText(`${A.sku} ${A.color}`,P+K/2,O+eo+28)}f.fillStyle="#C8967A",f.fillRect(L,b-48,m-L*2,1),f.fillStyle="#A07860",f.font="300 14px sans-serif",f.textAlign="center",f.fillText(`Página ${p+1} de ${D.length}`,m/2,b-30);const k=g.toDataURL("image/jpeg",.9);_o||ao.addPage([m,b]),ao.addImage(k,"JPEG",0,0,m,b),_o=!1}const Oo=`catalogo_${t}_${new Date().toISOString().slice(0,10)}.pdf`;ao.save(Oo),e&&(e.textContent="✅ ¡Catálogo descargado!",setTimeout(()=>{e.style.display="none"},4e3))}catch(i){console.error("Error generating PDF:",i),e&&(e.textContent=`❌ Error al generar el PDF: ${i.message}`)}finally{n.forEach(i=>i.disabled=!1)}};async function Io(o){const t=await fetch(y+"/catalogos/"+o+"/paginas").then(a=>a.json()).catch(()=>[]);return Array.isArray(t)?t:[]}window.__verCatalogo=async(o,t)=>{const a=await Io(o),e=document.createElement("div");e.className="modal-overlay",e.id="catv",e.innerHTML=`
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${u(t)}</div><div class="muted" style="font-size:.76rem">${a.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${a.length?a.map(n=>`<img src="${n.imagen_url}" loading="lazy">`).join(""):'<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${o}','${u(t)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`,document.body.appendChild(e),e.addEventListener("click",n=>{n.target===e&&e.remove()})};window.__descargarCatalogo=async(o,t,a)=>{const e=a?a.textContent:"";a&&(a.disabled=!0,a.textContent="Descargando…");try{const n=await Io(o);if(!n.length){T("Este catálogo no tiene páginas"),a&&(a.disabled=!1,a.textContent=e);return}const i=(t||"catalogo").replace(/[^\w]+/g,"_");let r=0;for(const c of n){r++;try{const l=await(await fetch(c.imagen_url)).blob(),v=URL.createObjectURL(l),m=document.createElement("a");m.href=v,m.download=`${i}_${String(c.pagina_numero||r).padStart(2,"0")}.jpg`,document.body.appendChild(m),m.click(),m.remove(),URL.revokeObjectURL(v),await new Promise(b=>setTimeout(b,300))}catch{window.open(c.imagen_url,"_blank")}}T("Descarga lista · "+n.length+" páginas")}catch{T("No se pudo descargar")}a&&(a.disabled=!1,a.textContent=e)};function nt(){s.mayaMsgs||(s.mayaMsgs=[]),S().innerHTML=`
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${s.mayaMsgs.length?s.mayaMsgs.map(Po).join(""):'<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>'}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`,document.getElementById("maya-send").onclick=window.__mayaSend,document.getElementById("maya-in").addEventListener("keydown",o=>{o.key==="Enter"&&window.__mayaSend()}),setTimeout(()=>{const o=document.getElementById("maya-msgs");o&&(o.scrollTop=o.scrollHeight)},50)}function Po(o){if(o.typing)return'<div class="msg bot typing">Maya está escribiendo…</div>';const t=(o.fotos||[]).map(a=>`<img src="${u(a)}" loading="lazy">`).join("");return`<div class="msg ${o.role==="me"?"me":"bot"}">${u(o.content)}${t}</div>`}function Co(){const o=document.getElementById("maya-msgs");o&&(o.innerHTML=s.mayaMsgs.map(Po).join(""),o.scrollTop=o.scrollHeight)}function rt(o){const t=[];let a=String(o||"").replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g,(e,n)=>(t.push(n.replace(/[\[\]]/g,"")),""));return a=a.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g,"").replace(/\n{3,}/g,`

`).trim(),{texto:a||"👍",fotos:t}}window.__mayaSend=async()=>{const o=document.getElementById("maya-in");if(!o)return;const t=(o.value||"").trim();if(!t)return;o.value="",s.mayaMsgs||(s.mayaMsgs=[]);const a=s.mayaMsgs.filter(e=>!e.typing).map(e=>({role:e.role==="me"?"user":"assistant",content:e.content}));s.mayaMsgs.push({role:"me",content:t}),s.mayaMsgs.push({role:"bot",typing:!0}),Co();try{const n=await(await fetch(y+"/chatbot/mensaje",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mensaje:t,historial:a})})).json();s.mayaMsgs.pop();const{texto:i,fotos:r}=rt(n.respuesta);s.mayaMsgs.push({role:"bot",content:i,fotos:r})}catch{s.mayaMsgs.pop(),s.mayaMsgs.push({role:"bot",content:"Ups, no me pude conectar. Intenta de nuevo en un momento."})}Co()};let ko=null;function T(o){const t=document.getElementById("toast");t&&(t.textContent=o,t.classList.add("show"),clearTimeout(ko),ko=setTimeout(()=>t.classList.remove("show"),1600))}zo();
