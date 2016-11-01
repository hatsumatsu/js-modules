/**
 * InView
 */
var InView = ( function() {
    var settings = {}

    var selector = {
        item: '[data-inview]'
    }

    var cache = [];

    var init = function() {
        Debug.log( 'InView.init()' );

        onResize();
        onScroll();

        bindEventhandlers();
    }

    var bindEventhandlers = function() {
        $( document )
            .on( 'viewport/resize/finish', function() {
                onResize();
            } )
            .on( 'viewport/scroll', function() {
                onScroll();
            } );
    }

    var onResize = function() {
        buildCache();
    }

    var onScroll = function() {
        var scrollTop = Viewport.get( 'scrollTop' );
        var winHeight = Viewport.get( 'height' );

        for( var i = 0; i < cache.length; i++ ) {
            var item = cache[i];

            var _inView = item.inView;
            var _progress = item.progress;

            // in / out
            if( scrollTop < item.bounds.top + item.height && scrollTop + winHeight > item.bounds.bottom - item.height ) {
                item.inView = true;

                // progress
                item.progress = 1 - ( item.bounds.top + item.height - scrollTop ) / ( winHeight + item.height );
            } else {
                item.inView = false;

                // progress
                if( scrollTop > item.bounds.top + item.height ) {
                    item.progress = 1;
                }

                if( scrollTop + item.height < item.bounds.bottom - item.height ) {
                    item.progress = 0;
                }
            }

            // enter / leave
            if( _inView !== item.inView ) {
                if( item.inView ) {
                    item.element.trigger( 'inview/enter', [{ item: item }] );
                } else {
                    item.element.trigger( 'inview/leave', [{ item: item }] );
                }
            }

            // progress
            if( _progress !== item.progress ) {
                item.element.trigger( 'inview/progress', [{ item: item, progress: item.progress }] );
            }
        }
    }

    var buildCache = function() {
        Debug.log( 'inView.buildCache()' );

        cache = [];

        $( selector.item ).each( function() {
            var item = $( this );
            var offset = item.offset();
            var width = item.outerWidth();
            var height = item.outerHeight();
            var top = offset.top;
            var left = offset.left;

            cache.push( {
                element: item,
                width: width,
                height: height,
                bounds: {
                    left: left,
                    right: left + width,
                    top: top,
                    bottom: top + height
                },
                inView: false,
                progress: 0
            } )
        } );

        Debug.log( cache );
    }

    return {
        init: function() { init(); }
    }
} )();

$( document ).ready( function() {
    InView.init();
} );
