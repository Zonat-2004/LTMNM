import React from 'react';
import { Create, SimpleForm, TextInput, NumberInput, ImageInput, ImageField } from 'react-admin';

export const CakeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Tên Bánh Kem" source="name" />
      <TextInput label="Mô tả" source="description" />
      <NumberInput label="Giá" source="price" />
      <ImageInput label="Hình ảnh" source="image" accept="image/*" />
      <TextInput label="Mã danh mục" source="category_id" />
    </SimpleForm>
  </Create>
);
