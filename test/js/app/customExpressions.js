
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
var expressionBuilder = zpt.expressionBuilder;
var context = zpt.context;
import { AverageExpression } from './averageExpression.js';

var errorFunction = function( errors ) {
    throw errors;
};
zpt.context.setErrorFunction( errorFunction );

var buildDictionary = function(){
    
    return {
        aNumber: 5,
        from1To3: [ 1, 2, 3 ]
    }
};

var testNotDefinedExpression = function( assert ){
    
    try {
        zpt.run({
            root: document.body,
            dictionary: buildDictionary()
        });
        assert.equal( "true" , "false" );
    } catch ( e ) {
        assert.equal( e , "Unknown expression: avg: aNumber 1" );
    }
    //assert.equal( zz('#t1-1').html() , "undefined" );
    //assert.equal( zz('#t1-2').html() , "undefined" );
};

var testDefinedExpression = function( assert ){
    
    zpt.run({
            root: document.body,
            dictionary: buildDictionary()
    });
    assert.equal( zz('#t1-1').html() , 3 );
    assert.equal( zz('#t1-2').html() , 4 );
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
