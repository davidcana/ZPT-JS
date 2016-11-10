/*
    run function
    External dependencies: None
*/
exports.run = function( options ){
    var Parser = require( './parser.js' );

    var parser =  new Parser( options );
    parser.run();
};
