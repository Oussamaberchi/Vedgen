import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Img } from 'remotion';

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
    <div className="absolute top-16 left-12 flex items-center gap-6 bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-full border-2 border-slate-700 shadow-2xl z-50">
      <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-black text-3xl">
        EC
      </div>
      <span className="text-white font-bold text-4xl tracking-tight">EduClip AI</span>
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
      className="absolute top-16 right-12 flex flex-col gap-6 z-50"
      style={{ 
        transform: `translateY(${interpolate(translateY, [0, 1], [-100, 0])}px)`,
        opacity
      }}
    >
      <div className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-3xl shadow-2xl flex items-center gap-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.43a2.506 2.506 0 0 0-1.762 1.766C2.007 8.771 2 12 2 12s.007 3.229.407 4.797a2.506 2.506 0 0 0 1.762 1.766C5.736 18.993 12 19 12 19s6.265.007 7.831-.43a2.506 2.506 0 0 0 1.762-1.766C21.993 15.229 22 12 22 12s-.007-3.229-.407-4.797zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
        Subscribe
      </div>
      <div className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-3xl shadow-2xl flex items-center gap-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        Like
      </div>
    </div>
  );
};

const CircularCountdown: React.FC<{ progress: number, countdown: number }> = ({ progress, countdown }) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center mb-16 z-10">
      <svg width="240" height="240" className="transform -rotate-90">
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="16"
          fill="none"
        />
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="#f59e0b" // amber-500
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute text-[6rem] font-black text-white">
        {countdown}
      </div>
    </div>
  );
};

const IntroScene: React.FC<{ topic: string }> = ({ topic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = "Test Your English!".split(" ");

  const topicScale = spring({
    frame: frame - 25,
    fps,
    config: { mass: 1.5, damping: 12, stiffness: 100 },
  });

  const readyOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="bg-slate-950 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      <AbsoluteFill>
        <Img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1080&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40"
          style={{ filter: 'blur(8px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </AbsoluteFill>

      <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center w-full">
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {words.map((word, i) => {
            const wordScale = spring({
              frame: frame - (i * 5),
              fps,
              config: { damping: 12 }
            });
            return (
              <span key={i} style={{ transform: `scale(${wordScale})`, display: 'inline-block' }} className="text-[8rem] font-black tracking-tight drop-shadow-2xl leading-tight text-white">
                {word}
              </span>
            )
          })}
        </div>
        
        <div 
          style={{ transform: `scale(${topicScale})` }}
          className="bg-amber-500 px-16 py-8 rounded-full shadow-[0_0_80px_rgba(245,158,11,0.4)] mb-20 max-w-[90%]"
        >
          <h2 className="text-[4.5rem] font-black text-slate-950 uppercase tracking-widest truncate">
            {topic || "General Knowledge"}
          </h2>
        </div>
        
        <p 
          style={{ opacity: readyOpacity }}
          className="text-[4rem] font-bold text-slate-300 animate-pulse"
        >
          Are you ready? Let's go! 🚀
        </p>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const iconsOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });
  const iconsY = interpolate(frame, [30, 45], [50, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="bg-slate-950 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      <AbsoluteFill>
        <Img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1080&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40"
          style={{ filter: 'blur(8px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      </AbsoluteFill>

      <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center w-full">
        <div style={{ transform: `scale(${textScale})` }} className="mb-24">
          <h1 className="text-[8rem] font-black text-amber-500 mb-8 drop-shadow-2xl leading-tight">How was<br/>your score?</h1>
          <h2 className="text-[5rem] font-bold text-white drop-shadow-xl">Did you get 100%? 💯</h2>
        </div>

        <div 
          style={{ opacity: iconsOpacity, transform: `translateY(${iconsY}px)` }}
          className="flex flex-col items-center gap-12 w-full max-w-3xl"
        >
          <div className="bg-slate-800/90 backdrop-blur-md border-4 border-slate-600 p-10 rounded-[3rem] w-full shadow-2xl">
            <p className="text-[3.5rem] font-bold text-white mb-2">Let us know in the comments! 👇</p>
          </div>
          
          <div className="flex gap-8 w-full">
            <div className="flex-1 bg-blue-600 p-10 rounded-[3rem] flex flex-col items-center justify-center gap-6 shadow-2xl">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              <span className="text-[3rem] font-bold">Like</span>
            </div>
            <div className="flex-1 bg-red-600 p-10 rounded-[3rem] flex flex-col items-center justify-center gap-6 shadow-2xl">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.43a2.506 2.506 0 0 0-1.762 1.766C2.007 8.771 2 12 2 12s.007 3.229.407 4.797a2.506 2.506 0 0 0 1.762 1.766C5.736 18.993 12 19 12 19s6.265.007 7.831-.43a2.506 2.506 0 0 0 1.762-1.766C21.993 15.229 22 12 22 12s-.007-3.229-.407-4.797zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
              <span className="text-[3rem] font-bold">Subscribe</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuestionScene: React.FC<{ question: Question; index: number; total: number }> = ({ question, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const parts = question.question.split('___');
  const hasBlank = parts.length > 1;

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 15], [50, 0], { extrapolateRight: 'clamp' });

  const optionsOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const revealFrame = 6 * fps;
  const moveFrame = revealFrame + 15; // 0.5s after reveal, start moving

  const isRevealed = frame >= revealFrame;

  const countdown = Math.max(0, 5 - Math.floor((frame - 1 * fps) / fps));
  const showCountdown = frame > 1 * fps && frame < revealFrame;
  
  const timerProgress = interpolate(
    frame,
    [1 * fps, revealFrame],
    [100, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const wrongOpacity = interpolate(frame, [revealFrame, revealFrame + 10], [1, 0], { extrapolateRight: 'clamp' });
  const correctOptionOpacity = interpolate(frame, [moveFrame, moveFrame + 10], [1, 0], { extrapolateRight: 'clamp' });
  
  const blankFillOpacity = interpolate(frame, [moveFrame, moveFrame + 10], [0, 1], { extrapolateRight: 'clamp' });
  const blankFillScale = spring({ frame: frame - moveFrame, fps, config: { damping: 12 } });

  const explanationOpacity = interpolate(frame, [moveFrame + 10, moveFrame + 25], [0, 1], { extrapolateRight: 'clamp' });
  const explanationY = interpolate(frame, [moveFrame + 10, moveFrame + 25], [50, 0], { extrapolateRight: 'clamp' });

  const options = [
    { text: question.correctAnswer, isCorrect: true },
    { text: question.distractor1, isCorrect: false },
    { text: question.distractor2, isCorrect: false },
  ].sort((a, b) => a.text.localeCompare(b.text)); // Simple deterministic shuffle based on text

  return (
    <AbsoluteFill className="bg-slate-950 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Image with Overlay */}
      <AbsoluteFill>
        <Img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1080&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40"
          style={{ filter: 'blur(8px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      </AbsoluteFill>

      <div className="relative z-10 w-full h-full p-12 flex flex-col items-center justify-center">
        <ChannelBadge />
        {index === 0 && <SubscribeReminder />}

        <div className="absolute top-40 left-12 right-12 flex justify-center items-center text-amber-500 text-[2.5rem] font-bold tracking-widest uppercase">
          <span>Question {index + 1} of {total}</span>
        </div>

        <div 
          style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}
          className="text-[4.5rem] font-bold text-center mb-16 leading-tight z-10 drop-shadow-2xl px-8"
        >
          {hasBlank ? (
            <>
              {parts[0]}
              <span className="inline-block relative mx-4 text-slate-400">
                <span style={{ opacity: 1 - blankFillOpacity }}>___</span>
                <span 
                  className="absolute left-1/2 top-1/2 text-emerald-400 whitespace-nowrap font-black"
                  style={{ 
                    opacity: blankFillOpacity, 
                    transform: `translate(-50%, -50%) scale(${blankFillScale})` 
                  }}
                >
                  {question.correctAnswer}
                </span>
              </span>
              {parts[1]}
            </>
          ) : (
            question.question
          )}
        </div>

        {showCountdown ? (
          <CircularCountdown progress={timerProgress} countdown={countdown} />
        ) : (
          <div className="h-[240px] mb-16" /> // Spacer to keep layout stable
        )}

        <div 
          style={{ opacity: optionsOpacity }}
          className="w-full max-w-3xl flex flex-col gap-8 z-10"
        >
          {options.map((opt, i) => {
            const isCorrect = opt.isCorrect;
            const isRevealedNow = frame >= revealFrame;
            
            let bgColor = 'bg-slate-800/80 backdrop-blur-sm';
            let borderColor = 'border-slate-600';
            let textColor = 'text-white';
            let itemOpacity = 1;
            
            if (isRevealedNow) {
              if (isCorrect) {
                bgColor = 'bg-emerald-500';
                borderColor = 'border-emerald-400';
                textColor = 'text-slate-950';
                itemOpacity = hasBlank ? correctOptionOpacity : 1;
              } else {
                bgColor = 'bg-red-900/80 backdrop-blur-sm';
                borderColor = 'border-red-700';
                textColor = 'text-white/50';
                itemOpacity = wrongOpacity;
              }
            }

            return (
              <div 
                key={i}
                style={{ opacity: itemOpacity }}
                className={`p-10 rounded-[2rem] border-4 text-[3.5rem] font-semibold transition-colors duration-300 shadow-2xl ${bgColor} ${borderColor} ${textColor}`}
              >
                {opt.text}
              </div>
            );
          })}
        </div>

        {frame >= moveFrame && (
          <div 
            style={{ opacity: explanationOpacity, transform: `translateY(${explanationY}px)` }}
            className="absolute bottom-32 left-12 right-12 bg-amber-500 p-10 rounded-[2rem] text-[3rem] text-center shadow-2xl z-20 text-slate-950"
          >
            <span className="font-black block mb-4 uppercase tracking-wider text-slate-800 text-[2.5rem]">Explanation</span>
            <span className="font-medium leading-snug">{question.explanation}</span>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-900 z-50">
        <div 
          className="h-full bg-amber-500"
          style={{ width: `${((index + (frame / (10 * fps))) / total) * 100}%` }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const EduClipVideo: React.FC<EduClipVideoProps> = ({ questions, topic }) => {
  const { fps } = useVideoConfig();
  const introDuration = 4 * fps; // 4 seconds intro
  const outroDuration = 5 * fps; // 5 seconds outro
  const durationPerQuestion = 10 * fps; // 10 seconds per question

  if (!questions || questions.length === 0) {
    return (
      <AbsoluteFill className="bg-slate-950 text-white flex items-center justify-center text-4xl font-bold">
        No questions available
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="bg-slate-950">
      {/* Intro Sequence */}
      <Sequence from={0} durationInFrames={introDuration}>
        <IntroScene topic={topic} />
      </Sequence>

      {/* Questions Sequences */}
      {questions.map((q, index) => (
        <Sequence
          key={q.id}
          from={introDuration + (index * durationPerQuestion)}
          durationInFrames={durationPerQuestion}
        >
          <QuestionScene question={q} index={index} total={questions.length} />
        </Sequence>
      ))}

      {/* Outro Sequence */}
      <Sequence 
        from={introDuration + (questions.length * durationPerQuestion)} 
        durationInFrames={outroDuration}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
