module.exports = {
  type: 'sqlite',
  database: 'db/sql',
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
  entities: ['src/api/v1/**/entities/*{.ts,.js}'],
};
