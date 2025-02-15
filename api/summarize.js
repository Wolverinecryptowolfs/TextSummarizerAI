// /api/summarize.js (Vercel Function)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' }); // Nur POST-Anfragen erlauben
    }

    const inputText = req.body.text; // Text aus der Anfrage holen

    if (!inputText) {
        return res.status(400).json({ message: 'Missing text in request body' }); // Fehler, wenn kein Text
    }

    const apiKey = process.env.GEMINI_API_KEY; // **API Key aus Umgebungsvariablen holen!**

    if (!apiKey) {
        console.error("Gemini API Key not set in environment variables!"); // Loggen, falls Key fehlt
        return res.status(500).json({ message: 'Internal server error - API key missing' }); // Fehler, falls Key fehlt
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
                    parts: [{ text: inputText }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response from Gemini:", data); // Loggen der API Antwort (optional)

        let summaryText = "Error summarizing text.";
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            summaryText = data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response structure:", data); // Loggen, falls Struktur unerwartet
            return res.status(500).json({ message: 'Error processing summary from API' }); // Fehler zurückgeben
        }

        return res.status(200).json({ summary: summaryText }); // Zusammenfassung als JSON zurücksenden
    } catch (error) {
        console.error("Error calling Gemini API:", error); // Fehler loggen
        return res.status(500).json({ message: 'Error fetching summary from API' }); // Fehler zurückgeben
    }
}
