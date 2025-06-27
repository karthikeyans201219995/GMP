import React from 'react';
import { Case } from '../types';
import { CheckCircle, Circle, Target, AlertCircle, Zap, TrendingDown } from 'lucide-react';
import { DragDropZone } from './DragDropZone';

interface QuestionPanelProps {
  case: Case;
  currentQuestion: 'violation' | 'rootCause' | 'impact';
  selectedAnswers: {
    violation: number | null;
    rootCause: number | null;
    impact: number | null;
  };
  onAnswerSelect: (questionType: 'violation' | 'rootCause' | 'impact', answer: number) => void;
  showFeedback: boolean;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  case: currentCase,
  currentQuestion,
  selectedAnswers,
  onAnswerSelect,
  showFeedback
}) => {
  const question = currentCase.questions[currentQuestion];
  
  const getQuestionConfig = (type: string) => {
    switch (type) {
      case 'violation': 
        return {
          title: 'Step 1: Identify GMP Violation',
          icon: <AlertCircle className="w-6 h-6 text-red-500" />,
          gradient: 'from-red-500 to-red-600',
          bgGradient: 'from-red-50 to-pink-50',
          borderColor: 'border-red-300'
        };
      case 'rootCause': 
        return {
          title: 'Step 2: Root Cause Analysis',
          icon: <Target className="w-6 h-6 text-amber-500" />,
          gradient: 'from-amber-500 to-orange-600',
          bgGradient: 'from-amber-50 to-orange-50',
          borderColor: 'border-amber-300'
        };
      case 'impact': 
        return {
          title: 'Step 3: Impact Assessment',
          icon: <TrendingDown className="w-6 h-6 text-blue-500" />,
          gradient: 'from-blue-500 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-300'
        };
      default: 
        return {
          title: '',
          icon: null,
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300'
        };
    }
  };

  const config = getQuestionConfig(currentQuestion);
  const isCorrect = (index: number) => question.correct === index;

  return (
    <div className="bg-white/60 rounded-xl shadow-xl border border-gray-200 overflow-hidden transform hover:scale-[1.01] transition-all duration-300 landscape:text-[10px] landscape:leading-tight sm:landscape:text-xs">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-2 py-1 border-b-2 ${config.borderColor} landscape:px-2 landscape:py-2 sm:landscape:px-3 sm:landscape:py-2`}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              {config.icon}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white ">
              {config.title}
            </h3>
            <p className="text-white/80 text-xs font-medium landscape:text-[9px] sm:landscape:text-xs">
              Select the most appropriate answer
            </p>
          </div>
        </div>
      </div>

      <div className="px-1 py-1 ">
        {/* Question */}
        <div className={`bg-gradient-to-r ${config.bgGradient} rounded-lg   border-2 ${config.borderColor} `}>
          <h4 className="text-xs   font-bold text-gray-900 flex items-center ">
            <Zap className="w-4 h-4 text-yellow-500 " />
            <span>{question.question}</span>
          </h4>
        </div>
        
        {/* Options */}
        {currentQuestion === 'rootCause' ? (
          <div className="">
            {/* Drag and Drop for Step 2 */}
            <DragDropZone
              case={currentCase}
              selectedAnswer={selectedAnswers.rootCause}
              onAnswerSelect={answer => onAnswerSelect('rootCause', answer)}
              showFeedback={showFeedback}
              disabled={showFeedback}
            />
            {/* Feedback for drag and drop */}
            {showFeedback && selectedAnswers.rootCause !== null && (
              <div className="mt-2">
                {selectedAnswers.rootCause === question.correct ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                    ✓ Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                    ✗ Incorrect
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const optionLetter = String.fromCharCode(97 + index).toUpperCase();
              
              return (
                <div
                  key={index}
                  className={`
                    group relative flex items-center  rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.01]
                    ${isSelected 
                      ? showFeedback
                        ? isCorrect(index)
                          ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
                          : 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg shadow-red-200/50'
                        : 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                      : showFeedback && isCorrect(index)
                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
                        : 'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50'
                    }
                  `}
                  onClick={() => !showFeedback && onAnswerSelect(currentQuestion, index)}
                >
                  {/* Option Letter Badge */}
                  <div className={`
                    flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 mr-3
                    ${isSelected
                      ? showFeedback
                        ? isCorrect(index)
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'bg-red-500 border-red-600 text-white'
                        : 'bg-blue-500 border-blue-600 text-white'
                      : showFeedback && isCorrect(index)
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {optionLetter}
                  </div>

                  {/* Selection Icon */}
                  <div className="flex-shrink-0 mr-2">
                    {isSelected ? (
                      <CheckCircle className={`w-5 h-5 ${
                        showFeedback
                          ? isCorrect(index) ? 'text-green-600' : 'text-red-600'
                          : 'text-blue-600'
                      }`} />
                    ) : showFeedback && isCorrect(index) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-3 h-3  text-gray-400 group-hover:text-gray-500" />
                    )}
                  </div>

                  {/* Option Text */}
                  <span className={`flex-1 text-sm font-medium ${
                    isSelected
                      ? showFeedback
                        ? isCorrect(index) ? 'text-green-900' : 'text-red-900'
                        : 'text-blue-900'
                      : showFeedback && isCorrect(index)
                        ? 'text-green-900'
                        : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {option}
                  </span>
                  
                  {/* Feedback Badges */}
                  {showFeedback && isCorrect(index) && (
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                        ✓ Correct
                      </span>
                    </div>
                  )}
                  
                  {showFeedback && isSelected && !isCorrect(index) && (
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                        ✗ Incorrect
                      </span>
                    </div>
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};