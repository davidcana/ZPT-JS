/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );

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
    }
};

zpt.run({
    command: 'preload',
    root: document.body,
    dictionary: dictionary,
    declaredRemotePageUrls: [ 'externalMacros-definitions2.html', 'externalMacros-definitions3.html' ],
    callback: function(){
        zpt.run();
        runTests();
    }
});

function runTests(){
    
QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
        <p>
    Before use macro
</p>
<b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
        `;
    assertHtml( assert, '#t1', t1 );
});

QUnit.test( "Dynamic macro", function( assert ) {
    assert.equal( $('#t2-1').text() , "A test of a dynamic macro" );
    
    var t2 = `
    <b style="display: none;" data-muse-macro="dynamicMacro/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="dynamicMacro">
    Dynamic text: <span id="t2-1" data-tattributes="id string:t2-1" data-tcontent="string:A test of a dynamic macro">A test of a dynamic macro</span>
</p>
    `;
    assertHtml( assert, '#t2', t2 );
});

QUnit.test( "Dynamic macro reading var (var = undefined)", function( assert ) {
    assert.equal( $('#t3-1').text() , "undefined" );
    
    var t3 = `
<b style=\"display: none;\" data-tdefine=\"id string:t3-1\" data-muse-macro=\"dynamicMacroReadingVar/externalMacros-definitions.html\">
    Macro goes here
</b>
<p data-tdefine=\"id string:t3-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t3-1\" data-tattributes=\"id id\" data-tcontent=\"var\">undefined</span>
</p>
    `;
    assertHtml( assert, '#t3', t3 );
});

QUnit.test( "Dynamic macro reading var (var = 1)", function( assert ) {
    assert.equal( $('#t4-1').text() , "1" );
    
    var t4 = `
<b style=\"display: none;\" data-tdefine=\"var 1; id string:t4-1\" data-muse-macro=\"dynamicMacroReadingVar/externalMacros-definitions.html\">
    Macro goes here
</b>
<p data-tdefine=\"var 1; id string:t4-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t4-1\" data-tattributes=\"id id\" data-tcontent=\"var\">1</span>
</p>
    `;
    assertHtml( assert, '#t4', t4 );
});

QUnit.test( "Dynamic macro reading var (items = [10 20 30]) test", function( assert ) {
    assert.equal( getValues( '.listItems1' ) , '10/20/30'  );
    
    var t5 = `
<b style=\"display: none;\" data-tdefine=\"items [10 20 30]\" data-muse-macro=\"list/externalMacros-definitions.html\">
    Macro goes here
</b>
<ul data-tdefine=\"items [10 20 30]\" data-mmacro=\"list\">
    <li data-trepeat=\"item items\" style=\"display: none;\">
        <span data-tcontent=\"item\" data-tattributes=\"class string:listItems1\">An item</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-tcontent=\"item\" data-tattributes=\"class string:listItems1\">10</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-tcontent=\"item\" data-tattributes=\"class string:listItems1\">20</span>
    </li><li data-qdup=\"1\">
        <span class=\"listItems1\" data-tcontent=\"item\" data-tattributes=\"class string:listItems1\">30</span>
    </li>
</ul>
        `;
        assertHtml( assert, '#t5', t5 );
});

QUnit.test( "Macro using 1 slot test", function( assert ) {
    
    var t6 = `
<p style=\"display: none;\" data-muse-macro=\"sidebar/externalMacros-definitions.html\">
    <em data-mfill-slot=\"'additional_info'\">
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
        assertHtml( assert, '#t6', t6 );
});


QUnit.test( "Macro using 2 slots test", function( assert ) {
    
    var t7 = `
<div style=\"display: none;\" data-muse-macro=\"enhacedSidebar/externalMacros-definitions.html\">
    <div data-mfill-slot=\"'links'\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em data-mfill-slot=\"'additional_info'\">
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
        assertHtml( assert, '#t7', t7 );
});

QUnit.test( "Macro using 2 slots but only defining 1 test", function( assert ) {
    
    var t8 = `
<div style=\"display: none;\" data-muse-macro=\"enhacedSidebar/externalMacros-definitions.html\">
    <em data-mfill-slot=\"'additional_info'\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</div>
<div data-mmacro=\"enhacedSidebar\">
    Links
    <div data-mdefine-slot=\"links\">
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
        assertHtml( assert, '#t8', t8 );
});
    
    
    QUnit.test( "External macro test using var", function( assert ) {

        var t10 = `
    <b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
        Macro goes here
    </b>
    <p data-mmacro="copyright">
        Copyright 2020, <em>Foo, Bar, and Associates</em> Inc.
    </p>
`;
        assertHtml( assert, '#t10', t10 );
    });
    
    
    QUnit.test( "3 external macros in 3 different external macro files test using var", function( assert ) {

        var t11 = `
    <b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
        Macro goes here
    </b>
    <p data-mmacro="copyright">
        Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
    </p>
    <b style="display: none;" data-muse-macro="copyright/externalMacros-definitions2.html">
        Macro goes here
    </b>
    <p data-mmacro="copyright">
        Copyright 2020, <em>Foo, Bar, and Associates</em> Inc.
    </p>
    <b style="display: none;" data-muse-macro="copyright/externalMacros-definitions3.html">
        Macro goes here
    </b>
    <p data-mmacro="copyright">
        Copyright 2030, <em>Foo, Bar, and Associates</em> Inc.
    </p>
`;
        assertHtml( assert, '#t11', t11 );
    });          


    QUnit.test( "Simple external macros with local calls test", function( assert ) {
        var t12 = `
<p>
Before use macro
</p>
<b style="display: none;" data-muse-macro="copyright@externalMacros-definitions.html">
Macro goes here
</b>
<p data-mmacro="copyright">
Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
In the middle of 2 macros
</p>
<b style="display: none;" data-muse-macro="enhancedCopyright@externalMacros-definitions.html">
Macro goes here
</b>
<div data-mmacro="copyright">
<p>
This macro calls another macro.
</p>
<p data-muse-macro="'copyright'" style="display: none;">
Macro goes here
</p>
<p data-mmacro="copyright">
Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
</div>
<p>
After use macro
</p>
`;
        assertHtml( assert, '#t12', t12 );
    });  
 
    QUnit.test( "Using define tags in macro use and macro call", function( assert ) {
        assert.equal( $('#t13-1').text() , "It works!" );
        assert.equal( $('#t13-2').text() , "It also works!" );
    });
}

function getValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}

function assertHtml( assert, id1, id2 ){
    assert.equal( 
        $( id1 ).text().replace(/\s+/g, ""), 
        $( id2 ).text().replace(/\s+/g, ""), 
        "Passed!" ); 
}
