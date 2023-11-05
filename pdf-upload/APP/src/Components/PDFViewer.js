import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from './Pagination'
import Viewer from './Viewer'
import Checkbox from './Checkbox';
import ButtonList from './ButtonList';


function PDFViewer(props) {
    const { pdfFile, handleCancel, fileName } = props

    const [selectedPages, setSelectedPages] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [extreactedPdfPath, setExtreactedPdfPath] = useState('');

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handleCreatePDF = async () => {
        try {
            if (selectedPages.length === 0) {
                toast.error('Please choose required pages');
                return;
            }
            const selectedPagesString = selectedPages.join(',');
            const queryParams = `?originalFilename=${fileName}&selectedPages=${selectedPagesString}`;
            const response = await fetch(`http://localhost:8000/extract${queryParams}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                const { filename } = data;
                setExtreactedPdfPath(filename)
            } else {
                toast.error('Error extracting PDF:');

            }
        } catch (error) {
            toast.error('Error extracting PDF:', error);
        }
    };



    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handlePageSelection = (page) => {
        if (selectedPages.includes(page)) {
            setSelectedPages(selectedPages.filter((selectedPage) => selectedPage !== page));
        } else {
            setSelectedPages([...selectedPages, page]);
        }
    };


    const downloadPDF = async () => {
        try {
            const response = await fetch(`http://localhost:8000/retrieve?filename=${extreactedPdfPath}`, {
                method: 'GET',
            });

            if (response.ok) {
                const pdfContent = await response.blob();
                const blob = new Blob([pdfContent], { type: 'application/pdf' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.target = '_blank'
                link.click()
            } else {
                toast.error('Error retrieving PDF file:');

            }
        } catch (error) {
            toast.error('Error retrieving PDF file:', error);
        }
    };

    return (
        <>
            <Viewer
                pdfFile={pdfFile}
                handleLoadSuccess={handleLoadSuccess}
                pageNumber={pageNumber}
            />
            <Pagination
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                numPages={numPages}
                pageNumber={pageNumber}
            />
            <Checkbox
                numPages={numPages}
                selectedPages={selectedPages}
                handlePageSelection={handlePageSelection}
            />
            <ButtonList
                downloadPDF={downloadPDF}
                extreactedPdfPath={extreactedPdfPath}
                handleCancel={handleCancel}
                handleCreatePDF={handleCreatePDF}
            />
        </>
    );
}

export default PDFViewer;
