
// import useConfirmationToast from "@/app/hooks/useConfirmationToast";

// <button
// className="btn btn-sm btn-danger"
// onClick={() => handleDeleteGroup(group.id)}
// >
// Delete
// </button>


// const handleDeleteGroup = (groupId) => {
//     showConfirmationToast([groupId]);
//   };

//   const handleConfirmDelete = async (groupId) => {
//     try {
//       const formData = new FormData();
//       formData.append("group_id", groupId);
//       formData.append("request_action", "accept");

//       const response = await api.post("/api/delete-group", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.code == "200") {
//         toast.success(response.data.message);
//         setMyGroups((prevGroups) =>
//           prevGroups.filter((group) => group.id !== groupId)
//         );
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Error deleting group");
//     }
//   };

//   const { showConfirmationToast } = useConfirmationToast({
//     message: 'Are you sure you want to delete this group?',
//     onConfirm: handleConfirmDelete,
//     onCancel: () => toast.dismiss(),
//     confirmText: 'Delete',
//     cancelText: 'Cancel',
//   });



// import { toast } from 'react-toastify';

// const useConfirmationToast = ({ message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
//   const showConfirmationToast = (values = []) => {
//     const toastId = toast(
//       <div>
//         <p>{message}</p>
//         <div className="d-flex justify-content-between">
//           <button
//             className="btn btn-secondary"
//             onClick={() => handleCancel(toastId, values)}
//           >
//             {cancelText}
//           </button>
//           <button
//             className="btn btn-danger"
//             onClick={() => handleConfirm(toastId, values)}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>,
//       {
//         position: 'top-center',
//         autoClose: false,
//         closeButton: false,
//         draggable: false,
//         progress: undefined,
//       }
//     );
//   };

//   const handleConfirm = (toastId, values) => {
//     onConfirm(values);
//     toast.dismiss(toastId);
//   };

//   const handleCancel = (toastId, values) => {
//     onCancel(values);
//     toast.dismiss(toastId);
//   };

//   return { showConfirmationToast };
// };

// export default useConfirmationToast;