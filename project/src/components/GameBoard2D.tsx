import React, { useState } from 'react';
import { GameState } from '../types';
import { cases } from '../data/cases';
import { Product2D } from './Product2D';
import { QuestionPanel } from './QuestionPanel';
import { DragDropZone } from './DragDropZone';
import { FeedbackPanel } from './FeedbackPanel';
import { GameHeader } from './GameHeader';
import BoyBook from './boybook';
import { 
  ChevronRight, 
  AlertTriangle, 
  ChevronLeft, 
  TrendingUp, 
  Target,
  Brain
} from 'lucide-react';
import CharacterRotator from './CharacterRotator';
import Characterboybook from './Characterboybook';

type GamePhase = 'login' | 'reportView' | 'step1' | 'step2' | 'step3' | 'feedback';

export const GameBoard2D: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentCase: 0,
    answers: {
      violation: null,
      rootCause: null,
      impact: null
    },
    score: 0,
    totalQuestions: 0,
    showFeedback: false,
    gameComplete: false
  });

  const [currentPhase, setCurrentPhase] = useState<GamePhase>('login');
  const [canContinue, setCanContinue] = useState(true); // Login phase always allows continue

  const currentCase = cases[gameState.currentCase];

  const handleAnswerSelect = (questionType: 'violation' | 'rootCause' | 'impact', answer: number) => {
    setGameState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionType]: answer
      }
    }));
    setCanContinue(true);
  };

  const handleContinue = () => {
    switch (currentPhase) {
      case 'login':
        setCurrentPhase('reportView');
        setCanContinue(true);
        break;
      case 'reportView':
        setCurrentPhase('step1');
        setCanContinue(false);
        break;
      case 'step1':
        if (gameState.answers.violation !== null) {
          setCurrentPhase('step2');
          setCanContinue(false);
        }
        break;
      case 'step2':
        if (gameState.answers.rootCause !== null) {
          setCurrentPhase('step3');
          setCanContinue(false);
        }
        break;
      case 'step3':
        if (gameState.answers.impact !== null) {
          setCurrentPhase('feedback');
          calculateResults();
        }
        break;
      case 'feedback':
        const correctAnswers = getCorrectAnswers();
        if (correctAnswers === 3) {
          // Only continue if all answers are correct
          if (gameState.currentCase < cases.length - 1) {
            // Move to next case
            setGameState(prev => ({
              ...prev,
              currentCase: prev.currentCase + 1,
              answers: { violation: null, rootCause: null, impact: null },
              showFeedback: false
            }));
            setCurrentPhase('login');
            setCanContinue(true);
          } else {
            // Game complete
            setGameState(prev => ({ ...prev, gameComplete: true }));
          }
        } else {
          // Show "Needs Improvement" and don't allow continue
          setCanContinue(false);
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentPhase) {
      case 'reportView':
        setCurrentPhase('login');
        setCanContinue(true);
        break;
      case 'step1':
        setCurrentPhase('reportView');
        setCanContinue(true);
        break;
      case 'step2':
        setCurrentPhase('step1');
        setCanContinue(gameState.answers.violation !== null);
        break;
      case 'step3':
        setCurrentPhase('step2');
        setCanContinue(gameState.answers.rootCause !== null);
        break;
      case 'feedback':
        setCurrentPhase('step3');
        setCanContinue(gameState.answers.impact !== null);
        break;
    }
  };

  const calculateResults = () => {
    const correctAnswers = [
      gameState.answers.violation === currentCase.questions.violation.correct,
      gameState.answers.rootCause === currentCase.questions.rootCause.correct,
      gameState.answers.impact === currentCase.questions.impact.correct
    ];
    
    const newScore = correctAnswers.filter(Boolean).length;
    setGameState(prev => ({
      ...prev,
      score: prev.score + newScore,
      totalQuestions: prev.totalQuestions + 3,
      showFeedback: true
    }));
  };

  const getCorrectAnswers = () => {
    if (!gameState.answers.violation && !gameState.answers.rootCause && !gameState.answers.impact) return 0;
    
    let correct = 0;
    if (gameState.answers.violation === currentCase.questions.violation.correct) correct++;
    if (gameState.answers.rootCause === currentCase.questions.rootCause.correct) correct++;
    if (gameState.answers.impact === currentCase.questions.impact.correct) correct++;
    return correct;
  };  const renderCharacter = () => (
    <div className="flex flex-col items-center ">
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src="/rendering-cartoon-fantasy-scene-illustration.png" 
          alt="Alert" 
          className="landscape:w-48 landscape:h-48 landscape:max-w-[192px] landscape:max-h-[192px] landscape:object-contain object-contain" 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );// Phase 1: Login/Deviation Report
  const renderLogin = () => (
    <div className="relative h-[100%] w-[100%] p-[1vw] flex flex-col text-xs md:text-sm">
      {/* Blurred, low-opacity background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/background.png')",
          opacity: 1
        }}
        aria-hidden="true"
      />
      {/* Main content with gradient overlay */}
      <div className="relative z-10 h-full w-full  flex flex-col text-xs md:text-sm">
        {/* Header */}
        <div className="flex flex-col items-center justify-center w-full  z-10 landscape:relative landscape:z-20 landscape:bg-transparent landscape:pt-2 ">
          <h1 className="text-xl  font-bold text-red-600  bg-white/70 ">DEVIATION REPORT</h1>
          <p className="text-xs md:text-base lg:text-2xl bg-white/70 text-gray-700 landscape:text-xs landscape:mb-1 lg:mb-2">Quality deviation detected - Investigation required</p>
        </div>

        {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
        <div className="flex flex-col landscape:flex-row lg:grid lg:grid-cols-2 gap-[2vw] items-center justify-center flex-1 w-[100%] h-[70vh] lg:gap-[2vw] lg:px-2 lg:py-6">
          {/* Left: Character */}
          <div className="flex items-center justify-center w-full h-auto col-span-1 landscape:w-1/2 landscape:h-auto lg:w-full lg:h-full lg:min-h-[320px] lg:min-w-[320px]">
            <div className="w-full h-full flex items-center justify-center">
              {/* Interactive CharacterRotator */}
              <CharacterRotator />
            </div>
          </div>
          {/* Right: Product Showcase */}
          <div className="rounded-2xl shadow-xl bg-white/60 lg:p-20 h-auto pt-4 pb-4 flex flex-col justify-center mx-auto items-center lg:min-h-[320px]">
            <h2 className="text-xs lg:text-2xl font-bold text-gray-800 text-center whitespace-pre-line md:text-xl mb-1 pl-2 pr-2">Product Under Investigation</h2>
            <div className="w-full flex flex-col items-center justify-center gap-1 mt-2 lg:w-[320px] lg:h-[320px] lg:overflow-visible">
              <div className="w-full h-full flex items-center justify-center lg:overflow-visible">
                <Product2D
                  productName="Pharmaceutical Tablet"
                  batchNumber={`A2024-${String(gameState.currentCase + 1).padStart(3, '0')}`}
                  hasDeviation={true}
                  deviationType={gameState.currentCase === 0 ? 'cleaning' : 'calibration'}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Navigation - always visible in mobile landscape */}
        <div className="flex justify-evenly  w-full px-2 md:mt-[1vw] md:w-full overflow-x-auto landscape:fixed landscape:bottom-0 landscape:left-0 landscape:w-full  landscape:py-2">
          <button
            onClick={handleContinue}
            className="px-3 py-2 md:px-[2vw] md:py-[0.8vw] bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold flex items-center space-x-2 shadow-lg text-xs md:text-sm whitespace-nowrap"
          >
            <span>Continue Investigation</span>
            <ChevronRight className="w-5 h-5 md:w-[1vw] md:h-[1vw] min-w-4 min-h-4" />
          </button>
        </div>
      </div>
    </div>
  );
  // Phase 2: Report View
  const renderReportView = () => (


    <div className="h-[100%] w-[100%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-[1vw] flex flex-col text-xs md:text-sm"
    style={{
      backgroundImage: "url('/background.png')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity: 1
    }}
    aria-hidden="true"
    >
      <div className="w-[100%] h-[100%] flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-[1vw] w-[100%]">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 bg-white/70">Deviation Investigation Game</h1>
          <p className="text-base text-gray-600  bg-white/60">Case Report Review</p>
        </div>
        {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
        <div className="flex flex-col landscape:flex-row lg:grid lg:grid-cols-2 gap-[2vw] items-center justify-center flex-1 w-[100%] h-auto lg:gap-[2vw] lg:px-2 lg:py-6">
          {/* Left: Character */}
          <div className="flex items-center justify-center w-full h-auto col-span-1 landscape:w-1/2 landscape:h-auto lg:w-full lg:h-full lg:min-h-[320px] lg:min-w-[320px]">
            <div className="w-full h-full flex items-center justify-center">
               <Characterboybook   />
            </div>
          </div>
          {/* Right: Deviation Report in Pad/Paper Format */}
          <div
            className="bg-white/70 rounded-2xl shadow-2xl p-[1vw] border-4 border-yellow-700 relative w-full flex flex-col items-center justify-start landscape:w-1/2 max-w-xl min-h-0"
            style={{
              backgroundImage: `url('/exam-pad-bg.png')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '200px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)'
            }}
          >
            {/* Exam pad ring/clip at the top */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[-18px] w-20 h-6 bg-gray-300 rounded-b-2xl border-2 border-gray-400 shadow-md z-10 flex items-center justify-center">
              <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
            </div>
            {/* Paper styling */}
            <div className="mt-[1vw] w-full h-full text-[10px] md:text-xs overflow-auto max-h-[320px] lg:max-h-[420px]">
              <div className="text-center mb-2 w-full">
                <h2 className="text-xs md:text-sm font-bold text-red-600 mb-1">DEVIATION REPORT</h2>
                <div className="w-full h-px bg-gray-300 mb-1"></div>
              </div>
              <div className="space-y-1 text-[10px] md:text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="font-bold">Case ID:</span> DEV-{String(gameState.currentCase + 1).padStart(3, '0')}
                  </div>
                  <div>
                    <span className="font-bold">Date:</span> {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="font-bold">Title:</span> <span className="break-words text-[10px] md:text-xs">{currentCase.title}</span>
                </div>
                <div>
                  <span className="font-bold">Description:</span>
                  <p className="mt-1 text-gray-700 leading-relaxed text-[10px] md:text-xs break-words">{currentCase.scenario}</p>
                </div>
                <div>
                  <span className="font-bold">Product:</span> <span className="text-[10px] md:text-xs">Pharmaceutical Tablet</span>
                </div>
                <div>
                  <span className="font-bold">Batch:</span> <span className="text-[10px] md:text-xs">A2024-{String(gameState.currentCase + 1).padStart(3, '0')}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1 w-full">
                  <div className="flex flex-col items-center justify-center bg-red-50 p-0.5 rounded border-l-4 border-red-500 min-w-0 w-full">
                    <div className="font-bold text-red-800 text-[10px] leading-tight truncate">Priority</div>
                    <div className="text-red-600 text-[10px] leading-tight truncate">HIGH</div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-yellow-50 p-0.5 rounded border-l-4 border-yellow-500 min-w-0 w-full">
                    <div className="font-bold text-yellow-800 text-[10px] leading-tight truncate">Status</div>
                    <div className="text-yellow-600 text-[10px] leading-tight truncate">OPEN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex justify-evenly  w-full px-2 md:w-[100%]">
          <button
            onClick={handleBack}
            className="px-3 py-2 md:px-[1vw] md:py-[0.5vw] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center space-x-1 text-xs md:text-sm"
          >
            <ChevronLeft className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3" />
            <span>Back</span>
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 md:px-[2vw] md:py-[0.8vw] bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold flex items-center space-x-2 shadow-lg text-xs md:text-sm"
          >
            <span>Start Investigation</span>
            <ChevronRight className="w-5 h-5 md:w-[1vw] md:h-[1vw] min-w-4 min-h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Phase 3-5: Investigation Steps
  const renderInvestigationStep = () => {
    const stepTitles = {
      'step1': 'Step 1: Identify GMP Violation',
      'step2': 'Step 2: Root Cause Analysis',
      'step3': 'Step 3: Impact Assessment'
    };

    const stepIcons = {
      'step1': Target,
      'step2': Brain,
      'step3': TrendingUp
    };

    const StepIcon = stepIcons[currentPhase as keyof typeof stepIcons];    return (


      <div className="h-[100%] w-[100%]  p-[1vw] flex flex-col text-xs md:text-sm"
       style={{
      backgroundImage: "url('/background.png')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity: 1
    }}
    aria-hidden="true"
      >
        <div className="w-[100%] h-[100%] flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-[1vw] w-[100%]">
            {/* <div className="inline-flex items-center justify-center w-[3vw] h-[3vw] min-w-[24px] min-h-[24px] bg-blue-100 rounded-full mb-[0.5vw]">
              <StepIcon className="w-[1.5vw] h-[1.5vw] min-w-[12px] min-h-[12px] text-blue-600" />
            </div> */}
            <h1 className="text-lg md:text-xl font-bold text-gray-800 mb-1 bg-white/70">{stepTitles[currentPhase as keyof typeof stepTitles]}</h1>
            <p className="text-base text-gray-600 bg-white/70">Deviation Investigation Game</p>
          </div>
          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className="flex flex-col landscape:flex-row lg:grid lg:grid-cols-2 gap-[2vw] items-center justify-center flex-1 w-[100%] h-auto min-h-0 overflow-visible lg:gap-[2vw] lg:px-2 lg:py-6">
            {/* Left: Character */}
            <div className="flex justify-center w-full landscape:w-1/2 h-auto col-span-1 min-h-0 overflow-visible lg:w-full lg:h-full lg:min-h-[320px] lg:min-w-[320px]">
              {renderCharacter()}
            </div>
            {/* Right: Question Panel */}
            <div className="bg-white/70 rounded-2xl shadow-xl p-[1vw] flex-1 w-full landscape:w-1/2 h-auto overflow-visible landscape:p-2 landscape:max-w-xs landscape:text-[10px]  sm:text-xs col-span-1">
              <div className="w-full h-full text-xs md:text-sm landscape:text-[10px] landscape:leading-tight">
                <QuestionPanel
                  case={currentCase}
                  currentQuestion={
                    currentPhase === 'step1'
                      ? 'violation'
                      : currentPhase === 'step2'
                      ? 'rootCause'
                      : 'impact'
                  }
                  selectedAnswers={gameState.answers}
                  onAnswerSelect={handleAnswerSelect}
                  showFeedback={false}
                />
              </div>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-evenly mt-[1vw] w-[100%] min-h-0 overflow-visible">
            <button
              onClick={handleBack}
              className="px-[1vw] py-[0.5vw] min-px-2 min-py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center space-x-1 text-xs md:text-sm"
            >
              <ChevronLeft className="w-[0.7vw] h-[0.7vw] min-w-3 min-h-3" />
              <span>Back</span>
            </button>
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`px-[2vw] py-[0.8vw] min-px-4 min-py-2 rounded-xl transition-all duration-300 font-bold flex items-center space-x-2 shadow-lg text-xs md:text-sm ${
                canContinue
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ChevronRight className="w-[1vw] h-[1vw] min-w-4 min-h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Phase 6: Feedback
  const renderFeedback = () => {
    const correctAnswers = getCorrectAnswers();
    const isAllCorrect = correctAnswers === 3;
    const caseAccuracy = Math.round((correctAnswers / 3) * 100);
    const performance = gameState.totalQuestions > 0 ? Math.round((gameState.score / gameState.totalQuestions) * 100) : 0;

    // Get correct and user answers for each question
    const violationCorrect = currentCase.questions.violation.options[currentCase.questions.violation.correct];
    const violationUser = gameState.answers.violation !== null ? currentCase.questions.violation.options[gameState.answers.violation] : null;
    const violationIsCorrect = gameState.answers.violation === currentCase.questions.violation.correct;

    const rootCauseCorrect = currentCase.questions.rootCause.options[currentCase.questions.rootCause.correct];
    const rootCauseUser = gameState.answers.rootCause !== null ? currentCase.questions.rootCause.options[gameState.answers.rootCause] : null;
    const rootCauseIsCorrect = gameState.answers.rootCause === currentCase.questions.rootCause.correct;

    const impactCorrect = currentCase.questions.impact.options[currentCase.questions.impact.correct];
    const impactUser = gameState.answers.impact !== null ? currentCase.questions.impact.options[gameState.answers.impact] : null;
    const impactIsCorrect = gameState.answers.impact === currentCase.questions.impact.correct;

    return (
      <div className="h-[100%] w-[100%] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-[1vw] flex flex-col text-xs md:text-sm">
        <div className="w-[100%] h-[100%] flex-1 flex flex-col">
          <GameHeader
            currentCase={gameState.currentCase + 1}
            totalCases={cases.length}
            score={gameState.score}
            totalQuestions={gameState.totalQuestions}
          />
          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className="flex flex-row gap-2 items-start flex-1 w-full min-h-0 overflow-visible px-4">
            {/* Left: Character */}
            <div className="flex justify-center items-center flex-shrink-0 p-2" style={{ minWidth: 0 }}>
              <img 
                src="/rendering-cartoon-fantasy-scene-illustration.png" 
                alt="Alert" 
                className="object-contain w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px]"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            {/* Right: Feedback Panel */}
            <div className="bg-white rounded-lg shadow p-1 flex flex-col gap-0.5 items-stretch flex-1 min-w-0 text-[9px] md:text-xs" style={{ minHeight: 0 }}>
              {/* Parent div for detailed feedback */}
              <div className="flex flex-col w-full gap-0.5 max-h-[300px] overflow-y-auto">
                {/* Header */}
                <div className="flex flex-col items-start mb-0.5">
                  <span className="text-yellow-700 font-bold text-[10px] md:text-xs leading-tight">{isAllCorrect ? 'Excellent!' : 'Needs Improvement'}</span>
                  <span className="text-gray-800 text-[9px] md:text-xs font-semibold leading-tight">Case analysis complete - Review your results</span>
                </div>
                {/* Score summary */}
                <div className="flex flex-row items-center gap-1 mt-0.5">
                  <div className="flex flex-col items-center justify-center bg-red-100 rounded px-1 py-0.5">
                    <span className="text-red-600 font-bold text-xs  leading-tight">{correctAnswers}/3 Correct</span>
                    <span className="text-gray-700 text-[9px] leading-tight">Case Accuracy: {caseAccuracy}%</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-100 rounded px-1 py-0.5">
                    <span className="text-gray-800 font-bold text-xs leading-tight">{performance}%</span>
                    <span className="text-gray-700 text-[9px] leading-tight">Performance</span>
                  </div>
                </div>
                {/* Detailed Analysis */}
                <div className="mt-0.5">
                  <span className="font-bold text-[10px] text-gray-800 leading-tight">Detailed Analysis</span>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <div className="flex flex-col bg-yellow-50 border-l-4 border-yellow-400 rounded p-0.5">
                      <span className="font-bold text-yellow-700 text-[10px] leading-tight">🔍 GMP Violation Identification</span>
                      <div className="flex flex-row justify-between items-center w-full text-[9px]">
                        <span className="text-gray-800">Correct: {violationCorrect}</span>
                        <span className={violationIsCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>Your answer: {violationUser || '-'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-yellow-50 border-l-4 border-yellow-400 rounded p-0.5">
                      <span className="font-bold text-yellow-700 text-[10px] leading-tight">🎯 Root Cause Analysis</span>
                      <div className="flex flex-row justify-between items-center w-full text-[9px]">
                        <span className="text-gray-800">Correct: {rootCauseCorrect}</span>
                        <span className={rootCauseIsCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>Your answer: {rootCauseUser || '-'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-yellow-50 border-l-4 border-yellow-400 rounded p-0.5">
                      <span className="font-bold text-yellow-700 text-[10px] leading-tight">⚡ Impact Assessment</span>
                      <div className="flex flex-row justify-between items-center w-full text-[9px]">
                        <span className="text-gray-800">Correct: {impactCorrect}</span>
                        <span className={impactIsCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>Your answer: {impactUser || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Learning Insight */}
                <div className="mt-0.5 bg-blue-50 border-l-4 border-blue-400 rounded p-0.5 flex flex-col">
                  <span className="font-bold text-blue-700 text-[10px] leading-tight">💡 Learning Insight</span>
                  <span className="text-gray-800 text-[9px] flex items-center mt-0.5 leading-tight"><span className="mr-1" role="img" aria-label="book">📚</span>This case highlights areas for improvement. Focus on understanding the interconnections between GMP violations and their underlying causes.</span>
                </div>
                {/* Next Case button - only show if not last case */}
                {gameState.currentCase < cases.length - 1 }
                {/* Summary message at the bottom */}
                <div className="flex flex-col items-start justify-center bg-yellow-50 border-l-4 border-yellow-500 p-0.5 w-full rounded mt-1">
                  <div className="flex items-center  min-h-[18px] py-0.5">
                    <span className="text-yellow-700 font-medium text-[9px] md:text-xs mr-1 leading-tight">Needs Improvement - You must get all answers correct to continue</span>
                    <AlertTriangle className="w-3 h-3 min-w-2 min-h-2 text-yellow-500 mr-1" />
                    <span className="ml-1 text-xs" role="img" aria-label="book">📚</span>
                  </div>
                  <div className="text-gray-800 text-[9px] md:text-xs font-semibold text-start pl-[10%] w-full bg-transparent mt-0.5 leading-tight">Case analysis complete - Review your results</div>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between mt-[1vw] w-[100%]">
            <button
              onClick={handleBack}
              disabled={isAllCorrect}
              className={`px-[1vw] py-[0.5vw] min-px-2 min-py-1 rounded-lg font-semibold flex items-center space-x-1 text-xs md:text-sm transition-all duration-300 ${
                isAllCorrect
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-[0.7vw] h-[0.7vw] min-w-3 min-h-3" />
              <span>Back</span>
            </button>
            {isAllCorrect && (
              <button
                onClick={handleContinue}
                className="px-[2vw] py-[0.8vw] min-px-4 min-py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold flex items-center space-x-2 shadow-lg text-xs md:text-sm"
              >
                <span>{gameState.currentCase < cases.length - 1 ? 'Next Case' : 'Complete Game'}</span>
                <ChevronRight className="w-[1vw] h-[1vw] min-w-4 min-h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  switch (currentPhase) {
    case 'login':
      return renderLogin();
    case 'reportView':
      return renderReportView();
    case 'step1':
    case 'step2':
    case 'step3':
      return renderInvestigationStep();
    case 'feedback':
      return renderFeedback();
    default:
      return renderLogin();
  }
};
