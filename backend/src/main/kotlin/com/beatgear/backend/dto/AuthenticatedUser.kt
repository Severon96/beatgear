package com.beatgear.backend.dto

import java.util.*

data class AuthenticatedUser(
    val userId: UUID,
    val username: String,
    val roles: List<String>
)
