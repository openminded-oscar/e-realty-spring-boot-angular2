INSERT INTO `tbl_role` (`id`, `name`) VALUES
                                          (2000, 'Admin'),
                                          (2001, 'User');

INSERT INTO `tbl_user_photo` (`id`, `filename`) VALUES
                                                    (1, 'user_photo_1.jpg'),
                                                    (2, 'user_photo_2.jpg');

INSERT INTO `tbl_realtor` (`id`, `name`, `surname`, `photo_id`) VALUES
                                                                    (1, 'John', 'Doe', 1),
                                                                    (17, 'Jane', 'Smith', 2);


INSERT INTO `tbl_user` (
    `id`, `email`, `google_user_id_token_subject`, `login`, `name`, `password`,
    `phone_number`, `profile_pic`, `surname`, `realtor_id`, `created_at`, `updated_at`
) VALUES
      (2001, 'user1@example.com', 'abc123', 'user1', 'John', 'password1', '1234567890', 'profile_pic1.jpg', 'Doe', 1, '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443'),
      (2002, 'user2@example.com', 'def456', 'user2', 'Jane', 'password2', '0987654321', 'profile_pic2.jpg', 'Smith', 2, '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443');

-- Inserting into tbl_user_role
INSERT INTO `tbl_user_role` (`user_id`, `role_id`) VALUES
                                                       (2001, 1),
                                                       (2002, 1);


-- Inserting into tbl_confirmation_doc_photo
INSERT INTO `tbl_confirmation_doc_photo` (`id`, `filename`) VALUES
                                                                (1, 'doc_photo_1.jpg'),
                                                                (2, 'doc_photo_2.jpg');

-- Inserting into tbl_realty_object
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1035, 2, 'Lviv', '12', 'Stryy', 'BRICK', NULL, 'Welcome to this stunning 2-bedroom apartment located in the heart of Imaginary City. With sleek modern design, an open floor plan, and large windows offering beautiful city views, this property is perfect for professionals or small families.', 'APARTMENT', 3, 1990, 0, 0, 0, 1, 40.00, '', 50000.00, NULL, 3, 40.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1036, 2, 'Lviv', '15', 'Khreshchatyk', 'BRICK', NULL, 'Discover this elegant 3-bedroom apartment in the vibrant city center of Kyiv. Featuring stylish interiors, an airy layout, and expansive windows with stunning skyline views, this property is ideal for families or professionals.', 'APARTMENT', 5, 2005, 0, 1, 0, 1, 65.00, '', 65000.00, NULL, 3, 65.00, 5, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1037, 2, 'Lviv', '22', 'Primorskyi Boulevard', 'BRICK', NULL, 'Experience this gorgeous 2-bedroom apartment located along the scenic Primorskyi Boulevard in Odesa. With contemporary design and breathtaking sea views, this property is perfect for those seeking a seaside lifestyle.', 'APARTMENT', 4, 1995, 1, 0, 0, 1, 50.00, '', 55000.00, NULL, 3, 50.00, 4, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1038, 2, 'Lviv', '8', 'Sumska', 'BRICK', NULL, 'Step into this beautiful 3-bedroom apartment in the bustling heart of Kharkiv. With modern finishes, spacious living areas, and large windows, this property is well-suited for families and professionals alike.', 'APARTMENT', 6, 2000, 0, 0, 1, 1, 70.00, '', 70000.00, NULL, 3, 70.00, 6, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1039, 2, 'Lviv', '5', 'Shevchenka', 'BRICK', NULL, 'Welcome to this chic 2-bedroom apartment in Dnipro, featuring modern amenities, an open layout, and beautiful city views, perfect for both families and professionals.', 'APARTMENT', 3, 2010, 0, 0, 1, 1, 45.00, '', 48000.00, NULL, 3, 45.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1040, 2, 'Lviv', '14', 'Soborna', 'BRICK', NULL, 'Discover this spacious 3-bedroom apartment in the heart of Vinnytsia. Boasting a modern design and large windows that provide plenty of natural light, this property is perfect for families.', 'APARTMENT', 2, 2002, 0, 0, 1, 1, 60.00, '', 62000.00, NULL, 3, 60.00, 2, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1041, 2, 'Lviv', '20', 'Kozatska', 'BRICK', NULL, 'Welcome to this delightful 2-bedroom apartment in Poltava, featuring a contemporary design and inviting living spaces, ideal for small families or professionals.', 'APARTMENT', 4, 1998, 1, 0, 0, 1, 55.00, '', 53000.00, NULL, 3, 55.00, 4, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1042, 2, 'Lviv', '30', 'Shevchenka', 'BRICK', NULL, 'Explore this charming 2-bedroom apartment in Cherkasy, featuring an open floor plan and stylish interiors, perfect for professionals or small families.', 'APARTMENT', 3, 2001, 0, 1, 0, 1, 48.00, '', 50000.00, NULL, 3, 48.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1043, 2, 'Lviv', '18', 'Chernihivska', 'BRICK', NULL, 'Check out this beautiful 3-bedroom apartment in Sumy. With an attractive design, open spaces, and large windows, this property is a great fit for families.', 'APARTMENT', 4, 1999, 0, 0, 1, 1, 72.00, '', 72000.00, NULL, 3, 72.00, 4, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1044, 2, 'Lviv', '11', 'Independence Avenue', 'BRICK', NULL, 'Welcome to this spacious 3-bedroom apartment in the vibrant city of Khmelnytskyi. Featuring modern interiors and ample natural light, this property is perfect for families.', 'APARTMENT', 5, 2015, 0, 0, 1, 1, 75.00, '', 75000.00, NULL, 3, 75.00, 5, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1045, 2, 'Lviv', '6', 'Vicheva', 'BRICK', NULL, 'Discover this stunning 2-bedroom apartment in Ivano-Frankivsk. With contemporary design, large windows, and breathtaking views, this property is ideal for professionals and families.', 'APARTMENT', 3, 2010, 1, 1, 0, 1, 53.00, '', 52000.00, NULL, 3, 53.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1046, 2, 'Lviv', '3', 'Bohdan Khmelnytskyi', 'BRICK', NULL, 'Experience this elegant 3-bedroom apartment in Chernivtsi. This property boasts a modern design and spacious layout, making it perfect for families or professionals.', 'APARTMENT', 4, 2008, 0, 1, 0, 1, 67.00, '', 68000.00, NULL, 3, 67.00, 4, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1047, 2, 'Lviv', '7', 'Zamkova', 'BRICK', NULL, 'Check out this chic 2-bedroom apartment in Ternopil, featuring an open layout and contemporary design. Ideal for small families or young professionals.', 'APARTMENT', 3, 2011, 0, 0, 1, 1, 49.00, '', 49000.00, NULL, 3, 49.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1048, 2, 'Lviv', '25', 'Korzo', 'BRICK', NULL, 'Welcome to this stylish 3-bedroom apartment in Uzhhorod, offering a modern interior design and a bright, open layout, perfect for families or professionals.', 'APARTMENT', 2, 2012, 1, 1, 0, 1, 60.00, '', 65000.00, NULL, 3, 60.00, 2, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1049, 2, 'Lviv', '9', 'Lesi Ukrainky', 'BRICK', NULL, 'Discover this charming 2-bedroom apartment in Lutsk. Featuring a contemporary design and spacious living areas, this property is perfect for small families or young professionals.', 'APARTMENT', 3, 2003, 0, 0, 1, 1, 55.00, '', 54000.00, NULL, 3, 55.00, 3, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);
INSERT INTO realperfect.tbl_realty_object
(id, apt_number, city, number_of_street, street, building_type, confirmed, description, dwelling_type, floor, foundation_year, has_cellar, has_garage, has_loft, has_repairing, living_area, other_info, price, realtor_aware, rooms_amount, total_area, total_floors, realty_object_id, owner_id, realtor_id, created_at, updated_at, latitude, longitude, realter_aware)
VALUES(1050, 2, 'Lviv', '4', 'Soborna', 'BRICK', NULL, 'Experience this elegant 3-bedroom apartment in Mykolaiv, featuring modern finishes, an open layout, and bright, spacious rooms, making it perfect for families or professionals.', 'APARTMENT', 5, 2006, 0, 1, 0, 1, 68.00, '', 72000.00, NULL, 3, 68.00, 5, 21, 2001, 17, '2024-10-15 12:22:06.971852', '2024-10-15 12:34:03.464557', NULL, NULL, NULL);

-- Inserting into tbl_interest
INSERT INTO `tbl_interest` (`id`, `realty_obj_id`, `user_id`) VALUES
                                                                  (1, 1001, 2001),
                                                                  (2, 1002, 2002);

-- Inserting into tbl_object_review
INSERT INTO `tbl_object_review` (`id`, `date_time`, `realty_obj_id`, `user_id`) VALUES
                                                                                    (1, '2024-09-26 14:30:00', 1001, 2001),
                                                                                    (2, '2024-09-25 12:15:00', 1002, 2002);



-- Inserting into tbl_object_supported_operations
INSERT INTO `tbl_object_supported_operations` (`object_id`, `operation_type`) VALUES
                                                                                  (1001, 'SELLING'),
                                                                                  (1002, 'RENT');

-- Inserting into tbl_realty_object_photo
INSERT INTO `tbl_realty_object_photo` (`id`, `filename`, `photo_type`, `realty_object_id`) VALUES
                                                                                               (1, 'realty_photo_1.jpg', 'REALTY_PLAIN', 1001),
                                                                                               (2, 'realty_photo_2.jpg', 'REALTY_PLAIN', 1002);


-- Inserting into tbl_realty_searcher
INSERT INTO `tbl_realty_searcher` (`id`, `user_id`) VALUES
                                                        (1, 2001),
                                                        (2, 2002);


