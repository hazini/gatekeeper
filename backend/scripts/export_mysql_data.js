const mysql = require('mysql2/promise');
const fs = require('fs');

async function exportData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'bookmarks'
  });

  try {
    // Export categories
    const [categories] = await connection.execute('SELECT * FROM category');
    fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2));

    // Export bookmarks
    const [bookmarks] = await connection.execute('SELECT * FROM bookmark');
    fs.writeFileSync('bookmarks.json', JSON.stringify(bookmarks, null, 2));

    console.log('Data exported successfully');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await connection.end();
  }
}

exportData();