import React, {useState} from "react"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"
import PropTypes from "prop-types"

const TableInput = ({value, onChange, columns}) => {
    const [row, setRow] = useState()

    const handleAdd = () => {
        let data = {}
        columns.map(column => {
            data[column.dataField] = null
        })
        onChange(Array.isArray(value) ? [...value, data] : [data])
    }

    const onStartEdit = (row, col, rowIndex, colIndex) => {
        setRow(rowIndex)
    }

    const onTableChange = (_, newValue, __, column) => {
        value[row][column.dataField] = newValue
        onChange(value)
    }

    return (
        <div className="table-responsive">
            <BootstrapTable
                keyField="key"
                data={(value ?? []).map((value, index) => ({key: index + 1, ...value}))}
                onTableChange={onTableChange}
                columns={columns}
                cellEdit={cellEditFactory({mode: "click",  blurToSave: true, beforeSaveCell:  onTableChange, onStartEdit})}
            />
            <div>
                <button type="button" onClick={handleAdd}>Add Item</button>
            </div>
        </div>
    )
}
TableInput.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.any,
    columns: PropTypes.any,
}
export default TableInput