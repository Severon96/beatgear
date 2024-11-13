CREATE DATABASE beatgear;
CREATE DATABASE testing;

\c beatgear;

CREATE TYPE hardwarecategory AS ENUM ('CONTROLLER', 'LIGHT', 'CABLE_XLR', 'PLUG_COLD_APPLIANCE', 'LAPTOP_STAND', 'OTHER');

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    name VARCHAR(30),
    customer_id UUID NOT NULL,
    booking_start TIMESTAMP NOT NULL,
    booking_end TIMESTAMP NOT NULL,
    author_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE hardware (
    id UUID PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    serial VARCHAR(50),
    image VARCHAR,
    category hardwarecategory NOT NULL,
    owner_id UUID NOT NULL,
    price_per_day REAL NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE bookings_to_hardware (
    booking_id UUID,
    hardware_id UUID,
    FOREIGN KEY (booking_id) REFERENCES bookings (id),
    FOREIGN KEY (hardware_id) REFERENCES hardware (id)
);
