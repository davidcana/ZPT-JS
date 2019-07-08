/* 
    Class DepsDataItem 
*/
"use strict";

var DepsDataItem = function() {
    
    this.dictionary = {};
    this.nonDictionary = {};
};

DepsDataItem.prototype.mustAddVar = function( varName ){
    return this.dictionary[ varName ] === undefined || this.nonDictionary[ varName ] === undefined;
};

DepsDataItem.prototype.addVars = function( varNames, scope ){
    
    for ( var name in varNames ){
        this.add1Var( varNames[ name ], scope );
    }
};

DepsDataItem.prototype.add1Var = function( varName, scope ){

    var map = scope.isLocalVar( varName )? this.nonDictionary: this.dictionary;
    map[ varName ] = true;

    return true;
};

DepsDataItem.prototype.listDictionaryVars = function(){

    var result = [];
    
    for ( var name in this.dictionary ){
        result.push( this.dictionary[ name ] );
    }
    
    return result;
};

module.exports = DepsDataItem;
