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

})


//--------Latest collections --------
// const collections = [
//     {
//         imgSrc: 'https://i.pinimg.com/564x/14/cc/34/14cc34b0c12a2ebbb2f66a4efc706586.jpg',
//         name: 'Collection 1',
//         link: '#'
//     },
//     {
//         imgSrc: 'https://i.pinimg.com/564x/c0/80/c0/c080c0d9f114bbc816565c219bbf40dd.jpg',
//         name: 'Collection 2',
//         link: '#'
//     },
//     {
//         imgSrc: 'https://i.pinimg.com/564x/96/8c/6c/968c6c2664906f5a1f8aea07509ac9c9.jpg',
//         name: 'Collection 3',
//         link: '#'
//     }
// ];

