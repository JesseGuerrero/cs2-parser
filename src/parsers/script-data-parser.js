const up = require('./util-parsers.js');
const A = require('arcsecond');

const commaSeperated = A.sepBy(A.sequenceOf([
	A.char(','),
	A.optionalWhitespace
]));

const argumentParser = A.coroutine(function* () {
	let type = yield up.argumentTypeParser;
	yield A.whitespace;
	let name = yield up.variable;
	return up.asType('ARGUMENT') ({
		type,
		name
	});
});

const scriptData = A.coroutine(function* () {
	yield A.str('//'),
	yield A.regex(/^script_\d+/)

	yield A.char('(');

	let scriptId = yield A.digits;

	yield A.char(')');

	yield A.char('(');

	const args = yield commaSeperated(argumentParser);

	yield A.char(')');

	yield A.char('(');

	const returnType = yield up.returnTypeParser;

	yield A.char(')');
	yield A.optionalWhitespace;

	return up.asType('SCRIPT_DATA') ({
		id: scriptId,
		args
	});

});

module.exports = scriptData;