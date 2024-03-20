import { useEffect, useState } from "react";
// import { NotificationAll } from "../../api/usersApi";

// const NotificationOfContract = () => {
//   NotificationAll()
//     .then((res) => {
//     })
//     .catch((err) => err
//     );
// };

const initialState = {
  // list: NotificationOfContract,
  list: [],
};

const quantityNotiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CONTRACT": {
      return state;
    }

    case "EDIT_CONTRACT": {
      return state;
    }

    default:
      return state;
  }
};

export default quantityNotiReducer;
