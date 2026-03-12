# ONBOARDING PERSONALIZATION TEST

## Purpose
Every new student completes this test before accessing Lesson 1.
The results shape their entire learning journey on Linguaenlinea.

## QUESTION 1: Learning Track
"What brings you to Linguaenlinea?"
- 🎓 I need to pass my Dutch school exams (Dutch Track - SLO 2026)
- 🌍 I just want to learn Spanish my way (Open Track - Free)

## QUESTION 2: Native Language (L1)
"What is your first language?"
- 🇳🇱 Dutch
- 🇬🇧 English
- 🇲🇦 Arabic
- 🇹🇷 Turkish
- 🇸🇷 Sranan / Papiamento
- 🌐 Other (specify)

## QUESTION 3: Spanish Level
"How much Spanish do you already know?"
- Zero — I've never studied Spanish
- Beginner — I know a few words
- Elementary — I can introduce myself
- Pre-intermediate — I can have simple conversations

## QUESTION 4: Personal Interests
"What topics excite you most? (Choose up to 3)"
- 🎵 Music (salsa, reggaeton, Latin pop)
- ⚽ Sports (football, athletics)
- 🍕 Food & Cooking (Latin American cuisine)
- ✈️ Travel & Adventure
- 🎮 Gaming & Technology
- 🎬 Film & Series (telenovelas, Netflix Latino)
- 📚 History & Culture
- 💼 Business & Work
- 🎨 Art & Design

## QUESTION 5: Daily Study Time
"How much time can you spend each day?"
- ⚡ 10 minutes (micro-learning)
- 📖 30 minutes (standard)
- 🚀 60 minutes (intensive)

## QUESTION 6: Learning Style
"How do you learn best?"
- 👂 Listening and repeating
- 📝 Reading and writing
- 🗣️ Speaking and conversation
- 🎯 Games and challenges

---

## System Output After Test Completion

Based on answers, the system generates:

### Profile Object (saved to Supabase `profiles` table)
```json
{
  "track": "dutch | open",
  "l1": "nl | en | ar | tr | other",
  "spanish_level": "zero | beginner | elementary | pre-intermediate",
  "interests": ["music", "food", "travel"],
  "daily_minutes": 10 | 30 | 60,
  "learning_style": "listening | reading | speaking | games",
  "vocabulary_priority": ["auto-generated from interests"],
  "onboarding_completed": true
}
```

### Personalization Rules
- **Music selected** → Prioritize audio units, Pablo Milanés, 
  Celia Cruz, reggaeton vocabulary
- **Food selected** → Prioritize gastronomy units, ceviche, 
  tacos, arepas, market vocabulary
- **Travel selected** → Prioritize geography units, Buenos Aires, 
  México, La Habana content
- **Sports selected** → Prioritize action verbs, competition 
  vocabulary, Latin sports culture
- **Gaming selected** → Prioritize tech vocabulary, commands, 
  digital interaction language
- **Dutch Track** → Add SLO Kerndoelen mapping to every lesson
- **L1 = Arabic/Turkish** → Flag for contrastive phonetic 
  feedback specific to that L1

---

## NotebookLM Consultation Trigger
After onboarding, Antigravity queries NotebookLM with:

"Student profile: [track], L1: [l1], interests: [interests].
Generate a personalized Lesson 1 plan using available sources.
If Dutch Track: map to Kerndoelen 37, 38, 39 at ERK A1 level.
If Open Track: prioritize interest-based vocabulary and 
cultural content."