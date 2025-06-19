class ProductServices {
  getProductListApi() {
    const promise = axios({
      url: "https://684fda45e7c42cfd179644dd.mockapi.io/Products",
      method: "GET",
    });
    return promise;
  }
}
export default ProductServices;