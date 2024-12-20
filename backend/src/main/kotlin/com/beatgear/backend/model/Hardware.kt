package com.beatgear.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "hardware")
data class Hardware(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    val name: String? = null,
    val serial: String?,
    val image: String?,

    @Enumerated(EnumType.STRING)
    val category: HardwareCategory,

    val ownerId: UUID,

    @Column(name = "price_per_day", columnDefinition = "float default 0")
    val pricePerDay: Double = 0.0,

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "hardware")
    val bookingHardware: Set<BookingHardware> = emptySet()
)
