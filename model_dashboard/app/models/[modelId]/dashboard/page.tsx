import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import RebelsRanking from "@/components/dashboard/rebels-ranking" // Added RebelsRanking import
import SecurityStatus from "@/components/dashboard/security-status"
import BracketsIcon from "@/components/icons/brackets"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import { notFound } from "next/navigation"

const mockData = mockDataJson as MockData

// Icon mapping
const iconMap = {
  gear: GearIcon,
  proccesor: ProcessorIcon,
  boom: BoomIcon,
}

// Model-specific configurations
const modelConfigs = {
  "deep-feed": {
    name: "DEEP FEED",
    handle: "@FEEDFRWD",
    description: "Advanced neural network for image classification",
    stats: [
      {
        label: "PARAMETERS",
        value: "25.6M",
        description: "DEEP FEED MODEL PARAMETERS",
        intent: "neutral" as const,
        icon: "boom",
        tag: "weights 💪🏾",
        tag1: "activation ⚡️ ReLU",
        tag2: "epochs 🔌 50",
        tag3: "batch 📦 64",
        tag4: "lr 🎯 0.0001",
        tag5: "dropout 🎲 0.3",
      },
      {
        label: "ACCURACY",
        value: "89.2%",
        description: "FINAL ACCURACY OF DEEP FEED",
        intent: "positive" as const,
        icon: "gear",
        direction: "up" as const,
      },
      {
        label: "FINAL LOSS",
        value: "0.245",
        description: "THE FINAL LOSS OF DEEP FEED",
        intent: "negative" as const,
        icon: "proccesor",
        direction: "down" as const,
      },
    ],
  },
  convulver: {
    name: "CONVULVER",
    handle: "@CONVONN",
    description: "Convolutional neural network specialist",
    stats: [
      {
        label: "PARAMETERS",
        value: "12.3M",
        description: "CONVULVER MODEL PARAMETERS",
        intent: "neutral" as const,
        icon: "boom",
        tag: "weights 💪🏾",
        tag1: "activation ⚡️ Swish",
        tag2: "epochs 🔌 30",
        tag3: "batch 📦 128",
        tag4: "lr 🎯 0.001",
        tag5: "dropout 🎲 0.25",
      },
      {
        label: "ACCURACY",
        value: "85.7%",
        description: "FINAL ACCURACY OF CONVULVER",
        intent: "positive" as const,
        icon: "gear",
        direction: "up" as const,
      },
      {
        label: "FINAL LOSS",
        value: "0.312",
        description: "THE FINAL LOSS OF CONVULVER",
        intent: "negative" as const,
        icon: "proccesor",
        direction: "down" as const,
      },
    ],
  },
  batchman: {
    name: "BATCHMAN",
    handle: "@BATCHNORMALIZED",
    description: "Batch normalization optimization expert",
    stats: [
      {
        label: "PARAMETERS",
        value: "8.9M",
        description: "BATCHMAN MODEL PARAMETERS",
        intent: "neutral" as const,
        icon: "boom",
        tag: "weights 💪🏾",
        tag1: "activation ⚡️ GELU",
        tag2: "epochs 🔌 25",
        tag3: "batch 📦 256",
        tag4: "lr 🎯 0.002",
        tag5: "dropout 🎲 0.15",
      },
      {
        label: "ACCURACY",
        value: "82.4%",
        description: "FINAL ACCURACY OF BATCHMAN",
        intent: "positive" as const,
        icon: "gear",
        direction: "up" as const,
      },
      {
        label: "FINAL LOSS",
        value: "0.398",
        description: "THE FINAL LOSS OF BATCHMAN",
        intent: "negative" as const,
        icon: "proccesor",
        direction: "down" as const,
      },
    ],
  },
}

interface ModelDashboardPageProps {
  params: {
    modelId: string
  }
}

export default function ModelDashboardPage({ params }: ModelDashboardPageProps) {
  const { modelId } = params
  const modelConfig = modelConfigs[modelId as keyof typeof modelConfigs]

  if (!modelConfig) {
    notFound()
  }

  return (
    <DashboardPageLayout
      header={{
        title: `${modelConfig.name} Dashboard`,
        description: modelConfig.description,
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {modelConfig.stats.map((stat, index) => (
          <DashboardStat
            key={index}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={iconMap[stat.icon as keyof typeof iconMap]}
            tag={stat.tag}
            intent={stat.intent}
            direction={stat.direction}
          />
        ))}
      </div>

      <div className="mb-6">
        <DashboardChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RebelsRanking rebels={mockData.rebelsRanking} />
        <SecurityStatus statuses={mockData.securityStatus} />
      </div>
    </DashboardPageLayout>
  )
}
