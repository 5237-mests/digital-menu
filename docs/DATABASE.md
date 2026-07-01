# Database Design

## users

| column | type |
|---------|------|
| id | bigint |
| name | varchar |
| email | varchar |
| password_hash | varchar |
| role | enum |
| created_at | timestamp |
| updated_at | timestamp |

---

## tables

| column | type |
|---------|------|
| id | bigint |
| table_number | int |
| qr_code | varchar |
| status | enum |
| created_at | timestamp |
| updated_at | timestamp |

---

## categories

| column | type |
|---------|------|
| id | bigint |
| name | varchar |
| image | varchar |
| is_active | boolean |
| sort_order | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## menu_items

| column | type |
|---------|------|
| id | bigint |
| category_id | bigint |
| name | varchar |
| description | text |
| image | varchar |
| price | decimal |
| preparation_time | int |
| is_available | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## orders

| column | type |
|---------|------|
| id | bigint |
| order_number | varchar |
| table_id | bigint |
| status | enum |
| total | decimal |
| created_at | timestamp |
| updated_at | timestamp |

---

## order_items

| column | type |
|---------|------|
| id | bigint |
| order_id | bigint |
| menu_item_id | bigint |
| quantity | int |
| price | decimal |
| notes | text |
| created_at | timestamp |

---

## auth_refresh_tokens

| column | type |
|---------|------|
| id | bigint |
| user_id | bigint |
| token_id | char |
| token_hash | char |
| expires_at | timestamp |
| revoked_at | timestamp |
| created_at | timestamp |

---

# Indexes

users.email
tables.table_number
orders.order_number
orders.status
orders.created_at
menu_items.category_id
menu_items.category_id + menu_items.name
auth_refresh_tokens.user_id
auth_refresh_tokens.token_id
auth_refresh_tokens.token_hash
auth_refresh_tokens.expires_at
