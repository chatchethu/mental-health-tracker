"use client";

import { useState, useEffect } from "react";
import { BookOpen, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Task {
  title: string;
  due: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export function AcademicTasksPreview() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ✅ Load tasks from localStorage (same key as Academic page)
  useEffect(() => {
    const saved = localStorage.getItem("academic_tasks_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      const activeTasks = parsed.filter((t: Task) => !t.completed);
      setTasks(activeTasks);
    }
  }, []);

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
    <div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">
          🎓 No active academic tasks. You're all caught up!
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 3).map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {t.title}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  <CalendarDays className="inline w-3 h-3 mr-1" />
                  Due: {t.due}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                  t.priority
                )}`}
              >
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 🔗 View All Button */}
      <div className="mt-4 text-right">
        <Link href="/academic-resources">
          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            View All →
          </Button>
        </Link>
      </div>
    </div>
  );
}
