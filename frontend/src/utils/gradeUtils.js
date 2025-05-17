/**
 * Utility functions for handling grade conversions
 */

/**
 * Converts a grade string (e.g., "10th") to a number (e.g., 10)
 * @param {string} gradeString - The grade string to convert
 * @returns {number} The numeric value of the grade
 */
export const gradeStringToNumber = (gradeString) => {
  if (!gradeString) return null;
  return parseInt(gradeString.replace(/[^\d]/g, ""), 10);
};

/**
 * Converts a grade number (e.g., 10) to a display string (e.g., "10th")
 * @param {number} gradeNumber - The grade number to convert
 * @returns {string} The formatted grade string
 */
export const gradeNumberToString = (gradeNumber) => {
  if (!gradeNumber && gradeNumber !== 0) return "";
  return `${gradeNumber}th`;
};

/**
 * Get available grade options for dropdowns
 * @returns {Array} Array of grade objects with value and label
 */
export const getGradeOptions = () => [
  { value: "2th", label: "2th Grade", number: 2 },
  { value: "3th", label: "3th Grade", number: 3 },
  { value: "4th", label: "4th Grade", number: 4 }
];