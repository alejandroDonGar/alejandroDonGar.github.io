// Interruptor de tema claro/oscuro; la primera vez sigue al sistema y luego recuerda la elección
(() => {
  const temas = { niebla: 'Claro', pizarra: 'Oscuro' };
  const raiz = document.documentElement;

  const caja = document.createElement('div');
  caja.className = 'selector-paleta';
  caja.setAttribute('role', 'group');
  caja.setAttribute('aria-label', 'Tema');
  // Los nombres son fijos (no vienen del usuario), así que se pueden poner en el HTML
  caja.innerHTML = Object.entries(temas)
    .map(([v, n]) => `<button type="button" data-tema="${v}">${n}</button>`).join('');

  function aplicar(tema) {
    raiz.dataset.paleta = tema;
    localStorage.setItem('tema', tema);
    caja.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.tema === tema));
  }

  caja.addEventListener('click', e => { const b = e.target.closest('button'); if (b) aplicar(b.dataset.tema); });
  document.body.append(caja);

  const guardado = localStorage.getItem('tema');
  aplicar(guardado in temas ? guardado : (matchMedia('(prefers-color-scheme: dark)').matches ? 'pizarra' : 'niebla'));
})();
