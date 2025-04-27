import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput, ImageInput, ImageField } from 'react-admin';

export const CakeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Tên Bánh Kem" source="name" />
      <TextInput label="Mô tả" source="description" />
      <NumberInput label="Giá" source="price" />
      <ImageInput label="Hình ảnh" source="image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput label="Mã danh mục" source="category_id" />
    </SimpleForm>
  </Edit>
);
