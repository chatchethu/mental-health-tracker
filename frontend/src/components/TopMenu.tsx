"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

export default function TopMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center w-10 h-10 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={8}
          className={cn(
            "z-50 min-w-[12rem] overflow-hidden rounded-lg border bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg p-2 space-y-1 text-sm"
          )}
        >
          {/* 🏠 Dashboard */}
          <DropdownMenuItem asChild>
            <Link
              href="/"
              className="block px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🏠 Dashboard
            </Link>
          </DropdownMenuItem>

          {/* 🎓 Academic Resources */}
          <DropdownMenuItem asChild>
            <Link
              href="/academic-resources"
              className="block px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🎓 Academic Resources
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="h-px my-1 bg-gray-200 dark:bg-gray-700" />

          {/* 🧘 Mindfulness Resources */}
          <div>
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Mindfulness Resources
            </p>

            <div className="pl-3 ml-2 space-y-1 border-l border-gray-200 dark:border-gray-700">
              <Link
                href="/resources/guided-meditation"
                className="block px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                🧘 Guided Meditation
              </Link>
              <Link
                href="/resources/breathing-exercises"
                className="block px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                🌬️ Breathing Exercises
              </Link>
              <Link
                href="/resources/self-help-library"
                className="block px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                📚 Self-Help Library
              </Link>
              <Link
                href="/resources/relaxing-sounds"
                className="block px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                🎧 Relaxing Sounds
              </Link>
            </div>
          </div>

          <DropdownMenuSeparator className="h-px my-1 bg-gray-200 dark:bg-gray-700" />

          {/* ⚙️ Settings */}
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="block px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ⚙️ Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
