package com.beatgear.backend.web

import IntegrationTest
import IntegrationTest.Initializer.Companion.accessToken
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.apache.http.client.utils.URIBuilder
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.boot.json.JacksonJsonParser
import org.springframework.http.MediaType
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import java.util.*

@IntegrationTest
@TestInstance(TestInstance.Lifecycle.PER_METHOD)
class BookingControllerTest {

    lateinit var accessToken: String

    companion object {
        @BeforeAll
        @JvmStatic
        fun beforeAll() {
            val authorizationURI = URIBuilder("$issuerUrl/protocol/openid-connect/token").build()

            val webClient = WebClient.builder().build()
            val formData = LinkedMultiValueMap<String, String>()
            formData["grant_type"] = Collections.singletonList("password")
            formData["client_id"] = Collections.singletonList("baeldung-api")
            formData["username"] = Collections.singletonList("jane.doe@baeldung.com")
            formData["password"] = Collections.singletonList("s3cr3t")

            val result = webClient.post()
                .uri(authorizationURI)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(String::class.java)
                .block()

            val jsonParser = JacksonJsonParser()
            accessToken = "Bearer " + jsonParser.parseMap(result)["access_token"].toString()
        }
    }

    @Test
    fun shouldGetCurrentBookingsWithNoBookings() {
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $accessToken")
            .`when`()
            .get("/api/customers")
            .then()
            .statusCode(200)
    }
}