import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI, Type } from '@google/genai';
import { Player } from '@remotion/player';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Progress } from '@/src/components/ui/progress';
import { Loader2, Play, Settings, Video, Download, Edit3, Wand2 } from 'lucide-react';
import { EduClipVideo, Question } from '@/src/components/video/EduClipVideo';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (topicInput: string) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 multiple-choice questions about English grammar or vocabulary focusing on: ${topicInput}. Each question should have 1 correct answer and 2 common distractors (mistakes learners often make). Provide a brief explanation of why the correct answer is right.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'A unique identifier for the question' },
                question: { type: Type.STRING, description: 'The question text' },
                correctAnswer: { type: Type.STRING, description: 'The correct answer' },
                distractor1: { type: Type.STRING, description: 'The first incorrect answer' },
                distractor2: { type: Type.STRING, description: 'The second incorrect answer' },
                explanation: { type: Type.STRING, description: 'Explanation of the correct answer' },
              },
              required: ['id', 'question', 'correctAnswer', 'distractor1', 'distractor2', 'explanation'],
            },
          },
        },
      });

      const jsonStr = response.text?.trim() || '[]';
      return JSON.parse(jsonStr) as Question[];
    },
    onSuccess: (data) => {
      setQuestions(data);
    },
    onError: (error) => {
      console.error('Failed to generate questions:', error);
      alert(t('error'));
    }
  });

  const handleGenerate = () => {
    if (!topic) return;
    generateMutation.mutate(topic);
  };

  const handleRender = async () => {
    if (questions.length === 0) return;
    setIsRendering(true);
    setRenderProgress(0);
    setRenderUrl(null);

    // Simulate rendering process
    const totalSteps = 20;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRenderProgress((i / totalSteps) * 100);
    }

    // Mock successful render
    setRenderUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setIsRendering(false);
  };

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">EduClip AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-zinc-100 dark:bg-zinc-800 border-none text-sm rounded-md px-2 py-1"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">AR</option>
          </select>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
        {/* Topic Input */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('topic')}</CardTitle>
            <CardDescription>What should the video be about?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder={t('topicPlaceholder')} 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={!topic || generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('generating')}</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> {t('generate')}</>
              )}
            </Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview"><Play className="w-4 h-4 mr-2" /> {t('preview')}</TabsTrigger>
              <TabsTrigger value="edit"><Edit3 className="w-4 h-4 mr-2" /> {t('review')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-4 space-y-4">
              <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black aspect-[9/16] relative shadow-lg">
                <Player
                  component={EduClipVideo}
                  inputProps={{ questions, topic }}
                  durationInFrames={questions.length * 300} // 10s per question at 30fps
                  compositionWidth={1080}
                  compositionHeight={1920}
                  fps={30}
                  style={{ width: '100%', height: '100%' }}
                  controls
                  autoPlay
                  loop
                />
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  {isRendering ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{t('rendering')}</span>
                        <span>{Math.round(renderProgress)}%</span>
                      </div>
                      <Progress value={renderProgress} />
                    </div>
                  ) : renderUrl ? (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                      <a href={renderUrl} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4 mr-2" /> {t('download')}
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleRender}>
                      <Video className="w-4 h-4 mr-2" /> {t('render')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-4 space-y-4">
              {questions.map((q, index) => (
                <Card key={q.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-zinc-500">Question {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">{t('question')}</label>
                      <Textarea 
                        value={q.question} 
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-emerald-600">{t('correctAnswer')}</label>
                      <Input 
                        value={q.correctAnswer} 
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                        className="border-emerald-200 dark:border-emerald-900/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-red-600">{t('distractor1')}</label>
                        <Input 
                          value={q.distractor1} 
                          onChange={(e) => updateQuestion(index, 'distractor1', e.target.value)}
                          className="border-red-200 dark:border-red-900/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-red-600">{t('distractor2')}</label>
                        <Input 
                          value={q.distractor2} 
                          onChange={(e) => updateQuestion(index, 'distractor2', e.target.value)}
                          className="border-red-200 dark:border-red-900/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">{t('explanation')}</label>
                      <Textarea 
                        value={q.explanation} 
                        onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
