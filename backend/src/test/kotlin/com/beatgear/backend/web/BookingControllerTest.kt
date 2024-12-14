package com.beatgear.backend.web

import IntegrationTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.junit.jupiter.api.Test

@IntegrationTest
class BookingControllerTest {

    @Test
    fun shouldGetCurrentBookingsWithNoBookings() {
        given()
            .contentType(ContentType.JSON)
            .`when`()
            .get("/api/customers")
            .then()
            .statusCode(200)
    }
}