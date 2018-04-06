// @flow
// $FlowFixMe
import moment from "moment";
// $FlowFixMe
import type Moment from "moment";

const momentRegExp = new RegExp("\\d{4}-\\d{2}-.+:.+..+");
const defaultDateStrFormat = "YYYY-MM-DD";

/**
 * formattedStringDateFor
 *   takes in dateString and converts (using moment.js) to the set
 *   default string fomat
 *
 * @param {string} dateString
 * @param {string} formatString (optional)
 * @return {string} formatted date value
 */
export function formattedStringDateFor(
  dateString: string,
  formatString: string,
) {
  if (formatString === undefined) formatString = defaultDateStrFormat;

  if (dateString == null || dateString == "") {
    return null;
  }
  return moment(dateString, moment.ISO_8601)
    .format(formatString)
    .toString();
}

/**
 * currentDateAsISOString
 *   uses moment to grab the current date and format into an ISO string
 * @return {string} ISO formatted current date
 *
 */
export function currentDateAsISOString() {
  return momentToISOString(moment());
}

/**
 * momentToISOString
 *   converts moment object to an ISO string
 *
 * @param {moment} momentObject
 * @return {string} ISO formatted string
 */
export function momentToISOString(momentObject: Moment) {
  if (!momentObject._isAMomentObject) {
    return momentObject;
  }
  return momentObject._d.toISOString();
}

/**
 * datePickerValue
 *   coverts date formats, moment iso string to default formatted string
 *   if passed string is not iso string, returns dateString
 *
 * @param {string} dateString a str representation of a date/time
 * @param {string} format (optional) alternative to default string date format
 * @return {string} a str representation of a date/time, possibly mutated
 */
export function datePickerValue(dateString: string, format: string) {
  if (momentRegExp.test(dateString)) {
    return formattedStringDateFor(dateString, format);
  }
  return dateString;
}

/**
 * onlyMomentJS
 *   only allows moment objects or null
 *   In some places, React-Datepicker requires a moment object to function.
 *   This either converts to the proper format, or lets the datepicker fail
 *   silently.
 *
 * @param {string} dateString
 * @return {?moment} moment or null if !moment
 */
export function onlyMomentJS(dateString: string): ?Moment {
  if (momentRegExp.test(dateString)) {
    return moment(dateString);
  }
  return null;
}
