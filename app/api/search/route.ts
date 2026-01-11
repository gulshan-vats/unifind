import { NextResponse } from "next/server";

// Mock raw source text - updated with India-focused 2026 data
const RAW_SOURCE_TEXT = `
1. Google India: Software Engineering Intern, Summer 2026. Bangalore/Hyderabad. Apply: https://google.com/about/careers
2. Microsoft India: Software Engineering Internship 2026. Bangalore/Hyderabad/Noida. Apply: https://careers.microsoft.com/
3. Amazon India: Software Development Engineer Intern - 2026. Bangalore, Chennai, Hyderabad, Delhi. Apply: https://amazon.jobs/
4. Flipkart: SDE Intern 2026. Bangalore. Apply: https://flipkart.com/careers
5. Zomato: Software Engineering Intern - Summer 2026. Gurgaon (Remote Friendly). Apply: https://zomato.com/careers
6. Razorpay: Frontend/Backend Intern 2026. Bangalore (Remote). Apply: https://razorpay.com/jobs
7. CRED: Backend Engineer Intern 2026. Bangalore. Apply: https://cred.club/careers
8. Adobe India: Software Engineer Intern 2026. Noida/Bangalore. Apply: https://adobe.com/careers
9. Atlassian India: Software Engineer Intern 2026. Bangalore (Remote). Apply: https://atlassian.com/careers
10. Uber India: Software Engineering Intern 2026. Bangalore/Hyderabad. Apply: https://uber.com/careers
`;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
        }

        const prompt = `
You are an information extraction assistant.

From the provided text, extract internship opportunities into a JSON array.
CRITICAL: Only include internships located in India or Remote (India).

For each internship return:
- title
- company
- deadline (ISO date if available, otherwise null)
- applyUrl
- eligibility (if mentioned)
- location (if mentioned)

Rules:
- Output ONLY a valid JSON array.
- Do not include any preamble, thinking, or markdown code blocks.
- If a deadline is not explicitly stated as a date, use null.

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
                { title: "Software Engineering Intern", company: "Google India", deadline: null, applyUrl: "https://google.com/about/careers", location: "Bangalore, India" },
                { title: "SDE Intern", company: "Amazon India", deadline: null, applyUrl: "https://amazon.jobs/", location: "Hyderabad, India" },
                { title: "Software Engineer Intern", company: "Atlassian India", deadline: null, applyUrl: "https://atlassian.com/careers", location: "Remote (India)" }
            ];
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
