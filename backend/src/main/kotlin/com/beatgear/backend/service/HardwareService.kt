package com.beatgear.backend.service

import com.beatgear.backend.model.Hardware
import org.springframework.stereotype.Service

@Service
class HardwareService {

    fun getAvailableHardware(): List<Hardware> {
        return emptyList()
    }

}