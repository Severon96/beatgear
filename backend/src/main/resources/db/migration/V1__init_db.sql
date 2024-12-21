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
    id                 UUID                                      NOT NULL,
    name               VARCHAR(30),
    customer_id        UUID                                      NOT NULL,
    booking_start      TIMESTAMP WITHOUT TIME ZONE               NOT NULL,
    booking_end        TIMESTAMP WITHOUT TIME ZONE               NOT NULL,
    author_id          UUID                                      NOT NULL,
    total_booking_days INTEGER                                   NOT NULL,
    total_amount       DOUBLE PRECISION                          NOT NULL,
    booking_confirmed  BOOLEAN                                   NOT NULL,
    created_at         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    parent_booking_id  UUID,
    CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

CREATE TABLE bookings_to_hardware
(
    booking_id              UUID,
    hardware_id             UUID,
    price_per_day_override  DOUBLE PRECISION
);

CREATE TABLE hardware
(
    id            UUID                                      NOT NULL,
    name          VARCHAR(250)                              NOT NULL,
    serial        VARCHAR(50),
    image         VARCHAR,
    category      HARDWARECATEGORY                          NOT NULL,
    owner_id      UUID                                      NOT NULL,
    price_per_day DOUBLE PRECISION                          NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT hardware_pkey PRIMARY KEY (id)
);

ALTER TABLE bookings
    ADD CONSTRAINT bookings_parent_booking_id_fkey FOREIGN KEY (parent_booking_id) REFERENCES bookings (id) ON DELETE NO ACTION;

ALTER TABLE bookings_to_hardware
    ADD CONSTRAINT bookings_to_hardware_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE NO ACTION;

ALTER TABLE bookings_to_hardware
    ADD CONSTRAINT bookings_to_hardware_hardware_id_fkey FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE NO ACTION;