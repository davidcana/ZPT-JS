/*
    loopManager singleton class
    External dependencies: None 
*/
var ZPT = ZPT || {};

ZPT.loopManager = (function() {
    "use strict";
    
    var NAME = 'repeat';
    
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
        var items = ZPT.expressionEvaluator.evaluate( scope, loopExpression );            
        
        var fullName = getVarName( name );
        var loop = new ZPT.Loop( fullName, name, items );
        
        return loop;
    };

    return {
        getVarName: getVarName,
        create: create
    };
})();
