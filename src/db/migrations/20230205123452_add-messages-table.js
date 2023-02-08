export const up = async (knex) => {
  await knex.schema.createTable("messages", (table) => {
    table.increments("id");
    table.text("content").notNullable();
    table.timestamps(true, true, true);
    table.integer("userId").notNullable().references("id").inTable("users");
    table.integer("nounouId").notNullable().references("id").inTable("nounous");
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable("messages");
};
