import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export type Question = {
  id: string;
  question: string;
  correctAnswer: string;
  distractor1: string;
  distractor2: string;
  explanation: string;
};

export type EduClipVideoProps = {
  questions: Question[];
  topic: string;
};

const ChannelBadge: React.FC = () => {
  return (
    <div className="absolute top-12 left-12 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800 shadow-xl z-50">
      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
        EC
      </div>
      <span className="text-white font-bold text-2xl tracking-tight">EduClip AI</span>
    </div>
  );
};

const SubscribeReminder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const translateY = spring({
    frame: frame - 2 * fps, // Start animation after 2 seconds
    fps,
    config: { damping: 12 },
  });

  const opacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <div 
      className="absolute top-12 right-12 flex flex-col gap-4 z-50"
      style={{ 
        transform: `translateY(${interpolate(translateY, [0, 1], [-100, 0])}px)`,
        opacity
      }}
    >
      <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg flex items-center gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.43a2.506 2.506 0 0 0-1.762 1.766C2.007 8.771 2 12 2 12s.007 3.229.407 4.797a2.506 2.506 0 0 0 1.762 1.766C5.736 18.993 12 19 12 19s6.265.007 7.831-.43a2.506 2.506 0 0 0 1.762-1.766C21.993 15.229 22 12 22 12s-.007-3.229-.407-4.797zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
        Subscribe
      </div>
      <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg flex items-center gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        Like
      </div>
    </div>
  );
};

const QuestionScene: React.FC<{ question: Question; index: number; total: number }> = ({ question, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Scene duration: 10 seconds total
  // 0-1s: Intro question
  // 1-6s: Countdown & options
  // 6-10s: Reveal answer & explanation

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 15], [50, 0], { extrapolateRight: 'clamp' });

  const optionsOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const revealFrame = 6 * fps;
  const isRevealed = frame >= revealFrame;

  const countdown = Math.max(0, 5 - Math.floor((frame - 1 * fps) / fps));
  const showCountdown = frame > 1 * fps && frame < revealFrame;
  
  const timerProgress = interpolate(
    frame,
    [1 * fps, revealFrame],
    [100, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const options = [
    { text: question.correctAnswer, isCorrect: true },
    { text: question.distractor1, isCorrect: false },
    { text: question.distractor2, isCorrect: false },
  ].sort((a, b) => a.text.localeCompare(b.text)); // Simple deterministic shuffle based on text

  return (
    <AbsoluteFill className="bg-zinc-950 text-white p-12 flex flex-col items-center justify-center font-sans">
      <ChannelBadge />
      {index === 0 && <SubscribeReminder />}

      <div className="absolute top-32 left-12 right-12 flex justify-center items-center text-zinc-400 text-2xl font-bold">
        <span>Question {index + 1}/{total}</span>
      </div>

      {showCountdown && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-10 pointer-events-none z-0">
          <div className="text-[24rem] font-black text-indigo-500 leading-none">
            {countdown}
          </div>
        </div>
      )}

      <div 
        style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}
        className="text-6xl font-bold text-center mb-16 leading-tight z-10"
      >
        {question.question}
      </div>

      {showCountdown && (
        <div className="w-full max-w-2xl h-4 bg-zinc-800 rounded-full mb-8 overflow-hidden z-10">
          <div 
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${timerProgress}%` }}
          />
        </div>
      )}

      <div 
        style={{ opacity: optionsOpacity }}
        className="w-full max-w-2xl flex flex-col gap-6 z-10"
      >
        {options.map((opt, i) => {
          const isSelected = isRevealed && opt.isCorrect;
          const isWrong = isRevealed && !opt.isCorrect;
          
          let bgColor = 'bg-zinc-800';
          let borderColor = 'border-zinc-700';
          
          if (isRevealed) {
            if (opt.isCorrect) {
              bgColor = 'bg-emerald-600';
              borderColor = 'border-emerald-500';
            } else {
              bgColor = 'bg-red-900/50';
              borderColor = 'border-red-900';
            }
          }

          return (
            <div 
              key={i}
              className={`p-8 rounded-2xl border-4 text-4xl font-semibold transition-colors duration-500 ${bgColor} ${borderColor}`}
            >
              {opt.text}
            </div>
          );
        })}
      </div>

      {isRevealed && (
        <div 
          style={{ opacity: interpolate(frame, [revealFrame, revealFrame + 15], [0, 1], { extrapolateRight: 'clamp' }) }}
          className="absolute bottom-24 left-12 right-12 bg-indigo-600 p-8 rounded-2xl text-3xl text-center shadow-2xl z-20"
        >
          <span className="font-bold block mb-2">Explanation:</span>
          {question.explanation}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-zinc-900 z-50">
        <div 
          className="h-full bg-indigo-500"
          style={{ width: `${((index + (frame / (10 * fps))) / total) * 100}%` }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const EduClipVideo: React.FC<EduClipVideoProps> = ({ questions, topic }) => {
  const { fps } = useVideoConfig();
  const durationPerQuestion = 10 * fps; // 10 seconds per question

  if (!questions || questions.length === 0) {
    return (
      <AbsoluteFill className="bg-zinc-950 text-white flex items-center justify-center text-4xl font-bold">
        No questions available
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="bg-zinc-950">
      {questions.map((q, index) => (
        <Sequence
          key={q.id}
          from={index * durationPerQuestion}
          durationInFrames={durationPerQuestion}
        >
          <QuestionScene question={q} index={index} total={questions.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
