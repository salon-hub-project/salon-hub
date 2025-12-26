
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createProfile } from '../../../store/slices/profileSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AuthGuard from '../../../components/AuthGuard';

const CreateProfile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);


  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [salonImage, setSalonImage] = useState(null);

  

  // const handleSubmit = async () => {
  //   if (!salonName || !salonImage) return;

  //   await dispatch(
  //     createProfile({
  //       salonName,
  //       ownerName,
  //       salonImage,
  //     })
  //   );

  //   router.push('/profile');
  // };
  const handleSubmit = async () => {
    if (!salonName || !salonImage || !ownerName) return;
  
    const formData = new FormData();
    formData.append('salonName', salonName);
    formData.append('ownerName', ownerName);
    formData.append('salonImage', salonImage);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1],"form data");
    }
  
    await dispatch(createProfile(formData));
  
    router.push('/profile');
  };
  

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Profile</h1>

        <div className="space-y-4">
          <Input
            label="Salon Name"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            placeholder="Enter salon name"
          />

          <Input
            label="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter owner name"
          />

          <div>
            <label className="text-sm font-medium">Salon Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSalonImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm"
            />
          </div>

          <Button
            onClick={handleSubmit}
            
            className="w-full"
          >
            Create Profile
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CreateProfile;

