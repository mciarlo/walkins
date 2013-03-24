$(function () {
    var $toolbar = $('.toolbar.active'),
        toolbarOffset = $toolbar.offset().top,
        toolbarHeight = $toolbar.outerHeight(),
        filterOffset = $('#filters').offset().top,
        filterLeft = $('#filters').offset().left,
        filterWidth = $('#filters').width(),
        isCanceled = false,
        startTimer,
        /*onScroll = function () {
            var scrollTop = $(window).scrollTop(),
                $toolbar = $('.toolbar.active');

            if (scrollTop > toolbarOffset) {
                $toolbar.addClass('fixed');
                
                if ($toolbar.hasClass('article')) {
                    $('#new-article-content').css('margin-top', 92);
                    return;
                }
                
                $('body').css('margin-top', 65);
            } else {
                $toolbar.removeClass('fixed');            
                
                if ($toolbar.hasClass('article')) {
                    $('#new-article-content').css('margin-top', 0);
                    return;
                }
                
                $('body').css('margin-top', 0);
            }
        },*/
        onScroll = function () {
            var scrollTop = $(window).scrollTop();

            if (scrollTop > filterOffset - 80) {
                $('#filters').addClass('fixed').css({
                    'left': filterLeft,
                    'width' : filterWidth
                });
                
    
            } else {
                $('#filters').removeClass('fixed').css('left', '');            

            }
        },
        onToggleNav,
        images,
        showImage,
        showContent,
        replaceMain;
        
    var slideshowIndex = 0,
        count = 1;
    
    startTimer = function () {
        var timer = $('#timer');
        
        if (count < 60) {
            var unit = count === 1 ? ' second ago' : ' seconds ago';
                
            timer.text(count + unit);
        
        } else if (count > 59) {
            var time = Math.floor(count / 60),
                unit = time === 1 ? ' minute ago' : ' minutes ago';
                
            timer.text(time + unit);
        }
        
        count += 1;
    };
        
    $('.slide-next-btn').click(function (ev) {
        ev.preventDefault();
        
        if (slideshowIndex >= 2) {
            return;
        }
        
        $('.slide-prev-btn').removeClass('disabled');

        slideshowIndex += 1;

        $('.slideshow .image-wrapper').animate({
            'marginLeft': '-' + (100 * slideshowIndex) + '%'
        }, 150);
        
        if (slideshowIndex === 2) {
            $('.slide-next-btn').addClass('disabled');
        }
    });
    
    $('.slide-prev-btn').click(function (ev) {
        ev.preventDefault();
                
        if (slideshowIndex <= 0) {
            return;
        }
        
        $('.slide-next-btn').removeClass('disabled');
        
        slideshowIndex -= 1;

        $('.slideshow .image-wrapper').animate({
            'marginLeft': '-' + (100 * slideshowIndex) + '%'
        }, 150);
        
        if (slideshowIndex === 0) {
            $('.slide-prev-btn').addClass('disabled');
        }
    });
    
    onToggleNav = function () {        
        var $settings = $('#user-settings'),
            $login = $('#login');
            
        if ($('#sign-in-btn').hasClass('active')) {  
            $settings.slideToggle(250, function () {
                toolbarOffset = $toolbar.offset().top;
            });
        }
        
        toolbarOffset = $toolbar.offset().top;
    }; 
    
    showContent = _.once(function () {
        var content = $('#new-content').clone(),
            header = $('#new-header').clone(),
            oldHeader = $('.main-article:last').html();
            
            $('#new-header, #new-content').remove();
            
        header.css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            width: '100%'
        });
        
        $('#content-container').html(content);
        $('.main-article:last').append(header);
        
        content.show().animate({opacity: 1}, 400);
        header.show().animate({opacity: 1}, 400);
                
        isCanceled = true;
    }); 
    
    replaceMain = function () {
        var content = $('#new-main-article .main-article').clone(),
            oldHeader = $('.main-article:first');
            
        $('#new-main-article').remove();
            
        content.css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            opacity: 0,
            width: '100%'
        });
        
        oldHeader.append(content);
        
        content.show().animate({opacity: 1}, 400);
    };  
    
    $('#active-article').click(function (ev) {
        ev.preventDefault();
        
        var $content = $('#new-main-article'),
            $container = $('#container');
            
        $(window).scrollTop(0);
        
        $container.removeClass().addClass('shrink');
        
        $('#new-main-article').show().animate({
            opacity: 1,
            left: 0
        }, 400, function () {                
            showImage();
            $container.hide();
            
            _.delay(showContent, 2 * 1000);
        });
    });

             
    $('#sign-in-btn').click(function (ev) {
        ev.preventDefault();
        
        onToggleNav(); 
        
        if ($('#sign-in-btn').hasClass('active')) {  
            return;
        }       
        
        var offset = $('#nav-items').offset(),
            logoOffset = $('#logo').offset(),
            btnOffset = $('#sign-in-btn').offset(),
            navHeight = $('#nav').outerHeight(),
            showNavItems = function () {                                              
                $('#sign-in-btn').addClass('active');   

                $('#nav-items').css({
                    'position'  : 'absolute',
                    'top'       : '30px',
                    'left'      : offset.left - 15
                }).show().animate({
                    top: 0
                }, 250, 'easeOutExpo');
                
                $('#logo').css({
                    'position'  : 'absolute',
                    'top'       : '30px',
                    'left'      : logoOffset.left
                }).show().animate({
                    top: 0
                }, 250, 'easeOutExpo', function () {
                    $('#logo').css({
                        'position'  : '',
                        'top'       : '',
                        'left'      : ''
                    });
                });
                
                $('#sign-in-btn').css({
                    'position'  : 'absolute',
                    'top'       : '30px',
                    'left'      : btnOffset.left + 15
                }).show().animate({
                    top: 0
                }, 250, 'easeOutExpo', function () {
                    $('#sign-in-btn').css({
                        'position'  : '',
                        'top'       : '',
                        'left'      : ''
                    });
                });
                
                $('#nav').removeClass('loading');
                
                $('#trending').html($('#new-trends').html());
                
                $('.login-required').show().animate({
                    opacity: 1
                });
                
                $('.hidden').slideDown(200, function () {
                    setInterval(startTimer, 1000);        
                });
                        
                //replaceMain();
            };
        
        $('#nav-items, #logo, #sign-in-btn').fadeOut(100, function () {
            $('#nav-items').html($('#new-nav').html());
        });  
                  
        $('#nav').addClass('loading');
        
        _.delay(showNavItems, 2000);     
    });
    
    $('#toggle-nav').click(function (ev) {
        $('#nav, #container, #footer').animate({
            'margin-right' : 200
        });
    })

    
    $('#close-stream').click(function (ev) {
        ev.preventDefault();

        var $content = $('#new-article-content'),
            $container = $('#container'); 
            
        $(window).scrollTop(0);       
        
        $container.show().removeClass().addClass('grow');
        
       $('#new-main-article').animate({
            opacity: 0,
            left: '100%'
        }, 200);
    });
    
    images = $('.odd img, .even img');
    
    $.each(images, function (i, img) {
        $(img).hide();
    });
    
    showImage = function () {
        if (isCanceled) {
            return;
        }
        
        var imageNumber = Math.floor(Math.random() * (images.length - 1)) + 1
        $(images[imageNumber]).fadeIn(2000);

        _.delay(showImage, 50);
    };

    $(window).scroll(onScroll);

    /*$('#sign-in-btn').click(function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        
        onToggleNav();
    });*/
});