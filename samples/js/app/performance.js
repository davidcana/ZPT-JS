//var zpt = require( '../../../js/app/main.js' );
//var context = require( '../../../js/app/context.js' );
import { zpt } from '../../../index.js';
import { context } from '../../../js/app/context.js';

var testPerformance = function ( id, numberOfExecutions, dictionary ){
    
    print( '-------- Begin test of HTML element: ' + id + ' --------------' );
        
    context.getConf().expressionCacheOn = false;
    var noCacheStart = performance.now();
    run( id, numberOfExecutions, dictionary, 'NO CACHE parser' )
    var noCacheElapsed = performance.now() - noCacheStart;
    
    context.getConf().expressionCacheOn = true;
    var cacheStart = performance.now();
    run( id, numberOfExecutions, dictionary, 'CACHE parser' );
    var cacheElapsed = performance.now() - cacheStart;
    
    // Show differences
	showResume( id, numberOfExecutions, noCacheElapsed, cacheElapsed );
    
    print( '-------- End test of HTML element: ' + id + ' --------------' );
};

var run = function( id, numberOfExecutions, dictionary, description ){
    
    for ( var c = 0; c < numberOfExecutions; ++c ){
        var start = performance.now();

        zpt.run({
            root: document.getElementById( id ),
            dictionary: dictionary
        });

        print( 
            id + ': processed ' + description + ' in ' 
                + format( performance.now() - start) 
                + ' ms' 
        );
    }
}

var showResume = function( id, numberOfExecutions, noCacheElapsed, cacheElapsed ){
    
    print( 
        'Template resume: ' + id
    );
    print( 
        'Total time of ' + numberOfExecutions + ' executions at'
            + ' one phase: ' + format( noCacheElapsed ) + ' ms' 
    );
    print( 
        'Average time of ' + numberOfExecutions + ' executions at'
            + ' one phase: ' + format( noCacheElapsed / numberOfExecutions ) + ' ms' 
    );
    print( 
        'Total time of ' + numberOfExecutions + ' executions at'
            + ' two phases: ' + format( cacheElapsed ) + ' ms' 
    );
    print( 
        'Average time of ' + numberOfExecutions + ' executions at'
            + ' two phases: ' + format( cacheElapsed / numberOfExecutions ) + ' ms' 
    );
    
    if ( noCacheElapsed > cacheElapsed ){
        print( 
            'Performance of two phases is better in ' + format( noCacheElapsed - cacheElapsed ) + ' ms'
                + ', one average execution in ' + format( ( noCacheElapsed - cacheElapsed ) / numberOfExecutions ) + ' ms'
                + ', ' + format( getPercent( noCacheElapsed, cacheElapsed ) ) + '% better '
        );
    } else if ( noCacheElapsed < cacheElapsed ){
        print(
            'Performance of one phase is better in ' + format( cacheElapsed - noCacheElapsed ) + ' ms'
                + ', one average execution in ' + format( ( cacheElapsed - noCacheElapsed ) / numberOfExecutions ) + ' ms'
                + ', ' + format( getPercent( cacheElapsed, noCacheElapsed ) ) + '% better '
        );
    } else {
        print(
            'Times are equal!' 
        );
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
