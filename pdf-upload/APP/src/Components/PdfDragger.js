import React from 'react'
import { useDropzone } from 'react-dropzone';

function PdfDragger(props) {
    const { files, uploadedPdf, getPdf, onDrop } = props

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf',
        multiple: false,
      });

  return (
    !files && (
        <section>
          <div className="container">
            <div className="center-box">
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag 'n' drop a PDF file here, or click to select a file</p>
              </div>
              {uploadedPdf && (
                <div>
                  <h3>Selected PDF:</h3>
                  <p>{uploadedPdf.name}</p>
                </div>
              )}
              {
                uploadedPdf && <button onClick={getPdf}>Preview Uploaded PDF</button>
              }
            </div>
          </div>
        </section>
      )
  )
}

export default PdfDragger