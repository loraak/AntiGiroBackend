const Alerta = require('../models/Alerta');
const LecturaPeso = require('../models/LecturaPeso');
const LecturaNivel = require('../models/LecturaNivel'); 

const UMBRALES = {
    PESO_MAXIMO: 5, 
    NIVEL_MAXIMO: 100, 
    NIVEL_ADVERTENCIA: 85,
    PESO_ADVERTENCIA: 4.5 
};

class AlertaService {
    static async obtenerDatosCompletos(id_contenedor, datosRecibidos) {
        try {
            let { nivel, peso } = datosRecibidos;

            if (nivel !== undefined && peso !== undefined) {
                return datosRecibidos;
            }

            const promesas = [];

            if (peso === undefined) {
                promesas.push(
                    LecturaPeso.findOne({ id_contenedor })
                        .sort({ timestamp: -1 })
                        .lean()
                        .then(doc => ({ tipo: 'peso', valor: doc?.peso }))
                );
            }

            if (nivel === undefined) {
                promesas.push(
                    LecturaNivel.findOne({ id_contenedor })
                        .sort({ timestamp: -1 })
                        .lean()
                        .then(doc => ({ tipo: 'nivel', valor: doc?.nivel }))
                );
            }

            const resultados = await Promise.all(promesas);

            resultados.forEach(res => {
                if (res && res.valor !== undefined) {
                    if (res.tipo === 'peso') peso = res.valor;
                    if (res.tipo === 'nivel') nivel = res.valor;
                }
            });

            return {
                id_contenedor,
                nivel: nivel ?? datosRecibidos.nivel ?? 0,
                peso: peso ?? datosRecibidos.peso ?? 0,
                timestamp: datosRecibidos.timestamp || new Date()
            };

        } catch (error) {
            console.error('Error obteniendo datos completos:', error);
            return datosRecibidos;
        }
    }

    static async procesarAlertaNivel(datos) {
        const datosCompletos = await this.obtenerDatosCompletos(datos.id_contenedor, datos);
        const { id_contenedor, nivel, peso, timestamp } = datosCompletos;

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
                        peso_actual: peso,
                        umbral_excedido: UMBRALES.NIVEL_MAXIMO
                    }
                });
                await nuevaAlerta.save();
                return nuevaAlerta;
            } else {
                ultimaAlerta.severidad = 'critical';
                ultimaAlerta.mensaje = `CRÍTICO: Contenedor sobrepasa capacidad máxima (${nivel}%)`;
                ultimaAlerta.datos_relacionados.nivel_actual = nivel;
                ultimaAlerta.datos_relacionados.peso_actual = peso; 
                await ultimaAlerta.save();
                return ultimaAlerta;
            }
        }
        else if (nivel >= UMBRALES.NIVEL_ADVERTENCIA && nivel <= UMBRALES.NIVEL_MAXIMO) {
            if (!ultimaAlerta) {
                const nuevaAlerta = new Alerta({
                    id_contenedor,
                    tipo: 'llenado',
                    severidad: 'warning',
                    mensaje: `Advertencia: Contenedor próximo a capacidad máxima (${nivel}%)`,
                    activo: true,
                    timestamp_inicio: timestamp || new Date(),
                    datos_relacionados: {
                        nivel_actual: nivel, 
                        peso_actual: peso, 
                        umbral_excedido: UMBRALES.NIVEL_ADVERTENCIA
                    }
                });
                await nuevaAlerta.save();
                return nuevaAlerta;
            } else {
                ultimaAlerta.severidad = 'warning';
                ultimaAlerta.mensaje = `Advertencia: Contenedor próximo a capacidad máxima (${nivel}%)`;
                ultimaAlerta.datos_relacionados.nivel_actual = nivel;
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

    static async procesarAlertaPeso(datos) {
        const datosCompletos = await this.obtenerDatosCompletos(datos.id_contenedor, datos);
        const { id_contenedor, peso, nivel, timestamp } = datosCompletos;

        const ultimaAlerta = await Alerta.findOne({
            id_contenedor,
            tipo: 'sobrepeso',
            activo: true
        }).sort({ timestamp_inicio: -1 });

        if (peso > UMBRALES.PESO_MAXIMO) {
            if (!ultimaAlerta) {
                const nuevaAlerta = new Alerta({
                    id_contenedor,
                    tipo: 'sobrepeso',
                    severidad: 'critical',
                    mensaje: `CRÍTICO: Sobrepeso detectado (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`,
                    activo: true,
                    timestamp_inicio: timestamp || new Date(),
                    datos_relacionados: {
                        peso_actual: peso,
                        nivel_actual: nivel,
                        umbral_excedido: UMBRALES.PESO_MAXIMO
                    }
                });
                await nuevaAlerta.save();
                return nuevaAlerta;
            } else {
                ultimaAlerta.severidad = 'critical';
                ultimaAlerta.mensaje = `CRÍTICO: Sobrepeso detectado (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`;
                ultimaAlerta.datos_relacionados.peso_actual = peso;
                ultimaAlerta.datos_relacionados.nivel_actual = nivel; 
                await ultimaAlerta.save();
                return ultimaAlerta;
            }
        }
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
                        nivel_actual: nivel, 
                        umbral_excedido: UMBRALES.PESO_ADVERTENCIA
                    }
                });
                await nuevaAlerta.save();
                return nuevaAlerta;
            } else {
                ultimaAlerta.severidad = 'warning';
                ultimaAlerta.mensaje = `Advertencia: Peso próximo al límite (${peso} kg / máx ${UMBRALES.PESO_MAXIMO} kg)`;
                ultimaAlerta.datos_relacionados.peso_actual = peso;
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

    static async obtenerAlertasActivas(id_contenedor = null) {
        return await Alerta.find({ 
            ...(id_contenedor ? { id_contenedor } : {}), 
            activo: true 
        }).sort({ timestamp_inicio: -1 });
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