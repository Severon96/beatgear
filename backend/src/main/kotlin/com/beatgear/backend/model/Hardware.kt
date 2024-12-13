package com.beatgear.backend.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "hardware")
data class Hardware(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    val name: String? = null
)
