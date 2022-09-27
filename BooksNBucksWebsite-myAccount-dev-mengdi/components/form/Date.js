import React from "react"
import "react-datepicker/dist/react-datepicker.css"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import {InputGroup} from "reactstrap"
import PropTypes from "prop-types"
import moment from "moment"

const DateInput = ({value, onChange}) => {
    return (
        <InputGroup>
            <Flatpickr
                className="form-control d-block"
                placeholder="Y-m-d"
                value={value}
                onChange={date => {
                    onChange(moment(date[0]).format('Y-MM-DD'))
                }}
                options={{
                    altInput: true,
                    altFormat: "Y-m-d",
                    dateFormat: "Y-m-d",
                }}
            />
        </InputGroup>
    )
}
DateInput.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.any,
}
export default DateInput