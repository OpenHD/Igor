import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // Dummy-Daten
  private mockImages: Image[] = [
    {
      id: '1',
      name: 'Image 1',
      description: 'Description for Image 1',
      icon: 'https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/ImageWriter/x86-ohd.png',
      url: 'https://example.com/image1.png',
      backupUrls: ['https://backup.example.com/image1.png'],
      extractSize: 12345,
      extractSha256: 'sha256hash1',
      imageDownloadSize: 54321,
      isEnabled: true,
      isAvailable: true,
      redirectsCount: 0,
      category: { name: 'Category 1' } // Jetzt ein 'Category'-Objekt
    },
    {
      id: '2',
      name: 'Image 2',
      description: 'Description for Image 2',
      icon: 'https://fra1.digitaloceanspaces.com/openhd-images/Downloader/OpenHD-advanced.png',
      url: 'https://example.com/image2.png',
      backupUrls: ['https://backup.example.com/image2.png'],
      extractSize: 22345,
      extractSha256: 'sha256hash2',
      imageDownloadSize: 64321,
      isEnabled: false,
      isAvailable: true,
      redirectsCount: 1,
      category: { name: 'Category 2' } // Jetzt ein 'Category'-Objekt
    },
    {
      id: '3',
      name: 'Image 3',
      description: 'Description for Image 3',
      icon: 'https://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/ImageWriter/rpi-ohd.png',
      url: 'https://example.com/image3.png',
      backupUrls: ['https://backup.example.com/image3.png'],
      extractSize: 32345,
      extractSha256: 'sha256hash3',
      imageDownloadSize: 74321,
      isEnabled: true,
      isAvailable: false,
      redirectsCount: 2,
      category: { name: 'Category 3' } // Jetzt ein 'Category'-Objekt
    },
  ];

  // Dummy-Daten zurückgeben
  getImages(): Observable<Image[]> {
    return of(this.mockImages);
  }

  updateImageStatus(id: string, enabled: boolean): Observable<Image> {
    const image = this.mockImages.find(img => img.id === id);
    if (image) {
      image.isEnabled = enabled;
    }
    return of(image!); // `!` bedeutet, wir versichern TypeScript, dass die Variable nicht null ist
  }

  deleteImage(id: string): Observable<void> {
    this.mockImages = this.mockImages.filter(img => img.id !== id);
    return of(); // Löschaktion
  }

  saveImage(image: Image): Observable<Image> {
    image.id = (this.mockImages.length + 1).toString(); // Neue ID generieren
    this.mockImages.push(image);
    return of(image);
  }

  updateImage(image: Image): Observable<Image> {
    const index = this.mockImages.findIndex(img => img.id === image.id);
    if (index > -1) {
      this.mockImages[index] = image;
    }
    return of(image);
  }
}
