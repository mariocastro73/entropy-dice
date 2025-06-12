// server.js
const express = require('express');
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'static'
app.use('/static', express.static('static'));

// Ruta principal para index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
