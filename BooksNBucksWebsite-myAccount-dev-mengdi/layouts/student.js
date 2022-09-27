import Link from "next/link";
import {
  FiBarChart2,
  FiCalendar,
  FiHeart,
  FiHome,
  FiLogOut,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiX,
} from "react-icons/fi";
import { useRouter } from "next/router";
import { signOut } from "../helpers/hooks";
import SimpleBar from "simplebar-react";
import { useEffect, useState } from "react";
import { fetchProfile, fetchAddCode } from "../helpers/backend_helper";
import PreLoader from "../components/common/preloader";
import { UserContext } from "../contexts/user";
import { NavItemProfile } from "./teacher";
import { AiOutlineQuestionCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const StudentLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  function getAddCode() {
    setLoading(true);
    fetchAddCode().then(({ error, data }) => {
      if (error === false) {
        setCode(data);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get code!");
      }
    });
  }

  const handleClickOpen = () => {
    getAddCode();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Modal(props) {
    if (props.loading) {
      return <PreLoader />;
    }
    return (
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Code: {code}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please ask your parents to enter this above code in parent portal.
            This code will expire in 10 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} autoFocus>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    fetchProfile().then(({ error, data }) => {
      if (error === false) {
        setUser(data);
      } else {
        router.push("/");
      }
    });
  };

  const isWishlist = (id) => {
    return user?.wishlist?.find((wish) => wish === id) !== undefined;
  };

  if (!user) {
    return <PreLoader />;
  }

  const toggleMobileMenu = () => {
    try {
      document.querySelector(".mobile-menu").classList.toggle("active");
    } catch (e) {}
  };

  if (loading) {
    return <PreLoader />;
  }

  return (
    <UserContext.Provider value={{ ...user, getProfile, isWishlist }}>
      <main className="dashboard-layout">
        <aside className="nav-area">
          <nav className="navbar">
            <div className="site-title">
              <img src="/images/logo.png" alt="" />
              <h3>BookNBucks</h3>
              <FiBarChart2
                className="mobile-menu-icon"
                onClick={toggleMobileMenu}
                size={24}
              />
            </div>
            <div className="mobile-menu">
              <SimpleBar className="menu-wrapper">
                <div className="mobile-menu-title">
                  <h5>Menu</h5>
                  <FiX
                    size={24}
                    className="absolute right-4 top-4"
                    onClick={toggleMobileMenu}
                  />
                </div>
                <ul className="menu">
                  <NavItem href="/student" label="Home" icon={FiHome} />
                  <NavItem
                    href="/student/points"
                    label="Points"
                    icon={FiStar}
                  />
                  <NavItem
                    href="/student/store"
                    label="Store"
                    icon={FiShoppingBag}
                  />
                  <NavItem
                    href="/student/purchases"
                    label="Purchases"
                    icon={FiShoppingCart}
                  />
                  <NavItem
                    href="/student/wishlist"
                    label="Wishlist"
                    icon={FiHeart}
                  />
                  <NavItem
                    href="/student/attendance"
                    label="Attendance"
                    icon={FiCalendar}
                  />
                  <NavItem
                    href="/student/quiz"
                    label="Quizzes"
                    icon={AiOutlineQuestionCircle}
                  />
                  <NavItem
                    href="#"
                    label="Add Parent"
                    icon={AiOutlineUsergroupAdd}
                    onClick={handleClickOpen}
                  />
                  <Modal
                    loading={loading}
                    open={open}
                    handleClose={handleClose}
                  />
                </ul>
              </SimpleBar>
              <div className="flex mx-4 border-t">
                <button className="pt-3 pl-2" onClick={() => signOut(router)}>
                  <FiLogOut className="inline-block ml-4 mr-3" /> Logout
                </button>
              </div>
              <NavItemProfile user={user} />
            </div>
          </nav>
        </aside>
        <div className="main-container">
          <div>{children}</div>
        </div>
      </main>
    </UserContext.Provider>
  );
};
export default StudentLayout;

export const NavItem = ({ href, label, icon: Icon, onClick, childHrefs }) => {
  const handleClick = () => {
    try {
      document.querySelector(".mobile-menu").classList.remove("active");
    } catch (e) {}
    if (onClick) {
      onClick();
    }
  };
  const router = useRouter();
  return (
    <li>
      <Link href={href || "#!"}>
        <a
          onClick={handleClick}
          className={
            router.pathname === href ||
            router.pathname === href + `/[_id]` ||
            childHrefs?.includes(router.pathname)
              ? "active"
              : ""
          }
        >
          <Icon size={18} /> <span>{label}</span>
        </a>
      </Link>
    </li>
  );
};
