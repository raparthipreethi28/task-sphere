export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName
}) {

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg w-80">

        <h2 className="text-lg font-semibold mb-3">
          Delete User
        </h2>

        <p className="text-sm mb-4">
          Are you sure you want to delete {userName}?
        </p>

        <div className="flex justify-end gap-2">

          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}