// Put your applicaiton javascript here


const sort_by = document.querySelector("#sort_by")

if (sort_by) {
    sort_by.addEventListener('change', (e) => {
        const url = new URL(window.location);
        url.searchParams.set('sort_by', e.currentTarget.value)
        window.location = url;
    })
}

// var myModal = new bootstrap.Modal(document.getElementById('addNewAddress'), {})
// if(myModal) {
//     myModal.show()
// }


const addAddressCountryInput = document.querySelector('#addAddressCountryInput')
if (addAddressCountryInput) {
    addAddressCountryInput.addEventListener('change', function (e) {
        let provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
        provinces = JSON.parse(provinces);
        const provinceInput = document.querySelector('#addAddressProvinceInput')
        provinceInput.innerHTML = '';
        if (provinces.length < 1) {
            provinceInput.setAttribute('disabled', 'disabled');
        } else {
            provinceInput.removeAttribute('disabled');
            for (let p of provinces) {
                const option = document.createElement("option")
                option.value = p[0]
                option.innerText = p[1]
                provinceInput.appendChild(option);
            }
        }
    })
}


const forgotPassword = document.querySelector('#forgotPassword');
const forgetPasswordForm = document.querySelector('#forgetPasswordForm');

if (forgotPassword && forgetPasswordForm) {
    forgotPassword.addEventListener('click', function (e) {

        const hidden = forgetPasswordForm.classList.contains('d-none');

        if (hidden) {
            forgetPasswordForm.classList.remove('d-none')
            forgetPasswordForm.classList.add('d-block')
        } else {
            forgetPasswordForm.classList.remove('d-block')
            forgetPasswordForm.classList.add('d-none')
        }
    })
}


window.onload = (event) => {
    const langOptions = document.querySelectorAll('.lang-opt');
    const changeLanguageForm = document.querySelector('#changeLanguage');

    if (langOptions.length > 0) {
        langOptions.forEach(e => {
            e.addEventListener('click', function (e) {

                const hiddenInput = document.querySelector("[name='language_code']")
                hiddenInput.value = this.getAttribute('data-lang');
                changeLanguageForm.submit();
            })
        })
    }
};


const productsAnchors = document.querySelectorAll('.showProductModal')
const productDetailsModal = document.querySelector('#productDetailsModal')
const productModal = productDetailsModal ? new bootstrap.Modal(productDetailsModal, {}) : null;
const variantsSelectInput = document.querySelector('#variant');
const qtyInput = document.querySelector('#quantity');
const cartItemsCount = document.querySelector('#cart-items-count');

if (productsAnchors.length > 0 && productDetailsModal) {
    productsAnchors.forEach(item => {
        item.addEventListener('click', function (e) {
            const handle = this.getAttribute('product-handle');
            const price = this.getAttribute('product-price')


            fetch(`/products/${handle}.js`).then(d => d.json()).then(d => {
                const productFeaturedImage = document.querySelector('#featured-image')
                const productName = document.querySelector('#product-name')
                const productPrice = document.querySelector('#product-price')
                const productDescription = document.querySelector('#product-description')


                // reset
                variantsSelectInput.innerHTML = '';
                qtyInput.value = 1;

                // #reset

                d.variants.forEach(({id, title}, i) => {
                    const option = document.createElement("option")
                    option.value = id
                    option.innerText = title

                    if (!i)
                        option.setAttribute('selected', 'selected');

                    variantsSelectInput.appendChild(option)
                })


                productPrice.textContent = price;
                productName.textContent = d.title;
                productDescription.innerHTML = d.description;

                productFeaturedImage.src = d.featured_image;


                productModal.show();
            })


        })
    })
}


const addToCardButton = document.querySelector('#addToCard');


if (addToCardButton) {
    addToCardButton.addEventListener('click', function (e) {
        const payload = {
            items: [
                {
                    quantity: qtyInput.value,
                    id: variantsSelectInput.value
                }
            ]
        };

        const rawResponse = fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(d => d.json()).then(d => {

            if (d.status)
                throw d;

            productModal.hide();

            // cartItemsCount.innerHTML = parseInt(cartItemsCount.innerHTML) + parseInt(qtyInput.value);

            update_cart();
        }).catch(({status, description, message}) => {
            alert(`${status} "${message}" ${description}`);
        })


    })
}


function update_cart() {
    if (cartItemsCount) {
        fetch('/cart.js').then(d => d.json()).then(({item_count}) => {
            cartItemsCount.innerHTML = item_count;
        });
    }
}


const searchInput = document.querySelector('#search-input');
const searchSuggestionsList = document.querySelector('.search__suggestions');

if (searchInput) {
    searchInput.addEventListener('change', function (e) {
        const query = this.value;
        if (query.trim() != '') {
            fetch(`/search/suggest.json?q=${query}&resources[type]=product`).then(d => d.json()).then(d => {

                const products = d.resources.results.products;

                if (products.length > 0) {
                    searchSuggestionsList.innerHTML = '';

                    let list = '';

                    products.forEach(product => {
                        list += `<li><a href="${product.url}">${product.title} <div class="search__suggestions-price">${Shopify.currency.active} ${product.price}</div></a></li>`;
                    })

                    searchSuggestionsList.innerHTML = list;

                    searchSuggestionsList.style.display = 'block';
                }

            })
        } else {
            // todo: clean the previous search results
            searchSuggestionsList.innerHTML = '';
            searchSuggestionsList.style.display = 'none';
        }
    })
}



const productRecommendationsSection = document.querySelector('.product-recommendations');

if(productRecommendationsSection) {
    const productId = productRecommendationsSection.getAttribute('product-id');
    if(productId) {
        fetch(`https://ppp-theme-dev.myshopify.com/recommendations/products?product_id=${productId}&limit=4&section_id=product-recommendations`)
            .then(response => response.text())
            .then((text) => {

                const html = document.createElement('div');
                html.innerHTML = text;

                const recommendations = html.querySelector('.product-recommendations');

                if (recommendations && recommendations.innerHTML.trim().length) {
                    productRecommendationsSection.innerHTML = recommendations.innerHTML;
                }
            });
    }

}
