$(function () {
    $("#scrollDown").bind("click", function (e) {
        e.preventDefault();
        var content = $("#page-content");
        var currentPos = parseInt(content.css("top").match(/-?\d+/), 10);
        var elemHeight = content.height();
        var parentHeight = content.parent().height();
        if (Math.abs(currentPos) + parentHeight < elemHeight) {
            content.css("top", (currentPos - 20) + "px");
            $("#scrollUp").removeClass("invisible");
            if (Math.abs(currentPos) + parentHeight + 20 >= elemHeight) {
                $(this).addClass("invisible");
            }
        }
    });

    $("#scrollUp").bind("click", function (e) {
        e.preventDefault();
        var content = $("#page-content");
        var currentPos = parseInt(content.css("top").match(/-?\d+/), 10);
        if (currentPos < 0) {
            var top = (currentPos + 20);
            content.css("top", top + "px");
            $("#scrollDown").show();
            $("#scrollDown").removeClass("invisible");
            if (top == 0) {
                $(this).addClass("invisible");
            }
        }
    });

    (function () {
        var textHeight = $("#page-content").height();
        var containerHeight = $("#page-content").parent().height();
        if (textHeight > containerHeight) {
            $("#scrollDown").removeClass("invisible");
        }
    })();


});

(function ($) {
    $.fn.abSlides = function () {
        return this.each(function () {
            $(this).slides({
                preload: false,
                preloadImage: webroot + 'images/loading.gif',
                play: 5000,
                pause: 2500,
                hoverPause: true,
                bigTarget: true,
                animationStart: function (current) {},
                animationComplete: function (current) {},
                slidesLoaded: function () {}
            }); 
        });
    }
})(jQuery);