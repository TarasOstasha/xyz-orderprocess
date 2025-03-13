const _ = require('lodash');

/**
 * Recursively removes "createdAt" and "updatedAt" from an object (and any nested objects/arrays).
 * @param {any} value The data to sanitize.
 * @returns {any} The same data structure without createdAt/updatedAt fields.
 */
function removeTimestamps(value) {
  if (Array.isArray(value)) {
    // If it's an array, map over each element recursively
    return value.map(removeTimestamps);
  } else if (value && typeof value === 'object') {
    // If it's an object, omit the timestamp fields
    const newObj = _.omit(value, ['createdAt', 'updatedAt']);

    // Then recurse into each remaining key
    for (const key of Object.keys(newObj)) {
      if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = removeTimestamps(newObj[key]);
      }
    }
    return newObj;
  }
  // For primitives (string, number, null, etc.), just return as is
  return value;
}

module.exports = { removeTimestamps };
