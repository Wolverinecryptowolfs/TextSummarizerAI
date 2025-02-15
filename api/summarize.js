// /api/summarize.js (Vercel Function)

import { parse } from 'node-html-parser'; // Importiere node-html-parser

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { inputType, inputData } = req.body; // Hole inputType und inputData aus dem Request Body

    if (!inputData) {
        return res.status(400).json({ message: 'Missing input data (text or URL) in request body' }); // Angepasste Fehlermeldung
    }

    let textToSummarize = inputData; // Standardmäßig inputData als Text annehmen

    if (inputType === 'url') {
        try {
            const url = inputData; // URL ist inputData
            const response = await fetch(url); // Webseite abrufen
            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
            }
            const html = await response.text(); // HTML-Inhalt als Text holen

            // **Text aus HTML extrahieren mit node-html-parser**
            const root = parse(html); // HTML parsen
            const articleElements = root.querySelectorAll('article, main, div, section, p, h1, h2, h3, h4, h5, h6, li'); // Wähle relevante HTML-Elemente aus (anpassbar)
            const extractedTextParts = articleElements.map(element => element.text); // Textinhalt aus jedem Element extrahieren
            const extractedText = extractedTextParts.join('\n\n').trim(); // Textteile zusammenfügen, mit Leerzeilen trennen, Leerzeichen trimmen

            textToSummarize = extractedText; // Extrahierter Text ist der Text zum Zusammenfassen

            if (!textToSummarize) {
                return res.status(400).json({ message: 'Could not extract any readable text from the URL.' }); // Fehler, wenn kein Text extrahiert werden konnte
            }


        } catch (error) {
            console.error("Error fetching or parsing URL:", error);
            return res.status(500).json({ message: `Error processing URL: ${error.message || 'Unknown error'}` }); // Fehler bei URL-Verarbeitung zurückgeben
        }
    }
    // else if (inputType === 'text') { // inputData ist bereits der Text - keine Änderung notwendig
    //     textToSummarize = inputData;
    // }


    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Gemini API Key not set in environment variables!");
        return res.status(500).json({ message: 'Internal server error - API key missing' });
    }

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: textToSummarize }] // **textToSummarize verwenden (entweder extrahierter Text oder direkter Text)**
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response from Gemini:", data);

        let summaryText = "Error summarizing text.";
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            summaryText = data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response structure:", data);
            return res.status(500).json({ message: 'Error processing summary from API' });
        }

        return res.status(200).json({ summary: summaryText });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return res.status(500).json({ message: 'Error fetching summary from API' });
    }
}
