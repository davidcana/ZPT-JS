/* 
    Class DepsDataItem 
*/
"use strict";

var DepsDataItem = function() {
    
    this.nonExpressionVars = {};
    this.expressionVars = {};
};

DepsDataItem.prototype.mustAddVar = function( varName ){
    return this.nonExpressionVars[ varName ] === undefined && this.expressionVars[ varName ] === undefined;
};

DepsDataItem.prototype.addAllVars = function( varNames, scope ){
    
    for ( var name in varNames ){
        this.add1Var( varNames[ name ], scope );
    }
};

DepsDataItem.prototype.add1ExpressionVar = function( varName ){
    this.expressionVars[ varName ] = true;
};

DepsDataItem.prototype.add1NonExpressionVar = function( varName ){
    this.nonExpressionVars[ varName ] = true;
};

DepsDataItem.prototype.add1Var = function( varName, scope ){

    var map = scope.isLocalVar( varName )? this.expressionVars: this.nonExpressionVars;
    map[ varName ] = true;

    return true;
};

module.exports = DepsDataItem;
