# Database Schema Documentation

## Overview

CaterPro uses MongoDB as its primary database. This document outlines the database schema, collections, and relationships between different entities.

## Database Structure

### Collections Overview

| Collection | Purpose | Estimated Size |
|------------|---------|----------------|
| `users` | Customer accounts and profiles | ~10K documents |
| `caterers` | Caterer business profiles | ~500 documents |
| `menuitems` | Individual menu items | ~50K documents |
| `reservations` | Booking requests and details | ~100K documents |
| `orders` | Confirmed orders and status | ~80K documents |
| `reviews` | Customer reviews and ratings | ~200K documents |
| `sessions` | User session management | ~5K documents |

## Schema Definitions

### Users Collection

**Collection Name:** `users`

```javascript
{
  _id: ObjectId,
  username: String,           // Unique username
  email: String,              // Unique email address (e.g., user@example.com)
  password: String,           // Hashed password (bcrypt)
  firstName: String,          // User's first name
  lastName: String,           // User's last name
  phone: String,              // Phone number (optional) 
    
  avatar: {
    url: String,              // Profile picture URL
    alt: String               // Alt text for accessibility
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    dietaryRestrictions: [String], // Array of dietary preferences
    favoriteOccasions: [String],   // Preferred event types
    budgetRange: {
      min: Number,
      max: Number
    },
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  role: {
    type: String,
    enum: ['customer', 'caterer', 'admin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    count: Number,
    lastAttempt: Date,
    lockedUntil: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Unique indexes
{ email: 1 }
{ username: 1 }

// Compound indexes
{ role: 1, isActive: 1 }
{ createdAt: -1 }
```

### Caterers Collection

**Collection Name:** `caterers`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to users collection
  businessName: String,       // Business name
  contactPerson: String,      // Primary contact person
  email: String,              // Business email
  phone: String,              // Business phone
  website: String,            // Business website (optional)
  description: String,        // Business description
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  serviceArea: {
    radius: Number,           // Service radius in miles
    cities: [String],         // Specific cities served
    states: [String]          // States served
  },
  
  businessInfo: {
    licenseNumber: String,
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expiryDate: Date
    },
    taxId: String,
    establishedYear: Number,
    employeeCount: Number
  },
  
  services: {
    occasionTypes: [{
      type: String,
      enum: ['wedding', 'corporate', 'social', 'celebration', 'birthday', 'anniversary']
    }],
    menuTypes: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'non-vegetarian', 'both', 'kosher', 'halal']
    }],
    serviceTypes: [{
      type: String,
      enum: ['onsite', 'pickup', 'delivery', 'staff-required']
    }],
    specialties: [String],    // Cuisine specialties
    dietaryAccommodations: [String]
  },
  
  capacity: {
    minGuests: Number,
    maxGuests: Number,
    simultaneousEvents: Number
  },
  
  pricing: {
    pricePerPerson: {
      min: Number,
      max: Number
    },
    minimumOrder: Number,
    serviceCharge: Number,    // Percentage
    cancellationFee: Number   // Percentage
  },
  
  availability: {
    schedule: [{
      day: String,            // Monday, Tuesday, etc.
      isAvailable: Boolean,
      startTime: String,      // HH:MM format
      endTime: String         // HH:MM format
    }],
    blackoutDates: [Date],    // Unavailable dates
    advanceBookingDays: Number // Minimum days in advance
  },
  
  media: {
    logo: {
      url: String,
      alt: String
    },
    gallery: [{
      url: String,
      alt: String,
      category: String        // 'food', 'setup', 'event'
    }],
    videos: [{
      url: String,
      title: String,
      thumbnail: String
    }]
  },
  
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  
  rating: {
    average: Number,          // 0-5 scale
    count: Number,            // Total number of reviews
    breakdown: {
      5: Number,              // Count of 5-star reviews
      4: Number,              // Count of 4-star reviews
      3: Number,              // Count of 3-star reviews
      2: Number,              // Count of 2-star reviews
      1: Number               // Count of 1-star reviews
    }
  },
  
  statistics: {
    totalOrders: Number,
    completedOrders: Number,
    cancelledOrders: Number,
    totalRevenue: Number,
    averageOrderValue: Number,
    responseTime: Number      // Average response time in hours
  },
  
  verification: {
    isVerified: Boolean,
    verifiedAt: Date,
    verifiedBy: ObjectId,     // Admin user ID
    documents: [{
      type: String,           // 'license', 'insurance', 'certification'
      url: String,
      uploadedAt: Date,
      status: String          // 'pending', 'approved', 'rejected'
    }]
  },
  
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Geospatial index
{ "address.coordinates": "2dsphere" }

// Compound indexes
{ isActive: 1, isFeatured: 1 }
{ "services.occasionTypes": 1, "services.menuTypes": 1 }
{ "rating.average": -1, "statistics.totalOrders": -1 }
{ "address.city": 1, "address.state": 1 }

// Text search index
{ businessName: "text", description: "text", "services.specialties": "text" }
```

### Menu Items Collection

**Collection Name:** `menuitems`

```javascript
{
  _id: ObjectId,
  catererId: ObjectId,        // Reference to caterers collection
  name: String,               // Menu item name
  description: String,        // Detailed description
  category: {
    type: String,
    enum: ['appetizers', 'salads', 'soups', 'main-course', 'vegetarian', 
           'vegan', 'seafood', 'meat', 'poultry', 'pasta', 'rice-dishes', 
           'desserts', 'beverages', 'breakfast', 'lunch', 'dinner', 'snacks', 
           'sides', 'bread', 'other']
  },
  
  pricing: {
    price: Number,            // Base price
    unit: String,             // 'per-person', 'per-item', 'per-dozen'
    minimumQuantity: Number,
    maximumQuantity: Number
  },
  
  dietary: {
    restrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 
             'soy-free', 'kosher', 'halal', 'low-carb', 'keto', 'paleo', 
             'low-sodium', 'sugar-free', 'organic', 'raw', 'spicy', 'mild']
    }],
    allergens: [{
      type: String,
      enum: ['milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 
             'wheat', 'soybeans', 'sesame', 'mustard', 'celery', 'lupin', 
             'molluscs', 'sulphites']
    }]
  },
  
  ingredients: String,        // List of ingredients
  
  nutrition: {
    calories: Number,
    protein: Number,          // grams
    carbohydrates: Number,    // grams
    fat: Number,              // grams
    fiber: Number,            // grams
    sodium: Number,           // milligrams
    sugar: Number             // grams
  },
  
  preparation: {
    time: Number,             // minutes
    difficulty: String,       // 'easy', 'medium', 'hard'
    servingSize: String,      // '1 portion', '6-8 people'
    instructions: String
  },
  
  availability: {
    isAvailable: Boolean,
    seasonality: [String],    // 'spring', 'summer', 'fall', 'winter'
    schedule: [{
      day: String,
      available: Boolean
    }]
  },
  
  media: {
    images: [{
      url: String,
      alt: String,
      isPrimary: Boolean
    }],
    videos: [{
      url: String,
      title: String
    }]
  },
  
  popularity: {
    orderCount: Number,
    rating: {
      average: Number,
      count: Number
    },
    lastOrdered: Date
  },
  
  promotions: {
    isOnSale: Boolean,
    discountPercentage: Number,
    salePrice: Number,
    saleStartDate: Date,
    saleEndDate: Date,
    promoCode: String
  },
  
  tags: [String],             // Searchable tags
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Compound indexes
{ catererId: 1, isActive: 1 }
{ catererId: 1, category: 1 }
{ category: 1, "dietary.restrictions": 1 }
{ "pricing.price": 1, category: 1 }
{ "popularity.rating.average": -1, "popularity.orderCount": -1 }

// Text search index
{ name: "text", description: "text", ingredients: "text", tags: "text" }
```

### Reservations Collection

**Collection Name:** `reservations`

```javascript
{
  _id: ObjectId,
  reservationNumber: String,  // Unique reservation number
  customerId: ObjectId,       // Reference to users collection
  catererId: ObjectId,        // Reference to caterers collection
  
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    alternateContact: String
  },
  
  eventDetails: {
    venue: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    eventDate: Date,
    eventTime: String,        // HH:MM format
    duration: Number,         // hours
    occasionType: String,
    guestCount: Number,
    setupRequirements: String
  },
  
  catering: {
    menuType: String,
    serviceType: String,
    selectedMenuItems: [{
      menuItemId: ObjectId,
      quantity: Number,
      specialInstructions: String,
      unitPrice: Number
    }],
    dietaryRestrictions: [String],
    specialRequests: String
  },
  
  pricing: {
    subtotal: Number,
    serviceCharge: Number,
    tax: Number,
    deliveryFee: Number,
    total: Number,
    currency: String,
    budgetRange: {
      min: Number,
      max: Number
    }
  },
  
  status: {
    current: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending'
    },
    history: [{
      status: String,
      timestamp: Date,
      updatedBy: ObjectId,
      notes: String
    }]
  },
  
  communication: {
    messages: [{
      from: ObjectId,         // User ID
      to: ObjectId,           // User ID
      message: String,
      timestamp: Date,
      isRead: Boolean
    }],
    lastContact: Date
  },
  
  payment: {
    method: String,           // 'credit-card', 'bank-transfer', 'cash'
    status: String,           // 'pending', 'partial', 'paid', 'refunded'
    transactions: [{
      amount: Number,
      type: String,           // 'payment', 'refund'
      transactionId: String,
      timestamp: Date,
      gateway: String         // 'stripe', 'paypal'
    }],
    depositAmount: Number,
    depositPaid: Boolean,
    balanceDue: Number
  },
  
  logistics: {
    setupTime: String,        // HH:MM format
    deliveryTime: String,     // HH:MM format
    pickupTime: String,       // HH:MM format
    staffRequired: Number,
    equipmentNeeded: [String],
    specialInstructions: String
  },
  
  cancellation: {
    isCancelled: Boolean,
    cancelledAt: Date,
    cancelledBy: ObjectId,
    reason: String,
    refundAmount: Number,
    refundProcessed: Boolean
  },
  
  feedback: {
    customerRating: Number,   // 1-5 scale
    customerReview: String,
    catererRating: Number,    // 1-5 scale
    catererNotes: String,
    reviewDate: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Unique index
{ reservationNumber: 1 }

// Compound indexes
{ customerId: 1, "status.current": 1 }
{ catererId: 1, "status.current": 1 }
{ "eventDetails.eventDate": 1, "status.current": 1 }
{ createdAt: -1 }

// Geospatial index
{ "eventDetails.address.coordinates": "2dsphere" }
```

### Orders Collection

**Collection Name:** `orders`

```javascript
{
  _id: ObjectId,
  orderNumber: String,        // Unique order number
  reservationId: ObjectId,    // Reference to reservations collection
  customerId: ObjectId,       // Reference to users collection
  catererId: ObjectId,        // Reference to caterers collection
  
  orderDetails: {
    items: [{
      menuItemId: ObjectId,
      name: String,           // Snapshot of item name
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
      specialInstructions: String
    }],
    subtotal: Number,
    taxes: Number,
    fees: Number,
    total: Number,
    currency: String
  },
  
  status: {
    current: {
      type: String,
      enum: ['confirmed', 'preparing', 'ready', 'in-transit', 'delivered', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    timeline: [{
      status: String,
      timestamp: Date,
      estimatedTime: Date,
      actualTime: Date,
      notes: String
    }]
  },
  
  delivery: {
    type: String,             // 'pickup', 'delivery', 'onsite'
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    scheduledTime: Date,
    actualTime: Date,
    instructions: String,
    contactPerson: String,
    contactPhone: String
  },
  
  payment: {
    status: String,           // 'pending', 'paid', 'partial', 'refunded'
    method: String,
    transactions: [{
      amount: Number,
      type: String,
      transactionId: String,
      timestamp: Date,
      status: String
    }],
    totalPaid: Number,
    balanceDue: Number
  },
  
  tracking: {
    preparationStarted: Date,
    preparationCompleted: Date,
    qualityChecked: Date,
    dispatched: Date,
    delivered: Date,
    estimatedDelivery: Date
  },
  
  quality: {
    temperatureChecks: [{
      item: String,
      temperature: Number,
      timestamp: Date,
      checkedBy: String
    }],
    packagingNotes: String,
    qualityScore: Number      // 1-10 scale
  },
  
  feedback: {
    rating: Number,           // 1-5 scale
    review: String,
    photos: [String],         // URLs to uploaded photos
    wouldRecommend: Boolean,
    reviewDate: Date,
    response: {
      message: String,
      respondedAt: Date,
      respondedBy: ObjectId
    }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Unique index
{ orderNumber: 1 }

// Compound indexes
{ customerId: 1, "status.current": 1 }
{ catererId: 1, "status.current": 1 }
{ reservationId: 1 }
{ "delivery.scheduledTime": 1 }
{ createdAt: -1 }
```

### Reviews Collection

**Collection Name:** `reviews`

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,       // Reference to users collection
  catererId: ObjectId,        // Reference to caterers collection
  orderId: ObjectId,          // Reference to orders collection
  reservationId: ObjectId,    // Reference to reservations collection
  
  rating: {
    overall: Number,          // 1-5 scale
    food: Number,             // 1-5 scale
    service: Number,          // 1-5 scale
    value: Number,            // 1-5 scale
    presentation: Number,     // 1-5 scale
    timeliness: Number        // 1-5 scale
  },
  
  review: {
    title: String,
    content: String,
    pros: [String],
    cons: [String],
    wouldRecommend: Boolean
  },
  
  media: {
    photos: [{
      url: String,
      caption: String,
      uploadedAt: Date
    }],
    videos: [{
      url: String,
      caption: String,
      uploadedAt: Date
    }]
  },
  
  eventInfo: {
    occasionType: String,
    guestCount: Number,
    eventDate: Date,
    venue: String
  },
  
  verification: {
    isVerified: Boolean,      // Verified purchase
    verifiedAt: Date
  },
  
  helpfulness: {
    helpful: Number,          // Count of helpful votes
    notHelpful: Number,       // Count of not helpful votes
    totalVotes: Number
  },
  
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: ObjectId     // Caterer user ID
  },
  
  moderation: {
    isApproved: Boolean,
    moderatedAt: Date,
    moderatedBy: ObjectId,    // Admin user ID
    flagged: Boolean,
    flagReason: String
  },
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Compound indexes
{ catererId: 1, isActive: 1, "moderation.isApproved": 1 }
{ customerId: 1, createdAt: -1 }
{ orderId: 1 }
{ "rating.overall": -1, createdAt: -1 }
```

## Relationships

### Entity Relationship Diagram

```
Users (1) ←→ (M) Reservations (1) ←→ (1) Orders
  ↓                    ↓                    ↓
  (1)                  (M)                  (M)
  ↓                    ↓                    ↓
Caterers (1) ←→ (M) MenuItems         Reviews
  ↑                    ↑                    ↑
  (1)                  (M)                  (M)
  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### Relationship Details

1. **Users → Caterers**: One-to-One (when user role is 'caterer')
2. **Caterers → MenuItems**: One-to-Many
3. **Users → Reservations**: One-to-Many (as customer)
4. **Caterers → Reservations**: One-to-Many (as service provider)
5. **Reservations → Orders**: One-to-One
6. **Orders → Reviews**: One-to-One
7. **Caterers → Reviews**: One-to-Many

## Data Validation

### Mongoose Schema Validation

```javascript
// Example validation rules
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  }
});
```

## Performance Considerations

### Indexing Strategy

1. **Primary Indexes**: All `_id` fields (automatic)
2. **Unique Indexes**: Email, username, reservation numbers
3. **Compound Indexes**: Frequently queried field combinations
4. **Text Indexes**: Full-text search capabilities
5. **Geospatial Indexes**: Location-based queries

### Query Optimization

1. **Use Projections**: Only fetch required fields
2. **Limit Results**: Implement pagination
3. **Use Aggregation**: For complex data processing
4. **Cache Frequently Accessed Data**: Redis for session data

### Data Archiving

1. **Old Orders**: Archive orders older than 2 years
2. **Inactive Users**: Soft delete after 1 year of inactivity
3. **Completed Reservations**: Archive after 6 months

## Backup and Recovery

### Backup Strategy

1. **Daily Backups**: Automated daily database backups
2. **Weekly Full Backups**: Complete database snapshots
3. **Point-in-Time Recovery**: MongoDB replica sets
4. **Geographic Distribution**: Backups stored in multiple regions

### Recovery Procedures

1. **Data Corruption**: Restore from latest backup
2. **Accidental Deletion**: Point-in-time recovery
3. **Disaster Recovery**: Failover to backup region



