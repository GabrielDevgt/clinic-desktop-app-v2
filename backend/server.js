const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Importamos las rutas
const pacientesRoutes = require('./routes/pacientes');
app.use('/pacientes', pacientesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
