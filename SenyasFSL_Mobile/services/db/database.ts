// services/database.ts
import { openDatabaseSync } from 'expo-sqlite';

// Open the database synchronously
// This instance is what we'll import into other files
export const db = openDatabaseSync('dictionary.db');

// A function to set up the tables
export const initDatabase = () => {
  try {
    // We can run multiple statements at once with execSync
    db.execSync(`
      PRAGMA journal_mode = 'wal'; -- Recommended for performance

      CREATE TABLE IF NOT EXISTS Categories (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        fil TEXT NOT NULL,
        icon TEXT
      );
      
      CREATE TABLE IF NOT EXISTS DictionaryEntries (
        id TEXT PRIMARY KEY NOT NULL,
        categoryId TEXT NOT NULL,
        enLabel TEXT NOT NULL,
        filLabel TEXT NOT NULL,
        remoteVideoUrl TEXT,
        localVideoUri TEXT,
        FOREIGN KEY (categoryId) REFERENCES Categories(id)
      );
    `);
    console.log('Database tables created/verified successfully.');
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};