package com.beatgear.backend.web

import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.mapper.BookingMapper
import com.beatgear.backend.service.BookingService
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@RestController
@RequestMapping("/bookings")
class BookingController(
    private val bookingService: BookingService,
) {

    @GetMapping("/current")
    fun getCurrentBookings(jwt: Principal): List<BookingDto> {
        val userId = UUID.fromString(jwt.name)
        val currentBookings = bookingService.getCurrentBookings(userId)

        return BookingMapper.mapToBookingBaseDto(currentBookings)
    }

    @PostMapping("/inquire")
    fun inquireBooking(@RequestBody request: BookingInquiryDto, jwt: Principal): BookingDto {
        val userId = UUID.fromString(jwt.name)
        return BookingMapper.mapToBookingDto(bookingService.inquireBooking(request, userId))
    }

    @GetMapping("/inquiries")
    fun getUserInquiries(): List<BookingDto> {
        return bookingService.getUserBookingInquiries().map { BookingMapper.mapToBookingDto(it) }
    }
}