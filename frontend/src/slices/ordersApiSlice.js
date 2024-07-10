import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: {...order}
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'GET'
            }),
            keepUnusedDataFor: 5
        }),
        payOrder : builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details }
            })
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
                method: 'GET'
            }),
            keepUnusedDataFor: 5
        }),
        getMyOrders : builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
                method: 'GET'
            }),
            keepUnusedDataFor: 5
        }),
        getOrders : builder.query({
            query: () => ({
                url: ORDERS_URL,
                method: 'GET'
            }),
            keepUnusedDataFor: 5
        }),
        deliverOrder : builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
        cancelOrder : builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/cancel`,
                method: 'PUT',
            })
        }),
        returnOrder: builder.mutation({
            query: ({ orderId, data }) => ({
                url: `${ORDERS_URL}/${orderId}/return`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Order'],
        }),
        approveReturn: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/return/approve`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order'],
        }),
        rejectReturn: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/return/reject`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order'],
        }),
    }), 
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation, useCancelOrderMutation, useReturnOrderMutation, useApproveReturnMutation, useRejectReturnMutation } = orderApiSlice;