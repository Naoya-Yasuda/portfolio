/*----------------------------
    Modules
----------------------------*/
var $ = global.jQuery = require("jquery"),
    _ = require("underscore");

require("lightslider");
require("jquery-color");
var AnimateIcon = require("./animate_icon.js");

/*----------------------------
    Global Variables
----------------------------*/
(function() {

  Manakuro = {};

  /*-- Options --*/
  // Slider
  Manakuro.slideCurrent = 0;
  Manakuro.slider_max = 7;

  // Device
  Manakuro.devices = {
    "1px": "mobile",
    "2px": "tablet",
    "3px": "desktop",
    "4px": "desktop_l",
    "5px": "desktop_xl"
  };

  // Works Section
  Manakuro.works = {
      modal_img_slider: "",
      is_closing: false
  };
  
}());

Manakuro.Utilities = {

  getTranslate: function(obj) {

    var result = {};

    var transformMatrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform");

    var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
    
    result.x = matrix[12] || matrix[4]; //translate x
    result.y = matrix[13] || matrix[5]; //translate y

    return result;
  }

};

/*----------------------------
    Load
----------------------------*/
$(function() {
    /*----------------------------
        Slider
    ----------------------------*/
    Manakuro.slideInit = function() {
        Manakuro.slideList = $(".js-slider");
        Manakuro.slideItems = $(".js-slider").find(".js-slide-li");
        Manakuro.slideItemsCount = $(".js-slider").find(".js-slide-li").length;
        
        // Make images centered
        $(".cell-img").each(function(){
          // $(this).css({
          //   "left": -($(this).width() / 2) + "px"
          // });
          $(this).parent(".icon-btn").css({
            "width": $(this).width(),
            "height": $(this).height(),
            "left": -($(this).width() / 2) + "px"
          });
        });
        
        Manakuro.sliderIcon = [];
        $(".icon-btn").each(function(){
          
            var item = $(this).get(0),
                tween = $(this).data("icon_anim"),
                animate = new AnimateIcon(item, { tween: tween });

            Manakuro.sliderIcon.push(animate);
            $(this).bind("touchstart click", function(e){

                if ($(this).attr("href") === "#") {
                  e.preventDefault();
                  e.stopPropagation();
                }

                animate.start();
            });

        });

        $(".js-slider-arrow").click(function(e){
            Manakuro.clickArrow(e);
        });

        Manakuro.slide();

    };

    Manakuro.slide = function(_options) {
        var options = _options || {},
            sliderList,
            displayedList = [],
            translateX,
            transitionTime,
            sliderMax = Manakuro.slider_max,
            dividedBy,
            currentIndex,
            currentSlide,
            startPointIndex,
            endPointIndex,
            sliderItemsLength = Manakuro.slideItemsCount - 1,
            count,
            gap;

        // (100 / max - 1) * max
        dividedBy = sliderMax - 1;

        // Make sure of index of starting point
        currentIndex = Manakuro.slideCurrent;
        gap = (dividedBy / 2);
        startPointIndex = currentIndex - gap;
        if (startPointIndex < 0) startPointIndex = sliderItemsLength + startPointIndex + 1;

        var sliderId = startPointIndex;
        var nextToLastIndex;
        var nextToLastIndexTranslate;
        var sliderIds = [];
        for (var i = 0; i < sliderMax; i++) {

            // Loop through slider id
            if (i > 0) sliderId += 1;
            if (sliderId > sliderItemsLength) sliderId = 0;

            // Set translate X
            translateX = (100 / dividedBy) * i + "%";

            // Set translate duration
            transitionTime = ( 2 / dividedBy) * (i + 1) + "s";

            sliderIds.push({
                "id": sliderId,
                "translateX": translateX,
                "transitionTime": transitionTime
            });

            // when a list disappear into the right section
            // reset transition time
            if (i === sliderMax - 1) {

              nextToLastIndex = sliderId + 1;
              if (nextToLastIndex > sliderItemsLength) {
                nextToLastIndex = 0;
              }
              
              nextToLastIndex = Manakuro.slideList.find(".js-slide-li[data-slide-li="+ nextToLastIndex +"]");
              nextToLastIndexTranslate = Manakuro.Utilities.getTranslate(nextToLastIndex);
              if (nextToLastIndexTranslate.x === "0") {
                transitionTime = "0s";
              }
              
            }

            // when a list disappear into the left section
            // reset transition time
            if (i === 0) {

              nextToLastIndex = sliderId - 1;
              if (nextToLastIndex < 0) {
                nextToLastIndex = sliderItemsLength;
              }

              nextToLastIndex = Manakuro.slideList.find(".js-slide-li[data-slide-li="+ nextToLastIndex +"]");
              nextToLastIndexTranslate = Manakuro.Utilities.getTranslate(nextToLastIndex);
              if (nextToLastIndexTranslate.x !== "0") {
                transitionTime = "0s";
              }

            }
            
            sliderList = Manakuro.slideList.find(".js-slide-li[data-slide-li="+ sliderId +"]");
            sliderList
              .css({
                  "transform": "translate("+ translateX +", 0)",
                  "transition-duration": transitionTime
            })
            .on("transitionend webkitTransitionEnd", function(){
                $(this).css({
                  "transition-duration": "0s"
                });

            });

        }

        // Set caption
        currentSlide = Manakuro.slideList.find(".js-slide-li[data-slide-li="+ currentIndex +"]");
        $(".slider-caption").html("I LOVE <span>" + currentSlide.data("slide-cap") + "</span>");

        // Icon animation start
        Manakuro.sliderIcon[currentIndex].start();

    };

    Manakuro.clickArrow = function(e) {
        var arrow = $(e.target).data("arrow");

        if (arrow === "next") {
          if (Manakuro.slideCurrent === 0) {
            Manakuro.slideCurrent = Manakuro.slideItemsCount - 1;

          } else {
            Manakuro.slideCurrent--;

          }

        } else {
          if (Manakuro.slideCurrent === Manakuro.slideItemsCount - 1) {
            Manakuro.slideCurrent = 0;

          } else {
            Manakuro.slideCurrent++;

          }

        }
        Manakuro.slide({ arrow: arrow });
    };

    /*----------------------------
        SKILLS
    ----------------------------*/
    Manakuro.setSkillBar = function() {
      $(".js-skill-bar").each(function() {

        var self  = this,
            percentage = $(this).data("percentage"),
            parent = $(this).parent();
        
        $({Counter: 0}).animate({Counter: percentage}, {
          duration: 2000,
          easing: "swing",
          step: function(now) {
            var num = Math.floor(now);
            $(self).css("width", num + "%");
            parent.find(".skill-bar-num").text(num);
          }
        });

      });

    };

    /*----------------------------
        WORKS
    ----------------------------*/
    Manakuro.closeModal = function() {
      var reset,
          isReset = false;

      // Return if modal is closing
      if (Manakuro.works.is_closing) return;
      Manakuro.works.is_closing = true;

      $('html, body').removeClass('modal-open');
      Manakuro.works.$modal.removeClass("modal-open");

      // when CSS transition is completed
      // the function is called             
      Manakuro.works.$modal.on("transitionend webkitTransitionEnd", function(){
        var modal = Manakuro.works.$modal;

         // Refresh the html of slider images of modal
        if (!isReset) {
          setTimeout(function(){
            modal.find(".modal-item").removeClass("show");

            var targetList = modal.find(".modal-item[data-work-list-id="+ Manakuro.works.target_id +"]");
            targetList.find(".js-modal-slider-wrapper").html(Manakuro.works.modal_img_slider);

            Manakuro.works.is_closing = false;
            Manakuro.works.target_id = "";
            Manakuro.works.modal_img_slider = "";

          }, 300);
          isReset = true;

        }

      });

    };

    // SVG loader
    Manakuro.svgLoader = function() {
      var snap = Snap(".loader-overlay svg"),
          path = snap.select("path"),
          step = $(".loader-overlay").data("step");

      path.animate({ "path": step }, 400, mina.linear, function(){
          $(".loader-container").addClass('load-animate');
      });

    };

    // Scroll animation
    Manakuro.scrollAnimation = function(_options) {
      var options = _options || {},
          lists = options.lists || ".scroll-list",
          $window = $(window),
          windowHight = $window.height(),
          topWindow = $window.scrollTop();

      $(lists).each(function() {
        var targetPosition = $(this).offset().top,
            animation = $(this).data("animation"),
            animation_delay = $(this).data("animation_delay") || "";
        
        if (topWindow > targetPosition - windowHight + 200) {
          if (typeof Manakuro[animation] === "function") {
            Manakuro[animation]();
            $(this).removeClass('scroll-list');

          } else {
            $(this).addClass(animation)
              .css({
                "visibility": "visible",
                "animation-delay": animation_delay
              });
          }
        }
      });
    };

    Manakuro.changeBgColor = function(args) {
      var scrollPos = $(window).scrollTop(),
          $el = args.el || $('.main-bg'),
          beginColor = args.begin_color,
          endColor = args.end_color,
          beginPos = args.begin_pos,
          endPos = args.end_pos,
          percentScrolled,
          newRed, newGreen, newBlue, newAlpha,
          newColor;

      if (args.force) {
        $el.animate({ backgroundColor: args.color_obj.toRgbaString() }, 0);
        return;
      }

      // percent of background colour according to postion of scrolling 
      percentScrolled = (scrollPos - beginPos) / (endPos - beginPos);

      // generate new background color 
      newRed = beginColor.red() + ( ( endColor.red() - beginColor.red() ) * percentScrolled );
      newGreen = beginColor.green() + ( ( endColor.green() - beginColor.green() ) * percentScrolled );
      newBlue = beginColor.blue() + ( ( endColor.blue() - beginColor.blue() ) * percentScrolled );
      newAlpha = beginColor.alpha() + ((endColor.alpha() - beginColor.alpha()) * percentScrolled);
      newColor = new $.Color( newRed, newGreen, newBlue, newAlpha );

      // console.log( newColor.red(), newColor.green(), newColor.blue());
      // console.log(scrollPos, beginPos, endPos, percentScrolled);
      $el.animate({ backgroundColor: newColor }, 0);
    };

    Manakuro.scrollHandler =  function(e, _opt) {
      var opt = _opt || {},
          topWindow = $(window).scrollTop(),
          $pageHeader = $(".page-header"),
          sections = Manakuro.sections,
          commonFunc,
          beginChangePos,
          portion = 0.5;

      // console.log(topWindow, sections);

      // run a scroll animation
      Manakuro.scrollAnimation();

      // common function
      commonFunc = function() {
        section = Manakuro.current_section.name;
        $pageHeader.find(".menu-item." + section).addClass('menu-item-current');
      };

      // reset an effect of each section
      $pageHeader
        .removeClass('page-header-darker page-header-lighter')
        .find(".menu-item").removeClass('menu-item-current');
      $('.js-social-hover').removeClass('social-sec-darker');

      // Home
      if (topWindow < sections.about.top) {
        Manakuro.current_section = sections.home;
        commonFunc();

        // change background color
        beginChangePos = 0 + ((sections.about.top - 0) * portion);
        if (topWindow > beginChangePos) {
          Manakuro.changeBgColor({
            el: $('.main-bg, .slider-blur'),
            begin_color: sections.home.color_obj,
            end_color: sections.about.color_obj,
            begin_pos: beginChangePos,
            end_pos: sections.about.top
          });
        }

      // About
      } else if (topWindow >= sections.about.top && topWindow < sections.skills.top) {
        Manakuro.current_section = sections.about;
        commonFunc();

        // change background color
        beginChangePos = sections.about.top + ((sections.skills.top - sections.about.top) * portion);
        if (topWindow > beginChangePos) {
          Manakuro.changeBgColor({
            el: $('.main-bg, .slider-blur'),
            begin_color: sections.about.color_obj,
            end_color: sections.skills.color_obj,
            begin_pos: beginChangePos,
            end_pos: sections.skills.top
          });
        }

        $pageHeader.addClass('page-header-lighter');

      // Skills
      } else if (topWindow >= sections.skills.top && topWindow < sections.works.top) {
        Manakuro.current_section = sections.skills;
        commonFunc();

        // change background color
        beginChangePos = sections.skills.top + ((sections.works.top - sections.skills.top) * portion);
        if (topWindow > beginChangePos) {
          Manakuro.changeBgColor({
            el: sections.$targetEl,
            begin_color: sections.skills.color_obj,
            end_color: sections.works.color_obj,
            begin_pos: beginChangePos,
            end_pos: sections.works.top
          });
        }
        $pageHeader.addClass('page-header-lighter');
        // $('.js-social-hover').addClass('social-sec-darker');

      // Works
      } else if (topWindow >= sections.works.top && topWindow < sections.contact.top) {
        Manakuro.current_section = sections.works;
        commonFunc();

        // change background colour
        beginChangePos = sections.works.top + ((sections.contact.top - sections.works.top) * portion);
        if (topWindow > beginChangePos) {
          Manakuro.changeBgColor({
            el: sections.$targetEl,
            begin_color: sections.works.color_obj,
            end_color: sections.contact.color_obj,
            begin_pos: beginChangePos,
            end_pos: sections.contact.top
          });
        }

        // change nav colour
        $pageHeader.addClass('page-header-darker');
        $('.js-social-hover').addClass('social-sec-darker');

      // Contact
      } else if (topWindow >= (sections.contact.top)) {
        Manakuro.current_section = sections.contact;
        commonFunc();
        // $pageHeader.addClass('page-header-darker');
        // $('.js-social-hover').addClass('social-sec-darker');
      }

      // run callback function if needed
      if (typeof opt.callback === 'function') {
        opt.callback();
      }
    };

    /*----------------------------
        Initialize
    ----------------------------*/
    (function () {
      /* Pre loading event */
      setTimeout(function(){
          var loaderContainer = $(".loader-container");
              loaderContainer.addClass('loading');

              // setTimeout(function(){
              //     loaderContainer.addClass('load-animate');
              // }, 1000);
              
              setTimeout(function(){

                // Load svg animation
                Manakuro.svgLoader();
              }, 1500);

      }, 500);

        /* Set a global variable to a curernt device */
        Manakuro.current_device = Manakuro.devices[$(".check-device").css("width")];

        /* Slider Event */
        Manakuro.slideInit();
        var arrow = $(".js-slider-arrow").eq(1);
        Manakuro.setInterval = setInterval(function(){
          arrow.click();
        }, 6000);

        /* Navigation scroll event */
        Manakuro.sections = {};
        var $pageHeader = $(".page-header");

        $(".js-section").each(function() {
          var top = $(this).offset().top,
              section = $(this).data("section"),
              bgColor = $(this).data('bg-color');

          Manakuro.sections[section] = {};
          Manakuro.sections[section].name = section;
          Manakuro.sections[section].top = Math.floor(top - $pageHeader.height());
          Manakuro.sections[section].color_obj = $.Color(bgColor);

          if (section === 'home' || section === 'about') {
            Manakuro.sections[section].$targetEl = $('.main-bg, .slider-blur');
          } else {
            Manakuro.sections[section].$targetEl = $('.main-bg');
          }
        });

        /* Scrolling Event */
        // bind a scrolling event 
        $(window).bind('scroll', Manakuro.scrollHandler);
        $(window).trigger('scroll');

        Manakuro.changeBgColor({
          el: Manakuro.current_section.$targetEl,
          force: true,
          color_obj: Manakuro.current_section.color_obj,
        });

        // bind a click event for nav menu
        $pageHeader.find('.menu-link').click(function(e){
          e.preventDefault();
          
          var section = Manakuro.sections[$(this).attr("href")],
              scrollTop = section.top;

          // move to the section
          $("html, body").animate({
            scrollTop: scrollTop
          }, {
            duration: 1000,
            start: function () {
              $(window).off("scroll", Manakuro.scrollHandler);
            },
            complete: function() {
              // $(window).on("scroll", Manakuro.scrollHandler);
              $(window).bind('scroll', Manakuro.scrollHandler);
              $(window).scroll();

              Manakuro.changeBgColor({
                el: section.$targetEl,
                force: true,
                color_obj: section.color_obj,
              });
            }
          });

        });

        /* Works Modal Event */
        Manakuro.works.$modal = $(".modal");
        $(".work-list").on("click", function() {
          // prevent body from scrolling
          $('html, body').addClass('modal-open');

          // remove an event handler of CSS transitionEnd
          Manakuro.works.$modal.off("transitionend webkitTransitionEnd");

          var workListId = $(this).data("work-list-id"),
              targetList = Manakuro.works.$modal.find(".modal-item[data-work-list-id="+ workListId +"]");

          targetList
            .addClass("show")
            .end()
            .addClass("modal-open");

          Manakuro.works.target_id = workListId;
          Manakuro.works.modal_img_slider = targetList.find(".js-modal-slider-wrapper").html();

          // Everytime the modal window is opened
          // lightSlider creates new slider.
          // because the height of window can be changed when address bar hides on iOS/Android device.
          targetList.find(".modal-slider").lightSlider({
                gallery: true,
                item: 1,
                loop: true,
                thumbItem: 9,
                slideMargin: 10,
                enableDrag: true,
                addClass: "light-slider-opened",
                currentPagerPosition: 'left'
          });

        });

        // Close modal window
        $(".modal-nav-list-close").on("click", Manakuro.closeModal);
        //Manakuro.works.$modal.on("click", Manakuro.closeModal);

        // Prevent modal window from closing when clicked
        $(".modal-item").on("click", function(e){ e.stopPropagation(); });

        // Social link
        $('.js-social-hover').hover(function() {
          $(this).addClass('active');

        }, function() {
          $(this).removeClass('active');

        });

    }());

});