import TeacherLayout from "../../../layouts/teacher";
import {useAction, useFetch} from "../../../helpers/hooks";
import {
    fetchAttendance,
    fetchAttendanceStatus,
    fetchClasses,
    fetchStudents,
    postAttendance
} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import {DatePicker, Select} from "antd";
import {useEffect, useState} from "react";

const Attendance = () => {
    const [students] = useFetch(fetchStudents)
    const [attendanceStatus, getAttendanceStatus] = useFetch(fetchAttendanceStatus)
    let attendanceMap = {}
    attendanceStatus?.forEach(student => {
        attendanceMap[student._id] = student
    })

    const [classes] = useFetch(fetchClasses)
    let columns = [
        {
            label: 'Student',
            dataIndex: 'name',
            formatter: (_, student) => <>{student.first_name} {student.last_name}</>
        },
        {label: 'Present', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.present || 0},
        {label: 'Missed Classes', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.missed || 0},
        {label: 'Tardy', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.tardy || 0},
        {label: 'Left Early', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.left || 0},
    ]

    const [current, setCurrent] = useState()
    const [filter, setFilter] = useState()
    const [date, setDate] = useState()

    useEffect(() => {
        let data = classes?.find(d => d._id === current)
        if (data) {
            getAttendanceStatus({class: current})
            setFilter(data.students)
        } else {
            setFilter(undefined)
            getAttendanceStatus({class: undefined})
        }
    }, [current])

    const [status, setStatus] = useState({})
    const [update, setUpdate] = useState(false)
    const reload = () => setUpdate(!update)

    useEffect(() => {
        if (date && current) {
            getClassAttendance()
        }
    }, [date, current])

    const getClassAttendance = () => {
        fetchAttendance({class: current, date: date?.format('YYYY-MM-DD')}).then(({error, data}) => {
            let status = {}
            if (error === false) {
                data?.map(data => {
                    status[data?.student] = data.status
                    getAttendanceStatus({class: current})
                })
            }
            setStatus(status)
        })
    }

    const toggleAttendance = (_id, data) => () => {
        status[_id] = data
        reload()
    }

    const updateStatus = async () => {
        await useAction(postAttendance, {class: current, status, date: date?.format('YYYY-MM-DD')}, () => {
            getClassAttendance()
        })
    }

    if (date) {
        columns = [
            {
                label: 'Student',
                dataIndex: 'name',
                formatter: (_, student) => <>{student.first_name} {student.last_name}</>
            },
            {
                label: "Attendance",
                dataIndex: "_",
                formatter: (_, student) => {
                    return (
                        <div className="d-flex">
                            <div
                                onClick={toggleAttendance(student._id, 1)}
                                className={`btn ${status[student._id] === 1 ? 'btn-success' : 'btn-outline-success'} mx-1`}>
                                Present
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 2)}
                                className={`btn ${status[student._id] === 2 ? 'btn-danger' : 'btn-outline-danger'} mx-1`}>
                                Absent
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 3)}
                                className={`btn ${status[student._id] === 3 ? 'btn-dark' : 'btn-outline-dark'} mx-1`}>
                                Tardy
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 4)}
                                className={`btn ${status[student._id] === 4 ? 'btn-dark' : 'btn-outline-dark'} mx-1`}>
                                Left Early
                            </div>
                        </div>
                    )
                }
            }
        ]
    }

    return (
        <>
            <div className="flex justify-between">
                <h4 className="page-title">Attendance</h4>
                <div className="flex items-center">
                    <Select
                        allowClear
                        className="w-44 mr-4"
                        placeholder="Class"
                        onClear={() => setCurrent(undefined)}
                        onChange={setCurrent}
                        options={classes?.map(d => ({label: d.name, value: d._id}))}/>
                    {current && (
                        <DatePicker onChange={setDate}/>
                    )}
                </div>
            </div>
            <Table
                columns={columns}
                data={students?.filter(data => !filter || filter?.includes(data._id))}
                noAction
            />
            {date && (
                <div className="text-right my-2">
                    <button className="btn-primary rounded ml-auto" onClick={updateStatus}>Save</button>
                </div>
            )}
        </>
    )
}
Attendance.layout = TeacherLayout
export default Attendance