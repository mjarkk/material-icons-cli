import test from 'ava'
import search from '../bin/search.js'
import getIcon from '../bin/getIcon.js'
import iconList from '../bin/iconList.js'
import fs from 'fs-extra'
import path from 'path'
import ntml from 'lit-ntml'

const html = ntml()
let list = iconList()

test('iconList is a function', t => 
  t.is(typeof iconList, 'function')
)

test('icons list function return object', t => 
  typeof list == 'object'
    ? t.pass()
    : t.fail('icons list does not return a object')
)

test('Access foldername from icons list function', t => {
  try {
    if (typeof list[0].folderName != 'string') {
      t.fail('can\'t access `list[0].folderName`')
    } else {
      t.pass()
    }
  } catch (err) {
    t.fail(err)
  }
})

test('Access folder from icons list function', t => {
  try {
    if (typeof list[0].folder != 'string') {
      t.fail('can\'t access `list[0].folder`')
    } else {
      t.pass()
    }
  } catch (err) {
    t.fail(err)
  }
})

test('Get list of icons from icons list function', t => {
  try {
    if (list[0].files.length > 0) {
      t.pass()
    } else {
      t.fail('Icon list empty')
    }
  } catch (err) {
    t.fail(err)
  }
})

test('Get list of names from icons list function', t => {
  try {
    if (list[0].names.length > 0) {
      t.pass()
    } else {
      t.fail('Icon list empty')
    }
  } catch (err) {
    t.fail(err)
  }
})

test('Get list of names from icons list function', t => {
  try {
    if (list[0].names.length == list[0].files.length) {
      t.pass()
    } else {
      t.fail('not the same amoud of names as icons')
    }
  } catch (err) {
    t.fail(err)
  }
})

test('search is a function', t => {
  t.is(typeof search, 'function')
})

test('search fails when no argument are passed', t => {
  try {
    search()
    t.fail()
  } catch (err) {
    t.pass()
  }
})

test('search for cast icon returns array', t => {
  try {
    let res = search('cast', list)
    t.is(typeof res, 'object')
  } catch (err) {
    t.fail(err)
  }
})

test('search for cast icon returns valid array with objects', t => {
  try {
    let res = search('cast', list)
    for (const key in res[0]) {
      if (res[0].hasOwnProperty(key)) {
        res[0][key] = ''
      }
    }
    t.deepEqual(res[0], { 
      inFolder: '',
      easyName: '',
      fileName: '',
      group: ''
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon is a function', t => {
  t.is(typeof getIcon, 'function')
})

test('getIcon function fails with no arguments', t => {
  try {
    getIcon()
    t.fail()
  } catch (err) {
    t.pass()
  }
})

test('get a callback from getIcon', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {}, () => {
      t.pass()
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns truethy data', t => {
  t.plan(3)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {}, (toSave, name, ex) => {
      t.truthy(toSave)
      t.truthy(name)
      t.truthy(ex)
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns svg', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {}, (toSave, name, ex) => {
      t.regex(toSave, /^<svg([a-z]|=|"|'|:|\/|\.|[0-9]|\ |>|<|\n|-)+><\/svg>$/im)
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns a valid name', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {}, (toSave, name, ex) => {
      t.regex(name, /cast/)
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns a valid file name expression', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {}, (toSave, name, ex) => {
      t.is(ex, 'svg')
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns a valid file name expression when using vue as flag', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {vue: true}, (toSave, name, ex) => {
      t.is(ex, 'vue')
    })
  } catch (err) {
    t.fail(err)
  }
})

test('getIcon returns valid data to save when using vue as flag', t => {
  t.plan(1)
  try {
    let searchRes = search('cast', list)[0]
    getIcon(searchRes, {vue: true}, (toSave, name, ex) => {
      t.regex(toSave, /^<template><svg([a-z]|=|"|'|:|\/|\.|[0-9]|\ |>|<|\n|-)+><\/svg><\/template>$/im)
    })
  } catch (err) {
    t.fail(err)
  }
})

test('React component works', t => {
  t.log('!Can\'t test component fully because i can\'t require react components natively!')
  t.plan(2)
  getIcon(search('cast', list)[0], {react: true}, (toSave, name, ex) => {
    let regex = /<div([a-z]| |=|"|'|<|>|:|\/|\.|[0-9]|-)+<\/div>/im.exec(toSave)[0]
    t.true(regex != '' && regex != undefined)
    t.regex(toSave, /import( {0,})React,( {0,}){( {0,})Component( {0,})}( {0,})from( {0,})'react'/)
  })
})

test('preact component works', t => {
  t.log('!Can\'t test component fully because i can\'t require preact components natively!')
  t.plan(2)
  getIcon(search('cast', list)[0], {preact: true}, (toSave, name, ex) => {
    let regex = /<div([a-z]| |=|"|'|<|>|:|\/|\.|[0-9]|-)+<\/div>/im.exec(toSave)[0]
    t.true(regex != '' && regex != undefined)
    t.regex(toSave, /import( {0,}){( {0,})h( {0,}),( {0,})render( {0,}),( {0,})Component( {0,})}( {0,})from( {0,})'preact'/)
  })
})

test('litHTML includes the right javascript code', t => {
  t.plan(1)
  getIcon(search('cast', list)[0], {litHTML: true}, (toSave, name, ex) => {
    let regex = /import( {0,}){( {0,})html( {0,})}( {0,})from( {0,})'lit-html'( |\n|;)+export( {0,})default( {0,})\(( {0,})\)( {0,})=>( {0,})html`(.|\n)+`/im
    t.regex(toSave, regex)
  })
})

test('litHTML template works', t => {
  t.plan(1)
  getIcon(search('cast', list)[0], {litHTML: true}, (toSave, name, ex) => {
    let regex = /<div([a-z]|[0-9]| |=|"|'|>|<|:|\/|\.|-|\n)+<\/div>/im.exec(toSave)[0]
    let output = html`${regex}`
    t.is(typeof output.then, 'function')
  })
})

test.cb('litHTML template returns the right html', t => {
  getIcon(search('cast', list)[0], {litHTML: true}, (toSave, name, ex) => {
    let regex = /<div([a-z]|[0-9]| |=|"|'|>|<|:|\/|\.|-|\n)+<\/div>/im.exec(toSave)[0]
    let output = html`${regex}`
    output.then(htmlRender => {
      t.regex(htmlRender, /<div class="icon"( {0,})>( {0,}|\n)+<svg(.|\n)+<\/svg>( |\n)+<\/div>/im)
      t.end()
    })
  })
})