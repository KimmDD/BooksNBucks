import Link from "next/link";
import AuthLayout from "../layouts/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import initFirebase from "../helpers/firbase";
import { postSocialLogin } from "../helpers/backend_helper";
import { swalLoading } from "../components/common/alert";
import swal from "sweetalert2";
import { notification } from "antd";
import { useRouter } from "next/router";

const Home = (props) => {
  const router = useRouter();

  useEffect(() => {
    initFirebase();
  }, []);

  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (result) => {
        swalLoading();
        let idToken = await result.user.getIdToken(true);
        postSocialLogin({ idToken }).then(async ({ error, msg, token }) => {
          swal.close();
          if (error === false) {
            localStorage.setItem("token", token);
            await notification.success({
              message: "Success",
              description: msg,
            });
            await router.reload();
          } else {
            await notification.error({ message: "Error", description: msg });
          }
          console.log(error, msg, token);
        });
      })
      .catch((error) => {
        swal.close();
        console.log(error);
      });
  };

  return (
    <AuthLayout>
      <div className="auth-cards">
        <h3 className="text-primary font-bold mb-3">Log in</h3>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-dark w-full"
        >
          Sign in with Google
        </button>
      </div>

      <div className="auth-cards">
        <h3 className="text-primary font-bold mb-3">Sign In</h3>
        <Link href="/login">
          <button type="button" className="btn btn-dark w-full">
            Sign in
          </button>
        </Link>
      </div>

      <div className="auth-cards">
        <h3 className="text-primary font-bold mb-3">Sign Up</h3>
        <Link href="/signup">
          <button type="button" className="btn btn-dark w-full">
            Sign up for a BooksNBucks account
          </button>
        </Link>
      </div>
    </AuthLayout>
  );
};
export default Home;
