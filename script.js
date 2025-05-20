document.addEventListener('DOMContentLoaded', function () {
    const cantidadRadios = document.querySelectorAll('input[name="cantidad"]');
    const checkboxContainer = document.getElementById('checkbox-container');
    const formulario = document.getElementById('pedido-form');

    const tiposDePan = [" 100% 000", " Tradicional", " Blend de harinas"];

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

    emailjs.init("7QK9tEgPkc8Re4aeV");

    formulario.addEventListener("submit", function(event) {
        // No bloqueamos el envío para que Formspree funcione
        // Solo avisamos al usuario que el pedido fue recibido

        // Dejamos pasar el envío tradicional para Formspree

        // Luego enviamos el mail al cliente con EmailJS
        setTimeout(() => {
            emailjs.sendForm("service_wlfrthx", "template_647wotg", formulario)
                .then(function() {
                    alert("¡Pedido recibido! Revisa tu correo para la confirmación.");
                }, function(error) {
                    alert("Error al enviar mail de confirmación: " + error);
                });
        }, 1000); // Ajustá este delay si querés
    });
});
