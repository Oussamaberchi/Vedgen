import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "generate": "Generate Script",
      "topic": "Topic",
      "topicPlaceholder": "e.g., Present Simple vs Continuous",
      "questions": "Questions",
      "review": "Review & Edit",
      "render": "Render Video",
      "rendering": "Rendering...",
      "success": "Video Ready!",
      "error": "An error occurred",
      "language": "Language",
      "english": "English",
      "french": "French",
      "arabic": "Arabic",
      "preview": "Video Preview",
      "queue": "Render Queue",
      "settings": "Settings",
      "noQuestions": "No questions generated yet. Enter a topic and click Generate.",
      "question": "Question",
      "correctAnswer": "Correct Answer",
      "distractor1": "Distractor 1",
      "distractor2": "Distractor 2",
      "explanation": "Explanation",
      "save": "Save Changes",
      "generating": "Generating...",
      "download": "Download Video"
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de Bord",
      "generate": "Générer le Script",
      "topic": "Sujet",
      "topicPlaceholder": "ex: Présent Simple vs Continu",
      "questions": "Questions",
      "review": "Réviser & Éditer",
      "render": "Rendre la Vidéo",
      "rendering": "Rendu en cours...",
      "success": "Vidéo Prête!",
      "error": "Une erreur est survenue",
      "language": "Langue",
      "english": "Anglais",
      "french": "Français",
      "arabic": "Arabe",
      "preview": "Aperçu Vidéo",
      "queue": "File d'attente",
      "settings": "Paramètres",
      "noQuestions": "Aucune question générée. Entrez un sujet et cliquez sur Générer.",
      "question": "Question",
      "correctAnswer": "Bonne Réponse",
      "distractor1": "Distracteur 1",
      "distractor2": "Distracteur 2",
      "explanation": "Explication",
      "save": "Enregistrer",
      "generating": "Génération...",
      "download": "Télécharger la Vidéo"
    }
  },
  ar: {
    translation: {
      "dashboard": "لوحة القيادة",
      "generate": "توليد النص",
      "topic": "الموضوع",
      "topicPlaceholder": "مثال: المضارع البسيط مقابل المستمر",
      "questions": "الأسئلة",
      "review": "مراجعة وتعديل",
      "render": "إنتاج الفيديو",
      "rendering": "جاري الإنتاج...",
      "success": "الفيديو جاهز!",
      "error": "حدث خطأ",
      "language": "اللغة",
      "english": "الإنجليزية",
      "french": "الفرنسية",
      "arabic": "العربية",
      "preview": "معاينة الفيديو",
      "queue": "قائمة الانتظار",
      "settings": "الإعدادات",
      "noQuestions": "لم يتم إنشاء أسئلة بعد. أدخل موضوعًا وانقر على توليد.",
      "question": "السؤال",
      "correctAnswer": "الإجابة الصحيحة",
      "distractor1": "مشتت 1",
      "distractor2": "مشتت 2",
      "explanation": "الشرح",
      "save": "حفظ التغييرات",
      "generating": "جاري التوليد...",
      "download": "تنزيل الفيديو"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
