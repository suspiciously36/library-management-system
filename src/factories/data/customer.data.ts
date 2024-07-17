export const customerData = [
  {
    name: 'John F. Kennedy',
    email: 'jfkennedy@gmail.com',
    address: '104 Sunflower St.',
    phone: '9497820345',
    reservation_cooldown_timestamp: 0,
    reservation_limit: 4,
    is_blacklisted: false,
  },
  {
    name: 'Nakamura Mushirou',
    email: 'nakamushi@gmail.com',
    address: '9 Mt. Fuji St.',
    phone: '2274839028',
    reservation_cooldown_timestamp:
      new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
    reservation_limit: 3,
    is_blacklisted: false,
  },
  {
    name: 'Hoang Tuan Kiet',
    email: '082.hoangtuankiet@gmail.com',
    address: '195 Cau Giay',
    phone: '0868906082',
    reservation_cooldown_timestamp: new Date().getTime() + 20 * 60 * 1000,
    reservation_limit: 0,
    is_blacklisted: false,
  },
  {
    name: 'The Blacklisted One',
    email: 'blacklistedCustomer@gmail.com',
    address: '20 Blacklist St.',
    phone: '0966757557',
    reservation_cooldown_timestamp: 0,
    reservation_limit: 5,
    is_blacklisted: true,
  },
];
