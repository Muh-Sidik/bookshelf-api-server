const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();

  const newBooks = {
    id: id,
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: pageCount === readPage ? true : false,
    reading: reading,
    insertedAt: insertedAt,
    updatedAt: insertedAt
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  } else {
    return h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }
};

const getAllBooksHandler = async (request, h) => {

  const {name,reading,finished} = request.query;

  const finalBooks = books.filter((book) => {
    if (name !== undefined) {
      return book.name === name;
    }

    if (reading !== undefined) {
      switch (reading) {
        case 1:
          return book.reading === true;
        case 0:
          return book.reading === false;
      }
    }

    if (finished !== undefined) {
      switch (finished) {
        case 1:
          return book.finished === true;
        case 0:
          return book.finished === false;
      }
    }

    return true;
  });

  return h.response({
    status: 'success',
    data: {
      books: finalBooks.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }
      })
    },
  }).code(200)
};

const getBookByIdHandler = async (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: books[index],
    }
  }).code(200);
};

const editBookByIdHandler = async (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: pageCount === readPage ? true : false,
    updatedAt: updatedAt,
    reading: reading
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
    data: books[index],
  }).code(200);
};

const deleteBookByIdHandler = async (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }
  
  books.splice(index, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
