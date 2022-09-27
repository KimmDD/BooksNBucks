import ReactPaginate from "react-paginate";
import {AiFillCaretLeft, AiFillCaretRight} from "react-icons/ai";

const Pagination = ({pageCount = 1, page, onPageChange}) => {
    return (
        <ReactPaginate
            forcePage={page - 1}
            onPageChange={({selected}) => onPageChange && onPageChange(selected + 1)}
            pageCount={pageCount}
            previousLabel={<AiFillCaretLeft size={22} className="text-white"/>}
            nextLabel={<AiFillCaretRight size={22} className="text-white"/>}
            previousClassName="bg-primary p-1 mr-2 inline-block rounded"
            nextClassName="bg-primary p-1 ml-2 inline-block rounded"
            disabledClassName="disabled-link"
            pageClassName="inline-block px-3 text-4xl text-disabled oswald"
            activeClassName="text-primary"
            breakClassName="inline-block"
        />
    )
}
export default Pagination