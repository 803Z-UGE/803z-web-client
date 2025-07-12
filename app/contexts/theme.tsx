import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const ThemeContext = createContext<{ theme: string; setTheme: (theme: string) => void }>({
    theme: 'default',
    setTheme: () => {
        console.warn('ThemeContext not initialized');
    },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'default');

    const contextValue = {
        theme: theme,
        setTheme: (newTheme: string) => {
            console.log('Setting theme to:', newTheme);
            setTheme(newTheme);
        },
    };

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
