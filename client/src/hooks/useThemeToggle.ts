import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { toggleTheme, setDarkMode } from "@/state/slices/theme";
import { useEffect } from "react";

export function useThemeToggle() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  // Initial sync with localStorage / system preference could go here
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return { isDarkMode, toggleTheme: handleToggle, setDarkMode: (mode: boolean) => dispatch(setDarkMode(mode)) };
}
