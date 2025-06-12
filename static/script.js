const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const timeSeriesCanvas = document.getElementById('timeSeriesCanvas');
const tsCtx = timeSeriesCanvas.getContext('2d');
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const goButton = document.getElementById('goButton');
const autoCheckbox = document.getElementById('autoCheckbox');
const intervalInput = document.getElementById('intervalInput');
const leftPercentage = document.getElementById('leftPercentage');
const rightPercentage = document.getElementById('rightPercentage');

let N = 6; // Valor inicial de círculos
let circles = []; // Array para los círculos
let autoInterval = null; // Para la animación automática
let lastRandom = null; // Último número aleatorio
let iterations = 0; // Contador de iteraciones
let proportions = [[1, 0]]; // Historial de proporciones [leftProportion, rightProportion]

// Inicializa los círculos con posiciones aleatorias
function initCircles() {
  circles = [];
  for (let i = 0; i < N; i++) {
    circles.push({
      id: i + 1,
      side: 0, // 0 = izquierda, 1 = derecha
      x: Math.random() * (canvas.width / 2 - 40) + 20, // X aleatorio en la mitad izquierda
      y: Math.random() * (canvas.height - 40) + 20 // Y aleatorio dentro del lienzo
    });
  }
  iterations = 0;
  proportions = [[1, 0]]; // Inicial: todos en izquierda
  updatePercentages();
  draw();
  drawTimeSeries();
}

// Actualiza los porcentajes
function updatePercentages() {
  const leftCount = circles.filter(c => c.side === 0).length;
  const rightCount = circles.filter(c => c.side === 1).length;
  const leftPercent = N > 0 ? Math.round((leftCount / N) * 100) : 0;
  const rightPercent = N > 0 ? Math.round((rightCount / N) * 100) : 0;
  leftPercentage.textContent = `Izquierda: ${leftPercent}%`;
  rightPercentage.textContent = `Derecha: ${rightPercent}%`;
}

// Dibuja el rectángulo y los círculos
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja el rectángulo dividido
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Dibuja los círculos
  circles.forEach(circle => {
    const x = circle.side === 0 ? circle.x : circle.x + canvas.width / 2;
    const y = circle.y;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(circle.id, x - 5, y + 5);
  });

  // Muestra el último número aleatorio
  if (lastRandom) {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Último número: ${lastRandom}`, 10, 30);
  }
}

// Dibuja la serie temporal
function drawTimeSeries() {
  // Ajusta el ancho del lienzo según las iteraciones
  const minWidth = 600;
  const pixelsPerIteration = 10;
  const newWidth = Math.max(minWidth, (iterations + 1) * pixelsPerIteration);
  if (timeSeriesCanvas.width !== newWidth) {
    timeSeriesCanvas.width = newWidth; // Cambia el ancho solo si es necesario
  }
  tsCtx.clearRect(0, 0, timeSeriesCanvas.width, timeSeriesCanvas.height);

  // Dibuja el marco
  tsCtx.strokeStyle = 'black';
  tsCtx.strokeRect(0, 0, timeSeriesCanvas.width, timeSeriesCanvas.height);

  // Dibuja ejes
  tsCtx.beginPath();
  tsCtx.moveTo(50, 20); // Eje Y
  tsCtx.lineTo(50, timeSeriesCanvas.height - 20);
  tsCtx.lineTo(timeSeriesCanvas.width - 10, timeSeriesCanvas.height - 20); // Eje X
  tsCtx.stroke();

  // Etiquetas de los ejes
  tsCtx.fillStyle = 'black';
  tsCtx.font = '12px Arial';
  tsCtx.fillText('Proporción', 10, 25);
  tsCtx.fillText('Iteraciones', timeSeriesCanvas.width - 60, timeSeriesCanvas.height - 5);
  tsCtx.fillText('1', 30, 25);
  tsCtx.fillText('0', 30, timeSeriesCanvas.height - 20);

  // Dibuja líneas (rojo para izquierda, azul para derecha)
  tsCtx.lineWidth = 2;
  tsCtx.beginPath();
  tsCtx.strokeStyle = 'red';
  proportions.forEach((prop, i) => {
    const x = 50 + i * pixelsPerIteration;
    const y = timeSeriesCanvas.height - 20 - prop[0] * (timeSeriesCanvas.height - 40);
    if (i === 0) tsCtx.moveTo(x, y);
    else tsCtx.lineTo(x, y);
  });
  tsCtx.stroke();

  tsCtx.beginPath();
  tsCtx.strokeStyle = 'blue';
  proportions.forEach((prop, i) => {
    const x = 50 + i * pixelsPerIteration;
    const y = timeSeriesCanvas.height - 20 - prop[1] * (timeSeriesCanvas.height - 40);
    if (i === 0) tsCtx.moveTo(x, y);
    else tsCtx.lineTo(x, y);
  });
  tsCtx.stroke();
}

// Genera un número aleatorio y mueve un círculo
function moveCircle() {
  const random = Math.floor(Math.random() * N) + 1;
  lastRandom = random;
  const circle = circles.find(c => c.id === random);
  if (circle) {
    circle.side = 1 - circle.side;
    // Mantiene la misma posición relativa al cambiar de lado
    circle.x = circle.x;
    circle.y = circle.y;
  }
  iterations++;
  const leftCount = circles.filter(c => c.side === 0).length;
  const rightCount = circles.filter(c => c.side === 1).length;
  const leftProportion = N > 0 ? leftCount / N : 0;
  const rightProportion = N > 0 ? rightCount / N : 0;
  proportions.push([leftProportion, rightProportion]);
  updatePercentages();
  draw();
  drawTimeSeries();
}

// Actualiza N según el deslizador
slider.addEventListener('input', () => {
  N = parseInt(slider.value);
  sliderValue.textContent = N;
  initCircles();
});

// Botón "Go"
goButton.addEventListener('click', moveCircle);

// Animación automática
autoCheckbox.addEventListener('change', () => {
  if (autoCheckbox.checked) {
    const interval = parseInt(intervalInput.value) || 500;
    autoInterval = setInterval(moveCircle, interval);
  } else {
    clearInterval(autoInterval);
    autoInterval = null;
  }
});

// Actualiza el intervalo si cambia el input
intervalInput.addEventListener('input', () => {
  if (autoCheckbox.checked) {
    clearInterval(autoInterval);
    const interval = parseInt(intervalInput.value) || 500;
    autoInterval = setInterval(moveCircle, interval);
  }
});

// Inicializa
initCircles();