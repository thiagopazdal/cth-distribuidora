document.addEventListener("DOMContentLoaded", () => {

    const whatsappButton = document.getElementById("whatsappButton");

    const numeroWhatsApp = "5493813929798";

    const mensaje =
        "Hola CTH Distribuidora 👋, quiero consultar por sus productos.";

    if (whatsappButton) {

        whatsappButton.addEventListener("click", () => {

            const mensajeCodificado =
                encodeURIComponent(mensaje);

            const url =
                `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

            window.open(url, "_blank");

        });

    }

});