"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var I18n = require( '../../../js/app/i18n/i18n.js' );
var I18nBundle = require( '../../../js/app/i18n/i18nBundle.js' );
var i18nHelper = require( '../../../js/app/i18n/i18nHelper.js' );
var i18nAsyncTests = require( './i18nAsyncTests.js' );

var urlPrefix = './';
var es1JSONUrl = urlPrefix + 'i18n/es1.json';
var en1JSONUrl = urlPrefix + 'i18n/en1.json';
var es2JSONUrl = urlPrefix + 'i18n/es2.json';
var en2JSONUrl = urlPrefix + 'i18n/en2.json';

var jsonFiles = [ es1JSONUrl , en1JSONUrl, es2JSONUrl , en2JSONUrl ];

var init = function( assert ){
    
    var done = assert.async(); // QUnit's assert.async() function tells the framework to pause all tests until done() is called.

    i18nHelper.loadAsync( jsonFiles , function( i18nMap ){

        // Create I18n and I18nBundle instances
        var i18nES1 = new I18n( 'es', i18nMap[ es1JSONUrl ] );
        var i18nES2 = new I18n( 'es', i18nMap[ es2JSONUrl ] );
        var i18nEN1 = new I18n( 'en', i18nMap[ en1JSONUrl ] );
        var i18nEN2 = new I18n( 'en', i18nMap[ en2JSONUrl ] );
        var i18nBundle1 = new I18nBundle( i18nES1, i18nEN1 );
        var i18nBundle2 = new I18nBundle( i18nES2, i18nEN2 );

        // Init dictionary
        var dictionary = {
            'i18nES1':  i18nES1,
            'i18nES2': i18nES2,
            'i18nEN1':  i18nEN1,
            'i18nEN2': i18nEN2,
            'i18nBundle1': i18nBundle1,
            'i18nBundle2': i18nBundle2,
            'i18nESArray': [ i18nES2, i18nES1 ],
            'i18nENArray': [ i18nEN2, i18nEN1 ],
            fireError: function( ){
                document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
            },
            date : new Date( Date.UTC( 2012, 11, 20, 3, 0, 0 ) )
        };

        var zptParser = zpt.buildParser({
            root: document.body,
            dictionary: dictionary
        });

        zptParser.init(
            function(){
                zptParser.run();
                done();
            }
        );
    });  
};

QUnit.module( 'module', {  
    before: function( assert ){
        init( assert );
    }
});

i18nAsyncTests();
