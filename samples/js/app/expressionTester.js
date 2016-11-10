"use strict";

var $ = require( 'jquery' );
var Scope = require( '../../../js/app/scope.js' );
var expressionEvaluator = require( '../../../js/app/expressionEvaluator.js' );

var dictionary = { 
    aString: "string",
    doggy: false,
    number1: 1,
    number100: 100,
    user: {
        name: "Bob", 
        age: function( ){
            return 25;
        },
        birth: function( ){
            return {
                day: 3,
                month: 3,
                year: 1977,
                aFunction: function(){
                    return {
                        another: 'yes!'
                    };
                }
            };
        }
    },
    items: [ 'item0', 'item1', 'item2' ]
};

$( '#evaluate' ).click( function() {
    //alert('ok');
    try {
        var scope = new Scope( dictionary );
        var valueExpression = $( '#expression' ).val();
        var evaluated = expressionEvaluator.evaluateToNotNull( scope, valueExpression );
        $( '#result' ).text( evaluated );
    } catch ( e ){
        $( '#result' ).text( e );
    }

    return false;
});
