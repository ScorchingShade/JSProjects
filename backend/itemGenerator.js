// This gets called with npm start so that we have a batch of items always ready for testing

const axios = require('axios');


// "If you are lazy, do things in a smarter way", - Some frontend developer, being made to code backend (...probably)
const items = [
  {
    id: 1,
    name: "Mango Formal Top",
    url: "/images/p2.jpg",
    price: "1200",
    created_at: "2023-03-19T21:20:01.187Z"
  },
  {
    id: 2,
    name: "Arrow Shirt",
    url: "/images/p1.jpg",
    price: "2200",
    created_at: "2023-03-19T21:20:28.924Z"
  },
  {
    id: 3,
    name: "HRX Men's Trousers",
    url: "/images/p3.jpg",
    price: "2900",
    created_at: "2023-03-19T21:20:57.785Z"
  },
  {
    id: 4,
    name: "Women's yoga Pants",
    url: "/images/p4.jpg",
    price: "3600",
    created_at: "2023-03-19T21:21:25.934Z"
  }
];

const PORT = process.env.PORT || 3000;

async function postData() {
  for (let item of items) {
    try {
      const response = await axios.post(`http://localhost:${PORT}/item/create`, item);
      console.log(response)
      console.log(`Item ${item.id} created with response:`, response.data);
    } catch (error) {
      console.error(`Failed to create item ${item.id}`, error.response.data);
    }
  }
}

postData();