const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = mobileMenu.querySelectorAll("a");


function openMenu() {
    mobileMenu.classList.add("open");

    menuButton.classList.add("active");

    menuButton.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";
}


function closeMenu() {
    mobileMenu.classList.remove("open");

    menuButton.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";
}


menuButton.addEventListener("click", openMenu);

menuClose.addEventListener("click", closeMenu);


mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});