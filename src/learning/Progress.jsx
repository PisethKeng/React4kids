import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { lessonById } from "./curriculum";
import { readStored } from "./storage";

export const PROGRESS_KEY = "react-workspace:progress:v1";
export const initialProgress = {
  version: 1,
  lessons: {},
  bookmarks: [],
  lastLesson: null,
  theme: "light",
  milestones: [],
};
const ProgressContext = createContext(null);
export function normalizeProgress(value) {
  if (
    !value ||
    value.version !== 1 ||
    !value.lessons ||
    typeof value.lessons !== "object"
  )
    return { ...initialProgress };
  const lessons = {};
  Object.keys(lessonById).forEach((id) => {
    const record = value.lessons[id];
    if (record && typeof record === "object")
      lessons[id] = {
        explored: record.explored === true,
        practice: record.practice === true,
        check: record.check === true,
        attempts:
          Number.isSafeInteger(record.attempts) && record.attempts >= 0
            ? record.attempts
            : 0,
      };
  });
  return {
    version: 1,
    lessons,
    bookmarks: Array.isArray(value.bookmarks)
      ? [...new Set(value.bookmarks.filter((id) => lessonById[id]))]
      : [],
    lastLesson: lessonById[value.lastLesson] ? value.lastLesson : null,
    theme: value.theme === "dark" ? "dark" : "light",
    milestones: Array.isArray(value.milestones)
      ? [
          ...new Set(
            value.milestones.filter(
              (n) => Number.isInteger(n) && n >= 0 && n < 5,
            ),
          ),
        ]
      : [],
  };
}
export const isComplete = (record) =>
  Boolean(record?.explored && record?.practice && record?.check);
export function progressReducer(state, action) {
  switch (action.type) {
    case "visit":
      return lessonById[action.id] && state.lastLesson !== action.id
        ? { ...state, lastLesson: action.id }
        : state;
    case "explore": {
      if (!lessonById[action.id] || state.lessons[action.id]?.explored)
        return state;
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [action.id]: { ...state.lessons[action.id], explored: true },
        },
      };
    }
    case "answer": {
      if (
        !lessonById[action.id] ||
        !["practice", "check"].includes(action.kind)
      )
        return state;
      const record = state.lessons[action.id] || {};
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [action.id]: {
            ...record,
            attempts: (record.attempts || 0) + 1,
            [action.kind]: record[action.kind] || action.correct === true,
          },
        },
      };
    }
    case "bookmark":
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.id)
          ? state.bookmarks.filter((id) => id !== action.id)
          : [...state.bookmarks, action.id],
      };
    case "theme":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "milestone":
      return {
        ...state,
        milestones: state.milestones.includes(action.index)
          ? state.milestones.filter((n) => n !== action.index)
          : [...state.milestones, action.index],
      };
    case "reset-lesson": {
      const lessons = { ...state.lessons };
      delete lessons[action.id];
      return { ...state, lessons };
    }
    case "reset":
      return { ...initialProgress, theme: state.theme };
    default:
      return state;
  }
}
export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, null, () =>
    normalizeProgress(readStored(PROGRESS_KEY, initialProgress)),
  );
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  return (
    <ProgressContext.Provider value={{ state, dispatch, storageError }}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress requires ProgressProvider");
  return value;
}
