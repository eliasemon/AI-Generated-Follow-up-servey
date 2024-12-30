import { Question } from '@/types';
import React from 'react';


interface AnswerHistoryProps {
  questions: Question[];
}

export const AnswerHistory: React.FC<AnswerHistoryProps> = ({ questions }) => {
  return (
    <div className='bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden'>
    <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]" >
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="border-b pb-4 last:border-b-0">
          <div className="font-medium text-gray-900 mb-2">
            {index + 1}. {question.question}
          </div>
          <div className="text-gray-600 whitespace-pre-wrap">
            {question.answer || 'No answer provided'}
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}