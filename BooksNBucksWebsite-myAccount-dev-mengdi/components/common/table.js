import {FiEdit, FiEdit3, FiTrash, FiX} from "react-icons/fi";
import {useActionConfirm} from "../../helpers/hooks";
import Pagination from "./pagination";

const Table = ({columns, data, onEdit, onDelete, action, getData, pagination = false, noAction = false}) => {
    return (
        <>
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                    <tr>
                        {columns?.map((column, index) => (
                            <th key={index} className={column.className}
                                style={{background: column?.shadow ? '#F8F8F8' : '#FFF'}}>{column.label}</th>
                        ))}
                        {noAction || <th className="text-center"/>}
                    </tr>
                    </thead>
                    <tbody>
                    {(pagination ? data?.docs : data)?.map((data, index) => (
                        <tr key={index}>
                            {columns?.map((column, index) => {
                                if (column.formatter) {
                                    return <td key={index} className={column.className}
                                               onClick={() => {
                                                   if(column.onClick) {
                                                       column.onClick(data)
                                                   }
                                               }}
                                               style={{
                                                   background: column?.shadow ? '#F8F8F8' : undefined,
                                                   maxWidth: column?.maxWidth,
                                                   minWidth: column?.minWidth
                                               }}>{column.formatter(data[column.dataIndex], data)}</td>
                                }
                                if (column.type === 'image') {
                                    return <td key={index} className={column.className}
                                               onClick={() => {
                                                   if(column.onClick) {
                                                       column.onClick(data)
                                                   }
                                               }}
                                               style={{
                                                   background: column?.shadow ? '#F8F8F8' : undefined,
                                                   maxWidth: column?.maxWidth
                                               }}><img
                                        style={{height: 36}} src={data[column.dataIndex]} alt=""/></td>
                                }
                                return <td className={column.className}
                                           onClick={() => {
                                               if(column.onClick) {
                                                   column.onClick(data)
                                               }
                                           }}
                                           style={{
                                               background: column?.shadow ? '#F8F8F8' : undefined,
                                               maxWidth: column?.maxWidth
                                           }}
                                           key={index}>{data[column.dataIndex]}</td>
                            })}
                            {noAction || (
                                <td style={{minWidth: 150}}>
                                    <div className="flex justify-end pr-2">
                                        {onEdit && (
                                            <a className="btn-primary p-1.5 rounded ml-2">
                                                <FiEdit size={18} role="button" onClick={() => onEdit(data)}/>
                                            </a>
                                        )}
                                        {onDelete && (
                                            <a className="btn-primary p-1.5 rounded ml-2 mr-2">
                                                <FiTrash size={20} role="button" onClick={() => {
                                                    useActionConfirm(onDelete, {_id: data._id}, getData, 'Are you sure want to delete this?', 'Yes, delete')
                                                }}/>
                                            </a>
                                        )}
                                    </div>
                                </td>

                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {pagination && (
                    <div className="text-right pt-3">
                        <Pagination pageCount={data?.totalPages || 1} page={data?.page || 1}
                                    onPageChange={page => getData({page})}/>
                    </div>
                )}
            </div>
        </>
    )
}
export default Table