#!/bin/bash
# Find local mysql credentials from .env.local usually, but assuming we can use mysqldump with user provided creds or just trust it works if local is running locally?
# Wait, user is on Mac, local DB might be running via Docker or Brew.
# Previous steps showed "DATABASE_URL" in .env.local.
# Let's extract it.

DB_URL=$(grep DATABASE_URL .env.local | cut -d '"' -f 2)
# format: mysql://root:password@host:port/dbname
# This is tricky to parse in bash robustly for mysqldump which takes flags.
# I will use a simple node script to dump specific tables or check how local DB is running.
# User runs `npm run dev` but key info: Step 279 showed lib/mysql-direct.ts using `process.env.DATABASE_URL`.

# Let's assume I can't easily run mysqldump on the host if I don't know the password/root.
# But I can access the DB via code.
# I will write a Node script to query all menus/menu_items and generate INSERT statements.
# This prevents binary dependency issues.

echo "import { query } from '../lib/mysql-direct';" > scripts/dump_menus.ts
echo "import * as fs from 'fs';" >> scripts/dump_menus.ts
echo "import * as dotenv from 'dotenv';" >> scripts/dump_menus.ts
echo "dotenv.config({ path: '.env.local' });" >> scripts/dump_menus.ts
echo "" >> scripts/dump_menus.ts
echo "async function main() {" >> scripts/dump_menus.ts
echo "  try {" >> scripts/dump_menus.ts
echo "    // Create tables if not exist (Schema)" >> scripts/dump_menus.ts
echo "    const schema1 = \`CREATE TABLE IF NOT EXISTS menus (" >> scripts/dump_menus.ts
echo "      id varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      name varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      position varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      institutionId varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      isActive tinyint(1) NOT NULL DEFAULT '1'," >> scripts/dump_menus.ts
echo "      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)," >> scripts/dump_menus.ts
echo "      updatedAt datetime(3) NOT NULL," >> scripts/dump_menus.ts
echo "      PRIMARY KEY (id)," >> scripts/dump_menus.ts
echo "      KEY menus_institutionId_idx (institutionId)" >> scripts/dump_menus.ts
echo "    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`;" >> scripts/dump_menus.ts
echo "    " >> scripts/dump_menus.ts
echo "    const schema2 = \`CREATE TABLE IF NOT EXISTS menu_items (" >> scripts/dump_menus.ts
echo "      id varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      menuId varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      label varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      labelEn varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL," >> scripts/dump_menus.ts
echo "      url varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL," >> scripts/dump_menus.ts
echo "      parentId varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL," >> scripts/dump_menus.ts
echo "      \`order\` int NOT NULL DEFAULT '0'," >> scripts/dump_menus.ts
echo "      target varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '_self'," >> scripts/dump_menus.ts
echo "      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)," >> scripts/dump_menus.ts
echo "      updatedAt datetime(3) NOT NULL," >> scripts/dump_menus.ts
echo "      PRIMARY KEY (id)," >> scripts/dump_menus.ts
echo "      KEY menu_items_menuId_idx (menuId)," >> scripts/dump_menus.ts
echo "      KEY menu_items_parentId_idx (parentId)" >> scripts/dump_menus.ts
echo "    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`;" >> scripts/dump_menus.ts
echo "" >> scripts/dump_menus.ts
echo "    let sql = schema1 + '\\n' + schema2 + '\\n';" >> scripts/dump_menus.ts
echo "" >> scripts/dump_menus.ts
echo "    // Dump Menus" >> scripts/dump_menus.ts
echo "    const menus = await query('SELECT * FROM menus');" >> scripts/dump_menus.ts
echo "    for (const r of menus) {" >> scripts/dump_menus.ts
echo "      sql += \`INSERT INTO menus (id, name, position, institutionId, isActive, createdAt, updatedAt) VALUES ('\${r.id}', '\${r.name}', '\${r.position}', '\${r.institutionId}', \${r.isActive?1:0}, '\${new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')}', '\${new Date(r.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}');\\n\`;" >> scripts/dump_menus.ts
echo "    }" >> scripts/dump_menus.ts
echo "" >> scripts/dump_menus.ts
echo "    // Dump Menu Items" >> scripts/dump_menus.ts
echo "    const items = await query('SELECT * FROM menu_items');" >> scripts/dump_menus.ts
echo "    for (const r of items) {" >> scripts/dump_menus.ts
echo "       const labelEn = r.labelEn ? \`'\${r.labelEn}'\` : 'NULL';" >> scripts/dump_menus.ts
echo "       const parentId = r.parentId ? \`'\${r.parentId}'\` : 'NULL';" >> scripts/dump_menus.ts
echo "       const target = r.target ? \`'\${r.target}'\` : \"'_self'\";" >> scripts/dump_menus.ts
echo "      sql += \`INSERT INTO menu_items (id, menuId, label, labelEn, url, parentId, \`order\`, target, createdAt, updatedAt) VALUES ('\${r.id}', '\${r.menuId}', '\${r.label}', \${labelEn}, '\${r.url}', \${parentId}, \${r.order}, \${target}, '\${new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')}', '\${new Date(r.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}');\\n\`;" >> scripts/dump_menus.ts
echo "    }" >> scripts/dump_menus.ts
echo "" >> scripts/dump_menus.ts
echo "    fs.writeFileSync('menus_dump.sql', sql);" >> scripts/dump_menus.ts
echo "    console.log('Dumped menus_dump.sql');" >> scripts/dump_menus.ts
echo "  } catch (e) { console.error(e); }" >> scripts/dump_menus.ts
echo "  process.exit(0);" >> scripts/dump_menus.ts
echo "}" >> scripts/dump_menus.ts
echo "main();" >> scripts/dump_menus.ts
