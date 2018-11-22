"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var I18nBundle = require( '../../../js/app/i18n/i18nBundle.js' );
var i18nHelper = require( '../../../js/app/i18n/i18nHelper.js' );
var i18nAsyncTests = require( './i18nAsyncTests.js' );

// Init dictionary
var dictionary = {
    fireError: function( ){
        document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
    },
    date : new Date( Date.UTC( 2012, 11, 20, 3, 0, 0 ) )
};

var init = function( assert ){
    
    var done = assert.async(); // QUnit's assert.async() function tells the framework to pause all tests until done() is called.

    var zptParser = zpt.buildParser({
        root: document.body,
        dictionary: dictionary,
        i18n: {
            urlPrefix: './i18n/',
            files: {
                'es': [ 'es1.json', 'es2.json' ],
                'en': [ 'en1.json', 'en2.json' ]
            }
        }
    });

    zptParser.init(
        function(){

            // Add I18nBundle instances to dictionary
            var dictionaryExtension = {
                i18nBundle1: new I18nBundle( dictionary.i18nES1, dictionary.i18nEN1 ),
                i18nBundle2: new I18nBundle( dictionary.i18nES2, dictionary.i18nEN2 )
            };
            $.extend( true, dictionary, dictionaryExtension );

            // Run ZPT
            zptParser.run();
            
            // Start tests
            done();
        }
    );
}


QUnit.module( 'module', {  
    before: function( assert ){
        init( assert );
    }
});

i18nAsyncTests();
