// authRequests.js

const baseUrl = 'http://localhost:8000';
const baseApi = baseUrl + '/api/v1';


function setAuthHeader(headers = {}) {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// --------- LOGIN----------
async function login(endpoint, credentials) {
    const response = await fetch(`${baseApi}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    console.log('Response status:', response.status); 
    console.log('Response:', response);

    if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
    }

    const data = await response.json();
    sessionStorage.setItem('authToken-HIYA', data.access_token); 
    sessionStorage.setItem('customer-HIYA', JSON.stringify(data.customer));
   
    return data;
}

// --------- REGISTER----------
async function register(endpoint, userData) {
    const response = await fetch(`${baseApi}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`Failed to register: ${response.statusText}`);
    }

    const data = await response.json();
    sessionStorage.setItem('authToken-HIYA', data.access_token); 
    sessionStorage.setItem('customer-HIYA', JSON.stringify(data.customer));
   
    console.log(data.token)
    return data;
}

function logout() {
    sessionStorage.removeItem('authToken-HIYA');
    sessionStorage.removeItem('customer-HIYA');
    window.location.reload();
}
export { login, register, logout };
