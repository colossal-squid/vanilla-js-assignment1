# Relayr Onboarding Javascript Test

## Objective

The purpose of this test is to give us a small sample of your code and to see how you approach and solve a simple problem.
Ideally you should not spend more than an hour on this.

This is a simple class to extract matching strings from an array regardless of the characters order.

You will write a Javascript class that accepts an array of strings in the constructor.
The class will expose a `find` function that accepts a string.
The function will return all strings from the array that contains the exact same characters as the string passed into it.
The order of the characters in the strings is not relevant.

For example, the constructor should take an array as follows:

``` javascript
const finder = new Finder(['asd', 'asdd', 'fre'])
```

Calling `finder.find('sad')` should return `['asd']`.

In the case where more than one member of the initialization array matches the key the return array will have more than one member.

## Requirements

- State your assumptions.  Anywhere you feel that the requirements are unclear please make
an assumption and document that assumption.
- You only need to modify `index.js` file in mentioned places, please comment your code where needed. Your code quality is important.
- You are not allowed to use any external libraries.
- The performance of your code matters, so please try to keep your code as optimized as possible.

## Startup and Testing

Run `npm install` in the directory of the application to install its dependencies.

You can test your solution by calling `npm test`.

To take a look at testing scenarios you can check out `test/basic_tests.js`. You are not allowed to modify this file.  If you want to add more tests please use a seperate file.
