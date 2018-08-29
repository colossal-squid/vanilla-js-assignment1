'use strict'

const sinon = require('sinon'),
      should = require('should');
require('should-sinon');

const Finder = require('..'),
    DUMMY_SEQUENCE = 'Haters gonna hate';

function shuffle(str) {
    let newStr = str.split('');
    for (let i = 0; i < str.length; i++) {
        let idx1 = Math.floor(Math.random() * str.length),
            idx2 = Math.floor(Math.random() * str.length);
        let c1 = newStr[idx1], c2 = newStr[idx2];
        newStr[idx2] = c1, newStr[idx1] = c2;
    }
    return newStr.join('');
}
describe('Added corner-cases based on assumptions ', function () {

    it('Ignores words with extra letters that do not fit', function () {
        const finder = new Finder(['asdd', 'qwe'])
        finder.find('asd').should.eql([])
    })

    it('is case-insensetive', function () {
        const finder = new Finder(['ASSD', 'assd'])
        finder.find('sasd').should.eql(['assd'])
    });

    it('Accepts empty strings as valid args', function () {
        const args = ['', '', ''];
        const finder = new Finder(args)
        finder.find('').should.eql(['', '', '']);
    });

    it('Works with real text', function () {
        const shuffled = shuffle(DUMMY_SEQUENCE),
            wrongSeq1 = new Array(DUMMY_SEQUENCE.length).join('A'),
            wrongSeq2 = shuffled.replace(shuffled[0], '~');

        const finder = new Finder([DUMMY_SEQUENCE, shuffled]);
        finder.find(shuffled).should.eql([DUMMY_SEQUENCE, shuffled]);
        finder.find(DUMMY_SEQUENCE).should.eql([DUMMY_SEQUENCE, shuffled]);

        finder.find(wrongSeq1).should.eql([]);
        finder.find(wrongSeq2).should.eql([]);
    });
});

describe('Caching mechanism description', function () {

    it('when cache quota is filled - calls __removeOlderEntries', function (done) {
        const CACHE_MAX_ENTRIES = 1000,
            CACHE_CLEAR_RATE = 0.1,
            EXPECTED_NUMBER_OF_CLEANUPS = 3;
        const overflowingRecords = Math.floor(CACHE_CLEAR_RATE * CACHE_MAX_ENTRIES * (EXPECTED_NUMBER_OF_CLEANUPS-1));
        const size = CACHE_MAX_ENTRIES + overflowingRecords;
        console.log(size)
        let sequences = new Array(size);
        for (let i = 0; i < size; i++) {
            const len = Math.round(Math.random() * 1000),
                str = new Array(len);
            for (let j = 0; j < len; j++) { //nested loops are bad, .map(), .filter() and .forEach() are good
                str[j] = String.fromCharCode(Math.round(Math.random() * 200) + 55);
            }
            sequences[i] = str.join('');
        }
        const finder = new Finder(sequences);
        const spy = sinon.spy(finder, "__removeOlderEntries");

        sequences.forEach((seq)=> {
            const seqShuffled = shuffle(seq);
            let result = finder.find(seqShuffled);
            (result.length >= 1).should.be.true();
        });

        finder.__removeOlderEntries.callCount.should.eql(EXPECTED_NUMBER_OF_CLEANUPS);
        done();
    });

});