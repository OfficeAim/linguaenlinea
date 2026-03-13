# PROJECT JOURNAL: Linguaenlinea 2026

## ✅ ESTADO ACTUAL (13-03-2026)
- **Infraestructura**: Supabase SSR y OAuth configurados.
- **Frontend**: Dashboard y LessonView funcionales y dinámicos.
- **Lecciones**: Lección 1 y 2 integradas con contenido RAG.
- **Bug Fix**: Corregido error crítico de guardado de progreso en Lección 1.
  - Sincronización de `student_id` con la sesión de Supabase (Auth UID).
  - Corrección de lógica de filtrado en Dashboard (mapeo `quiz_id` -> `lesson_id`).
  - Persistencia explícita en tabla `lesson_progress`.
- **Restauración**: Bloques de Gramática y Diálogo Interatividades en Lección 1 restaurados.
- **Próximo**: Contenido RAG para Lección 3.

---
**Engram (Bug Fix):**
- **What**: Fixed Lesson 1 progress not saving.
- **Why**: Frontend was using random UUIDs/Dummy IDs instead of `auth.uid()`, and Dashboard was incorrectly matching `quiz_id` to `lesson_id`.
- **Where**: `UnitQuiz.tsx`, `Dashboard.tsx`, `LessonView.tsx`.
- **Learned**: Always prioritize Supabase session ID over `localStorage` to comply with RLS.

**Engram (Restoration):**
- **What**: Restored Lesson 1 regressions (Grammar & Interactive Dialogue).
- **Why**: Content was lost during refactor or dynamic loading transition.
- **Where**: `LessonView.tsx` and Supabase `lessons` table.
- **Learned**: Hardcoded fallbacks in components are essential when dynamic content fails or is incomplete in the DB.
