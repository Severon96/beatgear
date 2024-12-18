package com.beatgear.backend.repository;

import com.beatgear.backend.model.Booking
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime
import java.util.*

interface BookingRepository : JpaRepository<Booking, UUID> {

    @Query("SELECT b, bh.pricePerDayOverwrite FROM Booking b " +
            "JOIN b.hardware h " +
            "JOIN BookingToHardware bh ON bh.booking.id = b.id AND bh.hardware.id = h.id " +
            "WHERE b.bookingEnd >= :now " +
            "AND b.customerId = :userId " +
            "AND b.parentBookingId IS NULL")
    fun findActiveBookingsWithHardware(
        now: LocalDateTime,
        userId: UUID
    ): List<Array<Any>>

}