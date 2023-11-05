import React from 'react'

function ButtonList(props) {
  const { downloadPDF, extreactedPdfPath, handleCancel, handleCreatePDF} = props
  return (
    <div className="buttons">
    {extreactedPdfPath && <button onClick={downloadPDF}>Download Extracted PDF</button>}
    <button onClick={handleCreatePDF}>Extract PDF</button>
    <button onClick={handleCancel}>Upload New PDF</button>
</div>
  )
}

export default ButtonList