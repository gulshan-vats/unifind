import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            console.error("❌ API Key is missing from environment variables.");
            return NextResponse.json(
                { error: "API Key is not defined in environment variables" },
                { status: 500 }
            );
        }

        const { message, isWebSearch, files } = await req.json();

        const content: any[] = [{ type: "text", text: message }];

        // Handle file attachments
        if (files && Array.isArray(files)) {
            files.forEach((file: { data: string; mimeType: string }) => {
                const base64Data = file.data.split(",")[1] || file.data;
                if (file.mimeType.startsWith("image/")) {
                    content.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${file.mimeType};base64,${base64Data}`,
                        },
                    });
                } else {
                    content.push({
                        type: "text",
                        text: `[Attached File: ${file.mimeType}]`,
                    });
                }
            });
        }

        // Handle Web Search context
        if (isWebSearch) {
            content.push({
                type: "text",
                text: "\n\n[System Note: The user has requested a web search. Please provide the most up-to-date and comprehensive information available to you, simulating a deep search experience.]"
            });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://unifind.app",
                "X-Title": "Unifind",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch from OpenRouter");
        }

        const text = data.choices[0].message.content;

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("OpenRouter API Error:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while communicating with OpenRouter." },
            { status: 500 }
        );
    }
}
