CREATE TYPE hardwarecategory AS ENUM (
    'CONTROLLER',
    'LIGHT',
    'CABLE_XLR',
    'PLUG_COLD_APPLIANCE',
    'LAPTOP_STAND',
    'OTHER'
);

CREATE TABLE bookings
(
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name               VARCHAR(255),
    customer_id        UUID                                       NOT NULL,
    booking_start      TIMESTAMP                                  NOT NULL,
    booking_end        TIMESTAMP                                  NOT NULL,
    author_id          UUID                                       NOT NULL,
    total_booking_days INT              DEFAULT 1                 NOT NULL,
    total_amount       DOUBLE PRECISION DEFAULT 0.0               NOT NULL,
    booking_confirmed  BOOLEAN          DEFAULT FALSE             NOT NULL,
    parent_booking_id  UUID,
    created_at         TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at         TIMESTAMP        DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE bookings_to_hardware
(
    booking_id             UUID,
    hardware_id            UUID,
    price_per_day_override DOUBLE PRECISION
);

CREATE TABLE hardware
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(250)     NOT NULL,
    serial        VARCHAR(50),
    image         VARCHAR,
    category      HARDWARECATEGORY NOT NULL,
    owner_id      UUID             NOT NULL,
    price_per_day DOUBLE PRECISION NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE bookings
    ADD CONSTRAINT bookings_parent_booking_id_fkey FOREIGN KEY (parent_booking_id) REFERENCES bookings (id) ON DELETE NO ACTION;

ALTER TABLE bookings_to_hardware
    ADD CONSTRAINT bookings_to_hardware_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE NO ACTION;

ALTER TABLE bookings_to_hardware
    ADD CONSTRAINT bookings_to_hardware_hardware_id_fkey FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE NO ACTION;