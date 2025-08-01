import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  gradient: string;
  changeType: "positive" | "negative" | "neutral";
}

export default function StatsCard({ title, value, change, icon, gradient, changeType }: StatsCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-kpop-cyan";
    }
  };

  return (
    <div className="bg-dark-secondary rounded-xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className={`text-sm flex items-center mt-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1">{change}</span>
          </p>
        </div>
        <div className={`w-12 h-12 ${gradient} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
