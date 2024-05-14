/**
 * Check if passed object is a Promise
 *
 * @param  {*}  object - object to check
 * @returns {boolean}
 */
export default function isPromise(object: Promise<any>) {
    return object && typeof object.then === 'function';
}