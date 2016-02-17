# Swagger Poser

[npm-url]: https://npmjs.org/package/swagger-poser
[npm-image]: https://img.shields.io/npm/v/swagger-poser.svg?style=flat-square

[travis-url]: http://travis-ci.org/lemonzinger/swagger-poser
[travis-image]: https://img.shields.io/travis/lemonzinger/swagger-poser/master.svg?style=flat-square

[codecov-url]: https://codecov.io/github/lemonzinger/swagger-poser
[codecov-image]: https://img.shields.io/codecov/c/github/lemonzinger/swagger-poser/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/lemonzinger/swagger-poser
[depstat-image]: https://img.shields.io/david/lemonzinger/swagger-poser/master.svg?style=flat-square

[devdepstat-url]: https://david-dm.org/lemonzinger/swagger-poser#info=devDependencies
[devdepstat-image]: https://img.shields.io/david/dev/lemonzinger/swagger-poser/master.svg?style=flat-square

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

Use [Swagger Poser](https://github.com/lemonzinger/poser) to generate mock data that match a Swagger spec

## Install

### npm

Install `swagger-poser ` with npm:

    npm install swagger-poser --save


## Example usage

### Basic

```javascript
var poser = require('swagger-poser');

var json = JSON.parse(fs.readFileSync('swagger.json').toString());

var generator = poser.create(json);

var sample = generator.generate('Pet')

console.log(sample);
// {
//   "name": "veniam quia aliquam molestiae laborum",
//   "photoUrls": [
//     "porro",
//     "tenetur",
//     "id esse tempore adipisci temporibus"
//   ]
// }
```

### Using definition merging

#### Model specific config

```javascript
var poser = require('swagger-poser');

var json = JSON.parse(fs.readFileSync('swagger.json').toString());

var petConfigJson = {
	properties: {
		name: {
			faker: 'name.firstName'
		}
	}
});

var generator = poser.create(json).withModelConfig('Pet', petConfigJson);

var sample = generator.generate('Pet')

console.log(sample);
// {
//   "name": "Peter",
//   "photoUrls": [
//     "porro",
//     "tenetur",
//     "id esse tempore adipisci temporibus"
//   ]
// }
```
#### General config

```javascript
var poser = require('swagger-poser');

var json = JSON.parse(fs.readFileSync('swagger.json').toString());

var configJson = {
	properties: {
		id: {
			faker: 'random.number'
		},
		name: {
			faker: 'name.firstName'
		}
	}
});

var generator = poser.create(json).withConfig(configJson);

var sample = generator.generate('Pet')

console.log(sample);
// {
//   "name": "Peter",
//   "photoUrls": [
//     "porro",
//     "tenetur",
//     "id esse tempore adipisci temporibus"
//   ]
// }
```