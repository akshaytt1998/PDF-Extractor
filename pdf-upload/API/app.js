const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    res.status(201).json({ message: 'PDF file uploaded successfully', filename: req.file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload PDF file' });
  }
});

app.get('/retrieve', async (req, res) => {
  try {
    const filename = req.query.filename;
    const filePath = path.join(__dirname, filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

      res.send(fileContent);

    } else {
      res.status(404).json({ error: 'PDF file not found' });
    }
  } catch (error) {
    res.status(404).json({ error: 'PDF file not found' });
  }
});

app.get('/extract', async (req, res) => {
  const { originalFilename, selectedPages } = req.query;

  try {
    const originalFilePath = `uploads/${originalFilename}`;
    const data = fs.readFileSync(originalFilePath)
    const pdfDoc = await PDFDocument.load(data);
    const extractedDoc = await PDFDocument.create();


    const selectedPagesString = selectedPages.split(',');
    for (const pageNum of selectedPagesString) {
      if(pageNum > 0) {
        const [copiedPage] = await extractedDoc.copyPages(pdfDoc, [pageNum - 1]);
        extractedDoc.addPage(copiedPage);
      }
    }
    const extractedPdfBytes = await extractedDoc.save();
    const extractedPdfFileName = `extracted_${originalFilename}`;
    const extractedPdfFilePath = `extracts/${extractedPdfFileName}`;

    fs.writeFileSync(extractedPdfFilePath, extractedPdfBytes);

    res.status(200).json({ message: 'PDF pages extracted', filename: extractedPdfFilePath });
  } catch (error) {
    res.status(500).send('Error extracting pages from PDF.');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
