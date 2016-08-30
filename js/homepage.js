(function ($) {

  /* init Slick carousel http://kenwheeler.github.io/slick/ */
  $(".carousel-home").slick({
      arrows:         true,
      dots:           true,
      infinite:       true,
      autoplay:       false,
      fade:           true,
      speed:          500,
      lazyLoad:       'progressive',
      autoplaySpeed:  7000
  });

  // id needs to be set to correct twitter account
  var config = {
    "id": '501395932357726208',
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
