/*
    loopManager singleton class
*/
module.exports = (function() {
    "use strict";
    
    var context = require( '../context.js' );
    var expressionEvaluator = require( './expressionEvaluator.js' );
    var Loop = require( '../loop.js' );
    
    /*var NAME = 'repeat';*/
    var NAME = context.getConf().repeatVarName;
    
    var getVarName = function( name ) {
        return NAME;
    };
    
    var create = function( scope, expression ){
        expression = expression.trim();
        var space = expression.indexOf( ' ' );
        if ( space == -1 ) {
            throw 'Bad repeat expression: ' + expression;
        }
        var name = expression.substring( 0, space );
        var loopExpression = expression.substring( space + 1 );
        var items = expressionEvaluator.evaluate( scope, loopExpression );            
        
        var fullName = getVarName( name );
        var loop = new Loop( fullName, name, items );
        
        return loop;
    };

    return {
        getVarName: getVarName,
        create: create
    };
})();
