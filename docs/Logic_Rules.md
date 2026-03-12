# APPLICATION BUSINESS RULES & LOGIC

## 1. PROGRESSION SYSTEM
- **Sequential Locking:** Initially, only Lesson 1 is unlocked.
- **Lock Rule:** Lesson N+1 remains locked until Lesson N is 
  marked "Completed".
- **Completion Criteria:** A lesson is "Completed" only when 
  the student passes the Unit Quiz with a score of 70% or higher.
- **Track Awareness:** Dutch Track lessons also display their 
  SLO Kerndoel alignment (e.g., "Kerndoel 38A - ERK A1").

## 2. REMEDIATION & QUIZ LOGIC
- **Attempts:** Maximum 3 attempts per quiz.
- **Fail Attempt 2:** System suggests reviewing specific parts 
  of the current lesson.
- **Fail Attempt 3:** 
  - Quiz blocked for 24 hours.
  - Automatic alert sent to Admin Dashboard.
- **Manual Reset:** Admins can manually reset attempts via Dashboard.

## 3. ONBOARDING & PERSONALIZATION
- **Mandatory Test:** Every new student completes a 
  Personalization Test before accessing Lesson 1.
- **Test captures:**
  - Native language (L1)
  - Learning track (Dutch Track / Open Track)
  - Personal interests (music, food, travel, sports, gaming, etc.)
  - Available study time per day
  - Prior Spanish knowledge level
- **Result:** System generates a personalized vocabulary 
  priority list and suggests a learning path.
- **Storage:** All preferences saved in `profiles` table 
  in Supabase.

## 4. ADMIN DASHBOARD REQUIREMENTS
- **KPIs:** Total registered students, active users, 
  completion rates per lesson.
- **Monitoring:** Real-time tracking of individual 
  student progress.
- **Support Tools:** Password reset, Bug Report viewer, 
  manual quiz reset.
- **Cost Control:** API usage monitoring dashboard.
- **Track Analytics:** Separate metrics for Dutch Track 
  vs Open Track users.

## 5. ACCESS MODEL
- **Open Track:** 100% free, no payment gateway.
- **Dutch Track:** Free during Phase 1. Institutional 
  licensing model planned for Phase 2.

## 6. LANGUAGE PROTOCOL
- **Default:** Dutch-Spanish interface.
- **Alternative:** English-Spanish.
- **Future:** Any L1-Spanish combination.
- **Storage:** Language preference saved in `profiles` table.

## 7. NOTIFICATION SYSTEM (via N8N)
- Welcome email on registration.
- Alert to admin on 3rd failed quiz attempt.
- Weekly progress report to student.
- All notifications routed through N8N — 
  no hardcoded notification logic in the app.