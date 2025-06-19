class ProductServices {
  getProductListApi() {
    const promise = axios({
      url: "https://684fda45e7c42cfd179644dd.mockapi.io/Products",
      method: "GET",
    });
    return promise;
  }
  addProductApi(products) {
    const promise = axios({
      url: "https://684fda45e7c42cfd179644dd.mockapi.io/Products",
      method: "POST",
      data: products,
    });
    return promise;
  }
deleteProductApi(id) {
    const promise = axios({
      url: `https://684fda45e7c42cfd179644dd.mockapi.io/Products/${id}`,
      method: "DELETE",
    });
    return promise;
  }

}
export default ProductServices;
