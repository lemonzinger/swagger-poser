# Swagger Poser

Use [Swagger Poser](https://github.com/lemonzinger/poser) to generate mock data that match the Swagger spec

## Install

`swagger-poser` is installable through 2 different channels:


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