"use strict";

const Product = use("App/Models/Product");
const Database = use("Database");
const Chance = require("chance");
const chance = new Chance();

const productList = [
  "Bionic Gingham",
  "Ghania Kimono",
  "Naziha",
  "Sabriya ",
  "Shanum",
  "Naura",
  "Ameera",
  "Ayesha",
  "Geulis (batik)",
  "Geulis (batik) Full",
  "Lilis (Batik)",
  "Jasmine",
  "Rania",
  "Shaima Tunic",
  "Dara Tunic",
  "Aliyaa Blazer",
  "Fauziah Stripe",
  "Humaira",
  "Basic Baggy Pants",
  "Hawa",
  "Balqis",
  "Kiara Tunic",
  "Jihan",
  "Khansa",
  "Maya"
];

const colors = ["Red", "Green", "Blue"];
const sizes = ["S", "M", "L"];

class ProductSeeder {
  async run() {
    await Product.truncate();
    await Database.table("product_descriptions").truncate();
    await Database.table("product_attributes").truncate();
    await Database.table("product_medias").truncate();

    for (let i = 0; i < productList.length; i++) {
      let price = chance.integer({ min: 80000, max: 120000 });
      const product = await Product.create({
        product_category_id: chance.integer({ min: 1, max: 3 }),
        code: chance.bb_pin(),
        name: productList[i],
        regular_price: price,
        sell_price: price - 0.1 * price,
        discount: 3,
        tax: 10,
        stock: 100,
        stock_status_id: 1,
        material: chance.word({ syllables: 3 }),
        is_featured: chance.integer({ min: 0, max: 1 }),
        is_publish: chance.integer({ min: 0, max: 1 })
      });

      // Descriptions
      let short_description = chance.paragraph({ sentences: 2 });
      let long_description = chance.paragraph({ sentences: 4 });

      await product
        .description()
        .create({ short_description, long_description });

      // Attributes

      let attributes = [];

      colors.map(c => {
        attributes.push({ name: "color", value: c });
      });

      sizes.map(c => {
        attributes.push({ name: "size", value: c });
      });

      await product.attributes().createMany(attributes);

      // Medias

      let medias = [];

      for (let i = 0; i < 5; i++) {
        medias.push({
          type: "image",
          caption: chance.sentence({ words: 5 }),
          url: `https://picsum.photos/500/300?image=${i * 5 + 10}`,
          is_main: 1,
          is_publish: 1
        });
      }
      await product.medias().createMany(medias);
    }
  }
}

module.exports = ProductSeeder;
