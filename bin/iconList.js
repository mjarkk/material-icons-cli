const path = require('path')
const fs = require('fs-extra')

module.exports = () => {
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
  return folders.map(folder =>
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
}