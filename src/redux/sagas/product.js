import { call, put, takeLatest } from 'redux-saga/effects';
import {
   PRODUCTS_FETCH_INITIATED,
   PRODUCT_DELETE_INITIATED,
   PRODUCT_FETCH_INITIATED,
   PRODUCT_UPDATE_INITIATED
} from 'redux/constants/products';
import {
   fetchProductsSuccess,
   fetchProductsFail,
   deleteProductFail,
   deleteProductSuccess,
   fetchProductSuccess,
   fetchProductFail,
   updateProductSuccess,
   updateProductFail
} from 'redux/actions/product';
import { showNotification } from "utils";
import Api from "redux/apis/product";

export function* fetchProducts() {
    try {
        const response = yield call(Api.fetchProducts);
        const { data = [] } = response;
        yield put(fetchProductsSuccess(data));
    } catch (e) {
        const { message = "somthing went wrong" } = e.response || {};
        yield put(fetchProductsFail(message));
        showNotification(message);
    }
}

export function* deleteProduct(action) {
    const id = action.payload;
    try {
        yield call(Api.deleteProduct, id);
        yield put(deleteProductSuccess(id));
        showNotification("Product Deleted Successfully!");
     } catch (e) {
        const { message = "somthing went wrong" } = e.response || {};
        yield put(deleteProductFail());
        showNotification(message);
     }
}

export function* fetchProduct(action) {
    const id = action.payload;
    try {
        const response = yield call(Api.fetchProduct, id);
        const { data = {} } = response;
        yield put(fetchProductSuccess(data))
     } catch (e) {
        const { message = "somthing went wrong" } = e.response || {};
        yield put(fetchProductFail(message));
        showNotification(message);
     }
}

export function* updateProduct(action) {
    const { id, data } = action.payload;
    try {
        if (id) {
          yield call(Api.updateProduct, id, data);
        } else {
          yield call(Api.createProduct, data);
        }
        yield put(updateProductSuccess())
     } catch (e) {
        const { message = "somthing went wrong" } = e.response || {};
        yield put(updateProductFail(message));
        showNotification(message);
     }
}


export default function* productSaga() {
    yield takeLatest(PRODUCTS_FETCH_INITIATED, fetchProducts);
    yield takeLatest(PRODUCT_DELETE_INITIATED, deleteProduct);
    yield takeLatest(PRODUCT_FETCH_INITIATED, fetchProduct);
    yield takeLatest(PRODUCT_UPDATE_INITIATED, updateProduct);
}
