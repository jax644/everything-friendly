import { Recipe } from "../interfaces/interfaces";

/**
 * Validates if a URL string is properly formatted
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if an array of strings is not empty and contains valid strings
 */
export function isValidStringArray(arr: any): arr is string[] {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

/**
 * Validates if a string is not empty and properly formatted
 */
export function isValidString(str: any): str is string {
  return typeof str === "string" && str.trim().length > 0;
}

/**
 * Validates if a string is a valid string (allows empty strings for optional fields)
 */
export function isValidStringOrEmpty(str: any): str is string {
  return typeof str === "string";
}

/**
 * Comprehensive recipe validation function
 * Returns true if the recipe is valid, false otherwise
 */
export function isValidRecipe(recipe: any): recipe is Recipe {
  if (!recipe || typeof recipe !== "object") return false;

  // Check required fields
  if (!isValidString(recipe.title)) return false;
  if (!isValidString(recipe.url) || !isValidUrl(recipe.url)) return false;
  if (!isValidString(recipe.preferences)) return false;

  // Check optional fields - if they exist, they should be valid strings (allowing empty strings)
  if (recipe.imageURL !== undefined && !isValidStringOrEmpty(recipe.imageURL))
    return false;
  if (recipe.yield !== undefined && !isValidStringOrEmpty(recipe.yield))
    return false;
  if (
    recipe.activeTime !== undefined &&
    !isValidStringOrEmpty(recipe.activeTime)
  )
    return false;
  if (recipe.totalTime !== undefined && !isValidStringOrEmpty(recipe.totalTime))
    return false;

  // Check arrays - if they exist, they should be valid arrays
  if (
    recipe.ingredients !== undefined &&
    !isValidStringArray(recipe.ingredients)
  )
    return false;
  if (
    recipe.instructions !== undefined &&
    !isValidStringArray(recipe.instructions)
  )
    return false;

  return true;
}

/**
 * Gets validation errors for a recipe
 * Returns an array of error messages, empty array if recipe is valid
 */
export function getRecipeValidationErrors(recipe: any): string[] {
  const errors: string[] = [];

  if (!recipe || typeof recipe !== "object") {
    errors.push("Recipe data is missing or invalid");
    return errors;
  }

  if (!isValidString(recipe.title)) {
    errors.push("Recipe title is required and must be a non-empty string");
  }

  if (!isValidString(recipe.url)) {
    errors.push("Recipe URL is required and must be a non-empty string");
  } else if (!isValidUrl(recipe.url)) {
    errors.push("Recipe URL must be a valid URL format");
  }

  if (!isValidString(recipe.preferences)) {
    errors.push(
      "Recipe preferences are required and must be a non-empty string"
    );
  }

  if (recipe.imageURL !== undefined && !isValidStringOrEmpty(recipe.imageURL)) {
    errors.push("Recipe image URL must be a valid string if provided");
  }

  if (recipe.yield !== undefined && !isValidStringOrEmpty(recipe.yield)) {
    errors.push("Recipe yield must be a valid string if provided");
  }

  if (
    recipe.activeTime !== undefined &&
    !isValidStringOrEmpty(recipe.activeTime)
  ) {
    errors.push("Recipe active time must be a valid string if provided");
  }

  if (
    recipe.totalTime !== undefined &&
    !isValidStringOrEmpty(recipe.totalTime)
  ) {
    errors.push("Recipe total time must be a valid string if provided");
  }

  if (
    recipe.ingredients !== undefined &&
    !isValidStringArray(recipe.ingredients)
  ) {
    errors.push(
      "Recipe ingredients must be a non-empty array of strings if provided"
    );
  }

  if (
    recipe.instructions !== undefined &&
    !isValidStringArray(recipe.instructions)
  ) {
    errors.push(
      "Recipe instructions must be a non-empty array of strings if provided"
    );
  }

  return errors;
}
