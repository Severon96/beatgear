package com.beatgear.backend.model

import jakarta.persistence.*

@Entity
data class BookingHardware(
    @EmbeddedId
    val id: BookingHardwareKey,

    @ManyToOne
    @MapsId("hardware_id")
    @JoinColumn(name = "hardware_id")
    val hardware: Hardware,

    @ManyToOne
    @MapsId("booking_id")
    @JoinColumn(name = "booking_id")
    val booking: Booking,

    @Column(name = "price_per_day_override", columnDefinition = "float default 0")
    val pricePerDayOverride: Double = 0.0


)
