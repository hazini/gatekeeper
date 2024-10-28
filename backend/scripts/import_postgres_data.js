const { Client } = require('pg');
const fs = require('fs');

async function importData() {
  const client = new Client({
    connectionString: 'postgresql://root:toor@localhost:5432/bookmarks'
  });

  try {
    await client.connect();

    // Import categories
    const categories = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
    for (const category of categories) {
      await client.query(
        'INSERT INTO category (id, name, "parentCategoryId") VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, "parentCategoryId" = $3',
        [category.id, category.name, category.parentCategoryId]
      );
    }

    // Import bookmarks
    const bookmarks = JSON.parse(fs.readFileSync('bookmarks.json', 'utf8'));
    for (const bookmark of bookmarks) {
      await client.query(
        'INSERT INTO bookmark (id, title, content, "categoryId") VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET title = $2, content = $3, "categoryId" = $4',
        [bookmark.id, bookmark.title, bookmark.content, bookmark.categoryId]
      );
    }

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await client.end();
  }
}

importData();