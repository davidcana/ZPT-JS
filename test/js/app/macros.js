"use strict";

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
<b style=\"display: none;\" data-muse-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b style=\"display: none;\" data-muse-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
        `;
    assert.htmlEqualExt( '#t1', t1 );
    /*
    assert.equal( 
            $('#t1').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            t1.replace(/(\r\n|\n|\r|\t| )/gm,""), 
            "Passed!" );*/
});

QUnit.test( "Dynamic macro", function( assert ) {
    assert.equal( $('#t2-1').text() , "A test of a dynamic macro" );
    
    var t2 = `
    <b style=\"display: none;\" data-muse-macro=\"dynamicMacro\">
    Macro goes here
</b>
<p data-mmacro=\"dynamicMacro\">
    Dynamic text: <span id=\"t2-1\" data-tcontent=\"string:A test of a dynamic macro\" data-tattributes=\"id string:t2-1\">A test of a dynamic macro</span>
</p>
    `;
    assert.htmlEqualExt( '#t2', t2 );
    /*
    assert.equal( 
            $('#t2').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            t2.replace(/(\r\n|\n|\r|\t| )/gm,""), 
            "Passed!" );*/
    /*
    assert.equal( 
            $('#t2').html(), 
            t2, 
            "Passed!" );*/
});

QUnit.test( "Dynamic macro reading var (var = undefined)", function( assert ) {
    assert.equal( $('#t3-1').text() , "undefined" );
    
    var t3 = `
<b style=\"display: none;\" data-tdefine=\"id string:t3-1\" data-muse-macro=\"dynamicMacroReadingVar\">
    Macro goes here
</b>
<p data-tdefine=\"id string:t3-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t3-1\" data-tcontent=\"var\" data-tattributes=\"id id\">undefined</span>
</p>
    `;
    assert.htmlEqualExt( '#t3', t3 );
    /*
    assert.equal( 
            $('#t3').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            t3.replace(/(\r\n|\n|\r|\t| )/gm,""), 
            "Passed!" );*/
            
    /*
    assert.equal( 
            $('#t3').html(), 
            t3, 
            "Passed!" );*/
});

QUnit.test( "Dynamic macro reading var (var = 1)", function( assert ) {
    assert.equal( $('#t4-1').text() , "1" );
    
    var t4 = `
<b style=\"display: none;\" data-tdefine=\"var 1; id string:t4-1\" data-muse-macro=\"dynamicMacroReadingVar\">
    Macro goes here
</b>
<p data-tdefine=\"var 1; id string:t4-1\" data-mmacro=\"dynamicMacroReadingVar\">
    Var value: <span id=\"t4-1\" data-tcontent=\"var\" data-tattributes=\"id id\">1</span>
</p>
    `;
    assert.htmlEqualExt( '#t4', t4 );
    /*
    assert.equal( 
            $('#t4').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            t4.replace(/(\r\n|\n|\r|\t| )/gm,""), 
            "Passed!" );*/
            
    /*
    assert.equal( 
            $('#t4').html(), 
            t4, 
            "Passed!" );*/
});

QUnit.test( "Dynamic macro reading var (items = [10 20 30]) test", function( assert ) {
    assert.equal( getValues( '.listItems1' ) , '10/20/30'  );
    
    var t5 = `
<b style=\"display: none;\" data-tdefine=\"items [10 20 30]\" data-muse-macro=\"list\">
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
        assert.htmlEqualExt( '#t5', t5 );
        /*
        assert.equal( 
                $('#t5').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
                t5.replace(/(\r\n|\n|\r|\t| )/gm,""), 
                "Passed!" );*/
                
        /*
        assert.equal( 
                $('#t5').html(), 
                t5, 
                "Passed!" );*/
});

QUnit.test( "Macro using 1 slot test", function( assert ) {
    
    var t6 = `
<p style=\"display: none;\" data-muse-macro=\"sidebar\">
    <em data-mfill-slot=\"additional_info\">
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
        assert.htmlEqualExt( '#t6', t6 );
        /*
        assert.equal( 
                $('#t6').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
                t6.replace(/(\r\n|\n|\r|\t| )/gm,""), 
                "Passed!" );*/
                
        /*
        assert.equal( 
                $('#t6').html(), 
                t6, 
                "Passed!" );*/
});

QUnit.test( "Macro using 2 slots test", function( assert ) {
    
    var t7 = `
<div style=\"display: none;\" data-muse-macro=\"enhacedSidebar\">
    <div data-mfill-slot=\"links\">
        <ul>
            <li><a href=\"/\">Home</a></li>
            <li><a href=\"/otherProducts\">Other products</a></li>
        </ul>
    </div>
    <em data-mfill-slot=\"additional_info\">
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
        assert.htmlEqualExt( '#t7', t7 );
        /*
        assert.equal( 
                $('#t7').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
                t7.replace(/(\r\n|\n|\r|\t| )/gm,""), 
                "Passed!" );*/
                
        /*
        assert.equal( 
                $('#t7').html(), 
                t7, 
                "Passed!" );*/
});

QUnit.test( "Macro using 2 slots but only defining 1 test", function( assert ) {
    
    var t8 = `
<div style=\"display: none;\" data-muse-macro=\"enhacedSidebar\">
    <em data-mfill-slot=\"additional_info\">
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
        assert.htmlEqualExt( '#t8', t8 );
        /*
        assert.equal( 
                $('#t8').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
                t8.replace(/(\r\n|\n|\r|\t| )/gm,""), 
                "Passed!" );*/
                
        /*
        assert.equal( 
                $('#t8').html(), 
                t8, 
                "Passed!" );*/
});

QUnit.test( "Dynamic macro using 1 slot (items = [10 20 30]) test", function( assert ) {
    
    var t9 = `
<b style=\"display: none;\" data-tdefine=\"items [10 20 30]\" data-muse-macro=\"dynamicListWith1Slot\">
    <em data-mfill-slot=\"additional_info\">
        Make sure to check out our <a href=\"/specials\">specials</a>.
    </em>
</b>
<ul data-tdefine=\"items [10 20 30]\" data-mmacro=\"dynamicListWith1Slot\">
    <li data-trepeat=\"item items\" style=\"display: none;\">
        <span data-tcontent=\"item\">An item</span>
    </li>
    <li data-qdup=\"1\">
        <span data-tcontent=\"item\">10</span>
    </li>
    <li data-qdup=\"1\">
        <span data-tcontent=\"item\">20</span>
    </li>
    <li data-qdup=\"1\">
        <span data-tcontent=\"item\">30</span>
    </li>
    <li>
        <em>
            Make sure to check out our <a href=\"/specials\">specials</a>.
        </em>
    </li>
</ul>
        `;
        assert.htmlEqualExt( '#t9', t9 );
        /*
        assert.equal( 
                $('#t9').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
                t9.replace(/(\r\n|\n|\r|\t| )/gm,""), 
                "Passed!" );*/
                
        /*
        assert.equal( 
                $('#t9').html(), 
                t9, 
                "Passed!" );*/
});

QUnit.test( "Using var as macro id test (using copyright)", function( assert ) {
    var t10 = `
<b style=\"display: none;\" data-muse-macro=\"copyright\">
    Macro goes here
</b>
<p data-mmacro=\"copyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
        `;
    assert.htmlEqualExt( '#t10', t10 );
});

QUnit.test( "Using var as macro id test (using newCopyright)", function( assert ) {
    var t11 = `
<b style=\"display: none;\" data-muse-macro=\"newCopyright\">
    Macro goes here
</b>
<p data-mmacro=\"newCopyright\">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
        `;
    assert.htmlEqualExt( '#t11', t11 );
});

function getValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}