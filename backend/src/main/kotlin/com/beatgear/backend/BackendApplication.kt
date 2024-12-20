package com.beatgear.backend

import jakarta.annotation.PostConstruct
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import java.util.*


@SpringBootApplication
@ComponentScan("com.beatgear.backend")
@EnableJpaRepositories(basePackages = ["com.beatgear.backend.repository"])
@EntityScan("com.beatgear.backend.model")
class BackendApplication


@PostConstruct
fun init() {
	TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
}

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)
}
