"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  CalendarDays,
  BookOpen,
  CheckCircle2,
  PlusCircle,
  Headphones,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopMenu from "@/components/TopMenu";
import toast from "react-hot-toast";

interface Task {
  title: string;
  due: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export default function AcademicPressureMonitor() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", due: "", priority: "medium" });

  // ✅ Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("academic_tasks_v2");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // ✅ Save updates to localStorage
  useEffect(() => {
    localStorage.setItem("academic_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Workload intensity calculation
  const workload = useMemo(() => {
    if (tasks.length === 0) return 0;
    const active = tasks.filter((t) => !t.completed);
    if (active.length === 0) return 0;
    const weights = { low: 30, medium: 60, high: 90 };
    const avg =
      active.reduce((sum, t) => sum + weights[t.priority], 0) / active.length;
    return Math.round(avg);
  }, [tasks]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // ✅ Add new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.due) {
      toast.error("Please fill all fields");
      return;
    }

    const newT: Task = {
      title: newTask.title,
      due: newTask.due,
      priority: newTask.priority as "low" | "medium" | "high",
      completed: false,
    };
    setTasks([...tasks, newT]);
    setNewTask({ title: "", due: "", priority: "medium" });
    toast.success("Task added successfully!");
  };

  // ✅ Toggle complete
  const toggleComplete = (i: number) => {
    const updated = [...tasks];
    updated[i].completed = !updated[i].completed;
    setTasks(updated);
  };

  // ✅ Delete task
  const deleteTask = (i: number) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
    toast.success("Task deleted");
  };

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen pb-20 transition-all duration-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      {/* 🧭 Top Header with MindfulTrack & TopMenu */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 shadow-sm bg-white/80 dark:bg-gray-900/70 backdrop-blur-md dark:border-gray-700">
        <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <Headphones className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              MindfulTrack
            </h1>
          </div>
          <TopMenu />
        </div>
      </header>

      {/* 📘 Academic Pressure Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl px-6 pt-10 mx-auto"
      >
        {/* Title */}
        <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          <GraduationCap className="text-purple-600 w-7 h-7" />
          Academic Pressure Monitor
        </h1>

        {/* Workload Intensity */}
        <Card className="mb-8 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Workload Intensity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Current Level
              </span>
              <span className="font-semibold text-indigo-600">{workload}%</span>
            </div>
            <Progress value={workload} className="h-3 rounded-full" />
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <CalendarDays className="w-5 h-5 text-indigo-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tasks yet. Add one below 👇
              </p>
            ) : (
              tasks.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                >
                  <div>
                    <h3
                      className={`font-medium ${
                        t.completed
                          ? "line-through text-green-500"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {t.title}
                    </h3>
                    <p className="text-xs text-gray-500">Due: {t.due}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleComplete(i)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTask(i)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ➕ Add Task Section */}
        <Card className="mt-8 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <PlusCircle className="w-5 h-5 text-blue-500" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="e.g., History Essay"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.due}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Priority</Label>
                <select
                  className="w-full p-2 mt-1 bg-white border rounded-lg dark:bg-gray-800"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as "low" | "medium" | "high",
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleAddTask}
              className="mt-4 text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Task
            </Button>
          </CardContent>
        </Card>

        {/* 📊 Summary Section */}
        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
          <Card className="text-center border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-indigo-600">{activeCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Active Tasks
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-500">
                {completedCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Completed
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
