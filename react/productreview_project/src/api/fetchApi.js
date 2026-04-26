import commonApi from "./commonApi";

export const userRegister=(data)=>{
    return commonApi("http://127.0.0.1:8000/register/","POST",data,"")
}

export const userLogin=(data)=>{
    return commonApi("http://127.0.0.1:8000/login/","POST",data,"")
}

export const listProducts=()=>{
    return commonApi("http://127.0.0.1:8000/products/","GET","","")
}
export const getProduct=(id)=>{
    return commonApi(`http://127.0.0.1:8000/products/${id}/`,"GET","","")
}
export const getReviews = (id) => {
    return commonApi(`http://127.0.0.1:8000/products/${id}/get_reviews/`, "GET","","");
}
export const submitReview = (id, body, headers) => {
    return commonApi(`http://127.0.0.1:8000/products/${id}/add_review/`, "POST", body, headers);
};

export const searchProducts = (query) => {
    return commonApi(`http://127.0.0.1:8000/products/?search=${query}`, "GET", "","");
};

export const getUserProfile = (headers) => {
    return commonApi("http://127.0.0.1:8000/profile/", "GET", "", headers);
};

export const updateUserProfile = (data, headers) => {
    return commonApi("http://127.0.0.1:8000/profile/", "PUT", data, headers);
};


// ADMIN ROUTES -------------------------


export const addProduct=(data,headers)=>{
    return commonApi("http://127.0.0.1:8000/products/","POST",data,headers)
}
export const deleteProduct=(id,headers)=>{
    return commonApi(`http://127.0.0.1:8000/products/${id}/`,"DELETE","",headers)
}
export const listCategories=(headers = {})=>{
    return commonApi("http://127.0.0.1:8000/category/","GET","",headers)
}
export const listProductsByCategory = (categoryId) => {
  return commonApi(`http://127.0.0.1:8000/category/${categoryId}/products/`, "GET","","");
};
export const listAdminProducts=(headers)=>{
    return commonApi("http://127.0.0.1:8000/products/","GET","",headers)
}
export const getAdminProduct=(id,headers)=>{
    return commonApi(`http://127.0.0.1:8000/products/${id}/`,"GET","",headers)
}
export const editProduct=(id,data,headers)=>{
    return commonApi(`http://127.0.0.1:8000/products/${id}/`,"PUT",data,headers)
}

export const aiReviewAnalysis = (id, headers) => {
    return commonApi(
        `http://127.0.0.1:8000/products/${id}/ai_review_analysis/`,
        "GET",
        "",
        headers
    );
};