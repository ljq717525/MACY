jQuery.fn.extend({
	slider:function(obj){
		new Slider(obj);
	}
});


//轮播图的属性
function Slider(obj){
	//属性：
	this.$boxDom = obj.$boxDom;
	this.width = obj.width;
	this.height = obj.height;
	//播放的图片数组（图片的地址）
	this.imgs = obj.imgs;
	
	//当前播放的图片的序号
	this.currOrd = obj.currOrd;
	if(this.currOrd>this.imgs.length){
		this.currOrd=1;
	}
	this.currOutOrd = -1;
	//时间间隔
	this.timeSpace = obj.timeSpace;
	//定时器
	this.myTimer = null;
	//按钮
	//按钮的颜色
	this.btn = {
		//按钮的大小
		width:obj.btn.width,
		height:obj.btn.height,
		color:obj.btn.color,//按钮的原始颜色
		highColor:obj.btn.highColor,//按钮的高亮颜色
		//按钮的位置（）
		right:obj.btn.right,
		bottom:obj.btn.bottom,
		isCircle:obj.btn.isCircle
	}
	this.initUI();
	this.initUIEvent();
	this.go();
}

//
Slider.prototype.initUI = function(){
	//1、创建img
	for(let i=0;i<this.imgs.length;i++){
		this.$boxDom.append("<img style='position: absolute;left:"+this.width+"px;width:"+this.width+"px;height:"+this.height+"px;' src='"+this.imgs[i]+"'/>");
	}
	//把第一张（要播放的第一张）放在盒子里
	this.$boxDom.find("img").eq(this.currOrd-1).css({"left":0});
	
	//2、创建按钮
	//创建ul
	this.$boxDom.append("<ul style='list-style: none;display:flex;position:absolute;right:"+this.btn.right+"px;bottom:"+this.btn.bottom+"px;'></ul>");
	let liStr = "<li style='margin-left:20px;width:"+this.btn.width+"px;height:"+this.btn.height+"px;background-color:"+this.btn.color+";";
	if(this.btn.isCircle){
		liStr+="border-radius:50%;";
	}
	liStr+="'></li>";
	let $ul = this.$boxDom.find("ul");
	for(let i=0;i<this.imgs.length;i++){
		$ul.append(liStr);	
	}
	this.$boxDom.find("li").eq(this.currOrd-1).css({"backgroundColor":this.btn.highColor});
}

Slider.prototype.initUIEvent = function(){
	let obj = this;
	this.$boxDom[0].addEventListener("mouseover",function(){
		window.clearInterval(obj.myTimer);
	});
	this.$boxDom[0].addEventListener("mouseout",function(){
		obj.go();
	});	
	this.$boxDom.find("li").click(function(){
		window.clearInterval(obj.myTimer);
		let index = $(this).index();
		obj.goImg(index+1);
	});
}

Slider.prototype.goImg = function(ord){
	if(ord==this.currOrd){
		return;
	}
	//让当前正在进行中的图片（处于移动中的图片）进行到头
	this.$boxDom.find("img").eq(this.currOutOrd-1).stop(true,true);
	this.$boxDom.find("img").eq(this.currOrd-1).stop(true,true);
	
	//1、改变数据（当前播放的图片序号）
	this.currOutOrd = this.currOrd;
	this.currOrd=ord;
	
	if(this.currOrd>this.imgs.length){
		this.currOrd = 1;
	}
	
	//2、改变外观；（滑动效果）
	this.changeImg();
}

Slider.prototype.changeImg = function(){
	this.$boxDom.find("img").eq(this.currOrd-1).css({"left":this.width}).animate({"left":0},2000);
	this.$boxDom.find("img").eq(this.currOutOrd-1).animate({"left":-1*this.width},2000);
	this.$boxDom.find("li").eq(this.currOrd-1).css({"backgroundColor":this.btn.highColor}).siblings().css({"backgroundColor":this.btn.color});
}

Slider.prototype.go = function(){
	let obj = this;
	this.myTimer = setInterval(function(){
		obj.goStep();
	},this.timeSpace);
}

Slider.prototype.goStep = function(){
	//1、改变数据（当前播放的图片序号）
	this.currOutOrd = this.currOrd;
	this.currOrd++;
	
	if(this.currOrd>this.imgs.length){
		this.currOrd = 1;
	}
	
	//2、改变外观；（滑动效果）	
	this.changeImg();
}
