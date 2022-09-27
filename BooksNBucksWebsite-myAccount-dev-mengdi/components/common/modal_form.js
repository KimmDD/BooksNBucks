import React from 'react'
import {Form, notification} from "antd"
import {Modal} from "react-bootstrap"
import swalAlert, {swalLoading} from "./alert"
import swal from "sweetalert2";

const ModalForm = ({title, visible, setVisible, size = '' , form, addFunc, updateFunc, onFinish, children}) => {
    const update = form.getFieldValue('_id') !== undefined
    const handleSubmit = async values => {
        swalLoading()
        values.restaurant_id = localStorage.getItem('currentRestaurant')
        swal.close()
        const {error, msg} = update && updateFunc !== undefined ?
            await updateFunc(values) :
            await addFunc(values)
        if (error === false) {
            if(onFinish) {
                onFinish()
            }
            await notification.success({message: "Success", description: msg})
            setVisible(false)
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    return (
        <>
            <Form form={form}/>
            <Modal show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> {update ? 'Update' : 'Add'} {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form layout="vertical" form={form} onFinish={handleSubmit}>
                        {update && <Form.Item name="_id" initialValue="" hidden><input/></Form.Item>}
                        {children}
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                {update ? 'Update' : 'Add'} {title}
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>

    )
}
export default ModalForm