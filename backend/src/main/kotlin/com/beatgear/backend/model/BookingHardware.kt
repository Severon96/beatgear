package com.beatgear.backend.model

import jakarta.persistence.*

@Entity
data class BookingHardware(
    @EmbeddedId
    val id: BookingHardwareKey,

    @ManyToOne
    @MapsId("hardwareId")
    @JoinColumn(name = "hardware_id")
    val hardware: Hardware,

    @ManyToOne
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id")
    val booking: Booking,

    @Column(name = "price_per_day_override", columnDefinition = "float default 0")
    val pricePerDayOverride: Double = 0.0


)
