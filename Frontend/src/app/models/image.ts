import {OsCategory} from './osCategory';
import {ImageUrl} from './ImageUrl';

export interface Image {
  id: string;
  name: string;
  description: string;
  icon: string;
  urls: ImageUrl[];
  url: string;
  backupUrls: string[];
  extractSize: number;
  extractSha256: string;
  imageDownloadSize: number;
  isEnabled: boolean;
  isAvailable: boolean;
  redirectsCount: number;
  category?: OsCategory;
  createdAt?: Date;
  updatedAt?: Date;
}
