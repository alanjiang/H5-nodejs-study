import { get,post,setGlobal,getGlobal,removeGlobal } from './helpers'

const getShopMers = post('/sales/getproductlist')

export {
	getShopMers,setGlobal,getGlobal,removeGlobal
}