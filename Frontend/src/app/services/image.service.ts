import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://127.0.0.1:8080/admin/images';

  constructor(private http: HttpClient) { }

  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.apiUrl);
  }

  getImage(id: string): Observable<Image> {
    return this.http.get<Image>(`${this.apiUrl}/${id}`);
  }

  saveImage(image: Image): Observable<Image> {
    return this.http.post<Image>(`${this.apiUrl}/save`, this.mapToDto(image));
  }

  updateImage(image: Image): Observable<Image> {
    return this.http.post<Image>(`${this.apiUrl}/save`, this.mapToDto(image));
  }

  updateImageStatus(id: string, enabled: boolean): Observable<Image> {
    return this.http.patch<Image>(`${this.apiUrl}/${id}/status`, { enabled });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapToDto(image: Image): any {
    return {
      id: image.id,
      name: image.name,
      description: image.description,
      icon: image.icon,
      url: image.url, // Add this line to include the 'url' field
      urls: image.urls,
      backupUrls: image.backupUrls,
      extractSize: image.extractSize,
      extractSha256: image.extractSha256,
      imageDownloadSize: image.imageDownloadSize,
      isEnabled: image.isEnabled,
      categoryId: image.categoryId || image.category?.id  // Priorisiere explizite categoryId
    };
  }
}
