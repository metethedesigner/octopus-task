import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkTokenValidity } from "octopus_task/store/slices/authSlice";
import { AppDispatch } from "octopus_task/store";

const withTokenCheck = (WrappedComponent: any) => {
  return (props: any) => {
    const dispatch = useDispatch<AppDispatch>();

    // 1 dakikada bir istek atacak şekilde interval yazıyoruz ve düzenli olarka token geçerliliğini kontrol ediyoruz.
    useEffect(() => {
      const interval = setInterval(() => {
        dispatch(checkTokenValidity());
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, [dispatch]);

    return <WrappedComponent {...props} />;
  };
};

export default withTokenCheck;
