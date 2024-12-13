package com.beatgear.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.UUID

@Embeddable
data class BookingHardwareKey(
    @Column(name = "booking_id")
    val bookingId: UUID,

    @Column(name = "hardware_id")
    val hardwareId: UUID
): Serializable
