"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { LoggedTaskEntry, UserProfile, OneOnOneMeeting } from "@/lib/types";
import { SEED_TASKS, MOCK_MEETINGS } from "@/lib/mock-data";
import { USER_PROFILE } from "@/lib/constants";

interface AppContextValue {
  tasks: LoggedTaskEntry[];
  meetings: OneOnOneMeeting[];
  userProfile: UserProfile;
  addTask: (entry: LoggedTaskEntry) => void;
  removeTask: (taskId: string) => void;
  addMeeting: (meeting: OneOnOneMeeting) => void;
  updateMeeting: (meeting: OneOnOneMeeting) => void;
  removeMeeting: (meetingId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const TASKS_KEY = "proofpoint_tasks";
const MEETINGS_KEY = "proofpoint_meetings";
const DATA_VERSION_KEY = "proofpoint_data_version";
const DATA_VERSION = "2"; // bump this to reset localStorage to fresh mock data

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<LoggedTaskEntry[]>(SEED_TASKS);
  const [meetings, setMeetings] = useState<OneOnOneMeeting[]>(MOCK_MEETINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
      if (storedVersion !== DATA_VERSION) {
        // Version mismatch — reset to fresh mock data
        setTasks(SEED_TASKS);
        setMeetings(MOCK_MEETINGS);
        localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
        localStorage.setItem(MEETINGS_KEY, JSON.stringify(MOCK_MEETINGS));
        localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      } else {
        const storedTasks = localStorage.getItem(TASKS_KEY);
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : null;
        if (parsedTasks && parsedTasks.length > 0) setTasks(parsedTasks);
        else {
          setTasks(SEED_TASKS);
          localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
        }

        const storedMeetings = localStorage.getItem(MEETINGS_KEY);
        const parsedMeetings = storedMeetings ? JSON.parse(storedMeetings) : null;
        if (parsedMeetings && parsedMeetings.length > 0) setMeetings(parsedMeetings);
        else {
          setMeetings(MOCK_MEETINGS);
          localStorage.setItem(MEETINGS_KEY, JSON.stringify(MOCK_MEETINGS));
        }
      }
    } catch {
      setTasks(SEED_TASKS);
      setMeetings(MOCK_MEETINGS);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  }, [meetings, hydrated]);

  const addTask = useCallback((entry: LoggedTaskEntry) => {
    setTasks((prev) => [entry, ...prev]);
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((e) => e.task.id !== taskId));
  }, []);

  const addMeeting = useCallback((meeting: OneOnOneMeeting) => {
    setMeetings((prev) => [meeting, ...prev]);
  }, []);

  const updateMeeting = useCallback((meeting: OneOnOneMeeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? meeting : m)));
  }, []);

  const removeMeeting = useCallback((meetingId: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        meetings,
        userProfile: USER_PROFILE,
        addTask,
        removeTask,
        addMeeting,
        updateMeeting,
        removeMeeting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
