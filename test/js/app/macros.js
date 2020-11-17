/* jshint esversion: 6 */
"use strict";

var zz = require( 'zzdom' );
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
<b data-use-macro="'copyright'" data-id="1" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright" data-related-id="1" data-qdup="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b data-use-macro="'copyright'" data-id="2" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright" data-related-id="2" data-qdup="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
`;
    utils.assertHtml( assert, 't1', t1 );
});

QUnit.test( "Dynamic macro", function( assert ) {
    assert.equal( zz('#t2-1').text() , "A test of a dynamic macro" );

    var t2 = `
<b data-use-macro="'dynamicMacro'" data-id="3" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="dynamicMacro" data-related-id="3" data-qdup="1">
    Dynamic text: <span data-content="string:A test of a dynamic macro" data-attributes="id string:t2-1" data-id="4" id="t2-1">A test of a dynamic macro</span>
</p>
`;
    utils.assertHtml( assert, 't2', t2 );
});

QUnit.test( "Dynamic macro reading var (var = undefined)", function( assert ) {
    assert.equal( zz('#t3-1').text() , "undefined" );

    var t3 = `
<b data-define="id string:t3-1" data-use-macro="'dynamicMacroReadingVar'" data-id="5" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="dynamicMacroReadingVar" data-define="id string:t3-1" data-related-id="5" data-qdup="1" data-id="6">
    Var value: <span data-content="var" data-attributes="id id" data-id="7" id="t3-1">undefined</span>
</p>
`;
    utils.assertHtml( assert, 't3', t3 );
});

QUnit.test( "Dynamic macro reading var (var = 1)", function( assert ) {
    assert.equal( zz('#t4-1').text() , "1" );

    var t4 = `
<b data-define="var 1; id string:t4-1" data-use-macro="'dynamicMacroReadingVar'" data-id="8" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="dynamicMacroReadingVar" data-define="var 1; id string:t4-1" data-related-id="8" data-qdup="1" data-id="9">
    Var value: <span data-content="var" data-attributes="id id" data-id="10" id="t4-1">1</span>
</p>
`;
    utils.assertHtml( assert, 't4', t4 );
});

QUnit.test( "Dynamic macro reading var (items = [10 20 30]) test", function( assert ) {
    assert.equal( utils.getAllValues( '.listItems1' ) , '10/20/30'  );

    var t5 = `
<b data-define="items [10 20 30]" data-use-macro="'list'" data-id="11" style="display: none;">
    Macro goes here
</b>
<ul data-mmacro="list" data-define="items [10 20 30]" data-related-id="11" data-qdup="1" data-id="12">
    <li data-repeat="item items" data-id="13" style="display: none;">
        <span data-content="item" data-attributes="class string:listItems1">An item</span>
    </li>
    <li data-qdup="1" data-id="14" data-related-id="13" data-tauto-define="item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)">
        <span data-content="item" data-attributes="class string:listItems1" data-id="15" class="listItems1">10</span>
    </li>
    <li data-qdup="1" data-id="16" data-related-id="13" data-tauto-define="item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)">
        <span data-content="item" data-attributes="class string:listItems1" data-id="17" class="listItems1">20</span>
    </li>
    <li data-qdup="1" data-id="18" data-related-id="13" data-tauto-define="item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)">
        <span data-content="item" data-attributes="class string:listItems1" data-id="19" class="listItems1">30</span>
    </li>
</ul>
`;
    utils.assertHtml( assert, 't5', t5 );
});

QUnit.test( "Macro using 1 slot test", function( assert ) {

    var t6 = `
<p data-use-macro="'sidebar'" data-id="20" style="display: none;">
    <em data-fill-slot="'additional_info'" data-id="21">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</p>
<div data-mmacro="sidebar" data-related-id="20" data-qdup="1">
    Links
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/contact">Contact Us</a></li>
    </ul>
    <em data-id="22">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
`;
    utils.assertHtml( assert, 't6', t6 );
});

QUnit.test( "Macro using 2 slots test", function( assert ) {

    var t7 = `
<div data-use-macro="'enhacedSidebar'" data-id="23" style="display: none;">
    <div data-fill-slot="'links'" data-id="24">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/otherProducts">Other products</a></li>
        </ul>
    </div>
    <em data-fill-slot="'additional_info'" data-id="25">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
<div data-mmacro="enhacedSidebar" data-related-id="23" data-qdup="1">
    Links
    <div data-id="26">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/otherProducts">Other products</a></li>
        </ul>
    </div>
    <em data-id="27">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
`;
    utils.assertHtml( assert, 't7', t7 );
});

QUnit.test( "Macro using 2 slots but only defining 1 test", function( assert ) {

    var t8 = `
<div data-use-macro="'enhacedSidebar'" data-id="28" style="display: none;">
    <em data-fill-slot="'additional_info'" data-id="29">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
<div data-mmacro="enhacedSidebar" data-related-id="28" data-qdup="1">
    Links
    <div data-define-slot="links">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/contact">Contact Us</a></li>
        </ul>
    </div>
    <em data-id="30">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
`;
    utils.assertHtml( assert, 't8', t8 );
});

QUnit.test( "External macro test using var", function( assert ) {

    var t10 = `
<b data-use-macro="copyrightMacroId" data-id="43" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright" data-related-id="43" data-qdup="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
`;
    utils.assertHtml( assert, 't10', t10 );
});

QUnit.test( "3 external macros in 3 different external macro files test using var", function( assert ) {

    var t11 = `
<b data-use-macro="copyrightMacroId" data-id="45" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="newCopyright" data-related-id="45" data-qdup="1">
    Copyright 2017, <em>Foo, Bar, and Associates</em> Inc.
</p>
`;
    utils.assertHtml( assert, 't11', t11 );
});          

QUnit.test( "Simple external macros with local calls test", function( assert ) {
    var t12 = `
<div data-use-macro="'enhacedSidebar'" data-define="linksSlot 'links'; additionalInfoSlot 'additional_info'" data-id="46" style="display: none;">
    <div data-fill-slot="linksSlot" data-id="47">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/otherProducts">Other products</a></li>
        </ul>
    </div>
    <em data-fill-slot="additionalInfoSlot" data-id="48">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
<div data-mmacro="enhacedSidebar" data-define="linksSlot 'links'; additionalInfoSlot 'additional_info'" data-related-id="46" data-qdup="1" data-id="51">
    Links
    <div data-id="49">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/otherProducts">Other products</a></li>
        </ul>
    </div>
    <em data-id="50">
        Make sure to check out our <a href="/specials">specials</a>.
    </em>
</div>
`;
    utils.assertHtml( assert, 't12', t12 );
});  

QUnit.test( "Using define tags in macro use and macro call", function( assert ) {
    assert.equal( zz('#t14-1').text() , "It works!" );
    assert.equal( zz('#t14-2').text() , "It also works!" );
});

QUnit.test( "Slot evaluation", function( assert ) {
    assert.equal( utils.count( '[href="/sales"]' ) , 1  );
});
