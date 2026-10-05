const express = require('express'); // Importamos el express
const cors = require('cors'); // Importamos el cors 

const app = express(); // Tenemos el express que basicamente es el framework
const PORT = process.env.PORT || 3000; // Despues de eso, le decimos en que puerto lo vamos a ejecutar

app.use(cors()); // 
app.use(express.static('.')); // Sirve el archivo index.html

// Ruta proxy para consultar las Notificaciones Redes de Interpol
app.get('/api/notices', async (req, res) => {
  try {
    const response = await fetch('https://ws-public.interpol.int/notices/v1/red'); // Tenemos aqui lo que es el await, que en este caso si se esta ejecutando algo de la aplicacion, lo que hace el await es que espera a que se ejecute esa operacion para poder consumir la api
    if (!response.ok) { // Una vez haya cargado, basicamente lo que se hace es que una vez se pueda ejeuctar, ya sale este mensaje, obviamente internamente
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});