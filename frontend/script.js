document.addEventListener('DOMContentLoaded', () => {
    const summarizeButton = document.getElementById('summarizeButton');
    const textInput = document.getElementById('textInput');
    const summaryList = document.getElementById('summaryList');

    summarizeButton.addEventListener('click', async () => {
        const inputText = textInput.value;

        if (!inputText.trim()) {
            alert("Please enter text to summarize.");
            return;
        }

        try {
            const response = await fetch('/api/summarize', { // **Aufruf der Vercel Function unter `/api/summarize`**
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: inputText }) // Text im Request Body senden
            });

            if (!response.ok) {
                const errorData = await response.json(); // Versuche Fehlerdetails aus JSON zu lesen
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`; // Fallback-Fehlermeldung
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Summary from API:", data); // Loggen der Antwort von der Function

            const summaryText = data.summary; // Zusammenfassung aus der Antwort holen

            const summaryPoints = summaryText.split("\n").filter(point => point.trim() !== "");

            summaryList.innerHTML = '';
            summaryPoints.forEach(point => {
                const listItem = document.createElement('li');
                listItem.textContent = point;
                summaryList.appendChild(listItem);
            });


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryList.innerHTML = `<li>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</li>`; // Fehler mit detaillierter Meldung anzeigen
        }
    });
});
