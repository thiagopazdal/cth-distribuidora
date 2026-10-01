document.addEventListener("DOMContentLoaded", () => {

    const productsContainer =
        document.querySelector(".products-container");

    if (!productsContainer) return;

    const products =
        JSON.parse(localStorage.getItem("cthProducts")) || [];

    productsContainer.innerHTML = "";

    if (products.length === 0) {

        productsContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px 20px;
            ">
                <h3>No hay productos disponibles</h3>
                <p>
                    Próximamente vas a encontrar
                    nuestros productos acá.
                </p>
            </div>
        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        const imageHTML = product.image
            ? `<img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                ">`
            : `<span>📦</span>`;


        card.innerHTML = `

            <div class="product-image">

                ${imageHTML}

            </div>


            <div class="product-info">

                ${product.featured
                    ? `<small>⭐ DESTACADO</small>`
                    : `<small>${escapeHTML(product.category)}</small>`
                }


                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <p>
                    ${escapeHTML(product.description)}
                </p>


                <div class="product-bottom">

                    <strong>
                        $${Number(product.price)
                            .toLocaleString("es-AR")}
                    </strong>


                    <a
                        href="#"
                        class="buy-product"
                        data-id="${product.id}">

                        COMPRAR

                    </a>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });


    /* BOTONES COMPRAR */

    document
        .querySelectorAll(".buy-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const id =
                        Number(
                            button.dataset.id
                        );

                    const product =
                        products.find(
                            item => item.id === id
                        );

                    if (!product) return;


                    const message =
                        `Hola CTH Distribuidora 👋

Quiero comprar:

🛍️ ${product.name}
💰 $${Number(product.price)
    .toLocaleString("es-AR")}

¿Sigue disponible?`;


                    const url =
                        `https://wa.me/5493813929798?text=${
                            encodeURIComponent(message)
                        }`;


                    window.open(
                        url,
                        "_blank"
                    );

                }
            );

        });

});


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}