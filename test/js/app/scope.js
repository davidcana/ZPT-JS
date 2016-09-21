QUnit.test( "Not defined var test", function( assert ) {
    assert.equal( $('#t1-1').text() , "undefined" );
    assert.equal( $('#t1-2').text() , "OK" );
});

QUnit.test( "Nested vars test", function( assert ) {
    assert.equal( $('#t2-1').text() , "1" );
    assert.equal( $('#t2-2').text() , "OK" );
    assert.equal( $('#t2-3').text() , "OK" );
    assert.equal( $('#t2-4').text() , "OK" );
    assert.equal( $('#t2-5').text() , "OK" );
    assert.equal( $('#t2-6').text() , "OK" );
    assert.equal( $('#t2-7').text() , "2" );
    assert.equal( $('#t2-8').text() , "OK" );
    assert.equal( $('#t2-9').text() , "OK" );
    assert.equal( $('#t2-10').text() , "three" );
    assert.equal( $('#t2-11').text() , "OK" );
    assert.equal( $('#t2-12').text() , "OK" );
    assert.equal( $('#t2-13').text() , "4" );
    assert.equal( $('#t2-14').text() , "OK" );
    assert.equal( $('#t2-15').text() , "OK" );
    assert.equal( $('#t2-16').text() , "2" );
    assert.equal( $('#t2-17').text() , "OK" );
    assert.equal( $('#t2-18').text() , "undefined" );
    assert.equal( $('#t2-19').text() , "OK" );
    assert.equal( $('#t2-20').text() , "OK" );
    assert.equal( $('#t2-21').text() , "1" );
    assert.equal( $('#t2-22').text() , "OK" );
    assert.equal( $('#t2-23').text() , "undefined" );
});

QUnit.test( "Out of scope var test", function( assert ) {
    assert.equal( $('#t3-1').text() , "OK" );
    assert.equal( $('#t3-2').text() , "undefined" );
    assert.equal( $('#t3-3').text() , "OK" );
    assert.equal( $('#t3-4').text() , "undefined" );
});

QUnit.test( "Global vars test", function( assert ) {
    assert.equal( $('#t4-1').text() , "OK" );
    assert.equal( $('#t4-2').text() , "OK" );
    assert.equal( $('#t4-3').text() , "OK" );
    assert.equal( $('#t4-4').text() , "1" );
    assert.equal( $('#t4-5').text() , "OK" );
    assert.equal( $('#t4-6').text() , "OK" );
    assert.equal( $('#t4-7').text() , "1" );
    assert.equal( $('#t4-8').text() , "OK" );
    assert.equal( $('#t4-9').text() , "OK" );
    assert.equal( $('#t4-10').text() , "OK" );
    assert.equal( $('#t4-11').text() , "1" );
    assert.equal( $('#t4-12').text() , "OK" );
    assert.equal( $('#t4-13').text() , "OK" );
    assert.equal( $('#t4-14').text() , "2" );
    assert.equal( $('#t4-15').text() , "OK" );
    assert.equal( $('#t4-16').text() , "OK" );
    assert.equal( $('#t4-17').text() , "2" );
    assert.equal( $('#t4-18').text() , "OK" );
    assert.equal( $('#t4-19').text() , "OK" );
    assert.equal( $('#t4-20').text() , "OK" );
    assert.equal( $('#t4-21').text() , "1" );
    assert.equal( $('#t4-22').text() , "OK" );
    assert.equal( $('#t4-23').text() , "OK" );
    assert.equal( $('#t4-24').text() , "2" );
    assert.equal( $('#t4-25').text() , "OK" );
    assert.equal( $('#t4-26').text() , "OK" );
    assert.equal( $('#t4-27').text() , "1" );
});

