"use client";

import { Role } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  name: string;
  email: string;
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "Sarah Chen",
      email: "sarah@agency.com",
      role: "agency",
      setRole: (role) => set({ role }),
      logout: () => {
        set({ role: "agency" });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("influapp-user");
        }
      }
    }),
    { name: "influapp-user" }
  )
);
