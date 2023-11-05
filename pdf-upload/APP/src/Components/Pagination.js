import React from 'react'

function Pagination(props) {
    const { handleNextPage, handlePreviousPage, numPages, pageNumber } = props
  return (
    <span className="pagination">
    <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
        Previous Page
    </button>
    <span>Page {pageNumber} of {numPages}</span>
    <button onClick={handleNextPage} disabled={pageNumber === numPages}>
        Next Page
    </button>
</span>

  )
}

export default Pagination