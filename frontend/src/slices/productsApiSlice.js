import { PRODUCTS_URL, UPLOAD_URL, UPLOADCSV_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        getProducts: builder.query(
            {
                query: ({ pageNumber, keyword })=> ({
                    url: PRODUCTS_URL,
                    params : {
                        pageNumber,
                        keyword
                    },
                    method: 'GET'
                }),
                providesTags: ['Products'],
                keepUnusedDataFor: 5
            }
        ),
        getProductDetails: builder.query(
            {
                query: (productId) => ({
                    url: `${PRODUCTS_URL}/${productId}`,
                    method: 'GET'
                }),
                keepUnusedDataFor: 5
            }
        ),
        createProduct: builder.mutation(
            {
                query: () => ({
                    url: PRODUCTS_URL,
                    method: 'POST',

                }),
                invalidatesTags: ['Product'], // For clearing the cache

            }
        ),
        updateProduct: builder.mutation(
            {
                query: (data) => ({
                    url: `${PRODUCTS_URL}/${data.productId}`,
                    method: 'PUT',
                    body: data,

                }),
                invalidatesTags: ['Products'],
            }
        ),
        uploadProductImage: builder.mutation(
            {
                query: (data) => ({
                    url: `${UPLOAD_URL}`,
                    method: 'POST',
                    body: data
                }),
            }
        ),
        deleteProduct: builder.mutation(
            {
                query: (productId) => ({
                    url: `${PRODUCTS_URL}/${productId}`,
                    method: 'DELETE',

                }),
            }
        ),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5,
        }),
        uploadProduct: builder.mutation({
            query: (data) => ({
                url: `${UPLOADCSV_URL}`,
                method: 'POST',
                body: data
            }),
        })
    }), 
        
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImageMutation, useDeleteProductMutation, useCreateReviewMutation, useGetTopProductsQuery, useUploadProductMutation } = productsApiSlice;