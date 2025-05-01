/* @ts-self-types="./main.d.ts" */

/**
 * @template T
 * @typedef {{length: number, [index: number]: T}} Sequence<T>
 * @typedef {string|Sequence<T>} ArrayLike<T>
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
 * @param{number} insertion
 * @param{number} deletion
 * @param{number} substitution
 * @param{?number} maxCost
 * @param{?((e1: T1, e2: T2) => boolean)} eq
 * @returns {number}
 */
export function levenshteinDistance(
    a, b,
    {
        insertion = 1,
        deletion = 1,
        substitution = 1,
        maxCost = null,
        eq = ((e1, e2) => (e1 === e2)),
    } = {},
) {
    let v0 = new Array(b.length + 1).fill(0);
    let v1 = new Array(b.length + 1).fill(0);

    for (let i = 0; i < b.length + 1; i++) {
        v0[i] = i * insertion;
    }

    for (let i = 0; i < a.length; i++) {
        v1[0] = (i + 1) * deletion;
        for (let j = 0; j < b.length; j++) {
            v1[j + 1] = Math.min(
                v0[j + 1] + deletion,
                v1[j] + insertion,
                v0[j] + (eq(a[i], b[j]) ? 0 : substitution),
            );
        }
        [v0, v1] = [v1, v0];
        if (maxCost !== null && v0.at(-1) > maxCost) {
            return maxCost + 1;
        }
    }
    return v0.at(-1);
}
