import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

// Types
export interface Note {
  id: string
  title: string
  content: string
  date: string
  subject: string
  category?: string
}

export interface Homework {
  id: string
  task: string
  dueDate: string
  priority: "high" | "medium" | "low"
  done: boolean
  subject: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  lastReviewed?: string
  confidence: number
  difficulty: "easy" | "medium" | "hard"
}

export interface WeakTopic {
  id: string
  topic: string
  subject: string
  addedDate: string
}

export interface QuickTask {
  id: string
  task: string
  done: boolean
  date: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  persona?: string
}

export interface TimerState {
  seconds: number
  mode: "focus" | "shortBreak" | "longBreak"
  running: boolean
  sessionsCompleted: number
}

export interface Stats {
  totalStudyTime: number // minutes
  sessionsCompleted: number
  streak: number
  lastActiveDate: string | null
  quizzesCompleted: number
  flashcardsReviewed: number
}

export interface StudySession {
  date: string
  duration: number // minutes
  sessionsCount: number
}

export interface QuizResult {
  id: string
  date: string
  score: number
  total: number
  subject: string
  topic?: string
}

export interface MindmapNode {
  id: string
  label: string
  x: number
  y: number
  parentId?: string
  color?: string
}

export interface Mindmap {
  id: string
  title: string
  nodes: MindmapNode[]
  subject: string
  createdAt: string
}

export interface ScheduleEvent {
  id: string
  title: string
  subject: string
  date: Date | string
  startTime: string
  endTime: string
  color: string
}

export interface Settings {
  theme: "light" | "dark"
  soundEnabled: boolean
  notifications: boolean
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  autoStartBreaks: boolean
  userName: string
  dailyGoal: number // minutes
}

export type AIPersona =
  | "doubts"
  | "notes"
  | "pyq"
  | "pred"
  | "weak"
  | "mm"
  | "quiz"
  | "strat"
  | "motiv"
  | "summarize"
  | "eli5"

export interface StudyState {
  // User Context
  board: string
  classLevel: string
  subject: string
  examDate: string | null

  // Settings
  settings: Settings

  // Data Collections
  notes: Note[]
  homework: Homework[]
  flashcards: Flashcard[]
  weakTopics: WeakTopic[]
  quickTasks: QuickTask[]
  chatHistory: Record<AIPersona, ChatMessage[]>
  quizHistory: QuizResult[]
  mindmaps: Mindmap[]
  schedule: ScheduleEvent[]
  studySessions: StudySession[]

  // Timer
  timer: TimerState

  // Stats
  stats: Stats

  // UI State
  sidebarOpen: boolean
  activeSection: string
  flashcardIndex: number
  focusMode: boolean
  lofiPlaying: boolean
  currentVibe: number
  currentTrack: number
  focusTask: string

  // Actions - Context
  setBoard: (board: string) => void
  setClassLevel: (classLevel: string) => void
  setSubject: (subject: string) => void
  setExamDate: (date: string | null) => void

  // Actions - Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Actions - Notes
  addNote: (note: Omit<Note, "id" | "date">) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Actions - Homework
  addHomework: (hw: Omit<Homework, "id" | "done">) => void
  toggleHomework: (id: string) => void
  deleteHomework: (id: string) => void

  // Actions - Flashcards
  addFlashcard: (fc: Omit<Flashcard, "id" | "confidence" | "difficulty">) => void
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void
  deleteFlashcard: (id: string) => void
  setFlashcardIndex: (index: number) => void
  importFlashcards: (flashcards: Flashcard[]) => void

  // Actions - Weak Topics
  addWeakTopic: (topic: string, subject: string) => void
  deleteWeakTopic: (id: string) => void

  // Actions - Quick Tasks
  addQuickTask: (task: string) => void
  toggleQuickTask: (id: string) => void
  deleteQuickTask: (id: string) => void
  clearCompletedTasks: () => void

  // Actions - Chat
  addChatMessage: (persona: AIPersona, message: Omit<ChatMessage, "id" | "timestamp">) => void
  clearChat: (persona: AIPersona) => void

  // Actions - Quiz
  addQuizResult: (result: Omit<QuizResult, "id" | "date">) => void

  // Actions - Mindmap
  addMindmap: (mindmap: Omit<Mindmap, "id" | "createdAt">) => void
  updateMindmap: (id: string, updates: Partial<Mindmap>) => void
  deleteMindmap: (id: string) => void

  // Actions - Schedule
  addScheduleEvent: (event: Omit<ScheduleEvent, "id">) => void
  updateScheduleEvent: (id: string, updates: Partial<ScheduleEvent>) => void
  deleteScheduleEvent: (id: string) => void

  // Actions - Timer
  setTimerMode: (mode: "focus" | "shortBreak" | "longBreak") => void
  setTimerSeconds: (seconds: number) => void
  setTimerRunning: (running: boolean) => void
  resetTimer: () => void
  completeSession: () => void

  // Actions - Stats
  updateStats: (updates: Partial<Stats>) => void
  addStudySession: (duration: number) => void

  // Actions - UI
  setSidebarOpen: (open: boolean) => void
  setActiveSection: (section: string) => void
  setFocusMode: (enabled: boolean) => void
  setLofiPlaying: (playing: boolean) => void
  setCurrentVibe: (vibe: number) => void
  setCurrentTrack: (track: number) => void
  setFocusTask: (task: string) => void

  // Utility
  exportData: () => string
  importData: (data: string) => void
  clearAllData: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)
const getToday = () => new Date().toISOString().split("T")[0]

const defaultSettings: Settings = {
  theme: "dark",
  soundEnabled: true,
  notifications: true,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  userName: "",
  dailyGoal: 120,
}

const initialState = {
  // User Context
  board: "CBSE",
  classLevel: "10",
  subject: "Mathematics",
  examDate: null,

  // Settings
  settings: defaultSettings,

  // Data Collections
  notes: [] as Note[],
  homework: [] as Homework[],
  flashcards: [] as Flashcard[],
  weakTopics: [] as WeakTopic[],
  quickTasks: [] as QuickTask[],
  chatHistory: {
    doubts: [],
    notes: [],
    pyq: [],
    pred: [],
    weak: [],
    mm: [],
    quiz: [],
    strat: [],
    motiv: [],
    summarize: [],
    eli5: [],
  } as Record<AIPersona, ChatMessage[]>,
  quizHistory: [] as QuizResult[],
  mindmaps: [] as Mindmap[],
  schedule: [] as ScheduleEvent[],
  studySessions: [] as StudySession[],

  // Timer
  timer: {
    seconds: 25 * 60,
    mode: "focus" as const,
    running: false,
    sessionsCompleted: 0,
  },

  // Stats
  stats: {
    totalStudyTime: 0,
    sessionsCompleted: 0,
    streak: 0,
    lastActiveDate: null,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
  },

  // UI State
  sidebarOpen: true,
  activeSection: "dashboard",
  flashcardIndex: 0,
  focusMode: false,
  lofiPlaying: false,
  currentVibe: 0,
  currentTrack: 0,
  focusTask: "",
}

export const useStudyStore = create<StudyState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Context Actions
      setBoard: (board) => set((state) => { state.board = board }),
      setClassLevel: (classLevel) => set((state) => { state.classLevel = classLevel }),
      setSubject: (subject) => set((state) => { state.subject = subject }),
      setExamDate: (date) => set((state) => { state.examDate = date }),

      // Settings Actions
      updateSettings: (updates) =>
        set((state) => {
          Object.assign(state.settings, updates)
        }),

      // Notes Actions
      addNote: (note) =>
        set((state) => {
          state.notes.unshift({
            id: generateId(),
            date: new Date().toISOString(),
            ...note,
          })
        }),

      updateNote: (id, updates) =>
        set((state) => {
          const index = state.notes.findIndex((n) => n.id === id)
          if (index !== -1) {
            Object.assign(state.notes[index], updates)
          }
        }),

      deleteNote: (id) =>
        set((state) => {
          state.notes = state.notes.filter((n) => n.id !== id)
        }),

      // Homework Actions
      addHomework: (hw) =>
        set((state) => {
          state.homework.unshift({
            id: generateId(),
            done: false,
            ...hw,
          })
        }),

      toggleHomework: (id) =>
        set((state) => {
          const hw = state.homework.find((h) => h.id === id)
          if (hw) {
            hw.done = !hw.done
          }
        }),

      deleteHomework: (id) =>
        set((state) => {
          state.homework = state.homework.filter((h) => h.id !== id)
        }),

      // Flashcard Actions
      addFlashcard: (fc) =>
        set((state) => {
          state.flashcards.push({
            id: generateId(),
            confidence: 0,
            difficulty: "medium",
            ...fc,
          })
        }),

      updateFlashcard: (id, updates) =>
        set((state) => {
          const fc = state.flashcards.find((f) => f.id === id)
          if (fc) {
            Object.assign(fc, updates)
            if (updates.confidence !== undefined || updates.difficulty !== undefined) {
              fc.lastReviewed = new Date().toISOString()
              state.stats.flashcardsReviewed += 1
            }
          }
        }),

      deleteFlashcard: (id) =>
        set((state) => {
          state.flashcards = state.flashcards.filter((f) => f.id !== id)
        }),

      setFlashcardIndex: (index) => set((state) => { state.flashcardIndex = index }),

      importFlashcards: (flashcards) =>
        set((state) => {
          state.flashcards = flashcards
        }),

      // Weak Topics Actions
      addWeakTopic: (topic, subject) =>
        set((state) => {
          state.weakTopics.push({
            id: generateId(),
            topic,
            subject,
            addedDate: getToday(),
          })
        }),

      deleteWeakTopic: (id) =>
        set((state) => {
          state.weakTopics = state.weakTopics.filter((w) => w.id !== id)
        }),

      // Quick Tasks Actions
      addQuickTask: (task) =>
        set((state) => {
          state.quickTasks.unshift({
            id: generateId(),
            task,
            done: false,
            date: getToday(),
          })
        }),

      toggleQuickTask: (id) =>
        set((state) => {
          const task = state.quickTasks.find((t) => t.id === id)
          if (task) task.done = !task.done
        }),

      deleteQuickTask: (id) =>
        set((state) => {
          state.quickTasks = state.quickTasks.filter((t) => t.id !== id)
        }),

      clearCompletedTasks: () =>
        set((state) => {
          state.quickTasks = state.quickTasks.filter((t) => !t.done)
        }),

      // Chat Actions
      addChatMessage: (persona, message) =>
        set((state) => {
          if (!state.chatHistory[persona]) {
            state.chatHistory[persona] = []
          }
          state.chatHistory[persona].push({
            id: generateId(),
            timestamp: new Date().toISOString(),
            ...message,
          })
        }),

      clearChat: (persona) =>
        set((state) => {
          state.chatHistory[persona] = []
        }),

      // Quiz Actions
      addQuizResult: (result) =>
        set((state) => {
          state.quizHistory.push({
            id: generateId(),
            date: new Date().toISOString(),
            ...result,
          })
          state.stats.quizzesCompleted += 1
        }),

      // Mindmap Actions
      addMindmap: (mindmap) =>
        set((state) => {
          state.mindmaps.push({
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...mindmap,
          })
        }),

      updateMindmap: (id, updates) =>
        set((state) => {
          const index = state.mindmaps.findIndex((m) => m.id === id)
          if (index !== -1) {
            Object.assign(state.mindmaps[index], updates)
          }
        }),

      deleteMindmap: (id) =>
        set((state) => {
          state.mindmaps = state.mindmaps.filter((m) => m.id !== id)
        }),

      // Schedule Actions
      addScheduleEvent: (event) =>
        set((state) => {
          state.schedule.push({
            id: generateId(),
            ...event,
          })
        }),

      updateScheduleEvent: (id, updates) =>
        set((state) => {
          const index = state.schedule.findIndex((e) => e.id === id)
          if (index !== -1) {
            Object.assign(state.schedule[index], updates)
          }
        }),

      deleteScheduleEvent: (id) =>
        set((state) => {
          state.schedule = state.schedule.filter((e) => e.id !== id)
        }),

      // Timer Actions
      setTimerMode: (mode) =>
        set((state) => {
          state.timer.mode = mode
          const durations = {
            focus: state.settings.focusDuration,
            shortBreak: state.settings.shortBreakDuration,
            longBreak: state.settings.longBreakDuration,
          }
          state.timer.seconds = durations[mode] * 60
          state.timer.running = false
        }),

      setTimerSeconds: (seconds) =>
        set((state) => {
          state.timer.seconds = seconds
        }),

      setTimerRunning: (running) =>
        set((state) => {
          state.timer.running = running
        }),

      resetTimer: () =>
        set((state) => {
          const durations = {
            focus: state.settings.focusDuration,
            shortBreak: state.settings.shortBreakDuration,
            longBreak: state.settings.longBreakDuration,
          }
          state.timer.seconds = durations[state.timer.mode] * 60
          state.timer.running = false
        }),

      completeSession: () =>
        set((state) => {
          if (state.timer.mode === "focus") {
            state.timer.sessionsCompleted += 1
            state.stats.sessionsCompleted += 1
            state.stats.totalStudyTime += state.settings.focusDuration

            // Add study session
            const today = getToday()
            const existingSession = state.studySessions.find((s) => s.date === today)
            if (existingSession) {
              existingSession.duration += state.settings.focusDuration
              existingSession.sessionsCount += 1
            } else {
              state.studySessions.push({
                date: today,
                duration: state.settings.focusDuration,
                sessionsCount: 1,
              })
            }

            // Update streak
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split("T")[0]

            if (state.stats.lastActiveDate === yesterdayStr) {
              state.stats.streak += 1
            } else if (state.stats.lastActiveDate !== today) {
              state.stats.streak = 1
            }
            state.stats.lastActiveDate = today
          }
        }),

      // Stats Actions
      updateStats: (updates) =>
        set((state) => {
          Object.assign(state.stats, updates)
        }),

      addStudySession: (duration) =>
        set((state) => {
          const today = getToday()
          const existingSession = state.studySessions.find((s) => s.date === today)
          if (existingSession) {
            existingSession.duration += duration
            existingSession.sessionsCount += 1
          } else {
            state.studySessions.push({
              date: today,
              duration,
              sessionsCount: 1,
            })
          }
          state.stats.totalStudyTime += duration
        }),

      // UI Actions
      setSidebarOpen: (open) => set((state) => { state.sidebarOpen = open }),
      setActiveSection: (section) => set((state) => { state.activeSection = section }),
      setFocusMode: (enabled) => set((state) => { state.focusMode = enabled }),
      setLofiPlaying: (playing) => set((state) => { state.lofiPlaying = playing }),
      setCurrentVibe: (vibe) => set((state) => { state.currentVibe = vibe }),
      setCurrentTrack: (track) => set((state) => { state.currentTrack = track }),
      setFocusTask: (task) => set((state) => { state.focusTask = task }),

      // Utility Actions
      exportData: () => {
        const state = get()
        const exportObj = {
          version: "2.0.0",
          exportedAt: new Date().toISOString(),
          data: {
            board: state.board,
            classLevel: state.classLevel,
            subject: state.subject,
            examDate: state.examDate,
            settings: state.settings,
            notes: state.notes,
            homework: state.homework,
            flashcards: state.flashcards,
            weakTopics: state.weakTopics,
            quickTasks: state.quickTasks,
            chatHistory: state.chatHistory,
            quizHistory: state.quizHistory,
            mindmaps: state.mindmaps,
            schedule: state.schedule,
            studySessions: state.studySessions,
            stats: state.stats,
          },
        }
        return JSON.stringify(exportObj, null, 2)
      },

      importData: (data) =>
        set((state) => {
          try {
            const parsed = JSON.parse(data)
            if (parsed.data) {
              Object.assign(state, parsed.data)
            }
          } catch (e) {
            console.error("Failed to import data:", e)
          }
        }),

      clearAllData: () => set(initialState),
    })),
    {
      name: "studyai-pro-v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        board: state.board,
        classLevel: state.classLevel,
        subject: state.subject,
        examDate: state.examDate,
        settings: state.settings,
        notes: state.notes,
        homework: state.homework,
        flashcards: state.flashcards,
        weakTopics: state.weakTopics,
        quickTasks: state.quickTasks,
        chatHistory: state.chatHistory,
        quizHistory: state.quizHistory,
        mindmaps: state.mindmaps,
        schedule: state.schedule,
        studySessions: state.studySessions,
        timer: { ...state.timer, running: false },
        stats: state.stats,
        flashcardIndex: state.flashcardIndex,
        currentVibe: state.currentVibe,
        currentTrack: state.currentTrack,
        focusTask: state.focusTask,
      }),
    }
  )
)

// Selectors for performance
export const useBoard = () => useStudyStore((s) => s.board)
export const useClassLevel = () => useStudyStore((s) => s.classLevel)
export const useSubject = () => useStudyStore((s) => s.subject)
export const useStats = () => useStudyStore((s) => s.stats)
export const useTimer = () => useStudyStore((s) => s.timer)
export const useNotes = () => useStudyStore((s) => s.notes)
export const useHomework = () => useStudyStore((s) => s.homework)
export const useFlashcards = () => useStudyStore((s) => s.flashcards)
export const useActiveSection = () => useStudyStore((s) => s.activeSection)
export const useSidebarOpen = () => useStudyStore((s) => s.sidebarOpen)
export const useSettings = () => useStudyStore((s) => s.settings)
