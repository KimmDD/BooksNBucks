import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const RouteLoader = () => {
  const [show, setShow] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setShow(false);
    function routeChangeStart(url) {
      setShow(true);
    }
    function routeChangeComplete(url) {
      setShow(false);
    }
    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
  }, []);
  return (
    <div
      id="preloader"
      style={{ display: show ? "flex" : "none", background: "rgba(0,0,0,.2)" }}
    >
      <Loading />
    </div>
  );
};

const PreLoader = () => {
  return (
    <div
      id="preloader"
      style={{ display: "flex", background: "rgba(0,0,0,.2)" }}
    >
      <Loading />
    </div>
  );
};
export default PreLoader;

export const Loading = () => {
  return (
    <div className="lds-roller">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
