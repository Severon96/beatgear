package com.beatgear.backend.web

import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.mapper.HardwareMapper
import com.beatgear.backend.service.HardwareService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController(value = "/hardware")
class HardwareController(
    private val hardwareService: HardwareService,
) {

    @GetMapping
    fun getAvailableHardware(): List<HardwareBaseDto> {
        return hardwareService.getAvailableHardware().map { HardwareMapper.mapToHardwareBaseDto(it) }
    }
}