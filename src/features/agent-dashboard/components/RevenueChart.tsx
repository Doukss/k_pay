import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatFcfa } from "@/shared/lib/format";
import type { MonthlyRevenue } from "../types";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Loyers attendus vs collectés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAttendu" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--muted-foreground)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--muted-foreground)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorCollecte" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border"
              />
              <XAxis
                dataKey="mois"
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value) => formatFcfa(value)}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? formatFcfa(value) : value
                }
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="attendu"
                stroke="var(--muted-foreground)"
                fill="url(#colorAttendu)"
                strokeWidth={2}
                name="Attendu"
              />
              <Area
                type="monotone"
                dataKey="collecte"
                stroke="var(--primary)"
                fill="url(#colorCollecte)"
                strokeWidth={2}
                name="Collecté"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
