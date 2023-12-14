function sendSearchQueryToServer(query) {
    $.ajax({
        url: 'http://localhost:5000/search',  // URL of the Flask server
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ query: query }),
        success: function(results) {
            console.log('Search results:', results);
            createSearchResultsPage(results);
        },
        error: function(error) {
            console.error("Error processing search query:", error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');

    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value.trim();
            if (searchQuery) {
                sendSearchQueryToServer(searchQuery);
            }
        }
    });
});



function displaySearchResults(results) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results && results.length > 0) {
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('search-result');
            resultElement.textContent = result; // Assuming result is a string
            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.textContent = 'No results found';
    }
};


async function callPythonFunction(param) {
    try {
        const url = new URL('http://localhost:5000/call_llm_chain');
        url.searchParams.append('param', param);

        const response = await fetch(url.toString());
        const data = await response.json();
        console.log('Response from Python:', data);
    } catch (error) {
        console.error('Error calling Python function:', error);
    }
}
