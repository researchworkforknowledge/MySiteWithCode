"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState } from "react";
import {
  Compass,
  Target,
  Clock,
  Brain,
  CalendarDays,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Button, Badge, Progress } from "@/components/ui/common";

interface Strategy {
  id: string;
  title: string;
  description: string;
  steps: string[];
  timeRequired: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

const STRATEGIES: Strategy[] = [
  {
    id: "1",
    title: "Pomodoro Technique",
    description: "Break study sessions into focused intervals with short breaks to maintain concentration.",
    steps: [
      "Set a timer for 25 minutes",
      "Focus completely on one task",
      "Take a 5-minute break after each session",
      "After 4 sessions, take a 15-30 minute break",
      "Repeat throughout your study session",
    ],
    timeRequired: "Flexible",
    difficulty: "beginner",
    tags: ["Focus", "Time Management", "Productivity"],
  },
  {
    id: "2",
    title: "Active Recall",
    description: "Test yourself on material rather than passively re-reading to strengthen memory.",
    steps: [
      "Read and understand the material first",
      "Close your notes and try to recall key points",
      "Write down everything you remember",
      "Check your notes and identify gaps",
      "Focus on weak areas and repeat",
    ],
    timeRequired: "30-60 min/session",
    difficulty: "beginner",
    tags: ["Memory", "Retention", "Testing"],
  },
  {
    id: "3",
    title: "Spaced Repetition",
    description: "Review material at increasing intervals to move information to long-term memory.",
    steps: [
      "Review new material on day 1",
      "Review again on day 3",
      "Review on day 7",
      "Review on day 14",
      "Review on day 30, then monthly",
    ],
    timeRequired: "15-30 min/day",
    difficulty: "intermediate",
    tags: ["Memory", "Long-term", "Flashcards"],
  },
  {
    id: "4",
    title: "Feynman Technique",
    description: "Explain concepts in simple terms to identify and fill gaps in understanding.",
    steps: [
      "Choose a concept to learn",
      "Explain it as if teaching a child",
      "Identify gaps in your explanation",
      "Go back to source material",
      "Simplify and use analogies",
    ],
    timeRequired: "20-40 min/concept",
    difficulty: "intermediate",
    tags: ["Understanding", "Deep Learning", "Teaching"],
  },
  {
    id: "5",
    title: "Mind Mapping",
    description: "Create visual diagrams to connect ideas and see the big picture of a topic.",
    steps: [
      "Start with the main topic in center",
      "Add main branches for key concepts",
      "Add sub-branches for details",
      "Use colors and images",
      "Review and refine connections",
    ],
    timeRequired: "30-45 min/map",
    difficulty: "beginner",
    tags: ["Visual", "Organization", "Creativity"],
  },
  {
    id: "6",
    title: "Interleaving Practice",
    description: "Mix different topics or types of problems in a single study session.",
    steps: [
      "Select 2-3 related topics",
      "Alternate between topics every 15-20 minutes",
      "Mix problem types within each topic",
      "Review connections between topics",
      "Practice switching contexts quickly",
    ],
    timeRequired: "60-90 min/session",
    difficulty: "advanced",
    tags: ["Problem Solving", "Flexibility", "Deep Learning"],
  },
];

export function StrategiesSection() {
  const { board, classLevel, examDate } = useStudyStore();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [activeStrategies, setActiveStrategies] = useState<Set<string>>(new Set());

  const toggleActiveStrategy = (id: string) => {
    const newActive = new Set(activeStrategies);
    if (newActive.has(id)) {
      newActive.delete(id);
    } else {
      newActive.add(id);
    }
    setActiveStrategies(newActive);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Study Strategies</h2>
            <p className="text-muted-foreground">
              Proven techniques to maximize your learning efficiency
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span>{board} Class {classLevel}</span>
          </div>
          {examDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              <span>Exam: {examDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{activeStrategies.size} active strategies</span>
          </div>
        </div>
      </motion.div>

      {/* Strategy Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {STRATEGIES.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-5 rounded-xl cursor-pointer transition-all ${
              activeStrategies.has(strategy.id)
                ? "border-primary/50 bg-primary/5"
                : "hover:border-primary/30"
            }`}
            onClick={() => setSelectedStrategy(strategy)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold">{strategy.title}</h3>
              <Badge variant={getDifficultyColor(strategy.difficulty)}>
                {strategy.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {strategy.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {strategy.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {strategy.timeRequired}
              </div>
              <Button
                size="sm"
                variant={activeStrategies.has(strategy.id) ? "primary" : "secondary"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleActiveStrategy(strategy.id);
                }}
              >
                {activeStrategies.has(strategy.id) ? (
                  <>
                    <CheckCircle className="w-3 h-3" /> Active
                  </>
                ) : (
                  "Activate"
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStrategy(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-lg w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedStrategy.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getDifficultyColor(selectedStrategy.difficulty)}>
                    {selectedStrategy.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedStrategy.timeRequired}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{selectedStrategy.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                How to Apply
              </h3>
              <ol className="space-y-3">
                {selectedStrategy.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedStrategy.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setSelectedStrategy(null)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toggleActiveStrategy(selectedStrategy.id);
                  setSelectedStrategy(null);
                }}
              >
                {activeStrategies.has(selectedStrategy.id) ? "Deactivate" : "Activate Strategy"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Quick Tips</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Start with easier topics to build momentum",
            "Take regular breaks to avoid burnout",
            "Mix subjects to keep your brain engaged",
            "Review notes before sleeping for better retention",
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
