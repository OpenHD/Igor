package org.openhdfpv.angularbackend.oscategory

import org.springframework.transaction.annotation.Transactional

import org.openhdfpv.angularbackend.special.EntityNotFoundException
import org.springframework.stereotype.Service
import java.util.*

@Service
@Transactional
class OsCategoryService(
    private val osCategoryRepository: OsCategoryRepository
) {

    // Erstellt eine neue OS-Kategorie
    fun createOsCategory(osCategory: OsCategory): OsCategory {
        if (osCategoryRepository.findByName(osCategory.name) != null) {
            throw IllegalArgumentException("OS-Kategorie mit Namen '${osCategory.name}' existiert bereits.")
        }
        osCategoryRepository.incrementAllPositions()
        val newCategory = osCategory.copy(position = 0)
        return osCategoryRepository.save(newCategory)
    }

    // Aktualisiert eine bestehende Kategorie
    fun updateOsCategory(categoryId: Long, updatedData: OsCategory): OsCategory {
        val existingCategory = osCategoryRepository.findById(categoryId)
            .orElseThrow { EntityNotFoundException("OS-Kategorie mit ID $categoryId nicht gefunden") }

        // Prüfe Namenskonflikt mit anderen Kategorien
        updatedData.name.takeIf { it != existingCategory.name }?.let { newName ->
            osCategoryRepository.findByName(newName)?.let {
                throw IllegalArgumentException("OS-Kategorie mit Namen '$newName' existiert bereits.")
            }
        }

        return osCategoryRepository.save(
            existingCategory.copy(
                name = updatedData.name,
                description = updatedData.description,
                icon = updatedData.icon
            )
        )
    }

    // Löscht eine Kategorie
    fun deleteOsCategory(categoryId: Long) {
        if (!osCategoryRepository.existsById(categoryId)) {
            throw EntityNotFoundException("OS-Kategorie mit ID $categoryId nicht gefunden")
        }
        osCategoryRepository.deleteById(categoryId)
    }

    // Holt alle Kategorien
    @Transactional(readOnly = true)
    fun findAllCategories(): List<OsCategory> = osCategoryRepository.findAllByOrderByPositionAsc()

    // Holt eine Kategorie nach ID
    @Transactional(readOnly = true)
    fun findCategoryById(categoryId: Long): OsCategory =
        osCategoryRepository.findById(categoryId)
            .orElseThrow { EntityNotFoundException("OS-Kategorie mit ID $categoryId nicht gefunden") }

    // Holt eine Kategorie nach Name
    @Transactional(readOnly = true)
    fun findCategoryByName(name: String): OsCategory? =
        osCategoryRepository.findByName(name)


    // Löscht alle Kategorien
    fun deleteAll() {
        osCategoryRepository.deleteAll()
    }

    fun updateOsCategoryPartial(input: OsCategoryInputUpdate): OsCategory {
        val existingCategory = osCategoryRepository.findById(input.id)
            .orElseThrow { EntityNotFoundException("OS-Kategorie mit ID ${input.id} nicht gefunden") }

        input.name?.let { newName ->
            if (newName != existingCategory.name && osCategoryRepository.findByName(newName) != null) {
                throw IllegalArgumentException("OS-Kategorie mit Namen '$newName' existiert bereits.")
            }
            existingCategory.name = newName
        }

        input.description?.let { existingCategory.description = it }
        input.icon?.let { existingCategory.icon = it }

        input.position?.let { newPosition ->
            if (newPosition != existingCategory.position) {
                if (newPosition == 0) {
                    // Increment positions of all categories
                    osCategoryRepository.incrementAllPositions()
                } else {
                    // Adjust positions of categories between old and new positions
                    if (newPosition < existingCategory.position) {
                        osCategoryRepository.incrementPositionsBetween(newPosition, existingCategory.position)
                    } else {
                        osCategoryRepository.decrementPositionsBetween(existingCategory.position, newPosition)
                    }
                }
                existingCategory.position = newPosition
            }
        }

        return osCategoryRepository.save(existingCategory)
    }

}
