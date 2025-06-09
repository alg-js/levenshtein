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

/* @ts-self-types="./damerau.d.ts" */

export function distance(
    a, b,
    {
        insertion = 1,
        deletion = 1,
        substitution = 1,
        transposition = 1,
        maxCost = null,
    } = {},
) {
    const minInsert = (b.length - a.length) * insertion;
    const minDelete = (a.length - b.length) * deletion;
    if (a.length === 0 || maxCost !== null && minInsert > maxCost) {
        return insertion * (b.length - a.length);
    } else if (b.length === 0 || maxCost !== null && minDelete > maxCost) {
        return deletion * (a.length - b.length);
    }

    const da = {};

    const d = [];
    for (let i = 0; i < a.length + 2; i++) {
        const row = new Array(b.length + 2).fill(0);
        d.push(row);
    }

    const maxDist = a.length * deletion + b.length * insertion;
    d[0][0] = maxDist;
    for (let i = 0; i < a.length + 1; i++) {
        d[i + 1][0] = maxDist;
        d[i + 1][1] = i * deletion;
    }
    for (let j = 0; j < b.length + 1; j++) {
        d[0][j + 1] = maxDist;
        d[1][j + 1] = j * insertion;
    }

    for (let i = 1; i < a.length + 1; i++) {
        let db = 0;
        let min = maxCost + 1;
        for (let j = 1; j < b.length + 1; j++) {
            const k = b[j - 1] in da ? da[b[j - 1]] : 0;
            const l = db;
            if (a[i - 1] === b[j - 1]) {
                db = j;
            }
            d[i + 1][j + 1] = Math.min(
                d[i][j] + (a[i - 1] === b[j - 1] ? 0 : substitution),
                d[i + 1][j] + insertion,
                d[i][j + 1] + deletion,
                (
                    d[k][l]
                    + deletion * (i - k - 1)
                    + transposition +
                    insertion * (j - l - 1)
                ),
            );
            min = Math.min(d[i + 1][j + 1], min);
        }
        da[a[i - 1]] = i;
        if (maxCost !== null && min > maxCost) {
            return maxCost + 1;
        }
    }
    return d[a.length + 1][b.length + 1];
}