import React from 'react';
import { List, Datagrid, TextField, NumberField, ImageField, EditButton, DeleteButton, ReferenceField } from 'react-admin';
export const CakeList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="price" />
      <ImageField source="image" />
      <ReferenceField source="category_id" reference="categories">
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

