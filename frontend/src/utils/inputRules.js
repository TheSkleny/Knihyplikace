/**
 *
 * @param value
 * @returns {string|boolean}
 */
const isNumberOrNull = (value) => {
  if (value === null) {
    return true
  }
  if (/^\d+$/.test(value)) {
    return true
  }
  return 'Please enter a number'
}

/**
 *
 * @param value
 * @returns {boolean|string}
 */
const isRequired = (value) => {
  if (!value) {
    return 'Toto pole je povinné'
  }
  return true
}

export { isNumberOrNull, isRequired }
