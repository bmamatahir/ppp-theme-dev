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

    if(langOptions.length > 0) {
        langOptions.forEach(e => {
            e.addEventListener('click', function(e) {

                const hiddenInput = document.querySelector("[name='language_code']")
                hiddenInput.value = this.getAttribute('data-lang');
                changeLanguageForm.submit();
            })
        })
    }

};


