define([], function () {

    var custom_scrolling=false;
    var createImgitem=function(src){
        if(!src){
            return '';
        }
        return '<span style="background-image:url('+src+')" class="img-item"></span>'
    };
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
            fn({
                index:index
            })

        })
        //box.scrollLeft=index * width;
    };

    return {
        init: function ($mod) {

            var Data={
                count:$mod.attr('data-count')-0,
                startIndex:0,
                src:[],
                text:[]
            };
            $mod.children('input.J_data').each(function(i,n){
                if(n.name in Data){
                    Data[n.name].push($.trim(n.value));
                }

            }).remove();
            var reloadScroll=function(obj){


                var scrollIndex=obj.index-0,
                    dataIndex=Data.startIndex+scrollIndex;

                if($mod.attr('data-index')==dataIndex+1){
                    return custom_scrolling=false;//do nothing
                }
               // console.log('ddds')

                /**
                 * reset desc
                 * */
                var desc=Data.text[dataIndex];//$box.children().eq(dataIndex).attr('data-text');
                $desc.css({
                    transform:'translate(0,0)'
                }).data('delta',0).find('.J_desc_text').html(desc);
                $desc.find('.J_desc_index').html(dataIndex+1);

                /**
                 * reset data-index
                 * */
                $mod.attr('data-index',dataIndex+1);

                if(Data.count>2){
                    //var $imgNodes=$box.children('.img-item');


                    var newStartIndex=Math.min(Data.count-2,Math.max(dataIndex-1,0)),
                        direction=newStartIndex-Data.startIndex;
                    //console.log('direction:'+direction,' newStartIndex:'+newStartIndex,' startIndex:'+Data.startIndex)
                    Data.startIndex=newStartIndex


                    var left=createImgitem(Data.src[dataIndex-1]),
                        mid=createImgitem(Data.src[dataIndex]),
                        right=createImgitem(Data.src[dataIndex+1]);

                    $box.html(left+mid+right);

                    if(direction<0 && left) {
                        $box[0].scrollLeft += $box[0].clientWidth;
                    }else if(direction>0 && right){
                        $box[0].scrollLeft -= $box[0].clientWidth;
                    }

                }
                custom_scrolling=false;

            };
            //console.log(Data)


            var TO_Scroll;


            var touchOnDesc=false;
            var $box=$mod.find('.J_box').on('tap', function (e) {
                //console.log('sd')
                $mod.toggleClass('fullscreen')
            }).on('swipe', function (e) {
                //var type= e.type;
                //console.log('swipe', e);


            }).on('scroll',function(){
                if(!custom_scrolling) {
                    if (TO_Scroll) {
                        clearTimeout(TO_Scroll)
                    }

                    TO_Scroll = setTimeout(function () {
                        custom_scrolling=true;
                        checkScroll($box[0], reloadScroll);
                    }, 100);
                }
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
