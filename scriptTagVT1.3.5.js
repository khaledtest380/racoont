const { pathname } = window.location;
const readCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
const item_status = 1;
const baseUrl = "https://972712a9ab5b.ngrok.com";
const productPageReg = new RegExp(/^\/products\/.*$/);
const sessionId = readCookie("__ssid");
const sessionIdX = sessionId.replaceAll("-", "");
let websiteId = location.host;
if (location.host.indexOf("www.") === 0) {
    websiteId = location.host.replace("www.", "");
}
async function productData(id) {
    const data = await fetch(`${baseUrl}/productById/${websiteId}/${id}`);
    const json = await data.json();
    console.log(json);
    return json;
}

document
    .getElementById("shopify-section-header")
    .insertAdjacentHTML(
        "beforeend",
        "<div id='popularView' style='text-align:center'></div>"
    );
async function fillPopularItemsView(data) {
    if (data.res.length > 0) {
        document.getElementById("popularView").innerHTML =
            "<h1>Popular viewed items</h1>";
        for (let i = 0; i < data.res.length; i++) {
            var html_str = "";
            product = await productData(data.res[i].key.toString());
            console.log(data.res[i].key.toString());
            productUrl =
                "https://" + websiteId + "/products/" + product["product"].handle;
            console.log(product["product"].title);
            html_str += `<div style="display:inline-block;margin:1%;width:23%;">`;
            html_str += '<div class="image-product relative overfollow-hidden">';
            html_str += '<div class="center-vertical-image">';
            html_str +=
                '<div style="text-align: center;"><img style="cursor: pointer;width:18rem;height:15rem" src="' +
                product["product"].image.src +
                '" alt="Product"onclick="itemView(' +
                product["product"].id +
                ", " +
                item_status +
                ", " +
                product["product"].variants[0].price +
                ",'" +
                product["product"].title +
                "');\"><div>";
            html_str += "</div>";
            html_str += "</div>";
            html_str += `<div style="text-align: center;"><h3 class="title-product full-width title-hover-black"><a href="${productUrl}">${product["product"].title}</a></h3></div>`;
            html_str += '<div style="text-align: center;">';
            html_str +=
                '<h4 style="display:inline-block;" class="text-red price-shoping-cart">' +
                product["product"].variants[0].price +
                " EGP</h4>";
            html_str += "</div>";
            html_str += "</div>";
            document
                .getElementById("popularView")
                .insertAdjacentHTML("beforeend", html_str);
        }
    }
}

document
    .getElementById("shopify-section-header")
    .insertAdjacentHTML(
        "beforeend",
        "<div id='popularAtc' style='text-align:center'></div>"
    );
async function fillPopularItemsAtc(data) {
    if (data.res.length > 0) {
        document.getElementById("popularAtc").innerHTML =
            "<h1>Popular bought items</h1>";

        for (let i = 0; i < data.res.length; i++) {
            var html_str = "";
            product = await productData(data.res[i].key.toString());
            productUrl =
                "https://" + websiteId + "/products/" + product["product"].handle;
            console.log(product["product"]);
            html_str += `<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 product-category relative effect-hover-boxshadow animate-default hvr-bob" style="display:inline-block;margin:1%;width:23%;">`;
            html_str += '<div class="image-product relative overfollow-hidden">';
            html_str += '<div class="center-vertical-image">';
            html_str +=
                '<div style="text-align: center;"><img style="cursor: pointer;width:18rem;height:15rem" src="' +
                product["product"].image.src +
                '" alt="Product"onclick="itemView(' +
                product["product"].id +
                ", " +
                item_status +
                ", " +
                product["product"].variants[0].price +
                ",'" +
                product["product"].title +
                "');\"><div>";
            html_str += "</div>";
            html_str += "</div>";
            html_str += `<div style="text-align: center;"><h3 class="title-product full-width title-hover-black"><a href="${productUrl}">${product["product"].title}</a></h3></div>`;
            html_str += '<div style="text-align: center;">';
            html_str +=
                '<h4 style="display:inline-block;" class="text-red price-shoping-cart">' +
                product["product"].variants[0].price +
                " EGP</h4>";
            html_str += "</div>";
            html_str += "</div>";
            document
                .getElementById("popularAtc")
                .insertAdjacentHTML("beforeend", html_str);
        }
    }
}

document
    .getElementById("shopify-section-header")
    .insertAdjacentHTML(
        "beforeend",
        "<div id='recommended' style='text-align:center'></div>"
    );
async function fillRecommendedItems(data) {
    console.log(data.res.length);
    if (data.res.length > 0) {
        document.getElementById("recommended").innerHTML =
            "<h1>Recommended items</h1>";
        for (let i = 0; i < data.res.length; i++) {
            var html_str = "";
            product = await productData(data.res[i].iid.toString());
            productUrl =
                "https://" + websiteId + "/products/" + product["product"].handle;
            console.log(product["product"]);
            html_str += `<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 product-category relative effect-hover-boxshadow animate-default hvr-bob" style="display:inline-block;margin:1%;width:23%;">`;
            html_str += '<div class="image-product relative overfollow-hidden">';
            html_str += '<div class="center-vertical-image">';
            html_str +=
                '<div style="text-align: center;"><img style="cursor: pointer;width:18rem;height:15rem" src="' +
                product["product"].image.src +
                '" alt="Product"onclick="itemView(' +
                product["product"].id +
                ", " +
                item_status +
                ", " +
                product["product"].variants[0].price +
                ",'" +
                product["product"].title +
                "');\"><div>";
            html_str += "</div>";
            html_str += "</div>";
            html_str += `<div style="text-align: center;"><h3 class="title-product full-width title-hover-black"><a href="${productUrl}">${product["product"].title}</a></h3></div>`;
            html_str += '<div style="text-align: center;">';
            html_str +=
                '<h4 style="display:inline-block;" class="text-red price-shoping-cart">' +
                product["product"].variants[0].price +
                " EGP</h4>";
            html_str += "</div>";
            html_str += "</div>";
            document
                .getElementById("recommended")
                .insertAdjacentHTML("beforeend", html_str);
        }
    }
}

document
    .getElementById("shopify-section-footer")
    .insertAdjacentHTML(
        "beforebegin",
        "<br><br><div id='related' style='text-align:center'></div>"
    );
async function fillRelatedItems(data) {
    if (data.res.length > 0) {
        document.getElementById("related").innerHTML = "<h1>related items</h1>";
        for (let i = 0; i < data.res.length; i++) {
            var html_str = "";
            product = await productData(data.res[i].iid);
            productUrl =
                "https://" + websiteId + "/products/" + product["product"].handle;
            console.log(product["product"]);
            html_str += `<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 product-category relative effect-hover-boxshadow animate-default hvr-bob" style="display:inline-block;margin:1%;width:23%;">`;
            html_str += '<div class="image-product relative overfollow-hidden">';
            html_str += '<div class="center-vertical-image">';
            html_str +=
                '<div style="text-align: center;"><img style="cursor: pointer;width:18rem;height:15rem" src="' +
                product["product"].image.src +
                '" alt="Product"onclick="itemView(' +
                product["product"].id +
                ", " +
                item_status +
                ", " +
                product["product"].variants[0].price +
                ",'" +
                product["product"].title +
                "');\"><div>";
            html_str += "</div>";
            html_str += "</div>";
            html_str += `<div style="text-align: center;"><h3 class="title-product full-width title-hover-black"><a href="${productUrl}">${product["product"].title}</a></h3></div>`;
            html_str += '<div style="text-align: center;">';
            html_str +=
                '<h4 style="display:inline-block;" class="text-red price-shoping-cart">' +
                product["product"].variants[0].price +
                " EGP</h4>";
            html_str += "</div>";
            html_str += "</div>";
            document
                .getElementById("related")
                .insertAdjacentHTML("beforeend", html_str);
        }
    }
}

//homepage
if (pathname === "/") {
    // send twice -> view and atc
    fetch(`${baseUrl}/popularItems/${websiteId}/view`)
        .then((response) => response.json())
        .then((data) => {
            fillPopularItemsView(data);
        });

    fetch(`${baseUrl}/popularItems/${websiteId}/atc`)
        .then((response) => response.json())
        .then((data) => {
            fillPopularItemsAtc(data);
        });
    fetch(
        `${baseUrl}/sessionRecommendation/${websiteId}/${sessionIdX}`
    )
        .then((response) => response.json())
        .then((data) => {
            fillRecommendedItems(data);
        });
}

// product page
if (productPageReg.test(pathname)) {
    const ingestSessionRequestConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sessionIdX,
            websiteId,
        }),
    };

    fetch(
        baseUrl+"/ingest_session",
        ingestSessionRequestConfig
    );

    fetch(`${window.location.href}.json`)
        .then((response) => response.json())
        .then((data) => data.product)
        .then((productData) => {
            fetch(
                `${baseUrl}/relatedItems/${websiteId}/${productData.id}`
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.res);
                    fillRelatedItems(data);
                });

            const productVariants = productData.variants;
            let productPrice = 0;
            if (productVariants.length === 1) {
                productPrice = productVariants[0].price;
            } else {
                let variantSelect = document.getElementsByTagName(
                    "single-option-selector-product-template product-form__input"
                )[0];
                if (!variantSelect) {
                    variantSelect = document.getElementsByTagName("select")[0];
                }
                const variant = variantSelect?.value;
                productPrice =
                    productData?.variants?.find((v) => v?.option1 === variant)?.price ||
                    0;
            }
            const ingestRequestConfig = (requestAction) => {
                return {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        websiteId,
                        sessionIdX,
                        name: productData.title,
                        price: productPrice || 0,
                        action: requestAction,
                        id: productData.id,
                    }),
                };
            };

            fetch(
                baseUrl+"/ingest",
                ingestRequestConfig("view")
            );

            const addToCartBtn = document.getElementsByClassName(
                "product-form__cart-submit"
            )[0];

            addToCartBtn.addEventListener("click", function () {
                fetch(
                    baseUrl+"/ingest",
                    ingestRequestConfig("atc")
                );
                fetch(
                    baseUrl+"/ingest_session",
                    ingestSessionRequestConfig
                );
            });
        });
}
