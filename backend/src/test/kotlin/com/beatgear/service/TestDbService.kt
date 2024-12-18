package com.beatgear.service

import com.beatgear.backend.model.Booking
import com.beatgear.backend.model.BookingHardware
import com.beatgear.backend.repository.BookingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class TestDbService(
    bookingRepository: BookingRepository
) {
    @Autowired
    private lateinit var bookingRepository: BookingRepository

    fun createBooking(intercept: (Booking) -> Void): Booking {
        val bookingStart = LocalDateTime.now().minusDays(2)
        val bookingEnd = LocalDateTime.now().plusDays(1)

        val hardware = emptySet<BookingHardware>()

        val booking = Booking(
            id = UUID.randomUUID(),
            name = "Test Booking",
            customerId = UUID.randomUUID(),
            bookingStart = bookingStart,
            bookingEnd = bookingEnd,
            authorId = UUID.randomUUID(),
            totalBookingDays = 4,
            totalAmount = 50.0,
            bookingConfirmed = false,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
            bookingHardware = hardware
        )

        intercept(booking)

        bookingRepository.save(booking)

        return booking
    }

}