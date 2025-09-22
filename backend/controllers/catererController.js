const Caterer = require("../models/Caterer");

// @route   GET api/caterers
// @desc    Get all caterers
// @access  Public
exports.getCaterers = async (req, res) => {
  try {
    const caterers = await Caterer.find();
    res.json(caterers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/caterers/:id
// @desc    Get single caterer by ID
// @access  Public
exports.getCatererById = async (req, res) => {
  try {
    const caterer = await Caterer.findById(req.params.id);

    if (!caterer) {
      return res.status(404).json({ msg: "Caterer not found" });
    }

    res.json(caterer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Caterer not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   POST api/caterers
// @desc    Add new caterer
// @access  Private (Admin only)
exports.addCaterer = async (req, res) => {
  const { name, description, contact, phone, address, cuisine, minGuests, maxGuests, pricePerPerson, rating, reviews, imageUrl } = req.body;

  try {
    const newCaterer = new Caterer({
      name,
      description,
      contact,
      phone,
      address,
      cuisine,
      minGuests,
      maxGuests,
      pricePerPerson,
      rating,
      reviews,
      imageUrl,
    });

    const caterer = await newCaterer.save();
    res.json(caterer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/caterers/:id
// @desc    Update caterer
// @access  Private (Admin only)
exports.updateCaterer = async (req, res) => {
  const { name, description, contact, phone, address, cuisine, minGuests, maxGuests, pricePerPerson, rating, reviews, imageUrl } = req.body;

  // Build caterer object
  const catererFields = {};
  if (name) catererFields.name = name;
  if (description) catererFields.description = description;
  if (contact) catererFields.contact = contact;
  if (phone) catererFields.phone = phone;
  if (address) catererFields.address = address;
  if (cuisine) catererFields.cuisine = cuisine;
  if (minGuests) catererFields.minGuests = minGuests;
  if (maxGuests) catererFields.maxGuests = maxGuests;
  if (pricePerPerson) catererFields.pricePerPerson = pricePerPerson;
  if (rating) catererFields.rating = rating;
  if (reviews) catererFields.reviews = reviews;
  if (imageUrl) catererFields.imageUrl = imageUrl;

  try {
    let caterer = await Caterer.findById(req.params.id);

    if (!caterer) return res.status(404).json({ msg: "Caterer not found" });

    caterer = await Caterer.findByIdAndUpdate(
      req.params.id,
      { $set: catererFields },
      { new: true }
    );

    res.json(caterer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/caterers/:id
// @desc    Delete caterer
// @access  Private (Admin only)
exports.deleteCaterer = async (req, res) => {
  try {
    const caterer = await Caterer.findById(req.params.id);

    if (!caterer) return res.status(404).json({ msg: "Caterer not found" });

    await Caterer.findByIdAndRemove(req.params.id);

    res.json({ msg: "Caterer removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Caterer not found" });
    }
    res.status(500).send("Server Error");
  }
};

