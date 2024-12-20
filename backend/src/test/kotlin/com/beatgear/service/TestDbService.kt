package com.beatgear.service

import com.beatgear.backend.model.*
import com.beatgear.backend.repository.BookingRepository
import com.beatgear.backend.repository.HardwareRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class TestDbService {

    @Autowired
    private lateinit var bookingRepository: BookingRepository

    @Autowired
    private lateinit var hardwareRepository: HardwareRepository

    fun createBooking(
        hardware: List<Hardware> = emptyList(),
        intercept: (Booking) -> Unit = {}
    ): Booking {
        val bookingStart = LocalDateTime.now().minusDays(2)
        val bookingEnd = LocalDateTime.now().plusDays(1)

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
        )

        intercept(booking)

        bookingRepository.save(booking)

        if (hardware.isEmpty()) {
            val hardwareModel = createHardware()
            createBookingHardware(booking, hardwareModel)
        }

        return booking
    }

    fun createBookingHardware(
        booking: Booking,
        hardware: Hardware,
        intercept: (BookingHardware) -> Unit = {}
    ): BookingHardware {
        val bookingHardware = BookingHardware(
            id = BookingHardwareKey(
                bookingId = booking.id ?: UUID.randomUUID(),
                hardwareId = hardware.id ?: UUID.randomUUID()
            ),
            hardware = hardware,
            booking = booking
        )

        intercept(bookingHardware)

        return bookingHardware
    }

    fun createHardware(intercept: (Hardware) -> Unit = {}): Hardware {
        val hardware = Hardware(
            id = UUID.randomUUID(),
            name = "Test Hardware",
            serial = "HW162742",
            image = null,
            category = HardwareCategory.CONTROLLER,
            ownerId = UUID.randomUUID(),
            pricePerDay = 50.0,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
        )

        intercept(hardware)

        hardwareRepository.save(hardware)

        return hardware
    }

}