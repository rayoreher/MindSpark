import { QuestionInfo } from "./questionInfo";
import { JsonQuestions } from "./questions";

export interface Question {
    id: string;
    name: string;
    data: JsonQuestions;
    info: QuestionInfo;
    question: string;
    answer: string;
    created_at: string;
  } 
  