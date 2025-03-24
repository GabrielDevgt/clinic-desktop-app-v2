const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todas las consultas
router.get('/', (req, res) => {
    db.query('SELECT * FROM consultas', (err, results) => {
        if (err) {
            console.error('Error obteniendo consultas:', err);
            return res.status(500).json({ error: 'Error obteniendo consultas' });
        }
        res.json(results);
    });
});

// 🔹 Obtener una consulta por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM consultas WHERE id_consulta = ?', [id], (err, results) => {
        if (err) {
            console.error('Error obteniendo consulta:', err);
            return res.status(500).json({ error: 'Error obteniendo consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }
        res.json(results[0]);
    });
});

// 🔹 Agregar una nueva consulta
router.post('/', (req, res) => {
    const { id_paciente, motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura } = req.body;

    if (!id_paciente || !motivo_consulta || !historial_enfermedad) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // 🔹 Verificar si el paciente existe
    db.query('SELECT id_paciente FROM pacientes WHERE id_paciente = ?', [id_paciente], (err, results) => {
        if (err) {
            console.error('Error verificando paciente:', err);
            return res.status(500).json({ error: 'Error verificando paciente' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'ID de paciente no registrado' });
        }

        // 🔹 Si el paciente existe, insertar la consulta
        const sql = `INSERT INTO consultas (id_paciente, motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [id_paciente, motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error insertando consulta:', err);
                return res.status(500).json({ error: 'Error insertando consulta' });
            }
            res.json({ message: 'Consulta agregada correctamente', id: result.insertId });
        });
    });
});


// 🔹 Actualizar una consulta
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura } = req.body;

    const sql = `UPDATE consultas SET motivo_consulta=?, historial_enfermedad=?, presion_arterial=?, frecuencia_cardiaca=?, peso=?, altura=? 
                 WHERE id_consulta=?`;
    const values = [motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error actualizando consulta:', err);
            return res.status(500).json({ error: 'Error actualizando consulta' });
        }
        res.json({ message: 'Consulta actualizada correctamente' });
    });
});

// 🔹 Eliminar una consulta
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM consultas WHERE id_consulta = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando consulta:', err);
            return res.status(500).json({ error: 'Error eliminando consulta' });
        }
        res.json({ message: 'Consulta eliminada correctamente' });
    });
});

module.exports = router;
