import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkTokenValidity } from "octopus_task/store/slices/authSlice";
import { AppDispatch } from "octopus_task/store";
import React from "react";

const withTokenCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const dispatch = useDispatch<AppDispatch>();

    // 1 dakikada bir istek atacak şekilde interval yazıyoruz ve düzenli olarak token geçerliliğini kontrol ediyoruz.
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
