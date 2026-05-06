const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const { cleanJSON } = require("../utils/jsonCleaner");

/**
 * Ordered list of Gemini models to try, from newest/fastest to oldest fallback.
 * We attempt each one until generation succeeds.
 */
const GEMINI_MODEL_PRIORITY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-pro",
];

/**
 * Fetches the list of models available for the given API key,
 * sorted according to our priority list. Falls back to the
 * hardcoded list if the scan fails.
 */
async function getAvailableGeminiModels(apiKey) {
    console.log("\n🔍 Scanning for available Gemini models...");
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            const body = await response.text();
            console.warn(`⚠️ Model scan failed (HTTP ${response.status}): ${body}`);
            return GEMINI_MODEL_PRIORITY;
        }

        const data = await response.json();
        const available = (data.models || [])
            .filter(
                m =>
                    m.supportedGenerationMethods &&
                    m.supportedGenerationMethods.includes("generateContent") &&
                    !m.name.toLowerCase().includes("vision") &&
                    !m.name.toLowerCase().includes("embedding") &&
                    !m.name.toLowerCase().includes("deep-research") &&
                    !m.name.toLowerCase().includes("search") &&
                    !m.name.toLowerCase().includes("computer-use") &&
                    !m.name.toLowerCase().includes("thinking") &&
                    !m.name.toLowerCase().includes("preview")
            )
            .map(m => m.name.replace("models/", ""));

        console.log(`✅ Found ${available.length} generation-capable model(s)`);

        // Re-order: priority list first, then any extras from the API
        const ordered = [];
        for (const preferred of GEMINI_MODEL_PRIORITY) {
            const match = available.find(m => m === preferred || m.startsWith(preferred));
            if (match && !ordered.includes(match)) ordered.push(match);
        }
        for (const m of available) {
            if (!ordered.includes(m)) ordered.push(m);
        }

        return ordered.length > 0 ? ordered : GEMINI_MODEL_PRIORITY;
    } catch (err) {
        console.error("❌ Model scan threw an error:", err.message);
        return GEMINI_MODEL_PRIORITY;
    }
}

exports.generateMCQ = async (req, res) => {
    try {
        const {
            content,
            api_key,
            difficulty = "Medium",
            provider = "gemini",
            max_questions,
            maxQuestions: maxQuestionsCamel,
        } = req.body;

        console.log(`\n🚀 MCQ Request Received`);
        console.log(`   Provider : ${provider}`);
        console.log(`   Key Prefix: ${api_key ? api_key.substring(0, 7) + "..." : "MISSING"}`);

        // ── Question Count ──────────────────────────────────────────────────────
        const DEFAULT_MAX_QUESTIONS = 50;
        const MAX_ALLOWED_QUESTIONS = 200;

        let maxQuestions = DEFAULT_MAX_QUESTIONS;
        const requested =
            typeof max_questions !== "undefined" ? max_questions : maxQuestionsCamel;
        if (typeof requested !== "undefined") {
            const parsed = parseInt(requested, 10);
            if (isNaN(parsed) || parsed <= 0) {
                return res
                    .status(400)
                    .json({ detail: "max_questions must be a positive integer." });
            }
            maxQuestions = Math.min(parsed, MAX_ALLOWED_QUESTIONS);
        }

        console.log(`   Max Questions: ${maxQuestions}`);

        // ── Validation ──────────────────────────────────────────────────────────
        if (!content) return res.status(400).json({ detail: "Content cannot be empty." });
        if (!api_key) return res.status(400).json({ detail: "API Key is required." });

        // ── Prompt ──────────────────────────────────────────────────────────────
        const systemPrompt = `You are an expert academic examiner.

TASK:
Generate up to ${maxQuestions} high-quality multiple-choice questions based on the content provided.
If the material does not support the full requested number, produce as many distinct, non-repetitive, and academically-valid questions as possible (do not hallucinate unrelated facts just to meet the count).

DIFFICULTY: ${difficulty}
Produce questions at the requested difficulty level (Easy | Medium | Hard).

QUALITY REQUIREMENTS:
- Vary cognitive levels (recall → application → analysis → scenario-based).
- Avoid duplicates and near-duplicates.
- Keep each question self-contained and unambiguous.

OUTPUT FORMAT:
Return ONLY valid JSON — no markdown fences, no preamble, no trailing text.

JSON STRUCTURE (array of question objects):
[
    {
        "difficulty": "easy" | "medium" | "hard",
        "question": "Question text here?",
        "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
        "answer": "A",
        "explanation": "Brief explanation of the correct answer."
    }
]
`;

        let rawText = "";
        const cleanProvider = provider.toLowerCase().trim();

        // ── GOOGLE GEMINI ───────────────────────────────────────────────────────
        if (cleanProvider === "gemini") {
            const modelCandidates = await getAvailableGeminiModels(api_key);
            const genAI = new GoogleGenerativeAI(api_key);
            let lastError = null;

            for (const modelName of modelCandidates) {
                console.log(`🤖 Trying model: ${modelName}`);
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(
                        `${systemPrompt}\n\nCONTENT:\n${content}`
                    );
                    rawText = result.response.text();
                    console.log(`✅ Success with model: ${modelName}`);
                    break; // got a response — stop trying
                } catch (modelErr) {
                    lastError = modelErr;
                    const reason = modelErr.message || String(modelErr);
                    console.warn(`⚠️  Model "${modelName}" failed: ${reason}`);

                    // Auth errors are terminal — no point trying other models
                    if (
                        reason.includes("API_KEY_INVALID") ||
                        reason.includes("PERMISSION_DENIED") ||
                        reason.includes("401")
                    ) {
                        return res.status(401).json({
                            detail:
                                "Invalid Gemini API key. Please check your key and try again.",
                            error: reason,
                        });
                    }
                    // Otherwise continue to the next model
                }
            }

            if (!rawText) {
                const errMsg = lastError
                    ? lastError.message || String(lastError)
                    : "All Gemini model attempts exhausted.";
                console.error("❌ All Gemini models failed:", errMsg);
                return res.status(502).json({
                    detail: `Gemini could not generate a response after trying ${modelCandidates.length} model(s). ${errMsg}`,
                    error: errMsg,
                });
            }
        }

        // ── OPENAI ──────────────────────────────────────────────────────────────
        else if (cleanProvider === "openai") {
            try {
                const openai = new OpenAI({ apiKey: api_key });
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: content },
                    ],
                    model: "gpt-4o-mini",
                    temperature: 0.5,
                });
                rawText = completion.choices[0].message.content;
            } catch (openaiErr) {
                const reason = openaiErr.message || String(openaiErr);
                console.error("❌ OpenAI error:", reason);
                return res
                    .status(502)
                    .json({ detail: `OpenAI error: ${reason}`, error: reason });
            }
        }

        // ── GROQ ────────────────────────────────────────────────────────────────
        else if (cleanProvider === "groq") {
            try {
                const groq = new OpenAI({
                    apiKey: api_key,
                    baseURL: "https://api.groq.com/openai/v1",
                });
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: content },
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.5,
                });
                rawText = completion.choices[0].message.content;
            } catch (groqErr) {
                const reason = groqErr.message || String(groqErr);
                console.error("❌ Groq error:", reason);
                return res
                    .status(502)
                    .json({ detail: `Groq error: ${reason}`, error: reason });
            }
        } else {
            return res.status(400).json({
                detail: `Invalid provider: '${provider}'. Use 'gemini', 'openai', or 'groq'.`,
            });
        }

        // ── Parse & Respond ─────────────────────────────────────────────────────
        const jsonString = cleanJSON(rawText);
        const mcqData = JSON.parse(jsonString);
        return res.status(200).json(mcqData);

    } catch (error) {
        console.error("❌ Unexpected error:", error.message || error);
        return res.status(500).json({
            detail: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
};

/**
 * Unified endpoint to generate both MCQ and subjective questions
 */
exports.generateQuestions = async (req, res) => {
    try {
        const {
            content,
            apiKey,
            api_key,
            difficulty = "Medium",
            provider = "gemini",
            numQuestions = 5,
            questionType = "mcq", // "mcq" or "subjective"
            max_questions,
            maxQuestions: maxQuestionsCamel,
        } = req.body;

        const finalApiKey = apiKey || api_key;
        const finalProvider = provider.toLowerCase().trim();
        const finalDifficulty = difficulty || "Medium";

        // If it's MCQ type, delegate to generateMCQ logic
        if (questionType.toLowerCase() === "mcq") {
            return exports.generateMCQ(req, res);
        }

        // ── SUBJECTIVE QUESTIONS ─────────────────────────────────────────────
        if (questionType.toLowerCase() !== "subjective") {
            return res.status(400).json({
                detail: `Invalid questionType: '${questionType}'. Use 'mcq' or 'subjective'.`,
            });
        }

        console.log(`\n🚀 Subjective Questions Request Received`);
        console.log(`   Provider: ${finalProvider}`);
        console.log(`   Key Prefix: ${finalApiKey ? finalApiKey.substring(0, 7) + "..." : "MISSING"}`);
        console.log(`   Question Count: ${numQuestions}`);

        if (!content) {
            return res.status(400).json({ detail: "Content cannot be empty." });
        }
        if (!finalApiKey) {
            return res.status(400).json({ detail: "API Key is required." });
        }

        const systemPrompt = `You are an expert exam question paper generator for Computer Networks.

TASK:
Generate exactly ${numQuestions} high-quality subjective exam questions based on the provided content.
Questions must be in EXAM FORMAT - clear, concise, and oriented toward student assessment.

DIFFICULTY: ${finalDifficulty}
Produce questions at the requested difficulty level:
- Easy: Definition, basic comprehension
- Medium: Explanation, concepts with examples
- Hard: Application, critical thinking, analysis

QUESTION MIX REQUIREMENTS:
- Include a variety of question types:
  1. Definition questions (what is X?)
  2. Explanation questions (explain/describe how X works)
  3. Application-based questions (with examples or scenarios)
- Avoid duplicates and near-duplicates
- Keep questions clear, unambiguous, and exam-oriented
- Allocate marks (1-10) based on question complexity and expected answer length

IMPORTANT RULES:
- Include comprehensive model answers for each question
- DO NOT include diagrams
- Each question MUST have marks in square brackets
- Use natural, academic language suitable for exams

OUTPUT FORMAT:
Return ONLY valid JSON — no markdown fences, no preamble, no trailing text.

JSON STRUCTURE (array of question objects):
[
    {
        "difficulty": "easy" | "medium" | "hard",
        "question": "Define multiplexing.[1 marks]",
        "marks": 1,
        "answer": "Multiplexing is a technique that allows multiple signals or data streams to share a single communication channel or medium, enabling efficient utilization of bandwidth and reducing transmission costs."
    },
    {
        "difficulty": "medium",
        "question": "Explain the three main types of multiplexing (TDM, FDM, WDM) with real-life analogies and one application each.[4 marks]",
        "marks": 4,
        "answer": "1. TDM (Time Division Multiplexing): Different signals take turns using the same channel. Analogy: A single telephone line shared by multiple users in different time slots. Application: GSM mobile networks. 2. FDM (Frequency Division Multiplexing): Different signals use different frequency bands simultaneously. Analogy: Different radio stations broadcasting on different frequencies. Application: AM/FM radio broadcasting. 3. WDM (Wavelength Division Multiplexing): Different light wavelengths travel simultaneously in the same fiber. Analogy: Different colored lights mixed and separated by a prism. Application: Long-distance fiber optic communications."
    }
]

Note: The question text already includes marks in square brackets for display.`;

        let rawText = "";

        // ── GOOGLE GEMINI ───────────────────────────────────────────────────────
        if (finalProvider === "gemini") {
            const modelCandidates = await getAvailableGeminiModels(finalApiKey);
            const genAI = new GoogleGenerativeAI(finalApiKey);
            let lastError = null;

            for (const modelName of modelCandidates) {
                console.log(`🤖 Trying model: ${modelName}`);
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(
                        `${systemPrompt}\n\nCONTENT:\n${content}`
                    );
                    rawText = result.response.text();
                    console.log(`✅ Success with model: ${modelName}`);
                    break;
                } catch (modelErr) {
                    lastError = modelErr;
                    const reason = modelErr.message || String(modelErr);
                    console.warn(`⚠️  Model "${modelName}" failed: ${reason}`);

                    if (
                        reason.includes("API_KEY_INVALID") ||
                        reason.includes("PERMISSION_DENIED") ||
                        reason.includes("401")
                     ) {
                        return res.status(401).json({
                            detail: "Invalid Gemini API key. Please check your key and try again.",
                            error: reason,
                        });
                    }
                }
            }
 
            if (!rawText) {
                const errMsg = lastError
                    ? lastError.message || String(lastError)
                    : "All Gemini model attempts exhausted.";
                console.error("❌ All Gemini models failed:", errMsg);
                return res.status(502).json({
                    detail: `Gemini could not generate a response after trying ${modelCandidates.length} model(s). ${errMsg}`,
                    error: errMsg,
                });
            }
        }

        // ── OPENAI ──────────────────────────────────────────────────────────────
        else if (finalProvider === "openai") {
            try {
                const openai = new OpenAI({ apiKey: finalApiKey });
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: content },
                    ],
                    model: "gpt-4o-mini",
                    temperature: 0.6,
                });
                rawText = completion.choices[0].message.content;
            } catch (openaiErr) {
                const reason = openaiErr.message || String(openaiErr);
                console.error("❌ OpenAI error:", reason);
                return res.status(502).json({
                    detail: `OpenAI error: ${reason}`,
                    error: reason,
                });
            }
        }

        // ── GROQ ────────────────────────────────────────────────────────────────
        else if (finalProvider === "groq") {
            try {
                const groq = new OpenAI({
                    apiKey: finalApiKey,
                    baseURL: "https://api.groq.com/openai/v1",
                });
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: content },
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                });
                rawText = completion.choices[0].message.content;
            } catch (groqErr) {
                const reason = groqErr.message || String(groqErr);
                console.error("❌ Groq error:", reason);
                return res.status(502).json({
                    detail: `Groq error: ${reason}`,
                    error: reason,
                });
            }
        } else {
            return res.status(400).json({
                detail: `Invalid provider: '${finalProvider}'. Use 'gemini', 'openai', or 'groq'.`,
            });
        }

        // ── Parse & Respond ─────────────────────────────────────────────────────
        const jsonString = cleanJSON(rawText);
        const subjectiveData = JSON.parse(jsonString);
        return res.status(200).json(subjectiveData);

    } catch (error) {
        console.error("❌ Unexpected error:", error.message || error);
        return res.status(500).json({
            detail: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
};