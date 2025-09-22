const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Caterer = require("../models/Caterer");

dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/caterpro";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected for Seeding..."))
  .catch((err) => console.error(err));

const caterers = [
  {
    name: "Gourmet Delights",
    description: "Exquisite culinary experiences for any event.",
    contact: "gourmet@example.com",
    phone: "111-222-3333",
    address: "123 Food St, Flavor Town",
    cuisine: ["French", "Italian"],
    minGuests: 20,
    maxGuests: 200,
    pricePerPerson: 50,
    rating: 4.8,
    reviews: 150,
    imageUrl: "https://example.com/gourmet.jpg",
  },
  {
    name: "Spice Route Catering",
    description: "Authentic flavors from around the world.",
    contact: "spice@example.com",
    phone: "444-555-6666",
    address: "456 Spice Ln, Aroma City",
    cuisine: ["Indian", "Thai", "Mexican"],
    minGuests: 30,
    maxGuests: 300,
    pricePerPerson: 45,
    rating: 4.5,
    reviews: 120,
    imageUrl: "https://example.com/spice.jpg",
  },
  {
    name: "Vegan Feast",
    description: "Delicious and healthy plant-based catering.",
    contact: "vegan@example.com",
    phone: "777-888-9999",
    address: "789 Green Rd, Veggieville",
    cuisine: ["Vegan", "Organic"],
    minGuests: 10,
    maxGuests: 100,
    pricePerPerson: 35,
    rating: 4.9,
    reviews: 90,
    imageUrl: "https://example.com/vegan.jpg",
  },
  {
    name: "BBQ Masters",
    description: "Smoked meats and classic BBQ sides.",
    contact: "bbq@example.com",
    phone: "101-202-3030",
    address: "101 Smokehouse Blvd, Grill City",
    cuisine: ["BBQ", "American"],
    minGuests: 50,
    maxGuests: 500,
    pricePerPerson: 60,
    rating: 4.7,
    reviews: 200,
    imageUrl: "https://example.com/bbq.jpg",
  },
  {
    name: "Sweet Treats Catering",
    description: "Desserts and pastries for every occasion.",
    contact: "sweettreats@example.com",
    phone: "505-101-2020",
    address: "505 Sugar St, Dessert Land",
    cuisine: ["Desserts", "Pastries"],
    minGuests: 15,
    maxGuests: 150,
    pricePerPerson: 25,
    rating: 4.6,
    reviews: 80,
    imageUrl: "https://example.com/sweettreats.jpg",
  },
];

const seedCaterers = async () => {
  try {
    await Caterer.deleteMany();
    await Caterer.insertMany(caterers);
    console.log("Caterers seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding caterers:", error);
    process.exit(1);
  }
};

seedCaterers();


