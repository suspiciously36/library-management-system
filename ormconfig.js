module.exports = {
  type: 'sqlite',
  database: 'db/sql',
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
  entities: ['src/entities/**/*{.ts,.js}'],
};
