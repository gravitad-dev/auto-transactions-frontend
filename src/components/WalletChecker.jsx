import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { useToast } from "@/components/ui/use-toast";
import { NETWORKS } from "../networksList";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_URL);

function WalletChecker() {
  const [file, setFile] = useState(null);
  const [balances, setBalances] = useState([]);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const { toast } = useToast();

  useEffect(() => {
    socket.on("balanceUpdate", (balance) => {
      setBalances((prevBalances) => [...prevBalances, balance]);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !network.rpcUrl) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      setBalances([]);
      const fileText = await file.text();
      const wallets = JSON.parse(fileText);

      socket.emit("startBalanceCheck", {
        wallets: wallets,
        rpcUrl: network.rpcUrl,
        chainId: network.chainId,
        tokenName: network.tokenName,
      });

      toast({
        title: "Consulta de saldo realizada correctamente!",
        description: `Wallets consultadas: ${wallets.length}`,
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
      <div className='flex flex-col gap-16'>
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

          <Button type='submit'>Comprobar</Button>
        </form>

        <div className='flex flex-col gap-2 w-full max-h-[400px]'>
          <h3 className='font-semibold'>Saldo de las Billeteras:</h3>
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
