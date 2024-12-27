package com.beatgear.backend.mock

import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.model.*
import java.time.LocalDateTime
import java.util.*

object ModelMock {

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

        if (hardware.isEmpty()) {
            val hardwareModel1 = createHardware()
            val hardwareModel2 = createHardware()

            booking.bookingHardware = mutableListOf(
                createBookingHardware(booking, hardwareModel1),
                createBookingHardware(booking, hardwareModel2),
            )
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

        return hardware
    }

    fun createBookingInquiryDtoFromBooking(booking: Booking): BookingInquiryDto {
        return BookingInquiryDto(
            id = booking.id ?: UUID.randomUUID(),
            name = booking.name,
            customerId = booking.customerId,
            bookingStart = booking.bookingStart,
            bookingEnd = booking.bookingEnd,
            authorId = booking.authorId,
            totalBookingDays = booking.totalBookingDays,
            totalAmount = booking.totalAmount,
            bookingConfirmed = booking.bookingConfirmed,
            hardwareIds = booking.bookingHardware.map { it.hardware.id ?: UUID.randomUUID() },
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt,
        )
    }

}