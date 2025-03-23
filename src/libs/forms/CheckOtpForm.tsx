"use client";

import { withFormik, FormikHelpers } from "formik";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { callApi } from "../helpers/callapi";
import { UnauthorizedException } from "@/libs/exceptions";
import InnerCheckOtpForm from "@/components/auth/InnerCheckOtpform";
import { handleApiError } from "../helpers/errorHandler";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Interface definitions
interface CheckOtpFormProps {
  router: AppRouterInstance;
  phone?: string;
}

interface CheckOtpFormValues {
  otp: string;
  phone?: string;
}

// Validation schema with zod
const checkOtpValidationSchema = z.object({
  otp: z.string()
    .trim()
    .min(1, "وارد کردن کد تایید الزامیست")
    .length(5, "کد تایید باید 6 رقم باشد")
});

// Form configuration
const CheckOtpForm = withFormik<CheckOtpFormProps, CheckOtpFormValues>({
  // Initialize form values
  mapPropsToValues: (props) => ({
    otp: "",
    phone: props.phone,
  }),

  // Validation schema - convert zod schema to formik compatible validation
  validate: (values) => {
    try {
      checkOtpValidationSchema.parse(values);
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
    values: CheckOtpFormValues,
    { setSubmitting, props }: FormikHelpers<CheckOtpFormValues> & { props: CheckOtpFormProps }
  ) => {
    try {
     
      const response = await callApi.post<{ message: string }>("/auth/check-otp", {
        code: values.otp,
        phone: values.phone
      });

      if (response?.status === 200) {
        props.router.push("/");
        // Show success message
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  },
})(InnerCheckOtpForm);

export default CheckOtpForm;