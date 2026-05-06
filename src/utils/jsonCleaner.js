/**
 * Cleans Markdown formatting (```json ... ```) from LLM responses
 * and reliably extracts the full JSON array/object using bracket counting.
 * Also fixes common JSON issues like unescaped newlines inside string values.
 * @param {string} text - The raw response from the AI
 * @returns {string} - Cleaned JSON string
 */
const cleanJSON = (text) => {
    // Step 1: Strip markdown code fences (```json ... ```)
    let cleaned = text
        .replace(/^```json\s*/gm, '')
        .replace(/^```\s*/gm, '')
        .replace(/\s*```$/gm, '')
        .trim();

    // Step 2: Use bracket-counting to find the FULL JSON array or object.
    // This is far more reliable than a greedy regex when the content is long
    // or contains brackets/special characters inside question strings.
    const startArray = cleaned.indexOf('[');
    const startObject = cleaned.indexOf('{');

    // Determine whether we're looking for an array or object
    let startChar, endChar, startIdx;
    if (startArray === -1 && startObject === -1) {
        // No JSON structure found — return as-is and let JSON.parse throw
        return cleaned;
    } else if (startArray === -1) {
        startChar = '{'; endChar = '}'; startIdx = startObject;
    } else if (startObject === -1) {
        startChar = '['; endChar = ']'; startIdx = startArray;
    } else {
        // Pick whichever comes first
        if (startArray < startObject) {
            startChar = '['; endChar = ']'; startIdx = startArray;
        } else {
            startChar = '{'; endChar = '}'; startIdx = startObject;
        }
    }

    // Walk through the string counting open/close brackets, respecting strings
    // Also fix unescaped newlines inside string values
    let depth = 0;
    let inString = false;
    let escape = false;
    let jsonString = '';

    for (let i = startIdx; i < cleaned.length; i++) {
        const ch = cleaned[i];

        if (escape) { 
            jsonString += ch;
            escape = false; 
            continue; 
        }
        if (ch === '\\' && inString) { 
            jsonString += ch;
            escape = true; 
            continue; 
        }
        if (ch === '"') { 
            jsonString += ch;
            inString = !inString; 
            continue; 
        }
        
        // If we're inside a string and encounter a literal newline or carriage return,
        // escape it properly for JSON
        if (inString) {
            if (ch === '\n') {
                jsonString += '\\n';
                continue;
            } else if (ch === '\r') {
                jsonString += '\\r';
                continue;
            } else if (ch === '\t') {
                jsonString += '\\t';
                continue;
            }
        }
        
        jsonString += ch;

        if (!inString) {
            if (ch === startChar) depth++;
            else if (ch === endChar) {
                depth--;
                if (depth === 0) {
                    // Found the matching closing bracket — return the full result
                    return jsonString;
                }
            }
        }
    }

    // Fallback: return what we have (may be malformed JSON)
    return jsonString;
};

module.exports = { cleanJSON };