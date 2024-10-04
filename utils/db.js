#!/usr/bin/env node

import { MongoClient } from 'mongodb';

class DBClient {
  /**
     * Creates an instance of DBClient and connects to the MongoDB database.
     */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.database = database;
    this.isConnected = false;

    this.connect();
  }

  /**
     * Connects to the MongoDB database.
     */
  async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.error('Connection to MongoDB failed:', error);
    }
  }

  /**
     * Returns whether the connection to MongoDB is alive.
     * @returns {boolean} True if connected, otherwise false.
     */
  isAlive() {
    return this.isConnected;
  }

  /**
     * Returns the number of documents in the users collection.
     * @returns {Promise<number>} The number of users.
     */
  async nbUsers() {
    if (!this.isConnected) {
      throw new Error('Not connected to MongoDB');
    }
    const db = this.client.db(this.database);
    const count = await db.collection('users').countDocuments();
    return count;
  }

  /**
     * Returns the number of documents in the files collection.
     * @returns {Promise<number>} The number of files.
     */
  async nbFiles() {
    if (!this.isConnected) {
      throw new Error('Not connected to MongoDB');
    }
    const db = this.client.db(this.database);
    const count = await db.collection('files').countDocuments();
    return count;
  }
}

// Create and export an instance of DBClient.
const dbClient = new DBClient();
export default dbClient;
