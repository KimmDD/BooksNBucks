import {Form, notification} from "antd";
import FormInput from "../components/form/FormInput";
import PasswordInput from "../components/form/PasswordInput";
import {postLogin} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import {useRouter} from "next/router";
import AuthLayout from "../layouts/auth";

const Login = () => {
    const router = useRouter()
    const handleLogin = async values => {
        swalLoading()
        const {error, msg, token} = await postLogin(values)
        swal.close()
        if(error === false) {
            localStorage.setItem("token", token)
            await notification.success({message: "Success", description: msg})
            await router.push('/')
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    return (
        <AuthLayout>
            <div className="flex items-center pt-12" style={{minHeight: '50vh'}}>
                <div className="bg-white p-8 rounded shadow-sm w-screen md:w-96">
                    <h2 className="text-primary font-medium mb-3">Sign In</h2>
                    <Form layout="vertical" onFinish={handleLogin}>
                        <FormInput name="email" placeholder="Email" isEmail required/>
                        <PasswordInput name="password" placeholder="Password"/>
                        <button className="btn btn-primary btn-full mt-1">Sign In</button>
                    </Form>
                </div>
            </div>
        </AuthLayout>
    )
}
export default Login