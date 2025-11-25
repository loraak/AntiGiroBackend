const Alerta = require('../models/Alerta');

const UMBRALES = {
    PESO_MAXIMO: 5, 
    NIVEL_MAXIMO: 100, 
    NIVEL_ADVERTENCIA: 85,
    PESO_ADVERTENCIA: 4.5 
};

class AlertaService {
    static async procesarAlertaNivel(datos) {
        const { id_contenedor, nivel, timestamp } = datos;

    const ultimaAlerta = await Alerta.findOne({
        id_contenedor,
        tipo: 'llenado',
        activo: true
    }).sort({ timestamp_inicio: -1 });

    if (nivel > UMBRALES.NIVEL_MAXIMO) {
        if (!ultimaAlerta) {
            const nuevaAlerta = new Alerta({
            id_contenedor,
            tipo: 'llenado',
            severidad: 'critical',
            mensaje: `CRÍTICO: Contenedor sobrepasa capacidad máxima (${nivel}%)`,
            activo: true,
            timestamp_inicio: timestamp || new Date(),
            datos_relacionados: {
                nivel_actual: nivel,
                umbral_excedido: UMBRALES.NIVEL_MAXIMO
            }
        });
        await nuevaAlerta.save();
        return nuevaAlerta;
    } else {
        ultimaAlerta.severidad = 'critical';
        ultimaAlerta.mensaje = `CRÍTICO: Contenedor sobrepasa capacidad máxima (${nivel}%)`;
        ultimaAlerta.datos_relacionados.nivel_actual = nivel;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }
    }
    else if (nivel >= UMBRALES.NIVEL_ADVERTENCIA && nivel <= UMBRALES.NIVEL_MAXIMO) {
        if (!ultimaAlerta) {
            // Crear alerta de advertencia
            const nuevaAlerta = new Alerta({
            id_contenedor,
            tipo: 'llenado',
            severidad: 'warning',
            mensaje: `Advertencia: Contenedor próximo a capacidad máxima (${nivel}%)`,
            activo: true,
            timestamp_inicio: timestamp || new Date(),
            datos_relacionados: {
                nivel_actual: nivel,
                umbral_excedido: UMBRALES.NIVEL_ADVERTENCIA
            }
        });
        await nuevaAlerta.save();
        return nuevaAlerta;
    } else {
        ultimaAlerta.severidad = 'warning';
        ultimaAlerta.mensaje = `Advertencia: Contenedor próximo a capacidad máxima (${nivel}%)`;
        ultimaAlerta.datos_relacionados.nivel_actual = nivel;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }
    }
    else if (ultimaAlerta) {
        ultimaAlerta.activo = false;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }

    return null;
}

    static async procesarAlertaPeso(datos) {
        const { id_contenedor, peso, timestamp } = datos;

    const ultimaAlerta = await Alerta.findOne({
        id_contenedor,
        tipo: 'sobrepeso',
        activo: true
    }).sort({ timestamp_inicio: -1 });

    if (peso > UMBRALES.PESO_MAXIMO) {
        if (!ultimaAlerta) {
            // Crear nueva alerta crítica
            const nuevaAlerta = new Alerta({
            id_contenedor,
            tipo: 'sobrepeso',
            severidad: 'critical',
            mensaje: `CRÍTICO: Sobrepeso detectado (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`,
            activo: true,
            timestamp_inicio: timestamp || new Date(),
            datos_relacionados: {
                peso_actual: peso,
                umbral_excedido: UMBRALES.PESO_MAXIMO
            }
        });
        await nuevaAlerta.save();
        return nuevaAlerta;
    } else {
        ultimaAlerta.severidad = 'critical';
        ultimaAlerta.mensaje = `CRÍTICO: Sobrepeso detectado (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`;
        ultimaAlerta.datos_relacionados.peso_actual = peso;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }
    }
    // CASO 2: Peso próximo al máximo (WARNING)
    else if (peso >= UMBRALES.PESO_ADVERTENCIA && peso <= UMBRALES.PESO_MAXIMO) {
        if (!ultimaAlerta) {
        const nuevaAlerta = new Alerta({
            id_contenedor,
            tipo: 'sobrepeso',
            severidad: 'warning',
            mensaje: `Advertencia: Peso próximo al límite (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`,
            activo: true,
            timestamp_inicio: timestamp || new Date(),
            datos_relacionados: {
                peso_actual: peso,
                umbral_excedido: UMBRALES.PESO_ADVERTENCIA
            }
        });
        await nuevaAlerta.save();
        return nuevaAlerta;
    } else {
        ultimaAlerta.severidad = 'warning';
        ultimaAlerta.mensaje = `Advertencia: Peso próximo al límite (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`;
        ultimaAlerta.datos_relacionados.peso_actual = peso;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }
    }
    else if (ultimaAlerta) {
        ultimaAlerta.activo = false;
        await ultimaAlerta.save();
        return ultimaAlerta;
    }

    return null;
}

    static async obtenerAlertasActivas(id_contenedor = null) {
        return await Alerta.getActivas(id_contenedor);
    }

    static async obtenerHistorial(id_contenedor, limite = 50) {
    const query = id_contenedor ? { id_contenedor } : {};
    return await Alerta.find(query)
        .sort({ timestamp_inicio: -1 })
        .limit(limite)
        .lean();
    }
}

module.exports = AlertaService;