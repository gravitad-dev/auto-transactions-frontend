import { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { useToast } from "@/components/ui/use-toast";

function CreateWallets() {
  const [numberOfWallets, setNumberOfWallets] = useState(10);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    setIsDownloading(true);

    fetch(`${import.meta.env.VITE_BACK_URL}/generateWallets?number=${numberOfWallets}`)
      .then((response) => {
        if (response.ok) return response.blob();
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wallets.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsDownloading(false);
      });
  };

  return (
    <Card title={"Generador de wallets"}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input
          type="number"
          value={numberOfWallets}
          onChange={(e) => setNumberOfWallets(e.target.value)}
          min="1"
          className="h-[40px] border px-2 w-full"
        />
        <Button onClick={handleCreate} className={"w-full"}>
          {isDownloading ? "Descargando..." : "Generar Wallets"}
        </Button>
      </div>
      {isDownloading ? (
        <p className="h-[14px]">Descargando wallets...</p>
      ) : (
        <p className="h-[14px]"> </p>
      )}
    </Card>
  );
}

export default CreateWallets;
