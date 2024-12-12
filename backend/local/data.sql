INSERT INTO `tbl_role` (`id`, `name`) VALUES
                                          (2000, 'Admin'),
                                          (2001, 'User'),
                                          (2002, 'Realtor');

INSERT INTO `tbl_user` (
    `id`, `email`, `google_user_id_token_subject`, `login`, `name`, `password`,
    `phone_number`, `profile_pic`, `surname`, `created_at`, `updated_at`
) VALUES
      (2001, 'user1@example.com', 'abc123', 'user1', 'John', 'password1', '1234567890', 'profile_pic1.jpg', 'Doe', '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443'),
      (2002, 'user2@example.com', 'def456', 'user2', 'Jane', 'password2', '0987654321', 'profile_pic2.jpg', 'Smith', '2024-10-04 21:28:48.102443', '2024-10-04 21:28:48.102443');


INSERT INTO `tbl_user_role` (`user_id`, `role_id`) VALUES
                                                       (2001, 1),
                                                       (2002, 1);