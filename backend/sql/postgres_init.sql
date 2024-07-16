CREATE DATABASE hardware_management;
CREATE DATABASE testing;

\c hardware_management;

CREATE TYPE hardware_category AS ENUM ('controller', 'light', 'cable-xlr', 'plug-cold-appliance', 'laptop-stand', 'other');

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hardware (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL,
    image bytea,
    category hardware_category NOT NULL,
    owner_id UUID REFERENCES hardware(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES users(id) NOT NULL,
    hardware_id UUID REFERENCES hardware(id) NOT NULL,
    booking_start TIMESTAMP NOT NULL,
    booking_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

\c testing;

CREATE TYPE hardware_category AS ENUM ('controller', 'light', 'cable-xlr', 'plug-cold-appliance', 'laptop-stand', 'other');

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hardware (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL,
    image bytea,
    category hardware_category NOT NULL,
    owner_id UUID REFERENCES hardware(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES users(id) NOT NULL,
    hardware_id UUID REFERENCES hardware(id) NOT NULL,
    booking_start TIMESTAMP NOT NULL,
    booking_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
