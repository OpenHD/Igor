package org.openhdfpv.angularbackend.buildartefact

import org.openhdfpv.angularbackend.imager.ImageListService
import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.imager.ImagesListInput
import org.openhdfpv.angularbackend.imager.ImagesListPartialInput
import org.openhdfpv.angularbackend.oscategory.OsCategory
import org.openhdfpv.angularbackend.oscategory.OsCategoryInput
import org.openhdfpv.angularbackend.oscategory.OsCategoryInputUpdate
import org.openhdfpv.angularbackend.oscategory.OsCategoryService
import org.openhdfpv.angularbackend.special.EntityNotFoundException
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import java.util.UUID

@Controller
class ImageGraphQLController(
    private val imageService: ImageService,
    private val osCategoryService: OsCategoryService,
    private val imageListService: ImageListService
) {
    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getAllImagesLists(): List<ImagesList> = imageListService.getAllImagesLists()

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getImagesListById(@Argument id: Long): ImagesList =
        imageListService.getImagesListById(id)
            ?: throw EntityNotFoundException("ImagesList mit ID $id nicht gefunden.")

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getImagesListByEndpoint(@Argument endpoint: String): ImagesList =
        imageListService.getImagesListByEndpoint(endpoint)
            ?: throw EntityNotFoundException("ImagesList mit Endpunkt $endpoint nicht gefunden.")

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getAllImages(): List<ImageEntity> {
        return imageService.findAllNonDeleted()
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getImageById(@Argument id: String): ImageEntity {
        return imageService.findById(UUID.fromString(id))
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun getAllCategories(): List<OsCategory> {
        return osCategoryService.findAllCategories()
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun createImage(@Argument input: ImageInput): ImageEntity {
        return imageService.saveFromDto(input.toDTO())
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun deleteImage(@Argument id: String): Boolean {
        imageService.delete(UUID.fromString(id))
        return true
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun createImagesList(@Argument input: ImagesListInput): ImagesList {
        val imageEntities = input.imageIds?.map { imageId ->
            imageService.findById(UUID.fromString(imageId))
        }?.toSet() ?: emptySet()

        return imageListService.createImagesList(
            ImagesList(
                latestVersion = input.latestVersion,
                url = input.url,
                name = input.name,
                endpoint = input.endpoint,
                description = input.description,
                imageEntities = imageEntities
            )
        )
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateImagesList(@Argument id: Long, @Argument input: ImagesListInput): ImagesList {
        val existingList = imageListService.getImagesListById(id)
            ?: throw EntityNotFoundException("ImagesList mit ID $id nicht gefunden.")

        val imageEntities = input.imageIds?.map { imageId ->
            imageService.findById(UUID.fromString(imageId))
        }?.toSet() ?: existingList.imageEntities

        val updatedList = ImagesList(
            id = id,
            latestVersion = input.latestVersion,
            url = input.url,
            name = input.name,
            endpoint = input.endpoint,
            description = input.description,
            imageEntities = imageEntities
        )
        return imageListService.updateImagesList(id, updatedList)
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun deleteImagesList(@Argument id: Long): Boolean {
        imageListService.deleteImagesList(id)
        return true
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun addImageToImagesList(
        @Argument imagesListId: Long,
        @Argument imageId: String
    ): ImagesList {
        val image = imageService.findById(UUID.fromString(imageId))
        return imageListService.addImageToImagesList(imagesListId, image)
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun removeImageFromImagesList(
        @Argument imagesListId: Long,
        @Argument imageId: String
    ): ImagesList {
        val image = imageService.findById(UUID.fromString(imageId))
        return imageListService.removeImageFromImagesList(imagesListId, image)
    }


    // Mutationen für OsCategory
    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun createOsCategory(@Argument input: OsCategoryInput): OsCategory {
        return osCategoryService.createOsCategory(
            OsCategory(
                name = input.name,
                description = input.description,
                icon = input.icon
            )
        )
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateOsCategory(
        @Argument id: Long,
        @Argument input: OsCategoryInput
    ): OsCategory {
        val updatedCategory = OsCategory(
            id = id,
            name = input.name,
            description = input.description,
            icon = input.icon
        )
        return osCategoryService.updateOsCategory(id, updatedCategory)
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun deleteOsCategory(@Argument id: Long): Boolean {
        osCategoryService.deleteOsCategory(id)
        return true
    }

    // Fehlende Update-Mutation für Image
    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateImage(@Argument id: String, @Argument input: ImageInput): ImageEntity {
        val imageId = UUID.fromString(id)
        val dto = input.toDTO().copy(id = imageId)
        return imageService.saveFromDto(dto)
    }

    @PreAuthorize("isAuthenticated()")
    @SchemaMapping(typeName = "ImagesList", field = "images")
    fun getImagesForList(imagesList: ImagesList): List<ImageEntity> {
        return imagesList.imageEntities.toList() ?: emptyList()
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun images(): List<ImageEntity> = imageService.findAllNonDeleted()

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun image(@Argument id: String): ImageEntity = imageService.findById(UUID.fromString(id))

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun osCategories(): List<OsCategory> = osCategoryService.findAllCategories()

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun imagesLists(): List<ImagesList> = imageListService.getAllImagesLists()

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun imagesList(@Argument id: Long): ImagesList =
        imageListService.getImagesListById(id) ?: throw EntityNotFoundException("ImagesList mit ID $id nicht gefunden.")

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    fun imagesListByEndpoint(@Argument endpoint: String): ImagesList =
        imageListService.getImagesListByEndpoint(endpoint) ?: throw EntityNotFoundException("ImagesList mit Endpunkt $endpoint nicht gefunden.")

    // Mutation-Methoden für partielle Updates hinzufügen
    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateImagePartial(@Argument id: String, @Argument input: ImagePartialInput): ImageEntity {
        val imageId = UUID.fromString(id)
        return imageService.updateImagePartial(imageId, input)
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateImagesListPartial(@Argument id: Long, @Argument input: ImagesListPartialInput): ImagesList {
        return imageListService.updateImagesListPartial(id, input)
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    fun updateOsCategoryPartial(@Argument input: OsCategoryInputUpdate): OsCategory {
        return osCategoryService.updateOsCategoryPartial(input)
    }

    // Schema-Mapping für Image.imagesLists
    @PreAuthorize("isAuthenticated()")
    @SchemaMapping(typeName = "Image", field = "imagesLists")
    fun getImagesListsForImage(image: ImageEntity): List<String> {
        return imageListService.findImagesListsByImageId(image.id!!).map { it.toString() }
    }


}


