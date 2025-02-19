package org.openhdfpv.angularbackend

import org.openhdfpv.angularbackend.buildartefact.BuildImagesRepository
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.imager.ImagesListRepository
import org.openhdfpv.angularbackend.oscategory.OsCategory
import org.openhdfpv.angularbackend.oscategory.OsCategoryRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Configuration
@Profile("dev")
class DummyDataLoader {

    @Bean
    fun dummyDataInitializer(
        imagesListRepo: ImagesListRepository,
        osCategoryRepo: OsCategoryRepository,
        buildImagesRepo: BuildImagesRepository
    ): CommandLineRunner {
        return CommandLineRunner { _ ->
            // Kategorien erstellen
            val osCategory1 = OsCategory(
                name = "Android",
                description = "Android devices and OS",
                icon = "android.png"
            )

            val osCategory2 = OsCategory(
                name = "Linux",
                description = "Linux Distributions",
                icon = "linux.png"
            )

            val savedCategories = osCategoryRepo.saveAll(listOf(osCategory1, osCategory2))

            // Images erstellen und Kategorien zuweisen
            val image1 = ImageEntity(
                name = "Android 11 Image",
                description = "Latest Android 11 release",
                icon = "android11.png",
                url = "https://example.com/android11.img",
                extractSize = 1024 * 1024 * 2L, // Beispielgröße: 2MB
                extractSha256 = "abcdef1234567890",
                imageDownloadSize = 20480, // Beispielgröße: 20MB
                releaseDate = "2023-01-01",
                initFormat = "img",
                category = savedCategories.first()
            )

            val image2 = ImageEntity(
                name = "Ubuntu 22.04",
                description = "Ubuntu LTS version",
                icon = "ubuntu22.png",
                url = "https://example.com/ubuntu22.img",
                extractSize = 1024 * 1024 * 5L, // Beispielgröße: 5MB
                extractSha256 = "123456abcdef7890",
                imageDownloadSize = 51200, // Beispielgröße: 50MB
                releaseDate = "2022-04-01",
                initFormat = "img",
                category = savedCategories.last() // Linux-Kategorie
            )

            val image3 = ImageEntity(
                name = "Custom Linux Distro",
                description = "Custom designed Linux distribution",
                icon = "custom_linux.png",
                url = "https://example.com/custom_linux.img",
                extractSize = 1024 * 1024 * 3L,
                extractSha256 = "0987654321fedcba",
                imageDownloadSize = 30720, // 30MB
                releaseDate = "2023-02-15",
                initFormat = "iso",
                category = savedCategories.last()
            )

            // Images speichern
            val savedImages = buildImagesRepo.saveAll(listOf(image1, image2, image3))

            // ImageLists erstellen und mit Images verknüpfen
            val imagesList1 = ImagesList(
                latestVersion = "v1.0",
                url = "https://example.com/list1",
                name = "Official Images",
                endpoint = "list1",
                description = "Official image collection for Android and Linux",
                imageEntities = setOf(savedImages[0], savedImages[1]) // Verknüpft Android mit Ubuntu
            )

            val imagesList2 = ImagesList(
                latestVersion = "v2.0",
                url = "https://example.com/list2",
                name = "Custom Images",
                endpoint = "list2",
                description = "Custom Linux images",
                imageEntities = setOf(savedImages[0],savedImages[2]) // Verknüpft nur Custom Linux
            )

            // ImageLists speichern
            imagesListRepo.saveAll(listOf(imagesList1, imagesList2))
        }
    }
}