import { useState, useEffect } from "react";
import Card from "@/components/Card";
import OperationHistory from "./OperationHistory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NETWORKS } from "../networksList";
import { useTrasactionStore } from "../stores/transaction.store";
import { Skeleton } from "@/components/ui/skeleton";
import { processFile } from "../utils";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_URL);

function TransactionForm() {
  const { toast } = useToast();
  const [totalTransfers, setTotalTransfers] = useState(0);

  //store
  const history = useTrasactionStore((state) => state.history);
  const setHistory = useTrasactionStore((state) => state.setHistory);
  const cleanHistory = useTrasactionStore((state) => state.cleanHistory);
  const savedHistory = useTrasactionStore((state) => state.savedHistory);

  //form
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

  //connect to socket
  useEffect(() => {
    socket.on("transactionUpdate", (transaction) => {
      setHistory(transaction);
    });

    return () => {
      socket.off("transactionUpdate");
    };
  }, []);

  // reset progress
  useEffect(() => {
    if (history.length > 0 && totalTransfers === history.length) {
      toast({
        title: "Operación Finalizada ✅",
        description: `${history.length} de ${totalTransfers}`,
      });

      handleClean();
    }
  }, [history]);

  //handler functions
  const handleNetChange = (event) => {
    const netValue = NETWORKS.find((net) => net.name == event.target.value);
    setNetwork(netValue);
  };

  const handleClean = () => {
    setTotalTransfers(0);
    cleanHistory();
  };

  const handleSubmit = async (event) => {
    handleClean();
    event.preventDefault();
    if (!walletsFile) {
      toast({
        title: "Por favor, cargue el archivo JSON de wallets! ⚠️",
        description: `No se encontro el archvio json`,
      });
      return;
    }

    try {
      const walletFile = await processFile(walletsFile);

      switch (transactionType) {
        case "oneToOne":
          setTotalTransfers(1);
          break;
        case "oneToMany":
          setTotalTransfers(Math.abs(receiverIdStart - receiverIdEnd) + 1);
          break;
        case "manyToOne":
          setTotalTransfers(Math.abs(senderIdStart - senderIdEnd) + 1);
          break;
        default:
          break;
      }

      let data = {
        type: transactionType,
        wallets: walletFile,
        rpcUrl: network.rpcUrl,
        chainId: network.chainId,
        senderId: senderId,
        receiverId: receiverId,
        senderIdStart: senderIdStart,
        senderIdEnd: senderIdEnd,
        receiverIdStart: receiverIdStart,
        receiverIdEnd: receiverIdEnd,
        amount: amount,
      };

      socket.emit("startTransaction", data);

      toast({
        title: "Operación en progreso ⌛",
        description: `Transacciones a realizar: [ ${totalTransfers} ]`,
      });
    } catch (error) {
      toast({
        title: "¡Error al intentar realizar la operación! ❌",
        description: error.message,
      });
    }
  };

  return (
    <Card title={"Hacer transaciones"}>
      <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4 '>
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

        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className='border h-[40px] px-2'
        >
          <option value='oneToOne'>Uno a Uno</option>
          <option value='oneToMany'>Uno a Muchos</option>
          <option value='manyToOne'>Muchos a Uno</option>
        </select>

        {transactionType === "oneToOne" && (
          <>
            <input
              type='number'
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder='ID del Emisor'
              className='border h-[40px] px-4'
              required
            />
            <input
              type='number'
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder='ID del Receptor'
              className='border h-[40px] px-4'
              required
            />
          </>
        )}

        {transactionType === "oneToMany" && (
          <>
            <input
              type='number'
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder='ID del Emisor'
              className='border h-[40px] px-4'
              required
            />
            <input
              type='number'
              value={receiverIdStart}
              onChange={(e) => setReceiverIdStart(e.target.value)}
              placeholder='Inicio de ID de Receptores'
              className='border h-[40px] px-4'
              required
            />
            <input
              type='number'
              value={receiverIdEnd}
              onChange={(e) => setReceiverIdEnd(e.target.value)}
              placeholder='Fin de ID de Receptores'
              className='border h-[40px] px-4'
              required
            />
          </>
        )}

        {transactionType === "manyToOne" && (
          <>
            <input
              type='number'
              value={senderIdStart}
              onChange={(e) => setSenderIdStart(e.target.value)}
              placeholder='Inicio de ID de Emisores'
              className='border h-[40px] px-4'
              required
            />
            <input
              type='number'
              value={senderIdEnd}
              onChange={(e) => setSenderIdEnd(e.target.value)}
              placeholder='Fin de ID de Emisores'
              className='border h-[40px] px-4'
              required
            />
            <input
              type='number'
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder='ID del Receptor'
              className='border h-[40px] px-4'
              required
            />
          </>
        )}

        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='Cantidad'
          step='0.01'
          className='border h-[40px] px-4'
          required
        />
        <input
          type='file'
          onChange={(e) => setWalletsFile(e.target.files[0])}
          required
        />

        {totalTransfers == history.length ? (
          <Button type='submit'>Enviar</Button>
        ) : (
          <Skeleton className='flex justify-center items-center w-full h-[40px] rounded-md'>
            {`Realizadas ${history.length} de ${totalTransfers}`}
          </Skeleton>
        )}
      </form>

      <div className='w-full mt-2'>
        {savedHistory.length > 0 && <OperationHistory />}
      </div>
    </Card>
  );
}

export default TransactionForm;

/*
toast({
  variant: transaction.status == "Error" ? "destructive" : "default",
  title: `Transacción a Wallet-ID: ${transaction.id} | ${
    transaction.status
  } ${transaction.status == "Success" && "✅"} `,
  description: `Hash: ${transaction.hash?.slice(0, 20) || "error"}...`,
});
*/
