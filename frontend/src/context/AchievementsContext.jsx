// src/context/AchievementsContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from "react";

const AchievementsContext = createContext(null);
export const useAchievements = () => useContext(AchievementsContext);

const initialState = {
  achievements: [],
  lastUnlocked: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, achievements: action.items };
    case "UNLOCK_TOAST":
      return { ...state, lastUnlocked: action.item };
    case "CLEAR_TOAST":
      return { ...state, lastUnlocked: null };
    default:
      return state;
  }
}

// Lee el token desde tu storage real
function getAuthToken() {
  try {
    const raw = localStorage.getItem("ahorra_oink_auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

// Helper GET contra /api/*
async function apiGet(path) {
  const token = getAuthToken();
  const res = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function AchievementsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async () => {
    try {
      // ✅ ruta correcta en tu backend: /api/achievements/
      const data = await apiGet("/achievements/");
      const items = (data?.achievements || []).map((a) => ({
        ...a,
        // compat con tu UI actual
        title: a.name,
        details: a.description,
        date: a.unlocked_at || null,
      }));
      dispatch({ type: "SET", items });
    } catch {
      dispatch({ type: "SET", items: [] });
    }
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("achievements:refresh", handler);
    return () => window.removeEventListener("achievements:refresh", handler);
  }, [load]);

  const value = useMemo(
    () => ({
      achievements: state.achievements,
      refreshAchievements: load,
      lastUnlocked: state.lastUnlocked,
      clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
    }),
    [state.achievements, state.lastUnlocked, load]
  );

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
}
