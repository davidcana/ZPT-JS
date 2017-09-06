/*
    JqueryExpression class
*/
"use strict";

var context = require( '../../context.js' );
var $ = require( 'jquery' );

var JqueryExpression = function( stringToApply ) {
    
    var string = stringToApply;
    
    var evaluate = function( scope ){
        
        try {
            var evaluated = eval( string );
            
            // String
            if ( typeof evaluated == "string" ){
                return evaluated;
            }
            
            // Element with length 1
            if ( evaluated.length == 1 ){
                return evaluated.text();
            }
            
            // Element with length > 1
            var texts = [];
            evaluated.each( function() {
                texts.push( $(this).text() );
            });
            return texts;
            
        } catch ( e ){
            return 'Jquery expression error in "' + string + '".';
        }
    };

    return {
        evaluate: evaluate
    };
};

JqueryExpression.removePrefix = false;

JqueryExpression.getPrefix = function() {
    if ( JqueryExpression.prefix === undefined ){
        JqueryExpression.prefix = context.getConf().jqueryExpression;
    }
    return JqueryExpression.prefix;
};

JqueryExpression.getId = JqueryExpression.getPrefix;

JqueryExpression.build = function( string ) {
    return new JqueryExpression( string );
}

JqueryExpression.prototype.toString = function(){
    return string;
};

module.exports = JqueryExpression;