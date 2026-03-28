"use client";

import { Fragment } from 'react';

interface InteractiveExercise {
    instruction: string;
    sentences: string[];
    correct_answers: string[];
    answer_key: string;
}

interface InteractivePracticeProps {
    exercises: InteractiveExercise[];
    answers: Record<number, string[]>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
    checked: Record<number, boolean>;
    setChecked: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    showKey: Record<number, boolean>;
    setShowKey: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export default function InteractivePractice({
    exercises,
    answers,
    setAnswers,
    checked,
    setChecked,
    showKey,
    setShowKey
}: InteractivePracticeProps) {
    if (!exercises || exercises.length === 0) return null;

    return (
        <div className="space-y-12 w-full">
            {exercises.map((ex, exIdx) => {
                let globalBlankIdx = 0;

                const isChecked = checked[exIdx] || false;
                const isShowKey = showKey[exIdx] || false;
                const exAnswers = answers[exIdx] || [];

                // Calculate score
                let correctCount = 0;
                const totalCount = ex.correct_answers.length;

                if (isChecked) {
                    ex.correct_answers.forEach((ans, i) => {
                        if ((exAnswers[i] || '').trim().toLowerCase() === ans.toLowerCase()) {
                            correctCount++;
                        }
                    });
                }

                return (
                    <div key={exIdx} className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 shadow-xl">
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-coral transition-all duration-500 ease-out"
                                    style={{ width: `${((exIdx + 1) / exercises.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Oefening {exIdx + 1} van {exercises.length}
                            </span>
                        </div>

                        {/* Instruction */}
                        <p className="text-gray-300 font-medium mb-8 whitespace-pre-line text-lg">{ex.instruction}</p>

                        {/* Sentences with Inputs */}
                        <div className="space-y-6 mb-10">
                            {ex.sentences.map((sentence, sIdx) => {
                                const parts = sentence.split('_____');

                                return (
                                    <div key={sIdx} className="text-gray-300 transform-gpu leading-loose text-lg">
                                        {parts.map((part, pIdx) => {
                                            if (pIdx === parts.length - 1) return <span key={pIdx}>{part}</span>;

                                            const blankId = globalBlankIdx++;
                                            const currentVal = exAnswers[blankId] || '';
                                            const isCorrect = isChecked && currentVal.trim().toLowerCase() === ex.correct_answers[blankId].toLowerCase();
                                            const isWrong = isChecked && !isCorrect;

                                            return (
                                                <Fragment key={pIdx}>
                                                    <span>{part}</span>
                                                    <span className="inline-flex flex-col relative mx-2 align-middle transform-gpu translate-y-[-2px]">
                                                        <input
                                                            disabled={isChecked}
                                                            type="text"
                                                            className={`w-28 px-2 py-1 leading-normal bg-[#2a2a3e] border-b-2 text-center text-white outline-none transition-all duration-300
                                                                ${isChecked
                                                                    ? (isCorrect ? 'border-[#4CAF50] text-[#4CAF50] bg-[#4CAF50]/10 font-bold' : 'border-[#FF4444] text-[#FF4444] bg-[#FF4444]/10 line-through opacity-70')
                                                                    : 'border-gray-600 focus:border-brand-coral focus:bg-[#3a3a4e]'}
                                                            `}
                                                            value={currentVal}
                                                            onChange={(e) => {
                                                                const newAnswers = [...exAnswers];
                                                                newAnswers[blankId] = e.target.value;
                                                                setAnswers(prev => ({ ...prev, [exIdx]: newAnswers }));
                                                            }}
                                                        />
                                                        {isWrong && (
                                                            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm text-brand-gold font-bold whitespace-nowrap animate-in slide-in-from-top-1 fade-in duration-300">
                                                                {ex.correct_answers[blankId]}
                                                            </span>
                                                        )}
                                                    </span>
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-800">
                            {!isChecked ? (
                                <button
                                    onClick={() => setChecked(prev => ({ ...prev, [exIdx]: true }))}
                                    className="bg-brand-coral hover:bg-[#ff6b3d] text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-coral/20 hover:shadow-brand-coral/40 active:scale-95"
                                >
                                    Controleren
                                </button>
                            ) : (
                                <>
                                    <div className="font-bold text-lg bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                                        <span className={correctCount === totalCount ? 'text-[#4CAF50]' : 'text-brand-gold'}>
                                            {correctCount}/{totalCount} correct
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setChecked(prev => ({ ...prev, [exIdx]: false }));
                                            setAnswers(prev => ({ ...prev, [exIdx]: [] }));
                                            setShowKey(prev => ({ ...prev, [exIdx]: false }));
                                        }}
                                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-700 active:scale-95"
                                    >
                                        Opnieuw
                                    </button>

                                    <button
                                        onClick={() => setShowKey(prev => ({ ...prev, [exIdx]: !prev[exIdx] }))}
                                        className="text-brand-coral hover:text-white text-sm font-bold underline transition-colors ml-auto"
                                    >
                                        {isShowKey ? 'Verberg antwoordsleutel' : 'Toon antwoordsleutel'}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Answer Key Expandable */}
                        {isShowKey && (
                            <div className="mt-6 p-5 bg-[#2a2a3e] border border-gray-700 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300 shadow-inner">
                                <h5 className="text-brand-gold font-bold text-sm mb-3 uppercase tracking-wider">Answer Key</h5>
                                <pre className="text-gray-200 text-base whitespace-pre-wrap font-sans leading-relaxed">{ex.answer_key}</pre>
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
}
