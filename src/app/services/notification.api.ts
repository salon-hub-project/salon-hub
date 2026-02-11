import api from "./axios";

export const notificationApi = {
    getAllNotifications: async()=> {
        try{
            const res= await api.get('/appointment/notifications');
            return res.data;
        }
        catch(error: any){
           console.log(error);
        }
    },

    getAllStaffNotifications: async() => {
        try{
            const res = await api.get('/appointment/staffnotifications');
            return res.data;
        }
        catch(error: any){
            console.log(error);
        }
    }
}