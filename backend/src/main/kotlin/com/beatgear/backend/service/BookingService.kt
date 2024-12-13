package com.beatgear.backend.service

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.model.Booking
import org.springframework.stereotype.Service

@Service
class BookingService {

    fun getCurrentBookings(): List<Booking> {
        return emptyList()
    }

    fun inquireBooking(inquiryDto: BookingInquiryDto): Booking {
        throw NotImplementedError("Sadly you lost the track, try again.")
    }

    fun getUserBookingInquiries(): List<Booking> {
        return emptyList()
    }
}