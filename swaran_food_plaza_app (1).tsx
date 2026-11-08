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
  { id: 'sh7', name: 'Caramel Banana Shake', category: 'shakes', description: 'Fresh banana blended with caramel', isVeg: true, variants: [{ label: 'Regular', price: 70 }, { label: 'Special', price: 110 }] },
  { id: 'sh8', name: 'Seasonal Shake', category: 'shakes', description: 'Fresh seasonal fruit shake', isVeg: true, variants: [{ label: 'Regular', price: 70 }, { label: 'Special', price: 110 }] },
  { id: 'sh9', name: 'Black Currant Shake', category: 'shakes', description: 'Exotic black currant shake', isVeg: true, variants: [{ label: 'Regular', price: 100 }, { label: 'Special', price: 130 }] },
  { id: 'sh10', name: 'Tutti Frutti Shake', category: 'shakes', description: 'Sweet tutti frutti blended shake', isVeg: true, variants: [{ label: 'Regular', price: 80 }, { label: 'Special', price: 120 }] },
  { id: 'sh11', name: 'Brownie Shake', category: 'shakes', description: 'Rich chocolate brownie thick shake', isVeg: true, variants: [{ label: 'Regular', price: 80 }, { label: 'Special', price: 120 }] },
  { id: 'sh12', name: 'Cold Coffee', category: 'shakes', description: 'Chilled brewed coffee with milk and ice cream', isVeg: true, variants: [{ label: 'Regular', price: 70 }, { label: 'Special', price: 110 }] },
  { id: 'sh13', name: 'Hot Coffee', category: 'shakes', description: 'Hot frothy coffee', isVeg: true, variants: [{ label: 'Cup', price: 40 }] },
  { id: 'sh14', name: 'Black Coffee', category: 'shakes', description: 'Strong black coffee', isVeg: true, variants: [{ label: 'Cup', price: 30 }] },
  { id: 'sh15', name: 'Kullad Chai', category: 'shakes', description: 'Traditional clay pot masala tea', isVeg: true, variants: [{ label: 'Kullad', price: 30 }] },

  // MAGGI
  { id: 'mg1', name: 'Plain Maggi', category: 'maggi', description: 'Classic 2-minute Maggi noodles', isVeg: true, variants: [{ label: 'Portion', price: 40 }] },
  { id: 'mg2', name: 'Veg Maggi', category: 'maggi', description: 'Maggi prepared with mixed vegetables', isVeg: true, variants: [{ label: 'Portion', price: 60 }] },
  { id: 'mg3', name: 'Paneer Maggi', category: 'maggi', description: 'Maggi loaded with cottage cheese', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'mg4', name: 'Fully Loaded Maggi', category: 'maggi', description: 'Cheese, paneer and veggie loaded Maggi', isVeg: true, variants: [{ label: 'Portion', price: 90 }] },
  { id: 'mg5', name: 'Handi Maggi', category: 'maggi', description: 'Earthen pot slow cooked special Maggi', isVeg: true, variants: [{ label: 'Handi Portion', price: 100 }] },

  // NOODLES
  { id: 'nd1', name: 'Veg Noodles', category: 'noodles', description: 'Stir fried vegetable chowmein noodles', isVeg: true, variants: [{ label: 'Portion', price: 60 }] },
  { id: 'nd2', name: 'Paneer Noodles', category: 'noodles', description: 'Noodles tossed with paneer cubes', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'nd3', name: 'Hakka Noodles', category: 'noodles', description: 'Classic Chinese style Hakka noodles', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'nd4', name: 'Garlic Noodles', category: 'noodles', description: 'Garlic flavoured spicy noodles', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'nd5', name: 'Veg Singapuri Noodles', category: 'noodles', description: 'Curry spiced Singapuri style noodles', isVeg: true, variants: [{ label: 'Portion', price: 90 }] },
  { id: 'nd6', name: 'Paneer Singapuri Noodles', category: 'noodles', description: 'Paneer loaded Singapuri noodles', isVeg: true, variants: [{ label: 'Portion', price: 120 }] },

  // BREAKFAST PARATHA
  { id: 'bf1', name: 'Aloo Paratha', category: 'breakfast', description: 'Stuffed potato paratha served hot', isVeg: true, variants: [{ label: '1 Pc', price: 50 }] },
  { id: 'bf2', name: 'Aloo Onion Paratha', category: 'breakfast', description: 'Potato & onion stuffed paratha', isVeg: true, variants: [{ label: '1 Pc', price: 60 }] },
  { id: 'bf3', name: 'Mix Paratha', category: 'breakfast', description: 'Mixed vegetable stuffed paratha', isVeg: true, variants: [{ label: '1 Pc', price: 70 }] },
  { id: 'bf4', name: 'Paneer Paratha', category: 'breakfast', description: 'Fresh paneer stuffed paratha', isVeg: true, variants: [{ label: '1 Pc', price: 90 }] },
  { id: 'bf5', name: 'Cheese Paratha', category: 'breakfast', description: 'Molten cheese stuffed paratha', isVeg: true, variants: [{ label: '1 Pc', price: 100 }] },

  // MOCKTAILS
  { id: 'mc1', name: 'Lemon Soda', category: 'mocktails', description: 'Refreshing fizzy lemon soda', isVeg: true, variants: [{ label: 'Glass', price: 70 }] },
  { id: 'mc2', name: 'Blood Orange Mojito', category: 'mocktails', description: 'Citrus blood orange mint mocktail', isVeg: true, variants: [{ label: 'Glass', price: 90 }] },
  { id: 'mc3', name: 'Mint Mojito', category: 'mocktails', description: 'Classic refreshing lime and mint mojito', isVeg: true, variants: [{ label: 'Glass', price: 90 }] },
  { id: 'mc4', name: 'Blue Curacao Mojito', category: 'mocktails', description: 'Vibrant blue tropical mocktail', isVeg: true, variants: [{ label: 'Glass', price: 100 }] },
  { id: 'mc5', name: 'Strawberry Mojito', category: 'mocktails', description: 'Sweet strawberry and mint mocktail', isVeg: true, variants: [{ label: 'Glass', price: 100 }] },

  // SOUPS
  { id: 'sp1', name: 'Tomato Soup', category: 'soups', description: 'Rich tomato soup with bread croutons', isVeg: true, variants: [{ label: 'Bowl', price: 70 }] },
  { id: 'sp2', name: 'Sweet Corn Soup', category: 'soups', description: 'Creamy sweet corn vegetable soup', isVeg: true, variants: [{ label: 'Bowl', price: 80 }] },
  { id: 'sp3', name: 'Hot n Sour Soup', category: 'soups', description: 'Spicy and tangy Chinese veg soup', isVeg: true, variants: [{ label: 'Bowl', price: 90 }] },
  { id: 'sp4', name: 'Manchow Soup', category: 'soups', description: 'Indo-Chinese soup served with crispy noodles', isVeg: true, variants: [{ label: 'Bowl', price: 90 }] },

  // MAIN COURSE
  { id: 'mc_p1', name: 'Handi Paneer', category: 'main_course', description: 'Paneer cooked in traditional clay pot gravy', isVeg: true, variants: [{ label: 'Half', price: 180 }, { label: 'Full', price: 320 }] },
  { id: 'mc_p2', name: 'Kadai Paneer', category: 'main_course', description: 'Paneer cooked with bell peppers in wok spices', isVeg: true, variants: [{ label: 'Half', price: 180 }, { label: 'Full', price: 320 }] },
  { id: 'mc_p3', name: 'Matar Paneer', category: 'main_course', description: 'Cottage cheese and green peas gravy', isVeg: true, variants: [{ label: 'Half', price: 160 }, { label: 'Full', price: 270 }] },
  { id: 'mc_p4', name: 'Shahi Paneer', category: 'main_course', description: 'Rich royal cashew & cream paneer gravy', isVeg: true, variants: [{ label: 'Half', price: 170 }, { label: 'Full', price: 300 }] },
  { id: 'mc_p5', name: 'Paneer Bhurji', category: 'main_course', description: 'Scrambled paneer cooked with onion & spices', isVeg: true, variants: [{ label: 'Half', price: 180 }] },
  { id: 'mc_p6', name: 'Palak Paneer', category: 'main_course', description: 'Paneer cubes in smooth spinach puree', isVeg: true, variants: [{ label: 'Half', price: 230 }] },
  { id: 'mc_p7', name: 'Paneer Do Pyaza', category: 'main_course', description: 'Paneer cooked with double onions', isVeg: true, variants: [{ label: 'Half', price: 200 }] },
  { id: 'mc_p8', name: 'Malai Paneer', category: 'main_course', description: 'Creamy soft malai paneer curry', isVeg: true, variants: [{ label: 'Half', price: 220 }] },
  { id: 'mc_p9', name: 'Paneer Kalimirch', category: 'main_course', description: 'Black pepper infused paneer gravy', isVeg: true, variants: [{ label: 'Half', price: 200 }] },
  { id: 'mc_p10', name: 'Paneer Corn Masala', category: 'main_course', description: 'Sweet corn and paneer combined gravy', isVeg: true, variants: [{ label: 'Half', price: 220 }] },
  { id: 'mc_p11', name: 'Paneer Lababdar', category: 'main_course', description: 'Creamy tomato-onion paneer gravy', isVeg: true, variants: [{ label: 'Half', price: 220 }] },
  { id: 'mc_p12', name: 'Paneer Butter Masala', category: 'main_course', description: 'Rich buttery tomato paneer curry', isVeg: true, variants: [{ label: 'Half', price: 250 }] },
  { id: 'mc_p13', name: 'Chilly Paneer with Gravy', category: 'main_course', description: 'Paneer cubes in Chinese chili gravy', isVeg: true, variants: [{ label: 'Half', price: 200 }] },
  { id: 'mc_p14', name: 'Malai Kofta', category: 'main_course', description: 'Soft paneer dumpling balls in sweet cream gravy', isVeg: true, variants: [{ label: 'Half', price: 250 }] },
  { id: 'mc_p15', name: 'Mix Veg', category: 'main_course', description: 'Assorted seasonal vegetables curry', isVeg: true, variants: [{ label: 'Half', price: 160 }] },
  { id: 'mc_p16', name: 'Jeera Aloo', category: 'main_course', description: 'Cumin tempered potato dry dish', isVeg: true, variants: [{ label: 'Half', price: 120 }] },
  { id: 'mc_d1', name: 'Dal Yellow', category: 'main_course', description: 'Comforting simple yellow lentil dal', isVeg: true, variants: [{ label: 'Half', price: 80 }] },
  { id: 'mc_d2', name: 'Dal Punjabi Tadka', category: 'main_course', description: 'Yellow dal tempered with garlic & ghee', isVeg: true, variants: [{ label: 'Half', price: 120 }] },
  { id: 'mc_d3', name: 'Dal Handi', category: 'main_course', description: 'Earthen pot simmered dal', isVeg: true, variants: [{ label: 'Half', price: 140 }] },
  { id: 'mc_d4', name: 'Dal Makhani (On Order)', category: 'main_course', description: 'Slow cooked black lentils with butter & cream', isVeg: true, variants: [{ label: 'Half', price: 180 }] },

  // RICE, ROTI & THALI
  { id: 'rr1', name: 'Plain Rice', category: 'rice_roti', description: 'Steamed basmati rice', isVeg: true, variants: [{ label: 'Portion', price: 50 }] },
  { id: 'rr2', name: 'Jeera Rice', category: 'rice_roti', description: 'Cumin tempered basmati rice', isVeg: true, variants: [{ label: 'Portion', price: 65 }] },
  { id: 'rr3', name: 'Matar Pulaw Rice', category: 'rice_roti', description: 'Green peas pulao rice', isVeg: true, variants: [{ label: 'Portion', price: 80 }] },
  { id: 'rr4', name: 'Veg Pulaw Rice', category: 'rice_roti', description: 'Mixed vegetable pulao rice', isVeg: true, variants: [{ label: 'Portion', price: 100 }] },
  { id: 'rr5', name: 'Tawa Roti', category: 'rice_roti', description: 'Fresh wheat tawa roti', isVeg: true, variants: [{ label: '1 Pc', price: 10 }] },
  { id: 'rr6', name: 'Tandoori Roti', category: 'rice_roti', description: 'Clay oven baked roti', isVeg: true, variants: [{ label: '1 Pc', price: 10 }] },
  { id: 'rr7', name: 'Ghee Roti', category: 'rice_roti', description: 'Tawa roti brushed with pure ghee', isVeg: true, variants: [{ label: '1 Pc', price: 15 }] },
  { id: 'rr8', name: 'Missi Roti', category: 'rice_roti', description: 'Gram flour seasoned tandoori roti', isVeg: true, variants: [{ label: '1 Pc', price: 25 }] },
  { id: 'rr9', name: 'Laccha Paratha', category: 'rice_roti', description: 'Multi-layered tandoori paratha', isVeg: true, variants: [{ label: '1 Pc', price: 30 }] },
  { id: 'rr10', name: 'Plain Naan', category: 'rice_roti', description: 'Refined flour tandoori naan', isVeg: true, variants: [{ label: '1 Pc', price: 30 }] },
  { id: 'rr11', name: 'Butter Naan', category: 'rice_roti', description: 'Tandoori naan topped with butter', isVeg: true, variants: [{ label: '1 Pc', price: 40 }] },
  { id: 'rr12', name: 'Swaran Thali', category: 'rice_roti', description: 'Paneer dish, Dal, Rice, 4 Roti, Salad & Sweet', isVeg: true, variants: [{ label: 'Standard', price: 180 }] },
  { id: 'rr13', name: 'Swaran Thali Special', category: 'rice_roti', description: 'Special Paneer, Dal Makhani, Pulao, Naan/Lacha, Raita, Salad & Sweet', isVeg: true, variants: [{ label: 'Special', price: 220 }] },

  // DESSERTS & ICE CREAMS
  { id: 'ds_i1', name: 'Vanilla Ice Cream', category: 'desserts', description: 'Classic vanilla cup', isVeg: true, variants: [{ label: 'Small', price: 25 }, { label: 'Large', price: 50 }] },
  { id: 'ds_i2', name: 'Strawberry Ice Cream', category: 'desserts', description: 'Fruit strawberry cup', isVeg: true, variants: [{ label: 'Small', price: 25 }, { label: 'Large', price: 50 }] },
  { id: 'ds_i3', name: 'Butterscotch Ice Cream', category: 'desserts', description: 'Crunchy butterscotch cup', isVeg: true, variants: [{ label: 'Small', price: 30 }, { label: 'Large', price: 55 }] },
  { id: 'ds_i4', name: 'Chocolate Ice Cream', category: 'desserts', description: 'Rich chocolate ice cream', isVeg: true, variants: [{ label: 'Small', price: 35 }, { label: 'Large', price: 65 }] },
  { id: 'ds_i5', name: 'Special Ice Cream', category: 'desserts', description: 'House special sundaes', isVeg: true, variants: [{ label: 'Small', price: 45 }, { label: 'Large', price: 80 }] },

  // CAKES & PASTRIES (ON ORDER)
  { id: 'ck1', name: 'Pineapple Cake', category: 'cakes', description: 'Fresh pineapple sponge cake', isVeg: true, variants: [{ label: '1 Pound', price: 200 }] },
  { id: 'ck2', name: 'Black Forest Cake', category: 'cakes', description: 'Classic chocolate black forest cake', isVeg: true, variants: [{ label: '1 Pound', price: 300 }] },
  { id: 'ck3', name: 'Rasmalai Cake', category: 'cakes', description: 'Indian Rasmalai flavoured fusion cake', isVeg: true, variants: [{ label: '1 Pound', price: 400 }] },
  { id: 'ck4', name: 'Butterscotch Cake', category: 'cakes', description: 'Crunchy caramel butterscotch cake', isVeg: true, variants: [{ label: '1 Pound', price: 210 }] },
  { id: 'ck5', name: 'Truffle Cake', category: 'cakes', description: 'Pure dark chocolate ganache truffle cake', isVeg: true, variants: [{ label: '1 Pound', price: 330 }] }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // AUTHENTICATION & USER STATE
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [authError, setAuthError] = useState('');

  // FIRESTORE REALTIME ORDERS STATE
  const [orders, setOrders] = useState([]);

  // Customer Delivery Info State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    orderType: 'delivery',
    notes: ''
  });

  // Track size/variant selections per item
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const initial = {};
    MENU_ITEMS.forEach(item => {
      initial[item.id] = item.variants[0];
    });
    return initial;
  });

  // INITIALIZE FIREBASE AUTH
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        setCustomerInfo(prev => ({ ...prev, name: currentUser.displayName }));
      }
    });
    return () => unsubscribe();
  }, []);

  // SUBSCRIBE TO FIRESTORE REAL-TIME ORDERS
  useEffect(() => {
    if (!user) return;

    // Public collection path according to Firebase guidelines
    const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    
    const unsubscribeOrders = onSnapshot(
      ordersColRef,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        // Sort by timestamp descending in JS (Rule 2: No complex queries in Firestore)
        fetchedOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(fetchedOrders);
      },
      (error) => {
        console.error("Firestore Orders listener error:", error);
      }
    );

    return () => unsubscribeOrders();
  }, [user]);

  // Handle Authentication Submit (Simulated Profile Auth Layer)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      if (!authForm.name || !authForm.email || !authForm.phone) {
        setAuthError('Please fill in all required fields.');
        return;
      }
      // Save local user profile details
      const userProfile = {
        uid: user?.uid || 'user-' + Date.now(),
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone,
        isLoggedIn: true
      };
      localStorage.setItem('sfp_user_profile', JSON.stringify(userProfile));
      setUser(prev => ({ ...prev, displayName: authForm.name, email: authForm.email, phone: authForm.phone }));
      setCustomerInfo(prev => ({ ...prev, name: authForm.name, phone: authForm.phone }));
    } else {
      // Login mode
      if (!authForm.email || !authForm.password) {
        setAuthError('Please enter valid credentials.');
        return;
      }
      const existing = localStorage.getItem('sfp_user_profile');
      if (existing) {
        const parsed = JSON.parse(existing);
        setCustomerInfo(prev => ({ ...prev, name: parsed.name || '', phone: parsed.phone || '' }));
      }
    }

    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('sfp_user_profile');
    try {
      await signOut(auth);
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Logout err", e);
    }
  };

  // Update Status in Admin Kitchen View
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await updateDoc(orderDocRef, {
        status: newStatus
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle Variant Selection
  const handleVariantChange = (itemId, variant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [itemId]: variant
    }));
  };

  // Add Item to Cart
  const addToCart = (item) => {
    const chosenVariant = selectedVariants[item.id] || item.variants[0];
    const cartItemId = `${item.id}-${chosenVariant.label}`;

    setCart(prevCart => {
      const existing = prevCart.find(ci => ci.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map(ci =>
          ci.cartItemId === cartItemId
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [
        ...prevCart,
        {
          cartItemId,
          id: item.id,
          name: item.name,
          variantLabel: chosenVariant.label,
          price: chosenVariant.price,
          quantity: 1,
          isVeg: item.isVeg
        }
      ];
    });
  };

  // Update Cart Quantity
  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Subtotal Calculation
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Filtered Menu Items
  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Save to Firebase & WhatsApp Order Submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderData = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      orderType: customerInfo.orderType,
      address: customerInfo.orderType === 'delivery' ? customerInfo.address : 'N/A (Takeaway)',
      notes: customerInfo.notes || '',
      items: cart,
      totalAmount: cartSubtotal,
      status: 'Pending',
      createdAt: Date.now(),
      userId: user?.uid || 'guest'
    };

    // 1. SAVE ORDER TO FIREBASE FIRESTORE
    try {
      const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
      await addDoc(ordersColRef, orderData);
    } catch (err) {
      console.error("Firestore Save Error:", err);
    }

    // 2. WHATSAPP NOTIFICATION
    let message = `*NEW ORDER - SWARAN FOOD PLAZA*\n`;
    message += `------------------------------------\n`;
    message += `*Customer:* ${customerInfo.name}\n`;
    message += `*Phone:* ${customerInfo.phone}\n`;
    message += `*Order Type:* ${customerInfo.orderType.toUpperCase()}\n`;
    if (customerInfo.orderType === 'delivery') {
      message += `*Address:* ${customerInfo.address}\n`;
    }
    if (customerInfo.notes) {
      message += `*Notes:* ${customerInfo.notes}\n`;
    }
    message += `------------------------------------\n`;
    message += `*ORDER ITEMS:*\n`;

    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.variantLabel}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    message += `------------------------------------\n`;
    message += `*Total Amount:* ₹${cartSubtotal}\n`;
    message += `------------------------------------\n`;
    message += `Pure Food. Pure Comfort. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918604933003?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 md:pb-12">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-30 bg-[#000080] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo and Brand Name */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center p-1 shadow-inner shrink-0">
                <div className="w-full h-full rounded-full border-2 border-red-600 bg-red-50 flex items-center justify-center text-red-600 font-black text-sm">
                  SFP
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white leading-tight">
                  SWARAN FOOD PLAZA
                </h1>
                <p className="text-xs text-sky-200 font-medium">Pure Food. Pure Comfort</p>
              </div>
            </div>

            {/* Actions: Admin Dashboard Toggle, Auth, Cart Button */}
            <div className="flex items-center gap-2">
              
              {/* Kitchen Dashboard Mode Toggle Button */}
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isAdminView 
                    ? 'bg-amber-400 text-slate-900 shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span className="hidden sm:inline">{isAdminView ? 'Customer Menu' : 'Kitchen Dashboard'}</span>
              </button>

              {/* Login/User Button */}
              {user && (user.displayName || user.email) ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 text-xs bg-blue-900/60 hover:bg-blue-900 px-3 py-1.5 rounded-xl border border-white/20 text-sky-200"
                >
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-semibold max-w-[80px] truncate">
                    {typeof user.displayName === 'string' ? user.displayName : (typeof user.email === 'string' ? user.email.split('@')[0] : 'User')}
                  </span>
                  <LogOut className="w-3.5 h-3.5 ml-1 text-red-400" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Cart ({String(totalItemCount)})</span>
                <span className="bg-red-900/50 px-2 py-0.5 rounded text-xs text-yellow-300 font-mono">
                  ₹{String(cartSubtotal)}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ADMIN KITCHEN DASHBOARD VIEW */}
      {isAdminView ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-[#000080]" />
                <h2 className="text-xl font-extrabold text-slate-800">Live Kitchen Orders Dashboard</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Real-time incoming customer orders synced via Firebase Firestore</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-[#000080] text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200">
                Total Orders: {String(orders.length)}
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Clock3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-bold">No active orders right now</p>
              <p className="text-slate-400 text-xs">New orders placed by customers will appear here automatically in real time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((ord) => {
                const customerNameStr = typeof ord.customerName === 'string' ? ord.customerName : 'Guest Customer';
                const customerPhoneStr = typeof ord.customerPhone === 'string' ? ord.customerPhone : '';
                const orderTypeStr = typeof ord.orderType === 'string' ? ord.orderType.toUpperCase() : 'DELIVERY';
                const addressStr = typeof ord.address === 'string' ? ord.address : '';
                const notesStr = typeof ord.notes === 'string' ? ord.notes : '';
                const statusStr = typeof ord.status === 'string' ? ord.status : 'Pending';

                return (
                  <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{customerNameStr}</h4>
                          <p className="text-xs text-slate-500">{customerPhoneStr}</p>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          statusStr === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          statusStr === 'Preparing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          statusStr === 'Out for Delivery' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                          'bg-green-100 text-green-800 border border-green-300'
                        }`}>
                          {statusStr}
                        </span>
                      </div>

                      <div className="py-3 text-xs space-y-1 text-slate-600">
                        <p><span className="font-semibold text-slate-800">Type:</span> {orderTypeStr}</p>
                        <p><span className="font-semibold text-slate-800">Address:</span> {addressStr}</p>
                        {notesStr ? <p><span className="font-semibold text-slate-800">Notes:</span> {notesStr}</p> : null}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 my-2">
                        <p className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">Ordered Items:</p>
                        {Array.isArray(ord.items) && ord.items.map((it, idx) => {
                          const itemName = typeof it.name === 'string' ? it.name : 'Item';
                          const itemVariant = typeof it.variantLabel === 'string' ? it.variantLabel : '';
                          const itemQty = Number(it.quantity) || 1;
                          const itemPrice = Number(it.price) || 0;
                          return (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{itemName} ({itemVariant}) x {itemQty}</span>
                              <span className="font-bold">₹{itemPrice * itemQty}</span>
                            </div>
                          );
                        })}
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-xs text-slate-900">
                          <span>Total:</span>
                          <span>₹{String(ord.totalAmount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 px-2 rounded-lg border border-blue-200"
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Out for Delivery')}
                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold py-1.5 px-2 rounded-lg border border-purple-200"
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold py-1.5 px-2 rounded-lg border border-green-200"
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* HERO BANNER */}
          <section className="bg-gradient-to-b from-[#0047AB] to-[#000080] text-white py-8 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block bg-yellow-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Serving Happiness Since 6+ Years
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Delicious Food Delivered Fresh
                </h2>
                <p className="text-sky-100 text-sm max-w-xl">
                  Explore our wide variety of Pizzas, Burgers, Momos, Pasta, South Indian Dosa, and Rich Indian Main Course dishes!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sky-200">Call / WhatsApp</p>
                    <p className="font-bold text-sm">8604933003</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sky-200">Location</p>
                    <p className="font-bold">Powayan Rd, Banda (Shahjahanpur)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEARCH AND CATEGORY NAVIGATION */}
          <div className="sticky top-[68px] z-20 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search dishes (Pizza, Dosa, Paneer, Momos...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Horizontal Scrollable Categories */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-[#0047AB] text-white shadow-md shadow-blue-500/20 scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN CONTENT AREA - MENU GRID */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {MENU_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Menu Items'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredMenu.length} items
              </span>
            </div>

            {filteredMenu.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-slate-600 font-bold">No dishes found</h4>
                <p className="text-slate-400 text-sm mt-1">Try searching for something else or change category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.map(item => {
                  const currentVariantObj = selectedVariants[item.id] || (item.variants && item.variants[0]) || { label: 'Regular', price: 0 };
                  const variantLabel = typeof currentVariantObj === 'object' && currentVariantObj !== null && 'label' in currentVariantObj
                    ? String(currentVariantObj.label)
                    : 'Regular';
                  const variantPrice = typeof currentVariantObj === 'object' && currentVariantObj !== null && 'price' in currentVariantObj
                    ? Number(currentVariantObj.price)
                    : 0;
                  const itemName = typeof item.name === 'string' ? item.name : 'Dish';
                  const itemDesc = typeof item.description === 'string' ? item.description : '';

                  return (
                    <div 
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Veg Icon & Name Header */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            {/* Pure Veg Badge */}
                            <div className="w-4 h-4 border border-green-600 p-0.5 flex items-center justify-center shrink-0">
                              <div className="w-2 h-2 rounded-full bg-green-600"></div>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base leading-snug">{itemName}</h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          {itemDesc}
                        </p>
                      </div>

                      {/* Pricing and Action Section */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        
                        {/* Portion / Size Selector */}
                        {Array.isArray(item.variants) && item.variants.length > 1 ? (
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {item.variants.map((v, idx) => {
                              const labelStr = typeof v === 'object' && v !== null && 'label' in v ? String(v.label) : String(v || '');
                              const priceNum = typeof v === 'object' && v !== null && 'price' in v ? Number(v.price) : Number(v || 0);
                              const isSelected = variantLabel === labelStr;

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleVariantChange(item.id, v)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                    isSelected
                                      ? 'bg-blue-50 border-[#0047AB] text-[#0047AB]'
                                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {labelStr} - ₹{priceNum}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-slate-500">
                            Portion: <span className="text-slate-700">{variantLabel}</span>
                          </div>
                        )}

                        {/* Price and Add Button */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div>
                            <span className="text-xs text-slate-400 block">Price</span>
                            <span className="text-lg font-black text-slate-900">
                              ₹{variantPrice}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD TO CART</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}

      {/* FLOATING MOBILE CART BUTTON BAR */}
      {!isAdminView && totalItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#000080] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-blue-400/30"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow">
                {String(totalItemCount)}
              </div>
              <div className="text-left">
                <p className="text-xs text-sky-200 font-medium">Items in Cart</p>
                <p className="font-extrabold text-base">Total: ₹{String(cartSubtotal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-red-600 px-4 py-2 rounded-xl font-bold text-xs shadow">
              <span>View Order</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* CART DRAWER SLIDE-OVER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 bg-[#000080] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-base">Your Order Cart</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-3 stroke-1 text-slate-300" />
                  <p className="font-semibold text-slate-600">Your cart is empty</p>
                  <p className="text-xs mt-1">Add items from the menu to start ordering</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 border border-green-600 p-0.5 inline-flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm">{item.name}</h5>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.variantLabel} • ₹{item.price} each
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 shadow-sm"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="w-5 text-center text-xs font-extrabold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between font-bold text-slate-800 text-sm pt-1 border-t">
                    <span>Total Amount:</span>
                    <span className="text-[#000080] font-black text-base">₹{cartSubtotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Proceed to Checkout <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CHECKOUT & DELIVERY DETAILS MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#000080] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Complete Your Order</h3>
                <p className="text-xs text-sky-200">Swaran Food Plaza Real-time Checkout</p>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Order Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, orderType: 'delivery' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      customerInfo.orderType === 'delivery'
                        ? 'bg-blue-50 border-[#0047AB] text-[#0047AB]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Home Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, orderType: 'takeaway' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      customerInfo.orderType === 'takeaway'
                        ? 'bg-blue-50 border-[#0047AB] text-[#0047AB]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Takeaway / Dine-in
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0047AB] outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number *</label>
                <input 
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0047AB] outline-none"
                />
              </div>

              {/* Address (If delivery) */}
              {customerInfo.orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Delivery Address *</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="House No., Street, Landmark, Area..."
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0047AB] outline-none"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Special Instructions (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Less spicy, extra sauce..."
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0047AB] outline-none"
                />
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Items Total ({totalItemCount} items):</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <p className="text-[11px] text-slate-400">Order will be saved to Cloud & sent via WhatsApp.</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                Send & Place Order
              </button>

            </form>

          </div>
        </div>
      )}

      {/* USER LOGIN / SIGNUP AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#000080] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {authMode === 'login' ? 'User Login' : 'Create Account'}
              </h3>
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-5 space-y-4">
              {authError && (
                <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
                  {authError}
                </div>
              )}

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="John Doe"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0047AB]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0047AB]"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0047AB]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0047AB]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#000080] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl shadow text-xs transition-all"
              >
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthError('');
                  }}
                  className="text-xs text-[#0047AB] font-semibold hover:underline"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="text-white font-bold text-sm mb-1">SWARAN FOOD PLAZA</h4>
            <p>Pure Food. Pure Comfort.</p>
            <p className="mt-1 text-slate-500">Powayan Road, Banda, Distt- Shahjahanpur 242042</p>
          </div>
          <div className="text-slate-400">
            <p>Direct Phone / WhatsApp: <span className="text-white font-bold">8604933003</span></p>
            <p className="text-slate-500 text-[11px] mt-1">© Swaran Food Plaza. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}