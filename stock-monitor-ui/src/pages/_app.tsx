import getNewRefreshToken from "@/api/getNewRefreshToken";
import ProgressBar from "@/components/common/Progressbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/redux/provider";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  const rootStore = store.getState();
  const [renderOutLet, setRenderOutlet] = useState(false);
  const fetchAccessToken = async (): Promise<void> => {
    try {
      await getNewRefreshToken();
      setRenderOutlet(true);
    } catch (error: any) {
      setRenderOutlet(true);
    }
  };

  useEffect(() => {
    try {
      void fetchAccessToken();
    } catch (error: any) {}
  }, []);
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        {renderOutLet ? <Component {...pageProps} /> : <ProgressBar />}
        <Toaster />
      </Providers>
    </ThemeProvider>
  );
}
