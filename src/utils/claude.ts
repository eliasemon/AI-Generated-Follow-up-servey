/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateFollowUpQuestions(previousQA: Array<{question: string, answer: string}>) {
  const systemPrompt = `You are an expert at generating relevant follow-up questions based on previous Q&A interactions. 
  Given the following questions and answers, generate 3 logical follow-up questions that would deepen the understanding of the topic.
  
  Rules:
  - Questions should be related to the previous context
  - Questions should explore new aspects not covered in the original Q&A
  - Questions should be clear and specific
  - Return exactly 3 questions
  - Format your response as a numbered list (1., 2., 3.)
  
  Previous Q&A:`;

  const qaContext = previousQA.map(qa => 
    `Q: ${qa.question}\nA: ${qa.answer}`
  ).join('\n\n');

  try {
    const response : any = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `${systemPrompt}\n\n${qaContext}\n\nPlease generate 3 relevant follow-up questions based on the above Q&A. Return them in a numbered list format.`
      }],
    });

    // Convert the response content to an array of questions
    const content = response.content[0].text;
    const questions = content
      .split('\n')
      .filter((line: string) => line.trim().match(/^\d+\./)) // Find lines starting with numbers
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim()); // Remove numbers and whitespace
    return questions;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    throw error;
  }
}
