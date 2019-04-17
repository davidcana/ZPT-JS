/* 
    expressionsUtils singleton class
*/
"use strict";

var evaluateHelper = require( './evaluateHelper.js' );

module.exports = (function() {
    
    var buildLiteral = function( value ) {
        return evaluateHelper.isNumber( value )? "" + value: "'" + value + "'";
    };
    
    return {
        buildLiteral: buildLiteral
    };
})();
