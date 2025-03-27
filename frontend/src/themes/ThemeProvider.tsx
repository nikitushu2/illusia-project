import { CssBaseline } from "@mui/material"
import React, { useMemo, useState } from "react"
import { ThemeContext } from "./themeContext"
import { ThemeProvider as  MUIThemeProvider } from "@mui/material/styles"
import { theme } from "./theme"

export const ThemeProvider = ({children}:{children:React.ReactNode}) => {
    const [mode, setMode] =useState<"light" | "dark">("light");

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }

    const modeTheme = useMemo(() => theme(mode), [mode]);

return(
    <ThemeContext.Provider value={{mode, toggleMode}}>
        <MUIThemeProvider theme = {modeTheme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    </ThemeContext.Provider>
)

}