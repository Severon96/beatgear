-- foreign hardware
INSERT INTO "public"."hardware" ("id", "name", "serial", "image", "category", "owner_id", "price_per_day", "created_at",
                                 "updated_at")
VALUES ('17758575-7c33-4d87-b8ac-108786d25055', 'XLR Kabel', NULL, NULL, 'CABLE_XLR',
        '909de689-c1b5-49d1-ba6e-48c913d38ca2', 2.5, '2024-11-13 16:50:28.900345', '2024-11-13 16:50:28.900345'),
       ('64a776bc-4af4-4fa0-a18d-dc39d0aa5b16', 'Pioneer Controller', 'P-12694', NULL, 'CONTROLLER',
        'e544f8ed-df11-465f-ab70-23193e5553a5', 50, '2024-11-13 16:45:48.613194', '2024-11-13 16:45:48.613194'),
       ('fe3d3b88-19d1-4c0d-90fd-506b24349718', 'Mackie Tops', 'MK-983-X-55', NULL, 'LIGHT',
        'e544f8ed-df11-465f-ab70-23193e5553a5', 10, '2024-11-13 16:49:14.252863', '2024-11-13 16:49:14.252863');

-- my hardware
INSERT INTO "public"."hardware" ("id", "name", "serial", "image", "category", "owner_id", "price_per_day", "created_at",
                                 "updated_at")
VALUES ('64a676bc-4af4-4fa0-a18d-dc39d0aa5b16', 'Pioneer Controller', 'P-12694', NULL, 'CONTROLLER',
        '909de689-c1b5-49d1-ba6e-48c913d38ca2', 50, '2024-11-13 16:45:48.613194', '2024-11-13 16:45:48.613194'),
       ('fe5d3b88-19d1-4c0d-90fd-506b24349718', 'Mackie Tops', 'MK-983-X-55', NULL, 'LIGHT',
        '909de689-c1b5-49d1-ba6e-48c913d38ca2', 10, '2024-11-13 16:49:14.252863', '2024-11-13 16:49:14.252863');

INSERT INTO "public"."bookings" ("id", "name", "customer_id", "booking_start", "booking_end", "author_id",
                                 "total_booking_days", "total_amount", "booking_confirmed", "created_at", "updated_at",
                                 "parent_booking_id")
VALUES ('bd7c965a-db08-421d-9ae7-2a95159a3c79', NULL, 'e544f8ed-df11-465f-ab70-23193e5553a5', NOW() - INTERVAL '1 DAY',
        NOW() + INTERVAL '1 DAY', 'e544f8ed-df11-465f-ab70-23193e5553a5', 2, 120, 'f', '2024-11-24 11:21:09.737081',
        '2024-11-24 11:21:09.737081', 'f03f318d-d97f-4220-a61e-1833ec1762b0'),
       ('f03f318d-d97f-4220-a61e-1833ec1762b0', NULL, 'e544f8ed-df11-465f-ab70-23193e5553a5', NOW() - INTERVAL '1 DAY',
        NOW() + INTERVAL '1 DAY', 'e544f8ed-df11-465f-ab70-23193e5553a5', 2, 120, 'f', '2024-11-24 11:21:09.74005',
        '2024-11-24 11:21:09.740059', NULL);
INSERT INTO "public"."bookings_to_hardware" ("booking_id", "hardware_id")
VALUES ('bd7c965a-db08-421d-9ae7-2a95159a3c79', '64a676bc-4af4-4fa0-a18d-dc39d0aa5b16'),
       ('bd7c965a-db08-421d-9ae7-2a95159a3c79', 'fe5d3b88-19d1-4c0d-90fd-506b24349718');