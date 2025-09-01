/*
    METALFillSlot class
*/
//var expressionsUtils = require( '../../expressions/expressionsUtils.js' );
//var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
import { expressionsUtils } from '../../expressions/expressionsUtils.js';
import { expressionBuilder } from '../../expressions/expressionBuilder.js';

export const METALFillSlot = function( _string, _expression, _useMacroNode ) {
    
    var string = _string;
    var expression = _expression;
    var useMacroNode = _useMacroNode;
    
    var process = function(){
        // Nothing to do
    };
    
    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( undefined, scope, expression );
    };
    
    var update = function( parserUpdater ){
        parserUpdater.updateNode( useMacroNode );
    };
    
    var toString = function(){
        return "METALFillSlot: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: METALFillSlot.id
    };
};

METALFillSlot.id = 'metal:fill-slot';

METALFillSlot.build = function( string, useMacroNode ) {
    //var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new METALFillSlot( 
            string,
            expressionBuilder.build( string ),
            useMacroNode
    );
};

//module.exports = METALFillSlot;
