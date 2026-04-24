import MachineDetails from '@/app/components/MachineDetails'
import SensorReadings from '@/app/components/SensorReadings'
import MaintenanceHistory from '@/app/components/MaintenanceHistory'
import AlertsList from '@/app/components/AlertsList'
import PredictionView from '@/app/components/PredictionView'
import MaintenancePlanner from '@/app/components/MaintenancePlanner'

export default function MachinePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <MachineDetails machineId={params.id} />
      <div className="grid grid-cols-2 gap-4 mt-8">
        <SensorReadings machineId={params.id} />
        <AlertsList machineId={params.id} />
        <MaintenanceHistory machineId={params.id} />
        <PredictionView machineId={params.id} />
      </div>
      <div className="mt-8">
        <MaintenancePlanner machineId={params.id} />
      </div>
    </div>
  )
}

