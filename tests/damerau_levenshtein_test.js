import {
    assertEquals,
    assertGreater,
    assertLess,
} from "jsr:@std/assert@1";
import fc from "npm:fast-check";
import {damerauLevenshteinDistance as dist} from "@alg/levenshtein";

Deno.test({
    name: "Simple cases",
    fn: () => {
        const cost = {
            transposition: 1, insertion: 1, deletion: 2, substitution: 4,
        };
        const cost1 = {
            transposition: 1, insertion: 1, deletion: 1, substitution: 2,
        };
        assertEquals(dist("abcdefghabcdefgh", "bdafchebgdafcheg", cost), 20);
        assertEquals(dist("abcdefghabcdefgh", "bdafchebgdafcheg", cost1), 15);
        assertEquals(dist("acbd", "abcd"), 1);
        assertEquals(dist("ca", "abc"), 2);
    },
});


Deno.test({
    name: "ArrayLikes that are equal have an edit distance of 0",
    fn: () => {
        fc.assert(fc.property(
            fc.string(),
            (aString) => assertEquals(dist(aString, aString), 0),
        ));
        fc.assert(fc.property(
            fc.array(fc.nat()),
            (anArray) => assertEquals(dist(anArray, anArray), 0),
        ));
    },
});

Deno.test({
    name: "Array likes with swaps have a transposition distance",
    fn: () => {
        assertEquals(dist("abcd", "acbd"), 1);
        assertEquals(dist("acbd", "abcd"), 1);
        assertEquals(dist("ca", "abc"), 2);
    },
});

const dataTypes = [
    {val: fc.string(), other: fc.string()},
    {val: fc.array(fc.nat()), other: fc.array(fc.nat())},
];

Deno.test({
    name: "ArrayLikes with affixes have insertion",
    fn: () => {
        for (const {val, other, eq = (a, b) => a === b} of dataTypes) {
            fc.assert(fc.property(
                val, other, fc.integer({min: 1}),
                (val, affix, cost) => {
                    const ins = {insertion: cost, transposition: cost, eq: eq};
                    const del = {deletion: cost, transposition: cost, eq: eq};
                    const prefixed = affix.concat(structuredClone(val));
                    const suffixed = structuredClone(val).concat(affix);
                    const i = val.length / 2;
                    const infixed = structuredClone(
                        val.slice(0, i).concat(affix).concat(val.slice(i)),
                    );
                    const expect = cost * affix.length;
                    assertEquals(dist(prefixed, val, del), expect);
                    assertEquals(dist(val, prefixed, ins), expect);
                    assertEquals(dist(suffixed, val, del), expect);
                    assertEquals(dist(val, suffixed, ins), expect);
                    assertEquals(dist(infixed, val, del), expect);
                    assertEquals(dist(val, infixed, ins), expect);
                },
            ));
        }
    },
});

Deno.test({
    name: "ArrayLikes with substitutions have the equivalent substitution cost",
    fn: () => {
        fc.assert(fc.property(
            fc.array(fc.integer({max: 100}), {minLength: 50}),
            fc.array(fc.integer({min: 101}), {minLength: 1, maxLength: 49}),
            fc.integer({min: 1}),
            (val, affix, cost) => {
                // Forces substitution
                const substitution = {
                    substitution: cost,
                    insertion: cost * affix.length,
                    deletion: cost * affix.length,
                    transposition: cost * affix.length,
                };
                const prefixed = affix.concat(val.slice(affix.length));
                const suffixed = val.slice(0, -affix.length).concat(affix);
                const infixed =
                    val.slice(0, Math.floor(val.length / 2 - affix.length / 2))
                        .concat(affix)
                        .concat(val.slice(
                            Math.floor(val.length / 2 + affix.length / 2),
                        ));

                const expect = cost * affix.length;
                assertEquals(dist(prefixed, val, substitution), expect);
                assertEquals(dist(val, prefixed, substitution), expect);
                assertEquals(dist(suffixed, val, substitution), expect);
                assertEquals(dist(val, suffixed, substitution), expect);
                assertEquals(dist(infixed, val, substitution), expect);
                assertEquals(dist(val, infixed, substitution), expect);
            },
        ));
    },
});

Deno.test({
    name: "ArrayLikes with a true distance over a given max cost will have distances over the max cost",
    fn: () => {
        fc.assert(fc.property(
            // Heed my warning! this is O(n^2)
            fc.integer({min: 2, max: 30}),
            (maxCost) => {
                const cost = {maxCost: maxCost};
                const value = new Array(maxCost + 10).fill(0);
                const other = new Array(maxCost + 10).fill(1);
                assertGreater(dist(value, [], cost), maxCost);
                assertGreater(dist([], value, cost), maxCost);
                assertGreater(dist(value, other, cost), maxCost);
            },
        ));
    },
});


Deno.test({
    name: "ArrayLikes with a true distance under a given max cost will have distances under the max cost",
    fn: () => {
        fc.assert(fc.property(
            // Heed my warning! this is O(n^2)
            fc.integer({min: 10, max: 30}),
            (maxCost) => {
                const cost = {maxCost: maxCost};
                const value = new Array(maxCost - 5).fill(0);
                const other = new Array(maxCost - 5).fill(1);
                assertLess(dist(value, [], cost), maxCost);
                assertLess(dist([], value, cost), maxCost);
                assertLess(dist(value, other, cost), maxCost);
            },
        ));
    },
});

Deno.test({
    name: "Two different values should have the same edit distance regardless of order with 1 edit costs",
    fn: () => {
        fc.assert(fc.property(
            fc.string(),
            fc.string(),
            (str1, str2) => {
                assertEquals(dist(str1, str2), dist(str2, str1));
            },
        ));
    },
});
