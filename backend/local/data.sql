INSERT INTO `tbl_role` (`id`, `name`) VALUES
                                          (2000, 'ADMIN'),
                                          (2001, 'USER'),
                                          (2002, 'REALTOR');

INSERT INTO `tbl_user` (
    `id`, `email`, `google_user_id_token_subject`, `login`, `name`, `password`, `is_user_confirmed`,
    `phone_number`, `profile_pic`, `surname`, `created_at`, `updated_at`
) VALUES
      (2001, 'admin@gmail.com', 'abc123', 'user1', 'John', 'password1', true,'1234567890', 'profile_pic1.jpg', 'Doe', '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443'),
      (2002, 'user@gmail.com', 'def456', 'user2', 'Jane', 'password2', true, '0987654321', 'profile_pic2.jpg', 'Smith', '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443');


INSERT INTO `tbl_user_role` (`user_id`, `role_id`) VALUES
                                                       (2001, 2000),
                                                       (2001, 2001),
                                                       (2002, 2001);
