//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';

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
    assert.equal( zz('#number10').html() , "10" );
    assert.equal( zz('#number20').html() , "20" );
    assert.equal( zz('#number30').html() , "30" );
    assert.equal( zz('#number40').html() , "40" );
    
    // Test nested loop with complex object
    assert.equal( zz('#tool1').html() , "tool A" );
    assert.equal( zz('#tool2').html() , "tool B" );
    assert.equal( zz('#tool3').html() , "tool C" );
    
    assert.equal( zz('#toolNumber110').html() , "10" );
    assert.equal( zz('#toolNumber120').html() , "20" );
    assert.equal( zz('#toolNumber230').html() , "30" );
    assert.equal( zz('#toolNumber240').html() , "40" );
    assert.equal( zz('#toolNumber350').html() , "50" );
    assert.equal( zz('#toolNumber360').html() , "60" );
    
});

