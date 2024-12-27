package com.beatgear.backend.mapper

import com.beatgear.backend.dto.BookingBaseDto
import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.dto.BookingInquiryDto
import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.model.Booking
import com.beatgear.backend.model.BookingHardware
import com.beatgear.backend.model.BookingHardwareKey
import com.beatgear.backend.model.Hardware
import com.beatgear.backend.repository.BookingWithHardwareDetails
import java.time.LocalDateTime
import java.util.*

object BookingMapper {

    fun mapToBookingBaseDto(bookingWithHardwareDetails: List<BookingWithHardwareDetails>): List<BookingDto> {
        val bookingsGroupedById = bookingWithHardwareDetails.groupBy { it.booking.id }

        return bookingsGroupedById.map { (_, detailsList) ->
            val booking = detailsList.first().booking

            val hardwareList = buildHardwareDtosFromBookingWithHardwareDetails(detailsList)

            BookingDto(
                id = booking.id ?: UUID.randomUUID(),
                name = booking.name,
                customerId = booking.customerId,
                bookingStart = booking.bookingStart,
                bookingEnd = booking.bookingEnd,
                authorId = booking.authorId,
                totalBookingDays = booking.totalBookingDays,
                totalAmount = booking.totalAmount,
                bookingConfirmed = booking.bookingConfirmed,
                createdAt = booking.createdAt,
                updatedAt = booking.updatedAt,
                hardware = hardwareList
            )
        }
    }

    fun mapToBookingBaseDto(booking: Booking): BookingBaseDto {
        return BookingBaseDto(
            id=booking.id ?: UUID.randomUUID(),
            name=booking.name,
            customerId = booking.customerId,
            bookingStart = booking.bookingStart,
            bookingEnd = booking.bookingEnd,
            authorId = booking.authorId,
            totalBookingDays = booking.totalBookingDays,
            totalAmount = booking.totalAmount,
            bookingConfirmed = booking.bookingConfirmed,
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt,
        )
    }

    fun mapToBookingDto(booking: Booking): BookingDto {
        return BookingDto(
            id=booking.id ?: UUID.randomUUID(),
            name=booking.name,
            customerId = booking.customerId,
            bookingStart = booking.bookingStart,
            bookingEnd = booking.bookingEnd,
            authorId = booking.authorId,
            totalBookingDays = booking.totalBookingDays,
            totalAmount = booking.totalAmount,
            bookingConfirmed = booking.bookingConfirmed,
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt,
            hardware = mapNestedHardware(booking.bookingHardware)
        )
    }

    fun mapBookingInquiryToBooking(booking: BookingInquiryDto, parentBooking: Booking? = null, hardware: List<Hardware> = emptyList(), id: UUID = UUID.randomUUID()): Booking {
        val dbBooking = Booking(
            id = id,
            name = booking.name,
            customerId = booking.customerId ?: UUID.randomUUID(),
            bookingStart = booking.bookingStart ?: LocalDateTime.now(),
            bookingEnd = booking.bookingEnd ?: LocalDateTime.now(),
            authorId = booking.authorId ?: UUID.randomUUID(),
            totalBookingDays = booking.totalBookingDays,
            totalAmount = booking.totalAmount,
            parentBooking = parentBooking,
            bookingConfirmed = booking.bookingConfirmed,
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt,
        )

        val bookingHardware = hardware.map { mapHardwareToBookingHardware(it, dbBooking) }

        dbBooking.bookingHardware = bookingHardware.toMutableList()

        return dbBooking
    }

    private fun mapHardwareToBookingHardware(hardware: Hardware, booking: Booking): BookingHardware {
        return BookingHardware(
            id = BookingHardwareKey(
                bookingId = booking.id ?: UUID.randomUUID(),
                hardwareId = hardware.id ?: UUID.randomUUID(),
            ),
            hardware = hardware,
            booking = booking
        )
    }

    private fun mapNestedHardware(entities: List<BookingHardware>): List<HardwareBaseDto> {
        return entities.map { HardwareMapper.mapToHardwareBaseDto(it.hardware) }
    }

    private fun buildHardwareDtosFromBookingWithHardwareDetails(bookingWithHardwareDetails: List<BookingWithHardwareDetails>): List<HardwareBaseDto> {
        val hardwareList = bookingWithHardwareDetails.map { details ->
            val hardwareDto = HardwareMapper.mapToHardwareBaseDto(details.hardware)
            val updatedHardwareDto = if (Objects.nonNull(details.pricePerDayOverride)) {
                hardwareDto.copy(pricePerDay = details.pricePerDayOverride ?: details.hardware.pricePerDay)
            } else {
                hardwareDto
            }
            updatedHardwareDto
        }
        return hardwareList
    }
}