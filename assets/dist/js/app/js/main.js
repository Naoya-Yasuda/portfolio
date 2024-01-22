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
(function () {

  Yasuda = {};

  /*-- Options --*/
  // Slider
  Yasuda.slideCurrent = 0;
  Yasuda.slider_max = 7;

  // Device
  Yasuda.devices = {
    "1px": "mobile",
    "2px": "tablet",
    "3px": "desktop",
    "4px": "desktop_l",
    "5px": "desktop_xl"
  };

  // Works Section
  Yasuda.works = {
    modal_img_slider: "",
    is_closing: false
  };

}());

Yasuda.Utilities = {

  getTranslate: function (obj) {

    var result = {};

    var transformMatrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform") ||
      obj.css("-ms-transform") ||
      obj.css("-o-transform") ||
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
$(function () {
  /*----------------------------
      Slider
  ----------------------------*/
  Yasuda.slideInit = function () {
    Yasuda.slideList = $(".js-slider");
    Yasuda.slideItems = $(".js-slider").find(".js-slide-li");
    Yasuda.slideItemsCount = $(".js-slider").find(".js-slide-li").length;

    // Make images centered
    $(".cell-img").each(function () {
      // $(this).css({
      //   "left": -($(this).width() / 2) + "px"
      // });
      $(this).parent(".icon-btn").css({
        "width": $(this).width(),
        "height": $(this).height(),
        "left": -($(this).width() / 2) + "px"
      });
    });

    Yasuda.sliderIcon = [];
    $(".icon-btn").each(function () {

      var item = $(this).get(0),
        tween = $(this).data("icon_anim"),
        animate = new AnimateIcon(item, { tween: tween });

      Yasuda.sliderIcon.push(animate);
      $(this).bind("touchstart click", function (e) {

        if ($(this).attr("href") === "#") {
          e.preventDefault();
          e.stopPropagation();
        }

        animate.start();
      });

    });

    $(".js-slider-arrow").click(function (e) {
      Yasuda.clickArrow(e);
    });

    Yasuda.slide();

  };

  Yasuda.slide = function (_options) {
    var options = _options || {},
      sliderList,
      displayedList = [],
      translateX,
      transitionTime,
      sliderMax = Yasuda.slider_max,
      dividedBy,
      currentIndex,
      currentSlide,
      startPointIndex,
      endPointIndex,
      sliderItemsLength = Yasuda.slideItemsCount - 1,
      count,
      gap;

    // (100 / max - 1) * max
    dividedBy = sliderMax - 1;

    // Make sure of index of starting point
    currentIndex = Yasuda.slideCurrent;
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
      transitionTime = (2 / dividedBy) * (i + 1) + "s";

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

        nextToLastIndex = Yasuda.slideList.find(".js-slide-li[data-slide-li=" + nextToLastIndex + "]");
        nextToLastIndexTranslate = Yasuda.Utilities.getTranslate(nextToLastIndex);
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

        nextToLastIndex = Yasuda.slideList.find(".js-slide-li[data-slide-li=" + nextToLastIndex + "]");
        nextToLastIndexTranslate = Yasuda.Utilities.getTranslate(nextToLastIndex);
        if (nextToLastIndexTranslate.x !== "0") {
          transitionTime = "0s";
        }

      }

      sliderList = Yasuda.slideList.find(".js-slide-li[data-slide-li=" + sliderId + "]");
      sliderList
        .css({
          "transform": "translate(" + translateX + ", 0)",
          "transition-duration": transitionTime
        })
        .on("transitionend webkitTransitionEnd", function () {
          $(this).css({
            "transition-duration": "0s"
          });

        });

    }

    // Set caption
    currentSlide = Yasuda.slideList.find(".js-slide-li[data-slide-li=" + currentIndex + "]");
    $(".slider-caption").html("I LOVE <span>" + currentSlide.data("slide-cap") + "</span>");

    // Icon animation start
    Yasuda.sliderIcon[currentIndex].start();

  };

  Yasuda.clickArrow = function (e) {
    var arrow = $(e.target).data("arrow");

    if (arrow === "next") {
      if (Yasuda.slideCurrent === 0) {
        Yasuda.slideCurrent = Yasuda.slideItemsCount - 1;

      } else {
        Yasuda.slideCurrent--;

      }

    } else {
      if (Yasuda.slideCurrent === Yasuda.slideItemsCount - 1) {
        Yasuda.slideCurrent = 0;

      } else {
        Yasuda.slideCurrent++;

      }

    }
    Yasuda.slide({ arrow: arrow });
  };

  /*----------------------------
      SKILLS
  ----------------------------*/
  Yasuda.setSkillBar = function () {
    $(".js-skill-bar").each(function () {

      var self = this,
        percentage = $(this).data("percentage"),
        parent = $(this).parent();

      $({ Counter: 0 }).animate({ Counter: percentage }, {
        duration: 2000,
        easing: "swing",
        step: function (now) {
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
  Yasuda.closeModal = function () {
    var reset,
      isReset = false;

    // Return if modal is closing
    if (Yasuda.works.is_closing) return;
    Yasuda.works.is_closing = true;

    $('html, body').removeClass('modal-open');
    Yasuda.works.$modal.removeClass("modal-open");

    // when CSS transition is completed
    // the function is called
    Yasuda.works.$modal.on("transitionend webkitTransitionEnd", function () {
      var modal = Yasuda.works.$modal;

      // Refresh the html of slider images of modal
      if (!isReset) {
        setTimeout(function () {
          modal.find(".modal-item").removeClass("show");

          var targetList = modal.find(".modal-item[data-work-list-id=" + Yasuda.works.target_id + "]");
          targetList.find(".js-modal-slider-wrapper").html(Yasuda.works.modal_img_slider);

          Yasuda.works.is_closing = false;
          Yasuda.works.target_id = "";
          Yasuda.works.modal_img_slider = "";

        }, 300);
        isReset = true;

      }

    });

  };

  // SVG loader
  Yasuda.svgLoader = function () {
    var snap = Snap(".loader-overlay svg"),
      path = snap.select("path"),
      step = $(".loader-overlay").data("step");

    path.animate({ "path": step }, 400, mina.linear, function () {
      $(".loader-container").addClass('load-animate');
    });

  };

  // Scroll animation
  Yasuda.scrollAnimation = function (_options) {
    var options = _options || {},
      lists = options.lists || ".scroll-list",
      $window = $(window),
      windowHight = $window.height(),
      topWindow = $window.scrollTop();

    $(lists).each(function () {
      var targetPosition = $(this).offset().top,
        animation = $(this).data("animation"),
        animation_delay = $(this).data("animation_delay") || "";

      if (topWindow > targetPosition - windowHight + 200) {
        if (typeof Yasuda[animation] === "function") {
          Yasuda[animation]();
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

  Yasuda.changeBgColor = function (args) {
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
    newRed = beginColor.red() + ((endColor.red() - beginColor.red()) * percentScrolled);
    newGreen = beginColor.green() + ((endColor.green() - beginColor.green()) * percentScrolled);
    newBlue = beginColor.blue() + ((endColor.blue() - beginColor.blue()) * percentScrolled);
    newAlpha = beginColor.alpha() + ((endColor.alpha() - beginColor.alpha()) * percentScrolled);
    newColor = new $.Color(newRed, newGreen, newBlue, newAlpha);

    // console.log( newColor.red(), newColor.green(), newColor.blue());
    // console.log(scrollPos, beginPos, endPos, percentScrolled);
    $el.animate({ backgroundColor: newColor }, 0);
  };

  Yasuda.scrollHandler = function (e, _opt) {
    var opt = _opt || {},
      topWindow = $(window).scrollTop(),
      $pageHeader = $(".page-header"),
      sections = Yasuda.sections,
      commonFunc,
      beginChangePos,
      portion = 0.5;

    // console.log(topWindow, sections);

    // run a scroll animation
    Yasuda.scrollAnimation();

    // common function
    commonFunc = function () {
      section = Yasuda.current_section.name;
      $pageHeader.find(".menu-item." + section).addClass('menu-item-current');
    };

    // reset an effect of each section
    $pageHeader
      .removeClass('page-header-darker page-header-lighter')
      .find(".menu-item").removeClass('menu-item-current');
    $('.js-social-hover').removeClass('social-sec-darker');

    // Home
    if (topWindow < sections.about.top) {
      Yasuda.current_section = sections.home;
      commonFunc();

      // change background color
      beginChangePos = 0 + ((sections.about.top - 0) * portion);
      if (topWindow > beginChangePos) {
        Yasuda.changeBgColor({
          el: $('.main-bg, .slider-blur'),
          begin_color: sections.home.color_obj,
          end_color: sections.about.color_obj,
          begin_pos: beginChangePos,
          end_pos: sections.about.top
        });
      }

      // About
    } else if (topWindow >= sections.about.top && topWindow < sections.skills.top) {
      Yasuda.current_section = sections.about;
      commonFunc();

      // change background color
      beginChangePos = sections.about.top + ((sections.skills.top - sections.about.top) * portion);
      if (topWindow > beginChangePos) {
        Yasuda.changeBgColor({
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
      Yasuda.current_section = sections.skills;
      commonFunc();

      // change background color
      beginChangePos = sections.skills.top + ((sections.works.top - sections.skills.top) * portion);
      if (topWindow > beginChangePos) {
        Yasuda.changeBgColor({
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
      Yasuda.current_section = sections.works;
      commonFunc();

      // change background colour
      beginChangePos = sections.works.top + ((sections.contact.top - sections.works.top) * portion);
      if (topWindow > beginChangePos) {
        Yasuda.changeBgColor({
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
      Yasuda.current_section = sections.contact;
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
    setTimeout(function () {
      var loaderContainer = $(".loader-container");
      loaderContainer.addClass('loading');

      // setTimeout(function(){
      //     loaderContainer.addClass('load-animate');
      // }, 1000);

      setTimeout(function () {

        // Load svg animation
        Yasuda.svgLoader();
      }, 1500);

    }, 500);

    /* Set a global variable to a curernt device */
    Yasuda.current_device = Yasuda.devices[$(".check-device").css("width")];

    /* Slider Event */
    Yasuda.slideInit();
    var arrow = $(".js-slider-arrow").eq(1);
    Yasuda.setInterval = setInterval(function () {
      arrow.click();
    }, 6000);

    /* Navigation scroll event */
    Yasuda.sections = {};
    var $pageHeader = $(".page-header");

    $(".js-section").each(function () {
      var top = $(this).offset().top,
        section = $(this).data("section"),
        bgColor = $(this).data('bg-color');

      Yasuda.sections[section] = {};
      Yasuda.sections[section].name = section;
      Yasuda.sections[section].top = Math.floor(top - $pageHeader.height());
      Yasuda.sections[section].color_obj = $.Color(bgColor);

      if (section === 'home' || section === 'about') {
        Yasuda.sections[section].$targetEl = $('.main-bg, .slider-blur');
      } else {
        Yasuda.sections[section].$targetEl = $('.main-bg');
      }
    });

    /* Scrolling Event */
    // bind a scrolling event
    $(window).bind('scroll', Yasuda.scrollHandler);
    $(window).trigger('scroll');

    Yasuda.changeBgColor({
      el: Yasuda.current_section.$targetEl,
      force: true,
      color_obj: Yasuda.current_section.color_obj,
    });

    // bind a click event for nav menu
    $pageHeader.find('.menu-link').click(function (e) {
      e.preventDefault();

      var section = Yasuda.sections[$(this).attr("href")],
        scrollTop = section.top;

      // move to the section
      $("html, body").animate({
        scrollTop: scrollTop
      }, {
        duration: 1000,
        start: function () {
          $(window).off("scroll", Yasuda.scrollHandler);
        },
        complete: function () {
          // $(window).on("scroll", Yasuda.scrollHandler);
          $(window).bind('scroll', Yasuda.scrollHandler);
          $(window).scroll();

          Yasuda.changeBgColor({
            el: section.$targetEl,
            force: true,
            color_obj: section.color_obj,
          });
        }
      });

    });

    /* Works Modal Event */
    Yasuda.works.$modal = $(".modal");
    $(".work-list").on("click", function () {
      // prevent body from scrolling
      $('html, body').addClass('modal-open');

      // remove an event handler of CSS transitionEnd
      Yasuda.works.$modal.off("transitionend webkitTransitionEnd");

      var workListId = $(this).data("work-list-id"),
        targetList = Yasuda.works.$modal.find(".modal-item[data-work-list-id=" + workListId + "]");

      targetList
        .addClass("show")
        .end()
        .addClass("modal-open");

      Yasuda.works.target_id = workListId;
      Yasuda.works.modal_img_slider = targetList.find(".js-modal-slider-wrapper").html();

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
    $(".modal-nav-list-close").on("click", Yasuda.closeModal);
    //Yasuda.works.$modal.on("click", Yasuda.closeModal);

    // Prevent modal window from closing when clicked
    $(".modal-item").on("click", function (e) { e.stopPropagation(); });

    // Social link
    $('.js-social-hover').hover(function () {
      $(this).addClass('active');

    }, function () {
      $(this).removeClass('active');

    });

  }());

});