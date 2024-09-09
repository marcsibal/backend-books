const Books = {};

Books.initialize = async () => {
  try {
    const sql = `CREATE TABLE IF NOT EXISTS books (
      id serial PRIMARY KEY,
      title text,
      author text,
      isbn text,
      published_date bigint DEFAULT 0,
      genre text
    )`;
    await db.query(sql);
  } catch (err) {
    throw err;
  }
};

Books.insert = async (data) => {
  try {
    const sql = `INSERT INTO public.books (title, author, isbn, published_date, genre)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [data.title, data.author, data.isbn, data.published_date, data.genre];
    const result = await db.query(sql, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

Books.update = async (data) => {
  try {
    const sql = `UPDATE public.books
                 SET title = $1, author = $2, isbn = $3, published_date = $4, genre = $5
                 WHERE id = $6 RETURNING *`;
    const values = [data.title, data.author, data.isbn, data.published_date, data.genre, data.id];
    const result = await db.query(sql, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

Books.search = async (date) => {
  try {
    const sql = `SELECT * FROM books WHERE published_date >= $1 AND published_date <= $2`;
    const values = [date.from, date.to];
    const result = await db.query(sql, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

Books.delete = async (data) => {
  try {
    const sql = `DELETE FROM public.books WHERE id = $1 RETURNING *`;
    const values = [data.id];
    const result = await db.query(sql, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

export default Books;
