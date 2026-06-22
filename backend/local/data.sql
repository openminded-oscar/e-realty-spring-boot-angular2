-- ==========================================
-- USER PHOTOS
-- ==========================================

INSERT INTO tbl_user_photo (id, filename) VALUES
                                              (1, 'user_1.jpg'),
                                              (2, 'user_2.jpg'),
                                              (3, 'user_3.jpg');

-- ==========================================
-- ROLES
-- ==========================================

INSERT INTO tbl_role (id, name) VALUES
                                    (1, 'USER'),
                                    (2, 'REALTOR'),
                                    (3, 'ADMIN');

-- ==========================================
-- USERS
-- ==========================================

INSERT INTO tbl_user (
    id,
    created_at,
    updated_at,
    email,
    google_user_id_token_subject,
    login,
    name,
    password,
    phone_number,
    surname,
    is_user_confirmed,
    photo_id
) VALUES
      (
          1,
          NOW(),
          NOW(),
          'oleh@example.com',
          'google-sub-1',
          'oleh',
          'Oleh',
          '$2a$10$dummyhash',
          '+380671111111',
          'Kosar',
          b'1',
          1
      ),
      (
          2,
          NOW(),
          NOW(),
          'vika@example.com',
          'google-sub-2',
          'vika',
          'Viktoriia',
          '$2a$10$dummyhash',
          '+380672222222',
          'Kosar',
          b'1',
          2
      ),
      (
          3,
          NOW(),
          NOW(),
          'client@example.com',
          NULL,
          'client',
          'Andriy',
          '$2a$10$dummyhash',
          '+380673333333',
          'Client',
          b'0',
          3
      );

-- ==========================================
-- USER ROLES
-- ==========================================

INSERT INTO tbl_user_role (user_id, role_id) VALUES
                                                 (1, 1),
                                                 (1, 2),
                                                 (2, 1),
                                                 (3, 1);

-- ==========================================
-- REALTORS
-- ==========================================

INSERT INTO tbl_realtor (id, user_id) VALUES
    (1, 1);

-- ==========================================
-- EMAIL TOKENS
-- ==========================================

INSERT INTO email_confirmation_token (
    id,
    created_date,
    expiration_date,
    token,
    user_id
) VALUES
    (
        1,
        NOW(),
        DATE_ADD(NOW(), INTERVAL 1 DAY),
        'token-user-3',
        3
    );

-- ==========================================
-- CONFIRMATION DOCS
-- ==========================================

INSERT INTO tbl_confirmation_doc_photo (
    id,
    filename
) VALUES
      (1, 'ownership_doc_1.jpg'),
      (2, 'ownership_doc_2.jpg');

-- ==========================================
-- REALTY OBJECTS
-- ==========================================

INSERT INTO tbl_realty_object (
    id,
    created_at,
    updated_at,
    apt_number,
    city,
    geolocation,
    number_of_street,
    region_id,
    region_lat,
    region_lng,
    region_name,
    street,
    building_type,
    description,
    dwelling_type,
    floor,
    foundation_year,
    has_cellar,
    has_garage,
    has_loft,
    has_repairing,
    living_area,
    other_info,
    price,
    price_for_rent,
    rooms_amount,
    status,
    total_area,
    total_floors,
    realty_object_id,
    owner_id,
    realtor_id
)
VALUES
    (
        1,
        NOW(),
        NOW(),
        15,
        'Lviv',
        ST_GeomFromText('POINT(24.031592 49.842957)', 4326),
        '10',
        1,
        49.842957,
        24.031592,
        'Lvivska',
        'Shevchenka',
        'BRICK',
        'Modern apartment',
        'APARTMENT',
        3,
        2018,
        b'0',
        b'1',
        b'0',
        b'1',
        52.50,
        'Near city center',
        95000,
        NULL,
        2,
        'ACTIVE',
        65.00,
        9,
        1,
        2,
        1
    ),
    (
        2,
        NOW(),
        NOW(),
        NULL,
        'Lviv',
        ST_GeomFromText('POINT(24.020000 49.850000)', 4326),
        '25',
        1,
        49.850000,
        24.020000,
        'Lvivska',
        'Horodotska',
        'WOODEN',
        'House with garden',
        'HOUSE',
        NULL,
        2005,
        b'1',
        b'1',
        b'1',
        b'1',
        120.00,
        'Large backyard',
        180000,
        1200,
        4,
        'ACTIVE',
        150.00,
        2,
        2,
        1,
        1
    );

-- ==========================================
-- SUPPORTED OPERATIONS
-- ==========================================

INSERT INTO tbl_object_supported_operations (
    object_id,
    operation_type
) VALUES
      (1, 'SELLING'),
      (1, 'RENT'),
      (2, 'SELLING');

-- ==========================================
-- REALTY OBJECT PHOTOS
-- ==========================================

INSERT INTO tbl_realty_object_photo (
    id,
    filename,
    photo_type,
    realty_object_id
) VALUES
      (1, 'apt_front.jpg', 'REALTY_MAIN', 1),
      (2, 'apt_kitchen.jpg', 'REALTY_PLAIN', 1),
      (3, 'house_front.jpg', 'REALTY_MAIN', 2);

-- ==========================================
-- INTERESTS
-- ==========================================

INSERT INTO tbl_interest (
    id,
    realty_obj_id,
    user_id,
    created_at,
    updated_at
) VALUES
      (
          1,
          1,
          3,
          NOW(),
          NOW()
      ),
      (
          2,
          2,
          2,
          NOW(),
          NOW()
      );

-- ==========================================
-- REVIEWS / VIEWINGS
-- ==========================================

INSERT INTO tbl_object_review (
    id,
    date_time,
    realty_obj_id,
    user_id,
    created_at,
    updated_at,
    realtor_id,
    approved
) VALUES
      (
          1,
          DATE_ADD(NOW(), INTERVAL 1 DAY),
          1,
          3,
          NOW(),
          NOW(),
          1,
          b'0'
      ),
      (
          2,
          DATE_ADD(NOW(), INTERVAL 2 DAY),
          2,
          2,
          NOW(),
          NOW(),
          1,
          b'1'
      );