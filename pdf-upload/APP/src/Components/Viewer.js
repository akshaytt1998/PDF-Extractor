import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Viewer(props) {
  const { pdfFile, handleLoadSuccess, pageNumber } = props
  return (
    <div className='viewer'>
      <Document file={pdfFile} onLoadSuccess={handleLoadSuccess}>
        <Page pageNumber={pageNumber} width={400} renderTextLayer={false} />
      </Document>

    </div>
  )
}

export default Viewer