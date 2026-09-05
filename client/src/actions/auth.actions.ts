"use server"

import { CHECK_CREDENTIALS_URL, FORGET_PASSWORD_URL, REGISTER_URL, RESET_PASSWORD_URL } from "@/lib/apiEndpoints"
import axios, { Axios, AxiosError } from "axios"

export const registerActions = async (prevState: any, formdata: FormData) => {
    try {
        const { data } = await axios.post(REGISTER_URL, {
            name: formdata.get("name"),
            email: formdata.get("email"),
            password: formdata.get("password"),
            confirm_password: formdata.get("confirm_password")
        });

        return {
            status: 200,
            message: data?.message ?? "Check your email, we have sent you a verification email"
        }

    } catch (error) {

        if (error instanceof AxiosError) {
            if (error.response?.status == 422) {
                return {
                    status: 422,
                    message: error.response?.data?.message,
                    errors: error.response?.data?.errors
                }
            }
        }

        return {
            status: 500,
            message: "Something went wrong",
            errros: {}
        }
    }
}


export const loginActions = async (prevState: any, formdata: FormData) => {
    try {

        const { data } = await axios.post(CHECK_CREDENTIALS_URL, {
            email: formdata.get("email"),
            password: formdata.get('password')
        });

        return {
            status: 200,
            message: data?.message ?? "You were logged in.",
            data: {
                email: formdata.get('email'),
                password: formdata.get('password')
            }
        }

    } catch (error) {

        if (error instanceof AxiosError) {
            if (error.response?.status == 422) {
                return {
                    status: 422,
                    message: error?.response?.data?.message,
                    errors: error?.response?.data?.errors,
                    data: {}
                }
            }
        }

        return {
            status: 500,
            message: "Something went wrong",
            errors: {},
            data: {}
        }

    }
}

export const forgetPassordAction = async (prevState: any, formdata: FormData) => {
    try {


        const { data } = await axios.post(FORGET_PASSWORD_URL, {
            email: formdata.get("email") as string
        });

        return {
            status: 200,
            message: data?.message ?? "check you email",
            errors: {}
        }

    } catch (error) {

        if (error instanceof AxiosError) {

            if (error.response?.status == 422) {
                return {
                    status: 422,
                    message: error.response?.data?.message,
                    errors: error.response?.data?.errors,
                }
            }

        }

        return {
            status: 500,
            message: "Something went wrong",
            errors: {},
        }
    }
}


export const resetPasswordAction = async (prevState: any, formdata: FormData) => {
    try {

        const { data } = await axios.post(RESET_PASSWORD_URL, {
            email: formdata.get("email"),
            password: formdata.get("password"),
            confirm_password: formdata.get("confirm_password"),
            token: formdata.get("token")
        });

        return {
            status: 200,
            message: data?.message ?? "Password updated successfully",
            errors: {},
        }

    } catch (error) {

        if (error instanceof AxiosError) {

            if (error.response?.status == 422) {

                return {
                    status: 422,
                    message: error.response?.data?.message ?? "Inavlid data",
                    errors: error.response.data.errors,
                }
            }
        }

        return {
            status: 500,
            message: "Something went wrong",
            errors: {}
        }
    }
}