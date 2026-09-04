/* =========================================
   CINEMATIC SITE LOADER
========================================= */

const siteLoader =
    document.getElementById("siteLoader");


if (siteLoader) {

    /*
       Prevent scrolling while the curtain
       is covering the website.
    */

    document.documentElement.style.overflow =
        "hidden";


    let loaderStarted = false;


    function openSiteLoader() {

        if (loaderStarted) {
            return;
        }

        loaderStarted = true;


        /*
           Give PORTFOLIO enough time to be
           seen before opening the curtains.
        */

        setTimeout(() => {

            siteLoader.classList.add(
                "is-opening"
            );


            /*
               Scrolling can return as soon
               as the opening begins.
            */

            document.documentElement.style.overflow =
                "";


            /*
               Remove loader after curtain
               transition has completed.
            */

            setTimeout(() => {

                siteLoader.classList.add(
                    "is-finished"
                );

            }, 3400);


        }, 1150);

    }


    /*
       Normally wait for the window load event
       so critical images/fonts have had a chance
       to initialize.
    */

    if (document.readyState === "complete") {

        openSiteLoader();

    } else {

        window.addEventListener(
            "load",
            openSiteLoader,
            { once: true }
        );

    }


    /*
       Safety:
       Never trap a visitor on the loader if
       one external asset takes too long.
    */

    setTimeout(
        openSiteLoader,
        3000
    );

}