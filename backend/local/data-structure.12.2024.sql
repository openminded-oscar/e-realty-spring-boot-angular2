CREATE TABLE `tbl_user_photo` (
                                  `id` bigint NOT NULL AUTO_INCREMENT,
                                  `filename` varchar(255) DEFAULT NULL,
                                  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_user` (
                            `id` bigint NOT NULL AUTO_INCREMENT,
                            `google_user_id_token_subject` varchar(255) DEFAULT NULL,
                            `login` varchar(255) DEFAULT NULL,
                            `name` varchar(255) DEFAULT NULL,
                            `password` varchar(255) DEFAULT NULL,
                            `phone_number` varchar(255) DEFAULT NULL,
                            `surname` varchar(255) DEFAULT NULL,
                            `realtor_id` bigint DEFAULT NULL,
                            `created_at` datetime(6) DEFAULT NULL,
                            `updated_at` datetime(6) DEFAULT NULL,
                            `realter_id` bigint DEFAULT NULL,
                            `photo_id` bigint DEFAULT NULL,
                            `profile_pic` varchar(255) DEFAULT NULL,
                            `email` varchar(255) NOT NULL,
                            `is_user_confirmed` bit(1) NOT NULL,
                            PRIMARY KEY (`id`),
                            KEY `FKecos2jf3rywyoo11l4qigm403` (`photo_id`),
                            KEY `FK9ia3vn2v05ga54wxnpjnh0sye` (`realtor_id`),
                            KEY `FKrj96m2s4qg3gfls7bskw7t9dw` (`realter_id`),
                            CONSTRAINT `FKecos2jf3rywyoo11l4qigm403` FOREIGN KEY (`photo_id`) REFERENCES `tbl_user_photo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2042 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_realtor` (
                               `id` bigint NOT NULL AUTO_INCREMENT,
                               `user_id` bigint DEFAULT NULL,
                               `name` varchar(255) DEFAULT NULL,
                               `surname` varchar(255) DEFAULT NULL,
                               PRIMARY KEY (`id`),
                               KEY `idx_user_id` (`user_id`),
                               CONSTRAINT `FKsskttedvoj27m8dkawlrc1dmq` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `tbl_user`
    ADD CONSTRAINT `FK9ia3vn2v05ga54wxnpjnh0sye` FOREIGN KEY (`realtor_id`) REFERENCES `tbl_realtor` (`id`);


CREATE TABLE `email_confirmation_token` (
                                            `id` bigint NOT NULL AUTO_INCREMENT,
                                            `created_date` datetime(6) DEFAULT NULL,
                                            `expiration_date` datetime(6) DEFAULT NULL,
                                            `token` varchar(255) NOT NULL,
                                            `user_id` bigint NOT NULL,
                                            PRIMARY KEY (`id`),
                                            UNIQUE KEY `UK_cj3okephan6bnvd232ugflkg0` (`token`),
                                            KEY `FKlaqklkwufpkuclnulagwv1ykq` (`user_id`),
                                            CONSTRAINT `FKlaqklkwufpkuclnulagwv1ykq` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_confirmation_doc_photo` (
                                              `id` bigint NOT NULL AUTO_INCREMENT,
                                              `filename` varchar(255) DEFAULT NULL,
                                              PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_realty_object` (
                                     `id` bigint NOT NULL AUTO_INCREMENT,
                                     `apt_number` int DEFAULT NULL,
                                     `city` varchar(255) DEFAULT NULL,
                                     `number_of_street` varchar(255) DEFAULT NULL,
                                     `street` varchar(255) DEFAULT NULL,
                                     `building_type` varchar(255) DEFAULT NULL,
                                     `description` varchar(255) DEFAULT NULL,
                                     `dwelling_type` varchar(255) DEFAULT NULL,
                                     `floor` int DEFAULT NULL,
                                     `foundation_year` int DEFAULT NULL,
                                     `has_cellar` bit(1) DEFAULT NULL,
                                     `has_garage` bit(1) DEFAULT NULL,
                                     `has_loft` bit(1) DEFAULT NULL,
                                     `has_repairing` bit(1) DEFAULT NULL,
                                     `living_area` decimal(38,2) DEFAULT NULL,
                                     `other_info` varchar(255) DEFAULT NULL,
                                     `price` decimal(38,2) DEFAULT NULL,
                                     `realtor_aware` bit(1) DEFAULT NULL,
                                     `rooms_amount` int DEFAULT NULL,
                                     `total_area` decimal(38,2) DEFAULT NULL,
                                     `total_floors` int DEFAULT NULL,
                                     `realty_object_id` bigint DEFAULT NULL,
                                     `owner_id` bigint DEFAULT NULL,
                                     `realtor_id` bigint DEFAULT NULL,
                                     `created_at` datetime(6) DEFAULT NULL,
                                     `updated_at` datetime(6) DEFAULT NULL,
                                     `price_for_rent` decimal(38,2) DEFAULT NULL,
                                     `status` varchar(255) DEFAULT NULL,
                                     `geolocation` point NOT NULL,
                                     PRIMARY KEY (`id`),
                                     KEY `IDXb250f2bas61gsgph9bamhh257` (`city`),
                                     KEY `idx_city` (`city`),
                                     KEY `idx_owner_id` (`owner_id`),
                                     KEY `idx_realtor_id` (`realtor_id`),
                                     SPATIAL KEY `idx_geolocation` (`geolocation`),
                                     KEY `FK7ujvwekhjj7mip1e53tmlwtjc` (`realty_object_id`),
                                     CONSTRAINT `FK4puv7o3577yfw40g3y06ta5e9` FOREIGN KEY (`realtor_id`) REFERENCES `tbl_realtor` (`id`),
                                     CONSTRAINT `FK7ujvwekhjj7mip1e53tmlwtjc` FOREIGN KEY (`realty_object_id`) REFERENCES `tbl_confirmation_doc_photo` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
                                     CONSTRAINT `FKghvmecgfl56awhev42qtql1cd` FOREIGN KEY (`owner_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1066 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_interest` (
                                `id` bigint NOT NULL AUTO_INCREMENT,
                                `realty_obj_id` bigint DEFAULT NULL,
                                `user_id` bigint DEFAULT NULL,
                                `created_at` datetime(6) DEFAULT NULL,
                                `updated_at` datetime(6) DEFAULT NULL,
                                PRIMARY KEY (`id`),
                                KEY `FKig6ys8lrrdnk581lantcb575x` (`realty_obj_id`),
                                KEY `FKd4jlqo4mt64verpj9bdhc8fps` (`user_id`),
                                CONSTRAINT `FKd4jlqo4mt64verpj9bdhc8fps` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE,
                                CONSTRAINT `FKig6ys8lrrdnk581lantcb575x` FOREIGN KEY (`realty_obj_id`) REFERENCES `tbl_realty_object` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_object_review` (
                                     `id` bigint NOT NULL AUTO_INCREMENT,
                                     `date_time` datetime(6) DEFAULT NULL,
                                     `realty_obj_id` bigint DEFAULT NULL,
                                     `user_id` bigint DEFAULT NULL,
                                     `created_at` datetime(6) DEFAULT NULL,
                                     `updated_at` datetime(6) DEFAULT NULL,
                                     `realtor_id` bigint DEFAULT NULL,
                                     `approved` bit(1) DEFAULT NULL,
                                     PRIMARY KEY (`id`),
                                     UNIQUE KEY `UKg44xh1vkknhcow0tjx798o149` (`realty_obj_id`,`date_time`),
                                     UNIQUE KEY `UKdwe3aopxekixluj8mfinfy5rh` (`realty_obj_id`,`date_time`),
                                     UNIQUE KEY `UKdvohjt5g6ndhbtjvyo8qb107m` (`realty_obj_id`,`date_time`),
                                     KEY `idx_realtor` (`realtor_id`),
                                     KEY `idx_user` (`user_id`),
                                     KEY `idx_realtyObj` (`realty_obj_id`),
                                     CONSTRAINT `FK23uwe4e5tapq0lkft9dv9m5jo` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
                                     CONSTRAINT `FK5ylv75jnpq7i900ogctblr4me` FOREIGN KEY (`realtor_id`) REFERENCES `tbl_realtor` (`id`),
                                     CONSTRAINT `FKfmautqsd94yoonfudok8bfhjc` FOREIGN KEY (`realty_obj_id`) REFERENCES `tbl_realty_object` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_object_supported_operations` (
                                                   `object_id` bigint NOT NULL,
                                                   `operation_type` varchar(255) NOT NULL,
                                                   PRIMARY KEY (`object_id`,`operation_type`),
                                                   CONSTRAINT `FK16tnlrynom365bg9klwmdkds6` FOREIGN KEY (`object_id`) REFERENCES `tbl_realty_object` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tbl_realty_object_photo` (
                                           `id` bigint NOT NULL AUTO_INCREMENT,
                                           `filename` varchar(255) DEFAULT NULL,
                                           `photo_type` varchar(255) DEFAULT NULL,
                                           `realty_object_id` bigint DEFAULT NULL,
                                           PRIMARY KEY (`id`),
                                           KEY `FK3xdtttxddk5yolmyhxlgqhyav` (`realty_object_id`),
                                           CONSTRAINT `FK3xdtttxddk5yolmyhxlgqhyav` FOREIGN KEY (`realty_object_id`) REFERENCES `tbl_realty_object` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_role` (
                            `id` bigint NOT NULL AUTO_INCREMENT,
                            `name` varchar(255) DEFAULT NULL,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `tbl_user_role` (
                                 `user_id` bigint NOT NULL,
                                 `role_id` bigint NOT NULL,
                                 PRIMARY KEY (`user_id`,`role_id`),
                                 KEY `FK6phlytlf1w3h9vutsu019xor5` (`role_id`),
                                 CONSTRAINT `FK6phlytlf1w3h9vutsu019xor5` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`id`),
                                 CONSTRAINT `FKggc6wjqokl2vlw89y22a1j2oh` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

