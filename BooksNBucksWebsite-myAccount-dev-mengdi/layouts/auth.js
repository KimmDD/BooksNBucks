import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getVerify } from "../helpers/backend_helper";
import PreLoader from "../components/common/preloader";

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const [verify, setVerify] = useState(true);
  useEffect(() => {
    if (router.pathname === "/") {
      getVerify().then(({ error, data }) => {
        if (error === false) {
          if (data?.role && data?.school) {
            if (data?.role === "teacher") {
              router.push("/teacher");
            } else if (data?.role === "student") {
              router.push("/student");
            }
          } else {
            if (data?.role === "parent") {
              router.push("/parent");
            } else {
              router.push("/role");
            }
          }
        } else {
          setVerify(false);
        }
      });
    } else {
      setVerify(false);
    }
  }, [router.pathname]);

  if (verify) {
    return <PreLoader />;
  }
  return (
    <div className="auth-layout">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <div className="container">
          <Link href="/">
            <div className="site-title" role="button">
              BooksNBucks
            </div>
          </Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href={"/login"}>
                  <a className="nav-link">Sign in</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={"/signup"}>
                  <a className="nav-link">Sign up</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="main-container">{children}</div>
    </div>
  );
};
export default AuthLayout;
