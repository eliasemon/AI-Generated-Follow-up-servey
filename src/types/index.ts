export interface Question {
  id: string;
  question: string;
  answer: string;
  type: "initials" | "followUp";
}
