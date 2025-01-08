package com.beatgear.backend.repository

import com.beatgear.backend.model.Hardware
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface HardwareRepository : JpaRepository<Hardware, UUID> {

    @Query(
        """
            SELECT h
            FROM Hardware h
            WHERE h.ownerId != :userId
        """
    )
    fun findAvailableHardware(userId: UUID): List<Hardware>

}