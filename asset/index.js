define([], function () {

    var scrollto=function(box,left,fn){

        if(box.scrollLeft!=left) {

            var delta=(left-box.scrollLeft)/10;
            //console.log('origin',delta)
            delta=Math.abs(delta)<1?(delta>0?1:-1):delta;
//console.log(delta,box.scrollLeft,left)
            box.scrollLeft+=delta;
            setTimeout(function () {
                scrollto(box, left,fn);
            },16)
        }else{
            fn && fn()
        }
    };
    var checkScroll=function(box,fn){
        var width=box.clientWidth,
            scrollLeft=box.scrollLeft,
            ratio=scrollLeft/width,
            index=Math.round(ratio);
        //var delta=scrollLeft-index*width;
        //console.log(delta,index)
        //box.style.transform='translate('+delta+'px,0)'
        scrollto(box,index*width,function(){
            fn({index:index})
        })
        //box.scrollLeft=index * width;
    };
    return {
        init: function ($mod) {
            var TO_Scroll;


            var touchOnDesc=false;
            var $box=$mod.find('.J_box').on('tap', function (e) {
                //console.log('sd')
                $mod.toggleClass('fullscreen')
            }).on('swipe', function (e) {
                //var type= e.type;
                //console.log('swipe', e);


            }).on('scroll',function(){
                if(TO_Scroll){
                    clearTimeout(TO_Scroll)
                }
                TO_Scroll=setTimeout(function(){
                    checkScroll($box[0],function(obj){
                        var desc=$box.children().eq(obj.index).attr('data-text');
                        $desc.css({
                            transform:'translate(0,0)'
                        }).data('delta',0).find('.J_desc_text').html(desc);
                        $desc.find('.J_desc_index').html(obj.index+1);
                        $mod.attr('data-index',obj.index+1)
                    });
                },100);



            }),
            $desc=$mod.find('.J_desc').on('touchstart',function(e){
                touchOnDesc={
                    startX: e.touches[0].clientX,
                    startY: e.touches[0].clientY,
                    lastDelta:($desc.data('delta')||0)-0
                };
                return false;

            });
            $mod.on('touchmove',function(e){
                if(touchOnDesc){
                    var delta=Math.max(minDescY,Math.min(0,e.touches[0].clientY-touchOnDesc.startY+touchOnDesc.lastDelta));

                    $desc.css({
                        transform:'translate(0,'+delta+'px)'
                    }).data('delta',delta)
                }
            }).on('touchend touchcancel',function(e){
                if(touchOnDesc){
                    touchOnDesc=null;
                }
            });

            var minDescY=$mod.offset().top-$desc.offset().top;
            //console.log(maxDescY)



        }
    }
})
