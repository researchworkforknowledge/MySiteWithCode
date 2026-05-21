"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState } from "react";
import {
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { Button, Badge, Progress } from "@/components/ui/common";

interface PredictionResult {
  overallScore: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  topicBreakdown: { topic: string; score: number; trend: "up" | "down" | "stable" }[];
}

export function PredictorSection() {
  const { subject, board, classLevel, stats, quizHistory, flashcards, notes } = useStudyStore();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePrediction = () => {
    setIsAnalyzing(true);

    // Simulate analysis based on actual user data
    setTimeout(() => {
      const avgQuizScore =
        quizHistory.length > 0
          ? quizHistory.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / quizHistory.length
          : 50;

      const studyConsistency = Math.min(100, (stats.streak / 7) * 100);
      const contentCreated = Math.min(100, (notes.length + flashcards.length) * 5);
      const practiceScore = Math.min(100, stats.sessionsCompleted * 10);

      const overallScore = Math.round(
        avgQuizScore * 0.4 + studyConsistency * 0.2 + contentCreated * 0.2 + practiceScore * 0.2
      );

      const result: PredictionResult = {
        overallScore: Math.max(30, Math.min(95, overallScore)),
        confidence: Math.min(90, 50 + quizHistory.length * 5 + stats.sessionsCompleted * 2),
        strengths: [],
        weaknesses: [],
        recommendations: [],
        topicBreakdown: [],
      };

      // Determine strengths and weaknesses
      if (avgQuizScore >= 70) {
        result.strengths.push("Strong quiz performance");
      } else {
        result.weaknesses.push("Quiz scores need improvement");
      }

      if (stats.streak >= 5) {
        result.strengths.push("Excellent study consistency");
      } else {
        result.weaknesses.push("Study consistency could be better");
      }

      if (flashcards.length >= 20) {
        result.strengths.push("Good use of flashcards for revision");
      } else {
        result.weaknesses.push("Create more flashcards for better retention");
      }

      if (notes.length >= 10) {
        result.strengths.push("Thorough note-taking habits");
      } else {
        result.weaknesses.push("Take more detailed notes");
      }

      // Recommendations
      result.recommendations = [
        "Focus on weak topics identified in quizzes",
        "Maintain daily study sessions for consistency",
        "Review flashcards using spaced repetition",
        "Practice previous year questions regularly",
        "Create mind maps for complex topics",
      ].slice(0, 4);

      // Topic breakdown (mock data based on subject)
      result.topicBreakdown = [
        { topic: "Core Concepts", score: Math.round(overallScore + Math.random() * 10 - 5), trend: "up" },
        { topic: "Problem Solving", score: Math.round(overallScore + Math.random() * 10 - 5), trend: "stable" },
        { topic: "Theory", score: Math.round(overallScore + Math.random() * 10 - 5), trend: "up" },
        { topic: "Applications", score: Math.round(overallScore + Math.random() * 10 - 5), trend: "down" },
      ];

      setPrediction(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-muted rounded-full" />;
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
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Exam Score Predictor</h2>
            <p className="text-muted-foreground">
              AI-powered prediction based on your study data
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Analyzing your performance in {subject} ({board} Class {classLevel}). This prediction
            is based on your quiz scores, study consistency, note-taking, and practice sessions.
          </p>
        </div>

        <Button
          onClick={analyzePrediction}
          loading={isAnalyzing}
          className="w-full"
          size="lg"
        >
          <Target className="w-5 h-5" />
          {isAnalyzing ? "Analyzing Your Data..." : "Generate Prediction"}
        </Button>
      </motion.div>

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Predicted Score Range</p>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${(prediction.overallScore / 100) * 440} 440`}
                    className={getScoreColor(prediction.overallScore)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(prediction.overallScore)}`}>
                    {prediction.overallScore}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ±{Math.round((100 - prediction.confidence) / 2)}%
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Confidence: {prediction.confidence}%
              </p>
            </div>
          </motion.div>

          {/* Topic Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Topic Analysis</h3>
            </div>

            <div className="space-y-4">
              {prediction.topicBreakdown.map((topic, index) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(topic.trend)}
                      <span className={`text-sm font-medium ${getScoreColor(topic.score)}`}>
                        {topic.score}%
                      </span>
                    </div>
                  </div>
                  <Progress value={topic.score} size="sm" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {prediction.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    {strength}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {prediction.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Recommendations</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {prediction.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Data Requirements */}
      {!prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Your Study Data</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{quizHistory.length}</p>
              <p className="text-xs text-muted-foreground">Quizzes Taken</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{stats.sessionsCompleted}</p>
              <p className="text-xs text-muted-foreground">Study Sessions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{notes.length}</p>
              <p className="text-xs text-muted-foreground">Notes Created</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{flashcards.length}</p>
              <p className="text-xs text-muted-foreground">Flashcards</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            More data leads to more accurate predictions. Keep studying!
          </p>
        </motion.div>
      )}
    </div>
  );
}
