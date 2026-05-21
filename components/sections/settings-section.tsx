"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Download,
  Upload,
  Trash2,
  User,
  Palette,
  Clock,
  Save,
  Check,
  AlertTriangle,
} from "lucide-react";

export function SettingsSection() {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    clearAllData,
  } = useStudyStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studyai-pro-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveMessage("Data exported successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            importData(content);
            setSaveMessage("Data imported successfully!");
            setImportError(null);
            setTimeout(() => setSaveMessage(null), 3000);
          } catch {
            setImportError("Failed to import data. Please check the file format.");
            setTimeout(() => setImportError(null), 5000);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    setSaveMessage("All data cleared successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const pomodoroPresets = [
    { label: "Classic", focus: 25, shortBreak: 5, longBreak: 15 },
    { label: "Long Focus", focus: 50, shortBreak: 10, longBreak: 30 },
    { label: "Short Burst", focus: 15, shortBreak: 3, longBreak: 10 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500"
        >
          <Check className="w-5 h-5" />
          <span>{saveMessage}</span>
        </motion.div>
      )}

      {/* Import Error */}
      {importError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{importError}</span>
        </motion.div>
      )}

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Choose between light and dark mode
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  theme: settings.theme === "dark" ? "light" : "dark",
                })
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.theme === "dark" ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.theme === "dark" ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Sound Effects</p>
                <p className="text-sm text-muted-foreground">
                  Play sounds for timer and notifications
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ soundEnabled: !settings.soundEnabled })
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.notifications ? (
                <Bell className="w-5 h-5 text-muted-foreground" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Show browser notifications
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ notifications: !settings.notifications })
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.notifications ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Timer Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Timer Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-medium mb-3">Quick Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {pomodoroPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    updateSettings({
                      focusDuration: preset.focus,
                      shortBreakDuration: preset.shortBreak,
                      longBreakDuration: preset.longBreak,
                    })
                  }
                  className={`p-3 rounded-lg border transition-all ${
                    settings.focusDuration === preset.focus
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-sm">{preset.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {preset.focus}/{preset.shortBreak}/{preset.longBreak}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <label className="text-sm text-muted-foreground">Focus (min)</label>
              <input
                type="number"
                value={settings.focusDuration}
                onChange={(e) =>
                  updateSettings({
                    focusDuration: Math.max(1, parseInt(e.target.value) || 25),
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="120"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Short Break</label>
              <input
                type="number"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  updateSettings({
                    shortBreakDuration: Math.max(1, parseInt(e.target.value) || 5),
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Long Break</label>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  updateSettings({
                    longBreakDuration: Math.max(1, parseInt(e.target.value) || 15),
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="60"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="font-medium">Auto-start Breaks</p>
              <p className="text-sm text-muted-foreground">
                Automatically start break timer after focus session
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ autoStartBreaks: !settings.autoStartBreaks })
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.autoStartBreaks ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoStartBreaks ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Profile</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Display Name</label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              placeholder="Enter your name"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Daily Goal (minutes)</label>
            <input
              type="number"
              value={settings.dailyGoal}
              onChange={(e) =>
                updateSettings({
                  dailyGoal: Math.max(1, parseInt(e.target.value) || 120),
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              max="480"
            />
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Save className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Management</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button
              onClick={handleImport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-500 text-center">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">About</h3>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">StudyAI Pro</span> - Your
            intelligent study companion
          </p>
          <p>Version 2.0.0</p>
          <p>Built with Next.js, TypeScript, and AI</p>
        </div>
      </motion.div>
    </div>
  );
}
