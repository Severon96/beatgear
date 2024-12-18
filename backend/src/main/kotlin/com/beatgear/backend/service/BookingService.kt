package com.beatgear.backend.service

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.model.Booking
import com.beatgear.backend.repository.BookingRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class BookingService(
    private val bookingRepository: BookingRepository
) {

    fun getCurrentBookings(userId: UUID): List<Booking> {
        val test = bookingRepository.findActiveBookingsWithHardware(LocalDateTime.now(), userId)
        return emptyList()
    }

    fun inquireBooking(inquiryDto: BookingInquiryDto): Booking {
        throw NotImplementedError("Sadly you lost the track, try again.")
    }

    fun getUserBookingInquiries(): List<Booking> {
        return emptyList()
    }
}