// pages/_app.tsx
import { Provider } from "react-redux";
import "../../public/assets/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store";
import withTokenCheck from "octopus_task/utils/withTokenCheck";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OctopusTask({ Component, pageProps }: AppProps) {
  const WrappedComponent = withTokenCheck(Component); // HOC ile App'i sarıyoruz bu sayede token kontrolünü en dış katmanda yapabileceğiz.

  return (
    <Provider store={store}>
      <WrappedComponent {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}

export default OctopusTask;
