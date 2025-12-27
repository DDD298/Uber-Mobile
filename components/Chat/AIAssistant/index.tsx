import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '');

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an AI assistant for MyApp app. Respond helpfully in Vietnamese/English, provide trip updates, safety tips, or escalate to human support. Keep responses concise and friendly. Context: User is using MyApp app for ride booking.`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userMessage}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return 'Xin lỗi, AI tạm thời không khả dụng. Vui lòng thử lại sau.';
  }
};

export const cleanTextForSpeech = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
};
