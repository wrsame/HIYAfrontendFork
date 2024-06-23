import { productSlider } from "./productSlider.js"; 
import { getLimitedProducts, getLatestCollections } from "../api/data/getData.js";
import { setLatestCollections } from "./lastestCollections.js";


//------produkt slider----

document.addEventListener("DOMContentLoaded", async function () {
    
    const products = await getLimitedProducts(8)
    productSlider(products, 'productSlider');  //productSlider is sectionId

    const latestCollections = await getLatestCollections(3)

    const collections = latestCollections.map(collection => ({
        name: collection.name,
        link: `/src/html/collections/main.html#${collection.name}`
    }));

    // Manuelt tilføje imgSrc til collections
    collections[0].imgSrc = "https://i.pinimg.com/564x/14/cc/34/14cc34b0c12a2ebbb2f66a4efc706586.jpg";
    collections[1].imgSrc = "https://i.pinimg.com/564x/c0/80/c0/c080c0d9f114bbc816565c219bbf40dd.jpg";
    collections[2].imgSrc = "https://i.pinimg.com/564x/96/8c/6c/968c6c2664906f5a1f8aea07509ac9c9.jpg";

    setLatestCollections(collections, 'collections-container')
    initializeContactForm() 

})

//-------Kontakt form-----

function initializeContactForm() {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        // Change form content
        contactForm.innerHTML = getContactFormContent();

        const sendButton = document.getElementById("send-button");

        sendButton.addEventListener("click", function () {
            const name = document.getElementById("name").value;
            const message = document.getElementById("message").value;
            if (!name || !message) {
                alert("Please fill out all fields.");
                return;
            }

            // Send email using EmailJS
            sendEmail(name, email, message);

            // Show thank you message
            contactForm.innerHTML = getThankYouMessage();
        });
    });
}

function getContactFormContent() {
    return `
        <div class="flex flex-col gap-5 items-center justify-center relative z-50">
            <input class="font-sans bg-transparent rounded-md border-white border-2 p-2 px-4 w-96 outline-none"
                   type="text" id="name" placeholder="Dit navn" required>
            <textarea class="font-sans bg-transparent rounded-md border-white border-2 p-2 px-4 w-96 outline-none"
                      id="message" placeholder="Din besked" required></textarea>
            <div class="mt-5">
                <button id="send-button" class="font-bold shopBtn primary-light-col text-sm">Send</button>
            </div>
        </div>
    `;
}

function getThankYouMessage() {
    return `
        <div class="flex flex-col gap-5 items-center justify-center relative z-50">
            <h2 class="text-2xl text-center">Tak for at kontakte os, vi vender tilbage</h2>
        </div>
    `;
}

function sendEmail(name, email, message) {
    emailjs.send("service_epo8fwa","template_b89iy2o", {
        from_name: name,
        from_email: email,
        message: message
    })
    .then((response) => {
       console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
       console.error('FAILED...', error);
    });
}


