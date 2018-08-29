'use strict'

// your solution
class SimpleFinder {

    // write the code to initialize your class here
    // the input is and array of string ex. ["asd", "wer"]
    constructor(arr) {
        //I assume we go for performance here, so instead of
        //words = arr.map((str)=>str.split('')); I'll do
        words = new Array(arr.length);
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            words[i] = arr[i].split('');
        }
    }

    // write you code to get subset of initial array with given key
    // key is always string ex. "asd"
    find(key) {
        let result = [];
        let keyArray = key.split('');
        // here I would use a forEach loop, but having bigger callstack costs you, also forEach may be slower in general
        const wordsLen = words.length;
        for (let i = 0; i < wordsLen; i++) {
            const word = words[i];
            if (containsKey(word, keyArray)) {
                result.push(word.join(''));
            }
        }
        return result;
    }

}


// my take on private, non-exported module members.
// I've rejected ideas of using a naming convention(doesn't protect data really) and symbols as property names (still accessible with Reflect.ownKeys)
// So i chose to do es5-style MODULE pattern:
// keep these within module, non-exported, tied to a closure. I understand It MAY cause memory issues and, at the moment,
// I'm not quite familiar with node thread-safety principles so yeah, I ASSUME there's a single instance of Finder all the time
let words = [];

/**
 * Checks if word contains onlt the characters from key passed
 * I've assumed:
 *  - the check is CASE-SENSETIVE
 *  - An empty string is a valid string and should result in [ '' ], or even ['', '', ...] if you had them
 *  (test-cases to cover these are described in /test/my_tests.js, and I know it's a horrible name,
 *  but this may be the very first time where word 'my' means something
 * @example
 *      new Finder(['asd', 'dsa']).find('sda') - should return true
 *      new Finder(['asdd', 'dssa']).find('sda') - should return false
 * @param word -string[]
 * @param key = string[]
 * @returns {boolean}
 */
function containsKey(word, key) {
    // corner-cases to speed it up
    if (word.length != key.length) {
        return false;
    }
    if (word === key) {
        return true;
    }
    // Calling .sort on both word and key is an easy way to solve it,
    // but the complexity of a single O(n) pass is much lower
    let currentWord = word.slice();
    const keyLen = key.length;
    for (let i = 0; i < keyLen; i++) {
        const ch = key[i];
        let idx = -1;
        if ((idx = currentWord.indexOf(ch)) >= 0) {
            // remove the first inclusion of 'ch' from word
            currentWord.splice(idx, 1);
        } else {
            return false;
        }
    }
    return true;
}

/**
 * Some of the performance tests hinted caching
 * (same key passed over and over again, while data is set once in constructor)
 * I do keep last $CACHE_MAX_ENTRIES key/value pairs,
 *
 * if the map item count exceeds the const value
 *  - the
 *
 * Another approach would be using NUMBER of read operations for cached result, not last read date,
 * or maybe i could capture search time and give preference to HEAVIER keys (bigger length basically)
 * can't make a point on which one is better in this sort of situation
 */
let cache = new Map(),
    lastReadTimeForKey = new Map();
const CACHE_MAX_ENTRIES = 1000,
    CACHE_CLEAR_RATE = 0.1,
    CACHE_ITEMS_TO_CLEAR_COUNT = Math.floor(CACHE_MAX_ENTRIES * CACHE_CLEAR_RATE);
// CachingFinder is a much better name, but the task says DO NOT MODIFY basic_tests.js, so..

class Finder extends SimpleFinder {

    constructor(wordsArray) {
        super(wordsArray);
        cache = new Map();
    }

    find(key) {
        let value;
        //trying to retrieve the cached value
        if (value = cache.get(key)) {
            return value;
        } else {
            //wrapping the parent's find function
            value = super.find(key);
            cache.set(key, value);
            lastReadTimeForKey.set(key, Date.now());
            this.__freeCacheSpace();
            return value;
        }
    }
    //I wanted to have test coverage for this one badly, so I've used "private method naming convention"
    // here just to expose it to testing
    __freeCacheSpace() {
        if (cache.size < CACHE_MAX_ENTRIES) {
            return;
        }
        this.__removeOlderEntries();
    }

    // A Map object iterates its elements in insertion order,
    // makes the ones that go first - the olders. K.I.S.S. as its finest
    __removeOlderEntries() {
        const itemsToClear = Array.from(lastReadTimeForKey.keys()).slice(0, CACHE_ITEMS_TO_CLEAR_COUNT);
        itemsToClear.forEach((k)=>{
            cache.delete(k);
            lastReadTimeForKey.delete(k);
        });
    }

}

module.exports = Finder
