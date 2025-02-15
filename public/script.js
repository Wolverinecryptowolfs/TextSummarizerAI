document.addEventListener('DOMContentLoaded', () => {
    const summarizeButton = document.getElementById('summarizeButton');
    const textInput = document.getElementById('textInput');
    const summaryOutput = document.getElementById('summaryOutput');

    summarizeButton.addEventListener('click', async () => {
        const inputText = textInput.value;

        if (!inputText.trim()) {
            alert("Please enter text or a website URL to summarize."); // Angepasste Alert-Nachricht
            return;
        }

        let inputType = 'text'; // Standardmäßig Text annehmen
        if (inputText.startsWith('http://') || inputText.startsWith('https://')) {
            inputType = 'url'; // Wenn mit http:// oder https:// beginnt, ist es ein Link
        }

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputType: inputType, inputData: inputText }) // **inputType und inputData mitschicken**
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Summary from API:", data);

            let summaryText = data.summary;

            summaryText = summaryText.replace(/\*\*/g, '');
            summaryText = summaryText.replace(/^\*\s+/gm, '');

            const summaryParagraphs = summaryText.split("\n").filter(paragraph => paragraph.trim() !== "");

            summaryOutput.innerHTML = '';
            summaryParagraphs.forEach(paragraph => {
                let isHeading = false;
                if (paragraph.trim().endsWith(':')) {
                    isHeading = true;
                }

                const summaryParagraph = document.createElement(isHeading ? 'h3' : 'p');
                summaryParagraph.textContent = paragraph.trim();
                summaryOutput.appendChild(summaryParagraph);

                if (isHeading) {
                    summaryParagraph.classList.add('summary-heading');
                }
            });


        } catch (error) {
            console.error("Error calling summarize function:", error);
            summaryOutput.innerHTML = `<p>Error fetching summary: ${error.message || 'Unknown error. Please try again later.'}</p>`;
        }
    });
});
