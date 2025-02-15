document.addEventListener('DOMContentLoaded', () => {
    const summarizeButton = document.getElementById('summarizeButton');
    const textInput = document.getElementById('textInput');
    const summaryList = document.getElementById('summaryList');

    summarizeButton.addEventListener('click', async () => { // **ASYNC HINZUGEFÜGT**
        const inputText = textInput.value;

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) { /* ... Fehlerbehandlung ... */ }

            const data = await response.json();
            console.log("Summary from API:", data);

            const summaryText = data.summary; // Zusammenfassung aus API-Antwort

            const summaryPoints = summaryText.split("\n").filter(point => point.trim() !== "");

            summaryList.innerHTML = '';
            summaryPoints.forEach(point => {
                const listItem = document.createElement('li');
                listItem.textContent = point;
                summaryList.appendChild(listItem);
            });

        } catch (error) { /* ... Fehlerbehandlung ... */ }
    });
});
