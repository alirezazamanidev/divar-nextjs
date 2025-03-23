import { ErrorMessage, Field } from "formik";
import { Form, FormikProps } from 'formik';
import { ClipLoader } from "react-spinners";
import OTPInput from 'react-otp-input';

export default function InnerCheckOtpform({
  isSubmitting,
  values,
  setFieldValue,
  handleChange
}: FormikProps<any>) {

  return (
    <Form className="mt-8 space-y-6">
      <div className="relative">
      <div className="flex justify-center" dir="ltr">
        <OTPInput
          value={values.otp}
          onChange={(value) => handleChange({ target: { name: 'otp', value } })}
          numInputs={5}
          renderInput={(props) => (
            <input
              {...props}
              className="!w-10 !h-10 !text-lg text-gray-100 !text-center !mx-1 !border-2 !rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500 !outline-none"
              dir="ltr"
            />
          )}
          inputStyle="otp-input"
          shouldAutoFocus={true}
          containerStyle="direction: ltr"
          inputType="tel"
          renderSeparator={<span></span>}
        />
      </div>

      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white py-2.5 px-4 rounded-md font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center justify-center text-sm"
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={16} color="#ffffff" className="ml-2" />
              <span>در حال پردازش...</span>
            </>
          ) : (
            'تایید'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <span className="border-b border-dashed border-gray-500 pb-0.5">ارسال مجدد کد</span>
        </button>
      </div>
    </Form>
  );
}

