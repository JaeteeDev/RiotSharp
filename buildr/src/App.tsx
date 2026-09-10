import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { Onboarding } from './pages/Onboarding'
import { Splash } from './pages/Splash'
import { Dashboard } from './pages/Dashboard'
import { Course } from './pages/Course'
import { LearningArea } from './pages/LearningArea'
import { Module } from './pages/Module'
import { UnitDetail } from './pages/UnitDetail'
import { LessonViewer } from './pages/LessonViewer'
import { Workshop } from './pages/Workshop'
import { PlanLab } from './pages/PlanLab'
import { Calculators } from './pages/Calculators'
import { QuizCentre } from './pages/QuizCentre'
import { QuizSession } from './pages/QuizSession'
import { Flashcards } from './pages/Flashcards'
import { Reference } from './pages/Reference'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { About } from './pages/About'
import { useAppStore } from './store/useAppStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.getElementById('buildr-scroll-root')?.scrollTo(0, 0)
  }, [pathname])
  return null
}

function TrackPath() {
  const { pathname } = useLocation()
  const setLastVisitedPath = useAppStore((s) => s.setLastVisitedPath)
  const touchStreak = useAppStore((s) => s.touchStreak)
  useEffect(() => {
    setLastVisitedPath(pathname)
    touchStreak()
  }, [pathname, setLastVisitedPath, touchStreak])
  return null
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)

  if (!booted) {
    return <Splash onDone={() => setBooted(true)} />
  }

  if (!onboardingComplete) {
    return <Onboarding />
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <TrackPath />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/course/area/:areaId" element={<LearningArea />} />
          <Route path="/course/module/:moduleId" element={<Module />} />
          <Route path="/course/unit/:code" element={<UnitDetail />} />
          <Route path="/course/lesson/:lessonId" element={<LessonViewer />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/plans" element={<PlanLab />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/:calcId" element={<Calculators />} />
          <Route path="/quiz" element={<QuizCentre />} />
          <Route path="/quiz/session/:mode" element={<QuizSession />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/reference/term/:termId" element={<Reference />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
