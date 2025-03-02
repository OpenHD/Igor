import {Category} from './category';

export interface Image {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  backupUrls: string[];
  extractSize: number;
  extractSha256: string;
  imageDownloadSize: number;
  isEnabled: boolean;
  isAvailable: boolean;
  redirectsCount: number;
  category?: Category;
}
