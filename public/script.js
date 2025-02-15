document.addEventListener('DOMContentLoaded', () => {
    const summarizeButton = document.getElementById('summarizeButton');
    const textInput = document.getElementById('textInput');
    const summaryOutput = document.getElementById('summaryOutput');

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

            // **Textbereinigung und Absatzstrukturierung**

            // 1. Sterne (**) entfernen
            summaryText = summaryText.replace(/\*\*/g, ''); // "**" global ersetzen durch nichts

            // 2. Zeilenumbrüche in Absätze umwandeln (falls nicht schon Absätze vom API kommen)
            const summaryParagraphs = summaryText.split("\n").filter(paragraph => paragraph.trim() !== "");

            summaryOutput.innerHTML = ''; // Container leeren

            summaryParagraphs.forEach(paragraph => {
                const summaryParagraph = document.createElement('p');
                summaryParagraph.textContent = paragraph.trim(); // Leerzeichen am Anfang/Ende entfernen
                summaryOutput.appendChild(summaryParagraph);
            });


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryOutput.innerHTML = `<p>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</p>`;
        }
    });
});
