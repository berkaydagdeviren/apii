const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const ProductModel = require('../models/ProductModel'); // Ensure this is correctly pointing to your model
const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Bulk upload route for testing
router.post('/product-test', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const updatePromises = results.map(row => {
          return ProductModel.updateOne(
            { code: row.code }, // Assuming 'code' is unique
            {
              $set: {
                name: row.name,
                OLcu_BR1: row.OLCU_BR1,  // Include other fields
                price: parseFloat(row.price),
                price2: parseFloat(row.price2),
                NAKLIYET_TUT: parseFloat(row.NAKLIYET_TUT),
                KDV_ORANI: parseFloat(row.KDV_ORANI),
                BARKOD1: row.BARKOD1,
                BARKOD2: row.BARKOD2,
                BARKOD3: row.BARKOD3,
                ALIS_KDV_KODU: row.ALIS_KDV_KODU,
                ALIS_FIAT1: parseFloat(row.ALIS_FIAT1),
                ALIS_FIAT2: parseFloat(row.ALIS_FIAT2),
                ALIS_FIAT3: parseFloat(row.ALIS_FIAT3),
                ALIS_FIAT4: parseFloat(row.ALIS_FIAT4),
              },
            },
            { upsert: true } // Create if not found
          );
        });

        await Promise.all(updatePromises);
        res.json({ message: 'Products updated successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating products.', error: error.message });
      } finally {
        // Clean up uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      }
    })
    .on('error', (err) => {
      console.error('Error processing CSV file:', err);
      res.status(500).json({ message: 'Error processing CSV file', error: err.message });
    });
});

module.exports = router;
