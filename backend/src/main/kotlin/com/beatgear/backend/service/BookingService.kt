package com.beatgear.backend.service

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.mapper.BookingMapper
import com.beatgear.backend.model.Booking
import com.beatgear.backend.repository.BookingRepository
import com.beatgear.backend.repository.BookingWithHardwareDetails
import com.beatgear.backend.repository.HardwareRepository
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatusCode
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.util.*

@Service
class BookingService(
    private val bookingRepository: BookingRepository,
    private val hardwareRepository: HardwareRepository,
) {

    @Transactional
    fun getCurrentBookings(userId: UUID): List<BookingWithHardwareDetails> {
        return bookingRepository.findActiveBookingsWithHardware(LocalDateTime.now(), userId)
    }

    @Transactional
    fun inquireBooking(inquiryDto: BookingInquiryDto): Booking {
        val dbHardware = hardwareRepository.findAllById(inquiryDto.hardwareIds)

        require(dbHardware.size > 0) { throw ResponseStatusException(HttpStatusCode.valueOf(400), "No valid hardware IDs were provided.") }

        val hardwareByOwnerId = dbHardware.groupBy { it.ownerId }

        val mainBooking = BookingMapper.mapBookingInquiryToBooking(inquiryDto)

        val bookingsToSave = mutableListOf(mainBooking)

        hardwareByOwnerId.map { (_, hardware) ->
            bookingsToSave.add(BookingMapper.mapBookingInquiryToBooking(inquiryDto, mainBooking, hardware))
        }

        bookingRepository.saveAll(bookingsToSave)

        return mainBooking
    }

    @Transactional
    fun getUserBookingInquiries(): List<Booking> {
        return emptyList()
    }
}