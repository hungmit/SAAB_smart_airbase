import { useGameState } from "@/hooks/useGameState";
import { TopBar } from "@/components/game/TopBar";
import { BaseOverview } from "@/components/game/BaseOverview";
import { EventLog } from "@/components/game/EventLog";
import { ResourcePanel } from "@/components/game/ResourcePanel";
import { AIAgent } from "@/components/game/AIAgent";
import { toast } from "sonner";

const Index = () => {
  const { state, advanceTurn, startMaintenance, sendOnMission, getResourceSummary, resetGame } = useGameState();

  const handleStartMaintenance = (baseId: string, aircraftId: string) => {
    const base = state.bases.find((b) => b.id === baseId);
    if (!base) return;
    if (base.maintenanceBays.occupied >= base.maintenanceBays.total) {
      toast.error("Alla underhållsplatser är upptagna!");
      return;
    }
    startMaintenance(baseId, aircraftId);
    toast.success(`Underhåll påbörjat på ${aircraftId}`);
  };

  const handleSendMission = (baseId: string, aircraftId: string) => {
    sendOnMission(baseId, aircraftId, "DCA");
    toast.success(`${aircraftId} skickad på DCA-uppdrag`);
  };

  return (
    <div className="flex flex-col h-screen bg-background scanline">
      <TopBar state={state} onAdvanceTurn={advanceTurn} onReset={resetGame} />

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">
        {/* Main content */}
        <div className="overflow-y-auto p-4 space-y-4">
          {state.bases.map((base) => (
            <BaseOverview
              key={base.id}
              base={base}
              onSelectAircraft={() => {}}
              onStartMaintenance={handleStartMaintenance}
              onSendMission={handleSendMission}
            />
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EventLog events={state.events} />
            <ResourcePanel bases={state.bases} />
          </div>
        </div>

        {/* AI Agent sidebar */}
        <div className="border-l border-border h-full hidden lg:flex flex-col">
          <AIAgent getResourceSummary={getResourceSummary} />
        </div>
      </div>
    </div>
  );
};

export default Index;
