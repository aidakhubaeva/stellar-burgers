import { useState } from 'react';

type FormValues = { [key: string]: string };

export function useForm<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  return { values, handleChange, setValues };
}
