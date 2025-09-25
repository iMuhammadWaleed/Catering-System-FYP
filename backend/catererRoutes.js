const express = require('express');
const router = express.Router();
const {
    getAvailableCaterers,
    getCatererById,
    getAllCaterers,
    searchCaterers
} = require('../controllers/catererController');

// @route   POST /api/caterers/available
// @desc    Get available caterers based on occasion and menu type
// @access  Public
router.post('/available', getAvailableCaterers);

// @route   GET /api/caterers/search
// @desc    Search caterers by name or location
// @access  Public
router.get('/search', searchCaterers);

// @route   GET /api/caterers
// @desc    Get all caterers with pagination and filtering
// @access  Public
router.get('/', getAllCaterers);

// @route   GET /api/caterers/:id
// @desc    Get caterer by ID
// @access  Public
router.get('/:id', getCatererById);

module.exports = router;

