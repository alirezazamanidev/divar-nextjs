'use client'
import * as Yup from 'yup';
import { withFormik } from 'formik';
import InnerCreatePostForm from '@/components/post/create/InnerCreateForm';
import { Category } from '@/libs/models/category';
import { FormField } from '@/libs/models/formFiled';

interface CreatePostFormProps {
  category: Category;
}

interface CreatePostFormValues {
  title: string;
  description: string;
  images?: File[];
  videos?: File[];
  province: string;
  city: string;
  [key: string]: any;
}

// Create dynamic validation schema based on form fields
const createDynamicSchema = (formFields: FormField[]) => {
  const schemaFields: Record<string, any> = {
    title: Yup.string()
      .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
      .max(100, 'عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد')
      .trim()
      .required('عنوان الزامی است'),
    description: Yup.string()
      .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد')
      .max(2000, 'توضیحات نمی‌تواند بیشتر از 2000 کاراکتر باشد')
      .trim()
      .required('توضیحات الزامی است'),
    images: Yup.array()
      .max(10, 'حداکثر 10 تصویر می‌توانید آپلود کنید'),
    videos: Yup.array()
      .max(1, 'فقط یک ویدیو می‌توانید آپلود کنید'),
    province: Yup.string()
      .required('لطفا استان را انتخاب کنید'),
    city: Yup.string()
      .required('لطفا شهر را انتخاب کنید'),
  };

  formFields.forEach(field => {
    let fieldValidator;
    
    switch (field.type) {
      case 'text':
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        if (field.validation?.min) {
          fieldValidator = fieldValidator.min(
            field.validation.min, 
            `فیلد ${field.label} باید حداقل ${field.validation.min} کاراکتر باشد`
          );
        }
        if (field.validation?.max) {
          fieldValidator = fieldValidator.max(
            field.validation.max, 
            `فیلد ${field.label} نمی‌تواند بیشتر از ${field.validation.max} کاراکتر باشد`
          );
        }
        if (field.validation?.pattern) {
          fieldValidator = fieldValidator.matches(
            new RegExp(field.validation.pattern), 
            `فرمت ${field.label} صحیح نیست`
          );
        }
        break;
      
      case 'checkbox':
        fieldValidator = Yup.boolean();
        if (field.required) {
          fieldValidator = fieldValidator.oneOf([true], `لطفا ${field.label} را تایید کنید`);
        }
        break;
      
      case 'textarea':
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        if (field.validation?.min) {
          fieldValidator = fieldValidator.min(
            field.validation.min, 
            `${field.label} باید حداقل ${field.validation.min} کاراکتر باشد`
          );
        }
        if (field.validation?.max) {
          fieldValidator = fieldValidator.max(
            field.validation.max || 2000, 
            `${field.label} نمی‌تواند بیشتر از ${field.validation.max} کاراکتر باشد`
          );
        }
        break;
      
      case 'number':
        fieldValidator = Yup.number()
          .typeError(`لطفا برای ${field.label} یک عدد معتبر وارد کنید`);
          
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        
        if (field.validation?.min !== undefined) {
          fieldValidator = fieldValidator.min(
            field.validation.min,
            `مقدار ${field.label} باید حداقل ${field.validation.min} باشد`
          );
        }
        if (field.validation?.max !== undefined) {
          fieldValidator = fieldValidator.max(
            field.validation.max,
            `مقدار ${field.label} نمی‌تواند بیشتر از ${field.validation.max} باشد`
          );
        }
        break;
      case 'select':
        if (field.options && field.options.length > 0) {
          fieldValidator = Yup.string();
          if (field.required) {
            fieldValidator = fieldValidator
              .required(`لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`)
              .oneOf(field.options, `لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`);
          } else {
            fieldValidator = fieldValidator
              .oneOf([...field.options, ''], `لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`);
          }
        } else {
          fieldValidator = Yup.string();
          if (field.required) {
            fieldValidator = fieldValidator.required(`لطفا ${field.label} را انتخاب کنید`);
          }
        }
        break;
      
      default:
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
    }
    
    schemaFields[field.name] = fieldValidator;
  });

  return Yup.object().shape(schemaFields);
};

const CreatePostForm = withFormik<CreatePostFormProps, CreatePostFormValues>({
  mapPropsToValues: (props) => {
    // Start with the base fields
    const initialValues: CreatePostFormValues = {
      title: '',
      description: '',
      images: [],
      videos: [],
      province: '',
      city: '',
    };
    
    // Initialize all dynamic fields from the category
    if (props.category && props.category.formFields) {
      props.category.formFields.forEach(field => {
        // Set appropriate default values based on field type
        switch (field.type) {
          case 'number':
            initialValues[field.name] = '';
            break;
          case 'select':
            initialValues[field.name] = '';
            break;
          case 'textarea':
            initialValues[field.name] = '';
            break;
          case 'checkbox':
            initialValues[field.name] = false;
            break;
          case 'text':
            initialValues[field.name] = '';
          default:
            initialValues[field.name] = '';
            break;
        }
      });
    }
    
    return initialValues;
  },
  
  validationSchema: (props: CreatePostFormProps) => {
    return createDynamicSchema(props.category.formFields);
  },
  
  handleSubmit: async (values, { setSubmitting, props }) => {
    try {
      setSubmitting(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', props.category.id.toString());
      formData.append('provinceId', values.provinceId);
      formData.append('cityId', values.cityId);
      
      // Add dynamic form fields
      props.category.formFields.forEach(field => {
        if (values[field.name] !== undefined && values[field.name] !== '') {
          if (field.type === 'number') {
            formData.append(field.name, values[field.name].toString());
          } else {
            formData.append(field.name, values[field.name]);
          }
        }
      });
      
      // Add images
      if (values.images && values.images.length > 0) {
        values.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      // Add videos
      if (values.videos && values.videos.length > 0) {
        values.videos.forEach((video, index) => {
          formData.append(`videos[${index}]`, video);
        });
      }
      
      console.log('Form submitted with values:', values);
      
      // Submit form data to API
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) {
      //   throw new Error('خطا در ارسال اطلاعات');
      // }
      
      // const result = await response.json();
      // console.log('Post created:', result);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  }
})(InnerCreatePostForm);

export default CreatePostForm;