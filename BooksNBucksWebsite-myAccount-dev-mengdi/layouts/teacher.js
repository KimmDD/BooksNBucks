import {useEffect, useState} from "react";
import {fetchProfile} from "../helpers/backend_helper";
import {signOut} from "../helpers/hooks";
import {UserContext} from "../contexts/user";
import {useRouter} from "next/router";
import SimpleBar from "simplebar-react";
import {FiBarChart2, FiCalendar, FiGift, FiLogOut, FiShoppingBag, FiTag, FiUser, FiUsers, FiX} from "react-icons/fi";
import {NavItem} from "./student";
import {AiOutlineAppstoreAdd, AiOutlineQuestionCircle, AiOutlineShop} from "react-icons/ai";
import {BsCalendarCheck} from "react-icons/bs";

const TeacherLayout = ({children}) => {
    const router = useRouter()
    const [user, setUser] = useState()
    useEffect(() => {
        fetchProfile().then(({error, data}) => {
            if (error === false) {
                setUser(data)
            } else {
                router.push('/')
            }
        })
    }, [])

    const toggleMobileMenu = () => {
        try {
            document.querySelector('.mobile-menu').classList.toggle('active')
        } catch (e) {

        }
    }

    if (!user) {
        return <></>
    }

    return (
        <UserContext.Provider value={{...user}}>
            <main className="dashboard-layout">
                <aside className="nav-area">
                    <nav className="navbar">
                        <div className="site-title">
                            <img src="/images/logo.png" alt=""/>
                            <h3>BookNBucks</h3>
                            <FiBarChart2 className="mobile-menu-icon" onClick={toggleMobileMenu} size={24}/>
                        </div>
                        <div className="mobile-menu">
                            <SimpleBar className="menu-wrapper">
                                <div className="mobile-menu-title">
                                    <h5>Menu</h5>
                                    <FiX size={24} className="absolute right-4 top-4" onClick={toggleMobileMenu}/>
                                </div>
                                <ul className="menu">
                                    <NavItem href="/teacher" label="Dashboard" icon={AiOutlineAppstoreAdd}/>
                                    <NavItem href="/teacher/inventory" label="Inventory" icon={AiOutlineShop}/>
                                    <NavItem href="/teacher/purchases" label="Purchases" icon={FiShoppingBag}/>
                                    <NavItem href="/teacher/roster" label="Roster" icon={FiUsers}/>
                                    <NavItem href="/teacher/traits" label="Traits" icon={FiTag}/>
                                    <NavItem href="/teacher/award" label="Award" icon={FiGift}/>
                                    <NavItem href="/teacher/classes" label="Classes" icon={FiCalendar}
                                             childHrefs={['/teacher/classes/create']}/>
                                    <NavItem href="/teacher/attendance" label="Attendance" icon={BsCalendarCheck}/>
                                    <NavItem href="/teacher/quiz" label="Quiz" icon={AiOutlineQuestionCircle}
                                             childHrefs={['/teacher/quiz/create', '/teacher/submissions/[quiz]']}
                                    />
                                </ul>
                            </SimpleBar>
                            <div className="flex mx-4 border-t">
                                <button className="pt-3 pl-2" onClick={() => signOut(router)}>
                                    <FiLogOut className="inline-block ml-4 mr-3"/> Logout
                                </button>
                            </div>
                            <NavItemProfile user={user}/>
                        </div>
                    </nav>
                </aside>
                <div className="main-container">
                    <div className="bg-white rounded-lg p-6 md:p-10">
                        {children}
                    </div>
                </div>
            </main>
        </UserContext.Provider>
    )
}
export default TeacherLayout

export const NavItemProfile = ({user}) => {
    return (
        <div className="p-3 rounded-xl absolute" style={{bottom: 24, left: 24, right: 24, background: '#f3f4f6'}}>
            <div className="flex items-center">
                <div className="bg-primary overflow-hidden flex justify-center items-center mr-3"
                     style={{height: 40, width: 40, borderRadius: 40}}>
                    <FiUser size={18} className="text-white"/>
                </div>
                <div>
                    <p className="font-semibold text-base mb-0 oswald">{user?.first_name || ''} {user?.last_name || ''}</p>
                    <p className="text-sm mb-0 oswald">{user?.email || ''}</p>
                </div>
            </div>
        </div>
    )
}