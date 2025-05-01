import {assertEquals, assertGreater} from "jsr:@std/assert@1";
import fc from "npm:fast-check";
import {levenshteinDistance as distance} from "@alg/levenshtein";

Deno.test({
    name: "ArrayLikes that are equal have an edit distance of 0",
    fn: () => {
        fc.assert(fc.property(
            fc.string(),
            (aString) => assertEquals(distance(aString, aString), 0),
        ));
        fc.assert(fc.property(
            fc.array(fc.nat()),
            (anArray) => assertEquals(distance(anArray, anArray), 0),
        ));
    },
});

const dataTypes = [
    {val: fc.string(), other: fc.string()},
    {val: fc.array(fc.nat()), other: fc.array(fc.nat())},
    {
        val: fc.array(fc.dictionary(fc.string(), fc.string())),
        other: fc.array(fc.dictionary(fc.string(), fc.string())),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
];

Deno.test({
    name: "ArrayLikes with affixes have insertion",
    fn: () => {
        for (const {val, other, eq = (a, b) => a === b} of dataTypes) {
            fc.assert(fc.property(
                val, other, fc.integer({min: 1}),
                (val, affix, cost) => {
                    const ins = {insertion: cost, eq: eq};
                    const del = {deletion: cost, eq: eq};
                    const prefixed = affix.concat(structuredClone(val));
                    const suffixed = structuredClone(val).concat(affix);
                    const i = val.length / 2;
                    const infixed = structuredClone(
                        val.slice(0, i).concat(affix).concat(val.slice(i)),
                    );
                    const expect = cost * affix.length;
                    assertEquals(distance(prefixed, val, del), expect);
                    assertEquals(distance(val, prefixed, ins), expect);
                    assertEquals(distance(suffixed, val, del), expect);
                    assertEquals(distance(val, suffixed, ins), expect);
                    assertEquals(distance(infixed, val, del), expect);
                    assertEquals(distance(val, infixed, ins), expect);
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
                assertEquals(distance(prefixed, val, substitution), expect);
                assertEquals(distance(val, prefixed, substitution), expect);
                assertEquals(distance(suffixed, val, substitution), expect);
                assertEquals(distance(val, suffixed, substitution), expect);
                assertEquals(distance(infixed, val, substitution), expect);
                assertEquals(distance(val, infixed, substitution), expect);
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
                assertGreater(distance(value, [], cost), maxCost);
                assertGreater(distance([], value, cost), maxCost);
                assertGreater(distance(value, other, cost), maxCost);
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
                assertEquals(distance(str1, str2), distance(str2, str1));
            },
        ));
    },
});
