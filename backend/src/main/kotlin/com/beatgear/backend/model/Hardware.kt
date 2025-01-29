package com.beatgear.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.proxy.HibernateProxy
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "hardware")
data class Hardware(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    val name: String? = null,
    val serial: String?,
    val image: String?,

    @Enumerated(EnumType.STRING)
    @ColumnTransformer(write="?::hardwarecategory")
    val category: HardwareCategory,

    var ownerId: UUID,

    @Column(name = "price_per_day", columnDefinition = "float default 0")
    val pricePerDay: Double = 0.0,

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "hardware")
    val bookingHardware: Set<BookingHardware> = emptySet()
) {
    final override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false

        other as Hardware
        return id != null && id == other.id
    }

    final override fun hashCode(): Int =
        if (this is HibernateProxy) this.hibernateLazyInitializer.persistentClass.hashCode() else javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(  id = $id   ,   name = $name   ,   serial = $serial   ,   image = $image   ,   category = $category   ,   ownerId = $ownerId   ,   pricePerDay = $pricePerDay   ,   createdAt = $createdAt   ,   updatedAt = $updatedAt )"
    }
}
