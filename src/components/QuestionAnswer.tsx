'use client';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Question } from '@/types';
import toast from 'react-hot-toast';
import { Modal } from './ui/Modal';
import { AnswerHistory } from './AnswerHistory';
import { HistoryButton } from './ui/HistoryButton';
import initialsQuestions from './InitialsQuestions.json';

const INITIAL_QUESTIONS: Question[] = initialsQuestions as Question[];

export const QuestionAnswer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS.slice(0,3));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAnswerChange = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].answer = answer;
    setQuestions(updatedQuestions);
  };

  const generateNextQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions : questions.slice(-3) }),
      });
      
      const data = await response.json();
      console.log(data.questions);
      if(data?.error) toast.error(data.error);
      if(data?.questions){ 
        console.log("here")
        const newQuestions = data.questions.reduce ((acc: { id: string; question: string; answer: string; type: string; }[], question: string) => {
          acc.push({id : uuidv4(), question: question, answer: '', type: 'followUp'});
          return acc;
        },[])
        console.log(newQuestions);
        setQuestions(prv => ([...prv, ...newQuestions]) )
        setCurrentIndex(currentIndex + 1);
        toast.success('Follow-up questions generated successfully!');
      }
      
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      generateNextQuestions();
    }
  };

  const randomizeQuestionsPattrens = () => {
    const randomIndex = Math.floor(Math.random() * initialsQuestions.length / 3);
    console.log(randomIndex);
    const randomQuestions = initialsQuestions.slice(randomIndex * 3, (randomIndex *3 ) +3 );
    setQuestions(randomQuestions as Question[]);
    setCurrentIndex(0);
   }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Generating new questions...</p>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{questions[currentIndex].type == "followUp" && "Follow-up"} Question {currentIndex + 1} of {questions.length}</h2>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-indigo-600 rounded transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{questions[currentIndex].question}</h3>
        <textarea
          value={questions[currentIndex].answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your answer here..."
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!questions[currentIndex].answer}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {currentIndex < questions.length - 1 ? 'Next Question' : `Generate ${currentIndex  > 3 ? "more" : ""}  Follow Up Questions`}
      </button>
    </div>

      <button
        onClick={randomizeQuestionsPattrens}
        className="fixed top-4 right-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Rest & Randomize Questions Topic Pattern
      </button>

    <HistoryButton onClick={() => setIsHistoryOpen(true)} />
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
        <AnswerHistory questions={questions} />
      </Modal>
    </>
  );
};