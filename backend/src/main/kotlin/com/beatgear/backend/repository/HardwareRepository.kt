package com.beatgear.backend.repository;

import com.beatgear.backend.model.Hardware
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface HardwareRepository : JpaRepository<Hardware, UUID> {
}