import simpleRestProvider from 'ra-data-simple-rest';

// Đảm bảo rằng URL này là đúng đường dẫn tới API của Django
const apiUrl = 'http://localhost:8000/api'; // Đảm bảo đúng đường dẫn API

export const dataProvider = simpleRestProvider(apiUrl);
