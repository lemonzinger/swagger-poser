var assert = require('assert'),
	fs = require('fs'),
	poser = require('../lib/poser');

describe('poser', function () {
	var json;
	before(function() {
		json = JSON.parse(fs.readFileSync(__dirname + '/swagger.json').toString());
		assert(json, 'test swagger json could not be read from filesystem');
	});

	it('should construct poser from swagger json', function () {
		var swaggerPoser = poser.from(json);
		assert(typeof swaggerPoser, 'object', 'constructed poser is not an object');
		assert(typeof swaggerPoser.generate, 'object', 'poser.generate is not an object');
		assert(typeof swaggerPoser.withConfig, 'object', 'poser.withConfig is not an object');
		assert(typeof swaggerPoser.withModelConfig, 'object', 'poser.withModelConfig is not an object');
		assert(typeof swaggerPoser.jsf, 'object', 'poser.jsf is not an object');
		assert.equal(JSON.stringify(swaggerPoser.definitions), JSON.stringify(json.definitions), 'definitions do not match swagger');
	});

	it('should not construct poser from invalid swagger json', function () {
		assert.throws(function() {poser.from({});}, 'invalid swagger json does fail to construct a poser');
	});

	it('should generate a fake when invoked with a valid model name', function () {
		var swaggerPoser = poser.from(json),
			fake;
		fake = swaggerPoser.generate('Pet');
		assert(typeof fake, 'object', 'generated fake is not an object');
		assert(typeof fake.name, 'string', 'generated fake.name is not an string');
		assert(typeof fake.photoUrls, 'array', 'generated fake.photoUrls is not an array');

		assert.throws(function() {swaggerPoser.generate('Invalid');}, 'invalid model name does fail to generate a fake');
	});

	it('should allow the merging of config containing fakers with model definition', function () {
		var swaggerPoser = poser.from(json),
			swaggerPoserReturned,
			fake;
		swaggerPoserReturned = swaggerPoser.withModelConfig('Pet', {
			properties: {
				name: {
					faker: 'name.firstName'
				}
			}
		});
		assert(swaggerPoserReturned === swaggerPoser, 'withModelConfig did not return original poser');
		assert(swaggerPoserReturned.config.Pet.properties.name.faker === 'name.firstName', 'withModelConfig failed to set faker on property');

		swaggerPoserReturned = swaggerPoser.withModelConfig('Pet', {
			properties: {
				id: {
					faker: 'random.number'
				}
			}
		});
		assert(swaggerPoserReturned === swaggerPoser, 'withModelConfig did not return original poser');
		assert(swaggerPoserReturned.config.Pet.properties.id.faker === 'random.number', 'withModelConfig failed to set faker on property');
		assert(swaggerPoserReturned.config.Pet.properties.name.faker === 'name.firstName', 'withModelConfig failed to maintain faker on property');

		swaggerPoserReturned = swaggerPoser.withConfig({
			'Pet': {
				properties: {
					name: {
						faker: 'name.findName'
					},
					items: {
						faker: 'lorem.words'
					}
				}
			}
		});
		assert(swaggerPoserReturned === swaggerPoser, 'withConfig did not return original poser');
		assert(swaggerPoserReturned.config.Pet.properties.id.faker === 'random.number', 'withConfig failed to maintain faker on property');
		assert(swaggerPoserReturned.config.Pet.properties.name.faker === 'name.findName', 'withConfig failed to set faker on property');
		assert(swaggerPoserReturned.config.Pet.properties.items.faker === 'lorem.words', 'withConfig failed to set faker on property');

		fake = swaggerPoser.generate('Pet');
		assert(typeof fake, 'object', 'generated fake is not an object');
		assert(typeof fake.name, 'string', 'generated fake.name is not an string');
		assert(typeof fake.photoUrls, 'array', 'generated fake.photoUrls is not an array');
	});

	it('should allow the merging of config containing format with model definition', function () {
		var swaggerPoser = poser.from(json),
			swaggerPoserReturned,
			fake;
		swaggerPoserReturned = swaggerPoser.withModelConfig('Pet', {
			properties: {
				name: {
					format: 'email'
				}
			}
		});
		assert(swaggerPoserReturned === swaggerPoser, 'withModelConfig did not return original poser');
		assert(swaggerPoserReturned.config.Pet.properties.name.format === 'email', 'withModelConfig failed to set format on property');

		fake = swaggerPoser.generate('Pet');
		assert(typeof fake, 'object', 'generated fake is not an object');
		assert(fake.name.match(/[^@]+@[^\.]+\.[^\.]+/), 'name does not match email format');
		assert(typeof fake.name, 'string', 'generated fake.name is not an string');
		assert(typeof fake.photoUrls, 'array', 'generated fake.photoUrls is not an array');
	});

	it('should allow the extension of used jsf', function () {
		var swaggerPoser = poser.from(json),
			swaggerPoserReturned,
			fake;

		swaggerPoser.jsf.formats('semver', function(gen, schema) {
			return gen.randexp('^\\d\\.\\d\\.\\d{1,2}$');
		});
		swaggerPoserReturned = swaggerPoser.withModelConfig('Pet', {
			properties: {
				name: {
					format: 'semver'
				}
			}
		});
		assert(swaggerPoserReturned === swaggerPoser, 'withModelConfig did not return original poser');
		assert(swaggerPoserReturned.config.Pet.properties.name.format === 'semver', 'withModelConfig failed to set format on property');

		fake = swaggerPoser.generate('Pet');
		assert(typeof fake, 'object', 'generated fake is not an object');
		assert(fake.name.match(/\d\.\d\.\d{1,2}/), 'name does not match semver format');
		assert(typeof fake.name, 'string', 'generated fake.name is not an string');
		assert(typeof fake.photoUrls, 'array', 'generated fake.photoUrls is not an array');
	});
});