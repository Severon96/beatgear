package com.beatgear.backend.mapper

import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.model.Hardware
import org.mapstruct.Mapper
import org.mapstruct.Named

@Mapper
interface HardwareMapper {

    @Named("mapToHardwareBaseDto")
    fun mapToHardwareBaseDto(hardware: Hardware): HardwareBaseDto
}