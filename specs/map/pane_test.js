'use strict'

let chai = require('chai')
  , fs = require('fs-extra')
  , crypto = require('crypto')
  , Canvas = require('canvas')

let expect = chai.expect
  , Image = Canvas.Image

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

  describe('#bounds', () => {

    let key = '103.4,12.5,103.5,12.6'
      , pane = null
    beforeEach(() => {
      pane = new Pane
    })

    it ('returns all values in the key and radians', () => {
      expect(pane.bounds(key)).to.deep.equal({
        min: { x: 103.3, y: 12.4 },
        max: { x: 103.6, y: 12.7 },
        radians: 0.43552362366419334,
        size: 46.630427797004934
      })
    })

  })

  describe('#addPoint', () => {

    let pane = null
      , point = { longitude: 103.412, latitude: 12.5231 }

    beforeEach(() => {
      pane = new Pane
      pane.addPoint(point, pane.blocks)
    })

    it ('adds point to all and points in center box', () => {
      let key = '103.4,12.5,103.5,12.6'
      expect(pane.blocks).to.include.keys(key)
      expect(pane.blocks[key].all.size).to.equal(1)
      expect(pane.blocks[key].points.size).to.equal(1)
    })

    it ('adds point to all in boxes around the center', () => {
      let keys = ['103.4,12.4,103.5,12.5', '103.5,12.5,103.6,12.6',
        '103.4,12.6,103.5,12.7', '103.3,12.5,103.4,12.6']
      keys.forEach(key => {
        expect(pane.blocks).to.include.keys(key)
        expect(pane.blocks[key].all.size).to.equal(1)
        expect(pane.blocks[key].points.size).to.equal(0)
      })
    })

    it ('adds only one point to the box for same coordinate', () => {
      let block = {}

      pane.addPoint(point, block)
      pane.addPoint(point, block)

      expect(block['103.4,12.5,103.5,12.6'].points.size).to.equal(1)
      expect(block['103.4,12.5,103.5,12.6'].all.size).to.equal(1)
    })

  })

  describe('#draw', () => {

    let pane = null

    beforeEach(() => {
      pane = new Pane
    })

    it ('draws the block and returns an image', (done) => {
      let block = {
        points: new Set([{ longitude: 103.412, latitude: 12.5231 }]),
        all: new Set([{ longitude: 103.412, latitude: 12.5231 }]),
        bounds: { min: { x: 103.3, y: 12.4 }, max: { x: 103.6, y: 12.7 }, radians: 0.43552362366419334 }
      }

      let canvas = pane.draw(block)
      fs.readFile(__dirname + '/blank.png', function(err, blank){
        if (err) throw err

        let image = new Image
        image.src = blank

        let blankCanvas = new Canvas(image.width, image.height)
          , blankContext = blankCanvas.getContext('2d')
        blankContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)
        expect(canvas.toDataURL()).to.equal(blankCanvas.toDataURL())
        done()
      })

    })

  })

  describe('with data', function() {

    this.timeout(10000)
    let pane = null

    before(() => {
      pane = new Pane

      let data = fs.readFileSync(__dirname + '/data.json', { encoding: 'utf-8' })
      pane.import(JSON.parse(data))
    })

    describe('#import', () => {

      it ('adds all data points to blocks', () => {
        expect(Object.keys(pane.blocks).length).to.equal(8)
      })

    })

    describe('#write', () => {
      let dir = `${__dirname}/blocks`

      before((done) => {
        pane.write(dir, done)
      })

      after((done) => {
        fs.remove(dir, done)
      })

      it ('creates a directory and write all block images to that directory', (done) => {
        fs.access(dir, error => {
          expect(error).to.be.nil
          done()
        })
      })

      it ('writes only block that contain points to file', (done) => {
        fs.readdir(dir, (error, files) => {
          expect(files.length).to.equal(2)
          done()
        })
      })

      it ('draws correct part to the file', () => {
        let blocks = ['103.8,1.2,103.9,1.3.png', '103.8,1.3,103.9,1.4.png']
        blocks.forEach(block => {
          let hash1 = crypto.createHash('md5')
          hash1.update(fs.readFileSync(`${__dirname}/${block}`))

          let hash2 = crypto.createHash('md5')
          hash2.update(fs.readFileSync(`${dir}/${block}`))

          expect(hash2.digest('hex')).to.equal(hash1.digest('hex'))
        })
      })

    })

  })

})
