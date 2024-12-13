package com.beatgear.backend.service

import com.beatgear.backend.model.Booking
import org.springframework.stereotype.Service

@Service
class BookingService {

    fun getCurrentBookings(): List<Booking> {
        return emptyList()
    }

}