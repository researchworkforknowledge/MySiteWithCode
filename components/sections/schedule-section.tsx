"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/store";
import { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
} from "date-fns";
import { Modal, Button, Input } from "@/components/ui/common";

interface ScheduleEvent {
  id: string;
  title: string;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export function ScheduleSection() {
  const { schedule, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent } =
    useStudyStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [newEvent, setNewEvent] = useState({
    title: "",
    subject: "",
    startTime: "09:00",
    endTime: "10:00",
    color: COLORS[0],
  });

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentWeek]);

  const eventsForWeek = useMemo(() => {
    return schedule.filter((event) => {
      const eventDate = new Date(event.date);
      return weekDays.some((day) => isSameDay(day, eventDate));
    });
  }, [schedule, weekDays]);

  const getEventsForDay = (date: Date) => {
    return schedule.filter((event) => isSameDay(new Date(event.date), date));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    addScheduleEvent({
      ...newEvent,
      date: selectedDate,
    });

    setNewEvent({
      title: "",
      subject: "",
      startTime: "09:00",
      endTime: "10:00",
      color: COLORS[0],
    });
    setShowAddModal(false);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    updateScheduleEvent(editingEvent.id, editingEvent);
    setEditingEvent(null);
  };

  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold">
                {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {eventsForWeek.length} events this week
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
            >
              Today
            </button>
            <Button
              onClick={() => {
                setSelectedDate(new Date());
                setShowAddModal(true);
              }}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Week Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 border-r border-border" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => {
                setSelectedDate(day);
                setShowAddModal(true);
              }}
              className={`p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                isToday(day) ? "bg-primary/10" : ""
              }`}
            >
              <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
              <p
                className={`text-lg font-semibold ${
                  isToday(day) ? "text-primary" : ""
                }`}
              >
                {format(day, "d")}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="max-h-[500px] overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-border/50">
              <div className="p-2 text-xs text-muted-foreground border-r border-border text-right pr-3">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day).filter((e) =>
                  e.startTime.startsWith(time.split(":")[0])
                );
                return (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    className="min-h-[40px] border-r border-border/50 p-1 relative"
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setEditingEvent(event as ScheduleEvent)}
                        className="absolute inset-x-1 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                        style={{
                          backgroundColor: `${event.color}20`,
                          borderLeft: `3px solid ${event.color}`,
                          color: event.color,
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Today's Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{"Today's Schedule"}</h3>
        </div>

        <div className="space-y-3">
          {getEventsForDay(new Date()).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No events scheduled for today
            </p>
          ) : (
            getEventsForDay(new Date()).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Event Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Study Event"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="e.g., Math Study Session"
          />
          <Input
            label="Subject"
            value={newEvent.subject}
            onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
            placeholder="e.g., Mathematics"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
            />
            <Input
              label="End Time"
              type="time"
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewEvent({ ...newEvent, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    newEvent.color === color ? "scale-110 ring-2 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddEvent}>
              Add Event
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
      >
        {editingEvent && (
          <div className="space-y-4">
            <Input
              label="Title"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
            />
            <Input
              label="Subject"
              value={editingEvent.subject}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, subject: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={editingEvent.startTime}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, startTime: e.target.value })
                }
              />
              <Input
                label="End Time"
                type="time"
                value={editingEvent.endTime}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, endTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditingEvent({ ...editingEvent, color })}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      editingEvent.color === color
                        ? "scale-110 ring-2 ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="danger"
                onClick={() => {
                  deleteScheduleEvent(editingEvent.id);
                  setEditingEvent(null);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setEditingEvent(null)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpdateEvent}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
