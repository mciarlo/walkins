$(function () {
    var $toolbar = $('.toolbar.active'),
        toolbarOffset = $toolbar.offset().top,
        toolbarHeight = $toolbar.outerHeight(),
        isCanceled = false,
        onScroll = function () {
            var scrollTop = $(window).scrollTop(),
                $toolbar = $('.toolbar.active');

            if (scrollTop > toolbarOffset) {
                $toolbar.addClass('fixed');
                
                if ($toolbar.hasClass('article')) {
                    return;
                }
                
                $('body').css('margin-top', toolbarHeight);
            } else {
                $toolbar.removeClass('fixed');            
                
                if ($toolbar.hasClass('article')) {
                    return;
                }
                
                $('body').css('margin-top', 0);
            }
        },
        onToggleNav,
        images,
        showImage,
        showContent,
        replaceMain;
        
    onToggleNav = function () {        
        var $settings = $('#user-settings'),
            $login = $('#login');
            
        if (!$('#sign-in-btn').hasClass('active')) {
            $login.slideToggle(250, function () {
                toolbarOffset = $toolbar.offset().top;
            }).find('#username').focus();
        } else {    
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
           
        $('#active-article', oldHeader).click(function (ev) {
            ev.preventDefault();
            
            var $content = $('#new-article-content'),
                $container = $('#container');
                
            $(window).scrollTop(0);
            
            $container.removeClass().addClass('shrink');
            
            $content.show().animate({
                left: 0
            }, 300, function () {
                $content.css('position', '');
                $container.hide();
                
                $content.find('.toolbar').addClass('active');
                $container.find('.toolbar').removeClass('active');
                
                showImage();
        
                _.delay(showContent, 2 * 1000);
            });
        });
    
    };  
             
    $('#log-in').click(function (ev) {
        ev.preventDefault();
        
        onToggleNav();        
        
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
                    top: 10
                }, 250, 'easeOutExpo', function () {
                    /*$('#nav-items').css({
                        'position'  : '',
                        'top'       : '',
                        'left'      : ''
                    });*/
                });
                
                $('#logo').css({
                    'position'  : 'absolute',
                    'top'       : '30px',
                    'left'      : logoOffset.left
                }).show().animate({
                    top: 10
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
                    top: 10
                }, 250, 'easeOutExpo', function () {
                    $('#sign-in-btn').css({
                        'position'  : '',
                        'top'       : '',
                        'left'      : ''
                    });
                });
                
                $('#nav').removeClass('loading');
                replaceMain();
            };
        
        $('#nav-items, #logo, #sign-in-btn').fadeOut(function () {
            $('#nav-items').html($('#new-nav').html());
        });  
                  
        $('#nav').addClass('loading');
        
        _.delay(showNavItems, 2000);     
    });

    
    $('.close-article').click(function (ev) {
        ev.preventDefault();

        var $content = $('#new-article-content'),
            $container = $('#container'); 
            
        $(window).scrollTop(0);       
        
        $container.show().removeClass().addClass('grow');
        
        $content.find('.toolbar').removeClass('fixed active');
        $container.find('.toolbar').addClass('active');
        
        $content.animate({
            left: '100%'
        }, 300, function () {
            $content.css('position', 'absolute').hide();
        $container.removeClass();
        });
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

    $('#sign-in-btn').click(function (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        
        onToggleNav();
    });
});