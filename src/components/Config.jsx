import { useConfigStore } from "../stores/config.store";
import { NETWORKS } from "../networksList";
import Card from "@/components/Card";

export const Config = () => {
  // Obtenemos el file y la network desde la store
  const file = useConfigStore((state) => state.file);
  const network = useConfigStore((state) => state.network);

  // Setters de la store
  const setFile = useConfigStore((state) => state.setFile);
  const setNetwork = useConfigStore((state) => state.setNetwork);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNetChange = (event) => {
    const netValue = NETWORKS.find((net) => net.name === event.target.value);
    setNetwork(netValue);
  };

  return (
    <Card title={"Configuración Wallets/Red"}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
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
                {net.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};
