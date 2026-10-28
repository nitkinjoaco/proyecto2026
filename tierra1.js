let historial = [];
let metricaActual = 'humedad';
let horasActual = 24;



const botoncuadrado = document.querySelector('.boton1');

botoncuadrado.addEventListener("click", () => {

    window.location.href = "ayuda.html"; 
});

const botoncuadrado1 = document.querySelector('.boton');

botoncuadrado1.addEventListener("click", () => {

    window.location.href = "gestionar.html"; 
});


const METRICAS = {
  humedad: {
    series: [
      { campo: 'humedad_aire',  nombre: 'Aire',  color: '#c7d9f5' },
      { campo: 'humedad_suelo', nombre: 'Suelo', color: '#4caf2a' },
    ],
    min: 40, max: 100, unidad: '%',
  },
  temperatura: {
    series: [
      { campo: 'temp_aire',  nombre: 'Aire',  color: '#c7d9f5' },
      { campo: 'temp_suelo', nombre: 'Suelo', color: '#4caf2a' },
    ],
    min: 0, max: 40, unidad: '°',
  },
  luz: {
    series: [{ campo: 'luz', nombre: 'Luz', color: '#f5c542' }],
    min: 0, max: 100, unidad: '',
  },
  ph: {
    series: [{ campo: 'ph', nombre: 'pH', color: '#e0705a' }],
    min: 0, max: 14, unidad: '',
  },
};



const grafico = new Chart(document.getElementById('grafico'), {
  type: 'line',
  data: {
    labels: ['10:00', '15:00', '20:00', '01:00', '06:00', 'Ahora'],
    datasets: [
      {
        label: 'Aire',
        data: [73, 93, 86, 67, 80, 83],
        borderColor: '#c7d9f5',
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Suelo',
        data: [80, 74, 76, 70, 62, 54],
        borderColor: '#4caf2a',
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa' },
      },
      y: {
        min: 40,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.15)' },
        ticks: { color: '#aaa', callback: v => v + '%' },
      },
    },
  },
});


function dibujar() {
  const cfg = METRICAS[metricaActual];

  grafico.data.labels = historial.map(d =>
    new Date(d.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  );

  grafico.data.datasets = cfg.series.map(s => ({
    label: s.nombre,
    data: historial.map(d => d[s.campo]),
    borderColor: s.color,
    tension: 0.35,
    pointRadius: 0,
    borderWidth: 2,
  }));

  grafico.options.scales.y.min = cfg.min;
  grafico.options.scales.y.max = cfg.max;
  grafico.options.scales.y.ticks.callback = v => v + cfg.unidad;

  document.querySelector('.leyenda').innerHTML = cfg.series
    .map(s => `<span style="--c:${s.color}">${s.nombre}</span>`)
    .join('');

  grafico.update();
}

document.querySelectorAll('[data-metrica]').forEach(btn => {
  btn.addEventListener('click', () => {
    metricaActual = btn.dataset.metrica;

    document.querySelectorAll('[data-metrica]').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    dibujar();
  });
});
  document.querySelectorAll('[data-horas]').forEach(btn => {
  btn.addEventListener('click', () => {
    horasActual = Number(btn.dataset.horas);

    document.querySelectorAll('[data-horas]').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    dibujar();
  });
});

historial = [
  { fecha: '2026-10-23T10:00:00', humedad_aire: 73, humedad_suelo: 80, temp_aire: 23, temp_suelo: 20, luz: 100, ph: 4 },
  { fecha: '2026-10-23T15:00:00', humedad_aire: 93, humedad_suelo: 74, temp_aire: 26, temp_suelo: 22, luz: 90,  ph: 5 },
  { fecha: '2026-10-23T20:00:00', humedad_aire: 86, humedad_suelo: 76, temp_aire: 21, temp_suelo: 20, luz: 20,  ph: 4 },
  { fecha: '2026-10-24T01:00:00', humedad_aire: 67, humedad_suelo: 70, temp_aire: 17, temp_suelo: 18, luz: 0,   ph: 5 },
  { fecha: '2026-10-24T06:00:00', humedad_aire: 80, humedad_suelo: 62, temp_aire: 15, temp_suelo: 17, luz: 10,  ph: 4 },
];
dibujar();