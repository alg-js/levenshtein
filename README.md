# @alg/levenshtein-distance

[![JSR](https://jsr.io/badges/@alg/levenshtein-distance)](https://jsr.io/@alg/levenshtein-distance)
[![API](https://img.shields.io/badge/API-blue?logo=readme&logoColor=white)](https://jsr.io/@alg/levenshtein-distance/doc)
[![License](https://img.shields.io/badge/MIT-green?label=license)](https://github.com/alg/levenshtein-distance/blob/main/LICENSE)

A generic Levenshtein distance implementation.

## Install

```
deno add jsr:@alg/levenshtein-distance
```

## Example

Works on strings and arrays

```javascript
import {levenshteinDistance} from "@alg/sequences";

// Both: 2
console.log(levenshteinDistance("Fooo", "foo"));  
console.log(levenshteinDistance([1, 2, 3, 4], [0, 2, 3]));
```

The default insertion, deletion, and substitution costs are 1. But these values
can be overridden:

```javascript
const options = {substitution: 3};
console.log(levenshteinDistance("Fooo", "foo", options));
// 3 - 2 deletes, 1 insert
```

A `maxCost` can be provided. If it is guaranteed that the distance between the
two sequences will be greater than the max cost, the function exits early and
returns a value larger than the max cost.

```javascript
const options = {maxCost: 3};
console.log(levenshteinDistance("Foooooooooo", "Foo", options));
// Some number greater than 3
```

A function defining the `=` relation can be given — by default `===` is used:

```javascript
const arr1 = [{val: 1}, {val: 2}, {val: 3}];
const arr2 = [{val: 2}, {val: 3}, {val: 4}];

const options = {eq: (a, b) => JSON.stringify(a) === JSON.stringify(b)};
console.log(levenshteinDistance(arr1, arr2, options));
// 2 - 1 delete, 1 insert
```
