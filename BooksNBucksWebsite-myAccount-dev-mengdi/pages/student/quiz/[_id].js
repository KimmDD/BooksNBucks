import StudentLayout from "../../../layouts/student";
import {useAction, useFetch} from "../../../helpers/hooks";
import {Checkbox, Form, Radio} from "antd";
import {fetchQuiz, submitQuiz} from "../../../helpers/backend_helper";
import Link from 'next/link'
import swal from "sweetalert2";
import {FiCheck, FiX} from "react-icons/fi";
import {useState} from "react";
import {useRouter} from "next/router";
import swalAlert from "../../../components/common/alert";
import moment from "moment";

const Quiz = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [current, setCurrent] = useState(0)
    const [quiz, _, {error}] = useFetch(fetchQuiz, {_id: router.query?._id})
    const handleQuizSubmit = async values => {
        let {isConfirmed} = await swalAlert.confirm('Are you sure you want to submit this quiz?', 'Yes, Submit')
        if (isConfirmed) {
            await useAction(submitQuiz, {...values, quiz: quiz._id, date: moment().toISOString()}, () => router.push('/student/quiz'))
        }
    }

    return (
        <div>
            <div className="mt-2">
                <div className="bg-white rounded-lg px-4 py-3 mb-4 d-flex justify-content-between">
                    <p className="mb-0 text-2xl font-semibold text-5A">{quiz?.title} {error && 'Quiz did\'t start or ends'}</p>
                    <Link href="/student/quiz">
                        <a className="btn-primary rounded-lg text-2xl">Quit</a>
                    </Link>
                </div>
                <Form form={form} onFinish={handleQuizSubmit}>
                    {quiz?.questions?.map((question, index) => {
                        let input = <textarea className="form-control mt-3"/>
                        if (question.type === 'single') {
                            input = (
                                <Radio.Group>
                                    {question?.options?.map((option, index) => (
                                        <Radio className="d-block mt-3" key={index}
                                               value={index}> &nbsp;<span className="text-2xl font-semibold">{option}</span></Radio>
                                    ))}
                                </Radio.Group>
                            )
                        }
                        if (question.type === 'multiple') {
                            input = (
                                <Checkbox.Group className="w-full">
                                    {question?.options?.map((option, index) => (
                                        <Checkbox className="flex w-full m-0 mt-3 checkbox-sm" key={index}
                                                  value={index}> &nbsp;<span className="text-2xl font-semibold">{option}</span></Checkbox>
                                    ))}
                                </Checkbox.Group>
                            )
                        }
                        return (
                            <div className="p-4 bg-white mb-4 rounded-lg"
                                 style={{display: current === index ? 'block' : 'none'}} key={index}>
                                <p className="font-semibold text-base mb-5">QUESTION {index + 1}/{quiz?.questions?.length || 0}</p>
                                <p className="text-2xl font-semibold">
                                    {question.title} &nbsp;
                                    {question.type === 'short_answer' &&
                                        <span className="text-muted">(Short Answer)</span>}
                                    {question.type === 'paragraph' &&
                                        <span className="text-muted">(Paragraph. Min Words: {question?.min}, Max Words: {question?.max})</span>}
                                </p>
                                <Form.Item name={['answers', index]} initialValue="">
                                    {input}
                                </Form.Item>
                                <div className="d-flex justify-content-end mt-4">
                                    {index > 0 && <a className="btn-primary rounded-lg text-2xl mr-3"
                                                     onClick={() => setCurrent(current - 1)}>Previous
                                        Question</a>}
                                    <a className="btn-primary rounded-lg text-2xl"
                                       onClick={() => setCurrent(current + 1)}> {index + 1 === quiz?.questions?.length ? 'Preview' : 'Next Question'} </a>
                                </div>
                            </div>
                        )
                    })}
                    <div className="bg-white p-4 rounded-lg"
                         style={{display: current === quiz?.questions?.length ? 'block' : 'none'}}>
                        <Form.Item shouldUpdate>
                            {() => {
                                let answers = form.getFieldValue('answers')
                                return (
                                    <>
                                        {answers?.map((answer, index) => (
                                            <div role="button" onClick={() => setCurrent(index)}
                                                 className="bg-gray-200 p-4 rounded-lg mb-4 d-flex justify-content-between" key={index}>
                                                <p className="mb-0 text-2xl font-semibold">QUESTION {index + 1}</p>
                                                <p className="mb-0 text-2xl font-semibold">{answer ?
                                                    <span>ANSWERED <FiCheck className="text-success inline-block"
                                                                            size={28}/></span> :
                                                    <span>UNANSWERED <FiX className="text-danger inline-block"
                                                                          size={28}/></span>}</p>
                                            </div>
                                        ))}
                                    </>
                                )
                            }}
                        </Form.Item>
                        <div className="text-right">
                            <a className="btn-primary rounded-lg text-2xl mr-3"
                               onClick={() => setCurrent(current - 1)}>Back</a>
                            <button className="btn-primary rounded-lg text-2xl">Submit Quiz</button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}
Quiz.layout = StudentLayout
export default Quiz