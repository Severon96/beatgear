plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.4.0"
    id("io.spring.dependency-management") version "1.1.6"
    id("org.flywaydb.flyway") version "11.1.0"
    kotlin("plugin.jpa") version "1.9.25"
}

group = "com.beatgear"
version = "0.0.1-SNAPSHOT"

ext {
    set("testcontainers.version", "1.19.8")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(20)
    }
}

repositories {
    mavenCentral()
}

flyway {
    url = "jdbc:postgresql://localhost:5432/beatgear"
    user = "postgres"
    password = ""
}

dependencies {
    runtimeOnly("org.flywaydb:flyway-gradle-plugin:11.0.1")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.4.0")
    implementation("org.springframework.boot:spring-boot-starter-web:3.4.0")
    implementation("org.springframework.boot:spring-boot-starter-security:3.4.0")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server:3.4.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("org.flywaydb:flyway-core:11.0.1")
    implementation("org.flywaydb:flyway-database-postgresql:11.0.1")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.10.3")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.3.1")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux:3.4.0")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.springframework.security:spring-security-test:6.3.0")
    testImplementation("io.mockk:mockk:1.13.14")
    testImplementation("io.rest-assured:rest-assured")
}

buildscript {
    dependencies {
        classpath("org.postgresql:postgresql:42.7.1")
        classpath("org.flywaydb:flyway-database-postgresql:10.4.1")
    }
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