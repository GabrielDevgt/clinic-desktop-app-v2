const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Importamos las rutas
const pacientesRoutes = require('./routes/pacientes');
const doctoresRoutes = require('./routes/doctores');
const consultasRoutes = require('./routes/consultas');
const citasRoutes = require('./routes/citas'); 
const antecedentesRoutes = require('./routes/antecedentes');
const tratamientosRoutes = require('./routes/tratamientos');
const tipoExamenRoutes = require('./routes/tipo_examen');
const examenMedicoRoutes = require('./routes/examen_medico');



app.use('/pacientes', pacientesRoutes);
app.use('/doctores', doctoresRoutes);
app.use('/consultas', consultasRoutes);
app.use('/citas', citasRoutes);
app.use('/antecedentes', antecedentesRoutes);
app.use('/tratamientos', tratamientosRoutes);
app.use('/tipo_examen', tipoExamenRoutes);
app.use('/examen_medico', examenMedicoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
