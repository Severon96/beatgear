package com.beatgear.backend.web

import IntegrationTest
import com.beatgear.backend.util.KeycloakUtil
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value

@IntegrationTest
class BookingControllerTest {

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var issuerUrl: String
    lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = KeycloakUtil.getAccessToken(issuerUrl = issuerUrl)
    }

    @Test
    fun shouldGetCurrentBookingsWithNoBookings() {
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .`when`()
            .get("/bookings/current")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(0))
    }

    @Test
    fun shouldGetCurrentBookingsWithNoBookingsButUnauthorized() {
        given()
            .contentType(ContentType.JSON)
            .`when`()
            .get("/bookings/current")
            .then()
            .statusCode(401)
    }
}