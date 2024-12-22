package com.beatgear.backend.repository

import com.beatgear.backend.model.Booking
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
@Transactional
interface BookingRepository : JpaRepository<Booking, UUID> {

    @Query(
        """
    SELECT b, bh.pricePerDayOverride 
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
    ): List<Array<Any>>

}