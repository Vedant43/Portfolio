import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  return <Ctx.Provider value={{ dark, toggle: () => setDark(p => !p) }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
