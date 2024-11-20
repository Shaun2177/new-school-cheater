import sqlite3 from 'sqlite3';

// Open the database
const db = new sqlite3.Database('functions/campus/campus.db');

// Initialize the cache table
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cache (url TEXT PRIMARY KEY, json TEXT)');
});

// Function to get data from cache
export function getCache(url, callback) {
    db.get('SELECT json FROM cache WHERE url = ?', [url], (err, row) => {
        if (err) {
            console.error(err);
            callback(null);
        } else {
            callback(row ? JSON.parse(row.json) : null);
        }
    });
}

// Function to set data in cache
export function setCache(url, json) {
    db.run('INSERT OR REPLACE INTO cache (url, json) VALUES (?, ?)', [url, JSON.stringify(json)], (err) => {
        if (err) {
            console.error(err);
        }
    });
}