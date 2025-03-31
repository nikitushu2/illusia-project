import { CssBaseline } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { ThemeContext } from "./themeContext"
import { ThemeProvider as  MUIThemeProvider } from "@mui/material/styles"
import { darkTheme, lightTheme } from "./theme"

export const ThemeProvider = ({children}:{children:React.ReactNode}) => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const [mode, setMode] =useState<"light" | "dark">( savedTheme|| "light");

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }


    const modeTheme = useMemo(
        () => (mode === 'light' ? lightTheme : darkTheme), [mode]);

return(
    <ThemeContext.Provider value={{mode, toggleMode}}>
        <MUIThemeProvider theme = {modeTheme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    </ThemeContext.Provider>
)

}