const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importamos la conexión a MySQL

require('dotenv').config();

const app = express();
app.use(express.json()); // Para leer JSON en las peticiones
app.use(cors());// Para permitir conexiones desde Angular

const PORT = process.env.PORT || 3000;

//Ruta de prueba para verificar que el backend está funcionando 
app.get('/', (req,res)=>{
    res.send('🚀 API funcionando correctamente');
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
});