package com.beatgear.backend.dto

import java.time.LocalDateTime
import java.util.*

data class BookingDto(
    val id: UUID,
    val name: String?,
    val customerId: UUID?,
    val bookingStart: LocalDateTime?,
    val bookingEnd: LocalDateTime?,
    val authorId: UUID?, val totalBookingDays: Int = 1, val totalAmount: Double = 0.0,
    val bookingConfirmed: Boolean = false, val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val hardware: List<HardwareDto> = emptyList()
)
