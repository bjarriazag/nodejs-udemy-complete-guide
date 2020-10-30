const { getDB } = require('../util/database');

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDB();
    return db.collection('products').insertOne(this).then(console.log).catch(console.error);
  }
}

module.exports = Product;
