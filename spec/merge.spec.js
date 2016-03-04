var assert = require('assert'),
	merge = require('../lib/merge');

describe('merge', function () {
	it('should merge two objects as in an additive way', function () {
		var base1 = {
			a: '',
			b: 5,
			c: {}
		},
		base2 = {
			a: '',
			b: 5,
			c: {
				D: 'DEF' 
			}
		},
		base3 = {
			a: '',
			b: 5,
			c: {
				D: {
				}
			}
		},
		extend1 = {
			c: {
				A: 'ABC'
			},
			d: {},
			e: 123
		},
		extend2 = {
			c: {

			},
			d: {},
			e: 123
		},
		extend3 = {
			a: '',
			b: 5,
			c: {
				D: {
					A: ''	
				}
			}
		};

		assert(JSON.stringify(merge.recursive(false, 5, 'abc')) === '{}', 'failed to merge number with a string correctly');
		assert(JSON.stringify(merge.recursive(true, base1, 'abc')) === '{"a":"","b":5,"c":{}}', 'failed to merge string with base1 object correctly');
		assert(JSON.stringify(merge.recursive(true, base1, 'abc')) === '{"a":"","b":5,"c":{}}', 'failed to merge (with clone) string with base1 object correctly');
		assert(JSON.stringify(merge.clone(base1)) === '{"a":"","b":5,"c":{}}', 'failed to clone base1 object correctly');
		assert(JSON.stringify(merge.recursive(true, base1, extend1)) === '{"a":"","b":5,"c":{"A":"ABC"},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');
		assert(JSON.stringify(merge.recursive(true, base1, extend1)) === '{"a":"","b":5,"c":{"A":"ABC"},"d":{},"e":123}', 'failed to merge (with clone) extend with base1 object correctly');
		assert(JSON.stringify(merge.recursive(true, base1, extend2)) === '{"a":"","b":5,"c":{},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');
		assert(JSON.stringify(merge.recursive(true, base2, extend1)) === '{"a":"","b":5,"c":{"D":"DEF","A":"ABC"},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');
		assert(JSON.stringify(merge.recursive(false, merge.clone(base1), merge.clone(extend1))) === '{"a":"","b":5,"c":{"A":"ABC"},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');		
		assert(JSON.stringify(merge(false, merge.clone(base1), merge.clone(extend1))) === '{"a":"","b":5,"c":{"A":"ABC"},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');		
		// console.log(JSON.stringify(merge.recursive(true, base1, extend3), null, 2));
		// assert(JSON.stringify(merge.recursive(true, base1, extend3)) === '{"a":"","b":5,"c":{"D":"DEF","A":"ABC"},"d":{},"e":123}', 'failed to merge extend with base1 object correctly');
	});
});