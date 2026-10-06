 embebido
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');

  const html = informeHTMLPlantilla(json);
  const blob = new Blob(['\ufeff', html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Informe_interactivo_${cursoActivo}_${informesPeriodoFilename()}${informesFiltrosFilenameSuffix()}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('Informe HTML descargado','success');
};

/* Plantilla del documento HTML autocontenido: CSS y JS incrustados, sin
 * dependencias externas, para que funcione abriendo el archivo directamente. */
function informeHTMLPlantilla(json){
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Informe de partes de incidencia</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,'Helvetica Neue',Arial,sans-serif;background:#f4f6f9;color:#1f2933;padding-bottom:60px}
.tabs{position:sticky;top:0;z-index:10;display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px;background:#1e3a5f;box-shadow:0 2px 8px rgba(15,30,60,.25)}
.tab{border:0;cursor:pointer;font:inherit;font-size:13px;font-weight:600;padding:7px 13px;border-radius:18px;background:rgba(255,255,255,.14);color:#fff;transition:background .15s}
.tab:hover{background:rgba(255,255,255,.28)}
.tab.activa{background:#c9a227;color:#15294a}
.tab .n{font-weight:400;opacity:.75;margin-left:5px;font-size:12px}
.page{display:none;max-width:900px;margin:0 auto;padding:22px 16px}
.page.activa{display:block}
.portada{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(15,30,60,.12);padding:48px 36px;text-align:center;margin-top:30px;border-top:6px solid #c9a227}
.portada h1{color:#1e3a5f;font-size:28px;line-height:1.3}
.portada .periodo{font-size:20px;color:#c9a227;font-weight:700;margin-top:12px}
.portada .meta{margin-top:18px;font-size:14px;color:#52606d;line-height:1.8}
.portada .centro{margin-top:34px;font-size:13px;color:#7b8794}
h2.titulo{color:#1e3a5f;font-size:22px;margin-bottom:4px}
.sub{font-size:13px;color:#7b8794;margin-bottom:14px}
.filtros-tipo{display:flex;gap:8px;margin:0 0 16px;align-items:center;flex-wrap:wrap}
.ftipo{border:2px solid #e1e7ef;background:#fff;cursor:pointer;font:inherit;font-size:13px;font-weight:700;padding:6px 16px;border-radius:18px;color:#52606d;transition:all .15s}
.ftipo.ccnc.activa{background:#e0eef9;border-color:#1c6fb8;color:#1c6fb8}
.ftipo.cgpc.activa{background:#fbe6e4;border-color:#b3261e;color:#b3261e}
.contador{font-size:13px;color:#7b8794;margin-left:auto}
.card{background:#fff;border:1px solid #e1e7ef;border-left:4px solid #1c6fb8;border-radius:10px;padding:13px 15px;margin-bottom:10px;box-shadow:0 1px 2px rgba(15,30,60,.05)}
.card.cgpc{border-left-color:#b3261e}
.card .cab{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}
.card .alumno{font-weight:700;font-size:15px}
.chip{display:inline-block;padding:2px 9px;border-radius:12px;font-size:11px;font-weight:700;letter-spacing:.02em}
.chip.ccnc{background:#e0eef9;color:#1c6fb8}
.chip.cgpc{background:#fbe6e4;color:#b3261e}
.card .codigo{font-family:Consolas,monospace;font-size:12px;background:#f1f4f8;padding:1px 6px;border-radius:5px;color:#1e3a5f;font-weight:600;margin-right:6px}
.card .conducta{font-size:13px;color:#52606d;margin:6px 0}
.card .desc{font-size:12.5px;color:#52606d;background:#f7f9fc;border-radius:6px;padding:6px 8px;margin:6px 0;white-space:pre-wrap;line-height:1.4}
.card .meta{display:flex;flex-wrap:wrap;gap:10px;font-size:11.5px;color:#7b8794;border-top:1px dashed #e1e7ef;padding-top:7px;margin-top:7px}
.card .meta .ok{color:#2e7d4f;font-weight:600}
.stat-grid{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;justify-content:center}
.stat.btn-stat{cursor:pointer;border:2px solid #e1e7ef;transition:all .15s}
.stat.btn-stat:hover{border-color:#c9a227;transform:translateY(-2px);box-shadow:0 4px 12px rgba(15,30,60,.08)}
.stat.btn-stat.activa{border-color:#c9a227;background:#fdf8e7}
.res-portada{margin-top:26px;text-align:left}
.res-cab{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.res-titulo{font-size:14px;font-weight:700;color:#1e3a5f}
.res-quitar{border:0;background:#eef1f5;color:#52606d;cursor:pointer;font:inherit;font-size:12px;font-weight:600;padding:5px 12px;border-radius:14px}
.res-quitar:hover{background:#e1e7ef}
.chip-alumno{border:2px solid #e1e7ef;background:#fff;cursor:pointer;font:inherit;font-size:13px;font-weight:600;color:#1e3a5f;padding:6px 13px;border-radius:16px;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
.chip-alumno:hover{border-color:#c9a227}
.chip-alumno.activa{border-color:#c9a227;background:#fdf8e7}
.chip-alumno .n{background:#1e3a5f;color:#fff;border-radius:10px;font-size:11px;font-weight:700;padding:1px 8px}
.res-unidad{font-size:11.5px;color:#7b8794}
.stat{background:#fff;border:1px solid #e1e7ef;border-radius:12px;padding:14px 26px;min-width:110px}
.stat .num{font-size:26px;font-weight:800;color:#1e3a5f}
.stat .lbl{font-size:12px;color:#7b8794;margin-top:2px}
.vacio{background:#fff;border:1px dashed #c9a227;border-radius:10px;padding:22px;text-align:center;color:#7b8794;font-size:14px}
.alumnos-strip{background:#fff;border:1px solid #e1e7ef;border-radius:10px;padding:12px 15px;margin-bottom:14px;box-shadow:0 1px 2px rgba(15,30,60,.05)}
.strip-titulo{font-size:12px;font-weight:700;color:#7b8794;text-transform:uppercase;letter-spacing:.03em;margin-bottom:9px}
.strip-botones{display:flex;flex-wrap:wrap;gap:8px}
.alumno-btn{border:2px solid #e1e7ef;background:#f7f9fc;cursor:pointer;font:inherit;font-size:13.5px;font-weight:600;color:#1e3a5f;padding:7px 14px;border-radius:18px;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
.alumno-btn:hover{border-color:#c9a227;background:#fdf8e7;transform:translateY(-1px)}
.alumno-btn .n{background:#1e3a5f;color:#fff;border-radius:10px;font-size:11px;font-weight:700;padding:1px 8px}
.alumno-btn.multi{border-color:#c9a227}
.alumno-btn.multi .n{background:#c9a227;color:#15294a}
.btn-volver{border:0;background:#1e3a5f;color:#fff;cursor:pointer;font:inherit;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;margin-bottom:14px;transition:background .15s}
.btn-volver:hover{background:#2d5485}
.ficha-alumno{animation:aparecer .18s ease-out}
.titulo-alumno{color:#1e3a5f;font-size:21px;margin-bottom:2px}
@keyframes aparecer{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media print{
  .tabs{display:none}
  .page{display:block !important;max-width:none;padding:0}
  .portada{box-shadow:none;margin-top:0}
  .card,.vacio{break-inside:avoid}
  .sep-print{page-break-before:always}
  .filtros-tipo{display:none}
}
</style>
</head>
<body>
<nav class="tabs" id="barraTabs"></nav>
<main id="contenido"></main>
<script>
var DATA = ${json};
var filtroActivo = {};
var ALUMNOS = {};
function esc(s){ var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
function construir(){
  var barra = document.getElementById('barraTabs');
  var cont = document.getElementById('contenido');
  var html = '';
  var tabs = '<button class="tab activa" onclick="mostrar(0,this)">Portada</button>';
  html += paginaPortada();
  var unidades = [];
  DATA.grupos.forEach(function(g){ unidades.push(g); });
  if(DATA.sinGrupo.length > 0){ unidades.push({ nombre: 'Sin grupo', partes: DATA.sinGrupo }); }
  unidades.forEach(function(g, i){
    tabs += '<button class="tab" onclick="mostrar(' + (i+1) + ',this)">' + esc(g.nombre) + '<span class="n">(' + g.partes.length + ')</span></button>';
    html += paginaUnidad(g, i+1);
  });
  barra.innerHTML = tabs;
  cont.innerHTML = html;
}
function paginaPortada(){
  prepararPortada();
  var total = 0, ccnc = 0, cgpc = 0, alumnos = {}, grupos = 0;
  DATA.grupos.forEach(function(g){ grupos++; g.partes.forEach(function(p){ total++; if(p.tipo === 'CGPC'){ cgpc++; } else { ccnc++; } alumnos[p.alumno] = 1; }); });
  DATA.sinGrupo.forEach(function(p){ total++; if(p.tipo === 'CGPC'){ cgpc++; } else { ccnc++; } alumnos[p.alumno] = 1; });
  var nal = Object.keys(alumnos).length;
  return '<section class="page activa" id="pg-0">' +
    '<div class="portada">' +
      '<h1>Informe de partes de incidencia<br>en el período ' + esc(DATA.periodo) + '</h1>' +
      '<div class="periodo">Curso ' + esc(DATA.curso) + '</div>' +
      '<div class="meta">' +
        'Filtros aplicados: ' + esc(DATA.filtros) + '<br>' +
        'Unidades del centro incluidas: ' + grupos + '<br>' +
        'Generado el ' + esc(DATA.generado) +
      '</div>' +
      '<div class="stat-grid">' +
        '<div class="stat btn-stat" id="st-todos" data-f="" onclick="filtrarPortadaBtn(this)"><div class="num">' + total + '</div><div class="lbl">Partes totales</div></div>' +
        '<div class="stat btn-stat" id="st-ccnc" data-f="CCNC" onclick="filtrarPortadaBtn(this)"><div class="num">' + ccnc + '</div><div class="lbl">CCNC</div></div>' +
        '<div class="stat btn-stat" id="st-cgpc" data-f="CGPC" onclick="filtrarPortadaBtn(this)"><div class="num">' + cgpc + '</div><div class="lbl">CGPC</div></div>' +
        '<div class="stat btn-stat" id="st-alumnos" onclick="toggleAlumnosPortada()"><div class="num">' + nal + '</div><div class="lbl">Alumnos afectados</div></div>' +
      '</div>' +
      '<div id="res-portada" class="res-portada"></div>' +
      '<div class="centro">' + esc(DATA.centro) + ' · Plan de Convivencia</div>' +
    '</div>' +
  '</section>';
}
function paginaUnidad(g, idx){
  var h = '<section class="page sep-print" id="pg-' + idx + '">' +
    '<h2 class="titulo">Unidad: ' + esc(g.nombre) + '</h2>' +
    '<div class="sub">Partes de incidencia en ' + esc(DATA.periodo) + ' · Curso ' + esc(DATA.curso) + '</div>';
  // Pantalla intermedia: un botón por alumno con el número de partes;
  // el desglose de fichas se muestra al pulsar cada botón.
  var alumnos = agruparAlumnos(g.partes);
  ALUMNOS[idx] = alumnos;
  // Contenedor de la pantalla de botones (se oculta al abrir una ficha)
  h += '<div id="lista-' + idx + '">';
  if(g.partes.length === 0){
    h += '<div class="vacio">No hay partes de esta unidad en el período seleccionado.</div>';
  } else {
    h += '<div class="alumnos-strip">' +
        '<div class="strip-titulo">Alumnos de la unidad (' + alumnos.length + ') — pulsa un alumno para ver el desglose de sus partes:</div>' +
        '<div class="strip-botones">';
    alumnos.forEach(function(a, ai){
      h += '<button class="alumno-btn' + (a.partes.length >= 2 ? ' multi' : '') + '" onclick="verAlumno(' + idx + ', ' + ai + ')">' +
        esc(a.nombre) + '<span class="n">' + a.partes.length + '</span></button>';
    });
    h += '</div></div>';
  }
  h += '</div>';
  // Contenedor del desglose del alumno (oculto hasta que se pulse su botón)
  h += '<div id="alumno-' + idx + '" style="display:none"></div>';
  return h + '</section>';
}
function agruparAlumnos(partes){
  var map = {};
  var orden = [];
  partes.forEach(function(p){
    if(!map[p.alumno]){ map[p.alumno] = { nombre: p.alumno, partes: [] }; orden.push(map[p.alumno]); }
    map[p.alumno].partes.push(p);
  });
  orden.sort(function(a, b){ return a.nombre.localeCompare(b.nombre, 'es'); });
  return orden;
}
/* Portada viva: los botones de estadística filtran y muestran los
 * resultados en la propia portada. PF guarda el estado del filtro. */
var PORTADA = [];
var PF = { tipo: null, alumno: -1, verAlumnos: false, mostrar: false };
function prepararPortada(){
  PORTADA = [];
  DATA.grupos.forEach(function(g){
    g.partes.forEach(function(p){ var q = {}; for(var k in p){ q[k] = p[k]; } q.unidad = g.nombre; PORTADA.push(q); });
  });
  DATA.sinGrupo.forEach(function(p){ var q = {}; for(var k in p){ q[k] = p[k]; } q.unidad = 'Sin grupo'; PORTADA.push(q); });
  PF = { tipo: null, alumno: -1, verAlumnos: false, mostrar: false };
}
function filtrarPortadaBtn(btn){
  var f = btn.getAttribute('data-f');
  if(f === ''){
    PF.tipo = null;
  } else {
    PF.tipo = (PF.tipo === f) ? null : f;
  }
  PF.alumno = -1;
  PF.verAlumnos = false;
  PF.mostrar = true;
  pintarPortada();
}
function toggleAlumnosPortada(){
  PF.verAlumnos = !PF.verAlumnos;
  PF.alumno = -1;
  PF.tipo = null;
  PF.mostrar = PF.verAlumnos;
  pintarPortada();
}
function filtrarPortadaAlumnoI(ai){
  PF.alumno = (PF.alumno === ai) ? -1 : ai;
  PF.tipo = null;
  PF.mostrar = PF.alumno !== -1;
  pintarPortada();
}
function limpiarPortada(){
  PF = { tipo: null, alumno: -1, verAlumnos: false, mostrar: false };
  pintarPortada();
}
function cardPortada(p, i){
  return '<div class="card ' + (p.tipo === 'CGPC' ? 'cgpc' : 'ccnc') + '">' +
    '<div class="cab"><span class="alumno">' + esc(p.alumno) + '</span><span class="chip ' + (p.tipo === 'CGPC' ? 'cgpc' : 'ccnc') + '">' + p.tipo + '</span></div>' +
    '<div class="conducta"><span class="codigo">' + esc(p.codigo) + '</span>' + esc(p.conducta) + '</div>' +
    (p.descripcion ? '<div class="desc">' + esc(p.descripcion) + '</div>' : '') +
    '<div class="meta"><span>' + esc(p.fecha) + '</span><span>' + esc(p.unidad) + '</span><span>' + esc(p.profesor) + '</span>' +
      (p.ubicacion ? '<span>' + esc(p.ubicacion) + '</span>' : '') +
      (p.respiro ? '<span>Aula Respiro</span>' : '') +
      (p.familia ? '<span class="ok">Familia avisada</span>' : '') +
      (p.tutor ? '<span class="ok">Tutor avisado</span>' : '') +
    '</div>' +
  '</div>';
}
function pintarPortada(){
  var stT = document.getElementById('st-todos');
  var stC = document.getElementById('st-ccnc');
  var stG = document.getElementById('st-cgpc');
  var stA = document.getElementById('st-alumnos');
  if(stT){ stT.classList.toggle('activa', PF.mostrar && !PF.tipo && PF.alumno === -1 && !PF.verAlumnos); }
  if(stC){ stC.classList.toggle('activa', PF.tipo === 'CCNC'); }
  if(stG){ stG.classList.toggle('activa', PF.tipo === 'CGPC'); }
  if(stA){ stA.classList.toggle('activa', PF.verAlumnos || PF.alumno !== -1); }
  var cont = document.getElementById('res-portada');
  if(!cont){ return; }
  var sinFiltro = !PF.mostrar;
  if(sinFiltro){ cont.innerHTML = ''; return; }
  var alumnos = agruparAlumnos(PORTADA);
  var h = '<div class="res-cab">';
  if(PF.verAlumnos || PF.alumno !== -1){
    h += '<span class="res-titulo">Alumnado afectado:</span>';
    alumnos.forEach(function(a, ai){
      h += '<button class="chip-alumno' + (PF.alumno === ai ? ' activa' : '') + '" onclick="filtrarPortadaAlumnoI(' + ai + ')">' +
        esc(a.nombre) + '<span class="n">' + a.partes.length + '</span></button>';
    });
  } else {
    h += '<span class="res-titulo">Resultados: ' + esc(PF.tipo || 'todas las conductas') + '</span>';
  }
  h += '<button class="res-quitar" onclick="limpiarPortada()">✕ Quitar</button></div>';
  var lista = PORTADA;
  if(PF.tipo){ lista = lista.filter(function(p){ return p.tipo === PF.tipo; }); }
  if(PF.alumno !== -1){ var sel = alumnos[PF.alumno]; lista = lista.filter(function(p){ return sel && p.alumno === sel.nombre; }); }
  if(lista.length === 0){
    h += '<div class="vacio">No hay partes que coincidan con el filtro seleccionado.</div>';
  } else {
    lista.forEach(function(p){ h += cardPortada(p); });
  }
  cont.innerHTML = h;
}
function verAlumno(idx, ai){
  var a = (ALUMNOS[idx] || [])[ai];
  if(!a){ return; }
  var h = '<div class="ficha-alumno">' +
    '<button class="btn-volver" onclick="volverUnidad(' + idx + ')">&#8592; Volver a la unidad</button>' +
    '<h3 class="titulo-alumno">' + esc(a.nombre) + '</h3>' +
    '<div class="sub">' + a.partes.length + ' partes de incidencia en ' + esc(DATA.periodo) + ' · Curso ' + esc(DATA.curso) + '</div>' +
    '<div class="filtros-tipo">' +
      '<span style="font-size:12px;color:#7b8794;font-weight:600">Filtrar conductas:</span>' +
      '<button class="ftipo ccnc" data-t="CCNC" onclick="filtrarTipo(' + idx + ', this)">CCNC</button>' +
      '<button class="ftipo cgpc" data-t="CGPC" onclick="filtrarTipo(' + idx + ', this)">CGPC</button>' +
      '<span class="contador" id="conta-' + idx + '"></span>' +
    '</div>';
  a.partes.forEach(function(p){
    h += '<div class="card ' + (p.tipo === 'CGPC' ? 'cgpc' : 'ccnc') + '" data-pg="' + idx + '" data-tipo="' + p.tipo + '">' +
      '<div class="cab"><span class="alumno">' + esc(p.alumno) + '</span><span class="chip ' + (p.tipo === 'CGPC' ? 'cgpc' : 'ccnc') + '">' + p.tipo + '</span></div>' +
      '<div class="conducta"><span class="codigo">' + esc(p.codigo) + '</span>' + esc(p.conducta) + '</div>' +
      (p.descripcion ? '<div class="desc">' + esc(p.descripcion) + '</div>' : '') +
      '<div class="meta"><span>' + esc(p.fecha) + '</span><span>' + esc(p.profesor) + '</span>' +
        (p.ubicacion ? '<span>' + esc(p.ubicacion) + '</span>' : '') +
        (p.respiro ? '<span>Aula Respiro</span>' : '') +
        (p.familia ? '<span class="ok">Familia avisada</span>' : '') +
        (p.tutor ? '<span class="ok">Tutor avisado</span>' : '') +
      '</div>' +
    '</div>';
  });
  h += '</div>';
  var cont = document.getElementById('alumno-' + idx);
  cont.innerHTML = h;
  document.getElementById('lista-' + idx).style.display = 'none';
  cont.style.display = '';
  window.scrollTo(0, 0);
  aplicar(idx);
}
function volverUnidad(idx){
  document.getElementById('alumno-' + idx).style.display = 'none';
  document.getElementById('alumno-' + idx).innerHTML = '';
  document.getElementById('lista-' + idx).style.display = '';
  window.scrollTo(0, 0);
}
function mostrar(idx, btn){
  var ps = document.querySelectorAll('.page');
  for(var i = 0; i < ps.length; i++){ ps[i].classList.remove('activa'); }
  document.getElementById('pg-' + idx).classList.add('activa');
  var ts = document.querySelectorAll('.tab');
  for(var j = 0; j < ts.length; j++){ ts[j].classList.remove('activa'); }
  btn.classList.add('activa');
  // Al cambiar de pestaña, devolver la unidad a su listado completo
  for(var k in ALUMNOS){
    if(ALUMNOS.hasOwnProperty(k)){ volverUnidad(k); }
  }
  window.scrollTo(0, 0);
}
function filtrarTipo(idx, btn){
  var tipo = btn.getAttribute('data-t');
  var set = filtroActivo[idx] || (filtroActivo[idx] = {});
  if(set[tipo]){ delete set[tipo]; btn.classList.remove('activa'); }
  else { set[tipo] = true; btn.classList.add('activa'); }
  aplicar(idx);
}
function aplicar(idx){
  var set = filtroActivo[idx] || {};
  var visibles = 0;
  var cards = document.querySelectorAll('[data-pg="' + idx + '"]');
  for(var i = 0; i < cards.length; i++){
    var t = cards[i].getAttribute('data-tipo');
    var ok = (!set.CCNC && !set.CGPC) || set[t];
    cards[i].style.display = ok ? '' : 'none';
    if(ok){ visibles++; }
  }
  // Contador de la ficha de alumno abierta (si la hay)
  var ca = document.getElementById('conta-' + idx);
  if(ca){ ca.textContent = visibles + ' partes visibles'; }
}
construir();
<\/script>
</body>
</html>`;
}

window.generarPDFAdminGeneral = () => {
  const cursoActivo = informesCursoSel();
  const partes = filtrarPartesInforme(cachedPartes);
  const porAlumno = {}; partes.forEach(p => { porAlumno[p.alumnoNombre] = (porAlumno[p.alumnoNombre]||0)+1; });
  const porConducta = {}; partes.forEach(p => { porConducta[p.conductaId] = (porConducta[p.conductaId]||0)+1; });
  const porGrupo = {}; partes.forEach(p => { if(p.grupo) porGrupo[p.grupo] = (porGrupo[p.grupo]||0)+1; });
  const porProfesor = {}; partes.forEach(p => { porProfesor[p.profesorNombre||'—'] = (porProfesor[p.profesorNombre||'—']||0)+1; });
  const porAtenuante = {}; partes.forEach(p => { (p.atenuantes||[]).forEach(a => { porAtenuante[a] = (porAtenuante[a]||0)+1; }); });
  const porAgravante = {}; partes.forEach(p => { (p.agravantes||[]).forEach(a => { porAgravante[a] = (porAgravante[a]||0)+1; }); });

  $('printContainer').innerHTML = `
    ${printHeader('Informe general del centro', `Curso ${cursoActivo} · ${informesFiltrosActivosTexto()}`, `Generado por ${currentUser.nombre} el ${fmtFechaHora(Date.now())}`)}
    <div class="print-section">
      <h3>Resumen general</h3>
      <div class="stat-grid">
        ${printStatBox(partes.length, 'Total partes')}
        ${printStatBox(partes.filter(p=>p.tipo==='CCNC').length, 'CCNC')}
        ${printStatBox(partes.filter(p=>p.tipo==='CGPC').length, 'CGPC')}
        ${printStatBox(partes.filter(p=>p.aulaRespiro).length, 'Aula Respiro')}
        ${printStatBox(partes.filter(p=>p.notificadoFamilia).length, 'Familia notif.')}
        ${printStatBox(partes.filter(p=>p.notificadoTutor).length, 'Tutor notif.')}
        ${printStatBox(Object.keys(porAlumno).length, 'Alumnos afectados')}
        ${printStatBox(Object.keys(porGrupo).length, 'Grupos afectados')}
        ${printStatBox(Object.keys(porProfesor).length, 'Profesores')}
        ${printStatBox(partes.filter(p=>p.ubicacion).length, 'Con ubicación')}
      </div>
    </div>
    <div class="print-section">
      <h3>Desglose por grupo</h3>
      <table><thead><tr><th>Grupo</th><th>Nº partes</th><th>CCNC</th><th>CGPC</th></tr></thead><tbody>
        ${Object.entries(porGrupo).sort((a,b)=>b[1]-a[1]).map(([g,count]) => {
          const gp = partes.filter(p=>p.grupo===g);
          return `<tr><td><strong>${escapeHtml(g)}</strong></td><td style="text-align:center">${count}</td><td style="text-align:center">${gp.filter(p=>p.tipo==='CCNC').length}</td><td style="text-align:center">${gp.filter(p=>p.tipo==='CGPC').length}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Desglose por profesor</h3>
      <table><thead><tr><th>Profesor</th><th>Nº partes</th><th>CCNC</th><th>CGPC</th></tr></thead><tbody>
        ${Object.entries(porProfesor).sort((a,b)=>b[1]-a[1]).map(([nombre,count]) => {
          const pp = partes.filter(p=>p.profesorNombre===nombre);
          return `<tr><td>${escapeHtml(nombre)}</td><td style="text-align:center">${count}</td><td style="text-align:center">${pp.filter(p=>p.tipo==='CCNC').length}</td><td style="text-align:center">${pp.filter(p=>p.tipo==='CGPC').length}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Desglose por conducta</h3>
      <table><thead><tr><th>Código</th><th>Descripción</th><th>Nº partes</th></tr></thead><tbody>
        ${Object.entries(porConducta).sort((a,b)=>b[1]-a[1]).map(([id,count]) => {
          const cond = ALL_CONDUCTAS[id];
          return `<tr><td><strong>${escapeHtml(id)}</strong></td><td>${escapeHtml(cond?cond.texto:'')}</td><td style="text-align:center">${count}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Alumnos con más partes (top 15)</h3>
      <table><thead><tr><th>Alumno</th><th>Grupo</th><th>Nº partes</th><th>CCNC</th><th>CGPC</th></tr></thead><tbody>
        ${Object.entries(porAlumno).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([nombre,count]) => {
          const ap = partes.filter(p=>p.alumnoNombre===nombre);
          const grupo = ap[0]?.grupo || '—';
          return `<tr><td>${escapeHtml(nombre)}</td><td>${escapeHtml(grupo)}</td><td style="text-align:center">${count}</td><td style="text-align:center">${ap.filter(p=>p.tipo==='CCNC').length}</td><td style="text-align:center">${ap.filter(p=>p.tipo==='CGPC').length}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>
    ${Object.keys(porAtenuante).length > 0 ? `
    <div class="print-section">
      <h3>Atenuantes registradas</h3>
      <table><thead><tr><th>Atenuante</th><th>Nº veces</th></tr></thead><tbody>
        ${Object.entries(porAtenuante).sort((a,b)=>b[1]-a[1]).map(([id,count]) => {
          const at = ATENUANTES.find(a=>a.id===id);
          return `<tr><td>${escapeHtml(at?at.texto:id)}</td><td style="text-align:center">${count}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>` : ''}
    ${Object.keys(porAgravante).length > 0 ? `
    <div class="print-section">
      <h3>Agravantes registradas</h3>
      <table><thead><tr><th>Agravante</th><th>Nº veces</th></tr></thead><tbody>
        ${Object.entries(porAgravante).sort((a,b)=>b[1]-a[1]).map(([id,count]) => {
          const ag = AGRAVANTES.find(a=>a.id===id);
          return `<tr><td>${escapeHtml(ag?ag.texto:id)}</td><td style="text-align:center">${count}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>` : ''}
  `;
  // Nombre de archivo con el contenido: informe del centro + curso + período
  imprimirInforme(`Informe_general_centro_${cursoActivo}_${informesPeriodoFilename()}${informesFiltrosFilenameSuffix()}`);
};

window.infAdminAlumnoChange = () => {
  const alumno = $('infAdminAlumno').value;
  const div = $('infAdminAlumnoResult');
  if(!alumno){ div.innerHTML = ''; return; }
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.alumnoNombre === alumno))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  div.innerHTML = `
    <div style="margin-bottom:8px"><strong>${partes.length} partes</strong> para ${escapeHtml(alumno)}</div>
    <button class="btn btn-primary btn-sm" onclick="generarPDFAdminAlumno(document.getElementById('infAdminAlumno').value)"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Exportar a PDF</button>
    <div style="margin-top:10px">${partes.map(p => renderParteCard(p)).join('')}</div>
  `;
};

window.infAdminAlumnoSetup = () => {
  const sel = $('infAdminAlumno');
  if(sel) sel.onchange = infAdminAlumnoChange;
};

window.generarPDFAdminAlumno = (alumno) => {
  const cursoActivo = informesCursoSel();
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.alumnoNombre === alumno))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  const grupo = partes[0]?.grupo || '—';
  const grupoArchivo = sanitizeFilename(grupo !== '—' ? (grupo||'') : '');

  $('printContainer').innerHTML = `
    ${printHeader('Informe de alumno', `${alumno} · Grupo ${grupo}`, `Curso ${cursoActivo} · ${informesFiltrosActivosTexto()} · Generado por ${currentUser.nombre} el ${fmtFechaHora(Date.now())}`)}
    <div class="print-section">
      <h3>Resumen</h3>
      <div class="stat-grid">
        ${printStatBox(partes.length, 'Total partes')}
        ${printStatBox(partes.filter(p=>p.tipo==='CCNC').length, 'CCNC')}
        ${printStatBox(partes.filter(p=>p.tipo==='CGPC').length, 'CGPC')}
        ${printStatBox(partes.filter(p=>p.aulaRespiro).length, 'Aula Respiro')}
        ${printStatBox(partes.filter(p=>p.notificadoFamilia).length, 'Familia notif.')}
        ${printStatBox(partes.filter(p=>p.notificadoTutor).length, 'Tutor notif.')}
      </div>
    </div>
    <div class="print-section">
      <h3>Desglose por profesor</h3>
      <table><thead><tr><th>Profesor</th><th>Nº partes</th></tr></thead><tbody>
        ${Object.entries(partes.reduce((acc,p)=>{acc[p.profesorNombre||'—']=(acc[p.profesorNombre||'—']||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).map(([nombre,count])=>`<tr><td>${escapeHtml(nombre)}</td><td style="text-align:center">${count}</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Listado de partes (orden cronológico inverso)</h3>
      ${partes.map(p => printParteItem(p)).join('')}
    </div>
  `;
  // Nombre de archivo con el contenido: alumno + grupo + curso + período
  imprimirInforme(`Informe_alumno_${sanitizeFilename(alumno)}_${grupoArchivo||'sin-grupo'}_${cursoActivo}_${informesPeriodoFilename()}${informesFiltrosFilenameSuffix()}`);
};

window.infAdminGrupoChange = () => {
  const grupo = $('infAdminGrupo').value;
  const div = $('infAdminGrupoResult');
  if(!grupo){ div.innerHTML = ''; return; }
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.grupo === grupo))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  div.innerHTML = `
    <div style="margin-bottom:8px"><strong>${partes.length} partes</strong> en el grupo ${escapeHtml(grupo)}</div>
    <button class="btn btn-primary btn-sm" onclick="generarPDFAdminGrupo(document.getElementById('infAdminGrupo').value)"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Exportar a PDF</button>
    <div style="margin-top:10px">${partes.map(p => renderParteCard(p)).join('')}</div>
  `;
};

window.infAdminGrupoSetup = () => {
  const sel = $('infAdminGrupo');
  if(sel) sel.onchange = infAdminGrupoChange;
};

window.generarPDFAdminGrupo = (grupo) => {
  const cursoActivo = informesCursoSel();
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.grupo === grupo))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  const porAlumno = {}; partes.forEach(p => { porAlumno[p.alumnoNombre] = (porAlumno[p.alumnoNombre]||0)+1; });
  const porProfesor = {}; partes.forEach(p => { porProfesor[p.profesorNombre||'—'] = (porProfesor[p.profesorNombre||'—']||0)+1; });

  $('printContainer').innerHTML = `
    ${printHeader('Informe de grupo', `Grupo: ${grupo}`, `Curso ${cursoActivo} · ${informesFiltrosActivosTexto()} · Generado por ${currentUser.nombre} el ${fmtFechaHora(Date.now())}`)}
    <div class="print-section">
      <h3>Resumen</h3>
      <div class="stat-grid">
        ${printStatBox(partes.length, 'Total partes')}
        ${printStatBox(Object.keys(porAlumno).length, 'Alumnos afectados')}
        ${printStatBox(partes.filter(p=>p.tipo==='CCNC').length, 'CCNC')}
        ${printStatBox(partes.filter(p=>p.tipo==='CGPC').length, 'CGPC')}
        ${printStatBox(Object.keys(porProfesor).length, 'Profesores')}
        ${printStatBox(partes.filter(p=>p.aulaRespiro).length, 'Aula Respiro')}
      </div>
    </div>
    <div class="print-section">
      <h3>Desglose por alumno</h3>
      <table><thead><tr><th>Alumno</th><th>Nº partes</th><th>CCNC</th><th>CGPC</th></tr></thead><tbody>
        ${Object.entries(porAlumno).sort((a,b)=>b[1]-a[1]).map(([nombre,count]) => {
          const ap = partes.filter(p=>p.alumnoNombre===nombre);
          return `<tr><td>${escapeHtml(nombre)}</td><td style="text-align:center">${count}</td><td style="text-align:center">${ap.filter(p=>p.tipo==='CCNC').length}</td><td style="text-align:center">${ap.filter(p=>p.tipo==='CGPC').length}</td></tr>`;
        }).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Desglose por profesor</h3>
      <table><thead><tr><th>Profesor</th><th>Nº partes</th></tr></thead><tbody>
        ${Object.entries(porProfesor).sort((a,b)=>b[1]-a[1]).map(([nombre,count]) => `<tr><td>${escapeHtml(nombre)}</td><td style="text-align:center">${count}</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Listado de partes (orden cronológico inverso)</h3>
      ${partes.map(p => printParteItem(p)).join('')}
    </div>
  `;
  // Nombre de archivo con el contenido: grupo + curso + período
  imprimirInforme(`Informe_grupo_${sanitizeFilename(grupo)||'sin-grupo'}_${cursoActivo}_${informesPeriodoFilename()}${informesFiltrosFilenameSuffix()}`);
};

window.infAdminProfesorChange = () => {
  const profesor = $('infAdminProfesor').value;
  const div = $('infAdminProfesorResult');
  if(!profesor){ div.innerHTML = ''; return; }
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.profesorNombre === profesor))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  div.innerHTML = `
    <div style="margin-bottom:8px"><strong>${partes.length} partes</strong> puestos por ${escapeHtml(profesor)}</div>
    <button class="btn btn-primary btn-sm" onclick="generarPDFAdminProfesor(document.getElementById('infAdminProfesor').value)"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Exportar a PDF</button>
    <div style="margin-top:10px">${partes.map(p => renderParteCard(p)).join('')}</div>
  `;
};

window.infAdminProfesorSetup = () => {
  const sel = $('infAdminProfesor');
  if(sel) sel.onchange = infAdminProfesorChange;
};

window.generarPDFAdminProfesor = (profesor) => {
  const cursoActivo = informesCursoSel();
  const partes = filtrarPartesInforme(cachedPartes.filter(p => p.profesorNombre === profesor))
    .sort((a,b)=>(fechaIncidenteTs(b)||0)-(fechaIncidenteTs(a)||0));
  const porAlumno = {}; partes.forEach(p => { porAlumno[p.alumnoNombre] = (porAlumno[p.alumnoNombre]||0)+1; });
  const porGrupo = {}; partes.forEach(p => { if(p.grupo) porGrupo[p.grupo] = (porGrupo[p.grupo]||0)+1; });

  $('printContainer').innerHTML = `
    ${printHeader('Informe de profesor', `${profesor}`, `Curso ${cursoActivo} · ${informesFiltrosActivosTexto()} · Generado por ${currentUser.nombre} el ${fmtFechaHora(Date.now())}`)}
    <div class="print-section">
      <h3>Resumen</h3>
      <div class="stat-grid">
        ${printStatBox(partes.length, 'Total partes')}
        ${printStatBox(partes.filter(p=>p.tipo==='CCNC').length, 'CCNC')}
        ${printStatBox(partes.filter(p=>p.tipo==='CGPC').length, 'CGPC')}
        ${printStatBox(Object.keys(porAlumno).length, 'Alumnos')}
        ${printStatBox(Object.keys(porGrupo).length, 'Grupos')}
        ${printStatBox(partes.filter(p=>p.aulaRespiro).length, 'Aula Respiro')}
      </div>
    </div>
    <div class="print-section">
      <h3>Desglose por grupo</h3>
      <table><thead><tr><th>Grupo</th><th>Nº partes</th></tr></thead><tbody>
        ${Object.entries(porGrupo).sort((a,b)=>b[1]-a[1]).map(([g,count]) => `<tr><td>${escapeHtml(g)}</td><td style="text-align:center">${count}</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Desglose por alumno</h3>
      <table><thead><tr><th>Alumno</th><th>Nº partes</th></tr></thead><tbody>
        ${Object.entries(porAlumno).sort((a,b)=>b[1]-a[1]).map(([nombre,count]) => `<tr><td>${escapeHtml(nombre)}</td><td style="text-align:center">${count}</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div class="print-section">
      <h3>Listado de partes (orden cronológico inverso)</h3>
      ${partes.map(p => printParteItem(p)).join('')}
    </div>
  `;
  // Nombre de archivo con el contenido: profesor + curso + período
  imprimirInforme(`Informe_profesor_${sanitizeFilename(profesor)}_${cursoActivo}_${informesPeriodoFilename()}${informesFiltrosFilenameSuffix()}`);
};

/* ===== Notifications ===== */
function renderNotifications(c){
  // Los avisos van dirigidos a tutores: visibles para el perfil de tutor
  // y para los administradores (pueden ejercer de tutor de cualquier grupo)
  const effRole = getEffectiveRole();
  if(effRole !== 'tutor' && effRole !== 'admin'){
    c.innerHTML = `<div class="page-title">Avisos</div><div class="empty-state"><p>Los avisos solo están disponibles para el perfil de tutor.</p></div>`;
    return;
  }
  const notifs = cachedNotifications;
  c.innerHTML = `
    <div class="page-title">Notificaciones</div>
    <div class="page-subtitle">${notifs.filter(n=>!n.leida).length} sin leer · ${notifs.length} en total</div>
    <div class="card" style="padding:0">
      ${notifs.length === 0 ? `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg><h3>Sin notificaciones</h3><p>Cuando un profesor te notifique un parte de tu tutoría, aparecerá aquí.</p></div>` : ''}
      ${notifs.map(n => `
        <div class="notif-item ${n.leida?'':'unread'}" style="${n.persistente && !n.leida ? 'border-left:4px solid var(--c-accent);background:#fef9e7' : ''}" onclick="abrirNotificacion('${n.id}')">
          <div class="notif-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="notif-content">
            <div class="notif-title">${escapeHtml(n.titulo||'Nueva notificación')}</div>
            <div class="notif-text">${escapeHtml(n.texto||'')}</div>
            ${n.profesorNombre ? `<div class="notif-text" style="margin-top:4px">Por: ${escapeHtml(n.profesorNombre)}</div>` : ''}
            ${n.persistente && !n.leida ? '<div style="font-size:11px;color:var(--c-warning);font-weight:600;margin-top:4px"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Pendiente de revisar — abre el parte y marca el checkbox para confirmar</div>' : ''}
            <div class="notif-time">${fmtTiempoRelativo(n.createdAt)}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ${notifs.some(n => !n.leida && !n.persistente) ? `<button class="btn btn-secondary btn-block mt-16" onclick="marcarTodasLeidas()">Marcar todas como leídas</button>` : ''}
    ${notifs.some(n => !n.leida && n.persistente) ? `<div style="margin-top:8px;font-size:12px;color:var(--c-warning);text-align:center">Las notificaciones pendientes requieren que abras el parte y marques el checkbox de revisión.</div>` : ''}
  `;
}
window.abrirNotificacion = async (notifId) => {
  const n = cachedNotifications.find(x => x.id === notifId);
  if(!n) return;
  // Verificar si el parte asociado sigue existiendo
  if(n.parteId){
    const parte = cachedPartes.find(p => p.id === n.parteId);
    if(!parte){
      // El parte fue borrado: ofrecer eliminar la notificación huérfana
      if(confirm('Este parte ya no existe (ha sido eliminado). ¿Quieres eliminar esta notificación?')){
        await remove(ref(db, `${DB_ROOT}/notifications/${currentUserUid}/${notifId}`));
        toast('Notificación eliminada','success');
      }
      return;
    }
  }
  if(!n.leida && !n.persistente){
    await update(ref(db, `${DB_ROOT}/notifications/${currentUserUid}/${notifId}`), { leida: true, leidaAt: serverTimestamp() });
  }
  if(n.parteId) openParteDetail(n.parteId);
};
window.marcarTodasLeidas = async () => {
  const updates = {};
  // No marcar como leídas las notificaciones persistentes (requieren checkbox del parte)
  cachedNotifications.filter(n => !n.leida && !n.persistente).forEach(n => {
    updates[`${DB_ROOT}/notifications/${currentUserUid}/${n.id}/leida`] = true;
  });
  try{ await update(ref(db), updates); toast('Todas marcadas como leídas','success'); }catch(e){ toast('Error: '+e.message,'error'); }
};

/* ===== Cambio de contraseña (propia cuenta) =====
 * Flujo: validar en cliente → reautenticar con la contraseña actual
 * (confirma la identidad y evita el error auth/requires-recent-login)
 * → updatePassword con la nueva. Solo se toca Firebase Auth, nunca la
 * base de datos: las contraseñas no se guardan en RTDB. */
window.abrirCambiarPassword = () => {
  if(!auth.currentUser){ toast('No hay sesión activa. Vuelve a iniciar sesión.','error'); return; }
  const body = `
    <p style="margin-bottom:14px;font-size:13px;color:var(--c-text-soft);line-height:1.5">Cambia la contraseña de tu cuenta <strong>@${escapeHtml(currentUser.username||'')}</strong>. Introduce la actual para confirmar que eres tú.</p>
    <div class="form-group">
      <label for="cpActual">Contraseña actual</label>
      <div class="pw-wrap">
        <input type="password" id="cpActual" class="form-control" placeholder="Tu contraseña actual" autocomplete="current-password" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('cpNueva').focus()}">
        <button type="button" class="pw-eye" onclick="togglePwVisibility('cpActual',this)" title="Mostrar contraseña" aria-label="Mostrar u ocultar contraseña">
          <svg class="pw-eye-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg class="pw-eye-off" style="display:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        </button>
      </div>
    </div>
    <div class="form-group">
      <label for="cpNueva">Nueva contraseña</label>
      <div class="pw-wrap">
        <input type="password" id="cpNueva" class="form-control" placeholder="Mínimo 6 caracteres" autocomplete="new-password" oninput="actualizarFuerzaPassword()" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('cpConfirmar').focus()}">
        <button type="button" class="pw-eye" onclick="togglePwVisibility('cpNueva',this)" title="Mostrar contraseña" aria-label="Mostrar u ocultar contraseña">
          <svg class="pw-eye-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg class="pw-eye-off" style="display:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        </button>
      </div>
      <div id="cpStrength" class="pw-strength">
        <div class="bars"><i></i><i></i><i></i><i></i></div>
        <span class="lbl"></span>
      </div>
      <div class="form-hint">Mínimo 6 caracteres. Se recomienda combinar mayúsculas, minúsculas, números y símbolos.</div>
    </div>
    <div class="form-group">
      <label for="cpConfirmar">Repite la nueva contraseña</label>
      <div class="pw-wrap">
        <input type="password" id="cpConfirmar" class="form-control" placeholder="Otra vez la nueva contraseña" autocomplete="new-password" onkeydown="if(event.key==='Enter'){event.preventDefault();confirmarCambiarPassword()}">
        <button type="button" class="pw-eye" onclick="togglePwVisibility('cpConfirmar',this)" title="Mostrar contraseña" aria-label="Mostrar u ocultar contraseña">
          <svg class="pw-eye-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg class="pw-eye-off" style="display:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        </button>
      </div>
    </div>
    <div id="cpError" class="pw-error" hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span></span>
    </div>`;
  const footer = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" id="cpBtn" onclick="confirmarCambiarPassword()">
      <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
      <span>Guardar contraseña</span>
    </button>`;
  openModal('Cambiar contraseña', body, footer);
  actualizarFuerzaPassword();
  /* Autofocus solo con puntero fino (escritorio): en móvil/táblet evita
     que el teclado virtual salte nada más abrir el modal. */
  try{
    if(window.matchMedia && matchMedia('(pointer:fine)').matches){
      setTimeout(() => { const el = $('cpActual'); if(el) el.focus({preventScroll:true}); }, 90);
    }
  }catch(_e){}
};

/* Muestra/oculta una contraseña y alterna el icono del ojo */
window.togglePwVisibility = (inputId, btn) => {
  const inp = $(inputId);
  if(!inp || !btn) return;
  const mostrar = inp.type === 'password';
  inp.type = mostrar ? 'text' : 'password';
  const titulo = mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña';
  btn.title = titulo;
  btn.setAttribute('aria-label', titulo);
  const on = btn.querySelector('.pw-eye-on'), off = btn.querySelector('.pw-eye-off');
  if(on) on.style.display = mostrar ? 'none' : '';
  if(off) off.style.display = mostrar ? '' : 'none';
};

/* Nivel de fortaleza de una contraseña: 0=muy corta ... 4=muy fuerte */
function pwNivel(pw){
  if(!pw) return -1;
  if(pw.length < 6) return 0;
  let pts = 1;
  if(pw.length >= 10) pts++;
  if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) pts++;
  if(/\d/.test(pw)) pts++;
  if(/[^A-Za-z0-9]/.test(pw)) pts++;
  return Math.min(4, pts);
}

/* Repinta el medidor de fuerza según la nueva contraseña tecleada */
window.actualizarFuerzaPassword = () => {
  const inp = $('cpNueva'), cont = $('cpStrength');
  if(!inp || !cont) return;
  const pw = inp.value;
  const nivel = pwNivel(pw);
  const labels = ['Muy corta','Débil','Aceptable','Fuerte','Muy fuerte'];
  const colores = ['#b3261e','#d97706','#b8860b','#2e7d4f','#1f5c3a'];
  const bars = cont.querySelectorAll('.bars i');
  const lbl = cont.querySelector('.lbl');
  const encendidas = nivel < 0 ? 0 : Math.min(4, nivel + 1);
  bars.forEach((b, i) => { b.style.background = (nivel >= 0 && i < encendidas) ? colores[nivel] : 'var(--c-border)'; });
  if(lbl){
    lbl.textContent = nivel >= 0 ? labels[nivel] : '';
    lbl.style.color = nivel >= 0 ? colores[nivel] : 'var(--c-text-muted)';
  }
};

/* Traduce los errores de Firebase Auth del cambio de contraseña */
function mapearErrorCambioPassword(e){
  const code = (e && e.code) ? e.code : '';
  if(code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/invalid-email')
    return { msg:'La contraseña actual no es correcta.', focus:'cpActual' };
  if(code === 'auth/too-many-requests')
    return { msg:'Demasiados intentos fallidos. Espera unos minutos antes de volver a intentarlo.' };
  if(code === 'auth/network-request-failed')
    return { msg:'Sin conexión con el servidor. Comprueba tu conexión a Internet y vuelve a intentarlo.' };
  if(code === 'auth/weak-password')
    return { msg:'La nueva contraseña es demasiado débil: usa al menos 6 caracteres.', focus:'cpNueva' };
  if(code === 'auth/requires-recent-login')
    return { msg:'Por seguridad, tu sesión ha caducado. Cierra sesión, vuelve a entrar e inténtalo de nuevo.' };
  return { msg:'Error: ' + ((e && e.message) ? e.message : 'inesperado al cambiar la contraseña.') };
}

/* Valida, reautentica con la contraseña actual y guarda la nueva */
window.confirmarCambiarPassword = async () => {
  const actual = $('cpActual') ? $('cpActual').value : '';
  const nueva = $('cpNueva') ? $('cpNueva').value : '';
  const confirma = $('cpConfirmar') ? $('cpConfirmar').value : '';
  const errBox = $('cpError');
  const showErr = (msg) => {
    if(!errBox) return;
    const span = errBox.querySelector('span');
    if(span) span.textContent = msg;
    errBox.hidden = false;
  };
  if(errBox) errBox.hidden = true;

  /* 1) Validaciones de cliente */
  if(!actual || !nueva || !confirma){ showErr('Completa los tres campos para cambiar tu contraseña.'); return; }
  if(nueva.length < 6){ showErr('La nueva contraseña debe tener al menos 6 caracteres.'); const f = $('cpNueva'); if(f) f.focus(); return; }
  if(nueva !== confirma){ showErr('La nueva contraseña y su confirmación no coinciden.'); const f = $('cpConfirmar'); if(f) f.focus(); return; }
  if(nueva === actual){ showErr('La nueva contraseña debe ser distinta de la actual.'); const f = $('cpNueva'); if(f) f.focus(); return; }

  const user = auth.currentUser;
  if(!user){ showErr('Tu sesión ha expirado. Cierra sesión y vuelve a iniciarla.'); return; }

  /* 2) Bloquear el botón mientras se guarda */
  const btn = $('cpBtn');
  const btnHtml = btn ? btn.innerHTML : '';
  const lblBtn = btn ? btn.querySelector('span') : null;
  if(btn) btn.disabled = true;
  if(lblBtn) lblBtn.textContent = 'Guardando...';

  try{
    const email = user.email || usernameToEmail(currentUser.username || '');
    /* Confirmar la identidad con la contraseña actual */
    try{
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(email, actual));
    }catch(e){
      throw mapearErrorCambioPassword(e);
    }
    /* Guardar la nueva contraseña (con un reintento si la sesión era antigua) */
    try{
      await updatePassword(user, nueva);
    }catch(e){
      if(e && e.code === 'auth/requires-recent-login'){
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(email, actual));
        await updatePassword(user, nueva);
      } else {
        throw mapearErrorCambioPassword(e);
      }
    }
    closeModal();
    toast('Contraseña actualizada correctamente', 'success');
  }catch(e){
    const m = (e && e.msg) ? e : mapearErrorCambioPassword(e);
    showErr(m.msg);
    const f = m.focus ? $(m.focus) : null;
    if(f){ f.focus(); if(f.select) f.select(); }
  }finally{
    if(btn){ btn.disabled = false; btn.innerHTML = btnHtml; }
  }
};

/* ===== Profile ===== */
function renderProfile(c){
  const effRole = getEffectiveRole();
  const realRole = currentUser.role;
  c.innerHTML = `
    <div class="page-title">Mi perfil</div>
    <div class="page-subtitle">Información de tu cuenta</div>

    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px">
        <div style="width:64px;height:64px;border-radius:16px;background:var(--c-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700">${escapeHtml((currentUser.nombre||'?')[0].toUpperCase())}</div>
        <div>
          <div style="font-size:18px;font-weight:600">${escapeHtml(currentUser.nombre||'')}</div>
          <div style="font-size:13px;color:var(--c-text-muted)">@${escapeHtml(currentUser.username||'')}</div>
          <div style="margin-top:4px"><span class="role-badge role-${effRole||'profesor'}">${escapeHtml(effRole||'profesor')}</span>
          ${getEffectiveTutoriaGrupo() ? `<span class="chip primary" style="margin-left:6px">Tutoría: ${escapeHtml(getEffectiveTutoriaGrupo())}</span>` : ''}</div>
        </div>
      </div>
      <div class="detail-row"><span class="label">Entorno actual</span><span class="value"><span class="role-badge role-${effRole||'profesor'}">${escapeHtml(effRole||'profesor')}</span></span></div>
      ${effRole !== realRole ? `<div class="detail-row"><span class="label">Rol real</span><span class="value"><span class="role-badge role-${realRole||'profesor'}">${escapeHtml(realRole||'profesor')}</span></span></div>` : ''}
      ${getEffectiveTutoriaGrupo() ? `<div class="detail-row"><span class="label">Grupo de tutoría</span><span class="value">${escapeHtml(getEffectiveTutoriaGrupo())}</span></div>` : ''}
      <div class="detail-row"><span class="label">Cuenta creada</span><span class="value">${fmtFechaHora(currentUser.createdAt)}</span></div>
      ${currentUser.pendiente ? `<div class="detail-row"><span class="label">Estado</span><span class="value text-warning">Pendiente de aprobación por el administrador</span></div>` : ''}
    </div>

    ${effRole !== realRole ? `
    <div class="card" style="background:#f7f9fc;border-left:4px solid var(--c-info)">
      <div style="font-size:13px;color:var(--c-text-soft);line-height:1.5">
        <strong><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Estás trabajando en el entorno de ${escapeHtml(effRole)}.</strong> Tu rol real es <strong>${escapeHtml(realRole)}</strong>, pero has elegido entrar como <strong>${escapeHtml(effRole)}</strong>. Para cambiar de entorno, cierra sesión y vuelve a entrar eligiendo otro perfil.
      </div>
    </div>` : ''}

    <div class="card">
      <div class="card-title">
        <span><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> Seguridad</span>
        <span class="chip">Acceso a tu cuenta</span>
      </div>
      <div class="detail-row"><span class="label">Usuario</span><span class="value">@${escapeHtml(currentUser.username||'')}</span></div>
      <div class="detail-row"><span class="label">Contraseña</span><span class="value">••••••••</span></div>
      <p style="font-size:12.5px;color:var(--c-text-soft);line-height:1.5;margin:12px 0 14px">Puedes cambiar tu contraseña en cualquier momento. Necesitarás confirmar la actual; la nueva se usará a partir del siguiente inicio de sesión (tu sesión actual no se cierra).</p>
      <button class="btn btn-primary" onclick="abrirCambiarPassword()">
        <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> Cambiar contraseña
      </button>
    </div>

    <div class="card">
      <div class="card-title">Acciones</div>
      <div class="flex flex-col gap-8">
        <button class="btn btn-secondary" onclick="navigate('dashboard')">Ir al inicio</button>
        ${effRole === 'profesor' ? `<button class="btn btn-secondary" onclick="navigate('nuevoParte')">Crear nuevo parte</button>` : ''}
        <button class="btn btn-danger" onclick="doLogout()">Cerrar sesión</button>
      </div>
    </div>
    <div class="card" style="background:#f7f9fc;font-size:12px;color:var(--c-text-muted)">
      <strong style="color:var(--c-text-soft)">Convivencia IES VDV</strong><br>
      Aplicación PWA para gestión de partes de incidencias de convivencia.<br>
      IES Virgen de Villadiego · Plan de Convivencia 2024-25
    </div>
  `;
}

/* ===== Initial setup ===== */
// Load cached users for current user's display


// Listen to hash changes
window.addEventListener('hashchange', () => {
  const v = location.hash.replace('#','');
  if(v && v !== currentView) navigate(v);
});

/* Forzar el login en cada carga de la app.
 * Cerramos cualquier sesión persistida por Firebase Auth para que el
 * usuario tenga que autenticarse de nuevo (y, por tanto, volver a elegir
 * el entorno de trabajo en la pantalla de selección de perfil). */
try{
  signOut(auth).catch(() => {});
}catch(_){}

// Mostrar la pantalla de login tras un breve tiempo (o antes si onAuthStateChanged ya disparó)
function showLoginScreenIfNeeded(){
  if(loginShown || currentUser) return;
  loginShown = true;
  $('loadingScreen').style.display = 'none';
  $('loginScreen').classList.remove('hidden');
  resetLoginButton();
  checkBootstrapNeeded();
}

// Timeout de seguridad: si en 2.5s no hemos mostrado el login, forzarlo
setTimeout(showLoginScreenIfNeeded, 2500);

/* ===== PWA: Service Worker registration ===== */
// El SW se registra desde el script externo sw.js (no desde blob URL)


;

/* PWA: registro del Service Worker.
 * El registro es relativo ('sw.js'), así que el ámbito (scope) del SW
 * queda limitado a la carpeta donde esté desplegada la app. Esto es lo
 * que permite conviver con el portal https://iesvilladiego.github.io en
 * el mismo dominio: el SW solo controla páginas dentro de su carpeta y
 * nunca interfiere con las del portal, y ambas PWA se pueden instalar
 * por separado (manifests y scopes independientes). */
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(function(reg){
      console.log('SW registered:', reg.scope);
    }).catch(function(err){
      console.log('SW registration failed:', err);
    });
  });
}

/* Chip de versión: se lee del CACHE_NAME del propio sw.js (única fuente de verdad) */
fetch('sw.js', { cache: 'no-store' }).then(r => r.ok ? r.text() : '').then(src => {
  const m = src && src.match(/CACHE_NAME\s*=\s*'laliao-v2[.-]v?(\d+)'/);
  if(!m) return;
  document.querySelectorAll('#appVersionChip, #appVersionChipM').forEach(el => {
    el.textContent = 'v' + m[1];
    el.style.display = 'inline-block';
  });
}).catch(()=>{});
