import React from 'react';

type Props = {
  title?: string;
  message?: string;
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<Props> = ({ title = 'Confirm', message = 'Are you sure?', open, loading, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => { if (!loading) onCancel(); }}></div>
      <div className="bg-white rounded-lg shadow-lg p-4 z-10 w-full max-w-sm mx-4 h-full md:h-auto overflow-auto md:overflow-visible">
        <h4 className="text-lg font-bold mb-2">{title}</h4>
        <div className="mb-4 text-sm text-gray-700">{message}</div>
        <div className="flex flex-col md:flex-row justify-end gap-3">
          <button className="px-3 py-3 rounded border w-full md:w-auto text-center" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="px-3 py-3 rounded bg-red-600 text-white w-full md:w-auto text-center" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
