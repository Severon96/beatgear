package com.beatgear.backend.service

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.model.Booking
import com.beatgear.backend.repository.BookingRepository
import com.beatgear.backend.repository.BookingWithHardwareDetails
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class BookingService(
    private val bookingRepository: BookingRepository
) {

    @Transactional
    fun getCurrentBookings(userId: UUID): List<BookingWithHardwareDetails> {
        return bookingRepository.findActiveBookingsWithHardware(LocalDateTime.now(), userId)
    }

    @Transactional
    fun inquireBooking(inquiryDto: BookingInquiryDto): Booking {
        throw NotImplementedError("Sadly you lost the track, try again.")
    }

    @Transactional
    fun getUserBookingInquiries(): List<Booking> {
        return emptyList()
    }
}