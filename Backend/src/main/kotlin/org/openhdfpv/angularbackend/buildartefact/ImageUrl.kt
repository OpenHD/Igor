package org.openhdfpv.angularbackend.buildartefact

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
open class ImageUrl(
    @Column(nullable = false) open var url: String,
    open var isAvailable: Boolean = false,
    open var isDefault: Boolean = false
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ImageUrl) return false
        return url == other.url && isAvailable == other.isAvailable && isDefault == other.isDefault
    }

    override fun hashCode(): Int {
        var result = url.hashCode()
        result = 31 * result + isAvailable.hashCode()
        result = 31 * result + isDefault.hashCode()
        return result
    }

    override fun toString(): String {
        return "ImageUrl(url='$url', isAvailable=$isAvailable, isDefault=$isDefault)"
    }
}
