// static/script.js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const goButton = document.getElementById('goButton');
const autoCheckbox = document.getElementById('autoCheckbox');
const intervalInput = document.getElementById('intervalInput');

let N = 6; // Valor inicial de círculos
let circles = []; // Array para los círculos
let autoInterval = null; // Para la animación automática
let lastRandom = null; // Último número aleatorio

// Inicializa los círculos
function initCircles() {
  circles = [];
  for (let i = 0; i < N; i++) {
    circles.push({
      id: i + 1,
      side: 0 // 0 = izquierda, 1 = derecha
    });
  }
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
    const x = circle.side === 0 ? canvas.width / 4 : (3 * canvas.width) / 4;
    const y = 50 + (circle.id - 1) * 50;
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

// Genera un número aleatorio y mueve el círculo
function moveCircle() {
  const random = Math.floor(Math.random() * N) + 1;
  lastRandom = random;
  const circle = circles.find(c => c.id === random);
  if (circle) {
    circle.side = 1 - circle.side; // Cambia de lado
  }
  draw();
}

// Actualiza N según el deslizador
slider.addEventListener('input', () => {
  N = parseInt(slider.value);
  sliderValue.textContent = N;
  initCircles();
  draw();
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
draw();
