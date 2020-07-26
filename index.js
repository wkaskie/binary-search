const RANDOM_MODIFIER = 5; // 50 is arbitrarily chosen

// Create a range of integers
const range = (start, end) => {
    if (typeof start !== 'number' || typeof end !== 'number') { return null; }
    if (start === end) return;

    return Array.from(new Array(end - start).fill(null)).map((int, indx) => start + indx);
}

// I'm using generators in case we need to consider efficiency for larger arrays (and for practice)
// Created an ordered list of integers with some gaps
function* randomRange(count, min = -1) {
    if (typeof count !== 'number' || (min && typeof min !== 'number')) { return null; }
    const randomNumber =  Math.floor(Math.random() * RANDOM_MODIFIER) + min + 1; // random may return 0 so add a 1
    yield randomNumber;
    if (count === 0) return;
    yield* randomRange(count - 1, randomNumber + 1);
}

function* alphabetRange(start, end) {
    if (typeof start !== 'string' || typeof end !== 'string') { return null; }
    yield start;
    if (start === end) return;
    const stringIntVal = start.charCodeAt(0);
    yield* alphabetRange(String.fromCharCode(stringIntVal + 1), end);
}

// Brute force approach for general comparison
const searchHard = (searchTerm, searchList) => {
    // O(n) time complexity
    for (let s = 0; s < searchList.length; s++) {
        if (searchList[s === searchTerm]) {
            return s;
        }
    }
    return -1;
}

// Return the index of the item found
// Requires a sorted list
const search = (searchTerm, searchList) => {
    let min = 0;
    let max = searchList.length - 1;
    let midPt;

    while (min < max) {
        midPt = Math.floor((max - min) / 2) + min;
        if (searchList[midPt] === searchTerm) { return midPt; }
        else if (searchList[midPt] < searchTerm) { min = midPt + 1; }
        else { max = midPt - 1; }
    }

    return -1;
}

const searchRecursive = (searchItem, searchArray) => {
    // O(log n) time complexity
    const limit = searchArray.length;
    if (limit > 1) {
        const midPt = Math.floor(limit / 2);
        let halfArray = [];
        let index = 0;
        if (searchItem > searchArray[midPt - 1]) { // use 2nd half
            halfArray = searchArray.slice(midPt, limit);
            index = midPt;
        } else {
            halfArray = searchArray.slice(0, midPt);
        }

        const res = searchRecursive(searchItem, halfArray);
        return res > -1 ? res + index : res;
    } else if (searchItem === searchArray[0]) {
        return 0;
    } else {
        return -1;
    }
}

// Testing helpers
const test = (funcToTest) => {
    return (...args) => {
        console.log(funcToTest(...args));
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const testAsync = (funcToTest) => {
    return async (...args) => {
        await funcToTest(...args);
        return ' Done with ' + args[0] + ' using ' + funcToTest.name;
    }
}

// START TESTS
const testArray = [...range(1, 9999990)];
const testBlotchyArray = [...randomRange(10)];
const testAlphaArray = [...alphabetRange('b', 'x')];
const bigArray = [...new Array(10000)].map(() => ({name:"test"}));

console.log(testArray, testBlotchyArray, testAlphaArray, bigArray);
console.log('********Searching simple array********');
[1, 9].forEach(num => test(searchRecursive)(num, testArray)); // output => 0, 8

console.log('********Searching "blotchy" array********');
[25, 16, 44].forEach(num => test(search)(num, testBlotchyArray)); // may or may not match. Check the array

console.log('********Searching alpha array********');
['e', 'z'].forEach(letter => test(searchRecursive)(letter, testAlphaArray)); // output => 3, -1
