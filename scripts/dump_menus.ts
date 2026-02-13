
import { query } from '../lib/mysql-direct';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    // Schema
    const schema1 = "CREATE TABLE IF NOT EXISTS menus (id varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, name varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, position varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, institutionId varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, isActive tinyint(1) NOT NULL DEFAULT '1', createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), updatedAt datetime(3) NOT NULL, PRIMARY KEY (id), KEY menus_institutionId_idx (institutionId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // Note: 'order' needs backticks in SQL but no backticks needed in JS string unless it's a template literal
    const schema2 = "CREATE TABLE IF NOT EXISTS menu_items (id varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, menuId varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, label varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, labelEn varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, url varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, parentId varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, `order` int NOT NULL DEFAULT '0', target varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '_self', createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), updatedAt datetime(3) NOT NULL, PRIMARY KEY (id), KEY menu_items_menuId_idx (menuId), KEY menu_items_parentId_idx (parentId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    let sql = schema1 + '\n' + schema2 + '\n';

    // Dump Menus
    const menus = await query<any>('SELECT * FROM menus');
    for (const r of menus) {
      sql += `INSERT INTO menus (id, name, position, institutionId, isActive, createdAt, updatedAt) VALUES ('${r.id}', '${r.name}', '${r.position}', '${r.institutionId}', ${r.isActive ? 1 : 0}, '${new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')}', '${new Date(r.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}');\n`;
    }

    // Dump Menu Items
    const items = await query<any>('SELECT * FROM menu_items');
    for (const r of items) {
      const labelEn = r.labelEn ? `'${r.labelEn}'` : 'NULL';
      const parentId = r.parentId ? `'${r.parentId}'` : 'NULL';
      const target = r.target ? `'${r.target}'` : "'_self'";
      // Using backticks for the column name `order` inside the string
      sql += `INSERT INTO menu_items (id, menuId, label, labelEn, url, parentId, \`order\`, target, createdAt, updatedAt) VALUES ('${r.id}', '${r.menuId}', '${r.label}', ${labelEn}, '${r.url}', ${parentId}, ${r.order}, ${target}, '${new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')}', '${new Date(r.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}');\n`;
    }

    fs.writeFileSync('menus_dump.sql', sql);
    console.log('Dumped menus_dump.sql');
  } catch (e) { console.error(e); }
  process.exit(0);
}
main();
