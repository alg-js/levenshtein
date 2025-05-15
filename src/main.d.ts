/**
 * Every day I pray for <https://tc39.es/proposal-type-annotations/>
 */

/**
 * Computes the Levenshtein distance between two array-like objects.
 *
 * Different `insertion`, `deletion`, and `substitution` costs can be given.
 *
 * If `maxCost` is given, the function stops as soon as it is guaranteed the
 * edit distance will be greater than the `maxCost` and a value larger than
 * `maxCost` is returned.
 *
 * `eq` is a function that determines equality between elements from
 * `a` and `b`. By default, uses the strict equality operator `===`
 *
 * @template T1
 * @template T2
 * @param {ArrayLike<T1>} a
 * @param {ArrayLike<T2>} b
 * @param {Object=} options
 * @param{number=} options.insertion
 * @param{number=} options.deletion
 * @param{number=} options.substitution
 * @param{number=} options.maxCost
 * @param{((e1: T1, e2: T2) => boolean)=} options.eq
 * @returns {number}
 */
export function levenshteinDistance<T1, T2>(
    a: ArrayLike<T1>,
    b: ArrayLike<T2>,
    options?: {
        insertion?: number;
        deletion?: number;
        substitution?: number;
        maxCost?: number;
        eq?: (e1: T1, e2: T2) => boolean;
    },
): number;

/**
 * Computes the Damerau–Levenshtein distance between two array-like objects.
 *
 * Different `insertion`, `deletion`, `substitution`, and `transposition` costs
 * can be given.
 *
 * If `maxCost` is given, the function stops as soon as it is guaranteed the
 * edit distance will be greater than the `maxCost` and a value larger than
 * `maxCost` is returned.
 *
 * Note: while the `levenshteinDistance` function provided by this package
 * works for any object, the `damerauLevenshteinDistance` function works for
 * any primitive type.
 *
 * @template T1
 * @template T2
 * @param {ArrayLike<T1>} a
 * @param {ArrayLike<T2>} b
 * @param {Object=} options
 * @param{number=} options.insertion
 * @param{number=} options.deletion
 * @param{number=} options.substitution
 * @param{number=} options.transposition
 * @param{number=} options.maxCost
 * @returns {number}
 */
export function damerauLevenshteinDistance<
    T1 extends string | number | bigint | boolean | undefined | symbol | null,
    T2 extends string | number | bigint | boolean | undefined | symbol | null,
>(
    a: ArrayLike<T1>,
    b: ArrayLike<T2>,
    options?: {
        insertion?: number;
        deletion?: number;
        substitution?: number;
        transposition?: number;
        maxCost?: number;
    },
): number;
