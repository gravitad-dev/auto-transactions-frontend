import { useEffect } from "react";
import Transaction from "@/components/Transaction";
import CreateWallets from "@/components/CreateWallets";
import WalletChecker from "@/components/WalletChecker";
import Card from "./components/Card";
import { Toaster } from "@/components/ui/toaster";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_URL);

//MAIN APP
function App() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACK_URL);

    socket.on("connect", () => {
      console.log("Conectado al servidor de sockets");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor de sockets");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-100/20 min-h-[100vh]'>
      <div className='col-span-1 md:col-span-3'>
        <Card></Card>
      </div>

      <div className='col-span-1'>
        <CreateWallets />
      </div>
      <div className='col-span-1 md:col-span-2 row-span-2 '>
        <WalletChecker />
      </div>
      <div className='col-span-1 row-span-1 '>
        <Transaction />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
