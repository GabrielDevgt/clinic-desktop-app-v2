const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todos los exámenes médicos
router.get('/', (req, res) => {
    db.query('SELECT * FROM examen_medico', (err, results) => {
        if (err) {
            console.error('Error obteniendo exámenes médicos:', err);
            return res.status(500).json({ error: 'Error obteniendo exámenes médicos' });
        }
        res.json(results);
    });
});

// 🔹 Obtener exámenes médicos por tipo de examen
router.get('/tipo/:id_tipo_examen', (req, res) => {
    const { id_tipo_examen } = req.params;
    db.query('SELECT * FROM examen_medico WHERE id_tipo_examen = ?', [id_tipo_examen], (err, results) => {
        if (err) {
            console.error('Error obteniendo exámenes:', err);
            return res.status(500).json({ error: 'Error obteniendo exámenes' });
        }
        res.json(results);
    });
});

// 🔹 Agregar un nuevo examen médico
router.post('/', (req, res) => {
    const { id_tipo_examen, descripcion } = req.body;

    if (!id_tipo_examen || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si el tipo de examen existe
    db.query('SELECT id_tipo_examen FROM tipo_examen WHERE id_tipo_examen = ?', [id_tipo_examen], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'ID de tipo de examen no registrado' });
        }

        // Insertar el examen médico
        const sql = `INSERT INTO examen_medico (id_tipo_examen, descripcion) VALUES (?, ?)`;
        db.query(sql, [id_tipo_examen, descripcion], (err, result) => {
            if (err) {
                console.error('Error insertando examen médico:', err);
                return res.status(500).json({ error: 'Error insertando examen médico' });
            }
            res.json({ message: 'Examen médico agregado correctamente', id: result.insertId });
        });
    });
});

// 🔹 Eliminar un examen médico
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM examen_medico WHERE id_examen = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando examen médico:', err);
            return res.status(500).json({ error: 'Error eliminando examen médico' });
        }
        res.json({ message: 'Examen médico eliminado correctamente' });
    });
});

module.exports = router;
