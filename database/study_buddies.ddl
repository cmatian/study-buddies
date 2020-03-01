CREATE DATABASE study_buddies;
USE study_buddies;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  google_id VARCHAR(100) UNIQUE,
  username VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  phone VARCHAR(15), -- to support international numbers
  address VARCHAR(200),
  city VARCHAR(100),
  zip VARCHAR(10),
  state VARCHAR(100),
  country VARCHAR(100),
  PRIMARY KEY (user_id)
);

CREATE TABLE locations (
  location_id INT NOT NULL AUTO_INCREMENT,
  places_id VARCHAR(100) UNIQUE, -- max seen is 60
  name VARCHAR(200),
  cost VARCHAR(20), -- “free”, “cost_0_to_5”, “cost_5_to_10”, “cost_10_to_20”, “cost_20_to_50”, “cost_gt_50”
  business_type VARCHAR(50),
  average_rating DECIMAL(2, 1),
  PRIMARY KEY (location_id)
);

CREATE TABLE saved_locations (
  saved_location_id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  location_id INT,
  nickname VARCHAR(200),
  PRIMARY KEY (saved_location_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
);
ALTER TABLE `saved_locations` ADD UNIQUE `user_loc_index`(`user_id`, `location_id`);

CREATE TABLE reservations (
  reservation_id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  location_id INT,
  status VARCHAR(20),
  group_size INT,
  duration_minutes INT,
  date_time DATETIME,
  name VARCHAR(200),
  PRIMARY KEY (reservation_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE ratings (
  rating_id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  location_id INT,
  rating INT,
  comment VARCHAR(2000),
  cost VARCHAR(20), -- “free”, “cost_0_to_5”, “cost_5_to_10”, “cost_10_to_20”, “cost_20_to_50”, “cost_gt_50”
  PRIMARY KEY (rating_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
);
ALTER TABLE `ratings` ADD UNIQUE `user_loc_index`(`user_id`, `location_id`);
