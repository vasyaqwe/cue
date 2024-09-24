export type PresenceEvent =
   | {
        type: "user_online"
        userId: string
     }
   | {
        type: "user_offline"
        userId: string
     }
   | {
        type: "online_users"
        onlineUsers: string[]
     }
   | {
        type: "get_online_users"
     }
