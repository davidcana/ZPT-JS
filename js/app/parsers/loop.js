/* 
    Class Loop 
*/
"use strict";

var context = require( '../context.js' );
var TalDefineHelper = require( './talDefineHelper.js' );
var expressionsUtils = require( '../expressions/expressionsUtils.js' );
var expressionBuilder = require( '../expressions/expressionBuilder.js' );
var $ = require( 'jquery' );

module.exports = function ( _itemVariableName, _expressionString, scope ) {
    
    var itemVariableName = _itemVariableName;
    var expressionString = _expressionString;
    var expression = expressionBuilder.build( expressionString );
    var items = expression.evaluate( scope );
    
    var currentIndex = -1;
    var maxIndex = items? items.length - 1: -1;
    var offset = 0;
    
    var setOffset = function( offsetToApply ){
        offset = offsetToApply;
    };
    
    var repeat = function( scope ){
        
        if ( currentIndex++ < maxIndex ) {
            
            scope.startElement();
            
            var talDefineHelper = new TalDefineHelper();
            
            // Declare item-index, item-all, item and item-repeat variables
            talDefineHelper.put(
                itemVariableName + '-index',
                currentIndex
            );
            talDefineHelper.put(
                itemVariableName + '-all',
                expressionString
            );
            talDefineHelper.put(
                itemVariableName,
                itemVariableName + '-all' + '[' + itemVariableName + '-index' + ']'
            );
            talDefineHelper.put(
                itemVariableName + '-repeat',
                "nocall:context/repeat(" 
                    + itemVariableName + "-index" + ","
                    + items.length
                    + ")"
            );
            
            // Set item variable
            //scope.set( itemVariableName, items[ currentIndex ] );
            
            // Set repeat variable
            var repeatVar = {};
            repeatVar[ itemVariableName ] = this;
            scope.set( 
                context.getConf().repeatVarName, 
                repeatVar
            );
            
            return talDefineHelper;
        }
        
        return null;
    };
    
    var currentIndexWithOffset = function(){
        return offset + currentIndex;
    };
    
    var index = function( ) {
        return currentIndexWithOffset();
    };
    
    var number = function( ) {
        return currentIndexWithOffset() + 1;
    };
    
    var even = function( ) {
        return currentIndexWithOffset() % 2 == 0;
    };
    
    var odd = function ( ) {
        return currentIndexWithOffset() % 2 == 1;
    };
    
    var start = function ( ) {
        return currentIndexWithOffset() == 0;
    };
    
    var end = function ( ) {
        return currentIndex == items.length - 1;
    };
    
    var length = function () {
        return offset + items.length;
    };

    var letter = function () {
        return formatLetter( currentIndexWithOffset(), 'a' );
    };
    
    var Letter = function () {
        return formatLetter( currentIndexWithOffset(), 'A' );
    };
    
    var formatLetter = function ( ii, startChar ) {
        var i = ii;
        var buffer = '';
        var start = startChar.charCodeAt( 0 ); 
        var digit = i % 26;
        buffer += String.fromCharCode( start + digit );
        
        while( i > 25 ) {
            i /= 26;
            digit = (i - 1 ) % 26;
            buffer += String.fromCharCode( start + digit );
        }
        
        return buffer.split('').reverse().join('');
    };
    
    var roman = function () {
        return formatRoman( currentIndexWithOffset() + 1, 0 );
    };
    
    var Roman = function () {
        return formatRoman( currentIndexWithOffset() + 1, 1 );
    };
    
    var formatRoman = function ( nn, capital ) {
        var n = nn;
        
        // Can't represent any number 4000 or greater
        if ( n >= 4000 ) {
            return 'Overflow formatting roman!';
        }

        var buf = '';
        for ( var decade = 0; n != 0; decade++ ) {
            var digit = n % 10;
            if ( digit > 0 ) {
                digit--;
                buf +=  romanArray [ decade ][ digit ][ capital ];
            }
            n = (n / 10) >> 0;
        }
        
        return buf.split( '' ).reverse().join( '' );
    };
    
    var romanArray = [
        /* One's place */
        [
            [ "i", "I" ],
            [ "ii", "II" ], 
            [ "iii", "III" ],
            [ "vi", "VI" ],
            [ "v", "V" ],
            [ "iv", "IV" ],
            [ "iiv", "IIV" ],
            [ "iiiv", "IIIV" ],
            [ "xi", "XI" ],
        ],

        /* 10's place */
        [
            [ "x", "X" ],
            [ "xx", "XX" ],
            [ "xxx", "XXX" ],
            [ "lx", "LX" ],
            [ "l", "L" ],
            [ "xl", "XL" ],
            [ "xxl", "XXL" ],
            [ "xxxl", "XXXL" ],
            [ "cx", "CX" ],
        ],

        /* 100's place */
        [
            [ "c", "C" ],
            [ "cc", "CC" ],
            [ "ccc", "CCC" ],
            [ "dc", "DC" ],
            [ "d", "D" ],
            [ "cd", "CD" ],
            [ "ccd", "CCD" ],
            [ "cccd", "CCCD" ],
            [ "mc", "MC" ],
        ],

        /* 1000's place */
        [
            [ "m", "M" ],
            [ "mm", "MM" ],
            [ "mmm", "MMM" ]
        ]
    ];
    
    return {
        setOffset: setOffset,
        repeat:repeat,
        index: index,
        number: number,
        even: even,
        odd: odd,
        start: start,
        end: end,
        length: length,
        letter: letter,
        Letter: Letter,
        roman: roman,
        Roman: Roman
    };
};
