$(document).ready(function() {
    $('#searchForm').on('submit', function(e) {
        e.preventDefault();
        var queryText = $('#search-input').val();

        // Replace with your Parse server URL and necessary headers
        var parseServerUrl = 'https://your-parse-server-url/parse/functions/yourFunctionName';

        $.ajax({
            url: parseServerUrl,
            headers: {
                'X-Parse-Application-Id': 'yourAppId', // Replace with your App ID
                'X-Parse-REST-API-Key': 'yourRestApiKey', // Replace with your REST API Key
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: JSON.stringify({ query: queryText }),
            success: function(response) {
                // Assuming response data contains the results
                $('#searchResults').html(JSON.stringify(response, null, 2));
            },
            error: function(error) {
                console.error('Error:', error);
                $('#searchResults').html('An error occurred while fetching results');
            }
        });
    });
});


window.onload = function() {
    const queryParams = new URLSearchParams(window.location.search);
    const uniqueID = queryParams.get('id');
    fetchChatHistory(uniqueID);
};

function fetchChatHistory(uuid) {
    fetch(`${uuid}`)
        .then(response => response.json())
        .then(history => {
            const chatDisplay = document.getElementById('chatDisplay');
            chatDisplay.innerHTML = history.join('<br>'); // Simple display
        });
}
function createTab(uuid) {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = `Chat: ${uuid}`;
    tab.onclick = () => fetchChatHistory(uuid);
    return tab;
}

function loadAvailableHistories() {
    fetch('/api/histories')
        .then(response => response.json())
        .then(histories => {
            const historyTabs = document.getElementById('historyTabs');
            histories.forEach(uuid => {
                const tab = createTab(uuid);
                historyTabs.appendChild(tab);
            });
        });
}