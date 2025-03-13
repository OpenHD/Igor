package org.openhdfpv.angularbackend.requeststats

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class LogRequest(
    val type: String,
    val origin: String,
    val relatedEntity: Boolean = false, // Optionales Zusatzfeld für Beziehung zu einer Entität
    val description: String = "" // Optionales Zusatzfeld für Beschreibung
)
