document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page from refreshing
    let query = document.getElementById('search-input').value;
    fetch(`https://api.ydc-index.io/rag?query=${query}`)
        .then(response => response.json())
        .then(data => {
            // Display your search results here
            document.getElementById('results').innerHTML = JSON.stringify(data);
        })
        .catch(error => console.error('Error:', error));
});
