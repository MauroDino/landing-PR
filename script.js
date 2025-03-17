document.addEventListener('DOMContentLoaded', function () {
    const cantidadRadios = document.querySelectorAll('input[name="cantidad"]');
    const checkboxContainer = document.getElementById('checkbox-container');
    const formulario = document.getElementById('pedido-form');

    // Lista de tipos de pan. Dejar un espacio después de la primera comilla
    const tiposDePan = [" 100% 000", " Tradicional", " Blend de harinas"];

    cantidadRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            const cantidad = parseInt(this.value);
            generarCheckboxes(cantidad);
        });
    });

    // Función para generar los checkboxes
    function generarCheckboxes(cantidad) {
        // Limpiar el contenedor de checkboxes anteriores
        checkboxContainer.innerHTML = '';

        // Determinar cuántos checkboxes generar
        const totalCheckboxes = cantidad * tiposDePan.length; // 1 -> 3 checkboxes, 2 -> 6 checkboxes, 3 -> 9 checkboxes

        for (let i = 0; i < totalCheckboxes; i++) {
            const checkboxWrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'pan';
            checkbox.value = tiposDePan[i % tiposDePan.length]; // Usar los tipos de pan
            checkbox.id = `pan${i + 1}`;

            // Limitamos la cantidad de checkboxes seleccionables según la cantidad
            checkbox.addEventListener('change', function () {
                const selectedCheckboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
                if (selectedCheckboxes.length > cantidad) {
                    alert(`Solo puedes seleccionar ${cantidad} pan(es).`);
                    this.checked = false; // Desmarcar el checkbox si se excede la cantidad
                }
            });

            // Etiqueta para cada checkbox
            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.textContent = tiposDePan[i % tiposDePan.length]; // Etiqueta con el nombre del pan

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            checkboxContainer.appendChild(checkboxWrapper);
        }
    }

    // Inicializar EmailJS
    emailjs.init("7QK9tEgPkc8Re4aeV"); // Reemplazá TU_USER_ID con tu clave de usuario de EmailJS

    // Manejar el envío del formulario
    formulario.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        emailjs.sendForm("service_wlfrthx", "template_647wotg", this)
            .then(function() {
                alert("¡Formulario enviado correctamente! Revisa tu correo.");
            }, function(error) {
                alert("Hubo un error al enviar el formulario: " + error);
            });
    });
});
