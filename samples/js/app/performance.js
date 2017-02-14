'use strict';

var $ = require( 'jquery' );
var CacheParser = require( '../../../js/app/parsers/parser.js' );
var NoCacheParser = require( '../../../js/app/parsers/noCacheParser.js' );
//var log = require( '../../../js/app/logHelper.js' );
var context = require( '../../../js/app/context.js' );

var testPerformance = function ( id, numberOfExecutions, dictionary ){
    
    print(
        '-------- Begin test of HTML element: ' + id + ' --------------' );
        
    //context.getConf().expressionCacheOn = false;
    var onePhaseStart = performance.now();
    run( id, numberOfExecutions, dictionary, NoCacheParser, 'NO CACHE parser' )
    var onePhaseElapsed = performance.now() - onePhaseStart;
    
    //context.getConf().expressionCacheOn = true;
    var twoPhasesStart = performance.now();
    run( id, numberOfExecutions, dictionary, CacheParser, 'CACHE parser' );
    var twoPhasesElapsed = performance.now() - twoPhasesStart;
    
    // Show differences
	showResume( id, numberOfExecutions, onePhaseElapsed, twoPhasesElapsed );
    
    print(
        '-------- End test of HTML element: ' + id + ' --------------' );
};

var run = function( id, numberOfExecutions, dictionary, Parser, description ){
    
    var parser =  new Parser({
        root: $( '#' + id )[0],
        dictionary: dictionary
    });
    
    for ( var c = 0; c < numberOfExecutions; ++c ){
        var start = performance.now();

        parser.run();

        print( 
            id + ': processed ' + description + ' in ' 
                + format( performance.now() - start) 
                + ' ms' );
    }
}

var showResume = function( id, numberOfExecutions, onePhaseElapsed, twoPhasesElapsed ){
    
    print( 
        'Template resume: ' + id );
    print( 
        'Total time of ' + numberOfExecutions + ' executions at'
            + ' one phase: ' + format( onePhaseElapsed ) + ' ms' );
    print( 
        'Average time of ' + numberOfExecutions + ' executions at'
            + ' one phase: ' + format( onePhaseElapsed / numberOfExecutions ) + ' ms' );
    print( 
        'Total time of ' + numberOfExecutions + ' executions at'
            + ' two phases: ' + format( twoPhasesElapsed ) + ' ms' );
    print( 
        'Average time of ' + numberOfExecutions + ' executions at'
            + ' two phases: ' + format( twoPhasesElapsed / numberOfExecutions ) + ' ms' );
    
    if ( onePhaseElapsed > twoPhasesElapsed ){
        print( 
            'Performance of two phases is better in ' + format( onePhaseElapsed - twoPhasesElapsed ) + ' ms'
                + ', one average execution in ' + format( ( onePhaseElapsed - twoPhasesElapsed ) / numberOfExecutions ) + ' ms'
                + ', ' + format( getPercent( onePhaseElapsed, twoPhasesElapsed ) ) + '% better ');
    } else if ( onePhaseElapsed < twoPhasesElapsed ){
        print(
            'Performance of one phase is better in ' + format( twoPhasesElapsed - onePhaseElapsed ) + ' ms'
                + ', one average execution in ' + format( ( twoPhasesElapsed - onePhaseElapsed ) / numberOfExecutions ) + ' ms'
                + ', ' + format( getPercent( twoPhasesElapsed, onePhaseElapsed ) ) + '% better ');
    } else {
        print(
            'Times are equal!' );
    }
}

var getPercent = function( number1, number2) {
    return '' + ( 100 - number2 * 100 / number1 );
}

var format = function( number ){
    return + ( Math.round( number + "e+2" )  + "e-2" );
};

var print = function( string ){
    console.log( string );
    //log.warn( string );
};

// Init vars
var dictionary = { 
    aString: "string",
    doggy: false,
    number1: 1,
    number100: 100,
    user: {
        name: "Bob", 
        age: function( ){
            return 25;
        }
    },
    items: [ 'item0', 'item1', 'item2' ],
    tools: [ 
        {name: "tool A", rent_url: "rent?id=1000"}, 
        {name: "tool B", rent_url: "rent?id=1002"}, 
        {name: "tool C", rent_url: "rent?id=1004"},
        {name: "tool D", rent_url: "rent?id=1006"}
    ]
};
var numberOfMultipleExecutions = 30;

// Test performance now!
testPerformance( 'statements', 1, dictionary );
testPerformance( 'statements', numberOfMultipleExecutions, dictionary );
testPerformance( 'shortLoop', 1, dictionary );
testPerformance( 'shortLoop', numberOfMultipleExecutions, dictionary );
testPerformance( 'longLoop', 1, dictionary );
testPerformance( 'longLoop', numberOfMultipleExecutions, dictionary );
//testPerformance( 'macros', numberOfMultipleExecutions, dictionary );
