import TeacherLayout from "../../../layouts/teacher";
import Link from "next/link";
import {useFetch} from "../../../helpers/hooks";
import {fetchQuizzes} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import {useRouter} from "next/router";
import moment from "moment";

const Quiz = () => {
    const router = useRouter()
    const [quizzes, getQuizzes] = useFetch(fetchQuizzes, {size: 6})
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.title}</p>
                <p>{data?.course}</p>
            </>
        )
    }


    let columns = [
        {label: 'Title', dataIndex: 'title', formatter: nameFormat, minWidth: 150, className: "hover:bg-gray-100 cursor-pointer", onClick: data => router.push('/teacher/quiz/' + data._id)},
        {label: 'Questions', dataIndex: 'questions', formatter: data => data.length},
        {label: 'Classes', dataIndex: 'classes', formatter: data => data?.map((data, index) => `${index > 0 ? ', ' : ''}${data?.name}`)},
        {label: 'Submission Date', dataIndex: 'submission_date', formatter: (_, data) => <>{moment(data.submission_start)?.format('MMM, Do YYYY h:mm A')} <br/> to {moment(data.submission_end)?.format('MMM, Do YYYY h:mm A')}</>},
        {label: '', dataIndex: '_id', formatter: data => <Link href={'/teacher/submissions/' + data}><a className="btn-primary rounded-lg">Submissions</a></Link>}
    ]

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h4 className="page-title">Quiz List</h4>
                </div>
                <div>
                    <Link href="/teacher/quiz/create">
                        <a className="btn btn-primary">Create Quiz</a>
                    </Link>
                </div>
            </div>
            <Table
                getData={getQuizzes}
                columns={columns}
                data={quizzes}
                pagination
                noAction
            />
        </>
    )
}
Quiz.layout = TeacherLayout
export default Quiz