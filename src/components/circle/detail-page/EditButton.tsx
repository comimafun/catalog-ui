import EditIcon from '@/icons/EditIcon';
import React from 'react';

function EditButton() {
  return (
    <div className="flex h-8 items-center gap-1 rounded bg-warning px-2">
      <EditIcon width={16} height={16} />{' '}
      <span className="hidden font-semibold sm:inline">Edit</span>
    </div>
  );
}

export default EditButton;
