document.addEventListener('DOMContentLoaded', () => {
    const summarizeButton = document.getElementById('summarizeButton');
    const textInput = document.getElementById('textInput');
    const summaryOutput = document.getElementById('summaryOutput'); // Direkt auf den Container zugreifen

    summarizeButton.addEventListener('click', async () => {
        const inputText = textInput.value;

        if (!inputText.trim()) {
            alert("Please enter text to summarize.");
            return;
        }

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Summary from API:", data);

            let summaryText = data.summary;

            // **Absatz-Ausgabe statt Bullet Points**
            summaryOutput.innerHTML = ''; // Container leeren
            const summaryParagraph = document.createElement('p'); // <p>-Tag erstellen
            summaryParagraph.textContent = summaryText; // Zusammenfassungstext einfügen
            summaryOutput.appendChild(summaryParagraph); // Absatz zum Container hinzufügen


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryOutput.innerHTML = `<p>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</p>`; // Fehler als Absatz ausgeben
        }
    });
});
