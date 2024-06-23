
export function setLatestCollections(collections, containerId){
    const container = document.getElementById(containerId);

    collections.forEach(collection => {
        const collectionDiv = document.createElement('div');
        collectionDiv.className = 'w-10/12 my-5 pictureContainer flex items-center justify-center relative h-96';
    
        const img = document.createElement('img');
        img.className = 'object-cover w-full h-full';
        img.src = collection.imgSrc;
        img.alt = collection.name;
    
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'inset-y-80 absolute';
    
        const button = document.createElement('button');
        button.className = 'getTheLookBtn text-base primary-bgColor set-btn-hover w-44';
        button.innerText = collection.name;
        button.onclick = () => window.location.href = collection.link;
    
        buttonDiv.appendChild(button);
        collectionDiv.appendChild(img);
        collectionDiv.appendChild(buttonDiv);
    
        container.appendChild(collectionDiv);
    });
}


