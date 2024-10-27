
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";




export async function POST(req: NextRequest) {
    const user = await req.json();

    const enc = encoding_for_model("gpt-3.5-turbo");

    const openai = new OpenAI({
        apiKey: process.env.OPENAIAPI,
    });

    const message = {
        fullname: "sarvagya patel",
        interests: "web developement",
        education: "B.Tech CSE",
        ambitions: "Software Developer",
        skills: "React.js, Next.js , Node.js, express, postgres",
    };

    const messageContent = `Name: ${message.fullname}
    Education: ${message.education}
    Interest: ${message.interests}
    Ambition: ${message.ambitions}
    Skills: ${message.skills}

    Personalized Career Path for ${message.fullname}:

    -analyze skill gaps and give steps to overcome
    -career milestones 
    -long term strategy
    `;
    const tokens = enc.encode(messageContent);
    const inputTokens = tokens.length;
    const maxResponseTokens = 2048;
    const availableTokens = 4096 - inputTokens;

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: messageContent,
                },
            ],

            temperature: 1,
            max_tokens: Math.min(maxResponseTokens, availableTokens),
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return NextResponse.json(
            { success: true, message: "career path updated", response },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        )
    }
}

