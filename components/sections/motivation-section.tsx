"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Quote,
  RefreshCw,
  Heart,
  Share2,
  Copy,
  Check,
  Flame,
  Target,
  Rocket,
  Star,
} from "lucide-react";
import { Button, Badge } from "@/components/ui/common";

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "education",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "perseverance",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "belief",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "growth",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "perseverance",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "mindset",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "motivation",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "action",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    category: "action",
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    category: "effort",
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    category: "perseverance",
  },
];

const AFFIRMATIONS = [
  "I am capable of achieving my academic goals",
  "Every study session makes me stronger",
  "I embrace challenges as opportunities to grow",
  "My potential is limitless",
  "I am focused, determined, and unstoppable",
  "Success is within my reach",
  "I learn from every mistake and grow",
  "My hard work will pay off",
  "I am confident in my abilities",
  "Today I choose to be productive",
];

export function MotivationSection() {
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [currentAffirmation, setCurrentAffirmation] = useState(AFFIRMATIONS[0]);
  const [likedQuotes, setLikedQuotes] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Randomize on mount
    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setCurrentAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  }, []);

  const getNewQuote = () => {
    let newQuote;
    do {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    } while (newQuote.text === currentQuote.text);
    setCurrentQuote(newQuote);
  };

  const getNewAffirmation = () => {
    let newAffirmation;
    do {
      newAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    } while (newAffirmation === currentAffirmation);
    setCurrentAffirmation(newAffirmation);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quoteIndex = QUOTES.findIndex((q) => q.text === currentQuote.text);
  const isLiked = likedQuotes.has(quoteIndex);

  const toggleLike = () => {
    const newLiked = new Set(likedQuotes);
    if (isLiked) {
      newLiked.delete(quoteIndex);
    } else {
      newLiked.add(quoteIndex);
    }
    setLikedQuotes(newLiked);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Daily Motivation</h2>
            <p className="text-muted-foreground">
              Fuel your study sessions with inspiration
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quote of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4">
          <Badge>{currentQuote.category}</Badge>
        </div>
        <Quote className="w-12 h-12 text-primary/20 mb-4" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl md:text-2xl font-medium mb-4 leading-relaxed">
              {`"${currentQuote.text}"`}
            </p>
            <p className="text-muted-foreground">— {currentQuote.author}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
          <Button variant="ghost" size="sm" onClick={toggleLike}>
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyQuote}>
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" size="sm" onClick={getNewQuote}>
            <RefreshCw className="w-4 h-4" />
            New Quote
          </Button>
        </div>
      </motion.div>

      {/* Daily Affirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Daily Affirmation</h3>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAffirmation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg font-medium text-primary mb-4"
          >
            {currentAffirmation}
          </motion.p>
        </AnimatePresence>

        <Button variant="ghost" size="sm" onClick={getNewAffirmation}>
          <RefreshCw className="w-4 h-4" />
          New Affirmation
        </Button>
      </motion.div>

      {/* Motivation Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <h4 className="font-semibold mb-2">Stay Consistent</h4>
          <p className="text-sm text-muted-foreground">
            Small daily improvements lead to stunning results
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <h4 className="font-semibold mb-2">Set Clear Goals</h4>
          <p className="text-sm text-muted-foreground">
            A goal without a plan is just a wish
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl text-center"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="font-semibold mb-2">Take Action</h4>
          <p className="text-sm text-muted-foreground">
            The secret of getting ahead is getting started
          </p>
        </motion.div>
      </div>

      {/* Breathing Exercise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="font-semibold mb-4">Quick Stress Relief</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Feeling overwhelmed? Try the 4-7-8 breathing technique:
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-blue-500/10">
            <p className="text-2xl font-bold text-blue-500">4s</p>
            <p className="text-xs text-muted-foreground">Inhale</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10">
            <p className="text-2xl font-bold text-purple-500">7s</p>
            <p className="text-xs text-muted-foreground">Hold</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <p className="text-2xl font-bold text-green-500">8s</p>
            <p className="text-xs text-muted-foreground">Exhale</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Repeat 3-4 times for best results
        </p>
      </motion.div>
    </div>
  );
}
