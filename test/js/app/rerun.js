$(function () {
    "use strict";

    var counter = 10;
    var dictionary = { 
        counter: counter
    };
    
    QUnit.test( "Rerun tests", function( assert ) {
        zpt.run( 
            document.body, 
            dictionary, 
            continueTesting( counter ) );
    }
});

function continueTesting( counter ){
    runTests( counter );
    if ( counter > 0 ){
        var dictionary = { 
            counter: --counter
        };
        zpt.run( 
            document.body, 
            dictionary, 
            continueTesting( counter ) );
    }
}

function runTests( counter ){
    
    if ( counter % 2 == 0 ){
        assert.ok( $('#t1-1').is(':visible') );
        assert.notOk( $('#t1-2').is(':visible') );
    } else {
        assert.notOk( $('#t1-1').is(':visible') );
        assert.ok( $('#t1-2').is(':visible') );
    }
});
