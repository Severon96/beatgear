package com.beatgear.backend.web

import com.beatgear.backend.dto.BookingBaseDto
import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.mapper.BookingMapper
import com.beatgear.backend.service.BookingService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController(value = "/bookings")
class BookingController(
    private val bookingService: BookingService,
) {

    @GetMapping("/current")
    fun getCurrentBookings(): List<BookingBaseDto> {
        return bookingService.getCurrentBookings().map { BookingMapper.mapToBookingBaseDto(it) }
    }

    @PostMapping("/inquire")
    fun inquireBooking(@RequestBody request: BookingInquiryDto): BookingDto {
        return BookingMapper.mapToBookingDto(bookingService.inquireBooking(request))
    }

    @GetMapping("/inquiries")
    fun getUserInquiries(): List<BookingDto> {
        return bookingService.getUserBookingInquiries().map { BookingMapper.mapToBookingDto(it) }
    }
}