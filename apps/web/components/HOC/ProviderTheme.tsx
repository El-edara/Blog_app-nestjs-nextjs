import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const ProviderTheme = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider enableSystem defaultTheme="system" attribute={"class"}>
      {children}
    </ThemeProvider>
  );
};
export default ProviderTheme;
