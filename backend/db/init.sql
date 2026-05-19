CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  airline_code VARCHAR(20) NULL,
  airline_name VARCHAR(150) NULL,
  markup_type ENUM('flat','percent') NOT NULL DEFAULT 'percent',
  markup_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  commission_type ENUM('flat','percent') NOT NULL DEFAULT 'percent',
  commission_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discount_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type ENUM('flat','percent') NOT NULL DEFAULT 'percent',
  discount_value DECIMAL(12,2) NOT NULL,
  airline_code VARCHAR(20) NULL,
  origin VARCHAR(10) NULL,
  destination VARCHAR(10) NULL,
  max_discount DECIMAL(12,2) NULL,
  min_fare DECIMAL(12,2) DEFAULT 0,
  usage_limit INT NULL,
  used_count INT DEFAULT 0,
  valid_from DATE NULL,
  valid_to DATE NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight_search_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  request_json JSON,
  result_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS svgtemplate (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  url VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users(id,name,email,password) VALUES
(1,'Interview Admin','admin@example.com','$2a$10$QnaqbrGDLPVj4l4lJ/ZPhO4GhdQuhgns4inCu8/CEkD5k3FKnXE.6');

INSERT INTO pricing_configs(airline_code,airline_name,markup_type,markup_value,commission_type,commission_value,is_active)
SELECT NULL,'All Airlines','percent',8,'percent',3,1 WHERE NOT EXISTS (SELECT 1 FROM pricing_configs);
INSERT IGNORE INTO pricing_configs(id,airline_code,airline_name,markup_type,markup_value,commission_type,commission_value,is_active)
VALUES (2,'BG','Biman Bangladesh Airlines','percent',5,'flat',250,1);

INSERT IGNORE INTO discount_codes(id,code,description,discount_type,discount_value,airline_code,origin,destination,max_discount,min_fare,is_active)
VALUES
(1,'INTERVIEW10','10 percent interview promo','percent',10,NULL,NULL,NULL,1500,0,1),
(2,'DACDXB500','Flat discount for DAC to DXB','flat',500,NULL,'DAC','DXB',NULL,0,1),
(3,'BIMAN5','Biman 5 percent discount','percent',5,'BG',NULL,NULL,1000,0,1);
