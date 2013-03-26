$(function () {
    var $toolbar = $('.toolbar.active'),
        toolbarOffset = $toolbar.offset().top,
        toolbarHeight = $toolbar.outerHeight(),
        filterOffset = $('#filters').offset().top,
        filterLeft = $('#filters').offset().left,
        filterWidth = $('#filters').width(),
        isCanceled = false,
        startTimer,
        onToggleNav,
        images,
        showImage,
        showContent,
        replaceMain;
        
    $('#slideshow ul').css({
        width: $('#slideshow li').width() * $('#slideshow img').length
    });
    
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
    
    var calcSlideshow = function () {
        var $slideshow = $('#slideshow'),
            width = $slideshow.width();
        
        $slideshow.find('li').css('width', width);
                
        $slideshow.find('ul').css({
            'width': width * $slideshow.find('li > img').length,
            'margin-left' : 0
        });
    };
    
    $('.filter-btn').click(function (ev) {
        ev.preventDefault();
        
        var $this = $(this),
            filter = $this.data('filter');
                
        $this.parents('.filter:first').find('.filter-btn').removeClass('active');
        $this.addClass('active');
        
        $('html, body').animate({
            scrollTop : 0
        }, 300, function () {
            if (!filter.length) {
                $('#stream').find('.stream-list-item').slideDown(150);
                return;
            }
            
            $('#stream').find('> li.' + filter).slideDown(150);
            
            $('#stream').find('> li:not(.' + filter + ')').slideUp(150);
        });
    });
        
    /*$('#slideshow').mousemove(function (ev) {
        ev.preventDefault();
        
        var width = $('#slideshow').width(),
            imgCount = $('#slideshow li > img').length,
            diff = width / imgCount,
            leftVal = ev.pageX - $('#slideshow').offset().left,
            index = 0;
        
        if (leftVal < diff) {
            index = 0;
        } else if (leftVal >= diff && leftVal < diff * 2) {
            index = 1;
        } else if (leftVal >= diff * 2 && leftVal < diff * 3) {
            index = 2;
        } else if (leftVal >= diff * 3 && leftVal < diff * 4) {
            index = 3;
        } else if (leftVal >= diff * 4 && leftVal < diff * 5) {
            index = 4;
        } else if (leftVal >= diff * 5 && leftVal < diff * 6) {
            index = 5;
        } else if (leftVal >= diff * 6 && leftVal < diff * 7) {
            index = 6;
        } else if (leftVal >= diff * 7 && leftVal < diff * 8) {
            index = 7;
        } else if (leftVal >= diff * 8 && leftVal < diff * 9) {
            index = 8;
        } else if (leftVal >= diff * 9 && leftVal < diff * 10) {
            index = 9;
        } else if (leftVal >= diff * 10 && leftVal < diff * 11) {
            index = 10;
        } else if (leftVal >= diff * 11 && leftVal < diff * 12) {
            index = 11;
        }
        
        $('#slideshow ul').css({
            'marginLeft': - ($('#slideshow').width() * index)
        });
    });*/
    
    
    
    $('.slideshow-prev-btn').click(function (ev) {
        ev.preventDefault();
                
        if (slideshowIndex <= 0) {
            return;
        }
        
        $('.slideshow-next-btn').removeClass('disabled');
        
        slideshowIndex -= 1;

        $('#slideshow ul').animate({
            'marginLeft': - ($('#slideshow').width() * slideshowIndex)
        }, 150);
        
        if (slideshowIndex === 0) {
            $('.slideshow-prev-btn').addClass('disabled');
        }
    });
    
    $('.slideshow-next-btn').click(function (ev) {
        ev.preventDefault();
                
        if (slideshowIndex >= $('#slideshow img').length) {
            return;
        }
        
        $('.slideshow-prev-btn').removeClass('disabled');
        
        slideshowIndex += 1;

        $('#slideshow ul').animate({
            'marginLeft': - ($('#slideshow').width() * slideshowIndex)
        }, 150);
        
        if (slideshowIndex === $('#slideshow img').length - 1) {
            $('.slideshow-next-btn').addClass('disabled');
        }
    });
    
    var isActive = false;
    
    $('#new-items').click(function (ev) {
        ev.preventDefault();
        
        $('html, body').animate({
            scrollTop : 0
        }, 300, function () {
            $('#hidden-item-in-stream').slideDown(200, function () {
                if (!isActive) {
                    setInterval(startTimer, 1000); 
                 
                    isActive = true;
                 
                    $('#new-items').fadeOut(100);  
                }   
            });
        });
    });
    
    setTimeout(function () {
        $('#new-items').fadeIn(100);     

    }, 10 * 1000);
    
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
    
    $('#active-essay').click(function (ev) {
        ev.preventDefault();
        
        var $content = $('#picture-essay'),
            $container = $('#container');
            
        $(window).scrollTop(0);
        
        $container.removeClass().addClass('shrink');
        
        $content.show().animate({
            opacity: 1,
            left: 0
        }, 400, function () {                
            $container.hide();
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
        }, 200, function () {
            $container.removeClass();
            $('#new-main-article').hide();
        });
    });
    
    $('#close-essay').click(function (ev) {
        ev.preventDefault();

        var $content = $('#picture-essay'),
            $container = $('#container'); 
            
        $(window).scrollTop(0);       
        
        $container.show().removeClass().addClass('grow');
        
       $content.animate({
            opacity: 0,
            left: '100%'
        }, 200, function () {
            $container.removeClass();
            $content.hide();
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
    
    $('#box-style').click(function (ev) {
        ev.preventDefault();
        
        $('#list-style').removeClass('active');
        
        $('#box-style').addClass('active');
        
        $('#stream, #filters').removeClass('collapsed');
        
        calcSlideshow();
    });
    
    $('#list-style').click(function (ev) {
        ev.preventDefault();
        
        $('#box-style').removeClass('active');
        
        $('#list-style').addClass('active');
        
        $('#stream, #filters').addClass('collapsed');
        
        calcSlideshow();
    });
});