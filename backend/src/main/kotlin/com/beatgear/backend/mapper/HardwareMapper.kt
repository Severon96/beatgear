package com.beatgear.backend.mapper

import com.beatgear.backend.dto.BookingBaseDto
import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.dto.HardwareDto
import com.beatgear.backend.model.BookingHardware
import com.beatgear.backend.model.Hardware
import java.util.*

object HardwareMapper {

    fun mapToHardwareBaseDto(hardware: Hardware): HardwareBaseDto {
        return HardwareBaseDto(
            id = hardware.id ?: UUID.randomUUID(),
            name = hardware.name,
            serial = hardware.serial,
            image = hardware.image,
            category = hardware.category,
            ownerId = hardware.ownerId,
            pricePerDay = hardware.pricePerDay,
            createdAt = hardware.createdAt,
            updatedAt = hardware.updatedAt,
        )
    }

    fun mapToHardwareDto(hardware: Hardware): HardwareDto {
        return HardwareDto(
            id = hardware.id ?: UUID.randomUUID(),
            name = hardware.name,
            serial = hardware.serial,
            image = hardware.image,
            category = hardware.category,
            ownerId = hardware.ownerId,
            pricePerDay = hardware.pricePerDay,
            createdAt = hardware.createdAt,
            updatedAt = hardware.updatedAt,
            bookings = mapNestedBookings(hardware.bookingHardware)
        )
    }

    private fun mapNestedBookings(entities: Set<BookingHardware>): List<BookingBaseDto> {
        return entities.map { BookingMapper.mapToBookingBaseDto(it.booking) }
    }
}