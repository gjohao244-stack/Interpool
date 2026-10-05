const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Servir archivos estáticos si decides colocarlos en /public en el futuro
app.use(express.static(path.join(__dirname, 'public')));

// Servir el archivo index.html en la ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy para la API de Interpol
app.get('/api/notices', async (req, res) => {
  try {
    const { name, nationality, page = 1 } = req.query;

    const params = new URLSearchParams();
    params.append('resultPerPage', '20');
    params.append('page', page);
    
    // Solo agregamos name o nationality si el usuario escribió algo (evita enviar cadenas vacías "")
    if (name && name.trim() !== '') {
      params.append('name', name.trim());
    }
    if (nationality && nationality.trim() !== '') {
      params.append('nationality', nationality.trim());
    }

    const interpolUrl = `https://ws-public.interpol.int/notices/v1/red?${params.toString()}`;
    
    const response = await fetch(interpolUrl);
    if (!response.ok) {
      throw new Error(`Error Interpol API: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});