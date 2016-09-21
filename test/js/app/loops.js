QUnit.test( "loop test", function( assert ) {
    assert.equal( getValues( '.value' ) , 'tool A/tool B/tool C/tool D'  );
    assert.equal( getValues( '.index' ) , '0/1/2/3'  );
    assert.equal( getValues( '.number' ) , '1/2/3/4'  );
    assert.equal( getValues( '.isEven' ) , 'true/false/true/false'  );
    assert.equal( getValues( '.isOdd' ) , 'false/true/false/true'  );
    assert.equal( getValues( '.isStart' ) , 'true/false/false/false'  );
    assert.equal( getValues( '.isEnd' ) , 'false/false/false/true'  );
    assert.equal( getValues( '.getLength' ) , '4/4/4/4'  );
    assert.equal( getValues( '.getLetter' ) , 'a/b/c/d'  );
    assert.equal( getValues( '.getCapitalLetter' ) , 'A/B/C/D'  );
    assert.equal( getValues( '.getRoman' ) , 'i/ii/iii/iv'  );
    assert.equal( getValues( '.getCapitalRoman' ) , 'I/II/III/IV'  );
});

QUnit.test( "array loops test", function( assert ) {
    assert.equal( getValues( '.cValue1' ) , '10/20/30' );
    assert.equal( getValues( '.cValue2' ) , 'jaja/jeje/jiji' );
    assert.equal( getValues( '.cValue3' ) , 'jaja/100/2' );
    assert.equal( getValues( '.cValue4' ) , 'jaja/100/5' );
    assert.equal( getValues( '.cValue5' ) , '1/2/3/4/5' );
    assert.equal( getValues( '.cValue6' ) , '1/3/5/7' );
    assert.equal( getValues( '.cValue7' ) , '7/5/3/1' );
    assert.equal( getValues( '.cValue8' ) , '0/1/2/3/4/5'  );
    assert.equal( getValues( '.cValue9' ) , '2/4/6/8'  );
    assert.equal( getValues( '.cValue10' ) , 'jaja/0/1/2/jeje'  );
    assert.equal( getValues( '.cValue11' ) , ''  );
    assert.equal( getValues( '.cValue12' ) , ''  );
    assert.equal( getValues( '.cValue13' ) , ''  );
});

QUnit.test( "dynamic loops test", function( assert ) {
    assert.equal( getValues( '.nValue1' ) , '10/20/30/40' );
    
    // Replace 10/20/30/40 by 10/20/30
    var statistics = {
            someNumbers: [ 10, 20, 30 ]
        };
    jspt.run( 
            $( '#dynamicLoop' )[0], 
            statistics);
    assert.equal( getValues( '.nValue1' ) , '10/20/30' );
    
    // Add 40/50/60
    var statistics = {
            someNumbers: [ 40, 50, 60 ]
        };
    jspt.run( 
            $( '#dynamicLoop' )[0], 
            statistics,
            null, 
            true );
    assert.equal( getValues( '.nValue1' ) , '10/20/30/40/50/60' );
});

function getValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().slice( 1 ).join( '/' );
}
