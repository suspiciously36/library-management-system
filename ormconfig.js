module.exports = {
  type: 'postgres',
  host: 'localhost', // Change if your DB is hosted elsewhere
  port: 5432, // Default PostgreSQL port
  username: 'postgres', // Replace with your PostgreSQL username
  password: 'Hiimtuankiet36',
  database: 'library_management_database',
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
  entities: ['src/entities/**/*{.ts,.js}'],
  synchronize: true, // Set to false in production
  logging: true,
};
