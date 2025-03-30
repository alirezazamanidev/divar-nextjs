'use client'
import { FormField } from "@/libs/models/formFiled";
import { Field, useField } from "formik";
import { ErrorMessage } from "formik";
import { Switch } from '@headlessui/react';
import { useState } from "react";

interface FormFiledsProps {
  fields: FormField[];
}

// کامپوننت سوییچ سفارشی با Headless UI
const HeadlessSwitch = ({ name, label, required }: { name: string, label: string, required?: boolean }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const isChecked = field.value;
  
  const handleChange = (checked: boolean) => {
    setValue(checked);
  };
  
  return (
    <div className="mb-5" key={name}>
      <div className="flex flex-row-reverse items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="mr-3 text-gray-200 text-sm font-medium">
            {label}{required && <span className="text-red-500 mr-3">*</span>}
          </span>
          <Switch
            checked={isChecked}
            onChange={handleChange}
            className={`${
              isChecked ? 'bg-blue-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 mr-1 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span className="sr-only">{label}</span>
            <span
              className={`${
                isChecked ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1 text-right">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default function FormFileds({ fields }: FormFiledsProps) {

  const renderField = (field: FormField,index:number) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="mb-5" key={index}>
            <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={field.name}>
              {field.label}{field.required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Field
              type={field.type}
              name={field.name}
              id={field.name}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder={field.label}
            />
            <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1 text-right" />
          </div>
        );
        
      case 'checkbox':
      
        return (
          <div key={index} className=" flex justify-start">
            <HeadlessSwitch   name={field.name} label={field.label} required={field.required} />
          </div>
        )
        
      case 'number':
        return (
          <div className="mb-5" key={index}>
            <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={field.name}>
              {field.label}{field.required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Field
              type={field.type}
              name={field.name}
              id={field.name}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder={field.label}
            />
            <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1 text-right" />
          </div>
        );
        
      case 'textarea':
        return (
          <div className="mb-5" key={index}>
            <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={field.name}>
              {field.label}{field.required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Field
              as="textarea"
              name={field.name}
              id={field.name}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[100px]"
              placeholder={field.label}
            />
            <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1 text-right" />
          </div>
        );
      
      case 'select':
        return (
          <div className="mb-5" key={index}>
            <label className="block text-gray-200 text-sm font-medium mb-2 text-right" htmlFor={field.name}>
              {field.label}{field.required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Field
              as="select"
              name={field.name}
              id={field.name}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">انتخاب کنید</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Field>
            <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1 text-right" />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-y-1">
      {/* Dynamic form fields - همه زیر هم */}
      {fields?.map((field,index) => renderField(field,index))}
    </div>
  )
}

