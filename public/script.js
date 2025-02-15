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

            // **Erweiterte Textbereinigung und Absatzstrukturierung**

            // 1. Sterne (**) entfernen (wie gehabt)
            summaryText = summaryText.replace(/\*\*/g, '');

            // 2. Einzelne Sterne (*) am Zeilenanfang entfernen
            summaryText = summaryText.replace(/^\*\s+/gm, ''); // Regex: ^\* = Zeilenanfang, \* = Stern, \s+ = ein oder mehr Leerzeichen, g = global, m = multiline

            // 3. Zeilenumbrüche in Absätze umwandeln
            const summaryParagraphs = summaryText.split("\n").filter(paragraph => paragraph.trim() !== "");

            summaryOutput.innerHTML = ''; // Container leeren

            summaryParagraphs.forEach(paragraph => {
                // **Überschriften-Erkennung (einfach)**
                let isHeading = false;
                if (paragraph.trim().endsWith(':')) { // Annahme: Überschrift endet mit ":"
                    isHeading = true;
                }

                const summaryParagraph = document.createElement(isHeading ? 'h3' : 'p'); // h3 für Überschriften, p für Absätze
                summaryParagraph.textContent = paragraph.trim();
                summaryOutput.appendChild(summaryParagraph);

                if (isHeading) { // Optionale CSS-Klasse für Überschriften (für Styling)
                    summaryParagraph.classList.add('summary-heading');
                }
            });


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryOutput.innerHTML = `<p>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</p>`;
        }
    });
});
