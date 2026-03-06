
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  changeValue?: string;
  changeType?: "increase" | "decrease" | "neutral";
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  changeValue,
  changeType = "neutral",
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("hover-scale card-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || changeValue) && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            {changeValue && (
              <span
                className={cn(
                  "mr-1 font-medium",
                  changeType === "increase" && "text-green-500",
                  changeType === "decrease" && "text-red-500"
                )}
              >
                {changeValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
