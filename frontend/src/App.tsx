import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-blue-600">
        ⚛️ CodeCraft Frontend
      </h1>
      <Button>¡Hola, shadcn!</Button>
      <Button variant="outline">Botón secundario</Button>
    </div>
  );
}

export default App;