package com.beatgear.backend.mapper

import com.beatgear.backend.dto.BookingBaseDto
import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.dto.HardwareDto
import com.beatgear.backend.model.Booking
import com.beatgear.backend.model.BookingHardware
import org.mapstruct.IterableMapping
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Named

@Mapper(uses = [HardwareMapper::class])
interface BookingMapper {

    @Named("mapToBookingBaseDto")
    fun mapToBookingBaseDto(booking: Booking): BookingBaseDto

    @Mapping(
        source = "bookingHardware",
        target = "hardware",
        qualifiedByName = ["mapNestedHardware"]
    )
    fun mapToBookingDto(booking: Booking): BookingDto

    @IterableMapping(qualifiedByName = ["mapToHardwareBaseDto"])
    @Named("mapNestedHardware")
    fun mapNestedHardware(entities: Array<BookingHardware>): Array<HardwareDto>
}