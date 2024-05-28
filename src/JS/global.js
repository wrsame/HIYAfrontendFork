// -------NAVIGATION BUILDER---------

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = [
    {
      name: "Menu 1",
      href: "#menu1",
      dropdown: [
        { name: "Submenu 1", href: "#submenu1-1" },
        { name: "Submenu 2", href: "#submenu1-2" },
        { name: "Submenu 3", href: "#submenu1-3" },
      ],
    },
    {
      name: "Menu 2",
      href: "#menu2",
      dropdown: [
        { name: "Submenu 1", href: "#submenu2-1" },
        { name: "Submenu 2", href: "#submenu2-2" },
        { name: "Submenu 3", href: "#submenu2-3" },
      ],
    },
    {
      name: "Menu 3",
      href: "#menu3",
      dropdown: [
        { name: "Submenu 1", href: "#submenu3-1" },
        { name: "Submenu 2", href: "#submenu3-2" },
        { name: "Submenu 3", href: "#submenu3-3" },
      ],
    },
    {
      name: "Menu 4",
      href: "#menu4",
    },
    {
      name: "Menu 5",
      href: "#menu5",
    },
  ];

  function buildNavbar(menuItems) {
    let desktopMenu = "";
    let mobileMenu = "";

    menuItems.forEach((item, index) => {
      if (item.dropdown) {
        desktopMenu += `
          <div class="relative group dropdown">
            <button class="text-black px-4">${
              item.name
            } <i class="fa-solid fa-chevron-down fa-xs mx-1" style="color: #9c9c9c;"></i></button>
            <div class="zindex-10 absolute left-0 hidden mt-0 w-48 bg-white shadow-lg dropdown-menu">
              ${item.dropdown
                .map(
                  (subItem) =>
                    `<a href="${subItem.href}" class="block px-4 py-2 text-black">${subItem.name}</a>`
                )
                .join("")}
            </div>
          </div>`;

        mobileMenu += `
          <div class="mobile-dropdown">
            <button class="block w-full text-left px-4 py-2 text-black" data-index="${index}">${
          item.name
        } <i class="fa-solid fa-chevron-down fa-xs mx-1" style="color: #9c9c9c;"></i></button>
            <div class="hidden pl-4" id="mobile-dropdown-${index}">
              ${item.dropdown
                .map(
                  (subItem) =>
                    `<a href="${subItem.href}" class="block px-4 py-2 text-black">${subItem.name}</a>`
                )
                .join("")}
            </div>
          </div>`;
      } else {
        desktopMenu += `<button onclick="location.href='${item.href}'" class="px-4 text-black">${item.name} </button>`;
        mobileMenu += `<button onclick="location.href='${item.href}'" class="block w-full text-left px-4 py-2 text-black">${item.name}</button>`;
      }
    });

    return `
      <nav class="bg-transparent my-4">
        <div class="container mx-auto px-4 py-1 flex flex-row md:flex-col justify-between items-center">
          <div class="text-black font-bold md:my-4"><img src="../images/logo.png" class="w-40"/> </div> 
          <div class="hidden md:flex flex-1 justify-center items-center">
            ${desktopMenu}
          </div>
          <div class="md:hidden">
            <button id="menu-button" class="text-black focus:outline-none p-0">
            <i class="fa-solid fa-bars fa-xl" style="color: #000000;"></i>
            </button>
          </div>
        </div>
      </nav>
      <div id="mobile-menu" class="fixed inset-y-0 right-0 bg-white w-5/6 transition-transform transform translate-x-full mobile-menu z-50 shadow-2xl">
        <div class="flex justify-between items-center p-5">
          <button id="close-menu-button" class="text-black focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-5">
          ${mobileMenu}
        </div>
      </div>`;
  }

  document.getElementById("navbar-container").innerHTML =
    buildNavbar(menuItems);

  document.getElementById("menu-button").addEventListener("click", function () {
    var menu = document.getElementById("mobile-menu");
    menu.classList.add("open");
    menu.style.transform = "translateX(0)";
  });

  document
    .getElementById("close-menu-button")
    .addEventListener("click", function () {
      var menu = document.getElementById("mobile-menu");
      menu.classList.remove("open");
      menu.style.transform = "translateX(100%)";
    });

  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", function () {
      this.querySelector(".dropdown-menu").classList.remove("hidden");
      this.querySelector("i").classList.add("rotate");
    });
    dropdown.addEventListener("mouseleave", function () {
      this.querySelector(".dropdown-menu").classList.add("hidden");
      this.querySelector("i").classList.remove("rotate");
    });
  });

  document.querySelectorAll(".mobile-dropdown button").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const dropdown = document.getElementById(`mobile-dropdown-${index}`);
      dropdown.classList.toggle("hidden");
      this.querySelector("i").classList.toggle("rotate");
    });
  });
});

// <div class="text-black font-bold md:my-4"><h1 class="text-3xl">HIYA</h1></div>
