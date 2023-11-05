import React from 'react'

function Checkbox(props) {
    const { numPages, selectedPages, handlePageSelection } = props
    return (
        <div className="page-checkboxes">
            {[...Array(numPages)].map((_, page) => (
                <label key={page}>
                    <input
                        type="checkbox"
                        checked={selectedPages.includes(page + 1)}
                        onChange={() => handlePageSelection(page + 1)}
                    />
                    Page {page + 1}
                </label>
            ))}
        </div>
    )
}

export default Checkbox