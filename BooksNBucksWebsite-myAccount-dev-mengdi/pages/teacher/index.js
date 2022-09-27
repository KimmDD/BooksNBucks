import TeacherLayout from "../../layouts/teacher";
import {useFetch} from "../../helpers/hooks";
import {fetchDashboard} from "../../helpers/backend_helper";
import {Col, Row} from "react-bootstrap";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from "recharts";
import moment from "moment";
import {useRouter} from "next/router";

const Home = () => {
    const router = useRouter()
    const [dashboard] = useFetch(fetchDashboard, {date: moment().format('YYYY-MM-DD')})
    return (
        <>
            <Row>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>Latest Item Added</h5>
                        <hr/>
                        <ul className="pl-0">
                            {dashboard?.products?.map((product, index) => (
                                <li role={"button"} key={index} onClick={() => router.push('/teacher/inventory?product=' + product._id)} className="mb-3 pb-3 border-b"> {index + 1}. {product?.name} </li>
                            ))}
                        </ul>
                    </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>Top Purchases</h5>
                        <hr/>
                        <div style={{height: 280}}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={dashboard?.purchases}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: -40,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip/>
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false}/>
                                    <Bar dataKey="orders" fill="#dc3545" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 rounded h-full">
                        <h5>Order Status</h5>
                        <hr/>
                        <ul className="pl-0">
                            {dashboard?.purchaseStatus?.map((status, index) => (
                                <li role={"button"} key={index} onClick={() => router.push('/teacher/purchases?status=' + status._id)} className="mb-3 pb-3 border-b flex justify-between">
                                    <span>{status?._id} </span>
                                    <span>{status?.total} </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>Absent Today</h5>
                        <hr/>
                        <ul className="pl-0">
                            {dashboard?.absence?.map((log, index) => (
                                <li role={"button"} key={index} className="mb-3 pb-3 border-b"> {index + 1}. {log?.student?.first_name} {log?.student?.last_name} </li>
                            ))}
                        </ul>
                    </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>New Orders</h5>
                        <hr/>
                        <ul className="pl-0">
                            {dashboard?.newPurchases?.map((purchase, index) => (
                                <li role={"button"} key={index} className="mb-3 pb-3 border-b"> {index + 1}. {purchase?.purchased_by?.first_name} {purchase?.purchased_by?.last_name}</li>
                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>
        </>
    )
}

Home.layout = TeacherLayout
export default Home