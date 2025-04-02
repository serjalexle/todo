export const capitalize = (str: string, index: number = 0): string => {
  // If the index is out of bounds, return the string in uppercase
  if (index < 0) {
    return str.toUpperCase();
  }

  return str.charAt(index).toUpperCase() + str.slice(index + 1).toLowerCase();
};
