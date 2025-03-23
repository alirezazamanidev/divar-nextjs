"use client";

import { withFormik, FormikHelpers } from "formik";
import * as z from "zod";

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { UnauthorizedException } from "@/libs/exceptions";
import InnerLoginForm from "@/components/auth/InnerLoginform";
import { handleApiError } from "../helpers/errorHandler";
import { callApi } from "../helpers/callapi";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Interface definitions
interface LoginFormProps {
  router:  AppRouterInstance
  setPhone: (phone: string) => void;
}

interface LoginFormValues {
  phone: string;
}

// Validation constants
const PHONE_REGEX = /^(09[0-9]\d{8}|0903\d{7})$/;
const PERSIAN_NUMBERS_REGEX = /^\d+$/;

// Validation schema with zod
const loginValidationSchema = z.object({
  phone: z.string()
    .trim()
    .min(1, "وارد کردن شماره تلفن الزامیست")
    .refine(val => PERSIAN_NUMBERS_REGEX.test(val), {
      message: 'لطفا از اعداد انگلیسی استفاده کنید'
    })
    .refine(val => PHONE_REGEX.test(val), {
      message: "فرمت شماره تلفن وارد شده صحیح نیست"
    })
});

// Form configuration
const LoginForm = withFormik<LoginFormProps, LoginFormValues>({
  // Initialize form values
  mapPropsToValues: () => ({
    phone: "",
  }),

  // Validation schema - convert zod schema to formik validation
  validate: (values) => {
    try {
      loginValidationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.formErrors.fieldErrors;
      }
      return {};
    }
  },

  // Form submission handler
  handleSubmit: async (
    values: LoginFormValues,
    { setSubmitting, props }: FormikHelpers<LoginFormValues> & { props: LoginFormProps }
  ) => {
    try {
        
        const response = await callApi.post<{ message: string, otpCode: string }>("/auth/send-otp", {
            phone: values.phone
        });
        if (response?.status === 200) {
            // Update phone in parent component
            props.setPhone(values.phone);
            props.router.push("/verify");
            console.log(response.data.otpCode);
            
            // Show success message
            toast.success(response.data.message)
        }
    } catch (error) {
      handleApiError(error);
    } 
  },
})(InnerLoginForm);

export default LoginForm;