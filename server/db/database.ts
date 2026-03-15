import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'nitro.db');
let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  const database = db;

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'business')),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT,
      photo_url TEXT,
      fixed_price REAL,
      status TEXT NOT NULL DEFAULT 'approved' CHECK(status IN ('pending','approved','rejected'))
    );

    CREATE TABLE IF NOT EXISTS signup_requests (
      id TEXT PRIMARY KEY,
      business_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      description TEXT,
      website TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      pickup_location TEXT NOT NULL,
      pickup_lat REAL,
      pickup_lng REAL,
      no_destination INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending','confirmed','in_progress','delivered','denied')),
      price REAL NOT NULL DEFAULT 0,
      notes TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS delivery_stops (
      id TEXT PRIMARY KEY,
      delivery_id TEXT NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      address TEXT NOT NULL,
      lat REAL,
      lng REAL,
      client_name TEXT,
      client_phone TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','delivered','failed'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Migrations: add new columns if they don't exist yet
  try { database.exec("ALTER TABLE signup_requests ADD COLUMN address TEXT"); } catch {}
  try { database.exec("ALTER TABLE signup_requests ADD COLUMN description TEXT"); } catch {}
  try { database.exec("ALTER TABLE signup_requests ADD COLUMN website TEXT"); } catch {}
  try { database.exec("ALTER TABLE signup_requests ADD COLUMN password TEXT"); } catch {}
  try { database.exec("ALTER TABLE deliveries ADD COLUMN package_price REAL"); } catch {}
  try { database.exec("ALTER TABLE deliveries ADD COLUMN pickup_lat REAL"); } catch {}
  try { database.exec("ALTER TABLE deliveries ADD COLUMN pickup_lng REAL"); } catch {}
  try { database.exec("ALTER TABLE deliveries ADD COLUMN notes TEXT"); } catch {}
  try { database.exec("ALTER TABLE deliveries ADD COLUMN updated_at INTEGER NOT NULL DEFAULT (unixepoch())"); } catch {}

  // Indexes for real data performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_deliveries_business_id ON deliveries(business_id);
    CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
    CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_delivery_stops_delivery_id ON delivery_stops(delivery_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
    CREATE INDEX IF NOT EXISTS idx_signup_requests_created_at ON signup_requests(created_at DESC);
  `);

  // Seed settings
  const nightTariff = database.prepare("SELECT value FROM settings WHERE key = 'night_tariff_enabled'").get();
  if (!nightTariff) database.prepare("INSERT INTO settings (key, value) VALUES ('night_tariff_enabled', 'false')").run();

  // Seed admin (demo credentials: see README)
  const adminExists = database.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    database.prepare("INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, 'admin')").run('admin-001', 'admin@nitro.dz', hashedPassword);
    console.log('✅ Default admin: admin@nitro.dz / admin123');
  }

  // Seed demo business (demo credentials: see README)
  const bizExists = database.prepare("SELECT id FROM users WHERE email = 'partner@nitro.dz' LIMIT 1").get();
  if (!bizExists) {
    const userId = 'user-001';
    const bizId = 'biz-001';
    const hashedPassword = bcrypt.hashSync('business123', 10);
    database.prepare("INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, 'business')").run(userId, 'partner@nitro.dz', hashedPassword);
    database.prepare("INSERT INTO businesses (id, user_id, name, phone, photo_url, status) VALUES (?, ?, ?, ?, ?, 'approved')").run(bizId, userId, 'Nitro Partner', '+213 770 00 00 00', 'https://picsum.photos/seed/business/200/200');

    const now = Math.floor(Date.now() / 1000);
    const sampleDeliveries = [
      { id: 'NIT-1024', client_name: 'Ahmed Benali', client_phone: '0770111222', pickup: 'Algiers Center', pickup_lat: 36.7372, pickup_lng: 3.0863, status: 'pending', price: 650, created_at: now - 7200 },
      { id: 'NIT-1023', client_name: 'Sarah Mansouri', client_phone: '0770333444', pickup: 'Hydra', pickup_lat: 36.7448, pickup_lng: 3.0422, status: 'confirmed', price: 450, created_at: now - 14400 },
      { id: 'NIT-1022', client_name: 'Mohamed Brahimi', client_phone: '0770555666', pickup: 'Cheraga', pickup_lat: 36.7658, pickup_lng: 2.9594, status: 'in_progress', price: 850, created_at: now - 86400 },
      { id: 'NIT-1021', client_name: 'Lila Kaci', client_phone: '0770777888', pickup: 'Bab Ezzouar', pickup_lat: 36.7196, pickup_lng: 3.1826, status: 'denied', price: 550, created_at: now - 90000 },
      { id: 'NIT-1020', client_name: 'Karim Said', client_phone: '0770999000', pickup: 'Bordj El Kiffan', pickup_lat: 36.7402, pickup_lng: 3.2136, status: 'delivered', price: 450, created_at: now - 1209600 },
    ];
    const insertDelivery = database.prepare("INSERT INTO deliveries (id, business_id, client_name, client_phone, pickup_location, pickup_lat, pickup_lng, no_destination, status, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)");
    const insertStop = database.prepare("INSERT INTO delivery_stops (id, delivery_id, position, address, lat, lng, client_name, client_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    const stops: Record<string, {address: string, lat: number, lng: number}[]> = {
      'NIT-1024': [{ address: 'Kouba, Algiers', lat: 36.7077, lng: 3.0974 }, { address: 'Hussein Dey, Algiers', lat: 36.7300, lng: 3.1000 }],
      'NIT-1023': [{ address: 'Ben Aknoun, Algiers', lat: 36.7618, lng: 3.0064 }],
      'NIT-1022': [{ address: 'Zeralda, Algiers', lat: 36.6879, lng: 2.8534 }],
      'NIT-1021': [{ address: 'Dar El Beida, Algiers', lat: 36.7121, lng: 3.2150 }],
      'NIT-1020': [{ address: 'Rouiba, Algiers', lat: 36.7280, lng: 3.2850 }],
    };

    for (const d of sampleDeliveries) {
      insertDelivery.run(d.id, bizId, d.client_name, d.client_phone, d.pickup, d.pickup_lat, d.pickup_lng, d.status, d.price, d.created_at, d.created_at);
      const dStops = stops[d.id] || [];
      dStops.forEach((s, i) => {
        insertStop.run(`${d.id}-stop-${i}`, d.id, i, s.address, s.lat, s.lng, d.client_name, d.client_phone);
      });
    }
    console.log('✅ Demo business: partner@nitro.dz / business123');
  }

  // Seed signup request with full details
  const reqExists = database.prepare("SELECT id FROM signup_requests LIMIT 1").get();
  if (!reqExists) {
    database.prepare("INSERT INTO signup_requests (id, business_name, email, phone, address, description, status, password) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)")
      .run('req-001', 'Batna Tech', 'contact@batnatech.dz', '0770123456', 'Rue 19 Mai 1956, Batna', 'E-commerce electronics store with 50+ daily deliveries', 'demo123');
  }
}
