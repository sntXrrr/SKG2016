(function ($) {

  console.log("booh");

  /* init Slick carousel http://kenwheeler.github.io/slick/ */
  $(".carousel-home")
    .slick({
      arrows:         true,
      dots:           true,
      infinite:       true,
      autoplay:       true,
      fade:           true,
      speed:          750,
      autoplaySpeed:  7000
    });

  // set links to slide index on first slide
  $(".slick-slide:not(:only-of-type)").find(".slide-01-links a, .slide-01-links2 a").each( function(index){
    $(this).click( function(event,slick){
      event.preventDefault();
      $(".carousel-home").slick("slickGoTo",index+1);
    })
  });

  // id needs to be set to correct twitter account in the head of the page
  var config = {
    "id": twitterid,
    "dataOnly": true,
    "maxTweets": 3,
    "customCallback": initTwitterCarousel
  };

  twitterFetcher.fetch(config);

  function initTwitterCarousel(tweets) {

    var twitterSlides = '';
    for (var i = 0, lgth = tweets.length; i < lgth ; i++) {
      var tweetObject = tweets[i];
      twitterSlides += '<div>'
        + '<p class="tweet-content">' + tweetObject.tweet
        + '<span class="tweet-infos">, ' + tweetObject.time + '</span></p>'
      + '</div>';
    }

    $("#twitterfeed")
      .html(twitterSlides)
      .slick({
        arrows:         false,
        dots:           true,
        infinite:       true,
        autoplay:       true,
        fade:           true,
        speed:          160,
        lazyLoad:       'progressive',
        autoplaySpeed:  6000
    });
  };

})(jQuery);
