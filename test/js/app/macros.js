/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var utils = require( './utils.js' );

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
            //return 1 / 0;
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

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests
QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
        <p>
    Before use macro
</p>
<b style=\"display: none;\" data-use-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b style=\"display: none;\" data-use-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
        `;
    utils.assertHtml( assert, '#t1', t1 );
});

QUnit.test( "Dynamic macro", function( assert ) {
    assert.equal( $('#t2-1').text() , "A test of a dynamic macro" );
    
    var t2 = `
    <b style=\"display: none;\" data-use-macro=\"dynamicMacro\">
    Macro goes here
</b>
<p data-mmacro=\"dynamicMacro\">
    Dynamic text: <span id=\"t2-1\" data-content=\"string:A test of a dynamic macro\" data-attributes=\"id string:t2-1\">A test of a dynamic macro</span>
</p>
    `;
    utils.assertHtml( assert, '#t2', t2 );
});

QUnit.test( "Dynamic macro reading var (var = undefined)", function( assert ) {
    assert.equal( $('#t3-1').text() , "undefined" );
    
    var t3 = `
<b style=\"display: none;\" data-define=\"id string:t3-1\" data-use-macro=\"dynamicMacroReadingVar\">
    Macro goes here
</b>
<p data-define=\"id string:t3-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t3-1\" data-content=\"var\" data-attributes=\"id id\">undefined</span>
</p>
    `;
    utils.assertHtml( assert, '#t3', t3 );
});

QUnit.test( "Dynamic macro reading var (var = 1)", function( assert ) {
    assert.equal( $('#t4-1').text() , "1" );
    
    var t4 = `
<b style=\"display: none;\" data-define=\"var 1; id string:t4-1\" data-use-macro=\"dynamicMacroReadingVar\">
    Macro goes here
</b>
<p data-define=\"var 1; id string:t4-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t4-1\" data-content=\"var\" data-attributes=\"id id\">1</span>
</p>
    `;
    utils.assertHtml( assert, '#t4', t4 );
});

QUnit.test( "Dynamic macro reading var (items = [10 20 30]) test", function( assert ) {
    assert.equal( utils.getAllValues( '.listItems1' ) , '10/20/30'  );
    
    var t5 = `
<b style=\"display: none;\" data-define=\"items [10 20 30]\" data-use-macro=\"list\">
    Macro goes here
</b>
<ul data-define=\"items [10 20 30]\" data-mmacro=\"list\">
    <li data-repeat=\"item items\" style=\"display: none;\">
        <span data-content=\"item\" data-attributes=\"class string:listItems1\">An item</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-content=\"item\" data-attributes=\"class string:listItems1\">10</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-content=\"item\" data-attributes=\"class string:listItems1\">20</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-content=\"item\" data-attributes=\"class string:listItems1\">30</span>
    </li>
</ul>
        `;
        utils.assertHtml( assert, '#t5', t5 );
});

QUnit.test( "Macro using 1 slot test", function( assert ) {
    
    var t6 = `
<p style=\"display: none;\" data-use-macro=\"sidebar\">
    <em data-fill-slot=\"'additional_info'\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</p>
<div data-mmacro=\"sidebar\">
    Links
    <ul>
        <li><a href=\"/\">Home</a></li>
        <li><a href=\"/products\">Products</a></li>
        <li><a href=\"/support\">Support</a></li>
        <li><a href=\"/contact\">Contact Us</a></li>
    </ul>
    <em>
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
        `;
        utils.assertHtml( assert, '#t6', t6 );
});

QUnit.test( "Macro using 2 slots test", function( assert ) {
    
    var t7 = `
<div style=\"display: none;\" data-use-macro=\"enhacedSidebar\">
    <div data-fill-slot=\"'links'\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em data-fill-slot=\"'additional_info'\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
<div data-mmacro=\"enhacedSidebar\">
    Links
    <div>
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em>
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
        `;
        utils.assertHtml( assert, '#t7', t7 );
});

QUnit.test( "Macro using 2 slots but only defining 1 test", function( assert ) {
    
    var t8 = `
<div style=\"display: none;\" data-use-macro=\"enhacedSidebar\">
    <em data-fill-slot=\"'additional_info'\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
<div data-mmacro=\"enhacedSidebar\">
    Links
    <div data-define-slot=\"links\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/products\">Products</a></li>
            <li><a href=\"/support\">Support</a></li>
            <li><a href=\"/contact\">Contact Us</a></li>
        </ul>
    </div>
    <em>
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
        `;
        utils.assertHtml( assert, '#t8', t8 );
});

QUnit.test( "Dynamic macro using 1 slot (items = [10 20 30]) test", function( assert ) {
    
    var t9 = `
<b style=\"display: none;\" data-define=\"items [10 20 30]\" data-use-macro=\"dynamicListWith1Slot\">
    <em data-fill-slot=\"'additional_info'\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</b>
<ul data-define=\"items [10 20 30]\" data-mmacro=\"dynamicListWith1Slot\">
    <li data-repeat=\"item items\" style=\"display: none;\">
        <span data-content=\"item\">An item</span>
    </li>
    <li data-qdup=\"1\">
        <span data-content=\"item\">10</span>
    </li>
    <li data-qdup=\"1\">
        <span data-content=\"item\">20</span>
    </li>
    <li data-qdup=\"1\">
        <span data-content=\"item\">30</span>
    </li>
    <li>
        <em>
            Make sure to check out our <a href=\"/specials\">specials</a>.
        </em>
    </li>
</ul>
        `;
        utils.assertHtml( assert, '#t9', t9 );
});

QUnit.test( "Using var as macro id test (using copyright)", function( assert ) {
    var t10 = `
<b style=\"display: none;\" data-use-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
        `;
    utils.assertHtml( assert, '#t10', t10 );
});

QUnit.test( "Using var as macro id test (using newCopyright)", function( assert ) {
    var t11 = `
<b style=\"display: none;\" data-use-macro=\"newCopyright\">
    Macro goes here
</b>
<p data-mmacro=\"newCopyright\">
    Copyright 2017, <em>Foo, Bar, and Associates</em> Inc.
</p>
        `;
    utils.assertHtml( assert, '#t11', t11 );
});

QUnit.test( "Macro using 2 slots test and vars", function( assert ) {
    
    var t12 = `
<div style=\"display: none;\" data-use-macro=\"enhacedSidebar\"
                              data-define="linksSlot 'links';
                                            additionalInfoSlot 'additional_info'">
    <div data-fill-slot=\"linksSlot\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em data-fill-slot=\"additionalInfoSlot\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
<div data-mmacro=\"enhacedSidebar\">
    Links
    <div>
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em>
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
        `;
        utils.assertHtml( assert, '#t12', t12 );
});

QUnit.test( "Macro using 2 slots test and vars (first is null)", function( assert ) {
    
    var t13 = `
<div style=\"display: none;\" data-use-macro=\"enhacedSidebar\"
                              data-define="linksSlot 'links';
                                            additionalInfoSlot 'additional_info'">
    <div data-fill-slot=\"linksSlot\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em data-fill-slot=\"additionalInfoSlot\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
<div data-mmacro=\"enhacedSidebar\">
    Links
    <div>
        <ul>
	                <li><a href="/">Home</a></li>
	                <li><a href="/products">Products</a></li>
	                <li><a href="/support">Support</a></li>
	                <li><a href="/contact">Contact Us</a></li>
        </ul>
    </div>
    <em>
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
        `;
        utils.assertHtml( assert, '#t13', t13 );
});

QUnit.test( "Using define tags in macro use and macro call", function( assert ) {
    assert.equal( $('#t14-1').text() , "It works!" );
    assert.equal( $('#t14-2').text() , "It also works!" );
});

QUnit.test( "Slot evaluation", function( assert ) {
    assert.equal( utils.count( '[href="/sales"]' ) , 1  );
});
