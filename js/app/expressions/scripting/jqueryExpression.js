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
            for ( var i = 0; i < evaluated.length; ++i ){
                texts.push( evaluated[ i ].innerText );
            }
            return texts;
            
        } catch ( e ){
            return 'Jquery expression error in "' + string + '": ' + e;
        }
    };

    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return string;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
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
};

module.exports = JqueryExpression;
