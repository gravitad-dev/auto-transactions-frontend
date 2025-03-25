import { useEffect } from "react";
import Transaction from "@/components/Transaction";
import CreateWallets from "@/components/CreateWallets";
import WalletChecker from "@/components/WalletChecker";
import Card from "./components/Card";
import { Toaster } from "@/components/ui/toaster";
import io from "socket.io-client";
import { Config } from "./components/Config";

//MAIN APP
function App() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACK_URL);

    socket.on("connect", () => {
      console.log("Conectado al servidor");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative flex justify-center items-start md:items-center p-4 md:py-2  w-full h-[100vh] overflow-y-scroll bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4  max-w-[1500px]">
        <div className="flex lg:hidden col-span-1 lg:col-span-3">
          <h1 className="text-3xl font-semibold">Autransaction</h1>
          <p className="pl-2">v1.2</p>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <Config />
        </div>

        <div className="col-span-1 lg:col-span-3">
          <CreateWallets />
        </div>

        <div className="col-span-1 lg:col-span-2 row-span-2">
          <Transaction />
        </div>
        <div className="col-span-1 lg:col-span-4 row-span-2">
          <WalletChecker />
        </div>
      </div>

      <div className="absolute bottom-1 right-2 bg-gray-100 flex justify-center items-center">
        <p className="text-sm text-gray-500">Autransaction v1.2</p>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
