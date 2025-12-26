// services/profile.api.ts
// import api from './axios';

import api from "./axios";

// import api from "./axios";

export interface CreateProfilePayload {
  salonName: string;
  ownerName: string;
  salonImage: File;
}

// export const profileApi = {
//   createProfile: async (payload: CreateProfilePayload) => {
//     const formData = new FormData();

//     formData.append('salonName', payload.salonName);
//     formData.append('ownerName', payload.ownerName);
//     formData.append('salonImage', payload.salonImage);

//     // Debug: Log FormData contents (for development only)
//     if (process.env.NODE_ENV === 'development') {
//       console.log('FormData contents:');
//       console.log('salonName:', payload.salonName);
//       console.log('ownerName:', payload.ownerName);
//       console.log('salonImage:', payload.salonImage instanceof File ? payload.salonImage.name : 'Not a File');
//     }

//     // ❌ DO NOT set Content-Type manually
//     // Axios will automatically switch to multipart/form-data
//     const res = await api.post('/profile/create', formData);

//     return res.data;
//   },
// };


export const profileApi = {
  createProfile: async (formData: FormData) => {
    const res = await api.post('/profile/create', formData);
    return res.data;
  },
};
