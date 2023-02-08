export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.text("email").notNullable().unique();
    table.text("passwordHash").notNullable();
    table.text("passwordSalt").notNullable();
    table.text("username").notNullable();
    table.text("telephone").notNullable();
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable("nounous", (table) => {
    table.increments("id");
    table.text("email").notNullable().unique();
    table.text("passwordHash").notNullable();
    table.text("passwordSalt").notNullable();
    table.text("username").notNullable();
    table.text("telephone").notNullable();
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable("comments", (table) => {
    table.increments("id");
    table.text("content").notNullable();
    table.timestamps(true, true, true);
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("nounouId")
      .notNullable()
      .references("id")
      .inTable("nounous")
      .onDelete("CASCADE");
  });
  await knex.schema.createTable("services", (table) => {
    table.increments("id");
    table.text("service").notNullable();
    table.timestamps(true, true, true);
    table
      .integer("nounouId")
      .notNullable()
      .references("id")
      .inTable("nounous")
      .onDelete("CASCADE");
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable("services");
  await knex.schema.dropTable("comments");
  await knex.schema.dropTable("nouous");
  await knex.schema.dropTable("users");
};
