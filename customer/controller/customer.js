import ProductServices from "../services/product-services-cus.js";
import Products from "../model/productCus.js";

const services = new ProductServices()
const product = new Products()

export const getEle = (id) => {
    return document.getElementById(id);
};

const getProductList = () => {
    const promise = services.getProductListApi();
    promise
        .then((result) => {
            renderProductList(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
};

const renderProductList = (data) => {
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
            <img class="w-40 h-40 object-contain mb-4" src="../../asset/image/${product.img}" alt="${product.name}" />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-1">Loại: ${product.type}</p>
            <p class="text-gray-600 text-sm mb-1">Màn hình: ${product.screen}</p>
            <p class="text-gray-600 text-sm mb-1">Camera Trước: ${product.frontCamera}</p>
            <p class="text-gray-600 text-sm mb-1">Camera Sau: ${product.backCamera}</p>
            <p class="text-blue-600 font-bold text-lg mb-2">${Number(product.price).toLocaleString()}₫</p>
            <button class="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Add to Cart
            </button>
        </div>
        `;
    }

    getEle("tbodyCustomerProducts").innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${contentHTML}
        </div>
    `;
};

getProductList();