import TeacherLayout from "../../layouts/teacher";
import {useFetch} from "../../helpers/hooks";
import {fetchClasses, fetchTeachers} from "../../helpers/backend_helper";
import {useRouter} from "next/router";
import {Table} from "react-bootstrap";

const Roster = () => {
    const router = useRouter()
    const [teachers] = useFetch(fetchTeachers)
    const [classes] = useFetch(fetchClasses)

    let map = {}
    teachers?.forEach(teacher => {
        map[teacher._id] = teacher
    })
    classes?.map(data => {
        data.instructors?.map(teacher => {
            let list = map[teacher?._id]?.classes || {}
            list[data._id] = data
            map[teacher?._id] = {
                ...map[teacher?._id],
                classes: list
            }
        })
    })
    let list = []
    Object.values(map).forEach(teacher => {
        if (teacher?.classes) {
            Object.values(teacher?.classes).forEach((data, index) => {
                list.push({
                    name: index === 0 ? `${teacher?.first_name} ${teacher?.last_name}` : '',
                    classes: Object.values(teacher?.classes)?.length,
                    class: {
                        _id: data?._id,
                        name: data?.name,
                        students: data?.students?.length
                    }
                })
            })
        } else {
            list.push({
                name: `${teacher?.first_name} ${teacher?.last_name}`,
            })
        }
    })

    console.log(list)

    return (
        <>
            <h4 className="page-title">Facility Roster</h4>
            <Table>
                <thead>
                <tr>
                    <th>Teacher</th>
                    <th className="text-center">Class</th>
                    <th className="text-center">Student Enrolled</th>
                </tr>
                </thead>
                <tbody>
                {list?.map((data, index) => (
                    <tr key={index}>
                        {data?.name &&  <td className="font-semibold border-r border-gray-200" rowSpan={data?.classes}>{data?.name}</td>}
                        <td className="text-center" onClick={() => {
                            if(data.class?._id) {
                                router.push('/teacher/classes/' + data.class?._id)
                            }
                        }}
                            role={data?.class?.name ? "button" : undefined}> {data?.class?.name || 'N/A'}</td>
                        <td className="text-center"> {data?.class?.students || ''}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )
}

Roster.layout = TeacherLayout
export default Roster