document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        loginBtn: document.getElementById('login'),
        logoutBtn: document.getElementById('logout'),
        profileContainer: document.getElementById('profile-container'),
        accountButton: document.getElementById('accountButton'),
        accountDropdown: document.getElementById('accountDropdown'),
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button'),
        servicesSection: document.getElementById('servicesSection'),
        preferencesSection: document.getElementById('preferencesSection'),
        contactSection: document.getElementById('contactSection')
    };

    // ... [Rest of the Auth0 and other initializations]

    elements.accountButton.addEventListener('click', toggleDropdown);
    elements.loginBtn.addEventListener('click', () => auth0Client.loginWithRedirect());
    elements.logoutBtn.addEventListener('click', () => auth0Client.logout());
    elements.searchButton.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Removed redundant dropdown event listener code

    // Helper functions
    async function updateUIAfterAuth(isAuthenticated) {
        if (isAuthenticated) {
            const user = await auth0Client.getUser();
            elements.profileContainer.innerHTML = JSON.stringify(user);
            elements.loginBtn.style.display = 'none';
            elements.logoutBtn.style.display = 'block';
            updateDropdown(true);
        }
    }

    function handleSearch() {
        const query = elements.searchInput.value;
        sendSearchQueryToPython(query);
    }

    function toggleDropdown() {
        elements.accountDropdown.style.display = elements.accountDropdown.style.display === 'none' ? 'block' : 'none';
    }


});

function sendSearchQueryToPython(query) {
    const websocket = new WebSocket('ws://your-python-server-address');

    websocket.onopen = function(event) {
        websocket.send(JSON.stringify({ query: query }));
    };

    websocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        displaySearchResults(data.summary);
    };

    websocket.onerror = function(event) {
        console.error('WebSocket error:', event);
    };
}



function displaySearchResults(summary) {
    const resultsContainer = document.getElementById('search-results-container');
    resultsContainer.textContent = summary; // Update as needed for formatting
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNvZHJNr5qZXPuineOw9OshMmbL86Vkro",
  authDomain: "stratman-ai.firebaseapp.com",
  projectId: "stratman-ai",
  storageBucket: "stratman-ai.appspot.com",
  messagingSenderId: "712686130902",
  appId: "1:712686130902:web:2b87860babbcca13171b77",
  measurementId: "G-2BYT9P7ZYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);