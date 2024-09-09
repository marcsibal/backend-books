import BooksModel from '../models/books.js';

const Books = {};

// Search
Books.get = async (req, res, next) => {
    const { from, to } = req.query;
    try {
        const result = await BooksModel.search({ from, to });
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Books retrieved successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No books found matching the search criteria.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving books.'
        });
    }
};

// Update
Books.update = async (req, res, next) => {
    const data = req.body;

    try {
        const result = await BooksModel.update(data);
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Book updated successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Book not found or update failed.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the book.'
        });
    }
};


// Add
Books.add = async (req, res, next) => {
    const data = req.body;
    try {
        await BooksModel.initialize(); // Initialize 
        const result = await BooksModel.insert(data);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Book added successfully.'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to add book.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while adding the book.'
        });
    }
};

// Delete
Books.delete = async (req, res, next) => {
    const { id } = req.query;
    try {
        const result = await BooksModel.delete({ id });
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Book deleted successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Book not found or deletion failed.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the book.'
        });
    }
};

export default Books;
