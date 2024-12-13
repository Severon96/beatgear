package com.beatgear.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "bookings")
data class Booking(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    val name: String? = null,
    val customerId: UUID,

    val bookingStart: LocalDateTime,
    val bookingEnd: LocalDateTime,

    val authorId: UUID,
    val totalBookingDays: Int = 1,
    val totalAmount: Double = 0.0,

    @Column(name = "booking_confirmed", columnDefinition = "boolean default false")
    val bookingConfirmed: Boolean = false,

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "booking")
    val bookingHardware: Set<BookingHardware>
)
