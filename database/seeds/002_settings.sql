INSERT INTO settings (setting_key, setting_value)
VALUES
  ('restaurant_name', 'Restaurant System'),
  ('currency', 'USD'),
  ('tax_rate', '0.00')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value);
