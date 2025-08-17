import fs from "fs";
import fetch from "node-fetch";

const apiUrl = "https://skills.syvixor.com/api/icons/all";
const dataFile = "public/data.json";
const mistralUrl = "https://api.mistral.ai/v1/chat/completions";
const mistralKey = process.env.MISTRAL_API_KEY;

function sanitizeDescription(raw) {
    if (!raw) return "";

    let s = String(raw).trim();
    s = s.replace(/\s+/g, " ");
    s = s.replace(/^[-•\u2022]\s*/, "");

    const leftQuote = /^[`"'“‘]/;
    const rightQuote = /[`"'”’]$/;
    if (leftQuote.test(s) && rightQuote.test(s)) {
        s = s.replace(leftQuote, "").replace(rightQuote, "").trim();
    }

    s = s.replace(/\s+([.,;:!?])/g, "$1");

    if (!/[.!?]$/.test(s)) s += ".";

    return s;
}

async function generateDescription(name, id) {
    if (!mistralKey) {
        console.warn("⚠️ No MISTRAL_API_KEY found, using fallback description.");
        return `A technology or tool named ${name}.`;
    }

    try {
        const res = await fetch(mistralUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${mistralKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                temperature: 0.4,
                max_tokens: 80,
                messages: [
                    {
                        role: "user",
                        content:
                            `Write ONE short, neutral sentence describing the technology/library/tool named "${name}" (id: ${id}). ` +
                            `Return PLAIN TEXT only—no quotes, no markdown, no code blocks.`,
                    }
                ]
            })
        });

        if (!res.ok) {
            console.error("Mistral API error:", res.status, await res.text());
            return `A technology or tool named ${name}.`;
        }

        const json = await res.json();
        const raw = json?.choices?.[0]?.message?.content ?? "";
        const clean = sanitizeDescription(raw);
        return clean || `A technology or tool named ${name}.`;
    } catch (err) {
        console.error("Error calling Mistral:", err);
        return `A technology or tool named ${name}.`;
    }
}

async function run() {
    console.log("📥 Fetching API...");

    const icons = await (await fetch(apiUrl)).json();
    const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : {};

    const updatedData = {};

    let dataAdded = 0;

    for (const icon of icons) {
        if (!data[icon.id]) {
            console.log(`✨ New Icon: (${icon.name}) → Generating description...`);
            data[icon.id] = await generateDescription(icon.name, icon.id);
            dataAdded++;
        } else {
            const cleanedVal = sanitizeDescription(data[icon.id]);
            if (cleanedVal !== data[icon.id])
                data[icon.id] = cleanedVal;
        }

        updatedData[icon.id] = data[icon.id];
    }

    fs.writeFileSync(dataFile, JSON.stringify(updatedData, null, 2));
    console.log(`✅ List Updated (added: ${dataAdded})`);
}

run();