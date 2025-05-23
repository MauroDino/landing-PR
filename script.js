document.addEventListener('DOMContentLoaded', function () {
    const cantidadRadios = document.querySelectorAll('input[name="cantidad"]');
    const checkboxContainer = document.getElementById('checkbox-container');
    const formulario = document.getElementById('pedido-form');

    const tiposDePan = [" 100% 000", " Tradicional", " Blend de harinas"];

    // Inicializar EmailJS
    emailjs.init("7QK9tEgPkc8Re4aeV");

    cantidadRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            const cantidad = parseInt(this.value);
            generarCheckboxes(cantidad);
        });
    });

    function generarCheckboxes(cantidad) {
        checkboxContainer.innerHTML = '';
        const totalCheckboxes = cantidad * tiposDePan.length;

        for (let i = 0; i < totalCheckboxes; i++) {
            const checkboxWrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'pan';
            checkbox.value = tiposDePan[i % tiposDePan.length];
            checkbox.id = `pan${i + 1}`;

            checkbox.addEventListener('change', function () {
                const selectedCheckboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
                if (selectedCheckboxes.length > cantidad) {
                    alert(`Solo puedes seleccionar ${cantidad} pan(es).`);
                    this.checked = false;
                }
            });

            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.textContent = tiposDePan[i % tiposDePan.length];

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            checkboxContainer.appendChild(checkboxWrapper);
        }
    }

    formulario.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir envío estándar
        
        // Recopilar datos
        const formData = new FormData(formulario);
        let panesSeleccionados = [];
        
        // Obtener los panes seleccionados
        const checkboxes = document.querySelectorAll('input[name="pan"]:checked');
        checkboxes.forEach(checkbox => {
            panesSeleccionados.push(checkbox.value);
        });
        
        // Verificar que la cantidad sea correcta
        const cantidadSeleccionada = parseInt(formData.get('cantidad'));
        if (panesSeleccionados.length !== cantidadSeleccionada) {
            alert(`Por favor, selecciona exactamente ${cantidadSeleccionada} pan(es).`);
            return;
        }
        
        // Añadir los panes seleccionados al formulario para Formspree
        let inputPanes = document.getElementById('panes-seleccionados');
        if (!inputPanes) {
            inputPanes = document.createElement('input');
            inputPanes.type = 'hidden';
            inputPanes.id = 'panes-seleccionados';
            inputPanes.name = 'panes_seleccionados';
            formulario.appendChild(inputPanes);
        }
        inputPanes.value = panesSeleccionados.join(', ');
        
        // SOLUCIÓN 1: Envío al cliente usando parámetro reply_to
        //const emailClienteParams = {
        //    to_name: formData.get('nombre'),      // Nombre del cliente
        //    reply_to: formData.get('mail'),       // Este truco puede hacer que el correo llegue al cliente
        //    from_name: "Tu Panadería",            // Reemplaza con el nombre de tu negocio
         //   nombre: formData.get('nombre'),
        //    email: formData.get('mail'),
        //    telefono: formData.get('telefono'),
        //    cantidad: cantidadSeleccionada,
        //    panes: panesSeleccionados.join(', ')
        //};
        
        // SOLUCIÓN 2: Crear un elemento oculto para especificar el destinatario
        // Añadir campo oculto con el correo del cliente para EmailJS
        let inputDestinatario = document.getElementById('email-destinatario');
        if (!inputDestinatario) {
            inputDestinatario = document.createElement('input');
            inputDestinatario.type = 'hidden';
            inputDestinatario.id = 'email-destinatario';
            inputDestinatario.name = 'to_email';
            formulario.appendChild(inputDestinatario);
        }
        
        inputDestinatario.value = formData.get('mail');
        
        // Enviar a Formspree
        fetch(formulario.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el formulario');
            }
            return response.json();
        })
        .then(data => {
            // SOLUCIÓN 1: Usar emailjs.send con parámetros explícitos
            return emailjs.send("service_wlfrthx", "template_647wotg", emailClienteParams);
            
            // SOLUCIÓN 2: Alternativa usando sendForm (descomenta esta línea y comenta la anterior para probar)
            // return emailjs.sendForm("service_wlfrthx", "template_647wotg", formulario);
        })
        .then(() => {
            alert('¡Pedido recibido! Revisa tu correo para la confirmación.');
            formulario.reset();
            checkboxContainer.innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo.');
        });
    });
});
