package com.beatgear.backend.web

import IntegrationTest
import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.mock.ModelMock
import com.beatgear.backend.model.Booking
import com.beatgear.backend.repository.BookingRepository
import com.beatgear.backend.repository.BookingWithHardwareDetails
import com.beatgear.backend.repository.HardwareRepository
import com.beatgear.backend.util.KeycloakUtil
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import io.restassured.RestAssured.given
import io.restassured.common.mapper.TypeRef
import io.restassured.http.ContentType
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import java.time.LocalDateTime
import java.util.*

@IntegrationTest
class BookingControllerTest {

    @MockkBean
    private lateinit var bookingRepository: BookingRepository

    @MockkBean
    private lateinit var hardwareRepository: HardwareRepository

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var issuerUrl: String
    lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = KeycloakUtil.getAccessToken(issuerUrl = issuerUrl)
    }

    @Test
    fun shouldGetCurrentBookingsWithNoBookings() {
        every {
            bookingRepository.findActiveBookingsWithHardware(
                any<LocalDateTime>(),
                any<UUID>()
            )
        } returns emptyList()

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
    fun shouldGetCurrentBookingsWithBookings() {
        val booking = ModelMock.createBooking()
        val bookingWithHardwareDetails = BookingWithHardwareDetails(
            booking,
            booking.bookingHardware.first().hardware,
            null
        )
        every { bookingRepository.findActiveBookingsWithHardware(any<LocalDateTime>(), any<UUID>()) } returns listOf(
            bookingWithHardwareDetails
        )

        val bookings = given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .`when`()
            .get("/bookings/current")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(1))
            .extract()
            .`as`(object : TypeRef<List<BookingDto>>() {})

        assertEquals(booking.id, bookings[0].id)
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

    @Test
    fun shouldInquireBooking() {
        val booking = ModelMock.createBooking()
        val hardware = booking.bookingHardware.map { it.hardware }
        val bookingInquiryDto = ModelMock.createBookingInquiryDtoFromBooking(booking)

        every { hardwareRepository.findAllById(any<List<UUID>>()) } returns hardware
        every { bookingRepository.saveAll(any<List<Booking>>()) } returns emptyList<Booking>()

        val bookingDto = given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(200)
            .extract()
            .`as`(BookingDto::class.java)

        assertEquals(booking.id, bookingDto.id)
        assert(Objects.isNull(booking.parentBooking))
        assert(bookingDto.hardware.isEmpty())

        verify(exactly = 1) { hardwareRepository.findAllById(any()) }
        verify(exactly = 1) { bookingRepository.saveAll(any<List<Booking>>()) }
    }

    @Test
    fun shouldNotInquireBookingWithMissingHardware() {
        val booking = ModelMock.createBooking()
        booking.bookingHardware = mutableListOf()
        val bookingInquiryDto = ModelMock.createBookingInquiryDtoFromBooking(booking)

        every { hardwareRepository.findAllById(any<List<UUID>>()) } returns emptyList()

        given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .body("message", equalTo("No valid hardware IDs were provided."))

        verify(exactly = 1) { hardwareRepository.findAllById(any()) }
    }

    @Test
    fun shouldNotInquireBookingWithMissingAccessToken() {
        val booking = ModelMock.createBooking()
        val hardware = booking.bookingHardware.map { it.hardware }
        val bookingInquiryDto = ModelMock.createBookingInquiryDtoFromBooking(booking)

        every { hardwareRepository.findAllById(any<List<UUID>>()) } returns hardware
        every { bookingRepository.saveAll(any<List<Booking>>()) } returns emptyList<Booking>()

        given()
            .contentType(ContentType.JSON)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.UNAUTHORIZED.value())

        verify(exactly = 0) { hardwareRepository.findAllById(any()) }
        verify(exactly = 0) { bookingRepository.saveAll(any<List<Booking>>()) }
    }
}