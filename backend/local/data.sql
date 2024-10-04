INSERT INTO `tbl_role` (`id`, `name`) VALUES
                                          (1, 'Admin'),
                                          (2, 'User');

INSERT INTO `tbl_user_photo` (`id`, `filename`) VALUES
                                                    (1, 'user_photo_1.jpg'),
                                                    (2, 'user_photo_2.jpg');

INSERT INTO `tbl_realtor` (`id`, `name`, `surname`, `photo_id`) VALUES
                                                                    (1, 'John', 'Doe', 1),
                                                                    (2, 'Jane', 'Smith', 2);


INSERT INTO `tbl_user` (
    `id`, `email`, `google_user_id_token_subject`, `login`, `name`, `password`,
    `phone_number`, `profile_pic`, `surname`, `realtor_id`
) VALUES
      (2001, 'user1@example.com', 'abc123', 'user1', 'John', 'password1', '1234567890', 'profile_pic1.jpg', 'Doe', 1),
      (2002, 'user2@example.com', 'def456', 'user2', 'Jane', 'password2', '0987654321', 'profile_pic2.jpg', 'Smith', 2);

-- Inserting into tbl_user_role
INSERT INTO `tbl_user_role` (`user_id`, `role_id`) VALUES
                                                       (2001, 1),
                                                       (2002, 1);


-- Inserting into tbl_confirmation_doc_photo
INSERT INTO `tbl_confirmation_doc_photo` (`id`, `filename`) VALUES
                                                                (1, 'doc_photo_1.jpg'),
                                                                (2, 'doc_photo_2.jpg');

-- Inserting into tbl_realty_object
INSERT INTO `tbl_realty_object` (
    `id`, `apt_number`, `city`, `number_of_street`, `street`, `building_type`,
    `confirmed`, `description`, `dwelling_type`, `floor`, `foundation_year`,
    `has_cellar`, `has_garage`, `has_loft`, `has_repairing`, `living_area`,
    `other_info`, `price`, `realtor_aware`, `rooms_amount`, `total_area`,
    `total_floors`, `realty_object_id`, `owner_id`, `realtor_id`
) VALUES
      (1001, 5, 'New York', '123', 'Main St', 'BRICK', b'1', 'Nice apartment',
       'APARTMENT', 2, 2001, b'0', b'1', b'0', b'1', 50.75, 'Near park', 300000.00,
       b'1', 3, 75.00, 5, 1, 2001, 1),
      (1002, 12, 'Los Angeles', '456', 'Second St', 'BRICK', b'0', 'Spacious condo',
       'APARTMENT', 5, 2015, b'1', b'1', b'1', b'0', 100.50, 'Ocean view', 750000.00,
       b'1', 5, 120.00, 10, 2, 2002, 2);


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


