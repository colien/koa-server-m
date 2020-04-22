(function (w) {
    w.gesture = function (ele,callback) {
            let isStart = false;
            //判断是否触发了触摸事件
            ele.addEventListener('touchstart',function (event) {
                if(event.touches.length >= 2){
                    // alert(event.touches.length)
                    isStart = true ;
                    //记录两个触点间的初始距离
                    this.startDistance =getDistance(event.touches[0],event.touches[1]);
                    // alert(this.startDistance)
                    //记录两个触点的初始角度
                    this.startDeg =getDeg(event.touches[0],event.touches[1]);
                    // alert(this.startDeg)
                    //判断是否传入回调，调用回调函数
                    if(callback && typeof callback['start'] === "function"){
                        callback['start']();
                    }
                }
            });
            ele.addEventListener('touchmove',function (event) {
                //判断移动时屏幕上的触点个数
                if(event.touches.length >= 2){
                    //计算两个触点的实时距离
                    const currDistance = getDistance(event.touches[0], event.touches[1]);
                    //记录两个触点的实时角度
                    const currDeg = getDeg(event.touches[0], event.touches[1]);
                    //计算实时距离与初始距离的比例，传入event的属性中
                    event.scale = currDistance / this.startDistance;
                    //计算实时角度与初始角度的差值，传入event的属性中
                    event.rotation = currDeg - this.startDeg;
    
                    //判断是否传入回调，调用回调函数
                    if(callback && typeof callback['change'] === "function"){
                        //将event传回去
                        callback['change'](event);
                    }
                }
            });
            // 手指离开当前元素时，先判断当前的触点是否小于2，是否曾触发过touchstart事件
            ele.addEventListener('touchend',function (event) {
                if(event.touches.length < 2 && isStart){
                    //此时调用end回调
                    if (callback && typeof(callback['change']) === 'function') {
                        callback['end']();
                    }
                    //重置isStart为false
                    isStart = false;
                }
            });
    
            // 获取两个点之间的距离
            function getDistance(touch1,touch2) {
                const a = touch1.clientX - touch2.clientX;
                const b = touch1.clientY - touch2.clientY;
                //勾股定理，得出两点距离长度
                return Math.sqrt(a * a + b * b);
            }
            // 获取两个触点的角度
            function getDeg(touch1,touch2) {
                const x = touch1.clientX - touch2.clientX;
                const y = touch1.clientY - touch2.clientY;
                //tan值 = 对边Y / 临边X
                const radian = Math.atan2(y, x);
                return radian * 180 / Math.PI;
            }
        }
    })(window);
  