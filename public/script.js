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
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Summary from API:", data);

            let summaryText = "Error summarizing text.";
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                summaryText = data.candidates[0].content.parts[0].text;
            } else {
                console.error("Unexpected API response structure:", data);
                summaryList.innerHTML = '<li>Error processing summary.</li>';
            }

            // **Verbesserte Zusammenfassungsdarstellung (Neu!):**
            const summaryPoints = summaryText.split("\n").filter(point => point.trim() !== "");

            summaryList.innerHTML = ''; // Liste leeren
            summaryPoints.forEach(point => {
                // **Entferne doppelte Sterne (falls vorhanden) und trimme Leerzeichen (Neu!):**
                const cleanPoint = point.replace(/^\*\*\s*/, '').trim(); // Entfernt "** " am Anfang und Leerzeichen

                if (cleanPoint) { // Nur nicht-leere Punkte hinzufügen
                    const listItem = document.createElement('li');
                    listItem.textContent = cleanPoint;
                    summaryList.appendChild(listItem);
                }
            });


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryList.innerHTML = `<li>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</li>`;
        }
    });
});
