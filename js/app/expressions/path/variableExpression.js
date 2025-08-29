/*
    VariableExpression class
*/
//var context = require( '../../context.js' );
import { context } from '../../context.js';

export const VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        
        if ( ! scope.isValidVariable( name ) ){
            throw 'Not declared variable found using strict mode:' + name;
        }
        
        return scope.get( name );
    };
    
    var dependsOn = function( depsDataItem, scope ){
        
        if ( ! depsDataItem.mustAddVar( name ) ){
            return [];
        }
        
        var expression = scope.getVarExpression( name );
        if ( ! expression ){
            depsDataItem.add1NonExpressionVar( name );
            return [ name ];
        }
        
        depsDataItem.add1ExpressionVar( name );
        var result = expression.dependsOn( depsDataItem, scope );
        depsDataItem.addAllVars( result, scope );
        return result;
    };
    
    var getVarName = function(){
        return name;
    };
    
    var toString = function(){
        return name;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        getVarName: getVarName,
        toString: toString
    };
};

VariableExpression.build = function( string ) {
    
    return context.getConf().variableNameRE.test( string )?
        new VariableExpression( string ):
        undefined;
};

//module.exports = VariableExpression;
