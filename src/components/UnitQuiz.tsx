"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, CheckCircle, XCircle, Target } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface Quiz {
    id: string;
    lesson_id: string;
    questions: Question[];
    passing_score: number;
    track: string;
}

interface UnitQuizProps {
    lessonId: string;
    lessonOrder: number;
    lessonTitle: string;
    studentId: string;
    onClose: () => void;
    onShowAchievement: (score: number) => void;
}

export default function UnitQuiz({ lessonId, lessonOrder, lessonTitle, studentId, onClose, onShowAchievement }: UnitQuizProps) {
    const [screen, setScreen] = useState<'intro' | 'questions' | 'results'>('intro');
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    // Store user selections: questionId -> selectedOptionIdx
    const [answers, setAnswers] = useState<Record<number, number>>({});

    // Results state
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('lesson_id', lessonId)
                .single();

            if (!error && data) {
                setQuiz(data as Quiz);
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [lessonId]);

    const handleStart = () => {
        setScreen('questions');
    };

    const handleOptionSelect = (optionIdx: number) => {
        if (isAnswerRevealed) return;
        setSelectedOption(optionIdx);
        setIsAnswerRevealed(true);

        if (!quiz) return;

        const q = quiz.questions[currentQuestionIdx];
        setAnswers(prev => ({ ...prev, [q.id]: optionIdx }));
    };

    const handleNextQuestion = () => {
        if (!quiz) return;

        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerRevealed(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        if (!quiz) return;

        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                correctCount++;
            }
        });

        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const hasPassed = percentage >= quiz.passing_score;

        setScore(percentage);
        setPassed(hasPassed);
        setScreen('results');

        // Save to quiz_results
        await supabase.from('quiz_results').insert({
            student_id: studentId,
            quiz_id: quiz.id,
            score: percentage,
            passed: hasPassed,
            attempts_count: 1 // In a real app, logic would increment this based on existing records
        });

        // Unlock next lesson if passed
        if (hasPassed) {
            await supabase
                .from('lessons')
                .update({ is_locked: false })
                .eq('track', 'dutch')
                .eq('order_index', lessonOrder + 1);
        }
    };

    const handleRetry = () => {
        setScreen('intro');
        setCurrentQuestionIdx(0);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
        setAnswers({});
    };

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-coral"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-brand-charcoal border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-4">Quiz nog niet beschikbaar</h2>
                    <p className="text-gray-400 mb-8">De quiz voor deze les is nog niet aangemaakt in het systeem.</p>
                    <button onClick={onClose} className="bg-brand-coral hover:bg-[#ff6b3d] text-white px-6 py-3 rounded-xl font-bold w-full transition-colors">
                        Sluiten
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 p-4 flex justify-end z-10">
                <button onClick={onClose} className="bg-brand-charcoal-light hover:bg-[#3a3a4e] text-white p-3 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-20 pt-4 flex flex-col items-center justify-center min-h-[80vh]">

                {/* SCREEN 1: INTRO */}
                {screen === 'intro' && (
                    <div className="w-full text-center animate-in zoom-in-95 duration-500">
                        <div className="text-brand-coral font-bold tracking-widest text-sm mb-4 uppercase">Neem de les quiz</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Les {lessonOrder}: {lessonTitle}</h1>
                        <div className="bg-brand-charcoal border border-gray-800 rounded-2xl p-6 md:p-8 max-w-xl mx-auto mb-10 shadow-xl">
                            <ul className="text-left space-y-4 text-gray-300 text-lg">
                                <li className="flex items-center gap-3">
                                    <Target className="w-6 h-6 text-brand-gold" />
                                    <span><strong>{quiz.questions.length} vragen</strong> over woordenschat en grammatica</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
                                    <span>Minimaal <strong>{quiz.passing_score}% score</strong> om door te gaan</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={handleStart}
                            className="bg-brand-coral hover:bg-[#ff6b3d] text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(255,107,107,0.3)] hover:shadow-[0_0_40px_rgba(255,107,107,0.5)] transition-all active:scale-95"
                        >
                            Start Quiz
                        </button>
                    </div>
                )}

                {/* SCREEN 2: QUESTIONS */}
                {screen === 'questions' && (
                    <div className="w-full animate-in slide-in-from-right-8 duration-500">
                        {/* Progress */}
                        <div className="mb-10 w-full max-w-2xl mx-auto">
                            <div className="flex justify-between text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                                <span>Vraag {currentQuestionIdx + 1} van {quiz.questions.length}</span>
                                <span>Doel: {quiz.passing_score}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-coral transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="max-w-2xl mx-auto w-full">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
                                {quiz.questions[currentQuestionIdx].question}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {quiz.questions[currentQuestionIdx].options.map((option, idx) => {
                                    const isCorrectOpt = quiz.questions[currentQuestionIdx].correct === idx;
                                    const isSelectedOpt = selectedOption === idx;

                                    let btnClass = "bg-brand-charcoal border-gray-800 text-gray-200 hover:bg-[#3a3a4e] hover:border-gray-600";

                                    if (isAnswerRevealed) {
                                        if (isCorrectOpt) {
                                            btnClass = "bg-[#4CAF50]/10 border-[#4CAF50] text-[#4CAF50] shadow-[0_0_15px_rgba(76,175,80,0.2)]";
                                        } else if (isSelectedOpt) {
                                            btnClass = "bg-[#FF4444]/10 border-[#FF4444] text-[#FF4444]";
                                        } else {
                                            btnClass = "bg-[#1a1a2e] border-gray-800 text-gray-500 opacity-50";
                                        }
                                    } else if (isSelectedOpt) {
                                        btnClass = "bg-brand-coral/20 border-brand-coral text-white";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={isAnswerRevealed}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`p-6 rounded-2xl border-2 text-lg font-medium transition-all text-left flex items-center justify-between ${btnClass}`}
                                        >
                                            {option}
                                            {isAnswerRevealed && isCorrectOpt && <CheckCircle className="w-6 h-6 text-[#4CAF50]" />}
                                            {isAnswerRevealed && isSelectedOpt && !isCorrectOpt && <XCircle className="w-6 h-6 text-[#FF4444]" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback Area */}
                            {isAnswerRevealed && (
                                <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                                    <div className={`p-6 rounded-2xl border mb-8 ${selectedOption === quiz.questions[currentQuestionIdx].correct ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30' : 'bg-[#FF4444]/10 border-[#FF4444]/30'}`}>
                                        <h4 className={`text-lg font-bold mb-2 ${selectedOption === quiz.questions[currentQuestionIdx].correct ? 'text-[#4CAF50]' : 'text-[#FF4444]'}`}>
                                            {selectedOption === quiz.questions[currentQuestionIdx].correct ? 'Correct!' : 'Incorrect'}
                                        </h4>
                                        <p className="text-brand-gold text-lg">
                                            {quiz.questions[currentQuestionIdx].explanation}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-xl transition-all"
                                    >
                                        Volgende vraag →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SCREEN 3: RESULTS */}
                {screen === 'results' && (
                    <div className="w-full max-w-xl mx-auto text-center animate-in zoom-in-95 duration-500">
                        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 ${passed ? 'bg-[#4CAF50]/20' : 'bg-[#FF4444]/20'}`}>
                            {passed ? <CheckCircle className="w-16 h-16 text-[#4CAF50]" /> : <XCircle className="w-16 h-16 text-[#FF4444]" />}
                        </div>

                        <h2 className="text-4xl font-bold text-white mb-2">
                            {passed ? '¡Felicidades!' : 'Probeer het opnieuw'}
                        </h2>

                        <div className="text-6xl font-black text-white mb-6 mt-8 tracking-tighter">
                            {score}%
                        </div>
                        <p className="text-xl text-gray-400 mb-12 font-medium">
                            Score: {Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length} correct
                        </p>

                        {!passed && (
                            <div className="bg-brand-charcoal border border-gray-800 rounded-2xl p-6 text-left mb-10">
                                <h3 className="font-bold text-white mb-4">Aandachtspunten:</h3>
                                <ul className="space-y-3">
                                    {quiz.questions.map(q => {
                                        if (answers[q.id] !== q.correct) {
                                            return (
                                                <li key={q.id} className="text-gray-300 flex items-start gap-3 border-b border-gray-800/50 pb-3 last:border-0 last:pb-0">
                                                    <XCircle className="w-5 h-5 text-[#FF4444] mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="block font-medium mb-1">{q.question}</span>
                                                        <span className="text-sm text-brand-gold">{q.explanation}</span>
                                                    </div>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        )}

                        {passed ? (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        onClose();
                                        onShowAchievement(score);
                                    }}
                                    className="w-full bg-[#FFB800] hover:bg-[#e6a800] text-black font-bold px-6 py-4 rounded-xl text-lg mb-3 transition-colors shadow-[0_0_30px_rgba(255,184,0,0.3)]"
                                >
                                    🏆 Bekijk je Achievement Card!
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-brand-charcoal text-white hover:bg-[#3a3a4e] border border-gray-700 px-8 py-4 rounded-xl font-bold transition-all"
                                >
                                    Ga naar Les {lessonOrder + 1}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleRetry}
                                    className="w-full bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-xl transition-all"
                                >
                                    Quiz opnieuw proberen
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-brand-charcoal text-white hover:bg-[#3a3a4e] border border-gray-700 px-8 py-4 rounded-xl font-bold transition-all"
                                >
                                    Terug naar de les
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
