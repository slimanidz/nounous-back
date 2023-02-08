export const up = async (knex) => {
  // await knex.schema.alterTable("nounous", (table) => {
  //   table.binary("image").notNullable().default("null");
  // });
  await knex.schema.alterTable("services", (table) => {
    table.text("service1");
    table.text("service2");
    table.text("service3");
    table.text("service4");
    table.text("service5");
    table.text("service6");
    table.text("service7");
    table.text("service8");
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable("services", (table) => {
    table.dropColumn("service1");
    table.dropColumn("service2");
    table.dropColumn("service3");
    table.dropColumn("service4");
    table.dropColumn("service5");
    table.dropColumn("service6");
    table.dropColumn("service7");
    table.dropColumn("service8");
  });
};
