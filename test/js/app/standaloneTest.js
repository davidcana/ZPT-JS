"use strict";

// Build dictionary
var dictionary = { 
    nullValue: null,
    aString: "string",
    yes: "yes",
    no: "no",
    doggy: false,
    number1: 1,
    otherNumber1: 1,
    number100: 100,
    user: {
        name: "Bob", 
        profile_url: "/profile?id=12345",
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
                        another: 'yes!'
                    };
                }
            };
        },
        add1Method: function( a ){
            return a + 1;
        },
        addMethod: function( a, b ){
            return a + b;
        },
        fireError: function( ){
            document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
        }
    }, 
    tools: [ 
        {name: "tool A", rent_url: "rent?id=1000"}, 
        {name: "tool B", rent_url: "rent?id=1002"}, 
        {name: "tool C", rent_url: "rent?id=1004"},
        {name: "tool D", rent_url: "rent?id=1006"}
    ], 
    rented: { 
        items: [
            {name: "Spanner", cost: 45, days: 3}
        ], 
        total_days: 3,
        total_cost: 45
    } ,
    items: [ 'item0', 'item1', 'item2' ],
    from1To3: [ 1, 2, 3 ],
    add: function( a, b ){
        return a + b;
    },
    function3: function( ){
        return 3;
    },
    divBy0: function( ){
        return 1 / 0;
    },
    someNumbers: [ 10, 20, 30, 40 ],
    customFormatter: function( value ){
        return "$" + value;
    }
};

// Add some values to dictionary
dictionary.textareaAttrs = {
    rows: 10,
    cols: 100
};

// Parse template using javascript API
/* globals zpt */
zpt.run({
    root: document.getElementById( 'tests-1' ),
    dictionary: dictionary
});

// Parse template using jquery plugin
zpt.run({
    root: document.getElementById( 'tests-2' ),
    dictionary: dictionary
});

// Run tests!
function defineTest( assert, preffix ) {
    assert.equal( $('#t' + preffix + '-1-1').html() , "1" );
    assert.equal( $('#t' + preffix + '-1-2').html() , "1.5" );
    assert.equal( $('#t' + preffix + '-1-3').html() , "this is a text" );
    assert.equal( $('#t' + preffix + '-1-4').html() , "this is a text too" );
    assert.equal( $('#t' + preffix + '-1-5').html() , "1" );
    assert.equal( $('#t' + preffix + '-1-6').html() , "1.5" );
    assert.equal( $('#t' + preffix + '-1-7').html() , "this is a text" );
    assert.equal( $('#t' + preffix + '-1-8').html() , "this is a text too" );
}

QUnit.test( "Define test (using javascript API)", function( assert ) {
    defineTest( assert, '1' );
});
QUnit.test( "Define test (using jQuery plugin)", function( assert ) {
    defineTest( assert, '2' );
});

function conditionTest( assert, preffix ) {
    assert.equal( $('#t' + preffix + '-2-1').html() , "yes!" );
    assert.ok( $('#t' + preffix + '-2-1').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-2').html() , "Bob" );
    assert.ok( $('#t' + preffix + '-2-2').is(':visible') );
    assert.notOk( $('#t' + preffix + '-2-3').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-4').html() , "a name" );
    assert.notOk( $('#t' + preffix + '-2-4').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-5').html() , "yes!" );
    assert.ok( $('#t' + preffix + '-2-5').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-6').html() , "Bob" );
    assert.ok( $('#t' + preffix + '-2-6').is(':visible') );
    assert.notOk( $('#t' + preffix + '-2-7').is(':visible') );
    assert.notOk( $('#t' + preffix + '-2-8').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-8').html() , "a name" );
    assert.equal( $('#t' + preffix + '-2-9').html().trim() , "Bob" );
    assert.ok( $('#t' + preffix + '-2-9').is(':visible') );
    assert.equal( $('#t' + preffix + '-2-10').html().trim() , "<span data-replace=\"user/name\">a name</span>" );
    assert.notOk( $('#t' + preffix + '-2-10').is(':visible') );
}

QUnit.test( "Condition test (using javascript API)", function( assert ) {
    conditionTest( assert, '1' );
});
QUnit.test( "Condition test (using jQuery plugin)", function( assert ) {
    conditionTest( assert, '2' );
});

function attributesTest( assert, preffix ) {
    assert.equal( $('#t' + preffix + '-3-1').attr('placeholder') , "Write something here!" );
    assert.equal( $('#t' + preffix + '-3-1').attr('rows') , "10" );
    assert.equal( $('#t' + preffix + '-3-1').attr('cols') , "100" );
    assert.equal( $('#t' + preffix + '-3-1').attr('maxlength') , "200" );
    assert.equal( $('#t' + preffix + '-4-1').attr('title') , "title in string expression" );
    assert.equal( $('#t' + preffix + '-4-1').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t' + preffix + '-4-2').attr('title') , "title in string expression" );
    assert.equal( $('#t' + preffix + '-4-2').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t' + preffix + '-5-1').attr('title'), undefined );
    assert.equal( $('#t' + preffix + '-5-1').attr('href') , "http://www.xxx.org" );
}

QUnit.test( "Attributes test (using javascript API)", function( assert ) {
    attributesTest( assert, '1' );
});
QUnit.test( "Attributes test (using jQuery plugin)", function( assert ) {
    attributesTest( assert, '2' );
});
