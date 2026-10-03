mi document.addEventListener("DOMContentLoaded", () => {

    const productsContainer =
        document.querySelector(".products-container");

    if (!productsContainer) return;


    /* =========================
       PRODUCTOS
    ========================= */

    const products =
        JSON.parse(localStorage.getItem("cthProducts")) || [];


    /* =========================
       CARRITO
    ========================= */

    let cart =
        JSON.parse(localStorage.getItem("cthCart")) || [];


    /* =========================
       ELEMENTOS DEL CARRITO
    ========================= */

    const cartButton =
        document.getElementById("cartButton");

    const cartPanel =
        document.getElementById("cartPanel");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const closeCart =
        document.getElementById("closeCart");

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");


/* =========================
   BUSCADOR + CATEGORÍAS
========================= */

const searchInput =
    document.getElementById("productSearch");

const categoryButtons =
    document.querySelectorAll(".category-filter");

let selectedCategory = "Todos";
    /* =========================
       MOSTRAR PRODUCTOS
    ========================= */

    function renderProducts(productList) {

        productsContainer.innerHTML = "";


        if (productList.length === 0) {

            productsContainer.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px 20px;
                ">

                    <h3>No encontramos productos</h3>

                    <p>
                        Probá buscando otro nombre.
                    </p>

                </div>
            `;

            return;

        }


        productList.forEach(product => {

            const card =
                document.createElement("article");

            card.className = "product-card";


            const stock =
                Number(product.stock) || 0;


            const imageHTML = product.image

                ? `
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:contain;
                        "
                    >
                `

                : `<span>📦</span>`;

  let stockHTML;

if (stock <= 0) {

    stockHTML = `
        <small class="stock-status out">
            🔴 SIN STOCK
        </small>
    `;

} else if (stock <= 3) {

    stockHTML = `
        <small class="stock-status low">
            🟠 ÚLTIMAS ${stock} UNIDADES
        </small>
    `;

} else {

    stockHTML = `
        <small class="stock-status available">
            🟢 EN STOCK
        </small>
    `;

}

            let buttonHTML;


            if (stock <= 0) {

                buttonHTML = `
                    <a
                        href="#"
                        class="buy-product disabled"
                        style="
                            opacity:0.5;
                            pointer-events:none;
                        "
                    >
                        SIN STOCK
                    </a>
                `;

            } else {

                buttonHTML = `
                    <a
                        href="#"
                        class="buy-product"
                        data-id="${product.id}"
                    >
                        AGREGAR
                    </a>
                `;

            }


            card.innerHTML = `

                <div class="product-image">

                    ${imageHTML}

                </div>


                <div class="product-info">

                    ${
                        product.featured

                        ? `<small>⭐ DESTACADO</small>`

                        : `<small>
                            ${escapeHTML(product.category)}
                          </small>`
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


                        ${buttonHTML}

                    </div>

                </div>

            `;


            productsContainer.appendChild(card);

        });

    }


    /* =========================
       INICIAR PRODUCTOS
    ========================= */

    renderProducts(products);


/* =========================
   FILTRAR PRODUCTOS
========================= */

function filterProducts() {

    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const filteredProducts =
        products.filter(product => {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const description =
                String(product.description || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            const matchesSearch =
                !search ||
                name.includes(search) ||
                description.includes(search) ||
                category.includes(search);

            const matchesCategory =
                selectedCategory === "Todos" ||
                String(product.category || "") ===
                selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );

        });

    renderProducts(filteredProducts);

}

/* =========================
   BUSCADOR
========================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}

/* =========================
   BOTONES DE CATEGORÍA
========================= */

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedCategory =
                button.dataset.category;

            categoryButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            filterProducts();

        }
    );

});
    /* =========================
       GUARDAR CARRITO
    ========================= */

    function saveCart() {

        localStorage.setItem(
            "cthCart",
            JSON.stringify(cart)
        );

    }


    /* =========================
       ABRIR CARRITO
    ========================= */

    function openCart() {

        cartPanel.classList.add("active");

        cartOverlay.classList.add("active");

    }


    /* =========================
       CERRAR CARRITO
    ========================= */

    function closeCartPanel() {

        cartPanel.classList.remove("active");

        cartOverlay.classList.remove("active");

    }


    /* =========================
       ACTUALIZAR CARRITO
    ========================= */

    function renderCart() {

        cartItems.innerHTML = "";


        let total = 0;

        let quantityTotal = 0;


        if (cart.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Tu carrito está vacío.
                </p>
            `;

        }


        cart.forEach(item => {

            const product =
                products.find(
                    p =>
                        Number(p.id) ===
                        Number(item.id)
                );


            if (!product) return;


            const price =
                Number(product.price) || 0;


            const stock =
                Number(product.stock) || 0;


            if (item.quantity > stock) {

                item.quantity = stock;

            }


            if (item.quantity <= 0) return;


            const subtotal =
                price * item.quantity;


            total += subtotal;

            quantityTotal += item.quantity;


            const imageHTML =
                product.image

                ? `
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >
                `

                : `📦`;


            const itemElement =
                document.createElement("div");

            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-image">

                    ${imageHTML}

                </div>


                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <div class="cart-item-price">

                        $${price.toLocaleString("es-AR")}

                    </div>


                    <div class="quantity-controls">

                        <button
                            class="decrease"
                            data-id="${product.id}"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            class="increase"
                            data-id="${product.id}"
                            ${item.quantity >= stock
                                ? "disabled"
                                : ""}
                        >
                            +
                        </button>


                        <button
                            class="remove-item"
                            data-id="${product.id}"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            `;


            cartItems.appendChild(itemElement);

        });


        cartCount.textContent =
            quantityTotal;


        cartTotal.textContent =
            `$${total.toLocaleString("es-AR")}`;


        saveCart();

    }


    /* =========================
       AGREGAR AL CARRITO
    ========================= */

    productsContainer.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(".buy-product");


            if (!button) return;


            event.preventDefault();


            const id =
                Number(button.dataset.id);


            const product =
                products.find(
                    p =>
                        Number(p.id) === id
                );


            if (!product) return;


            const stock =
                Number(product.stock) || 0;


            if (stock <= 0) return;


            const existing =
                cart.find(
                    item =>
                        Number(item.id) === id
                );


            if (existing) {

                if (existing.quantity < stock) {

                    existing.quantity++;

                }

            } else {

                cart.push({
                    id: id,
                    quantity: 1
                });

            }


            saveCart();

            renderCart();

            openCart();

        }
    );


    /* =========================
       BOTONES DEL CARRITO
    ========================= */

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");


            if (!button) return;


            const id =
                Number(button.dataset.id);


            const item =
                cart.find(
                    item =>
                        Number(item.id) === id
                );


            if (!item) return;


            const product =
                products.find(
                    p =>
                        Number(p.id) === id
                );


            if (!product) return;


            const stock =
                Number(product.stock) || 0;


            /* RESTAR */

            if (
                button.classList.contains("decrease")
            ) {

                item.quantity--;


                if (item.quantity <= 0) {

                    cart =
                        cart.filter(
                            item =>
                                Number(item.id) !== id
                        );

                }

            }


            /* SUMAR */

            if (
                button.classList.contains("increase")
            ) {

                if (item.quantity < stock) {

                    item.quantity++;

                }

            }


            /* ELIMINAR */

            if (
                button.classList.contains("remove-item")
            ) {

                cart =
                    cart.filter(
                        item =>
                            Number(item.id) !== id
                    );

            }


            saveCart();

            renderCart();

        }
    );


    /* =========================
       FINALIZAR PEDIDO
    ========================= */

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert("Tu carrito está vacío.");

                return;

            }


            let message =
                `Hola CTH Distribuidora 👋

Quiero hacer este pedido:

`;


            let total = 0;


            cart.forEach(item => {

                const product =
                    products.find(
                        p =>
                            Number(p.id) ===
                            Number(item.id)
                    );


                if (!product) return;


                const subtotal =
                    Number(product.price) *
                    item.quantity;


                total += subtotal;


                message +=
                    `🛍️ ${product.name} x${item.quantity}
💰 $${subtotal.toLocaleString("es-AR")}

`;

            });


            message +=
                `━━━━━━━━━━━━
TOTAL: $${total.toLocaleString("es-AR")}
━━━━━━━━━━━━

¿Me confirman disponibilidad?`;


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


    /* =========================
       EVENTOS DEL PANEL
    ========================= */

    cartButton.addEventListener(
        "click",
        openCart
    );


    closeCart.addEventListener(
        "click",
        closeCartPanel
    );


    cartOverlay.addEventListener(
        "click",
        closeCartPanel
    );


    /* =========================
       INICIAR CARRITO
    ========================= */

    renderCart();

});


/* =========================
   SEGURIDAD HTML
========================= */

function escapeHTML(text) {

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}