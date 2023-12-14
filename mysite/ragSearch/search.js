document.getElementById('search-button').addEventListener('click', sendSearchQuery);

async function sendSearchQuery() {
    const query = document.getElementById('search-input').value;
    const payload = extractQueryData(query);

    try {
        const response = await fetch('/process-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Server response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function extractQueryData(query) {
    const hotkeys = ['SA', 'ER', 'UE', 'N', 'IS'];
    const foundHotkeys = hotkeys.filter(hk => query.includes(hk));
    const tickerMatch = query.match(/\$[A-Za-z]+/);
    const ticker = tickerMatch ? tickerMatch[0].substring(1) : '';

    return { ticker, hotkeys: foundHotkeys };
}
