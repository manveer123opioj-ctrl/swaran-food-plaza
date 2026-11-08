// ... existing code ...
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  Utensils, 
  Phone, 
  MapPin, 
  Clock, 
  X, 
  CheckCircle,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Lock,
  Mail,
  ChefHat,
  RefreshCw,
  Clock3,
  Check,
  Truck
} from 'lucide-react';

// FIREBASE IMPORTS
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

// INITIALIZE FIREBASE WITH SAFE FALLBACKS FOR VERCEL BUILD
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { 
      apiKey: "demo-key", 
      authDomain: "swaran-food-plaza.firebaseapp.com", 
      projectId: "swaran-food-plaza",
      storageBucket: "swaran-food-plaza.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'swaran-food-plaza-app';

// MENU DATA FROM THE MENU CARD
const MENU_CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'pizzas', name: 'Global Pizzas' },
  { id: 'regular_pizzas', name: 'Value Pizzas' },
  { id: 'kids_pizzas', name: "Kids & Kulhad Pizza" },
  { id: 'garlic_bread', name: 'Garlic Bread' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'happy_meals', name: 'Happy & Combo Meals' },
  { id: 'momos', name: 'Momos' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'snacks', name: 'Snacks & Starters' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'dosa', name: 'South Indian Dosa' },
  { id: 'shakes', name: 'Shakes & Beverages' },
  { id: 'maggi', name: 'Maggi Special' },
  { id: 'noodles', name: 'Noodles' },
  { id: 'breakfast', name: 'Paratha & Breakfast' },
  { id: 'mocktails', name: 'Mocktails & Cold Drinks' },
  { id: 'soups', name: 'Soups' },
  { id: 'main_course', name: 'Main Course & Paneer' },
  { id: 'rice_roti', name: 'Rice, Roti & Thali' },
  { id: 'desserts', name: 'Ice Creams & Pastries' },
  { id: 'cakes', name: 'Cakes (On Order)' },
];

const MENU_ITEMS = [
  // GLOBAL PIZZAS
  { id: 'gp1', name: 'Double Cheese Pizza', category: 'pizzas', description: 'Loaded with extra mozzarella cheese', isVeg: true, variants: [{ label: 'Regular', price: 169 }, { label: 'Medium', price: 269 }, { label: 'Large', price: 449 }] },
  { id: 'gp2', name: 'Classic Cheesy Pizza', category: 'pizzas', description: 'Capsicum, Tomato, Onion', isVeg: true, variants: [{ label: 'Regular', price: 169 }, { label: 'Medium', price: 269 }, { label: 'Large', price: 449 }] },
  { id: 'gp3', name: 'Cheesy Makhani Pizza', category: 'pizzas', description: 'Mushroom, Capsicum, Tomato, Onion, Sweet Corn', isVeg: true, variants: [{ label: 'Regular', price: 189 }, { label: 'Medium', price: 299 }, { label: 'Large', price: 469 }] },
  { id: 'gp4', name: 'Mushroom Cheesy Pizza', category: 'pizzas', description: 'Mushroom, Capsicum, Tomato, Onion, Sweet Corn', isVeg: true, variants: [{ label: 'Regular', price: 169 }, { label: 'Medium', price: 269 }, { label: 'Large', price: 449 }] },
  { id: 'gp5', name: 'Paneer Veggie Pizza', category: 'pizzas', description: 'Paneer, Capsicum, Tomato, Onion, Sweet Corn', isVeg: true, variants: [{ label: 'Regular', price: 179 }, { label: 'Medium', price: 289 }, { label: 'Large', price: 479 }] },
  { id: 'gp6', name: 'Cheesy Black Olive Magic', category: 'pizzas', description: 'Black Olive, Capsicum, Tomato, Onion, Sweet Corn', isVeg: true, variants: [{ label: 'Regular', price: 199 }, { label: 'Medium', price: 309 }, { label: 'Large', price: 479 }] },
  { id: 'gp7', name: 'Mexicana Green Pizza', category: 'pizzas', description: 'Black Olive, Jalapenos, Mushroom, Capsicum', isVeg: true, variants: [{ label: 'Regular', price: 209 }, { label: 'Medium', price: 339 }, { label: 'Large', price: 499 }] },
  { id: 'gp8', name: 'Deluxe Veggie Pizza', category: 'pizzas', description: 'Black Olive, Capsicum, Tomato, Onion, Sweet Corn, Mushroom', isVeg: true, variants: [{ label: 'Regular', price: 209 }, { label: 'Medium', price: 329 }, { label: 'Large', price: 499 }] },
  { id: 'gp9', name: 'Farm House Pizza', category: 'pizzas', description: 'Black Olive, Capsicum, Tomato, Onion, Sweet Corn, Mushroom, Jalapenos, Paneer', isVeg: true, variants: [{ label: 'Regular', price: 219 }, { label: 'Medium', price: 339 }, { label: 'Large', price: 499 }] },
  { id: 'gp10', name: 'Tandoori Paneer Veggie Pizza', category: 'pizzas', description: 'Spiced Paneer, Capsicum, Onion, Tomato, Jalapenos', isVeg: true, variants: [{ label: 'Regular', price: 239 }, { label: 'Medium', price: 359 }, { label: 'Large', price: 589 }] },
  { id: 'gp11', name: 'Spicy Green Paradise Pizza', category: 'pizzas', description: 'Black Olive, Capsicum, Red Paprika, Mushroom, Jalapenos, Paneer', isVeg: true, variants: [{ label: 'Regular', price: 269 }, { label: 'Medium', price: 419 }, { label: 'Large', price: 589 }] },
  { id: 'gp12', name: 'Pan Pizza Special', category: 'pizzas', description: 'Fresh pan prepared crust with rich toppings', isVeg: true, variants: [{ label: 'Regular', price: 249 }, { label: 'Medium', price: 349 }, { label: 'Large', price: 449 }] },
  { id: 'gp13', name: 'Special Four Cheese Pizza', category: 'pizzas', description: 'Blend of four premium cheeses', isVeg: true, variants: [{ label: 'Medium', price: 439 }] },
  { id: 'gp14', name: 'Special Thin Crust Pizza', category: 'pizzas', description: 'Crispy thin crust with gourmet toppings', isVeg: true, variants: [{ label: 'Medium', price: 429 }] },
  { id: 'gp15', name: 'Four Variety Family Pizza (16")', category: 'pizzas', description: 'Giant 16-inch pizza with 4 different topping sections', isVeg: true, variants: [{ label: '16 Inch Family', price: 719 }] },

  // VALUE PIZZAS
  { id: 'vp1', name: 'Single Cheese Pizza', category: 'regular_pizzas', description: 'Classic cheese base', isVeg: true, variants: [{ label: 'Regular', price: 99 }, { label: 'Medium', price: 199 }, { label: 'Large', price: 299 }] },
  { id: 'vp2', name: 'Single Cheese Sweet Corn', category: 'regular_pizzas', description: 'Cheese with juicy sweet corn', isVeg: true, variants: [{ label: 'Regular', price: 109 }, { label: 'Medium', price: 199 }, { label: 'Large', price: 309 }] },
  { id: 'vp3', name: 'Single Cheese Tomato', category: 'regular_pizzas', description: 'Cheese with fresh tomatoes', isVeg: true, variants: [{ label: 'Regular', price: 109 }, { label: 'Medium', price: 199 }, { label: 'Large', price: 309 }] },

  // KIDS & KULHAD PIZZA
  { id: 'kp1', name: 'Tomato & Capsicum Pizza', category: 'kids_pizzas', description: 'Mild pizza for kids', isVeg: true, variants: [{ label: 'Kids Size', price: 79 }] },
  { id: 'kp2', name: 'Onion, Capsicum & Sweet Corn Pizza', category: 'kids_pizzas', description: 'Sweet and crunchy veggies', isVeg: true, variants: [{ label: 'Kids Size', price: 89 }] },
  { id: 'kp3', name: 'Paneer & Onion Pizza', category: 'kids_pizzas', description: 'Paneer cubes with fresh onions', isVeg: true, variants: [{ label: 'Kids Size', price: 99 }] },
  { id: 'kp4', name: 'Veg Kulhad Pizza', category: 'kids_pizzas', description: 'Clay pot baked cheesy pizza', isVeg: true, variants: [{ label: 'Kulhad Portion', price: 50 }] },
  { id: 'kp5', name: 'Tandoori Kulhad Pizza', category: 'kids_pizzas', description: 'Tandoori sauce clay pot pizza', isVeg: true, variants: [{ label: 'Kulhad Portion', price: 70 }] },
  { id: 'kp6', name: 'Paneer Kulhad Pizza', category: 'kids_pizzas', description: 'Rich paneer clay pot pizza', isVeg: true, variants: [{ label: 'Kulhad Portion', price: 120 }] },

  // GARLIC BREAD
  { id: 'gb1', name: 'Garlic Bread with Cheese', category: 'garlic_bread', description: 'Toasted garlic bread loaded with molten cheese', isVeg: true, variants: [{ label: 'Portion', price: 90 }] },
  { id: 'gb2', name: 'Garlic Bread Cheese & Sweet Corn', category: 'garlic_bread', description: 'Garlic bread with cheese and sweet corn', isVeg: true, variants: [{ label: 'Portion', price: 110 }] },
  { id: 'gb3', name: 'Garlic Bread Cheese & Veggies', category: 'garlic_bread', description: 'Garlic bread with cheese and mixed veggies', isVeg: true, variants: [{ label: 'Portion', price: 130 }] },

  // BURGERS
  { id: 'bg1', name: 'Pocket Friendly Burger', category: 'burgers', description: 'Crispy veg patty with soft bun', isVeg: true, variants: [{ label: 'Standard', price: 50 }] },
  { id: 'bg2', name: 'Veg Supreme Burger', category: 'burgers', description: 'Special supreme veg patty with lettuce and sauces', isVeg: true, variants: [{ label: 'Standard', price: 69 }] },
  { id: 'bg3', name: 'Genius Burger', category: 'burgers', description: 'Loaded with extra cheese and crunchy veggies', isVeg: true, variants: [{ label: 'Standard', price: 79 }] },
  { id: 'bg4', name: 'Finger Overload Burger', category: 'burgers', description: 'Finger-licking double patty burger', isVeg: true, variants: [{ label: 'Standard', price: 89 }] },
  { id: 'bg5', name: 'Special Burger', category: 'burgers', description: 'House special recipe burger', isVeg: true, variants: [{ label: 'Standard', price: 99 }] },
  { id: 'bg6', name: 'Special Burger with Patty', category: 'burgers', description: 'Double special patty with extra cheese', isVeg: true, variants: [{ label: 'Standard', price: 129 }] },

  // WRAPS
  { id: 'wr1', name: 'Classic Wrap', category: 'wraps', description: 'Veggie roll with signature sauces', isVeg: true, variants: [{ label: 'Standard', price: 70 }] },
  { id: 'wr2', name: 'Tosho Wrap', category: 'wraps', description: 'Tangy and spicy veggie wrap', isVeg: true, variants: [{ label: 'Standard', price: 80 }] },
  { id: 'wr3', name: 'Paneer Wrap', category: 'wraps', description: 'Marinated paneer chunks wrap', isVeg: true, variants: [{ label: 'Standard', price: 90 }] },
  { id: 'wr4', name: 'Punjabi Wrap', category: 'wraps', description: 'Rich Punjabi spice style wrap', isVeg: true, variants: [{ label: 'Standard', price: 100 }] },
  { id: 'wr5', name: 'Special Wrap', category: 'wraps', description: 'Loaded chef special wrap', isVeg: true, variants: [{ label: 'Standard', price: 110 }] },

  // HAPPY MEALS
  { id: 'hm1', name: 'Happy Meal (Burger + Fries + Coke 250ml)', category: 'happy_meals', description: 'Pocket Friendly Burger + French Fries + Coke 250ml', isVeg: true, variants: [{ label: 'Meal Set', price: 139 }] },
  { id: 'hm2', name: 'Royal Meal (Genius Burger + Fries + Coke 250ml)', category: 'happy_meals', description: 'Genius Burger + French Fries + Coke 250ml', isVeg: true, variants: [{ label: 'Meal Set', price: 169 }] },
  { id: 'hm3', name: 'Jumbo Meal 8" Pizza Combo', category: 'happy_meals', description: 'Deluxe Veggie Pizza 8" + French Fries + Coke 750ml', isVeg: true, variants: [{ label: 'Meal Set', price: 309 }] },
  { id: 'hm4', name: 'Jumbo Meal 10" Pizza Combo', category: 'happy_meals', description: 'Deluxe Veggie Pizza 10" + French Fries + Coke 750ml', isVeg: true, variants: [{ label: 'Meal Set', price: 419 }] },
  { id: 'hm5', name: 'Supreme Meal 8" Any Pizza Combo', category: 'happy_meals', description: 'Any Pizza 8" + French Fries + Coke 750ml', isVeg: true, variants: [{ label: 'Meal Set', price: 339 }] },
  { id: 'hm6', name: 'Supreme Meal 10" Any Pizza Combo', category: 'happy_meals', description: 'Any Pizza 10" + French Fries + Coke 1 Ltr', isVeg: true, variants: [{ label: 'Meal Set', price: 519 }] },

  // MOMOS
  { id: 'mm1', name: 'Veg Momos', category: 'momos', description: 'Steamed or fried vegetable dumplings', isVeg: true, variants: [{ label: 'Steam', price: 70 }, { label: 'Fry', price: 60 }] },
  { id: 'mm2', name: 'Paneer Momos', category: 'momos', description: 'Paneer stuffed dumplings', isVeg: true, variants: [{ label: 'Steam', price: 90 }, { label: 'Fry', price: 80 }] },
  { id: 'mm3', name: 'Chilly Momos', category: 'momos', description: 'Momos tossed in spicy chilli sauce', isVeg: true, variants: [{ label: 'Portion', price: 110 }] },
  { id: 'mm4', name: 'Gravy Momos', category: 'momos', description: 'Momos served in rich creamy gravy', isVeg: true, variants: [{ label: 'Portion', price: 120 }] },
  { id: 'mm5', name: 'Tandoori Momos', category: 'momos', description: 'Charcoal grilled tandoori momos', isVeg: true, variants: [{ label: 'Portion', price: 100 }] },
  { id: 'mm6', name: 'Momos Crunchy (8 Pcs)', category: 'momos', description: 'Extra crispy coated momos', isVeg: true, variants: [{ label: '8 Pieces', price: 140 }] },

  // PASTA
  { id: 'ps1', name: 'White Sauce Pasta', category: 'pasta', description: 'Creamy white cheese sauce pasta', isVeg: true, variants: [{ label: 'Portion', price: 100 }] },
  { id: 'ps2', name: 'Red Sauce Pasta', category: 'pasta', description: 'Tangy tomato arrabbiata pasta', isVeg: true, variants: [{ label: 'Portion', price: 120 }] },
  { id: 'ps3', name: 'Mix Sauce Pasta', category: 'pasta', description: 'Pink sauce creamy tomato pasta', isVeg: true, variants: [{ label: 'Portion', price: 120 }] },
  { id: 'ps4', name: 'Peri Peri Pasta', category: 'pasta', description: 'Spicy peri peri sauce pasta', isVeg: true, variants: [{ label: 'Portion', price: 130 }] },
  { id: 'ps5', name: 'Makhani Pasta', category: 'pasta', description: 'Indian makhani butter sauce fusion pasta', isVeg: true, variants: [{ label: 'Portion', price: 130 }] },
  { id: 'ps6', name: 'Tandoori Pasta', category: 'pasta', description: 'Smoky tandoori sauce pasta', isVeg: true, variants: [{ label: 'Portion', price: 140 }] },
  { id: 'ps7', name: 'S.F.P Special Pasta', category: 'pasta', description: 'Chef special loaded pasta', isVeg: true, variants: [{ label: 'Portion', price: 160 }] },

  // SNACKS
  { id: 'sn1', name: 'French Fries', category: 'snacks', description: 'Crispy salted potato fries', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'sn2', name: 'French Fries Peri Peri', category: 'snacks', description: 'Fries tossed in spicy peri peri seasoning', isVeg: true, variants: [{ label: 'Portion', price: 90 }] },
  { id: 'sn3', name: 'Potato Pops (12 Pcs)', category: 'snacks', description: 'Crispy bite-sized potato pops', isVeg: true, variants: [{ label: '12 Pcs', price: 70 }] },
  { id: 'sn4', name: 'Veg Fried Rice', category: 'snacks', description: 'Wok tossed vegetable fried rice', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'sn5', name: 'Paneer Fried Rice', category: 'snacks', description: 'Fried rice loaded with paneer cubes', isVeg: true, variants: [{ label: 'Portion', price: 100 }] },
  { id: 'sn6', name: 'Manchurian', category: 'snacks', description: 'Veg manchurian balls in gravy/dry', isVeg: true, variants: [{ label: 'Portion', price: 90 }] },
  { id: 'sn7', name: 'Cheese Manchurian', category: 'snacks', description: 'Manchurian with molten cheese', isVeg: true, variants: [{ label: 'Portion', price: 180 }] },
  { id: 'sn8', name: 'Mushroom Manchurian', category: 'snacks', description: 'Fresh mushroom manchurian', isVeg: true, variants: [{ label: 'Portion', price: 200 }] },
  { id: 'sn9', name: 'Chilly Mushroom', category: 'snacks', description: 'Spicy chili coated mushrooms', isVeg: true, variants: [{ label: 'Portion', price: 200 }] },
  { id: 'sn10', name: 'Fried Rice + Manchurian Combo', category: 'snacks', description: 'Veg fried rice served with manchurian gravy', isVeg: true, variants: [{ label: 'Combo', price: 150 }] },
  { id: 'sn11', name: 'Chilly Paneer', category: 'snacks', description: 'Cottage cheese tossed in Indo-Chinese chili sauce', isVeg: true, variants: [{ label: 'Portion', price: 160 }] },
  { id: 'sn12', name: 'Veg Spring Roll (2 Pcs)', category: 'snacks', description: 'Crispy rolls stuffed with veggies', isVeg: true, variants: [{ label: '2 Pcs', price: 80 }] },
  { id: 'sn13', name: 'Paneer Spring Roll (2 Pcs)', category: 'snacks', description: 'Crispy rolls stuffed with paneer', isVeg: true, variants: [{ label: '2 Pcs', price: 100 }] },
  { id: 'sn14', name: 'Crispy Corn', category: 'snacks', description: 'Fried sweet corn tossed in spices', isVeg: true, variants: [{ label: 'Portion', price: 140 }] },
  { id: 'sn15', name: 'Chilly Potato', category: 'snacks', description: 'Crispy potato fingers in chili sauce', isVeg: true, variants: [{ label: 'Portion', price: 110 }] },
  { id: 'sn16', name: 'Honey Chilly Potato', category: 'snacks', description: 'Sweet and spicy honey chili potato', isVeg: true, variants: [{ label: 'Portion', price: 140 }] },
  { id: 'sn17', name: 'Paneer Cutlet', category: 'snacks', description: 'Deep fried paneer patties', isVeg: true, variants: [{ label: 'Portion', price: 150 }] },

  // SANDWICHES
  { id: 'sw1', name: 'Veg Grilled Sandwich', category: 'sandwiches', description: 'Grilled bread with fresh veg filling', isVeg: true, variants: [{ label: 'Standard', price: 70 }] },
  { id: 'sw2', name: 'Paneer Grilled Sandwich', category: 'sandwiches', description: 'Grilled sandwich with paneer filling', isVeg: true, variants: [{ label: 'Standard', price: 90 }] },
  { id: 'sw3', name: 'Cheese Grilled Sandwich', category: 'sandwiches', description: 'Melted cheese grilled sandwich', isVeg: true, variants: [{ label: 'Standard', price: 90 }] },
  { id: 'sw4', name: 'Tandoori Grilled Sandwich', category: 'sandwiches', description: 'Spicy tandoori sauce grilled sandwich', isVeg: true, variants: [{ label: 'Standard', price: 90 }] },
  { id: 'sw5', name: 'Cheese Sweet Corn Grilled Sandwich', category: 'sandwiches', description: 'Corn and cheese grilled sandwich', isVeg: true, variants: [{ label: 'Standard', price: 100 }] },
  { id: 'sw6', name: 'Spicy Special Sandwich', category: 'sandwiches', description: 'House special layered sandwich', isVeg: true, variants: [{ label: 'Regular', price: 110 }, { label: 'Special', price: 130 }] },

  // DOSA
  { id: 'ds1', name: 'Masala Dosa', category: 'dosa', description: 'Crispy rice crepe filled with spiced potato masala', isVeg: true, variants: [{ label: 'Standard', price: 80 }] },
  { id: 'ds2', name: 'Onion Dosa', category: 'dosa', description: 'Crispy dosa sprinkled with chopped onions', isVeg: true, variants: [{ label: 'Standard', price: 80 }] },
  { id: 'ds3', name: 'Paneer Dosa', category: 'dosa', description: 'Dosa stuffed with paneer masala', isVeg: true, variants: [{ label: 'Standard', price: 90 }] },
  { id: 'ds4', name: 'S.F.P. Special Dosa', category: 'dosa', description: 'Chef special loaded South Indian dosa', isVeg: true, variants: [{ label: 'Special', price: 100 }] },

  // SHAKES & BEVERAGES
  { id: 'sh1', name: 'Vanilla Shake', category: 'shakes', description: 'Classic vanilla milk shake', isVeg: true, variants: [{ label: 'Regular', price: 60 }, { label: 'Special', price: 90 }] },
  { id: 'sh2', name: 'Strawberry Shake', category: 'shakes', description: 'Real strawberry flavoured shake', isVeg: true, variants: [{ label: 'Regular', price: 60 }, { label: 'Special', price: 100 }] },
  { id: 'sh3', name: 'Chocolate Shake', category: 'shakes', description: 'Rich chocolate milkshake', isVeg: true, variants: [{ label: 'Regular', price: 70 }, { label: 'Special', price: 110 }] },
  { id: 'sh4', name: 'Butterscotch Shake', category: 'shakes', description: 'Butterscotch crunchy shake', isVeg: true, variants: [{ label: 'Regular', price: 80 }, { label: 'Special', price: 120 }] },
  { id: 'sh5', name: 'Oreo Milk Shake', category: 'shakes', description: 'Blended Oreo cookie shake', isVeg: true, variants: [{ label: 'Regular', price: 70 }, { label: 'Special', price: 110 }] },
  { id: 'sh6', name: 'Kit-Kat Shake', category: 'shakes', description: 'Kit-Kat chocolate bar shake', isVeg: true, variants: [{ label: 'Regular', price: 80 }, { label: 'Special', price: 120 }] },
  { id: 'sh7', na
