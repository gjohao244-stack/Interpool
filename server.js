const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Servir frontend si lo tienes en carpeta public/

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy para la API de Interpol con soporte para parámetros
app.get('/api/notices', async (req, res) => {
  try {
    const { name, nationality, page = 1 } = req.query;

    // Construir la URL con los parámetros que pida el usuario
    const params = new URLSearchParams();
    params.append('resultPerPage', '20');
    params.append('page', page);
    
    if (name) params.append('name', name);
    if (nationality) params.append('nationality', nationality);

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
  console.log(`Servidor corriendo en puerto ${PORT}`);
});