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
                name = "OpenHD Evo Raspberry",
                description = "Images for Raspberry-Pi SBC's",
                icon = "https://upload.wikimedia.org/wikipedia/de/thumb/c/cb/Raspberry_Pi_Logo.svg/570px-Raspberry_Pi_Logo.svg.png"
            )

            val osCategory2 = OsCategory(
                name = "OpenHD Evo Radxa",
                description = "Images for Radxa SBC's",
                icon = "https://forum.radxa.com/uploads/default/original/1X/afb83a5d13f03ccc5f26a0c5800a02e320b06468.png"
            )

            val osCategory3 = OsCategory(
                name = "OpenHD Evo X86",
                description = "Images for normal Computers",
                icon = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/ImageWriter/x86.png"
            )

            val savedCategories = osCategoryRepo.saveAll(listOf(osCategory1, osCategory2, osCategory3))

            // Images erstellen und Kategorien zuweisen
            val image1 = ImageEntity(
                name = "OpenHD-2.5.3-evo",
                description = "Improved OS, frequencies,...",
                icon = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/ImageWriter/rpi-ohd.png",
                url = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/OpenHD-image-pi-bullseye-configurable-release-2024-01-08_1550.img.xz",
                extractSize = 2866950656,
                extractSha256 = "b6dafb8cf2c3e3c9e4f3e3ad427a2f25a02b55b45334863b6bd595c71b37bda5",
                imageDownloadSize = 754596864,
                releaseDate = "2024-01-08",
                initFormat = "systemd",
                category = savedCategories.first()
            )

            val image2 = ImageEntity(
                name = "OpenHD-2.4.1-evo Rock5B",
                description = "Added custom kernel and 8812bu support, only Ground",
                icon = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/OpenHD-advanced.png",
                url = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/OpenHD-image-rock5b--2.4-evo-2023-06-30_2230.img.xz",
                extractSize = 14500000256,
                extractSha256 = "399ba04a68a7f0872a9239f096fc0da8c2aacb56b5d0d028fe3e8822f971fa2d",
                imageDownloadSize = 1698576940,
                releaseDate = "2023-06-30",
                initFormat = "systemd",
                category = savedCategories[1] // Radxa category
            )

            val image3 = ImageEntity(
                name = "OpenHD-2.4.1-evo",
                description = "updated to latest OpenHD/QOpenHD",
                icon = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/ImageWriter/x86-ohd.png",
                url = "https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/OpenHD-image-x86-jammy--2.4-evo-2023-06-30_2230.img.xz",
                extractSize = 16500000256,
                extractSha256 = "8cecff8366272328694382dc5f644b5c962e9876a11428090256379170396253",
                imageDownloadSize = 5616280016,
                releaseDate = "2023-06-30",
                initFormat = "systemd",
                category = savedCategories.last() // X86 category
            )

            // Images speichern
            val savedImages = buildImagesRepo.saveAll(listOf(image1, image2, image3))

            // ImageLists erstellen und mit Images verknüpfen
            val imagesList1 = ImagesList(
                latestVersion = "2.0.4-OpenHD",
                url = "https://openhdfpv.org/#downloads",
                name = "OpenHD Raspberry List",
                endpoint = "raspberry",
                description = "Raspberry Pi Image Collection",
                imageEntities = setOf(savedImages[0]) // Verknüpft Raspberry
            )

            val imagesList2 = ImagesList(
                latestVersion = "2.0.4-OpenHD",
                url = "https://openhdfpv.org/#downloads",
                name = "OpenHD Radxa List",
                endpoint = "radxa",
                description = "Radxa Image Collection",
                imageEntities = setOf(savedImages[1]) // Verknüpft Radxa
            )

            val imagesList3 = ImagesList(
                latestVersion = "2.0.4-OpenHD",
                url = "https://openhdfpv.org/#downloads",
                name = "OpenHD X86 List",
                endpoint = "x86",
                description = "X86 Image Collection",
                imageEntities = setOf(savedImages[2]) // Verknüpft X86
            )

            // ImageLists speichern
            imagesListRepo.saveAll(listOf(imagesList1, imagesList2, imagesList3))
        }
    }
}