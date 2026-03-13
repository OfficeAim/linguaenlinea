# PROJECT JOURNAL: Linguaenlinea 2026

## ✅ ESTADO ACTUAL (13-03-2026)
- **Infraestructura**: Supabase SSR y OAuth configurados.
- **Frontend**: Dashboard y LessonView funcionales y dinámicos.
- **Lecciones**: Lección 1 y 2 integradas con contenido RAG.
- **Bug Fix**: Corregido error crítico de guardado de progreso en Lección 1.
  - Sincronización de `student_id` con la sesión de Supabase (Auth UID).
  - Corrección de lógica de filtrado en Dashboard (mapeo `quiz_id` -> `lesson_id`).
  - Persistencia explícita en tabla `lesson_progress`.
- **Próximo**: Contenido RAG para Lección 3.

---
**Engram (Bug Fix):**
- **What**: Fixed Lesson 1 progress not saving.
- **Why**: Frontend was using random UUIDs/Dummy IDs instead of `auth.uid()`, and Dashboard was incorrectly matching `quiz_id` to `lesson_id`.
- **Where**: `UnitQuiz.tsx`, `Dashboard.tsx`, `LessonView.tsx`.
- **Learned**: Always prioritize Supabase session ID over `localStorage` to comply with RLS.
