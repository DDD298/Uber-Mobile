import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY || "",
});

export const generateAIResponse = async (
  userMessage: string
): Promise<string> => {
  try {
    const systemPrompt = `You are an AI assistant for MyApp app. Respond helpfully in Vietnamese/English, provide trip updates, safety tips, or escalate to human support. Keep responses concise and friendly. Context: User is using MyApp app for ride booking.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama-3.3-70b-versatile", // Groq's fast and powerful model
      temperature: 0.7,
      max_tokens: 1024,
    });

    return (
      chatCompletion.choices[0]?.message?.content ||
      "Xin lỗi, AI tạm thời không khả dụng. Vui lòng thử lại sau."
    );
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Xin lỗi, AI tạm thời không khả dụng. Vui lòng thử lại sau.";
  }
};

export const cleanTextForSpeech = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
};
