export interface Recipe {
  id: string;
  title: string;
  imageURL: string;
  ingredients?: string[];
  instructions?: string[];
  yield?: string;
  activeTime?: string;
  totalTime?: string;
  url: string;
  preferences: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
