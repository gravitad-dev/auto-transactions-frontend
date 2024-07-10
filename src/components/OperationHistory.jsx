import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useTrasactionStore } from "../stores/transaction.store";

function OperationHistory() {
  const savedHistory = useTrasactionStore((state) => state.savedHistory);
  const cleanSavedHistory = useTrasactionStore(
    (state) => state.cleanSavedHistory
  );

  const successCount = savedHistory.filter(
    (result) => result.status === "Success"
  ).length;
  const errorCount = savedHistory.filter(
    (result) => result.status === "Error"
  ).length;

  const sortedHistory = [...savedHistory].sort((a, b) => a.id - b.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          Ver Ultima Operación
        </Button>
      </DialogTrigger>

      <DialogContent className='flex flex-col w-[92%] max-w-[702px] min-h rounded-md border'>
        <DialogHeader>
          <DialogTitle>Historial</DialogTitle>
          <DialogDescription>
            Log de las últimas transacciones realizadas.{" "}
            <span>
              Correctas:
              {successCount}
            </span>
            <span className='ml-4'>Errores:{errorCount}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Log console */}
        <div className='flex flex-col'>
          <div className='flex flex-col bg-gray-800 gap-2 p-2 rounded-md  h-[600px] overflow-y-scroll'>
            {sortedHistory.map((result) => (
              <div
                key={result.id}
                className='bg-gray-700 rounded-sm p-2 text-white'
              >
                {result.status == "Success" ? (
                  <p className='bg-green-600 w-min px-2 rounded-md  font-semibold'>
                    {result.status}
                  </p>
                ) : (
                  <p className='bg-[#9E3030] w-min px-2 rounded-md  font-semibold'>
                    {result.status}
                  </p>
                )}
                <p>
                  <strong>ID:</strong> {result.id}
                </p>
                {result.hash && (
                  <p>
                    <strong>Hash:</strong>{" "}
                    <span className=' text-wrap break-words'>
                      {result.hash}
                    </span>
                  </p>
                )}

                {result.error && (
                  <p>
                    <strong>Error:</strong>{" "}
                    <span className=' text-wrap break-words'>
                      {result.error}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className='sm:justify-start'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => cleanSavedHistory()}
          >
            Borrar Historial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OperationHistory;
