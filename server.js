const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Servir el archivo index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy para la API de Interpol
app.get('/api/notices', async (req, res) => {
  try {
    const { name, page = 1 } = req.query;

    // Crear la consulta base a la API de Interpol
    const params = new URLSearchParams();
    params.append('resultPerPage', '20');
    params.append('page', String(page));

    // Solo agregar 'name' si contiene texto real
    if (name && typeof name === 'string' && name.trim() !== '') {
      params.append('name', name.trim());
    }

    const interpolUrl = `https://ws-public.interpol.int/notices/v1/red?${params.toString()}`;

    const response = await fetch(interpolUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Respuesta de Interpol fallida con estado ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error en /api/notices:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});