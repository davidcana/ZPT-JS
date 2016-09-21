QUnit.test( "id reference test", function( assert ) {
    assert.equal( $('#value1').text() , "10" );
    assert.equal( $('#t1').text() , "10" );
    assert.equal( $('#value1').text() , $('#t1').text() );
});

QUnit.test( "class reference test", function( assert ) {
    assert.equal( $('#t2').text() , "10,20,30" );
});

QUnit.test( "add of class reference test", function( assert ) {
    assert.equal( $('#t3').text() , "60" );
    assert.equal( $('#t4').text() , "160" );
});

