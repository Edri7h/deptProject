import { createSlice } from "@reduxjs/toolkit";



// const initialState={
//     notifications:[],
    
//     isLoading:true,

// };


// const notificationSlice=createSlice({
//     name :"notification",
//     initialState,
//     reducers:{
//          setNotifications:(state,action)=>{
//             state.notifications = action.payload;
//             state.isLoading = false;
//         },

//         addNotification:(state,action)=>{
//          let exist= state.notifications.some((notification)=>notification.id===action.payload.id)
//          if(!exist){
//             state.notifications.unshift(action.payload);
//          }
//         }
//     }
    
// })


// export const {addNotification,setNotifications}=notificationSlice.actions;




const initialState = {
  notifications: [],
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationsLoading: (state,action) => {
      state.isLoading = action.payload;
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.isLoading = false;
    },

    addNotification: (state, action) => {
      const exists = state.notifications.some(
        (notification) => notification.id === action.payload.id
      );

      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    },

    setNotificationsError: (state) => {
      state.isLoading = false;
    },
    removeNotification: (state, action) => {
        state.notifications=state.notifications.filter(notification=>notification.id !==action.payload)
    },

    clearNotifications: (state) => {
      state.notifications = [],
      state.isLoading=false
    }
  },
});

export const {
  setNotifications,
  setNotificationsLoading,
  setNotificationsError,
  addNotification,
  removeNotification,
  clearNotifications
} = notificationSlice.actions;


export default notificationSlice.reducer;