import { zpt } from '../lib/zpt-esm.js';

// This is needed to make the git pages work
zpt.context.getConf().externalMacroPrefixURL = location.pathname.startsWith( '/ZPT-JS' )? '/ZPT-JS/': '/';

// Invoke ZPT
zpt.run(
    {
        command: 'preload',
        root: document.body,
        dictionary: {},
        declaredRemotePageUrls: [ 'templates.html' ],
        maxFolderDictionaries: 5,
        callback: function(){
            zpt.run();
        }
    }
);
