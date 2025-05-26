# @alg/levenshtein

[![JSR](https://jsr.io/badges/@alg/levenshtein)](https://jsr.io/@alg/levenshtein)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://github.com/alg-js/levenshtein/blob/main/LICENSE)

Generic Levenshtein distance and Damerau-Levenshtein distance implementations.

For ordered tree edit distances,
see [@alg/zhangshasha](https://jsr.io/@alg/zhangshasha).

## Install

```
deno add jsr:@alg/levenshtein
```

## Example

Both the Levenshtein distance and Damerau-Levenshtein distance functions work on
any sequences/array-likes.

The Levenshtein `distance` function can be imported from `@alg/levenshtein`.
And, the Damerau-Levenshtein `distance` function can be imported from
`@alg/levenshtein/damerau`.

### Levenshtein Distance

```javascript
import {distance} from "@alg/levenshtein";

// Both: 2
console.log(distance("Fooo", "foo"));
console.log(distance([1, 2, 3, 4], [0, 2, 3]));
```

The default insertion, deletion, and substitution costs are 1. But these values
can be overridden:

```javascript
const options = {substitution: 3};
console.log(distance("Fooo", "foo", options));
// 3 - 2 deletes, 1 insert
```

A `maxCost` can be provided. If it is guaranteed that the distance between the
two sequences will be greater than the max cost, the function exits early and
returns a value larger than the max cost.

```javascript
const options = {maxCost: 3};
console.log(distance("Foooooooooo", "Foo", options));
// Some number greater than 3
```

A function defining the `=` relation can be given — by default `===` is used:

```javascript
const arr1 = [{val: 1}, {val: 2}, {val: 3}];
const arr2 = [{val: 2}, {val: 3}, {val: 4}];

const options = {eq: (a, b) => a.val === b.val};
console.log(distance(arr1, arr2, options));
// 2 - 1 delete, 1 insert
```

### Damerau-Levenshtein Distance

The Damerau-Levenshtein distance function is imported from the `damerau`
entrypoint and works on array-likes of primitives.

```javascript
import {distance} from "@alg/levenshtein/damerau";

// Both: 2
console.log(distance("ca", "abc"));
console.log(distance([1, 2, 3, 4], [1, 3, 2]));
```

As with the Levenshtein `distance` function, a cost object can be given. The
only caveat is that the following property must hold:
2 * transposition >= insertion + deletion

```javascript
const options = {transposition: 1, insertion: 1, deletion: 1, substitution: 2};
const dist = distance("abcdefghabcdefgh", "bdafchebgdafcheg", options);
console.log(dist);  // 15
```

Unlike the Levenshtein `distance` function, the equality operator cannot be
overridden.
