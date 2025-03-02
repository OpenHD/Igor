package org.openhdfpv.angularbackend.oscategory

import jakarta.validation.Valid
import org.springframework.http.*
import org.springframework.validation.annotation.*
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/categories")
@Validated
class OsCategoryController(
    private val osCategoryService: OsCategoryService
) {

    @GetMapping
    fun getAllCategories(): ResponseEntity<List<OsCategory>> {
        val categories = osCategoryService.findAllCategories()
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/{id}")
    fun getCategoryById(@PathVariable id: Long): ResponseEntity<OsCategory> {
        val category = osCategoryService.findCategoryById(id)
        return ResponseEntity.ok(category)
    }

    @PostMapping
    fun createCategory(@RequestBody @Valid category: OsCategory): ResponseEntity<OsCategory> {
        val savedCategory = osCategoryService.createOsCategory(category)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory)
    }

    @PutMapping("/{id}")
    fun updateCategory(
        @PathVariable id: Long,
        @RequestBody @Valid updatedCategory: OsCategory
    ): ResponseEntity<OsCategory> {
        val category = osCategoryService.updateOsCategory(id, updatedCategory)
        return ResponseEntity.ok(category)
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        osCategoryService.deleteOsCategory(id)
        return ResponseEntity.noContent().build()
    }
}
