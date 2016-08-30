/**
 * 	main init scripting
 */



(function ($) {

    /* move country menu later in source for IE8-9 */
    $(".lt-ie10 .header--top__countrymenu")
                .detach()
                .appendTo("body");

    /* init Slick carousel http://kenwheeler.github.io/slick/ */
    $(".carousel").slick({
        arrows:         false,
        dots:           true,
        infinite:       true,
        autoplay:       true,
        fade:           true,
        speed:          500,
        lazyLoad:       'progressive',
        autoplaySpeed:  7000
    });

    /* navigation: dropdown menu's */
    $(function () {

        $('html').on('click touchend', function (e) {

            var eventObject = $(e.target).closest("[data-panel]");

            /* open and close panel buttons, unless you happen to click on a hyperlink other than href="#" */
            if ( eventObject.is("[data-panel]:not('[disabled]')") && !$(e.target).is("[href]:not([href='#'])") ) {

                e.preventDefault();

                // this ensures objects with [data-notouch] only respond on click (the do need a click event binding though)
                // handy if you don't want to open something while scrolling (touchend mess-up)
                if ( e.type == "click" || ( e.type == "touchend" && eventObject.is(":not('[data-notouch]')")) ) {

                    if ( eventObject.hasClass("is-active") ) {
                        togglePanel( $(document.getElementById( eventObject.data("panel") )), "close" );

                        if ( eventObject.is("[data-accordeon]") ) {
                            //$("[data-accordeon='" + eventObject.data("accordeon") + "']" ).each(function(i) {
                            //    $(this).removeClass("is-secondary");
                            //});

                            $("[data-accordeon='" + eventObject.data("accordeon") + "']").removeClass("is-secondary");
                        }

                    } else {

                        if ( eventObject.is("[data-accordeon]") ) {

                            $("[data-accordeon='" + eventObject.data("accordeon") + "']")
                                .filter("[data-panel]")
                                .each(function(){
                                    //console.log("woei");

                                    togglePanel( $(document.getElementById( $(this).data("panel") )), "close" );
                                })
                                .end()
                                .not("[data-panel]")
                                .addClass("is-secondary");


                            /*$("[data-accordeon='" + eventObject.data("accordeon") + "']" ).each(function(i) {
                                if ( $(this).data("panel") ) {
                                    togglePanel( $(document.getElementById( $(this).data("panel") )), "close" );
                                } else {
                                    $(this).addClass("is-secondary");
                                }
                            });*/
                        }

                        togglePanel( $(document.getElementById( eventObject.data("panel") )), "open" );
                    }
                }

            }

        });
    });


    //ipad and iphone fix
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        /*$("[data-accordeon='plantlist']").click(function(){ */
        $("#mselector__plants").click(function(){
            //we just need to attach a click event listener to ensure iPhone/iPod/iPad's do clicks instead of touchend (which messes up scrolling sometimes)
        });
    }


    // resize stuff
    // we need to resize panels on a mayor viewport resize, but we're gonna debounce it a bit
    (function($,sr){

      // debouncing function from John Hann
      // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
      var debounce = function (func, threshold, execAsap) {
          var timeout;

          return function debounced () {
              var obj = this, args = arguments;
              function delayed () {
                  if (!execAsap)
                      func.apply(obj, args);
                  timeout = null;
              };

              if (timeout)
                  clearTimeout(timeout);
              else if (execAsap)
                  func.apply(obj, args);

              timeout = setTimeout(delayed, threshold || 200);
          };
      }
      // smartresize
      jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    })(jQuery,'smartresize');


    // resize stuff actual usage
    // note by René: commented out due to flickering issues in the navigation menu
    /* $(window).smartresize(function(){

        // only set new height for open panels...
        $("[data-panel].is-active").each(
            function() {
                var myPanel = $(document.getElementById( $(this).data("panel") ));
                myPanel
                    .velocity({ height: [ myPanel.find(":first-child")[0].offsetHeight, [.37,1,.81,.98] ] }, { duration: 100 });
            }
        );
    }); */


})(jQuery);

/* algemene functie voor open en sluiten van panels */

function togglePanel(objRef,action) {

    var myPanel = jQuery(objRef),
        myTogglers = jQuery("[data-panel='" + objRef.attr("id") + "']");

    if (action == "open" && !myTogglers.hasClass("is-active") ) {

        // show the panel
        myPanel
            .velocity({ height: [ myPanel.find(":first-child")[0].offsetHeight, [.37,1,.81,.98] ] }, { duration: 300 });

        // change the button
        myTogglers
            .addClass("is-active");
    }

    if (action == "close" && myTogglers.hasClass("is-active") ) {

        // hide the panel
        myPanel
            .velocity({ height: [ "0px", [.37,1,.81,.98] ] }, { duration: 300 });

        // change the button
        myTogglers
            .removeClass("is-active");
    }
}

(function($){

/* mobile plant selector pager */
$(function(){
    $(".mselector__paginator a.is-disabled").click(function(e){
        e.preventDefault();
    });
})

/* optimized code for mobile plant selector */
$(function(){
    var memo = $([]);

    /* var isTouchSupported = "ontouchend" in document; */

    /*var evt = isTouchSupported ? "touchup" : "mousedown";*/

    $('#mselector__plants').on('click', 'li', function(){

        //evt.preventDefault();

        var panel = $(this).children('div');

        var outerHeight = panel.find(':first-child').outerHeight();

        var height = panel.has("div .link-primary").length ? outerHeight : outerHeight + 72;

        if (memo.length) {
            memo.parent().toggleClass("is-active");
            memo.parent().velocity({ backgroundColor: '#5e5b5c' }, { duration: 0 });
            memo.velocity({ height: [0, [.37,1,.81,.98]]}, { duration: 300 });
        }

        if (!panel.is(memo))
        {
            panel.parent().toggleClass("is-active");
            panel.parent().velocity({ backgroundColor: '#01a1dd' }, { duration: 0 });
            panel.velocity({ height: [height, [.37,1,.81,.98]] }, { duration: 300 });
            memo = panel;
        } else {
            memo = $([]);
        }

    })

});

}(jQuery));
