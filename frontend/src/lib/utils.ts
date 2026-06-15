// This file is required by Shadcn UI components
// cn() merges Tailwind classes cleanly — used everywhere in components
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}