import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export interface RecentTopic {
  id: string;
  query: string;
  subject: string;
  timestamp: number;
}

export interface StudySession {
  recentTopics: RecentTopic[];
  suggestedTopics: string[];
  studyStreak: number;
  lastVisit: string;
}

export function useStudySession() {
  const [session, setSession] = useLocalStorage<StudySession>('studyai_session', {
    recentTopics: [],
    suggestedTopics: [],
    studyStreak: 0,
    lastVisit: '',
  });

  useEffect(() => {
    const today = new Date().toDateString();
    if (session.lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = session.lastVisit === yesterday.toDateString();
      
      setSession({
        ...session,
        lastVisit: today,
        studyStreak: isConsecutive ? session.studyStreak + 1 : 1,
      });
    }
  }, []);

  const addRecentTopic = (query: string, subject: string) => {
    const newTopic: RecentTopic = {
      id: Date.now().toString(),
      query,
      subject,
      timestamp: Date.now(),
    };
    
    setSession((prev) => ({
      ...prev,
      recentTopics: [newTopic, ...prev.recentTopics.filter(t => t.query !== query)].slice(0, 10),
    }));
  };

  const clearRecentTopics = () => {
    setSession((prev) => ({
      ...prev,
      recentTopics: [],
    }));
  };

  return {
    session,
    addRecentTopic,
    clearRecentTopics,
  };
}
