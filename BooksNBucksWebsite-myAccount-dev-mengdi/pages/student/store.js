import StudentLayout from "../../layouts/student";
import {useAction, useFetch, useWindowSize} from "../../helpers/hooks";
import {fetchProducts, postPurchase, postWishlist} from "../../helpers/backend_helper";
import {Col, Modal, Row} from "react-bootstrap";
import {BsHeartFill, BsSuitHeart} from "react-icons/bs";
import {useUserContext} from "../../contexts/user";
import {useEffect, useState} from "react";
import {swalLoading} from "../../components/common/alert";
import swal from "sweetalert2";
import {notification} from "antd";
import Link from 'next/link'
import Pagination from "../../components/common/pagination";
import {Loading} from "../../components/common/preloader";

const Store = () => {
    let {width} = useWindowSize()
    const [products, setProducts] = useState()
    const [loading, setLoading] = useState(true)
    const [size, setSize] = useState(0)

    useEffect(() => {
        if (width) {
            if (width >= 1400) {
                setSize(8)
            } else {
                setSize(6)
            }
        }
    }, [width])

    useEffect(() => {
        if (size > 0) {
            getProducts(1, size)
        }
    }, [size])

    const getProducts = (page, size) => {
        setLoading(true)
        fetchProducts({page, size}).then(({error, data}) => {
            setLoading(false)
            if (error === false) {
                setProducts(data)
            }
        })
    }


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
            user.getProfile()
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    const [purchase, setPurchase] = useState()

    const handlePurchase = async _id => {
        swalLoading()
        let {error, msg} = await postPurchase({_id})
        swal.close()
        if (error === false) {
            setPurchase({
                ...purchase,
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
                                <Link href="/student/wishlist">
                                    <button className="btn-primary-lg w-56 mr-4">SEE WISHLIST</button>
                                </Link>
                                <button className="btn-primary-lg w-56" onClick={() => setWish(undefined)}>BACK TO
                                    STORE
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
            <Modal show={purchase} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <img className="h-72 inline-block" src={purchase?.image} alt=""/>
                        </Col>
                        <Col md={6} className="my-auto">
                            <p className="text-center text-4xl font-semibold text-5A mb-4">
                                {purchase?.done ? "You Purchased" : <>Would you like <br/> to purchase</>  }
                            </p>
                            <p className="text-center text-5xl font-semibold">{purchase?.name}</p>
                            <p className="text-center text-4xl font-semibold text-5A">
                                {purchase?.done && <>It will arrive in <br/> ~1 week!</>}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {purchase?.done ? (
                            <>
                                <button className="btn-primary-lg w-56" onClick={() => setPurchase(undefined)}>BACK TO
                                    STORE
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary-lg w-48 mr-4"
                                        onClick={() => handlePurchase(purchase?._id)}>YES
                                </button>
                                <button className="btn-primary-lg w-48" onClick={() => setPurchase(undefined)}>CANCEL
                                </button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <div
                className="bg-white px-8 py-4 md:h-32 flex flex-wrap justify-content-between items-center rounded-lg shadow-sm mb-8">
                <img className="h-24" src="/images/hello.svg" alt=""/>
                <div className="flex flex-wrap justify-center items-center">
                    <h2 className="mr-12 text-4xl my-2">You Have</h2>
                    <img className="h-16" src="/images/star.svg" alt=""/>
                    <h2 className="font-bold px-2 text-primary text-4xl mb-0">{user?.points}</h2>
                </div>
            </div>
            {
                loading ? (
                    <div className="flex justify-center items-center" style={{height: '50vh'}}>
                        <Loading/>
                    </div>
                ) : (
                    <>
                        <Row>
                            {products?.docs?.map((product, index) => (
                                <Col xxl={3} lg={4} md={6} key={index}>
                                    <div className="bg-white p-6 rounded-lg w-full mb-6">
                                        <div className="h-32 text-center mb-4">
                                            <img src={product.image} className="inline-block"
                                                 style={{maxHeight: '100%'}} alt=""/>
                                        </div>
                                        <div className="h-14 mb-2">
                                            <h6 className="font-semibold truncate">{product?.name}</h6>
                                            <h6 className="font-semibold">{product?.cost} Points</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                {user?.points >= product?.cost && product?.stock > 1 ? (
                                                    <button className="btn btn-primary" onClick={() => setPurchase(product)}>Buy</button>
                                                ) : (
                                                    <p className="text-primary text-sm mb-0"> {product?.stock < 1 ? 'Out of Stock' : 'Not Enough points'}</p>
                                                )}
                                            </div>
                                            {user.isWishlist(product._id) ? (
                                                <BsHeartFill className="text-primary" size={20} role={"button"}
                                                             onClick={() => setWish({...product, wishlist: true})}/>
                                            ) : (
                                                <BsSuitHeart size={20} role={"button"}
                                                             onClick={() => setWish(product)}/>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center">
                            <Pagination
                                pageCount={products?.totalPages || 1}
                                page={products?.page || 1}
                                onPageChange={(page) => getProducts(page, size)}
                            />
                        </div>
                    </>
                )
            }
        </>
    )
}
Store.layout = StudentLayout
export default Store