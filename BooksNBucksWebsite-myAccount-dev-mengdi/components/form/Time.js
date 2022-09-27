import React from "react"
import "react-datepicker/dist/react-datepicker.css"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import {InputGroup} from "reactstrap"
import PropTypes from "prop-types"

const TimeInput = ({value, onChange}) => {
    return (
        <InputGroup>
            <Flatpickr
                className="form-control d-block"
                placeholder="Select time"
                options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i"
                }}
            />
            <div className="input-group-append">
                <span className="input-group-text">
                    <i className="mdi mdi-clock-outline"/>
                </span>
            </div>
        </InputGroup>
    )
}
TimeInput.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.any,
}
export default TimeInput