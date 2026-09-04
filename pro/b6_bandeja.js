/* b6_bandeja.js — bandeja de piezas.
   Todo lo que se descarga queda apuntado aquí (láminas, vídeos, PDF, QR).
   Desde la bandeja se marca lo que interesa y se baja junto en un ZIP o
   suelto. Vive en memoria: al recargar la página se vacía. */
(function () {
  if (window.B6Bandeja) return;

  var B = { piezas: [], _n: 0, _oy: [], ocupada: false, nota: '' };

  function avisar() { B._oy.forEach(function (f) { try { f(B); } catch (e) { } }); }
  B.suscribir = function (f) { B._oy.push(f); return function () { B._oy = B._oy.filter(function (x) { return x !== f; }); }; };

  function extDe(n) { var m = /\.([a-z0-9]{2,5})$/i.exec(n || ''); return m ? m[1].toLowerCase() : 'archivo'; }

  /* Se llama desde cada descarga. La URL puede ser dataURL u objectURL:
     se pasa a Blob al vuelo porque el objectURL se anula a los pocos segundos. */
  B.apuntar = function (url, nombre, origen) {
    if (!url || !nombre) return;
    var p = { id: ++B._n, nombre: nombre, ext: extDe(nombre), origen: origen || '', sel: true, blob: null, bytes: 0, ts: Date.now() };
    B.piezas.unshift(p);
    avisar();
    try {
      fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
        p.blob = b; p.bytes = b.size; avisar();
      }).catch(function () { });
    } catch (e) { }
    return p;
  };

  B.alternar = function (id) {
    var p = B.piezas.filter(function (x) { return x.id === id; })[0];
    if (p) { p.sel = !p.sel; avisar(); }
  };
  B.todo = function (v, pref) { B.filtrar(pref).forEach(function (p) { p.sel = !!v; }); avisar(); };
  B.quitar = function (id) { B.piezas = B.piezas.filter(function (x) { return x.id !== id; }); avisar(); };
  B.limpiar = function () { B.piezas = []; B.nota = ''; avisar(); };
  B.marcadas = function (pref) { return B.filtrar(pref).filter(function (p) { return p.sel && p.blob; }); };

  /* Piezas de una sola pestaña. El filtro puede ser el principio del nombre
     ('triptico') o un origen declarado por quien descarga ({origen:'guias'}). */
  B.filtrar = function (filtro) {
    if (!filtro) return B.piezas;
    if (typeof filtro === 'object') {
      return B.piezas.filter(function (p) { return p.origen === filtro.origen; });
    }
    var re = new RegExp('^(' + filtro + ')', 'i');
    return B.piezas.filter(function (p) { return re.test(p.nombre); });
  };

  function bajar(blob, nombre) {
    var u = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = u; a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(u); }, 3000);
  }

  /* Sueltos: uno detrás de otro, con un respiro entre cada uno para que el
     navegador no bloquee la tanda. */
  B.bajarSueltos = function (pref) {
    var m = B.marcadas(pref);
    if (!m.length) { B.nota = 'No hay nada marcado.'; return avisar(); }
    m.forEach(function (p, i) { setTimeout(function () { bajar(p.blob, p.nombre); }, i * 450); });
    B.nota = m.length + (m.length === 1 ? ' archivo descargado.' : ' archivos descargados, uno detrás de otro.');
    avisar();
  };

  B.bajarUno = function (id) {
    var p = B.piezas.filter(function (x) { return x.id === id; })[0];
    if (p && p.blob) bajar(p.blob, p.nombre);
  };

  B.zip = function (nombreZip, pref) {
    var m = B.marcadas(pref);
    if (!m.length) { B.nota = 'No hay nada marcado.'; return avisar(); }
    if (!window.JSZip) { B.nota = 'El ZIP necesita conexión la primera vez. Con internet vuelve a intentarlo.'; return avisar(); }
    var z = new JSZip();
    var usados = {};
    m.forEach(function (p) {
      var n = p.nombre;
      if (usados[n]) { var c = ++usados[n]; n = n.replace(/(\.[^.]+)$/, ' (' + c + ')$1'); } else usados[p.nombre] = 1;
      z.file(n, p.blob);
    });
    B.ocupada = true; B.nota = 'Armando el ZIP con ' + m.length + ' archivos…'; avisar();
    z.generateAsync({ type: 'blob', compression: 'STORE' }).then(function (b) {
      bajar(b, (nombreZip || 'estudio-universal') + '.zip');
      B.ocupada = false;
      B.nota = 'ZIP descargado con ' + m.length + (m.length === 1 ? ' archivo.' : ' archivos.');
      avisar();
    }).catch(function (e) {
      B.ocupada = false; B.nota = 'No se ha podido armar el ZIP: ' + e.message; avisar();
    });
  };

  B.peso = function (p) {
    if (!p.blob) return 'preparando…';
    var k = p.bytes / 1024;
    return k > 1024 ? (k / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(k)) + ' KB';
  };

  /* Panel compacto para incrustar en cada pestaña (DOM plano). */
  B.panel = function (host, pref, nombreZip) {
    function pintar() {
      var l = B.filtrar(pref);
      host.textContent = '';
      host.style.cssText = 'background:#141430;border:1px solid #2d2d4a;border-radius:10px;padding:10px 11px;margin-top:9px';

      var t = document.createElement('div');
      t.textContent = 'Descargas de esta pestaña';
      t.style.cssText = 'font-size:10px;color:#7c7c9e;letter-spacing:.08em;text-transform:uppercase;font-weight:700';
      host.appendChild(t);

      var lista = document.createElement('div');
      lista.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-top:8px;max-height:220px;overflow-y:auto;overflow-x:hidden';
      l.forEach(function (p) {
        var f = document.createElement('label');
        f.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:6px 9px;background:#18183a;border:1px solid #2d2d4a;border-radius:8px;padding:7px 9px;cursor:pointer';
        var ck = document.createElement('input');
        ck.type = 'checkbox'; ck.checked = !!p.sel;
        ck.style.cssText = 'accent-color:#a855f7;width:14px;height:14px;flex:none';
        ck.onchange = function () { B.alternar(p.id); };
        var ex = document.createElement('span');
        ex.textContent = (p.ext || '').toUpperCase();
        ex.style.cssText = 'font-size:9px;font-weight:800;letter-spacing:.06em;color:#a855f7;background:#241a4a;border-radius:5px;padding:3px 6px;flex:none';
        var nm = document.createElement('b');
        nm.textContent = p.nombre;
        nm.style.cssText = 'flex:1 1 120px;min-width:0;font-size:11px;font-weight:600;color:#cbd5e1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
        var pe = document.createElement('span');
        pe.textContent = B.peso(p);
        pe.style.cssText = 'font-size:10px;color:#7c7c9e;flex:none';
        var bb = document.createElement('button');
        bb.textContent = 'Bajar';
        bb.style.cssText = 'background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;border-radius:6px;padding:4px 8px;font-size:10px;cursor:pointer;flex:none';
        bb.onclick = function (ev) { ev.preventDefault(); B.bajarUno(p.id); };
        f.appendChild(ck); f.appendChild(ex); f.appendChild(nm); f.appendChild(pe); f.appendChild(bb);
        lista.appendChild(f);
      });
      host.appendChild(lista);

      var fila = document.createElement('div');
      fila.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center';
      function bt(txt, fn, fuerte) {
        var b = document.createElement('button');
        b.textContent = txt;
        b.style.cssText = 'border-radius:8px;padding:7px 11px;font-size:11px;font-weight:600;cursor:pointer;' +
          (fuerte ? 'background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0'
            : 'background:#1a1a35;color:#cbd5e1;border:1px solid #2d2d4a');
        b.onclick = fn;
        return b;
      }
      fila.appendChild(bt('🗜 ZIP de lo marcado', function () { B.zip(nombreZip || 'descargas', pref); }, true));
      fila.appendChild(bt('Bajar sueltos', function () { B.bajarSueltos(pref); }));
      fila.appendChild(bt('Marcar todo', function () { B.todo(true, pref); }));
      fila.appendChild(bt('Desmarcar', function () { B.todo(false, pref); }));
      host.appendChild(fila);

      var n = document.createElement('div');
      n.textContent = B.nota || (l.length
        ? B.marcadas(pref).length + ' de ' + l.length + ' marcadas.'
        : 'Vacía por ahora: lo que descargues en esta pestaña aparece aquí para bajarlo junto en ZIP.');
      n.style.cssText = 'font-size:10.5px;color:#7c7c9e;line-height:1.55;margin-top:7px';
      host.appendChild(n);
    }
    pintar();
    return B.suscribir(pintar);
  };

  window.B6Bandeja = B;
})();
