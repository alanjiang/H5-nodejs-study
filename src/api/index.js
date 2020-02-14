import { get,post,del,delParam,setGlobal,getGlobal,removeGlobal } from './helpers'

const getShopMers = post('/sales/getproductlist?debug=1')

const getAddresses = get('/address/browseAddress')

const updateAddress = post('/address/update')

const setDefaultAddress = post('/address/setdefault')

const delAddress = delParam('/address/del')

export {
	getShopMers,getAddresses,updateAddress,setDefaultAddress,delAddress,setGlobal,getGlobal,removeGlobal
}