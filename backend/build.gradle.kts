plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.4.0"
	id("io.spring.dependency-management") version "1.1.6"
	kotlin("plugin.jpa") version "1.9.25"
}

group = "com.beatgear"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(20)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.3.2")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client:3.3.2")
	implementation("org.springframework.boot:spring-boot-starter-web:3.3.2")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.1")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.mapstruct:mapstruct:1.6.3")
	implementation("org.postgresql:postgresql:42.7.3")
	testImplementation("org.springframework.boot:spring-boot-starter-test:3.3.1")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.security:spring-security-test:6.3.0")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.10.3")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
