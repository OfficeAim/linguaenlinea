# Specification: Lesson 2 Content Generation (Pedagogical RAG)
## Project: Linguaenlinea 2026

## 1. Overview
This document specifies the pedagogical content for **Unit 1, Lesson 2: "El aula"**. This content is grounded in the *Aprendamos Español* corpus via NotebookLM and aligned with the **Dutch SLO 2026** framework.

## 2. Pedagogical Grounding (RAG Results)
- **Source**: *Aprendamos Español* Volume I, Unit 1.
- **Context**: A Spanish classroom in Cuba with international students ("extranjeros").
- **Communicative Functions**:
    - Identifying objects using demonstratives.
    - Describing physical properties (material, color).
    - Expressing quantity and existence (*Hay*).

## 3. Content Modules

### A. Context (Lee y comprende)
**Authentic Dialogue**: 
- *Setting*: Two students talking outside a classroom.
- *Text*:
    > — Por favor, compañero, ¿los alumnos de este grupo son cubanos?
    > — No, son extranjeros.
    > — ¿Cuántos alumnos hay en esta aula?
    > — Hay diez.
    > — ¿Y en esa también?
    > — No, en esa aula hay doce.
    > — ¿Aquel compañero es el profesor de este grupo?
    > — No, la profesora es aquella.

### B. Vocabulary (Classroom Elements)
- **Basics**: *aula (f)*, *profesor/maestro*, *alumno/estudiante*.
- **Tools**: *pizarrón (m)*, *tiza (f)*, *mochila (f)*, *libro (m)*, *libreta (f)*, *revista (f)*.
- **Stationery**: *lápiz (m)*, *bolígrafo/pluma*, *borrador (m)*, *goma (f)*, *regla (f)*.
- **Furniture**: *mesa (f)*, *silla (f)*, *lámpara (f)*, *reloj (m)*.

### C. Grammar (Gender & Plurals)
1.  **Special Gender Case**: *El aula* (Feminine noun starting with stressed 'a' takes 'el' in singular).
2.  **Plurals**:
    - Vowel + *-s*: *la mesa* -> *las mesas*.
    - Consonant + *-es*: *el profesor* -> *los profesores*.
    - *-z* -> *-ces*: *el lápiz* -> *los lápices*.
3.  **Existence**: *¿Cuantos... hay?* / *Hay diez*.

### D. Dutch Track Alignment (L1 Sensitivity)
- **SLO 2026**: Luisteren naar instructies (1F) & Informatie uitwisselen (1F/2F).
- **Contrastive Note**: 
    - *Dutch*: "Het lokaal" (Neuter).
    - *Spanish*: "El aula" (Feminine but uses 'el'). 
    - Explain the "accent rule" (stressed 'a') to avoid *la-aula*.

## 4. Proposed Lesson Structure (UI/UX)
1.  **Tab 1: Understand (Begrijp)** 
    - Video: Whiteboard animation of "El aula".
    - Dialogue: Interactive audio player with the "extranjeros" text.
2.  **Tab 2: Explore (Ontdek)**
    - "El" vs "La" matching game for classroom objects.
    - Infographic: "El mundo de los lápices" (explaining plurals).
3.  **Tab 3: Practice (Oefen)**
    - *¿Qué es esto?*: Image-based identification exercises.
    - *¿Cuántos hay?*: Counting objects in a classroom image.
4.  **Tab 4: Communicate (Spreek)**
    - Cultural Pill: "The International Students in Cuba" (Contextualizing the corpus).
    - Achievement: "Master of the Classroom" badge.

## 5. Next Steps for Implementer
1.  Update `lessons` table with `content_json` and `video_url` (after generation).
2.  Create a dedicated JSON structure for the `VocabularyMatchingGame` in this lesson.
3.  Generate the "El aula" video script for AI video generation.
