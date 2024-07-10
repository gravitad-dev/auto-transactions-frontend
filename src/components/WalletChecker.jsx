import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Card from "@/components/Card";
import { useToast } from "@/components/ui/use-toast";
import { NETWORKS } from "../networksList";
import { useWalletStore } from "../stores/wallet.store";
import { processFile } from "../utils";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_URL);

function WalletChecker() {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [totalWallets, setTotalWallets] = useState(0);

  //store
  const balances = useWalletStore((state) => state.balances);
  const setBalances = useWalletStore((state) => state.setBalances);
  const savedBalances = useWalletStore((state) => state.savedBalances);
  const cleanBalances = useWalletStore((state) => state.cleanBalances);
  const cleanSavedBalances = useWalletStore(
    (state) => state.cleanSavedBalances
  );

  //connect to socket
  useEffect(() => {
    socket.on("balanceUpdate", (balance) => {
      setBalances(balance);
    });

    return () => {
      socket.off("balanceUpdate");
    };
  }, []);

  // reset progress
  useEffect(() => {
    if (balances.length > 0 && totalWallets === balances.length) {
      toast({
        title: "Consulta Finalizada ✅",
        description: `${balances.length} de ${totalWallets}`,
      });

      handleClean();
    }
  }, [balances]);

  //handler functions
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNetChange = (event) => {
    const netValue = NETWORKS.find((net) => net.name == event.target.value);
    setNetwork(netValue);
  };

  const handleClean = () => {
    setTotalWallets(0);
    cleanBalances();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !network.rpcUrl) {
      toast({
        title: "Por favor, cargue el archivo JSON de wallets! ⚠️",
        description: `No se encontro el archvio json`,
      });
      return;
    }
    handleClean();

    try {
      const walletFile = await processFile(file);
      setTotalWallets(walletFile.length);

      socket.emit("startBalanceCheck", {
        wallets: walletFile,
        rpcUrl: network.rpcUrl,
        chainId: network.chainId,
        tokenName: network.tokenName,
      });

      toast({
        title: "Operación en progreso ⌛",
        description: `Consultando [ ${walletFile.length} ] wallet/s`,
      });
    } catch (error) {
      toast({
        title: "¡Error al intentar realizar la operación! ❌",
        description: error.message,
      });
    }
  };

  return (
    <Card title={"Comprobador de Saldo de Billeteras"}>
      <div className='flex flex-col gap-8'>
        {/* FORM  */}
        <form onSubmit={handleSubmit} className='flex flex-col w-full  gap-4'>
          <div className='flex flex-col gap-1'>
            <label>Archivo de Billeteras:</label>
            <input type='file' onChange={handleFileChange} />
          </div>

          <div className='flex flex-col gap-1'>
            <label>Network:</label>
            <select
              value={network.name}
              onChange={handleNetChange}
              className='border h-[40px] px-2'
            >
              {NETWORKS.map((net) => (
                <option key={net.name} value={net.name}>
                  {net.name}{" "}
                </option>
              ))}
            </select>
          </div>

          {balances.length == totalWallets ? (
            <Button type='submit'>Comprobar</Button>
          ) : (
            <Skeleton className='flex justify-center items-center w-full h-[40px] rounded-md'>
              Consultando {balances.length} de {totalWallets}
            </Skeleton>
          )}
        </form>

        {/* LOG CONSOLE */}
        <div className='flex flex-col gap-2 w-full max-h-[500px] md:max-h-[400px]'>
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold'>Saldo de billeteras</h3>

            <Button onClick={cleanSavedBalances} className='bg-[#9E3030]'>
              Borrar Historial
            </Button>
          </div>
          <div className='bg-gray-800 md:min-h-[400px] rounded-md flex flex-col gap-2 w-full text-white p-2 overflow-y-scroll'>
            {savedBalances.map((wallet) => (
              <div
                key={wallet.address}
                className=' bg-gray-700 rounded-sm p-2 '
              >
                <p>ID: {wallet.id}</p>
                <p>Address: {wallet.address}</p>
                <p>Balance: {wallet.balance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WalletChecker;
