/* =========================================
   ELEMENTS
========================================= */

const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.querySelector(".navbar");

const revealCharacter =
    document.getElementById("revealCharacter");

const maskedCharacter =
    document.getElementById("maskedCharacter");

const characterStack =
    revealCharacter?.querySelector(".character-stack");

const revealHint =
    document.getElementById("revealHint");


/* =========================================
   MOBILE MENU
========================================= */

function openMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("open");

    if (menuButton) {
        menuButton.style.visibility = "hidden";
        menuButton.setAttribute("aria-expanded", "true");
    }

    document.body.style.overflow = "hidden";
}


function closeMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");

    if (menuButton) {
        menuButton.style.visibility = "visible";
        menuButton.setAttribute("aria-expanded", "false");
    }

    document.body.style.overflow = "";
}


menuButton?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);


mobileMenu
    ?.querySelectorAll("a")
    .forEach((link) => {
        link.addEventListener("click", closeMenu);
    });


/* =========================================
   NAVBAR
========================================= */

function updateNavbar() {

    if (!navbar) return;

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 50
    );

}


window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);


updateNavbar();


/* =========================================
   CHARACTER SPOTLIGHT
========================================= */

if (characterStack && maskedCharacter) {

    let radius = 0;
    let targetRadius = 0;

    let x = 50;
    let y = 45;

    let targetX = 50;
    let targetY = 45;

    let animationFrame = null;

    let touchActive = false;
    let touchCloseTimer = null;


    /* =====================================
       REVEAL SIZE
    ===================================== */

    function getRadius() {

        if (window.innerWidth <= 420) {
            return 42;
        }

        if (window.innerWidth <= 700) {
            return 52;
        }

        if (window.innerWidth <= 1100) {
            return 65;
        }

        return 78;
    }


    /* =====================================
       HINT
    ===================================== */
/* =====================================
   HINT
===================================== */

let hasInteracted = false;


function showHint() {

    if (!revealHint) {
        return;
    }

    revealHint.classList.remove("hide");
    revealHint.classList.add("show");

}


function hideHint() {
    /*
       Intentional:
       cursor/touch interaction par
       hint hide nahi hoga.

       Hint automatically 30 sec
       ke baad hide hoga.
    */
}


/* =====================================
   POINT → CHARACTER POSITION
===================================== */
    /* =====================================
       POINT → CHARACTER POSITION
    ===================================== */

    function setTargetFromPoint(clientX, clientY) {

        const rect =
            characterStack.getBoundingClientRect();


        const inside =
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom;


        if (!inside) {

            targetRadius = 0;

            startAnimation();

            return false;
        }


        targetX =
            ((clientX - rect.left) /
                rect.width) *
            100;


        targetY =
            ((clientY - rect.top) /
                rect.height) *
            100;

        targetRadius = getRadius();

        hasInteracted = true;

        startAnimation();
    }


    /* =====================================
       ANIMATION
    ===================================== */

    function startAnimation() {

        if (animationFrame !== null) {
            return;
        }

        animationFrame =
            requestAnimationFrame(animate);

    }


    function animate() {

        animationFrame = null;


        x += (targetX - x) * 0.30;
        y += (targetY - y) * 0.30;


        radius +=
            (targetRadius - radius) * 0.22;


        maskedCharacter.style.setProperty(
            "--spot-x",
            `${x}%`
        );


        maskedCharacter.style.setProperty(
            "--spot-y",
            `${y}%`
        );


        maskedCharacter.style.setProperty(
            "--spot-size",
            `${Math.max(0, radius)}px`
        );


        const stillMoving =
            Math.abs(targetX - x) > 0.05 ||
            Math.abs(targetY - y) > 0.05 ||
            Math.abs(targetRadius - radius) > 0.1;


        if (stillMoving) {
            startAnimation();
        }

    }


    /* =====================================
       DESKTOP MOUSE
    ===================================== */

    window.addEventListener(
        "mousemove",
        (event) => {

            /*
               Only desktop/tablet mouse.
               On phone-sized viewport the
               touch/pointer system below handles it.
            */

            if (window.innerWidth <= 700) {
                return;
            }


            setTargetFromPoint(
                event.clientX,
                event.clientY
            );

        },
        { passive: true }
    );


    document.addEventListener(
        "mouseleave",
        () => {

            targetRadius = 0;

            startAnimation();

        }
    );


    /* =====================================
       MOBILE REVEAL
    ===================================== */

    function clearCloseTimer() {

        if (!touchCloseTimer) {
            return;
        }


        clearTimeout(touchCloseTimer);

        touchCloseTimer = null;

    }


    function closeTouchReveal() {

        touchActive = false;

        clearCloseTimer();

        targetRadius = 0;

        startAnimation();

    }


    function scheduleSafetyClose() {

        clearCloseTimer();


        /*
           If release is somehow missed,
           mask still restores automatically.
        */

        touchCloseTimer =
            setTimeout(
                closeTouchReveal,
                650
            );

    }


    characterStack.addEventListener(
        "pointerdown",
        (event) => {

            /*
               For <=700px we deliberately do NOT
               require pointerType === "touch".

               This means:
               - real phone touch works
               - Chrome DevTools mouse simulation works
            */

            if (window.innerWidth > 700) {
                return;
            }


            touchActive = true;


            setTargetFromPoint(
                event.clientX,
                event.clientY
            );


            scheduleSafetyClose();


            try {

                characterStack.setPointerCapture(
                    event.pointerId
                );

            } catch (_) {
                /* Safe fallback */
            }

        }
    );


    characterStack.addEventListener(
        "pointermove",
        (event) => {

            if (
                window.innerWidth > 700 ||
                !touchActive
            ) {
                return;
            }


            setTargetFromPoint(
                event.clientX,
                event.clientY
            );


            scheduleSafetyClose();

        }
    );


    characterStack.addEventListener(
        "pointerup",
        () => {

            if (window.innerWidth <= 700) {
                closeTouchReveal();
            }

        }
    );


    characterStack.addEventListener(
        "pointercancel",
        closeTouchReveal
    );


    characterStack.addEventListener(
        "lostpointercapture",
        closeTouchReveal
    );


    window.addEventListener(
        "pointerup",
        () => {

            if (
                window.innerWidth <= 700 &&
                touchActive
            ) {

                closeTouchReveal();

            }

        }
    );


    window.addEventListener(
        "blur",
        closeTouchReveal
    );


    /* =====================================
       INITIAL STATE
    ===================================== */

    maskedCharacter.style.setProperty(
        "--spot-size",
        "0px"
    );
    /* =====================================
   FIRST-VISIT REVEAL DEMO
===================================== */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (!prefersReducedMotion) {

    /*
       First show the hint.
    */

    setTimeout(() => {

    showHint();

    /* Keep hint visible for 30 seconds */
    setTimeout(() => {

        if (revealHint) {
            revealHint.classList.remove("show");
            revealHint.classList.add("hide");
        }

    }, 30000);

}, 900);

    /*
       Demonstrate the interaction once.

       Opens a small reveal over the mask,
       then automatically closes.
    */

    setTimeout(() => {

        if (hasInteracted) {
            return;
        }


        /*
           Approx centre of mask.
        */

        targetX = 50;
        targetY = 55;

        targetRadius =
            window.innerWidth <= 700
                ? 32
                : 42;


        startAnimation();


        /*
           Close demo again.
        */

        setTimeout(() => {

            if (hasInteracted) {
                return;
            }


            targetRadius = 0;

            startAnimation();

        }, 700);


    }, 1300);

} else {

    /*
       Still display instruction,
       but no animated demo.
    */

    showHint();

}
}


/* =========================================
   ESC CLOSES MENU
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeMenu();
        }

    }
);