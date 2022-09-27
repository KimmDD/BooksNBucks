import TeacherLayout from "../../layouts/teacher";
import {fetchPurchases, postPurchaseStatus} from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import {useActionConfirm, useFetch} from "../../helpers/hooks";
import {BsCheck2Square, BsXSquare} from "react-icons/bs";
import {Select} from "antd";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const Purchases = () => {
    const [purchases, getPurchases] = useFetch(fetchPurchases, {size: 8}, false)
    const statusClass = {
        'Pending Approval': 'bg-amber-400',
        'Fulfilled': 'bg-success',
        'Unfulfilled': 'bg-primary'
    }

    const handleUpdateStatus = async (_id, status) => {
        await useActionConfirm(postPurchaseStatus, {
            _id,
            status
        }, getPurchases, `Are you sure want to ${status} the purchase?`, `Yes ,${status}`)
    }

    const columns = [
        {
            label: 'Item Name',
            dataIndex: 'product',
            formatter: product => <strong>{product.name}</strong>
        },
        {
            label: 'Student',
            dataIndex: 'purchased_by',
            formatter: student => <>{student.first_name} {student.last_name}</>
        },
        {
            label: 'Status',
            dataIndex: 'status',
            formatter: status => <div
                className={`text-white inline-block py-1 px-3 ${statusClass[status]}`}>{status}</div>
        },
        {
            label: '',
            dataIndex: 'action',
            className: 'w-48',
            formatter: (_, data) => (
                <div className="flex justify-center">
                    {data?.status === 'Pending Approval' && (
                        <>
                            <button onClick={() => handleUpdateStatus(data._id, 'Fulfilled')}
                                    className="btn-success px-3 p-1.5 rounded ml-2 mr-2">
                                <BsCheck2Square size={20}/>
                            </button>
                            <button onClick={() => handleUpdateStatus(data._id, 'Unfulfilled')}
                                    className="btn-primary p-1.5 rounded ml-2 mr-2">
                                <BsXSquare size={20}/>
                            </button>
                        </>
                    )}
                </div>
            )
        }

    ]
    const [status, setStatus] = useState()

    const handleStatusChange = status => {
        setStatus(status)
        getPurchases({status, page: 1})
    }
    const router = useRouter()
    useEffect(() => {
        if(router?.query?.status) {
            handleStatusChange(router?.query?.status)
            window.history.pushState(null, null, '/teacher/purchases')
        } else {
            getPurchases()
        }
    }, [router?.query])

    return (
        <>
            <div className="flex justify-between">
                <div/>
                <div>
                    <Select
                        allowClear
                        onClear={() => setStatus(undefined)}
                        value={status} onSelect={setStatus}
                        placeholder="Status" className="w-44" options={[
                        {label: 'Pending Approval', value: 'Pending Approval'},
                        {label: 'Fulfilled', value: 'Fulfilled'},
                        {label: 'Unfulfilled', value: 'Unfulfilled'},
                    ]}/>
                </div>
            </div>
            <Table
                data={purchases}
                getData={getPurchases}
                columns={columns}
                noAction
                pagination
            />
        </>
    )
}
Purchases.layout = TeacherLayout
export default Purchases