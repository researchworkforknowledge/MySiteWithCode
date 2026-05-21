"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Flame,
  BookOpen,
  Brain,
  CheckCircle,
} from "lucide-react";
import { format, subDays, startOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { useMemo } from "react";

export function ProgressSection() {
  const { stats, studySessions, flashcards, quizHistory, notes } = useStudyStore();

  const weeklyData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end: new Date() });

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const session = studySessions.find(
        (s) => format(new Date(s.date), "yyyy-MM-dd") === dayStr
      );
      return {
        day: format(day, "EEE"),
        date: day,
        minutes: session?.duration || 0,
        isToday: isToday(day),
      };
    });
  }, [studySessions]);

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 60);

  const achievements = useMemo(() => {
    const list = [];

    if (stats.totalStudyTime >= 60) {
      list.push({ name: "First Hour", icon: Clock, unlocked: true });
    }
    if (stats.totalStudyTime >= 600) {
      list.push({ name: "10 Hour Club", icon: Award, unlocked: true });
    }
    if (stats.streak >= 7) {
      list.push({ name: "Week Warrior", icon: Flame, unlocked: true });
    }
    if (flashcards.length >= 50) {
      list.push({ name: "Card Collector", icon: BookOpen, unlocked: true });
    }
    if (quizHistory.length >= 10) {
      list.push({ name: "Quiz Master", icon: Brain, unlocked: true });
    }
    if (notes.length >= 20) {
      list.push({ name: "Note Taker", icon: CheckCircle, unlocked: true });
    }

    // Add locked achievements
    if (stats.totalStudyTime < 60) {
      list.push({ name: "First Hour", icon: Clock, unlocked: false });
    }
    if (stats.totalStudyTime < 600) {
      list.push({ name: "10 Hour Club", icon: Award, unlocked: false });
    }
    if (stats.streak < 7) {
      list.push({ name: "Week Warrior", icon: Flame, unlocked: false });
    }

    return list.slice(0, 6);
  }, [stats, flashcards.length, quizHistory.length, notes.length]);

  const quizStats = useMemo(() => {
    if (quizHistory.length === 0) return { avgScore: 0, totalQuizzes: 0, bestScore: 0 };

    const scores = quizHistory.map((q) => (q.score / q.total) * 100);
    return {
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      totalQuizzes: quizHistory.length,
      bestScore: Math.round(Math.max(...scores)),
    };
  }, [quizHistory]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Study Time</p>
              <p className="text-2xl font-bold">
                {Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">{stats.streak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions Completed</p>
              <p className="text-2xl font-bold">{stats.sessionsCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
              <p className="text-2xl font-bold">{quizStats.avgScore}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Weekly Activity</h3>
            <p className="text-sm text-muted-foreground">Your study time this week</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-lg min-h-[4px] ${
                  day.isToday
                    ? "bg-gradient-to-t from-primary to-primary/60"
                    : "bg-gradient-to-t from-muted-foreground/30 to-muted-foreground/10"
                }`}
              />
              <span
                className={`text-xs ${
                  day.isToday ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements & Quiz Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Achievements</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.name}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-muted/50 opacity-50"
                }`}
              >
                <achievement.icon
                  className={`w-5 h-5 ${
                    achievement.unlocked ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    achievement.unlocked ? "" : "text-muted-foreground"
                  }`}
                >
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Quiz Performance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Quizzes</span>
              <span className="font-semibold">{quizStats.totalQuizzes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Score</span>
              <span className="font-semibold">{quizStats.avgScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Best Score</span>
              <span className="font-semibold text-green-500">{quizStats.bestScore}%</span>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Performance</span>
                <span className="font-medium">{quizStats.avgScore}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${quizStats.avgScore}%` }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Content Overview</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-blue-500/10">
            <p className="text-3xl font-bold text-blue-500">{notes.length}</p>
            <p className="text-sm text-muted-foreground">Notes</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-500/10">
            <p className="text-3xl font-bold text-green-500">{flashcards.length}</p>
            <p className="text-sm text-muted-foreground">Flashcards</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-500/10">
            <p className="text-3xl font-bold text-purple-500">{quizHistory.length}</p>
            <p className="text-sm text-muted-foreground">Quizzes Taken</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-500/10">
            <p className="text-3xl font-bold text-orange-500">
              {flashcards.filter((f) => f.difficulty === "hard").length}
            </p>
            <p className="text-sm text-muted-foreground">Cards to Review</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
