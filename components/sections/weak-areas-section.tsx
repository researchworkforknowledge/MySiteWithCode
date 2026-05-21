"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Target,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button, Input, Badge, EmptyState } from "@/components/ui/common";

export function WeakAreasSection() {
  const { weakTopics, addWeakTopic, deleteWeakTopic, subject } = useStudyStore();
  const [newTopic, setNewTopic] = useState("");
  const [newSubject, setNewSubject] = useState(subject);

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    addWeakTopic(newTopic.trim(), newSubject);
    setNewTopic("");
  };

  const topicsBySubject = weakTopics.reduce(
    (acc, topic) => {
      if (!acc[topic.subject]) {
        acc[topic.subject] = [];
      }
      acc[topic.subject].push(topic);
      return acc;
    },
    {} as Record<string, typeof weakTopics>
  );

  const tips = [
    "Break down complex topics into smaller subtopics",
    "Create flashcards specifically for weak areas",
    "Practice previous year questions on these topics",
    "Seek help from teachers or peers for difficult concepts",
    "Use visual aids like mind maps for better understanding",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Weak Areas Tracker</h2>
            <p className="text-muted-foreground">
              Track and improve your challenging topics
            </p>
          </div>
        </div>

        {/* Add New Topic */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter a topic you struggle with..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
          </div>
          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Social Science">Social Science</option>
            <option value="Hindi">Hindi</option>
          </select>
          <Button onClick={handleAddTopic}>
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-3xl font-bold text-orange-500">{weakTopics.length}</p>
          <p className="text-sm text-muted-foreground">Topics Tracked</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-3xl font-bold text-primary">
            {Object.keys(topicsBySubject).length}
          </p>
          <p className="text-sm text-muted-foreground">Subjects</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-3xl font-bold text-green-500">0</p>
          <p className="text-sm text-muted-foreground">Mastered</p>
        </div>
      </motion.div>

      {/* Topics by Subject */}
      {weakTopics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-xl"
        >
          <EmptyState
            icon={<Target className="w-8 h-8 text-muted-foreground" />}
            title="No Weak Areas Tracked"
            description="Add topics you find challenging to track your improvement over time."
          />
        </motion.div>
      ) : (
        <div className="space-y-4">
          {Object.entries(topicsBySubject).map(([subjectName, topics], index) => (
            <motion.div
              key={subjectName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{subjectName}</h3>
                <Badge>{topics.length}</Badge>
              </div>

              <div className="space-y-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        Added {topic.addedDate}
                      </span>
                      <button
                        onClick={() => deleteWeakTopic(topic.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Tips for Improvement</h3>
        </div>

        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary">{index + 1}</span>
              </div>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
