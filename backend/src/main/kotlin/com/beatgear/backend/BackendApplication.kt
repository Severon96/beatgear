package com.beatgear.backend

import jakarta.annotation.PostConstruct
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Profile
import java.util.*


@Profile("dev")
@SpringBootApplication
class BackendApplication


@PostConstruct
fun init() {
	TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
}

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)
}
