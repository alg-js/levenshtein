/* Copyright 2025 @alg/levenshtein contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Computes the Damerau–Levenshtein distance between two array-like objects.
 *
 * By default, edit operations have a cost of 1; however different `insertion`,
 * `deletion`, `substitution`, and `transposition` costs can be given provided
 * the following property holds:
 * 2 * transposition >= insertion + deletion
 *
 * If `maxCost` is given, the function stops as soon as it is guaranteed the
 * edit distance will be greater than the `maxCost` and a value larger than
 * `maxCost` is returned.
 *
 * Note: while the Levenshtein `distance` function provided by this package
 * works for any object, the Damerau-Levenshtein `distance` function works for
 * any primitive type.
 *
 * @template T
 * @param {ArrayLike<T>} a
 * @param {ArrayLike<T>} b
 * @param {Object=} options
 * @param{number=} options.insertion
 * @param{number=} options.deletion
 * @param{number=} options.substitution
 * @param{number=} options.transposition
 * @param{number=} options.maxCost
 * @returns {number}
 */
export function distance<
    T extends string | number | bigint | boolean | undefined | symbol | null
>(
    a: ArrayLike<T>,
    b: ArrayLike<T>,
    options?: {
        insertion?: number;
        deletion?: number;
        substitution?: number;
        transposition?: number;
        maxCost?: number;
    },
): number;
