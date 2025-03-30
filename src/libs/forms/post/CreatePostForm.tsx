'use client';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import InnerCreatePostForm from '@/components/post/create/InnerCreateForm';
import { Category } from '@/libs/models/category';
import { FormField } from '@/libs/models/formFiled';
import { handleApiError } from '@/libs/helpers/errorHandler';
import { callApi } from '@/libs/helpers/callapi';

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
  allowChatMessages: boolean;
  location: {
    lat: number;
    lng: number;
  };
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
      .max(10, 'حداکثر 10 تصویر می‌توانید آپلود کنید')
      .test('fileFormat', 'فرمت فایل‌های تصویر نامعتبر است. فقط JPG، PNG و WebP پشتیبانی می‌شود', function(value) {
        if (!value || value.length === 0) return true;
        const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        return value.every(file => validFormats.includes(file.type));
      })
      .test('fileSize', 'حجم هر تصویر نباید بیشتر از 5 مگابایت باشد', function(value) {
        if (!value || value.length === 0) return true;
        const maxSize = 5 * 1024 * 1024; // 5MB
        return value.every(file => file.size <= maxSize);
      }),
    videos: Yup.array()
      .max(1, 'فقط یک ویدیو می‌توانید آپلود کنید')
      .test('fileFormat', 'فرمت فایل ویدیو نامعتبر است. فقط MP4، WebM و MOV پشتیبانی می‌شود', function(value) {
        if (!value || value.length === 0) return true;
        const validFormats = ['video/mp4', 'video/webm', 'video/quicktime'];
        return value.every(file => validFormats.includes(file.type));
      })
      .test('fileSize', 'حجم ویدیو نباید بیشتر از 100 مگابایت باشد', function(value) {
        if (!value || value.length === 0) return true;
        const maxSize = 100 * 1024 * 1024; // 100MB
        return value.every(file => file.size <= maxSize);
      })
      .test('videoDuration', 'مدت زمان ویدیو نباید بیشتر از 2 دقیقه باشد', async function(value) {
        if (!value || value.length === 0) return true;
        
        try {
          // برای هر فایل ویدیو، مدت زمان آن را بررسی می‌کنیم
          const checkDuration = async (file: File): Promise<boolean> => {
            return new Promise((resolve) => {
              const video = document.createElement('video');
              video.preload = 'metadata';
              
              video.onloadedmetadata = function() {
                URL.revokeObjectURL(video.src);
                resolve(video.duration <= 120); // حداکثر 2 دقیقه (120 ثانیه)
              };
              
              video.onerror = function() {
                URL.revokeObjectURL(video.src);
                resolve(false);
              };
              
              video.src = URL.createObjectURL(file);
            });
          };
          
          // بررسی تمام فایل‌های ویدیو
          const durationChecks = await Promise.all(value.map(checkDuration));
          return durationChecks.every(result => result);
        } catch (error) {
          return false;
        }
      }),
    province: Yup.string().required('لطفا استان را انتخاب کنید'),
    city: Yup.string().required('لطفا شهر را انتخاب کنید'),
    address: Yup.string()
      .max(500, 'آدرس نمی‌تواند بیشتر از 500 کاراکتر باشد')
      .test('address-validation', 'آدرس نمی‌تواند حاوی کاراکترهای خاص باشد', function(value) {
        if (!value) return true;
        // بررسی کاراکترهای غیرمجاز در آدرس
        const invalidChars = /[<>{}[\]]/g;
        return !invalidChars.test(value);
      }),
    location: Yup.object().shape({
      lat: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('موقعیت جغرافیایی (عرض) الزامی است')
        .min(-90, 'عرض جغرافیایی باید بین -90 و 90 باشد')
        .max(90, 'عرض جغرافیایی باید بین -90 و 90 باشد'),
      lng: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('موقعیت جغرافیایی (طول) الزامی است')
        .min(-180, 'طول جغرافیایی باید بین -180 و 180 باشد')
        .max(180, 'طول جغرافیایی باید بین -180 و 180 باشد')
    }),
    allowChatMessages: Yup.boolean(),
  };

  formFields.forEach((field) => {
    let fieldValidator;

    switch (field.type) {
      case 'text':
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(
            `لطفا ${field.label} را وارد کنید`,
          );
        }
        if (field.validation?.min) {
          fieldValidator = fieldValidator.min(
            field.validation.min,
            `فیلد ${field.label} باید حداقل ${field.validation.min} کاراکتر باشد`,
          );
        }
        if (field.validation?.max) {
          fieldValidator = fieldValidator.max(
            field.validation.max,
            `فیلد ${field.label} نمی‌تواند بیشتر از ${field.validation.max} کاراکتر باشد`,
          );
        }
        if (field.validation?.pattern) {
          fieldValidator = fieldValidator.matches(
            new RegExp(field.validation.pattern),
            `فرمت ${field.label} صحیح نیست`,
          );
        }
        // اضافه کردن ولیدیشن برای جلوگیری از تزریق کد مخرب
        fieldValidator = fieldValidator.test(
          'no-html', 
          `${field.label} نمی‌تواند شامل کدهای HTML باشد`, 
          value => !value || !/<[^>]*>/.test(value)
        );
        break;

      case 'checkbox':
        fieldValidator = Yup.boolean();
        if (field.required) {
          fieldValidator = fieldValidator.oneOf(
            [true],
            `لطفا ${field.label} را تایید کنید`,
          );
        }
        break;

      case 'textarea':
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(
            `لطفا ${field.label} را وارد کنید`,
          );
        }
        if (field.validation?.min) {
          fieldValidator = fieldValidator.min(
            field.validation.min,
            `${field.label} باید حداقل ${field.validation.min} کاراکتر باشد`,
          );
        }
        if (field.validation?.max) {
          fieldValidator = fieldValidator.max(
            field.validation.max || 2000,
            `${field.label} نمی‌تواند بیشتر از ${field.validation.max} کاراکتر باشد`,
          );
        }
        // اضافه کردن ولیدیشن برای جلوگیری از تزریق کد مخرب
        fieldValidator = fieldValidator.test(
          'no-dangerous-html', 
          `${field.label} نمی‌تواند شامل کدهای مخرب باشد`, 
          value => !value || !/<script|<iframe|javascript:/i.test(value)
        );
        break;

      case 'number':
        fieldValidator = Yup.number().typeError(
          `لطفا برای ${field.label} یک عدد معتبر وارد کنید`,
        );

        if (field.required) {
          fieldValidator = fieldValidator.required(
            `لطفا ${field.label} را وارد کنید`,
          );
        }

        if (field.validation?.min !== undefined) {
          fieldValidator = fieldValidator.min(
            field.validation.min,
            `مقدار ${field.label} باید حداقل ${field.validation.min} باشد`,
          );
        }
        if (field.validation?.max !== undefined) {
          fieldValidator = fieldValidator.max(
            field.validation.max,
            `مقدار ${field.label} نمی‌تواند بیشتر از ${field.validation.max} باشد`,
          );
        }
        // اضافه کردن ولیدیشن برای اعداد منطقی و جلوگیری از اعداد خیلی بزرگ
        fieldValidator = fieldValidator.test(
          'reasonable-number',
          `مقدار ${field.label} غیرمنطقی است`,
          value => !value || (value >= -1000000000 && value <= 1000000000)
        );
        break;

      case 'select':
        if (field.options && field.options.length > 0) {
          fieldValidator = Yup.string();
          if (field.required) {
            fieldValidator = fieldValidator
              .required(`لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`)
              .oneOf(
                field.options,
                `لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`,
              );
          } else {
            fieldValidator = fieldValidator.oneOf(
              [...field.options, ''],
              `لطفا یک گزینه معتبر برای ${field.label} انتخاب کنید`,
            );
          }
        } else {
          fieldValidator = Yup.string();
          if (field.required) {
            fieldValidator = fieldValidator.required(
              `لطفا ${field.label} را انتخاب کنید`,
            );
          }
        }
        break;

      case 'email':
        fieldValidator = Yup.string()
          .trim()
          .email(`لطفا یک آدرس ایمیل معتبر برای ${field.label} وارد کنید`);
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        break;

      case 'tel':
        fieldValidator = Yup.string()
          .trim()
          .matches(
            /^(0|\+98)9\d{9}$/,
            `لطفا یک شماره موبایل معتبر برای ${field.label} وارد کنید`
          );
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        break;

      case 'date':
        fieldValidator = Yup.date()
          .typeError(`لطفا یک تاریخ معتبر برای ${field.label} وارد کنید`);
        if (field.required) {
          fieldValidator = fieldValidator.required(`لطفا ${field.label} را وارد کنید`);
        }
        break;

      default:
        fieldValidator = Yup.string().trim();
        if (field.required) {
          fieldValidator = fieldValidator.required(
            `لطفا ${field.label} را وارد کنید`,
          );
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
      allowChatMessages:false,
      location: {
        lat:0,
        lng:0
      }
    };

    // Initialize all dynamic fields from the category
    if (props.category && props.category.formFields) {
      props.category.formFields.forEach((field) => {
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
      formData.append('province', values.province);
      formData.append('city', values.city);
      formData.append('allowChatMessages',String(values.allowChatMessages));;

      if (values.address) {
        formData.append('address', values.address);
      }

      // Add dynamic form fields
      const options:Record<string,any> = {};
      props.category.formFields.forEach((field) => {
        if (values[field.name] !== undefined && values[field.name] !== '') {
          if (field.type === 'number') {
            options[field.name] = values[field.name].toString();
          } else {
            options[field.name] = values[field.name];
          }
        }
      });
      
      // Add formFieldsData as JSON string to formData
      formData.append('options', JSON.stringify(options));

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
      console.log(formData);
      
      // Submit form data to API
      const res=await callApi.post('post/create',formData);
      console.log(res);
      
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false);
    }
  },
})(InnerCreatePostForm);

export default CreatePostForm;
