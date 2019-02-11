const Chance = require("chance");
const chance = new Chance();

const productCreateData = {
  product_category_id: 1,
  code: chance.bb_pin(),
  name: chance.name(),
  regular_price: 100000,
  sell_price: 98000,
  discount: 3,
  tax: 10,
  stock: 10,
  stock_status_id: 1,
  ordering: 1,
  material: chance.name(),
  is_featured: 1,
  is_publish: 1
};

module.exports = {
  productCreateData
};
