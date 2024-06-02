// -----------------------NAVIGATION BUILDER-------------------------------

  import { getCollections } from "../api/data/getData.js"

    document.addEventListener("DOMContentLoaded", async function () {
      const menuItems = [ 
        {
          name: "Smykker",
          href: "",
          dropdown: [
            { name: "Alle smykker", href: "/src/html/collections/main.html#all" },
          ],
        },
        {
          name: "Kollektioner",
          href: "#menu2",
          dropdown: [
            { name: "Submenu 1", href: "#submenu2-1" },
            { name: "Submenu 2", href: "#submenu2-2" },
            { name: "Submenu 3", href: "#submenu2-3" },
          ],
        },
        {
          name: "Om Hiya",
          href: "/src/html/aboutUs.html",
        },
        {
          name: "Kontakt",
          href: "/src/html/contact.html",
        },
      ];

      try {
        const collections = await getCollections();
        collections.forEach(collection => {
          menuItems[0].dropdown.push({ name: collection.name, href: `/src/html/collections/main.html#${collection.name}`});
        });
       
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    

      function buildNavbar(menuItems) {
        let desktopMenu = "";
        let mobileMenu = "";

        menuItems.forEach((item, index) => {
          if (item.dropdown) {
            desktopMenu += `
                <div class="relative group dropdown">
                  <button class="text-black px-4" style="outline: none;">${
                    item.name
                  } <i class="fa-solid fa-chevron-down fa-xs mx-1" style="color: #9c9c9c;"></i></button>
                  <div class="absolute left-0 hidden mt-0 w-56 p-5 bg-white shadow-lg dropdown-menu">
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
                  <button class="outline-none block w-full text-left px-4 py-2 text-black" data-index="${index}" style="outline: none;">${
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
            desktopMenu += `<button onclick="location.href='${item.href}'" class="outline-none px-4 text-black" style="outline: none;">${item.name}</button>`;
            mobileMenu += `<button onclick="location.href='${item.href}'" class="outline-none block w-full text-left px-4 py-2 text-black" style="outline: none;">${item.name}</button>`;
          }
        });

        let t = updateCartQuantityBadge()  

        // Adding the cart icon in the desktop and mobile menus
        const cartIcon = `
        <div class="relative inline-block"> 
        <a href="/src/html/cart.html" class="outline-none">
            <img src="/src/images/shoppingBag.png" alt="cart" class="w-10 h-10">
            <div id="cart-quantity-badge" class="absolute bottom-0 light-blue-col right-0 blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            ${t}
            </div>
        </a>
    </div>`
        return `
          <nav class="">
            <div class="container flex flex-row justify-between items-center">
              <div class="flex items-center">
                <a href="/src/html/index2.html" class="text-black font-bold text-2xl">
                <img src="/src/images/FullLogo.png"
                            alt="logo"
                            class="w-24 md:w-32">
                            </a>
              </div>
              <div class="hidden md:flex items-center">
                ${desktopMenu}
                <div class="ml-4">${cartIcon}</div>
              </div>
              <div class="md:hidden flex items-center">
                <div class="mr-4">${cartIcon}</div>
                <button id="menu-button" class="outline-none text-black p-0">
                  <i class="fa-solid fa-bars fa-xl" style="color: #000000; outline: none;"></i>
                </button>
              </div>
            </div>
          </nav>
          <div id="mobile-menu" class="fixed inset-y-0 right-0 bg-white w-5/6 transition-transform transform translate-x-full mobile-menu z-50 shadow-2xl">
            <div class="flex justify-between items-center p-5">
              <button id="close-menu-button" class="text-black outline-none" style="outline: none;">
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

      document.getElementById("navbar-container").innerHTML = buildNavbar(menuItems);

      document.getElementById("menu-button").addEventListener("click", function () {
        var menu = document.getElementById("mobile-menu");
        menu.classList.add("open");
        menu.style.transform = "translateX(0)";
      });

      document.getElementById("close-menu-button").addEventListener("click", function () {
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

    function updateCartQuantityBadge(){
     
  
      const cart = JSON.parse(localStorage.getItem('HIYAcart')) || [];
  
      const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
      return totalQuantity
      }
//---------------------------- ANIMATIONS -----------------------------------

//-----TOP BAR SLIDE------
document.addEventListener("DOMContentLoaded", function() {

  const texts = ["Fri fragt order over 300-,", "Levering mellem 2-7 dage", "30 dages returret"];
  let currentIndex = 0;
  const sliderText = document.getElementById("sliderText");

  function updateText() {
      sliderText.classList.remove("slide-in");
      sliderText.classList.add("slide-out");

      setTimeout(() => {
          currentIndex = (currentIndex + 1) % texts.length;
          sliderText.textContent = texts[currentIndex];
          sliderText.classList.remove("slide-out");
          sliderText.classList.add("slide-in");
      }, 1000); 
  }

  setInterval(updateText, 4000); // Skift tekst hver 4 sekunder
});


//----------------------------- FOOTER -----------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const footerContent = [
    {
      title: "KAN VI HJÆLPE DIG?",
      links: [
        { text: "Kontakt", href: "#" },
        { text: "FAQ", href: "#" },
        { text: "Levering & Retur", href: "#" },
        { text: "Materialer & Smykkepleje", href: "#" },
        { text: "Størrelsesguide", href: "#" },
        { text: "Privacy Policy", href: "#" },
        { text: "Cookies Information", href: "#" },
        { text: "Juridisk Oplysning", href: "#" },
      ],
    },
    {
      title: "OM HIYA",
      links: [
        { text: "Om os", href: "#" },
        { text: "HIYA Club", href: "#" },
        { text: "HIYA Magazine", href: "#" },
        { text: "Handelsbetingelser", href: "#" },
        { text: "Klarna", href: "#" },
        { text: "Jobs", href: "#" },
      ],
    },
    {
      title: "PRESSE LOUNGE",
      links: [
        { text: "Presse kontakt", href: "#" },
        { text: "Affiliate Programme", href: "#" },
        { text: "Brand Ambassador", href: "#" },
        { text: "Studierabat", href: "#" },
      ],
    },
    {
      title: "B2B",
      links: [
        { text: "Læg din ordre", href: "#" },
        { text: "Billedbank", href: "#" },
      ],
    },
    {
      title: "FØLG OS",
      socialLinks: [
        { iconClass: "fab fa-twitter", href: "#" },
        { iconClass: "fab fa-facebook", href: "#" },
        { iconClass: "fab fa-pinterest", href: "#" },
        { iconClass: "fab fa-instagram", href: "#" },
        { iconClass: "fab fa-tiktok", href: "#" },
      ],
      logoSrc: "/src/images/logo.png",
    },
  ];

  function footerBuilder(footerId, columns) {
    const footer = document.getElementById(footerId);
    const container = document.createElement("div");
    container.className = "max-w-7xl mx-20 px-4 sm:px-6 lg:px-8 py-10 pt-16";

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8";

    columns.forEach(column => {
      const columnDiv = document.createElement("div");

      const title = document.createElement("h3");
      title.className = "text-base greenTxtColor font-bold mb-4";
      title.textContent = column.title;
      columnDiv.appendChild(title);

      if (column.links) {
        const ul = document.createElement("ul");
        ul.className = "text-sm";

        column.links.forEach(link => {
          const li = document.createElement("li");
          li.className = "mb-2";

          const a = document.createElement("a");
          a.href = link.href;
          a.className = "hover:underline";
          a.textContent = link.text;

          li.appendChild(a);
          ul.appendChild(li);
        });

        columnDiv.appendChild(ul);
      }

      if (column.socialLinks) {
        columnDiv.className = "flex flex-col justify-between h-full";
        const topDiv = document.createElement("div");

        const ul = document.createElement("ul");
        ul.className = "flex space-x-4";

        column.socialLinks.forEach(link => {
          const li = document.createElement("li");

          const a = document.createElement("a");
          a.href = link.href;
          a.className = "text-gray-500 hover:text-gray-900";

          const i = document.createElement("i");
          i.className = link.iconClass;

          a.appendChild(i);
          li.appendChild(a);
          ul.appendChild(li);
        });

        topDiv.appendChild(title);
        topDiv.appendChild(ul);
        columnDiv.appendChild(topDiv);

        if (column.logoSrc) {
          const bottomDiv = document.createElement("div");

          const img = document.createElement("img");
          img.src = column.logoSrc;
          img.alt = "";
          img.className = "w-28";

          bottomDiv.appendChild(img);
          columnDiv.appendChild(bottomDiv);
        }
      }

      grid.appendChild(columnDiv);
    });

    container.appendChild(grid);
    footer.appendChild(container);

    const bottomBar = document.createElement("div");
    bottomBar.className = "w-full bottom-0 border-t py-10 border-gray-300 flex items-center justify-center";

    const copyright = document.createElement("p");
    copyright.className = "text-xs";
    copyright.textContent = "© 2024, HIYA";

    bottomBar.appendChild(copyright);
    footer.appendChild(bottomBar);
  }

  footerBuilder("footer", footerContent);
});




