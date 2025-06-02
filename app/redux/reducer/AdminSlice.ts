import { createSlice } from "@reduxjs/toolkit";

export const AdminSlice = createSlice({
    name: 'admin',
    initialState: {
        token: null
    },
    reducers: {
        login(state, { payload }) {
            state.token = payload.token
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', payload.token);
            }
        },
        lsTokenData(state) {
            state.token = localStorage.getItem('token')

        }
    }

})

export const { login, lsTokenData } = AdminSlice.actions;
export default AdminSlice.reducer