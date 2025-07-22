export interface RecipeData {
  title: string;
  imageURL: string;
  ingredients?: string[];
  instructions?: string[];
  yield?: string;
  activeTime?: string;
  totalTime?: string;
}

export interface Recipe {
  _id: string;
  recipe: RecipeData;
  url: string;
  preferences: string;
}
