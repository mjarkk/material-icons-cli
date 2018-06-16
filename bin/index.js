#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const colors = require('colors')
const path = require('path')

const log = console.log

let dir = './../node_modules/material-design-icons/'
let folders = [
  'action',
  'alert',
  'av',
  'communication',
  'content',
  'device',
  'editor',
  'file',
  'hardware',
  'image',
  'maps',
  'navigation',
  'notification',
  'places',
  'social',
  'toggle'
]
let names = folders.map(folder =>
  path.resolve(__dirname, dir, folder, 'svg/production')
).map(folder => ({
  // get all icon names
  folderName: folder,
  files: fs.readdirSync(folder) 
})).map(el => ({
  folderName: el.folderName,
  files: el.files.filter(e => 
    // filter out all 48px models
    /48px\.svg/.test(e)
  )
})).map((el, i) => Object.assign({}, el, {
  // add name object with easy to read names this might be handy for later use
  names: el.files.map(e => e
    .replace(/ic_|_48px|48px|\.svg|_/g, ' ')
    .replace(/^ +| +$/g, '')),
  folder: folders[i]
}))

let getIcon = icon => {
  let svg = fs.readFileSync(path.resolve(icon.inFolder, icon.fileName), 'utf8')
  let name = icon.easyName
  if (program.vue) {
    saveIcon(`<template>${svg}</template>`, name, 'vue')
  } else if (program.react) {
    saveIcon(`
      import React, { Component } from 'react';
      class I extends React.Component {
        render() {
          return ${svg};
        }
      }
      export default I;
    `, name, 'js')
  } else if (program.reactJSX) {
    saveIcon(`
      import React, { Component } from 'react';
      class I extends React.Component {
        render() {
          return ${svg};
        }
      }
      export default I;
    `, name, 'jsx')
  } else if (program.litHTML) {
    saveIcon(`
      import {html} from 'lit-html';
      export default () => html\`<div class="icon">${svg}</div>\`;
    `, name, 'js')
  } else {
    saveIcon(svg, name, 'svg')
  }
}

let saveIcon = (data, name, ex) => {
  let filePath = path.resolve(process.cwd(), `${ name.replace(/ /g, '-') }.${ ex }`)
  let save = () => {
    fs.outputFileSync(filePath, data)
    log('saved svg file')
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

let serachIcon = search => {
  let searchRes = []
  names.map(group => {
    group['filtered'] = group.names.map((el, id) => {
      if (new RegExp(search,'ig').test(el)) {
        searchRes.push({
          inFolder: group.folderName,
          easyName: el,
          fileName: group.files[id],
          group: group.folder
        })
      }
    })
  })
  return searchRes
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
  .version(fs.readJsonSync('./package.json').version)
  .option('-s, --svg', 'save as .svg file (default)')
  .option('-v, --vue', 'save as vue component (.vue)')
  .option('-r, --react', 'save as react component (.js)')
  .option('-x, --reactJSX', 'save as react component (.jsx)')
  .option('-l, --litHTML', 'save as litHTML template (.js)')
  .command('get <type>')
  .alias('g')
  .description('download an icon') 
  .action((query, argv) => {
    let searchRes = serachIcon(query)
    let askOptions = searchRes.map(e => `${e.easyName} -> ${e.group}`)
    chooseIcon(askOptions, answer => {
      getIcon(searchRes[askOptions.indexOf(answer)])
    })
  
  })

program.parse(process.argv)
