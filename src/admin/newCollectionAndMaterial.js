import { createCollection, createMaterial } from "../api/data/postData.js";

document.addEventListener('DOMContentLoaded', () => {
    const collectionForm = document.getElementById('collectionForm');
    const materialForm = document.getElementById('MaterialForm');

    collectionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(collectionForm);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            isActive: formData.get('isActive') === 'on'
        };

        try {
            const response = await createCollection(data);
                alert('kollektion blev succesfuldt oprettet!');
                collectionForm.reset();
        } catch (error) {
            alert('Der opstod en fejl ved oprettelse af kollektionen.');
        }
    });

    materialForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(materialForm);
        const data = {
            name: formData.get('name')
        };

        try {
            const response = await createMaterial(data);
            alert('Materialet blev oprettet succesfuldt!');
            materialForm.reset(); 
        } catch (error) {
            console.error('Fejl ved oprettelse af materialet:', error);
            alert('Der opstod en fejl ved oprettelse af materialet.');
        }
    });
});