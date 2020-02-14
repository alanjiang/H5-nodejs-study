import axios from 'ts-axios-new'

const urlMap = {
  development: '/',
  production: 'https://www.dianliaome.com'
}
//alert(process.env.NODE_ENV)
const baseUrl = urlMap[process.env.NODE_ENV]
//const baseUrl = urlMap['development']
const ERR_OK = 0

export function get(api) 
{
  return function(params = {}) 
  {
    return axios.get(baseUrl + api, 
   {
      params
    }).then((res) => {
        return res;
    }).catch((e) => {
    })
  }
}

export function delParam(api) 
{
  return function(params = {}) 
  {
    return axios.delete(baseUrl + api, 
   {
      params
    }).then((res) => {
        return res;
    }).catch((e) => {
    })
  }
}


export function del(api) {
	const url  = baseUrl+api;
	return function(params = {}) 
	{
		return axios.delete(baseUrl + api, 
	    {
		   params
				    }).then((res) => {
				        return res;
				    }).catch((e) => {
	    })
		
	  }
	 
}

export function post(api) {
	const url  = baseUrl+api;
	return function(params = {}) 
	{
		return axios({
	        method:'post',
	        url:url,
	        data: params 
	    }).then((res) => {
	        return res;
	    }).catch((err) => {
	        return err;
	    })
		
	  }
	 
}

export function put(api) 
{
	const url  = baseUrl+api;
	return function(params = {}) 
	{
		return axios({
	        method:'put',
	        url:url,
	        data: params 
	    }).then((res) => {
	        return res;
	    }).catch((err) => {
	        return err;
	    })
		
	  }
	 
}

export function setGlobal(key, value){
	
	localStorage.setItem(key, value)
	
}
export function getGlobal(key){
	
	localStorage.getItem(key)

}

export function removeGlobal(key){
	
	localStorage.removeItem(key)

}
