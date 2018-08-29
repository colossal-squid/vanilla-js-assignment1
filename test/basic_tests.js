'use strict'

require('should')
const Finder = require('..')

function randomString(length, chars) {
  let string = ''
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return string
}

describe('basic tests, initial class and', function() {
  it('finds complete word in array', function(done) {
    const finder = new Finder(['asd', 'qwe'])
    finder.find('asd').should.eql(['asd'])
    done()
  })

  it('finds distorted word in array', function(done) {
    const finder = new Finder(['asd', 'qwe'])
    finder.find('sad').should.eql(['asd'])
    done()
  })

  it('finds multiple accured', function(done) {
    const finder = new Finder(['asd', 'sad', 'qwe'])
    finder.find('sad').should.eql(['asd', 'sad'])
    done()
  })

  it('returns empty array on non-existence word', function(done) {
    const finder = new Finder(['asd', 'sad', 'qwe'])
    finder.find('asa').should.eql([])
    done()
  })

  it('handle long arrays', function(done) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const input = []
    for (let i = 0; i < 10000; i++) {
      input.push(randomString(Math.random() * 5, chars))
    }
    const finder = new Finder(input)
    finder.find(input[10]).length.should.be.aboveOrEqual(1)
    finder.find('   ').length.should.be.equal(0)
    done()
  })

  it('handle complex characters', function(done) {
    const chars = '¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
    const input = []
    for(let i = 0; i < 10000; i++) {
      input.push(randomString(Math.random() * 5, chars))
    }
    const finder = new Finder(input)
    finder.find(input[10]).length.should.be.aboveOrEqual(1)
    finder.find('   ').length.should.be.equal(0)
    done()
  })

  it('handle long strings', function(done) {
    const chars = '¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
    const input = []
    for(let i = 0; i < 100; i++) {
      input.push(randomString(Math.random() * 10000, chars))
    }
    const finder = new Finder(input)
    finder.find(input[10]).length.should.be.aboveOrEqual(1)
    finder.find('   ').length.should.be.equal(0)
    done()
  })
})

// These tests are skipped because performance will depend on hardware.
// We will run these tests ourselves on known hardware.
// Feel free to use them yourself to compare different potential solutions.

describe('performance tests', function() {
  const largeArray = []
  const longStrings = []

  before(function() {
    const chars = '¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
    for(let i = 0; i < 100000; i++) {
      largeArray.push(randomString(Math.random() * 10, chars))
    }

    for(let i = 0; i < 100; i++) {
      longStrings.push(randomString(Math.random() * 10000, chars))
    }
  })

  it('runs find function 50000 times in under 2.0 seconds', function(done) {
    this.timeout(2000);

    const finder = new Finder(['asd', 'sad', 'qwe'])
    for (let i = 0; i < 50000; i++) {
      finder.find('sad').should.eql(['asd', 'sad'])
    }
    done()
  })

  it('runs find 1000 times on long array in under 2.0 seconds', function(done) {
    this.timeout(2000);

    const finder = new Finder(largeArray)
    for (let i = 0; i < 1000; i++) {
      finder.find('   ').length.should.be.equal(0)
    }
    done()
  })

  it('runs find 50000 times on array with long strings in under 2.0 seconds', function(done) {
    this.timeout(2000);

    const finder = new Finder(longStrings)
    for (let i = 0; i < 50000; i++) {
      finder.find('   ').length.should.be.equal(0)
    }
    done()
  })
})
