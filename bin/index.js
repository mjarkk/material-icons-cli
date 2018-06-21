#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const colors = require('colors')
const path = require('path')
const iconList = require('./iconList.js')
const serachIcon = require('./search.js')
const getIcon = require('./getIcon.js')

const log = console.log

names = iconList()

let saveIcon = (data, name, ex) => {
  let filePath = path.resolve(process.cwd(), `${ name.replace(/ /g, '-') }.${ ex }`)
  let save = () => {
    if (program.log) {
      let row = '---------------------'
      log(`\n${row}\n${data}\n${row}\n`)
    } else {
      fs.outputFileSync(filePath, data)
      log('saved svg file')
    }
  }

  if (!fs.existsSync(filePath)) {
    save()
  } else {
    inquirer.prompt({
      type: 'confirm',
      name: 'replace',
      message: 'File already exists do you want to overwrite?',
      default: true
    }).then(answer => {
      if (answer.replace) {
        save()
      } else {
        log('nothing to save existing..')
        process.exit()
      }
    })
  }
}

let chooseIcon = (list, cb) =>
  inquirer.prompt({
    type: 'list',
    name: 'icon',
    message: 'Found multiple icons witch one do you want?',
    choices: list
  }).then(answer => {
    if (typeof cb == 'function') {
      cb(answer.icon)
    }
  })

program
  .version(fs.readJsonSync(path.resolve(__dirname, './../package.json')).version)
  .option('-s, --svg', 'save as .svg file (default)')
  .option('-v, --vue', 'save as vue component (.vue)')
  .option('-r, --react', 'save as react component (.js)')
  .option('-x, --reactJSX', 'save as react component (.jsx)')
  .option('-p, --preact', 'save as preact component (.js)')
  .option('-l, --litHTML', 'save as litHTML template (.js)')
  .option('-L, --log', 'Instead of saving the file it just logs the output')
  .command('get <type>')
  .alias('g')
  .description('download an icon') 
  .action((query, argv) => {
    let searchRes = serachIcon(query, names)
    if (searchRes.length == 0) {
      log(colors.red.bold('no icons found, search for icons here: https://material.io/tools/icons/'))
      process.exit()
    } else if (searchRes.length == 1) {
      getIcon(searchRes[0], program, saveIcon)
    } else {
      let askOptions = searchRes.map(e => `${e.easyName} -> ${e.group}`)
      chooseIcon(askOptions, answer => {
        getIcon(searchRes[askOptions.indexOf(answer)], program, saveIcon)
      })
    }
  })

program.parse(process.argv)
