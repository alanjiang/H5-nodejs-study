import { get,post,del,delParam,setGlobal,getGlobal,removeGlobal } from './helpers'

const getShopMers = post('/sales/getproductlist?debug=1')

const getAddresses = get('/address/browseAddress')

const updateAddress = post('/address/update')

const setDefaultAddress = post('/address/setdefault')

const delAddress = delParam('/address/del')

const makeOrder = post('/newsales/makeOrder')

const getOrderDetail = post('/newsales/getOrderDetail')



export {
	getOrderDetail,makeOrder,getShopMers,getAddresses,updateAddress,setDefaultAddress,delAddress,setGlobal,getGlobal,removeGlobal
}