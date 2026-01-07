'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Award, Target } from 'lucide-react';
import { QuizQuestionSchema } from '@/ai/schemas/quiz-schema';
import { type z } from 'zod';
import { cn } from '@/lib/utils';

type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

interface InteractiveQuizProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  questions: QuizQuestion[];
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export function InteractiveQuiz({ isOpen, onOpenChange, topic, questions }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    setSelectedAnswer(option);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswerStatus('unanswered');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerStatus('unanswered');
    setIsFinished(false);
    onOpenChange(false);
  };
  
  if (!isOpen) return null;

  if (isFinished) {
    return (
        <AlertDialog open={isFinished} onOpenChange={onOpenChange}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                    Challenge Complete!
                </AlertDialogTitle>
                <AlertDialogDescription>
                You've finished the quiz on "{topic}". Here's how you did:
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-6xl font-bold text-primary">
                    {Math.round((score / questions.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    You answered {score} out of {questions.length} questions correctly.
                </p>
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleRestart}>Done</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Challenge: {topic}
          </AlertDialogTitle>
          <div className="flex items-center gap-4 pt-2">
            <Progress value={progress} className="w-full" />
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </AlertDialogHeader>
        
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.answer;
                    const isSelected = option === selectedAnswer;

                    let variant: 'default' | 'correct' | 'incorrect' = 'default';
                    if (selectedAnswer) {
                        if (isCorrect) variant = 'correct';
                        else if (isSelected) variant = 'incorrect';
                    }
                    
                    return (
                        <Button 
                            key={index}
                            variant="outline"
                            className={cn(
                                "h-auto min-h-16 whitespace-normal justify-start text-left",
                                variant === 'correct' && "bg-green-100 border-green-500 text-green-800 hover:bg-green-200",
                                variant === 'incorrect' && "bg-red-100 border-red-500 text-red-800 hover:bg-red-200"
                            )}
                            onClick={() => handleAnswer(option)}
                            disabled={!!selectedAnswer}
                        >
                            {option}
                            {selectedAnswer && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                            {isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                        </Button>
                    );
                })}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                {answerStatus === 'correct' && (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="font-semibold">Correct!</p>
                    </div>
                )}
                {answerStatus === 'incorrect' && (
                     <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        <p className="font-semibold">Not quite. The correct answer was: {currentQuestion.answer}</p>
                    </div>
                )}
                {selectedAnswer && (
                     <Button onClick={handleNext} className="w-full">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                )}
            </CardFooter>
        </Card>

      </AlertDialogContent>
    </AlertDialog>
  );
}
