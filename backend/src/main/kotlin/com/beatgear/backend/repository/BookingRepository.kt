package com.beatgear.backend.repository;

import com.beatgear.backend.model.Booking
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface BookingRepository : JpaRepository<Booking, UUID> {
}