const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todas las citas
router.get('/', (req, res) => {
    db.query('SELECT * FROM citas', (err, results) => {
        if (err) {
            console.error('Error obteniendo citas:', err);
            return res.status(500).json({ error: 'Error obteniendo citas' });
        }
        res.json(results);
    });
});

// 🔹 Obtener una cita por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM citas WHERE id_citas = ?', [id], (err, results) => {
        if (err) {
            console.error('Error obteniendo cita:', err);
            return res.status(500).json({ error: 'Error obteniendo cita' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.json(results[0]);
    });
});

// 🔹 Agregar una nueva cita (Verificando Paciente, Consulta y Doctor)
router.post('/', (req, res) => {
    const { id_paciente, id_consulta, id_doctor, proxima_cita } = req.body;

    if (!id_paciente || !id_consulta || !id_doctor || !proxima_cita) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // 🔍 Verificar si el paciente, la consulta y el doctor existen
    const checkSQL = `
        SELECT 
            (SELECT COUNT(*) FROM pacientes WHERE id_paciente = ?) AS pacienteExiste,
            (SELECT COUNT(*) FROM consultas WHERE id_consulta = ?) AS consultaExiste,
            (SELECT COUNT(*) FROM doctores WHERE id_doctor = ?) AS doctorExiste
    `;
    db.query(checkSQL, [id_paciente, id_consulta, id_doctor], (err, results) => {
        if (err) {
            console.error('Error verificando datos:', err);
            return res.status(500).json({ error: 'Error verificando datos' });
        }

        const { pacienteExiste, consultaExiste, doctorExiste } = results[0];

        if (!pacienteExiste) return res.status(404).json({ error: 'ID de paciente no registrado' });
        if (!consultaExiste) return res.status(404).json({ error: 'ID de consulta no registrado' });
        if (!doctorExiste) return res.status(404).json({ error: 'ID de doctor no registrado' });

        // 🔹 Insertar la cita si todo está correcto
        const sql = `INSERT INTO citas (id_paciente, id_consulta, id_doctor, proxima_cita) VALUES (?, ?, ?, ?)`;
        const values = [id_paciente, id_consulta, id_doctor, proxima_cita];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error insertando cita:', err);
                return res.status(500).json({ error: 'Error insertando cita' });
            }
            res.json({ message: 'Cita agregada correctamente', id: result.insertId });
        });
    });
});

// 🔹 Actualizar una cita
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { proxima_cita } = req.body;

    if (!proxima_cita) {
        return res.status(400).json({ error: 'Debe proporcionar una nueva fecha de cita' });
    }

    const sql = 'UPDATE citas SET proxima_cita=? WHERE id_citas=?';
    db.query(sql, [proxima_cita, id], (err, result) => {
        if (err) {
            console.error('Error actualizando cita:', err);
            return res.status(500).json({ error: 'Error actualizando cita' });
        }
        res.json({ message: 'Cita actualizada correctamente' });
    });
});

// 🔹 Eliminar una cita
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM citas WHERE id_citas = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando cita:', err);
            return res.status(500).json({ error: 'Error eliminando cita' });
        }
        res.json({ message: 'Cita eliminada correctamente' });
    });
});

module.exports = router;
