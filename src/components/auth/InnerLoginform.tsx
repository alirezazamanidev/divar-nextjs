import { Formik, Form, Field, FormikHelpers, FormikProps, ErrorMessage } from "formik";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

interface LoginFormValues {
  phone: string;
}

export default function InnerLoginForm({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}: FormikProps<LoginFormValues>) {
  return (
    <>
      <Form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <Field
            type="tel"
            name="phone"
            className={`w-full bg-zinc-700 border ${
              errors.phone && touched.phone ? "border-red-400" : "border-zinc-600"
            } rounded-lg py-4 px-4 text-left text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500`}
            placeholder="شمارۀ موبایل"
            dir="ltr"
            required
          />
          <ErrorMessage
            name="phone"
            component="div"
            className="text-red-400 text-sm mt-1 mr-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={20} color="#ffffff" className="mr-2" />
              <span>در حال پردازش...</span>
            </>
          ) : (
            "ورود"
          )}
        </button>
      </Form>
    </>
  );
}