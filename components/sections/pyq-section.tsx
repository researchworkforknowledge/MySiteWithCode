"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState } from "react";
import {
  FileQuestion,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui/common";

interface PYQQuestion {
  id: string;
  year: number;
  question: string;
  marks: number;
  topic: string;
  type: "mcq" | "short" | "long";
  answer?: string;
  isExpanded?: boolean;
}

// Sample PYQ data - in production this would come from an API
const SAMPLE_PYQS: Record<string, PYQQuestion[]> = {
  Mathematics: [
    {
      id: "1",
      year: 2024,
      question: "Find the sum of first 20 terms of an AP whose first term is 5 and common difference is 3.",
      marks: 3,
      topic: "Arithmetic Progression",
      type: "short",
      answer: "Using Sn = n/2[2a + (n-1)d], where a=5, d=3, n=20. S20 = 20/2[2(5) + (19)(3)] = 10[10 + 57] = 670",
    },
    {
      id: "2",
      year: 2024,
      question: "Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.",
      marks: 5,
      topic: "Circles",
      type: "long",
      answer: "Let O be the center and P be the point of contact. Assume the tangent is not perpendicular. Then there exists a point Q on the tangent closer to O than P. But any point on the tangent other than P lies outside the circle, contradicting OQ < OP = radius.",
    },
    {
      id: "3",
      year: 2023,
      question: "If sin A = 3/5, find cos A and tan A.",
      marks: 2,
      topic: "Trigonometry",
      type: "short",
      answer: "Using sin²A + cos²A = 1: cos²A = 1 - 9/25 = 16/25, so cos A = 4/5. tan A = sin A/cos A = (3/5)/(4/5) = 3/4",
    },
    {
      id: "4",
      year: 2023,
      question: "Find the coordinates of a point on y-axis which is equidistant from the points (5, -2) and (-3, 2).",
      marks: 3,
      topic: "Coordinate Geometry",
      type: "short",
      answer: "Let the point be (0, y). Using distance formula: √(25 + (y+2)²) = √(9 + (y-2)²). Solving: 25 + y² + 4y + 4 = 9 + y² - 4y + 4. 8y = -16, y = -2. Point is (0, -2)",
    },
  ],
  Science: [
    {
      id: "5",
      year: 2024,
      question: "State and explain Ohm's law. Draw the V-I characteristics of an ohmic conductor.",
      marks: 5,
      topic: "Electricity",
      type: "long",
      answer: "Ohm's Law: At constant temperature, the current through a conductor is directly proportional to the potential difference across it. V = IR. The V-I graph is a straight line passing through origin with slope = R.",
    },
    {
      id: "6",
      year: 2024,
      question: "What is the role of decomposers in the ecosystem?",
      marks: 2,
      topic: "Our Environment",
      type: "short",
      answer: "Decomposers break down dead organic matter and release nutrients back into the soil, making them available for producers. They are essential for nutrient cycling in ecosystems.",
    },
  ],
};

export function PYQSection() {
  const { subject, board, classLevel } = useStudyStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const pyqs = SAMPLE_PYQS[subject] || [];

  const filteredPYQs = pyqs.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === "all" || q.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  const years = [...new Set(pyqs.map((q) => q.year))].sort((a, b) => b - a);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedIds(newCompleted);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "success";
      case "short":
        return "info";
      case "long":
        return "warning";
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
            <FileQuestion className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Previous Year Questions</h2>
            <p className="text-muted-foreground">
              {board} Class {classLevel} - {subject}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search questions or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value === "all" ? "all" : parseInt(e.target.value))
              }
              className="px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold">{filteredPYQs.length}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{completedIds.size}</p>
            <p className="text-xs text-muted-foreground">Practiced</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">
              {filteredPYQs.length - completedIds.size}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredPYQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-xl text-center"
          >
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or year filter
            </p>
          </motion.div>
        ) : (
          filteredPYQs.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card rounded-xl overflow-hidden ${
                completedIds.has(question.id) ? "border-green-500/30" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(question.id)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      completedIds.has(question.id)
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {completedIds.has(question.id) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={getTypeColor(question.type)}>
                        {question.type.toUpperCase()}
                      </Badge>
                      <Badge>{question.year}</Badge>
                      <Badge variant="default">{question.marks} marks</Badge>
                      <span className="text-sm text-muted-foreground">
                        {question.topic}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        completedIds.has(question.id)
                          ? "text-muted-foreground line-through"
                          : ""
                      }`}
                    >
                      {question.question}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleExpand(question.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {expandedIds.has(question.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Answer Section */}
                {expandedIds.has(question.id) && question.answer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-sm font-medium text-primary mb-2">
                      Solution:
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
