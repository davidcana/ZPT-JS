/* 
    expressionsUtils singleton class
*/
//var evaluateHelper = require( './evaluateHelper.js' );
//var utils = require( '../utils.js' );
//var DepsDataItem = require( '../parsers/depsDataItem.js' );
import { evaluateHelper } from './evaluateHelper.js';
import { utils } from '../utils.js';
import { DepsDataItem } from '../parsers/depsDataItem.js';

export const expressionsUtils = (function() {
    
    var buildLiteral = function( value ) {
        return evaluateHelper.isNumber( value )? "" + value: "'" + value + "'";
    };
    
    var buildList = function( items, asStrings ) {
        
        var result = '[';
        var separator = asStrings? "'": "";
        
        for ( var i = 0; i < items.length; i++ ) {
            result += separator + items[ i ] + separator + " ";
        }
        
        result += ']';
        return result;
    };
    
    var buildDependsOnList = function(){
        
        var result = [];
        
        var depsDataItem = arguments[ 0 ];
        if ( ! depsDataItem ){
            depsDataItem = new DepsDataItem();
        }
        
        var scope = arguments[ 1 ];
        
        for ( var argCounter = 2; argCounter < arguments.length; argCounter++ ){
            var list = arguments[ argCounter ];
            result = result.concat( 
                getDependsOnFromList( depsDataItem, scope, list )
            );
        }
        
        return result;
    };
    
    var getDependsOnFromList = function( depsDataItem, scope, arg ){
        
        var result = [];
        
        if ( ! arg ){
            return result;
        }
        
        if ( ! Array.isArray( arg ) ){
            return getDependsOnFromNonList( depsDataItem, scope, arg );
        }
        
        var list = arg;
        for ( var i = 0; i < list.length; i++ ) {
            var item = list[ i ];
            result = result.concat( 
                Array.isArray( item )? getDependsOnFromList( scope, item ): getDependsOnFromNonList( depsDataItem, scope, item )
            );
        }

        return result;
    };
    
    var getDependsOnFromNonList = function( depsDataItem, scope, item ){
        
        return ! utils.isFunction( item.dependsOn ) || ( utils.isFunction( item.getVarName ) && depsDataItem === item.getVarName() )? 
            []: 
            item.dependsOn( depsDataItem, scope );
    };
    
    return {
        buildLiteral: buildLiteral,
        buildList: buildList,
        buildDependsOnList: buildDependsOnList
    };
})();
