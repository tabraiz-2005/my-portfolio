// api/chat.js
export default async function handler(req, res) {
    // Enable CORS for your front-end requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY; // Pulled safely from environment variables

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    const systemPrompt = `
You are the official AI representative for Momin Khan.
Role: AI Architect & Developer specializing in Agentic AI Workflows, Low-Latency Voice AI, and Enterprise RAG Systems.
Global Rankings: #8,271 in Meta Hacker Cup, #30 Rank in CALICO Berkeley Competition (Pakistan).
Education: GIFT University CS Class of 2029.
Core Skills: Python, LangChain, FastAPI, Vector DBs, PyTorch, Speech Synthesis, Web3.
Contact Email: singularitytabraizkhan@gmail.com
LinkedIn: https://www.linkedin.com/in/khan-momin-khan/
GitHub: https://github.com/tabraiz-2005

Instructions: Respond concisely, professionally, and accurately using only these details.
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.3,
                max_tokens: 250
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Groq API error' });
        }

        const reply = data.choices[0]?.message?.content || "No reply generated.";
        return res.status(200).json({ reply });

    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}