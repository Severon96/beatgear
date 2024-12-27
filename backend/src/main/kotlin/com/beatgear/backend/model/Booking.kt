package com.beatgear.backend.model

import jakarta.persistence.*
import org.hibernate.proxy.HibernateProxy
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "bookings")
data class Booking(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    val name: String? = null,
    val customerId: UUID,

    val bookingStart: LocalDateTime,
    val bookingEnd: LocalDateTime,

    val authorId: UUID,
    val totalBookingDays: Int = 1,
    val totalAmount: Double = 0.0,

    @Column(name = "booking_confirmed", columnDefinition = "boolean default false")
    val bookingConfirmed: Boolean = false,

    @OneToMany(mappedBy = "parentBooking", cascade = [(CascadeType.ALL)])
    var childBookings: MutableList<Booking> = mutableListOf(),

    @ManyToOne(cascade = [(CascadeType.ALL)])
    @JoinColumn(name = "parent_booking_id", referencedColumnName = "id")
    var parentBooking: Booking? = null,

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(
        mappedBy = "booking",
        targetEntity = BookingHardware::class,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    var bookingHardware: MutableList<BookingHardware> = mutableListOf()
) {
    final override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false

        other as Booking
        return id != null && id == other.id
    }

    final override fun hashCode(): Int =
        if (this is HibernateProxy) this.hibernateLazyInitializer.persistentClass.hashCode() else javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(  id = $id   ,   name = $name   ,   customerId = $customerId   ,   bookingStart = $bookingStart   ,   bookingEnd = $bookingEnd   ,   authorId = $authorId   ,   totalBookingDays = $totalBookingDays   ,   totalAmount = $totalAmount   ,   bookingConfirmed = $bookingConfirmed   ,   parentBooking = $parentBooking   ,   createdAt = $createdAt   ,   updatedAt = $updatedAt )"
    }
}
