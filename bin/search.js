
module.exports = (search, names) => {
  let searchRes = []
  names.map(group => {
    group['filtered'] = group.names.map((el, id) => {
      if (new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),'ig').test(el)) {
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