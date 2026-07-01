INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User2', 'admin2@example.com', 'restaurant', 'ADMIN'),
  ('Chef User', 'chef@example.com', '$2b$12$usaAXI0W/FlKqvxxfa73EOPLxnsTdn1P9t2f41d6TkskVV03nBqO.', 'CHEF')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role);

INSERT INTO `tables` (table_number, qr_code, status)
VALUES
  (1, 'table-1', 'AVAILABLE'),
  (2, 'table-2', 'AVAILABLE'),
  (3, 'table-3', 'AVAILABLE'),
  (4, 'table-4', 'AVAILABLE')
ON DUPLICATE KEY UPDATE
  qr_code = VALUES(qr_code),
  status = VALUES(status);

INSERT INTO categories (name, image, is_active, sort_order)
VALUES
  ('Starters', NULL, TRUE, 10),
  ('Mains', NULL, TRUE, 20),
  ('Drinks', NULL, TRUE, 30)
ON DUPLICATE KEY UPDATE
  image = VALUES(image),
  is_active = VALUES(is_active),
  sort_order = VALUES(sort_order);

INSERT INTO menu_items (category_id, name, description, image, price, preparation_time, is_available)
SELECT id, 'Tomato Bruschetta', 'Toasted bread with tomato, basil, and olive oil.', NULL, 7.50, 8, TRUE
FROM categories
WHERE name = 'Starters'
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  price = VALUES(price),
  preparation_time = VALUES(preparation_time),
  is_available = VALUES(is_available);

INSERT INTO menu_items (category_id, name, description, image, price, preparation_time, is_available)
SELECT id, 'Grilled Chicken Plate', 'Grilled chicken with seasonal vegetables.', NULL, 16.00, 18, TRUE
FROM categories
WHERE name = 'Mains'
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  price = VALUES(price),
  preparation_time = VALUES(preparation_time),
  is_available = VALUES(is_available);

INSERT INTO menu_items (category_id, name, description, image, price, preparation_time, is_available)
SELECT id, 'House Lemonade', 'Fresh lemon, mint, and sparkling water.', NULL, 4.50, 3, TRUE
FROM categories
WHERE name = 'Drinks'
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  price = VALUES(price),
  preparation_time = VALUES(preparation_time),
  is_available = VALUES(is_available);
