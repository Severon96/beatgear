package com.beatgear.backend.service

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.mapper.BookingMapper
import com.beatgear.backend.model.Booking
import com.beatgear.backend.repository.BookingRepository
import com.beatgear.backend.repository.BookingWithHardwareDetails
import com.beatgear.backend.repository.HardwareRepository
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatus
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
    fun inquireBooking(inquiryDto: BookingInquiryDto, userId: UUID): Booking {
        val hardwareCount = hardwareRepository.count()
        val dbHardware = hardwareRepository.findAllById(inquiryDto.hardwareIds)

        require(hardwareCount == 0L || dbHardware.size > 0) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "No valid hardware IDs were provided."
            )
        }

        val hardwareByOwnerId = dbHardware.groupBy { it.ownerId }

        val mainBooking = BookingMapper.mapBookingInquiryToBooking(inquiryDto)

        bookingRepository.save(mainBooking)

        hardwareByOwnerId.map { (_, hardware) ->
            if (hardware.any { it.ownerId == userId }) throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Not allowed to book own hardware."
            )

            bookingRepository.save(BookingMapper.mapBookingInquiryToBooking(inquiryDto, mainBooking, hardware))
        }

        return mainBooking
    }

    @Transactional
    fun getUserBookingInquiries(userId: UUID): List<Booking> {
        return bookingRepository.findUserInquiries(userId)
    }
}