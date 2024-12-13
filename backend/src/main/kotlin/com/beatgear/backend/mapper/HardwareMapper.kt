package com.beatgear.backend.mapper

import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.dto.HardwareDto
import com.beatgear.backend.model.BookingHardware
import com.beatgear.backend.model.Hardware
import org.mapstruct.IterableMapping
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Named

@Mapper(uses = [BookingMapper::class])
interface HardwareMapper {

    @Named("mapToHardwareBaseDto")
    fun mapToHardwareBaseDto(hardware: Hardware): HardwareBaseDto

    @Mapping(
        source = "bookingHardware",
        target = "bookings",
        qualifiedByName = ["mapNestedBookings"]
    )
    fun mapToHardwareDto(hardware: Hardware): HardwareDto

    @IterableMapping(qualifiedByName = ["mapToBookingBaseDto"])
    @Named("mapNestedBookings")
    fun mapNestedBookings(entities: Array<BookingHardware>): Array<BookingDto>
}