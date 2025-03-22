const _ = require('lodash');

/**
 * Recursively removes "createdAt" and "updatedAt" from an object (and any nested objects/arrays).
 * @param {any} value The data to sanitize.
 * @returns {any} The same data structure without createdAt/updatedAt fields.
 */
module.exports = function removeTimestamps(value) {
  if (Array.isArray(value)) {
    return value.map(removeTimestamps);
  } else if (value instanceof Date) {
    // Convert Date -> string
    return value.toISOString();
  } else if (value && typeof value === 'object') {
    // Omit fields like createdAt/updatedAt if you want
    const newObj = _.omit(value, ['createdAt', 'updatedAt']);
    for (const key of Object.keys(newObj)) {
      newObj[key] = removeTimestamps(newObj[key]);
    }
    return newObj;
  }
  return value; // primitives remain as is
}



