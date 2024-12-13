package com.beatgear.backend.web

import com.beatgear.backend.dto.HardwareDto
import com.beatgear.backend.mapper.HardwareMapper
import com.beatgear.backend.service.HardwareService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController(value = "/hardware")
class HardwareController(
    private val hardwareService: HardwareService,
    private val hardwareMapper: HardwareMapper
) {

    @GetMapping
    fun getAvailableHardware(): List<HardwareDto> {
        return hardwareService.getAvailableHardware().map { hardwareMapper.mapToHardwareDto(it) }
    }
}