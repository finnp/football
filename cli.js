#!/usr/bin/env node

var minimist = require('minimist')
var md = require('cli-md')
var clear = require('clear')
var fs = require('fs')
var windowSize = require('window-size')
var charm = require('charm')()
var chalk = require('chalk')
var path = require('path')
require('cli-cursor').hide()

charm.pipe(process.stdout)

var argv = minimist(process.argv.splice(2))

var file = argv._[0] || path.join(__dirname, 'help.md')
var time = Number(argv.time || argv.t || 8000)

var content = fs.readFileSync(file, 'utf-8')

var pages = []
var re = new RegExp('^\n-{3,}\n', 'gm')
pages = content.split(re)

var i = 0
var showBar = true
var auto = false

function show() {
  clear()
  if(!testSlides()) return console.error(chalk.red('Adjust your window height to fit content.'))
  if(i < 0) i = pages.length + i
  i = i % pages.length
  console.log(md(pages[i]))
  if(showBar) displayBar()
}

function displayBar() {
    charm.push()
    charm.position(0, process.stdout.rows)    
    charm.write([
      '[' + (i+1) + '/' + pages.length + ']',
      'hide bar (h)',
      'show bar (s)',
      'exit (q)',
      'next (n)',
      'prev (b)',
      'toggle auto ' + (auto ? chalk.green('on') : chalk.red('off')) +  ' (a)'
    ].join(chalk.grey(' • ')))
    charm.pop()
}

function showNext() {
  i++
  show()
}

var interval
function toggleAuto() {
  if(!auto) {
    interval = setInterval(showNext, time)
    auto = true
  } else {
    clearInterval(interval)
  }
}

show()

process.stdin.setRawMode(true)

process.stdin.on('data', function (data) {
  data = data.toString()
  if(data === 'h') showBar = false
  if(data === 's') showBar = true
  if(data === 'n' || data === ' ') i++
  if(data === 'b' || data === 'p') i--
  if(data === 'a') toggleAuto()
  show()
  if(data === 'e' || data === 'q') {
    clear()
    process.exit()
  }
})

function testSlides() {
  return pages.every(function (page) {
    return md(page).split('\n').length <= process.stdout.rows
  })
}

process.stdout.on('resize', show)

