package com.beatgear.backend.repository

import com.beatgear.backend.model.Booking
import com.beatgear.backend.model.Hardware
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

data class BookingWithHardwareDetails(
    val booking: Booking,
    val hardware: Hardware,
    val pricePerDayOverride: Double?
)

@Repository
@Transactional
interface BookingRepository : JpaRepository<Booking, UUID> {

    @Query(
        """
    SELECT b, bh.pricePerDayOverride, bh.hardware 
    FROM Booking b 
    JOIN b.bookingHardware bh 
    WHERE b.bookingEnd >= :now 
      AND b.customerId = :userId 
      AND b.parentBooking IS NULL
    """
    )
    fun findActiveBookingsWithHardware(
        now: LocalDateTime,
        userId: UUID
    ): List<BookingWithHardwareDetails>

}