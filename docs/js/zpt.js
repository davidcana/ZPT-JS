// This is needed to make the git pages work
zpt.context.getConf().externalMacroPrefixURL = location.pathname.startsWith( '/Zcrud' )? '/Zcrud/': '/';

// Invoke ZPT
zpt.run(
    {
        command: 'preload',
        root: [ 
            document.getElementById( 'commonHeader' ), 
            document.getElementById( 'commonFooter' )
        ],
        dictionary: {},
        declaredRemotePageUrls: [ 'templates.html' ],
        callback: function(){
            zpt.run();
        }
    }
);

/*
// Invoke ZPT
var zptParser = zpt.buildParser({
    root: [ 
        document.getElementById( 'commonHeader' ), 
        document.getElementById( 'commonFooter' )
    ],
    dictionary: {},
    declaredRemotePageUrls: [ 'templates.html' ]
});

// This is needed to make the git pages work
zpt.context.getConf().externalMacroPrefixURL = location.pathname.startsWith( '/Zcrud' )? '/Zcrud/': '/';

zptParser.init(
    function(){
        zptParser.run();
    }
);
*/
