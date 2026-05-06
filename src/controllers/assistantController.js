const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// List of suitable text generation models (excluding preview/experimental models)
const MODEL_PRIORITY = {
    gemini: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"],
    openai: ["gpt-4o-mini", "gpt-3.5-turbo"],
    groq: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"]
};

exports.assistantChat = async (req, res) => {
    try {
        const { message, api_key, provider = "gemini", systemPrompt = "" } = req.body;

        if (!message) return res.status(400).json({ detail: "Message is required." });
        if (!api_key) return res.status(400).json({ detail: "API Key is required." });

        let response_text = "";
        const cleanProvider = provider.toLowerCase().trim();

        // GOOGLE GEMINI
        if (cleanProvider === "gemini") {
            try {
                const genAI = new GoogleGenerativeAI(api_key);
                const model = genAI.getGenerativeModel({ model: MODEL_PRIORITY.gemini[0] });
                const result = await model.generateContent(
                    `${systemPrompt}\n\n${message}`
                );
                response_text = result.response.text();
            } catch (err) {
                throw new Error(`Gemini error: ${err.message}`);
            }
        }
        // OPENAI
        else if (cleanProvider === "openai") {
            try {
                const openai = new OpenAI({ apiKey: api_key });
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    model: MODEL_PRIORITY.openai[0],
                    temperature: 0.7
                });
                response_text = completion.choices[0].message.content;
            } catch (err) {
                throw new Error(`OpenAI error: ${err.message}`);
            }
        }
        // GROQ
        else if (cleanProvider === "groq") {
            try {
                const groq = new OpenAI({
                    apiKey: api_key,
                    baseURL: "https://api.groq.com/openai/v1"
                });
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    model: MODEL_PRIORITY.groq[0],
                    temperature: 0.7
                });
                response_text = completion.choices[0].message.content;
            } catch (err) {
                throw new Error(`Groq error: ${err.message}`);
            }
        } else {
            return res.status(400).json({
                detail: `Invalid provider: '${provider}'. Use 'gemini', 'openai', or 'groq'.`
            });
        }

        return res.status(200).json({ response: response_text });

    } catch (error) {
        console.error("❌ Assistant chat error:", error.message);
        return res.status(502).json({
            detail: error.message || "Failed to generate response",
            error: error.message
        });
    }
};

exports.assistantGenerate = async (req, res) => {
    try {
        const { prompt, api_key, provider = "gemini" } = req.body;

        if (!prompt) return res.status(400).json({ detail: "Prompt is required." });
        if (!api_key) return res.status(400).json({ detail: "API Key is required." });

        let response_text = "";
        const cleanProvider = provider.toLowerCase().trim();

        // GOOGLE GEMINI
        if (cleanProvider === "gemini") {
            try {
                const genAI = new GoogleGenerativeAI(api_key);
                const model = genAI.getGenerativeModel({ model: MODEL_PRIORITY.gemini[0] });
                const result = await model.generateContent(prompt);
                response_text = result.response.text();
            } catch (err) {
                throw new Error(`Gemini error: ${err.message}`);
            }
        }
        // OPENAI
        else if (cleanProvider === "openai") {
            try {
                const openai = new OpenAI({ apiKey: api_key });
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: MODEL_PRIORITY.openai[0],
                    temperature: 0.7
                });
                response_text = completion.choices[0].message.content;
            } catch (err) {
                throw new Error(`OpenAI error: ${err.message}`);
            }
        }
        // GROQ
        else if (cleanProvider === "groq") {
            try {
                const groq = new OpenAI({
                    apiKey: api_key,
                    baseURL: "https://api.groq.com/openai/v1"
                });
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: MODEL_PRIORITY.groq[0],
                    temperature: 0.7
                });
                response_text = completion.choices[0].message.content;
            } catch (err) {
                throw new Error(`Groq error: ${err.message}`);
            }
        } else {
            return res.status(400).json({
                detail: `Invalid provider: '${provider}'. Use 'gemini', 'openai', or 'groq'.`
            });
        }

        return res.status(200).json({ content: response_text });

    } catch (error) {
        console.error("❌ Assistant generate error:", error.message);
        return res.status(502).json({
            detail: error.message || "Failed to generate content",
            error: error.message
        });
    }
};
