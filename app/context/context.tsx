'use client';

import { createContext } from "react";
import { Provider } from "react-redux";
import { Flip, toast, ToastContainer } from "react-toastify";
import { store } from "../redux/store";

export const MainContext = createContext();

export const Context = ({ children }) => {
    const tostymsg = (msg, status) => {
        toast(msg, { type: status ? "success" : "error" });
    };
    return (
        <Provider store={store}>
            <MainContext.Provider value={{ tostymsg }}>
                <>
                    {children}
                    <ToastContainer
                        autoClose={1000}
                        transition={Flip}
                        toastClassName="text-sm bg-white shadow-md border w-52 border-gray-200 rounded p-3"
                    /></>
            </MainContext.Provider>
        </Provider>

    )
}