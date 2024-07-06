import { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { useToast } from "@/components/ui/use-toast";
import { NETWORKS } from "../networksList";

/*
const resBalances = [
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
  { id: 1, address: "0x34234234gf234453g32134123414", balance: 0.2 },
];
*/

function WalletChecker() {
  const [file, setFile] = useState(null);
  const [balances, setBalances] = useState([]);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const { toast } = useToast();

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

    const formData = new FormData();
    formData.append("wallets", file);
    formData.append("rpcUrl", network.rpcUrl);
    formData.append("chainId", network.chainId);
    formData.append("tokenName", network.tokenName);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/checkBalances`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const resBalances = await response.json();
        // Aquí puedes mostrar los balances en la interfaz de usuario
        setBalances(resBalances);
      } else {
        toast({
          title: "Hubo un error al enviar la solicitud.",
          description: "",
        });
      }
    } catch (error) {
      toast({
        title: "Error al enviar la solicitud:",
        description: error.message,
      });
    }
  };

  return (
    <Card title={"Comprobador de Saldo de Billeteras"}>
      <div className="flex flex-col gap-16">
        <form onSubmit={handleSubmit} className="flex flex-col w-full  gap-4">
          <div className="flex flex-col gap-1">
            <label>Archivo de Billeteras:</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label>Network:</label>
            <select
              value={network.name}
              onChange={handleNetChange}
              className="border h-[40px] px-2"
            >
              {NETWORKS.map((net) => (
                <option key={net.name} value={net.name}>
                  {net.name}{" "}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit">Comprobar</Button>
        </form>

        <div className="flex flex-col w-full gap-2 max-h-[400px]">
          <h3 className="font-semibold">Saldo de las Billeteras:</h3>
          <div className="bg-gray-800 min-h-[200px] rounded-md flex flex-col gap-2 w-full text-white p-2 overflow-y-scroll">
            {balances.map((wallet) => (
              <div key={wallet.id} className=" bg-gray-700 rounded-sm p-2 ">
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
