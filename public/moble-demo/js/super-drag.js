function init() {
 
   var data;
   $(".dragDiv").each(function () {

	   //如果是IE
	   if (!!window.ActiveXObject || "ActiveXObject" in window) {

		 
		  
		   $(this).on("dragstart", function (ev) {
			   /*拖拽开始*/
			   //拖拽效果
			   ev.originalEvent.dataTransfer.effectAllowed = "move";
			  
			   data = ev.target.id;
			   return true;
		   });

		   $(this).on("dragend", function (ev) {
			   return false
		   });

		   $(this).on("dragover", function (ev) {
			   /*拖拽元素在目标元素头上移动的时候*/
			   ev.preventDefault();
			   return true;
		   });

		   $(this).on("dragenter", function (ev) {

			   return true;
		   });

		   $(this).on("drop", function (ev) {
			   ev.preventDefault();
			   var src = document.getElementById(data);

			   var srcParent = src.parentNode;
			   var tgt = ev.currentTarget.firstElementChild;

			   //用src替换tgt
			   ev.currentTarget.replaceChild(src, tgt);
			   srcParent.appendChild(tgt);

			   var sourceIndex = $(src).attr("index");
			   var targetIndex = $(tgt).attr("index");

			   //存在保存的索引值
			   if (localStorage.indexs) {
				   var indexs = localStorage.indexs;
				   indexs = indexs.replace(sourceIndex, "*");
				   indexs = indexs.replace(targetIndex, "&");
				   indexs = indexs.replace("*", targetIndex);
				   indexs = indexs.replace("&", sourceIndex);
				   //将新的索引顺序保存在localStorage
				   localStorage.indexs = indexs;
			   }
		   });

	   }
		   //Html5的拖拽IE不支持
	   else {

		  
		   $(this).on("dragover", function (event) {
			  event.preventDefault();
		   });
		   $(this).on("drop", function (ev) {

			   ev.preventDefault();
			   var src = document.getElementById(ev.originalEvent.dataTransfer.getData("src"));

			   var srcParent = src.parentNode;
			   var tgt = ev.currentTarget.firstElementChild;

			   //用src替换tgt
			   ev.currentTarget.replaceChild(src, tgt);
			   srcParent.appendChild(tgt);

			   var sourceIndex = $(src).attr("index");
			   var targetIndex = $(tgt).attr("index");

			   //存在保存的索引值
			   if (localStorage.indexs) {
				   var indexs = localStorage.indexs;
				   indexs = indexs.replace(sourceIndex, "*");
				   indexs = indexs.replace(targetIndex, "&");
				   indexs = indexs.replace("*", targetIndex);
				   indexs = indexs.replace("&", sourceIndex);
				   //将新的索引顺序保存在localStorage
				   localStorage.indexs = indexs;
			   }
		   });


		   $(this).children(0).on("dragstart", function (event) {
			   event.originalEvent.dataTransfer.setData("src", event.target.id);
		   });
	   }
   });

   //不存在保存的索引值，则保存初始化
   if (!localStorage.indexs) {
	   localStorage.indexs = "1,2,3,4";
   }
   else {
	   //从保存的索引值中，按照顺序显示div
	   var indexs = localStorage.indexs.toString().split(",");
	   for (var i = 0; i < indexs.length; i++) {
		   var index = indexs[i];
		   var divElement = document.getElementById("div" + index);
		   document.getElementById("content").insertAdjacentElement("beforeend", divElement);
	   }
   }
}