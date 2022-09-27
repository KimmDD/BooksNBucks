import TeacherLayout from "../../../layouts/teacher";
import Link from 'next/link'
import {useFetch} from "../../../helpers/hooks";
import {fetchClasses} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import moment from "moment";
import {useRouter} from "next/router";

const Classes = () => {
    const router = useRouter()
    const [classes, getClasses] = useFetch(fetchClasses)
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.name}</p>
                <p>{data?.section}</p>
            </>
        )
    }

    const timeFormat = (_, data) => {
        return (
            <>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </>
        )
    }

    const columns = [
        {
            label: "All Classes",
            dataIndex: 'name',
            formatter: nameFormat,
            className: "hover:bg-gray-100 cursor-pointer",
            onClick: data => router.push('/teacher/classes/' + data._id)
        },
        {
            label: "Time",
            dataIndex: 'name',
            formatter: timeFormat,
            className: 'text-center',
            shadow: true,
            maxWidth: 200,
        },
        {
            label: "Instructors",
            dataIndex: 'instructors',
            formatter: data => data?.map((instructor, index) => `${index > 0 ? ', ' : ''}${instructor?.first_name} ${instructor?.last_name}`),
            className: 'text-center',
            maxWidth: 200,
        }
    ]

    return (
        <>
            <div className="flex justify-between">
                <div>

                </div>
                <div>
                    <Link href="/teacher/classes/create">
                        <a className="btn btn-primary">Add Class</a>
                    </Link>
                </div>
            </div>
            <Table
                data={classes}
                getData={getClasses}
                columns={columns}
                noAction
            />
        </>
    )
}

Classes.layout = TeacherLayout
export default Classes