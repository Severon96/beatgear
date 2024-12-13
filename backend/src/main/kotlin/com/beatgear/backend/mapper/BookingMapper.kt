package com.beatgear.backend.mapper

import com.beatgear.backend.dto.BookingBaseDto
import com.beatgear.backend.model.Booking
import org.mapstruct.Mapper
import org.mapstruct.Named

@Mapper
interface BookingMapper {

    @Named("mapToBookingBaseDto")
    fun mapToBookingBaseDto(booking: Booking): BookingBaseDto
}