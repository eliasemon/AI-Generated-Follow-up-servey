// app/api/generate-questions/route.ts
import { NextResponse } from 'next/server';
import { generateFollowUpQuestions } from '@/utils/claude';

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const { questions } = res;

    const followUpQuestions = await generateFollowUpQuestions(questions);
    return NextResponse.json({ questions: followUpQuestions });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
