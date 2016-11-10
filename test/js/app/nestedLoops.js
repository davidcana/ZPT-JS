"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var Qunit = require( 'qunitjs' );

QUnit.test( "nested loops test", function( assert ) {
    
    // Init and run zpt
    var values = {
        someNumbers: [ [10, 20], [30, 40] ],
        tools: [ 
            {id: "1", name: "tool A", numbers: [10, 20]}, 
            {id: "2", name: "tool B", numbers: [30, 40]}, 
            {id: "3", name: "tool C", numbers: [50, 60]}
        ]
        };
    zpt.run({
        root: document.body,
        dictionary: values
    });
    
    // Test nested loop with numeric arrays
    assert.equal( $('#number10').html() , "10" );
    assert.equal( $('#number20').html() , "20" );
    assert.equal( $('#number30').html() , "30" );
    assert.equal( $('#number40').html() , "40" );
    
    // Test nested loop with complex object
    assert.equal( $('#tool1').html() , "tool A" );
    assert.equal( $('#tool2').html() , "tool B" );
    assert.equal( $('#tool3').html() , "tool C" );
    
    assert.equal( $('#toolNumber110').html() , "10" );
    assert.equal( $('#toolNumber120').html() , "20" );
    assert.equal( $('#toolNumber230').html() , "30" );
    assert.equal( $('#toolNumber240').html() , "40" );
    assert.equal( $('#toolNumber350').html() , "50" );
    assert.equal( $('#toolNumber360').html() , "60" );
    
});

