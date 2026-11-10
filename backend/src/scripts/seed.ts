import mysql from 'mysql2/promise'
import { config } from '../config'

type SeedContact = [
  fullName: string,
  company: string,
  email: string | null,
  status: 'active' | 'inactive' | 'lead',
  createdAt: string,
]

const SEED_CONTACTS: SeedContact[] = [
  ['Иван Петров',         'ACME',      'ivan.petrov@acme.io',             'active',   '2026-01-05 10:00:00'],
  ['Анна Смирнова',       'ACME',      'anna.smirnova@acme.io',           'active',   '2026-01-12 14:30:00'],
  ['Сергей Кузнецов',     'Globex',    'sergey.kuznetsov@globex.com',     'inactive', '2026-01-20 09:15:00'],
  ['Ольга Попова',        'Initech',   'olga.popova@initech.ru',          'lead',     '2026-02-02 16:45:00'],
  ['Дмитрий Соколов',     'Umbrella',  null,                              'active',   '2026-02-10 11:00:00'],
  ['Екатерина Лебедева',  'Globex',    'ekaterina.lebedeva@globex.com',   'lead',     '2026-02-18 08:30:00'],
  ['Алексей Козлов',      'ACME',      'alexey.kozlov@acme.io',           'inactive', '2026-02-25 19:20:00'],
  ['Мария Новикова',      'Soylent',   'maria.novikova@soylent.co',       'active',   '2026-03-03 12:10:00'],
  ['Николай Морозов',     'Initech',   null,                              'lead',     '2026-03-09 15:00:00'],
  ['Татьяна Волкова',     'Umbrella',  'tatyana.volkova@umbrella.com',    'active',   '2026-03-15 10:45:00'],
  ['Павел Соловьёв',      'ACME',      'pavel.solovyov@acme.io',          'inactive', '2026-03-22 07:55:00'],
  ['Юлия Васильева',      'Hooli',     'yulia.vasilyeva@hooli.com',       'lead',     '2026-03-28 18:30:00'],
  ['Роман Зайцев',        'Soylent',   'roman.zaytsev@soylent.co',        'active',   '2026-04-04 09:20:00'],
  ['Наталья Павлова',     'Globex',    null,                              'inactive', '2026-04-10 14:00:00'],
  ['Андрей Семёнов',      'Initech',   'andrey.semenov@initech.ru',       'active',   '2026-04-17 16:15:00'],
  ['Виктория Голубева',   'ACME',      'viktoria.golubeva@acme.io',       'lead',     '2026-04-23 11:30:00'],
  ['Максим Виноградов',   'Umbrella',  'maxim.vinogradov@umbrella.com',   'active',   '2026-04-29 08:45:00'],
  ['Ирина Богданова',     'Hooli',     'irina.bogdanova@hooli.com',       'inactive', '2026-05-05 13:00:00'],
  ['Антон Воробьёв',      'Globex',    null,                              'lead',     '2026-05-11 17:20:00'],
  ['Светлана Фёдорова',   'ACME',      'svetlana.fedorova@acme.io',       'active',   '2026-05-17 10:05:00'],
  ['Игорь Михайлов',      'Initech',   'igor.mikhailov@initech.ru',       'inactive', '2026-05-22 15:40:00'],
  ['Алина Беляева',       'Soylent',   'alina.belyaeva@soylent.co',       'lead',     '2026-05-28 09:00:00'],
  ['Кирилл Тарасов',      'Umbrella',  'kirill.tarasov@umbrella.com',     'active',   '2026-06-03 14:25:00'],
  ['Дарья Белова',        'ACME',      null,                              'inactive', '2026-06-09 11:15:00'],
  ['Егор Комаров',        'Globex',    'egor.komarov@globex.com',         'lead',     '2026-06-15 16:50:00'],
  ['Полина Орлова',       'Hooli',     'polina.orlova@hooli.com',         'active',   '2026-06-20 08:30:00'],
  ['Артём Киселёв',       'Initech',   'artem.kiselev@initech.ru',        'active',   '2026-06-26 12:40:00'],
  ['Вероника Макарова',   'Soylent',   null,                              'inactive', '2026-07-02 10:20:00'],
  ['Денис Андреев',       'ACME',      'denis.andreev@acme.io',           'lead',     '2026-07-08 15:10:00'],
  ['Ксения Ковалёва',     'Umbrella',  'ksenia.kovaleva@umbrella.com',    'active',   '2026-07-14 09:35:00'],
  ['Степан Ильин',        'Globex',    'stepan.ilin@globex.com',          'inactive', '2026-07-19 17:00:00'],
  ['Маргарита Гусева',    'Hooli',     'margarita.guseva@hooli.com',      'lead',     '2026-07-25 13:25:00'],
  ['Вадим Титов',         'Initech',   null,                              'active',   '2026-07-31 08:50:00'],
  ['Людмила Кудрявцева',  'ACME',      'ludmila.kudryavtseva@acme.io',    'active',   '2026-08-06 11:45:00'],
  ['Григорий Баранов',    'Soylent',   'grigory.baranov@soylent.co',      'inactive', '2026-08-12 16:30:00'],
  ['Валентина Филиппова', 'Umbrella',  'valentina.filippova@umbrella.com','lead',     '2026-08-18 09:15:00'],
  ['Олег Давыдов',        'Globex',    'oleg.davydov@globex.com',         'active',   '2026-08-23 14:55:00'],
  ['Анастасия Романова',  'ACME',      null,                              'inactive', '2026-08-29 10:00:00'],
  ['Владислав Захаров',   'Hooli',     'vladislav.zakharov@hooli.com',    'lead',     '2026-09-04 15:20:00'],
  ['Елизавета Сорокина',  'Initech',   'elizaveta.sorokina@initech.ru',   'active',   '2026-09-10 08:40:00'],
  ['Фёдор Мельников',     'Soylent',   'fedor.melnikov@soylent.co',       'active',   '2026-09-16 12:05:00'],
  ['Софья Щербакова',     'Umbrella',  null,                              'inactive', '2026-09-22 17:30:00'],
  ['Борис Никитин',       'ACME',      'boris.nikitin@acme.io',           'lead',     '2026-09-28 10:15:00'],
  ['Алёна Егорова',       'Globex',    'alena.egorova@globex.com',        'active',   '2026-10-04 13:45:00'],
  ['Матвей Григорьев',    'Hooli',     'matvey.grigoriev@hooli.com',      'inactive', '2026-10-10 09:25:00'],
  ['Ульяна Степанова',    'Initech',   null,                              'lead',     '2026-10-16 16:10:00'],
  ['Ярослав Николаев',    'ACME',      'yaroslav.nikolaev@acme.io',       'active',   '2026-10-22 11:55:00'],
  ['Василиса Дмитриева',  'Soylent',   'vasilisa.dmitrieva@soylent.co',   'active',   '2026-10-28 14:20:00'],
  ['Тимур Алексеев',      'Umbrella',  null,                              'inactive', '2026-11-03 08:35:00'],
  ['Злата Громова',       'Globex',    'zlata.gromova@globex.com',        'lead',     '2026-11-08 12:50:00'],
]

async function createDatabase(): Promise<void> {
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
  })

  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    console.log(`[seed] database "${config.db.database}" is ready`)
  } finally {
    await conn.end()
  }
}

async function createTable(): Promise<void> {
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  })

  try {
    await conn.query("SET time_zone = '+00:00'")

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        full_name   VARCHAR(255) NOT NULL,
        company     VARCHAR(255) NOT NULL,
        email       VARCHAR(255) NULL,
        status      ENUM('active', 'inactive', 'lead') NOT NULL DEFAULT 'lead',
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_contacts_status     (status),
        INDEX idx_contacts_created_at (created_at),
        INDEX idx_contacts_full_name  (full_name)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `)
    console.log('[seed] table "contacts" is ready')
  } finally {
    await conn.end()
  }
}

async function seedContacts(): Promise<void> {
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  })

  try {
    await conn.query("SET time_zone = '+00:00'")

    await conn.query('TRUNCATE TABLE contacts')

    await conn.query(
      `INSERT INTO contacts (full_name, company, email, status, created_at) VALUES ?`,
      [SEED_CONTACTS],
    )

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM contacts',
    )
    console.log(`[seed] inserted ${rows[0].total} contacts`)
  } finally {
    await conn.end()
  }
}

async function main(): Promise<void> {
  const started = Date.now()
  try {
    await createDatabase()
    await createTable()
    await seedContacts()
    console.log(`[seed] done in ${Date.now() - started}ms`)
  } catch (err) {
    console.error('[seed] failed:', err)
    process.exit(1)
  }
}

void main()