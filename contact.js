/* =========================================
   CONTACT — SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal-on-scroll"
    );


const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                entry.target.classList.add(
                    "visible"
                );


                /*
                   Animate only once.
                */

                observer.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12,
            rootMargin:
                "0px 0px -50px 0px"
        }
    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   PROJECT FORM
========================================= */
/* =========================================
   PROJECT FORM — REAL SUBMISSION
========================================= */

const projectForm =
    document.getElementById("projectForm");

const successMessage =
    document.getElementById("successMessage");

const submitButton =
    projectForm?.querySelector(".submit-project");


if (
    projectForm &&
    successMessage &&
    submitButton
) {

    projectForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* -----------------------------
               LOADING STATE
            ----------------------------- */

            const originalButtonHTML =
                submitButton.innerHTML;


            submitButton.disabled = true;

            submitButton.innerHTML = `
                <span>SENDING...</span>
            `;


            /*
               If an old success/error message
               exists, hide it before retry.
            */

            successMessage.classList.remove(
                "show",
                "error"
            );


            /* -----------------------------
               FORM DATA
            ----------------------------- */

            const formData =
                new FormData(projectForm);


            /*
               Extra useful information.
            */

            formData.append(
                "page",
                window.location.href
            );


            formData.append(
                "submitted_at",
                new Date().toLocaleString()
            );


            try {

                /* -----------------------------
                   SEND TO WEB3FORMS
                ----------------------------- */

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                /* -----------------------------
                   SUCCESS
                ----------------------------- */

                if (
                    response.ok &&
                    result.success
                ) {

                    successMessage.innerHTML = `
                        <div class="success-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                RESPONSE SUBMITTED
                            </strong>

                            <p>
                                Your response has been submitted.
                                We will get back to you as soon as possible.
                            </p>
                        </div>
                    `;


                    successMessage.classList.add(
                        "show"
                    );


                    /*
                       Clear the form only after
                       real server confirmation.
                    */

                    projectForm.reset();


                    setTimeout(() => {

                        successMessage.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });

                    }, 100);

                }


                /* -----------------------------
                   API ERROR
                ----------------------------- */

                else {

                    throw new Error(
                        result.message ||
                        "Submission failed"
                    );

                }

            }


            /* -----------------------------
               NETWORK / OTHER ERROR
            ----------------------------- */

            catch (error) {

                console.error(
                    "Form submission error:",
                    error
                );


                successMessage.innerHTML = `
                    <div class="success-icon">
                        !
                    </div>

                    <div>
                        <strong>
                            COULDN'T SEND
                        </strong>

                        <p>
                            Something went wrong.
                            Please check your connection
                            and try again.
                        </p>
                    </div>
                `;


                successMessage.classList.add(
                    "show",
                    "error"
                );

            }


            /* -----------------------------
               RESTORE BUTTON
            ----------------------------- */

            finally {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonHTML;

            }

        }
    );

}
/* =========================================
   COUNTRY → CALLING CODE + PHONE LENGTH
========================================= */

const countrySelect = document.getElementById("clientCountry");
const phoneCode = document.getElementById("phoneCode");
const countryCodeInput = document.getElementById("countryCode");
const clientPhone = document.getElementById("clientPhone");

/*
    National phone-number digit limits.

    IMPORTANT:
    Some countries have variable-length numbers,
    so min and max can be different.
*/
const phoneRules = {
    "India": { min: 10, max: 10 },
    "United States": { min: 10, max: 10 },
    "Canada": { min: 10, max: 10 },
    "United Kingdom": { min: 9, max: 10 },
    "United Arab Emirates": { min: 9, max: 9 },
    "Saudi Arabia": { min: 9, max: 9 },
    "Australia": { min: 9, max: 9 },
    "New Zealand": { min: 8, max: 10 },
    "Singapore": { min: 8, max: 8 },
    "Japan": { min: 9, max: 10 },
    "South Korea": { min: 9, max: 10 },
    "China": { min: 11, max: 11 },
    "Pakistan": { min: 10, max: 10 },
    "Bangladesh": { min: 10, max: 10 },
    "Nepal": { min: 10, max: 10 },
    "Sri Lanka": { min: 9, max: 9 },
    "Germany": { min: 5, max: 11 },
    "France": { min: 9, max: 9 },
    "Italy": { min: 6, max: 11 },
    "Spain": { min: 9, max: 9 },
    "Netherlands": { min: 9, max: 9 },
    "Switzerland": { min: 9, max: 9 },
    "Brazil": { min: 10, max: 11 },
    "Mexico": { min: 10, max: 10 },
    "South Africa": { min: 9, max: 9 }
};

if (
    countrySelect &&
    phoneCode &&
    countryCodeInput &&
    clientPhone
) {

    countrySelect.addEventListener("change", function () {

        const selectedOption =
            this.options[this.selectedIndex];

        const callingCode =
            selectedOption.dataset.code || "";

        const country =
            selectedOption.value;

        phoneCode.textContent =
            callingCode || "+--";

        countryCodeInput.value =
            callingCode;

        clientPhone.value = "";
        clientPhone.disabled = false;

        const rule = phoneRules[country];

        if (rule) {

            clientPhone.maxLength = rule.max;

            if (rule.min === rule.max) {
                clientPhone.placeholder =
                    `${rule.max} digit phone number`;
            } else {
                clientPhone.placeholder =
                    `${rule.min}–${rule.max} digit phone number`;
            }

        } else {

            /*
                Temporary fallback for countries whose
                rules aren't in the table yet.
            */
            clientPhone.maxLength = 15;
            clientPhone.placeholder = "Your phone number";
        }
    });


    /* ONLY NUMBERS + MAX LENGTH */
    clientPhone.addEventListener("input", function () {

        const country = countrySelect.value;
        const rule = phoneRules[country];

        // Remove spaces, +, -, letters etc.
        this.value = this.value.replace(/\D/g, "");

        if (rule) {
            this.value =
                this.value.slice(0, rule.max);
        } else {
            this.value =
                this.value.slice(0, 15);
        }

        this.setCustomValidity("");
    });


    /* CHECK MINIMUM LENGTH */
    clientPhone.addEventListener("blur", function () {

        const country = countrySelect.value;
        const rule = phoneRules[country];

        if (!rule) return;

        const length = this.value.length;

        if (
            length < rule.min ||
            length > rule.max
        ) {

            if (rule.min === rule.max) {

                this.setCustomValidity(
                    `Please enter exactly ${rule.min} digits.`
                );

            } else {

                this.setCustomValidity(
                    `Please enter ${rule.min} to ${rule.max} digits.`
                );
            }

        } else {

            this.setCustomValidity("");
        }
    });
}
/* =========================================
   SEARCHABLE COUNTRY PICKER
========================================= */

const countrySearch =
    document.getElementById("countrySearch");

const countryResults =
    document.getElementById("countryResults");


if (
    countrySearch &&
    countryResults &&
    countrySelect
) {

    /*
       Existing <select> options are our
       single source of truth.
    */

    const countries =
        Array.from(countrySelect.options)
            .filter(option => option.value)
            .map(option => ({
                name: option.value,
                code: option.dataset.code || ""
            }));


    function renderCountryResults(query = "") {

        const search =
            query.trim().toLowerCase();


        const matches =
            countries.filter(country => {

                return (
                    country.name
                        .toLowerCase()
                        .includes(search) ||

                    country.code
                        .toLowerCase()
                        .includes(search)
                );

            });


        countryResults.innerHTML = "";


        if (matches.length === 0) {

            countryResults.innerHTML = `
                <div class="country-no-result">
                    No country found
                </div>
            `;

            countryResults.classList.add(
                "show"
            );

            return;
        }


        /*
           Don't dump all 195 items into
           the visible panel at once.
        */

        matches
            .slice(0, 12)
            .forEach(country => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type = "button";

                button.className =
                    "country-result";


                const countryName =
                    document.createElement(
                        "span"
                    );

                countryName.textContent =
                    country.name;


                const countryCode =
                    document.createElement(
                        "span"
                    );

                countryCode.className =
                    "country-result-code";

                countryCode.textContent =
                    country.code;


                button.append(
                    countryName,
                    countryCode
                );


                button.addEventListener(
                    "click",
                    () => {

                        /*
                           Update the REAL select.
                        */

                        countrySelect.value =
                            country.name;


                        /*
                           Trigger your existing:
                           country code + phone logic.
                        */

                        countrySelect.dispatchEvent(
                            new Event(
                                "change",
                                {
                                    bubbles: true
                                }
                            )
                        );


                        /*
                           Show selection in search.
                        */

                        countrySearch.value =
                            country.name;


                        countryResults.classList.remove(
                            "show"
                        );


                        /*
                           Convenient next step:
                           phone field gets focus.
                        */

                        if (clientPhone) {
                            clientPhone.focus();
                        }

                    }
                );


                countryResults.appendChild(
                    button
                );

            });


        countryResults.classList.add(
            "show"
        );

    }


    /*
       Search while typing.
    */

    countrySearch.addEventListener(
        "input",
        () => {

            renderCountryResults(
                countrySearch.value
            );

        }
    );


    /*
       When user taps search on mobile,
       show countries immediately.
    */

    countrySearch.addEventListener(
        "focus",
        () => {

            renderCountryResults(
                countrySearch.value
            );

        }
    );


    /*
       Close when clicking elsewhere.
    */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".country-search-wrap"
                )
            ) {

                countryResults.classList.remove(
                    "show"
                );

            }

        }
    );


    /*
       ESC closes results on desktop.
    */

    countrySearch.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                countryResults.classList.remove(
                    "show"
                );

                countrySearch.blur();

            }

        }
    );

}