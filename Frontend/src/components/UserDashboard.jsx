import Navbar from "./Navbar";

function UserDashboard(){
      return(
            <><Navbar/>
            <div className='w-full min-h-[100vh] pt-[100px] flex flex-col  items-center bg-[#fff9f6]'>
                  
            <h1 className='text-3xl font-bold text-gray-800'>User Dashboard</h1>
            </div>
            </>
      )
}
export default UserDashboard;