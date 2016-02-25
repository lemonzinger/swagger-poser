;(function(isNode) {
	var fs = require('fs'),
		https = require('https'),
		jsf = require('json-schema-faker'),
		merge = require('./merge'),
		poser;

	function withConfig(config) {
		if (!this.config) {
			this.config = config;
		} else {
			this.config = merge.recursive(true, this.config, config);
		}
		return this;
	}

	function withModelConfig(modelName, config) {
		var configWrapper = {};
		configWrapper[modelName] = config;

		this.withConfig(configWrapper);
		return this;
	}

	function withConfigForAllModels(config) {
		var configWrapper = {},
			modelNames = Object.getOwnPropertyNames(this.definitions);
		for (var i = 0; i < modelNames.length; i++) {
			configWrapper[modelNames[i]] = config;
		}

		this.withConfig(configWrapper);
		return this;
	}

	function generate(modelName) {
		if (!this.definitions.hasOwnProperty(modelName)) {
			throw new Error('swagger json does not have a definition for model ' + modelName);
		}

		var model = this.definitions[modelName],
			schema;
		schema = merge.recursive(true, model);
		if (this.config && this.config.hasOwnProperty(modelName)) {
			schema = merge.recursive(true, model, this.config[modelName]);
		}
		schema.definitions = merge.recursive(true, this.definitions, this.config);
		return this.jsf(schema);
	}

	function from(json) {
		var instance = {};


		if (!json || !json.hasOwnProperty('definitions')) {
			throw new Error('swagger json does not have definitions');
		}

		instance.definitions = merge.recursive(true, json.definitions);
		instance.generate = generate;
		instance.withConfig = withConfig;
		instance.withModelConfig = withModelConfig;
		instance.withConfigForAllModels = withConfigForAllModels;
		instance.jsf = jsf;
		return instance;
	}

	poser = {
		from: from
	};

	if (isNode) {
		module.exports = poser;
	} else {
		window.poser = poser;
	}
})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);