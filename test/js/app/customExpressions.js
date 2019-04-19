"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var Qunit = require( 'qunit' );
var expressionBuilder = require( '../../../js/app/expressions/expressionBuilder.js' );
var context = require( '../../../js/app/context.js' );

var AverageExpression = require( './averageExpression.js' );

var buildDictionary = function(){
    
    return {
        aNumber: 5,
        from1To3: [ 1, 2, 3 ]
    }
};

var testNotDefinedExpression = function( assert ){
    
    zpt.run({
            root: document.body,
            dictionary: buildDictionary()
    });
    assert.equal( $('#t1-1').html() , "undefined" );
    assert.equal( $('#t1-2').html() , "undefined" );
};

var testDefinedExpression = function( assert ){
    
    zpt.run({
            root: document.body,
            dictionary: buildDictionary()
    });
    assert.equal( $('#t1-1').html() , 3 );
    assert.equal( $('#t1-2').html() , 4 );
};

QUnit.test( "Custom expressions test", function( assert ) {
    
    
    // Set all cache off
    context.getConf().attributeCacheOn = false;
    context.getConf().expressionCacheOn = false;
    
    // Test when the custom expression is not registered yet
    testNotDefinedExpression( assert );
    
    // Test when the custom expression is registered
    expressionBuilder.register( AverageExpression );
    testDefinedExpression( assert );
    
    // Test when the custom expression is unregistered
    expressionBuilder.unregister( AverageExpression );
    testNotDefinedExpression( assert );
    
    // Test when the custom expression is registered again
    expressionBuilder.register( AverageExpression );
    testDefinedExpression( assert );
    
});
