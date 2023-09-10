/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-09-05 17:01:30
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-09-09 00:19:43
 * @FilePath: \node\admin\vue\src\stores\counter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'

export const usePiniaData = defineStore('piniaData',{
  state: ()=>({
	datas: {
    config: {
      backgroundColor: 'light'
    },
		userInfo: {}
    	}
  }),
  actions:{
	  updateInfo(info){
		this.datas.userInfo = info
	  },
    changebackgroundColor(){
      this.datas.config.backgroundColor === 'light'?this.datas.config.backgroundColor = 'dark':this.datas.config.backgroundColor = 'light'
    } 
  },
  getters:{
    
  }
})
