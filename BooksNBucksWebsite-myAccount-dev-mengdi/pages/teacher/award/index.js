import TeacherLayout from "../../../layouts/teacher";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchClasses, fetchTraits, postAwards} from "../../../helpers/backend_helper";
import {useEffect, useRef, useState} from "react";
import {FiChevronDown, FiChevronRight} from "react-icons/fi";
import {Form} from "antd";
import FormSelect from "../../../components/form/FormSelect";
import FormInput from "../../../components/form/FormInput";
import moment from "moment";

const Award = () => {
    const [form] = Form.useForm()
    const [classes, getClasses] = useFetch(fetchClasses, {students: true})
    const [selected, setSelected] = useState({})
    const [award, setAward] = useState(false)
    const [update, setUpdate] = useState(false)

    const [traits] = useFetch(fetchTraits)

    const students = {}
    const classNames = {}
    classes?.forEach(data => {
        classNames[data._id] = data.name
        data?.students?.forEach(student => {
            students[student._id] = student
        })
    })

    const handleStudentSelect = (e, student, school) => {
        if (e.target.checked === true) {

        } else {
            selected[school] = selected[school]?.filter(data => data !== student)
        }
        setUpdate(!update)
    }

    const isSelected = Object.values(selected).find(data => data?.length > 0)
    const handleAward = async values => {
        if (isSelected) {
            await useAction(postAwards, {...values, classes: selected, date: moment().toISOString(true)}, () => {
                getClasses()
                setAward(false)
            })
        }
    }

    if (award) {
        return (
            <>
                {Object.keys(selected)?.filter(key => selected[key]?.length > 0).map((key, index) => (
                    <div key={index}>
                        <h4 className="page-title">Students - {classNames[key]}</h4>
                        <ul className="p-0">
                            {selected[key]?.map((select, index) => (
                                <li key={index} className="p-3 border-b flex justify-between">
                                    <span
                                        className="text-lg">{students[select]?.first_name} {students[select]?.last_name}</span>
                                    <input type="checkbox" onChange={e => handleStudentSelect(e, select, key)}
                                           checked={selected[key]?.includes(students[select]?._id)}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {!!isSelected ||  <p className="text-danger text-lg font-semibold">No Student selected</p>}
                <Form layout="vertical" form={form} className="mt-4" onFinish={handleAward}>
                    <FormSelect
                        name="trait"
                        label="Trait"
                        onSelect={value => form.setFieldsValue({amount: traits?.find(trait => trait._id === value)?.points || 0})}
                        options={traits?.map(trait => ({label: trait.name, value: trait._id}))} required/>
                    <FormInput name="amount" label="Amount" required/>
                    <div className="mt-4">
                        <button className="btn btn-primary mr-4">Save</button>
                        <a className="btn btn-secondary" onClick={() => setAward(false)}>Cancel</a>
                    </div>
                </Form>
            </>
        )
    }


    return (
        <>
            <div className="flex justify-between">
                <div>

                </div>
                <div>
                    <a className="btn btn-primary" onClick={() => setAward(true)}>Reward</a>
                </div>
            </div>
            <table className="table mt-4">
                <thead>
                <tr>
                    <th>Classes</th>
                    <th style={{width: 300}} className="text-center bg-F8">Select</th>
                    <th style={{width: 300}} className="text-center">Last Awarded</th>
                </tr>
                </thead>
                <tbody>
                {classes?.map((data, index) => (
                    <ClassRow data={data} selected={selected} setSelected={setSelected}
                              reload={() => setUpdate(!update)} key={index}/>
                ))}
                </tbody>
            </table>
        </>
    )
}
Award.layout = TeacherLayout
export default Award

const ClassRow = ({data, selected, setSelected, reload}) => {
    const ref = useRef()
    const [show, setShow] = useState(false)

    const handleClassSelect = e => {
        if (e.target.checked === true) {
            selected[data._id] = data.students?.map(student => student._id)
        } else {
            selected[data._id] = []
        }
        reload()
    }
    const handleStudentSelect = (e, student) => {
        if (e.target.checked === true) {
            let checked = selected[data._id] || []
            checked.push(student._id)
            selected[data._id] = checked
        } else {
            selected[data._id] = selected[data._id]?.filter(data => data !== student._id)
        }
        reload()
    }

    let isClassChecked = selected[data._id]?.length === data?.students?.length
    let isAnyStudentChecked = selected[data._id]?.length > 0

    useEffect(() => {
        if (ref?.current) {
            ref.current.indeterminate = isAnyStudentChecked && !isClassChecked
        }
    }, [isAnyStudentChecked, isClassChecked])


    return (
        <>
            <tr>
                <td className="font-semibold" role="button" onClick={() => setShow(!show)}>
                    {show ? <FiChevronDown className="inline-block mr-4" size={20}/> :
                        <FiChevronRight className="inline-block mr-4" size={20}/>}
                    {data?.name}
                </td>
                <td style={{width: 300}} className="text-center">
                    <input type="checkbox" ref={ref} onChange={handleClassSelect} checked={isClassChecked}/>
                </td>
                <td style={{width: 300}}>

                </td>
            </tr>
            {show && data?.students?.map((student, index) => (
                <tr key={index}>
                    <td style={{paddingLeft: 40}}> {student?.first_name} {student?.last_name}</td>
                    <td style={{width: 300}} className="text-center">
                        <input type="checkbox" onChange={e => handleStudentSelect(e, student)}
                               checked={selected[data._id]?.includes(student._id) || false}/>
                    </td>
                    <td style={{width: 300}}>
                        {student?.last_rewarded && moment(student?.last_rewarded).fromNow()}
                    </td>
                </tr>
            ))}
        </>
    )
}