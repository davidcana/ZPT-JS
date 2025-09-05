//var zz = require( 'zzdom' );
//var Qunit = require( 'qunit' );
//var zpt = require( '../../../js/app/main.js' );
//var I18n = zpt.I18n;
//var I18nBundle = zpt.I18nBundle;
//var i18nHelper = zpt.i18nHelper;
//var i18nTests = require( './i18nTests.js' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zpt } from '../../../index.js';
import { i18nTests } from './i18nTests.js';
var I18n = zpt.I18n;
var I18nBundle = zpt.I18nBundle;
var i18nHelper = zpt.i18nHelper;

var urlPrefix = './i18n/';
var es1JSONUrl = urlPrefix + 'es1.json';
var en1JSONUrl = urlPrefix + 'en1.json';
var es2JSONUrl = urlPrefix + 'es2.json';
var en2JSONUrl = urlPrefix + 'en2.json';

var jsonFiles = [ es1JSONUrl , en1JSONUrl, es2JSONUrl , en2JSONUrl ];

QUnit.config.autostart = false;

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

    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: dictionary,
        callback: function(){
            zpt.run();
            QUnit.start();
            i18nTests( dictionary );
        }
    });
});  




