package com.beatgear.backend.dto

import com.beatgear.backend.model.HardwareCategory
import java.time.LocalDateTime
import java.util.*

data class HardwareBaseDto(
    val id: UUID,
    val name: String?,
    val serial: String?,
    val image: String?,
    val category: HardwareCategory, val ownerId: UUID? = null, val pricePerDay: Double = 0.0,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
)