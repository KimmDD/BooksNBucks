import {Form, notification} from "antd";
import FormInput from "../components/form/FormInput";
import PasswordInput from "../components/form/PasswordInput";
import {postRegister} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import AuthLayout from "../layouts/auth";
import {useRouter} from "next/router";

const Signup = () => {
    const router = useRouter()
    const handleSignup = async values => {
        swalLoading()
        const {error, msg, token} = await postRegister(values)
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
            <div className="flex items-center pt-12" style={{minHeight: '60vh'}}>
                <div className="bg-white p-8 rounded shadow-sm w-104">
                    <h2 className="text-primary font-medium mb-3">Create an Account</h2>
                    <Form layout="vertical" onFinish={handleSignup}>
                        <FormInput name="first_name" placeholder="First Name" required/>
                        <FormInput name="last_name" placeholder="Last Name" required/>
                        <FormInput name="email" placeholder="Email" isEmail required/>
                        <PasswordInput name="password" placeholder="Password"/>
                        <PasswordInput name="confirm_password" placeholder="Confirm Password" confirm/>
                        <button className="btn btn-primary mt-1">Register</button>
                    </Form>
                </div>
            </div>
        </AuthLayout>

    )
}
export default Signup