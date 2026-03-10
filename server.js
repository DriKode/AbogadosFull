import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de Turso / libSQL
const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:database.sqlite',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

app.use(cors());
app.use(express.json());

// Inicializar Base de Datos (Correr esto una vez o cada que inicie el servidor)
async function initDb() {
    try {
        await db.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        nombreCompleto TEXT,
        dni TEXT UNIQUE,
        whatsapp TEXT,
        email TEXT,
        tipoCausa TEXT,
        descripcionCaso TEXT,
        fechaRegistro TEXT,
        estadoActual TEXT
      );
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS actuaciones (
        id TEXT PRIMARY KEY,
        clienteId TEXT,
        fecha TEXT,
        tipoProceso TEXT,
        estadoCaso TEXT,
        glosasJuridicas TEXT,
        observaciones TEXT,
        proximasAcciones TEXT,
        documentos TEXT
      );
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id TEXT PRIMARY KEY,
        clienteId TEXT,
        clienteNombre TEXT,
        fecha TEXT,
        hora TEXT,
        tipoCausa TEXT,
        confirmada INTEGER,
        atendida INTEGER
      );
    `);
        console.log("Tablas verificadas/creadas correctamente.");
    } catch (e) {
        console.error("Error inicializando DB:", e);
    }
}

initDb();

// --- RUTAS DE CLIENTES ---

app.get('/api/clients', async (req, res) => {
    try {
        const clientsResult = await db.execute('SELECT * FROM clientes');
        const clients = clientsResult.rows;

        // Obtener actuaciones para cada cliente
        const results = await Promise.all(clients.map(async (client) => {
            const actsResult = await db.execute({
                sql: 'SELECT * FROM actuaciones WHERE clienteId = ? ORDER BY fecha DESC',
                args: [client.id]
            });
            const acts = actsResult.rows;
            return {
                ...client,
                actuaciones: acts.map(a => ({ ...a, documentos: JSON.parse(a.documentos || '[]') }))
            };
        }));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/clients/:id', async (req, res) => {
    try {
        const clientResult = await db.execute({
            sql: 'SELECT * FROM clientes WHERE id = ?',
            args: [req.params.id]
        });
        const client = clientResult.rows[0];

        if (client) {
            const actsResult = await db.execute({
                sql: 'SELECT * FROM actuaciones WHERE clienteId = ? ORDER BY fecha DESC',
                args: [client.id]
            });
            res.json({
                ...client,
                actuaciones: actsResult.rows.map(a => ({ ...a, documentos: JSON.parse(a.documentos || '[]') }))
            });
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clients', async (req, res) => {
    const client = req.body;
    try {
        await db.execute({
            sql: `INSERT INTO clientes (id, nombreCompleto, dni, whatsapp, email, tipoCausa, descripcionCaso, fechaRegistro, estadoActual)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [client.id, client.nombreCompleto, client.dni, client.whatsapp, client.email, client.tipoCausa, client.descripcionCaso, client.fechaRegistro, client.estadoActual]
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/clients/:id/status', async (req, res) => {
    const { estadoActual } = req.body;
    try {
        await db.execute({
            sql: 'UPDATE clientes SET estadoActual = ? WHERE id = ?',
            args: [estadoActual, req.params.id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- RUTAS DE CITAS ---

app.get('/api/appointments', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM citas');
        res.json(result.rows.map(a => ({ ...a, confirmada: !!a.confirmada, atendida: !!a.atendida })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    const cita = req.body;
    try {
        await db.execute({
            sql: `INSERT INTO citas (id, clienteId, clienteNombre, fecha, hora, tipoCausa, confirmada, atendida)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [cita.id, cita.clienteId, cita.clienteNombre, cita.fecha, cita.hora, cita.tipoCausa, cita.confirmada ? 1 : 0, cita.atendida ? 1 : 0]
        });
        res.status(201).json(cita);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/appointments/:id/atendida', async (req, res) => {
    const { atendida } = req.body;
    try {
        await db.execute({
            sql: 'UPDATE citas SET atendida = ? WHERE id = ?',
            args: [atendida ? 1 : 0, req.params.id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- RUTAS DE ACTUACIONES ---

app.post('/api/clients/:id/actuaciones', async (req, res) => {
    const actuacion = req.body;
    const clientId = req.params.id;

    try {
        await db.batch([
            {
                sql: `INSERT INTO actuaciones (id, clienteId, fecha, tipoProceso, estadoCaso, glosasJuridicas, observaciones, proximasAcciones, documentos)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [actuacion.id, clientId, actuacion.fecha, actuacion.tipoProceso, actuacion.estadoCaso, actuacion.glosasJuridicas, actuacion.observaciones, actuacion.proximasAcciones, JSON.stringify(actuacion.documentos)]
            },
            {
                sql: 'UPDATE clientes SET estadoActual = ? WHERE id = ?',
                args: [actuacion.estadoCaso, clientId]
            },
            {
                sql: 'UPDATE citas SET atendida = 1 WHERE clienteId = ? AND atendida = 0',
                args: [clientId]
            }
        ], "write");

        res.status(201).json(actuacion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend con Turso/SQLite corriendo en puerto ${port}`);
});
