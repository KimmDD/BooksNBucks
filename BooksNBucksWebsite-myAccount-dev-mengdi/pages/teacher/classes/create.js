import {Form} from "antd";
import Link from 'next/link'
import TeacherLayout from "../../../layouts/teacher";
import FormInput from "../../../components/form/FormInput";
import DaysInput from "../../../components/form/DaysInput";
import FormSelect from "../../../components/form/FormSelect";
import TimeRange from "../../../components/form/TimeRange";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchStudents, fetchTeachers, postClass} from "../../../helpers/backend_helper";
import {useRouter} from "next/router";

const CreateClass = () => {
    const router = useRouter()
    const [students] = useFetch(fetchStudents)
    const [teachers] = useFetch(fetchTeachers)

    const handleAdd = async values => {
        await useAction(postClass, values, () => {
            router.push('/teacher/classes')
        })
    }

    return (
        <>
            <div>
                <h4 className="font-22 font-semibold">Create Class</h4>
                <hr className="bg-C4"/>
                <Form layout="vertical" onFinish={handleAdd}>
                    <FormInput name="name" label="Class Name"
                               placeholder="Enter class name (i.e. ITP 348 Intro to Web Development)" required/>
                    <FormInput name="section" label="Section" placeholder="Enter section"/>
                    <DaysInput name="days" label="Day(s)" required/>
                    <TimeRange name="time" label="Time" required/>
                    <FormSelect
                        name="instructors"
                        label="Instructors"
                        initialValue={[]}
                        options={teachers?.map(teacher => ({label: `${teacher?.first_name} ${teacher?.last_name}`, value: teacher?._id}))}
                        isMulti search/>
                    <div className="area-select">
                        <FormSelect
                            name="students"
                            label="Students"
                            placeholder="Enter students"
                            initialValue={[]}
                            options={students?.map(student => ({label: `${student?.first_name} ${student?.last_name}`, value: student?._id}))}
                            isMulti search/>
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-primary mr-4">Save</button>
                        <Link href="/teacher/classes">
                            <a className="btn btn-secondary">Cancel</a>
                        </Link>
                    </div>
                </Form>
            </div>

        </>
    )
}

CreateClass.layout = TeacherLayout
export default CreateClass