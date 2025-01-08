package com.beatgear.backend.service

import com.beatgear.backend.model.Hardware
import com.beatgear.backend.repository.HardwareRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class HardwareService(private val hardwareRepository: HardwareRepository) {

    fun getAvailableHardware(userId: UUID): List<Hardware> {
        return hardwareRepository.findAvailableHardware(userId)
    }

}