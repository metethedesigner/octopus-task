// pages/_app.tsx
import { Provider } from "react-redux";
import "../../public/assets/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store";

function OctopusTask({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default OctopusTask;
