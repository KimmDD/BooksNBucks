import React from "react";
import "@fontsource/montserrat";
import "@fontsource/oswald";
import "antd/dist/antd.min.css";
import "tailwindcss/tailwind.css";
import "bootstrap/scss/bootstrap.scss";
import "simplebar/dist/simplebar.min.css";
import "../styles/app.scss";
import { RouteLoader } from "../components/common/preloader";
import { useState } from "react";

const App = ({ Component, pageProps }) => {
  let Layout = Component.layout || React.Fragment;
  const [tabValue, setTabValue] = useState("grades");
  const [isParent, setIsParent] = useState(false);
  const [studentId, setStudentId] = useState(0);

  return (
    <>
      <RouteLoader />
      <Layout>
        <Component
          {...pageProps}
          tabValue={tabValue}
          setTabValue={setTabValue}
          isParent={isParent}
          setIsParent={setIsParent}
          studentId={studentId}
          setStudentId={setStudentId}
        />
      </Layout>
    </>
  );
};
export default App;
