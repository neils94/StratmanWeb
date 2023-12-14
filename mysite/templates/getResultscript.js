document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page from refreshing
    let searchInput = document.getElementById('search-input').value;
    fetch(`https://api.example.com/search?q=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            // Display your search results here
            document.getElementById('results').innerHTML = JSON.stringify(data);
        })
        .catch(error => console.error('Error:', error));
});
