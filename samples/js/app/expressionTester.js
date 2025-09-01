//var Scope = require( '../../../js/app/scopes/scope.js' );
//var expressionBuilder = require( '../../../js/app/expressions/expressionBuilder.js' );
import { Scope } from '../../../js/app/scopes/scope.js';
import { expressionBuilder } from '../../../js/app/expressions/expressionBuilder.js';

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
                        another: "yes!"
                    };
                }
            };
        }
    },
    items: [ "item0", "item1", "item2" ],
    return3: function( ){
        return 3;
    },
    property: "name",
    forceError: function(){
        throw "Forced error!"
    }
};

var resultSpan = document.getElementById( 'result' );
var expressionInput = document.getElementById( 'expression' );
var evaluateButton = document.getElementById( 'evaluate' );

var updateResult = function() {
    try {
        var scope = new Scope( dictionary, undefined, true );
        var expression = expressionBuilder.build( expressionInput.value );
        var evaluated = expression? expression.evaluate( scope ): '[Error: no expression]';
        resultSpan.textContent = evaluated === undefined? '[undefined]': evaluated;
    } catch ( e ){
        resultSpan.textContent = 'Exception thrown: ' + e;
    }
    return false;
};

evaluateButton.addEventListener( 'click', updateResult );

expressionInput.addEventListener( 
    'keyup', 
    function( e ) {
        var keyCode = e.which || e.keyCode;
        if ( keyCode === 13 ){
            e.preventDefault();
            updateResult();
        }
    }
);
