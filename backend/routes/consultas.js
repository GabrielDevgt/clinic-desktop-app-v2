const express = require('express');
const router = express.Router();
const db = require('../db');

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

// 🔹 Agregar una nueva consulta (ya está bien optimizado)
router.post('/', (req, res) => {
    const { id_paciente, motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura } = req.body;

    if (!id_paciente || !motivo_consulta || !historial_enfermedad) {
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

        // Insertar la consulta
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

// 🔹 Actualizar una consulta (mejorado)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { id_paciente, motivo_consulta, historial_enfermedad, presion_arterial, frecuencia_cardiaca, peso, altura } = req.body;

    // Validar campos obligatorios
    if (!motivo_consulta || !historial_enfermedad) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si la consulta existe
    db.query('SELECT id_consulta FROM consultas WHERE id_consulta = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando consulta:', err);
            return res.status(500).json({ error: 'Error verificando consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }

        // Si se proporciona id_paciente, verificar que exista
        if (id_paciente) {
            db.query('SELECT id_paciente FROM pacientes WHERE id_paciente = ?', [id_paciente], (err, patientResults) => {
                if (err) {
                    console.error('Error verificando paciente:', err);
                    return res.status(500).json({ error: 'Error verificando paciente' });
                }
                if (patientResults.length === 0) {
                    return res.status(404).json({ error: 'ID de paciente no registrado' });
                }
                updateConsulta(); // Si todo está bien, proceder a actualizar
            });
        } else {
            updateConsulta(); // Si no se modifica el paciente, actualizar directamente
        }
    });

    function updateConsulta() {
        const sql = `UPDATE consultas 
                    SET motivo_consulta=?, historial_enfermedad=?, presion_arterial=?, frecuencia_cardiaca=?, peso=?, altura=?
                    ${id_paciente ? ', id_paciente=?' : ''} 
                    WHERE id_consulta=?`;
        
        const values = [
            motivo_consulta, 
            historial_enfermedad, 
            presion_arterial, 
            frecuencia_cardiaca, 
            peso, 
            altura,
            ...(id_paciente ? [id_paciente] : []), // Agregar id_paciente solo si existe
            id
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error actualizando consulta:', err);
                return res.status(500).json({ error: 'Error actualizando consulta' });
            }
            res.json({ message: 'Consulta actualizada correctamente' });
        });
    }
});

// 🔹 Eliminar una consulta (mejorado)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Verificar si la consulta existe antes de borrar
    db.query('SELECT id_consulta FROM consultas WHERE id_consulta = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando consulta:', err);
            return res.status(500).json({ error: 'Error verificando consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }

        // Si existe, proceder a borrar
        db.query('DELETE FROM consultas WHERE id_consulta = ?', [id], (err, result) => {
            if (err) {
                console.error('Error eliminando consulta:', err);
                return res.status(500).json({ error: 'Error eliminando consulta' });
            }
            res.json({ message: 'Consulta eliminada correctamente' });
        });
    });
});

module.exports = router;