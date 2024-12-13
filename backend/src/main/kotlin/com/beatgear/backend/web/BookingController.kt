package com.beatgear.backend.web

import com.beatgear.backend.model.Booking
import com.beatgear.backend.service.BookingService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController(value = "/bookings")
class BookingController(private val bookingService: BookingService) {

    @GetMapping("/current")
    fun getCurrentBookings(): List<Booking> {
        return bookingService.getCurrentBookings()
    }
}