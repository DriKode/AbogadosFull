import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Configuración Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo PDF e Imágenes.'));
        }
    }
});

// Nota: En Supabase las tablas 'clientes', 'actuaciones' y 'citas' deben crearse en el panel SQL.
// Aquí dejamos constancia de la estructura esperada:
/* 
CREATE TABLE clientes (
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
CREATE TABLE actuaciones (
  id TEXT PRIMARY KEY,
  clienteId TEXT,
  fecha TEXT,
  tipoProceso TEXT,
  estadoCaso TEXT,
  glosasJuridicas TEXT,
  observaciones TEXT,
  proximasAcciones TEXT,
  documentos JSONB,
  nurej TEXT,
  juzgado TEXT,
  fecha_inicio_demanda DATE,
  demandante TEXT,
  demandado TEXT
);
CREATE TABLE citas (
  id TEXT PRIMARY KEY,
  clienteId TEXT,
  clienteNombre TEXT,
  fecha TEXT,
  hora TEXT,
  tipoCausa TEXT,
  confirmada BOOLEAN,
  atendida BOOLEAN
);
CREATE TABLE documentos (
  id_documento TEXT PRIMARY KEY,
  cliente_id TEXT,
  nombre_archivo TEXT,
  tipo_archivo TEXT,
  ruta_archivo TEXT,
  fecha_subida TEXT,
  usuario_que_subio TEXT
);
*/

// --- RUTAS DE CLIENTES ---

const toDBClient = (c) => ({
    id: c.id, nombrecompleto: c.nombreCompleto, dni: c.dni, whatsapp: c.whatsapp,
    email: c.email, tipocausa: c.tipoCausa, descripcioncaso: c.descripcionCaso,
    fecharegistro: c.fechaRegistro, estadoactual: c.estadoActual
});

const fromDBClient = (c) => ({
    ...c,
    nombreCompleto: c.nombrecompleto || c.nombreCompleto,
    tipoCausa: c.tipocausa || c.tipoCausa,
    descripcionCaso: c.descripcioncaso || c.descripcionCaso,
    fechaRegistro: c.fecharegistro || c.fechaRegistro,
    estadoActual: c.estadoactual || c.estadoActual
});

const toDBAct = (a, cId) => ({
    id: a.id, clienteid: cId, fecha: a.fecha, tipoproceso: a.tipoProceso,
    estadocaso: a.estadoCaso, glosasjuridicas: a.glosasJuridicas,
    observaciones: a.observaciones, proximasacciones: a.proximasAcciones,
    documentos: a.documentos,
    nurej: a.nurej, juzgado: a.juzgado,
    fecha_inicio_demanda: a.fechaInicioDemanda,
    demandante: a.demandante, demandado: a.demandado
});

const fromDBAct = (a) => ({
    ...a,
    clienteId: a.clienteid || a.clienteId,
    tipoProceso: a.tipoproceso || a.tipoProceso,
    estadoCaso: a.estadocaso || a.estadoCaso,
    glosasJuridicas: a.glosasjuridicas || a.glosasJuridicas,
    proximasAcciones: a.proximasacciones || a.proximasAcciones,
    nurej: a.nurej,
    juzgado: a.juzgado,
    fechaInicioDemanda: a.fecha_inicio_demanda || a.fechaInicioDemanda || '',
    demandante: a.demandante,
    demandado: a.demandado
});

const toDBCita = (c) => ({
    id: c.id, clienteid: c.clienteId, clientenombre: c.clienteNombre,
    fecha: c.fecha, hora: c.hora, tipocausa: c.tipoCausa,
    confirmada: c.confirmada, atendida: c.atendida
});

const fromDBCita = (c) => ({
    ...c,
    clienteId: c.clienteid || c.clienteId,
    clienteNombre: c.clientenombre || c.clienteNombre,
    tipoCausa: c.tipocausa || c.tipoCausa
});

app.get('/api/clients', async (req, res) => {
    try {
        const { data: clients, error: clientsError } = await supabase.from('clientes').select('*');
        if (clientsError) throw clientsError;

        const results = await Promise.all((clients || []).map(async (clientData) => {
            const client = fromDBClient(clientData);
            const { data: acts, error: actsError } = await supabase
                .from('actuaciones')
                .select('*')
                .eq('clienteid', client.id)
                .order('fecha', { ascending: false });

            if (actsError) throw actsError;

            const { data: docs, error: docsError } = await supabase
                .from('documentos')
                .select('*')
                .eq('cliente_id', client.id);

            if (docsError && docsError.code !== '42P01') throw docsError; // 42P01 is table does not exist, ignore if not created yet

            return {
                ...client,
                actuaciones: (acts || []).map(a => {
                    const mappedA = fromDBAct(a);
                    return {
                        ...mappedA,
                        documentos: typeof mappedA.documentos === 'string' ? JSON.parse(mappedA.documentos || '[]') : (mappedA.documentos || [])
                    }
                }),
                documentosLegales: docs || []
            };
        }));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/clients/:id', async (req, res) => {
    try {
        const { data: clientData, error: clientError } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (clientError && clientError.code !== 'PGRST116') throw clientError;

        if (clientData) {
            const client = fromDBClient(clientData);
            const { data: acts, error: actsError } = await supabase
                .from('actuaciones')
                .select('*')
                .eq('clienteid', client.id)
                .order('fecha', { ascending: false });

            if (actsError) throw actsError;

            const { data: docs, error: docsError } = await supabase
                .from('documentos')
                .select('*')
                .eq('cliente_id', client.id);

            if (docsError && docsError.code !== '42P01') throw docsError;

            res.json({
                ...client,
                actuaciones: (acts || []).map(a => {
                    const mappedA = fromDBAct(a);
                    return {
                        ...mappedA,
                        documentos: typeof mappedA.documentos === 'string' ? JSON.parse(mappedA.documentos || '[]') : (mappedA.documentos || [])
                    }
                }),
                documentosLegales: docs || []
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
        const { error } = await supabase
            .from('clientes')
            .insert([toDBClient(client)]);

        if (error) throw error;

        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/clients/:id/status', async (req, res) => {
    const { estadoActual } = req.body;
    try {
        const { error } = await supabase
            .from('clientes')
            .update({ estadoactual: estadoActual })
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ENPOINT DOCUMENTOS ---

app.post('/api/clients/:id/documentos', upload.single('archivo'), async (req, res) => {
    const clientId = req.params.id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No se proporcionó ningún archivo" });
    }

    try {
        // Asegurar que el bucket exista y sea público
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'documentos_legales')) {
            await supabase.storage.createBucket('documentos_legales', { public: true });
        } else {
            // Si ya existe, nos aseguramos de que esté configurado como público (corrige el error 404)
            await supabase.storage.updateBucket('documentos_legales', { public: true });
        }
        const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const filePath = `clientes/${clientId}/documentos_legales/${fileName}`;

        // Subir a Storage
        const { error: uploadError } = await supabase.storage
            .from('documentos_legales')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Obtener URL firmada o pública (usamos URL pública si el bucket no es tan restrictivo, o lo registramos como path)
        const { data: urlData } = supabase.storage.from('documentos_legales').getPublicUrl(filePath);

        // Crear registro en DB
        const documento = {
            id_documento: Math.random().toString(36).substring(2, 11),
            cliente_id: clientId,
            nombre_archivo: file.originalname,
            tipo_archivo: file.mimetype,
            ruta_archivo: urlData.publicUrl || filePath,
            fecha_subida: new Date().toISOString().split('T')[0],
            usuario_que_subio: 'SISTEMA'
        };

        const { error: dbError } = await supabase
            .from('documentos')
            .insert([documento]);

        if (dbError) throw dbError;

        res.status(201).json(documento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/clients/:id/documentos/:docId', async (req, res) => {
    const { id: clientId, docId } = req.params;
    const { type } = req.query;

    try {
        if (type === 'actuacion') {
            // Eliminar de actuaciones (JSONB)
            const { data: acts, error: actsError } = await supabase
                .from('actuaciones')
                .select('*')
                .eq('clienteid', clientId);

            if (actsError) throw actsError;

            let foundAct = null;
            let updatedDocs = [];
            for (const a of acts) {
                const docsObj = typeof a.documentos === 'string' ? JSON.parse(a.documentos || '[]') : (a.documentos || []);
                const foundDoc = docsObj.find(d => d.id === docId);
                if (foundDoc) {
                    foundAct = a;
                    updatedDocs = docsObj.filter(d => d.id !== docId);
                    break;
                }
            }

            if (!foundAct) {
                return res.status(404).json({ error: "Documento no encontrado o no pertenece al cliente" });
            }

            const { error: updateError } = await supabase
                .from('actuaciones')
                .update({ documentos: JSON.stringify(updatedDocs) })
                .eq('id', foundAct.id);

            if (updateError) throw updateError;
            return res.json({ success: true });
        }

        // Eliminar registro normal
        const { data: doc, error: fetchError } = await supabase
            .from('documentos')
            .select('*')
            .eq('id_documento', docId)
            .eq('cliente_id', clientId)
            .single();

        if (fetchError || !doc) {
            return res.status(404).json({ error: "Documento no encontrado o no pertenece al cliente" });
        }

        // Eliminar archivo de storage
        if (doc.ruta_archivo) {
            const splitUrl = doc.ruta_archivo.split('documentos_legales/');
            if (splitUrl.length > 1) {
                const filePath = splitUrl.slice(1).join('documentos_legales/'); // Por si hay multiples coincidencias, reconstruimos el final
                const { error: storageError } = await supabase.storage
                    .from('documentos_legales')
                    .remove([filePath]);

                if (storageError) {
                    console.error("Storage delete error:", storageError);
                }
            }
        }

        const { error: deleteError } = await supabase
            .from('documentos')
            .delete()
            .eq('id_documento', docId)
            .eq('cliente_id', clientId);

        if (deleteError) throw deleteError;

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// --- RUTAS DE CITAS ---

app.get('/api/appointments', async (req, res) => {
    try {
        const { data: citas, error } = await supabase.from('citas').select('*');
        if (error) throw error;

        res.json((citas || []).map(a => {
            const mappedA = fromDBCita(a);
            return {
                ...mappedA,
                confirmada: !!mappedA.confirmada,
                atendida: !!mappedA.atendida
            };
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    const cita = req.body;
    try {
        const { error } = await supabase
            .from('citas')
            .insert([toDBCita(cita)]);

        if (error) throw error;

        res.status(201).json(cita);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/appointments/:id/atendida', async (req, res) => {
    const { atendida } = req.body;
    try {
        const { error } = await supabase
            .from('citas')
            .update({ atendida })
            .eq('id', req.params.id);

        if (error) throw error;

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
        const { error: actError } = await supabase
            .from('actuaciones')
            .insert([toDBAct(actuacion, clientId)]);
        if (actError) throw actError;

        const { error: clientError } = await supabase
            .from('clientes')
            .update({ estadoactual: actuacion.estadoCaso })
            .eq('id', clientId);
        if (clientError) throw clientError;

        const { error: citaError } = await supabase
            .from('citas')
            .update({ atendida: true })
            .eq('clienteid', clientId)
            .eq('atendida', false);
        if (citaError) throw citaError;

        res.status(201).json(actuacion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Backend con Supabase corriendo en puerto ${port}`);
    });
}

export default app;
