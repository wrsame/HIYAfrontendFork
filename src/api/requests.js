// requests.js

const baseUrl = 'http://localhost:8000'

const baseApi = baseUrl + '/api/v1';

// --------- POST----------
async function createData(endpoint, data) {
    const response = await fetch(`${baseApi}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) { 
        throw new Error(`Failed to create data: ${response.statusText}`);
    }

    return response.json();
}

// -----------GET-------------
async function readData(endpoint) {
    const response = await fetch(`${baseApi}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Failed to read data: ${response.statusText}`);
    }

    return response.json();
}

// ----------PUT-------------
async function updateData(endpoint, data) {
    const response = await fetch(`${baseApi}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to update data: ${response.statusText}`);
    }

    return response.json();
}

// ----------DELETE-----------
async function deleteData(endpoint) {
    const response = await fetch(`${baseApi}${endpoint}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Failed to delete data: ${response.statusText}`);
    }

    return response.json();
}


async function fetchData(operation, endpoint, data = null) {
    try {
        switch (operation) {
            case 'read':
                return await readData(endpoint);
            case 'create':
                return await createData(endpoint, data);
            case 'update':
                return await updateData(endpoint, data);
            case 'delete':
                return await deleteData(endpoint);
            default:
                throw new Error('Invalid operation');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

export { baseApi, baseUrl, fetchData, createData, readData, updateData, deleteData };
