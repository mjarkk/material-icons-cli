const fs = require('fs-extra')
const path = require('path')

module.exports = (icon, program, saveIcon) => {
  let svg = fs.readFileSync(path.resolve(icon.inFolder, icon.fileName), 'utf8')
  let name = icon.easyName
  if (program.vue) {
    saveIcon(`<template>${svg}</template>`, name, 'vue')
  } else if (program.react || program.reactJSX || program.preact) {
    saveIcon(`
      ${ program.preact
        ? 'import { h, render, Component } from \'preact\''
        : 'import React, { Component } from \'react\''
      };
      export default () => <div className="icon">${svg}</div>
    `, name, program.reactJSX ? 'js' : 'jsx')
  } else if (program.litHTML) {
    saveIcon(`
      import {html} from 'lit-html';
      export default () => html\`<div class="icon">${svg}</div>\`;
    `, name, 'js')
  } else {
    saveIcon(svg, name, 'svg')
  }
}