import User from "./models/user.model.js";


const socketHandler = (io)=>{
      io.on('connection',(socket)=>{
            socket.on('identity',async({userId})=>{
                  try {
                       const user = await User.findByIdAndUpdate(userId,{socketId:socket.id,isOnline:true},{new:true});
                      

                  }catch(err){
                        console.log(`error while setting socketid for user ${err}`);
                  }
            }) 
      })
       io.on('disconnect',()=>{
            
            socket.on('identity',async()=>{
                  try {
                        await User.findOneAndUpdate({socketId:socket.id},{socketId:null ,isOnline:false});
                  }catch(err){
                        console.log(`error while disconnect for user ${err}`);
                  }
            }) 
      })
}

export {socketHandler}