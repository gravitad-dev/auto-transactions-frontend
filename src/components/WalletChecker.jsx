import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Card from "@/components/Card";
import { useToast } from "@/components/ui/use-toast";
import { NETWORKS } from "../networksList";
import { useWalletStore } from "../stores/wallet.store";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_URL);

function WalletChecker() {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [totalWallets, setTotalWallets] = useState(0);

  const balances = useWalletStore((state) => state.balances);
  const setBalance = useWalletStore((state) => state.setBalance);
  const cleanBalance = useWalletStore((state) => state.cleanBalance);

  useEffect(() => {
    socket.on("balanceUpdate", (balance) => {
      setBalance(balance);
    });

    return () => {
      socket.off("balanceUpdate");
    };
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNetChange = (event) => {
    const netValue = NETWORKS.find((net) => net.name == event.target.value);
    setNetwork(netValue);
  };

  const handleClean = () => {
    setTotalWallets(0);
    cleanBalance(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !network.rpcUrl) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setTotalWallets(0);
    cleanBalance(0);

    try {
      const fileText = await file.text();
      const walletFile = JSON.parse(fileText);
      setTotalWallets(walletFile.length);

      socket.emit("startBalanceCheck", {
        wallets: walletFile,
        rpcUrl: network.rpcUrl,
        chainId: network.chainId,
        tokenName: network.tokenName,
      });

      toast({
        title: "Consulta de saldo realizada correctamente!",
        description: `Wallets consultadas: ${walletFile.length}`,
      });
    } catch (error) {
      toast({
        title: "Error al enviar la solicitud:",
        description: error.message,
      });
    }
  };

  return (
    <Card title={"Comprobador de Saldo de Billeteras"}>
      <div className='flex flex-col gap-8'>
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

        <div className='flex flex-col gap-2 w-full max-h-[400px]'>
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold'>Saldo de las Billeteras:</h3>

            <div className='flex items-center gap-3'>
              <p>En caso de error </p>
              <Button onClick={handleClean} className='bg-[#9E3030]'>
                Reset
              </Button>
            </div>
          </div>
          <div className='bg-gray-800 min-h-[368px] rounded-md flex flex-col gap-2 w-full text-white p-2 overflow-y-scroll'>
            {balances.map((wallet) => (
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
