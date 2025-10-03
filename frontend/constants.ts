import { ServiceItem, Category } from './types';

export const WHATSAPP_NUMBER = '9981666060';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'decor-1',
    category: Category.DECOR,
    title: 'Elegant Wedding Decor',
    shortDescription: 'Transform your wedding venue into a fairytale setting.',
    longDescription: 'Our Elegant Wedding Decor package offers a complete solution for your special day. We provide breathtaking floral arrangements, ambient lighting, luxurious drapery, and customized stage setups. Our team works closely with you to bring your vision to life, ensuring every detail is perfect.',
    price: 50000,
    images: [
      'https://picsum.photos/id/1018/800/600',
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/103/800/600',
      'https://picsum.photos/id/1041/800/600',
    ],
    inclusions: ['Stage Backdrop', 'Entrance Arch', 'Table Centerpieces', 'Mandap Decoration', 'Ambient Lighting'],
  },
  {
    id: 'gift-1',
    category: Category.GIFTS,
    title: 'Chai Addict Hamper',
    shortDescription: 'A perfect gift for any tea lover in your life.',
    longDescription: 'Don\'t know what to gift a Chai Lover? Here\'s the perfect gift that you should go for! Check out this fulfilling hamper that you can give to your mom, sister, mother-in-law or any chai lover close to you! Chai lovers will surely love this hamper that offers amazing little gifts!',
    price: 1699,
    images: [
      'https://picsum.photos/id/225/800/600',
      'https://picsum.photos/id/305/800/600',
      'https://picsum.photos/id/326/800/600',
      'https://picsum.photos/id/367/800/600',
    ],
    inclusions: ['1 Black Box', '1 Kadak Chai Tea Box', '2 Kullad', '1 Makhana Packet', '1 Frame', '1 Wish Note'],
    recommendedAddons: [
      { id: 'addon-1', title: 'Ferrero Rocher Box', description: 'Pack of 4 delicious chocolates.', price: 200, image: 'https://picsum.photos/id/431/200/200' },
      { id: 'addon-2', title: 'Artisan Cookies', description: 'Handmade gourmet cookies.', price: 350, image: 'https://picsum.photos/id/319/200/200' },
    ],
  },
  {
    id: 'food-1',
    category: Category.FOOD,
    title: 'Gourmet Sweets Box',
    shortDescription: 'A curated selection of premium traditional sweets.',
    longDescription: 'Celebrate any occasion with our Gourmet Sweets Box. Featuring a delightful assortment of handcrafted sweets made from the finest ingredients. Perfect for festivals, celebrations, or as a corporate gift. Each box is a journey through rich Indian flavors.',
    price: 2500,
    images: [
      'https://picsum.photos/id/435/800/600',
      'https://picsum.photos/id/436/800/600',
      'https://picsum.photos/id/440/800/600',
      'https://picsum.photos/id/441/800/600',
    ],
    inclusions: ['Kaju Katli (250g)', 'Pista Barfi (250g)', 'Motichoor Ladoo (250g)', 'Besan Ladoo (250g)', 'Decorative Box'],
  },
  {
    id: 'decor-2',
    category: Category.DECOR,
    title: 'Birthday Bash Setup',
    shortDescription: 'A vibrant and fun decoration setup for all ages.',
    longDescription: 'Make birthdays unforgettable with our Birthday Bash Setup. We provide colorful balloon arches, themed backdrops, party props, and dynamic lighting to create a festive atmosphere. Suitable for kids\' parties, sweet sixteens, or milestone birthdays.',
    price: 15000,
    images: [
      'https://picsum.photos/id/119/800/600',
      'https://picsum.photos/id/12/800/600',
      'https://picsum.photos/id/134/800/600',
      'https://picsum.photos/id/163/800/600',
    ],
    inclusions: ['Balloon Arch', 'Themed Backdrop', 'Cake Table Decor', 'Party Props', 'Happy Birthday Neon Sign'],
  },
  {
    id: 'gift-2',
    category: Category.GIFTS,
    title: 'Spa Hamper For Her',
    shortDescription: 'A relaxing and rejuvenating spa experience at home.',
    longDescription: 'Pamper her with our luxurious Spa Hamper. This thoughtfully curated box includes everything she needs for a blissful self-care session. It\'s the perfect gift for birthdays, anniversaries, or just to show you care.',
    price: 1849,
    images: [
      'https://picsum.photos/id/102/800/600',
      'https://picsum.photos/id/211/800/600',
      'https://picsum.photos/id/219/800/600',
      'https://picsum.photos/id/275/800/600',
    ],
    inclusions: ['Aromatic Bath Salts', 'Scented Candle', 'Essential Oil Diffuser', 'Plush Towel', 'Herbal Tea Sachets', 'Face Mask'],
  },
  {
    id: 'food-2',
    category: Category.FOOD,
    title: 'Artisanal Chocolate Collection',
    shortDescription: 'An exquisite collection of handcrafted chocolates.',
    longDescription: 'Indulge the senses with our Artisanal Chocolate Collection. This box features a variety of unique flavors, from rich dark chocolate to creamy milk chocolate with surprising fillings. Each piece is a work of art, perfect for the discerning chocolate lover.',
    price: 1200,
    images: [
      'https://picsum.photos/id/342/800/600',
      'https://picsum.photos/id/478/800/600',
      'https://picsum.photos/id/488/800/600',
      'https://picsum.photos/id/490/800/600',
    ],
    inclusions: ['Dark Chocolate with Sea Salt', 'Milk Chocolate with Hazelnut', 'White Chocolate with Raspberry', 'Caramel Filled Bonbons', 'Elegant Gift Box'],
  }
];