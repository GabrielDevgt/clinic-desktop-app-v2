const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todos los antecedentes
router.get('/', (req, res) => {
    db.query('SELECT * FROM antecedentes', (err, results) => {
        if (err) {
            console.error('Error obteniendo antecedentes:', err);
            return res.status(500).json({ error: 'Error obteniendo antecedentes' });
        }
        res.json(results);
    });
});

// 🔹 Obtener antecedentes por ID de paciente
router.get('/paciente/:id_paciente', (req, res) => {
    const { id_paciente } = req.params;
    db.query('SELECT * FROM antecedentes WHERE id_paciente = ?', [id_paciente], (err, results) => {
        if (err) {
            console.error('Error obteniendo antecedentes:', err);
            return res.status(500).json({ error: 'Error obteniendo antecedentes' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No hay antecedentes para este paciente' });
        }
        res.json(results);
    });
});

// 🔹 Agregar un nuevo antecedente
router.post('/', (req, res) => {
    const { id_paciente, descripcion } = req.body;

    if (!id_paciente || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si el paciente existe
    db.query('SELECT id_paciente FROM pacientes WHERE id_paciente = ?', [id_paciente], (err, results) => {
        if (err) {
            console.error('Error verificando paciente:', err);
            return res.status(500).json({ error: 'Error verificando paciente' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'ID de paciente no registrado' });
        }

        // Insertar el antecedente
        const sql = `INSERT INTO antecedentes (id_paciente, descripcion) VALUES (?, ?)`;
        db.query(sql, [id_paciente, descripcion], (err, result) => {
            if (err) {
                console.error('Error insertando antecedente:', err);
                return res.status(500).json({ error: 'Error insertando antecedente' });
            }
            res.json({ message: 'Antecedente agregado correctamente', id: result.insertId });
        });
    });
});

// 🔹 Actualizar un antecedente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
        return res.status(400).json({ error: 'Debe proporcionar una descripción' });
    }

    const sql = 'UPDATE antecedentes SET descripcion=? WHERE id_antecedente=?';
    db.query(sql, [descripcion, id], (err, result) => {
        if (err) {
            console.error('Error actualizando antecedente:', err);
            return res.status(500).json({ error: 'Error actualizando antecedente' });
        }
        res.json({ message: 'Antecedente actualizado correctamente' });
    });
});

// 🔹 Eliminar un antecedente
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM antecedentes WHERE id_antecedente = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando antecedente:', err);
            return res.status(500).json({ error: 'Error eliminando antecedente' });
        }
        res.json({ message: 'Antecedente eliminado correctamente' });
    });
});

module.exports = router;
