-- =============================================================================
-- PRODUCT TYPES
-- =============================================================================

INSERT INTO `product_types` (name)
VALUES ('Bicycle'), ('Surfboard'), ('Skis');

-- =============================================================================
-- PRODUCTS
-- =============================================================================

-- 1. Mountain Bike Pro (Full featured bicycle product)
INSERT INTO `products` (id, product_type_id, name, description, base_price)
VALUES (1, 1, 'Mountain Bike Pro', 'Fully customizable mountain bike with various options.', 299.99);

-- 2. Road Bike Elite
INSERT INTO `products` (id, product_type_id, name, description, base_price)
VALUES (2, 1, 'Road Bike Elite', 'Lightweight road bike for enthusiasts.', 399.99);

-- 3. Kids Bike (Bicycle without options)
INSERT INTO `products` (id, product_type_id, name, description, base_price)
VALUES (3, 1, 'Kids Bike', 'Simple bike for children.', 149.99);

-- 4. Beginner Surfboard (Surfboard product)
INSERT INTO `products` (id, product_type_id, name, description, base_price)
VALUES (4, 2, 'Beginner Surfboard', 'Perfect surfboard for beginners.', 249.99);

-- 5. Pro Alpine Skis (Ski product)
INSERT INTO `products` (id, product_type_id, name, description, base_price)
VALUES (5, 3, 'Pro Alpine Skis', 'Professional skiing equipment.', 499.99);

-- =============================================================================
-- BICYCLE CATEGORIES (For Mountain Bike Pro and Road Bike Elite)
-- =============================================================================

-- Categories for Bicycles
INSERT INTO `product_categories` (id, product_id, name, is_required, sort_order)
VALUES
  -- For Mountain Bike Pro (product_id = 1)
  (1, 1, 'Frame Type', TRUE, 1),
  (2, 1, 'Frame Finish', TRUE, 2),
  (3, 1, 'Wheels', TRUE, 3),
  (4, 1, 'Rim Color', TRUE, 4),
  (5, 1, 'Chain', TRUE, 5),
  
  -- For Road Bike Elite (product_id = 2)
  (6, 2, 'Frame Type', TRUE, 1),
  (7, 2, 'Frame Finish', TRUE, 2),
  (8, 2, 'Wheels', TRUE, 3),
  (9, 2, 'Rim Color', TRUE, 4),
  (10, 2, 'Chain', TRUE, 5);

-- =============================================================================
-- SURFBOARD CATEGORIES (For product_id = 4)
-- =============================================================================

-- Categories for Surfboard
INSERT INTO `product_categories` (id, product_id, name, is_required, sort_order)
VALUES
  (16, 4, 'Board Size', TRUE, 1),
  (17, 4, 'Fin Setup', TRUE, 2),
  (18, 4, 'Leash', FALSE, 3), -- Non-required category
  (19, 4, 'Deck Grip', FALSE, 4); -- Non-required category

-- =============================================================================
-- SKI CATEGORIES (For product_id = 5)
-- =============================================================================

-- Categories for Skis
INSERT INTO `product_categories` (id, product_id, name, is_required, sort_order)
VALUES
  (20, 5, 'Ski Length', TRUE, 1),
  (21, 5, 'Bindings', TRUE, 2),
  (22, 5, 'Design', TRUE, 3);

-- =============================================================================
-- OPTIONS FOR BICYCLE CATEGORIES
-- =============================================================================

-- Options for Frame Type (Mountain Bike Pro, category_id = 1)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (1, 1, 'Full-suspension', 130.00, 10, TRUE),
  (2, 1, 'Diamond', 100.00, 15, TRUE),
  (3, 1, 'Step-through', 90.00, 12, TRUE);

-- Options for Frame Finish (Mountain Bike Pro, category_id = 2)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (4, 2, 'Matte finish', 35.00, 20, TRUE),
  (5, 2, 'Shiny finish', 30.00, 18, TRUE);

-- Options for Wheels (Mountain Bike Pro, category_id = 3)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (6, 3, 'Road wheels', 80.00, 25, TRUE),
  (7, 3, 'Mountain wheels', 95.00, 20, TRUE),
  (8, 3, 'Fat bike wheels', 120.00, 8, TRUE);

-- Options for Rim Color (Mountain Bike Pro, category_id = 4)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (9, 4, 'Red', 20.00, 15, TRUE),
  (10, 4, 'Black', 15.00, 25, TRUE),
  (11, 4, 'Blue', 20.00, 18, TRUE);

-- Options for Chain (Mountain Bike Pro, category_id = 5)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (12, 5, 'Single-speed chain', 43.00, 22, TRUE),
  (13, 5, '8-speed chain', 60.00, 18, TRUE);

-- Options for Frame Type (Road Bike Elite, category_id = 6)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (14, 6, 'Full-suspension', 130.00, 10, TRUE),
  (15, 6, 'Diamond', 100.00, 15, TRUE),
  (16, 6, 'Step-through', 90.00, 12, TRUE);

-- Options for Frame Finish (Road Bike Elite, category_id = 7)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (17, 7, 'Matte finish', 35.00, 20, TRUE),
  (18, 7, 'Shiny finish', 30.00, 18, TRUE);

-- Options for Wheels (Road Bike Elite, category_id = 8)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (19, 8, 'Road wheels', 80.00, 25, TRUE),
  (20, 8, 'Mountain wheels', 95.00, 20, TRUE),
  (21, 8, 'Fat bike wheels', 120.00, 8, TRUE);

-- Options for Rim Color (Road Bike Elite, category_id = 9)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (22, 9, 'Red', 20.00, 15, TRUE),
  (23, 9, 'Black', 15.00, 25, TRUE),
  (24, 9, 'Blue', 20.00, 18, TRUE);

-- Options for Chain (Road Bike Elite, category_id = 10)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (25, 10, 'Single-speed chain', 43.00, 22, TRUE),
  (26, 10, '8-speed chain', 60.00, 18, TRUE);

-- =============================================================================
-- OPTIONS FOR SURFBOARD CATEGORIES
-- =============================================================================

-- Options for Board Size (category_id = 16)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (40, 16, '6ft', 0.00, 10, TRUE),
  (41, 16, '7ft', 50.00, 12, TRUE),
  (42, 16, '8ft', 100.00, 8, TRUE);

-- Options for Fin Setup (category_id = 17)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (43, 17, 'Single Fin', 20.00, 15, TRUE),
  (44, 17, 'Three Fin', 40.00, 12, TRUE);

-- Options for Leash (category_id = 18) - Optional
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (45, 18, 'Standard Leash', 25.00, 20, TRUE),
  (46, 18, 'Competition Leash', 45.00, 8, TRUE);

-- Options for Deck Grip (category_id = 19) - Optional
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (47, 19, 'Wax', 5.00, 30, TRUE),
  (48, 19, 'Eva Pad', 30.00, 15, TRUE);

-- =============================================================================
-- OPTIONS FOR SKI CATEGORIES
-- =============================================================================

-- Options for Ski Length (category_id = 20)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (49, 20, '150cm', 0.00, 5, TRUE),
  (50, 20, '170cm', 50.00, 3, TRUE),
  (51, 20, '190cm', 100.00, 0, FALSE); -- Out of stock and unavailable

-- Options for Bindings (category_id = 21)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (52, 21, 'Beginner Bindings', 80.00, 8, TRUE),
  (53, 21, 'Pro Bindings', 150.00, 5, TRUE),
  (54, 21, 'Race Bindings', 200.00, 0, FALSE); -- Out of stock and unavailable

-- Options for Design (category_id = 22)
INSERT INTO `category_options` (id, product_category_id, name, price, stock_quantity, is_available)
VALUES
  (55, 22, 'Classic', 0.00, 10, TRUE),
  (56, 22, 'Racing Stripes', 30.00, 6, TRUE),
  (57, 22, 'Limited Edition', 100.00, 0, FALSE); -- Out of stock and unavailable

-- =============================================================================
-- INCOMPATIBILITY RULES (Corrected)
-- =============================================================================

-- Mountain Bike Pro (product_id = 1) incompatibilities
-- Fat bike wheels with red rim color is not available
INSERT INTO `incompatibility_rules` (id, product_id, rule_name, rule_description)
VALUES (1, 1, 'FatBikeRedRimConflict', 'Fat bike wheels are not available with red rim color');

INSERT INTO `incompatibility_rule_options` (incompatibility_rule_id, category_option_id)
VALUES
  (1, 8),  -- Fat bike wheels
  (1, 9);  -- Red rim color

-- Frame finish affects chain compatibility
INSERT INTO `incompatibility_rules` (id, product_id, rule_name, rule_description)
VALUES (2, 1, 'ShinyFinishSingleChainConflict', 'Shiny finish is incompatible with single-speed chain');

INSERT INTO `incompatibility_rule_options` (incompatibility_rule_id, category_option_id)
VALUES
  (2, 5),  -- Shiny finish
  (2, 12);  -- Single-speed chain

-- Road Bike Elite (product_id = 2) incompatibilities
-- Fat bike wheels with red rim color is not available
INSERT INTO `incompatibility_rules` (id, product_id, rule_name, rule_description)
VALUES (3, 2, 'FatBikeRedRimConflict', 'Fat bike wheels are not available with red rim color');

INSERT INTO `incompatibility_rule_options` (incompatibility_rule_id, category_option_id)
VALUES
  (3, 21),  -- Fat bike wheels
  (3, 22);  -- Red rim color

-- Frame finish affects chain compatibility
INSERT INTO `incompatibility_rules` (id, product_id, rule_name, rule_description)
VALUES (4, 2, 'ShinyFinishSingleChainConflict', 'Shiny finish is incompatible with single-speed chain');

INSERT INTO `incompatibility_rule_options` (incompatibility_rule_id, category_option_id)
VALUES
  (4, 18),  -- Shiny finish
  (4, 25);  -- Single-speed chain

-- Beginner Surfboard (product_id = 4) incompatibilities
-- 6ft board is not compatible with Three Fin setup
INSERT INTO `incompatibility_rules` (id, product_id, rule_name, rule_description)
VALUES (5, 4, 'SmallBoardThreeFinConflict', '6ft board is not compatible with Three Fin setup');

INSERT INTO `incompatibility_rule_options` (incompatibility_rule_id, category_option_id)
VALUES
  (5, 40),  -- 6ft board
  (5, 44);  -- Three Fin setup

-- =============================================================================
-- PRICE MODIFIERS
-- =============================================================================

-- Mountain Bike Pro (product_id = 1) price modifiers
-- Matte finish is more expensive on Full-suspension frame
INSERT INTO `category_price_modifiers` (category_option_id_base, category_option_id_trigger, override_price)
VALUES (4, 1, 20.00);  -- Matte finish costs 20.00 instead of 35.00 when Full-suspension frame is selected

-- Blue rim is more expensive with Fat bike wheels
INSERT INTO `category_price_modifiers` (category_option_id_base, category_option_id_trigger, override_price)
VALUES (11, 8, 35.00);  -- Blue rim costs 35.00 instead of 20.00 when Fat bike wheels are selected

-- Road Bike Elite (product_id = 2) price modifiers
-- Matte finish is more expensive on Full-suspension frame
INSERT INTO `category_price_modifiers` (category_option_id_base, category_option_id_trigger, override_price)
VALUES (17, 14, 20.00);  -- Matte finish costs 20.00 instead of 35.00 when Full-suspension frame is selected

-- Blue rim is more expensive with Fat bike wheels (same as Mountain Bike)
INSERT INTO `category_price_modifiers` (category_option_id_base, category_option_id_trigger, override_price)
VALUES (24, 21, 35.00);  -- Blue rim costs 35.00 instead of 20.00 when Fat bike wheels are selected

-- Beginner Surfboard (product_id = 4) price modifiers
-- Competition Leash is cheaper with 8ft board
INSERT INTO `category_price_modifiers` (category_option_id_base, category_option_id_trigger, override_price)
VALUES (46, 42, 35.00);  -- Competition Leash costs 35.00 instead of 45.00 when 8ft board is selected 