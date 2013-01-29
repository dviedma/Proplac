/*===== FunCarousel
 Author: Daniel Viedma
 Date: 04-25-2012
 ============================================================ */
(function ($) {
	var numSlides,
		animating,
		t;

	var $controlnav;

	$.fn.funCarousel = function (ops) {
		var defaults = {
			controlNav:true,
			speed:'fast',
			auto:true,
			autoInterval:2500
		};

		var options = $.extend({}, defaults, ops);

		//Methods object
		var fc = {

			build:function (self) {
				numSlides = self.find('.slide').size();

				if (numSlides > 1) {
					//Add number to slides
					self.find('.slide').each(function (index) {
						$(this).attr('rel', index);
					});

					//Build control nav
					if (options.controlNav) {
						$controlnav = $('<div class="control-nav"><div class="wrapper"></div></div>');
						self.find('.slide').each(function () {
							$controlnav.children('.wrapper').append('<span class="control"></span>');
						});
						$controlnav.insertAfter(self.find('.slides'));

						var bulletWidth = parseInt($controlnav.find('.control').first().css('width')),
							bulletMargin = parseInt($controlnav.find('.control').first().css('margin-right')) * 2,
							controlWidth = numSlides * (bulletWidth + bulletMargin),
							$control = $controlnav.find('.control');

						$controlnav.find('.wrapper').width(controlWidth);
						$control.first().addClass('active');
						$control.each(function () {
							$(this).click({self:self}, fc.navigateTo);
						});
					}

					//Build arrows nav
					var $arrowLeft = $('<span class="nav-arrow left">left</span>'),
						$arrowRight = $('<span class="nav-arrow right">right</span>');

					$arrowLeft.click({self:self}, fc.navLeft);
					$arrowRight.click({self:self}, fc.navRight);

					self.append($arrowLeft).append($arrowRight);

					//auto rotation
					if (options.auto) {
						fc.slideAuto(self);
					}
				}

				return self;
			},

			/**
			 * Fired when the user clicks on the bullets at the bottom to move from slide to slide
			 *
			 * @method navigateTo
			 * @return undefined
			 * @param e {Event} User click event
			 */
			navigateTo:function (e) {
				var self = e.data.self,
					$slides = self.find('.slides');

				var $clickedBullet = $(this);

				if(e.type == "click"){
					clearTimeout(t);
				}

				if (Math.abs(self.find('.control-nav .active').index() - $clickedBullet.index()) > 1) {
					self.find('.slides').addClass('blur');
				}

				//place the bullet
				self.find('.control-nav .active').removeClass('active');
				$clickedBullet.addClass('active');

				self.find('.slide').hide().removeClass('active');
				self.find('.slide[rel="' + $clickedBullet.index() + '"]').show().addClass('active');

				//auto rotation
				if (options.auto) {
					fc.slideAuto(self);
				}
			},

			/**
			 * Fired when the user clicks on the left navigation
			 * * NOTES: the formulas applied for threshold detection etc. should be tested in different scenarios (number of slides, slides per slides per screen, etc)
			 *
			 * @method navLeft
			 * @return undefined
			 * @param e {Event} User click event
			 */
			navLeft:function (e) {
				var self = e.data.self,
					$slides = self.find('.slides'),
					$active = $slides.find('.active');

				if (animating) {
					return undefined;
				}
				animating = true;

				//animate slider
				$active.fadeOut();
				var $prev = ($active.prev().size() > 0) ? $active.prev() : self.find('.slide').last();
				$prev.fadeIn(function () {
					animating = false;
					fc.moveBulletLeft(self);

					self.find('.slide').removeClass('active');
					$(this).addClass('active');
				});
			},

			/**
			 * Moves bullet to the left after animating the carousel on user left navigation
			 *
			 * @method moveBulletLeft
			 * @return undefined
			 * @param self {HTMLElement} The element to create the carousel for.
			 */
			moveBulletLeft:function (self) {
				if (self.find('.control-nav .active').prev().size() > 0) {
					self.find('.control-nav .active').removeClass('active').
						prev().
						addClass('active');
				}
				else {
					self.find('.control-nav .active').removeClass('active');
					var bullets = self.find('.control-nav .control');
					bullets.eq(bullets.size() - 1).addClass('active');
				}
			},

			/**
			 * Fired when the user clicks on the right navigation
			 * NOTES: the formulas applied for threshold detection etc. should be tested in different scenarios (number of slides, slides per slides per screen, etc)
			 *
			 * @method navRight
			 * @return undefined
			 * @param e {Event} User click event
			 */
			navRight:function (e) {
				var self = e.data.self,
					$slides = self.find('.slides'),
					$active = $slides.find('.active');

				//animate slider
				if (animating) {
					return undefined;
				}
				animating = true;

				//animate slider
				$active.fadeOut();
				var $next = ($active.next().size() > 0) ? $active.next() : self.find('.slide').first();
				$next.fadeIn(function () {
					animating = false;
					fc.moveBulletRight(self);

					self.find('.slide').removeClass('active');
					$(this).addClass('active');

					//auto rotation
					if (options.auto) {
						fc.slideAuto(self);
					}
				});
			},

			/**
			 * Moves bullet to the right after animating the carousel on user right navigation
			 *
			 * @method moveBulletLeft
			 * @return undefined
			 * @param self {HTMLElement} The element to create the carousel for.
			 */
			moveBulletRight:function (self) {
				var $controlActive = self.find('.control-nav .active'),
					$control = self.find('.control-nav .control');

				if ($controlActive.next().size() > 0) {
					$controlActive.removeClass('active').
						next().
						addClass('active');
				}
				else {
					$controlActive.removeClass('active');
					$control.eq(0).addClass('active');
				}
			},

			/**
			 * Auxiliar function to get fire the auto navigation
			 *
			 * @method slideAuto
			 * @return undefined
			 * @param self {HTMLElement} The element to create the carousel for.
			 */
			slideAuto:function (self) {
				var e = {
					data:{
						self:self
					}
				};
				t = setTimeout(function () {
					fc.navRight(e);
				}, options.autoInterval);
			}

		};

		return this.each(function () {
			fc.build($(this));
		});

	};
}(jQuery));
