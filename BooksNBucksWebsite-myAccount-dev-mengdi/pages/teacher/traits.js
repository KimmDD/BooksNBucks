import TeacherLayout from "../../layouts/teacher";
import ModalForm from "../../components/common/modal_form";
import {Form} from "antd";
import {useState} from "react";
import FormInput from "../../components/form/FormInput";
import {delTrait, fetchTraits, postTraitAdd, postTraitUpdate} from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import {useFetch} from "../../helpers/hooks";

const Traits = () => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [traits, getTraits] = useFetch(fetchTraits, {size: 8})

    const columns = [
        {
            label: 'Name',
            dataIndex: 'name',
        },
        {label: 'Points', dataIndex: 'points', shadow: true, className: "text-center"},
    ]

    return (
        <>
            <ModalForm
                form={form}
                visible={visible}
                setVisible={setVisible}
                addFunc={async values => {
                    return postTraitAdd(values)
                }}
                updateFunc={async values => {
                    return postTraitUpdate(values)
                }}
                onFinish={getTraits}
                title="Trait">
                <FormInput name="name" label="Name" required/>
                <FormInput name="points" label="Points" type="number" required/>
            </ModalForm>
            <div className="flex justify-between">
                <h4 className="page-title">Traits</h4>
                <button className="btn-primary font-semibold rounded-lg w-36" onClick={() => {
                    form.resetFields()
                    setVisible(true)
                }}>Add Item
                </button>
            </div>
            <Table
                data={traits}
                getData={getTraits}
                columns={columns}
                action={(
                    <button className="add-button w-36" onClick={() => {
                        form.resetFields()
                        setVisible(true)
                    }}>Add Item
                    </button>
                )}
                onEdit={(values) => {
                    form.resetFields()
                    form.setFieldsValue({
                        ...values,
                    })
                    setVisible(true)
                }}
                onDelete={delTrait}
            />
        </>
    )
}
Traits.layout = TeacherLayout
export default Traits