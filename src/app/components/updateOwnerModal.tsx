'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { useAppDispatch } from '@/app/store/hooks';
import { updateOwner } from '@/app/store/slices/ownerSlice';
import { Owner } from '@/app/services/owner.api';

interface UpdateOwnerFormValues {
  ownerName: string;
  salonImage: File | null;
}

interface Props {
  owner: any;
  onClose: () => void;
}

const UpdateOwnerSchema = Yup.object({
  ownerName: Yup.string().required('Owner name required'),
});

const UpdateOwnerModal = ({ owner, onClose }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Owner</h2>

        <Formik<UpdateOwnerFormValues>
          initialValues={{
            ownerName: owner.ownerName || '',
            salonImage: null,
          }}
          validationSchema={UpdateOwnerSchema}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append('ownerName', values.ownerName);

            if (values.salonImage) {
              formData.append('salonImage', values.salonImage);
            }

            dispatch(
              updateOwner({
                ownerId: owner._id,
                formData,
              })
            );

            onClose();
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <Input
                label="Owner Name"
                name="ownerName"
                value={values.ownerName}
                onChange={(e) =>
                  setFieldValue('ownerName', e.target.value)
                }
                error={touched.ownerName ? errors.ownerName : undefined}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue(
                    'salonImage',
                    e.currentTarget.files?.[0] || null
                  )
                }
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateOwnerModal;
