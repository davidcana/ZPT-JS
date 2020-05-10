// This is needed to make the git pages work
zpt.context.getConf().externalMacroPrefixURL = location.pathname.startsWith( '/ZPT-JS' )? '/ZPT-JS/': '/';

// Init dictionary
var dictionary = {
    objects: [
        {
            id: 'object1',
            items: [ 'item1', 'item2', 'item3' ]
        },
        {
            id: 'object2',
            items: [ 'item1', 'item2', 'item3' ]
        }
    ]
};

// Invoke ZPT
zpt.run(
    {
        command: 'preload',
        root: document.body,
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'templates.html' ],
        maxFolderDictionaries: 5,
        callback: function(){
            zpt.run();
            
            document.getElementById( 'addObjectButton' ).addEventListener( 'click', function(){
                
                var objectId = document.getElementById( 'objectIdToAdd' ).value;
                if ( ! objectId ){
                    alert( 'Please, type an object id!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            id: 'objects',
                            action: 'createArray',
                            index: '_last_',
                            newElement: {
                                id: objectId,
                                items: []
                            },
                            animation: 'createKeyframes 1s 3'
                        }
                    ]
                });
            });
            
            document.getElementById( 'updateObjectButton' ).addEventListener( 'click', function(){
                
                var currentObjectId = document.getElementById( 'currentObjectIdToUpdate' ).value;
                if ( ! currentObjectId ){
                    alert( 'Please, type a current object id!' );
                    return;
                }
                var newObjectId = document.getElementById( 'newObjectIdToUpdate' ).value;
                if ( ! newObjectId ){
                    alert( 'Please, type a new current object id!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            search: [
                                'objects',
                                {
                                    id: currentObjectId
                                }
                            ],
                            action: 'updateObject',
                            property: 'id',
                            newElement: newObjectId,
                            animation: 'updateKeyframes 1s 3'
                        }
                    ]
                });
            });
            
            document.getElementById( 'removeObjectButton' ).addEventListener( 'click', function(){
                
                var objectId = document.getElementById( 'objectIdToRemove' ).value;
                if ( ! objectId ){
                    alert( 'Please, type an object id!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            id: 'objects',
                            action: 'deleteArray',
                            currentElement: {
                                id: objectId
                            },
                            animation: 'deleteKeyframes 1s 3'
                        }
                    ]
                });
            });
            
            document.getElementById( 'addItemButton' ).addEventListener( 'click', function(){
                
                var objectId = document.getElementById( 'objectFromItemToAdd' ).value;
                if ( ! objectId ){
                    alert( 'Please, type an object id!' );
                    return;
                }
                
                var item = document.getElementById( 'itemToAdd' ).value;
                if ( ! item ){
                    alert( 'Please, type an item!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            search: [
                                'objects',
                                {
                                    id: objectId
                                },
                                'items'
                            ],
                            action: 'createArray',
                            index: '_last_',
                            newElement: item,
                            animation: 'createKeyframes 1s 3'
                        }
                    ]
                });
            });
            
            document.getElementById( 'updateItemButton' ).addEventListener( 'click', function(){
                
                var objectId = document.getElementById( 'objectFromItemToUpdate' ).value;
                if ( ! objectId ){
                    alert( 'Please, type an object id!' );
                    return;
                }
                
                var currentItem = document.getElementById( 'currentItemToUpdate' ).value;
                if ( ! currentItem ){
                    alert( 'Please, type a current item!' );
                    return;
                }
                
                var newItem = document.getElementById( 'newItemToUpdate' ).value;
                if ( ! newItem ){
                    alert( 'Please, type a new item!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            search: [
                                'objects',
                                {
                                    id: objectId
                                },
                                'items'
                            ],
                            action: 'updateArray',
                            currentElement: currentItem,
                            newElement: newItem,
                            animation: 'updateKeyframes 1s 3'
                        }
                    ]
                });
            });
            
            document.getElementById( 'removeItemButton' ).addEventListener( 'click', function(){
                
                var objectId = document.getElementById( 'objectFromItemToRemove' ).value;
                if ( ! objectId ){
                    alert( 'Please, type an object id!' );
                    return;
                }
                
                var item = document.getElementById( 'itemToRemove' ).value;
                if ( ! item ){
                    alert( 'Please, type an item!' );
                    return;
                }
                
                zpt.run({
                    command: 'update',
                    dictionaryActions: [
                        {
                            search: [
                                'objects',
                                {
                                    id: objectId
                                },
                                'items'
                            ],
                            action: 'deleteArray',
                            currentElement: item,
                            animation: 'deleteKeyframes 1s 3'
                        }
                    ]
                });
            });
        }
    }
);
