import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import PDFViewer from './Components/PDFViewer';
import PdfDragger from './Components/PdfDragger'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [files, setFiles] = useState('');
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [pdfPath, setPdfPath] = useState('');

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    try {
      if (acceptedFiles.length === 0) {
        return;
      }
      if (rejectedFiles.length > 0 || acceptedFiles[0].type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }

      const file = acceptedFiles[0];
      setUploadedPdf(acceptedFiles[0]);

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json();
        setPdfPath(data.filename.path)
      } else {
        toast.error('File upload failed');
      }
    } catch (error) {
      toast.error('Error uploading file:', error);
    }
  };

  const getPdf = async (filename) => {
    try {
      const response = await fetch(`http://localhost:8000/retrieve?filename=${filename}`, {
        method: 'GET',
      });

      if (response.ok) {
        const pdfContent = await response.blob();
        setFiles(pdfContent);
      } else {
      toast.error('Error retrieving PDF file:');
      }
    } catch (error) {
      toast.error('Error retrieving PDF file:', error);
    }

  };

  const handleCancel = () => {
    setUploadedPdf(null)
    setFiles('')
  }

 

  return (
    <div>
      <h1 className='title'>PDF Extractor</h1>
      <PdfDragger
        uploadedPdf={uploadedPdf}
        getPdf={() =>getPdf(pdfPath)}
        onDrop={onDrop}
        files={files}
      />
      {files && (
        <PDFViewer
          pdfFile={files}
          handleCancel={handleCancel}
          fileName={uploadedPdf.name}

        />
      )}
    </div>
  );
}

export default App;
