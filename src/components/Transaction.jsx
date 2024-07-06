import { useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NETWORKS = [
  {
    name: "Mumbai Testnet",
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    chainId: 80001,
    tokenName: "MATIC",
  },
  {
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    chainId: 1,
    tokenName: "ETH",
  },
];

function TransactionForm() {
  const [transactionType, setTransactionType] = useState("oneToOne");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [senderIdStart, setSenderIdStart] = useState("");
  const [senderIdEnd, setSenderIdEnd] = useState("");
  const [receiverIdStart, setReceiverIdStart] = useState("");
  const [receiverIdEnd, setReceiverIdEnd] = useState("");
  const [amount, setAmount] = useState("");
  const [walletsFile, setWalletsFile] = useState(null);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const { toast } = useToast();

  const handleNetChange = (event) => {
    const netValue = NETWORKS.find((net) => net.name == event.target.value);
    setNetwork(netValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!walletsFile) {
      alert("Por favor, sube el archivo de carteras.");
      return;
    }

    const formData = new FormData();
    formData.append("rpcUrl", network.rpcUrl);
    formData.append("chainId", network.chainId);
    formData.append("type", transactionType);

    if (transactionType === "oneToOne") {
      formData.append("senderId", senderId);
      formData.append("receiverId", receiverId);
    } else if (transactionType === "oneToMany") {
      formData.append("senderId", senderId);
      formData.append("receiverIdStart", receiverIdStart);
      formData.append("receiverIdEnd", receiverIdEnd);
    } else {
      formData.append("senderIdStart", senderIdStart);
      formData.append("senderIdEnd", senderIdEnd);
      formData.append("receiverId", receiverId);
    }

    formData.append("amount", amount);
    formData.append("walletsFile", walletsFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/transaction`, {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      //alert(result);
      toast({
        title: "Resultado de transacción:",
        description: result,
      });
    } catch (error) {
      //alert("Error al enviar la transacción: " + error.message);
      toast({
        title: "Error al enviar la transacción: ",
        description: error.message,
      });
    }
  };

  return (
    <Card title={"Hacer transaciones"}>
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 ">
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

        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="border h-[40px] px-2"
        >
          <option value="oneToOne">Uno a Uno</option>
          <option value="oneToMany">Uno a Muchos</option>
          <option value="manyToOne">Muchos a Uno</option>
        </select>

        {transactionType === "oneToOne" && (
          <>
            <input
              type="number"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="ID del Emisor"
              className="border h-[40px] px-4"
              required
            />
            <input
              type="number"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="ID del Receptor"
              className="border h-[40px] px-4"
              required
            />
          </>
        )}

        {transactionType === "oneToMany" && (
          <>
            <input
              type="number"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="ID del Emisor"
              className="border h-[40px] px-4"
              required
            />
            <input
              type="number"
              value={receiverIdStart}
              onChange={(e) => setReceiverIdStart(e.target.value)}
              placeholder="Inicio de ID de Receptores"
              className="border h-[40px] px-4"
              required
            />
            <input
              type="number"
              value={receiverIdEnd}
              onChange={(e) => setReceiverIdEnd(e.target.value)}
              placeholder="Fin de ID de Receptores"
              className="border h-[40px] px-4"
              required
            />
          </>
        )}

        {transactionType === "manyToOne" && (
          <>
            <input
              type="number"
              value={senderIdStart}
              onChange={(e) => setSenderIdStart(e.target.value)}
              placeholder="Inicio de ID de Emisores"
              className="border h-[40px] px-4"
              required
            />
            <input
              type="number"
              value={senderIdEnd}
              onChange={(e) => setSenderIdEnd(e.target.value)}
              placeholder="Fin de ID de Emisores"
              className="border h-[40px] px-4"
              required
            />
            <input
              type="number"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="ID del Receptor"
              className="border h-[40px] px-4"
              required
            />
          </>
        )}

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantidad"
          step="0.01"
          className="border h-[40px] px-4"
          required
        />
        <input
          type="file"
          onChange={(e) => setWalletsFile(e.target.files[0])}
          required
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Card>
  );
}

export default TransactionForm;
