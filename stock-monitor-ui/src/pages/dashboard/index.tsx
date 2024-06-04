import Navbar from "@/components/common/Navbar";
import UserSubscriptionsList from "@/components/stocks/Dashboard";

export default function Dashboard() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div className='rounded-lg border bg-background shadow-md w-full max-w-[90vw] h-[95vh] overflow-auto'>
        <div className='h-full flex-1 flex-col space-y-8 p-8 md:flex'>
          <div className='flex items-center justify-between space-y-2 '>
            <div className='flex flex-col w-2/3 gap-1'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Welcome back!
              </h2>
              <p className='text-muted-foreground'>
                Track investments, explore, & manage subscriptions. Stay
                informed, make smart decisions.
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Navbar />
            </div>
          </div>
          <UserSubscriptionsList />
        </div>{" "}
      </div>
    </main>
  );
}
