import axios from 'axios'

const commonApi=(url,method,data,headers)=>{
    const config={
        url:url,
        method:method,
        data:data,
        headers:headers?headers:{"Content-Type":"application/json"}
    }
    return axios(config)
}

export default commonApi