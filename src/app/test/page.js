
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