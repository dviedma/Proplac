//= require funcarousel
//= require timeago

jQuery(document).ready(function () {
	$.proplac();
});

(function ($) {
	var variable;

	$.extend({
		proplac:function (ops) {

			var defaults = {

			};

			var options = $.extend({}, defaults, ops);

			/**
			 * Section: Fresh Fabrics
			 */
			var sliderhero = {
				/**
				 * Slider Hero
				 *
				 * @method build
				 * @return undefined
				 * @param undefined
				 */
				build:function () {

					$('#slider1').funCarousel({
						'securityMargin':1,
						'speed':1000,
						'parallax':true,
						'controlNav':true
					});
				}
			};

			/**
			 * Section: Social
			 */
			var social = {
				/**
				 * Polls different APIs
				 *
				 * @method build
				 * @return undefined
				 * @param undefined
				 */
				build: function (username) {


					//Youtube
					var youtubeLimit = 1;
					var videoString;
					$.getJSON("http://gdata.youtube.com/feeds/users/" + username + "/uploads?alt=json-in-script&max-results=" + youtubeLimit + "&format=5&callback=?", function (data) {
						var url = data.feed.entry[0].link[0].href;
						var url_thumbnail = data.feed.entry[0].media$group.media$thumbnail[0].url;
						videoString = '<a href="' + url + '" target="_blank"><img src="' + url_thumbnail + '" alt=""><div class="logo">youtube</div><div class="play">play</div></a>';
						$(".youtube").html(videoString);
					});

					//Twitter
					var tweetsLimit = 1;
					var linkRegexp = /(http:\/\/+[\S]*)/g;
					var handlerRegexp = /(@+[\S]*)/g;
					var hashtagRegexp = /(#+[\S]*)/g;
					var doubleHash = /(%23#)/g;
					var tweetString;
					$.getJSON("http://api.twitter.com/1/statuses/user_timeline/" + username + ".json?include_rts=true&count=" + tweetsLimit + "&callback=?", function (data) {
						tweetString = data[0].text.replace(linkRegexp, "<a href='$1' target='_blank'>$1</a>");
						tweetString = tweetString.replace(handlerRegexp, "<a href='http://twitter.com/$1' target='_blank'>$1</a>");
						//TODO link to hashtag
						tweetString = tweetString.replace(hashtagRegexp, "<a href='http://twitter.com/#!/search/%23$1' target='_blank'>$1</a>");
						tweetString = tweetString.replace(doubleHash, "%23");
						$("#tweet").html(tweetString);
					});

					//Instagram
					/*$('.instagram').instagram({
						hash:'apliiqhomepage',
						show:1,
						clientId:'b76cb39fa7ff4f83835861df4d6b4eeb'
					});*/

					//Facebook
					var results;
					var lastPhotoPost;
					var lastVideoPost;
					var lastStatusPost;
					var picture;
					var postString;
					$.ajax({
						url:"https://graph.facebook.com/theapliiqpage/feed?access_token=384410611610742|Zggo90jouEkyEqDts_LS6AfcLFE",
						dataType:'json',
						data:results,
						success:function (results) {
							for (var i = 0; i < results.data.length; i++) {
								if (results.data[i].from.name == "apliiq") {
									if (results.data[i].type == 'photo') {
										lastPhotoPost = results.data[i];
										picture = lastPhotoPost.picture.replace('_s.jpg', '_n.jpg');
										postString = '<a href="' + lastPhotoPost.link + '" target="_blank"><img src="' + picture + '" alt=""><div class="logo">facebook</div></a>';
										$('.facebook').addClass('photo');
										break;
									} else if (results.data[i].type == 'video') {
										lastVideoPost = results.data[i];
										picture = lastVideoPost.picture.replace('_t.jpg', '_n.jpg');
										postString = '<a href="' + lastVideoPost.link + '" target="_blank"><img height="220px" src="' + picture + '" alt=""><div class="logo">facebook</div><div class="play">play</div></a>';
										$('.facebook').addClass('photo');

										break;
									} else if (results.data[i].type == 'status' && results.data[i].message != undefined) {
										lastStatusPost = results.data[i];
										$('abbr.timeago').attr('title', lastStatusPost.created_time);
										jQuery("abbr.timeago").timeago();

										var msg = lastStatusPost.message;
										if (msg.length > 190) {
											msg = msg.substr(0, 190) + "...";
										}
										msg = msg.replace(linkRegexp, "<a href='$1' target='_blank'>$1</a>");

										postString = '<span class="status-msg">' + msg + '</<span><a target="_blank" href="https://www.facebook.com/theapliiqpage">' +
											'<div class="logo">facebook</div></a>';
										$('.facebook').addClass('status');
										break;
									}
								}
							}
							$('.facebook').prepend(postString);
						}
					});
				}
			};


			//sliderhero.build();
			//social.build('elviajeropolar');
		}
	});

}(jQuery));