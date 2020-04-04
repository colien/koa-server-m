module.exports = (proxyEnv)=>{
   if(proxyEnv){
		return require("./host-dev.js");
   }else{
		return require("./host-prod.js");
   }
}