import TeacherLayout from "../../../layouts/teacher";
import {Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/FormInput";
import {Col, Row} from "react-bootstrap";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchClasses, fetchQuiz, postQuizUpdate} from "../../../helpers/backend_helper";
import CardSelector from "../../../components/form/CardSelector";
import DateTime from "../../../components/form/DateTime";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Question} from "./create";
import moment from "moment";

const UpdateQuiz = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [quiz] = useFetch(fetchQuiz, {_id: router.query?._id})
    const [classes] = useFetch(fetchClasses, {nameOnly: true})
    const [changed, setChanged] = useState(false)
    useEffect(() => {
        form.setFieldsValue({
            ...quiz,
            submission_start: moment(quiz?.submission_start),
            submission_end: moment(quiz?.submission_end),
        })
    }, [quiz])

    return (
        <>
            <h4 className="font-22 font-semibold">Quiz Details</h4>
            <hr className="bg-C4"/>
            <Form layout="vertical" form={form} onFinish={(values) => {
                values?.questions?.forEach(question => {
                    question.points = +question.points
                    question.min = +question.min || 0
                    question.max = +question.max || 0
                    question.options = question.type === 'single' || question.type === 'multiple' ? question.options : []
                })
                return useAction(postQuizUpdate, values, () => {
                    router.push('/teacher/quiz')
                })
            }}>
                <Row>
                    <Col md={6}>
                        <HiddenFormItem name="_id"/>
                        <FormInput name="title" label="Quiz Title"
                                   placeholder="Enter quiz name (i.e. ITP 348 Intro to Web Development)" required/>
                        <Form.Item
                            name={'submission_start'}
                            label="Submission Start"
                            initialValue={moment().startOf('day')}
                            rules={[{required: true, message: 'Please provide submission date.'}]}>
                            <DateTime/>
                        </Form.Item>
                        <FormInput name="points" label="Award Points" type="number" placeholder="Enter award points" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="course" label="Course Number" placeholder="Enter section"/>
                        <Form.Item
                            name={'submission_end'}
                            label="Submission End"
                            initialValue={moment().endOf('day')}
                            rules={[{required: true, message: 'Please provide submission date.'}]}>
                            <DateTime/>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <CardSelector name="classes" label="Assign to Class" options={classes} required/>
                        <p className="mt-2 text-base font-semibold">Questions</p>
                        <div className="p-4 bg-F8 rounded">
                            <Form.List name="questions">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(({key, name, fieldKey, ...restField}) => (
                                            <Question key={key} name={name} fieldKey={fieldKey}
                                                      onRemove={() => remove(name)} restField={restField} form={form}
                                                      setChanged={setChanged}/>
                                        ))}
                                        <button type="button" className="rounded btn-primary mx-auto mt-2"
                                                onClick={() => add()}>
                                            Add Question
                                        </button>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </Col>
                </Row>
                <button className="btn-primary mt-4 rounded">Update Quiz</button>
            </Form>
        </>
    )
}
UpdateQuiz.layout = TeacherLayout
export default UpdateQuiz