const bd = require('../config/bd');



























// --- 1. OBTENER TODAS LAS FACTURAS (LEER) ---
exports.obtenerTodas = (req, res) => {
    // Consulta para obtener todas las facturas ordenadas por fecha de pago descendente
    const consulta = 'SELECT * FROM facturas ORDER BY fecha_pago DESC, id DESC';
    
    bd.query(consulta, (error, resultados) => {
        if (error) {
            console.error('Error al obtener las facturas:', error.message);
            return res.status(500).send('Error interno del servidor al consultar base de datos.');
        }
        
        // Calcular estadísticas específicas de la página de listado
        const totalFacturas = resultados.length;
        const sumaMonto = resultados.reduce((total, factura) => total + parseFloat(factura.monto), 0);
        
        // Renderizamos la vista de listado enviando los resultados y métricas
        res.render('facturas/index', { 
            facturas: resultados,
            totalFacturas: totalFacturas,
            sumaMonto: sumaMonto.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
    });
};



exports.obtenerInformacion = (req, res) => {
    const consulta = 'SELECT * FROM facturas';
    
    bd.query(consulta, (error, resultados) => {
        if (error) {
            console.error('Error al obtener las facturas:', error.message);
            return res.status(500).send('Error interno del servidor al consultar base de datos.');
        }
        
        // Calcular estadísticas específicas de la página de listado
        const totalFacturas = resultados.length;
        const sumaMonto = resultados.reduce((total, factura) => total + parseFloat(factura.monto), 0);
        
        // Renderizamos la vista de listado enviando los resultados y métricas
        res.render('facturas/index', { 
            facturas: resultados,
            totalFacturas: totalFacturas,
            sumaMonto: sumaMonto.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
    });
};

// --- 2. MOSTRAR FORMULARIO DE CREACIÓN (CREAR) ---
exports.mostrarFormularioCrear = (req, res) => {
    // Para reutilizar el mismo formulario, enviamos un objeto vacío de factura y el modo 'crear'
    const facturaVacia = {
        id: '',
        numero_factura: '',
        empresa: '',
        monto: '',
        fecha_pago: '',
        descripcion: ''
    };
    
    res.render('facturas/formulario', { 
        factura: facturaVacia, 
        modo: 'crear',
        tituloPagina: 'Registrar Nueva Factura'
    });
};

// --- 3. GUARDAR NUEVA FACTURA (CREAR) ---
exports.crearFactura = (req, res) => {
    const { numero_factura, empresa, monto, fecha_pago, descripcion } = req.body;
    
    const consulta = 'INSERT INTO facturas (numero_factura, empresa, monto, fecha_pago, descripcion) VALUES (?, ?, ?, ?, ?)';
    const valores = [numero_factura, empresa, monto, fecha_pago, descripcion || null];
    
    bd.query(consulta, valores, (error, resultado) => {
        if (error) {
            console.error('Error al insertar factura:', error.message);
            
            // Si el error es por duplicado de número de factura (campo UNIQUE)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Error: El número de factura ya se encuentra registrado.');
            }
            
            return res.status(500).send('Error al guardar la factura en la base de datos.');
        }
        
        // Redirigir al listado principal tras guardar exitosamente
        res.redirect('/facturas');
    });
};

// --- 4. MOSTRAR FORMULARIO DE EDICIÓN (EDITAR) ---
exports.mostrarFormularioEditar = (req, res) => {
    const { id } = req.params;
    const consulta = 'SELECT * FROM facturas WHERE id = ?';
    
    bd.query(consulta, [id], (error, resultados) => {
        if (error) {
            console.error('Error al buscar factura para editar:', error.message);
            return res.status(500).send('Error al buscar el registro.');
        }
        
        if (resultados.length === 0) {
            return res.status(404).send('Factura no encontrada.');
        }
        
        const factura = resultados[0];
        
        // Formatear la fecha a YYYY-MM-DD para que el <input type="date"> la entienda correctamente
        if (factura.fecha_pago) {
            const fechaObj = new Date(factura.fecha_pago);
            const anio = fechaObj.getFullYear();
            // getMonth() devuelve 0-11, sumamos 1 y rellenamos a 2 dígitos
            const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaObj.getDate()).padStart(2, '0');
            factura.fecha_pago_formateada = `${anio}-${mes}-${dia}`;
        } else {
            factura.fecha_pago_formateada = '';
        }
        
        res.render('facturas/formulario', { 
            factura: factura, 
            modo: 'editar',
            tituloPagina: 'Editar Factura'
        });
    });
};

// --- 5. ACTUALIZAR FACTURA (EDITAR) ---
exports.actualizarFactura = (req, res) => {
    const { id } = req.params;
    const { numero_factura, empresa, monto, fecha_pago, descripcion } = req.body;
    
    const consulta = `
        UPDATE facturas 
        SET numero_factura = ?, empresa = ?, monto = ?, fecha_pago = ?, descripcion = ? 
        WHERE id = ?
    `;
    const valores = [numero_factura, empresa, monto, fecha_pago, descripcion || null, id];
    
    bd.query(consulta, valores, (error, resultado) => {
        if (error) {
            console.error('Error al actualizar factura:', error.message);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Error: El número de factura ya está registrado en otra factura.');
            }
            
            return res.status(500).send('Error al actualizar el registro en la base de datos.');
        }
        
        res.redirect('/facturas');
    });
};

// --- 6. ELIMINAR FACTURA (ELIMINAR) ---
exports.eliminarFactura = (req, res) => {
    const { id } = req.params;
    const consulta = 'DELETE FROM facturas WHERE id = ?';
    
    bd.query(consulta, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar factura:', error.message);
            return res.status(500).send('Error al eliminar la factura.');
        }
        
        res.redirect('/facturas');
    });
};
