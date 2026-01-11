import { NextResponse } from "next/server";

// Mock raw source text - updated with India-focused 2026 data
const RAW_SOURCE_TEXT = `
1. Smart India Hackathon 2026: Nationwide. Focus on Government problems. Apply: https://sih.gov.in/
2. Hack With Mumbai 2.0: Jan 6, 2026. Navi Mumbai. Prizes: 50,000. Apply: https://unstop.com/
3. Innovators Hackathon 2026: Jan 22-23, 2026. Talegaon Dabhade, Pune. AI, ML, Robotics. Apply: https://t-hub.co/
4. Sustainability Hackathon 2026: Jan 4, 2026. Online (India). Smart Farms theme. Prizes: 1,50,000. Apply: https://unstop.com/
5. Code-A-Thon: Jan 4, 2026. Mumbai. Build.Compete.Showcase. Prizes: 50,000. Apply: https://unstop.com/
6. Loop 1.0: Jan 4, 2026. Navi Mumbai. 24 Hrs National Level. Prizes: 1,00,000. Apply: https://unstop.com/
7. Code for Climate Change: Jan 7, 2026. Online (IIT Palakkad). 72 hr Hackathon. Prizes: 40,000. Apply: https://unstop.com/
8. HackFusion 2026: Jan 7, 2026. Online (SPIT Mumbai). Prizes: 1,20,000. Apply: https://unstop.com/
9. AI for All Challenge: Jan 5-23, 2026. Online (India). Responsible AI focus. Apply: https://reskilll.com/
10. Sprint4Good AI Hackathon: Jan 12, 2026. Offline (India). Inclusive AI solutions. Apply: https://reskilll.com/
`;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
        }

        const prompt = `
You are an information extraction assistant.

From the provided text, extract hackathon opportunities into a JSON array.
CRITICAL: Only include hackathons located in India or Online (India).

For each hackathon return:
- title
- date (ISO date or range string)
- applyUrl
- prizes (if mentioned)
- location (if mentioned)

Rules:
- Output ONLY a valid JSON array.
- Do not include any preamble, thinking, or markdown code blocks.
- If a date is not explicitly stated as a date, use null.

Text:
${RAW_SOURCE_TEXT}
`;

        const models = ["openai/gpt-oss-120b", "google/gemini-2.0-flash-exp:free"];
        let results = [];

        for (const model of models) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + apiKey,
                        "HTTP-Referer": "https://unifind.app",
                        "X-Title": "Unifind",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.1
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || "Model failed");

                let text = data.choices[0].message.content.trim();
                const start = text.indexOf('[');
                const end = text.lastIndexOf(']');
                if (start !== -1 && end !== -1) {
                    text = text.substring(start, end + 1);
                }

                const parsedResults = JSON.parse(text);
                if (Array.isArray(parsedResults) && parsedResults.length > 0) {
                    results = parsedResults;
                    break;
                }
            } catch (err) {
                console.error(`Model ${model} failed:`, err);
            }
        }

        // Final fallback
        if (results.length === 0) {
            results = [
                { title: "Smart India Hackathon 2026", date: "TBA", applyUrl: "https://sih.gov.in/", location: "Nationwide, India" },
                { title: "Hack With Mumbai 2.0", date: "2026-01-06", applyUrl: "https://unstop.com/", location: "Mumbai, India" },
                { title: "AI for All Challenge", date: "2026-01-05", applyUrl: "https://reskilll.com/", location: "Online (India)" }
            ];
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error("Hackathons API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
