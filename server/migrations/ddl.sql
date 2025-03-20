-- =============================================================================
-- DATA MODEL
-- =============================================================================

-- PRODUCT_TYPES: Allows classifying products by type (e.g., "Bicycle", "Surfboard").
-- We store product_type at the product level to allow greater flexibility at the cost of potential duplication of data across products of the same type.
CREATE TABLE `product_types` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- PRODUCTS: Holds general info about each product (e.g., "Bicycle", "Surfboard").
CREATE TABLE `products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_type_id` INT NULL, -- References product_types for classification
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `base_price` DECIMAL(10,2) DEFAULT 0,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- PRODUCT_CATEGORIES: Defines "part categories" for each product (e.g., "Frame Type", "Wheels").
CREATE TABLE `product_categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `is_required` BOOLEAN NOT NULL DEFAULT true,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- CATEGORY_OPTIONS: Lists actual options for each category (e.g., "Full-suspension" for "Frame Type").
CREATE TABLE `category_options` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_category_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `stock_quantity` INT DEFAULT 100,
  `is_available` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- INCOMPATIBILITY_RULES: Groups of options that cannot coexist if the user selects them all.
CREATE TABLE `incompatibility_rules` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `rule_name` VARCHAR(150) NOT NULL,
  `rule_description` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- INCOMPATIBILITY_RULE_OPTIONS: Assigns category_options to a specific incompatibility rule.
CREATE TABLE `incompatibility_rule_options` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `incompatibility_rule_id` INT NOT NULL,
  `category_option_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- CATEGORY_PRICE_MODIFIERS: If two options are chosen, we can override or adjust one option's price.
CREATE TABLE `category_price_modifiers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_option_id_base` INT NOT NULL,
  `category_option_id_trigger` INT NOT NULL,
  `override_price` DECIMAL(10,2),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_product_types`
  FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_product_categories_products`
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `category_options`
  ADD CONSTRAINT `fk_category_options_product_categories`
  FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `incompatibility_rules`
  ADD CONSTRAINT `fk_incompatibility_rules_products`
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `incompatibility_rule_options`
  ADD CONSTRAINT `fk_incompatibility_rule_options_rules`
  FOREIGN KEY (`incompatibility_rule_id`) REFERENCES `incompatibility_rules` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `incompatibility_rule_options`
  ADD CONSTRAINT `fk_incompatibility_rule_options_category_options`
  FOREIGN KEY (`category_option_id`) REFERENCES `category_options` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `category_price_modifiers`
  ADD CONSTRAINT `fk_category_price_modifiers_base`
  FOREIGN KEY (`category_option_id_base`) REFERENCES `category_options` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `category_price_modifiers`
  ADD CONSTRAINT `fk_category_price_modifiers_trigger`
  FOREIGN KEY (`category_option_id_trigger`) REFERENCES `category_options` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
