const Caterer = require("../models/Caterer");

// Get available caterers based on occasion and menu type
const getAvailableCaterers = async (req, res) => {
  try {
    const { occasionType, menuType } = req.body;

    // Validate input parameters
    if (!occasionType || !menuType) {
      return res.status(400).json({
        success: false,
        message: "Occasion type and menu type are required",
      });
    }

    // Validate occasion types
    const validOccasions = [
      "wedding",
      "corporate",
      "social",
      "celebration",
      "birthday",
      "anniversary",
    ];
    if (!validOccasions.includes(occasionType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid occasion type",
      });
    }

    // Find caterers matching the criteria
    const availableCaterers = await Caterer.find({
      occasionTypes: { $in: [occasionType.toLowerCase()] },
      menuTypes: { $in: [menuType.toLowerCase()] },
      isActive: true,
      isVerified: true,
    }).select(
      "businessName contactPerson email phone rating averagePrice location specialties"
    );

    // Format the response
    const formattedCaterers = availableCaterers.map((caterer) => ({
      id: caterer._id,
      name: caterer.businessName,
      contactPerson: caterer.contactPerson,
      email: caterer.email,
      phone: caterer.phone,
      rating: caterer.rating || 0,
      averagePrice: caterer.averagePrice,
      location: caterer.location,
      specialties: caterer.specialties,
    }));

    res.status(200).json({
      success: true,
      count: formattedCaterers.length,
      data: formattedCaterers,
      message: `Found ${formattedCaterers.length} available caterers`,
    });
  } catch (error) {
    console.error("Error fetching available caterers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching caterers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get caterer details by ID
const getCatererById = async (req, res) => {
  try {
    const { id } = req.params;

    const caterer = await Caterer.findById(id).select("-password");

    if (!caterer) {
      return res.status(404).json({
        success: false,
        message: "Caterer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: caterer,
    });
  } catch (error) {
    console.error("Error fetching caterer details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching caterer details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all caterers with pagination and filtering
const getAllCaterers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true, isVerified: true }; // Ensure caterers are active and verified

    if (req.query.location) {
      filter["location.city"] = new RegExp(req.query.location, "i");
    }

    if (req.query.occasionType) {
      filter.occasionTypes = { $in: [req.query.occasionType.toLowerCase()] };
    }

    if (req.query.menuType) {
      filter.menuTypes = { $in: [req.query.menuType.toLowerCase()] };
    }

    // Get total count for pagination
    const total = await Caterer.countDocuments(filter);

    // Fetch caterers with pagination
    const caterers = await Caterer.find(filter)
      .select(
        "businessName contactPerson email phone rating averagePrice location specialties"
      )
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: caterers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: caterers,
    });
  } catch (error) {
    console.error("Error fetching caterers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching caterers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Search caterers by name or location
const searchCaterers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    const searchRegex = new RegExp(query, "i");

    const caterers = await Caterer.find({
      isActive: true,
      isVerified: true, // Ensure caterers are active and verified
      $or: [
        { businessName: searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
        { specialties: { $in: [searchRegex] } },
      ],
    }).select(
      "businessName contactPerson email phone rating averagePrice location specialties"
    );

    res.status(200).json({
      success: true,
      count: caterers.length,
      data: caterers,
    });
  } catch (error) {
    console.error("Error searching caterers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while searching caterers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAvailableCaterers,
  getCatererById,
  getAllCaterers,
  searchCaterers,
};


