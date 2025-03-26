package com.beatgear.backend.web

import com.beatgear.backend.dto.HardwareBaseDto
import com.beatgear.backend.mapper.HardwareMapper
import com.beatgear.backend.service.HardwareService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal
import java.util.*

@RestController
@RequestMapping("/hardware")
class HardwareController(
    private val hardwareService: HardwareService,
) {

    @GetMapping
    fun getAvailableHardware(principal: Principal): List<HardwareBaseDto> {
        val userId = UUID.fromString(principal.name)
        return hardwareService.getAvailableHardware(userId).map { HardwareMapper.mapToHardwareBaseDto(it) }
    }
}