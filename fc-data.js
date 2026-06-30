// ── Datos compartidos entre la App pública y el Panel Admin de Fátima ──
// Todo se guarda en el navegador (localStorage). Mismas claves en los dos archivos.
window.FC = (function () {
  const KEYS = {
    works: 'fc_works_v5',
    services: 'fc_services_v3',
    videos: 'fc_videos_v3',
    cats: 'fc_cats_v1',
    reviews: 'fc_reviews_v1',
    logo: 'fc_logo_v1'
  };

  function load(k, def) {
    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; }
    catch (e) { return def; }
  }
  function save(k, val) {
    try { localStorage.setItem(k, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  // Extrae el ID de cualquier link de Google Drive
  function driveId(url) {
    if (!url) return '';
    const u = String(url);
    let m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return m[1];
    m = u.match(/[?&]id=([\w-]+)/);
    if (m && /drive\.google|docs\.google/.test(u)) return m[1];
    m = u.match(/drive\.google\.com\/uc\?(?:export=\w+&)?id=([\w-]+)/);
    if (m) return m[1];
    return '';
  }

  // Convierte un link de Drive (o normal) en una URL de IMAGEN que sí carga
  function driveImg(url) {
    const id = driveId(url);
    if (id) return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1400';
    return url || '';
  }

  // Convierte cualquier link (YouTube / Drive) en URL para reproducir en VÍDEO
  function videoEmbed(url) {
    if (!url) return '';
    const u = String(url);
    let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([\w-]{6,})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    const id = driveId(u);
    if (id) return 'https://drive.google.com/file/d/' + id + '/preview';
    if (/youtube\.com\/embed\//.test(u)) return u;
    return '';
  }

  // ¿Qué tipo de link es? (para mostrar avisos en el admin)
  function linkKind(url) {
    if (!url) return 'vacio';
    if (/youtu\.?be/.test(url)) return 'youtube';
    if (/drive\.google|docs\.google/.test(url)) return 'drive';
    if (/^data:/.test(url)) return 'foto';
    return 'otro';
  }

  const DEF_CATS = [
    { id: 'c1', name: 'Corrección de Color', icon: '🎯' },
    { id: 'c2', name: 'Tinte', icon: '🎨' },
    { id: 'c3', name: 'Mechas', icon: '🌟' },
    { id: 'c4', name: 'Balayage', icon: '✨' },
    { id: 'c5', name: 'Alisado', icon: '💫' },
    { id: 'c6', name: 'Hidratación', icon: '💧' },
    { id: 'c7', name: 'Corte', icon: '✂️' },
    { id: 'c8', name: 'Extensiones', icon: '💎' },
    { id: 'c9', name: 'Pestañas', icon: '👁️' }
  ];

  const DEF_WORKS = [
    { id: 'w1', cat: 'Corrección de Color', tag: 'Corrección de Color', title: 'Corrección de Color', antes: 'trabajo1.jpg', despues: 'trabajo2.jpg', video: '' },
    { id: 'w2', cat: 'Corrección de Color', tag: 'Corrección de Color', title: 'Corrección Rojo → Borgoña', antes: 'trabajo3.jpg', despues: 'trabajo4.jpg', video: '' },
    { id: 'w3', cat: 'Extensiones', tag: 'Extensiones', title: 'Colocación de Extensiones', antes: 'trabajo7.jpg', despues: 'trabajo9.jpg', video: '' },
    { id: 'w4', cat: 'Balayage', tag: 'Balayage', title: 'Balayage Rojo', antes: '', despues: 'trabajo5.jpg', video: '' },
    { id: 'w5', cat: 'Tinte', tag: 'Color', title: 'Color Rojo Intenso', antes: '', despues: 'trabajo6.jpg', video: '' },
    { id: 'w6', cat: 'Mechas', tag: 'Mechas', title: 'Mechas con Luz', antes: '', despues: 'trabajo8.jpg', video: '' }
  ];

  const DEF_SERVICES = [
    { id: 's1', icon: '🎨', title: 'Tintes & Colorimetría', desc: 'Aplicación de tinte con fórmulas propias de colorimetría profesional. Resultados precisos y duraderos.', img: null },
    { id: 's2', icon: '✨', title: 'Corrección de Color', desc: 'Corrección de colores mal aplicados, decoloración controlada y neutralización de tonos no deseados.', img: null },
    { id: 's3', icon: '🌟', title: 'Mechas & Balayage', desc: 'Mechas francesas, balayage y técnicas de fantasía con degradados naturales y luminosos.', img: null },
    { id: 's4', icon: '✂️', title: 'Corte Dama', desc: 'Cortes personalizados según tu tipo de cabello y estilo de vida. Peinado incluido.', img: null },
    { id: 's5', icon: '💈', title: 'Corte Caballero', desc: 'Cortes masculinos clásicos y modernos con acabado profesional a domicilio.', img: null },
    { id: 's6', icon: '💎', title: 'Extensiones', desc: 'Colocación de extensiones de cabello. Volumen y largo garantizados.', img: null },
    { id: 's7', icon: '👁️', title: 'Pestañas', desc: 'Colocación profesional de pestañas postizas. Mirada impactante y duradera.', img: null },
    { id: 's8', icon: '💻', title: 'Diseño Web & Landing', desc: 'Páginas web profesionales con o sin dominio. Herramientas digitales a medida.', img: null }
  ];

  const DEF_VIDEOS = [
    { id: 'vd1', cat: 'Corrección de Color', title: 'Corrección de Color', antes: 'https://www.youtube.com/embed/AzRhwuRjBrQ', despues: 'https://www.youtube.com/embed/UnMq_07YbzM' },
    { id: 'vd2', cat: 'Pestañas', title: 'Colocación de Pestañas', antes: '', despues: 'https://www.youtube.com/embed/oBCSqcuLllU' },
    { id: 'vd3', cat: 'Corte', title: 'Tres Cortes de Cabello', antes: '', despues: 'https://www.youtube.com/embed/CWlT0tgDG2c' },
    { id: 'vd4', cat: 'Corte', title: 'Cortes para Señora', antes: '', despues: 'https://www.youtube.com/embed/J_1Fr5xJrLA' },
    { id: 'vd5', cat: 'Mechas', title: 'Mechas de Hombre', antes: '', despues: 'https://www.youtube.com/embed/31PpMJhmJe8' },
    { id: 'vd6', cat: 'Corte', title: 'Corte Mariposa Corto', antes: '', despues: 'https://www.youtube.com/embed/6l3ZmFO67KU' }
  ];

  const DEF_REVIEWS = [
    { id: 'r1', name: 'Marta G.', stars: 5, text: 'Vino a mi casa y me dejó el color espectacular. Súper profesional y puntual. ¡Repito segurísimo!', date: '2026-05-12', published: true },
    { id: 'r2', name: 'Lucía R.', stars: 5, text: 'Me corrigió un tinte que tenía fatal de otra peluquería. Manos de ángel y muy buen trato.', date: '2026-04-28', published: true },
    { id: 'r3', name: 'Sara M.', stars: 5, text: 'Las extensiones quedaron naturalísimas. La comodidad de que venga a domicilio no tiene precio.', date: '2026-03-09', published: true }
  ];

  return {
    KEYS, load, save, uid,
    driveId, driveImg, videoEmbed, linkKind,
    DEF_CATS, DEF_WORKS, DEF_SERVICES, DEF_VIDEOS, DEF_REVIEWS
  };
})();
