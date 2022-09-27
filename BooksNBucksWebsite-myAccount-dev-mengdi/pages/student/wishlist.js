import StudentLayout from "../../layouts/student";
import {useFetch} from "../../helpers/hooks";
import {fetchWishlist, postGoal, postWishlist} from "../../helpers/backend_helper";
import {Col, Modal, Row} from "react-bootstrap";
import {useState} from "react";
import Pagination from "../../components/common/pagination";
import Link from "next/link";
import {useUserContext} from "../../contexts/user";
import {swalLoading} from "../../components/common/alert";
import swal from "sweetalert2";
import {notification} from "antd";

const Wishlist = () => {
    const [wishlist, getWishlist] = useFetch(fetchWishlist)
    let [page, setPage] = useState(1)

    const user = useUserContext()
    const [wish, setWish] = useState()
    const toggleWishlist = async _id => {
        swalLoading()
        let {error, msg} = await postWishlist({_id})
        swal.close()
        if (error === false) {
            setWish({
                ...wish,
                done: true,
            })
            getWishlist()
            user.getProfile()
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    const [goal, setGoal] = useState()
    const changeGoal = async _id => {
        swalLoading()
        let {error, msg} = await postGoal({_id})
        swal.close()
        if (error === false) {
            setGoal({
                ...goal,
                done: true,
            })
            user.getProfile()
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    return (
        <>
            <Modal show={wish} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <img className="h-72 inline-block" src={wish?.image} alt=""/>
                        </Col>
                        <Col md={6} className="my-auto">
                            {wish?.done ||
                                <p className="text-center text-4xl font-semibold text-5A">{wish?.wishlist ? 'Remove' : 'Add'}</p>}
                            <p className="text-center text-5xl font-semibold">{wish?.name}</p>
                            <p className="text-center text-4xl font-semibold text-5A">
                                {wish?.done ? (
                                    <>has been {wish?.wishlist ? <> removed <br/> from </> : <> added <br/> to</>} your
                                        wishlist!</>
                                ) : (
                                    <>{wish?.wishlist ? 'from' : 'to'} your wishlist?</>
                                )}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {wish?.done ? (
                            <>
                                <button className="btn-primary-lg w-56" onClick={() => setWish(undefined)}>BACK TO
                                    WISHLIST
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary-lg w-48 mr-4"
                                        onClick={() => toggleWishlist(wish?._id)}>YES
                                </button>
                                <button className="btn-primary-lg w-48" onClick={() => setWish(undefined)}>CANCEL
                                </button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={goal} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <img className="h-72 inline-block" src={goal?.image} alt=""/>
                        </Col>
                        <Col md={6} className="my-auto">
                            {goal?.done || <p className="text-center text-4xl font-semibold text-5A">Set</p>}
                            <p className="text-center text-5xl font-semibold">{goal?.name}</p>
                            <p className="text-center text-4xl font-semibold text-5A">
                                {goal?.done ? (
                                    <>has been added as goal!</>
                                ) : (
                                    <>as your goal?</>
                                )}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {goal?.done ? (
                            <>
                                <button className="btn-primary-lg w-56" onClick={() => setGoal(undefined)}>BACK TO
                                    WISHLIST
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary-lg w-48 mr-4"
                                        onClick={() => changeGoal(goal?._id)}>YES
                                </button>
                                <button className="btn-primary-lg w-48" onClick={() => setGoal(undefined)}>CANCEL
                                </button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <div className="flex justify-center items-center md:mt-4">
                <img src="/images/love.svg" alt=""/>
                <h3 className="mb-0 text-primary px-2 text-bold oswald text-6xl">WISHLIST</h3>
            </div>
            <div className="flex bg-white p-4 rounded-lg items-center mt-8">
                <img className="h-20" src="/images/yay.svg" alt=""/>
                <div>
                    <p className="text-lg font-semibold pl-2 md:pl-8 mb-0">
                        Here are items you wish to buy.<br/>
                        Set one goal to display on your home page.
                    </p>
                </div>
            </div>
            <Row className="pt-8">
                {wishlist?.slice((page - 1) * 3, (page - 1) * 3 + 3).map(item => (
                    <Col md={4}>
                        <div className="bg-white p-4 rounded-lg mb-6 text-center">
                            <div className="flex justify-center items-center h-14 mb-2">
                                <img src="/images/star2.svg" alt="" style={{maxHeight: '100%'}}/>
                                <span className="text-primary text-2xl font-bold oswald ml-2">{item.cost}</span>
                            </div>
                            <div className="flex justify-center h-60 mb-2">
                                <img src={item?.image} style={{maxHeight: '100%'}} alt=""/>
                            </div>
                            <div className="h-16">
                                <p className="text-xl">{item.name}</p>
                            </div>
                            <button
                                className="bg-primary px-4 py-2 rounded-xl shadow-sm text-white mr-2 mb-2 font-semibold disabled:opacity-50"
                                onClick={() => setGoal(item)}
                                disabled={user?.goal?._id === item._id}> {user?.goal?._id === item._id ? 'Your goal' : 'Set As Goal'}</button>
                            <button
                                className="bg-primary px-4 py-2 rounded-xl shadow-sm text-white font-semibold disabled:opacity-50"
                                onClick={() => setWish({...item, wishlist: true})}
                                disabled={user?.goal?._id === item._id}>Remove
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
            {wishlist?.length === 0 ? (
                <div className="text-center">
                    <p className="text-center font-bold text-4xl my-8 text-primary oswald">Your wishlist is empty</p>
                    <Link href="/student/store">
                        <button className="btn-primary-md w-56 mr-4">GO TO STORE</button>
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <Pagination pageCount={Math.ceil((wishlist?.length || 0) / 3)} page={page} onPageChange={setPage}/>
                </div>
            )}

        </>
    )
}
Wishlist.layout = StudentLayout
export default Wishlist