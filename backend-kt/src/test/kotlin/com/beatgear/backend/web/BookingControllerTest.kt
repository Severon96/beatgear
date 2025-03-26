package com.beatgear.backend.web

import IntegrationTest
import com.beatgear.backend.dto.BookingDto
import com.beatgear.backend.mock.TEST_USER_UUID
import com.beatgear.backend.mock.TestDbService
import com.beatgear.backend.model.Booking
import com.beatgear.backend.util.KeycloakUtil
import io.restassured.RestAssured.given
import io.restassured.common.mapper.TypeRef
import io.restassured.http.ContentType
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import java.util.*

@IntegrationTest
class BookingControllerTest {

    @Autowired
    private lateinit var testDbService: TestDbService

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var issuerUrl: String
    lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = KeycloakUtil.getAccessToken(issuerUrl = issuerUrl)
        testDbService.clearDatabase()
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
    fun shouldGetCurrentBookingsWithBookings() {
        val booking = testDbService.createBooking { it.bookingHardware = mutableListOf() }
        testDbService.saveBooking(booking)
        val childBooking = testDbService.createBooking {
            it.parentBooking = booking
        }
        testDbService.saveBooking(childBooking)

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

        assertBookingEquals(booking, bookings[0])
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
        val booking = testDbService.createBooking()
        booking.bookingHardware.forEach { testDbService.saveHardware(it.hardware)
        }
        val bookingInquiryDto = testDbService.createBookingInquiryDtoFromBooking(booking)

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

        assertBookingEquals(booking, bookingDto)
        assert(Objects.isNull(booking.parentBooking))
        assert(bookingDto.hardware.isEmpty())
        assertEquals(3, testDbService.countBookings())
    }

    @Test
    fun shouldInquireBookingWithMissingHardwareWithoutHardwareAvailable() {
        val booking = testDbService.createBooking()
        booking.bookingHardware = mutableListOf()
        val bookingInquiryDto = testDbService.createBookingInquiryDtoFromBooking(booking)

        val bookingDto = given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.OK.value())
            .extract()
            .`as`(BookingDto::class.java)

        assertBookingEquals(booking, bookingDto)
        assert(Objects.isNull(booking.parentBooking))
        assert(bookingDto.hardware.isEmpty())
        assertEquals(1, testDbService.countBookings())
    }

    @Test
    fun shouldNotInquireBookingWithMissingHardwareButHardwareAvailable() {
        testDbService.saveHardware()
        val booking = testDbService.createBooking()
        booking.bookingHardware = mutableListOf()
        val bookingInquiryDto = testDbService.createBookingInquiryDtoFromBooking(booking)

        given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .body("message", equalTo("No valid hardware IDs were provided."))
    }

    @Test
    fun shouldNotInquireBookingWitOwnHardware() {
        val hardware = testDbService.createHardware {
            it.ownerId = TEST_USER_UUID
        }
        testDbService.saveHardware(hardware)
        val booking = testDbService.createBooking(listOf(hardware))
        val bookingInquiryDto = testDbService.createBookingInquiryDtoFromBooking(booking)

        given()
            .contentType(ContentType.JSON)
            .header("Authorization", accessToken)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .body("message", equalTo("Not allowed to book own hardware."))
    }

    @Test
    fun shouldNotInquireBookingWithMissingAccessToken() {
        val booking = testDbService.createBooking()
        val bookingInquiryDto = testDbService.createBookingInquiryDtoFromBooking(booking)

        given()
            .contentType(ContentType.JSON)
            .body(bookingInquiryDto)
            .`when`()
            .post("/bookings/inquire")
            .then()
            .statusCode(HttpStatus.UNAUTHORIZED.value())
    }

    private fun assertBookingEquals(booking: Booking, bookingDto: BookingDto) {
        assertEquals(booking.name, bookingDto.name)
        assertEquals(booking.customerId, bookingDto.customerId)
        assertEquals(booking.bookingStart.toLocalDate(), bookingDto.bookingStart?.toLocalDate())
        assertEquals(booking.bookingEnd.toLocalDate(), bookingDto.bookingEnd?.toLocalDate())
        assertEquals(booking.authorId, bookingDto.authorId)
        assertEquals(booking.totalBookingDays, bookingDto.totalBookingDays)
        assertEquals(booking.totalAmount, bookingDto.totalAmount)
        assertEquals(booking.bookingConfirmed, bookingDto.bookingConfirmed)
    }
}