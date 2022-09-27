import TeacherLayout from "../../../layouts/teacher";
import {useRouter} from "next/router";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchClass, fetchStudents, fetchTeachers, postClass, postClassUpdate} from "../../../helpers/backend_helper";
import moment from "moment";
import {Form} from "antd";
import {useState} from "react";
import FormInput, {HiddenFormItem} from "../../../components/form/FormInput";
import DaysInput from "../../../components/form/DaysInput";
import TimeRange from "../../../components/form/TimeRange";
import FormSelect from "../../../components/form/FormSelect";
import Link from "next/link";

const Class = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [update, setUpdate] = useState(false)
    const [data, getData] = useFetch(fetchClass, {_id: router.query?._id})

    const [students] = useFetch(fetchStudents)
    const [teachers] = useFetch(fetchTeachers)

    const handleEdit = () => {
        form.resetFields()
        form.setFieldsValue({
            ...data,
            students: data?.students?.map(student => student._id),
            instructors: data?.instructors?.map(instructor => instructor._id)
        })
        setUpdate(true)
    }

    const handleUpdate = async values => {
        await useAction(postClassUpdate, values, () => {
            getData()
            setUpdate(false)
        })
    }

    if(update) {
        return (
            <>
                <div>
                    <h4 className="font-22 font-semibold">Create Class</h4>
                    <hr className="bg-C4"/>
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <HiddenFormItem name="_id"/>
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
                            <a className="btn btn-secondary" onClick={() => setUpdate(false)}>Cancel</a>
                        </div>
                    </Form>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h4 className="page-title">{data?.name}</h4>
                    <p className="text-lg">{data?.section}</p>
                </div>
                <div>
                    <button className="btn-primary font-semibold rounded-lg w-36" onClick={handleEdit}>Edit Class</button>
                </div>
            </div>
            <div>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </div>
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Instructor</th>
                        <th className="text-center">Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.instructors?.map(instructor => (
                        <tr>
                            <td>{instructor?.first_name || ''} {instructor?.last_name || ''}</td>
                            <td className="text-center">{instructor?.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Student</th>
                        <th className="text-center bg-F8">Current Balance</th>
                        <th className="text-center">Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.students?.map(student => (
                        <tr>
                            <td>{student?.first_name || ''} {student?.last_name || ''}</td>
                            <td className="text-center bg-F8">{student?.points}</td>
                            <td className="text-center">{student?.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
Class.layout = TeacherLayout
export default Class