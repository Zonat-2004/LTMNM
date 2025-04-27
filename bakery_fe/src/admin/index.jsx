import { Admin, Resource } from 'react-admin';
import { CakeList } from './cakes/CakeList';
import { CakeCreate } from './cakes/CakeCreate';
import { CakeEdit } from './cakes/CakeEdit';
import { dataProvider } from './dataProvider';

// Tạo một Dashboard tùy chỉnh
const MyDashboard = () => {
  return <div>Chào mừng đến với trang Admin</div>;
};

export default function AdminApp() {
  return (
    <Admin dataProvider={dataProvider} dashboard={MyDashboard}>
      <Resource 
        name="cakes" 
        list={CakeList} 
        create={CakeCreate} 
        edit={CakeEdit}
        options={{ label: 'Bánh Kem' }}
      />
    </Admin>
  );
}
