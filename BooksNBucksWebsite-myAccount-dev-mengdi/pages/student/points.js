import StudentLayout from "../../layouts/student";
import {Col, Row} from "react-bootstrap";
import moment from "moment";
import Link from 'next/link'
import {useFetch} from "../../helpers/hooks";
import {fetchAwards, fetchWeeklySummery} from "../../helpers/backend_helper";
import Pagination from "../../components/common/pagination";

const Points = () => {
    const [awards, getAwards] = useFetch(fetchAwards, {size: 5})
    const [summery] = useFetch(fetchWeeklySummery, {date: moment().startOf('week').toISOString()})

    return (
        <>
            <Row>
                <Col md={6}>
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                        <h2 className="font-medium mb-3 text-center">Attendance Points</h2>
                        <div className="flex justify-center items-center mb-12 mt-8 mb-4">
                            <img src="/images/star3.svg" style={{height: 110}} alt=""/>
                            <h2 className="font-bold px-2 text-primary" style={{fontSize: 80}}>{summery?.attendance || 0}</h2>
                        </div>
                        <h3 className="text-2xl text-center tracking-widest">THIS WEEK</h3>
                        <div className="text-center my-4">
                            <Link href="/student/attendance">
                                <button className="btn btn-primary w-44">View Attendance</button>
                            </Link>

                        </div>
                        <p className="text-sm font-semibold text-center">Earn 1 point for each class you attend <br/> plus bonus points for a perfect week!</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                        <div className="flex justify-between items-center py-4">
                            <div>
                                <h3 className="text-2xl tracking-widest">WEEKLY</h3>
                                <h3 className="text-2xl tracking-widest">SUMMERY</h3>
                                <div className="flex justify-center items-center mb-12 my-4">
                                    <img src="/images/star3.svg" style={{height: 110}} alt=""/>
                                    <h2 className="font-bold px-2 text-primary" style={{fontSize: 80}}>{summery?.total || 0}</h2>
                                </div>
                                <h3 className="text-2xl tracking-widest">TOTAL</h3>
                            </div>
                            <div>
                                <img src="/images/yay.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="h-full pb-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 h-full">
                            <p className="text-2xl font-medium text-center">Awarded Points</p>
                            <ul className="px-4">
                                {awards?.docs?.map((award, index) => (
                                    <li className="flex justify-between mb-4" key={index}>
                                        <span className="text-primary oswald text-6xl">+{award?.points}</span>
                                        <div>
                                            <p className="text-end text-lg font-bold mb-2">{award?.class?.name}&nbsp; {moment(award?.createdAt).format('MM/DD/YYYY')}</p>
                                            <p className="text-end text-base font-medium mb-2">{award?.award_by?.first_name} {award?.award_by?.last_name}</p>
                                            <p className="text-end text-sm font-medium">{award?.trait?.name}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center">
                                <Pagination page={awards?.page || 1} pageCount={awards?.totalPages || 1} onPageChange={page => getAwards({page})}/>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}
Points.layout = StudentLayout
export default Points