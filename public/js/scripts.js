// =======================================================
// JAVASCRIPT DEL FRONTEND - INTERACTIVIDAD Y VALIDACIÓN
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Confirmación de Eliminación para Formularios
    const formulariosEliminar = document.querySelectorAll('.form-eliminar');
    
    formulariosEliminar.forEach(formulario => {
        formulario.addEventListener('submit', function(evento) {
            // Evitamos el envío automático del formulario
            evento.preventDefault();
            
            // Intentar obtener el código de la factura para personalizar el mensaje
            const numeroFactura = this.getAttribute('data-factura') || '';
            const mensaje = numeroFactura 
                ? `¿Estás seguro de que deseas eliminar la factura "${numeroFactura}"?\n\nEsta acción es permanente y no se puede deshacer.`
                : '¿Estás seguro de que deseas eliminar este registro?\n\nEsta acción es permanente y no se puede deshacer.';
            
            // Mostrar ventana emergente de confirmación nativa
            const confirmado = confirm(mensaje);
            
            // Si el usuario confirma, procedemos con el envío
            if (confirmado) {
                this.submit();
            }
        });
    });

    // 2. Validación de Formulario (Validaciones del Navegador con Estilo Bootstrap)
    const formulariosValidar = document.querySelectorAll('.needs-validation');
    
    formulariosValidar.forEach(formulario => {
        formulario.addEventListener('submit', function(evento) {
            if (!formulario.checkValidity()) {
                evento.preventDefault();
                evento.stopPropagation();
            }
            formulario.classList.add('was-validated');
        }, false);
    });

});
