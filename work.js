/* =========================================
   ABOUT — REPLAY WHEN ENTERING FROM TOP
========================================= */

const aboutSection =
    document.getElementById("about");


if (aboutSection) {

    aboutSection.classList.add(
        "about-motion-ready"
    );


    let previousScrollY =
        window.scrollY;

    let direction = "down";

    let hasEntered = false;


    window.addEventListener(
        "scroll",
        () => {

            const currentY =
                window.scrollY;

            if (currentY > previousScrollY) {
                direction = "down";
            }

            else if (currentY < previousScrollY) {
                direction = "up";
            }

            previousScrollY =
                currentY;

        },
        {
            passive: true
        }
    );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const rect =
                        entry.boundingClientRect;


                    /*
                       ENTERING WHILE
                       SCROLLING DOWN
                    */

                    if (
                        entry.isIntersecting &&
                        direction === "down" &&
                        !hasEntered
                    ) {

                        hasEntered = true;

                        aboutSection.classList.add(
                            "about-animate"
                        );

                    }


                    /*
                       User has gone ABOVE About.

                       Reset it so next downward
                       visit can animate again.
                    */

                    if (
                        !entry.isIntersecting &&
                        rect.top > 0
                    ) {

                        hasEntered = false;

                        aboutSection.classList.remove(
                            "about-animate"
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -12% 0px"
            }
        );


    observer.observe(
        aboutSection
    );

}