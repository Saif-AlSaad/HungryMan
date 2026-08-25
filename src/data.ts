export type Category =
  | "all"
  | "pizza"
  | "burgers"
  | "pasta"
  | "starters"
  | "drinks"
  | "desserts";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "all">;
  image: string;
  badge?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  sizes?: { label: string; price: number }[];
};

export type LocationBranch = {
  id: string;
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  mapNote: string;
};

export const PHONE = "01797592975";
export const PHONE_DISPLAY = "01797-592975";
export const EMAIL = "saifalsaad2002@gmail.com";
export const FACEBOOK = "https://facebook.com/hungryman";
export const INSTAGRAM = "https://instagram.com/hungryman";

export const locations: LocationBranch[] = [
  {
    id: "niribili",
    name: "Nabinagar, Niribili",
    area: "Flagship Kitchen",
    address: "HungryMan, Nabinagar, Niribili",
    hours: "Daily 11:00 AM – 11:30 PM",
    phone: PHONE_DISPLAY,
    mapNote: "Our original dining room — wood-fired oven, full dine-in, and order-ahead.",
  },
  {
    id: "savar",
    name: "Savar, Thanaroad",
    area: "Savar Kitchen",
    address: "Beside Chakladar Mohila College, Savar",
    hours: "Daily 11:00 AM – 11:00 PM",
    phone: PHONE_DISPLAY,
    mapNote: "A second kitchen built for Savar — same dough, same fire, faster pickup.",
  },
];

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pizza", label: "Pizza" },
  { id: "burgers", label: "Burgers" },
  { id: "pasta", label: "Pasta" },
  { id: "starters", label: "Starters" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

const img = (id: number, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const menu: MenuItem[] = [
  {
    id: "hungryman-signature",
    name: "HungryMan Signature",
    description:
      "House dough, smoked chicken, roasted peppers, mozzarella, chilli honey, and basil oil.",
    price: 749,
    category: "pizza",
    image: img(33592997),
    badge: "Chef’s pick",
    popular: true,
  },
  {
    id: "margherita",
    name: "San Marzano Margherita",
    description: "Crushed tomato, fior di latte, fresh basil, extra-virgin olive oil.",
    price: 449,
    category: "pizza",
    image: img(28945103),
    vegetarian: true,
    sizes: [
      { label: "10\"", price: 449 },
      { label: "14\"", price: 649 },
    ],
  },
  {
    id: "pepperoni",
    name: "Pepperoni Classico",
    description: "Cupped pepperoni, mozzarella, oregano, and a slow-cooked tomato base.",
    price: 549,
    category: "pizza",
    image: img(30301974),
    popular: true,
    sizes: [
      { label: "10\"", price: 549 },
      { label: "14\"", price: 799 },
    ],
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description: "Charred chicken, smoked mozzarella, red onion, coriander, house BBQ.",
    price: 599,
    category: "pizza",
    image: img(11485225),
    sizes: [
      { label: "10\"", price: 599 },
      { label: "14\"", price: 849 },
    ],
  },
  {
    id: "tandoori",
    name: "Tandoori Tikka",
    description: "Tikka-spiced chicken, yoghurt drizzle, onion, mint, and mozzarella.",
    price: 599,
    category: "pizza",
    image: img(11485215),
    spicy: true,
    sizes: [
      { label: "10\"", price: 599 },
      { label: "14\"", price: 849 },
    ],
  },
  {
    id: "forest",
    name: "Forest Mushroom",
    description: "Wild mushrooms, garlic cream, thyme, aged parmesan, rocket.",
    price: 529,
    category: "pizza",
    image: img(9471602),
    vegetarian: true,
    sizes: [
      { label: "10\"", price: 529 },
      { label: "14\"", price: 779 },
    ],
  },
  {
    id: "smash",
    name: "Double Smash",
    description: "Two smashed patties, aged cheddar, pickles, onion, HungryMan sauce, brioche.",
    price: 379,
    category: "burgers",
    image: img(35813486),
    popular: true,
  },
  {
    id: "bacon-burger",
    name: "Smokehouse Bacon",
    description: "Beef patty, smoked bacon, cheddar, caramelised onion, chipotle mayo.",
    price: 429,
    category: "burgers",
    image: img(34407498),
  },
  {
    id: "crispy-chicken",
    name: "Crispy Chicken",
    description: "Buttermilk fried chicken, slaw, pickles, honey mustard, toasted bun.",
    price: 359,
    category: "burgers",
    image: img(28792819),
  },
  {
    id: "alfredo",
    name: "Truffle Alfredo",
    description: "Fettuccine, roasted garlic cream, parmesan, cracked pepper, parsley.",
    price: 429,
    category: "pasta",
    image: img(14930758),
    vegetarian: true,
  },
  {
    id: "carbonara",
    name: "Carbonara",
    description: "Spaghetti, egg yolk, pecorino, smoked beef bacon, black pepper.",
    price: 449,
    category: "pasta",
    image: img(27977143),
  },
  {
    id: "arrabbiata",
    name: "Arrabbiata",
    description: "Tomato, chilli, garlic, olive oil, basil — bright and properly hot.",
    price: 369,
    category: "pasta",
    image: img(14930759),
    spicy: true,
    vegetarian: true,
  },
  {
    id: "wings",
    name: "Charred Wings",
    description: "Eight pieces. Choose honey-chilli, buffalo, or lemon-pepper.",
    price: 349,
    category: "starters",
    image: img(2338407),
    popular: true,
  },
  {
    id: "platter",
    name: "Share Platter",
    description: "Wings, fries, sliders, and garlic bread — built for the table.",
    price: 799,
    category: "starters",
    image: img(15910249),
    badge: "For the table",
  },
  {
    id: "fries",
    name: "Crisp Fries",
    description: "Twice-cooked, sea salt, rosemary. Add truffle parmesan +৳60.",
    price: 179,
    category: "starters",
    image: img(13161027),
    vegetarian: true,
  },
  {
    id: "garlic-bread",
    name: "Garlic Focaccia",
    description: "Wood-oven focaccia, roasted garlic butter, herbs, flaky salt.",
    price: 199,
    category: "starters",
    image: img(10813338),
    vegetarian: true,
  },
  {
    id: "mojito",
    name: "Garden Mojito",
    description: "Mint, lime, soda, crushed ice. Zero proof, full refresh.",
    price: 149,
    category: "drinks",
    image: img(24870595),
    vegetarian: true,
  },
  {
    id: "citrus",
    name: "Citrus Spritz",
    description: "Orange, grapefruit, sparkling water, rosemary.",
    price: 169,
    category: "drinks",
    image: img(29707896),
    vegetarian: true,
  },
  {
    id: "shake",
    name: "Dark Cocoa Shake",
    description: "Belgian cocoa, vanilla ice cream, whipped cream.",
    price: 189,
    category: "drinks",
    image: img(32469289),
    vegetarian: true,
  },
  {
    id: "lava",
    name: "Molten Chocolate",
    description: "Warm lava cake, vanilla ice cream, berry reduction.",
    price: 249,
    category: "desserts",
    image: img(33813614),
    popular: true,
    vegetarian: true,
  },
  {
    id: "sundae",
    name: "Brownie Sundae",
    description: "Fudge brownie, salted caramel, toasted pecan, cream.",
    price: 229,
    category: "desserts",
    image: img(9976030),
    vegetarian: true,
  },
];

export const reviews = [
  {
    name: "Ayesha Rahman",
    role: "Niribili regular",
    text: "The crust is the reason I keep coming back. Thin, blistered, and still tender. HungryMan is the first pizza in town that actually tastes considered.",
    rating: 5,
  },
  {
    name: "Farhan Ahmed",
    role: "Savar",
    text: "Ordered ahead for a family dinner. Food arrived exactly on time, still hot, and the Tandoori Tikka was properly spiced — not just coloured red.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Weekend diner",
    text: "Warm room, attentive service, and a smash burger that could stand on its own. We stayed for dessert. We will stay for dessert again.",
    rating: 5,
  },
  {
    name: "Rafiul Hasan",
    role: "Office group",
    text: "We book the long table at Niribili once a month. Consistent food, no theatre, just a kitchen that knows what it is doing.",
    rating: 4,
  },
];

export const hours = [
  { day: "Sunday – Thursday", time: "11:00 AM – 11:00 PM" },
  { day: "Friday – Saturday", time: "11:00 AM – 11:30 PM" },
];

export const timeSlots = [
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

export const formatPrice = (n: number) => `৳${n.toLocaleString("en-BD")}`;
