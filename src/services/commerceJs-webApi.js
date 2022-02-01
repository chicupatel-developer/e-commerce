import webApicommerceJsHttp from "../axiosHttp/webApi-commerceJs-http";

class CommerceJsWebApiService {

    getShoppingConfirmation(shoppingData) {
        return webApicommerceJsHttp.post("/shoppingConfirmation", shoppingData, {
            responseType: 'blob'
        });
    }
  
}

export default new CommerceJsWebApiService();