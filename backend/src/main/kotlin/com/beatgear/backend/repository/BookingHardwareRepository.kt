package com.beatgear.backend.repository;

import com.beatgear.backend.model.BookingHardware
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface BookingHardwareRepository : JpaRepository<BookingHardware, UUID> {}