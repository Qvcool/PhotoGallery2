/*
The MIT License (MIT)

Copyright (c) 2015 Qvcool

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function($) {
	$.fn.PhotoGallery = function(arg) {
		if(typeof arg == "undefined" || typeof arg == "object") {
			ele = $(this);
			if($.grep($.fn.PhotoGallery.galleries, function(e, i) {
				if(e.ele.is(ele)) {
					galleryIndex = i;
					return true;
				}
			}).length == 0) {
				if(!arg) settings = $.fn.PhotoGallery.defaults;
				else settings = $.extend({}, $.fn.PhotoGallery.defaults, arg);
				
				return this.each(function() {
					$(this).addClass("photo-gallery");
					$.fn.PhotoGallery.galleries.push({numOfSlides: 0, currentSlide: settings.startingSlide, ele: $(this), animationSpeed: settings.animationSpeed, scrollDelay: settings.scrollDelay, autoScroll: settings.autoScroll, scrollInterval: (settings.autoScroll?setInterval("$.fn.PhotoGallery.swipeIntervalFunction("+$.fn.PhotoGallery.galleries.length+")", settings.scrollDelay):undefined)});
					defaultBgSize = ($(this).hasClass("size-contain")?["size-contain","size-cover"]:(settings.backgroundSize=="contain"?["size-contain","size-cover"]:["size-cover","size-contain"]));
					$(this).find("img").each(function(i) {
						$(this).parent().append('<div class="slide '+($(this).hasClass(defaultBgSize[1])?defaultBgSize[1]:defaultBgSize[0])+'"'+($(this).attr("title")?' title="'+$(this).attr("title")+'"':"")+' style="background-image:url('+$(this).attr("src")+');left:'+(i-settings.startingSlide)+'00%;">'+($(this).attr("data-caption")?'<div class="caption">'+$(this).attr("data-caption")+'</div>':"")+'</div>');
						$(this).remove();
						$.fn.PhotoGallery.galleries[$.fn.PhotoGallery.galleries.length - 1].numOfSlides++;
					});
					$(this).append('<a class="nav left" aria-label="Left" href="javascript:void(0);" onclick="$(this).parent().PhotoGallery(\'prev\')"></a><a class="nav right" aria-label="Right" href="javascript:void(0);" onclick="$(this).parent().PhotoGallery(\'next\')"></a>');
				});
			}
			else if(arg) {
				if(typeof arg.animationSpeed != "undefined") $.fn.PhotoGallery.galleries[galleryIndex].animationSpeed = arg.animationSpeed;
				if(typeof arg.autoScroll != "undefined" || typeof arg.scrollDelay != undefined) {
					clearInterval($.fn.PhotoGallery.galleries[galleryIndex].scrollInterval);
					if(typeof arg.scrollDelay != "undefined") $.fn.PhotoGallery.galleries[galleryIndex].scrollDelay = arg.scrollDelay;
					if(typeof arg.autoScroll != "undefined") $.fn.PhotoGallery.galleries[galleryIndex].autoScroll = arg.autoScroll;
					if($.fn.PhotoGallery.galleries[galleryIndex].autoScroll == true) $.fn.PhotoGallery.galleries[galleryIndex].scrollInterval = setInterval("$.fn.PhotoGallery.swipeIntervalFunction("+galleryIndex+")", $.fn.PhotoGallery.galleries[galleryIndex].scrollDelay);
				}
			}
		}
		else {
			ele = $(this);
			var galleryIndex;
			gallery = $.grep($.fn.PhotoGallery.galleries, function(e, i) {
				if(e.ele.is(ele)) {
					galleryIndex = i;
					return true;
				}
				else return false;
			});
			if(typeof arg != "number") {
				if(arg.substring(0,2) == "+=") offset = parseInt(arg.substring(2));
				else if(arg.substring(0,2) == "-=") offset = -parseInt(arg.substring(2));
				else if(arg == "next") offset = 1;
				else if(arg == "prev") offset = -1;
				
				$.fn.PhotoGallery.galleries[galleryIndex].currentSlide += offset;
			}
			else {
				$.fn.PhotoGallery.galleries[galleryIndex].currentSlide = arg;
			}
			n = $.fn.PhotoGallery.galleries[galleryIndex].numOfSlides;
			$.fn.PhotoGallery.galleries[galleryIndex].currentSlide = (($.fn.PhotoGallery.galleries[galleryIndex].currentSlide%n)+n)%n;
			gallery[0].ele.find("div.slide").each(function(i) {
				$(this).stop().animate({left: -($.fn.PhotoGallery.galleries[galleryIndex].currentSlide-i)+"00%"}, $.fn.PhotoGallery.galleries[galleryIndex].animationSpeed);
			});
			$(this).trigger("gallery-slide", [$.fn.PhotoGallery.galleries[galleryIndex].currentSlide]);
		}
	}
	$.fn.PhotoGallery.galleries = [];
	$.fn.PhotoGallery.swipeIntervalFunction = function(i) {
		$.fn.PhotoGallery.galleries[i].ele.PhotoGallery("next");
	};
	$.fn.PhotoGallery.defaults = {
		startingSlide: 0,
		backgroundSize: "cover",
		animationSpeed: 200,
		autoScroll: true,
		scrollDelay: 6000
	};
}(jQuery));
