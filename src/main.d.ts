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
 * Computes the Levenshtein distance between two array-like objects.
 *
 * By default, edit operations have a cost of 1; however, different
 * `insertion`, `deletion`, and `substitution` costs can be given.
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
export function distance<T1, T2>(
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
