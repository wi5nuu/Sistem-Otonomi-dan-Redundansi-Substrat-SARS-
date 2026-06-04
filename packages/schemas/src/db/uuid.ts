import { uuid } from 'drizzle-orm/pg-core';

/**
 * UUID Strategy Note
 *
 * Current state: All tables use `uuid(...).defaultRandom().primaryKey()`, which
 * generates UUID v4 (random) values. For ordered, indexable UUIDs (v7), Drizzle
 * does not provide native `defaultGenerated` support yet.
 *
 * Migration path to UUID v7:
 *
 * 1. Install `uuidv7` package: `npm install uuidv7`
 * 2. Create a custom Drizzle column type:
 *
 *    import { uuid as uuidCol } from 'drizzle-orm/pg-core';
 *    import { uuidv7 } from 'uuidv7';
 *
 *    export const uuidv7 = uuid('id')
 *      .$defaultFn(() => uuidv7())
 *      .primaryKey();
 *
 * 3. Replace every `uuid('id').defaultRandom().primaryKey()` with `uuidv7()`
 *    from your custom type.
 *
 * 4. For existing tables, generate a migration:
 *    - Add the column as nullable first
 *    - Backfill with uuidv7 values
 *    - Set NOT NULL and PRIMARY KEY
 *
 * Until the migration is performed, UUID v4 is acceptable for development.
 */
export { uuid };
