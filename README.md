# material-icons-cli  
*Download material icons via the terminal*  
![Preview Image](preview/preview.gif?raw=true "Preview Image")  

## Install

```
$ npm i -g material-icons-cli
```

## Usage
```
$ micons --help

  Usage: micons [options] [command]

  Options:

    -V, --version   output the version number
    -s, --svg       save as .svg file (default)
    -v, --vue       save as vue component (.vue)
    -r, --react     save as react component (.js)
    -x, --reactJSX  save as react component (.jsx)
    -p, --preact    save as preact component (.js)
    -l, --litHTML   save as litHTML template (.js)
    -L, --log       Instead of saving the file it just logs the output
    -h, --help      output usage information

  Commands:

    get|g <type>    download an icon
```

## Devolopment
- Clone repo
- `$ npm i -g`

## Testing
- `npm i -g yarn ava`
- `rm -rf node_modules`
- `yarn`
- `yarn test`

## License

GNU