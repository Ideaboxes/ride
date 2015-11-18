'use strict'

let chai = require('chai')
let expect = chai.expect

let Pane = require('../../map/pane')

describe('Pane', () => {

  describe('#constructor', () => {

    it ('sets default values', () => {
      let pane = new Pane
      expect(pane.options).to.deep.equal({
        size: 3000
      })
    })

  })

  describe('#key', () => {

    let pane = null
      , location = { longitude: 103.412, latitude: 12.5231 }

    beforeEach(() => {
      pane = new Pane
    })

    it ('returns key contains all boundary points in it', () => {
      expect(pane.key(location)).to.equal(`103.4,12.5,103.5,12.6`)
    })

    it ('returns key same as current boundary', () => {
      expect(pane.key(location, Pane.CENTER)).to.equal(`103.4,12.5,103.5,12.6`)
    })

    it ('returns boundary key above the current boundary', () => {
      expect(pane.key(location, Pane.TOP)).to.equal(`103.4,12.6,103.5,12.7`)
    })

    it ('returns boundary key next to the current boundary', () => {
      expect(pane.key(location, Pane.RIGHT)).to.equal(`103.5,12.5,103.6,12.6`)
    })

    it ('returns boundary key below the current boundary', () => {
      expect(pane.key(location, Pane.BOTTOM)).to.equal(`103.4,12.4,103.5,12.5`)
    })

    it ('returns boundary key left to the current boundary', () => {
      expect(pane.key(location, Pane.LEFT)).to.equal(`103.3,12.5,103.4,12.6`)
    })

  })

})
