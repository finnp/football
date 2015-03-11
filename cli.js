#!/usr/bin/env node

var minimist = require('minimist')
var md = require('cli-md')
var clear = require('clear')
var fs = require('fs')

var argv = minimist(process.argv.splice(2))

var file = argv._[0]
var time = Number(argv.time || argv.t || 8000)

var content = fs.readFileSync(file, 'utf-8')

var pages = []
var re = new RegExp('^\n-{3,}\n', 'gm')
pages = content.split(re)

var i = 0

function showslide() {
  clear()
  console.log(md(pages[i]))
  i = (i + 1) % pages.length
}

showslide()

setInterval(showslide, time)